import { NextRequest, NextResponse } from 'next/server';
import Anthropic from '@anthropic-ai/sdk';
import { db } from '@/lib/db';
import { companies, researchHistory } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';
import { buildFaviconUrl } from '@/lib/company-logo';
import {
  RESEARCH_SYSTEM_PROMPT,
  RESEARCH_USER_PROMPT,
  RESEARCH_RERESEARCH_PROMPT,
  RESEARCHABLE_FIELDS,
} from '@/lib/research-prompt';

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

// claude-sonnet-4-6 pricing (per million tokens)
const STANDARD_INPUT_PER_M = 3.00;
const STANDARD_OUTPUT_PER_M = 15.00;
const CACHE_WRITE_PER_M = 3.75;
const CACHE_READ_PER_M = 0.30;

function calcCost(
  inputTokens: number,
  outputTokens: number,
  cacheReadTokens: number,
  cacheWriteTokens: number,
): string {
  // input_tokens from the API = non-cached standard input (excludes cache reads/writes)
  const cost =
    (inputTokens / 1_000_000) * STANDARD_INPUT_PER_M +
    (outputTokens / 1_000_000) * STANDARD_OUTPUT_PER_M +
    (cacheWriteTokens / 1_000_000) * CACHE_WRITE_PER_M +
    (cacheReadTokens / 1_000_000) * CACHE_READ_PER_M;
  return cost.toFixed(4);
}

function buildFieldRefreshDates(
  researchData: Record<string, unknown>,
  targetFields: readonly string[],
  existingDatesJson: string | null,
  today: string,
): Record<string, string> {
  const existing: Record<string, string> = existingDatesJson
    ? JSON.parse(existingDatesJson)
    : {};

  const updated = { ...existing };
  for (const field of targetFields) {
    const val = researchData[field];
    if (val !== null && val !== undefined) {
      updated[field] = today;
    }
  }
  return updated;
}

export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const [company] = await db.select().from(companies).where(eq(companies.id, id));
  if (!company) return NextResponse.json({ error: 'Not found' }, { status: 404 });

  const body = await req.json().catch(() => ({})) as Record<string, unknown>;
  const isReresearch = body.reresearch === true;

  // Determine which fields to target for re-research
  let staleFields: string[] = [];
  let userPrompt: string;

  if (isReresearch) {
    const ninetyDaysAgo = new Date();
    ninetyDaysAgo.setDate(ninetyDaysAgo.getDate() - 90);

    const refreshDates: Record<string, string> = company.field_refresh_dates
      ? JSON.parse(company.field_refresh_dates)
      : {};

    staleFields = RESEARCHABLE_FIELDS.filter((field) => {
      const d = refreshDates[field];
      return !d || new Date(d) < ninetyDaysAgo;
    });

    if (staleFields.length === 0) {
      return NextResponse.json({
        success: false,
        upToDate: true,
        message: 'All fields were refreshed within the last 90 days — nothing to re-research.',
      });
    }

    userPrompt = RESEARCH_RERESEARCH_PROMPT(
      company.company_name,
      company.website || '',
      staleFields,
    );
  } else {
    userPrompt = RESEARCH_USER_PROMPT(company.company_name, company.website || '');
  }

  let status: 'success' | 'failed' = 'failed';
  let errorMessage: string | undefined;
  let researchData: Record<string, unknown> = {};
  let fieldConfidence: Record<string, string> = {};
  let inputTokens = 0;
  let outputTokens = 0;
  let cacheReadTokens = 0;
  let cacheWriteTokens = 0;

  try {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const response = await (client.messages.create as any)({
      model: 'claude-sonnet-4-6',
      max_tokens: 4500,
      system: [
        {
          type: 'text',
          text: RESEARCH_SYSTEM_PROMPT,
          cache_control: { type: 'ephemeral' },
        },
      ],
      tools: [
        {
          type: 'web_search_20250305',
          name: 'web_search',
          cache_control: { type: 'ephemeral' },
        },
      ],
      messages: [{ role: 'user', content: userPrompt }],
    });

    inputTokens = response.usage?.input_tokens ?? 0;
    outputTokens = response.usage?.output_tokens ?? 0;
    cacheReadTokens = response.usage?.cache_read_input_tokens ?? 0;
    cacheWriteTokens = response.usage?.cache_creation_input_tokens ?? 0;

    let rawJson = '';
    for (const block of response.content) {
      if (block.type === 'text') rawJson = block.text;
    }

    const fenceMatch = rawJson.match(/```(?:json)?\s*([\s\S]*?)```/);
    if (fenceMatch) rawJson = fenceMatch[1];
    rawJson = rawJson.trim();

    const parsed = JSON.parse(rawJson) as Record<string, unknown>;

    // Extract and remove field_confidence from the flat fields
    fieldConfidence = (parsed.field_confidence as Record<string, string>) ?? {};
    delete parsed.field_confidence;
    researchData = parsed;
    status = 'success';
  } catch (err) {
    errorMessage = err instanceof Error ? err.message : 'Research failed';
    console.error('Research pipeline error:', err);
  }

  const cost = calcCost(inputTokens, outputTokens, cacheReadTokens, cacheWriteTokens);

  await db.insert(researchHistory).values({
    company_id: id,
    company_name: company.company_name,
    status,
    estimated_cost_usd: cost,
    input_tokens: inputTokens || null,
    output_tokens: outputTokens || null,
    cache_read_tokens: cacheReadTokens || null,
    cache_write_tokens: cacheWriteTokens || null,
    run_type: 'single',
    error_message: errorMessage ?? null,
  });

  if (status === 'failed') {
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }

  const today = new Date().toISOString().split('T')[0];
  const targetFields = isReresearch ? staleFields : RESEARCHABLE_FIELDS;
  const fieldRefreshDates = buildFieldRefreshDates(
    researchData,
    targetFields,
    company.field_refresh_dates,
    today,
  );

  // Attach confidence_scores and field_refresh_dates so clients can save them in a single PUT
  researchData.confidence_scores = JSON.stringify(fieldConfidence);
  researchData.field_refresh_dates = JSON.stringify(fieldRefreshDates);

  // Cache favicon URL from website (use research result if available, else existing)
  const websiteForFavicon = (researchData.website as string | undefined) || company.website;
  const faviconUrl = buildFaviconUrl(websiteForFavicon);
  if (faviconUrl) {
    await db.update(companies).set({ logo_url: faviconUrl, updated_at: new Date() }).where(eq(companies.id, id));
    researchData.logo_url = faviconUrl;
  }

  return NextResponse.json({
    success: true,
    data: researchData,
    confidence: fieldConfidence,
    staleFields: isReresearch ? staleFields : null,
    meta: {
      inputTokens,
      outputTokens,
      cacheReadTokens,
      cacheWriteTokens,
      cost,
    },
  });
}

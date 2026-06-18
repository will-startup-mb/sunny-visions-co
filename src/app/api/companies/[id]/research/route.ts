import { NextRequest, NextResponse } from 'next/server';
import Anthropic from '@anthropic-ai/sdk';
import { db } from '@/lib/db';
import { companies, researchHistory } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';
import { RESEARCH_SYSTEM_PROMPT, RESEARCH_USER_PROMPT } from '@/lib/research-prompt';

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

// claude-sonnet-4-6 pricing (per million tokens)
const INPUT_COST_PER_M = 3.00;
const OUTPUT_COST_PER_M = 15.00;

function calcCost(inputTokens: number, outputTokens: number): string {
  const cost = (inputTokens / 1_000_000) * INPUT_COST_PER_M
             + (outputTokens / 1_000_000) * OUTPUT_COST_PER_M;
  return cost.toFixed(4);
}

export async function POST(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const [company] = await db.select().from(companies).where(eq(companies.id, id));
  if (!company) return NextResponse.json({ error: 'Not found' }, { status: 404 });

  let status: 'success' | 'failed' = 'failed';
  let errorMessage: string | undefined;
  let researchData: unknown;
  let inputTokens = 0;
  let outputTokens = 0;

  try {
    const response = await client.messages.create({
      model: 'claude-sonnet-4-6',
      max_tokens: 4096,
      system: RESEARCH_SYSTEM_PROMPT,
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      tools: [{ type: 'web_search_20250305', name: 'web_search' }] as any,
      messages: [{ role: 'user', content: RESEARCH_USER_PROMPT(company.company_name, company.website || '') }],
    });

    inputTokens = response.usage.input_tokens;
    outputTokens = response.usage.output_tokens;

    let rawJson = '';
    for (const block of response.content) {
      if (block.type === 'text') rawJson = block.text;
    }

    const fenceMatch = rawJson.match(/```(?:json)?\s*([\s\S]*?)```/);
    if (fenceMatch) rawJson = fenceMatch[1];
    rawJson = rawJson.trim();

    researchData = JSON.parse(rawJson);
    status = 'success';
  } catch (err) {
    errorMessage = err instanceof Error ? err.message : 'Research failed';
    console.error('Research pipeline error:', err);
  } finally {
    await db.insert(researchHistory).values({
      company_id: id,
      company_name: company.company_name,
      status,
      estimated_cost_usd: calcCost(inputTokens, outputTokens),
      input_tokens: inputTokens || null,
      output_tokens: outputTokens || null,
      error_message: errorMessage ?? null,
    });
  }

  if (status === 'failed') {
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
  return NextResponse.json({ success: true, data: researchData });
}

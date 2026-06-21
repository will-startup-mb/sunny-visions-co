import { NextRequest, NextResponse } from 'next/server';
import Anthropic from '@anthropic-ai/sdk';
import { db } from '@/lib/db';
import { batchJobs, companies, researchHistory } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';
import { RESEARCHABLE_FIELDS } from '@/lib/research-prompt';

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

// Batch pricing: 50% off standard claude-sonnet-4-6 rates
const BATCH_INPUT_PER_M = 1.50;
const BATCH_OUTPUT_PER_M = 7.50;

function calcBatchCost(inputTokens: number, outputTokens: number): string {
  return ((inputTokens / 1_000_000) * BATCH_INPUT_PER_M + (outputTokens / 1_000_000) * BATCH_OUTPUT_PER_M).toFixed(4);
}

function parseResearchJson(raw: string): Record<string, unknown> | null {
  try {
    const fenceMatch = raw.match(/```(?:json)?\s*([\s\S]*?)```/);
    const cleaned = fenceMatch ? fenceMatch[1].trim() : raw.trim();
    return JSON.parse(cleaned);
  } catch {
    return null;
  }
}

function buildFieldRefreshDates(
  researchData: Record<string, unknown>,
  today: string,
  existingJson: string | null,
): Record<string, string> {
  const existing: Record<string, string> = existingJson ? JSON.parse(existingJson) : {};
  const updated = { ...existing };
  for (const field of RESEARCHABLE_FIELDS) {
    const val = researchData[field];
    if (val !== null && val !== undefined) updated[field] = today;
  }
  return updated;
}

export async function GET(_req: NextRequest, { params }: { params: Promise<{ batchId: string }> }) {
  const { batchId } = await params;

  const [job] = await db.select().from(batchJobs).where(eq(batchJobs.id, batchId));
  if (!job) return NextResponse.json({ error: 'Batch job not found' }, { status: 404 });

  // If already complete or failed, return current state
  if (job.status === 'complete' || job.status === 'failed') {
    return NextResponse.json({
      status: job.status,
      totalCompanies: job.total_companies,
      completedCompanies: job.completed_companies,
      estimatedCost: job.estimated_cost_usd,
      createdAt: job.created_at,
      completedAt: job.completed_at,
    });
  }

  // Poll Anthropic for current status
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const anthropicBatch = await (client.messages.batches as any).retrieve(job.anthropic_batch_id);
  const processingStatus: string = anthropicBatch.processing_status;

  if (processingStatus === 'in_progress') {
    const counts = anthropicBatch.request_counts ?? {};
    const completed = (counts.succeeded ?? 0) + (counts.errored ?? 0) + (counts.canceled ?? 0) + (counts.expired ?? 0);
    await db.update(batchJobs)
      .set({ status: 'processing', completed_companies: completed })
      .where(eq(batchJobs.id, batchId));

    return NextResponse.json({
      status: 'processing',
      totalCompanies: job.total_companies,
      completedCompanies: completed,
      requestCounts: counts,
    });
  }

  if (processingStatus !== 'ended') {
    return NextResponse.json({ status: 'pending', totalCompanies: job.total_companies, completedCompanies: 0 });
  }

  // Batch ended — process results
  const today = new Date().toISOString().split('T')[0];
  let totalInputTokens = 0;
  let totalOutputTokens = 0;
  let successCount = 0;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  for await (const result of await (client.messages.batches as any).results(job.anthropic_batch_id)) {
    const customId: string = result.custom_id;
    const companyId = customId.replace('company-', '');

    if (result.result.type !== 'succeeded') {
      await db.insert(researchHistory).values({
        company_id: companyId,
        company_name: companyId,
        status: 'failed',
        estimated_cost_usd: '0.0000',
        run_type: 'batch',
        batch_job_id: batchId,
        error_message: `Batch result: ${result.result.type}`,
      });
      continue;
    }

    const message = result.result.message;
    const inputTk: number = message.usage?.input_tokens ?? 0;
    const outputTk: number = message.usage?.output_tokens ?? 0;
    totalInputTokens += inputTk;
    totalOutputTokens += outputTk;

    let rawJson = '';
    for (const block of message.content) {
      if (block.type === 'text') rawJson = block.text;
    }

    const parsed = parseResearchJson(rawJson);
    if (!parsed) {
      await db.insert(researchHistory).values({
        company_id: companyId,
        company_name: companyId,
        status: 'failed',
        estimated_cost_usd: calcBatchCost(inputTk, outputTk),
        input_tokens: inputTk,
        output_tokens: outputTk,
        run_type: 'batch',
        batch_job_id: batchId,
        error_message: 'Failed to parse JSON response',
      });
      continue;
    }

    const fieldConfidence = (parsed.field_confidence as Record<string, string>) ?? {};
    delete parsed.field_confidence;

    const [existingCompany] = await db.select({ field_refresh_dates: companies.field_refresh_dates, company_name: companies.company_name })
      .from(companies)
      .where(eq(companies.id, companyId));

    const fieldRefreshDates = buildFieldRefreshDates(parsed, today, existingCompany?.field_refresh_dates ?? null);

    await db.update(companies)
      .set({
        ...parsed,
        confidence_scores: JSON.stringify(fieldConfidence),
        field_refresh_dates: JSON.stringify(fieldRefreshDates),
        research_date: today,
        updated_at: new Date(),
      } as Record<string, unknown>)
      .where(eq(companies.id, companyId));

    await db.insert(researchHistory).values({
      company_id: companyId,
      company_name: existingCompany?.company_name ?? companyId,
      status: 'success',
      estimated_cost_usd: calcBatchCost(inputTk, outputTk),
      input_tokens: inputTk,
      output_tokens: outputTk,
      run_type: 'batch',
      batch_job_id: batchId,
    });

    successCount++;
  }

  const totalCost = calcBatchCost(totalInputTokens, totalOutputTokens);

  await db.update(batchJobs)
    .set({
      status: 'complete',
      completed_companies: successCount,
      estimated_cost_usd: totalCost,
      completed_at: new Date(),
    })
    .where(eq(batchJobs.id, batchId));

  return NextResponse.json({
    status: 'complete',
    totalCompanies: job.total_companies,
    completedCompanies: successCount,
    estimatedCost: totalCost,
  });
}

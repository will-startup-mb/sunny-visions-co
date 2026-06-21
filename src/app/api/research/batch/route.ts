import { NextRequest, NextResponse } from 'next/server';
import Anthropic from '@anthropic-ai/sdk';
import { db } from '@/lib/db';
import { companies, batchJobs } from '@/lib/db/schema';
import { inArray } from 'drizzle-orm';
import { RESEARCH_SYSTEM_PROMPT, RESEARCH_USER_PROMPT } from '@/lib/research-prompt';

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

export async function POST(req: NextRequest) {
  const { companyIds } = await req.json() as { companyIds: string[] };

  if (!companyIds || companyIds.length === 0) {
    return NextResponse.json({ error: 'No company IDs provided' }, { status: 400 });
  }

  const rows = await db.select().from(companies).where(inArray(companies.id, companyIds));
  if (rows.length === 0) {
    return NextResponse.json({ error: 'No matching companies found' }, { status: 404 });
  }

  // Build one batch request per company
  const requests = rows.map((company) => ({
    custom_id: `company-${company.id}`,
    params: {
      model: 'claude-sonnet-4-6',
      max_tokens: 4500,
      system: [
        {
          type: 'text' as const,
          text: RESEARCH_SYSTEM_PROMPT,
          cache_control: { type: 'ephemeral' as const },
        },
      ],
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      tools: [{ type: 'web_search_20250305', name: 'web_search' }] as any,
      messages: [
        {
          role: 'user' as const,
          content: RESEARCH_USER_PROMPT(company.company_name, company.website || ''),
        },
      ],
    },
  }));

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const batch = await (client.messages.batches as any).create({ requests });

  const companyMeta = rows.map((c) => ({ id: c.id, name: c.company_name }));

  const [job] = await db
    .insert(batchJobs)
    .values({
      anthropic_batch_id: batch.id,
      company_ids: JSON.stringify(companyMeta),
      status: 'pending',
      total_companies: rows.length,
      completed_companies: 0,
    })
    .returning();

  return NextResponse.json({ batchJobId: job.id, anthropicBatchId: batch.id, count: rows.length });
}

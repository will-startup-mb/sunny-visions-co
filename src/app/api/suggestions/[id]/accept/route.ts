import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { suggestions, companies } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';

export async function POST(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  const [suggestion] = await db.select().from(suggestions).where(eq(suggestions.id, id));
  if (!suggestion) return NextResponse.json({ error: 'Not found' }, { status: 404 });

  const now = new Date();
  const [company] = await db
    .insert(companies)
    .values({
      company_name: suggestion.company_name,
      website: suggestion.website ?? undefined,
      company_description: suggestion.description ?? undefined,
      created_at: now,
      updated_at: now,
    })
    .returning();

  await db.delete(suggestions).where(eq(suggestions.id, id));

  return NextResponse.json({ ok: true, company });
}

import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { companies } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';

export async function POST(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const [current] = await db.select().from(companies).where(eq(companies.id, id));
  if (!current) return NextResponse.json({ error: 'Not found' }, { status: 404 });

  const [row] = await db
    .update(companies)
    .set({ is_published: !current.is_published, updated_at: new Date() })
    .where(eq(companies.id, id))
    .returning();

  return NextResponse.json(row);
}

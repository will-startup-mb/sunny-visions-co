import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { companies } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';

export async function GET(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const [row] = await db.select().from(companies).where(eq(companies.id, id));
  if (!row) return NextResponse.json({ error: 'Not found' }, { status: 404 });
  return NextResponse.json(row);
}

function sanitize(body: Record<string, unknown>) {
  return Object.fromEntries(
    Object.entries(body).map(([k, v]) => [k, v === '' ? null : v])
  );
}

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const body = sanitize(await req.json());
    const [row] = await db
      .update(companies)
      .set({ ...body, updated_at: new Date() })
      .where(eq(companies.id, id))
      .returning();
    if (!row) return NextResponse.json({ error: 'Not found' }, { status: 404 });
    return NextResponse.json(row);
  } catch (err) {
    console.error('PUT /api/companies/[id] error:', err);
    return NextResponse.json(
      { error: err instanceof Error ? err.message : 'Failed to update company' },
      { status: 500 }
    );
  }
}

export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  await db.delete(companies).where(eq(companies.id, id));
  return NextResponse.json({ success: true });
}

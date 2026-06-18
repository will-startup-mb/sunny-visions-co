import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { suggestions } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';

export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  await db.delete(suggestions).where(eq(suggestions.id, id));
  return NextResponse.json({ ok: true });
}

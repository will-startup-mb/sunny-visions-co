import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { posts } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';

export async function GET(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const [post] = await db.select().from(posts).where(eq(posts.id, id));
  if (!post) return NextResponse.json({ error: 'Not found' }, { status: 404 });
  return NextResponse.json(post);
}

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  try {
    const body = await req.json();
    const [row] = await db
      .update(posts)
      .set({
        title: body.title,
        slug: body.slug,
        content: body.content,
        excerpt: body.excerpt ?? null,
        published: body.published ?? false,
        updated_at: new Date(),
      })
      .where(eq(posts.id, id))
      .returning();
    if (!row) return NextResponse.json({ error: 'Not found' }, { status: 404 });
    return NextResponse.json(row);
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : 'Failed to update post' },
      { status: 500 }
    );
  }
}

export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  await db.delete(posts).where(eq(posts.id, id));
  return NextResponse.json({ ok: true });
}

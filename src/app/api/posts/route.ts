import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { posts } from '@/lib/db/schema';
import { eq, desc } from 'drizzle-orm';

function toSlug(title: string): string {
  return title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');
}

async function uniqueSlug(title: string): Promise<string> {
  const base = toSlug(title);
  let slug = base;
  let n = 1;
  while (true) {
    const [existing] = await db.select({ id: posts.id }).from(posts).where(eq(posts.slug, slug));
    if (!existing) return slug;
    slug = `${base}-${n++}`;
  }
}

export async function GET(req: NextRequest) {
  const adminView = new URL(req.url).searchParams.get('admin') === 'true';
  const rows = await db
    .select()
    .from(posts)
    .where(adminView ? undefined : eq(posts.published, true))
    .orderBy(desc(posts.created_at));
  return NextResponse.json(rows);
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const now = new Date();
    const slug = body.slug?.trim() || await uniqueSlug(body.title);
    const [row] = await db
      .insert(posts)
      .values({
        title: body.title,
        slug,
        content: body.content ?? '',
        excerpt: body.excerpt ?? null,
        published: body.published ?? false,
        created_at: now,
        updated_at: now,
      })
      .returning();
    return NextResponse.json(row, { status: 201 });
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : 'Failed to create post' },
      { status: 500 }
    );
  }
}

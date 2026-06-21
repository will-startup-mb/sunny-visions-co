import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { companies } from '@/lib/db/schema';
import { eq, ilike, or, desc, and } from 'drizzle-orm';
import { buildFaviconUrl } from '@/lib/company-logo';

function toSlugBase(name: string): string {
  return name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');
}

async function generateUniqueSlug(name: string): Promise<string> {
  const base = toSlugBase(name);
  let slug = base;
  let n = 1;
  while (true) {
    const [existing] = await db.select({ id: companies.id }).from(companies).where(eq(companies.slug, slug));
    if (!existing) return slug;
    slug = `${base}-${n++}`;
  }
}

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const search = searchParams.get('search') || '';
  const industry = searchParams.get('industry') || '';
  const stage = searchParams.get('stage') || '';
  const funding = searchParams.get('funding') || '';
  const priority = searchParams.get('priority') || '';
  const adminView = searchParams.get('admin') === 'true';

  const conditions = [];

  if (!adminView) {
    conditions.push(eq(companies.is_published, true));
  }

  if (search) {
    conditions.push(
      or(
        ilike(companies.company_name, `%${search}%`),
        ilike(companies.company_description, `%${search}%`),
        ilike(companies.founder_names, `%${search}%`)
      )
    );
  }

  if (industry) conditions.push(eq(companies.primary_industry, industry));
  if (stage) conditions.push(eq(companies.stage, stage));
  if (funding) conditions.push(eq(companies.funding_raised, funding));
  if (priority) conditions.push(eq(companies.interview_priority, priority));

  const rows = await db
    .select()
    .from(companies)
    .where(conditions.length > 0 ? and(...conditions) : undefined)
    .orderBy(desc(companies.created_at));

  return NextResponse.json(rows);
}

// Convert empty strings to null so Postgres date/int columns don't reject them
function sanitize(body: Record<string, unknown>) {
  return Object.fromEntries(
    Object.entries(body).map(([k, v]) => [k, v === '' ? null : v])
  );
}

export async function POST(req: NextRequest) {
  try {
    const body = sanitize(await req.json()) as Record<string, unknown>;
    const now = new Date();
    if (!body.slug && body.company_name) {
      body.slug = await generateUniqueSlug(body.company_name as string);
    }
    if (!body.logo_url && body.website) {
      body.logo_url = buildFaviconUrl(body.website as string);
    }
    const [row] = await db
      .insert(companies)
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      .values({ ...(body as any), created_at: now, updated_at: now })
      .returning();
    return NextResponse.json(row, { status: 201 });
  } catch (err) {
    console.error('POST /api/companies error:', err);
    return NextResponse.json(
      { error: err instanceof Error ? err.message : 'Failed to create company' },
      { status: 500 }
    );
  }
}

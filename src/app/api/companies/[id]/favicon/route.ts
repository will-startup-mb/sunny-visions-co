import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { companies } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';
import { buildFaviconUrl } from '@/lib/company-logo';

export async function POST(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  const [company] = await db.select().from(companies).where(eq(companies.id, id));
  if (!company) return NextResponse.json({ error: 'Not found' }, { status: 404 });

  const faviconUrl = buildFaviconUrl(company.website);
  if (!faviconUrl) return NextResponse.json({ error: 'No website URL on this company' }, { status: 400 });

  await db.update(companies).set({ logo_url: faviconUrl, updated_at: new Date() }).where(eq(companies.id, id));

  return NextResponse.json({ logo_url: faviconUrl });
}

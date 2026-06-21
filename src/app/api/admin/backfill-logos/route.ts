import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { companies } from '@/lib/db/schema';
import { isNotNull } from 'drizzle-orm';
import { buildFaviconUrl } from '@/lib/company-logo';
import { eq } from 'drizzle-orm';

export async function POST() {
  const rows = await db
    .select({ id: companies.id, website: companies.website })
    .from(companies)
    .where(isNotNull(companies.website));

  let updated = 0;
  for (const row of rows) {
    const faviconUrl = buildFaviconUrl(row.website);
    if (faviconUrl) {
      await db.update(companies).set({ logo_url: faviconUrl, updated_at: new Date() }).where(eq(companies.id, row.id));
      updated++;
    }
  }

  return NextResponse.json({ updated });
}

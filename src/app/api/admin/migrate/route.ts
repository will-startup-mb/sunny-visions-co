import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { sql } from 'drizzle-orm';

export async function POST() {
  await db.execute(sql`
    ALTER TABLE companies
    ADD COLUMN IF NOT EXISTS logo_bg_color text DEFAULT '#FFFFFF'
  `);
  await db.execute(sql`
    UPDATE companies SET logo_bg_color = '#FFFFFF'
    WHERE logo_bg_color IS NULL OR logo_bg_color = '#4A4A4A'
  `);
  await db.execute(sql`
    ALTER TABLE companies
    ADD COLUMN IF NOT EXISTS logo_upload_url text
  `);
  return NextResponse.json({ ok: true });
}

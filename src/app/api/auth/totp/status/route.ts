import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { adminSettings } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';

export async function GET() {
  try {
    const rows = await db
      .select()
      .from(adminSettings)
      .where(eq(adminSettings.key, 'totp_secret'));
    return NextResponse.json({ configured: rows.length > 0 });
  } catch {
    return NextResponse.json({ configured: false });
  }
}

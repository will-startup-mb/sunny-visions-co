import { NextRequest, NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';
import { db } from '@/lib/db';
import { siteContent } from '@/lib/db/schema';
import { SITE_CONTENT_DEFAULTS } from '@/lib/db/site-content';

export async function GET() {
  const rows = await db.select().from(siteContent);
  const data: Record<string, string> = { ...SITE_CONTENT_DEFAULTS };
  for (const row of rows) data[row.key] = row.value;
  return NextResponse.json(data);
}

export async function PUT(req: NextRequest) {
  const { key, value } = await req.json() as { key: string; value: string };
  if (!key || !(key in SITE_CONTENT_DEFAULTS)) {
    return NextResponse.json({ error: 'Invalid key' }, { status: 400 });
  }

  await db
    .insert(siteContent)
    .values({ key, value: value ?? '', updated_at: new Date() })
    .onConflictDoUpdate({
      target: siteContent.key,
      set: { value: value ?? '', updated_at: new Date() },
    });

  revalidatePath('/');
  revalidatePath('/about');
  revalidatePath('/podcast');
  revalidatePath('/events');
  revalidatePath('/sponsors');

  return NextResponse.json({ ok: true });
}

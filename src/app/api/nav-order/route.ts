import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { db } from '@/lib/db';
import { adminSettings } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';
import { DEFAULT_NAV_ORDER } from '@/lib/nav-items';

export async function GET() {
  try {
    const rows = await db.select().from(adminSettings).where(eq(adminSettings.key, 'nav_order'));
    if (rows.length && rows[0].value) {
      return NextResponse.json({ order: JSON.parse(rows[0].value) });
    }
    return NextResponse.json({ order: DEFAULT_NAV_ORDER });
  } catch {
    return NextResponse.json({ order: DEFAULT_NAV_ORDER });
  }
}

export async function PUT(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { order } = await req.json();
  if (!Array.isArray(order)) return NextResponse.json({ error: 'Invalid' }, { status: 400 });

  await db
    .insert(adminSettings)
    .values({ key: 'nav_order', value: JSON.stringify(order) })
    .onConflictDoUpdate({ target: adminSettings.key, set: { value: JSON.stringify(order), updated_at: new Date() } });

  return NextResponse.json({ ok: true });
}

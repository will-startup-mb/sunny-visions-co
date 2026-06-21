import { db } from '@/lib/db';
import { adminSettings } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';
import { DEFAULT_NAV_ORDER } from '@/lib/nav-items';

export async function getNavOrder(): Promise<string[]> {
  try {
    const rows = await db.select().from(adminSettings).where(eq(adminSettings.key, 'nav_order'));
    if (rows.length && rows[0].value) return JSON.parse(rows[0].value) as string[];
    return DEFAULT_NAV_ORDER;
  } catch {
    return DEFAULT_NAV_ORDER;
  }
}

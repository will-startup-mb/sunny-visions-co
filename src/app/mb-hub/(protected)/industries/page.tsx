import { db } from '@/lib/db';
import { companies, adminSettings } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';
import { IndustriesManager } from './IndustriesManager';

export const dynamic = 'force-dynamic';

export default async function IndustriesPage() {
  const [rows, masterSetting] = await Promise.all([
    db.select({ p: companies.primary_industry, s: companies.secondary_industry }).from(companies),
    db.select().from(adminSettings).where(eq(adminSettings.key, 'industries_master_list')),
  ]);

  const counts: Record<string, number> = {};
  for (const row of rows) {
    const tags = new Set<string>();
    if (row.p) tags.add(row.p);
    if (row.s) tags.add(row.s);
    for (const tag of tags) counts[tag] = (counts[tag] ?? 0) + 1;
  }

  const masterList: string[] = masterSetting[0] ? JSON.parse(masterSetting[0].value) : [];
  const allNames = new Set([...Object.keys(counts), ...masterList]);
  const industries = [...allNames]
    .sort((a, b) => a.localeCompare(b))
    .map((name) => ({ name, count: counts[name] ?? 0 }));

  return <IndustriesManager initial={industries} />;
}

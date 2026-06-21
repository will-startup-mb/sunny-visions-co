import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { companies, adminSettings } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';

const MASTER_KEY = 'industries_master_list';

async function getMasterList(): Promise<string[]> {
  const [row] = await db.select().from(adminSettings).where(eq(adminSettings.key, MASTER_KEY));
  return row ? JSON.parse(row.value) : [];
}

async function setMasterList(list: string[]) {
  const value = JSON.stringify([...new Set(list)].sort());
  await db
    .insert(adminSettings)
    .values({ key: MASTER_KEY, value, updated_at: new Date() })
    .onConflictDoUpdate({ target: adminSettings.key, set: { value, updated_at: new Date() } });
}

export async function GET() {
  const [rows, masterList] = await Promise.all([
    db.select({ p: companies.primary_industry, s: companies.secondary_industry }).from(companies),
    getMasterList(),
  ]);

  // Count companies per industry tag (count each company once per unique tag it holds)
  const counts: Record<string, number> = {};
  for (const row of rows) {
    const tags = new Set<string>();
    if (row.p) tags.add(row.p);
    if (row.s) tags.add(row.s);
    for (const tag of tags) counts[tag] = (counts[tag] ?? 0) + 1;
  }

  const allNames = new Set([...Object.keys(counts), ...masterList]);
  const industries = [...allNames]
    .sort((a, b) => a.localeCompare(b))
    .map((name) => ({ name, count: counts[name] ?? 0 }));

  return NextResponse.json({ industries });
}

export async function POST(req: NextRequest) {
  const { name } = await req.json();
  if (!name?.trim()) return NextResponse.json({ error: 'Name required' }, { status: 400 });
  const list = await getMasterList();
  await setMasterList([...list, name.trim()]);
  return NextResponse.json({ ok: true });
}

export async function PATCH(req: NextRequest) {
  const body = await req.json();

  if (body.action === 'rename') {
    const { from, to } = body as { from: string; to: string };
    if (!from || !to?.trim()) return NextResponse.json({ error: 'from/to required' }, { status: 400 });
    const toTrimmed = to.trim();
    await Promise.all([
      db.update(companies).set({ primary_industry: toTrimmed }).where(eq(companies.primary_industry, from)),
      db.update(companies).set({ secondary_industry: toTrimmed }).where(eq(companies.secondary_industry, from)),
    ]);
    // Keep master list in sync
    const list = await getMasterList();
    await setMasterList(list.map((n) => (n === from ? toTrimmed : n)));
    return NextResponse.json({ ok: true });
  }

  if (body.action === 'merge') {
    const { source, target } = body as { source: string; target: string };
    if (!source || !target) return NextResponse.json({ error: 'source/target required' }, { status: 400 });
    await Promise.all([
      db.update(companies).set({ primary_industry: target }).where(eq(companies.primary_industry, source)),
      db.update(companies).set({ secondary_industry: target }).where(eq(companies.secondary_industry, source)),
    ]);
    // Remove the merged-away industry from the master list
    const list = await getMasterList();
    await setMasterList(list.filter((n) => n !== source));
    return NextResponse.json({ ok: true });
  }

  return NextResponse.json({ error: 'Unknown action' }, { status: 400 });
}

import { NextRequest, NextResponse } from 'next/server';
import { writeFile } from 'fs/promises';
import path from 'path';
import { db } from '@/lib/db';
import { companies } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';

export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  const [company] = await db.select().from(companies).where(eq(companies.id, id));
  if (!company) return NextResponse.json({ error: 'Not found' }, { status: 404 });

  const formData = await req.formData();
  const file = formData.get('logo') as File | null;
  if (!file) return NextResponse.json({ error: 'No file provided' }, { status: 400 });

  const ext = file.name.split('.').pop()?.toLowerCase() || 'png';
  const filename = `${id}.${ext}`;
  const buffer = Buffer.from(await file.arrayBuffer());

  await writeFile(
    path.join(process.cwd(), 'public', 'logos', filename),
    buffer
  );

  const logo_url = `/logos/${filename}`;
  await db.update(companies).set({ logo_url, updated_at: new Date() }).where(eq(companies.id, id));

  return NextResponse.json({ logo_url });
}

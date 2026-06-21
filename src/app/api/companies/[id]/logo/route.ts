import { NextRequest, NextResponse } from 'next/server';
import { put, del } from '@vercel/blob';
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

  // Delete previous upload from Blob storage if present
  if (company.logo_upload_url?.includes('blob.vercel-storage.com')) {
    await del(company.logo_upload_url).catch(() => {});
  }

  const ext = file.name.split('.').pop()?.toLowerCase() || 'png';
  const { url } = await put(`logos/${id}.${ext}`, file, { access: 'public', addRandomSuffix: false });

  await db.update(companies).set({ logo_upload_url: url, updated_at: new Date() }).where(eq(companies.id, id));

  return NextResponse.json({ logo_url: url });
}

export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  const [company] = await db.select().from(companies).where(eq(companies.id, id));
  if (!company) return NextResponse.json({ error: 'Not found' }, { status: 404 });

  if (company.logo_upload_url?.includes('blob.vercel-storage.com')) {
    await del(company.logo_upload_url).catch(() => {});
  }

  await db.update(companies).set({ logo_upload_url: null, updated_at: new Date() }).where(eq(companies.id, id));

  return NextResponse.json({ ok: true });
}

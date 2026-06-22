import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { db } from '@/lib/db';
import { clients } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';

export async function PUT(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { id } = await params;
  const body = await req.json();

  const [updated] = await db.update(clients).set({
    client_name: body.client_name,
    email: body.email || null,
    phone: body.phone || null,
    service_type: body.service_type || null,
    status: body.status,
    project_value: body.project_value || null,
    project_description: body.project_description || null,
    outreach_notes: body.outreach_notes || null,
    last_contact_date: body.last_contact_date || null,
    became_client: body.became_client ?? false,
    portfolio_published: body.portfolio_published ?? false,
    updated_at: new Date(),
  }).where(eq(clients.id, id)).returning();

  return NextResponse.json(updated);
}

export async function DELETE(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { id } = await params;
  await db.delete(clients).where(eq(clients.id, id));
  return NextResponse.json({ ok: true });
}

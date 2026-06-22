import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { db } from '@/lib/db';
import { clients } from '@/lib/db/schema';
import { asc } from 'drizzle-orm';

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const all = await db.select().from(clients).orderBy(asc(clients.client_name));
  return NextResponse.json(all);
}

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const body = await req.json();
  const slug = body.client_name
    ?.toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .slice(0, 80);

  const [created] = await db.insert(clients).values({
    client_name: body.client_name,
    slug,
    email: body.email || null,
    phone: body.phone || null,
    service_type: body.service_type || null,
    status: body.status || 'Lead',
    project_value: body.project_value || null,
    project_description: body.project_description || null,
    outreach_notes: body.outreach_notes || null,
    last_contact_date: body.last_contact_date || null,
    became_client: body.became_client ?? false,
    portfolio_published: body.portfolio_published ?? false,
  }).returning();

  return NextResponse.json(created, { status: 201 });
}

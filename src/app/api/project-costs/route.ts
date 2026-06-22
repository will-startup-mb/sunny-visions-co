import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { db } from '@/lib/db';
import { projectCosts } from '@/lib/db/schema';

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const body = await req.json();
  const [created] = await db.insert(projectCosts).values({
    client_id: body.client_id || null,
    description: body.description || null,
    amount: body.amount,
    cost_date: body.cost_date || null,
  }).returning();

  return NextResponse.json(created, { status: 201 });
}

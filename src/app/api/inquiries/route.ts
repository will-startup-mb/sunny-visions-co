import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { inquiries } from '@/lib/db/schema';

export async function POST(req: Request) {
  const body = await req.json();
  if (!body.name || !body.email || !body.message) {
    return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
  }

  const [created] = await db.insert(inquiries).values({
    name: body.name,
    email: body.email,
    message: body.message,
    status: 'New',
  }).returning();

  return NextResponse.json(created, { status: 201 });
}

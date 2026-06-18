import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { suggestions } from '@/lib/db/schema';
import { desc } from 'drizzle-orm';

const RATE_LIMIT = 5;
const WINDOW_MS = 60 * 60 * 1000; // 1 hour

// Module-level store: IP → { count, resetAt }
// Works for single-server deployments; resets on process restart.
const ipCounts = new Map<string, { count: number; resetAt: number }>();

function getIp(req: NextRequest): string {
  return (
    req.headers.get('x-forwarded-for')?.split(',')[0].trim() ??
    req.headers.get('x-real-ip') ??
    'unknown'
  );
}

function checkRateLimit(ip: string): boolean {
  const now = Date.now();
  const entry = ipCounts.get(ip);

  if (!entry || now > entry.resetAt) {
    ipCounts.set(ip, { count: 1, resetAt: now + WINDOW_MS });
    return true;
  }
  if (entry.count >= RATE_LIMIT) return false;
  entry.count += 1;
  return true;
}

export async function GET() {
  const rows = await db.select().from(suggestions).orderBy(desc(suggestions.created_at));
  return NextResponse.json(rows);
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    // Honeypot: bots fill this, humans don't see it
    if (body._gotcha) {
      return NextResponse.json({ ok: true }, { status: 201 });
    }

    const ip = getIp(req);
    if (!checkRateLimit(ip)) {
      return NextResponse.json(
        { error: 'Too many submissions. Please try again later.' },
        { status: 429 }
      );
    }

    const { company_name, website, description, submitter_name, submitter_email } = body;
    if (!company_name || !submitter_name || !submitter_email) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const [row] = await db
      .insert(suggestions)
      .values({ company_name, website: website || null, description: description || null, submitter_name, submitter_email })
      .returning();
    return NextResponse.json(row, { status: 201 });
  } catch (err) {
    console.error('POST /api/suggestions error:', err);
    return NextResponse.json({ error: 'Failed to save suggestion' }, { status: 500 });
  }
}

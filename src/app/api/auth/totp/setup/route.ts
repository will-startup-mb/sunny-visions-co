import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { generateSecret, verifySync, generateURI } from 'otplib';
import QRCode from 'qrcode';
import { db } from '@/lib/db';
import { adminSettings } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';

// GET — generate a fresh secret + QR data URL (requires session, TOTP not yet enabled)
export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const secret = generateSecret();
  const email = process.env.ADMIN_EMAIL ?? 'admin';
  const otpauthUrl = generateURI({ secret, label: email, issuer: 'Startup MB Admin' });
  const qrDataUrl = await QRCode.toDataURL(otpauthUrl);

  return NextResponse.json({ secret, qrDataUrl });
}

// POST — verify code and save secret
export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { secret, code } = await req.json();
  if (!secret || !code) {
    return NextResponse.json({ error: 'Missing secret or code' }, { status: 400 });
  }

  const result = verifySync({ token: code.replace(/\s/g, ''), secret });
  const isValid = result.valid;
  if (!isValid) {
    return NextResponse.json({ error: 'Invalid code — try again' }, { status: 400 });
  }

  await db
    .insert(adminSettings)
    .values({ key: 'totp_secret', value: secret })
    .onConflictDoUpdate({ target: adminSettings.key, set: { value: secret, updated_at: new Date() } });

  return NextResponse.json({ ok: true });
}

// DELETE — disable TOTP
export async function DELETE() {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  await db.delete(adminSettings).where(eq(adminSettings.key, 'totp_secret'));
  return NextResponse.json({ ok: true });
}

import type { NextAuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import { verifySync } from 'otplib';
import { db } from '@/lib/db';
import { adminSettings } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';

async function getTotpSecret(): Promise<string | null> {
  try {
    const rows = await Promise.race([
      db.select().from(adminSettings).where(eq(adminSettings.key, 'totp_secret')),
      new Promise<never>((_, reject) =>
        setTimeout(() => reject(new Error('DB timeout')), 5000)
      ),
    ]);
    return rows[0]?.value ?? null;
  } catch {
    return null;
  }
}

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: 'credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
        totp: { label: 'Authenticator Code', type: 'text' },
      },
      async authorize(credentials) {
        try {
          if (!credentials?.email || !credentials?.password) return null;

          const adminEmail = process.env.ADMIN_EMAIL;
          const adminPassword = process.env.ADMIN_PASSWORD;

          if (!adminEmail || !adminPassword) return null;
          if (credentials.email !== adminEmail) return null;
          if (credentials.password !== adminPassword) return null;

          const secret = await getTotpSecret();

          if (secret) {
            const code = credentials.totp?.replace(/\s/g, '');
            if (!code) return null;
            const result = verifySync({ token: code, secret });
            if (!result.valid) return null;
          }

          return { id: '1', name: 'Claire McCaffrey', email: adminEmail };
        } catch {
          return null;
        }
      },
    }),
  ],
  session: { strategy: 'jwt' },
  pages: { signIn: '/sv-hub/login' },
  secret: process.env.NEXTAUTH_SECRET,
};

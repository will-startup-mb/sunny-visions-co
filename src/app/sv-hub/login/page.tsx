'use client';

import { useState, useEffect } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Suspense } from 'react';

const SIGN_IN_TIMEOUT_MS = 15_000;

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get('callbackUrl') || '/sv-hub/clients';

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [totp, setTotp] = useState('');
  const [step, setStep] = useState<'credentials' | 'totp'>('credentials');
  const [totpRequired, setTotpRequired] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetch('/api/auth/totp/status')
      .then((r) => r.json())
      .then((d) => setTotpRequired(d.configured ?? false))
      .catch(() => {});
  }, []);

  const signInWithTimeout = (opts: Record<string, string>) =>
    Promise.race([
      signIn('credentials', { ...opts, redirect: false }),
      new Promise<never>((_, reject) =>
        setTimeout(() => reject(new Error('timeout')), SIGN_IN_TIMEOUT_MS)
      ),
    ]);

  const handleCredentials = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (totpRequired) { setStep('totp'); return; }
    setLoading(true);
    try {
      const result = await signInWithTimeout({ email, password, totp: '' });
      if (result?.ok) { router.push(callbackUrl); }
      else { setError('Invalid email or password'); }
    } catch {
      setError('Sign-in timed out — check your connection and try again');
    } finally {
      setLoading(false);
    }
  };

  const handleTotp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const result = await signInWithTimeout({ email, password, totp });
      if (result?.ok) { router.push(callbackUrl); }
      else {
        setError('Invalid credentials or authenticator code');
        setStep('credentials');
        setTotp('');
      }
    } catch {
      setError('Sign-in timed out — check your connection and try again');
      setStep('credentials');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: '#F5EFE0' }}>
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <div className="text-3xl font-bold mb-1" style={{ fontFamily: "'Lobster Two', cursive", color: '#E8521A' }}>
            Sunny Visions Co.
          </div>
          <p className="text-sm" style={{ color: '#3D2B1F', opacity: 0.6 }}>Admin Dashboard</p>
        </div>

        <div className="card p-8">
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 rounded p-3 text-sm mb-4">
              {error}
            </div>
          )}

          {step === 'credentials' ? (
            <>
              <h1 className="text-lg font-bold mb-6" style={{ color: '#3D2B1F' }}>Sign In</h1>
              <form onSubmit={handleCredentials} className="space-y-4">
                <div>
                  <label>Email</label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="cemccaffrey5@gmail.com"
                    required
                    autoFocus
                  />
                </div>
                <div>
                  <label>Password</label>
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </div>
                <button type="submit" className="btn-primary w-full justify-center" disabled={loading}>
                  {loading ? 'Signing in…' : totpRequired ? 'Next →' : 'Sign In'}
                </button>
              </form>
            </>
          ) : (
            <>
              <h1 className="text-lg font-bold mb-1" style={{ color: '#3D2B1F' }}>Two-Factor Auth</h1>
              <p className="text-sm mb-6" style={{ color: '#3D2B1F', opacity: 0.6 }}>
                Enter the 6-digit code from your authenticator app.
              </p>
              <form onSubmit={handleTotp} className="space-y-4">
                <div>
                  <label>Authenticator Code</label>
                  <input
                    type="text"
                    inputMode="numeric"
                    pattern="[0-9 ]*"
                    maxLength={7}
                    value={totp}
                    onChange={(e) => setTotp(e.target.value)}
                    placeholder="000 000"
                    required
                    autoFocus
                    className="tracking-widest text-center text-xl"
                  />
                </div>
                <button type="submit" className="btn-primary w-full justify-center" disabled={loading}>
                  {loading ? 'Verifying…' : 'Sign In'}
                </button>
                <button
                  type="button"
                  onClick={() => { setStep('credentials'); setError(''); setTotp(''); }}
                  className="btn-ghost w-full justify-center text-sm"
                >
                  ← Back
                </button>
              </form>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense>
      <LoginForm />
    </Suspense>
  );
}

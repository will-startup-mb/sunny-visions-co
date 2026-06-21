'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';

type Status = 'loading' | 'enabled' | 'setup' | 'confirm' | 'done';

export default function SecurityPage() {
  const [status, setStatus] = useState<Status>('loading');
  const [secret, setSecret] = useState('');
  const [qrDataUrl, setQrDataUrl] = useState('');
  const [code, setCode] = useState('');
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    fetch('/api/auth/totp/status')
      .then((r) => r.json())
      .then((d) => setStatus(d.configured ? 'enabled' : 'setup'))
      .catch(() => setStatus('setup'));
  }, []);

  const startSetup = async () => {
    setBusy(true);
    setError('');
    try {
      const res = await fetch('/api/auth/totp/setup');
      const data = await res.json();
      setSecret(data.secret);
      setQrDataUrl(data.qrDataUrl);
      setStatus('confirm');
    } catch {
      setError('Failed to generate QR code — try again');
    } finally {
      setBusy(false);
    }
  };

  const verifyAndEnable = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true);
    setError('');
    try {
      const res = await fetch('/api/auth/totp/setup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ secret, code: code.replace(/\s/g, '') }),
      });
      if (res.ok) {
        setStatus('done');
      } else {
        const d = await res.json();
        setError(d.error || 'Invalid code — try again');
      }
    } catch {
      setError('Network error — try again');
    } finally {
      setBusy(false);
      setCode('');
    }
  };

  const disable = async () => {
    if (!confirm('Disable two-factor authentication? You will only need your password to log in.')) return;
    setBusy(true);
    try {
      await fetch('/api/auth/totp/setup', { method: 'DELETE' });
      setStatus('setup');
      setSecret('');
      setQrDataUrl('');
    } catch {
      setError('Failed to disable TOTP — try again');
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="p-4 md:p-6 space-y-6 md:space-y-8">
      <div>
        <h1 className="text-xl font-extrabold" style={{ color: '#1B3A52' }}>Security</h1>
        <p className="text-sm text-gray-500 mt-1">Two-factor authentication for admin login.</p>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 rounded p-3 text-sm">
          {error}
        </div>
      )}

      {status === 'loading' && <p className="text-sm text-gray-400">Loading…</p>}

      {status === 'enabled' && (
        <div className="card p-6 space-y-4">
          <div className="flex items-center gap-3">
            <span className="text-green-600 text-xl">✓</span>
            <div>
              <p className="font-semibold text-sm" style={{ color: '#1B3A52' }}>Two-factor authentication is enabled</p>
              <p className="text-xs text-gray-500">A 6-digit code is required on each login.</p>
            </div>
          </div>
          <button onClick={disable} disabled={busy} className="btn-ghost text-sm text-red-600 border-red-200 hover:bg-red-50">
            Disable 2FA
          </button>
        </div>
      )}

      {status === 'setup' && (
        <div className="card p-6 space-y-4">
          <p className="text-sm" style={{ color: '#1B3A52' }}>
            Add an extra layer of security. You&apos;ll need an authenticator app like{' '}
            <strong>Google Authenticator</strong> or <strong>Authy</strong>.
          </p>
          <button onClick={startSetup} disabled={busy} className="btn-primary text-sm">
            {busy ? 'Generating…' : 'Set Up 2FA'}
          </button>
        </div>
      )}

      {status === 'confirm' && (
        <div className="card p-6 space-y-5">
          <div>
            <p className="font-semibold text-sm mb-1" style={{ color: '#1B3A52' }}>1. Scan this QR code</p>
            <p className="text-xs text-gray-500 mb-3">Open your authenticator app and scan the code below.</p>
            {qrDataUrl && (
              <Image src={qrDataUrl} alt="TOTP QR Code" width={200} height={200} className="rounded border" />
            )}
          </div>
          <div>
            <p className="text-xs text-gray-400 mb-1">Can&apos;t scan? Enter this key manually:</p>
            <code className="text-xs bg-gray-100 rounded px-2 py-1 block break-all">{secret}</code>
          </div>
          <form onSubmit={verifyAndEnable} className="space-y-3">
            <div>
              <p className="font-semibold text-sm mb-2" style={{ color: '#1B3A52' }}>2. Enter the 6-digit code to confirm</p>
              <input
                type="text"
                inputMode="numeric"
                pattern="[0-9 ]*"
                maxLength={7}
                value={code}
                onChange={(e) => setCode(e.target.value)}
                placeholder="000 000"
                required
                autoFocus
                className="tracking-widest text-center text-xl"
              />
            </div>
            <button type="submit" disabled={busy} className="btn-primary text-sm w-full justify-center">
              {busy ? 'Verifying…' : 'Enable 2FA'}
            </button>
          </form>
        </div>
      )}

      {status === 'done' && (
        <div className="card p-6 text-center space-y-3">
          <p className="text-3xl">🔐</p>
          <p className="font-semibold" style={{ color: '#1B3A52' }}>Two-factor authentication enabled!</p>
          <p className="text-sm text-gray-500">Your next login will require a code from your authenticator app.</p>
          <button onClick={() => setStatus('enabled')} className="btn-ghost text-sm">Done</button>
        </div>
      )}
    </div>
  );
}

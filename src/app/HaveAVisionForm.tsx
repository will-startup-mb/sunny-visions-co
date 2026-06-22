'use client';

import { useState } from 'react';

type Fields = { name: string; email: string; message: string };

const inputStyle: React.CSSProperties = {
  backgroundColor: 'rgba(255,255,255,0.18)',
  border: '1px solid rgba(255,255,255,0.35)',
  borderRadius: '0.5rem',
  padding: '0.75rem 1rem',
  color: 'white',
  fontFamily: "'Livvic', sans-serif",
  fontSize: '0.95rem',
  outline: 'none',
  width: '100%',
};

export function HaveAVisionForm() {
  const [fields, setFields] = useState<Fields>({ name: '', email: '', message: '' });
  const [status, setStatus] = useState<'idle' | 'sending' | 'sent' | 'error'>('idle');

  const set = (key: keyof Fields) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setFields((f) => ({ ...f, [key]: e.target.value }));

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus('sending');
    try {
      const res = await fetch('/api/inquiries', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(fields),
      });
      if (!res.ok) throw new Error();
      setStatus('sent');
    } catch {
      setStatus('error');
    }
  }

  if (status === 'sent') {
    return (
      <div
        className="rounded-2xl flex flex-col items-center justify-center gap-3 text-center py-12 px-6"
        style={{ backgroundColor: 'rgba(255,255,255,0.15)' }}
      >
        <span style={{ fontFamily: 'var(--display)', fontSize: '2rem', color: '#F2BC2B', letterSpacing: '0.05em' }}>MESSAGE SENT!</span>
        <p style={{ color: 'white', fontFamily: "'Livvic', sans-serif" }}>I&apos;ll be in touch soon. ✨</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-3">
      <input
        type="text"
        placeholder="Your Name"
        required
        value={fields.name}
        onChange={set('name')}
        style={inputStyle}
      />
      <input
        type="email"
        placeholder="Your Email"
        required
        value={fields.email}
        onChange={set('email')}
        style={inputStyle}
      />
      <textarea
        placeholder="Tell me about your project..."
        rows={4}
        required
        value={fields.message}
        onChange={set('message')}
        style={{ ...inputStyle, resize: 'vertical' }}
      />
      <div className="flex items-center gap-3 mt-1">
        <button
          type="submit"
          disabled={status === 'sending'}
          className="uppercase tracking-widest transition-opacity hover:opacity-90"
          style={{
            fontFamily: 'var(--display)',
            fontSize: '1rem',
            letterSpacing: '0.1em',
            backgroundColor: '#3D2B1F',
            color: '#F2BC2B',
            border: 'none',
            borderRadius: '9999px',
            padding: '0.85rem 2.25rem',
            cursor: status === 'sending' ? 'wait' : 'pointer',
          }}
        >
          {status === 'sending' ? 'SENDING...' : 'SEND →'}
        </button>
        {status === 'error' && (
          <p style={{ color: '#ffd0c0', fontFamily: "'Livvic', sans-serif", fontSize: '0.85rem' }}>
            Something went wrong — try emailing directly.
          </p>
        )}
      </div>
    </form>
  );
}

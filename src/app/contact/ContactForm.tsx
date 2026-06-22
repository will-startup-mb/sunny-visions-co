'use client';

import { useState } from 'react';

interface Props {
  formspreeId: string;
}

export function ContactForm({ formspreeId }: Props) {
  const [form, setForm] = useState({ name: '', email: '', message: '' });
  const [status, setStatus] = useState<'idle' | 'sending' | 'sent' | 'error'>('idle');

  const set = (key: string, value: string) => setForm((prev) => ({ ...prev, [key]: value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('sending');
    try {
      if (formspreeId) {
        const res = await fetch(`https://formspree.io/f/${formspreeId}`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
          body: JSON.stringify(form),
        });
        if (!res.ok) throw new Error();
      } else {
        // Save to inquiries table as fallback
        const res = await fetch('/api/inquiries', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(form),
        });
        if (!res.ok) throw new Error();
      }
      setStatus('sent');
      setForm({ name: '', email: '', message: '' });
    } catch {
      setStatus('error');
    }
  };

  if (status === 'sent') {
    return (
      <div className="card p-10 text-center space-y-3">
        <p className="text-4xl">✨</p>
        <p className="text-xl font-bold" style={{ color: '#3D2B1F', fontFamily: "'Lobster Two', cursive" }}>Message sent!</p>
        <p className="text-sm text-gray-500">I&apos;ll be in touch within 24 hours.</p>
        <button onClick={() => setStatus('idle')} className="btn-ghost text-sm mt-2">Send another</button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="card p-8 space-y-5">
      {status === 'error' && (
        <div className="bg-red-50 border border-red-200 text-red-700 rounded p-3 text-sm">
          Something went wrong — please try again or email me directly.
        </div>
      )}
      <div>
        <label>Your Name *</label>
        <input value={form.name} onChange={(e) => set('name', e.target.value)} required placeholder="Jane Smith" />
      </div>
      <div>
        <label>Email *</label>
        <input type="email" value={form.email} onChange={(e) => set('email', e.target.value)} required placeholder="jane@example.com" />
      </div>
      <div>
        <label>Message *</label>
        <textarea
          rows={5}
          value={form.message}
          onChange={(e) => set('message', e.target.value)}
          required
          placeholder="Tell me about your project…"
        />
      </div>
      <button type="submit" disabled={status === 'sending'} className="btn-primary w-full justify-center text-base py-3">
        {status === 'sending' ? 'Sending…' : 'Send Message'}
      </button>
    </form>
  );
}

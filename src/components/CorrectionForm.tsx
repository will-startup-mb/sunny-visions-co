'use client';

import { useState } from 'react';

export function CorrectionForm({ companyName }: { companyName: string }) {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [correction, setCorrection] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const subject = encodeURIComponent(`Correction suggestion: ${companyName}`);
    const body = encodeURIComponent(
      `Company: ${companyName}\nFrom: ${name} (${email})\n\nWhat needs correcting:\n${correction}`
    );
    window.open(`mailto:will@startupmb.com?subject=${subject}&body=${body}`);
    setSubmitted(true);
  };

  if (!open) {
    return (
      <button
        onClick={() => setOpen(true)}
        className="w-full justify-center inline-flex items-center gap-2 px-4 py-2 rounded-md text-sm font-semibold transition-colors"
        style={{ border: '1.5px solid #F26522', color: '#F26522', background: 'white' }}
        onMouseEnter={e => (e.currentTarget.style.background = '#fff5f0')}
        onMouseLeave={e => (e.currentTarget.style.background = 'white')}
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
          <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
        </svg>
        Suggest a correction
      </button>
    );
  }

  return (
    <div className="card p-6 max-w-md mx-auto text-left">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-bold text-base" style={{ color: '#1B3A52' }}>Suggest a Correction</h3>
        <button
          onClick={() => { setOpen(false); setSubmitted(false); }}
          className="text-gray-400 hover:text-gray-600 text-lg leading-none"
          aria-label="Close"
        >
          ×
        </button>
      </div>

      {submitted ? (
        <div className="text-center py-4 space-y-2">
          <p className="text-2xl">✅</p>
          <p className="font-medium text-sm" style={{ color: '#1B3A52' }}>Thanks for the tip!</p>
          <p className="text-xs text-gray-500">Your email client should have opened with the details pre-filled. Send it whenever you&apos;re ready.</p>
          <button
            onClick={() => { setOpen(false); setSubmitted(false); setName(''); setEmail(''); setCorrection(''); }}
            className="btn-ghost text-xs mt-2"
          >
            Close
          </button>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-3">
          <div>
            <label>Your Name</label>
            <input
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Jane Smith"
            />
          </div>
          <div>
            <label>Your Email</label>
            <input
              required
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="jane@example.com"
            />
          </div>
          <div>
            <label>What needs correcting?</label>
            <textarea
              required
              rows={4}
              value={correction}
              onChange={(e) => setCorrection(e.target.value)}
              placeholder="The company website is incorrect — it should be…"
            />
          </div>
          <div className="flex gap-3 pt-1">
            <button type="submit" className="btn-primary text-sm">Send Correction</button>
            <button type="button" onClick={() => setOpen(false)} className="btn-ghost text-sm">Cancel</button>
          </div>
        </form>
      )}
    </div>
  );
}

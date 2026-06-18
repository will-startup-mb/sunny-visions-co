'use client';

import { useState } from 'react';

export function SuggestCompanyForm() {
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({ companyName: '', website: '', description: '', yourName: '', yourEmail: '', _gotcha: '' });
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');

  const set = (field: keyof typeof form, value: string) =>
    setForm((prev) => ({ ...prev, [field]: value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError('');
    const res = await fetch('/api/suggestions', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        company_name: form.companyName,
        website: form.website || null,
        description: form.description || null,
        submitter_name: form.yourName,
        submitter_email: form.yourEmail,
        _gotcha: form._gotcha,
      }),
    });
    if (res.ok) {
      setSubmitted(true);
    } else {
      const data = await res.json().catch(() => ({}));
      setError(data.error || 'Something went wrong — please try again.');
    }
    setSubmitting(false);
  };

  const reset = () => {
    setOpen(false);
    setSubmitted(false);
    setError('');
    setForm({ companyName: '', website: '', description: '', yourName: '', yourEmail: '', _gotcha: '' });
  };

  if (!open) {
    return (
      <button
        onClick={() => setOpen(true)}
        className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-semibold transition-colors mt-4"
        style={{ backgroundColor: '#F26522', color: 'white' }}
        onMouseEnter={e => (e.currentTarget.style.backgroundColor = '#d9561e')}
        onMouseLeave={e => (e.currentTarget.style.backgroundColor = '#F26522')}
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="10"/>
          <line x1="12" y1="8" x2="12" y2="16"/>
          <line x1="8" y1="12" x2="16" y2="12"/>
        </svg>
        Suggest a Company
      </button>
    );
  }

  return (
    <div className="mt-4 max-w-xl mx-auto bg-white rounded-xl shadow-lg p-6 text-left">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-bold text-base" style={{ color: '#1B3A52' }}>Suggest a Company</h3>
        <button onClick={reset} className="text-gray-400 hover:text-gray-600 text-xl leading-none" aria-label="Close">×</button>
      </div>

      {submitted ? (
        <div className="text-center py-4 space-y-2">
          <p className="text-2xl">🎉</p>
          <p className="font-semibold text-sm" style={{ color: '#1B3A52' }}>Thanks for the suggestion!</p>
          <p className="text-xs text-gray-500">We&apos;ll review it and add it to the directory if it&apos;s a good fit.</p>
          <button onClick={reset} className="btn-ghost text-xs mt-2">Close</button>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-3">
          {error && <p className="text-xs text-red-600">{error}</p>}
          <div>
            <label>Company Name *</label>
            <input required value={form.companyName} onChange={e => set('companyName', e.target.value)} placeholder="Acme Corp" />
          </div>
          <div>
            <label>Website</label>
            <input type="url" value={form.website} onChange={e => set('website', e.target.value)} placeholder="https://" />
          </div>
          <div>
            <label>Brief Description <span className="text-gray-400 font-normal">(optional)</span></label>
            <textarea rows={2} value={form.description} onChange={e => set('description', e.target.value)} placeholder="What does this company do?" />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label>Your Name *</label>
              <input required value={form.yourName} onChange={e => set('yourName', e.target.value)} placeholder="Jane Smith" />
            </div>
            <div>
              <label>Your Email *</label>
              <input required type="email" value={form.yourEmail} onChange={e => set('yourEmail', e.target.value)} placeholder="jane@example.com" />
            </div>
          </div>
          {/* Honeypot — visually hidden, should remain empty for real users */}
          <div style={{ position: 'absolute', left: '-9999px', top: 'auto', width: '1px', height: '1px', overflow: 'hidden' }} aria-hidden="true">
            <input
              type="text"
              name="company_url"
              value={form._gotcha}
              onChange={e => set('_gotcha', e.target.value)}
              tabIndex={-1}
              autoComplete="off"
            />
          </div>
          <div className="flex gap-3 pt-1">
            <button type="submit" className="btn-primary text-sm" disabled={submitting}>
              {submitting ? 'Submitting…' : 'Submit Suggestion'}
            </button>
            <button type="button" onClick={reset} className="btn-ghost text-sm">Cancel</button>
          </div>
        </form>
      )}
    </div>
  );
}

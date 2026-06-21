'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function NewCompanyPage() {
  const router = useRouter();
  const [companyName, setCompanyName] = useState('');
  const [website, setWebsite] = useState('');
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError('');

    const res = await fetch('/api/companies', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ company_name: companyName, website }),
    });

    if (res.ok) {
      router.push('/mb-hub/companies');
      router.refresh();
    } else {
      let message = 'Save failed';
      try { const d = await res.json(); message = d.error || message; } catch { /* empty */ }
      setError(message);
      setSaving(false);
    }
  };

  return (
    <div className="p-6 max-w-lg mx-auto">
      <div className="flex items-center gap-3 mb-6">
        <Link href="/mb-hub/companies" className="text-sm" style={{ color: '#3A9E9E' }}>← Back</Link>
        <h1 className="text-xl font-extrabold" style={{ color: '#1B3A52' }}>Add Company</h1>
      </div>

      <div className="card p-6">
        <p className="text-sm text-gray-500 mb-5">
          Add a company name and website to create the record. Run the AI research pipeline afterwards to fill in the rest of the profile.
        </p>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 rounded p-3 text-sm mb-4">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label>Company Name *</label>
            <input
              required
              autoFocus
              value={companyName}
              onChange={(e) => setCompanyName(e.target.value)}
              placeholder="Acme Corp"
            />
          </div>
          <div>
            <label>Website *</label>
            <input
              required
              type="url"
              value={website}
              onChange={(e) => setWebsite(e.target.value)}
              placeholder="https://"
            />
          </div>
          <div className="flex gap-3 pt-2">
            <button type="submit" className="btn-primary" disabled={saving}>
              {saving ? 'Adding…' : 'Add Company'}
            </button>
            <Link href="/mb-hub/companies" className="btn-ghost">Cancel</Link>
          </div>
        </form>
      </div>
    </div>
  );
}

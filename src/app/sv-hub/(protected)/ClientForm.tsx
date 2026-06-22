'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import type { Client } from '@/lib/db/schema';

const SERVICE_TYPES = ['Video', 'Graphic Design', 'Photography', 'Wedding', 'Other'];
const STATUSES = ['Lead', 'Proposal Sent', 'Active', 'Complete', 'Lost'];

interface Props {
  client?: Client;
}

export function ClientForm({ client }: Props) {
  const router = useRouter();
  const isEdit = !!client;

  const [form, setForm] = useState({
    client_name: client?.client_name ?? '',
    email: client?.email ?? '',
    phone: client?.phone ?? '',
    service_type: client?.service_type ?? '',
    status: client?.status ?? 'Lead',
    project_value: client?.project_value?.toString() ?? '',
    project_description: client?.project_description ?? '',
    outreach_notes: client?.outreach_notes ?? '',
    last_contact_date: client?.last_contact_date ?? '',
    became_client: client?.became_client ?? false,
    portfolio_published: client?.portfolio_published ?? false,
  });

  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const set = (key: string, value: string | boolean) =>
    setForm((prev) => ({ ...prev, [key]: value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError('');
    try {
      const url = isEdit ? `/api/clients/${client!.id}` : '/api/clients';
      const res = await fetch(url, {
        method: isEdit ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      if (!res.ok) throw new Error();
      router.push('/sv-hub/clients');
      router.refresh();
    } catch {
      setError('Failed to save — try again');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm(`Delete ${client!.client_name}? This cannot be undone.`)) return;
    setSaving(true);
    try {
      await fetch(`/api/clients/${client!.id}`, { method: 'DELETE' });
      router.push('/sv-hub/clients');
      router.refresh();
    } catch {
      setError('Failed to delete');
    } finally {
      setSaving(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-2xl space-y-6">
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 rounded p-3 text-sm">{error}</div>
      )}

      <div className="card p-6 space-y-4">
        <h2 className="text-sm font-bold uppercase tracking-widest" style={{ color: '#5B9FA3' }}>Client Info</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label>Client Name *</label>
            <input value={form.client_name} onChange={(e) => set('client_name', e.target.value)} required />
          </div>
          <div>
            <label>Email</label>
            <input type="email" value={form.email} onChange={(e) => set('email', e.target.value)} />
          </div>
          <div>
            <label>Phone</label>
            <input value={form.phone} onChange={(e) => set('phone', e.target.value)} />
          </div>
          <div>
            <label>Service Type</label>
            <select value={form.service_type} onChange={(e) => set('service_type', e.target.value)}>
              <option value="">— Select —</option>
              {SERVICE_TYPES.map((s) => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>
          <div>
            <label>Status</label>
            <select value={form.status} onChange={(e) => set('status', e.target.value)}>
              {STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>
          <div>
            <label>Project Value ($)</label>
            <input type="number" step="0.01" value={form.project_value} onChange={(e) => set('project_value', e.target.value)} placeholder="0.00" />
          </div>
          <div>
            <label>Last Contact Date</label>
            <input type="date" value={form.last_contact_date} onChange={(e) => set('last_contact_date', e.target.value)} />
          </div>
        </div>
        <div>
          <label>Project Description</label>
          <textarea rows={3} value={form.project_description} onChange={(e) => set('project_description', e.target.value)} />
        </div>
        <div>
          <label>Outreach Notes</label>
          <textarea rows={3} value={form.outreach_notes} onChange={(e) => set('outreach_notes', e.target.value)} />
        </div>
        <div className="flex gap-6">
          <label className="flex items-center gap-2 text-sm normal-case tracking-normal font-medium">
            <input
              type="checkbox"
              checked={form.became_client}
              onChange={(e) => set('became_client', e.target.checked)}
              className="w-4 h-4"
              style={{ width: '1rem' }}
            />
            Became Client
          </label>
          <label className="flex items-center gap-2 text-sm normal-case tracking-normal font-medium">
            <input
              type="checkbox"
              checked={form.portfolio_published}
              onChange={(e) => set('portfolio_published', e.target.checked)}
              className="w-4 h-4"
              style={{ width: '1rem' }}
            />
            Portfolio Published
          </label>
        </div>
      </div>

      <div className="flex gap-3 items-center">
        <button type="submit" disabled={saving} className="btn-primary">
          {saving ? 'Saving…' : isEdit ? 'Save Changes' : 'Add Client'}
        </button>
        <button type="button" onClick={() => router.back()} className="btn-ghost">
          Cancel
        </button>
        {isEdit && (
          <button
            type="button"
            onClick={handleDelete}
            disabled={saving}
            className="ml-auto btn-ghost text-red-600 border-red-200 hover:bg-red-50"
          >
            Delete
          </button>
        )}
      </div>
    </form>
  );
}

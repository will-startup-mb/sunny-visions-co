'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import type { Client } from '@/lib/db/schema';

export default function NewExpensePage() {
  const router = useRouter();
  const [clients, setClients] = useState<Client[]>([]);
  const [form, setForm] = useState({ client_id: '', description: '', amount: '', cost_date: '' });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    fetch('/api/clients').then((r) => r.json()).then(setClients).catch(() => {});
  }, []);

  const set = (key: string, value: string) => setForm((prev) => ({ ...prev, [key]: value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError('');
    try {
      const res = await fetch('/api/project-costs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      if (!res.ok) throw new Error();
      router.push('/sv-hub/cost-tracker');
      router.refresh();
    } catch {
      setError('Failed to save — try again');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="p-4 md:p-6">
      <h1 className="text-xl font-extrabold mb-6" style={{ color: '#3D2B1F' }}>Add Expense</h1>
      <form onSubmit={handleSubmit} className="max-w-lg space-y-4 card p-6">
        {error && <div className="bg-red-50 border border-red-200 text-red-700 rounded p-3 text-sm">{error}</div>}
        <div>
          <label>Client</label>
          <select value={form.client_id} onChange={(e) => set('client_id', e.target.value)}>
            <option value="">— Select Client —</option>
            {clients.map((c) => <option key={c.id} value={c.id}>{c.client_name}</option>)}
          </select>
        </div>
        <div>
          <label>Description</label>
          <input value={form.description} onChange={(e) => set('description', e.target.value)} placeholder="What was this expense for?" />
        </div>
        <div>
          <label>Amount ($) *</label>
          <input type="number" step="0.01" min="0" value={form.amount} onChange={(e) => set('amount', e.target.value)} required placeholder="0.00" />
        </div>
        <div>
          <label>Date</label>
          <input type="date" value={form.cost_date} onChange={(e) => set('cost_date', e.target.value)} />
        </div>
        <div className="flex gap-3 pt-2">
          <button type="submit" disabled={saving} className="btn-primary">{saving ? 'Saving…' : 'Add Expense'}</button>
          <button type="button" onClick={() => router.back()} className="btn-ghost">Cancel</button>
        </div>
      </form>
    </div>
  );
}

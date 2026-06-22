'use client';

import { useState } from 'react';
import { applyNavOrder } from '@/lib/nav-items';

interface Props {
  initialOrder: string[];
}

export function NavOrderEditor({ initialOrder }: Props) {
  const [items, setItems] = useState(() => applyNavOrder(initialOrder));
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState('');

  function move(index: number, dir: -1 | 1) {
    const next = [...items];
    const target = index + dir;
    if (target < 0 || target >= next.length) return;
    [next[index], next[target]] = [next[target], next[index]];
    setItems(next);
    setSaved(false);
  }

  async function save() {
    setSaving(true);
    setError('');
    try {
      const res = await fetch('/api/nav-order', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ order: items.map((i) => i.href) }),
      });
      if (!res.ok) throw new Error();
      setSaved(true);
      setTimeout(() => setSaved(false), 2500);
    } catch {
      setError('Save failed. Try again.');
    } finally {
      setSaving(false);
    }
  }

  return (
    <div>
      <div className="flex items-center gap-3 mb-5">
        <div className="w-1 h-5 rounded-full flex-shrink-0" style={{ backgroundColor: '#E8521A' }} />
        <h2 className="text-base font-bold tracking-wide" style={{ color: '#3D2B1F' }}>Nav Order</h2>
      </div>
      <div className="pl-4 space-y-4">
        <div className="card p-5">
          <p className="text-xs text-gray-400 mb-4">Reorder sidebar nav items. Changes take effect on next page load.</p>
          <ol className="space-y-1.5">
            {items.map((item, i) => (
              <li key={item.href} className="flex items-center gap-3 px-3 py-2 rounded-md" style={{ backgroundColor: '#F5EFE0' }}>
                <span className="flex-1 text-sm font-medium" style={{ color: '#3D2B1F' }}>{item.label}</span>
                <div className="flex gap-1">
                  <button onClick={() => move(i, -1)} disabled={i === 0} aria-label={`Move ${item.label} up`}
                    className="p-1 rounded text-gray-400 hover:text-gray-700 disabled:opacity-20 disabled:cursor-not-allowed">
                    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="2,9 7,4 12,9" />
                    </svg>
                  </button>
                  <button onClick={() => move(i, 1)} disabled={i === items.length - 1} aria-label={`Move ${item.label} down`}
                    className="p-1 rounded text-gray-400 hover:text-gray-700 disabled:opacity-20 disabled:cursor-not-allowed">
                    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="2,5 7,10 12,5" />
                    </svg>
                  </button>
                </div>
              </li>
            ))}
          </ol>
          <div className="flex items-center gap-3 mt-4">
            <button onClick={save} disabled={saving}
              className="px-4 py-1.5 rounded-md text-sm font-medium text-white disabled:opacity-60"
              style={{ backgroundColor: saved ? '#5B9FA3' : '#3D2B1F' }}>
              {saving ? 'Saving…' : saved ? 'Saved!' : 'Save Order'}
            </button>
            {error && <span className="text-xs text-red-500">{error}</span>}
          </div>
        </div>
      </div>
    </div>
  );
}

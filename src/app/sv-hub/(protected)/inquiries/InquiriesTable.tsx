'use client';

import { useState } from 'react';
import type { Inquiry } from '@/lib/db/schema';

interface Props {
  inquiries: Inquiry[];
  status: string;
}

export function InquiriesTable({ inquiries, status }: Props) {
  const [items, setItems] = useState(inquiries);
  const [busy, setBusy] = useState<string | null>(null);

  const updateStatus = async (id: string, newStatus: string) => {
    setBusy(id);
    try {
      await fetch(`/api/inquiries/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      });
      setItems((prev) => prev.filter((i) => i.id !== id));
    } finally {
      setBusy(null);
    }
  };

  if (items.length === 0) {
    return (
      <div className="card p-8 text-center text-gray-400 text-sm">
        No {status.toLowerCase()} inquiries
      </div>
    );
  }

  return (
    <div className="card overflow-hidden">
      <ul className="divide-y divide-gray-100">
        {items.map((item) => (
          <li key={item.id} className="px-5 py-4">
            <div className="flex items-start justify-between gap-4">
              <div className="min-w-0 flex-1">
                <p className="font-semibold text-sm" style={{ color: '#3D2B1F' }}>{item.name}</p>
                <a href={`mailto:${item.email}`} className="text-xs hover:underline" style={{ color: '#5B9FA3' }}>
                  {item.email}
                </a>
                <p className="text-sm text-gray-600 mt-2 leading-relaxed">{item.message}</p>
                <p className="text-xs text-gray-400 mt-2">
                  {new Date(item.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric', hour: 'numeric', minute: '2-digit' })}
                </p>
              </div>
              <div className="flex flex-col gap-1.5 flex-shrink-0">
                {status === 'New' && (
                  <>
                    <a
                      href={`mailto:${item.email}?subject=Re: Your inquiry`}
                      onClick={() => updateStatus(item.id, 'Replied')}
                      className="action-btn text-xs px-2 py-1"
                      style={{ color: '#E8521A', borderColor: '#E8521A' }}
                    >
                      Reply
                    </a>
                    <button
                      onClick={() => updateStatus(item.id, 'Reviewed')}
                      disabled={busy === item.id}
                      className="action-btn text-xs"
                    >
                      {busy === item.id ? '…' : 'Mark Reviewed'}
                    </button>
                  </>
                )}
                {status === 'Reviewed' && (
                  <button
                    onClick={() => updateStatus(item.id, 'Replied')}
                    disabled={busy === item.id}
                    className="action-btn text-xs"
                  >
                    {busy === item.id ? '…' : 'Mark Replied'}
                  </button>
                )}
              </div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

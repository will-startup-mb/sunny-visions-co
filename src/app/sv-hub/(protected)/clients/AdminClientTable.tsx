'use client';

import { useState } from 'react';
import Link from 'next/link';
import type { Client } from '@/lib/db/schema';

const STATUS_COLORS: Record<string, string> = {
  Lead: 'bg-amber-50 text-amber-700',
  'Proposal Sent': 'bg-blue-50 text-blue-700',
  Active: 'bg-emerald-50 text-emerald-700',
  Complete: 'bg-gray-100 text-gray-600',
  Lost: 'bg-red-50 text-red-500',
};

interface Props {
  clients: Client[];
}

export function AdminClientTable({ clients }: Props) {
  const [search, setSearch] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [filterService, setFilterService] = useState('');

  const filtered = clients.filter((c) => {
    const q = search.toLowerCase();
    const matchSearch = !q || c.client_name.toLowerCase().includes(q) || (c.email ?? '').toLowerCase().includes(q);
    const matchStatus = !filterStatus || c.status === filterStatus;
    const matchService = !filterService || c.service_type === filterService;
    return matchSearch && matchStatus && matchService;
  });

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-3">
        <input
          type="text"
          placeholder="Search clients…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="text-sm"
          style={{ width: '220px' }}
        />
        <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)} className="text-sm" style={{ width: 'auto' }}>
          <option value="">All Statuses</option>
          {['Lead', 'Proposal Sent', 'Active', 'Complete', 'Lost'].map((s) => (
            <option key={s} value={s}>{s}</option>
          ))}
        </select>
        <select value={filterService} onChange={(e) => setFilterService(e.target.value)} className="text-sm" style={{ width: 'auto' }}>
          <option value="">All Services</option>
          {['Video', 'Graphic Design', 'Photography', 'Wedding', 'Other'].map((s) => (
            <option key={s} value={s}>{s}</option>
          ))}
        </select>
      </div>

      {filtered.length === 0 ? (
        <div className="card p-8 text-center text-gray-400 text-sm">No clients found</div>
      ) : (
        <div className="card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm" style={{ minWidth: '700px' }}>
              <thead>
                <tr className="border-b border-gray-200" style={{ backgroundColor: '#F5EFE0' }}>
                  {['Client', 'Service', 'Status', 'Value', 'Last Contact', 'Portfolio', ''].map((h) => (
                    <th key={h} className="text-left px-4 py-3 text-xs font-bold uppercase tracking-wide text-gray-500">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtered.map((c) => (
                  <tr key={c.id} className="border-b border-gray-100 hover:bg-amber-50/20">
                    <td className="px-4 py-3">
                      <div className="font-semibold text-sm" style={{ color: '#3D2B1F' }}>{c.client_name}</div>
                      {c.email && <div className="text-xs text-gray-400">{c.email}</div>}
                      {c.phone && <div className="text-xs text-gray-400">{c.phone}</div>}
                    </td>
                    <td className="px-4 py-3 text-xs text-gray-600">{c.service_type ?? '—'}</td>
                    <td className="px-4 py-3">
                      <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${STATUS_COLORS[c.status ?? ''] ?? 'bg-gray-100 text-gray-500'}`}>
                        {c.status ?? '—'}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-xs font-medium tabular-nums" style={{ color: '#3D2B1F' }}>
                      {c.project_value ? `$${Number(c.project_value).toLocaleString()}` : '—'}
                    </td>
                    <td className="px-4 py-3 text-xs text-gray-500">
                      {c.last_contact_date ?? '—'}
                    </td>
                    <td className="px-4 py-3">
                      {c.portfolio_published ? (
                        <span className="text-xs text-emerald-600 font-medium">Published</span>
                      ) : (
                        <span className="text-xs text-gray-400">Draft</span>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      <Link href={`/sv-hub/clients/${c.id}/edit`} className="action-btn text-xs">
                        Edit
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}

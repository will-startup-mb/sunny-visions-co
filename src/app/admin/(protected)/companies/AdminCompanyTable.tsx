'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import type { Company } from '@/lib/db/schema';
import { ScoreBadge } from '@/components/ScoreBadge';
import { FOUNDER_STATUSES, INTERVIEW_PRIORITIES } from '@/lib/constants';

interface Props {
  companies: Company[];
  queuedIds?: Set<string>;
  onToggleQueue?: (company: Company) => void;
}

export function AdminCompanyTable({ companies, queuedIds, onToggleQueue }: Props) {
  const router = useRouter();
  const [loadingId, setLoadingId] = useState<string | null>(null);

  const handlePublishToggle = async (company: Company) => {
    setLoadingId(company.id);
    await fetch(`/api/companies/${company.id}/publish`, { method: 'POST' });
    router.refresh();
    setLoadingId(null);
  };

  const handleDelete = async (company: Company) => {
    if (!confirm(`Delete "${company.company_name}"? This cannot be undone.`)) return;
    setLoadingId(company.id);
    await fetch(`/api/companies/${company.id}`, { method: 'DELETE' });
    router.refresh();
    setLoadingId(null);
  };

  const handleInlineUpdate = async (id: string, field: string, value: string) => {
    await fetch(`/api/companies/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ [field]: value }),
    });
    router.refresh();
  };

  if (companies.length === 0) {
    return (
      <div className="card p-12 text-center text-gray-500">
        <p className="text-lg font-medium">No companies yet</p>
        <p className="text-sm mt-1">Add your first company or import from CSV.</p>
      </div>
    );
  }

  return (
    <div className="card overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-sm" style={{ minWidth: '900px' }}>
          <thead>
            <tr className="border-b border-gray-200" style={{ backgroundColor: '#F4F8FB' }}>
              {['Company', 'Industry', 'Stage', 'Priority', 'Status', 'Scores', 'Research Date', 'Pub', 'Actions'].map((h) => (
                <th key={h} className="text-left px-4 py-3 text-xs font-bold uppercase tracking-wide text-gray-500">
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {companies.map((company) => {
              const isLoading = loadingId === company.id;
              return (
                <tr
                  key={company.id}
                  className={`border-b border-gray-100 hover:bg-blue-50/30 transition-colors ${isLoading ? 'opacity-50' : ''}`}
                >
                  {/* Company name + website */}
                  <td className="px-4 py-3">
                    <div className="font-semibold" style={{ color: '#1B3A52' }}>{company.company_name}</div>
                    {company.website && (
                      <a
                        href={company.website}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-xs text-gray-400 hover:underline truncate block max-w-[150px]"
                      >
                        {company.website.replace(/^https?:\/\//, '')}
                      </a>
                    )}
                  </td>

                  {/* Industry */}
                  <td className="px-4 py-3">
                    {company.primary_industry && (
                      <span className="badge-teal text-xs">{company.primary_industry}</span>
                    )}
                  </td>

                  {/* Stage */}
                  <td className="px-4 py-3 text-xs text-gray-600">{company.stage || '—'}</td>

                  {/* Priority — inline select */}
                  <td className="px-4 py-3">
                    <select
                      value={company.interview_priority || ''}
                      onChange={(e) => handleInlineUpdate(company.id, 'interview_priority', e.target.value)}
                      className="text-xs py-0.5 border-0 bg-transparent focus:ring-0 cursor-pointer"
                      style={{ width: 'auto', padding: '2px 4px' }}
                    >
                      <option value="">—</option>
                      {INTERVIEW_PRIORITIES.map((p) => (
                        <option key={p} value={p}>{p}</option>
                      ))}
                    </select>
                  </td>

                  {/* Founder status — inline select */}
                  <td className="px-4 py-3">
                    <select
                      value={company.founder_status || ''}
                      onChange={(e) => handleInlineUpdate(company.id, 'founder_status', e.target.value)}
                      className="text-xs py-0.5 border-0 bg-transparent focus:ring-0 cursor-pointer"
                      style={{ width: 'auto', padding: '2px 4px' }}
                    >
                      {FOUNDER_STATUSES.map((s) => (
                        <option key={s} value={s}>{s}</option>
                      ))}
                    </select>
                  </td>

                  {/* Scores */}
                  <td className="px-4 py-3">
                    <div className="flex gap-1 flex-wrap">
                      <ScoreBadge label="I" value={company.innovation_score} />
                      <ScoreBadge label="O" value={company.opportunity_score} />
                    </div>
                  </td>

                  {/* Research date */}
                  <td className="px-4 py-3 text-xs text-gray-500">
                    {company.research_date || (
                      <span className="text-amber-500">No research</span>
                    )}
                  </td>

                  {/* Published toggle */}
                  <td className="px-4 py-3">
                    <button
                      onClick={() => handlePublishToggle(company)}
                      className={`w-8 h-4 rounded-full relative transition-colors ${
                        company.is_published ? 'bg-emerald-500' : 'bg-gray-300'
                      }`}
                      title={company.is_published ? 'Published — click to unpublish' : 'Unpublished — click to publish'}
                    >
                      <span
                        className={`absolute top-0.5 w-3 h-3 bg-white rounded-full shadow transition-transform ${
                          company.is_published ? 'translate-x-4' : 'translate-x-0.5'
                        }`}
                      />
                    </button>
                  </td>

                  {/* Actions */}
                  <td className="px-4 py-3">
                    <div className="flex gap-1">
                      {onToggleQueue && (
                        <button
                          onClick={() => onToggleQueue(company)}
                          className={`text-xs py-1 px-2 rounded font-medium transition-colors ${
                            queuedIds?.has(company.id)
                              ? 'text-white'
                              : 'btn-ghost'
                          }`}
                          style={queuedIds?.has(company.id) ? { backgroundColor: '#3A9E9E', color: 'white' } : {}}
                          title={queuedIds?.has(company.id) ? 'Remove from queue' : 'Add to research queue'}
                        >
                          {queuedIds?.has(company.id) ? '✓ Queued' : '+ Queue'}
                        </button>
                      )}
                      <Link
                        href={`/admin/companies/${company.id}/research`}
                        className="btn-ghost text-xs py-1 px-2"
                        title="Run AI research"
                      >
                        🔬
                      </Link>
                      <Link
                        href={`/admin/companies/${company.id}`}
                        className="btn-ghost text-xs py-1 px-2"
                        title="View full profile"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
                          <circle cx="12" cy="12" r="3"/>
                        </svg>
                      </Link>
                      <Link
                        href={`/admin/companies/${company.id}/edit`}
                        className="btn-ghost text-xs py-1 px-2"
                        title="Edit"
                      >
                        ✏️
                      </Link>
                      <button
                        onClick={() => handleDelete(company)}
                        className="btn-ghost text-xs py-1 px-2 text-red-500 hover:bg-red-50"
                        title="Delete"
                      >
                        🗑
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';
import type { Suggestion } from '@/lib/db/schema';

export function SuggestionsTable({ suggestions }: { suggestions: Suggestion[] }) {
  const router = useRouter();
  const [loadingId, setLoadingId] = useState<string | null>(null);

  const handleAccept = async (s: Suggestion) => {
    if (!confirm(`Add "${s.company_name}" to the database?`)) return;
    setLoadingId(s.id);
    await fetch(`/api/suggestions/${s.id}/accept`, { method: 'POST' });
    router.refresh();
    setLoadingId(null);
  };

  const handleDismiss = async (s: Suggestion) => {
    if (!confirm(`Dismiss suggestion for "${s.company_name}"?`)) return;
    setLoadingId(s.id);
    await fetch(`/api/suggestions/${s.id}`, { method: 'DELETE' });
    router.refresh();
    setLoadingId(null);
  };

  if (suggestions.length === 0) {
    return (
      <div className="card p-12 text-center text-gray-500">
        <p className="text-4xl mb-4">📭</p>
        <p className="text-lg font-medium">No suggestions yet</p>
        <p className="text-sm mt-1">Submissions from the public directory will appear here.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {suggestions.map((s) => {
        const isLoading = loadingId === s.id;
        return (
          <div
            key={s.id}
            className={`card p-5 transition-opacity ${isLoading ? 'opacity-40 pointer-events-none' : ''}`}
          >
            <div className="flex items-start justify-between gap-4">
              {/* Left: company info */}
              <div className="flex-1 min-w-0">
                <div className="flex items-baseline gap-3 flex-wrap">
                  <h2 className="font-bold text-base" style={{ color: '#1B3A52' }}>{s.company_name}</h2>
                  {s.website && (
                    <a
                      href={s.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs text-gray-400 hover:underline truncate max-w-[200px]"
                    >
                      {s.website.replace(/^https?:\/\//, '')}
                    </a>
                  )}
                </div>
                {s.description && (
                  <p className="text-sm text-gray-600 mt-1 leading-relaxed">{s.description}</p>
                )}
                <div className="flex flex-wrap gap-x-4 gap-y-1 mt-3 text-xs text-gray-500">
                  <span>
                    Submitted by{' '}
                    <span className="font-medium text-gray-700">{s.submitter_name}</span>
                    {' · '}
                    <a href={`mailto:${s.submitter_email}`} className="hover:underline">{s.submitter_email}</a>
                  </span>
                  <span>{new Date(s.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                </div>
              </div>

              {/* Right: actions */}
              <div className="flex gap-2 flex-shrink-0">
                <button
                  onClick={() => handleAccept(s)}
                  className="text-sm px-3 py-1.5 rounded font-semibold text-white transition-colors"
                  style={{ backgroundColor: '#1B3A52' }}
                  onMouseEnter={e => (e.currentTarget.style.backgroundColor = '#142d40')}
                  onMouseLeave={e => (e.currentTarget.style.backgroundColor = '#1B3A52')}
                  title="Add to company database"
                >
                  + Add to Database
                </button>
                <button
                  onClick={() => handleDismiss(s)}
                  className="btn-ghost text-sm py-1.5 text-gray-500 hover:text-red-600 hover:bg-red-50"
                  title="Dismiss suggestion"
                >
                  Dismiss
                </button>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

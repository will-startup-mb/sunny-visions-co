'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import type { Company } from '@/lib/db/schema';
import { AdminCompanyTable } from './AdminCompanyTable';

type RunStatus = 'pending' | 'running' | 'success' | 'failed';
interface RunResult { company: Company; status: RunStatus; error?: string }

const COST_LOW = 0.50;
const COST_HIGH = 0.75;

export function QueueManager({ companies }: { companies: Company[] }) {
  const router = useRouter();
  const [queue, setQueue] = useState<Company[]>([]);
  const [running, setRunning] = useState(false);
  const [results, setResults] = useState<RunResult[]>([]);
  const [currentIdx, setCurrentIdx] = useState<number>(-1);

  // Warn on browser-level navigation while queue is running
  useEffect(() => {
    if (!running) return;
    const handler = (e: BeforeUnloadEvent) => { e.preventDefault(); e.returnValue = ''; };
    window.addEventListener('beforeunload', handler);
    return () => window.removeEventListener('beforeunload', handler);
  }, [running]);

  const toggleQueue = useCallback((company: Company) => {
    setQueue((prev) =>
      prev.find((c) => c.id === company.id)
        ? prev.filter((c) => c.id !== company.id)
        : [...prev, company]
    );
  }, []);

  const queuedIds = new Set(queue.map((c) => c.id));

  const runAll = async () => {
    if (queue.length === 0) return;
    const low = (queue.length * COST_LOW).toFixed(2);
    const high = (queue.length * COST_HIGH).toFixed(2);
    const ok = window.confirm(
      `Running ${queue.length} ${queue.length === 1 ? 'company' : 'companies'} will use approximately $${low}–$${high} in API credits.\n\nContinue?`
    );
    if (!ok) return;

    setRunning(true);
    setCurrentIdx(0);
    const initialResults: RunResult[] = queue.map((c) => ({ company: c, status: 'pending' }));
    setResults(initialResults);

    for (let i = 0; i < queue.length; i++) {
      const company = queue[i];
      setCurrentIdx(i);
      setResults((prev) => prev.map((r, idx) => idx === i ? { ...r, status: 'running' } : r));

      try {
        const res = await fetch(`/api/companies/${company.id}/research`, { method: 'POST' });
        const json = await res.json();

        if (res.ok && json.data) {
          const today = new Date().toISOString().split('T')[0];
          await fetch(`/api/companies/${company.id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ ...json.data, research_date: today }),
          });
          setResults((prev) => prev.map((r, idx) => idx === i ? { ...r, status: 'success' } : r));
        } else {
          setResults((prev) => prev.map((r, idx) => idx === i ? { ...r, status: 'failed', error: json.error } : r));
        }
      } catch {
        setResults((prev) => prev.map((r, idx) => idx === i ? { ...r, status: 'failed', error: 'Network error' } : r));
      }
    }

    setRunning(false);
    setCurrentIdx(-1);
    setQueue([]);
    router.refresh();
  };

  const clearQueue = () => { setQueue([]); setResults([]); };

  const succeeded = results.filter((r) => r.status === 'success').length;
  const failed = results.filter((r) => r.status === 'failed').length;
  const done = !running && results.length > 0;

  return (
    <div className="space-y-4">
      {/* Queue panel */}
      {(queue.length > 0 || results.length > 0) && (
        <div className="card p-5 border-2" style={{ borderColor: '#3A9E9E' }}>
          <div className="flex items-center justify-between mb-3">
            <h2 className="font-bold text-sm" style={{ color: '#1B3A52' }}>
              Research Queue
              {queue.length > 0 && (
                <span className="ml-2 px-2 py-0.5 rounded-full text-white text-xs" style={{ backgroundColor: '#3A9E9E' }}>
                  {queue.length}
                </span>
              )}
            </h2>
            <div className="flex gap-2">
              {!running && queue.length > 0 && (
                <>
                  <button onClick={runAll} className="btn-primary text-sm py-1.5">
                    ▶ Run All Queued
                  </button>
                  <button onClick={clearQueue} className="btn-ghost text-sm py-1.5">
                    Clear
                  </button>
                </>
              )}
              {done && (
                <button onClick={clearQueue} className="btn-ghost text-sm py-1.5">
                  Dismiss
                </button>
              )}
            </div>
          </div>

          {/* Cost estimate preview */}
          {queue.length > 0 && !running && !done && (
            <p className="text-xs text-gray-500 mb-3">
              Estimated cost: ${(queue.length * COST_LOW).toFixed(2)}–${(queue.length * COST_HIGH).toFixed(2)} in API credits
            </p>
          )}

          {/* Queued company list (pre-run) */}
          {queue.length > 0 && !running && !done && (
            <div className="flex flex-wrap gap-2">
              {queue.map((c) => (
                <span
                  key={c.id}
                  className="inline-flex items-center gap-1.5 text-xs px-2.5 py-1 rounded-full"
                  style={{ backgroundColor: '#e0f2f2', color: '#1B3A52' }}
                >
                  {c.company_name}
                  <button
                    onClick={() => toggleQueue(c)}
                    className="text-gray-400 hover:text-red-500 leading-none"
                    aria-label="Remove"
                  >×</button>
                </span>
              ))}
            </div>
          )}

          {/* Progress during run */}
          {(running || done) && results.length > 0 && (
            <div className="space-y-1.5">
              {running && (
                <p className="text-xs text-gray-500 mb-2">
                  Processing {currentIdx + 1} of {results.length}…
                </p>
              )}
              {done && (
                <p className="text-xs font-semibold mb-2" style={{ color: '#1B3A52' }}>
                  Complete — {succeeded} succeeded{failed > 0 ? `, ${failed} failed` : ''}
                </p>
              )}
              {results.map((r) => (
                <div key={r.company.id} className="flex items-center gap-2 text-sm">
                  <span className="w-4 text-center flex-shrink-0">
                    {r.status === 'pending' && <span className="text-gray-300">○</span>}
                    {r.status === 'running' && (
                      <svg className="animate-spin w-4 h-4 text-teal-500" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                      </svg>
                    )}
                    {r.status === 'success' && <span className="text-emerald-500">✓</span>}
                    {r.status === 'failed' && <span className="text-red-500">✗</span>}
                  </span>
                  <span className={r.status === 'pending' ? 'text-gray-400' : 'text-gray-700'}>
                    {r.company.company_name}
                  </span>
                  {r.status === 'failed' && r.error && (
                    <span className="text-xs text-red-400 truncate">{r.error}</span>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Table */}
      <AdminCompanyTable
        companies={companies}
        queuedIds={queuedIds}
        onToggleQueue={running ? undefined : toggleQueue}
      />
    </div>
  );
}

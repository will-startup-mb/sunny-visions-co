'use client';

import { useState, useEffect, useCallback, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import type { Company } from '@/lib/db/schema';
import { AdminCompanyTable } from './AdminCompanyTable';

const BATCH_QUEUE_KEY = 'startupmb_batch_queue';
const BATCH_JOBS_KEY  = 'startupmb_batch_jobs';

const FALLBACK_INSTANT = 0.10;
const FALLBACK_BATCH   = 0.05;

interface BatchCompany { id: string; company_name: string; website: string | null }

interface Props {
  companies: Company[];
  instantAvgCost: number;
  batchAvgCost: number;
  instantCount: number;
  batchCount: number;
}

function costLabel(avg: number, count: number, type: 'instant' | 'batch', fallback: number): string {
  if (count === 0) return `Est. $${fallback.toFixed(2)} per company (default estimate — no ${type} runs yet)`;
  const label = type === 'instant' ? 'instant' : 'batch';
  return `Est. $${avg.toFixed(2)} per company based on your last ${count} ${label} run${count !== 1 ? 's' : ''}`;
}

export function QueueManager({ companies, instantAvgCost, batchAvgCost, instantCount, batchCount }: Props) {
  const router = useRouter();

  const [queue, setQueue] = useState<Company[]>([]);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  const [batchQueue, setBatchQueue] = useState<BatchCompany[]>([]);

  useEffect(() => {
    const stored = localStorage.getItem(BATCH_QUEUE_KEY);
    if (stored) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      try { setBatchQueue(JSON.parse(stored)); } catch {}
    }
  }, []);

  const toggleQueue = useCallback((company: Company) => {
    setQueue((prev) =>
      prev.find((c) => c.id === company.id)
        ? prev.filter((c) => c.id !== company.id)
        : [...prev, company]
    );
  }, []);

  const toggleBatchQueue = useCallback((company: Company) => {
    setBatchQueue((prev) => {
      const exists = prev.find((c) => c.id === company.id);
      const updated = exists
        ? prev.filter((c) => c.id !== company.id)
        : [...prev, { id: company.id, company_name: company.company_name, website: company.website ?? null }];
      localStorage.setItem(BATCH_QUEUE_KEY, JSON.stringify(updated));
      return updated;
    });
  }, []);

  const queuedIds      = new Set(queue.map((c) => c.id));
  const batchQueuedIds = useMemo(() => new Set(batchQueue.map((c) => c.id)), [batchQueue]);

  const instantTotal = (queue.length * instantAvgCost).toFixed(2);
  const batchTotal   = (batchQueue.length * batchAvgCost).toFixed(2);

  const submitBatch = async () => {
    if (queue.length === 0) return;

    const ok = window.confirm(
      `Submit ${queue.length} ${queue.length === 1 ? 'company' : 'companies'} as an Anthropic batch?\n\n` +
      `Estimated cost: $${instantTotal} total (~$${instantAvgCost.toFixed(2)} per company)\n\n` +
      `Results auto-populate company fields in ~15–60 minutes.`
    );
    if (!ok) return;

    setSubmitting(true);
    setError('');

    try {
      const res = await fetch('/api/research/batch', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ companyIds: queue.map((c) => c.id) }),
      });

      const data = await res.json() as { batchJobId?: string; error?: string };
      if (!res.ok || !data.batchJobId) throw new Error(data.error || 'Batch submission failed');

      const newJob = {
        batchJobId: data.batchJobId,
        status: 'pending',
        totalCompanies: queue.length,
        completedCompanies: 0,
        companies: queue.map((c) => ({ id: c.id, company_name: c.company_name, website: c.website ?? null })),
        submittedAt: new Date().toISOString(),
      };
      const existingJobs = JSON.parse(localStorage.getItem(BATCH_JOBS_KEY) || '[]');
      localStorage.setItem(BATCH_JOBS_KEY, JSON.stringify([newJob, ...existingJobs].slice(0, 20)));

      setQueue([]);
      router.push('/mb-hub/batch-research');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Batch submission failed');
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-4">
      {/* Batch queue callout */}
      {batchQueue.length > 0 && (
        <p className="text-xs font-semibold text-orange-600 uppercase tracking-wide">Batch Research — 50% cheaper, results within 24hrs.</p>
      )}
      {batchQueue.length > 0 && (
        <div
          className="px-4 py-3 rounded-lg text-sm"
          style={{ backgroundColor: '#fff7ed', border: '1px solid #F26522' }}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-base">📦</span>
              <span className="font-medium" style={{ color: '#c2410c' }}>
                {batchQueue.length} {batchQueue.length === 1 ? 'company' : 'companies'} in batch queue
              </span>
              <span className="text-xs text-orange-600">
                ({batchQueue.map((c) => c.company_name).slice(0, 3).join(', ')}
                {batchQueue.length > 3 ? ` +${batchQueue.length - 3} more` : ''})
              </span>
            </div>
            <Link
              href="/mb-hub/batch-research"
              className="text-xs font-semibold px-3 py-1.5 rounded transition-colors"
              style={{ backgroundColor: '#F26522', color: 'white' }}
            >
              Submit Batch →
            </Link>
          </div>
          <p className="text-xs text-orange-500 mt-1.5 ml-6">
            {costLabel(batchAvgCost, batchCount, 'batch', FALLBACK_BATCH)}
            {batchQueue.length > 1 && ` · $${batchTotal} total`}
          </p>
        </div>
      )}

      {/* Instant queue panel */}
      {queue.length > 0 && (
        <p className="text-xs font-semibold uppercase tracking-wide" style={{ color: '#3A9E9E' }}>Instant Research — runs now, results immediate.</p>
      )}
      {queue.length > 0 && (
        <div className="card p-5 border-2" style={{ borderColor: '#3A9E9E' }}>
          <div className="flex items-center justify-between mb-3">
            <div>
              <h2 className="font-bold text-sm" style={{ color: '#1B3A52' }}>
                Research Queue
                <span className="ml-2 px-2 py-0.5 rounded-full text-white text-xs" style={{ backgroundColor: '#3A9E9E' }}>
                  {queue.length}
                </span>
              </h2>
              <p className="text-xs text-gray-500 mt-0.5">
                {costLabel(instantAvgCost, instantCount, 'instant', FALLBACK_INSTANT)}
                {queue.length > 1 && ` · $${instantTotal} total`}
              </p>
            </div>
            <div className="flex gap-2">
              <button
                onClick={submitBatch}
                disabled={submitting}
                className="btn-primary text-sm py-1.5"
              >
                {submitting ? (
                  <span className="flex items-center gap-2">
                    <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                    </svg>
                    Submitting…
                  </span>
                ) : '▶ Run All Queued'}
              </button>
              <button
                onClick={() => { setQueue([]); setError(''); }}
                className="btn-ghost text-sm py-1.5"
              >
                Clear
              </button>
            </div>
          </div>

          {error && (
            <div className="mb-3 text-xs text-red-600 bg-red-50 border border-red-200 rounded p-2">
              {error}
            </div>
          )}

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
                >
                  ×
                </button>
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Company table */}
      <AdminCompanyTable
        companies={companies}
        queuedIds={queuedIds}
        onToggleQueue={submitting ? undefined : toggleQueue}
        batchQueuedIds={batchQueuedIds}
        onToggleBatchQueue={toggleBatchQueue}
      />
    </div>
  );
}

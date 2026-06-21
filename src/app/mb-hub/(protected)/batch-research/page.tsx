'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import Link from 'next/link';

const BATCH_QUEUE_KEY = 'startupmb_batch_queue';
const BATCH_JOBS_KEY = 'startupmb_batch_jobs';

const COST_LOW = 0.05;
const COST_HIGH = 0.10;

type BatchStatus = 'pending' | 'processing' | 'complete' | 'failed';

interface QueuedCompany {
  id: string;
  company_name: string;
  website: string | null;
}

interface BatchJobRecord {
  batchJobId: string;
  status: BatchStatus;
  totalCompanies: number;
  completedCompanies: number;
  estimatedCost?: string;
  companies: QueuedCompany[];
  submittedAt: string;
  completedAt?: string;
}

const STATUS_STYLES: Record<BatchStatus, string> = {
  pending: 'border-amber-200 bg-amber-50 text-amber-800',
  processing: 'border-blue-200 bg-blue-50 text-blue-800',
  complete: 'border-emerald-200 bg-emerald-50 text-emerald-800',
  failed: 'border-red-200 bg-red-50 text-red-700',
};

const STATUS_LABEL: Record<BatchStatus, string> = {
  pending: 'Pending — queued with Anthropic',
  processing: 'Processing',
  complete: 'Complete',
  failed: 'Failed',
};

const persistJobs = (updated: BatchJobRecord[]) => {
  localStorage.setItem(BATCH_JOBS_KEY, JSON.stringify(updated.slice(0, 20)));
};

export default function BatchResearchPage() {
  const [mounted, setMounted] = useState(false);
  const [queue, setQueue] = useState<QueuedCompany[]>([]);
  const [jobs, setJobs] = useState<BatchJobRecord[]>([]);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const pollTimers = useRef<Map<string, ReturnType<typeof setTimeout>>>(new Map());

  // Use a ref so the recursive setTimeout can call the latest version without hoisting issues
  const pollJobRef = useRef<((jobId: string) => Promise<void>) | null>(null);

  const pollJob = useCallback(async (jobId: string) => {
    try {
      const res = await fetch(`/api/research/batch/${jobId}`);
      const data = await res.json() as Partial<BatchJobRecord> & { status: BatchStatus };

      setJobs((prev) => {
        const updated = prev.map((j) =>
          j.batchJobId === jobId
            ? {
                ...j,
                ...data,
                completedAt:
                  data.status === 'complete' || data.status === 'failed'
                    ? (j.completedAt ?? new Date().toISOString())
                    : j.completedAt,
              }
            : j
        );
        persistJobs(updated);
        return updated;
      });

      if (data.status !== 'complete' && data.status !== 'failed') {
        const t = setTimeout(() => pollJobRef.current?.(jobId), 30_000);
        pollTimers.current.set(jobId, t);
      } else {
        pollTimers.current.delete(jobId);
      }
    } catch {
      const t = setTimeout(() => pollJobRef.current?.(jobId), 30_000);
      pollTimers.current.set(jobId, t);
    }
  }, []);

  // Sync ref after each render so recursive setTimeout calls use the stable reference
  useEffect(() => { pollJobRef.current = pollJob; }, [pollJob]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMounted(true);

    const storedQueue = localStorage.getItem(BATCH_QUEUE_KEY);
    if (storedQueue) {
      try { setQueue(JSON.parse(storedQueue)); } catch {}
    }

    const storedJobs = localStorage.getItem(BATCH_JOBS_KEY);
    if (storedJobs) {
      try {
        const parsed: BatchJobRecord[] = JSON.parse(storedJobs);
        setJobs(parsed);
        const timers = pollTimers.current;
        parsed.forEach((job) => {
          if (job.status === 'pending' || job.status === 'processing') {
            const t = setTimeout(() => pollJobRef.current?.(job.batchJobId), 8_000);
            timers.set(job.batchJobId, t);
          }
        });
      } catch {}
    }

    const timers = pollTimers.current;
    return () => { timers.forEach((t) => clearTimeout(t)); };
  }, [pollJob]);

  const removeFromQueue = (id: string) => {
    setQueue((prev) => {
      const updated = prev.filter((c) => c.id !== id);
      localStorage.setItem(BATCH_QUEUE_KEY, JSON.stringify(updated));
      return updated;
    });
  };

  const clearQueue = () => {
    setQueue([]);
    localStorage.removeItem(BATCH_QUEUE_KEY);
  };

  const submitBatch = async () => {
    if (queue.length === 0) return;

    const low = (queue.length * COST_LOW).toFixed(2);
    const high = (queue.length * COST_HIGH).toFixed(2);
    const ok = window.confirm(
      `Submit ${queue.length} ${queue.length === 1 ? 'company' : 'companies'} to Anthropic Batch API?\n\nEstimated cost: $${low}–$${high} (~$0.05–$0.10 per company, 50% off real-time)\n\nResults will auto-populate company fields in ~15–60 minutes.`
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
      if (!res.ok || !data.batchJobId) throw new Error(data.error || 'Submission failed');

      const newJob: BatchJobRecord = {
        batchJobId: data.batchJobId,
        status: 'pending',
        totalCompanies: queue.length,
        completedCompanies: 0,
        companies: queue,
        submittedAt: new Date().toISOString(),
      };

      setJobs((prev) => {
        const updated = [newJob, ...prev];
        persistJobs(updated);
        return updated;
      });
      clearQueue();

      const t = setTimeout(() => pollJobRef.current?.(data.batchJobId!), 15_000);
      pollTimers.current.set(data.batchJobId, t);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Submission failed');
    } finally {
      setSubmitting(false);
    }
  };

  const checkNow = (jobId: string) => {
    const existing = pollTimers.current.get(jobId);
    if (existing) clearTimeout(existing);
    pollTimers.current.delete(jobId);
    pollJob(jobId);
  };

  const dismissJob = (jobId: string) => {
    setJobs((prev) => {
      const updated = prev.filter((j) => j.batchJobId !== jobId);
      persistJobs(updated);
      return updated;
    });
    const t = pollTimers.current.get(jobId);
    if (t) clearTimeout(t);
    pollTimers.current.delete(jobId);
  };

  if (!mounted) {
    return (
      <div className="p-4 md:p-6 space-y-6 md:space-y-8">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-gray-200 rounded w-48" />
          <div className="h-4 bg-gray-100 rounded w-96" />
          <div className="h-64 bg-gray-100 rounded" />
        </div>
      </div>
    );
  }

  const activeJobs = jobs.filter((j) => j.status === 'pending' || j.status === 'processing');
  const finishedJobs = jobs.filter((j) => j.status === 'complete' || j.status === 'failed');
  const estimatedCost = queue.length > 0
    ? `$${(queue.length * COST_LOW).toFixed(2)}–$${(queue.length * COST_HIGH).toFixed(2)}`
    : null;

  return (
    <div className="p-4 md:p-6 space-y-6 md:space-y-8">

      {/* Page header */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <div className="flex items-center gap-3 mb-1">
            <h1 className="text-xl font-extrabold" style={{ color: '#1B3A52' }}>Batch Research</h1>
            <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-orange-100 text-orange-700">
              50% off
            </span>
          </div>
          <p className="text-sm text-gray-500">
            Select companies from the{' '}
            <Link href="/mb-hub/companies" className="underline hover:opacity-75" style={{ color: '#F26522' }}>
              Companies page
            </Link>
            {' '}using the Batch button, then submit here for processing at 50% reduced cost via the Anthropic Batch API. Results are returned within 24 hours and automatically populate company fields when complete.
          </p>
        </div>
      </div>

      {/* Active batch jobs */}
      {activeJobs.length > 0 && (
        <section className="space-y-3">
          <h2 className="text-sm font-bold uppercase tracking-wide text-gray-500 mb-3">In Progress</h2>
          {activeJobs.map((job) => (
            <div key={job.batchJobId} className={`rounded-xl border p-5 ${STATUS_STYLES[job.status]}`}>
              <div className="flex items-start justify-between mb-3">
                <div>
                  <p className="text-xs font-bold uppercase tracking-wide opacity-60 mb-0.5">{STATUS_LABEL[job.status]}</p>
                  <p className="font-semibold">
                    {job.completedCompanies} / {job.totalCompanies} companies processed
                  </p>
                </div>
                <button
                  onClick={() => checkNow(job.batchJobId)}
                  className="text-xs font-medium px-3 py-1.5 rounded-lg border border-current/30 hover:bg-black/5 transition-colors"
                >
                  Check Now
                </button>
              </div>

              {/* Progress bar */}
              <div className="w-full rounded-full h-1.5 mb-3" style={{ backgroundColor: 'rgba(0,0,0,0.1)' }}>
                <div
                  className="h-1.5 rounded-full transition-all duration-500"
                  style={{
                    width: `${job.totalCompanies > 0 ? (job.completedCompanies / job.totalCompanies) * 100 : 2}%`,
                    backgroundColor: 'currentColor',
                    opacity: 0.5,
                  }}
                />
              </div>

              <div className="flex flex-wrap gap-1.5 mb-3">
                {job.companies.map((c) => (
                  <span key={c.id} className="text-xs px-2 py-0.5 rounded-full" style={{ backgroundColor: 'rgba(255,255,255,0.5)' }}>
                    {c.company_name}
                  </span>
                ))}
              </div>

              <p className="text-xs opacity-60">
                Submitted {new Date(job.submittedAt).toLocaleString('en-US', { month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit' })}
                {' · '}Auto-checks every 30 seconds
              </p>
            </div>
          ))}
        </section>
      )}

      {/* Queue section */}
      <section>
        <div className="flex flex-wrap items-center justify-between gap-2 mb-4">
          <div className="flex items-center gap-2">
            <h2 className="text-sm font-bold uppercase tracking-wide text-gray-500">Queue</h2>
            {queue.length > 0 && (
              <span
                className="px-2 py-0.5 rounded-full text-white text-xs font-bold"
                style={{ backgroundColor: '#F26522' }}
              >
                {queue.length}
              </span>
            )}
          </div>

          {queue.length > 0 && (
            <div className="flex items-center gap-3">
              <span className="text-sm text-gray-500">Est. {estimatedCost}</span>
              <button
                onClick={submitBatch}
                disabled={submitting}
                className="btn-primary"
              >
                {submitting ? (
                  <span className="flex items-center gap-2">
                    <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                    </svg>
                    Submitting…
                  </span>
                ) : `Submit Batch (${queue.length})`}
              </button>
              <button onClick={clearQueue} className="btn-ghost text-sm">
                Clear All
              </button>
            </div>
          )}
        </div>

        {error && (
          <div className="mb-4 bg-red-50 border border-red-200 text-red-700 rounded-lg p-3 text-sm">
            {error}
          </div>
        )}

        {queue.length === 0 ? (
          <div className="card p-10 text-center">
            <p className="font-semibold text-gray-500">Queue is empty</p>
            <p className="text-sm text-gray-400 mt-1">
              Select companies from the{' '}
              <Link href="/mb-hub/companies" className="underline font-medium" style={{ color: '#F26522' }}>
                Companies page
              </Link>
              {' '}using the Batch button to add them here.
            </p>
          </div>
        ) : (
          <div className="card overflow-hidden">
            {/* Queue header */}
            <div
              className="px-5 py-3 border-b border-gray-100 flex items-center justify-between"
              style={{ backgroundColor: '#FFF7ED' }}
            >
              <span className="text-xs font-semibold text-orange-700">
                {queue.length} {queue.length === 1 ? 'company' : 'companies'} queued for batch processing
              </span>
              <span className="text-xs text-orange-600">
                Est. {estimatedCost} · ~50% off standard pricing
              </span>
            </div>

            {/* Queue items */}
            <ul className="divide-y divide-gray-100">
              {queue.map((company) => (
                <li key={company.id} className="flex items-center gap-3 px-5 py-3 hover:bg-gray-50 transition-colors">
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-sm" style={{ color: '#1B3A52' }}>{company.company_name}</p>
                    {company.website && (
                      <p className="text-xs text-gray-400 truncate">
                        {company.website.replace(/^https?:\/\//, '')}
                      </p>
                    )}
                  </div>
                  <button
                    onClick={() => removeFromQueue(company.id)}
                    className="text-gray-300 hover:text-red-400 text-lg leading-none flex-shrink-0 px-2 py-0.5 rounded hover:bg-red-50 transition-colors"
                    title="Remove from queue"
                  >
                    ×
                  </button>
                </li>
              ))}
            </ul>

            {/* Queue footer */}
            <div className="px-5 py-4 border-t border-gray-100 flex items-center justify-between" style={{ backgroundColor: '#F4F8FB' }}>
              <p className="text-xs text-gray-500">
                Results auto-populate company fields when Anthropic finishes the batch (~15–60 min).
              </p>
              <button
                onClick={submitBatch}
                disabled={submitting}
                className="btn-primary text-sm"
              >
                {submitting ? 'Submitting…' : 'Submit Batch →'}
              </button>
            </div>
          </div>
        )}
      </section>

      {/* How it works */}
      {queue.length === 0 && activeJobs.length === 0 && finishedJobs.length === 0 && (
        <section>
          <h2 className="text-sm font-bold uppercase tracking-wide text-gray-500 mb-3">How It Works</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[
              {
                step: '1',
                title: 'Select companies',
                desc: 'Go to the Companies page and click the Batch button on each company you want to research in bulk.',
              },
              {
                step: '2',
                title: 'Submit the batch',
                desc: "Click Submit Batch here. Your request is sent to the Anthropic Batch API at 50% reduced cost.",
              },
              {
                step: '3',
                title: 'Results auto-populate',
                desc: 'Results are returned within 24 hours and automatically populate company fields when complete.',
              },
            ].map((item) => (
              <div key={item.step} className="card p-5">
                <div
                  className="w-7 h-7 rounded-full text-white text-sm font-bold flex items-center justify-center mb-3"
                  style={{ backgroundColor: '#F26522' }}
                >
                  {item.step}
                </div>
                <p className="font-semibold text-sm mb-1" style={{ color: '#1B3A52' }}>{item.title}</p>
                <p className="text-xs text-gray-500">{item.desc}</p>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Completed jobs */}
      {finishedJobs.length > 0 && (
        <section>
          <h2 className="text-sm font-bold uppercase tracking-wide text-gray-500 mb-3">Recent Batches</h2>
          <div className="space-y-3">
            {finishedJobs.map((job) => (
              <div key={job.batchJobId} className={`rounded-xl border p-5 ${STATUS_STYLES[job.status]}`}>
                <div className="flex items-start justify-between">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-xs font-bold uppercase tracking-wide opacity-70">
                        {STATUS_LABEL[job.status]}
                      </span>
                      {job.estimatedCost && (
                        <span className="text-xs opacity-60">· ${job.estimatedCost}</span>
                      )}
                    </div>
                    <p className="text-sm font-medium">
                      {job.status === 'complete'
                        ? `${job.completedCompanies} of ${job.totalCompanies} companies researched & saved`
                        : `${job.completedCompanies} of ${job.totalCompanies} completed before failure`}
                    </p>
                    <p className="text-xs opacity-60 mt-0.5">
                      Submitted {new Date(job.submittedAt).toLocaleString('en-US', { month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit' })}
                      {job.completedAt && (
                        <> · Completed {new Date(job.completedAt).toLocaleString('en-US', { month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit' })}</>
                      )}
                    </p>
                  </div>
                  <button
                    onClick={() => dismissJob(job.batchJobId)}
                    className="text-xs opacity-50 hover:opacity-100 px-2 py-1 rounded hover:bg-black/10 transition-colors"
                  >
                    Dismiss
                  </button>
                </div>

                {job.companies.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 mt-3">
                    {job.companies.map((c) => (
                      <Link
                        key={c.id}
                        href={`/mb-hub/companies/${c.id}`}
                        className="text-xs px-2.5 py-0.5 rounded-full transition-colors hover:opacity-75"
                        style={{ backgroundColor: 'rgba(255,255,255,0.6)' }}
                      >
                        {c.company_name}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}

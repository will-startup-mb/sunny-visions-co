'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import type { Company } from '@/lib/db/schema';
import { INDUSTRIES, STAGES, EMPLOYEE_RANGES, FUNDING_OPTIONS, INTERVIEW_PRIORITIES } from '@/lib/constants';

type ResearchResult = {
  company_description?: string;
  founder_names?: string;
  founder_overview?: string;
  founder_linkedin_url?: string;
  company_linkedin_url?: string;
  city_region?: string;
  primary_industry?: string;
  secondary_industry?: string;
  stage?: string;
  estimated_employees?: string;
  funding_raised?: string;
  has_about_page?: boolean;
  has_team_page?: boolean;
  social_media_active?: boolean;
  press_coverage?: boolean;
  innovation_score?: number;
  opportunity_score?: number;
  interview_priority?: string;
  contact_name?: string;
  contact_email?: string;
  outreach_linkedin_draft?: string;
  research_notes?: string;
};

export function ResearchPanel({ company }: { company: Company }) {
  const router = useRouter();
  const [running, setRunning] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [result, setResult] = useState<ResearchResult | null>(null);
  const [edits, setEdits] = useState<ResearchResult>({});

  useEffect(() => {
    if (!running) return;
    const handler = (e: BeforeUnloadEvent) => {
      e.preventDefault();
      e.returnValue = '';
    };
    window.addEventListener('beforeunload', handler);
    return () => window.removeEventListener('beforeunload', handler);
  }, [running]);

  const runResearch = async () => {
    const ok = window.confirm(
      'This will use approximately $0.50–$0.75 in API credits.\n\nContinue?'
    );
    if (!ok) return;
    setRunning(true);
    setError('');
    setResult(null);

    const res = await fetch(`/api/companies/${company.id}/research`, { method: 'POST' });
    const json = await res.json();

    if (res.ok && json.data) {
      setResult(json.data);
      setEdits(json.data);
    } else {
      setError(json.error || 'Research failed. Check that your ANTHROPIC_API_KEY is set.');
    }
    setRunning(false);
  };

  const set = (field: keyof ResearchResult, value: unknown) =>
    setEdits((prev) => ({ ...prev, [field]: value }));

  const saveResult = async () => {
    setSaving(true);
    const today = new Date().toISOString().split('T')[0];
    const res = await fetch(`/api/companies/${company.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...edits, research_date: today }),
    });

    if (res.ok) {
      router.push('/admin/companies');
      router.refresh();
    } else {
      setError('Save failed');
      setSaving(false);
    }
  };

  const Field = ({ label, children, hint }: { label: string; children: React.ReactNode; hint?: string }) => (
    <div className="flex flex-col gap-1">
      <label>{label}</label>
      {children}
      {hint && <p className="text-xs text-gray-400">{hint}</p>}
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Company info card */}
      <div className="card p-5">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-xs text-gray-500 uppercase font-bold tracking-wide mb-1">Researching</p>
            <p className="font-bold text-base" style={{ color: '#1B3A52' }}>{company.company_name}</p>
            {company.website && (
              <a href={company.website} target="_blank" rel="noopener noreferrer" className="text-sm text-teal-600 hover:underline">
                {company.website}
              </a>
            )}
          </div>
          <button
            onClick={runResearch}
            disabled={running}
            className="btn-primary flex-shrink-0"
          >
            {running ? (
              <span className="flex items-center gap-2">
                <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                </svg>
                Researching…
              </span>
            ) : result ? '🔄 Re-run Research' : '🔬 Run Research'}
          </button>
        </div>

        {running && (
          <div className="mt-4 p-3 rounded-lg text-sm text-center" style={{ backgroundColor: '#e0f2f2', color: '#1B3A52' }}>
            Claude is searching the web for information about {company.company_name}. This usually takes 30–60 seconds…
          </div>
        )}
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 rounded p-4 text-sm">
          <strong>Error:</strong> {error}
        </div>
      )}

      {result && (
        <>
          <div className="bg-emerald-50 border border-emerald-200 rounded p-3 text-sm text-emerald-700">
            Research complete! Review the fields below, make any edits, then click Save to Database.
          </div>

          {/* Editable results */}
          <div className="card p-6 space-y-6">
            <h2 className="font-bold" style={{ color: '#1B3A52' }}>Review & Edit Research Results</h2>

            {/* Descriptions */}
            <div className="space-y-4">
              <Field label="Company Description (2 sentences)">
                <textarea rows={3} value={edits.company_description || ''} onChange={(e) => set('company_description', e.target.value)} />
              </Field>
              <Field label="Founder Names">
                <input value={edits.founder_names || ''} onChange={(e) => set('founder_names', e.target.value)} />
              </Field>
              <Field label="Founder Overview (2-3 sentences)">
                <textarea rows={3} value={edits.founder_overview || ''} onChange={(e) => set('founder_overview', e.target.value)} />
              </Field>
            </div>

            {/* Classification */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Field label="City / Region">
                <input value={edits.city_region || ''} onChange={(e) => set('city_region', e.target.value)} />
              </Field>
              <Field label="Primary Industry">
                <select value={edits.primary_industry || ''} onChange={(e) => set('primary_industry', e.target.value)}>
                  <option value="">Select…</option>
                  {INDUSTRIES.map((i) => <option key={i} value={i}>{i}</option>)}
                </select>
              </Field>
              <Field label="Secondary Industry">
                <select value={edits.secondary_industry || ''} onChange={(e) => set('secondary_industry', e.target.value)}>
                  <option value="">None</option>
                  {INDUSTRIES.map((i) => <option key={i} value={i}>{i}</option>)}
                </select>
              </Field>
              <Field label="Stage">
                <select value={edits.stage || ''} onChange={(e) => set('stage', e.target.value)}>
                  <option value="">Select…</option>
                  {STAGES.map((s) => <option key={s} value={s}>{s}</option>)}
                </select>
              </Field>
              <Field label="Employees">
                <select value={edits.estimated_employees || ''} onChange={(e) => set('estimated_employees', e.target.value)}>
                  <option value="">Select…</option>
                  {EMPLOYEE_RANGES.map((r) => <option key={r} value={r}>{r}</option>)}
                </select>
              </Field>
              <Field label="Funding">
                <select value={edits.funding_raised || ''} onChange={(e) => set('funding_raised', e.target.value)}>
                  <option value="">Select…</option>
                  {FUNDING_OPTIONS.map((f) => <option key={f} value={f}>{f}</option>)}
                </select>
              </Field>
            </div>

            {/* Booleans */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {(['has_about_page', 'has_team_page', 'social_media_active', 'press_coverage'] as const).map((field) => (
                <Field key={field} label={field.replace(/_/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase())}>
                  <select
                    value={edits[field] === null || edits[field] === undefined ? '' : String(edits[field])}
                    onChange={(e) => set(field, e.target.value === '' ? null : e.target.value === 'true')}
                  >
                    <option value="">Unknown</option>
                    <option value="true">Yes</option>
                    <option value="false">No</option>
                  </select>
                </Field>
              ))}
            </div>

            {/* Scores */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Field
                label="Innovation Score (1-10)"
                hint="1-3: Limited diff | 4-6: Regional | 7-8: Tech-enabled | 9-10: Highly innovative"
              >
                <input
                  type="number" min={1} max={10}
                  value={edits.innovation_score ?? ''}
                  onChange={(e) => set('innovation_score', e.target.value ? parseInt(e.target.value) : null)}
                />
              </Field>
              <Field
                label="Opportunity Score (1-10)"
                hint="1-3: Limited relevance | 4-6: Local interest | 7-8: Strong story | 9-10: Ecosystem leader"
              >
                <input
                  type="number" min={1} max={10}
                  value={edits.opportunity_score ?? ''}
                  onChange={(e) => set('opportunity_score', e.target.value ? parseInt(e.target.value) : null)}
                />
              </Field>
              <Field label="Interview Priority">
                <select value={edits.interview_priority || ''} onChange={(e) => set('interview_priority', e.target.value)}>
                  <option value="">Select…</option>
                  {INTERVIEW_PRIORITIES.map((p) => <option key={p} value={p}>{p}</option>)}
                </select>
              </Field>
            </div>

            {/* Links */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Field label="Founder LinkedIn URL">
                <input value={edits.founder_linkedin_url || ''} onChange={(e) => set('founder_linkedin_url', e.target.value)} />
              </Field>
              <Field label="Company LinkedIn URL">
                <input value={edits.company_linkedin_url || ''} onChange={(e) => set('company_linkedin_url', e.target.value)} />
              </Field>
            </div>

            {/* Outreach */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Field label="Contact Name">
                <input value={edits.contact_name || ''} onChange={(e) => set('contact_name', e.target.value)} />
              </Field>
              <Field label="Contact Email">
                <input type="email" value={edits.contact_email || ''} onChange={(e) => set('contact_email', e.target.value)} />
              </Field>
            </div>
            <Field label="LinkedIn Outreach Draft (max 200 chars)">
              <textarea
                rows={2}
                maxLength={200}
                value={edits.outreach_linkedin_draft || ''}
                onChange={(e) => set('outreach_linkedin_draft', e.target.value)}
              />
              <p className="text-xs text-gray-400 text-right">{(edits.outreach_linkedin_draft || '').length}/200</p>
            </Field>
            <Field label="Research Notes (raw findings)">
              <textarea rows={6} value={edits.research_notes || ''} onChange={(e) => set('research_notes', e.target.value)} />
            </Field>
          </div>

          {/* Save */}
          <div className="flex gap-3">
            <button onClick={saveResult} disabled={saving} className="btn-primary">
              {saving ? 'Saving…' : '💾 Save to Database'}
            </button>
            <button onClick={() => router.push('/admin/companies')} className="btn-ghost">
              Discard
            </button>
          </div>
        </>
      )}
    </div>
  );
}

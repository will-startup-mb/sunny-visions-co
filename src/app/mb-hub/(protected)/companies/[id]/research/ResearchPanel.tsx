'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import type { Company } from '@/lib/db/schema';
import { INDUSTRIES, STAGES, EMPLOYEE_RANGES, FUNDING_OPTIONS, INTERVIEW_PRIORITIES } from '@/lib/constants';

type ConfidenceLevel = 'high' | 'medium' | 'low';

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
  confidence_scores?: string;
  field_refresh_dates?: string;
};

type ResearchMeta = {
  inputTokens: number;
  outputTokens: number;
  cacheReadTokens: number;
  cacheWriteTokens: number;
  cost: string;
};

function ConfidenceBadge({ level }: { level?: ConfidenceLevel }) {
  if (!level) return null;
  const styles: Record<ConfidenceLevel, string> = {
    high: 'bg-emerald-100 text-emerald-700',
    medium: 'bg-amber-100 text-amber-700',
    low: 'bg-red-100 text-red-600',
  };
  return (
    <span className={`text-xs px-1.5 py-0.5 rounded font-medium ${styles[level]}`}>
      {level}
    </span>
  );
}

function ResearchField({
  label,
  confidenceLevel,
  children,
  hint,
}: {
  label: string;
  confidenceLevel?: ConfidenceLevel;
  children: React.ReactNode;
  hint?: string;
}) {
  return (
    <div className="flex flex-col gap-1">
      <div className="flex items-center gap-2">
        <label>{label}</label>
        <ConfidenceBadge level={confidenceLevel} />
      </div>
      {children}
      {hint && <p className="text-xs text-gray-400">{hint}</p>}
    </div>
  );
}

const ALL_RESEARCHABLE = [
  'company_description', 'founder_names', 'founder_overview', 'founder_linkedin_url',
  'company_linkedin_url', 'city_region', 'primary_industry', 'secondary_industry',
  'stage', 'estimated_employees', 'funding_raised', 'has_about_page', 'has_team_page',
  'social_media_active', 'press_coverage', 'innovation_score', 'opportunity_score',
  'interview_priority', 'contact_name', 'contact_email', 'outreach_linkedin_draft', 'research_notes',
];

function getStaleFields(fieldRefreshDatesJson: string | null): string[] {
  if (!fieldRefreshDatesJson) return [];
  const ninetyDaysAgo = new Date();
  ninetyDaysAgo.setDate(ninetyDaysAgo.getDate() - 90);
  const dates: Record<string, string> = JSON.parse(fieldRefreshDatesJson);
  return ALL_RESEARCHABLE.filter((field) => {
    const d = dates[field];
    return !d || new Date(d) < ninetyDaysAgo;
  });
}

export function ResearchPanel({ company }: { company: Company }) {
  const router = useRouter();
  const [running, setRunning] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [result, setResult] = useState<ResearchResult | null>(null);
  const [confidence, setConfidence] = useState<Record<string, ConfidenceLevel>>({});
  const [meta, setMeta] = useState<ResearchMeta | null>(null);
  const [edits, setEdits] = useState<ResearchResult>({});
  const [isReresearch, setIsReresearch] = useState(false);
  const [staleFields, setStaleFields] = useState<string[]>([]);

  const staleFieldsOnLoad = company.field_refresh_dates
    ? getStaleFields(company.field_refresh_dates)
    : [];

  useEffect(() => {
    if (!running) return;
    const handler = (e: BeforeUnloadEvent) => { e.preventDefault(); e.returnValue = ''; };
    window.addEventListener('beforeunload', handler);
    return () => window.removeEventListener('beforeunload', handler);
  }, [running]);

  const runResearch = async (reresearch = false) => {
    if (reresearch && staleFieldsOnLoad.length === 0) {
      setError('All fields were refreshed within the last 90 days — nothing to re-research.');
      return;
    }

    const costHint = reresearch
      ? 'This will re-research only stale fields (>90 days old), using fewer tokens than a full run.'
      : 'This will use approximately $0.05–$0.10 in API credits with prompt caching.';

    if (!window.confirm(`${costHint}\n\nContinue?`)) return;

    setRunning(true);
    setIsReresearch(reresearch);
    setStaleFields(reresearch ? staleFieldsOnLoad : []);
    setError('');
    setResult(null);
    setMeta(null);

    const res = await fetch(`/api/companies/${company.id}/research`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(reresearch ? { reresearch: true } : {}),
    });
    const json = await res.json();

    if (res.ok && json.success && json.data) {
      setResult(json.data);
      setEdits(json.data);
      setConfidence(json.confidence ?? {});
      setMeta(json.meta ?? null);
    } else if (res.ok && json.upToDate) {
      setError(json.message);
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
      router.push('/mb-hub/companies');
      router.refresh();
    } else {
      setError('Save failed');
      setSaving(false);
    }
  };

  const cl = (fieldName: string) => confidence[fieldName] as ConfidenceLevel | undefined;

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
          <div className="flex flex-col gap-2 flex-shrink-0">
            <button onClick={() => runResearch(false)} disabled={running} className="btn-primary">
              {running && !isReresearch ? (
                <span className="flex items-center gap-2">
                  <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                  </svg>
                  Researching…
                </span>
              ) : result ? 'Re-run Full Research' : 'Run Research'}
            </button>
            {company.research_date && (
              <button
                onClick={() => runResearch(true)}
                disabled={running}
                className="btn-ghost text-sm py-1.5"
                title={
                  staleFieldsOnLoad.length > 0
                    ? `${staleFieldsOnLoad.length} stale field(s): ${staleFieldsOnLoad.slice(0, 3).join(', ')}${staleFieldsOnLoad.length > 3 ? '…' : ''}`
                    : 'All fields are fresh'
                }
              >
                {running && isReresearch ? (
                  <span className="flex items-center gap-2">
                    <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                    </svg>
                    Re-researching stale…
                  </span>
                ) : (
                  <>
                    Re-research Stale
                    {staleFieldsOnLoad.length > 0 && (
                      <span className="ml-1.5 px-1.5 py-0.5 rounded-full text-xs bg-amber-100 text-amber-700">
                        {staleFieldsOnLoad.length}
                      </span>
                    )}
                  </>
                )}
              </button>
            )}
          </div>
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

      {/* Token / cost summary */}
      {meta && (
        <div className="flex flex-wrap gap-4 p-4 rounded-lg text-sm" style={{ backgroundColor: '#F4F8FB', border: '1px solid #e2e8f0' }}>
          <div>
            <span className="text-gray-500">Input tokens: </span>
            <span className="font-semibold">{meta.inputTokens.toLocaleString()}</span>
          </div>
          {meta.cacheReadTokens > 0 && (
            <div>
              <span className="text-gray-500">Cache reads: </span>
              <span className="font-semibold text-emerald-600">{meta.cacheReadTokens.toLocaleString()}</span>
            </div>
          )}
          {meta.cacheWriteTokens > 0 && (
            <div>
              <span className="text-gray-500">Cache writes: </span>
              <span className="font-semibold">{meta.cacheWriteTokens.toLocaleString()}</span>
            </div>
          )}
          <div>
            <span className="text-gray-500">Output tokens: </span>
            <span className="font-semibold">{meta.outputTokens.toLocaleString()}</span>
          </div>
          <div className="ml-auto font-bold" style={{ color: '#1B3A52' }}>
            Est. cost: ${meta.cost}
          </div>
        </div>
      )}

      {/* Re-research context */}
      {result && isReresearch && staleFields.length > 0 && (
        <div className="bg-amber-50 border border-amber-200 rounded p-3 text-sm text-amber-800">
          <strong>Partial re-research:</strong> Only {staleFields.length} stale field{staleFields.length !== 1 ? 's' : ''} were targeted: {staleFields.join(', ')}. Other fields retain their existing values.
        </div>
      )}

      {result && (
        <>
          <div className="bg-emerald-50 border border-emerald-200 rounded p-3 text-sm text-emerald-700">
            Research complete! Review the fields below, make any edits, then click Save to Database.
            {Object.keys(confidence).length > 0 && (
              <span className="ml-2">
                Confidence:{' '}
                <span className="bg-emerald-100 text-emerald-700 px-1 rounded text-xs font-medium">high</span>{' '}
                <span className="bg-amber-100 text-amber-700 px-1 rounded text-xs font-medium">medium</span>{' '}
                <span className="bg-red-100 text-red-600 px-1 rounded text-xs font-medium">low</span>{' '}
                — verify low fields manually.
              </span>
            )}
          </div>

          {/* Editable results */}
          <div className="card p-6 space-y-6">
            <h2 className="font-bold" style={{ color: '#1B3A52' }}>Review & Edit Research Results</h2>

            {/* Descriptions */}
            <div className="space-y-4">
              <ResearchField label="Company Description (2 sentences)" confidenceLevel={cl('company_description')}>
                <textarea rows={3} value={edits.company_description || ''} onChange={(e) => set('company_description', e.target.value)} />
              </ResearchField>
              <ResearchField label="Founder Names" confidenceLevel={cl('founder_names')}>
                <input value={edits.founder_names || ''} onChange={(e) => set('founder_names', e.target.value)} />
              </ResearchField>
              <ResearchField label="Founder Overview (2-3 sentences)" confidenceLevel={cl('founder_overview')}>
                <textarea rows={3} value={edits.founder_overview || ''} onChange={(e) => set('founder_overview', e.target.value)} />
              </ResearchField>
            </div>

            {/* Classification */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <ResearchField label="City / Region" confidenceLevel={cl('city_region')}>
                <input value={edits.city_region || ''} onChange={(e) => set('city_region', e.target.value)} />
              </ResearchField>
              <ResearchField label="Primary Industry" confidenceLevel={cl('primary_industry')}>
                <select value={edits.primary_industry || ''} onChange={(e) => set('primary_industry', e.target.value)}>
                  <option value="">Select…</option>
                  {INDUSTRIES.map((i) => <option key={i} value={i}>{i}</option>)}
                </select>
              </ResearchField>
              <ResearchField label="Secondary Industry" confidenceLevel={cl('secondary_industry')}>
                <select value={edits.secondary_industry || ''} onChange={(e) => set('secondary_industry', e.target.value)}>
                  <option value="">None</option>
                  {INDUSTRIES.map((i) => <option key={i} value={i}>{i}</option>)}
                </select>
              </ResearchField>
              <ResearchField label="Stage" confidenceLevel={cl('stage')}>
                <select value={edits.stage || ''} onChange={(e) => set('stage', e.target.value)}>
                  <option value="">Select…</option>
                  {STAGES.map((s) => <option key={s} value={s}>{s}</option>)}
                </select>
              </ResearchField>
              <ResearchField label="Employees" confidenceLevel={cl('estimated_employees')}>
                <select value={edits.estimated_employees || ''} onChange={(e) => set('estimated_employees', e.target.value)}>
                  <option value="">Select…</option>
                  {EMPLOYEE_RANGES.map((r) => <option key={r} value={r}>{r}</option>)}
                </select>
              </ResearchField>
              <ResearchField label="Funding" confidenceLevel={cl('funding_raised')}>
                <select value={edits.funding_raised || ''} onChange={(e) => set('funding_raised', e.target.value)}>
                  <option value="">Select…</option>
                  {FUNDING_OPTIONS.map((f) => <option key={f} value={f}>{f}</option>)}
                </select>
              </ResearchField>
            </div>

            {/* Booleans */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {(['has_about_page', 'has_team_page', 'social_media_active', 'press_coverage'] as const).map((field) => (
                <ResearchField key={field} label={field.replace(/_/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase())} confidenceLevel={cl(field)}>
                  <select
                    value={edits[field] === null || edits[field] === undefined ? '' : String(edits[field])}
                    onChange={(e) => set(field, e.target.value === '' ? null : e.target.value === 'true')}
                  >
                    <option value="">Unknown</option>
                    <option value="true">Yes</option>
                    <option value="false">No</option>
                  </select>
                </ResearchField>
              ))}
            </div>

            {/* Scores */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <ResearchField
                label="Innovation Score (1-10)"
                confidenceLevel={cl('innovation_score')}
                hint="1-3: Limited diff | 4-6: Regional | 7-8: Tech-enabled | 9-10: Highly innovative"
              >
                <input
                  type="number" min={1} max={10}
                  value={edits.innovation_score ?? ''}
                  onChange={(e) => set('innovation_score', e.target.value ? parseInt(e.target.value) : null)}
                />
              </ResearchField>
              <ResearchField
                label="Opportunity Score (1-10)"
                confidenceLevel={cl('opportunity_score')}
                hint="1-3: Limited relevance | 4-6: Local interest | 7-8: Strong story | 9-10: Ecosystem leader"
              >
                <input
                  type="number" min={1} max={10}
                  value={edits.opportunity_score ?? ''}
                  onChange={(e) => set('opportunity_score', e.target.value ? parseInt(e.target.value) : null)}
                />
              </ResearchField>
              <ResearchField label="Interview Priority" confidenceLevel={cl('interview_priority')}>
                <select value={edits.interview_priority || ''} onChange={(e) => set('interview_priority', e.target.value)}>
                  <option value="">Select…</option>
                  {INTERVIEW_PRIORITIES.map((p) => <option key={p} value={p}>{p}</option>)}
                </select>
              </ResearchField>
            </div>

            {/* Links */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <ResearchField label="Founder LinkedIn URL" confidenceLevel={cl('founder_linkedin_url')}>
                <input value={edits.founder_linkedin_url || ''} onChange={(e) => set('founder_linkedin_url', e.target.value)} />
              </ResearchField>
              <ResearchField label="Company LinkedIn URL" confidenceLevel={cl('company_linkedin_url')}>
                <input value={edits.company_linkedin_url || ''} onChange={(e) => set('company_linkedin_url', e.target.value)} />
              </ResearchField>
            </div>

            {/* Outreach */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <ResearchField label="Contact Name" confidenceLevel={cl('contact_name')}>
                <input value={edits.contact_name || ''} onChange={(e) => set('contact_name', e.target.value)} />
              </ResearchField>
              <ResearchField label="Contact Email" confidenceLevel={cl('contact_email')}>
                <input type="email" value={edits.contact_email || ''} onChange={(e) => set('contact_email', e.target.value)} />
              </ResearchField>
            </div>
            <ResearchField label="LinkedIn Outreach Draft (max 200 chars)" confidenceLevel={cl('outreach_linkedin_draft')}>
              <textarea
                rows={2}
                maxLength={200}
                value={edits.outreach_linkedin_draft || ''}
                onChange={(e) => set('outreach_linkedin_draft', e.target.value)}
              />
              <p className="text-xs text-gray-400 text-right">{(edits.outreach_linkedin_draft || '').length}/200</p>
            </ResearchField>
            <ResearchField label="Research Notes (raw findings)" confidenceLevel={cl('research_notes')}>
              <textarea rows={6} value={edits.research_notes || ''} onChange={(e) => set('research_notes', e.target.value)} />
            </ResearchField>
          </div>

          {/* Save */}
          <div className="flex gap-3">
            <button onClick={saveResult} disabled={saving} className="btn-primary">
              {saving ? 'Saving…' : 'Save to Database'}
            </button>
            <button onClick={() => router.push('/mb-hub/companies')} className="btn-ghost">
              Discard
            </button>
          </div>
        </>
      )}
    </div>
  );
}

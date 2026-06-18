'use client';

import { useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import type { Company } from '@/lib/db/schema';
import {
  INDUSTRIES,
  STAGES,
  EMPLOYEE_RANGES,
  FUNDING_OPTIONS,
  INTERVIEW_PRIORITIES,
  FOUNDER_STATUSES,
} from '@/lib/constants';

type FormData = Partial<Omit<Company, 'id' | 'created_at' | 'updated_at'>>;

export function CompanyForm({ company }: { company?: Company }) {
  const router = useRouter();
  const isEdit = !!company;

  const [form, setForm] = useState<FormData>({
    company_name: company?.company_name || '',
    website: company?.website || '',
    city_region: company?.city_region || '',
    primary_industry: company?.primary_industry || '',
    secondary_industry: company?.secondary_industry || '',
    stage: company?.stage || '',
    estimated_employees: company?.estimated_employees || '',
    funding_raised: company?.funding_raised || '',
    company_description: company?.company_description || '',
    contact_name: company?.contact_name || '',
    contact_email: company?.contact_email || '',
    founder_names: company?.founder_names || '',
    founder_overview: company?.founder_overview || '',
    founder_linkedin_url: company?.founder_linkedin_url || '',
    company_linkedin_url: company?.company_linkedin_url || '',
    has_about_page: company?.has_about_page ?? null,
    has_team_page: company?.has_team_page ?? null,
    social_media_active: company?.social_media_active ?? null,
    press_coverage: company?.press_coverage ?? null,
    innovation_score: company?.innovation_score ?? null,
    opportunity_score: company?.opportunity_score ?? null,
    interview_priority: company?.interview_priority || '',
    founder_status: company?.founder_status || 'Not Contacted',
    last_contact_date: company?.last_contact_date || '',
    outreach_linkedin_draft: company?.outreach_linkedin_draft || '',
    outreach_notes: company?.outreach_notes || '',
    interviewed: company?.interviewed ?? false,
    podcast_episode: company?.podcast_episode || '',
    source_list: company?.source_list || '',
    research_notes: company?.research_notes || '',
  });

  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [logoUrl, setLogoUrl] = useState(company?.logo_url || '');
  const [logoUploading, setLogoUploading] = useState(false);
  const [logoError, setLogoError] = useState('');
  const logoInputRef = useRef<HTMLInputElement>(null);

  const set = (field: keyof FormData, value: unknown) =>
    setForm((prev) => ({ ...prev, [field]: value }));

  const handleLogoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !company) return;
    setLogoUploading(true);
    setLogoError('');
    const fd = new FormData();
    fd.append('logo', file);
    const res = await fetch(`/api/companies/${company.id}/logo`, { method: 'POST', body: fd });
    if (res.ok) {
      const { logo_url } = await res.json();
      setLogoUrl(logo_url);
    } else {
      setLogoError('Upload failed');
    }
    setLogoUploading(false);
    if (logoInputRef.current) logoInputRef.current.value = '';
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError('');

    const url = isEdit ? `/api/companies/${company!.id}` : '/api/companies';
    const method = isEdit ? 'PUT' : 'POST';

    const res = await fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    });

    if (res.ok) {
      router.push('/admin/companies');
      router.refresh();
    } else {
      let message = 'Save failed';
      try {
        const data = await res.json();
        message = data.error || message;
      } catch {
        message = `Save failed (server error ${res.status})`;
      }
      setError(message);
      setSaving(false);
    }
  };

  const Field = ({
    label,
    children,
    hint,
  }: {
    label: string;
    children: React.ReactNode;
    hint?: string;
  }) => (
    <div className="flex flex-col gap-1">
      <label>{label}</label>
      {children}
      {hint && <p className="text-xs text-gray-500">{hint}</p>}
    </div>
  );

  const BoolSelect = ({ field, label }: { field: keyof FormData; label: string }) => (
    <Field label={label}>
      <select
        value={form[field] === null || form[field] === undefined ? '' : String(form[field])}
        onChange={(e) =>
          set(field, e.target.value === '' ? null : e.target.value === 'true')
        }
      >
        <option value="">Unknown</option>
        <option value="true">Yes</option>
        <option value="false">No</option>
      </select>
    </Field>
  );

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 rounded p-3 text-sm">
          {error}
        </div>
      )}

      {/* Section: Core Info */}
      <section className="card p-6 space-y-4">
        <h2 className="font-bold text-base" style={{ color: '#1B3A52' }}>Core Info</h2>

        {isEdit && (
          <div className="flex items-center gap-4 pb-2 border-b border-gray-100">
            <div
              className="relative w-16 h-16 rounded-xl overflow-hidden flex-shrink-0"
              style={{ backgroundColor: '#1B3A52' }}
            >
              {logoUrl ? (
                <Image src={`${logoUrl}?v=${Date.now()}`} alt="Logo" fill className="object-contain p-1" unoptimized />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-white font-bold text-2xl">
                  {form.company_name?.charAt(0) || '?'}
                </div>
              )}
            </div>
            <div className="flex flex-col gap-1">
              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Company Logo</p>
              <label
                htmlFor="logo-upload"
                className="btn-ghost text-xs cursor-pointer inline-block"
                style={{ padding: '4px 12px' }}
              >
                {logoUploading ? 'Uploading…' : logoUrl ? 'Replace logo' : 'Upload logo'}
              </label>
              <input
                id="logo-upload"
                ref={logoInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleLogoUpload}
                disabled={logoUploading}
              />
              {logoError && <p className="text-xs text-red-500">{logoError}</p>}
              {logoUrl && <p className="text-xs text-gray-400">PNG, JPG, SVG — stored in /public/logos/</p>}
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Field label="Company Name *">
            <input
              required
              value={form.company_name || ''}
              onChange={(e) => set('company_name', e.target.value)}
            />
          </Field>
          <Field label="Website">
            <input
              type="url"
              value={form.website || ''}
              onChange={(e) => set('website', e.target.value)}
              placeholder="https://"
            />
          </Field>
          <Field label="City / Region">
            <input
              value={form.city_region || ''}
              onChange={(e) => set('city_region', e.target.value)}
              placeholder="Myrtle Beach, SC"
            />
          </Field>
          <Field label="Source / Where Discovered">
            <input
              value={form.source_list || ''}
              onChange={(e) => set('source_list', e.target.value)}
              placeholder="e.g. Found at eMYRge"
            />
          </Field>
        </div>
        <Field label="Company Description (2 sentences for public directory)">
          <textarea
            rows={3}
            value={form.company_description || ''}
            onChange={(e) => set('company_description', e.target.value)}
          />
        </Field>
      </section>

      {/* Section: Classification */}
      <section className="card p-6 space-y-4">
        <h2 className="font-bold text-base" style={{ color: '#1B3A52' }}>Classification</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Field label="Primary Industry">
            <select
              value={form.primary_industry || ''}
              onChange={(e) => set('primary_industry', e.target.value)}
            >
              <option value="">Select…</option>
              {INDUSTRIES.map((i) => <option key={i} value={i}>{i}</option>)}
            </select>
          </Field>
          <Field label="Secondary Industry">
            <select
              value={form.secondary_industry || ''}
              onChange={(e) => set('secondary_industry', e.target.value)}
            >
              <option value="">None</option>
              {INDUSTRIES.map((i) => <option key={i} value={i}>{i}</option>)}
            </select>
          </Field>
          <Field label="Stage">
            <select
              value={form.stage || ''}
              onChange={(e) => set('stage', e.target.value)}
            >
              <option value="">Select…</option>
              {STAGES.map((s) => <option key={s} value={s}>{s}</option>)}
            </select>
          </Field>
          <Field label="Estimated Employees">
            <select
              value={form.estimated_employees || ''}
              onChange={(e) => set('estimated_employees', e.target.value)}
            >
              <option value="">Select…</option>
              {EMPLOYEE_RANGES.map((r) => <option key={r} value={r}>{r}</option>)}
            </select>
          </Field>
          <Field label="Funding Raised">
            <select
              value={form.funding_raised || ''}
              onChange={(e) => set('funding_raised', e.target.value)}
            >
              <option value="">Select…</option>
              {FUNDING_OPTIONS.map((f) => <option key={f} value={f}>{f}</option>)}
            </select>
          </Field>
        </div>
      </section>

      {/* Section: Founders */}
      <section className="card p-6 space-y-4">
        <h2 className="font-bold text-base" style={{ color: '#1B3A52' }}>Founders</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Field label="Founder Names (comma-separated)">
            <input
              value={form.founder_names || ''}
              onChange={(e) => set('founder_names', e.target.value)}
            />
          </Field>
          <Field label="Founder LinkedIn URL">
            <input
              value={form.founder_linkedin_url || ''}
              onChange={(e) => set('founder_linkedin_url', e.target.value)}
              placeholder="https://linkedin.com/in/…"
            />
          </Field>
          <Field label="Company LinkedIn URL">
            <input
              value={form.company_linkedin_url || ''}
              onChange={(e) => set('company_linkedin_url', e.target.value)}
              placeholder="https://linkedin.com/company/…"
            />
          </Field>
        </div>
        <Field label="Founder Overview (2-3 sentences)">
          <textarea
            rows={3}
            value={form.founder_overview || ''}
            onChange={(e) => set('founder_overview', e.target.value)}
          />
        </Field>
      </section>

      {/* Section: Research & Scoring */}
      <section className="card p-6 space-y-4">
        <h2 className="font-bold text-base" style={{ color: '#1B3A52' }}>Research & Scoring</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Field
            label="Innovation Score (1-10)"
            hint="1-3: Limited diff. 4-6: Regional. 7-8: Tech-enabled. 9-10: Highly innovative"
          >
            <input
              type="number"
              min={1}
              max={10}
              value={form.innovation_score ?? ''}
              onChange={(e) => set('innovation_score', e.target.value ? parseInt(e.target.value) : null)}
            />
          </Field>
          <Field
            label="Opportunity Score (1-10)"
            hint="1-3: Limited relevance. 4-6: Local interest. 7-8: Strong story. 9-10: Ecosystem leader"
          >
            <input
              type="number"
              min={1}
              max={10}
              value={form.opportunity_score ?? ''}
              onChange={(e) => set('opportunity_score', e.target.value ? parseInt(e.target.value) : null)}
            />
          </Field>
          <Field label="Interview Priority">
            <select
              value={form.interview_priority || ''}
              onChange={(e) => set('interview_priority', e.target.value)}
            >
              <option value="">Select…</option>
              {INTERVIEW_PRIORITIES.map((p) => <option key={p} value={p}>{p}</option>)}
            </select>
          </Field>
          <Field label="Research Date">
            <input
              type="date"
              value={form.research_date || ''}
              onChange={(e) => set('research_date', e.target.value)}
            />
          </Field>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <BoolSelect field="has_about_page" label="Has About Page" />
          <BoolSelect field="has_team_page" label="Has Team Page" />
          <BoolSelect field="social_media_active" label="Social Media Active" />
          <BoolSelect field="press_coverage" label="Press Coverage" />
        </div>
        <Field label="Research Notes (raw pipeline output)">
          <textarea
            rows={5}
            value={form.research_notes || ''}
            onChange={(e) => set('research_notes', e.target.value)}
          />
        </Field>
      </section>

      {/* Section: Outreach */}
      <section className="card p-6 space-y-4">
        <h2 className="font-bold text-base" style={{ color: '#1B3A52' }}>Outreach & CRM</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Field label="Contact Name">
            <input
              value={form.contact_name || ''}
              onChange={(e) => set('contact_name', e.target.value)}
            />
          </Field>
          <Field label="Contact Email">
            <input
              type="email"
              value={form.contact_email || ''}
              onChange={(e) => set('contact_email', e.target.value)}
            />
          </Field>
          <Field label="Founder Status">
            <select
              value={form.founder_status || ''}
              onChange={(e) => set('founder_status', e.target.value)}
            >
              {FOUNDER_STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
            </select>
          </Field>
          <Field label="Last Contact Date">
            <input
              type="date"
              value={form.last_contact_date || ''}
              onChange={(e) => set('last_contact_date', e.target.value)}
            />
          </Field>
          <Field label="Interviewed">
            <select
              value={form.interviewed ? 'true' : 'false'}
              onChange={(e) => set('interviewed', e.target.value === 'true')}
            >
              <option value="false">No</option>
              <option value="true">Yes</option>
            </select>
          </Field>
          <Field label="Podcast Episode">
            <input
              value={form.podcast_episode || ''}
              onChange={(e) => set('podcast_episode', e.target.value)}
              placeholder="Ep. 12 — Title"
            />
          </Field>
        </div>
        <Field label="LinkedIn Outreach Draft (max 200 chars)">
          <textarea
            rows={2}
            maxLength={200}
            value={form.outreach_linkedin_draft || ''}
            onChange={(e) => set('outreach_linkedin_draft', e.target.value)}
          />
          <p className="text-xs text-gray-400 text-right">
            {(form.outreach_linkedin_draft || '').length}/200
          </p>
        </Field>
        <Field label="Outreach Notes">
          <textarea
            rows={3}
            value={form.outreach_notes || ''}
            onChange={(e) => set('outreach_notes', e.target.value)}
          />
        </Field>
      </section>

      {/* Actions */}
      <div className="flex gap-3">
        <button type="submit" className="btn-primary" disabled={saving}>
          {saving ? 'Saving…' : isEdit ? 'Save Changes' : 'Add Company'}
        </button>
        <button
          type="button"
          className="btn-ghost"
          onClick={() => router.push('/admin/companies')}
        >
          Cancel
        </button>
      </div>
    </form>
  );
}

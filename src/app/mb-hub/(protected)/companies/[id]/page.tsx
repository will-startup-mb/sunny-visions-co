import { notFound } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { db } from '@/lib/db';
import { companies } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';

export const dynamic = 'force-dynamic';

function Row({ label, value }: { label: string; value: React.ReactNode }) {
  if (value === null || value === undefined || value === '') return null;
  return (
    <div className="flex flex-col sm:flex-row sm:items-baseline gap-1 py-2 border-b border-gray-100 last:border-0">
      <dt className="text-xs font-semibold uppercase tracking-wide text-gray-400 sm:w-48 flex-shrink-0">{label}</dt>
      <dd className="text-sm text-gray-800 break-words flex-1">{value}</dd>
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="card p-6">
      <h2 className="text-xs font-bold uppercase tracking-widest mb-4" style={{ color: '#3A9E9E' }}>{title}</h2>
      <dl className="space-y-0">{children}</dl>
    </section>
  );
}

function ScorePill({ value }: { value: number | null }) {
  if (!value) return <span className="text-gray-400">—</span>;
  const color = value >= 7 ? '#22c55e' : value >= 4 ? '#f59e0b' : '#ef4444';
  return (
    <span className="inline-flex items-center justify-center w-7 h-7 rounded-full text-white text-xs font-bold" style={{ backgroundColor: color }}>
      {value}
    </span>
  );
}

export default async function AdminCompanyViewPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const [company] = await db.select().from(companies).where(eq(companies.id, id));
  if (!company) notFound();

  return (
    <div className="p-6 max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="relative w-16 h-16 rounded-xl overflow-hidden flex-shrink-0" style={{ backgroundColor: '#1B3A52' }}>
            {company.logo_url ? (
              <Image src={company.logo_url} alt={company.company_name} fill className="object-contain p-1" unoptimized />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-white font-bold text-2xl">
                {company.company_name.charAt(0)}
              </div>
            )}
          </div>
          <div>
            <h1 className="text-xl font-extrabold" style={{ color: '#1B3A52' }}>{company.company_name}</h1>
            {company.website && (
              <a href={company.website} target="_blank" rel="noopener noreferrer" className="text-sm text-gray-400 hover:underline">
                {company.website.replace(/^https?:\/\//, '')}
              </a>
            )}
            <div className="flex items-center gap-2 mt-1">
              <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${company.is_published ? 'bg-emerald-100 text-emerald-700' : 'bg-gray-100 text-gray-500'}`}>
                {company.is_published ? 'Published' : 'Unpublished'}
              </span>
            </div>
          </div>
        </div>
        <div className="flex gap-2 flex-shrink-0">
          <Link href={`/mb-hub/companies/${company.id}/edit`} className="btn-primary text-sm">
            Edit
          </Link>
          <Link href="/mb-hub/companies" className="btn-ghost text-sm">
            ← Back
          </Link>
        </div>
      </div>

      {/* Scores — prominent */}
      <div className="card p-6">
        <h2 className="text-xs font-bold uppercase tracking-widest mb-4" style={{ color: '#3A9E9E' }}>Scores &amp; Priority</h2>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-6">
          <div className="flex flex-col items-center gap-1">
            <ScorePill value={company.innovation_score} />
            <span className="text-xs text-gray-500">Innovation</span>
          </div>
          <div className="flex flex-col items-center gap-1">
            <ScorePill value={company.opportunity_score} />
            <span className="text-xs text-gray-500">Opportunity</span>
          </div>
          <div className="flex flex-col items-center gap-1">
            <span className="text-sm font-semibold" style={{ color: '#1B3A52' }}>{company.interview_priority || '—'}</span>
            <span className="text-xs text-gray-500">Interview Priority</span>
          </div>
          <div className="flex flex-col items-center gap-1">
            <span className="text-sm font-semibold" style={{ color: '#1B3A52' }}>{company.founder_status || '—'}</span>
            <span className="text-xs text-gray-500">Founder Status</span>
          </div>
        </div>
      </div>

      {/* Company info */}
      <Section title="Company">
        <Row label="Description" value={company.company_description} />
        <Row label="City / Region" value={company.city_region} />
        <Row label="Primary Industry" value={company.primary_industry} />
        <Row label="Secondary Industry" value={company.secondary_industry} />
        <Row label="Stage" value={company.stage} />
        <Row label="Estimated Employees" value={company.estimated_employees} />
        <Row label="Funding Raised" value={company.funding_raised} />
        <Row label="Company LinkedIn" value={company.company_linkedin_url ? <a href={company.company_linkedin_url} target="_blank" rel="noopener noreferrer" className="underline" style={{ color: '#1B3A52' }}>{company.company_linkedin_url}</a> : null} />
        <Row label="Source / List" value={company.source_list} />
      </Section>

      {/* Founders */}
      <Section title="Founders">
        <Row label="Founder Names" value={company.founder_names} />
        <Row label="Founder Overview" value={company.founder_overview} />
        <Row label="Founder LinkedIn" value={company.founder_linkedin_url ? <a href={company.founder_linkedin_url} target="_blank" rel="noopener noreferrer" className="underline" style={{ color: '#1B3A52' }}>{company.founder_linkedin_url}</a> : null} />
      </Section>

      {/* Research */}
      <Section title="Research">
        <Row label="Research Date" value={company.research_date} />
        <Row label="Has About Page" value={company.has_about_page === null ? null : company.has_about_page ? 'Yes' : 'No'} />
        <Row label="Has Team Page" value={company.has_team_page === null ? null : company.has_team_page ? 'Yes' : 'No'} />
        <Row label="Social Media Active" value={company.social_media_active === null ? null : company.social_media_active ? 'Yes' : 'No'} />
        <Row label="Press Coverage" value={company.press_coverage === null ? null : company.press_coverage ? 'Yes' : 'No'} />
        <Row label="Research Notes" value={company.research_notes && <pre className="whitespace-pre-wrap font-sans text-sm text-gray-700">{company.research_notes}</pre>} />
      </Section>

      {/* Outreach & CRM */}
      <Section title="Outreach & CRM">
        <Row label="Contact Name" value={company.contact_name} />
        <Row label="Contact Email" value={company.contact_email ? <a href={`mailto:${company.contact_email}`} className="underline" style={{ color: '#1B3A52' }}>{company.contact_email}</a> : null} />
        <Row label="Last Contact Date" value={company.last_contact_date} />
        <Row label="Interviewed" value={company.interviewed ? 'Yes' : 'No'} />
        <Row label="Podcast Episode" value={company.podcast_episode} />
        <Row label="LinkedIn Outreach Draft" value={company.outreach_linkedin_draft && <span className="bg-gray-50 border border-gray-200 rounded px-3 py-2 block text-gray-700">{company.outreach_linkedin_draft}</span>} />
        <Row label="Outreach Notes" value={company.outreach_notes} />
      </Section>

      {/* Meta */}
      <Section title="Record">
        <Row label="ID" value={<span className="font-mono text-xs text-gray-500">{company.id}</span>} />
        <Row label="Created" value={new Date(company.created_at).toLocaleString()} />
        <Row label="Updated" value={new Date(company.updated_at).toLocaleString()} />
      </Section>
    </div>
  );
}

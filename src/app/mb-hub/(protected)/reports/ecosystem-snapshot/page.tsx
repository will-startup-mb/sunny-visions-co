import Link from 'next/link';
import { db } from '@/lib/db';
import { companies } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';
import { PrintButton } from '../PrintButton';

export const dynamic = 'force-dynamic';

function breakdown(rows: { value: string | null }[], maxBars = 999) {
  const map: Record<string, number> = {};
  for (const r of rows) {
    if (r.value) map[r.value] = (map[r.value] ?? 0) + 1;
  }
  return Object.entries(map)
    .sort((a, b) => b[1] - a[1])
    .slice(0, maxBars);
}

function BarRow({ label, count, max, total, color }: { label: string; count: number; max: number; total: number; color: string }) {
  const pct = Math.round((count / total) * 100);
  const barWidth = Math.round((count / max) * 100);
  return (
    <div className="flex items-center gap-3 py-2 border-b border-gray-100 last:border-0">
      <span className="text-sm text-gray-700 w-48 flex-shrink-0 leading-snug">{label}</span>
      <div className="flex-1 h-2 rounded-full" style={{ backgroundColor: '#EEF2F6' }}>
        <div
          className="h-2 rounded-full transition-all"
          style={{ width: `${barWidth}%`, backgroundColor: color }}
        />
      </div>
      <span className="text-sm font-semibold w-6 text-right flex-shrink-0" style={{ color: '#1B3A52' }}>{count}</span>
      <span className="text-xs text-gray-400 w-8 text-right flex-shrink-0">{pct}%</span>
    </div>
  );
}

function Section({ title, accent, children }: { title: string; accent: string; children: React.ReactNode }) {
  return (
    <section className="mb-8 print:mb-6 print:break-inside-avoid">
      <div className="flex items-center gap-3 mb-4">
        <div className="w-1 h-5 rounded-full flex-shrink-0" style={{ backgroundColor: accent }} />
        <h2 className="text-base font-bold tracking-wide uppercase" style={{ color: '#1B3A52', fontSize: '0.8rem', letterSpacing: '0.08em' }}>{title}</h2>
      </div>
      <div className="bg-white rounded-xl border border-gray-100 px-5 py-3 shadow-sm">
        {children}
      </div>
    </section>
  );
}

export default async function EcosystemSnapshotPage() {
  const published = await db.select().from(companies).where(eq(companies.is_published, true));

  const total = published.length;
  const generatedDate = new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });

  // Breakdowns
  const byIndustry = breakdown(published.map((c) => ({ value: c.primary_industry })));
  const byFunding = breakdown(published.map((c) => ({ value: c.funding_raised })));
  const byStage = breakdown(published.map((c) => ({ value: c.stage })));
  const byRegion = breakdown(published.map((c) => ({ value: c.city_region })));

  // Scores
  const withInnovation = published.filter((c) => c.innovation_score != null);
  const withOpportunity = published.filter((c) => c.opportunity_score != null);
  const avgInnovation = withInnovation.length
    ? (withInnovation.reduce((s, c) => s + c.innovation_score!, 0) / withInnovation.length).toFixed(1)
    : null;
  const avgOpportunity = withOpportunity.length
    ? (withOpportunity.reduce((s, c) => s + c.opportunity_score!, 0) / withOpportunity.length).toFixed(1)
    : null;

  // Top 5 by opportunity score
  const top5 = [...published]
    .filter((c) => c.opportunity_score != null)
    .sort((a, b) => b.opportunity_score! - a.opportunity_score!)
    .slice(0, 5);

  const maxIndustry = byIndustry[0]?.[1] ?? 1;
  const maxFunding = byFunding[0]?.[1] ?? 1;
  const maxStage = byStage[0]?.[1] ?? 1;
  const maxRegion = byRegion[0]?.[1] ?? 1;

  return (
    <>
      {/* Print styles */}
      <style>{`
        @page {
          margin: 0;
        }
        @media print {
          body { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
        }
      `}</style>

      <div
        className="min-h-full p-6 md:p-10 print:p-8"
        style={{ backgroundColor: '#F4F8FB' }}
      >
        {/* Report container — white on print */}
        <div className="max-w-3xl mx-auto bg-white rounded-2xl shadow-sm border border-gray-100 p-8 md:p-10 print:shadow-none print:border-0 print:rounded-none print:p-0">

          {/* Header */}
          <div className="flex items-start justify-between gap-4 mb-8 print:mb-6">
            <div>
              <p className="text-xs font-bold uppercase tracking-widest mb-1" style={{ color: '#3A9E9E' }}>Startup MB</p>
              <h1 className="text-2xl font-extrabold leading-tight" style={{ color: '#1B3A52' }}>
                Myrtle Beach Startup<br />Ecosystem Snapshot
              </h1>
              <p className="text-sm text-gray-400 mt-2">Generated {generatedDate}</p>
            </div>
            <div className="flex flex-col items-end gap-3 print:hidden">
              <PrintButton />
              <Link href="/mb-hub/reports" className="text-xs text-gray-400 hover:text-gray-600">← Back to Reports</Link>
            </div>
          </div>

          {/* Divider */}
          <div className="h-px bg-gray-100 mb-8 print:mb-6" />

          {/* KPI row */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-10 print:mb-8">
            {[
              { label: 'Published Companies', value: total, accent: '#1B3A52' },
              { label: 'Industries Represented', value: byIndustry.length, accent: '#3A9E9E' },
              { label: 'Avg Innovation Score', value: avgInnovation ? `${avgInnovation}/10` : '—', accent: '#F26522' },
              { label: 'Avg Opportunity Score', value: avgOpportunity ? `${avgOpportunity}/10` : '—', accent: '#3A9E9E' },
            ].map((kpi) => (
              <div key={kpi.label} className="text-center py-4 px-3 rounded-xl border border-gray-100 bg-gray-50">
                <div className="text-2xl font-extrabold" style={{ color: kpi.accent }}>{kpi.value}</div>
                <div className="text-xs text-gray-500 mt-1 leading-tight">{kpi.label}</div>
              </div>
            ))}
          </div>

          {/* Industry breakdown */}
          {byIndustry.length > 0 && (
            <Section title="Companies by Primary Industry" accent="#3A9E9E">
              {byIndustry.map(([label, count]) => (
                <BarRow key={label} label={label} count={count} max={maxIndustry} total={total} color="#3A9E9E" />
              ))}
            </Section>
          )}

          {/* Funding stage */}
          {byFunding.length > 0 && (
            <Section title="Companies by Funding Stage" accent="#F26522">
              {byFunding.map(([label, count]) => (
                <BarRow key={label} label={label} count={count} max={maxFunding} total={total} color="#F26522" />
              ))}
            </Section>
          )}

          {/* Company stage */}
          {byStage.length > 0 && (
            <Section title="Companies by Company Stage" accent="#1B3A52">
              {byStage.map(([label, count]) => (
                <BarRow key={label} label={label} count={count} max={maxStage} total={total} color="#1B3A52" />
              ))}
            </Section>
          )}

          {/* Region */}
          {byRegion.length > 0 && (
            <Section title="Companies by City / Region" accent="#3A9E9E">
              {byRegion.map(([label, count]) => (
                <BarRow key={label} label={label} count={count} max={maxRegion} total={total} color="#3A9E9E" />
              ))}
            </Section>
          )}

          {/* Top 5 by opportunity score */}
          {top5.length > 0 && (
            <Section title="Top 5 Companies by Opportunity Score" accent="#F26522">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-100">
                    <th className="text-left py-2 font-semibold text-gray-500 text-xs uppercase tracking-wide">Company</th>
                    <th className="text-left py-2 font-semibold text-gray-500 text-xs uppercase tracking-wide">Industry</th>
                    <th className="text-left py-2 font-semibold text-gray-500 text-xs uppercase tracking-wide">Stage</th>
                    <th className="text-right py-2 font-semibold text-gray-500 text-xs uppercase tracking-wide">Opportunity</th>
                    <th className="text-right py-2 font-semibold text-gray-500 text-xs uppercase tracking-wide">Innovation</th>
                  </tr>
                </thead>
                <tbody>
                  {top5.map((c, i) => (
                    <tr key={c.id} className="border-b border-gray-50 last:border-0">
                      <td className="py-2.5 font-semibold" style={{ color: '#1B3A52' }}>
                        <span className="text-xs text-gray-300 mr-2">#{i + 1}</span>
                        {c.company_name}
                      </td>
                      <td className="py-2.5 text-gray-500">{c.primary_industry ?? '—'}</td>
                      <td className="py-2.5 text-gray-500">{c.stage ?? '—'}</td>
                      <td className="py-2.5 text-right font-bold" style={{ color: '#F26522' }}>{c.opportunity_score}/10</td>
                      <td className="py-2.5 text-right font-semibold text-gray-600">{c.innovation_score != null ? `${c.innovation_score}/10` : '—'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </Section>
          )}

          {/* Footer */}
          <div className="mt-10 pt-6 border-t border-gray-100 flex items-center justify-between">
            <p className="text-xs text-gray-400">
              Data sourced from the Startup MB directory · startupmb.com
            </p>
            <p className="text-xs text-gray-400">{generatedDate}</p>
          </div>
        </div>
      </div>
    </>
  );
}

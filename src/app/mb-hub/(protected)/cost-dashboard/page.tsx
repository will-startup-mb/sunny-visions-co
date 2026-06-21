import { db } from '@/lib/db';
import { researchHistory, batchJobs } from '@/lib/db/schema';
import { desc, gte } from 'drizzle-orm';

export const dynamic = 'force-dynamic';

function Stat({ label, value, sub, accent }: { label: string; value: string | number; sub?: string; accent?: boolean }) {
  return (
    <div className="card p-5">
      <div className="text-2xl font-extrabold" style={{ color: accent ? '#F26522' : '#1B3A52' }}>{value}</div>
      <div className="text-sm font-semibold mt-1" style={{ color: '#3A9E9E' }}>{label}</div>
      {sub && <div className="text-xs text-gray-400 mt-0.5">{sub}</div>}
    </div>
  );
}

function fmtTokens(n: number | null): string {
  if (!n) return '—';
  return n >= 1_000_000
    ? `${(n / 1_000_000).toFixed(2)}M`
    : n >= 1000
    ? `${(n / 1000).toFixed(1)}k`
    : String(n);
}

export default async function CostDashboardPage() {
  const now = new Date();
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

  const [allRows, monthRows, batches] = await Promise.all([
    db.select().from(researchHistory).orderBy(desc(researchHistory.run_at)).limit(50),
    db.select().from(researchHistory).where(gte(researchHistory.run_at, startOfMonth)),
    db.select().from(batchJobs).orderBy(desc(batchJobs.created_at)).limit(20),
  ]);

  const totalSpendAll = allRows.reduce((s, r) => s + parseFloat(r.estimated_cost_usd || '0'), 0);
  const totalSpendMonth = monthRows.reduce((s, r) => s + parseFloat(r.estimated_cost_usd || '0'), 0);

  const singleRows = allRows.filter((r) => r.run_type === 'single' || !r.run_type);
  const batchRows = allRows.filter((r) => r.run_type === 'batch');

  const singleSpend = singleRows.reduce((s, r) => s + parseFloat(r.estimated_cost_usd || '0'), 0);
  const batchSpend = batchRows.reduce((s, r) => s + parseFloat(r.estimated_cost_usd || '0'), 0);

  const successRows = allRows.filter((r) => r.status === 'success');
  const uniqueCompanies = new Set(successRows.map((r) => r.company_id).filter(Boolean)).size;
  const avgCostPerCompany = uniqueCompanies > 0 ? totalSpendAll / uniqueCompanies : 0;

  const monthSingle = monthRows.filter((r) => r.run_type === 'single' || !r.run_type).length;
  const monthBatch = monthRows.filter((r) => r.run_type === 'batch').length;

  const totalInputTokens = allRows.reduce((s, r) => s + (r.input_tokens ?? 0), 0);
  const totalOutputTokens = allRows.reduce((s, r) => s + (r.output_tokens ?? 0), 0);
  const totalCacheReads = allRows.reduce((s, r) => s + (r.cache_read_tokens ?? 0), 0);

  return (
    <div className="p-4 md:p-6 space-y-6 md:space-y-8">
      <div>
        <h1 className="text-xl font-extrabold" style={{ color: '#1B3A52' }}>Cost Dashboard</h1>
        <p className="text-sm text-gray-500 mt-1">API spend tracking for the research pipeline</p>
      </div>

      {/* This month */}
      <section>
        <h2 className="text-sm font-bold uppercase tracking-wide text-gray-500 mb-3">
          This Month — {now.toLocaleString('en-US', { month: 'long', year: 'numeric' })}
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Stat label="Total Spend" value={`$${totalSpendMonth.toFixed(4)}`} accent />
          <Stat label="Research Runs" value={monthRows.filter((r) => r.status === 'success').length} sub={`${monthSingle} single · ${monthBatch} batch`} />
          <Stat label="Single-company" value={`$${monthRows.filter((r) => r.run_type === 'single' || !r.run_type).reduce((s, r) => s + parseFloat(r.estimated_cost_usd || '0'), 0).toFixed(4)}`} sub="real-time runs" />
          <Stat label="Batch" value={`$${monthRows.filter((r) => r.run_type === 'batch').reduce((s, r) => s + parseFloat(r.estimated_cost_usd || '0'), 0).toFixed(4)}`} sub="50% discount runs" />
        </div>
      </section>

      {/* All-time */}
      <section>
        <h2 className="text-sm font-bold uppercase tracking-wide text-gray-500 mb-3">All-Time</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Stat label="Total API Spend" value={`$${totalSpendAll.toFixed(4)}`} accent />
          <Stat label="Companies Researched" value={uniqueCompanies} sub="unique companies" />
          <Stat label="Avg Cost / Company" value={`$${avgCostPerCompany.toFixed(4)}`} />
          <Stat label="Total Runs" value={allRows.length} sub={`${singleRows.length} single · ${batchRows.length} batch`} />
        </div>
      </section>

      {/* Token breakdown */}
      <section>
        <h2 className="text-sm font-bold uppercase tracking-wide text-gray-500 mb-3">Token Usage (All-Time)</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Stat label="Input Tokens" value={fmtTokens(totalInputTokens)} sub="standard billed" />
          <Stat label="Output Tokens" value={fmtTokens(totalOutputTokens)} />
          <Stat label="Cache Reads" value={fmtTokens(totalCacheReads)} sub="90% cheaper than standard" />
          <Stat
            label="Spend Breakdown"
            value={`$${singleSpend.toFixed(2)} / $${batchSpend.toFixed(2)}`}
            sub="single / batch"
          />
        </div>
      </section>

      {/* Recent batch jobs */}
      {batches.length > 0 && (
        <section>
          <h2 className="text-sm font-bold uppercase tracking-wide text-gray-500 mb-3">Recent Batch Jobs</h2>
          <div className="card overflow-hidden">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-200" style={{ backgroundColor: '#F4F8FB' }}>
                  {['Submitted', 'Companies', 'Status', 'Cost', 'Completed'].map((h) => (
                    <th key={h} className="text-left px-4 py-3 text-xs font-bold uppercase tracking-wide text-gray-500">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {batches.map((job) => (
                  <tr key={job.id} className="border-b border-gray-100 hover:bg-blue-50/20">
                    <td className="px-4 py-3 text-xs text-gray-500">
                      {new Date(job.created_at).toLocaleString('en-US', { month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit' })}
                    </td>
                    <td className="px-4 py-3 font-medium">{job.completed_companies ?? 0} / {job.total_companies}</td>
                    <td className="px-4 py-3">
                      <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${
                        job.status === 'complete' ? 'bg-emerald-50 text-emerald-700' :
                        job.status === 'processing' ? 'bg-blue-50 text-blue-600' :
                        job.status === 'failed' ? 'bg-red-50 text-red-600' :
                        'bg-amber-50 text-amber-600'
                      }`}>
                        {job.status}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-xs text-gray-600 tabular-nums">
                      {job.estimated_cost_usd ? `$${job.estimated_cost_usd}` : '—'}
                    </td>
                    <td className="px-4 py-3 text-xs text-gray-500">
                      {job.completed_at
                        ? new Date(job.completed_at).toLocaleString('en-US', { month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit' })
                        : '—'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      )}

      {/* Recent runs */}
      <section>
        <h2 className="text-sm font-bold uppercase tracking-wide text-gray-500 mb-3">Recent Runs (Last 50)</h2>
        <div className="card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm" style={{ minWidth: '700px' }}>
              <thead>
                <tr className="border-b border-gray-200" style={{ backgroundColor: '#F4F8FB' }}>
                  {['Company', 'Date', 'Type', 'Status', 'Tokens (in/out)', 'Cache reads', 'Cost'].map((h) => (
                    <th key={h} className="text-left px-4 py-3 text-xs font-bold uppercase tracking-wide text-gray-500">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {allRows.map((row) => (
                  <tr key={row.id} className="border-b border-gray-100 hover:bg-blue-50/20">
                    <td className="px-4 py-3 font-medium text-xs" style={{ color: '#1B3A52' }}>{row.company_name}</td>
                    <td className="px-4 py-3 text-xs text-gray-500">
                      {new Date(row.run_at).toLocaleString('en-US', { month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit' })}
                    </td>
                    <td className="px-4 py-3">
                      <span className={`text-xs px-1.5 py-0.5 rounded font-medium ${
                        row.run_type === 'batch' ? 'bg-orange-100 text-orange-700' : 'bg-gray-100 text-gray-600'
                      }`}>
                        {row.run_type === 'batch' ? 'batch' : 'single'}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      {row.status === 'success' ? (
                        <span className="text-xs text-emerald-600">✓</span>
                      ) : (
                        <span className="text-xs text-red-500">✗</span>
                      )}
                    </td>
                    <td className="px-4 py-3 text-xs text-gray-500 tabular-nums">
                      {row.input_tokens !== null ? `${fmtTokens(row.input_tokens)} / ${fmtTokens(row.output_tokens)}` : '—'}
                    </td>
                    <td className="px-4 py-3 text-xs text-emerald-600 tabular-nums">
                      {row.cache_read_tokens ? fmtTokens(row.cache_read_tokens) : '—'}
                    </td>
                    <td className="px-4 py-3 text-xs font-medium tabular-nums" style={{ color: '#1B3A52' }}>
                      ${row.estimated_cost_usd}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>
    </div>
  );
}

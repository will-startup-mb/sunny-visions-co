import { db } from '@/lib/db';
import { researchHistory } from '@/lib/db/schema';
import { desc } from 'drizzle-orm';
import Link from 'next/link';

export const dynamic = 'force-dynamic';

function fmtTokens(n: number | null): string {
  if (!n) return '—';
  return n >= 1000 ? `${(n / 1000).toFixed(1)}k` : String(n);
}

export default async function ResearchHistoryPage() {
  const rows = await db.select().from(researchHistory).orderBy(desc(researchHistory.run_at));

  const totalCost = rows.reduce((sum, r) => sum + parseFloat(r.estimated_cost_usd), 0);
  const succeeded = rows.filter((r) => r.status === 'success').length;
  const failed = rows.filter((r) => r.status === 'failed').length;
  const hasActualTokens = rows.some((r) => r.input_tokens !== null);

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <div className="mb-6">
        <h1 className="text-xl font-extrabold" style={{ color: '#1B3A52' }}>Research History</h1>
        <p className="text-sm text-gray-500 mt-1">{rows.length} total runs</p>
      </div>

      {/* Summary stats */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        {[
          { label: 'Total Runs', value: rows.length },
          { label: 'Succeeded', value: succeeded },
          { label: 'Total API Cost', value: `$${totalCost.toFixed(4)}` },
        ].map((s) => (
          <div key={s.label} className="card p-4 text-center">
            <div className="text-2xl font-extrabold" style={{ color: '#1B3A52' }}>{s.value}</div>
            <div className="text-xs text-gray-500 mt-0.5">{s.label}</div>
          </div>
        ))}
      </div>

      {rows.length === 0 ? (
        <div className="card p-12 text-center text-gray-500">
          <p className="text-4xl mb-4">🔬</p>
          <p className="text-lg font-medium">No research runs yet</p>
          <p className="text-sm mt-1">Run the research pipeline on a company to see history here.</p>
        </div>
      ) : (
        <div className="card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm" style={{ minWidth: '700px' }}>
              <thead>
                <tr className="border-b border-gray-200" style={{ backgroundColor: '#F4F8FB' }}>
                  {['Company', 'Date & Time', 'Status', hasActualTokens ? 'Tokens (in / out)' : null, 'Cost', '']
                    .filter(Boolean)
                    .map((h) => (
                      <th key={h!} className="text-left px-4 py-3 text-xs font-bold uppercase tracking-wide text-gray-500">{h}</th>
                    ))}
                </tr>
              </thead>
              <tbody>
                {rows.map((row) => (
                  <tr key={row.id} className="border-b border-gray-100 hover:bg-blue-50/30">
                    <td className="px-4 py-3 font-medium" style={{ color: '#1B3A52' }}>
                      {row.company_id ? (
                        <Link href={`/admin/companies/${row.company_id}`} className="hover:underline">
                          {row.company_name}
                        </Link>
                      ) : (
                        row.company_name
                      )}
                    </td>
                    <td className="px-4 py-3 text-gray-500 text-xs">
                      {new Date(row.run_at).toLocaleString('en-US', {
                        month: 'short', day: 'numeric', year: 'numeric',
                        hour: 'numeric', minute: '2-digit',
                      })}
                    </td>
                    <td className="px-4 py-3">
                      {row.status === 'success' ? (
                        <span className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full">
                          ✓ Success
                        </span>
                      ) : (
                        <span
                          className="inline-flex items-center gap-1 text-xs font-semibold text-red-600 bg-red-50 px-2 py-0.5 rounded-full"
                          title={row.error_message ?? ''}
                        >
                          ✗ Failed
                        </span>
                      )}
                    </td>
                    {hasActualTokens && (
                      <td className="px-4 py-3 text-xs text-gray-500 tabular-nums">
                        {row.input_tokens !== null
                          ? <>{fmtTokens(row.input_tokens)} / {fmtTokens(row.output_tokens)}</>
                          : <span className="text-gray-300">—</span>}
                      </td>
                    )}
                    <td className="px-4 py-3 text-gray-700 tabular-nums text-xs">
                      {row.input_tokens !== null
                        ? <>${row.estimated_cost_usd}</>
                        : <span className="text-gray-400" title="Estimated before token tracking">~${row.estimated_cost_usd}</span>}
                    </td>
                    <td className="px-4 py-3">
                      {row.company_id && (
                        <Link
                          href={`/admin/companies/${row.company_id}/research`}
                          className="text-xs btn-ghost py-1 px-2"
                          title="Re-run research"
                        >
                          🔬 Re-run
                        </Link>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {failed > 0 && (
        <p className="text-xs text-gray-400 mt-4">
          {failed} failed run{failed > 1 ? 's' : ''} — hover the ✗ badge to see the error.
        </p>
      )}
    </div>
  );
}

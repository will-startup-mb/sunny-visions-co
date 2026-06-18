import { db } from '@/lib/db';
import { companies, researchHistory } from '@/lib/db/schema';

export const dynamic = 'force-dynamic';

export default async function StatsPage() {
  const [all, historyRows] = await Promise.all([
    db.select().from(companies),
    db.select({ cost: researchHistory.estimated_cost_usd, tokens_in: researchHistory.input_tokens, tokens_out: researchHistory.output_tokens }).from(researchHistory),
  ]);

  const total = all.length;
  const researched = all.filter((c) => c.research_date).length;
  const published = all.filter((c) => c.is_published).length;
  const highPriority = all.filter((c) => c.interview_priority === 'High').length;
  const medPriority = all.filter((c) => c.interview_priority === 'Medium').length;
  const interviewed = all.filter((c) => c.interviewed).length;
  const contacted = all.filter((c) => c.founder_status !== 'Not Contacted' && c.founder_status).length;

  // Industry breakdown
  const industryCount: Record<string, number> = {};
  for (const c of all) {
    if (c.primary_industry) {
      industryCount[c.primary_industry] = (industryCount[c.primary_industry] || 0) + 1;
    }
  }
  const topIndustries = Object.entries(industryCount)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 10);

  // Stage breakdown
  const stageCount: Record<string, number> = {};
  for (const c of all) {
    if (c.stage) {
      stageCount[c.stage] = (stageCount[c.stage] || 0) + 1;
    }
  }

  // Research spend
  const totalSpend = historyRows.reduce((sum, r) => sum + parseFloat(r.cost), 0);
  const totalInputTokens = historyRows.reduce((sum, r) => sum + (r.tokens_in ?? 0), 0);
  const totalOutputTokens = historyRows.reduce((sum, r) => sum + (r.tokens_out ?? 0), 0);
  const totalTokens = totalInputTokens + totalOutputTokens;

  // Avg scores
  const scored = all.filter((c) => c.innovation_score);
  const avgInnovation = scored.length
    ? (scored.reduce((s, c) => s + (c.innovation_score || 0), 0) / scored.length).toFixed(1)
    : '—';
  const scored2 = all.filter((c) => c.opportunity_score);
  const avgOpportunity = scored2.length
    ? (scored2.reduce((s, c) => s + (c.opportunity_score || 0), 0) / scored2.length).toFixed(1)
    : '—';

  const Stat = ({ label, value, sub }: { label: string; value: string | number; sub?: string }) => (
    <div className="card p-5">
      <div className="text-3xl font-extrabold" style={{ color: '#1B3A52' }}>{value}</div>
      <div className="text-sm font-semibold mt-1" style={{ color: '#3A9E9E' }}>{label}</div>
      {sub && <div className="text-xs text-gray-400 mt-0.5">{sub}</div>}
    </div>
  );

  return (
    <div className="p-6 space-y-8">
      <h1 className="text-xl font-extrabold" style={{ color: '#1B3A52' }}>Ecosystem Stats</h1>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Stat label="Total Companies" value={total} />
        <Stat label="Researched" value={researched} sub={`${total - researched} still need research`} />
        <Stat label="Published" value={published} sub={`${total - published} unpublished`} />
        <Stat label="Interviewed" value={interviewed} />
        <Stat label="High Priority" value={highPriority} />
        <Stat label="Medium Priority" value={medPriority} />
        <Stat label="Contacted" value={contacted} sub="any status beyond Not Contacted" />
        <Stat label="Avg Innovation Score" value={avgInnovation} />
        <Stat
          label="Research API Spend"
          value={`$${totalSpend.toFixed(4)}`}
          sub={totalTokens > 0 ? `${(totalTokens / 1000).toFixed(1)}k total tokens` : `${historyRows.length} run${historyRows.length !== 1 ? 's' : ''}`}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Industry breakdown */}
        <div className="card p-5">
          <h2 className="font-bold mb-4" style={{ color: '#1B3A52' }}>Top Industries</h2>
          <div className="space-y-2">
            {topIndustries.map(([industry, count]) => (
              <div key={industry} className="flex items-center gap-3">
                <span className="text-sm flex-1 truncate">{industry}</span>
                <div className="flex items-center gap-2">
                  <div
                    className="h-2 rounded-full"
                    style={{
                      width: `${Math.max(4, (count / total) * 120)}px`,
                      backgroundColor: '#3A9E9E',
                    }}
                  />
                  <span className="text-xs text-gray-500 w-4 text-right">{count}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Stage breakdown */}
        <div className="card p-5">
          <h2 className="font-bold mb-4" style={{ color: '#1B3A52' }}>Companies by Stage</h2>
          <div className="space-y-2">
            {Object.entries(stageCount)
              .sort((a, b) => b[1] - a[1])
              .map(([stage, count]) => (
                <div key={stage} className="flex items-center gap-3">
                  <span className="text-sm flex-1">{stage}</span>
                  <div className="flex items-center gap-2">
                    <div
                      className="h-2 rounded-full"
                      style={{
                        width: `${Math.max(4, (count / total) * 120)}px`,
                        backgroundColor: '#F26522',
                      }}
                    />
                    <span className="text-xs text-gray-500 w-4 text-right">{count}</span>
                  </div>
                </div>
              ))}
          </div>
        </div>
      </div>
    </div>
  );
}

import { db } from '@/lib/db';
import { companies, researchHistory } from '@/lib/db/schema';
import { BubbleChart } from './BubbleChart';

export const dynamic = 'force-dynamic';

function Stat({ label, value, sub }: { label: string; value: string | number; sub?: string }) {
  return (
    <div className="card p-5">
      <div className="text-3xl font-extrabold" style={{ color: '#1B3A52' }}>{value}</div>
      <div className="text-sm font-semibold mt-1" style={{ color: '#3A9E9E' }}>{label}</div>
      {sub && <div className="text-xs text-gray-400 mt-0.5">{sub}</div>}
    </div>
  );
}

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
  const industryMap: Record<string, string[]> = {};
  for (const c of all) {
    if (c.primary_industry) {
      (industryMap[c.primary_industry] ??= []).push(c.company_name);
    }
  }
  const topIndustries = Object.entries(industryMap)
    .sort((a, b) => b[1].length - a[1].length)
    .slice(0, 10);

  // Stage breakdown
  const stageMap: Record<string, string[]> = {};
  for (const c of all) {
    if (c.stage) {
      (stageMap[c.stage] ??= []).push(c.company_name);
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

  return (
    <div className="p-4 md:p-6 space-y-6 md:space-y-8">
      <h1 className="text-xl font-extrabold" style={{ color: '#1B3A52' }}>Ecosystem Stats</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="card p-5">
          <h2 className="font-bold mb-3" style={{ color: '#1B3A52' }}>Top Industries</h2>
          <BubbleChart
            items={topIndustries.map(([label, names]) => ({ label, count: names.length, companies: names }))}
            color="#3A9E9E"
          />
        </div>

        <div className="card p-5">
          <h2 className="font-bold mb-3" style={{ color: '#1B3A52' }}>Companies by Stage</h2>
          <BubbleChart
            items={Object.entries(stageMap)
              .sort((a, b) => b[1].length - a[1].length)
              .map(([label, names]) => ({ label, count: names.length, companies: names }))}
            color="#F26522"
          />
        </div>
      </div>

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
    </div>
  );
}

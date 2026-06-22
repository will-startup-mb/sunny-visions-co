import { db } from '@/lib/db';
import { clients } from '@/lib/db/schema';
import { desc } from 'drizzle-orm';

export const dynamic = 'force-dynamic';

export default async function StatsPage() {
  const allClients = await db.select().from(clients).orderBy(desc(clients.created_at));

  const byService: Record<string, number> = {};
  const byStatus: Record<string, number> = {};
  for (const c of allClients) {
    const svc = c.service_type ?? 'Other';
    byService[svc] = (byService[svc] ?? 0) + 1;
    const st = c.status ?? 'Lead';
    byStatus[st] = (byStatus[st] ?? 0) + 1;
  }

  const totalRevenue = allClients.reduce((s, c) => s + parseFloat(c.project_value?.toString() ?? '0'), 0);
  const activeRevenue = allClients
    .filter((c) => c.status === 'Active')
    .reduce((s, c) => s + parseFloat(c.project_value?.toString() ?? '0'), 0);

  const conversionRate = allClients.length > 0
    ? ((allClients.filter((c) => c.became_client).length / allClients.length) * 100).toFixed(0)
    : '0';

  const statusOrder = ['Lead', 'Proposal Sent', 'Active', 'Complete', 'Lost'];
  const statusColors: Record<string, string> = {
    Lead: '#F2BC2B',
    'Proposal Sent': '#5B9FA3',
    Active: '#E8521A',
    Complete: '#3D2B1F',
    Lost: '#D4C4A0',
  };

  return (
    <div className="p-4 md:p-6 space-y-6 md:space-y-8">
      <div>
        <h1 className="text-xl font-extrabold" style={{ color: '#3D2B1F' }}>Stats</h1>
        <p className="text-sm text-gray-500 mt-1">Overview of your client pipeline</p>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'Total Clients', value: allClients.length, accent: true },
          { label: 'Pipeline Value', value: `$${totalRevenue.toLocaleString()}` },
          { label: 'Active Revenue', value: `$${activeRevenue.toLocaleString()}` },
          { label: 'Conversion Rate', value: `${conversionRate}%`, sub: 'leads → clients' },
        ].map((s) => (
          <div key={s.label} className="card p-5">
            <div className="text-2xl font-extrabold" style={{ color: s.accent ? '#E8521A' : '#3D2B1F' }}>{s.value}</div>
            <div className="text-sm font-semibold mt-1" style={{ color: '#5B9FA3' }}>{s.label}</div>
            {s.sub && <div className="text-xs text-gray-400 mt-0.5">{s.sub}</div>}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* By Status */}
        <div className="card p-6">
          <h2 className="text-sm font-bold uppercase tracking-wide text-gray-500 mb-4">By Status</h2>
          <div className="space-y-3">
            {statusOrder.map((status) => {
              const count = byStatus[status] ?? 0;
              const pct = allClients.length > 0 ? (count / allClients.length) * 100 : 0;
              return (
                <div key={status}>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="font-medium" style={{ color: '#3D2B1F' }}>{status}</span>
                    <span className="text-gray-500">{count}</span>
                  </div>
                  <div className="h-2 rounded-full bg-gray-100 overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all"
                      style={{ width: `${pct}%`, backgroundColor: statusColors[status] ?? '#D4C4A0' }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* By Service */}
        <div className="card p-6">
          <h2 className="text-sm font-bold uppercase tracking-wide text-gray-500 mb-4">By Service</h2>
          <div className="space-y-3">
            {Object.entries(byService).sort((a, b) => b[1] - a[1]).map(([service, count]) => {
              const pct = allClients.length > 0 ? (count / allClients.length) * 100 : 0;
              return (
                <div key={service}>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="font-medium" style={{ color: '#3D2B1F' }}>{service}</span>
                    <span className="text-gray-500">{count}</span>
                  </div>
                  <div className="h-2 rounded-full bg-gray-100 overflow-hidden">
                    <div className="h-full rounded-full" style={{ width: `${pct}%`, backgroundColor: '#5B9FA3' }} />
                  </div>
                </div>
              );
            })}
            {Object.keys(byService).length === 0 && (
              <p className="text-sm text-gray-400">No data yet</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

import { db } from '@/lib/db';
import { projectCosts, clients } from '@/lib/db/schema';
import { desc, gte, sql } from 'drizzle-orm';
import Link from 'next/link';

export const dynamic = 'force-dynamic';

function Stat({ label, value, sub, accent }: { label: string; value: string | number; sub?: string; accent?: boolean }) {
  return (
    <div className="card p-5">
      <div className="text-2xl font-extrabold" style={{ color: accent ? '#E8521A' : '#3D2B1F' }}>{value}</div>
      <div className="text-sm font-semibold mt-1" style={{ color: '#5B9FA3' }}>{label}</div>
      {sub && <div className="text-xs text-gray-400 mt-0.5">{sub}</div>}
    </div>
  );
}

export default async function CostTrackerPage() {
  const now = new Date();
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

  const [allCosts, monthCosts, allClients] = await Promise.all([
    db.select({ cost: projectCosts, client: clients })
      .from(projectCosts)
      .leftJoin(clients, sql`${projectCosts.client_id} = ${clients.id}`)
      .orderBy(desc(projectCosts.created_at))
      .limit(50),
    db.select().from(projectCosts).where(gte(projectCosts.created_at, startOfMonth)),
    db.select().from(clients),
  ]);

  const totalAllTime = allCosts.reduce((s, r) => s + parseFloat(r.cost.amount?.toString() ?? '0'), 0);
  const totalThisMonth = monthCosts.reduce((s, r) => s + parseFloat(r.amount?.toString() ?? '0'), 0);
  const activeClients = allClients.filter((c) => c.status === 'Active').length;
  const totalRevenue = allClients.reduce((s, c) => s + parseFloat(c.project_value?.toString() ?? '0'), 0);

  return (
    <div className="p-4 md:p-6 space-y-6 md:space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-extrabold" style={{ color: '#3D2B1F' }}>Cost Tracker</h1>
          <p className="text-sm text-gray-500 mt-1">Project expenses and revenue</p>
        </div>
        <Link href="/sv-hub/cost-tracker/new" className="btn-primary text-sm">+ Add Expense</Link>
      </div>

      {/* This Month */}
      <section>
        <h2 className="text-sm font-bold uppercase tracking-wide text-gray-500 mb-3">
          This Month — {now.toLocaleString('en-US', { month: 'long', year: 'numeric' })}
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Stat label="Expenses" value={`$${totalThisMonth.toFixed(2)}`} accent />
          <Stat label="Entries" value={monthCosts.length} sub="this month" />
          <Stat label="Active Clients" value={activeClients} />
          <Stat label="Pipeline Value" value={`$${totalRevenue.toLocaleString()}`} sub="all project values" />
        </div>
      </section>

      {/* All-Time */}
      <section>
        <h2 className="text-sm font-bold uppercase tracking-wide text-gray-500 mb-3">All-Time</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Stat label="Total Expenses" value={`$${totalAllTime.toFixed(2)}`} accent />
          <Stat label="Total Clients" value={allClients.length} />
          <Stat label="Clients Won" value={allClients.filter((c) => c.became_client).length} sub="became client" />
          <Stat label="Published Portfolio" value={allClients.filter((c) => c.portfolio_published).length} sub="projects" />
        </div>
      </section>

      {/* Recent expenses */}
      <section>
        <h2 className="text-sm font-bold uppercase tracking-wide text-gray-500 mb-3">Recent Expenses</h2>
        {allCosts.length === 0 ? (
          <div className="card p-8 text-center text-gray-400 text-sm">No expenses logged yet</div>
        ) : (
          <div className="card overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm" style={{ minWidth: '500px' }}>
                <thead>
                  <tr className="border-b border-gray-200" style={{ backgroundColor: '#F5EFE0' }}>
                    {['Date', 'Client', 'Description', 'Amount', ''].map((h) => (
                      <th key={h} className="text-left px-4 py-3 text-xs font-bold uppercase tracking-wide text-gray-500">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {allCosts.map(({ cost, client }) => (
                    <tr key={cost.id} className="border-b border-gray-100 hover:bg-amber-50/20">
                      <td className="px-4 py-3 text-xs text-gray-500">{cost.cost_date ?? '—'}</td>
                      <td className="px-4 py-3 text-xs font-medium" style={{ color: '#3D2B1F' }}>
                        {client?.client_name ?? '—'}
                      </td>
                      <td className="px-4 py-3 text-xs text-gray-600">{cost.description ?? '—'}</td>
                      <td className="px-4 py-3 text-xs font-semibold tabular-nums" style={{ color: '#E8521A' }}>
                        ${parseFloat(cost.amount?.toString() ?? '0').toFixed(2)}
                      </td>
                      <td className="px-4 py-3">
                        <DeleteCostButton id={cost.id} />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </section>
    </div>
  );
}

function DeleteCostButton({ id }: { id: string }) {
  return (
    <form action={`/api/project-costs/${id}`} method="POST">
      <input type="hidden" name="_method" value="DELETE" />
    </form>
  );
}

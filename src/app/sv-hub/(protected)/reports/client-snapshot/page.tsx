import { db } from '@/lib/db';
import { clients } from '@/lib/db/schema';
import { asc } from 'drizzle-orm';

export const dynamic = 'force-dynamic';

const STATUS_ORDER = ['Lead', 'Proposal Sent', 'Active', 'Complete', 'Lost'];

export default async function ClientSnapshotPage() {
  const allClients = await db.select().from(clients).orderBy(asc(clients.client_name));
  const grouped: Record<string, typeof allClients> = {};
  for (const c of allClients) {
    const key = c.status ?? 'Lead';
    (grouped[key] ??= []).push(c);
  }
  const totalRevenue = allClients.reduce((s, c) => s + parseFloat(c.project_value?.toString() ?? '0'), 0);

  return (
    <div className="p-4 md:p-8 print:p-4 max-w-4xl mx-auto space-y-8">
      <div className="flex items-center justify-between print:hidden">
        <h1 className="text-xl font-extrabold" style={{ color: '#3D2B1F' }}>Client Snapshot</h1>
        <button onClick={() => window.print()} className="btn-ghost text-sm">Print / Save PDF</button>
      </div>

      <div className="hidden print:block mb-6">
        <h1 className="text-2xl font-bold" style={{ color: '#3D2B1F', fontFamily: "'Lobster Two', cursive" }}>
          Sunny Visions Co. — Client Snapshot
        </h1>
        <p className="text-sm text-gray-500 mt-1">
          Generated {new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
        </p>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-3 gap-4">
        <div className="card p-4 text-center">
          <div className="text-2xl font-extrabold" style={{ color: '#E8521A' }}>{allClients.length}</div>
          <div className="text-xs font-semibold text-gray-500">Total Clients</div>
        </div>
        <div className="card p-4 text-center">
          <div className="text-2xl font-extrabold" style={{ color: '#E8521A' }}>
            {allClients.filter((c) => c.status === 'Active').length}
          </div>
          <div className="text-xs font-semibold text-gray-500">Active</div>
        </div>
        <div className="card p-4 text-center">
          <div className="text-2xl font-extrabold" style={{ color: '#E8521A' }}>
            ${totalRevenue.toLocaleString()}
          </div>
          <div className="text-xs font-semibold text-gray-500">Pipeline Value</div>
        </div>
      </div>

      {STATUS_ORDER.filter((s) => grouped[s]?.length).map((status) => (
        <section key={status}>
          <h2 className="text-sm font-bold uppercase tracking-widest mb-3" style={{ color: '#5B9FA3' }}>
            {status} ({grouped[status].length})
          </h2>
          <div className="card overflow-hidden">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b" style={{ backgroundColor: '#F5EFE0' }}>
                  {['Client', 'Service', 'Value', 'Last Contact'].map((h) => (
                    <th key={h} className="text-left px-4 py-2 text-xs font-bold uppercase tracking-wide text-gray-500">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {grouped[status].map((c) => (
                  <tr key={c.id} className="border-b border-gray-100">
                    <td className="px-4 py-2.5 font-medium text-xs" style={{ color: '#3D2B1F' }}>{c.client_name}</td>
                    <td className="px-4 py-2.5 text-xs text-gray-500">{c.service_type ?? '—'}</td>
                    <td className="px-4 py-2.5 text-xs font-medium tabular-nums">
                      {c.project_value ? `$${Number(c.project_value).toLocaleString()}` : '—'}
                    </td>
                    <td className="px-4 py-2.5 text-xs text-gray-500">{c.last_contact_date ?? '—'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      ))}
    </div>
  );
}

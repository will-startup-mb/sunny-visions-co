import { db } from '@/lib/db';
import { clients } from '@/lib/db/schema';
import { desc } from 'drizzle-orm';
import Link from 'next/link';
import { AdminClientTable } from './AdminClientTable';

export const dynamic = 'force-dynamic';

export default async function ClientsPage() {
  const allClients = await db.select().from(clients).orderBy(desc(clients.created_at));

  const counts = {
    Lead: allClients.filter((c) => c.status === 'Lead').length,
    'Proposal Sent': allClients.filter((c) => c.status === 'Proposal Sent').length,
    Active: allClients.filter((c) => c.status === 'Active').length,
    Complete: allClients.filter((c) => c.status === 'Complete').length,
    Lost: allClients.filter((c) => c.status === 'Lost').length,
  };

  return (
    <div className="p-4 md:p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-extrabold" style={{ color: '#3D2B1F' }}>Clients</h1>
          <p className="text-sm text-gray-500 mt-1">{allClients.length} total</p>
        </div>
        <Link href="/sv-hub/clients/new" className="btn-primary text-sm">+ Add Client</Link>
      </div>

      {/* Status summary */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
        {Object.entries(counts).map(([label, count]) => (
          <div key={label} className="card p-4 text-center">
            <div className="text-2xl font-extrabold" style={{ color: '#E8521A' }}>{count}</div>
            <div className="text-xs font-semibold text-gray-500 mt-0.5">{label}</div>
          </div>
        ))}
      </div>

      <AdminClientTable clients={allClients} />
    </div>
  );
}

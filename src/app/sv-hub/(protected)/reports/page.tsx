import Link from 'next/link';

export default function ReportsPage() {
  return (
    <div className="p-4 md:p-6 space-y-6">
      <div>
        <h1 className="text-xl font-extrabold" style={{ color: '#3D2B1F' }}>Reports</h1>
        <p className="text-sm text-gray-500 mt-1">Summaries and snapshots of your client data</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Link href="/sv-hub/reports/client-snapshot" className="card p-6 hover:shadow-md transition-shadow group">
          <h2 className="font-bold text-base mb-1 group-hover:underline" style={{ color: '#3D2B1F' }}>
            Client Snapshot →
          </h2>
          <p className="text-sm text-gray-500">Pipeline overview by status and service type. Print-friendly.</p>
        </Link>
      </div>
    </div>
  );
}

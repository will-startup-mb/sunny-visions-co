import Link from 'next/link';

export default function ReportsPage() {
  return (
    <div className="p-6 max-w-3xl mx-auto">
      <h1 className="text-xl font-extrabold mb-2" style={{ color: '#1B3A52' }}>Reports</h1>
      <p className="text-sm text-gray-500 mb-8">Live reports generated from the Startup MB database.</p>

      <div className="space-y-3">
        <Link
          href="/mb-hub/reports/ecosystem-snapshot"
          className="card p-5 flex items-center justify-between gap-4 hover:shadow-md transition-shadow block"
        >
          <div>
            <p className="font-semibold" style={{ color: '#1B3A52' }}>Ecosystem Snapshot</p>
            <p className="text-sm text-gray-500 mt-0.5">
              Published companies by industry, stage, funding, region, and top performers. Designed for stakeholder sharing.
            </p>
          </div>
          <span className="text-gray-300 flex-shrink-0 text-xl">→</span>
        </Link>
      </div>
    </div>
  );
}

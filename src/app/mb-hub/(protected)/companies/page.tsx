import Link from 'next/link';
import { db } from '@/lib/db';
import { companies, researchHistory } from '@/lib/db/schema';
import { asc, desc, eq, ilike, or, and, sql } from 'drizzle-orm';
import { QueueManager } from './QueueManager';

export const dynamic = 'force-dynamic';

interface SearchParams {
  search?: string;
  priority?: string;
  stage?: string;
  published?: string;
}

async function getStats() {
  const all = await db.select().from(companies);
  return {
    total: all.length,
    researched: all.filter((c) => c.research_date).length,
    highPriority: all.filter((c) => c.interview_priority === 'High').length,
    interviewed: all.filter((c) => c.interviewed).length,
    published: all.filter((c) => c.is_published).length,
  };
}

const FALLBACK_INSTANT = 0.10;
const FALLBACK_BATCH   = 0.05;

async function getCostAverages() {
  const rows = await db
    .select({ run_type: researchHistory.run_type, cost: researchHistory.estimated_cost_usd })
    .from(researchHistory)
    .where(eq(researchHistory.status, 'success'))
    .orderBy(desc(researchHistory.run_at));

  const instantRows = rows.filter((r) => r.run_type !== 'batch').slice(0, 10);
  const batchRows   = rows.filter((r) => r.run_type === 'batch').slice(0, 10);

  const avg = (list: typeof rows) =>
    list.reduce((sum, r) => sum + parseFloat(r.cost), 0) / list.length;

  return {
    instantAvgCost: instantRows.length > 0 ? avg(instantRows) : FALLBACK_INSTANT,
    batchAvgCost:   batchRows.length   > 0 ? avg(batchRows)   : FALLBACK_BATCH,
    instantCount: instantRows.length,
    batchCount:   batchRows.length,
  };
}

async function getCompanies(params: SearchParams) {
  const conditions = [];

  if (params.search) {
    conditions.push(
      or(
        ilike(companies.company_name, `%${params.search}%`),
        ilike(companies.founder_names, `%${params.search}%`),
        ilike(companies.primary_industry, `%${params.search}%`)
      )
    );
  }
  if (params.priority) conditions.push(eq(companies.interview_priority, params.priority));
  if (params.stage) conditions.push(eq(companies.stage, params.stage));
  if (params.published === 'true') conditions.push(eq(companies.is_published, true));
  if (params.published === 'false') conditions.push(eq(companies.is_published, false));

  return db
    .select()
    .from(companies)
    .where(conditions.length > 0 ? and(...conditions) : undefined)
    .orderBy(asc(sql`LOWER(${companies.company_name})`));
}

export default async function AdminCompaniesPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const params = await searchParams;
  const [stats, rows, costAverages] = await Promise.all([getStats(), getCompanies(params), getCostAverages()]);

  return (
    <div className="p-6 space-y-6">
      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        {[
          { label: 'Total', value: stats.total },
          { label: 'Researched', value: stats.researched },
          { label: 'High Priority', value: stats.highPriority },
          { label: 'Interviewed', value: stats.interviewed },
          { label: 'Published', value: stats.published },
        ].map((stat) => (
          <div key={stat.label} className="card p-4 text-center">
            <div className="text-2xl font-extrabold" style={{ color: '#1B3A52' }}>{stat.value}</div>
            <div className="text-xs text-gray-500 mt-0.5">{stat.label}</div>
          </div>
        ))}
      </div>

      {/* Toolbar */}
      <div className="flex flex-wrap gap-3 items-center">
        <Link href="/mb-hub/companies/new" className="btn-primary">+ Add Company</Link>
        <Link href="/mb-hub/import" className="btn-ghost">CSV Import</Link>

        <form method="GET" className="flex gap-2 ml-auto flex-wrap">
          <input
            name="search"
            defaultValue={params.search}
            placeholder="Search companies…"
            className="text-sm py-1.5"
            style={{ width: '220px' }}
          />
          <select name="priority" defaultValue={params.priority || ''} className="text-sm py-1.5" style={{ width: 'auto' }}>
            <option value="">All Priorities</option>
            <option value="High">High</option>
            <option value="Medium">Medium</option>
            <option value="Low">Low</option>
          </select>
          <select name="published" defaultValue={params.published || ''} className="text-sm py-1.5" style={{ width: 'auto' }}>
            <option value="">All</option>
            <option value="true">Published</option>
            <option value="false">Unpublished</option>
          </select>
          <button type="submit" className="btn-ghost text-sm py-1.5">Filter</button>
          {(params.search || params.priority || params.stage || params.published) && (
            <Link href="/mb-hub/companies" className="text-sm underline self-center" style={{ color: '#F26522' }}>
              Clear
            </Link>
          )}
        </form>
      </div>

      <QueueManager companies={rows} {...costAverages} />
    </div>
  );
}

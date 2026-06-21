import type { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import { db } from '@/lib/db';
import { companies } from '@/lib/db/schema';
import { eq, ilike, or, and, asc, desc, sql } from 'drizzle-orm';
import { CompanyCard } from '@/components/CompanyCard';
import { SuggestCompanyForm } from '@/components/SuggestCompanyForm';
import { PublicFooter } from '@/components/PublicFooter';
import { SortSelect } from '@/components/SortSelect';
import { INDUSTRIES, STAGES, FUNDING_OPTIONS } from '@/lib/constants';
import { PublicNav } from '@/components/PublicNav';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: { absolute: 'Startup MB — Mapping the Myrtle Beach Startup Ecosystem' },
  description: 'Discover and explore startups, founders, and companies building in the Myrtle Beach, SC ecosystem.',
};

interface SearchParams {
  search?: string;
  industry?: string;
  stage?: string;
  funding?: string;
  sort?: string;
}

async function getCompanies(params: SearchParams) {
  const conditions: ReturnType<typeof eq>[] = [eq(companies.is_published, true)];

  if (params.search) {
    conditions.push(
      or(
        ilike(companies.company_name, `%${params.search}%`),
        ilike(companies.company_description, `%${params.search}%`),
        ilike(companies.founder_names, `%${params.search}%`)
      ) as ReturnType<typeof eq>
    );
  }
  if (params.industry) conditions.push(eq(companies.primary_industry, params.industry) as ReturnType<typeof eq>);
  if (params.stage) conditions.push(eq(companies.stage, params.stage) as ReturnType<typeof eq>);
  if (params.funding) conditions.push(eq(companies.funding_raised, params.funding) as ReturnType<typeof eq>);

  const orderBy = params.sort === 'za'
    ? desc(sql`LOWER(${companies.company_name})`)
    : params.sort === 'newest'
    ? desc(companies.created_at)
    : asc(sql`LOWER(${companies.company_name})`);

  return db.select().from(companies).where(and(...conditions)).orderBy(orderBy);
}

export default async function PublicDirectory({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const params = await searchParams;
  const results = await getCompanies(params);
  const hasFilters = params.search || params.industry || params.stage || params.funding;

  return (
    <div className="min-h-screen flex flex-col" style={{ backgroundColor: '#F8F9FA' }}>
      {/* Hero */}
      <section style={{ backgroundColor: '#F8F9FA' }} className="pb-14">
        <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
          {/* Nav row */}
          <div className="flex items-center justify-between pt-4 pb-2">
            <Link href="/">
              <Image src="/logo.png" alt="Startup MB" height={80} width={80} className="object-contain" />
            </Link>
            <PublicNav />
          </div>
          {/* Headline */}
          <div className="max-w-4xl mx-auto text-center pt-6">
            <h1 className="text-4xl sm:text-5xl font-extrabold leading-tight mb-4" style={{ color: '#1B3A52' }}>
              Mapping the Myrtle Beach<br />
              <span style={{ color: '#3A9E9E' }}>Startup Ecosystem</span>
            </h1>
            <p className="mb-8 text-base sm:text-lg mx-auto leading-relaxed sm:whitespace-nowrap" style={{ color: '#4B5563' }}>
              Discover the companies, founders, and innovators building the future in the Grand Strand.
            </p>
            <form method="GET" className="flex gap-2 max-w-xl mx-auto">
              <input
                name="search"
                defaultValue={params.search}
                placeholder="Search companies, founders, industries…"
                className="flex-1 rounded-lg px-4 sm:px-5 py-3 text-sm"
                style={{ backgroundColor: '#FFFFFF', border: '1.5px solid #dde8f0', color: '#1B3A52' }}
              />
              {params.industry && <input type="hidden" name="industry" value={params.industry} />}
              {params.stage && <input type="hidden" name="stage" value={params.stage} />}
              {params.funding && <input type="hidden" name="funding" value={params.funding} />}
              {params.sort && <input type="hidden" name="sort" value={params.sort} />}
              <button type="submit" className="btn-primary">Search</button>
            </form>
            <SuggestCompanyForm />
          </div>
        </div>
      </section>

      {/* Filters — dark navy bar */}
      <div className="sticky top-0 z-10" style={{ backgroundColor: '#1B3A52' }}>
        <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
          <form method="GET" className="flex flex-wrap gap-3 sm:gap-4 py-4 items-center">
            {params.search && <input type="hidden" name="search" value={params.search} />}
            {params.sort && <input type="hidden" name="sort" value={params.sort} />}
            <select name="industry" defaultValue={params.industry || ''} className="py-2 text-sm" style={{ width: 'auto', backgroundColor: 'rgba(255,255,255,0.1)', color: 'white', border: '1px solid rgba(255,255,255,0.25)', borderRadius: '0.375rem' }}>
              <option value="">All Industries</option>
              {INDUSTRIES.map((i) => <option key={i} value={i} style={{ backgroundColor: '#1B3A52' }}>{i}</option>)}
            </select>
            <select name="stage" defaultValue={params.stage || ''} className="py-2 text-sm" style={{ width: 'auto', backgroundColor: 'rgba(255,255,255,0.1)', color: 'white', border: '1px solid rgba(255,255,255,0.25)', borderRadius: '0.375rem' }}>
              <option value="">All Stages</option>
              {STAGES.map((s) => <option key={s} value={s} style={{ backgroundColor: '#1B3A52' }}>{s}</option>)}
            </select>
            <select name="funding" defaultValue={params.funding || ''} className="py-2 text-sm" style={{ width: 'auto', backgroundColor: 'rgba(255,255,255,0.1)', color: 'white', border: '1px solid rgba(255,255,255,0.25)', borderRadius: '0.375rem' }}>
              <option value="">All Funding</option>
              {FUNDING_OPTIONS.map((f) => <option key={f} value={f} style={{ backgroundColor: '#1B3A52' }}>{f}</option>)}
            </select>
            <button type="submit" className="py-2 px-4 text-sm font-medium rounded-md transition-colors" style={{ backgroundColor: 'rgba(255,255,255,0.1)', color: 'white', border: '1px solid rgba(255,255,255,0.25)' }}>
              Filter
            </button>
            {hasFilters && (
              <Link href="/" className="text-sm underline font-medium" style={{ color: '#F26522' }}>Clear all</Link>
            )}
            <div className="ml-auto flex items-center gap-3">
              <SortSelect
                currentSort={params.sort || 'az'}
                otherParams={{ search: params.search, industry: params.industry, stage: params.stage, funding: params.funding }}
                dark
              />
              <span className="text-sm font-medium" style={{ color: 'rgba(255,255,255,0.7)' }}>
                {results.length} {results.length === 1 ? 'company' : 'companies'}
              </span>
            </div>
          </form>
        </div>
      </div>

      {/* Grid */}
      <main className="flex-1 max-w-7xl mx-auto w-full px-6 sm:px-8 lg:px-12 py-10">
        {results.length === 0 ? (
          <div className="text-center py-16 text-gray-500">
            <p className="text-5xl mb-6">🔍</p>
            <p className="text-xl font-medium">No companies found</p>
            <p className="mt-2">Try adjusting your search or filters.</p>
            <Link href="/" className="btn-primary mt-8 inline-flex">Clear filters</Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {results.map((company) => (
              <CompanyCard key={company.id} company={company} />
            ))}
          </div>
        )}
      </main>

      <PublicFooter />
    </div>
  );
}

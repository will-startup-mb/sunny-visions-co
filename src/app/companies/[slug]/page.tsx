import type { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import { db } from '@/lib/db';
import { companies } from '@/lib/db/schema';
import { eq, and } from 'drizzle-orm';
import { CorrectionForm } from '@/components/CorrectionForm';
import { PublicFooter } from '@/components/PublicFooter';
import { PublicNav } from '@/components/PublicNav';

export const dynamic = 'force-dynamic';

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const [company] = await db
    .select()
    .from(companies)
    .where(and(eq(companies.slug, slug), eq(companies.is_published, true)));

  if (!company) return { title: 'Company Not Found' };

  return {
    title: { absolute: `${company.company_name} — Myrtle Beach Startup | Startup MB` },
    description: company.company_description ?? `${company.company_name} is a startup based in the Myrtle Beach, SC area.`,
  };
}

export default async function CompanyDetail({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const [company] = await db
    .select()
    .from(companies)
    .where(and(eq(companies.slug, slug), eq(companies.is_published, true)));

  if (!company) notFound();

  return (
    <div className="min-h-screen flex flex-col" style={{ backgroundColor: '#F4F8FB' }}>
      {/* Header */}
      <header style={{ backgroundColor: '#F8F9FA' }}>
        <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
          <div className="flex items-center justify-between pt-4 pb-4">
            <Link href="/">
              <Image src="/logo.png" alt="Startup MB" height={80} width={80} className="object-contain" />
            </Link>
            <PublicNav />
          </div>
        </div>
      </header>

      <main className="flex-1 max-w-5xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-10">
        <div className="card p-6 sm:p-8">
          {/* Company header */}
          <div className="flex items-start gap-4 sm:gap-5 mb-6">
            <div
              className="relative w-14 h-14 sm:w-16 sm:h-16 rounded-xl overflow-hidden flex-shrink-0"
              style={{ backgroundColor: company.logo_bg_color ?? '#FFFFFF' }}
            >
              {(company.logo_upload_url ?? company.logo_url) ? (
                <Image src={(company.logo_upload_url ?? company.logo_url)!} alt={company.company_name} fill className="object-contain p-1" unoptimized />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-white font-bold text-2xl">
                  {company.company_name.charAt(0)}
                </div>
              )}
            </div>
            <div className="flex-1 min-w-0">
              <h1 className="text-xl sm:text-2xl font-extrabold" style={{ color: '#1B3A52' }}>
                {company.company_name}
              </h1>
              <div className="flex flex-wrap gap-2 mt-2">
                {company.city_region && <span className="badge-navy">{company.city_region}</span>}
                {company.primary_industry && <span className="badge-teal">{company.primary_industry}</span>}
                {company.secondary_industry && <span className="badge-teal">{company.secondary_industry}</span>}
                {company.stage && <span className="badge-orange">{company.stage}</span>}
              </div>
            </div>
          </div>

          {/* Description */}
          {company.company_description && (
            <p className="text-gray-700 leading-relaxed text-base mb-6 border-l-4 pl-4" style={{ borderColor: '#3A9E9E' }}>
              {company.company_description}
            </p>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Left col */}
            <div className="space-y-5">
              {(company.funding_raised || company.estimated_employees) && (
                <section>
                  <h2 className="text-xs font-bold uppercase tracking-widest mb-3" style={{ color: '#3A9E9E' }}>
                    Company Details
                  </h2>
                  <dl className="space-y-2">
                    {company.funding_raised && (
                      <div className="flex justify-between text-sm">
                        <dt className="text-gray-500">Funding</dt>
                        <dd className="font-medium">{company.funding_raised}</dd>
                      </div>
                    )}
                    {company.estimated_employees && (
                      <div className="flex justify-between text-sm">
                        <dt className="text-gray-500">Team Size</dt>
                        <dd className="font-medium">{company.estimated_employees} employees</dd>
                      </div>
                    )}
                  </dl>
                </section>
              )}

              {(company.website || company.company_linkedin_url) && (
                <section>
                  <h2 className="text-xs font-bold uppercase tracking-widest mb-3" style={{ color: '#3A9E9E' }}>
                    Links
                  </h2>
                  <div className="flex flex-col gap-2">
                    {company.website && (
                      <a href={company.website} target="_blank" rel="noopener noreferrer"
                        className="text-sm font-medium inline-flex items-center gap-1 hover:underline"
                        style={{ color: '#1B3A52' }}>
                        🌐 Website
                      </a>
                    )}
                    {company.company_linkedin_url && (
                      <a href={company.company_linkedin_url} target="_blank" rel="noopener noreferrer"
                        className="text-sm font-medium inline-flex items-center gap-1 hover:underline"
                        style={{ color: '#1B3A52' }}>
                        🔗 LinkedIn
                      </a>
                    )}
                  </div>
                </section>
              )}
            </div>

            {/* Right col — Founder */}
            {(company.founder_names || company.founder_overview) && (
              <div className="space-y-5">
                <section>
                  <h2 className="text-xs font-bold uppercase tracking-widest mb-3" style={{ color: '#3A9E9E' }}>
                    Founder{company.founder_names?.includes(',') ? 's' : ''}
                  </h2>
                  {company.founder_names && (
                    <p className="font-semibold text-sm mb-2" style={{ color: '#1B3A52' }}>
                      {company.founder_names}
                    </p>
                  )}
                  {company.founder_overview && (
                    <p className="text-sm text-gray-600 leading-relaxed">{company.founder_overview}</p>
                  )}
                </section>
              </div>
            )}
          </div>
        </div>

        {/* Footer actions */}
        <div className="mt-8 flex flex-col gap-3 w-full max-w-xs mx-auto">
          <Link href="/" className="btn-primary w-full justify-center">← Back to directory</Link>
          <CorrectionForm companyName={company.company_name} />
        </div>
      </main>

      <PublicFooter />
    </div>
  );
}

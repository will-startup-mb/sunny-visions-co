import { notFound } from 'next/navigation';
import { db } from '@/lib/db';
import { companies } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';
import { CompanyForm } from '@/components/CompanyForm';

export const dynamic = 'force-dynamic';

export default async function EditCompanyPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const [company] = await db.select().from(companies).where(eq(companies.id, id));
  if (!company) notFound();

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-xl font-extrabold mb-1" style={{ color: '#1B3A52' }}>
        Edit — {company.company_name}
      </h1>
      <p className="text-sm text-gray-500 mb-6">{company.website}</p>
      <CompanyForm company={company} />
    </div>
  );
}

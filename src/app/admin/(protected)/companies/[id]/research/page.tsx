import { notFound } from 'next/navigation';
import { db } from '@/lib/db';
import { companies } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';
import { ResearchPanel } from './ResearchPanel';

export const dynamic = 'force-dynamic';

export default async function ResearchPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const [company] = await db.select().from(companies).where(eq(companies.id, id));
  if (!company) notFound();

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="mb-6">
        <h1 className="text-xl font-extrabold" style={{ color: '#1B3A52' }}>
          AI Research — {company.company_name}
        </h1>
        <p className="text-sm text-gray-500 mt-1">
          Click Run Research to have Claude search the web and fill in the company profile. Review and edit the results, then save to the database.
        </p>
      </div>
      <ResearchPanel company={company} />
    </div>
  );
}

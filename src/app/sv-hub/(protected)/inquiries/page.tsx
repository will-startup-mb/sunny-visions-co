import { db } from '@/lib/db';
import { inquiries } from '@/lib/db/schema';
import { desc, eq } from 'drizzle-orm';
import { InquiriesTable } from './InquiriesTable';

export const dynamic = 'force-dynamic';

export default async function InquiriesPage() {
  const [newItems, reviewed] = await Promise.all([
    db.select().from(inquiries).where(eq(inquiries.status, 'New')).orderBy(desc(inquiries.created_at)),
    db.select().from(inquiries).where(eq(inquiries.status, 'Reviewed')).orderBy(desc(inquiries.created_at)).limit(20),
  ]);
  const replied = await db.select().from(inquiries).where(eq(inquiries.status, 'Replied')).orderBy(desc(inquiries.created_at)).limit(20);

  return (
    <div className="p-4 md:p-6 space-y-6 md:space-y-8">
      <div>
        <h1 className="text-xl font-extrabold" style={{ color: '#3D2B1F' }}>Inquiries</h1>
        <p className="text-sm text-gray-500 mt-1">{newItems.length} new inquiry{newItems.length !== 1 ? 's' : ''} from the contact form</p>
      </div>

      <InquiriesTable inquiries={newItems} status="New" />

      {reviewed.length > 0 && (
        <section>
          <h2 className="text-sm font-bold uppercase tracking-wide text-gray-500 mb-3">Reviewed</h2>
          <InquiriesTable inquiries={reviewed} status="Reviewed" />
        </section>
      )}

      {replied.length > 0 && (
        <section>
          <h2 className="text-sm font-bold uppercase tracking-wide text-gray-500 mb-3">Replied</h2>
          <div className="card overflow-hidden">
            <ul className="divide-y divide-gray-100">
              {replied.map((item) => (
                <li key={item.id} className="px-5 py-4">
                  <div className="flex items-start justify-between gap-4">
                    <div className="min-w-0">
                      <p className="font-semibold text-sm" style={{ color: '#3D2B1F' }}>{item.name}</p>
                      <a href={`mailto:${item.email}`} className="text-xs hover:underline" style={{ color: '#5B9FA3' }}>{item.email}</a>
                      <p className="text-xs text-gray-500 mt-1 line-clamp-2">{item.message}</p>
                    </div>
                    <div className="text-right flex-shrink-0">
                      <span className="inline-flex items-center text-xs font-semibold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700">Replied</span>
                      <p className="text-xs text-gray-400 mt-1">
                        {new Date(item.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                      </p>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </section>
      )}
    </div>
  );
}

import { db } from '@/lib/db';
import { suggestions } from '@/lib/db/schema';
import { desc, eq } from 'drizzle-orm';
import { SuggestionsTable } from './SuggestionsTable';

export const dynamic = 'force-dynamic';

export default async function SuggestionsPage() {
  const [pending, accepted] = await Promise.all([
    db.select().from(suggestions).where(eq(suggestions.status, 'pending')).orderBy(desc(suggestions.created_at)),
    db.select().from(suggestions).where(eq(suggestions.status, 'accepted')).orderBy(desc(suggestions.accepted_at)),
  ]);

  return (
    <div className="p-4 md:p-6 space-y-6 md:space-y-8">
      <div>
        <h1 className="text-xl font-extrabold" style={{ color: '#1B3A52' }}>Company Suggestions</h1>
        <p className="text-sm text-gray-500 mt-1">{pending.length} pending suggestion{pending.length !== 1 ? 's' : ''}</p>
      </div>

      <SuggestionsTable suggestions={pending} />

      {accepted.length > 0 && (
        <section>
          <h2 className="text-sm font-bold uppercase tracking-wide text-gray-500 mb-3">
            Added to Directory
          </h2>
          <div className="card overflow-hidden">
            <ul className="divide-y divide-gray-100">
              {accepted.map((s) => (
                <li key={s.id} className="px-5 py-4">
                  <div className="flex items-start justify-between gap-4">
                    <div className="min-w-0">
                      <p className="font-semibold text-sm" style={{ color: '#1B3A52' }}>{s.company_name}</p>
                      {s.website && (
                        <p className="text-xs text-gray-400 truncate mt-0.5">
                          {s.website.replace(/^https?:\/\//, '')}
                        </p>
                      )}
                      <p className="text-xs text-gray-400 mt-1">
                        Submitted by <span className="font-medium text-gray-600">{s.submitter_name}</span>
                        {' · '}
                        <a href={`mailto:${s.submitter_email}`} className="hover:underline">{s.submitter_email}</a>
                      </p>
                    </div>
                    <div className="text-right flex-shrink-0">
                      <span className="inline-flex items-center text-xs font-semibold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700">
                        Added
                      </span>
                      <p className="text-xs text-gray-400 mt-1">
                        {s.accepted_at
                          ? new Date(s.accepted_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
                          : new Date(s.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
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

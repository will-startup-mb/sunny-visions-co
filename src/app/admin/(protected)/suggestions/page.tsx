import { db } from '@/lib/db';
import { suggestions } from '@/lib/db/schema';
import { desc } from 'drizzle-orm';
import { SuggestionsTable } from './SuggestionsTable';

export const dynamic = 'force-dynamic';

export default async function SuggestionsPage() {
  const rows = await db.select().from(suggestions).orderBy(desc(suggestions.created_at));

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <div className="mb-6">
        <h1 className="text-xl font-extrabold" style={{ color: '#1B3A52' }}>Company Suggestions</h1>
        <p className="text-sm text-gray-500 mt-1">{rows.length} pending suggestion{rows.length !== 1 ? 's' : ''}</p>
      </div>
      <SuggestionsTable suggestions={rows} />
    </div>
  );
}

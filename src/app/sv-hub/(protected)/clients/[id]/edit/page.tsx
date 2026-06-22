import { db } from '@/lib/db';
import { clients } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';
import { notFound } from 'next/navigation';
import { ClientForm } from '../../../ClientForm';

export const dynamic = 'force-dynamic';

export default async function EditClientPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const [client] = await db.select().from(clients).where(eq(clients.id, id));
  if (!client) notFound();

  return (
    <div className="p-4 md:p-6">
      <h1 className="text-xl font-extrabold mb-6" style={{ color: '#3D2B1F' }}>Edit Client</h1>
      <ClientForm client={client} />
    </div>
  );
}

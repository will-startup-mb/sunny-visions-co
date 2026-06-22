import { getServerSession } from 'next-auth';
import { redirect } from 'next/navigation';
import { authOptions } from '@/lib/auth';
import { AdminShell } from '@/components/AdminShell';
import { SessionProvider } from './SessionProvider';
import { getNavOrder } from '@/lib/db/nav-order';

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect('/sv-hub/login');
  }

  const navOrder = await getNavOrder();

  return (
    <SessionProvider session={session}>
      <AdminShell navOrder={navOrder}>
        {children}
      </AdminShell>
    </SessionProvider>
  );
}

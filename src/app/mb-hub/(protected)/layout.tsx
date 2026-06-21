import { getServerSession } from 'next-auth';
import { redirect } from 'next/navigation';
import { authOptions } from '@/lib/auth';
import { AdminShell } from '@/components/AdminShell';
import { SessionProvider } from './SessionProvider';

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect('/mb-hub/login');
  }

  return (
    <SessionProvider session={session}>
      <AdminShell>
        {children}
      </AdminShell>
    </SessionProvider>
  );
}

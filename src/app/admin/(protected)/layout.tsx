import { getServerSession } from 'next-auth';
import { redirect } from 'next/navigation';
import { authOptions } from '@/lib/auth';
import { AdminSidebar } from '@/components/AdminSidebar';
import { SessionProvider } from './SessionProvider';

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect('/admin/login');
  }

  return (
    <SessionProvider session={session}>
      <div className="flex min-h-screen">
        <AdminSidebar />
        <main className="flex-1 overflow-auto" style={{ backgroundColor: '#F4F8FB' }}>
          {children}
        </main>
      </div>
    </SessionProvider>
  );
}

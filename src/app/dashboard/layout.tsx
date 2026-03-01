import { getServerSession } from 'next-auth';
import { redirect } from 'next/navigation';
import { authOptions } from '@/lib/auth';
import Sidebar from '@/components/dashboard/Sidebar';

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect('/auth/login');
  }

  const user = session.user as any;

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar
        storeName={user?.storeName}
        storeId={user?.storeId}
        subscriptionStatus={user?.subscriptionStatus}
      />
      <main className="flex-1 overflow-auto">
        {/* Top bar */}
        <div className="sticky top-0 z-10 bg-white border-b border-gray-100 px-8 py-4 flex items-center justify-between">
          <div />
          <div className="flex items-center gap-3">
            <div className="text-sm text-gray-500">Olá, <strong className="text-gray-800">{user?.name}</strong></div>
            <div className="w-8 h-8 rounded-full bg-brand-600 flex items-center justify-center text-white text-sm font-bold">
              {user?.name?.[0]?.toUpperCase()}
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-8">
          {children}
        </div>
      </main>
    </div>
  );
}

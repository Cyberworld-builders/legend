import { Metadata } from 'next';
import { createAuthServerClient } from '@/lib/supabase-server';
import AdminNav from '@/components/admin/AdminNav';

export const metadata: Metadata = {
  title: 'Admin | CyberWorld Builders',
  robots: { index: false, follow: false },
};

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  let userEmail: string | undefined;
  let isAuthenticated = false;

  try {
    const supabase = await createAuthServerClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (user) {
      userEmail = user.email ?? undefined;
      isAuthenticated = true;
    }
  } catch {
    // Auth check may fail if not configured — middleware handles redirect
  }

  // Login page: no sidebar chrome
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] font-mono">
        {children}
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0a0a0a] font-mono">
      <AdminNav userEmail={userEmail} />
      <main className="md:ml-64 p-6 min-h-screen">
        {children}
      </main>
    </div>
  );
}

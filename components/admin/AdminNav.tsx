'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import { createAuthBrowserClient } from '@/lib/supabase';
import { LayoutDashboard, Users, FileText, Menu, X, LogOut } from 'lucide-react';

const navItems = [
  { href: '/admin', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/admin/leads', label: 'Leads', icon: Users },
  { href: '/admin/transcripts', label: 'Transcripts', icon: FileText },
];

interface AdminNavProps {
  userEmail?: string;
}

export default function AdminNav({ userEmail }: AdminNavProps) {
  const router = useRouter();
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleLogout = async () => {
    const supabase = createAuthBrowserClient();
    await supabase.auth.signOut();
    router.push('/admin/login');
    router.refresh();
  };

  const isActive = (href: string) => {
    if (href === '/admin') return pathname === '/admin';
    return pathname.startsWith(href);
  };

  const navContent = (
    <>
      <div className="p-6 border-b border-[#00ff00]/20">
        <h2 className="text-[#00ff00] font-bold font-mono text-lg">ADMIN</h2>
        <p className="text-[#00ff00]/40 text-xs font-mono mt-1 truncate">{userEmail}</p>
      </div>

      <nav className="flex-1 py-4">
        {navItems.map((item) => {
          const Icon = item.icon;
          const active = isActive(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setMobileOpen(false)}
              className={`flex items-center gap-3 px-6 py-3 font-mono text-sm transition-colors ${
                active
                  ? 'text-[#00ff00] bg-[#00ff00]/10 border-l-2 border-[#00ff00]'
                  : 'text-[#00ff00]/60 hover:text-[#00ff00] hover:bg-[#00ff00]/5'
              }`}
            >
              <Icon size={18} />
              {item.label}
            </Link>
          );
        })}
      </nav>

      <div className="p-4 border-t border-[#00ff00]/20">
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 px-6 py-3 w-full font-mono text-sm text-[#00ff00]/60 hover:text-red-400 transition-colors"
        >
          <LogOut size={18} />
          Logout
        </button>
      </div>
    </>
  );

  return (
    <>
      {/* Mobile hamburger */}
      <button
        onClick={() => setMobileOpen(!mobileOpen)}
        className="md:hidden fixed top-4 left-4 z-50 p-2 bg-[#1a1a1a] border border-[#00ff00]/30 rounded text-[#00ff00]"
      >
        {mobileOpen ? <X size={20} /> : <Menu size={20} />}
      </button>

      {/* Mobile overlay */}
      {mobileOpen && (
        <div
          className="md:hidden fixed inset-0 bg-black/60 z-30"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed top-0 left-0 h-full w-64 bg-[#0d0d0d] border-r border-[#00ff00]/20 flex flex-col z-40 transition-transform md:translate-x-0 ${
          mobileOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {navContent}
      </aside>
    </>
  );
}

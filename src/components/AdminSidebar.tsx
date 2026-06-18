'use client';

import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { signOut } from 'next-auth/react';

const navItems = [
  { href: '/admin/companies', label: 'Companies', icon: '🏢' },
  { href: '/admin/suggestions', label: 'Suggestions', icon: '💡' },
  { href: '/admin/import', label: 'CSV Import', icon: '📥' },
  { href: '/admin/research-history', label: 'Research History', icon: '🔬' },
  { href: '/admin/stats', label: 'Stats', icon: '📊' },
  { href: '/admin/security', label: 'Security', icon: '🔐' },
];

export function AdminSidebar() {
  const pathname = usePathname();

  return (
    <aside
      className="w-56 flex-shrink-0 min-h-screen flex flex-col"
      style={{ backgroundColor: '#1B3A52' }}
    >
      {/* Logo */}
      <div className="p-5 border-b border-white/10">
        <Link href="/" className="block">
          <Image src="/logo-white.png" alt="Startup MB" height={64} width={64} className="object-contain" />
          <div className="text-xs mt-1.5" style={{ color: '#3A9E9E' }}>Admin Dashboard</div>
        </Link>
      </div>

      {/* Nav */}
      <nav className="flex-1 p-3 space-y-1">
        {navItems.map((item) => {
          const active = pathname.startsWith(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                active
                  ? 'text-white'
                  : 'text-white/60 hover:text-white hover:bg-white/10'
              }`}
              style={active ? { backgroundColor: '#F26522' } : {}}
            >
              <span>{item.icon}</span>
              {item.label}
            </Link>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="p-3 border-t border-white/10 space-y-1">
        <Link
          href="/"
          className="flex items-center gap-3 px-3 py-2 rounded-md text-sm text-white/60 hover:text-white hover:bg-white/10 transition-colors"
          target="_blank"
        >
          <span>🌐</span> View Public Site
        </Link>
        <button
          onClick={() => signOut({ callbackUrl: '/admin/login' })}
          className="w-full flex items-center gap-3 px-3 py-2 rounded-md text-sm text-white/60 hover:text-white hover:bg-white/10 transition-colors text-left"
        >
          <span>🚪</span> Sign Out
        </button>
      </div>
    </aside>
  );
}

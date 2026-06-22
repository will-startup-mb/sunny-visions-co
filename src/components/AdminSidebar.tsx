'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { signOut } from 'next-auth/react';
import { applyNavOrder } from '@/lib/nav-items';

interface Props {
  onClose?: () => void;
  navOrder: string[];
}

export function AdminSidebar({ onClose, navOrder }: Props) {
  const pathname = usePathname();
  const items = applyNavOrder(navOrder);

  return (
    <aside
      className="w-56 flex-shrink-0 h-svh flex flex-col"
      style={{ backgroundColor: '#3D2B1F' }}
    >
      {/* Logo */}
      <div className="p-5 border-b border-white/10 flex items-center justify-between">
        <Link href="/" className="block" onClick={onClose}>
          <div className="text-white font-bold text-lg" style={{ fontFamily: "'Lobster Two', cursive" }}>
            Sunny Visions Co.
          </div>
          <div className="text-xs mt-1" style={{ color: '#5B9FA3' }}>Admin Dashboard</div>
        </Link>
        <button
          onClick={onClose}
          className="lg:hidden -mr-1 p-2 rounded text-white/50 hover:text-white hover:bg-white/10 transition-colors"
          aria-label="Close menu"
        >
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
            <line x1="2" y1="2" x2="14" y2="14" />
            <line x1="14" y1="2" x2="2" y2="14" />
          </svg>
        </button>
      </div>

      {/* Nav */}
      <nav className="flex-1 overflow-y-auto p-3 space-y-1">
        {items.map((item) => {
          const active = pathname.startsWith(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={onClose}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-md text-sm font-medium transition-colors ${
                active
                  ? 'text-white'
                  : 'text-white/60 hover:text-white hover:bg-white/10'
              }`}
              style={active ? { backgroundColor: '#E8521A' } : {}}
            >
              {item.label}
            </Link>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="p-3 border-t border-white/10 space-y-1">
        <Link
          href="/"
          onClick={onClose}
          className="flex items-center gap-3 px-3 py-2.5 rounded-md text-sm text-white/60 hover:text-white hover:bg-white/10 transition-colors"
          target="_blank"
          rel="noopener noreferrer"
        >
          View Public Site
        </Link>
        <button
          onClick={() => signOut({ callbackUrl: '/sv-hub/login' })}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-md text-sm text-white/60 hover:text-white hover:bg-white/10 transition-colors text-left"
        >
          Sign Out
        </button>
      </div>
    </aside>
  );
}

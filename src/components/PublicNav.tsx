'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

const NAV_LINKS = [
  { href: '/', label: 'HOME' },
  { href: '/services/social-media', label: 'SOCIAL MEDIA' },
  { href: '/services/video-content', label: 'VIDEO CONTENT' },
  { href: '/services/graphic-design', label: 'GRAPHIC DESIGN' },
  { href: '/services/custom-merch', label: 'CUSTOM MERCH' },
  { href: '/about', label: 'ABOUT' },
];

export function PublicNav() {
  const pathname = usePathname();

  return (
    <nav className="flex items-center gap-4 sm:gap-7">
      {NAV_LINKS.map(({ href, label }) => {
        const active = href === '/' ? pathname === '/' : pathname === href || pathname.startsWith(href + '/');
        return (
          <Link
            key={href}
            href={href}
            className="text-xs sm:text-sm font-bold transition-colors uppercase tracking-widest"
            style={{ color: active ? '#E8521A' : '#3D2B1F', fontFamily: "'Livvic', sans-serif", letterSpacing: '0.08em' }}
          >
            {label}
          </Link>
        );
      })}
    </nav>
  );
}

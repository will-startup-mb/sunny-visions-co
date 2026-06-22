'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

const NAV_LINKS = [
  { href: '/services', label: 'Services' },
  { href: '/work', label: 'Work' },
  { href: '/about', label: 'About' },
  { href: '/contact', label: 'Contact' },
];

export function PublicNav() {
  const pathname = usePathname();

  return (
    <nav className="flex items-center gap-4 sm:gap-7">
      {NAV_LINKS.map(({ href, label }) => {
        const active = pathname === href || pathname.startsWith(href + '/');
        return (
          <Link
            key={href}
            href={href}
            className="text-sm sm:text-base font-semibold transition-colors"
            style={{ color: active ? '#E8521A' : '#3D2B1F', fontFamily: "'Livvic', sans-serif" }}
          >
            {label}
          </Link>
        );
      })}
    </nav>
  );
}

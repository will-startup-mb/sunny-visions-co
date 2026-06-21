'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

const NAV_LINKS = [
  { href: '/podcast', label: 'Podcast' },
  { href: '/blog', label: 'Blog' },
  { href: '/about', label: 'About' },
];

export function PublicNav() {
  const pathname = usePathname();

  return (
    <nav className="flex items-center gap-3 sm:gap-6">
      {NAV_LINKS.map(({ href, label }) => {
        const active = pathname === href || pathname.startsWith(href + '/');
        return (
          <Link
            key={href}
            href={href}
            className={`text-sm sm:text-base transition-colors font-medium ${
              active ? 'text-gray-900' : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            {label}
          </Link>
        );
      })}
    </nav>
  );
}

import type { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import { PublicFooter } from '@/components/PublicFooter';

export const metadata: Metadata = {
  title: 'About',
  description: 'Learn about Startup MB — the podcast and directory mapping the Myrtle Beach startup ecosystem.',
};

export default function AboutPage() {
  return (
    <div className="min-h-screen flex flex-col" style={{ backgroundColor: '#F4F8FB' }}>
      <header style={{ backgroundColor: '#1B3A52' }}>
        <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
          <div className="flex items-center justify-between pt-4 pb-4">
            <Link href="/">
              <Image src="/logo-white.png" alt="Startup MB" height={80} width={80} className="object-contain" />
            </Link>
            <nav className="flex items-center gap-3 sm:gap-6">
              <Link href="/about" className="text-white text-sm sm:text-base font-medium">
                About
              </Link>
              <Link
                href="/admin"
                className="text-xs sm:text-sm px-3 sm:px-4 py-2 rounded font-semibold text-white/50 hover:text-white transition-colors"
              >
                Admin
              </Link>
            </nav>
          </div>
        </div>
      </header>

      <main className="flex-1 max-w-2xl mx-auto w-full px-6 py-24 text-center">
        <h1 className="text-3xl font-extrabold mb-4" style={{ color: '#1B3A52' }}>About Startup MB</h1>
        <p className="text-gray-500 text-lg mb-8">More coming soon.</p>
        <Link href="/" className="btn-primary">← Back to directory</Link>
      </main>

      <PublicFooter />
    </div>
  );
}

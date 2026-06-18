import Link from 'next/link';
import Image from 'next/image';
import { PublicFooter } from '@/components/PublicFooter';

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col" style={{ backgroundColor: '#F4F8FB' }}>
      <header style={{ backgroundColor: '#1B3A52' }}>
        <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
          <div className="flex items-center justify-between pt-4 pb-4">
            <Link href="/">
              <Image src="/logo-white.png" alt="Startup MB" height={80} width={80} className="object-contain" />
            </Link>
            <nav className="flex items-center gap-3 sm:gap-6">
              <Link href="/about" className="text-white/70 hover:text-white text-sm sm:text-base transition-colors font-medium">
                About
              </Link>
              <Link href="/admin" className="text-xs sm:text-sm px-3 sm:px-4 py-2 rounded font-semibold text-white/50 hover:text-white transition-colors">
                Admin
              </Link>
            </nav>
          </div>
        </div>
      </header>

      <main className="flex-1 flex flex-col items-center justify-center px-6 text-center py-24">
        <p className="text-8xl font-extrabold mb-6 tabular-nums" style={{ color: '#3A9E9E' }}>404</p>
        <h1 className="text-2xl sm:text-3xl font-extrabold mb-4" style={{ color: '#1B3A52' }}>
          This page doesn&apos;t exist yet
        </h1>
        <p className="text-gray-500 text-lg max-w-md mb-10 leading-relaxed">
          But the Myrtle Beach startup ecosystem does. Head back to the directory to explore it.
        </p>
        <Link href="/" className="btn-primary text-base px-8 py-3">
          ← Back to the Directory
        </Link>
      </main>

      <PublicFooter />
    </div>
  );
}

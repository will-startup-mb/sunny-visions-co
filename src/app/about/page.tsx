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
    <div className="min-h-screen flex flex-col" style={{ backgroundColor: '#F8F9FA' }}>
      <header style={{ backgroundColor: '#F8F9FA' }}>
        <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
          <div className="flex items-center justify-between pt-4 pb-4">
            <Link href="/">
              <Image src="/logo.png" alt="Startup MB" height={80} width={80} className="object-contain" />
            </Link>
            <nav className="flex items-center gap-3 sm:gap-6">
              <Link href="/about" className="text-sm sm:text-base transition-colors font-medium text-gray-900">
                About
              </Link>
            </nav>
          </div>
        </div>
      </header>

      <main className="flex-1 max-w-2xl md:max-w-3xl lg:max-w-4xl mx-auto w-full px-6 pt-12 pb-24">
        <h1 className="text-4xl font-extrabold mb-6" style={{ color: '#1B3A52' }}>About Startup MB</h1>

        <p className="text-gray-600 text-lg leading-relaxed mb-4">
          Startup MB is a podcast and ecosystem mapping platform dedicated to discovering, documenting, and celebrating the startups and innovators building companies in the Myrtle Beach, SC area.
        </p>
        <p className="text-gray-600 text-lg leading-relaxed mb-12">
          Founded by Will McCaffrey, Startup MB started as a simple question: <em>who&apos;s actually building things here?</em> What began as a Google Sheet has grown into a live, searchable directory of local startups, researched, categorized, and updated regularly.
        </p>

        <div className="space-y-10">
          <section>
            <h2 className="text-2xl font-bold mb-3" style={{ color: '#1B3A52' }}>
              The Directory
            </h2>
            <div className="w-10 h-1 rounded-full mb-4" style={{ backgroundColor: '#3A9E9E' }} />
            <p className="text-gray-600 leading-relaxed">
              The Startup MB directory maps companies across the Grand Strand, from early-stage startups to established tech companies. Each profile is researched and scored for innovation and ecosystem impact, giving founders, investors, and community partners a real-time view of what&apos;s being built locally.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-3" style={{ color: '#1B3A52' }}>
              The Podcast
            </h2>
            <div className="w-10 h-1 rounded-full mb-4" style={{ backgroundColor: '#F26522' }} />
            <p className="text-gray-600 leading-relaxed">
              The Startup MB podcast features conversations with the founders, operators, and community builders driving the Myrtle Beach startup scene forward. New episodes drop regularly at{' '}
              <a href="https://startupmb.com" className="font-medium underline underline-offset-2" style={{ color: '#1B3A52' }}>startupmb.com</a>.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-3" style={{ color: '#1B3A52' }}>
              The Mission
            </h2>
            <div className="w-10 h-1 rounded-full mb-4" style={{ backgroundColor: '#3A9E9E' }} />
            <p className="text-gray-600 leading-relaxed">
              Myrtle Beach is more than a tourist destination. A real startup ecosystem is emerging here, and Startup MB exists to make it visible.
            </p>
          </section>
        </div>

        <div className="mt-14">
          <Link href="/" className="btn-primary">← Back to directory</Link>
        </div>
      </main>

      <PublicFooter />
    </div>
  );
}

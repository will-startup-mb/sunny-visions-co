import type { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import { PublicFooter } from '@/components/PublicFooter';
import { PublicNav } from '@/components/PublicNav';

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
            <PublicNav />
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
            <div className="w-10 h-1 rounded-full mb-4" style={{ backgroundColor: '#1B3A52' }} />
            <p className="text-gray-600 leading-relaxed">
              Myrtle Beach is more than a tourist destination. A real startup ecosystem is emerging here, and Startup MB exists to make it visible.
            </p>
          </section>
        </div>

        <div className="mt-14 pt-10 border-t border-gray-200">
          <p className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-4">Follow along</p>
          <div className="flex items-center gap-6 mb-10">
            <a
              href="https://www.linkedin.com/in/will-mccaffrey/"
              target="_blank"
              rel="noopener noreferrer"
              className="flex flex-col items-center gap-1 transition-opacity hover:opacity-70"
            >
              <svg width="22" height="22" viewBox="0 0 24 24" fill="#3A9E9E" aria-hidden="true">
                <path d="M20.447 20.452H16.89v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a1.98 1.98 0 0 1-1.981-1.981A1.98 1.98 0 0 1 5.337 3.47a1.98 1.98 0 0 1 1.981 1.981 1.98 1.98 0 0 1-1.981 1.982zm1.808 13.019H3.53V9h3.615v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
              </svg>
              <span className="text-xs font-medium" style={{ color: '#3A9E9E' }}>Will McCaffrey</span>
            </a>
            <a
              href="https://www.linkedin.com/company/startup-mb/"
              target="_blank"
              rel="noopener noreferrer"
              className="flex flex-col items-center gap-1 transition-opacity hover:opacity-70"
            >
              <svg width="22" height="22" viewBox="0 0 24 24" fill="#F26522" aria-hidden="true">
                <path d="M20.447 20.452H16.89v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a1.98 1.98 0 0 1-1.981-1.981A1.98 1.98 0 0 1 5.337 3.47a1.98 1.98 0 0 1 1.981 1.981 1.98 1.98 0 0 1-1.981 1.982zm1.808 13.019H3.53V9h3.615v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
              </svg>
              <span className="text-xs font-medium" style={{ color: '#F26522' }}>Startup MB</span>
            </a>
            <a
              href="https://www.instagram.com/startupmyrtlebeach"
              target="_blank"
              rel="noopener noreferrer"
              className="flex flex-col items-center gap-1 transition-opacity hover:opacity-70"
            >
              <svg width="22" height="22" viewBox="0 0 24 24" fill="#1B3A52" aria-hidden="true">
                <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 1 0 0 12.324 6.162 6.162 0 0 0 0-12.324zM12 16a4 4 0 1 1 0-8 4 4 0 0 1 0 8zm6.406-11.845a1.44 1.44 0 1 0 0 2.881 1.44 1.44 0 0 0 0-2.881z"/>
              </svg>
              <span className="text-xs font-medium" style={{ color: '#1B3A52' }}>Startup MB</span>
            </a>
          </div>
          <Link href="/" className="btn-primary">← Back to directory</Link>
        </div>
      </main>

      <PublicFooter />
    </div>
  );
}

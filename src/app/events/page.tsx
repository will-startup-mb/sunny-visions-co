import type { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import { PublicFooter } from '@/components/PublicFooter';
import { PublicNav } from '@/components/PublicNav';
import { getSiteContent } from '@/lib/db/site-content';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Events',
  description: 'Upcoming Startup MB events in the Myrtle Beach area.',
};

export default async function EventsPage() {
  const c = await getSiteContent();

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
        <h1 className="text-4xl font-extrabold mb-2" style={{ color: '#1B3A52' }}>{c.events_headline}</h1>
        <div className="w-10 h-1 rounded-full mb-10" style={{ backgroundColor: '#F26522' }} />

        <p className="text-gray-600 text-lg leading-relaxed mb-12">{c.events_description}</p>

        <div className="flex flex-col items-center justify-center py-20 px-8 rounded-2xl border-2 border-dashed border-gray-200 text-center">
          <svg className="mb-5 opacity-30" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#1B3A52" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
            <line x1="16" y1="2" x2="16" y2="6" />
            <line x1="8" y1="2" x2="8" y2="6" />
            <line x1="3" y1="10" x2="21" y2="10" />
          </svg>
          <p className="text-xl font-semibold mb-2" style={{ color: '#1B3A52' }}>{c.events_empty_heading}</p>
          <p className="text-gray-500 text-base">{c.events_empty_body}</p>
        </div>

        <div className="mt-16 pt-10 border-t border-gray-200 flex flex-col sm:flex-row items-start sm:items-center gap-6">
          <div>
            <p className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-1">{c.events_follow_label}</p>
            <p className="text-gray-600 text-base">{c.events_follow_body}</p>
          </div>
          {c.events_instagram_url && (
            <a href={c.events_instagram_url} target="_blank" rel="noopener noreferrer" className="btn-primary shrink-0">
              {c.events_follow_button}
            </a>
          )}
        </div>
      </main>

      <PublicFooter />
    </div>
  );
}

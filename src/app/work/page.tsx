import type { Metadata } from 'next';
import Link from 'next/link';
import { PublicNav } from '@/components/PublicNav';
import { PublicFooter } from '@/components/PublicFooter';
import { getSiteContent } from '@/lib/db/site-content';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Portfolio',
  description: 'Portfolio of video, graphic design, photography, and wedding work by Sunny Visions Co.',
};

const CATEGORIES = ['Video', 'Graphic Design', 'Photography', 'Wedding Suite'];

export default async function WorkPage() {
  const c = await getSiteContent();

  return (
    <div className="min-h-screen flex flex-col" style={{ backgroundColor: '#F5EFE0' }}>
      <header className="border-b" style={{ borderColor: '#e0d5c4', backgroundColor: '#F5EFE0' }}>
        <div className="max-w-6xl mx-auto px-6 sm:px-8 lg:px-12">
          <div className="flex items-center justify-between py-4">
            <Link href="/" className="text-2xl font-bold" style={{ fontFamily: "'Lobster Two', cursive", color: '#E8521A' }}>
              Sunny Visions Co.
            </Link>
            <PublicNav />
          </div>
        </div>
      </header>

      <main className="flex-1 max-w-6xl mx-auto w-full px-6 sm:px-8 lg:px-12 py-16">
        <div className="mb-10">
          <h1 className="text-4xl sm:text-5xl font-bold mb-3" style={{ fontFamily: "'Lobster Two', cursive", color: '#3D2B1F' }}>
            {c.work_headline}
          </h1>
          <p className="text-base text-gray-600">{c.work_subheadline}</p>
        </div>

        {/* Category filters */}
        <div className="flex flex-wrap gap-2 mb-10">
          <span className="badge-orange cursor-pointer">All</span>
          {CATEGORIES.map((cat) => (
            <span key={cat} className="badge-brown cursor-pointer">{cat}</span>
          ))}
        </div>

        {/* Empty state */}
        <div className="text-center py-24">
          <p className="text-4xl mb-5">📸</p>
          <p className="text-xl font-bold mb-2" style={{ color: '#3D2B1F' }}>{c.work_empty_heading}</p>
          <p className="text-gray-500">{c.work_empty_body}</p>
          <Link href="/contact" className="btn-primary mt-8 inline-flex">Work with me →</Link>
        </div>
      </main>

      <PublicFooter />
    </div>
  );
}

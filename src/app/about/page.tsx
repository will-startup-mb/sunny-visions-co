import type { Metadata } from 'next';
import Link from 'next/link';
import { PublicFooter } from '@/components/PublicFooter';
import { PublicNav } from '@/components/PublicNav';
import { getSiteContent } from '@/lib/db/site-content';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'About',
  description: 'Claire McCaffrey — digital marketer, content creator, and founder of Sunny Visions Co.',
};

export default async function AboutPage() {
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

      <main className="flex-1">
        <section style={{ backgroundColor: '#D4C4A0' }} className="py-16 sm:py-20 text-center px-6">
          <h1 className="text-4xl sm:text-5xl font-bold mb-4" style={{ fontFamily: "'Lobster Two', cursive", color: '#3D2B1F' }}>
            {c.about_page_title}
          </h1>
        </section>

        <section className="max-w-3xl mx-auto px-6 sm:px-8 py-16">
          <div className="card p-8 sm:p-10 space-y-8">
            <div className="border-l-4 pl-6" style={{ borderColor: '#E8521A' }}>
              <p className="text-base leading-relaxed" style={{ color: '#3D2B1F' }}>{c.about_bio}</p>
            </div>

            <div>
              <h2 className="text-lg font-bold mb-3" style={{ color: '#3D2B1F' }}>
                {c.about_experience_heading}
              </h2>
              <p className="text-base leading-relaxed text-gray-700">{c.about_experience_body}</p>
            </div>

            <div className="flex gap-4 pt-2">
              {c.about_instagram_url && (
                <a href={c.about_instagram_url} target="_blank" rel="noopener noreferrer" className="btn-secondary text-sm">
                  Instagram
                </a>
              )}
              {c.about_linkedin_url && (
                <a href={c.about_linkedin_url} target="_blank" rel="noopener noreferrer" className="btn-ghost text-sm">
                  LinkedIn
                </a>
              )}
            </div>
          </div>

          <div className="mt-10 text-center">
            <Link href="/contact" className="btn-primary inline-flex text-base px-8 py-3.5">
              Let&apos;s Work Together →
            </Link>
          </div>
        </section>
      </main>

      <PublicFooter />
    </div>
  );
}

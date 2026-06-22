import type { Metadata } from 'next';
import Link from 'next/link';
import { PublicNav } from '@/components/PublicNav';
import { PublicFooter } from '@/components/PublicFooter';
import { getSiteContent } from '@/lib/db/site-content';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: { absolute: 'Sunny Visions Co. — Content, Design & Branding' },
  description: 'One stop shop for content, design & branding. Social media, graphic design, video production, and photography by Claire McCaffrey.',
};

const EXPLORE_CARDS = [
  {
    title: 'Video Content',
    description: 'Short-form social videos, event coverage, and brand storytelling that keeps your audience watching.',
    href: '/services',
    icon: '🎥',
  },
  {
    title: 'Graphic Design',
    description: 'Social media packs, wedding suites, and full business branding that makes your brand unforgettable.',
    href: '/services',
    icon: '✏️',
  },
  {
    title: 'Photography',
    description: 'Event, brand, and product photography that captures the moment and elevates your presence.',
    href: '/services',
    icon: '📷',
  },
];

export default async function HomePage() {
  const c = await getSiteContent();

  return (
    <div className="min-h-screen flex flex-col" style={{ backgroundColor: '#F5EFE0' }}>
      {/* Header */}
      <header style={{ backgroundColor: '#F5EFE0', borderBottom: '1px solid #e0d5c4' }}>
        <div className="max-w-6xl mx-auto px-6 sm:px-8 lg:px-12">
          <div className="flex items-center justify-between py-4">
            <Link href="/" className="text-2xl font-bold" style={{ fontFamily: "'Lobster Two', cursive", color: '#E8521A' }}>
              Sunny Visions Co.
            </Link>
            <PublicNav />
          </div>
        </div>
      </header>

      {/* Hero */}
      <section style={{ backgroundColor: '#E8521A' }} className="py-20 sm:py-28">
        <div className="max-w-4xl mx-auto px-6 sm:px-8 text-center">
          <h1
            className="text-5xl sm:text-7xl font-bold mb-5 leading-none"
            style={{ fontFamily: "'Lobster Two', cursive", color: '#F2BC2B' }}
          >
            {c.hero_headline}
          </h1>
          <p className="text-lg sm:text-xl mb-10 font-semibold" style={{ color: 'rgba(255,255,255,0.9)' }}>
            {c.hero_tagline}
          </p>
          <Link href={c.hero_cta_href || '/services'} className="inline-flex items-center gap-2 px-8 py-3.5 rounded-lg font-bold text-base transition-opacity hover:opacity-90"
            style={{ backgroundColor: '#F2BC2B', color: '#3D2B1F', fontFamily: "'Livvic', sans-serif" }}>
            {c.hero_cta_label} →
          </Link>
        </div>
      </section>

      {/* Explore cards */}
      <section className="py-16 sm:py-20" style={{ backgroundColor: '#F5EFE0' }}>
        <div className="max-w-6xl mx-auto px-6 sm:px-8 lg:px-12">
          <h2 className="text-center text-sm font-bold uppercase tracking-widest mb-10" style={{ color: '#5B9FA3' }}>
            What I Offer
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {EXPLORE_CARDS.map((card) => (
              <Link key={card.title} href={card.href}
                className="card p-7 hover:shadow-lg transition-shadow group flex flex-col gap-3">
                <div className="text-3xl">{card.icon}</div>
                <h3 className="text-base font-bold group-hover:underline" style={{ color: '#3D2B1F' }}>{card.title}</h3>
                <p className="text-sm text-gray-600 leading-relaxed flex-1">{card.description}</p>
                <span className="text-sm font-semibold mt-1" style={{ color: '#E8521A' }}>Learn more →</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* About snippet */}
      <section style={{ backgroundColor: '#D4C4A0' }} className="py-16 sm:py-20">
        <div className="max-w-4xl mx-auto px-6 sm:px-8 text-center">
          <h2 className="text-3xl font-bold mb-5" style={{ fontFamily: "'Lobster Two', cursive", color: '#3D2B1F' }}>
            {c.about_snippet_heading}
          </h2>
          <p className="text-base leading-relaxed mb-8 max-w-2xl mx-auto" style={{ color: '#3D2B1F' }}>
            {c.about_snippet_body}
          </p>
          <Link href="/about" className="btn-secondary inline-flex">
            {c.about_snippet_cta} →
          </Link>
        </div>
      </section>

      {/* Contact CTA */}
      <section style={{ backgroundColor: '#3D2B1F' }} className="py-16 sm:py-20">
        <div className="max-w-2xl mx-auto px-6 sm:px-8 text-center">
          <h2 className="text-3xl font-bold mb-4" style={{ fontFamily: "'Lobster Two', cursive", color: '#F2BC2B' }}>
            Let&apos;s Make Your Vision Happen
          </h2>
          <p className="mb-8 text-base" style={{ color: 'rgba(255,255,255,0.7)' }}>
            Ready to get started? Reach out and let&apos;s talk about your project.
          </p>
          <Link href="/contact" className="inline-flex items-center gap-2 px-8 py-3.5 rounded-lg font-bold text-base transition-opacity hover:opacity-90"
            style={{ backgroundColor: '#E8521A', color: '#fff', fontFamily: "'Livvic', sans-serif" }}>
            Get in Touch →
          </Link>
        </div>
      </section>

      <PublicFooter />
    </div>
  );
}

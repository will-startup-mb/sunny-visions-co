import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { PublicNav } from '@/components/PublicNav';
import { PublicFooter } from '@/components/PublicFooter';
import { getSiteContent } from '@/lib/db/site-content';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Services',
  description: 'Content, design, and branding services by Sunny Visions Co. — Social media, video, graphic design, and photography.',
};

const SERVICES = [
  {
    category: 'Social Media Management',
    icon: '📱',
    color: '#E8521A',
    items: [
      { name: 'Monthly Retainer', price: '$500 – $1,200/mo', description: 'Full social media management including content planning, graphic creation, posting, and engagement.' },
    ],
  },
  {
    category: 'Graphic Design',
    icon: '✏️',
    color: '#5B9FA3',
    items: [
      { name: 'Social Pack', price: '$300 – $600/project', description: 'Branded social media graphics for a full campaign or content period.' },
      { name: 'Wedding Suite', price: '$250 – $800/project', description: 'Custom wedding designs — invitations, programs, menus, signage.' },
      { name: 'Business Branding', price: '$500 – $2,000/project', description: 'Logo, color palette, typography, and brand identity assets.' },
    ],
  },
  {
    category: 'Video Content',
    icon: '🎥',
    color: '#F2BC2B',
    items: [
      { name: 'Short Form Video', price: '$300 – $700/video', description: 'Scroll-stopping content for Instagram Reels, TikTok, and YouTube Shorts.' },
      { name: 'Event Coverage', price: '$800 – $2,500/event', description: 'Full event video production with highlight reel and edited footage delivery.' },
    ],
  },
  {
    category: 'Photography',
    icon: '📷',
    color: '#3D2B1F',
    items: [
      { name: 'Event Photography', price: '$500 – $1,500/event', description: 'Professional event coverage with edited photo gallery delivery.' },
      { name: 'Brand / Product', price: '$400 – $1,200/session', description: 'Studio or on-location brand and product photography for marketing use.' },
    ],
  },
];

export default async function ServicesPage() {
  const c = await getSiteContent();

  return (
    <div className="min-h-screen flex flex-col" style={{ backgroundColor: '#F5EFE0' }}>
      <header className="border-b" style={{ borderColor: '#e0d5c4', backgroundColor: '#F5EFE0' }}>
        <div className="max-w-6xl mx-auto px-6 sm:px-8 lg:px-12">
          <div className="flex items-center justify-between py-4">
            <Link href="/" className="flex items-center">
              <Image src="/logo.png" alt="Sunny Visions Co." height={36} width={360} style={{ height: '2.25rem', width: 'auto' }} />
            </Link>
            <PublicNav />
          </div>
        </div>
      </header>

      <main className="flex-1">
        {/* Hero */}
        <section className="py-16 sm:py-20 text-center px-6" style={{ backgroundColor: '#D4C4A0' }}>
          <h1 className="uppercase mb-4" style={{ fontFamily: 'var(--display)', fontSize: 'clamp(2.5rem, 8vw, 4rem)', color: '#3D2B1F', letterSpacing: '0.05em' }}>
            {c.services_headline}
          </h1>
          <p className="text-base sm:text-lg max-w-xl mx-auto" style={{ color: '#3D2B1F', opacity: 0.75 }}>
            {c.services_subheadline}
          </p>
        </section>

        {/* Services grid */}
        <section className="py-16 sm:py-20 max-w-6xl mx-auto px-6 sm:px-8 lg:px-12">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {SERVICES.map((cat) => (
              <div key={cat.category} className="card p-8">
                <div className="flex items-center gap-3 mb-6">
                  <span className="text-2xl">{cat.icon}</span>
                  <h2 className="text-lg font-bold" style={{ color: cat.color, fontFamily: "'Livvic', sans-serif" }}>
                    {cat.category}
                  </h2>
                </div>
                <div className="space-y-5">
                  {cat.items.map((item) => (
                    <div key={item.name} className="border-l-2 pl-4" style={{ borderColor: cat.color }}>
                      <div className="flex items-baseline justify-between gap-3 mb-1">
                        <span className="font-semibold text-sm" style={{ color: '#3D2B1F' }}>{item.name}</span>
                        <span className="font-bold text-sm tabular-nums whitespace-nowrap" style={{ color: cat.color }}>{item.price}</span>
                      </div>
                      <p className="text-sm text-gray-600 leading-relaxed">{item.description}</p>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* CTA */}
        <section style={{ backgroundColor: '#E8521A' }} className="py-16 sm:py-20">
          <div className="max-w-2xl mx-auto px-6 sm:px-8 text-center">
            <h2 className="uppercase mb-4" style={{ fontFamily: 'var(--display)', fontSize: 'clamp(2rem, 5vw, 2.5rem)', color: '#F2BC2B', letterSpacing: '0.06em' }}>
              {c.services_cta_heading}
            </h2>
            <p className="mb-8 text-base" style={{ color: 'rgba(255,255,255,0.9)' }}>{c.services_cta_body}</p>
            <Link href="/contact" className="inline-flex items-center gap-2 px-8 py-3.5 rounded-lg font-bold text-base transition-opacity hover:opacity-90"
              style={{ backgroundColor: '#F2BC2B', color: '#3D2B1F', fontFamily: "'Livvic', sans-serif" }}>
              {c.services_cta_label} →
            </Link>
          </div>
        </section>
      </main>

      <PublicFooter />
    </div>
  );
}

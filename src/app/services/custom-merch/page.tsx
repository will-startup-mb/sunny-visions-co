import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { PublicNav } from '@/components/PublicNav';
import { PublicFooter } from '@/components/PublicFooter';

export const metadata: Metadata = { title: 'Custom Merch' };

const OTHER = [
  { label: 'SOCIAL MEDIA', href: '/services/social-media' },
  { label: 'VIDEO CONTENT', href: '/services/video-content' },
  { label: 'GRAPHIC DESIGN', href: '/services/graphic-design' },
];

export default function CustomMerchPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <header style={{ backgroundColor: '#F5EFE0', borderBottom: '1px solid #e0d5c4' }}>
        <div className="max-w-7xl mx-auto px-6 sm:px-10 lg:px-16">
          <div className="flex items-center justify-between py-4">
            <Link href="/" className="flex items-center">
              <Image src="/logo.png" alt="Sunny Visions Co." height={2000} width={2000} style={{ height: '3.5rem', width: '16rem', objectFit: 'cover', objectPosition: 'center' }} />
            </Link>
            <PublicNav />
          </div>
        </div>
      </header>

      <main className="flex-1 py-16 px-6" style={{ backgroundColor: '#6B6B48' }}>
        <div className="max-w-5xl mx-auto">
          <h1
            className="uppercase leading-none mb-10"
            style={{ fontFamily: 'var(--display)', fontSize: 'clamp(3rem, 10vw, 7rem)', color: '#F2BC2B', letterSpacing: '0.04em' }}
          >
            CUSTOM<br />MERCH
          </h1>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
            <div>
              <p className="leading-relaxed mb-6" style={{ color: '#F5EFE0', fontFamily: "'Livvic', sans-serif", fontSize: '1rem', lineHeight: 1.8 }}>
                Custom branded merchandise that turns your audience into walking billboards. From concept to finished product — designed to stand out.
              </p>
              <ul className="flex flex-col gap-3">
                {['Custom apparel & clothing', 'Branded accessories', 'Event & promotional items', 'Business swag packs', 'Full merch line design'].map((item) => (
                  <li key={item} style={{ color: '#F5EFE0', fontFamily: "'Livvic', sans-serif", fontSize: '0.95rem', paddingLeft: '1rem', borderLeft: '2px solid #F2BC2B' }}>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
            <div className="rounded-2xl p-8 flex flex-col gap-5" style={{ backgroundColor: 'rgba(255,255,255,0.1)' }}>
              <h3 className="uppercase" style={{ fontFamily: 'var(--display)', color: '#F2BC2B', fontSize: '1.5rem', letterSpacing: '0.08em' }}>
                PRICING
              </h3>
              <div style={{ color: '#F5EFE0', fontFamily: "'Livvic', sans-serif" }}>
                <p className="font-bold text-lg">Starting at $200/design</p>
                <p className="text-sm mt-1" style={{ opacity: 0.75 }}>Pricing varies by product type and quantity</p>
              </div>
              <Link
                href="/#vision"
                className="inline-block font-bold uppercase tracking-widest transition-opacity hover:opacity-90 self-start"
                style={{ fontFamily: "'Livvic', sans-serif", fontSize: '0.75rem', letterSpacing: '0.12em', backgroundColor: '#E8521A', color: 'white', padding: '0.8rem 2rem', borderRadius: '9999px' }}
              >
                GET A QUOTE →
              </Link>
            </div>
          </div>

          <div className="mt-16 pt-10" style={{ borderTop: '1px solid rgba(255,255,255,0.2)' }}>
            <p className="uppercase tracking-widest mb-6 text-sm" style={{ color: 'rgba(245,239,224,0.55)', fontFamily: "'Livvic', sans-serif" }}>
              ALSO OFFERING
            </p>
            <div className="flex flex-wrap gap-4">
              {OTHER.map((s) => (
                <Link
                  key={s.href}
                  href={s.href}
                  className="font-bold uppercase tracking-wider transition-opacity hover:opacity-80"
                  style={{ fontFamily: 'var(--display)', fontSize: '0.85rem', color: '#F5EFE0', backgroundColor: 'rgba(255,255,255,0.12)', padding: '0.7rem 1.5rem', borderRadius: '9999px', letterSpacing: '0.06em' }}
                >
                  {s.label}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </main>

      <PublicFooter />
    </div>
  );
}

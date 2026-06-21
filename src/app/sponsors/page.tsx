import type { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import { PublicFooter } from '@/components/PublicFooter';
import { PublicNav } from '@/components/PublicNav';
import { getSiteContent } from '@/lib/db/site-content';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Become a Sponsor',
  description: 'Support the Startup MB ecosystem and get visibility with the Myrtle Beach startup community.',
};

const TIER_CONFIG = [
  {
    nameKey: 'sponsors_community_name' as const,
    priceKey: 'sponsors_community_price' as const,
    perksKey: 'sponsors_community_description' as const,
    accent: '#3A9E9E',
  },
  {
    nameKey: 'sponsors_growth_name' as const,
    priceKey: 'sponsors_growth_price' as const,
    perksKey: 'sponsors_growth_description' as const,
    accent: '#F26522',
  },
  {
    nameKey: 'sponsors_premier_name' as const,
    priceKey: 'sponsors_premier_price' as const,
    perksKey: 'sponsors_premier_description' as const,
    accent: '#1B3A52',
  },
];

function CheckIcon({ color }: { color: string }) {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" className="shrink-0 mt-0.5">
      <polyline points="20 6 9 17 4 12" />
    </svg>
  );
}

export default async function SponsorsPage() {
  const c = await getSiteContent();
  const introParagraphs = c.sponsors_intro.split('\n\n').filter(Boolean);

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

      <main className="flex-1 max-w-2xl md:max-w-3xl lg:max-w-5xl mx-auto w-full px-6 pt-12 pb-24">
        <h1 className="text-4xl font-extrabold mb-2" style={{ color: '#1B3A52' }}>{c.sponsors_headline}</h1>
        <div className="w-10 h-1 rounded-full mb-6" style={{ backgroundColor: '#3A9E9E' }} />

        {introParagraphs.map((p, i) => (
          <p key={i} className="text-gray-600 text-lg leading-relaxed mb-4 max-w-2xl">{p}</p>
        ))}

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-10 mb-16">
          {TIER_CONFIG.map(({ nameKey, priceKey, perksKey, accent }) => {
            const perks = c[perksKey].split('\n').filter(Boolean);
            return (
              <div key={nameKey} className="bg-white rounded-2xl border border-gray-200 p-8 flex flex-col">
                <div className="mb-6">
                  <div className="w-8 h-1 rounded-full mb-4" style={{ backgroundColor: accent }} />
                  <h2 className="text-xl font-bold mb-1" style={{ color: '#1B3A52' }}>{c[nameKey]}</h2>
                  <div className="flex items-baseline gap-1">
                    <span className="text-3xl font-extrabold" style={{ color: accent }}>{c[priceKey]}</span>
                    <span className="text-gray-400 text-sm font-medium">/month</span>
                  </div>
                </div>
                <ul className="space-y-3 flex-1">
                  {perks.map((perk) => (
                    <li key={perk} className="flex items-start gap-2.5">
                      <CheckIcon color={accent} />
                      <span className="text-gray-600 text-sm leading-snug">{perk}</span>
                    </li>
                  ))}
                </ul>
                <a
                  href={`mailto:${c.sponsors_contact_email}`}
                  className="mt-8 block text-center text-sm font-semibold py-3 px-4 rounded-lg transition-opacity hover:opacity-80"
                  style={{ backgroundColor: accent, color: '#fff' }}
                >
                  Get started
                </a>
              </div>
            );
          })}
        </div>

        <div className="pt-10 border-t border-gray-200">
          <h2 className="text-2xl font-bold mb-3" style={{ color: '#1B3A52' }}>{c.sponsors_cta_heading}</h2>
          <div className="w-10 h-1 rounded-full mb-4" style={{ backgroundColor: '#F26522' }} />
          <p className="text-gray-600 leading-relaxed mb-6 max-w-xl">{c.sponsors_cta_body}</p>
          <a href={`mailto:${c.sponsors_contact_email}`} className="btn-primary">
            Email {c.sponsors_contact_email}
          </a>
        </div>
      </main>

      <PublicFooter />
    </div>
  );
}

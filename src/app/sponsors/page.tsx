import type { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import { PublicFooter } from '@/components/PublicFooter';
import { PublicNav } from '@/components/PublicNav';

export const metadata: Metadata = {
  title: 'Become a Sponsor',
  description: 'Support the Startup MB ecosystem and get visibility with the Myrtle Beach startup community.',
};

const tiers = [
  {
    name: 'Community',
    price: '$500',
    period: '/month',
    accent: '#3A9E9E',
    perks: [
      'Logo in the Startup MB directory footer',
      'Listed as a Community Sponsor on the Sponsors page',
      'One social mention per quarter across LinkedIn and Instagram',
      'Access to sponsor-only ecosystem updates',
    ],
  },
  {
    name: 'Growth',
    price: '$1,000',
    period: '/month',
    accent: '#F26522',
    perks: [
      'Everything in Community',
      'Featured logo placement on the homepage',
      'Company profile highlight in the directory',
      'One dedicated social post per month',
      'Name mentioned in podcast episode intros',
    ],
  },
  {
    name: 'Premier',
    price: '$2,500',
    period: '/month',
    accent: '#1B3A52',
    perks: [
      'Everything in Growth',
      'Presenting sponsor credit on all Startup MB content',
      'Featured placement in the podcast episode show notes',
      'Priority logo placement across all digital properties',
      'Quarterly co-branded social campaign',
      'Direct intro to founders and ecosystem members on request',
    ],
  },
];

function CheckIcon({ color }: { color: string }) {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" className="shrink-0 mt-0.5">
      <polyline points="20 6 9 17 4 12" />
    </svg>
  );
}

export default function SponsorsPage() {
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
        <h1 className="text-4xl font-extrabold mb-2" style={{ color: '#1B3A52' }}>Become a Sponsor</h1>
        <div className="w-10 h-1 rounded-full mb-6" style={{ backgroundColor: '#3A9E9E' }} />

        <p className="text-gray-600 text-lg leading-relaxed mb-4 max-w-2xl">
          Startup MB is building visibility for the Myrtle Beach startup ecosystem — and sponsors make that possible. Whether you&apos;re a local business, a service provider, or a brand that wants to connect with founders and builders, sponsorship puts you in front of the right community.
        </p>
        <p className="text-gray-600 text-lg leading-relaxed mb-14 max-w-2xl">
          Choose the tier that fits your goals, and email us to get started.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
          {tiers.map((tier) => (
            <div
              key={tier.name}
              className="bg-white rounded-2xl border border-gray-200 p-8 flex flex-col"
            >
              <div className="mb-6">
                <div className="w-8 h-1 rounded-full mb-4" style={{ backgroundColor: tier.accent }} />
                <h2 className="text-xl font-bold mb-1" style={{ color: '#1B3A52' }}>{tier.name}</h2>
                <div className="flex items-baseline gap-1">
                  <span className="text-3xl font-extrabold" style={{ color: tier.accent }}>{tier.price}</span>
                  <span className="text-gray-400 text-sm font-medium">{tier.period}</span>
                </div>
              </div>

              <ul className="space-y-3 flex-1">
                {tier.perks.map((perk) => (
                  <li key={perk} className="flex items-start gap-2.5">
                    <CheckIcon color={tier.accent} />
                    <span className="text-gray-600 text-sm leading-snug">{perk}</span>
                  </li>
                ))}
              </ul>

              <a
                href="mailto:will@startupmb.com"
                className="mt-8 block text-center text-sm font-semibold py-3 px-4 rounded-lg transition-opacity hover:opacity-80"
                style={{ backgroundColor: tier.accent, color: '#fff' }}
              >
                Get started
              </a>
            </div>
          ))}
        </div>

        <div className="pt-10 border-t border-gray-200">
          <h2 className="text-2xl font-bold mb-3" style={{ color: '#1B3A52' }}>Ready to sponsor?</h2>
          <div className="w-10 h-1 rounded-full mb-4" style={{ backgroundColor: '#F26522' }} />
          <p className="text-gray-600 leading-relaxed mb-6 max-w-xl">
            Reach out directly and we&apos;ll find the right fit for your goals. Custom packages are also available for larger partnerships or event sponsorships.
          </p>
          <a
            href="mailto:will@startupmb.com"
            className="btn-primary"
          >
            Email will@startupmb.com
          </a>
        </div>
      </main>

      <PublicFooter />
    </div>
  );
}

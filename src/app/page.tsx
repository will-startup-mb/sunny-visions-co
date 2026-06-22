import type { Metadata } from 'next';
import Link from 'next/link';
import { PublicHeader } from '@/components/PublicHeader';
import { PublicFooter } from '@/components/PublicFooter';
import { getSiteContent } from '@/lib/db/site-content';
import { HaveAVisionToggle } from '@/components/HaveAVisionToggle';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: { absolute: 'Sunny Visions Co. — Content, Design & Branding' },
  description: 'One stop shop for content, design & branding. Social media, graphic design, video production, and photography by Claire McCaffrey.',
};

const EXPLORE_CARDS = [
  { title: 'SOCIAL MEDIA', href: '/services/social-media' },
  { title: 'VIDEO CONTENT', href: '/services/video-content' },
  { title: 'GRAPHIC DESIGN', href: '/services/graphic-design' },
  { title: 'CUSTOM MERCH', href: '/services/custom-merch' },
];

export default async function HomePage() {
  const c = await getSiteContent();

  return (
    <div className="min-h-screen flex flex-col">
      <PublicHeader />

      {/* HERO */}
      <section
        className="relative flex flex-col items-center justify-center text-center"
        style={{
          minHeight: '52vh',
          backgroundImage: 'url(/hero.jpg), linear-gradient(160deg, #5A7D96 0%, #8AA5AA 40%, #C8A070 70%, #A87850 100%)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
        }}
      >
        <div className="absolute inset-0" style={{ background: 'rgba(30,18,10,0.42)', pointerEvents: 'none' }} />
        <div className="relative z-10 px-6 sm:px-12 max-w-4xl mx-auto">
          <h1
            className="leading-tight uppercase mb-6"
            style={{
              fontFamily: 'var(--display)',
              fontSize: 'clamp(1.75rem, 3.2vw, 2.4rem)',
              color: '#F2BC2B',
              letterSpacing: '0.04em',
              textShadow: '0 4px 30px rgba(0,0,0,0.35)',
            }}
          >
            ONE STOP SHOP FOR<br />CONTENT, DESIGN, &amp; BRANDING
          </h1>
          <a
            href="#vision"
            className="inline-block font-bold uppercase tracking-widest transition-opacity hover:opacity-90"
            style={{
              fontFamily: "'Livvic', sans-serif",
              fontSize: '1.1rem',
              letterSpacing: '0.1em',
              backgroundColor: '#E8521A',
              color: 'white',
              padding: '0.9rem 2.5rem',
              borderRadius: '9999px',
            }}
          >
            LET&apos;S MAKE YOUR VISION HAPPEN →
          </a>
        </div>
      </section>

      {/* EXPLORE BANNER */}
      <div className="text-center py-3" style={{ backgroundColor: '#E8521A' }}>
        <span
          className="uppercase"
          style={{ fontFamily: 'var(--display)', fontSize: 'clamp(1.75rem, 3vw, 2.25rem)', color: '#F2BC2B', letterSpacing: '0.06em' }}
        >
          EXPLORE
        </span>
      </div>

      {/* SERVICE CARDS */}
      <section className="py-8 px-6" style={{ backgroundColor: '#D4C4A0' }}>
        <div className="max-w-5xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-5">
          {EXPLORE_CARDS.map((card) => (
            <Link
              key={card.title}
              href={card.href}
              className="flex flex-col items-center justify-center gap-3 py-7 px-4 rounded-2xl transition-all hover:-translate-y-1 hover:opacity-90"
              style={{ backgroundColor: '#3D2B1F', border: 'none', textDecoration: 'none' }}
            >
              <span
                className="text-center uppercase"
                style={{ fontFamily: 'var(--display)', fontSize: '1rem', color: '#F2BC2B', letterSpacing: '0.07em' }}
              >
                {card.title}
              </span>
            </Link>
          ))}
        </div>
      </section>

      {/* ABOUT */}
      <section className="py-10 sm:py-12 px-6" style={{ backgroundColor: '#F5EFE0' }}>
        <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 items-center">
          <div
            className="rounded-2xl w-full"
            style={{
              aspectRatio: '3/4',
              backgroundImage: 'url(/claire.jpg)',
              backgroundSize: 'cover',
              backgroundPosition: 'center top',
              backgroundColor: '#D4C4A0',
            }}
          />
          <div>
            <h2
              className="uppercase leading-none mb-5"
              style={{ fontFamily: 'var(--display)', fontSize: 'clamp(2rem, 5vw, 3rem)', color: '#E8521A', letterSpacing: '0.04em' }}
            >
              ABOUT
            </h2>
            <p
              className="leading-relaxed mb-6"
              style={{ fontFamily: "'Livvic', sans-serif", fontSize: '1rem', color: '#3D2B1F', lineHeight: 1.85 }}
            >
              {c.about_snippet_body ?? "Hi! I'm Claire McCaffrey — a Myrtle Beach-based creative specializing in content creation, graphic design, and branding. I help businesses and individuals bring their vision to life through bold visuals and strategic storytelling."}
            </p>
            <ul className="flex flex-col gap-2 mb-8">
              {[
                'Myrtle Beach native & coastal creative',
                '5+ years in social media & branding',
                'Loves golden hour shoots & bold typography',
                'Obsessed with making YOUR brand unforgettable',
              ].map((fact) => (
                <li key={fact} style={{ fontFamily: "'Livvic', sans-serif", fontSize: '0.9rem', color: '#3D2B1F', paddingLeft: '1rem', borderLeft: '2px solid #E8521A' }}>
                  {fact}
                </li>
              ))}
            </ul>
            <Link
              href="/about"
              className="inline-block font-bold uppercase transition-opacity hover:opacity-90"
              style={{ fontFamily: "'Livvic', sans-serif", fontSize: '0.75rem', letterSpacing: '0.12em', backgroundColor: '#3D2B1F', color: '#F2BC2B', padding: '0.75rem 2rem', borderRadius: '9999px' }}
            >
              LEARN MORE →
            </Link>
          </div>
        </div>
      </section>

      <HaveAVisionToggle phone={c.footer_phone} email={c.footer_email} />

      <PublicFooter />
    </div>
  );
}

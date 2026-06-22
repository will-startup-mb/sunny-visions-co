import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { PublicNav } from '@/components/PublicNav';
import { PublicFooter } from '@/components/PublicFooter';
import { getSiteContent } from '@/lib/db/site-content';
import { HaveAVisionForm } from './HaveAVisionForm';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: { absolute: 'Sunny Visions Co. — Content, Design & Branding' },
  description: 'One stop shop for content, design & branding. Social media, graphic design, video production, and photography by Claire McCaffrey.',
};

const EXPLORE_CARDS = [
  { title: 'VIDEO\nCONTENT', href: '/services/video-content', emoji: '🎬' },
  { title: 'GRAPHIC\nDESIGN', href: '/services/graphic-design', emoji: '✏️' },
  { title: 'PHOTOGRAPHY', href: '/services/photography', emoji: '📷' },
];

export default async function HomePage() {
  const c = await getSiteContent();

  return (
    <div className="min-h-screen flex flex-col">
      {/* NAV */}
      <header style={{ backgroundColor: '#F5EFE0', borderBottom: '1px solid #e0d5c4' }}>
        <div className="max-w-7xl mx-auto px-6 sm:px-10 lg:px-16">
          <div className="flex items-center justify-between py-4">
            <Link href="/" className="flex items-center">
              <Image src="/logo.png" alt="Sunny Visions Co." height={2000} width={2000} style={{ height: '3.5rem', width: '16rem', objectFit: 'cover', objectPosition: 'center' }} priority />
            </Link>
            <PublicNav />
          </div>
        </div>
      </header>

      {/* HERO — add /public/hero.jpg for a beach photo background */}
      <section
        className="relative flex flex-col items-center justify-center text-center"
        style={{
          minHeight: '45vh',
          backgroundImage: 'url(/hero.jpg), linear-gradient(160deg, #5A7D96 0%, #8AA5AA 40%, #C8A070 70%, #A87850 100%)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
        }}
      >
        <div className="absolute inset-0" style={{ background: 'rgba(30,18,10,0.42)', pointerEvents: 'none' }} />
        <div className="relative z-10 px-6 sm:px-12 max-w-4xl mx-auto">
          <h1
            className="leading-tight uppercase mb-10"
            style={{
              fontFamily: 'var(--display)',
              fontSize: 'clamp(1.4rem, 3vw, 2rem)',
              color: '#F2BC2B',
              letterSpacing: '0.04em',
              textShadow: '0 4px 30px rgba(0,0,0,0.35)',
            }}
          >
            ONE STOP SHOP FOR CONTENT, DESIGN, &amp; BRANDING
          </h1>
          <Link
            href="#vision"
            className="inline-block font-bold uppercase tracking-widest transition-opacity hover:opacity-90"
            style={{
              fontFamily: "'Livvic', sans-serif",
              fontSize: '0.75rem',
              letterSpacing: '0.15em',
              backgroundColor: '#E8521A',
              color: 'white',
              padding: '0.9rem 2.5rem',
              borderRadius: '9999px',
            }}
          >
            LET&apos;S MAKE YOUR VISION HAPPEN →
          </Link>
        </div>
      </section>

      {/* EXPLORE BANNER */}
      <div className="text-center py-3" style={{ backgroundColor: '#E8521A' }}>
        <span
          className="uppercase"
          style={{ fontFamily: 'var(--display)', fontSize: 'clamp(2rem, 6vw, 3.5rem)', color: '#F2BC2B', letterSpacing: '0.12em' }}
        >
          EXPLORE
        </span>
      </div>

      {/* SERVICE CARDS */}
      <section className="py-14 px-6" style={{ backgroundColor: '#D4C4A0' }}>
        <div className="max-w-5xl mx-auto grid grid-cols-1 sm:grid-cols-3 gap-8">
          {EXPLORE_CARDS.map((card) => (
            <Link
              key={card.title}
              href={card.href}
              className="flex flex-col items-center gap-5 py-10 px-6 rounded-2xl transition-transform hover:-translate-y-1"
              style={{ backgroundColor: '#F5EFE0', border: '2px solid #c0aa88', textDecoration: 'none' }}
            >
              <div
                className="flex items-center justify-center text-3xl rounded-full"
                style={{ width: '5rem', height: '5rem', backgroundColor: '#E8521A', flexShrink: 0 }}
              >
                {card.emoji}
              </div>
              <span
                className="text-center uppercase"
                style={{ fontFamily: 'var(--display)', fontSize: '1.1rem', color: '#3D2B1F', letterSpacing: '0.07em', whiteSpace: 'pre-line' }}
              >
                {card.title}
              </span>
            </Link>
          ))}
        </div>
      </section>

      {/* ABOUT — add /public/claire.jpg for Claire's photo */}
      <section className="py-16 sm:py-20 px-6" style={{ backgroundColor: '#F5EFE0' }}>
        <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-16 items-center">
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
              style={{ fontFamily: 'var(--display)', fontSize: 'clamp(3rem, 8vw, 5rem)', color: '#E8521A', letterSpacing: '0.04em' }}
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
                <li key={fact} className="flex items-center gap-2" style={{ fontFamily: "'Livvic', sans-serif", fontSize: '0.9rem', color: '#3D2B1F' }}>
                  <span style={{ color: '#E8521A', fontWeight: 700 }}>✦</span> {fact}
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

      {/* HAVE A VISION? */}
      <section id="vision" className="py-16 sm:py-20 px-6" style={{ backgroundColor: '#E8521A' }}>
        <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-16 items-start">
          <div>
            <h2
              className="uppercase leading-none mb-6"
              style={{ fontFamily: 'var(--display)', fontSize: 'clamp(3rem, 9vw, 6rem)', color: '#F2BC2B', letterSpacing: '0.04em' }}
            >
              HAVE A<br />VISION?
            </h2>
            <p className="font-bold mb-4" style={{ color: 'white', fontFamily: "'Livvic', sans-serif", fontSize: '1.1rem' }}>
              Contact Me!
            </p>
            <div className="flex flex-col gap-2">
              {c.footer_phone && (
                <a href={`tel:${c.footer_phone}`} className="flex items-center gap-2" style={{ color: 'rgba(255,255,255,0.9)', fontFamily: "'Livvic', sans-serif", fontSize: '1rem' }}>
                  📞 {c.footer_phone}
                </a>
              )}
              {c.footer_email && (
                <a href={`mailto:${c.footer_email}`} className="flex items-center gap-2" style={{ color: 'rgba(255,255,255,0.9)', fontFamily: "'Livvic', sans-serif", fontSize: '1rem' }}>
                  ✉️ {c.footer_email}
                </a>
              )}
            </div>
          </div>
          <HaveAVisionForm />
        </div>
      </section>

      <PublicFooter />
    </div>
  );
}

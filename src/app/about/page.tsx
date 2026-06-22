import type { Metadata } from 'next';
import { PublicHeader } from '@/components/PublicHeader';
import { PublicFooter } from '@/components/PublicFooter';
import { HaveAVisionToggle } from '@/components/HaveAVisionToggle';
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
      <PublicHeader />

      <main className="flex-1">
        {/* About section */}
        <section className="py-14 sm:py-20 px-6" style={{ backgroundColor: '#F5EFE0' }}>
          <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-14 items-center">
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
              <h1
                className="uppercase leading-none mb-5"
                style={{ fontFamily: 'var(--display)', fontSize: 'clamp(2rem, 5vw, 3rem)', color: '#E8521A', letterSpacing: '0.04em' }}
              >
                ABOUT
              </h1>
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
              <div className="flex gap-4 flex-wrap">
                {c.about_instagram_url && (
                  <a
                    href={c.about_instagram_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-block font-bold uppercase transition-opacity hover:opacity-90"
                    style={{ fontFamily: "'Livvic', sans-serif", fontSize: '0.75rem', letterSpacing: '0.12em', backgroundColor: '#3D2B1F', color: '#F2BC2B', padding: '0.75rem 2rem', borderRadius: '9999px' }}
                  >
                    INSTAGRAM →
                  </a>
                )}
                {c.about_linkedin_url && (
                  <a
                    href={c.about_linkedin_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-block font-bold uppercase transition-opacity hover:opacity-90"
                    style={{ fontFamily: "'Livvic', sans-serif", fontSize: '0.75rem', letterSpacing: '0.12em', backgroundColor: 'transparent', color: '#3D2B1F', padding: '0.75rem 2rem', borderRadius: '9999px', border: '1.5px solid #3D2B1F' }}
                  >
                    LINKEDIN →
                  </a>
                )}
              </div>
            </div>
          </div>
        </section>

        {/* Experience section */}
        {(c.about_experience_heading || c.about_experience_body) && (
          <section className="py-10 sm:py-12 px-6" style={{ backgroundColor: '#D4C4A0' }}>
            <div className="max-w-5xl mx-auto">
              {c.about_experience_heading && (
                <h2
                  className="uppercase leading-none mb-5"
                  style={{ fontFamily: 'var(--display)', fontSize: 'clamp(1.5rem, 3vw, 2rem)', color: '#3D2B1F', letterSpacing: '0.04em' }}
                >
                  {c.about_experience_heading}
                </h2>
              )}
              {c.about_experience_body && (
                <p style={{ fontFamily: "'Livvic', sans-serif", fontSize: '1rem', color: '#3D2B1F', lineHeight: 1.85, maxWidth: '65ch' }}>
                  {c.about_experience_body}
                </p>
              )}
            </div>
          </section>
        )}

        <HaveAVisionToggle phone={c.footer_phone} email={c.footer_email} />
      </main>

      <PublicFooter />
    </div>
  );
}

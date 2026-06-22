import { getSiteContent } from '@/lib/db/site-content';
import { HaveAVisionForm } from '@/app/HaveAVisionForm';

export async function HaveAVisionSection() {
  const c = await getSiteContent();

  return (
    <section id="vision" className="py-10 sm:py-12 px-6" style={{ backgroundColor: '#E8521A' }}>
      <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 items-start">
        <div>
          <h2
            className="uppercase leading-none mb-6"
            style={{ fontFamily: 'var(--display)', fontSize: 'clamp(2rem, 5vw, 3.5rem)', color: '#F2BC2B', letterSpacing: '0.04em' }}
          >
            HAVE A<br />VISION?
          </h2>
          <p className="font-bold mb-4" style={{ color: 'white', fontFamily: "'Livvic', sans-serif", fontSize: '1.1rem' }}>
            Contact Me!
          </p>
          <div className="flex flex-col gap-2">
            {c.footer_phone && (
              <a href={`tel:${c.footer_phone}`} style={{ color: 'rgba(255,255,255,0.9)', fontFamily: "'Livvic', sans-serif", fontSize: '1rem' }}>
                {c.footer_phone}
              </a>
            )}
            {c.footer_email && (
              <a href={`mailto:${c.footer_email}`} style={{ color: 'rgba(255,255,255,0.9)', fontFamily: "'Livvic', sans-serif", fontSize: '1rem' }}>
                {c.footer_email}
              </a>
            )}
          </div>
        </div>
        <HaveAVisionForm />
      </div>
    </section>
  );
}

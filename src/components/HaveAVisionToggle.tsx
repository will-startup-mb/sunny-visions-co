'use client';

import { useState } from 'react';
import { HaveAVisionForm } from '@/app/HaveAVisionForm';

interface Props {
  phone?: string;
  email?: string;
}

export function HaveAVisionToggle({ phone, email }: Props) {
  const [open, setOpen] = useState(false);

  return (
    <section id="vision" className="py-10 sm:py-12 px-6" style={{ backgroundColor: '#E8521A' }}>
      <div className="max-w-5xl mx-auto">
        {!open ? (
          <div className="text-center">
            <h2
              className="uppercase leading-none mb-6"
              style={{ fontFamily: 'var(--display)', fontSize: 'clamp(2rem, 5vw, 3.5rem)', color: '#F2BC2B', letterSpacing: '0.04em' }}
            >
              HAVE A VISION?
            </h2>
            <button
              onClick={() => setOpen(true)}
              className="inline-block font-bold uppercase tracking-widest transition-opacity hover:opacity-90"
              style={{ fontFamily: "'Livvic', sans-serif", fontSize: '0.75rem', letterSpacing: '0.15em', backgroundColor: '#3D2B1F', color: '#F2BC2B', padding: '0.9rem 2.5rem', borderRadius: '9999px', border: 'none', cursor: 'pointer' }}
            >
              LET&apos;S WORK TOGETHER →
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 items-start">
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
                {phone && (
                  <a href={`tel:${phone}`} style={{ color: 'rgba(255,255,255,0.9)', fontFamily: "'Livvic', sans-serif", fontSize: '1rem' }}>
                    {phone}
                  </a>
                )}
                {email && (
                  <a href={`mailto:${email}`} style={{ color: 'rgba(255,255,255,0.9)', fontFamily: "'Livvic', sans-serif", fontSize: '1rem' }}>
                    {email}
                  </a>
                )}
              </div>
            </div>
            <HaveAVisionForm />
          </div>
        )}
      </div>
    </section>
  );
}

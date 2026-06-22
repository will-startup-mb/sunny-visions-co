import type { Metadata } from 'next';
import Link from 'next/link';
import { PublicNav } from '@/components/PublicNav';
import { PublicFooter } from '@/components/PublicFooter';
import { getSiteContent } from '@/lib/db/site-content';
import { ContactForm } from './ContactForm';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Contact',
  description: 'Get in touch with Sunny Visions Co. — let\'s talk about your project.',
};

export default async function ContactPage() {
  const c = await getSiteContent();

  return (
    <div className="min-h-screen flex flex-col" style={{ backgroundColor: '#F5EFE0' }}>
      <header className="border-b" style={{ borderColor: '#e0d5c4', backgroundColor: '#F5EFE0' }}>
        <div className="max-w-6xl mx-auto px-6 sm:px-8 lg:px-12">
          <div className="flex items-center justify-between py-4">
            <Link href="/" className="text-2xl font-bold" style={{ fontFamily: "'Lobster Two', cursive", color: '#E8521A' }}>
              Sunny Visions Co.
            </Link>
            <PublicNav />
          </div>
        </div>
      </header>

      <main className="flex-1">
        <section style={{ backgroundColor: '#D4C4A0' }} className="py-16 sm:py-20 text-center px-6">
          <h1 className="text-4xl sm:text-5xl font-bold mb-4" style={{ fontFamily: "'Lobster Two', cursive", color: '#3D2B1F' }}>
            {c.contact_headline}
          </h1>
          <p className="text-base max-w-lg mx-auto" style={{ color: '#3D2B1F', opacity: 0.75 }}>
            {c.contact_subheadline}
          </p>
        </section>

        <section className="max-w-xl mx-auto px-6 sm:px-8 py-16">
          <ContactForm formspreeId={c.contact_formspree_id} />

          <div className="mt-10 pt-8 border-t text-center space-y-2" style={{ borderColor: '#e0d5c4' }}>
            <p className="text-sm text-gray-500">Or reach out directly:</p>
            <a href="mailto:cemccaffrey5@gmail.com" className="block font-semibold hover:underline" style={{ color: '#E8521A' }}>
              cemccaffrey5@gmail.com
            </a>
            <a href="tel:8436555360" className="block text-sm text-gray-600 hover:underline">(843) 655-5360</a>
          </div>
        </section>
      </main>

      <PublicFooter />
    </div>
  );
}

import { getSiteContent } from '@/lib/db/site-content';
import Link from 'next/link';

export async function PublicFooter() {
  const c = await getSiteContent();

  return (
    <footer style={{ backgroundColor: '#3D2B1F' }} className="mt-auto py-10">
      <div className="max-w-6xl mx-auto px-6 sm:px-8 lg:px-12">
        <div className="flex flex-col items-center gap-4 text-center">
          <Link href="/" className="uppercase tracking-widest" style={{ fontFamily: 'var(--display)', fontSize: '1.4rem', color: '#F2BC2B', letterSpacing: '0.06em' }}>
            SUNNY VISIONS CO.
          </Link>
          {c.footer_tagline && (
            <p className="text-sm" style={{ color: 'rgba(255,255,255,0.6)' }}>{c.footer_tagline}</p>
          )}
          <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-sm" style={{ color: 'rgba(255,255,255,0.55)' }}>
            <Link href="/services" className="hover:text-white transition-colors">Services</Link>
            <Link href="/work" className="hover:text-white transition-colors">Work</Link>
            <Link href="/about" className="hover:text-white transition-colors">About</Link>
            <Link href="/contact" className="hover:text-white transition-colors">Contact</Link>
          </div>
          <div className="flex flex-wrap items-center justify-center gap-x-5 gap-y-1 text-sm" style={{ color: 'rgba(255,255,255,0.5)' }}>
            {c.footer_email && (
              <a href={`mailto:${c.footer_email}`} className="hover:text-white transition-colors">{c.footer_email}</a>
            )}
            {c.footer_phone && (
              <a href={`tel:${c.footer_phone}`} className="hover:text-white transition-colors">{c.footer_phone}</a>
            )}
            {c.footer_instagram_url && (
              <a href={c.footer_instagram_url} target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">Instagram</a>
            )}
            {c.footer_linkedin_url && (
              <a href={c.footer_linkedin_url} target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">LinkedIn</a>
            )}
          </div>
          <p className="text-xs mt-2" style={{ color: 'rgba(255,255,255,0.3)' }}>{c.footer_copyright}</p>
        </div>
      </div>
    </footer>
  );
}

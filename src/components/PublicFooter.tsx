import { getSiteContent } from '@/lib/db/site-content';

export async function PublicFooter() {
  const c = await getSiteContent();

  return (
    <footer style={{ backgroundColor: '#1B3A52' }} className="mt-auto py-8">
      <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
        {c.footer_tagline && (
          <p className="text-center text-sm mb-4" style={{ color: 'rgba(255,255,255,0.6)' }}>
            {c.footer_tagline}
          </p>
        )}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-2 sm:gap-6 text-sm text-white/60">
          <span className="font-semibold text-white/90">{c.footer_copyright}</span>
          <span className="hidden sm:inline text-white/30">·</span>
          <a href={`mailto:${c.footer_email}`} className="hover:text-white transition-colors">
            {c.footer_email}
          </a>
          <span className="hidden sm:inline text-white/30">·</span>
          <a href="https://startupmb.com" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">
            {c.footer_website}
          </a>
        </div>
      </div>
    </footer>
  );
}

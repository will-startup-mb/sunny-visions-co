export function PublicFooter() {
  return (
    <footer style={{ backgroundColor: '#1B3A52' }} className="mt-auto py-8">
      <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
        <div className="flex flex-col sm:flex-row items-center justify-center gap-2 sm:gap-6 text-sm text-white/60">
          <span className="font-semibold text-white/90">© 2026 Startup MB</span>
          <span className="hidden sm:inline text-white/30">·</span>
          <a href="mailto:will@startupmb.com" className="hover:text-white transition-colors">
            will@startupmb.com
          </a>
          <span className="hidden sm:inline text-white/30">·</span>
          <a href="https://startupmb.com" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">
            startupmb.com
          </a>
        </div>
      </div>
    </footer>
  );
}

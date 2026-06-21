import type { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import { PublicFooter } from '@/components/PublicFooter';

export const metadata: Metadata = {
  title: 'Podcast',
  description: 'The Startup MB podcast — conversations with the founders and ecosystem builders driving the Myrtle Beach startup scene.',
};

function SpotifyIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.419 1.56-.299.421-1.02.599-1.559.3z"/>
    </svg>
  );
}

function AppleIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M12.152 6.896c-.948 0-2.415-1.078-3.96-1.04-2.04.027-3.91 1.183-4.961 3.014-2.117 3.675-.546 9.103 1.519 12.09 1.013 1.454 2.208 3.09 3.792 3.039 1.52-.065 2.09-.987 3.935-.987 1.831 0 2.35.987 3.96.948 1.637-.026 2.676-1.48 3.676-2.948 1.156-1.688 1.636-3.325 1.662-3.415-.039-.013-3.182-1.221-3.22-4.857-.026-3.04 2.48-4.494 2.597-4.559-1.429-2.09-3.623-2.324-4.39-2.376-2-.156-3.675 1.09-4.61 1.09zM15.53 3.83c.843-1.012 1.4-2.427 1.245-3.83-1.207.052-2.662.805-3.532 1.818-.78.896-1.454 2.338-1.273 3.714 1.338.104 2.715-.688 3.559-1.701"/>
    </svg>
  );
}

function YouTubeIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
    </svg>
  );
}

export default function PodcastPage() {
  return (
    <div className="min-h-screen flex flex-col" style={{ backgroundColor: '#F8F9FA' }}>
      <header style={{ backgroundColor: '#F8F9FA' }}>
        <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
          <div className="flex items-center justify-between pt-4 pb-4">
            <Link href="/">
              <Image src="/logo.png" alt="Startup MB" height={80} width={80} className="object-contain" />
            </Link>
            <nav className="flex items-center gap-3 sm:gap-6">
              <Link href="/podcast" className="text-sm sm:text-base transition-colors font-medium text-gray-900">Podcast</Link>
              <Link href="/blog" className="text-sm sm:text-base transition-colors font-medium text-gray-600 hover:text-gray-900">Blog</Link>
              <Link href="/about" className="text-sm sm:text-base transition-colors font-medium text-gray-600 hover:text-gray-900">About</Link>
            </nav>
          </div>
        </div>
      </header>

      <main className="flex-1 max-w-2xl md:max-w-3xl lg:max-w-4xl mx-auto w-full px-6 pt-12 pb-24">
        <h1 className="text-4xl font-extrabold mb-6" style={{ color: '#1B3A52' }}>The Startup MB Podcast</h1>

        <p className="text-gray-600 text-lg leading-relaxed mb-4">
          Real conversations with the founders, operators, and community builders who are quietly building something in Myrtle Beach, SC.
        </p>
        <p className="text-gray-600 text-lg leading-relaxed mb-10">
          Every episode goes behind the scenes of a local startup — the origin story, the obstacles, the lessons, and what&apos;s next. If you&apos;ve ever wondered who&apos;s actually building things in the Grand Strand, this is the show.
        </p>

        {/* Platform buttons */}
        <div className="flex flex-wrap gap-3 mb-14">
          <button
            disabled
            className="flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-semibold text-white transition-opacity disabled:opacity-40 cursor-not-allowed"
            style={{ backgroundColor: '#1DB954' }}
            title="Coming soon"
          >
            <SpotifyIcon />
            Spotify
          </button>
          <button
            disabled
            className="flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-semibold text-white transition-opacity disabled:opacity-40 cursor-not-allowed"
            style={{ backgroundColor: '#872EC4' }}
            title="Coming soon"
          >
            <AppleIcon />
            Apple Podcasts
          </button>
          <button
            disabled
            className="flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-semibold text-white transition-opacity disabled:opacity-40 cursor-not-allowed"
            style={{ backgroundColor: '#FF0000' }}
            title="Coming soon"
          >
            <YouTubeIcon />
            YouTube
          </button>
        </div>

        <div className="space-y-10">
          <section>
            <h2 className="text-2xl font-bold mb-3" style={{ color: '#1B3A52' }}>The Format</h2>
            <div className="w-10 h-1 rounded-full mb-4" style={{ backgroundColor: '#3A9E9E' }} />
            <p className="text-gray-600 leading-relaxed">
              Each episode is a long-form conversation with one guest — a founder, investor, or ecosystem builder with roots in the Myrtle Beach area. We dig into how they got started, what building locally actually looks like, and what they wish they&apos;d known earlier.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-3" style={{ color: '#1B3A52' }}>Who We Talk To</h2>
            <div className="w-10 h-1 rounded-full mb-4" style={{ backgroundColor: '#F26522' }} />
            <p className="text-gray-600 leading-relaxed">
              Early-stage founders. Bootstrapped operators. Serial entrepreneurs. Community connectors. If you&apos;re building something real in the Grand Strand — or you helped make the ecosystem what it is today — we want to tell your story.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-3" style={{ color: '#1B3A52' }}>Episodes</h2>
            <div className="w-10 h-1 rounded-full mb-4" style={{ backgroundColor: '#1B3A52' }} />
            <div className="card p-8 text-center">
              <p className="text-2xl mb-2">🎙️</p>
              <p className="font-semibold mb-1" style={{ color: '#1B3A52' }}>Episodes coming soon</p>
              <p className="text-sm text-gray-500">
                We&apos;re recording now. Follow us on{' '}
                <a href="https://www.instagram.com/startupmyrtlebeach" target="_blank" rel="noopener noreferrer" className="underline underline-offset-2 hover:opacity-70" style={{ color: '#3A9E9E' }}>
                  Instagram
                </a>{' '}
                to be the first to know when episodes drop.
              </p>
            </div>
          </section>
        </div>

        <div className="mt-14">
          <Link href="/" className="btn-primary">← Back to directory</Link>
        </div>
      </main>

      <PublicFooter />
    </div>
  );
}

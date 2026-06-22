import type { Metadata } from 'next';
import './globals.css';

const SITE_URL = process.env.NEXTAUTH_URL || 'https://sunny-visions-co.vercel.app';
const DESCRIPTION = 'One stop shop for content, design & branding. Social media, graphic design, video production, and photography by Claire McCaffrey.';

export const metadata: Metadata = {
  title: {
    template: '%s | Sunny Visions Co.',
    default: 'Sunny Visions Co. — One Stop Shop for Content, Design & Branding',
  },
  description: DESCRIPTION,
  metadataBase: new URL(SITE_URL),
  icons: {
    icon: [{ url: '/favicon.png', type: 'image/png' }],
    apple: { url: '/favicon.png', type: 'image/png' },
  },
  openGraph: {
    siteName: 'Sunny Visions Co.',
    title: 'Sunny Visions Co. — One Stop Shop for Content, Design & Branding',
    description: DESCRIPTION,
    type: 'website',
    url: SITE_URL,
    locale: 'en_US',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Sunny Visions Co. — One Stop Shop for Content, Design & Branding',
    description: DESCRIPTION,
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="h-full">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      </head>
      <body className="min-h-full">{children}</body>
    </html>
  );
}

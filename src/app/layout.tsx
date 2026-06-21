import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';

const inter = Inter({ subsets: ['latin'] });

const SITE_URL = process.env.NEXTAUTH_URL || 'https://startupmb.vercel.app';
const DESCRIPTION = 'Discover and explore startups, founders, and companies building in the Myrtle Beach, SC ecosystem.';

export const metadata: Metadata = {
  title: {
    template: '%s | Startup MB',
    default: 'Startup MB — Myrtle Beach Startup Ecosystem',
  },
  description: DESCRIPTION,
  metadataBase: new URL(SITE_URL),
  icons: {
    icon: [
      { url: '/favicon-16x16.png', sizes: '16x16', type: 'image/png' },
      { url: '/favicon-32x32.png', sizes: '32x32', type: 'image/png' },
    ],
    apple: { url: '/apple-touch-icon.png', sizes: '180x180', type: 'image/png' },
  },
  openGraph: {
    siteName: 'Startup MB',
    title: 'Startup MB — Mapping the Myrtle Beach Startup Ecosystem',
    description: DESCRIPTION,
    type: 'website',
    url: SITE_URL,
    locale: 'en_US',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Startup MB — Mapping the Myrtle Beach Startup Ecosystem',
    description: DESCRIPTION,
  },
  verification: {
    google: 'FgmEhmT8MbIfDVBRUZwRau4g5Qydr6PwvXh7KnjlGsc',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="h-full">
      <body className={`${inter.className} min-h-full`}>{children}</body>
    </html>
  );
}

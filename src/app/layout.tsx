import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';

const inter = Inter({ subsets: ['latin'] });

const SITE_URL = process.env.NEXTAUTH_URL || 'https://startupmb.vercel.app';
const DESCRIPTION = 'Discover the companies, founders, and innovators building the future in the Grand Strand. The definitive Myrtle Beach startup directory.';

export const metadata: Metadata = {
  title: {
    template: '%s | Startup MB',
    default: 'Startup MB — Myrtle Beach Startup Ecosystem',
  },
  description: DESCRIPTION,
  metadataBase: new URL(SITE_URL),
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
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="h-full">
      <body className={`${inter.className} min-h-full`}>{children}</body>
    </html>
  );
}

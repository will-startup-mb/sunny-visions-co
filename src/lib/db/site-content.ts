import { cache } from 'react';
import { db } from '@/lib/db';
import { siteContent } from '@/lib/db/schema';

export const SITE_CONTENT_DEFAULTS: Record<string, string> = {
  hero_headline: 'Mapping the Myrtle Beach Startup Ecosystem',
  hero_subheadline: 'Discover the companies, founders, and innovators building the future in the Grand Strand.',
  about_intro: 'Startup MB is a podcast and ecosystem mapping platform dedicated to discovering, documenting, and celebrating the startups and innovators building companies in the Myrtle Beach, SC area.',
  footer_tagline: '',
};

export const getSiteContent = cache(async (): Promise<Record<string, string>> => {
  try {
    const rows = await db.select().from(siteContent);
    const data: Record<string, string> = { ...SITE_CONTENT_DEFAULTS };
    for (const row of rows) data[row.key] = row.value;
    return data;
  } catch {
    return { ...SITE_CONTENT_DEFAULTS };
  }
});

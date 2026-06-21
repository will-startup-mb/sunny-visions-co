import { cache } from 'react';
import { db } from '@/lib/db';
import { siteContent } from '@/lib/db/schema';

export const SITE_CONTENT_DEFAULTS: Record<string, string> = {
  // Home
  hero_headline: 'Mapping the Myrtle Beach Startup Ecosystem',
  hero_subheadline: 'Discover the companies, founders, and innovators building the future in the Grand Strand.',

  // About
  about_intro: 'Startup MB is a podcast and ecosystem mapping platform dedicated to discovering, documenting, and celebrating the startups and innovators building companies in the Myrtle Beach, SC area.',
  about_will_bio: "Founded by Will McCaffrey, Startup MB started as a simple question: who's actually building things here? What began as a Google Sheet has grown into a live, searchable directory of local startups, researched, categorized, and updated regularly.",

  // Podcast
  podcast_show_title: 'The Startup MB Podcast',
  podcast_show_description: 'Real conversations with the founders, operators, and community builders who are quietly building something in Myrtle Beach, SC.\n\nEvery episode goes behind the scenes of a local startup — the origin story, the obstacles, the lessons, and what\'s next. If you\'ve ever wondered who\'s actually building things in the Grand Strand, this is the show.',
  podcast_spotify_url: '',
  podcast_apple_url: '',
  podcast_youtube_url: '',

  // Events
  events_headline: 'Events',
  events_description: 'Startup MB brings together the founders, builders, and community leaders of the Grand Strand. Networking nights, founder dinners, pitch events, and more — all coming to Myrtle Beach.',
  events_instagram_url: 'https://www.instagram.com/startupmyrtlebeach',

  // Sponsors
  sponsors_headline: 'Become a Sponsor',
  sponsors_intro: 'Startup MB is building visibility for the Myrtle Beach startup ecosystem — and sponsors make that possible. Whether you\'re a local business, a service provider, or a brand that wants to connect with founders and builders, sponsorship puts you in front of the right community.\n\nChoose the tier that fits your goals, and email us to get started.',
  sponsors_community_description: 'Logo in the Startup MB directory footer\nListed as a Community Sponsor on the Sponsors page\nOne social mention per quarter across LinkedIn and Instagram\nAccess to sponsor-only ecosystem updates',
  sponsors_growth_description: 'Everything in Community\nFeatured logo placement on the homepage\nCompany profile highlight in the directory\nOne dedicated social post per month\nName mentioned in podcast episode intros',
  sponsors_premier_description: 'Everything in Growth\nPresenting sponsor credit on all Startup MB content\nFeatured placement in the podcast episode show notes\nPriority logo placement across all digital properties\nQuarterly co-branded social campaign\nDirect intro to founders and ecosystem members on request',

  // Footer
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

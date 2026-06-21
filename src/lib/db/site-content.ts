import { cache } from 'react';
import { db } from '@/lib/db';
import { siteContent } from '@/lib/db/schema';

export const SITE_CONTENT_DEFAULTS: Record<string, string> = {
  // ── Home ──────────────────────────────────────────────────────────────────
  hero_headline: 'Mapping the Myrtle Beach\nStartup Ecosystem',
  hero_subheadline: 'Discover the companies, founders, and innovators building the future in the Grand Strand.',
  home_search_placeholder: 'Search companies, founders, industries…',
  home_empty_heading: 'No companies found',
  home_empty_body: 'Try adjusting your search or filters.',

  // ── About ─────────────────────────────────────────────────────────────────
  about_page_title: 'About Startup MB',
  about_intro: 'Startup MB is a podcast and ecosystem mapping platform dedicated to discovering, documenting, and celebrating the startups and innovators building companies in the Myrtle Beach, SC area.',
  about_will_bio: "Founded by Will McCaffrey, Startup MB started as a simple question: who's actually building things here? What began as a Google Sheet has grown into a live, searchable directory of local startups, researched, categorized, and updated regularly.",
  about_directory_heading: 'The Directory',
  about_directory_body: 'The Startup MB directory maps companies across the Grand Strand, from early-stage startups to established tech companies. Each profile is researched and scored for innovation and ecosystem impact, giving founders, investors, and community partners a real-time view of what\'s being built locally.',
  about_podcast_heading: 'The Podcast',
  about_podcast_body: 'The Startup MB podcast features conversations with the founders, operators, and community builders driving the Myrtle Beach startup scene forward. New episodes drop regularly at startupmb.com.',
  about_mission_heading: 'The Mission',
  about_mission_body: 'Myrtle Beach is more than a tourist destination. A real startup ecosystem is emerging here, and Startup MB exists to make it visible.',
  about_linkedin_will_url: 'https://www.linkedin.com/in/will-mccaffrey/',
  about_linkedin_company_url: 'https://www.linkedin.com/company/startup-mb/',
  about_instagram_url: 'https://www.instagram.com/startupmyrtlebeach',

  // ── Podcast ───────────────────────────────────────────────────────────────
  podcast_show_title: 'The Startup MB Podcast',
  podcast_show_description: 'Real conversations with the founders, operators, and community builders who are quietly building something in Myrtle Beach, SC.\n\nEvery episode goes behind the scenes of a local startup — the origin story, the obstacles, the lessons, and what\'s next. If you\'ve ever wondered who\'s actually building things in the Grand Strand, this is the show.',
  podcast_format_heading: 'The Format',
  podcast_format_body: 'Each episode is a long-form conversation with one guest — a founder, investor, or ecosystem builder with roots in the Myrtle Beach area. We dig into how they got started, what building locally actually looks like, and what they wish they\'d known earlier.',
  podcast_guests_heading: 'Who We Talk To',
  podcast_guests_body: 'Early-stage founders. Bootstrapped operators. Serial entrepreneurs. Community connectors. If you\'re building something real in the Grand Strand — or you helped make the ecosystem what it is today — we want to tell your story.',
  podcast_episodes_empty_heading: 'Episodes coming soon',
  podcast_episodes_empty_body: 'We\'re recording now. Follow us on Instagram to be the first to know when episodes drop.',
  podcast_spotify_url: '',
  podcast_apple_url: '',
  podcast_youtube_url: '',

  // ── Events ────────────────────────────────────────────────────────────────
  events_headline: 'Events',
  events_description: 'Startup MB brings together the founders, builders, and community leaders of the Grand Strand. Networking nights, founder dinners, pitch events, and more — all coming to Myrtle Beach.',
  events_empty_heading: 'No events scheduled yet',
  events_empty_body: 'Check back soon — something\'s in the works.',
  events_follow_label: 'Stay in the loop',
  events_follow_body: 'Follow on Instagram for event announcements and community updates.',
  events_follow_button: 'Follow on Instagram',
  events_instagram_url: 'https://www.instagram.com/startupmyrtlebeach',

  // ── Sponsors ──────────────────────────────────────────────────────────────
  sponsors_headline: 'Become a Sponsor',
  sponsors_intro: 'Startup MB is building visibility for the Myrtle Beach startup ecosystem — and sponsors make that possible. Whether you\'re a local business, a service provider, or a brand that wants to connect with founders and builders, sponsorship puts you in front of the right community.\n\nChoose the tier that fits your goals, and email us to get started.',
  sponsors_community_name: 'Community',
  sponsors_community_price: '$500',
  sponsors_community_description: 'Logo in the Startup MB directory footer\nListed as a Community Sponsor on the Sponsors page\nOne social mention per quarter across LinkedIn and Instagram\nAccess to sponsor-only ecosystem updates',
  sponsors_growth_name: 'Growth',
  sponsors_growth_price: '$1,000',
  sponsors_growth_description: 'Everything in Community\nFeatured logo placement on the homepage\nCompany profile highlight in the directory\nOne dedicated social post per month\nName mentioned in podcast episode intros',
  sponsors_premier_name: 'Premier',
  sponsors_premier_price: '$2,500',
  sponsors_premier_description: 'Everything in Growth\nPresenting sponsor credit on all Startup MB content\nFeatured placement in the podcast episode show notes\nPriority logo placement across all digital properties\nQuarterly co-branded social campaign\nDirect intro to founders and ecosystem members on request',
  sponsors_cta_heading: 'Ready to sponsor?',
  sponsors_cta_body: 'Reach out directly and we\'ll find the right fit for your goals. Custom packages are also available for larger partnerships or event sponsorships.',
  sponsors_contact_email: 'will@startupmb.com',

  // ── Blog ──────────────────────────────────────────────────────────────────
  blog_page_title: 'Blog',
  blog_empty_message: 'No posts yet — check back soon.',

  // ── Footer ────────────────────────────────────────────────────────────────
  footer_copyright: '© 2026 Startup MB',
  footer_email: 'will@startupmb.com',
  footer_website: 'startupmb.com',
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

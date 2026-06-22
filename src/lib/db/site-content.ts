import { cache } from 'react';
import { db } from '@/lib/db';
import { siteContent } from '@/lib/db/schema';

export const SITE_CONTENT_DEFAULTS: Record<string, string> = {
  // ── Home ─────────────────────────────────────────────────────────────────
  hero_headline: 'SUNNY VISIONS CO.',
  hero_tagline: 'One Stop Shop for Content, Design & Branding',
  hero_cta_label: 'See Our Services',
  hero_cta_href: '/services',

  // ── About Snippet (home) ──────────────────────────────────────────────────
  about_snippet_heading: 'Hey, I\'m Claire',
  about_snippet_body: 'I\'m a digital marketer and creative based in Myrtle Beach with a passion for helping brands tell their story through video, photography, and design.',
  about_snippet_cta: 'Read My Story',

  // ── About Page ───────────────────────────────────────────────────────────
  about_page_title: 'About Claire',
  about_bio: 'Claire McCaffrey is a Myrtle Beach-based content creator and digital marketing strategist with 3+ years of experience in social media management, graphic design, video production, and photography. She founded Sunny Visions Co. to help local businesses and brands build a consistent, compelling presence online.',
  about_experience_heading: 'Experience',
  about_experience_body: 'From managing full social media calendars to producing polished video content and designing brand identities, Claire brings a full-spectrum creative skill set to every client engagement.',
  about_instagram_url: 'https://www.instagram.com/mcclairree',
  about_linkedin_url: 'https://www.linkedin.com/in/claire-mccaffrey-branding/',

  // ── Services Page ─────────────────────────────────────────────────────────
  services_headline: 'What I Do',
  services_subheadline: 'Content, design, and branding services tailored to your goals.',
  services_cta_heading: 'Let\'s Make Your Vision Happen',
  services_cta_body: 'Ready to get started? Send me a message and let\'s talk about your project.',
  services_cta_label: 'Get in Touch',

  // ── Work / Portfolio ──────────────────────────────────────────────────────
  work_headline: 'Portfolio',
  work_subheadline: 'A selection of recent projects across video, design, and photography.',
  work_empty_heading: 'Projects coming soon',
  work_empty_body: 'Check back soon for case studies and portfolio work.',

  // ── Contact ───────────────────────────────────────────────────────────────
  contact_headline: 'Let\'s Work Together',
  contact_subheadline: 'Have a project in mind? Fill out the form and I\'ll be in touch within 24 hours.',
  contact_formspree_id: '',

  // ── Footer ────────────────────────────────────────────────────────────────
  footer_tagline: 'One Stop Shop for Content, Design & Branding',
  footer_copyright: '© 2026 Sunny Visions Co.',
  footer_email: 'cemccaffrey5@gmail.com',
  footer_phone: '(843) 655-5360',
  footer_instagram_url: 'https://www.instagram.com/mcclairree',
  footer_linkedin_url: 'https://www.linkedin.com/in/claire-mccaffrey-branding/',
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

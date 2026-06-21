'use client';

import { useState } from 'react';
import { SITE_CONTENT_DEFAULTS } from '@/lib/db/site-content';

type Key = keyof typeof SITE_CONTENT_DEFAULTS;

interface Field {
  key: Key;
  label: string;
  hint?: string;
  multiline?: boolean;
  rows?: number;
  placeholder?: string;
}

interface Section {
  title: string;
  accent: string;
  fields: Field[];
}

const SECTIONS: Section[] = [
  {
    title: 'Home',
    accent: '#1B3A52',
    fields: [
      { key: 'hero_headline', label: 'Hero Headline', hint: 'Line 1 appears in navy, line 2 in teal. Press Enter between them.', multiline: true, rows: 2 },
      { key: 'hero_subheadline', label: 'Hero Subheadline', hint: 'Supporting paragraph below the headline.' },
      { key: 'home_search_placeholder', label: 'Search Placeholder', hint: 'Placeholder text inside the search input.' },
      { key: 'home_empty_heading', label: 'No Results Heading', hint: 'Shown when a search returns no companies.' },
      { key: 'home_empty_body', label: 'No Results Body', hint: 'Supporting text below the no-results heading.' },
    ],
  },
  {
    title: 'About',
    accent: '#3A9E9E',
    fields: [
      { key: 'about_page_title', label: 'Page Title', hint: 'h1 at the top of the About page.' },
      { key: 'about_intro', label: 'Intro Paragraph', multiline: true, rows: 3 },
      { key: 'about_will_bio', label: "Will's Bio", hint: 'Second opening paragraph.', multiline: true, rows: 3 },
      { key: 'about_directory_heading', label: 'Directory Section Heading' },
      { key: 'about_directory_body', label: 'Directory Section Body', multiline: true, rows: 3 },
      { key: 'about_podcast_heading', label: 'Podcast Section Heading' },
      { key: 'about_podcast_body', label: 'Podcast Section Body', multiline: true, rows: 3 },
      { key: 'about_mission_heading', label: 'Mission Section Heading' },
      { key: 'about_mission_body', label: 'Mission Section Body', multiline: true, rows: 2 },
      { key: 'about_linkedin_will_url', label: "Will's LinkedIn URL", placeholder: 'https://www.linkedin.com/in/...' },
      { key: 'about_linkedin_company_url', label: 'Startup MB LinkedIn URL', placeholder: 'https://www.linkedin.com/company/...' },
      { key: 'about_instagram_url', label: 'Instagram URL', placeholder: 'https://www.instagram.com/...' },
    ],
  },
  {
    title: 'Podcast',
    accent: '#F26522',
    fields: [
      { key: 'podcast_show_title', label: 'Show Title', hint: 'Page h1.' },
      { key: 'podcast_show_description', label: 'Show Description', hint: 'Separate paragraphs with a blank line.', multiline: true, rows: 5 },
      { key: 'podcast_format_heading', label: '"The Format" Heading' },
      { key: 'podcast_format_body', label: '"The Format" Body', multiline: true, rows: 3 },
      { key: 'podcast_guests_heading', label: '"Who We Talk To" Heading' },
      { key: 'podcast_guests_body', label: '"Who We Talk To" Body', multiline: true, rows: 3 },
      { key: 'podcast_episodes_empty_heading', label: 'Episodes Empty Heading', hint: 'Shown before any episodes are live.' },
      { key: 'podcast_episodes_empty_body', label: 'Episodes Empty Body' },
      { key: 'podcast_spotify_url', label: 'Spotify URL', hint: 'Leave blank to show button as disabled.', placeholder: 'https://open.spotify.com/show/...' },
      { key: 'podcast_apple_url', label: 'Apple Podcasts URL', hint: 'Leave blank to show button as disabled.', placeholder: 'https://podcasts.apple.com/...' },
      { key: 'podcast_youtube_url', label: 'YouTube URL', hint: 'Leave blank to show button as disabled.', placeholder: 'https://youtube.com/@...' },
    ],
  },
  {
    title: 'Events',
    accent: '#1B3A52',
    fields: [
      { key: 'events_headline', label: 'Page Headline', hint: 'h1 at the top of the Events page.' },
      { key: 'events_description', label: 'Page Description', multiline: true, rows: 3 },
      { key: 'events_empty_heading', label: 'No Events Heading', hint: 'Shown when no events are scheduled.' },
      { key: 'events_empty_body', label: 'No Events Body' },
      { key: 'events_follow_label', label: 'Follow Section Label', hint: 'Small uppercase label above the follow prompt.' },
      { key: 'events_follow_body', label: 'Follow Section Body', hint: 'Text next to the Instagram button.' },
      { key: 'events_follow_button', label: 'Follow Button Text' },
      { key: 'events_instagram_url', label: 'Instagram URL', placeholder: 'https://www.instagram.com/...' },
    ],
  },
  {
    title: 'Sponsors',
    accent: '#3A9E9E',
    fields: [
      { key: 'sponsors_headline', label: 'Page Headline' },
      { key: 'sponsors_intro', label: 'Intro Text', hint: 'Separate paragraphs with a blank line.', multiline: true, rows: 4 },
      { key: 'sponsors_community_name', label: 'Community Tier — Name' },
      { key: 'sponsors_community_price', label: 'Community Tier — Price', placeholder: '$500' },
      { key: 'sponsors_community_description', label: 'Community Tier — Perks', hint: 'One perk per line.', multiline: true, rows: 4 },
      { key: 'sponsors_growth_name', label: 'Growth Tier — Name' },
      { key: 'sponsors_growth_price', label: 'Growth Tier — Price', placeholder: '$1,000' },
      { key: 'sponsors_growth_description', label: 'Growth Tier — Perks', hint: 'One perk per line.', multiline: true, rows: 5 },
      { key: 'sponsors_premier_name', label: 'Premier Tier — Name' },
      { key: 'sponsors_premier_price', label: 'Premier Tier — Price', placeholder: '$2,500' },
      { key: 'sponsors_premier_description', label: 'Premier Tier — Perks', hint: 'One perk per line.', multiline: true, rows: 6 },
      { key: 'sponsors_cta_heading', label: 'CTA Section Heading' },
      { key: 'sponsors_cta_body', label: 'CTA Section Body', multiline: true, rows: 2 },
      { key: 'sponsors_contact_email', label: 'Contact Email', placeholder: 'will@startupmb.com' },
    ],
  },
  {
    title: 'Blog',
    accent: '#F26522',
    fields: [
      { key: 'blog_page_title', label: 'Page Title', hint: 'h1 at the top of the Blog page.' },
      { key: 'blog_empty_message', label: 'Empty State Message', hint: 'Shown when no posts are published.' },
    ],
  },
  {
    title: 'Footer',
    accent: '#1B3A52',
    fields: [
      { key: 'footer_tagline', label: 'Tagline', hint: 'Optional line above the copyright. Leave blank to hide.' },
      { key: 'footer_copyright', label: 'Copyright Text' },
      { key: 'footer_email', label: 'Email Address' },
      { key: 'footer_website', label: 'Website URL Display Text', hint: 'Display text only — links to https://startupmb.com.' },
    ],
  },
];

const inputBase =
  'w-full rounded-lg px-3 py-2.5 text-sm resize-none border focus:outline-none focus:ring-2 transition-colors';
const inputStyle = {
  borderColor: '#dde8f0',
  color: '#1B3A52',
  backgroundColor: '#fff',
};

interface Props {
  initial: Record<string, string>;
}

export function SiteContentEditor({ initial }: Props) {
  const [values, setValues] = useState<Record<string, string>>(initial);
  const [saving, setSaving] = useState<Record<string, boolean>>({});
  const [saved, setSaved] = useState<Record<string, boolean>>({});
  const [errors, setErrors] = useState<Record<string, string>>({});

  function set(key: string, value: string) {
    setValues(v => ({ ...v, [key]: value }));
    setSaved(s => ({ ...s, [key]: false }));
    setErrors(e => ({ ...e, [key]: '' }));
  }

  async function save(key: string) {
    setSaving(s => ({ ...s, [key]: true }));
    setErrors(e => ({ ...e, [key]: '' }));
    try {
      const res = await fetch('/api/site-content', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ key, value: values[key] ?? '' }),
      });
      if (!res.ok) throw new Error();
      setSaved(s => ({ ...s, [key]: true }));
      setTimeout(() => setSaved(s => ({ ...s, [key]: false })), 2500);
    } catch {
      setErrors(e => ({ ...e, [key]: 'Save failed. Try again.' }));
    } finally {
      setSaving(s => ({ ...s, [key]: false }));
    }
  }

  return (
    <div className="p-6 sm:p-8 max-w-2xl">
      <h1 className="text-xl font-extrabold mb-1" style={{ color: '#1B3A52' }}>
        Site Content
      </h1>
      <p className="text-sm text-gray-500 mb-10">
        Changes save to the database and appear live on the public site immediately.
      </p>

      <div className="space-y-12">
        {SECTIONS.map(({ title, accent, fields }) => (
          <div key={title}>
            <div className="flex items-center gap-3 mb-5">
              <div className="w-1 h-5 rounded-full flex-shrink-0" style={{ backgroundColor: accent }} />
              <h2 className="text-base font-bold tracking-wide" style={{ color: '#1B3A52' }}>
                {title}
              </h2>
            </div>

            <div className="space-y-4 pl-4">
              {fields.map(({ key, label, hint, multiline, rows = 3, placeholder }) => {
                const isSaving = saving[key];
                const isSaved = saved[key];
                const err = errors[key];

                return (
                  <div key={key} className="card p-5">
                    <label className="block text-sm font-semibold mb-0.5" style={{ color: '#1B3A52' }}>
                      {label}
                    </label>
                    {hint && <p className="text-xs text-gray-400 mb-3">{hint}</p>}

                    {multiline ? (
                      <textarea
                        className={inputBase}
                        style={inputStyle}
                        rows={rows}
                        value={values[key] ?? ''}
                        placeholder={placeholder}
                        onChange={e => set(key, e.target.value)}
                      />
                    ) : (
                      <input
                        type="text"
                        className={`${inputBase} !resize-none`}
                        style={inputStyle}
                        value={values[key] ?? ''}
                        placeholder={placeholder}
                        onChange={e => set(key, e.target.value)}
                      />
                    )}

                    <div className="flex items-center gap-3 mt-3">
                      <button
                        onClick={() => save(key)}
                        disabled={!!isSaving}
                        className="px-4 py-1.5 rounded-md text-sm font-medium text-white transition-colors disabled:opacity-60"
                        style={{ backgroundColor: isSaved ? '#3A9E9E' : '#1B3A52' }}
                      >
                        {isSaving ? 'Saving…' : isSaved ? 'Saved!' : 'Save'}
                      </button>
                      {err && <span className="text-xs text-red-500">{err}</span>}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

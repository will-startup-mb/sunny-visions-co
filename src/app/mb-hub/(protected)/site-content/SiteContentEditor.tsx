'use client';

import { useState } from 'react';
import { SITE_CONTENT_DEFAULTS } from '@/lib/db/site-content';

type Key = keyof typeof SITE_CONTENT_DEFAULTS;

interface Field {
  key: Key;
  label: string;
  description?: string;
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
      { key: 'hero_headline', label: 'Hero Headline', description: 'Main h1 on the homepage.' },
      { key: 'hero_subheadline', label: 'Hero Subheadline', description: 'Paragraph below the headline.' },
    ],
  },
  {
    title: 'About',
    accent: '#3A9E9E',
    fields: [
      { key: 'about_intro', label: 'Page Intro', description: 'Opening paragraph on the About page.', multiline: true, rows: 3 },
      { key: 'about_will_bio', label: "Will's Bio", description: 'Second paragraph describing how Startup MB started.', multiline: true, rows: 3 },
    ],
  },
  {
    title: 'Podcast',
    accent: '#F26522',
    fields: [
      { key: 'podcast_show_title', label: 'Show Title', description: 'Page h1 for the Podcast page.' },
      { key: 'podcast_show_description', label: 'Show Description', description: 'Description text. Separate paragraphs with a blank line.', multiline: true, rows: 5 },
      { key: 'podcast_spotify_url', label: 'Spotify URL', description: 'Full URL. Leave blank to show button as disabled.', placeholder: 'https://open.spotify.com/show/...' },
      { key: 'podcast_apple_url', label: 'Apple Podcasts URL', description: 'Full URL. Leave blank to show button as disabled.', placeholder: 'https://podcasts.apple.com/...' },
      { key: 'podcast_youtube_url', label: 'YouTube URL', description: 'Full URL. Leave blank to show button as disabled.', placeholder: 'https://youtube.com/@...' },
    ],
  },
  {
    title: 'Events',
    accent: '#1B3A52',
    fields: [
      { key: 'events_headline', label: 'Page Headline', description: 'h1 at the top of the Events page.' },
      { key: 'events_description', label: 'Page Description', description: 'Intro paragraph below the headline.', multiline: true, rows: 3 },
      { key: 'events_instagram_url', label: 'Instagram URL', description: '"Follow on Instagram" button destination.', placeholder: 'https://www.instagram.com/...' },
    ],
  },
  {
    title: 'Sponsors',
    accent: '#3A9E9E',
    fields: [
      { key: 'sponsors_headline', label: 'Page Headline', description: 'h1 at the top of the Sponsors page.' },
      { key: 'sponsors_intro', label: 'Intro Text', description: 'Opening paragraphs. Separate paragraphs with a blank line.', multiline: true, rows: 4 },
      { key: 'sponsors_community_description', label: 'Community Tier Perks', description: 'One perk per line.', multiline: true, rows: 4 },
      { key: 'sponsors_growth_description', label: 'Growth Tier Perks', description: 'One perk per line.', multiline: true, rows: 5 },
      { key: 'sponsors_premier_description', label: 'Premier Tier Perks', description: 'One perk per line.', multiline: true, rows: 6 },
    ],
  },
  {
    title: 'Footer',
    accent: '#1B3A52',
    fields: [
      { key: 'footer_tagline', label: 'Footer Tagline', description: 'Optional line above the copyright. Leave blank to hide.' },
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

      <div className="space-y-10">
        {SECTIONS.map(({ title, accent, fields }) => (
          <div key={title}>
            {/* Section header */}
            <div className="flex items-center gap-3 mb-5">
              <div className="w-1 h-5 rounded-full" style={{ backgroundColor: accent }} />
              <h2 className="text-base font-bold tracking-wide" style={{ color: '#1B3A52' }}>
                {title}
              </h2>
            </div>

            <div className="space-y-5 pl-4">
              {fields.map(({ key, label, description, multiline, rows = 3, placeholder }) => {
                const isSaving = saving[key];
                const isSaved = saved[key];
                const err = errors[key];

                return (
                  <div key={key} className="card p-5">
                    <label className="block text-sm font-semibold mb-0.5" style={{ color: '#1B3A52' }}>
                      {label}
                    </label>
                    {description && (
                      <p className="text-xs text-gray-400 mb-3">{description}</p>
                    )}

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
                        className={inputBase}
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

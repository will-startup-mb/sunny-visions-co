'use client';

import { useState, type ReactNode } from 'react';
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
    accent: '#E8521A',
    fields: [
      { key: 'hero_headline', label: 'Hero Headline' },
      { key: 'hero_tagline', label: 'Hero Tagline', hint: 'Subline below the headline.' },
      { key: 'hero_cta_label', label: 'Hero CTA Label', hint: 'Button text.' },
      { key: 'hero_cta_href', label: 'Hero CTA Link', placeholder: '/services' },
      { key: 'about_snippet_heading', label: 'About Snippet Heading', hint: 'Heading of the about blurb on the homepage.' },
      { key: 'about_snippet_body', label: 'About Snippet Body', multiline: true, rows: 3 },
      { key: 'about_snippet_cta', label: 'About Snippet CTA Label' },
    ],
  },
  {
    title: 'About',
    accent: '#5B9FA3',
    fields: [
      { key: 'about_page_title', label: 'Page Title', hint: 'h1 at the top of the About page.' },
      { key: 'about_bio', label: 'Bio', multiline: true, rows: 4 },
      { key: 'about_experience_heading', label: 'Experience Section Heading' },
      { key: 'about_experience_body', label: 'Experience Section Body', multiline: true, rows: 3 },
      { key: 'about_instagram_url', label: 'Instagram URL', placeholder: 'https://www.instagram.com/...' },
      { key: 'about_linkedin_url', label: 'LinkedIn URL', placeholder: 'https://www.linkedin.com/in/...' },
    ],
  },
  {
    title: 'Services',
    accent: '#F2BC2B',
    fields: [
      { key: 'services_headline', label: 'Page Headline' },
      { key: 'services_subheadline', label: 'Page Subheadline' },
      { key: 'services_cta_heading', label: 'CTA Heading' },
      { key: 'services_cta_body', label: 'CTA Body', multiline: true, rows: 2 },
      { key: 'services_cta_label', label: 'CTA Button Label' },
    ],
  },
  {
    title: 'Work / Portfolio',
    accent: '#3D2B1F',
    fields: [
      { key: 'work_headline', label: 'Page Headline' },
      { key: 'work_subheadline', label: 'Page Subheadline' },
      { key: 'work_empty_heading', label: 'Empty State Heading', hint: 'Shown before portfolio is populated.' },
      { key: 'work_empty_body', label: 'Empty State Body' },
    ],
  },
  {
    title: 'Contact',
    accent: '#E8521A',
    fields: [
      { key: 'contact_headline', label: 'Page Headline' },
      { key: 'contact_subheadline', label: 'Page Subheadline', multiline: true, rows: 2 },
      { key: 'contact_formspree_id', label: 'Formspree Form ID', hint: 'The ID from your Formspree form URL, e.g. xpwzabcd', placeholder: 'xpwzabcd' },
    ],
  },
  {
    title: 'Footer',
    accent: '#3D2B1F',
    fields: [
      { key: 'footer_tagline', label: 'Tagline', hint: 'Shown above copyright line.' },
      { key: 'footer_copyright', label: 'Copyright Text' },
      { key: 'footer_email', label: 'Email' },
      { key: 'footer_phone', label: 'Phone' },
      { key: 'footer_instagram_url', label: 'Instagram URL', placeholder: 'https://www.instagram.com/...' },
      { key: 'footer_linkedin_url', label: 'LinkedIn URL', placeholder: 'https://www.linkedin.com/in/...' },
    ],
  },
];

interface Props {
  initial: Record<string, string>;
  navOrderEditor?: ReactNode;
}

export function SiteContentEditor({ initial, navOrderEditor }: Props) {
  const [values, setValues] = useState<Record<string, string>>(initial);
  const [saving, setSaving] = useState<Record<string, boolean>>({});
  const [saved, setSaved] = useState<Record<string, boolean>>({});
  const [errors, setErrors] = useState<Record<string, string>>({});

  function set(key: string, value: string) {
    setValues((v) => ({ ...v, [key]: value }));
    setSaved((s) => ({ ...s, [key]: false }));
    setErrors((e) => ({ ...e, [key]: '' }));
  }

  async function save(key: string) {
    setSaving((s) => ({ ...s, [key]: true }));
    setErrors((e) => ({ ...e, [key]: '' }));
    try {
      const res = await fetch('/api/site-content', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ key, value: values[key] ?? '' }),
      });
      if (!res.ok) throw new Error();
      setSaved((s) => ({ ...s, [key]: true }));
      setTimeout(() => setSaved((s) => ({ ...s, [key]: false })), 2500);
    } catch {
      setErrors((e) => ({ ...e, [key]: 'Save failed. Try again.' }));
    } finally {
      setSaving((s) => ({ ...s, [key]: false }));
    }
  }

  return (
    <div className="p-6 sm:p-8 max-w-2xl">
      <h1 className="text-xl font-extrabold mb-1" style={{ color: '#3D2B1F' }}>Site Content</h1>
      <p className="text-sm text-gray-500 mb-10">Changes save to the database and appear live on the public site immediately.</p>

      <div className="space-y-12">
        {navOrderEditor && <div>{navOrderEditor}</div>}

        {SECTIONS.map(({ title, accent, fields }) => (
          <div key={title}>
            <div className="flex items-center gap-3 mb-5">
              <div className="w-1 h-5 rounded-full flex-shrink-0" style={{ backgroundColor: accent }} />
              <h2 className="text-base font-bold tracking-wide" style={{ color: '#3D2B1F' }}>{title}</h2>
            </div>
            <div className="space-y-4 pl-4">
              {fields.map(({ key, label, hint, multiline, rows = 3, placeholder }) => {
                const isSaving = saving[key];
                const isSaved = saved[key];
                const err = errors[key];
                return (
                  <div key={key} className="card p-5">
                    <label className="block text-sm font-semibold mb-0.5" style={{ color: '#3D2B1F' }}>{label}</label>
                    {hint && <p className="text-xs text-gray-400 mb-3">{hint}</p>}
                    {multiline ? (
                      <textarea
                        className="w-full rounded-lg px-3 py-2.5 text-sm resize-none border focus:outline-none focus:ring-2 transition-colors"
                        style={{ borderColor: '#e0d5c4', color: '#3D2B1F', backgroundColor: '#fff' }}
                        rows={rows}
                        value={values[key] ?? ''}
                        placeholder={placeholder}
                        onChange={(e) => set(key, e.target.value)}
                      />
                    ) : (
                      <input
                        type="text"
                        className="w-full rounded-lg px-3 py-2.5 text-sm border focus:outline-none focus:ring-2 transition-colors"
                        style={{ borderColor: '#e0d5c4', color: '#3D2B1F', backgroundColor: '#fff' }}
                        value={values[key] ?? ''}
                        placeholder={placeholder}
                        onChange={(e) => set(key, e.target.value)}
                      />
                    )}
                    <div className="flex items-center gap-3 mt-3">
                      <button
                        onClick={() => save(key)}
                        disabled={!!isSaving}
                        className="px-4 py-1.5 rounded-md text-sm font-medium text-white disabled:opacity-60"
                        style={{ backgroundColor: isSaved ? '#5B9FA3' : '#3D2B1F' }}
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

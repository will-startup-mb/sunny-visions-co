'use client';

import { useState } from 'react';

const FIELDS = [
  {
    key: 'hero_headline',
    label: 'Hero Headline',
    description: 'Main heading displayed at the top of the home page.',
    multiline: false,
  },
  {
    key: 'hero_subheadline',
    label: 'Hero Subheadline',
    description: 'Supporting paragraph shown beneath the headline.',
    multiline: false,
  },
  {
    key: 'about_intro',
    label: 'About Page Intro',
    description: 'Opening paragraph on the About page.',
    multiline: true,
  },
  {
    key: 'footer_tagline',
    label: 'Footer Tagline',
    description: 'Optional tagline shown in the site footer. Leave blank to hide.',
    multiline: false,
  },
] as const;

type FieldKey = typeof FIELDS[number]['key'];

interface Props {
  initial: Record<string, string>;
}

export function SiteContentEditor({ initial }: Props) {
  const [values, setValues] = useState<Record<string, string>>(initial);
  const [saving, setSaving] = useState<Partial<Record<FieldKey, boolean>>>({});
  const [saved, setSaved] = useState<Partial<Record<FieldKey, boolean>>>({});
  const [error, setError] = useState<Partial<Record<FieldKey, string>>>({});

  function set(key: string, value: string) {
    setValues(v => ({ ...v, [key]: value }));
    setSaved(s => ({ ...s, [key]: false }));
    setError(e => ({ ...e, [key]: undefined }));
  }

  async function save(key: FieldKey) {
    setSaving(s => ({ ...s, [key]: true }));
    setError(e => ({ ...e, [key]: undefined }));
    try {
      const res = await fetch('/api/site-content', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ key, value: values[key] ?? '' }),
      });
      if (!res.ok) throw new Error('Save failed');
      setSaved(s => ({ ...s, [key]: true }));
      setTimeout(() => setSaved(s => ({ ...s, [key]: false })), 2500);
    } catch {
      setError(e => ({ ...e, [key]: 'Save failed. Try again.' }));
    } finally {
      setSaving(s => ({ ...s, [key]: false }));
    }
  }

  const inputBase =
    'w-full rounded-lg px-3 py-2.5 text-sm resize-none border focus:outline-none focus:ring-2 transition-colors';
  const inputStyle = {
    borderColor: '#dde8f0',
    color: '#1B3A52',
    backgroundColor: '#fff',
  };

  return (
    <div className="p-6 sm:p-8 max-w-2xl">
      <h1 className="text-xl font-extrabold mb-1" style={{ color: '#1B3A52' }}>
        Site Content
      </h1>
      <p className="text-sm text-gray-500 mb-8">
        Changes save to the database and appear live on the public site immediately.
      </p>

      <div className="space-y-7">
        {FIELDS.map(({ key, label, description, multiline }) => {
          const isSaving = saving[key];
          const isSaved = saved[key];
          const err = error[key];

          return (
            <div key={key} className="card p-5">
              <label className="block text-sm font-semibold mb-0.5" style={{ color: '#1B3A52' }}>
                {label}
              </label>
              <p className="text-xs text-gray-400 mb-3">{description}</p>

              {multiline ? (
                <textarea
                  className={inputBase}
                  style={inputStyle}
                  rows={4}
                  value={values[key] ?? ''}
                  onChange={e => set(key, e.target.value)}
                />
              ) : (
                <input
                  type="text"
                  className={inputBase}
                  style={inputStyle}
                  value={values[key] ?? ''}
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
  );
}

'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import type { Post } from '@/lib/db/schema';

interface Props {
  post?: Post;
}

function toSlug(title: string) {
  return title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');
}

export function PostEditor({ post }: Props) {
  const router = useRouter();
  const isEdit = !!post;

  const [title, setTitle] = useState(post?.title ?? '');
  const [slug, setSlug] = useState(post?.slug ?? '');
  const [excerpt, setExcerpt] = useState(post?.excerpt ?? '');
  const [content, setContent] = useState(post?.content ?? '');
  const [published, setPublished] = useState(post?.published ?? false);
  const [slugManual, setSlugManual] = useState(isEdit);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const handleTitleChange = (v: string) => {
    setTitle(v);
    if (!slugManual) setSlug(toSlug(v));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError('');
    const url = isEdit ? `/api/posts/${post!.id}` : '/api/posts';
    const method = isEdit ? 'PUT' : 'POST';
    const res = await fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title, slug, excerpt: excerpt || null, content, published }),
    });
    if (res.ok) {
      router.push('/mb-hub/blog');
      router.refresh();
    } else {
      const data = await res.json().catch(() => ({}));
      setError(data.error || 'Save failed');
      setSaving(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 rounded p-3 text-sm">{error}</div>
      )}

      <div className="card p-6 space-y-5">
        {/* Title */}
        <div className="flex flex-col gap-1">
          <label className="text-sm font-medium text-gray-700">Title *</label>
          <input
            required
            value={title}
            onChange={(e) => handleTitleChange(e.target.value)}
            placeholder="Post title"
            className="text-lg font-semibold"
            style={{ color: '#1B3A52' }}
          />
        </div>

        {/* Slug */}
        <div className="flex flex-col gap-1">
          <label className="text-sm font-medium text-gray-700">Slug *</label>
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-400">/blog/</span>
            <input
              required
              value={slug}
              onChange={(e) => { setSlugManual(true); setSlug(e.target.value); }}
              placeholder="post-slug"
              className="flex-1 font-mono text-sm"
            />
          </div>
        </div>

        {/* Excerpt */}
        <div className="flex flex-col gap-1">
          <label className="text-sm font-medium text-gray-700">Excerpt <span className="text-gray-400 font-normal">(optional — shown on listing page)</span></label>
          <textarea
            value={excerpt}
            onChange={(e) => setExcerpt(e.target.value)}
            rows={2}
            placeholder="Short summary of the post…"
          />
        </div>

        {/* Published */}
        <div className="flex items-center gap-3">
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={published}
              onChange={(e) => setPublished(e.target.checked)}
              className="sr-only peer"
            />
            <div className="w-10 h-5 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-5 after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-teal-500" style={published ? { backgroundColor: '#3A9E9E' } : {}} />
          </label>
          <span className="text-sm font-medium text-gray-700">{published ? 'Published' : 'Draft'}</span>
        </div>
      </div>

      {/* Content */}
      <div className="card p-6 flex flex-col gap-2">
        <label className="text-sm font-medium text-gray-700">Content *</label>
        <textarea
          required
          value={content}
          onChange={(e) => setContent(e.target.value)}
          rows={24}
          placeholder="Write your post here…"
          className="font-mono text-sm leading-relaxed resize-y"
          style={{ minHeight: '400px' }}
        />
        <p className="text-xs text-gray-400">Plain text. Line breaks are preserved on the public page.</p>
      </div>

      <div className="flex items-center gap-3">
        <button type="submit" disabled={saving} className="btn-primary disabled:opacity-50">
          {saving ? 'Saving…' : isEdit ? 'Save Changes' : 'Create Post'}
        </button>
        <button
          type="button"
          onClick={() => router.push('/mb-hub/blog')}
          className="btn-ghost"
        >
          Cancel
        </button>
      </div>
    </form>
  );
}

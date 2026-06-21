import type { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import { db } from '@/lib/db';
import { posts } from '@/lib/db/schema';
import { eq, desc } from 'drizzle-orm';
import { PublicFooter } from '@/components/PublicFooter';
import { PublicNav } from '@/components/PublicNav';
import { getSiteContent } from '@/lib/db/site-content';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Blog',
  description: 'Thoughts, updates, and stories from the Startup MB ecosystem.',
};

export default async function BlogPage() {
  const [published, c] = await Promise.all([
    db.select().from(posts).where(eq(posts.published, true)).orderBy(desc(posts.created_at)),
    getSiteContent(),
  ]);

  return (
    <div className="min-h-screen flex flex-col" style={{ backgroundColor: '#F8F9FA' }}>
      <header style={{ backgroundColor: '#F8F9FA' }}>
        <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
          <div className="flex items-center justify-between pt-4 pb-4">
            <Link href="/">
              <Image src="/logo.png" alt="Startup MB" height={80} width={80} className="object-contain" />
            </Link>
            <PublicNav />
          </div>
        </div>
      </header>

      <main className="flex-1 max-w-2xl md:max-w-3xl mx-auto w-full px-6 pt-12 pb-24">
        <h1 className="text-4xl font-extrabold mb-2" style={{ color: '#1B3A52' }}>{c.blog_page_title}</h1>
        <div className="w-10 h-1 rounded-full mb-10" style={{ backgroundColor: '#3A9E9E' }} />

        {published.length === 0 ? (
          <p className="text-gray-400 text-base">{c.blog_empty_message}</p>
        ) : (
          <div className="space-y-8">
            {published.map((post) => (
              <article key={post.id} className="card p-6">
                <Link href={`/blog/${post.slug}`} className="group block">
                  <h2 className="text-xl font-bold mb-2 group-hover:underline" style={{ color: '#1B3A52' }}>
                    {post.title}
                  </h2>
                </Link>
                {post.excerpt && (
                  <p className="text-gray-600 leading-relaxed mb-4">{post.excerpt}</p>
                )}
                <div className="flex items-center justify-between">
                  <span className="text-xs text-gray-400">
                    {new Date(post.created_at).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
                  </span>
                  <Link href={`/blog/${post.slug}`} className="text-sm font-medium hover:underline" style={{ color: '#3A9E9E' }}>
                    Read more →
                  </Link>
                </div>
              </article>
            ))}
          </div>
        )}
      </main>

      <PublicFooter />
    </div>
  );
}

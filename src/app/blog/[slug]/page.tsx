import type { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import { db } from '@/lib/db';
import { posts } from '@/lib/db/schema';
import { eq, and } from 'drizzle-orm';
import { PublicFooter } from '@/components/PublicFooter';

export const dynamic = 'force-dynamic';

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const [post] = await db.select().from(posts).where(and(eq(posts.slug, slug), eq(posts.published, true)));
  if (!post) return { title: 'Post Not Found' };
  return {
    title: post.title,
    description: post.excerpt ?? undefined,
  };
}

export default async function BlogPostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const [post] = await db
    .select()
    .from(posts)
    .where(and(eq(posts.slug, slug), eq(posts.published, true)));

  if (!post) notFound();

  return (
    <div className="min-h-screen flex flex-col" style={{ backgroundColor: '#F8F9FA' }}>
      <header style={{ backgroundColor: '#F8F9FA' }}>
        <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
          <div className="flex items-center justify-between pt-4 pb-4">
            <Link href="/">
              <Image src="/logo.png" alt="Startup MB" height={80} width={80} className="object-contain" />
            </Link>
            <nav className="flex items-center gap-3 sm:gap-6">
              <Link href="/about" className="text-sm sm:text-base transition-colors font-medium text-gray-600 hover:text-gray-900">About</Link>
              <Link href="/blog" className="text-sm sm:text-base transition-colors font-medium text-gray-600 hover:text-gray-900">Blog</Link>
            </nav>
          </div>
        </div>
      </header>

      <main className="flex-1 max-w-2xl md:max-w-3xl mx-auto w-full px-6 pt-12 pb-24">
        <Link href="/blog" className="text-sm font-medium mb-8 inline-block hover:underline" style={{ color: '#3A9E9E' }}>
          ← All posts
        </Link>

        <article>
          <h1 className="text-3xl sm:text-4xl font-extrabold mt-4 mb-3 leading-tight" style={{ color: '#1B3A52' }}>
            {post.title}
          </h1>
          <div className="w-10 h-1 rounded-full mb-6" style={{ backgroundColor: '#3A9E9E' }} />

          <p className="text-xs text-gray-400 mb-8">
            {new Date(post.created_at).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
          </p>

          {post.excerpt && (
            <p className="text-lg text-gray-600 leading-relaxed mb-8 border-l-4 pl-4" style={{ borderColor: '#3A9E9E' }}>
              {post.excerpt}
            </p>
          )}

          <div
            className="prose-content text-gray-700 leading-relaxed text-base"
            style={{ whiteSpace: 'pre-wrap' }}
          >
            {post.content}
          </div>
        </article>

        <div className="mt-14 pt-8 border-t border-gray-200">
          <Link href="/blog" className="btn-primary">← Back to blog</Link>
        </div>
      </main>

      <PublicFooter />
    </div>
  );
}

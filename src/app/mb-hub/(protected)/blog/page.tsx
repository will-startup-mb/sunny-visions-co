import Link from 'next/link';
import { db } from '@/lib/db';
import { posts } from '@/lib/db/schema';
import { desc } from 'drizzle-orm';
import { DeletePostButton } from './DeletePostButton';

export const dynamic = 'force-dynamic';

export default async function BlogAdminPage() {
  const allPosts = await db.select().from(posts).orderBy(desc(posts.created_at));

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-xl font-extrabold" style={{ color: '#1B3A52' }}>Blog Posts</h1>
        <Link href="/mb-hub/blog/new" className="btn-primary text-sm">+ New Post</Link>
      </div>

      {allPosts.length === 0 ? (
        <div className="card p-8 text-center text-gray-400 text-sm">
          No posts yet. <Link href="/mb-hub/blog/new" className="underline" style={{ color: '#3A9E9E' }}>Write your first post.</Link>
        </div>
      ) : (
        <div className="space-y-3">
          {allPosts.map((post) => (
            <div key={post.id} className="card p-4 flex items-center justify-between gap-4">
              <div className="min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="font-semibold text-sm" style={{ color: '#1B3A52' }}>{post.title}</span>
                  {post.published ? (
                    <span className="text-xs px-2 py-0.5 rounded-full font-medium" style={{ backgroundColor: '#e0f2f2', color: '#1B3A52' }}>Published</span>
                  ) : (
                    <span className="text-xs px-2 py-0.5 rounded-full font-medium bg-gray-100 text-gray-500">Draft</span>
                  )}
                </div>
                <p className="text-xs text-gray-400 mt-0.5">
                  /{post.slug} · {new Date(post.updated_at).toLocaleDateString()}
                </p>
              </div>
              <div className="flex items-center gap-2 flex-shrink-0">
                {post.published && (
                  <a
                    href={`/blog/${post.slug}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="action-btn"
                  >
                    View
                  </a>
                )}
                <Link href={`/mb-hub/blog/${post.id}`} className="action-btn">Edit</Link>
                <DeletePostButton id={post.id} />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

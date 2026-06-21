import { notFound } from 'next/navigation';
import { db } from '@/lib/db';
import { posts } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';
import { PostEditor } from '../PostEditor';

export const dynamic = 'force-dynamic';

export default async function EditPostPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const [post] = await db.select().from(posts).where(eq(posts.id, id));
  if (!post) notFound();

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <h1 className="text-xl font-extrabold mb-1" style={{ color: '#1B3A52' }}>Edit Post</h1>
      <p className="text-sm text-gray-400 mb-6">/blog/{post.slug}</p>
      <PostEditor post={post} />
    </div>
  );
}

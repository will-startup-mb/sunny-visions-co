'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export function DeletePostButton({ id }: { id: string }) {
  const router = useRouter();
  const [deleting, setDeleting] = useState(false);

  const handleDelete = async () => {
    if (!confirm('Delete this post? This cannot be undone.')) return;
    setDeleting(true);
    await fetch(`/api/posts/${id}`, { method: 'DELETE' });
    router.refresh();
  };

  return (
    <button
      onClick={handleDelete}
      disabled={deleting}
      className="action-btn action-btn-danger disabled:opacity-50"
    >
      {deleting ? 'Deleting…' : 'Delete'}
    </button>
  );
}

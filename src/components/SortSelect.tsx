'use client';

import { useRouter } from 'next/navigation';

interface Props {
  currentSort: string;
  otherParams: Record<string, string | undefined>;
}

export function SortSelect({ currentSort, otherParams }: Props) {
  const router = useRouter();

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const params = new URLSearchParams();
    Object.entries(otherParams).forEach(([k, v]) => { if (v) params.set(k, v); });
    if (e.target.value !== 'az') params.set('sort', e.target.value);
    router.push(`/?${params.toString()}`);
  };

  return (
    <select value={currentSort} onChange={handleChange} className="py-2 text-sm" style={{ width: 'auto' }}>
      <option value="az">A–Z</option>
      <option value="za">Z–A</option>
      <option value="newest">Recently Added</option>
    </select>
  );
}

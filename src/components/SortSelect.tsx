'use client';

import { useRouter } from 'next/navigation';

interface Props {
  currentSort: string;
  otherParams: Record<string, string | undefined>;
  dark?: boolean;
}

export function SortSelect({ currentSort, otherParams, dark }: Props) {
  const router = useRouter();

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const params = new URLSearchParams();
    Object.entries(otherParams).forEach(([k, v]) => { if (v) params.set(k, v); });
    if (e.target.value !== 'az') params.set('sort', e.target.value);
    router.push(`/?${params.toString()}`);
  };

  const darkStyle = dark
    ? { width: 'auto', backgroundColor: 'rgba(255,255,255,0.1)', color: 'white', border: '1px solid rgba(255,255,255,0.25)', borderRadius: '0.375rem' }
    : { width: 'auto' };

  return (
    <select value={currentSort} onChange={handleChange} className="py-2 text-sm" style={darkStyle}>
      <option value="az" style={dark ? { backgroundColor: '#1B3A52' } : {}}>A–Z</option>
      <option value="za" style={dark ? { backgroundColor: '#1B3A52' } : {}}>Z–A</option>
      <option value="newest" style={dark ? { backgroundColor: '#1B3A52' } : {}}>Recently Added</option>
    </select>
  );
}

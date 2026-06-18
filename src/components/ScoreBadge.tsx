'use client';

export function ScoreBadge({ label, value }: { label: string; value: number | null }) {
  if (value === null || value === undefined) return null;

  const color =
    value >= 8
      ? 'bg-emerald-100 text-emerald-700'
      : value >= 5
      ? 'bg-amber-100 text-amber-700'
      : 'bg-red-100 text-red-700';

  return (
    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-bold ${color}`}>
      {label} {value}
    </span>
  );
}

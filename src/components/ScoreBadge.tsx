'use client';

export function ScoreBadge({ label, value }: { label: string; value: number | null }) {
  if (value === null || value === undefined) return null;

  const bg = label === 'I' ? '#3A9E9E' : '#F26522';

  return (
    <span
      className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-bold text-white"
      style={{ backgroundColor: bg }}
    >
      {label} {value}
    </span>
  );
}

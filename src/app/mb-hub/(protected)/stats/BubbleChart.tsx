'use client';
import { useMemo, useState, useRef, useCallback, useEffect } from 'react';

export interface BubbleItem {
  label: string;
  count: number;
  companies: string[];
}

interface Props {
  items: BubbleItem[];
  color: string;
}

interface TooltipState {
  left: number;
  top: number;
  width: number;
  item: BubbleItem;
}

const TOOLTIP_MAX_H = 320;

function calcPos(clientY: number, container?: DOMRect): { left: number; top: number; width: number } {
  const vw = window.innerWidth;
  const vh = window.innerHeight;
  const W = Math.min(256, Math.floor(vw * 0.85));
  // Center within the chart's own container so each chart's tooltip stays over it.
  const cLeft = container?.left ?? 0;
  const cWidth = container?.width ?? vw;
  let left = Math.round(cLeft + (cWidth - W) / 2);
  left = Math.max(8, Math.min(left, vw - W - 8));
  let top = clientY + 20;
  if (top + TOOLTIP_MAX_H > vh - 8) top = clientY - TOOLTIP_MAX_H - 20;
  top = Math.max(8, top);
  return { left, top, width: W };
}

function packCircles(radii: number[]): { x: number; y: number }[] {
  const placed: { x: number; y: number; r: number }[] = [];
  const positions: { x: number; y: number }[] = [];

  for (let i = 0; i < radii.length; i++) {
    const r = radii[i];

    if (placed.length === 0) {
      placed.push({ x: 0, y: 0, r });
      positions.push({ x: 0, y: 0 });
      continue;
    }

    let best: { x: number; y: number } | null = null;
    let bestScore = Infinity;
    const STEPS = 72;

    for (const ref of placed) {
      for (let step = 0; step < STEPS; step++) {
        const angle = (step / STEPS) * Math.PI * 2;
        const d = ref.r + r + 2;
        const x = ref.x + d * Math.cos(angle);
        const y = ref.y + d * Math.sin(angle);

        let valid = true;
        for (const p of placed) {
          const dx = x - p.x;
          const dy = y - p.y;
          if (dx * dx + dy * dy < (p.r + r + 1.5) ** 2) {
            valid = false;
            break;
          }
        }

        if (valid) {
          const score = x * x + y * y;
          if (score < bestScore) {
            bestScore = score;
            best = { x, y };
          }
        }
      }
    }

    const pos = best ?? { x: 0, y: 0 };
    placed.push({ ...pos, r });
    positions.push(pos);
  }

  return positions;
}

export function BubbleChart({ items, color }: Props) {
  const [tooltip, setTooltip] = useState<TooltipState | null>(null);
  const hideTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const openedAt = useRef(0);
  const tooltipRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const showTooltip = useCallback((clientY: number, item: BubbleItem) => {
    if (hideTimer.current) clearTimeout(hideTimer.current);
    openedAt.current = Date.now();
    const rect = containerRef.current?.getBoundingClientRect();
    setTooltip({ ...calcPos(clientY, rect), item });
  }, []);

  const scheduleHide = useCallback(() => {
    hideTimer.current = setTimeout(() => setTooltip(null), 120);
  }, []);

  const cancelHide = useCallback(() => {
    if (hideTimer.current) clearTimeout(hideTimer.current);
  }, []);

  // Mobile tap-outside dismiss via native listener — no backdrop so desktop
  // hover isn't broken by a full-screen div stealing mouseleave events.
  useEffect(() => {
    if (!tooltip) return;
    const handle = (e: TouchEvent) => {
      if (tooltipRef.current?.contains(e.target as Node)) return;
      if (Date.now() - openedAt.current > 300) setTooltip(null);
    };
    document.addEventListener('touchstart', handle, { passive: true });
    return () => document.removeEventListener('touchstart', handle);
  }, [tooltip]);

  const data = useMemo(() => {
    if (!items.length) return null;

    const sorted = [...items].sort((a, b) => b.count - a.count);
    const maxCount = sorted[0].count;
    const MIN_R = 26;
    const MAX_R = 64;

    const radii = sorted.map(({ count }) =>
      MIN_R + Math.sqrt(count / maxCount) * (MAX_R - MIN_R)
    );

    const positions = packCircles(radii);

    let x1 = Infinity, y1 = Infinity, x2 = -Infinity, y2 = -Infinity;
    for (let i = 0; i < positions.length; i++) {
      x1 = Math.min(x1, positions[i].x - radii[i]);
      y1 = Math.min(y1, positions[i].y - radii[i]);
      x2 = Math.max(x2, positions[i].x + radii[i]);
      y2 = Math.max(y2, positions[i].y + radii[i]);
    }

    const PAD = 8;
    const vb = `${x1 - PAD} ${y1 - PAD} ${x2 - x1 + PAD * 2} ${y2 - y1 + PAD * 2}`;

    const circles = sorted.map((item, i) => ({
      x: positions[i].x,
      y: positions[i].y,
      r: radii[i],
      label: item.label,
      count: item.count,
      companies: item.companies,
      opacity: 0.62 + 0.38 * ((sorted.length - i) / sorted.length),
    }));

    return { circles, viewBox: vb };
  }, [items]);

  if (!data) return <p className="text-sm text-gray-400">No data</p>;

  return (
    <>
      <div ref={containerRef}>
      <svg
        viewBox={data.viewBox}
        style={{ width: '100%', height: 300, display: 'block' }}
        aria-hidden="true"
      >
        {data.circles.map((c, i) => {
          const truncated = c.label.length > 15 ? c.label.slice(0, 14) + '…' : c.label;
          const labelSz = c.r > 46 ? 11 : c.r > 36 ? 10 : 9;
          const countSz = c.r > 46 ? 15 : c.r > 36 ? 13 : 11;
          const bubbleItem = { label: c.label, count: c.count, companies: c.companies };

          return (
            <g
              key={c.label + i}
              style={{ cursor: 'pointer' }}
              onMouseEnter={(e) => showTooltip(e.clientY, bubbleItem)}
              onMouseLeave={scheduleHide}
              onTouchStart={(e) => {
                showTooltip(e.changedTouches[0].clientY, bubbleItem);
              }}
            >
              <circle
                cx={c.x}
                cy={c.y}
                r={c.r}
                fill={color}
                opacity={c.opacity}
                stroke="rgba(255,255,255,0.25)"
                strokeWidth="1.5"
              />
              <text
                x={c.x}
                y={c.y - labelSz * 0.75}
                textAnchor="middle"
                dominantBaseline="middle"
                fill="white"
                fontSize={labelSz}
                fontWeight="600"
                style={{ pointerEvents: 'none' }}
              >
                {truncated}
              </text>
              <text
                x={c.x}
                y={c.y + countSz * 0.85}
                textAnchor="middle"
                dominantBaseline="middle"
                fill="white"
                fontSize={countSz}
                fontWeight="800"
                opacity="0.95"
                style={{ pointerEvents: 'none' }}
              >
                {c.count}
              </text>
            </g>
          );
        })}
      </svg>
      </div>

      {tooltip && (
        <div
            ref={tooltipRef}
            onMouseEnter={cancelHide}
            onMouseLeave={scheduleHide}
            style={{
              position: 'fixed',
              left: tooltip.left,
              top: tooltip.top,
              width: tooltip.width,
              zIndex: 9999,
              borderTop: `3px solid ${color}`,
            }}
            className="bg-white rounded-b-xl rounded-tr-xl shadow-2xl border border-gray-100 overflow-hidden"
          >
            <div className="px-3 pt-3 pb-2">
              <div className="font-bold text-sm leading-tight" style={{ color: '#1B3A52' }}>
                {tooltip.item.label}
              </div>
              <div className="text-xs mt-0.5 font-medium" style={{ color }}>
                {tooltip.item.count} {tooltip.item.count === 1 ? 'company' : 'companies'}
              </div>
            </div>
            <div className="border-t border-gray-100" />
            <div className="overflow-y-auto px-3 py-2" style={{ maxHeight: 220 }}>
              {[...tooltip.item.companies].sort().map((name, idx) => (
                <div
                  key={idx}
                  className="text-xs text-gray-600 py-1.5 border-b border-gray-50 last:border-0 leading-tight"
                >
                  {name}
                </div>
              ))}
            </div>
        </div>
      )}
    </>
  );
}

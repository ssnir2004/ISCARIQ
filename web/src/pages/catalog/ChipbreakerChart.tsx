import type { ChipbreakerRange } from "../../lib/types";

// Feed range chart of an application's chipbreakers (like ISCAR's "Feed
// Range on Main Parting Chip Formers"): a bar per chipbreaker from its
// lowest to highest feed, stacked as a staircase from the lowest range
// (bottom) up, with dashed lines from the bar ends to the feed axis.

export const CHIPBREAKER_COLORS = ["#1b6a8c", "#f5c400", "#a3a3a3", "#5b9fe0", "#f0843c", "#7cb342", "#9c5bb8", "#e05a7a"];

export const rangeColor = (r: Pick<ChipbreakerRange, "color">, index: number) => r.color ?? CHIPBREAKER_COLORS[index % CHIPBREAKER_COLORS.length];

// A color for a new chipbreaker: the first one not already on the chart.
export function nextColor(sorted: ChipbreakerRange[]) {
  const used = sorted.map((r, i) => rangeColor(r, i).toLowerCase());
  return CHIPBREAKER_COLORS.find((c) => !used.includes(c.toLowerCase())) ?? CHIPBREAKER_COLORS[sorted.length % CHIPBREAKER_COLORS.length];
}

// Dark text on light bars (e.g. yellow), white on dark ones.
function textOn(hex: string) {
  const n = parseInt(hex.slice(1), 16);
  const [r, g, b] = [(n >> 16) & 255, (n >> 8) & 255, n & 255];
  return 0.299 * r + 0.587 * g + 0.114 * b > 160 ? "#1f2937" : "#ffffff";
}

export const formatFeed = (v: number) => String(Number(v.toFixed(3)));

// Ranges in chart order: lowest feed first (bottom row), then the narrower.
export function sortRanges(ranges: ChipbreakerRange[]) {
  return [...ranges].sort((a, b) => a.feedMin - b.feedMin || a.feedMax - b.feedMax || a.chipbreaker.name.localeCompare(b.chipbreaker.name));
}

const W = 900;
const LEFT = 40;
const RIGHT = 130;
const TOP = 16;
const BAR = 46;
// Rows overlap by BAR - STEP; each name sits in the part of its bar that the
// row below doesn't cover.
const STEP = 40;

export function ChipbreakerChart({ ranges }: { ranges: ChipbreakerRange[] }) {
  const rows = sortRanges(ranges);
  if (rows.length === 0) return null;
  const xMax = Math.max(...rows.map((r) => r.feedMax)) * 1.08;
  const x = (v: number) => LEFT + (v / xMax) * (W - LEFT - RIGHT);
  const axisY = TOP + (rows.length - 1) * STEP + BAR + 14;
  const height = axisY + 52;
  const top = (i: number) => axisY - 10 - BAR - i * STEP;

  // A tick at every range end; a label too close to the previous one drops
  // to a second line.
  const ticks = [...new Set(rows.flatMap((r) => [r.feedMin, r.feedMax]))].sort((a, b) => a - b);
  let lastX = -Infinity;
  let lastLow = false;
  const tickLabels = ticks.map((v) => {
    const px = x(v);
    const low = px - lastX < 34 && !lastLow;
    lastLow = low;
    lastX = px;
    return { v, px, low };
  });

  return (
    <svg viewBox={`0 0 ${W} ${height}`} className="w-full max-w-4xl text-neutral-700 dark:text-neutral-300" role="img" aria-label="Feed range chart" data-chipbreaker-chart>
      <defs>
        <filter id="cb-shadow" x="-5%" y="-10%" width="110%" height="130%">
          <feDropShadow dx="2" dy="3" stdDeviation="2" floodOpacity="0.35" />
        </filter>
        <marker id="cb-arrow" markerWidth="10" markerHeight="10" refX="8" refY="5" orient="auto">
          <path d="M0,0 L10,5 L0,10 z" fill="#3b82f6" />
        </marker>
      </defs>
      {/* Dashed lines from each bar's ends down to the axis. */}
      {rows.map((r, i) =>
        [r.feedMin, r.feedMax].map((v) => (
          <line key={`${r.id}-${v}`} x1={x(v)} x2={x(v)} y1={top(i) + BAR} y2={axisY} stroke="currentColor" strokeOpacity="0.55" strokeDasharray="4 4" />
        ))
      )}
      {/* Top rows first, so each lower bar overlaps the one above it. */}
      {rows
        .map((r, i) => ({ r, i }))
        .reverse()
        .map(({ r, i }) => {
          const fill = rangeColor(r, i);
          const w = x(r.feedMax) - x(r.feedMin);
          const name = r.chipbreaker.name;
          const size = Math.max(11, Math.min(26, (w - 8) / Math.max(1, name.length * 0.62)));
          return (
            <g key={r.id} data-chart-bar={name}>
              <rect x={x(r.feedMin)} y={top(i)} width={w} height={BAR} fill={fill} stroke="#00000055" filter="url(#cb-shadow)">
                <title>{`${name}: ${formatFeed(r.feedMin)}–${formatFeed(r.feedMax)} mm/rev`}</title>
              </rect>
              <text x={x(r.feedMin) + w / 2} y={top(i) + STEP / 2 + 1} textAnchor="middle" dominantBaseline="central" fontSize={size} fontWeight="800" fill={textOn(fill)}>
                {name}
              </text>
            </g>
          );
        })}
      {/* Feed axis. */}
      <line x1={LEFT - 10} x2={W - RIGHT + 40} y1={axisY} y2={axisY} stroke="#3b82f6" strokeWidth="2" markerEnd="url(#cb-arrow)" />
      {tickLabels.map(({ v, px, low }) => (
        <text key={v} x={px} y={axisY + (low ? 38 : 22)} textAnchor="middle" fontSize="15" fill="currentColor">
          {formatFeed(v)}
        </text>
      ))}
      <text x={W - RIGHT + 50} y={axisY - 4} fontSize="15" fill="currentColor">
        Feed
      </text>
      <text x={W - RIGHT + 50} y={axisY + 16} fontSize="15" fill="currentColor">
        (mm/rev)
      </text>
    </svg>
  );
}

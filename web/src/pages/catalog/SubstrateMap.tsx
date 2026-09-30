import type { Substrate } from "../../lib/types";

// Scatter map of substrates: fracture toughness (KIC) on x, hardness on y.
// Each substrate is a small marker at its exact value, with a callout box
// (substrate name + the grades built on it) placed next to it and joined by a
// leader line. Callouts are positioned to avoid each other, the markers and
// the plot edges, so nearby substrates stay readable.

const W = 900;
const H = 600;
const M = { top: 24, right: 24, bottom: 70, left: 92 };
const PLOT_W = W - M.left - M.right;
const PLOT_H = H - M.top - M.bottom;

// Callout text metrics (SVG units), approximating the rendered fonts.
const GRADE_FONT = 16;
const GRADE_LINE = 19;
const HEADER_FONT = 13;
const HEADER_LINE = 17;
const CHAR_W = 9.8; // ~bold 16px
const HEADER_CHAR_W = 8;
const PAD = 7;
const MARKER_R = 5;

// Evenly spaced "nice" ticks (steps of 1, 2, 2.5 or 5 x 10^n) covering [min, max].
function niceTicks(min: number, max: number, target = 5): number[] {
  if (min === max) {
    const pad = Math.abs(min) * 0.05 || 1;
    min -= pad;
    max += pad;
  }
  const raw = (max - min) / target;
  const pow = 10 ** Math.floor(Math.log10(raw));
  const step = [1, 2, 2.5, 5, 10].map((m) => m * pow).find((s) => s >= raw) ?? 10 * pow;
  const start = Math.floor(min / step) * step;
  const end = Math.ceil(max / step) * step;
  const ticks: number[] = [];
  for (let v = start; v <= end + step / 2; v += step) ticks.push(Math.round(v * 1e6) / 1e6);
  return ticks;
}

// Ticks for a set of values, with ~12% headroom on both sides.
function paddedTicks(values: number[]): number[] {
  const min = Math.min(...values);
  const max = Math.max(...values);
  const pad = (max - min) * 0.12 || Math.abs(min) * 0.05 || 1;
  return niceTicks(min - pad, max + pad);
}

type Rect = { x: number; y: number; w: number; h: number };

const overlapArea = (a: Rect, b: Rect) =>
  Math.max(0, Math.min(a.x + a.w, b.x + b.w) - Math.max(a.x, b.x)) * Math.max(0, Math.min(a.y + a.h, b.y + b.h) - Math.max(a.y, b.y));

// Area of `r` that falls outside the plot area.
function outsideArea(r: Rect) {
  const inside = overlapArea(r, { x: M.left, y: M.top, w: PLOT_W, h: PLOT_H });
  return r.w * r.h - inside;
}

// Candidate callout positions around a point (px, py), nearest first:
// the four diagonals, then sides, then top/bottom, at growing distances.
function candidates(px: number, py: number, w: number, h: number): Rect[] {
  const out: Rect[] = [];
  for (const gap of [12, 28, 48, 72]) {
    out.push(
      { x: px + gap, y: py - gap - h, w, h }, // up-right
      { x: px + gap, y: py + gap, w, h }, // down-right
      { x: px - gap - w, y: py - gap - h, w, h }, // up-left
      { x: px - gap - w, y: py + gap, w, h }, // down-left
      { x: px + gap, y: py - h / 2, w, h }, // right
      { x: px - gap - w, y: py - h / 2, w, h }, // left
      { x: px - w / 2, y: py - gap - h, w, h }, // up
      { x: px - w / 2, y: py + gap, w, h } // down
    );
  }
  return out;
}

// Point on the rectangle's border closest to (px, py), for the leader line.
function nearestOnRect(r: Rect, px: number, py: number) {
  return { x: Math.min(Math.max(px, r.x), r.x + r.w), y: Math.min(Math.max(py, r.y), r.y + r.h) };
}

export function SubstrateMap({ substrates }: { substrates: Substrate[] }) {
  const placed = substrates.filter((s) => s.hardness != null && s.toughness != null);
  const unplaced = substrates.filter((s) => s.hardness == null || s.toughness == null);

  const xTicks = placed.length ? paddedTicks(placed.map((s) => s.toughness!)) : [];
  const yTicks = placed.length ? paddedTicks(placed.map((s) => s.hardness!)) : [];
  const [x0, x1] = [xTicks[0], xTicks[xTicks.length - 1]];
  const [y0, y1] = [yTicks[0], yTicks[yTicks.length - 1]];
  const sx = (v: number) => M.left + ((v - x0) / (x1 - x0)) * PLOT_W;
  const sy = (v: number) => M.top + PLOT_H - ((v - y0) / (y1 - y0)) * PLOT_H;

  // Lay out callouts greedily, picking for each point the first candidate
  // that collides with nothing placed so far (or, failing that, the least bad).
  const markers: Rect[] = placed.map((s) => ({ x: sx(s.toughness!) - 9, y: sy(s.hardness!) - 9, w: 18, h: 18 }));
  const taken: Rect[] = [];
  const points = placed
    .map((s) => {
      const grades = (s.grades ?? []).map((g) => g.name);
      const lines = grades.length ? grades : ["(no grades)"];
      const w = Math.max(s.name.length * HEADER_CHAR_W, ...lines.map((l) => l.length * CHAR_W)) + PAD * 2;
      const h = HEADER_LINE + lines.length * GRADE_LINE + PAD * 2 - 2;
      return { s, lines, hasGrades: grades.length > 0, px: sx(s.toughness!), py: sy(s.hardness!), w, h };
    })
    // Place the most crowded (largest) callouts first.
    .sort((a, b) => b.lines.length - a.lines.length)
    .map((p) => {
      let best: Rect | null = null;
      let bestCost = Infinity;
      for (const c of candidates(p.px, p.py, p.w, p.h)) {
        const cost =
          outsideArea(c) * 10 + taken.reduce((sum, t) => sum + overlapArea(c, t), 0) * 5 + markers.reduce((sum, m) => sum + overlapArea(c, m), 0) * 5;
        if (cost < bestCost) {
          best = c;
          bestCost = cost;
          if (cost === 0) break;
        }
      }
      taken.push(best!);
      return { ...p, box: best! };
    });

  return (
    <div className="max-w-5xl space-y-3">
      {points.length === 0 ? (
        <p className="rounded-lg border border-dashed border-neutral-300 p-6 text-center text-sm text-neutral-500 dark:border-neutral-700 dark:text-neutral-400">
          No substrates with both hardness and fracture toughness yet.
        </p>
      ) : (
        <svg
          viewBox={`0 0 ${W} ${H}`}
          className="w-full rounded-lg border border-neutral-200 bg-white dark:border-neutral-800 dark:bg-neutral-900"
          role="img"
          aria-label="Substrate map"
        >
          {/* Grid and tick labels */}
          {xTicks.map((t) => (
            <g key={`x${t}`}>
              <line x1={sx(t)} x2={sx(t)} y1={M.top} y2={M.top + PLOT_H} className="stroke-neutral-200 dark:stroke-neutral-800" />
              <text x={sx(t)} y={M.top + PLOT_H + 24} textAnchor="middle" className="fill-neutral-600 text-[16px] dark:fill-neutral-400">
                {t}
              </text>
            </g>
          ))}
          {yTicks.map((t) => (
            <g key={`y${t}`}>
              <line x1={M.left} x2={M.left + PLOT_W} y1={sy(t)} y2={sy(t)} className="stroke-neutral-200 dark:stroke-neutral-800" />
              <text x={M.left - 10} y={sy(t) + 5} textAnchor="end" className="fill-neutral-600 text-[16px] dark:fill-neutral-400">
                {t}
              </text>
            </g>
          ))}
          <rect x={M.left} y={M.top} width={PLOT_W} height={PLOT_H} fill="none" className="stroke-neutral-400 dark:stroke-neutral-600" />

          {/* Axis titles */}
          <text x={M.left + PLOT_W / 2} y={H - 14} textAnchor="middle" className="fill-neutral-800 text-[18px] font-semibold dark:fill-neutral-200">
            Fracture toughness (KIC)
          </text>
          <text
            transform={`translate(24 ${M.top + PLOT_H / 2}) rotate(-90)`}
            textAnchor="middle"
            className="fill-neutral-800 text-[18px] font-semibold dark:fill-neutral-200"
          >
            Substrate hardness
          </text>

          {/* Leader lines first, so markers and callouts draw on top */}
          {points.map(({ s, px, py, box }) => {
            const end = nearestOnRect(box, px, py);
            return <line key={`l${s.id}`} x1={px} y1={py} x2={end.x} y2={end.y} className="stroke-neutral-400 dark:stroke-neutral-500" strokeWidth={1.5} />;
          })}

          {points.map(({ s, lines, hasGrades, px, py, box }) => (
            <g key={s.id} data-substrate-point={s.name}>
              <title>{`${s.name} — hardness ${s.hardness}, KIC ${s.toughness}`}</title>
              <circle cx={px} cy={py} r={MARKER_R} className="fill-blue-600 stroke-white dark:fill-blue-400 dark:stroke-neutral-900" strokeWidth={1.5} />
              <rect
                x={box.x}
                y={box.y}
                width={box.w}
                height={box.h}
                rx={6}
                className="fill-white stroke-neutral-300 dark:fill-neutral-800 dark:stroke-neutral-600"
                data-callout
              />
              <text x={box.x + PAD} y={box.y + PAD + HEADER_FONT - 1} className="fill-blue-700 font-semibold dark:fill-blue-300"
                style={{ fontSize: HEADER_FONT }}>
                {s.name}
              </text>
              {lines.map((line, i) => (
                <text
                  key={line}
                  x={box.x + PAD}
                  y={box.y + PAD + HEADER_LINE + (i + 1) * GRADE_LINE - 4}
                  className={`font-bold ${hasGrades ? "fill-neutral-900 dark:fill-neutral-100" : "fill-neutral-400 italic dark:fill-neutral-500"}`}
                  style={{ fontSize: GRADE_FONT }}
                >
                  {line}
                </text>
              ))}
            </g>
          ))}
        </svg>
      )}

      {unplaced.length > 0 && (
        <p className="text-xs text-neutral-500 dark:text-neutral-400">
          Not on the map (set hardness and fracture toughness): {unplaced.map((s) => s.name).join(", ")}
        </p>
      )}
    </div>
  );
}

import { useState } from "react";
import { ISO513_GROUPS } from "../../lib/npaKnowledgeConstants";
import type { Application, Iso513Group, Substrate } from "../../lib/types";

// Scatter map of substrates: fracture toughness (KIC) on x, hardness on y.
// Each substrate is labelled with the grades built on it (optionally
// filtered to one application and ISO 513 group); no point markers.

const ALL = "all";
const W = 800;
const H = 520;
const M = { top: 24, right: 24, bottom: 64, left: 84 };
const PLOT_W = W - M.left - M.right;
const PLOT_H = H - M.top - M.bottom;

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

// Ticks for a set of values, with ~12% headroom on both sides so labels
// centred on the outermost points stay inside the plot.
function paddedTicks(values: number[]): number[] {
  const min = Math.min(...values);
  const max = Math.max(...values);
  const pad = (max - min) * 0.12 || Math.abs(min) * 0.05 || 1;
  return niceTicks(min - pad, max + pad);
}

function Chip({ active, onClick, children, color }: { active: boolean; onClick: () => void; children: React.ReactNode; color?: string }) {
  return (
    <button
      type="button"
      aria-pressed={active}
      onClick={onClick}
      className={`rounded-full border-2 px-2.5 py-1 text-xs ${
        active
          ? color
            ? "font-medium text-neutral-900"
            : "border-blue-600 bg-blue-600 font-medium text-white"
          : "border-neutral-300 text-neutral-600 dark:border-neutral-700 dark:text-neutral-300"
      }`}
      style={color ? (active ? { backgroundColor: color, borderColor: color } : { borderColor: color }) : undefined}
    >
      {children}
    </button>
  );
}

export function SubstrateMap({ substrates, applications }: { substrates: Substrate[]; applications: Application[] }) {
  const [appId, setAppId] = useState<string>(ALL);
  const [group, setGroup] = useState<Iso513Group | typeof ALL>(ALL);

  const matches = (g: NonNullable<Substrate["grades"]>[number]) =>
    (appId === ALL || g.applications.some((a) => a.id === appId)) && (group === ALL || g.iso513Groups.includes(group));
  const filtered = appId !== ALL || group !== ALL;

  const points = substrates
    .filter((s) => s.hardness != null && s.toughness != null)
    .map((s) => ({ substrate: s, grades: (s.grades ?? []).filter(matches) }))
    // With a filter on, only substrates that have matching grades are shown.
    .filter((p) => !filtered || p.grades.length > 0);
  const unplaced = substrates.filter((s) => s.hardness == null || s.toughness == null);

  const xTicks = points.length ? paddedTicks(points.map((p) => p.substrate.toughness!)) : [];
  const yTicks = points.length ? paddedTicks(points.map((p) => p.substrate.hardness!)) : [];
  const [x0, x1] = [xTicks[0], xTicks[xTicks.length - 1]];
  const [y0, y1] = [yTicks[0], yTicks[yTicks.length - 1]];
  const sx = (v: number) => M.left + ((v - x0) / (x1 - x0)) * PLOT_W;
  const sy = (v: number) => M.top + PLOT_H - ((v - y0) / (y1 - y0)) * PLOT_H;

  const appName = appId === ALL ? "" : (applications.find((a) => a.id === appId)?.name ?? "");
  const title = [appName, group === ALL ? "" : `ISO ${group}`].filter(Boolean).join(" ") || "All grades";

  return (
    <div className="max-w-4xl space-y-3">
      <div className="flex flex-wrap items-center gap-2">
        <span className="text-xs font-medium text-neutral-500 dark:text-neutral-400">Application</span>
        <Chip active={appId === ALL} onClick={() => setAppId(ALL)}>
          All
        </Chip>
        {[...applications]
          .sort((a, b) => a.name.localeCompare(b.name))
          .map((a) => (
            <Chip key={a.id} active={appId === a.id} onClick={() => setAppId(a.id)}>
              {a.name}
            </Chip>
          ))}
      </div>
      <div className="flex flex-wrap items-center gap-2">
        <span className="text-xs font-medium text-neutral-500 dark:text-neutral-400">Material</span>
        <Chip active={group === ALL} onClick={() => setGroup(ALL)}>
          All
        </Chip>
        {ISO513_GROUPS.map((g) => (
          <Chip key={g.value} active={group === g.value} onClick={() => setGroup(g.value)} color={g.color}>
            {g.label}
          </Chip>
        ))}
      </div>

      <h3 className="text-base font-semibold text-neutral-900 dark:text-neutral-100">{title}</h3>

      {points.length === 0 ? (
        <p className="rounded-lg border border-dashed border-neutral-300 p-6 text-center text-sm text-neutral-500 dark:border-neutral-700 dark:text-neutral-400">
          {filtered ? "No substrates with matching grades." : "No substrates with both hardness and fracture toughness yet."}
        </p>
      ) : (
        <svg viewBox={`0 0 ${W} ${H}`} className="w-full rounded-lg border border-neutral-200 bg-white dark:border-neutral-800 dark:bg-neutral-900" role="img" aria-label={`Substrate map: ${title}`}>
          {/* Grid and tick labels */}
          {xTicks.map((t) => (
            <g key={`x${t}`}>
              <line x1={sx(t)} x2={sx(t)} y1={M.top} y2={M.top + PLOT_H} className="stroke-neutral-200 dark:stroke-neutral-800" />
              <text x={sx(t)} y={M.top + PLOT_H + 20} textAnchor="middle" className="fill-neutral-600 text-[13px] dark:fill-neutral-400">
                {t}
              </text>
            </g>
          ))}
          {yTicks.map((t) => (
            <g key={`y${t}`}>
              <line x1={M.left} x2={M.left + PLOT_W} y1={sy(t)} y2={sy(t)} className="stroke-neutral-200 dark:stroke-neutral-800" />
              <text x={M.left - 10} y={sy(t) + 4} textAnchor="end" className="fill-neutral-600 text-[13px] dark:fill-neutral-400">
                {t}
              </text>
            </g>
          ))}
          <rect x={M.left} y={M.top} width={PLOT_W} height={PLOT_H} fill="none" className="stroke-neutral-400 dark:stroke-neutral-600" />

          {/* Axis titles */}
          <text x={M.left + PLOT_W / 2} y={H - 16} textAnchor="middle" className="fill-neutral-800 text-[15px] font-semibold dark:fill-neutral-200">
            Fracture toughness (KIC)
          </text>
          <text
            transform={`translate(22 ${M.top + PLOT_H / 2}) rotate(-90)`}
            textAnchor="middle"
            className="fill-neutral-800 text-[15px] font-semibold dark:fill-neutral-200"
          >
            Substrate hardness
          </text>

          {/* One label per substrate, centred on its (KIC, hardness) point */}
          {points.map(({ substrate, grades }) => {
            const lines = grades.length ? grades.map((g) => g.name) : [substrate.name];
            const lineH = 17;
            const x = sx(substrate.toughness!);
            const top = sy(substrate.hardness!) - ((lines.length - 1) * lineH) / 2;
            return (
              <g key={substrate.id} data-substrate-point={substrate.name}>
                <title>{`${substrate.name} — hardness ${substrate.hardness}, KIC ${substrate.toughness}`}</title>
                {lines.map((line, i) => (
                  <text
                    key={line}
                    x={x}
                    y={top + i * lineH + 5}
                    textAnchor="middle"
                    className={`text-[14px] font-bold ${grades.length ? "fill-neutral-900 dark:fill-neutral-100" : "fill-neutral-400 italic dark:fill-neutral-500"}`}
                  >
                    {line}
                  </text>
                ))}
                {grades.length > 0 && (
                  <text x={x} y={top + lines.length * lineH + 3} textAnchor="middle" className="fill-neutral-500 text-[11px] dark:fill-neutral-400">
                    {substrate.name}
                  </text>
                )}
              </g>
            );
          })}
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

import { useState } from "react";
import { Link } from "react-router-dom";
import { Card } from "../../components/ui";

// Overview charts on the Grades screen: boxes placed from hard / fast (top
// left) to tough (bottom right), like ISCAR's charts. Collapsible
// (remembered per chart). Boxes may link to a Grades tab.

interface ChartBox {
  label: string;
  // Percentages of the plot (x right = tougher, y down = slower / softer).
  x: number;
  y: number;
  w: number;
  h: number;
  color: string;
  dark?: boolean;
  faded?: boolean;
  tab?: string;
}

interface ChartConfig {
  storageKey: string;
  title: string;
  subtitle: string;
  yLabel: string;
  yHigh: string;
  xLabel: string;
  xHigh: string;
  boxes: ChartBox[];
}

// Cutting material families, on top of every tab.
const FAMILIES: ChartConfig = {
  storageKey: "iscariq.grades.familiesChartOpen",
  title: "Cutting material families",
  subtitle: "hardness / cutting speed vs. feed / toughness",
  yLabel: "Hardness · Cutting speed",
  yHigh: "HIGH",
  xLabel: "Feed · Toughness",
  xHigh: "HIGH",
  boxes: [
    { label: "Submicron carbide", x: 16, y: 82, w: 74, h: 16, color: "#0b4f77", dark: true, tab: "sc" },
    { label: "Carbide", x: 50, y: 70, w: 30, h: 15, color: "#4aa8d8", tab: "sc" },
    { label: "Coated carbide", x: 46, y: 55, w: 30, h: 17, color: "#f0a35a", tab: "sc" },
    { label: "Cermet", x: 32, y: 39, w: 23, h: 24, color: "#8fd0bd" },
    { label: "Ceramic", x: 26, y: 22, w: 23, h: 21, color: "#a9b0d9", tab: "ceramic" },
    { label: "PCBN", x: 24, y: 11, w: 16, h: 14, color: "#d9363e", tab: "cbn" },
    { label: "PCD", x: 19, y: 1, w: 15, h: 13, color: "#f5c518", tab: "pcd" },
  ],
};

// Ceramic types, on the Ceramic tab.
const CERAMIC_TYPES: ChartConfig = {
  storageKey: "iscariq.grades.ceramicChartOpen",
  title: "Ceramic types",
  subtitle: "speed vs. toughness",
  yLabel: "Speed",
  yHigh: "Higher",
  xLabel: "Toughness",
  xHigh: "Tougher",
  boxes: [
    { label: "Bidemics", x: 10, y: 4, w: 36, h: 22, color: "#c7cbd6", faded: true },
    { label: "Aluminum Oxide", x: 10, y: 24, w: 34, h: 30, color: "#7fb0e3" },
    { label: "Whisker", x: 32, y: 46, w: 32, h: 22, color: "#4f9a2e", dark: true },
    { label: "Si₃N₄ / SiAlON", x: 52, y: 58, w: 34, h: 36, color: "#8c8c8c" },
  ],
};

// Extra charts per Grades tab.
const TAB_CHARTS: Record<string, ChartConfig[]> = { ceramic: [CERAMIC_TYPES] };

export function GradeFamiliesChart({ activeTab }: { activeTab: string }) {
  return <BoxesChart config={FAMILIES} activeTab={activeTab} />;
}

export function TabCharts({ tab }: { tab: string }) {
  return (
    <>
      {(TAB_CHARTS[tab] ?? []).map((c) => (
        <BoxesChart key={c.storageKey} config={c} activeTab={tab} />
      ))}
    </>
  );
}

function readOpen(key: string) {
  try {
    return localStorage.getItem(key) !== "0";
  } catch {
    return true;
  }
}

function BoxesChart({ config, activeTab }: { config: ChartConfig; activeTab: string }) {
  const [open, setOpen] = useState(() => readOpen(config.storageKey));

  function toggle() {
    setOpen((o) => {
      try {
        localStorage.setItem(config.storageKey, o ? "0" : "1");
      } catch {
        // not remembered
      }
      return !o;
    });
  }

  return (
    <Card className="mb-4 p-3" data-boxes-chart={config.title}>
      <button type="button" onClick={toggle} aria-expanded={open} className="flex w-full items-center gap-2 text-left">
        <span className="text-xs text-neutral-500">{open ? "▼" : "▶"}</span>
        <span className="font-semibold text-neutral-900 dark:text-neutral-100">{config.title}</span>
        <span className="text-xs text-neutral-500 dark:text-neutral-400">{config.subtitle}</span>
      </button>
      {open && (
        <div className="mt-3 flex max-w-3xl gap-2">
          {/* Y axis */}
          <div className="flex w-6 flex-col items-center justify-between py-1 text-[11px] font-semibold text-blue-900 dark:text-blue-300">
            <span className="rotate-180 [writing-mode:vertical-rl]">{config.yHigh}</span>
            <span className="rotate-180 whitespace-nowrap [writing-mode:vertical-rl]">{config.yLabel}</span>
          </div>
          <div className="flex-1">
            <div className="relative aspect-[16/9] border-b-[3px] border-l-[3px] border-blue-900 dark:border-blue-400">
              {config.boxes.map((f) => {
                const box = (
                  <span
                    className={`absolute flex items-center justify-center rounded-xl border-2 border-white/70 px-1 text-center text-sm leading-tight font-bold shadow-sm ${
                      f.dark ? "text-white" : "text-neutral-900"
                    } ${f.faded ? "opacity-60" : ""} ${f.tab && f.tab === activeTab && config === FAMILIES ? "ring-4 ring-blue-500" : ""}`}
                    style={{ left: `${f.x}%`, top: `${f.y}%`, width: `${f.w}%`, height: `${f.h}%`, backgroundColor: `${f.color}d9` }}
                    title={f.tab ? `${f.label} — open its grades` : f.label}
                    data-family-box={f.label}
                  >
                    {f.label}
                  </span>
                );
                return f.tab ? (
                  <Link key={f.label} to={`/catalog/grades/${f.tab}`} className="hover:opacity-90">
                    {box}
                  </Link>
                ) : (
                  <span key={f.label}>{box}</span>
                );
              })}
            </div>
            {/* X axis */}
            <div className="mt-1 flex justify-between text-[11px] font-semibold text-blue-900 dark:text-blue-300">
              <span>{config.xLabel}</span>
              <span>{config.xHigh}</span>
            </div>
          </div>
        </div>
      )}
    </Card>
  );
}

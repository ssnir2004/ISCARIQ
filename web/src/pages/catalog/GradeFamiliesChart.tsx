import { useState } from "react";
import { Link } from "react-router-dom";
import { Card } from "../../components/ui";

// Overview of the cutting material families, from hard / high cutting speed
// (top left) to tough / high feed (bottom right), like ISCAR's chart. A
// family with its own Grades tab links to it. Collapsible (remembered).

const OPEN_KEY = "iscariq.grades.familiesChartOpen";

// Boxes as percentages of the plot (x right = toughness, y down = less hard).
const FAMILIES: { label: string; x: number; y: number; w: number; h: number; color: string; dark?: boolean; tab?: string }[] = [
  { label: "Submicron carbide", x: 16, y: 82, w: 74, h: 16, color: "#0b4f77", dark: true, tab: "sc" },
  { label: "Carbide", x: 50, y: 70, w: 30, h: 15, color: "#4aa8d8", tab: "sc" },
  { label: "Coated carbide", x: 46, y: 55, w: 30, h: 17, color: "#f0a35a", tab: "sc" },
  { label: "Cermet", x: 32, y: 39, w: 23, h: 24, color: "#8fd0bd" },
  { label: "Ceramic", x: 26, y: 22, w: 23, h: 21, color: "#a9b0d9", tab: "ceramic" },
  { label: "PCBN", x: 24, y: 11, w: 16, h: 14, color: "#d9363e", tab: "cbn" },
  { label: "PCD", x: 19, y: 1, w: 15, h: 13, color: "#f5c518", tab: "pcd" },
];

function readOpen() {
  try {
    return localStorage.getItem(OPEN_KEY) !== "0";
  } catch {
    return true;
  }
}

export function GradeFamiliesChart({ activeTab }: { activeTab: string }) {
  const [open, setOpen] = useState(readOpen);

  function toggle() {
    setOpen((o) => {
      try {
        localStorage.setItem(OPEN_KEY, o ? "0" : "1");
      } catch {
        // not remembered
      }
      return !o;
    });
  }

  return (
    <Card className="mb-4 p-3" data-grade-families-chart>
      <button type="button" onClick={toggle} aria-expanded={open} className="flex w-full items-center gap-2 text-left">
        <span className="text-xs text-neutral-500">{open ? "▼" : "▶"}</span>
        <span className="font-semibold text-neutral-900 dark:text-neutral-100">Cutting material families</span>
        <span className="text-xs text-neutral-500 dark:text-neutral-400">hardness / cutting speed vs. feed / toughness</span>
      </button>
      {open && (
        <div className="mt-3 flex max-w-3xl gap-2">
          {/* Y axis */}
          <div className="flex w-6 flex-col items-center justify-between py-1 text-[11px] font-semibold text-blue-900 dark:text-blue-300">
            <span className="[writing-mode:vertical-rl] rotate-180">HIGH</span>
            <span className="[writing-mode:vertical-rl] rotate-180 whitespace-nowrap">Hardness · Cutting speed</span>
          </div>
          <div className="flex-1">
            <div className="relative aspect-[16/9] border-b-[3px] border-l-[3px] border-blue-900 dark:border-blue-400">
              {FAMILIES.map((f) => {
                const box = (
                  <span
                    className={`absolute flex items-center justify-center rounded-xl border-2 border-white/70 px-1 text-center text-sm leading-tight font-bold shadow-sm ${
                      f.dark ? "text-white" : "text-neutral-900"
                    } ${f.tab && f.tab === activeTab ? "ring-4 ring-blue-500" : ""}`}
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
              <span>Feed · Toughness</span>
              <span>HIGH</span>
            </div>
          </div>
        </div>
      )}
    </Card>
  );
}

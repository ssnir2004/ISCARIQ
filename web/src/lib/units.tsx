import { useEffect, useState } from "react";

// Metric / imperial display of cutting data. Values are stored metric
// (m/min, mm, mm/rev, mm/t); imperial shows and takes SFM, inch, IPR, IPT.
// The choice is remembered and shared by every screen showing it.

export type Units = "metric" | "imperial";
export type Quantity = "speed" | "length" | "feed";
export type FeedPer = "PER_REV" | "PER_TOOTH";

const KEY = "iscariq.units";
const EVENT = "iscariq-units";
// Metric -> imperial.
const FACTOR: Record<Quantity, number> = { speed: 3.28084, length: 1 / 25.4, feed: 1 / 25.4 };
// Decimals shown in imperial (metric shows values as stored).
const IMPERIAL_DIGITS: Record<Quantity, number> = { speed: 0, length: 4, feed: 4 };

function read(): Units {
  try {
    return localStorage.getItem(KEY) === "imperial" ? "imperial" : "metric";
  } catch {
    return "metric";
  }
}

export function useUnits(): [Units, (u: Units) => void] {
  const [units, setUnits] = useState<Units>(read);
  useEffect(() => {
    const sync = () => setUnits(read());
    window.addEventListener(EVENT, sync);
    return () => window.removeEventListener(EVENT, sync);
  }, []);
  function set(u: Units) {
    try {
      localStorage.setItem(KEY, u);
    } catch {
      // not remembered
    }
    setUnits(u);
    window.dispatchEvent(new Event(EVENT));
  }
  return [units, set];
}

const round = (v: number, digits: number) => Number(v.toFixed(digits));

// A stored (metric) value in the chosen units.
export function toUnits(v: number | null | undefined, q: Quantity, u: Units): number | null {
  if (v == null) return null;
  return u === "metric" ? v : round(v * FACTOR[q], IMPERIAL_DIGITS[q]);
}

// A typed value in the chosen units, back to metric for saving.
export function fromUnits(v: number, q: Quantity, u: Units): number {
  return u === "metric" ? v : round(v / FACTOR[q], 4);
}

// The value as text in the chosen units ("" when not set).
export const fmt = (v: number | null | undefined, q: Quantity, u: Units) => {
  const d = toUnits(v, q, u);
  return d == null ? "" : String(d);
};

export const unitLabel = (q: Quantity, u: Units, per: FeedPer = "PER_REV") =>
  q === "speed" ? (u === "metric" ? "m/min" : "SFM") : q === "length" ? (u === "metric" ? "mm" : "in") : u === "metric" ? (per === "PER_TOOTH" ? "mm/t" : "mm/rev") : per === "PER_TOOTH" ? "IPT" : "IPR";

// Metric / Imperial switch.
export function UnitsToggle({ units, onChange }: { units: Units; onChange: (u: Units) => void }) {
  return (
    <div className="inline-flex rounded-lg border border-neutral-200 p-0.5 text-sm dark:border-neutral-700" role="radiogroup" aria-label="Units" data-units-toggle>
      {(["metric", "imperial"] as const).map((u) => (
        <button
          key={u}
          type="button"
          role="radio"
          aria-checked={units === u}
          onClick={() => onChange(u)}
          className={`rounded-md px-3 py-1 ${units === u ? "bg-blue-600 text-white" : "text-neutral-600 hover:text-neutral-900 dark:text-neutral-300 dark:hover:text-white"}`}
        >
          {u === "metric" ? "Metric" : "Imperial"}
        </button>
      ))}
    </div>
  );
}

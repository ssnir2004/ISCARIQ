import { DEFAULT_KC_MATERIAL } from "./kcMaterials";

// Machining calculators, by application. Each one is plain data: its fields,
// results, formula and a compute function. Values are always computed in
// metric; inch input and results are converted at the edges.

export type Units = "metric" | "inch";

// Per quantity: its unit in each system, and how many metric units one inch unit is.
export const DIMS = {
  none: { metric: "", inch: "", factor: 1 },
  rpm: { metric: "rpm", inch: "rpm", factor: 1 },
  min: { metric: "min", inch: "min", factor: 1 },
  deg: { metric: "°", inch: "°", factor: 1 },
  length: { metric: "mm", inch: "in", factor: 25.4 },
  feedRev: { metric: "mm/r", inch: "in/r", factor: 25.4 },
  cutSpeed: { metric: "m/min", inch: "ft/min", factor: 0.3048 },
  mrr: { metric: "cm³/min", inch: "in³/min", factor: 16.387064 },
  power: { metric: "kW", inch: "HP", factor: 0.745699872 },
  force: { metric: "N", inch: "lbf", factor: 4.4482216 },
  stress: { metric: "N/mm²", inch: "psi", factor: 0.00689475729 },
} as const;
export type Dim = keyof typeof DIMS;

export type Field = { key: string; symbol: string; label: string; dim: Dim; value: number; signed?: boolean };
export type Result = { key: string; symbol: string; label: string; dim: Dim };
export type Values = Record<string, number>;

export type Mode = {
  label?: string;
  inputs: Field[];
  results: Result[];
  formula: Record<Units, string[]>;
  // Shows a material picker that fills kc1 and mc.
  usesMaterial?: boolean;
  note?: string;
  compute: (v: Values) => Values;
};
export type Calculator = { id: string; title: string; modes: Mode[] };
export type CalculatorTab = { slug: string; label: string; calculators: Calculator[] };

export const toMetric = (value: number, dim: Dim, units: Units) => (units === "metric" ? value : value * DIMS[dim].factor);
export const fromMetric = (value: number, dim: Dim, units: Units) => (units === "metric" ? value : value / DIMS[dim].factor);

const rad = (deg: number) => (deg * Math.PI) / 180;

// Actual specific cutting force from the chip thickness (mm) and rake angle.
export const specificCuttingForce = (kc1: number, mc: number, hm: number, rake: number) => kc1 * hm ** -mc * (1 - rake / 100);
// Chip thickness when turning: the feed, thinned by entering angles under 90°.
const turningChip = (fn: number, kapr: number) => fn * Math.sin(rad(Math.min(kapr, 90)));

const same = (lines: string[]) => ({ metric: lines, inch: lines });
const KC_LINES = ["kc = kc1.1 · hm^-mc · (1 − γ/100)", "hm = fn · sin(KAPR)"];

const Dm: Field = { key: "Dm", symbol: "Dm", label: "Machined diameter", dim: "length", value: 100 };
const n: Field = { key: "n", symbol: "n", label: "Spindle speed", dim: "rpm", value: 1000 };
const vc: Field = { key: "vc", symbol: "vc", label: "Cutting speed", dim: "cutSpeed", value: 200 };
const ap: Field = { key: "ap", symbol: "ap", label: "Cutting depth", dim: "length", value: 2 };
const fn: Field = { key: "fn", symbol: "fn", label: "Feed per revolution", dim: "feedRev", value: 0.25 };
const lm: Field = { key: "lm", symbol: "lm", label: "Machined length", dim: "length", value: 100 };
const kapr: Field = { key: "kapr", symbol: "KAPR", label: "Entering angle", dim: "deg", value: 95 };
const rake: Field = { key: "rake", symbol: "γ", label: "Rake angle", dim: "deg", value: 7, signed: true };
const kc1: Field = { key: "kc1", symbol: "kc1.1", label: "Specific cutting force at 1 mm chip", dim: "stress", value: DEFAULT_KC_MATERIAL.kc1 };
const mc: Field = { key: "mc", symbol: "mc", label: "Curve slope", dim: "none", value: DEFAULT_KC_MATERIAL.mc };
const kcResult: Result = { key: "kc", symbol: "kc", label: "Specific cutting force", dim: "stress" };

const speedModes = (D: Field): Mode[] => [
  {
    label: "n → vc",
    inputs: [D, n],
    results: [{ key: "vc", symbol: "vc", label: "Cutting speed", dim: "cutSpeed" }],
    formula: { metric: [`vc = π · ${D.symbol} · n / 1000`], inch: [`vc = π · ${D.symbol} · n / 12`] },
    compute: (v) => ({ vc: (Math.PI * v[D.key] * v.n) / 1000 }),
  },
  {
    label: "vc → n",
    inputs: [D, vc],
    results: [{ key: "n", symbol: "n", label: "Spindle speed", dim: "rpm" }],
    formula: { metric: [`n = vc · 1000 / (π · ${D.symbol})`], inch: [`n = vc · 12 / (π · ${D.symbol})`] },
    compute: (v) => ({ n: (v.vc * 1000) / (Math.PI * v[D.key]) }),
  },
];

const turning: CalculatorTab = {
  slug: "turning",
  label: "General turning",
  calculators: [
    { id: "turning-speed", title: "Cutting and spindle speed", modes: speedModes(Dm) },
    {
      id: "turning-mrr",
      title: "Metal removal rate",
      modes: [
        {
          inputs: [vc, ap, fn],
          results: [{ key: "Q", symbol: "Q", label: "Metal removal rate", dim: "mrr" }],
          formula: { metric: ["Q = vc · ap · fn"], inch: ["Q = vc · ap · fn · 12"] },
          compute: (v) => ({ Q: v.vc * v.ap * v.fn }),
        },
      ],
    },
    {
      id: "turning-power",
      title: "Net power",
      modes: [
        {
          usesMaterial: true,
          inputs: [vc, ap, fn, kapr, rake, kc1, mc],
          results: [kcResult, { key: "Pc", symbol: "Pc", label: "Net power", dim: "power" }],
          formula: { metric: ["Pc = vc · ap · fn · kc / (60 · 10³)", ...KC_LINES], inch: ["Pc = vc · ap · fn · kc / (33 · 10³)", ...KC_LINES] },
          compute: (v) => {
            const kc = specificCuttingForce(v.kc1, v.mc, turningChip(v.fn, v.kapr), v.rake);
            return { kc, Pc: (v.vc * v.ap * v.fn * kc) / 60e3 };
          },
        },
      ],
    },
    {
      id: "turning-time",
      title: "Machining time",
      modes: [
        {
          inputs: [lm, fn, n],
          results: [{ key: "Tc", symbol: "Tc", label: "Period of engagement", dim: "min" }],
          formula: same(["Tc = lm / (fn · n)"]),
          compute: (v) => ({ Tc: v.lm / (v.fn * v.n) }),
        },
      ],
    },
    {
      id: "turning-force",
      title: "Tangential force",
      modes: [
        {
          usesMaterial: true,
          inputs: [ap, fn, kapr, rake, kc1, mc],
          results: [kcResult, { key: "Ft", symbol: "Ft", label: "Tangential force", dim: "force" }],
          formula: same(["Ft = kc · ap · fn", ...KC_LINES]),
          note: "With a boring bar, keep Ft below about 90% of the bar's maximum load.",
          compute: (v) => {
            const kc = specificCuttingForce(v.kc1, v.mc, turningChip(v.fn, v.kapr), v.rake);
            return { kc, Ft: kc * v.ap * v.fn };
          },
        },
      ],
    },
  ],
};

export const CALCULATOR_TABS: CalculatorTab[] = [turning];

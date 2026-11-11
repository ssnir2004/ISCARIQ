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
  percent: { metric: "%", inch: "%", factor: 1 },
  length: { metric: "mm", inch: "in", factor: 25.4 },
  meters: { metric: "m", inch: "ft", factor: 0.3048 },
  // Metric pitch is a length; inch pitch is threads per inch (see toMetric).
  pitch: { metric: "mm", inch: "TPI", factor: 25.4 },
  feedRev: { metric: "mm/r", inch: "in/r", factor: 25.4 },
  feedMin: { metric: "mm/min", inch: "in/min", factor: 25.4 },
  cutSpeed: { metric: "m/min", inch: "ft/min", factor: 0.3048 },
  mrr: { metric: "cm³/min", inch: "in³/min", factor: 16.387064 },
  power: { metric: "kW", inch: "HP", factor: 0.745699872 },
  force: { metric: "N", inch: "lbf", factor: 4.4482216 },
  torque: { metric: "Nm", inch: "lbf·ft", factor: 1.35581795 },
  tapTorque: { metric: "Nm", inch: "in·lb", factor: 0.112984829 },
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
  // A result with one row per step, under the single results.
  table?: { columns: Omit<Result, "symbol">[]; rows: (v: Values) => Values[] };
  formula: Record<Units, string[]>;
  // Shows a material picker that fills kc1 and mc.
  usesMaterial?: boolean;
  note?: string;
  compute: (v: Values, units: Units) => Values;
};
export type Calculator = { id: string; title: string; modes: Mode[] };
export type CalculatorTab = { slug: string; label: string; calculators: Calculator[] };

export function toMetric(value: number, dim: Dim, units: Units) {
  if (units === "metric") return value;
  return dim === "pitch" ? DIMS.pitch.factor / value : value * DIMS[dim].factor;
}
export function fromMetric(value: number, dim: Dim, units: Units) {
  if (units === "metric") return value;
  return dim === "pitch" ? DIMS.pitch.factor / value : value / DIMS[dim].factor;
}

const rad = (deg: number) => (deg * Math.PI) / 180;
const sinDeg = (deg: number) => Math.sin(rad(Math.min(deg, 90)));
const torqueFrom = (Pc: number, n: number) => (Pc * 30e3) / (Math.PI * n);
const spindleSpeed = (vc: number, D: number) => (vc * 1000) / (Math.PI * D);

// Actual specific cutting force from the chip thickness (mm) and rake angle.
export const specificCuttingForce = (kc1: number, mc: number, hm: number, rake: number) => kc1 * hm ** -mc * (1 - rake / 100);

const same = (lines: string[]) => ({ metric: lines, inch: lines });
const KC_LINE = "kc = kc1.1 · hm^-mc · (1 − γ/100)";

const field = (key: string, symbol: string, label: string, dim: Dim, value: number, signed?: boolean): Field => ({ key, symbol, label, dim, value, signed });
const result = (key: string, symbol: string, label: string, dim: Dim): Result => ({ key, symbol, label, dim });

const Dm = field("Dm", "Dm", "Machined diameter", "length", 100);
const Dc = field("Dc", "Dc", "Cutting diameter", "length", 20);
const Dcap = field("Dcap", "Dcap", "Cutting diameter at depth ap", "length", 20);
const n = field("n", "n", "Spindle speed", "rpm", 1000);
const vc = field("vc", "vc", "Cutting speed", "cutSpeed", 200);
const vf = field("vf", "vf", "Feed rate", "feedMin", 500);
const ap = field("ap", "ap", "Cutting depth", "length", 2);
const ae = field("ae", "ae", "Radial depth of cut", "length", 10);
const fn = field("fn", "fn", "Feed per revolution", "feedRev", 0.25);
const fz = field("fz", "fz", "Feed per tooth", "length", 0.1);
const zc = field("zc", "zc", "Effective teeth", "none", 4);
const hex = field("hex", "hex", "Maximum chip thickness", "length", 0.1);
const lm = field("lm", "lm", "Machined length", "length", 100);
const kapr = field("kapr", "KAPR", "Entering angle", "deg", 95);
const rake = field("rake", "γ", "Rake angle", "deg", 7, true);
const kc1 = field("kc1", "kc1.1", "Specific cutting force at 1 mm chip", "stress", DEFAULT_KC_MATERIAL.kc1);
const mc = field("mc", "mc", "Curve slope", "none", DEFAULT_KC_MATERIAL.mc);
const pitch = field("P", "P", "Thread pitch", "pitch", 1.5);

const vcResult = result("vc", "vc", "Cutting speed", "cutSpeed");
const nResult = result("n", "n", "Spindle speed", "rpm");
const vfResult = result("vf", "vf", "Feed rate", "feedMin");
const fnResult = result("fn", "fn", "Feed per revolution", "feedRev");
const qResult = result("Q", "Q", "Metal removal rate", "mrr");
const kcResult = result("kc", "kc", "Specific cutting force", "stress");
const pcResult = result("Pc", "Pc", "Net power", "power");
const mcResult = result("Mc", "Mc", "Torque", "torque");
const tcResult = result("Tc", "Tc", "Machining time", "min");
const fzResult = result("fz", "fz", "Feed per tooth", "length");
const dcapResult = result("Dcap", "Dcap", "Cutting diameter at depth ap", "length");

const speedCalculator = (id: string, title: string, D: Field): Calculator => ({
  id,
  title,
  modes: [
    {
      label: "n → vc",
      inputs: [D, n],
      results: [vcResult],
      formula: { metric: [`vc = π · ${D.symbol} · n / 1000`], inch: [`vc = π · ${D.symbol} · n / 12`] },
      compute: (v) => ({ vc: (Math.PI * v[D.key] * v.n) / 1000 }),
    },
    {
      label: "vc → n",
      inputs: [D, vc],
      results: [nResult],
      formula: { metric: [`n = vc · 1000 / (π · ${D.symbol})`], inch: [`n = vc · 12 / (π · ${D.symbol})`] },
      compute: (v) => ({ n: spindleSpeed(v.vc, v[D.key]) }),
    },
  ],
});

const turningTime = (id: string): Calculator => ({
  id,
  title: "Machining time",
  modes: [{ inputs: [lm, fn, n], results: [tcResult], formula: same(["Tc = lm / (fn · n)"]), compute: (v) => ({ Tc: v.lm / (v.fn * v.n) }) }],
});

const turning: CalculatorTab = {
  slug: "turning",
  label: "General turning",
  calculators: [
    speedCalculator("turning-speed", "Cutting and spindle speed", Dm),
    {
      id: "turning-mrr",
      title: "Metal removal rate",
      modes: [{ inputs: [vc, ap, fn], results: [qResult], formula: { metric: ["Q = vc · ap · fn"], inch: ["Q = vc · ap · fn · 12"] }, compute: (v) => ({ Q: v.vc * v.ap * v.fn }) }],
    },
    {
      id: "turning-power",
      title: "Net power",
      modes: [
        {
          usesMaterial: true,
          inputs: [vc, ap, fn, kapr, rake, kc1, mc],
          results: [kcResult, pcResult],
          formula: {
            metric: ["Pc = vc · ap · fn · kc / (60 · 10³)", KC_LINE, "hm = fn · sin(KAPR)"],
            inch: ["Pc = vc · ap · fn · kc / (33 · 10³)", KC_LINE, "hm = fn · sin(KAPR)"],
          },
          compute: (v) => {
            const kc = specificCuttingForce(v.kc1, v.mc, v.fn * sinDeg(v.kapr), v.rake);
            return { kc, Pc: (v.vc * v.ap * v.fn * kc) / 60e3 };
          },
        },
      ],
    },
    turningTime("turning-time"),
    {
      id: "turning-force",
      title: "Tangential force",
      modes: [
        {
          usesMaterial: true,
          inputs: [ap, fn, kapr, rake, kc1, mc],
          results: [kcResult, result("Ft", "Ft", "Tangential force", "force")],
          formula: same(["Ft = kc · ap · fn", KC_LINE, "hm = fn · sin(KAPR)"]),
          note: "With a boring bar, keep Ft below about 90% of the bar's maximum load.",
          compute: (v) => {
            const kc = specificCuttingForce(v.kc1, v.mc, v.fn * sinDeg(v.kapr), v.rake);
            return { kc, Ft: kc * v.ap * v.fn };
          },
        },
      ],
    },
  ],
};

const parting: CalculatorTab = {
  slug: "parting-grooving",
  label: "Parting and grooving",
  calculators: [
    speedCalculator("parting-speed", "Cutting and spindle speed", Dm),
    {
      id: "parting-deflection",
      title: "Tool deflection",
      modes: [
        {
          inputs: [
            field("F", "F", "Cutting force", "force", 1000),
            field("OH", "OH", "Overhang", "length", 20),
            field("t", "t", "Blade thickness", "length", 3),
            field("H", "H", "Blade height", "length", 26),
            field("E", "E", "Modulus of elasticity", "stress", 210000),
          ],
          results: [result("delta", "δ", "Deflection", "length")],
          formula: same(["δ = 4 · F · OH³ / (E · t · H³)"]),
          note: "F can be taken from Tangential force on the General turning tab. E is about 210,000 N/mm² for a steel blade.",
          compute: (v) => ({ delta: (4 * v.F * v.OH ** 3) / (v.E * v.t * v.H ** 3) }),
        },
      ],
    },
  ],
};

// Circular milling, ramping and thread milling share their feed formulas.
const circularModes: Mode[] = (() => {
  const zcTool = field("zc", "zc", "Effective teeth", "none", 3);
  const DmHole = field("Dm", "Dm", "Finished diameter", "length", 50);
  const feeds = (hexValue: number, aeEff: number, D: number, nValue: number, teeth: number) => {
    // Past half the cutter's diameter the chip is at its thickest.
    const fzValue = aeEff >= D / 2 ? hexValue : hexValue / Math.sin(Math.acos(1 - (2 * aeEff) / D));
    return { fz: fzValue, vfm: nValue * fzValue * teeth };
  };
  const aeResult = result("aeEff", "ae,eff", "Effective radial depth of cut", "length");
  const vfmResult = result("vfm", "vfm", "Peripheral feed", "feedMin");
  const vfCentre = result("vf", "vf", "Tool centre feed", "feedMin");
  const betaLines = ["β = arccos(1 − 2 · ae,eff / Dcap)", "fz = hex / sin β", "vfm = n · fz · zc"];
  return [
    {
      label: "Internal",
      inputs: [DmHole, field("Dw", "Dw", "Existing hole (0 = solid)", "length", 30, true), Dcap, n, hex, zcTool],
      results: [aeResult, fzResult, vfmResult, vfCentre, result("Dvf", "Dvf", "Tool path diameter", "length"), result("Dvf1", "Dvf1", "Roll-in path diameter", "length")],
      formula: same(["ae,eff = (Dm² − Dw²) / (4 · (Dm − Dcap))", ...betaLines, "vf = vfm · (Dm − Dcap) / Dm", "Dvf = Dm − Dcap, Dvf1 = Dvf / 2", "Solid workpiece: ae,eff = Dm / 2, fz = hex"]),
      compute: (v) => {
        if (v.Dw < 0 || v.Dw >= v.Dm || v.Dcap >= v.Dm) return {};
        const aeEff = v.Dw === 0 ? v.Dm / 2 : (v.Dm ** 2 - v.Dw ** 2) / (4 * (v.Dm - v.Dcap));
        const f = feeds(v.hex, aeEff, v.Dcap, v.n, v.zc);
        const Dvf = v.Dm - v.Dcap;
        return { aeEff, ...f, vf: (f.vfm * Dvf) / v.Dm, Dvf, Dvf1: Dvf / 2 };
      },
    },
    {
      label: "External",
      inputs: [DmHole, field("Dw", "Dw", "Workpiece diameter", "length", 60), Dcap, n, hex, zcTool],
      results: [aeResult, fzResult, vfmResult, vfCentre],
      formula: same(["ae,eff = (Dw² − Dm²) / (4 · (Dm + Dcap))", ...betaLines, "vf = vfm · (Dm + Dcap) / Dm"]),
      compute: (v) => {
        if (v.Dw <= v.Dm) return {};
        const aeEff = (v.Dw ** 2 - v.Dm ** 2) / (4 * (v.Dm + v.Dcap));
        const f = feeds(v.hex, aeEff, v.Dcap, v.n, v.zc);
        return { aeEff, ...f, vf: (f.vfm * (v.Dm + v.Dcap)) / v.Dm };
      },
    },
  ];
})();

const TD = field("TD", "TD", "Nominal thread diameter", "length", 10);
const tapD = field("D", "D", "Nominal diameter", "length", 10);
const holeResult = result("D", "D", "Hole diameter", "length");

const threading: CalculatorTab = {
  slug: "threading",
  label: "Threading",
  calculators: [
    {
      id: "thread-infeed",
      title: "Infeed per pass",
      modes: [
        {
          inputs: [field("ap", "ap", "Total thread depth + extra stock", "length", 0.94), field("nap", "nap", "Number of passes", "none", 6)],
          results: [],
          table: {
            columns: [
              { key: "pass", label: "Pass", dim: "none" },
              { key: "depth", label: "Depth reached", dim: "length" },
              { key: "infeed", label: "Infeed", dim: "length" },
            ],
            rows: (v) => {
              if (!Number.isInteger(v.nap) || v.nap < 2 || v.nap > 60) return [];
              const depthAt = (x: number) => (x === 0 ? 0 : (v.ap / Math.sqrt(v.nap - 1)) * Math.sqrt(x === 1 ? 0.3 : x - 1));
              return Array.from({ length: v.nap }, (_, i) => ({ pass: i + 1, depth: depthAt(i + 1), infeed: depthAt(i + 1) - depthAt(i) }));
            },
          },
          formula: same(["Depth at pass x = ap / √(nap − 1) · √Y", "Y = 0.3 at pass 1, otherwise x − 1"]),
          compute: () => ({}),
        },
      ],
    },
    {
      id: "thread-lead-angle",
      title: "Lead angle",
      modes: [
        {
          inputs: [field("starts", "N", "Number of starts", "none", 1), pitch, field("d2", "d2", "Pitch diameter", "length", 15)],
          results: [result("phi", "φ", "Lead angle", "deg")],
          formula: same(["φ = arctan(N · P / (d2 · π))"]),
          compute: (v) => ({ phi: (Math.atan((v.starts * v.P) / (v.d2 * Math.PI)) * 180) / Math.PI }),
        },
      ],
    },
    {
      id: "tap-speed",
      title: "Tapping speed and feed",
      modes: [
        {
          inputs: [tapD, field("vc", "vc", "Cutting speed", "cutSpeed", 20), pitch],
          results: [nResult, vfResult],
          formula: { metric: ["n = vc · 1000 / (π · D)", "vf = P · n"], inch: ["n = vc · 12 / (π · D)", "vf = n / TPI"] },
          compute: (v) => {
            const speed = spindleSpeed(v.vc, v.D);
            return { n: speed, vf: v.P * speed };
          },
        },
      ],
    },
    {
      id: "tap-torque",
      title: "Tapping torque and power",
      modes: [
        {
          usesMaterial: true,
          inputs: [pitch, tapD, field("kc1", "kc", "Specific cutting force", "stress", DEFAULT_KC_MATERIAL.kc1), field("n", "n", "Spindle speed", "rpm", 640)],
          results: [result("Md", "Md", "Torque", "tapTorque"), result("Pw", "P", "Power", "power")],
          formula: same(["Md [Nm] = P² · D · kc / 8000", "P [kW] = Md · 2π · n / (60 · 1000)"]),
          note: "The material fills kc with its kc1.1. Taps cut thin chips, so the real kc is higher; raise it if you know it.",
          compute: (v) => {
            const Md = (v.P ** 2 * v.D * v.kc1) / 8000;
            return { Md, Pw: (Md * 2 * Math.PI * v.n) / 60e3 };
          },
        },
      ],
    },
    {
      id: "tap-hole",
      title: "Tap hole diameter",
      modes: [
        {
          label: "Cutting tap",
          inputs: [TD, pitch],
          results: [holeResult],
          formula: { metric: ["D = TD − TP"], inch: ["D = TD − 0.975 / TPI"] },
          compute: (v, units) => ({ D: v.TD - (units === "inch" ? 0.975 : 1) * v.P }),
        },
        {
          label: "Forming tap",
          inputs: [TD, pitch],
          results: [holeResult],
          formula: { metric: ["D = TD − TP / 2"], inch: ["D = TD − 0.51 / TPI"] },
          compute: (v, units) => ({ D: v.TD - (units === "inch" ? 0.51 : 0.5) * v.P }),
        },
      ],
    },
    {
      id: "tap-hole-height",
      title: "Tap hole by thread height",
      modes: (() => {
        const TDm = field("TD", "TD", "Nominal thread diameter", "length", 8);
        const P125 = field("P", "TP", "Thread pitch", "pitch", 1.25);
        const TH = field("TH", "TH", "Thread height", "percent", 68);
        return [
          {
            label: "Cutting tap",
            inputs: [TDm, P125, TH],
            results: [holeResult],
            formula: { metric: ["D = TD − TH · TP / 76.98"], inch: ["D = TD − 0.0130 · TH / TPI"] },
            compute: (v: Values) => ({ D: v.TD - (v.TH * v.P) / 76.98 }),
          },
          {
            label: "Forming tap",
            inputs: [TDm, P125, TH],
            results: [holeResult],
            formula: { metric: ["D = TD − TH · TP / 147.06"], inch: ["D = TD − 0.0068 · TH / TPI"] },
            compute: (v: Values) => ({ D: v.TD - (v.TH * v.P) / 147.06 }),
          },
        ];
      })(),
    },
    {
      id: "thread-height",
      title: "Thread height from core hole",
      modes: [
        {
          inputs: [field("TD", "TD", "Nominal thread diameter", "length", 8), field("P", "P", "Thread pitch", "pitch", 1.25), field("core", "D", "Core hole diameter", "length", 6.9)],
          results: [result("TH", "TH", "Thread height", "percent")],
          formula: same(["Maximum height = 6/8 · 0.866 · P", "Actual height = (TD − D) / 2", "TH = actual / maximum · 100"]),
          note: "For 60° threads (ISO and UTS).",
          compute: (v) => ({ TH: ((v.TD - v.core) / 2 / ((6 / 8) * 0.866 * v.P)) * 100 }),
        },
      ],
    },
    speedCalculator("thread-milling-speed", "Thread milling speed", Dcap),
    { id: "thread-milling-feeds", title: "Thread milling feeds", modes: circularModes },
  ],
};

const milling: CalculatorTab = {
  slug: "milling",
  label: "Milling",
  calculators: [
    speedCalculator("milling-speed", "Cutting and spindle speed", Dcap),
    {
      id: "milling-feed",
      title: "Table feed and feed per tooth",
      modes: [
        {
          label: "fz → vf",
          inputs: [fz, n, zc],
          results: [vfResult, fnResult],
          formula: same(["vf = fz · n · zc", "fn = vf / n"]),
          compute: (v) => ({ vf: v.fz * v.n * v.zc, fn: v.fz * v.zc }),
        },
        {
          label: "vf → fz",
          inputs: [vf, n, zc],
          results: [fzResult, fnResult],
          formula: same(["fz = vf / (n · zc)", "fn = vf / n"]),
          compute: (v) => ({ fz: v.vf / (v.n * v.zc), fn: v.vf / v.n }),
        },
      ],
    },
    {
      id: "milling-mrr",
      title: "Metal removal rate",
      modes: [{ inputs: [ap, ae, vf], results: [qResult], formula: { metric: ["Q = ap · ae · vf / 1000"], inch: ["Q = ap · ae · vf"] }, compute: (v) => ({ Q: (v.ap * v.ae * v.vf) / 1000 }) }],
    },
    {
      id: "milling-power",
      title: "Net power and torque",
      modes: [
        {
          usesMaterial: true,
          inputs: [ae, ap, fz, n, zc, Dcap, field("kapr", "KAPR", "Entering angle", "deg", 90), rake, kc1, mc],
          results: [kcResult, pcResult, mcResult],
          formula: {
            metric: ["Pc = ae · ap · vf · kc / (60 · 10⁶)", "Mc = Pc · 30 · 10³ / (π · n)", "vf = fz · n · zc", KC_LINE, "hm = fz · sin(KAPR) · 2 · ae / (Dcap · φ)", "φ = arccos(1 − 2 · ae / Dcap)"],
            inch: ["Pc = ae · ap · vf · kc / (396 · 10³)", "Mc = Pc · 16501 / (π · n)", "vf = fz · n · zc", KC_LINE, "hm = fz · sin(KAPR) · 2 · ae / (Dcap · φ)", "φ = arccos(1 − 2 · ae / Dcap)"],
          },
          compute: (v): Values => {
            if (v.ae > v.Dcap) return {};
            const hm = (v.fz * sinDeg(v.kapr) * 2 * v.ae) / (v.Dcap * Math.acos(1 - (2 * v.ae) / v.Dcap));
            const kc = specificCuttingForce(v.kc1, v.mc, hm, v.rake);
            const Pc = (v.ae * v.ap * v.fz * v.n * v.zc * kc) / 60e6;
            return { kc, Pc, Mc: torqueFrom(Pc, v.n) };
          },
        },
      ],
    },
    {
      id: "milling-time",
      title: "Machining time",
      modes: [{ inputs: [lm, vf], results: [tcResult], formula: same(["Tc = lm / vf"]), compute: (v) => ({ Tc: v.lm / v.vf }) }],
    },
    {
      id: "milling-cutter",
      title: "Effective diameter and feed per tooth",
      modes: [
        {
          label: "Straight edge",
          inputs: [Dc, ap, field("kapr", "κr", "Entering angle", "deg", 45), ae, hex],
          results: [dcapResult, fzResult],
          formula: same(["Dcap = Dc + 2 · ap / tan κr", "ae > Dcap/2: fz = hex / sin κr", "ae < Dcap/2: fz = hex · Dcap / (2 · sin κr · √(Dcap · ae − ae²))"]),
          compute: (v) => {
            const D = v.kapr >= 90 ? v.Dc : v.Dc + (2 * v.ap) / Math.tan(rad(v.kapr));
            const sin = sinDeg(v.kapr);
            return { Dcap: D, fz: v.ae > D / 2 ? v.hex / sin : (v.hex * D) / (2 * sin * Math.sqrt(D * v.ae - v.ae ** 2)) };
          },
        },
        {
          label: "Round insert",
          inputs: [Dc, field("iC", "iC", "Insert diameter", "length", 12), field("ap", "ap", "Cutting depth", "length", 1), ae, hex],
          results: [dcapResult, fzResult],
          formula: same(["Dcap = Dc + √(iC² − (iC − 2 · ap)²)", "ae > Dcap/2: fz = hex · iC / (2 · √(ap · iC − ap²))", "ae < Dcap/2: fz = hex · iC · Dcap / (4 · √(ap · iC − ap²) · √(Dcap · ae − ae²))"]),
          compute: (v) => {
            const depth = Math.min(v.ap, v.iC / 2);
            const D = v.Dc + Math.sqrt(v.iC ** 2 - (v.iC - 2 * depth) ** 2);
            const edge = Math.sqrt(depth * v.iC - depth ** 2);
            return { Dcap: D, fz: v.ae > D / 2 ? (v.hex * v.iC) / (2 * edge) : (v.hex * v.iC * D) / (4 * edge * Math.sqrt(D * v.ae - v.ae ** 2)) };
          },
        },
        {
          label: "Ball nose",
          inputs: [field("D3", "D3", "Ball diameter", "length", 12), field("ap", "ap", "Cutting depth", "length", 1), field("ae", "ae", "Radial depth of cut", "length", 1), hex],
          results: [dcapResult, fzResult],
          formula: same(["Dcap = √(D3² − (D3 − 2 · ap)²)", "Centred: fz = D3 · hex / Dcap", "Side: fz = D3 · hex / √(Dcap² − (Dcap − 2 · ae)²)"]),
          compute: (v) => {
            const depth = Math.min(v.ap, v.D3 / 2);
            const D = Math.sqrt(v.D3 ** 2 - (v.D3 - 2 * depth) ** 2);
            return { Dcap: D, fz: v.ae >= D / 2 ? (v.D3 * v.hex) / D : (v.D3 * v.hex) / Math.sqrt(D ** 2 - (D - 2 * v.ae) ** 2) };
          },
        },
      ],
    },
    { id: "milling-circular", title: "Circular milling and ramping", modes: circularModes },
  ],
};

const drillFn = field("fn", "fn", "Feed per revolution", "feedRev", 0.2);

const drilling: CalculatorTab = {
  slug: "drilling",
  label: "Drilling",
  calculators: [
    speedCalculator("drilling-speed", "Cutting and spindle speed", Dc),
    {
      id: "drilling-feed",
      title: "Penetration rate and feed",
      modes: [
        { label: "fn → vf", inputs: [drillFn, n], results: [vfResult], formula: same(["vf = fn · n"]), compute: (v) => ({ vf: v.fn * v.n }) },
        { label: "vf → fn", inputs: [vf, n], results: [fnResult], formula: same(["fn = vf / n"]), compute: (v) => ({ fn: v.vf / v.n }) },
      ],
    },
    {
      id: "drilling-mrr",
      title: "Metal removal rate",
      modes: [{ inputs: [Dc, drillFn, vc], results: [qResult], formula: { metric: ["Q = Dc · fn · vc / 4"], inch: ["Q = Dc · fn · vc · 3"] }, compute: (v) => ({ Q: (v.Dc * v.fn * v.vc) / 4 }) }],
    },
    {
      id: "drilling-power",
      title: "Net power, torque and feed force",
      modes: [
        {
          usesMaterial: true,
          inputs: [Dc, drillFn, vc, field("zc", "zc", "Effective cutting edges", "none", 2), field("kapr", "κr", "Entering angle", "deg", 70), rake, kc1, mc],
          results: [kcResult, pcResult, mcResult, result("Ff", "Ff", "Feed force", "force")],
          formula: {
            metric: ["Pc = fn · vc · Dc · kc / (240 · 10³)", "Mc = Pc · 30 · 10³ / (π · n)", "Ff ≈ 0.5 · kc · Dc/2 · fn · sin κr", "kc = kc1.1 · (fz · sin κr)^-mc · (1 − γ/100)", "fz = fn / zc"],
            inch: ["Pc = fn · vc · Dc · kc / (132 · 10³)", "Mc = Pc · 16501 / (π · n)", "Ff ≈ 0.5 · kc · Dc/2 · fn · sin κr", "kc = kc1.1 · (fz · sin κr)^-mc · (1 − γ/100)", "fz = fn / zc"],
          },
          compute: (v) => {
            const sin = sinDeg(v.kapr);
            const kc = specificCuttingForce(v.kc1, v.mc, (v.fn / v.zc) * sin, v.rake);
            const Pc = (v.fn * v.vc * v.Dc * kc) / 240e3;
            return { kc, Pc, Mc: torqueFrom(Pc, spindleSpeed(v.vc, v.Dc)), Ff: 0.5 * kc * (v.Dc / 2) * v.fn * sin };
          },
        },
      ],
    },
    {
      id: "drilling-time",
      title: "Machining time",
      modes: [{ inputs: [lm, drillFn, n], results: [tcResult], formula: same(["Tc = lm / vf", "vf = fn · n"]), compute: (v) => ({ Tc: v.lm / (v.fn * v.n) }) }],
    },
    {
      id: "drilling-tool-life",
      title: "Tool life",
      modes: [
        {
          inputs: [field("TL", "TL", "Tool life", "meters", 15), field("depth", "lm", "Hole depth", "length", 50), drillFn, field("n", "n", "Spindle speed", "rpm", 3184)],
          results: [result("holes", "", "Number of holes", "none"), result("minutes", "", "Time in cut", "min")],
          formula: same(["Holes = TL / hole depth", "Time = TL / (fn · n)"]),
          compute: (v) => ({ holes: (v.TL * 1000) / v.depth, minutes: (v.TL * 1000) / (v.fn * v.n) }),
        },
      ],
    },
  ],
};

const boringPowerLines = [KC_LINE, "hm = fn / zc · sin(KAPR)"];

const boring: CalculatorTab = {
  slug: "boring",
  label: "Boring",
  calculators: [
    speedCalculator("boring-speed", "Cutting and spindle speed", Dm),
    {
      id: "boring-feed",
      title: "Feed and penetration rate",
      modes: [
        {
          inputs: [field("zc", "zc", "Effective teeth", "none", 1), field("fz", "fz", "Feed per tooth", "length", 0.15), n],
          results: [fnResult, vfResult],
          formula: same(["fn = zc · fz", "vf = fn · n"]),
          compute: (v) => ({ fn: v.zc * v.fz, vf: v.zc * v.fz * v.n }),
        },
      ],
    },
    {
      id: "boring-mrr",
      title: "Metal removal rate",
      modes: [{ inputs: [vc, ap, fn], results: [qResult], formula: { metric: ["Q = vc · ap · fn"], inch: ["Q = vc · ap · fn · 12"] }, compute: (v) => ({ Q: v.vc * v.ap * v.fn }) }],
    },
    {
      id: "boring-power",
      title: "Net power and torque",
      modes: [
        {
          usesMaterial: true,
          inputs: [vc, ap, fn, field("Dc", "Dc", "Cutting diameter", "length", 60), field("zc", "zc", "Effective teeth", "none", 1), kapr, rake, kc1, mc],
          results: [kcResult, pcResult, mcResult],
          formula: {
            metric: ["Pc = vc · ap · fn · kc / (60 · 10³) · (1 − ap/Dc)", "Mc = Pc · 30 · 10³ / (π · n)", ...boringPowerLines],
            inch: ["Pc = vc · ap · fn · kc / (33 · 10³) · (1 − ap/Dc)", "Mc = Pc · 16501 / (π · n)", ...boringPowerLines],
          },
          compute: (v) => {
            const kc = specificCuttingForce(v.kc1, v.mc, (v.fn / v.zc) * sinDeg(v.kapr), v.rake);
            const Pc = ((v.vc * v.ap * v.fn * kc) / 60e3) * (1 - v.ap / v.Dc);
            return { kc, Pc, Mc: torqueFrom(Pc, spindleSpeed(v.vc, v.Dc)) };
          },
        },
      ],
    },
    turningTime("boring-time"),
  ],
};

export const CALCULATOR_TABS: CalculatorTab[] = [turning, parting, threading, milling, drilling, boring];

// Checks the calculators against worked examples and the inch formulas.
// Run from the repo root: npx tsx web/scripts/check-calculators.ts
import { CALCULATOR_TABS, fromMetric, toMetric, type Dim, type Units, type Values } from "../src/lib/calculators";

let failed = 0;
function near(name: string, actual: number, expected: number, tolerance = 0.002) {
  const ok = Math.abs(actual - expected) <= Math.abs(expected) * tolerance;
  if (!ok) failed++;
  console.log(`${ok ? "ok  " : "FAIL"} ${name}: ${actual} (expected ${expected})`);
}
function mode(id: string, index: number) {
  const calculator = CALCULATOR_TABS.flatMap((t) => t.calculators).find((c) => c.id === id);
  if (!calculator) throw new Error(`No calculator ${id}`);
  return calculator.modes[index];
}
const run = (id: string, index: number, values: Values, units: Units = "metric") => mode(id, index).compute(values, units);
const inch = (value: number, dim: Dim) => toMetric(value, dim, "inch");
const out = (value: number, dim: Dim) => fromMetric(value, dim, "inch");
const steel = { rake: 0, kc1: 1775, mc: 0.24 };
const rad = (deg: number) => (deg * Math.PI) / 180;

// Every default must produce finite results.
for (const tab of CALCULATOR_TABS)
  for (const calculator of tab.calculators)
    calculator.modes.forEach((m, i) => {
      const values = Object.fromEntries(m.inputs.map((f) => [f.key, f.value]));
      const results = m.compute(values, "metric");
      const missing = m.results.filter((r) => !Number.isFinite(results[r.key]));
      if (missing.length || (m.table && m.table.rows(values).length === 0)) {
        failed++;
        console.log(`FAIL defaults ${calculator.id}[${i}]: ${missing.map((r) => r.key).join(", ")}`);
      }
    });

// Turning.
near("vc", run("turning-speed", 0, { Dm: 100, n: 1000 }).vc, 314.159);
near("n", run("turning-speed", 1, { Dm: 100, vc: 200 }).n, 636.62);
near("Q", run("turning-mrr", 0, { vc: 200, ap: 2, fn: 0.25 }).Q, 100);
near("Tc", run("turning-time", 0, { lm: 100, fn: 0.25, n: 1000 }).Tc, 0.4);
const power = run("turning-power", 0, { vc: 200, ap: 2, fn: 0.4, kapr: 90, ...steel });
near("kc", power.kc, 1775 * 0.4 ** -0.24);
near("Pc", power.Pc, (200 * 2 * 0.4 * power.kc) / 60e3);
const kc04 = 1775 * 0.4 ** -0.24;
near("Ft", run("turning-force", 0, { ap: 2, fn: 0.3, kapr: 75, ...steel }).Ft, kc04 * (0.4 / (0.3 * Math.sin(rad(75)))) ** 0.24 * 0.3 * 2);
near("vc inch", out(run("turning-speed", 0, { Dm: inch(4, "length"), n: 764 }).vc, "cutSpeed"), (Math.PI * 4 * 764) / 12);
near("n inch", run("turning-speed", 1, { Dm: inch(4, "length"), vc: inch(800, "cutSpeed") }).n, (800 * 12) / (Math.PI * 4));
near("Q inch", out(run("turning-mrr", 0, { vc: inch(800, "cutSpeed"), ap: inch(0.1, "length"), fn: inch(0.012, "feedRev") }).Q, "mrr"), 800 * 0.1 * 0.012 * 12);
const inchPower = run("turning-power", 0, { vc: inch(800, "cutSpeed"), ap: inch(0.1, "length"), fn: inch(0.012, "feedRev"), kapr: 90, ...steel });
near("Pc inch", out(inchPower.Pc, "power"), (800 * 0.1 * 0.012 * out(inchPower.kc, "stress")) / 33e3);

// Parting: against a cantilever, F·L³ / (3·E·I) with I = t·H³ / 12.
near("deflection", run("parting-deflection", 0, { F: 1000, OH: 20, t: 3, H: 26, E: 210000 }).delta, (1000 * 20 ** 3) / (3 * 210000 * ((3 * 26 ** 3) / 12)));

// Threading: the worked examples.
const passes = mode("thread-infeed", 0).table!.rows({ ap: 0.94, nap: 6 });
[0.23, 0.42, 0.59, 0.73, 0.84, 0.94].forEach((depth, i) => near(`pass ${i + 1} depth`, passes[i].depth, depth, 0.02));
[0.23, 0.19, 0.17, 0.14, 0.11, 0.1].forEach((infeed, i) => near(`pass ${i + 1} infeed`, passes[i].infeed, infeed, 0.05));
near("lead angle", run("thread-lead-angle", 0, { starts: 1, P: 2, d2: 15 }).phi, (Math.atan(2 / (15 * Math.PI)) * 180) / Math.PI);
near("tap vf", run("tap-speed", 0, { D: 10, vc: 20, P: 1.5 }).vf, 1.5 * ((20 * 1000) / (Math.PI * 10)));
const tap = run("tap-torque", 0, { P: 1.5, D: 10, kc1: 2000, n: 640 });
near("tap Md", tap.Md, 5.625);
near("tap power kW", tap.Pw, (5.625 * 2 * Math.PI * 640) / 60 / 1000);
near("M10 cutting", run("tap-hole", 0, { TD: 10, P: 1.5 }).D, 8.5);
near("M10 forming", run("tap-hole", 1, { TD: 10, P: 1.5 }).D, 9.25);
near("1/4-20 cutting", out(run("tap-hole", 0, { TD: inch(0.25, "length"), P: inch(20, "pitch") }, "inch").D, "length"), 0.2013);
near("1/4-20 forming", out(run("tap-hole", 1, { TD: inch(0.25, "length"), P: inch(20, "pitch") }, "inch").D, "length"), 0.2245);
near("M8 68% cutting", run("tap-hole-height", 0, { TD: 8, P: 1.25, TH: 68 }).D, 6.896);
near("M8 68% forming", run("tap-hole-height", 1, { TD: 8, P: 1.25, TH: 68 }).D, 7.422);
near("1/4-20 65% cutting", out(run("tap-hole-height", 0, { TD: inch(0.25, "length"), P: inch(20, "pitch"), TH: 65 }).D, "length"), 0.2078);
near("1/4-20 65% forming", out(run("tap-hole-height", 1, { TD: inch(0.25, "length"), P: inch(20, "pitch"), TH: 65 }).D, "length"), 0.2279);
near("thread height", run("thread-height", 0, { TD: 8, P: 1.25, core: 6.9 }).TH, 68, 0.01);

// Milling.
near("vf", run("milling-feed", 0, { fz: 0.1, n: 1000, zc: 4 }).vf, 400);
near("fz", run("milling-feed", 1, { vf: 400, n: 1000, zc: 4 }).fz, 0.1);
near("milling Q", run("milling-mrr", 0, { ap: 2, ae: 10, vf: 500 }).Q, 10);
near("milling Q inch", out(run("milling-mrr", 0, { ap: inch(0.1, "length"), ae: inch(0.5, "length"), vf: inch(20, "feedMin") }).Q, "mrr"), 0.1 * 0.5 * 20);
const slot = run("milling-power", 0, { ae: 20, ap: 2, fz: 0.1, n: 1000, zc: 4, Dcap: 20, kapr: 90, ...steel });
near("slot hm = 2·fz/π", slot.kc, 1775 * ((2 * 0.1) / Math.PI) ** -0.24);
near("milling Pc", slot.Pc, (20 * 2 * 400 * slot.kc) / 60e6);
near("milling Mc", slot.Mc, (slot.Pc * 30e3) / (Math.PI * 1000));
near("milling Mc inch", out(slot.Mc, "torque"), (out(slot.Pc, "power") * 16501) / (Math.PI * 1000));
near("milling Pc inch", out(slot.Pc, "power"), (out(20, "length") * out(2, "length") * out(400, "feedMin") * out(slot.kc, "stress")) / 396e3);
const straight = run("milling-cutter", 0, { Dc: 50, ap: 2, kapr: 45, ae: 40, hex: 0.1 });
near("straight Dcap", straight.Dcap, 54);
near("straight fz", straight.fz, 0.1 / Math.sin(rad(45)));
near("round fz face = hex/sin κ", run("milling-cutter", 1, { Dc: 40, iC: 12, ap: 6, ae: 40, hex: 0.1 }).fz, 0.1);
near("ball Dcap", run("milling-cutter", 2, { D3: 12, ap: 1, ae: 1, hex: 0.1 }).Dcap, Math.sqrt(144 - 100));
const internal = run("milling-circular", 0, { Dm: 50, Dw: 40, Dcap: 20, n: 1000, hex: 0.1, zc: 3 });
near("internal ae", internal.aeEff, 7.5);
near("internal fz", internal.fz, 0.1 / Math.sin(Math.acos(1 - 15 / 20)));
near("internal vf", internal.vf, (internal.vfm * 30) / 50);
near("solid fz", run("milling-circular", 0, { Dm: 50, Dw: 0, Dcap: 20, n: 1000, hex: 0.1, zc: 3 }).fz, 0.1);
const external = run("milling-circular", 1, { Dm: 50, Dw: 60, Dcap: 20, n: 1000, hex: 0.1, zc: 3 });
near("external ae", external.aeEff, (3600 - 2500) / (4 * 70));
near("external vf", external.vf, (external.vfm * 70) / 50);

// Drilling.
near("drill Q", run("drilling-mrr", 0, { Dc: 20, fn: 0.2, vc: 200 }).Q, 200);
near("drill Q from geometry", run("drilling-mrr", 0, { Dc: 20, fn: 0.2, vc: 200 }).Q, ((Math.PI / 4) * 400 * 0.2 * ((200 * 1000) / (Math.PI * 20))) / 1000);
near("drill Q inch", out(run("drilling-mrr", 0, { Dc: inch(1, "length"), fn: inch(0.01, "feedRev"), vc: inch(500, "cutSpeed") }).Q, "mrr"), 1 * 0.01 * 500 * 3);
const drill = run("drilling-power", 0, { Dc: 20, fn: 0.2, vc: 200, zc: 2, kapr: 70, ...steel });
near("drill kc", drill.kc, 1775 * (0.1 * Math.sin(rad(70))) ** -0.24);
near("drill Pc", drill.Pc, (0.2 * 200 * 20 * drill.kc) / 240e3);
near("drill Pc inch", out(drill.Pc, "power"), (out(0.2, "feedRev") * out(200, "cutSpeed") * out(20, "length") * out(drill.kc, "stress")) / 132e3);
near("drill Ff", drill.Ff, 0.5 * drill.kc * 10 * 0.2 * Math.sin(rad(70)));
const life = run("drilling-tool-life", 0, { TL: 15, depth: 50, fn: 0.2, n: 3184 });
near("tool life holes", life.holes, 300);
near("tool life min", life.minutes, 23.55);

// Boring.
near("boring fn", run("boring-feed", 0, { zc: 2, fz: 0.15, n: 1000 }).fn, 0.3);
near("boring vf", run("boring-feed", 0, { zc: 2, fz: 0.15, n: 1000 }).vf, 300);
const bore = run("boring-power", 0, { vc: 200, ap: 2, fn: 0.2, Dc: 60, zc: 1, kapr: 90, ...steel });
near("boring Pc", bore.Pc, ((200 * 2 * 0.2 * bore.kc) / 60e3) * (1 - 2 / 60));
near("boring Mc", bore.Mc, (bore.Pc * 30e3) / (Math.PI * ((200 * 1000) / (Math.PI * 60))));

console.log(failed ? `${failed} FAILED` : "All passed");
process.exit(failed ? 1 : 0);

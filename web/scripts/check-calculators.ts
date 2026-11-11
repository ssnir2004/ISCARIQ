// Checks the calculators against worked examples and the inch formulas.
// Run from the repo root: npx tsx web/scripts/check-calculators.ts
import { CALCULATOR_TABS, fromMetric, toMetric, type Values } from "../src/lib/calculators";

let failed = 0;
function near(name: string, actual: number, expected: number, tolerance = 0.002) {
  const ok = Math.abs(actual - expected) <= Math.abs(expected) * tolerance;
  if (!ok) failed++;
  console.log(`${ok ? "ok  " : "FAIL"} ${name}: ${actual} (expected ${expected})`);
}
function run(id: string, mode: number, values: Values) {
  const calculator = CALCULATOR_TABS.flatMap((t) => t.calculators).find((c) => c.id === id);
  if (!calculator) throw new Error(`No calculator ${id}`);
  return calculator.modes[mode].compute(values);
}

// Turning, metric.
near("vc", run("turning-speed", 0, { Dm: 100, n: 1000 }).vc, 314.159);
near("n", run("turning-speed", 1, { Dm: 100, vc: 200 }).n, 636.62);
near("Q", run("turning-mrr", 0, { vc: 200, ap: 2, fn: 0.25 }).Q, 100);
near("Tc", run("turning-time", 0, { lm: 100, fn: 0.25, n: 1000 }).Tc, 0.4);
const power = run("turning-power", 0, { vc: 200, ap: 2, fn: 0.4, kapr: 90, rake: 0, kc1: 1775, mc: 0.24 });
near("kc", power.kc, 1775 * 0.4 ** -0.24);
near("Pc", power.Pc, (200 * 2 * 0.4 * power.kc) / 60e3);
// At 75° the chip thins: Ft = kc0.4 · (0.4 / (fn · sin KAPR))^mc · fn · ap.
const kc04 = 1775 * 0.4 ** -0.24;
near("Ft", run("turning-force", 0, { ap: 2, fn: 0.3, kapr: 75, rake: 0, kc1: 1775, mc: 0.24 }).Ft, kc04 * (0.4 / (0.3 * Math.sin((75 * Math.PI) / 180))) ** 0.24 * 0.3 * 2);

// Turning, inch: the metric computation, converted, must match the inch formulas.
const vcFt = 800;
const apIn = 0.1;
const fnIn = 0.012;
const dIn = 4;
const rpm = 764;
const vcM = toMetric(vcFt, "cutSpeed", "inch");
const apM = toMetric(apIn, "length", "inch");
const fnM = toMetric(fnIn, "feedRev", "inch");
near("vc inch", fromMetric(run("turning-speed", 0, { Dm: toMetric(dIn, "length", "inch"), n: rpm }).vc, "cutSpeed", "inch"), (Math.PI * dIn * rpm) / 12);
near("n inch", run("turning-speed", 1, { Dm: toMetric(dIn, "length", "inch"), vc: vcM }).n, (vcFt * 12) / (Math.PI * dIn));
near("Q inch", fromMetric(run("turning-mrr", 0, { vc: vcM, ap: apM, fn: fnM }).Q, "mrr", "inch"), vcFt * apIn * fnIn * 12);
const inchPower = run("turning-power", 0, { vc: vcM, ap: apM, fn: fnM, kapr: 90, rake: 0, kc1: 1775, mc: 0.24 });
near("Pc inch", fromMetric(inchPower.Pc, "power", "inch"), (vcFt * apIn * fnIn * fromMetric(inchPower.kc, "stress", "inch")) / 33e3);

console.log(failed ? `${failed} FAILED` : "All passed");
process.exit(failed ? 1 : 0);

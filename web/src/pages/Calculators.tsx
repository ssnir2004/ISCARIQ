import { useEffect, useState } from "react";
import { Navigate, NavLink, useParams } from "react-router-dom";
import { Card, Input, Label, PageHeader, Select } from "../components/ui";
import { CALCULATOR_TABS, DIMS, fromMetric, toMetric, type Calculator, type Mode, type Units } from "../lib/calculators";
import { DEFAULT_KC_MATERIAL, KC_MATERIALS } from "../lib/kcMaterials";
import { iso513Label } from "../lib/npaKnowledgeConstants";
import type { Iso513Group } from "../lib/types";

// Machining calculators: a tab per application, one unit switch for all.

const LAST_TAB_KEY = "iscariq.calculators.tab";
const UNITS_KEY = "iscariq.calculators.units";
const GROUPS: Iso513Group[] = ["P", "M", "K", "N", "S", "H"];

const readStorage = (key: string) => {
  try {
    return localStorage.getItem(key);
  } catch {
    return null;
  }
};
const writeStorage = (key: string, value: string) => {
  try {
    localStorage.setItem(key, value);
  } catch {
    // storage unavailable: it just isn't remembered
  }
};

const shown = (value: number) => String(Number(value.toPrecision(5)));
const formatted = (value: number) => value.toLocaleString("en-US", { maximumSignificantDigits: 5 });

function defaults(mode: Mode, units: Units) {
  return Object.fromEntries(mode.inputs.map((f) => [f.key, shown(fromMetric(f.value, f.dim, units))]));
}

function ModeForm({ mode, units }: { mode: Mode; units: Units }) {
  const [state, setState] = useState(() => ({ units, values: defaults(mode, units) }));
  const [materialId, setMaterialId] = useState(DEFAULT_KC_MATERIAL.id);

  // On a unit switch, the typed values are converted to the new units.
  let { values } = state;
  if (state.units !== units) {
    values = Object.fromEntries(
      mode.inputs.map((f) => {
        const typed = Number(state.values[f.key]);
        return [f.key, state.values[f.key] === "" || !Number.isFinite(typed) ? state.values[f.key] : shown(fromMetric(toMetric(typed, f.dim, state.units), f.dim, units))];
      }),
    );
    setState({ units, values });
  }

  const setValue = (key: string, value: string) => setState((s) => ({ ...s, values: { ...s.values, [key]: value } }));

  const pickMaterial = (id: string) => {
    setMaterialId(id);
    const material = KC_MATERIALS.find((m) => m.id === id);
    if (material) setState((s) => ({ ...s, values: { ...s.values, kc1: shown(fromMetric(material.kc1, "stress", units)), mc: String(material.mc) } }));
  };

  // Results only when every field holds a usable number.
  const metric: Record<string, number> = {};
  const valid = mode.inputs.every((f) => {
    const typed = Number(values[f.key]);
    metric[f.key] = toMetric(typed, f.dim, units);
    return values[f.key].trim() !== "" && Number.isFinite(typed) && (f.signed || typed > 0);
  });
  const results = valid ? mode.compute(metric) : null;

  return (
    <div className="flex flex-1 flex-col gap-3">
      {mode.usesMaterial && (
        <div>
          <Label>Material</Label>
          <Select value={materialId} onChange={(e) => pickMaterial(e.target.value)} data-calculator-material>
            {GROUPS.map((group) => (
              <optgroup key={group} label={iso513Label(group)}>
                {KC_MATERIALS.filter((m) => m.group === group).map((m) => (
                  <option key={m.id} value={m.id}>
                    {m.name}
                  </option>
                ))}
              </optgroup>
            ))}
          </Select>
        </div>
      )}
      <div className="grid grid-cols-2 gap-3">
        {mode.inputs.map((f) => (
          <div key={f.key} title={f.label}>
            <Label>
              <span className="font-semibold">{f.symbol}</span> {f.label}
              {DIMS[f.dim][units] && ` (${DIMS[f.dim][units]})`}
            </Label>
            <Input type="number" step="any" value={values[f.key]} onChange={(e) => setValue(f.key, e.target.value)} data-calculator-input={f.key} />
          </div>
        ))}
      </div>
      <div className="mt-auto space-y-1 rounded-lg bg-blue-50 px-3 py-2 dark:bg-blue-900/20">
        {mode.results.map((r) => {
          const value = results?.[r.key];
          return (
            <div key={r.key} className="flex items-baseline justify-between gap-3" data-calculator-result={r.key}>
              <span className="text-xs text-neutral-600 dark:text-neutral-300">
                <span className="font-semibold">{r.symbol}</span> {r.label}
              </span>
              <span className="text-lg font-bold whitespace-nowrap text-blue-700 dark:text-blue-300">
                {value !== undefined && Number.isFinite(value) ? `${formatted(fromMetric(value, r.dim, units))} ${DIMS[r.dim][units]}` : "—"}
              </span>
            </div>
          );
        })}
      </div>
      <div className="font-mono text-xs text-neutral-500 dark:text-neutral-400">
        {mode.formula[units].map((line) => (
          <div key={line}>{line}</div>
        ))}
      </div>
      {mode.note && <p className="text-xs text-neutral-500 dark:text-neutral-400">{mode.note}</p>}
    </div>
  );
}

function CalculatorCard({ calculator, units }: { calculator: Calculator; units: Units }) {
  const [index, setIndex] = useState(0);
  return (
    <Card className="flex flex-col gap-3 p-4" data-calculator={calculator.id}>
      <div className="flex flex-wrap items-center justify-between gap-2">
        <h3 className="font-semibold text-neutral-900 dark:text-neutral-100">{calculator.title}</h3>
        {calculator.modes.length > 1 && (
          <div className="flex gap-1">
            {calculator.modes.map((m, i) => (
              <button
                key={m.label}
                type="button"
                onClick={() => setIndex(i)}
                className={`rounded-md px-2 py-0.5 text-xs font-medium ${
                  i === index ? "bg-blue-600 text-white" : "bg-neutral-100 text-neutral-700 hover:bg-neutral-200 dark:bg-neutral-800 dark:text-neutral-300 dark:hover:bg-neutral-700"
                }`}
              >
                {m.label}
              </button>
            ))}
          </div>
        )}
      </div>
      <ModeForm key={index} mode={calculator.modes[index]} units={units} />
    </Card>
  );
}

export function Calculators() {
  const { slug } = useParams();
  const tab = CALCULATOR_TABS.find((t) => t.slug === slug);
  const [units, setUnits] = useState<Units>(() => (readStorage(UNITS_KEY) === "inch" ? "inch" : "metric"));

  useEffect(() => {
    if (tab) writeStorage(LAST_TAB_KEY, tab.slug);
  }, [tab]);

  if (!tab) {
    const last = readStorage(LAST_TAB_KEY);
    return <Navigate to={`/calculators/${CALCULATOR_TABS.some((t) => t.slug === last) ? last : CALCULATOR_TABS[0].slug}`} replace />;
  }

  const pickUnits = (next: Units) => {
    setUnits(next);
    writeStorage(UNITS_KEY, next);
  };

  return (
    <div>
      <PageHeader
        title="Calculators"
        action={
          <div className="flex gap-1" role="group" aria-label="Units">
            {(["metric", "inch"] as const).map((u) => (
              <button
                key={u}
                type="button"
                onClick={() => pickUnits(u)}
                aria-pressed={u === units}
                className={`rounded-lg border px-4 py-1.5 text-sm font-medium ${
                  u === units
                    ? "border-blue-600 bg-blue-600 text-white"
                    : "border-neutral-300 text-neutral-700 hover:bg-neutral-100 dark:border-neutral-700 dark:text-neutral-300 dark:hover:bg-neutral-800"
                }`}
              >
                {u === "metric" ? "Metric" : "Inch"}
              </button>
            ))}
          </div>
        }
      />
      <div role="tablist" aria-label="Applications" className="mb-4 flex flex-wrap gap-2">
        {CALCULATOR_TABS.map((t) => (
          <NavLink
            key={t.slug}
            to={`/calculators/${t.slug}`}
            role="tab"
            aria-selected={t.slug === tab.slug}
            className={`rounded-lg border px-4 py-2 text-sm font-medium ${
              t.slug === tab.slug
                ? "border-blue-600 bg-blue-600 text-white"
                : "border-neutral-300 text-neutral-700 hover:bg-neutral-100 dark:border-neutral-700 dark:text-neutral-300 dark:hover:bg-neutral-800"
            }`}
          >
            {t.label}
          </NavLink>
        ))}
      </div>
      <div className="grid items-stretch gap-4 md:grid-cols-2 xl:grid-cols-3">
        {tab.calculators.map((c) => (
          <CalculatorCard key={c.id} calculator={c} units={units} />
        ))}
      </div>
    </div>
  );
}

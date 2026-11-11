import { useEffect, useMemo, useState } from "react";
import katex from "katex";
import "katex/dist/katex.min.css";
import { Navigate, NavLink, useParams } from "react-router-dom";
import { Card, Input, Label, PageHeader, Select } from "../components/ui";
import { CALCULATOR_TABS, DIMS, fromMetric, toMetric, type Calculator, type CalculatorTab, type Mode, type Units } from "../lib/calculators";
import { DEFAULT_KC_MATERIAL, KC_MATERIALS } from "../lib/kcMaterials";
import { iso513Label } from "../lib/npaKnowledgeConstants";
import type { Iso513Group } from "../lib/types";

// Machining calculators: a tab per application, one unit switch for all.

const LAST_TAB_KEY = "iscariq.calculators.tab";
const UNITS_KEY = "iscariq.calculators.units";
const FORMULAS_KEY = "iscariq.calculators.formulas";
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
  const results = valid ? mode.compute(metric, units) : null;
  const rows = valid && mode.table ? mode.table.rows(metric) : [];

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
      {mode.results.length > 0 && (
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
      )}
      {mode.table && (
        <div className="mt-auto overflow-x-auto rounded-lg bg-blue-50 px-3 py-2 dark:bg-blue-900/20" data-calculator-table>
          {rows.length === 0 ? (
            <p className="text-center text-lg font-bold text-blue-700 dark:text-blue-300">—</p>
          ) : (
            <table className="w-full text-sm">
              <thead>
                <tr className="text-xs text-neutral-600 dark:text-neutral-300">
                  {mode.table.columns.map((c) => (
                    <th key={c.key} className="py-1 text-right font-semibold first:text-left">
                      {c.label}
                      {DIMS[c.dim][units] && ` (${DIMS[c.dim][units]})`}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {rows.map((row, i) => (
                  <tr key={i} className="font-semibold text-blue-700 dark:text-blue-300">
                    {mode.table!.columns.map((c) => (
                      <td key={c.key} className="py-0.5 text-right first:text-left">
                        {formatted(fromMetric(row[c.key], c.dim, units))}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      )}
      {mode.note && <p className="text-xs text-neutral-500 dark:text-neutral-400">{mode.note}</p>}
    </div>
  );
}

function Tex({ source }: { source: string }) {
  const html = useMemo(() => katex.renderToString(`\\displaystyle ${source}`, { throwOnError: false }), [source]);
  return <span dangerouslySetInnerHTML={{ __html: html }} />;
}

// The tab's formulas by calculator; a line already shown by an earlier
// calculator (the kc formula, say) isn't repeated.
function formulasOf(tab: CalculatorTab, units: Units) {
  const seen = new Set<string>();
  return tab.calculators.flatMap((c) => {
    const groups = c.modes
      .map((m) => {
        const label = m.label?.includes("→") ? undefined : m.label;
        const lines = m.formula[units].filter((line) => !seen.has(line));
        // Modes shown without a label read as one list, so they don't repeat either.
        if (!label) lines.forEach((line) => seen.add(line));
        return { label, lines };
      })
      .filter((g) => g.lines.length > 0);
    c.modes.forEach((m) => m.formula[units].forEach((line) => seen.add(line)));
    return groups.length > 0 ? [{ id: c.id, title: c.title, groups }] : [];
  });
}

function FormulaPanel({ tab, units }: { tab: CalculatorTab; units: Units }) {
  const [open, setOpen] = useState(() => readStorage(FORMULAS_KEY) !== "hidden");
  const toggle = () => {
    setOpen(!open);
    writeStorage(FORMULAS_KEY, open ? "hidden" : "shown");
  };
  return (
    <Card className="mb-4 p-4" data-calculator-formulas>
      <div className="flex items-center justify-between">
        <h2 className="font-semibold text-neutral-900 dark:text-neutral-100">Formulas</h2>
        <button type="button" onClick={toggle} className="text-xs font-medium text-blue-600 hover:underline dark:text-blue-400">
          {open ? "Hide" : "Show"}
        </button>
      </div>
      {open && (
        <div className="mt-3 gap-8 md:columns-2 xl:columns-3">
          {formulasOf(tab, units).map((f) => (
            <section key={f.id} className="mb-5 min-w-0 break-inside-avoid border-l-2 border-blue-200 pl-3 dark:border-blue-900">
              <h3 className="mb-2 text-xs font-semibold tracking-wide text-blue-700 uppercase dark:text-blue-300">{f.title}</h3>
              <div className="space-y-3">
                {f.groups.map((g, i) => (
                  <div key={i} className="space-y-2">
                    {g.label && <p className="text-xs font-semibold text-neutral-500 dark:text-neutral-400">{g.label}</p>}
                    {g.lines.map((line) => (
                      <div key={line} className="overflow-x-auto overflow-y-hidden py-0.5 whitespace-nowrap text-neutral-800 dark:text-neutral-100">
                        <Tex source={line} />
                      </div>
                    ))}
                  </div>
                ))}
              </div>
            </section>
          ))}
        </div>
      )}
    </Card>
  );
}

// The card's own formula. Modes that only change the formula's subject
// (n → vc, vc → n) share the first mode's formula.
function CardFormula({ calculator, index, units }: { calculator: Calculator; index: number; units: Units }) {
  const mode = calculator.modes[index];
  const lines = (mode.label?.includes("→") ? calculator.modes[0] : mode).formula[units];
  if (lines.length === 0) return null;
  return (
    <div className="space-y-1.5 rounded-lg border border-neutral-200 bg-neutral-50 px-3 py-2 text-sm text-neutral-800 dark:border-neutral-700 dark:bg-neutral-800/50 dark:text-neutral-100" data-calculator-card-formula>
      {lines.map((line) => (
        <div key={line} className="overflow-x-auto overflow-y-hidden py-0.5 whitespace-nowrap">
          <Tex source={line} />
        </div>
      ))}
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
      <CardFormula calculator={calculator} index={index} units={units} />
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
      <FormulaPanel tab={tab} units={units} />
      <div className="grid items-stretch gap-4 md:grid-cols-2 xl:grid-cols-3">
        {tab.calculators.map((c) => (
          <CalculatorCard key={c.id} calculator={c} units={units} />
        ))}
      </div>
    </div>
  );
}

import { useEffect, useState, type ReactNode } from "react";
import { Link } from "react-router-dom";
import { Button, Input } from "./ui";
import { api, ApiError } from "../lib/api";

// A selection guide for an application on the Solutions screen (e.g. Parting:
// which tool to choose by part diameter), kept as an app setting
// ("guide.app.<application id>") and editable here. Each segment covers a
// diameter range (e.g. Miniature & Medical Industry, up to Ø32) with either
// columns of tools by priority per diameter (tools[0] = first choice) or a
// list of products with their maximum diameter. Brands link to their page.

export interface GuideTool {
  name: string;
  // The Solutions brand it belongs to when the name differs (e.g. "PENTA-CUT" for "PENTA-CUT 17").
  brand?: string;
  width?: string;
  note?: string;
  isNew?: boolean;
  // Products only: the largest part diameter (mm).
  maxDia?: number;
}
interface GuideColumn {
  label: string;
  // The largest part diameter (mm) of the column.
  upTo: number;
  tools: GuideTool[];
}
interface GuideSegment {
  title: string;
  from: number;
  to: number;
  columns?: GuideColumn[];
  products?: GuideTool[];
}
export interface GuideData {
  title: string;
  segments: GuideSegment[];
  table?: { title: string; note?: string; rows: [string, string][] };
}

const guideKey = (applicationId: string) => `guide.app.${applicationId}`;
// Brand names match ignoring case, spaces and dashes (PENTACUT = PENTA-CUT).
const brandKey = (name: string) => name.toUpperCase().replace(/[^A-Z0-9]/g, "");
const toolBrand = (t: GuideTool) => brandKey(t.brand || t.name);

const OPEN_KEY = "iscariq.guide.open.";
const PRIORITY = ["1st · First choice", "2nd", "3rd", "4th", "5th", "6th"];

const fmt = (n: number) => String(Number(n.toFixed(2)));

// The insert width for parting a bar of diameter d from the width table
// (rows like ["Ø5–22 mm", "DOC / 5"]): the depth of cut is from the bar's
// outside to its center (d / 2), divided by the factor of d's row (the last
// row starting at or below d; the first or last row outside the table).
function widthRule(rows: [string, string][], d: number) {
  const parsed = rows
    .map(([range, rule], row) => {
      const r = range.match(/(\d+(?:\.\d+)?)\s*[–-]\s*(\d+(?:\.\d+)?)/);
      const f = rule.match(/\/\s*(\d+(?:\.\d+)?)/);
      return r && f ? { row, from: Number(r[1]), to: Number(r[2]), factor: Number(f[1]) } : null;
    })
    .filter((r): r is NonNullable<typeof r> => r !== null && r.factor > 0)
    .sort((a, b) => a.from - b.from);
  if (parsed.length === 0) return null;
  const hit = [...parsed].reverse().find((r) => r.from <= d) ?? parsed[0];
  const doc = d / 2;
  return { row: hit.row, factor: hit.factor, doc, width: doc / hit.factor, outside: d < parsed[0].from || d > parsed[parsed.length - 1].to };
}

function readOpen(key: string) {
  try {
    return localStorage.getItem(OPEN_KEY + key) !== "0";
  } catch {
    return true;
  }
}

export function SolutionGuide({ applicationId, brands }: { applicationId: string; brands: { id: string; name: string }[] }) {
  const key = guideKey(applicationId);
  const [data, setData] = useState<GuideData | null>(null);
  const [loaded, setLoaded] = useState(false);
  const [open, setOpen] = useState(() => readOpen(key));
  const [segment, setSegment] = useState(0);
  const [diameter, setDiameter] = useState("");
  const [draft, setDraft] = useState<GuideData | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    api
      .get<{ value: string | null }>(`/settings/${key}`)
      .then((r) => setData(r.value ? (JSON.parse(r.value) as GuideData) : null))
      .catch(() => setData(null))
      .finally(() => setLoaded(true));
  }, [key]);

  if (!loaded || !data) return null;
  const shown = draft ?? data;
  const d = Number(diameter);
  const hasD = diameter.trim() !== "" && d > 0;
  const rule = hasD && shown.table ? widthRule(shown.table.rows, d) : null;

  function toggle() {
    setOpen((o) => {
      try {
        localStorage.setItem(OPEN_KEY + key, o ? "0" : "1");
      } catch {
        // not remembered
      }
      return !o;
    });
  }

  // A diameter opens its segment.
  function pickDiameter(text: string) {
    setDiameter(text);
    const v = Number(text);
    if (!(v > 0)) return;
    const i = shown.segments.findIndex((s) => v >= s.from && v <= s.to);
    setSegment(i >= 0 ? i : v > Math.max(...shown.segments.map((s) => s.to)) ? shown.segments.length - 1 : 0);
  }

  async function save() {
    if (!draft) return;
    setError(null);
    try {
      await api.put(`/settings/${key}`, { value: JSON.stringify(draft) });
      setData(draft);
      setDraft(null);
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Failed to save the guide");
    }
  }

  const seg = shown.segments[Math.min(segment, shown.segments.length - 1)];
  const brandOf = (t: GuideTool) => brands.find((b) => brandKey(b.name) === toolBrand(t));

  return (
    <section className="mb-4 rounded-xl border border-neutral-200 bg-white p-3 dark:border-neutral-800 dark:bg-neutral-900" data-solution-guide>
      <div className="flex items-center justify-between gap-2">
        <button type="button" onClick={toggle} className="flex items-center gap-2 text-left font-semibold text-neutral-900 dark:text-neutral-100" aria-expanded={open}>
          <span className="text-xs">{open ? "▼" : "▶"}</span>
          {shown.title}
        </button>
        {open &&
          (draft ? (
            <span className="flex gap-1">
              <Button onClick={save}>Save</Button>
              <Button variant="ghost" onClick={() => setDraft(null)}>
                Cancel
              </Button>
            </span>
          ) : (
            <Button variant="ghost" onClick={() => setDraft(structuredClone(data))}>
              Edit
            </Button>
          ))}
      </div>
      {error && <p className="mt-2 text-sm text-red-600 dark:text-red-400">{error}</p>}
      {open && (
        <div className="mt-3 flex flex-col gap-4 xl:flex-row">
          <div className="min-w-0 flex-1">
            <div className="mb-3 flex flex-wrap items-center gap-2">
              <label className="flex items-center gap-2 text-sm text-neutral-600 dark:text-neutral-300">
                Part Ø (mm)
                <Input type="number" min="0" step="any" value={diameter} onChange={(e) => pickDiameter(e.target.value)} className="w-24" aria-label="Part diameter" />
              </label>
              {rule && (
                <span className="rounded-lg bg-amber-50 px-3 py-1.5 text-sm text-amber-900 dark:bg-amber-950/40 dark:text-amber-200" data-guide-width>
                  Recommended insert width ≈ <span className="font-bold">{fmt(rule.width)} mm</span>{" "}
                  <span className="text-xs opacity-80">
                    (DOC = Ø{fmt(d)} ÷ 2 = {fmt(rule.doc)} mm, ÷ {fmt(rule.factor)}
                    {rule.outside && ", outside the table's range"})
                  </span>
                </span>
              )}
              <div role="tablist" aria-label="Segments" className="flex flex-wrap gap-2">
                {shown.segments.map((s, i) => (
                  <button
                    key={i}
                    type="button"
                    role="tab"
                    aria-selected={s === seg}
                    onClick={() => setSegment(i)}
                    className={`rounded-lg border px-3 py-1.5 text-sm font-medium ${
                      s === seg
                        ? "border-blue-600 bg-blue-600 text-white"
                        : "border-neutral-300 text-neutral-700 hover:bg-neutral-100 dark:border-neutral-700 dark:text-neutral-300 dark:hover:bg-neutral-800"
                    }`}
                  >
                    {s.title} <span className="opacity-75">({s.from > 0 ? `Ø${s.from}–${s.to}` : `up to Ø${s.to}`})</span>
                  </button>
                ))}
              </div>
            </div>
            {draft ? (
              <SegmentEditor
                segment={seg}
                onChange={(next) => setDraft({ ...draft, segments: draft.segments.map((s) => (s === seg ? next : s)) })}
              />
            ) : seg.columns ? (
              <Matrix columns={seg.columns} active={hasD ? seg.columns.find((c) => d <= c.upTo) ?? seg.columns[seg.columns.length - 1] : undefined} brandOf={brandOf} />
            ) : (
              <Products products={seg.products ?? []} diameter={hasD ? d : undefined} brandOf={brandOf} />
            )}
          </div>
          {shown.table && (
            <aside className="shrink-0 xl:w-64" data-guide-table>
              <p className="text-sm font-semibold text-neutral-800 dark:text-neutral-100">{shown.table.title}</p>
              <table className="mt-1 w-full text-sm">
                <tbody>
                  {shown.table.rows.map(([a, b], i) => (
                    <tr key={i} className={`border-t border-neutral-200 dark:border-neutral-800 ${rule?.row === i ? "bg-amber-50 dark:bg-amber-950/40" : ""}`}>
                      <td className="py-1 pr-3 text-neutral-600 dark:text-neutral-300">{a}</td>
                      <td className="py-1 font-semibold whitespace-nowrap text-neutral-900 dark:text-neutral-100">{b}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {shown.table.note && <p className="mt-1 text-xs text-neutral-500 dark:text-neutral-400">{shown.table.note}</p>}
            </aside>
          )}
        </div>
      )}
    </section>
  );
}

function ToolLabel({ tool, brandOf }: { tool: GuideTool; brandOf: (t: GuideTool) => { id: string } | undefined }) {
  const brand = brandOf(tool);
  return (
    <span className="flex flex-wrap items-center gap-1">
      {brand ? (
        <Link to={`/solutions/brand/${brand.id}`} className="font-semibold text-blue-700 hover:underline dark:text-blue-300">
          {tool.name}
        </Link>
      ) : (
        <span className="font-semibold text-neutral-900 dark:text-neutral-100">{tool.name}</span>
      )}
      {tool.isNew && <span className="rounded bg-red-600 px-1 text-[10px] font-bold text-white">NEW</span>}
    </span>
  );
}

function Matrix({ columns, active, brandOf }: { columns: GuideColumn[]; active?: GuideColumn; brandOf: (t: GuideTool) => { id: string } | undefined }) {
  const rows = Math.max(...columns.map((c) => c.tools.length));
  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-[40rem] table-fixed border-collapse text-sm" data-guide-matrix>
        <thead>
          <tr>
            <th className="w-28" />
            {columns.map((c, i) => (
              <th
                key={i}
                className={`rounded-t-lg px-2 py-1.5 text-center font-bold ${c === active ? "bg-blue-600 text-white" : "bg-blue-50 text-blue-800 dark:bg-blue-900/30 dark:text-blue-200"}`}
                data-guide-column={c.label}
              >
                {c.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {Array.from({ length: rows }, (_, r) => (
            <tr key={r}>
              <th className={`py-2 pr-2 text-left text-xs font-semibold ${r === 0 ? "text-red-600 dark:text-red-400" : "text-neutral-500 dark:text-neutral-400"}`}>{PRIORITY[r] ?? `${r + 1}th`}</th>
              {columns.map((c, i) => {
                const t = c.tools[r];
                return (
                  <td key={i} className={`border border-neutral-200 px-2 py-1.5 align-top dark:border-neutral-800 ${c === active ? "bg-blue-50 dark:bg-blue-950/30" : ""} ${r === 0 && t ? "font-medium" : ""}`}>
                    {t && (
                      <div data-guide-tool={t.name}>
                        <ToolLabel tool={t} brandOf={brandOf} />
                        {t.width && <div className="text-xs text-neutral-600 dark:text-neutral-300">{t.width}</div>}
                        {t.note && <div className="text-xs text-neutral-500 dark:text-neutral-400">{t.note}</div>}
                      </div>
                    )}
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function Products({ products, diameter, brandOf }: { products: GuideTool[]; diameter?: number; brandOf: (t: GuideTool) => { id: string } | undefined }) {
  return (
    <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-4" data-guide-products>
      {products.map((p, i) => {
        const fits = diameter === undefined || p.maxDia === undefined || diameter <= p.maxDia;
        return (
          <div
            key={i}
            className={`rounded-lg border p-3 text-sm ${fits ? "border-blue-300 bg-blue-50 dark:border-blue-800 dark:bg-blue-950/30" : "border-neutral-200 opacity-50 dark:border-neutral-800"}`}
            data-guide-product={p.name}
          >
            <ToolLabel tool={p} brandOf={brandOf} />
            {p.width && <div className="text-neutral-700 dark:text-neutral-200">Width {p.width}</div>}
            {p.maxDia !== undefined && <div className="text-neutral-700 dark:text-neutral-200">Up to Ø{p.maxDia} mm</div>}
            {p.note && <div className="text-xs text-neutral-500 dark:text-neutral-400">{p.note}</div>}
          </div>
        );
      })}
    </div>
  );
}

// Editing a segment: its range, columns (label, up to Ø) and each column's
// tools in priority order, or its products.
function SegmentEditor({ segment, onChange }: { segment: GuideSegment; onChange: (s: GuideSegment) => void }) {
  const num = (v: string) => (v.trim() === "" ? 0 : Number(v));
  const setColumns = (columns: GuideColumn[]) => onChange({ ...segment, columns });
  return (
    <div className="space-y-3 text-sm" data-guide-editor>
      <div className="flex flex-wrap gap-2">
        <Field label="Segment">
          <Input value={segment.title} onChange={(e) => onChange({ ...segment, title: e.target.value })} />
        </Field>
        <Field label="From Ø">
          <Input type="number" className="w-20" value={segment.from} onChange={(e) => onChange({ ...segment, from: num(e.target.value) })} />
        </Field>
        <Field label="To Ø">
          <Input type="number" className="w-20" value={segment.to} onChange={(e) => onChange({ ...segment, to: num(e.target.value) })} />
        </Field>
      </div>
      {segment.columns ? (
        <div className="flex gap-2 overflow-x-auto pb-2">
          {segment.columns.map((c, ci) => (
            <div key={ci} className="w-60 shrink-0 space-y-2 rounded-lg border border-neutral-200 p-2 dark:border-neutral-800">
              <div className="flex gap-1">
                <Input value={c.label} aria-label="Column" onChange={(e) => setColumns(segment.columns!.map((x, i) => (i === ci ? { ...x, label: e.target.value } : x)))} />
                <Input
                  type="number"
                  className="w-20"
                  value={c.upTo}
                  aria-label="Up to Ø"
                  title="Up to Ø (mm)"
                  onChange={(e) => setColumns(segment.columns!.map((x, i) => (i === ci ? { ...x, upTo: num(e.target.value) } : x)))}
                />
                <Button variant="ghost" onClick={() => setColumns(segment.columns!.filter((_, i) => i !== ci))} aria-label="Remove column">
                  ✕
                </Button>
              </div>
              <ToolsEditor tools={c.tools} onChange={(tools) => setColumns(segment.columns!.map((x, i) => (i === ci ? { ...x, tools } : x)))} />
            </div>
          ))}
          <Button variant="secondary" onClick={() => setColumns([...segment.columns!, { label: "Ø", upTo: segment.to, tools: [] }])}>
            + Column
          </Button>
        </div>
      ) : (
        <ToolsEditor tools={segment.products ?? []} withMaxDia onChange={(products) => onChange({ ...segment, products })} />
      )}
    </div>
  );
}

function ToolsEditor({ tools, onChange, withMaxDia = false }: { tools: GuideTool[]; onChange: (t: GuideTool[]) => void; withMaxDia?: boolean }) {
  const set = (i: number, patch: Partial<GuideTool>) => onChange(tools.map((t, n) => (n === i ? { ...t, ...patch } : t)));
  const move = (i: number, by: number) => {
    const next = [...tools];
    [next[i], next[i + by]] = [next[i + by], next[i]];
    onChange(next);
  };
  return (
    <div className="space-y-2">
      {tools.map((t, i) => (
        <div key={i} className="space-y-1 rounded border border-neutral-200 p-1.5 dark:border-neutral-800" data-guide-tool-editor>
          <div className="flex items-center gap-1">
            <span className="w-5 text-xs text-neutral-500">{i + 1}</span>
            <Input value={t.name} placeholder="Tool" aria-label="Tool" onChange={(e) => set(i, { name: e.target.value })} />
            <Button variant="ghost" onClick={() => move(i, -1)} disabled={i === 0} aria-label="Move up">
              ↑
            </Button>
            <Button variant="ghost" onClick={() => move(i, 1)} disabled={i === tools.length - 1} aria-label="Move down">
              ↓
            </Button>
            <Button variant="ghost" onClick={() => onChange(tools.filter((_, n) => n !== i))} aria-label="Remove tool">
              ✕
            </Button>
          </div>
          <Input value={t.brand ?? ""} placeholder="Brand (if not the name)" aria-label="Brand" onChange={(e) => set(i, { brand: e.target.value || undefined })} />
          <div className="flex gap-1">
            <Input value={t.width ?? ""} placeholder="Width" aria-label="Width" onChange={(e) => set(i, { width: e.target.value || undefined })} />
            {withMaxDia && (
              <Input
                type="number"
                className="w-24"
                value={t.maxDia ?? ""}
                placeholder="Max Ø"
                aria-label="Max Ø"
                onChange={(e) => set(i, { maxDia: e.target.value === "" ? undefined : Number(e.target.value) })}
              />
            )}
          </div>
          <div className="flex items-center gap-2">
            <Input value={t.note ?? ""} placeholder="Note" aria-label="Note" onChange={(e) => set(i, { note: e.target.value || undefined })} />
            <label className="flex items-center gap-1 text-xs whitespace-nowrap">
              <input type="checkbox" checked={!!t.isNew} onChange={(e) => set(i, { isNew: e.target.checked || undefined })} />
              NEW
            </label>
          </div>
        </div>
      ))}
      <Button variant="secondary" onClick={() => onChange([...tools, { name: "" }])}>
        + Tool
      </Button>
    </div>
  );
}

function Field({ label, children }: { label: string; children: ReactNode }) {
  return (
    <label className="flex flex-col gap-0.5 text-xs text-neutral-500 dark:text-neutral-400">
      {label}
      {children}
    </label>
  );
}

// Where a brand appears in its applications' guides, e.g. "Parting guide ·
// Miniature & Medical Industry: 1st (first choice) up to Ø8, 0.25–3.18mm".
export function GuideMentions({ brandName, applications }: { brandName: string; applications: { id: string; name: string }[] }) {
  const [lines, setLines] = useState<{ app: string; title: string; text: string }[]>([]);
  const ids = applications.map((a) => a.id).join(",");

  useEffect(() => {
    let live = true;
    Promise.all(
      applications.map((a) =>
        api
          .get<{ value: string | null }>(`/settings/${guideKey(a.id)}`)
          .then((r) => ({ app: a, guide: r.value ? (JSON.parse(r.value) as GuideData) : null }))
          .catch(() => ({ app: a, guide: null })),
      ),
    ).then((found) => {
      if (!live) return;
      const me = brandKey(brandName);
      // The tool's own name only when it isn't just the brand (e.g. "PENTA-CUT 17: ").
      const named = (t: GuideTool) => (brandKey(t.name) === me ? "" : `${t.name}: `);
      const out: { app: string; title: string; text: string }[] = [];
      for (const { app, guide } of found) {
        if (!guide) continue;
        for (const s of guide.segments) {
          const parts: string[] = [];
          for (const c of s.columns ?? [])
            c.tools.forEach((t, r) => {
              if (toolBrand(t) === me) parts.push(`${named(t)}${r === 0 ? "1st (first choice)" : (PRIORITY[r] ?? `${r + 1}th`)} for ${c.label}${t.width ? `, ${t.width}` : ""}`);
            });
          for (const p of s.products ?? [])
            if (toolBrand(p) === me) parts.push(`${named(p)}${p.width ? `width ${p.width}` : ""}${p.maxDia !== undefined ? `, up to Ø${p.maxDia}` : ""}`);
          if (parts.length > 0) out.push({ app: app.name, title: `${guide.title} · ${s.title}`, text: parts.join("; ") });
        }
      }
      setLines(out);
    });
    return () => {
      live = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [brandName, ids]);

  if (lines.length === 0) return null;
  return (
    <div className="mt-1 space-y-0.5 rounded-lg bg-blue-50 px-3 py-2 text-xs text-blue-900 dark:bg-blue-950/30 dark:text-blue-200" data-guide-mentions>
      {lines.map((l, i) => (
        <p key={i}>
          <span className="font-semibold">{l.title}:</span> {l.text}
        </p>
      ))}
    </div>
  );
}

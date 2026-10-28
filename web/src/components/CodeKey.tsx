import { useEffect, useRef, useState, type ClipboardEvent, type ReactNode } from "react";
import { api, ApiError } from "../lib/api";
import { DECODERS, findRow, type DecoderName } from "../lib/insertDecoders";
import { Button, Card, Input, Textarea } from "./ui";

// A code key for product designations (e.g. "Code key for CBN inserts"):
// an example designation with each part coloured like its table, and a
// table per part (code -> meaning, with optional details such as use cases,
// and an optional note), plus optional reference tables (e.g. edge
// preparation by grade). Collapsible (remembered), editable here, and stored
// as JSON in an app setting, one per screen (e.g. "codekey.cbn").

export interface CodeKeyData {
  title: string;
  subtitle?: string;
  example: string;
  sections: CodeKeySection[];
  tables?: CodeKeyTable[];
  // A designation decoder shown above the tables (see insertDecoders, e.g.
  // "iso-turning": ISO turning toolholders, sections keyed "p<position>").
  decoder?: DecoderName;
}
interface CodeKeySection {
  title: string;
  // Identifies the part for a decoder (e.g. "p5" = position 5).
  key?: string;
  // This part as it appears in the example (highlighted there), if it does.
  sample?: string;
  // `image`: a small picture of the code (e.g. the insert shape), pasted in.
  rows: { code: string; meaning: string; details?: string; image?: string }[];
  // Shown under the table (e.g. how the code's digits read).
  note?: string;
}
interface CodeKeyTable {
  title: string;
  // Header cells spanning several columns, above the column headers.
  groups?: { label: string; span: number }[];
  columns: string[];
  rows: string[][];
  // How many leading columns merge equal cells of consecutive rows.
  merge?: number;
}

const COLORS = ["#2563eb", "#16a34a", "#d97706", "#9333ea", "#dc2626", "#0891b2", "#be185d", "#4d7c0f"];
const OPEN_KEY = "iscariq.codeKeyOpen.";

function readOpen(key: string, defaultOpen: boolean) {
  try {
    const stored = localStorage.getItem(OPEN_KEY + key);
    return stored === null ? defaultOpen : stored === "1";
  } catch {
    return defaultOpen;
  }
}

// `defaultTitle` names a key not written yet (e.g. "Grade identification key").
// `decoder` adds a designation decoder that reads this key's tables (a key
// can also name its own decoder). `defaultOpen` until the panel is toggled.
export function CodeKey({
  settingKey,
  defaultTitle = "Code key",
  decoder,
  defaultOpen = false,
  decodeText,
}: {
  settingKey: string;
  defaultTitle?: string;
  decoder?: DecoderName;
  defaultOpen?: boolean;
  // A designation the decoder starts with (e.g. picked in a search).
  decodeText?: string;
}) {
  const [data, setData] = useState<CodeKeyData | null>(null);
  const [loaded, setLoaded] = useState(false);
  const [open, setOpen] = useState(() => readOpen(settingKey, defaultOpen));
  const [draft, setDraft] = useState<CodeKeyData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    api
      .get<{ value: string | null }>(`/settings/${settingKey}`)
      .then((r) => setData(r.value ? (JSON.parse(r.value) as CodeKeyData) : null))
      .catch(() => setData(null))
      .finally(() => setLoaded(true));
  }, [settingKey]);

  function toggle() {
    setOpen((o) => {
      try {
        localStorage.setItem(OPEN_KEY + settingKey, o ? "0" : "1");
      } catch {
        // not remembered
      }
      return !o;
    });
  }

  async function save() {
    if (!draft) return;
    setError(null);
    setSaving(true);
    const clean: CodeKeyData = {
      title: draft.title.trim() || defaultTitle,
      subtitle: draft.subtitle?.trim() || undefined,
      example: draft.example.trim(),
      sections: draft.sections
        .filter((s) => s.title.trim())
        .map((s) => ({
          title: s.title.trim(),
          key: s.key?.trim() || undefined,
          sample: s.sample?.trim() || undefined,
          rows: s.rows
            .filter((r) => r.code.trim() || r.meaning.trim())
            .map((r) => ({ code: r.code.trim(), meaning: r.meaning.trim(), details: r.details?.trim() || undefined, image: r.image || undefined })),
          note: s.note?.trim() || undefined,
        })),
      tables: draft.tables?.filter((t) => t.title.trim() || t.rows.length),
      decoder: draft.decoder,
    };
    try {
      await api.put(`/settings/${settingKey}`, { value: JSON.stringify(clean) });
      setData(clean);
      setDraft(null);
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Failed to save the code key");
    } finally {
      setSaving(false);
    }
  }

  if (!loaded) return null;

  return (
    <Card className="mb-4 p-3" data-code-key={settingKey}>
      <div className="flex items-center gap-2">
        <button type="button" onClick={toggle} aria-expanded={open} className="flex flex-1 items-center gap-2 text-left">
          <span className="text-xs text-neutral-500">{open ? "▼" : "▶"}</span>
          <span className="font-semibold text-neutral-900 dark:text-neutral-100">{data?.title ?? defaultTitle}</span>
          {data?.subtitle && <span className="text-xs text-neutral-500 dark:text-neutral-400">{data.subtitle}</span>}
        </button>
        {open && !draft && (
          <Button variant="ghost" onClick={() => setDraft(structuredClone(data ?? { title: defaultTitle, example: "", sections: [] }))} data-code-key-edit>
            {data ? "Edit" : "+ Add code key"}
          </Button>
        )}
      </div>
      {open &&
        (draft ? (
          <CodeKeyEditor draft={draft} setDraft={setDraft} error={error} saving={saving} onSave={save} onCancel={() => setDraft(null)} />
        ) : data ? (
          <CodeKeyView data={data} decoder={decoder ?? data.decoder} decodeText={decodeText} />
        ) : (
          <p className="mt-2 text-sm text-neutral-500 dark:text-neutral-400">No code key yet.</p>
        ))}
    </Card>
  );
}

// The example with each section's sample coloured, found left to right.
function Example({ data }: { data: CodeKeyData }) {
  const parts: ReactNode[] = [];
  let at = 0;
  data.sections.forEach((s, i) => {
    if (!s.sample) return;
    const found = data.example.indexOf(s.sample, at);
    if (found < 0) return;
    if (found > at) parts.push(<span key={`t${i}`}>{data.example.slice(at, found)}</span>);
    parts.push(
      <span key={`s${i}`} className="rounded px-0.5" style={{ color: COLORS[i % COLORS.length], boxShadow: `inset 0 -3px 0 ${COLORS[i % COLORS.length]}` }} title={s.title}>
        {s.sample}
      </span>
    );
    at = found + s.sample.length;
  });
  if (at < data.example.length) parts.push(<span key="end">{data.example.slice(at)}</span>);
  return (
    <div className="my-3 rounded-lg border-2 border-yellow-400 px-4 py-2 font-mono text-2xl font-bold tracking-wide text-neutral-900 dark:text-neutral-100" data-code-key-example>
      {parts}
    </div>
  );
}

function CodeKeyView({ data, decoder, decodeText }: { data: CodeKeyData; decoder?: DecoderName; decodeText?: string }) {
  return (
    <div>
      {data.example && <Example data={data} />}
      {decoder && <Decoder data={data} name={decoder} initial={decodeText} />}
      <div className="grid grid-cols-[repeat(auto-fill,minmax(260px,1fr))] gap-3">
        {data.sections.map((s, i) => (
          <div key={i} className="overflow-hidden rounded-lg border border-neutral-200 dark:border-neutral-700" data-code-key-section={s.title}>
            <div className="px-3 py-1.5 text-sm font-semibold text-white" style={{ backgroundColor: COLORS[i % COLORS.length] }}>
              {s.title}
            </div>
            <table className="w-full text-sm">
              <tbody>
                {s.rows.map((r, n) => (
                  <tr key={n} className="border-t border-neutral-100 first:border-t-0 dark:border-neutral-800">
                    <td className="w-16 px-3 py-1 align-top font-mono font-bold whitespace-nowrap">
                      <span
                        className={r.code && r.code === s.sample ? "rounded-full px-1.5" : ""}
                        style={r.code && r.code === s.sample ? { boxShadow: `0 0 0 2px ${COLORS[i % COLORS.length]}` } : undefined}
                      >
                        {r.code}
                      </span>
                    </td>
                    <td className="px-3 py-1 text-neutral-700 dark:text-neutral-300">
                      {r.image && <img src={r.image} alt={r.code} className="float-right ml-2 h-12 max-w-20 rounded bg-white object-contain" data-code-image />}
                      {r.meaning}
                      {r.details && (
                        <div className="mt-0.5 text-xs leading-snug text-neutral-500 dark:text-neutral-400" data-code-details>
                          {r.details}
                        </div>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {s.note && (
              <p className="border-t border-neutral-100 px-3 py-1.5 text-xs whitespace-pre-line text-neutral-600 dark:border-neutral-800 dark:text-neutral-300" data-code-note>
                {s.note}
              </p>
            )}
          </div>
        ))}
      </div>
      {data.tables?.map((t, i) => <ReferenceTable key={i} table={t} />)}
    </div>
  );
}

// A reference table, e.g. edge preparation by grade: group headers over the
// columns, and equal cells in the first `merge` columns joined down the rows.
function ReferenceTable({ table }: { table: CodeKeyTable }) {
  const merge = table.merge ?? 0;
  const cell = "border border-neutral-200 px-2 py-1 text-center dark:border-neutral-700";
  // Rows a merged cell covers (0 = hidden under the one above): equal to the
  // row above in this and every earlier column.
  const sameUpTo = (a: number, b: number, c: number) => table.rows[a].slice(0, c + 1).every((v, k) => v === table.rows[b][k]);
  const span = (r: number, c: number) => {
    if (c >= merge) return 1;
    if (r > 0 && sameUpTo(r - 1, r, c)) return 0;
    let n = 1;
    while (r + n < table.rows.length && sameUpTo(r + n, r, c)) n++;
    return n;
  };
  return (
    <div className="mt-4" data-code-table={table.title}>
      <h4 className="mb-1.5 text-sm font-semibold text-neutral-900 dark:text-neutral-100">{table.title}</h4>
      <div className="overflow-x-auto">
        <table className="w-full border-collapse text-xs">
          <thead>
            {table.groups && (
              <tr className="bg-neutral-100 dark:bg-neutral-800">
                {table.groups.map((g, i) => (
                  <th key={i} colSpan={g.span} className={`${cell} font-semibold`}>
                    {g.label}
                  </th>
                ))}
              </tr>
            )}
            <tr className="bg-neutral-50 dark:bg-neutral-900">
              {table.columns.map((c, i) => (
                <th key={i} className={`${cell} font-medium whitespace-pre-line`}>
                  {c}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {table.rows.map((row, r) => (
              <tr key={r}>
                {row.map((v, c) => {
                  const n = span(r, c);
                  if (n === 0) return null;
                  return (
                    <td key={c} rowSpan={n > 1 ? n : undefined} className={`${cell} ${c < merge ? "font-semibold" : ""} tabular-nums`}>
                      {v}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// A table as tab-separated text (first line: column headers), so it can be
// pasted from Excel; group headers as "label | span" per line.
const tableToText = (t: CodeKeyTable) => [t.columns, ...t.rows].map((r) => r.join("\t")).join("\n");
const textToRows = (text: string) =>
  text
    .split(/\r?\n/)
    .filter((l) => l.trim())
    .map((l) => l.split("\t").map((v) => v.trim()));
const groupsToText = (t: CodeKeyTable) => (t.groups ?? []).map((g) => `${g.label} | ${g.span}`).join("\n");
const textToGroups = (text: string) =>
  text
    .split(/\r?\n/)
    .map((l) => l.split("|"))
    .filter((p) => p.length === 2 && Number(p[1]) > 0)
    .map(([label, n]) => ({ label: label.trim(), span: Number(n) }));

const small = "rounded px-1.5 text-neutral-500 hover:bg-neutral-100 hover:text-neutral-900 disabled:opacity-30 dark:text-neutral-400 dark:hover:bg-neutral-800 dark:hover:text-neutral-100";

function move<T>(list: T[], from: number, to: number) {
  if (to < 0 || to >= list.length) return list;
  const next = [...list];
  const [item] = next.splice(from, 1);
  next.splice(to, 0, item);
  return next;
}

function CodeKeyEditor({
  draft,
  setDraft,
  error,
  saving,
  onSave,
  onCancel,
}: {
  draft: CodeKeyData;
  setDraft: (d: CodeKeyData) => void;
  error: string | null;
  saving: boolean;
  onSave: () => void;
  onCancel: () => void;
}) {
  const setSection = (i: number, s: CodeKeySection) => setDraft({ ...draft, sections: draft.sections.map((x, n) => (n === i ? s : x)) });

  return (
    <div className="mt-3 space-y-3" data-code-key-editor>
      <div className="grid grid-cols-1 gap-2 md:grid-cols-2">
        <Input value={draft.title} onChange={(e) => setDraft({ ...draft, title: e.target.value })} placeholder="Title" aria-label="Title" />
        <Input value={draft.subtitle ?? ""} onChange={(e) => setDraft({ ...draft, subtitle: e.target.value })} placeholder="Subtitle (optional)" aria-label="Subtitle" />
      </div>
      <Input
        value={draft.example}
        onChange={(e) => setDraft({ ...draft, example: e.target.value })}
        placeholder="Example designation, e.g. CNGA 120408S (N) 2MT MF BI15HC"
        aria-label="Example designation"
        className="font-mono"
      />
      {draft.sections.map((s, i) => (
        <div key={i} className="rounded-lg border-l-4 border-neutral-200 bg-neutral-50 p-2 dark:border-neutral-700 dark:bg-neutral-900/50" style={{ borderLeftColor: COLORS[i % COLORS.length] }} data-code-key-section-editor>
          <div className="flex items-center gap-2">
            <Input value={s.title} onChange={(e) => setSection(i, { ...s, title: e.target.value })} placeholder="Part, e.g. Hand" aria-label="Part title" />
            <Input
              value={s.sample ?? ""}
              onChange={(e) => setSection(i, { ...s, sample: e.target.value })}
              placeholder="In the example, e.g. (N)"
              aria-label="Part in the example"
              className="w-48 font-mono"
            />
            <button type="button" className={small} disabled={i === 0} onClick={() => setDraft({ ...draft, sections: move(draft.sections, i, i - 1) })} aria-label="Move part up">
              ↑
            </button>
            <button type="button" className={small} disabled={i === draft.sections.length - 1} onClick={() => setDraft({ ...draft, sections: move(draft.sections, i, i + 1) })} aria-label="Move part down">
              ↓
            </button>
            <button type="button" className={small} onClick={() => setDraft({ ...draft, sections: draft.sections.filter((_, n) => n !== i) })} aria-label="Remove part">
              ✕
            </button>
          </div>
          <div className="mt-2 space-y-1 pl-3">
            {s.rows.map((r, n) => (
              <div key={n} className="flex items-center gap-2">
                <Input
                  value={r.code}
                  onChange={(e) => setSection(i, { ...s, rows: s.rows.map((x, k) => (k === n ? { ...x, code: e.target.value } : x)) })}
                  placeholder="Code"
                  aria-label="Code"
                  className="w-24 font-mono"
                />
                <Input
                  value={r.meaning}
                  onChange={(e) => setSection(i, { ...s, rows: s.rows.map((x, k) => (k === n ? { ...x, meaning: e.target.value } : x)) })}
                  placeholder="Meaning"
                  aria-label="Meaning"
                />
                <Input
                  value={r.details ?? ""}
                  onChange={(e) => setSection(i, { ...s, rows: s.rows.map((x, k) => (k === n ? { ...x, details: e.target.value } : x)) })}
                  placeholder="Details / use case (optional)"
                  aria-label="Details"
                />
                <PicturePaste value={r.image ?? null} onChange={(image) => setSection(i, { ...s, rows: s.rows.map((x, k) => (k === n ? { ...x, image: image ?? undefined } : x)) })} />
                <button type="button" className={small} disabled={n === 0} onClick={() => setSection(i, { ...s, rows: move(s.rows, n, n - 1) })} aria-label="Move code up">
                  ↑
                </button>
                <button type="button" className={small} disabled={n === s.rows.length - 1} onClick={() => setSection(i, { ...s, rows: move(s.rows, n, n + 1) })} aria-label="Move code down">
                  ↓
                </button>
                <button type="button" className={small} onClick={() => setSection(i, { ...s, rows: s.rows.filter((_, k) => k !== n) })} aria-label="Remove code">
                  ✕
                </button>
              </div>
            ))}
            <Button type="button" variant="ghost" onClick={() => setSection(i, { ...s, rows: [...s.rows, { code: "", meaning: "" }] })}>
              + Add code
            </Button>
            <Textarea
              rows={2}
              value={s.note ?? ""}
              onChange={(e) => setSection(i, { ...s, note: e.target.value })}
              placeholder="Note under the table (optional), e.g. how the code reads"
              aria-label="Note"
            />
          </div>
        </div>
      ))}
      <Button type="button" variant="secondary" onClick={() => setDraft({ ...draft, sections: [...draft.sections, { title: "", rows: [{ code: "", meaning: "" }] }] })}>
        + Add part
      </Button>
      {(draft.tables ?? []).map((t, i) => (
        <TableEditor
          key={i}
          table={t}
          onChange={(next) => setDraft({ ...draft, tables: (draft.tables ?? []).map((x, n) => (n === i ? next : x)) })}
          onRemove={() => setDraft({ ...draft, tables: (draft.tables ?? []).filter((_, n) => n !== i) })}
        />
      ))}
      <Button type="button" variant="secondary" onClick={() => setDraft({ ...draft, tables: [...(draft.tables ?? []), { title: "", columns: [], rows: [] }] })}>
        + Add reference table
      </Button>
      {error && <p className="text-sm text-red-600 dark:text-red-400">{error}</p>}
      <div className="flex gap-2 border-t border-neutral-200 pt-3 dark:border-neutral-700">
        <Button type="button" onClick={onSave} disabled={saving}>
          Save
        </Button>
        <Button type="button" variant="secondary" onClick={onCancel}>
          Cancel
        </Button>
      </div>
    </div>
  );
}

// A reference table edited as text: title, group headers ("label | span" per
// line) and the cells, tab-separated (paste from Excel; first line = headers).
function TableEditor({ table, onChange, onRemove }: { table: CodeKeyTable; onChange: (t: CodeKeyTable) => void; onRemove: () => void }) {
  const [groups, setGroups] = useState(() => groupsToText(table));
  const [cells, setCells] = useState(() => tableToText(table));
  return (
    <div className="space-y-2 rounded-lg border border-neutral-200 p-2 dark:border-neutral-700" data-code-table-editor>
      <div className="flex items-center gap-2">
        <Input value={table.title} onChange={(e) => onChange({ ...table, title: e.target.value })} placeholder="Reference table title" aria-label="Table title" />
        <Input
          type="number"
          min="0"
          className="w-40"
          value={String(table.merge ?? 0)}
          onChange={(e) => onChange({ ...table, merge: Number(e.target.value) || 0 })}
          aria-label="Merged columns"
          title="Leading columns whose equal cells are joined down the rows"
        />
        <button type="button" className={small} onClick={onRemove} aria-label="Remove table">
          ✕
        </button>
      </div>
      <Textarea
        rows={3}
        value={groups}
        onChange={(e) => {
          setGroups(e.target.value);
          onChange({ ...table, groups: textToGroups(e.target.value) });
        }}
        placeholder={"Group headers, one per line: label | columns (optional)\ne.g. Standard | 6"}
        aria-label="Group headers"
        className="font-mono text-xs"
      />
      <Textarea
        rows={8}
        value={cells}
        onChange={(e) => {
          setCells(e.target.value);
          const [columns = [], ...rows] = textToRows(e.target.value);
          onChange({ ...table, columns, rows });
        }}
        placeholder="Paste from Excel: first line = column headers, then one line per row (tab-separated)"
        aria-label="Table cells"
        className="font-mono text-xs"
      />
    </div>
  );
}

// A small picture field for a code: paste (Ctrl+V when focused) or choose a
// file; the picture shows in place, ✕ removes it.
function PicturePaste({ value, onChange }: { value: string | null; onChange: (dataUrl: string | null) => void }) {
  const input = useRef<HTMLInputElement>(null);
  const read = (file: File) => {
    const reader = new FileReader();
    reader.onload = () => onChange(reader.result as string);
    reader.readAsDataURL(file);
  };
  function onPaste(e: ClipboardEvent<HTMLDivElement>) {
    const file = Array.from(e.clipboardData.items)
      .find((i) => i.type.startsWith("image/"))
      ?.getAsFile();
    if (!file) return;
    e.preventDefault();
    read(file);
  }
  return (
    <div className="flex shrink-0 items-center gap-1" data-code-picture>
      <div
        tabIndex={0}
        onPaste={onPaste}
        onClick={() => input.current?.click()}
        title="Picture: click, then Ctrl+V to paste — or choose a file"
        className="flex h-9 w-14 cursor-pointer items-center justify-center overflow-hidden rounded border border-dashed border-neutral-300 bg-white text-[10px] text-neutral-400 outline-none focus:border-blue-500 dark:border-neutral-600"
      >
        {value ? <img src={value} alt="" className="h-full w-full object-contain" /> : "Picture"}
      </div>
      {value && (
        <button type="button" className={small} onClick={() => onChange(null)} aria-label="Remove picture">
          ✕
        </button>
      )}
      <input ref={input} type="file" accept="image/*" className="hidden" onChange={(e) => e.target.files?.[0] && read(e.target.files[0])} />
    </div>
  );
}

// Type a designation (e.g. MWLNR 2525M-08W) to see each position's meaning.
function Decoder({ data, name, initial = "" }: { data: CodeKeyData; name: DecoderName; initial?: string }) {
  const [text, setText] = useState(initial);
  const { decode, examples } = DECODERS[name];
  const result = text.trim() ? decode(text) : null;
  return (
    <div className="mb-3 rounded-lg border border-blue-200 bg-blue-50/50 p-3 dark:border-blue-900 dark:bg-blue-950/20" data-code-decoder>
      <Input
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder={`Decode a designation, e.g. ${examples}`}
        aria-label="Designation to decode"
        className="max-w-xl font-mono"
      />
      {text.trim() && !result && (
        <p className="mt-2 text-sm text-red-600 dark:text-red-400">Can't read this designation (e.g. {examples}).</p>
      )}
      {result && (
        <div className="mt-2">
          <p className="mb-1 text-xs font-semibold text-neutral-600 dark:text-neutral-300">{result.kind}</p>
          <table className="text-sm" data-decoded>
            <tbody>
              {result.parts.map((p, n) => {
                const index = data.sections.findIndex((s) => (p.key && s.key === p.key) || (p.title && s.title === p.title));
                const section = data.sections[index];
                const row = section ? findRow(section.rows, p.lookup ?? p.code) : undefined;
                const known = !!p.text || !!row;
                return (
                  <tr key={n} className="border-t border-neutral-200 first:border-t-0 dark:border-neutral-800" data-decoded-part={p.key ?? p.title ?? "base"}>
                    <td className="py-1 pr-3 font-mono font-bold" style={{ color: index >= 0 ? COLORS[index % COLORS.length] : undefined }}>
                      {p.code}
                    </td>
                    <td className="py-1 pr-3 text-neutral-500 dark:text-neutral-400">{section?.title ?? p.title ?? ""}</td>
                    <td className={`py-1 ${known ? "text-neutral-800 dark:text-neutral-100" : "text-red-600 dark:text-red-400"}`}>
                      {p.text ?? row?.meaning ?? "Unknown code"}
                    </td>
                    <td className="py-1 pl-2">{row?.image && <img src={row.image} alt="" className="h-10 max-w-16 rounded bg-white object-contain" />}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

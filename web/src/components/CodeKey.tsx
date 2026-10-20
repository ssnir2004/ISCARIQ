import { useEffect, useState, type ReactNode } from "react";
import { api, ApiError } from "../lib/api";
import { Button, Card, Input } from "./ui";

// A code key for product designations (e.g. "Code key for CBN inserts"):
// an example designation with each part coloured like its table, and a
// table per part (code -> meaning). Collapsible (remembered), editable here,
// and stored as JSON in an app setting, one per screen (e.g. "codekey.cbn").

export interface CodeKeyData {
  title: string;
  subtitle?: string;
  example: string;
  sections: CodeKeySection[];
}
interface CodeKeySection {
  title: string;
  // This part as it appears in the example (highlighted there), if it does.
  sample?: string;
  rows: { code: string; meaning: string }[];
}

const COLORS = ["#2563eb", "#16a34a", "#d97706", "#9333ea", "#dc2626", "#0891b2", "#be185d", "#4d7c0f"];
const OPEN_KEY = "iscariq.codeKeyOpen.";

function readOpen(key: string) {
  try {
    return localStorage.getItem(OPEN_KEY + key) === "1";
  } catch {
    return false;
  }
}

export function CodeKey({ settingKey }: { settingKey: string }) {
  const [data, setData] = useState<CodeKeyData | null>(null);
  const [loaded, setLoaded] = useState(false);
  const [open, setOpen] = useState(() => readOpen(settingKey));
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
      title: draft.title.trim() || "Code key",
      subtitle: draft.subtitle?.trim() || undefined,
      example: draft.example.trim(),
      sections: draft.sections
        .filter((s) => s.title.trim())
        .map((s) => ({
          title: s.title.trim(),
          sample: s.sample?.trim() || undefined,
          rows: s.rows.filter((r) => r.code.trim() || r.meaning.trim()).map((r) => ({ code: r.code.trim(), meaning: r.meaning.trim() })),
        })),
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
          <span className="font-semibold text-neutral-900 dark:text-neutral-100">{data?.title ?? "Code key"}</span>
          {data?.subtitle && <span className="text-xs text-neutral-500 dark:text-neutral-400">{data.subtitle}</span>}
        </button>
        {open && !draft && (
          <Button variant="ghost" onClick={() => setDraft(structuredClone(data ?? { title: "Code key", example: "", sections: [] }))} data-code-key-edit>
            {data ? "Edit" : "+ Add code key"}
          </Button>
        )}
      </div>
      {open &&
        (draft ? (
          <CodeKeyEditor draft={draft} setDraft={setDraft} error={error} saving={saving} onSave={save} onCancel={() => setDraft(null)} />
        ) : data ? (
          <CodeKeyView data={data} />
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

function CodeKeyView({ data }: { data: CodeKeyData }) {
  return (
    <div>
      {data.example && <Example data={data} />}
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
                    <td className="px-3 py-1 text-neutral-700 dark:text-neutral-300">{r.meaning}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ))}
      </div>
    </div>
  );
}

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
          </div>
        </div>
      ))}
      <Button type="button" variant="secondary" onClick={() => setDraft({ ...draft, sections: [...draft.sections, { title: "", rows: [{ code: "", meaning: "" }] }] })}>
        + Add part
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

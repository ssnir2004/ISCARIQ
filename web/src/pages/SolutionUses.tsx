import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { Button, Input, Label, Modal, Textarea } from "../components/ui";
import { api, ApiError } from "../lib/api";
import type { InnovationUse } from "../lib/types";
import { byCategory } from "../lib/useCategories";

// A brand's uses on its Solutions page (e.g. CUT-GRIP "Undercutting",
// "Aluminum"), each a box with its inserts (e.g. GIPA, W=3-6), grouped by
// their subcategory when they have one (e.g. PENTA-CUT "PENTA 24"). Edited as
// a whole list in a window.

type Insert = InnovationUse["inserts"][number];

export function SolutionUses({ brandId }: { brandId: string }) {
  const [uses, setUses] = useState<InnovationUse[]>([]);
  const [editing, setEditing] = useState(false);
  // ?category=PENTA 17 (e.g. from a selection guide): that category is scrolled to and highlighted.
  const [params] = useSearchParams();
  const focus = params.get("category");

  useEffect(() => {
    api
      .get<InnovationUse[]>(`/innovation-uses/${brandId}`)
      .then(setUses)
      .catch(() => setUses([]));
  }, [brandId]);

  useEffect(() => {
    if (!focus || uses.length === 0) return;
    // After the page around it (cases, pictures) has laid out.
    const timer = setTimeout(() => {
      const el = [...document.querySelectorAll<HTMLElement>("[data-use-category]")].find((e) => e.dataset.useCategory?.toLowerCase() === focus.toLowerCase());
      el?.scrollIntoView({ block: "start" });
    }, 300);
    return () => clearTimeout(timer);
  }, [focus, uses]);

  return (
    <section className="mt-6" data-solution-uses>
      <div className="mb-3 flex items-center justify-between">
        <h2 className="text-lg font-semibold text-neutral-900 dark:text-neutral-100">Uses ({uses.length})</h2>
        <Button variant="secondary" onClick={() => setEditing(true)}>
          Edit uses
        </Button>
      </div>
      {uses.length === 0 && <p className="py-4 text-center text-sm text-neutral-500 dark:text-neutral-400">No uses yet.</p>}
      {byCategory(uses).map(([category, group]) => (
        <div
          key={category}
          className={`mb-4 scroll-mt-4 ${focus && category.toLowerCase() === focus.toLowerCase() ? "rounded-xl p-2 ring-2 ring-blue-500" : ""}`}
          data-use-category={category || undefined}
        >
          {category && (
            <h3 className="mb-2 border-b border-neutral-200 pb-1 text-sm font-bold tracking-wide text-blue-700 uppercase dark:border-neutral-800 dark:text-blue-300">
              {category} <span className="font-normal text-neutral-500 dark:text-neutral-400">({group.length})</span>
            </h3>
          )}
          <div className="grid grid-cols-[repeat(auto-fill,minmax(220px,1fr))] gap-3">
          {group.map((u) => (
            <div key={u.id ?? u.name} className="rounded-xl border border-neutral-200 bg-white p-3 text-sm dark:border-neutral-800 dark:bg-neutral-900" data-use={u.name}>
              <h3 className="mb-2 font-semibold text-neutral-900 dark:text-neutral-100">{u.name}</h3>
              <div className="flex flex-wrap gap-1.5">
                {u.inserts.map((i, n) => {
                  const content = (
                    <>
                      <span className="font-medium">{i.name}</span>
                      {i.note && <span className="ml-1 text-xs text-blue-600 dark:text-blue-300">({i.note})</span>}
                      {i.link && <span className="ml-1 text-xs">↗</span>}
                    </>
                  );
                  // With a catalog link the chip opens it in a new tab.
                  return i.link ? (
                    <a
                      key={n}
                      href={i.link}
                      target="_blank"
                      rel="noreferrer"
                      title="Open in the e-catalog"
                      className={`${chip} hover:bg-blue-100 hover:underline dark:hover:bg-blue-900/60`}
                      data-use-insert={i.name}
                    >
                      {content}
                    </a>
                  ) : (
                    <span key={n} className={chip} data-use-insert={i.name}>
                      {content}
                    </span>
                  );
                })}
                {u.inserts.length === 0 && <span className="text-xs text-neutral-400">No inserts</span>}
              </div>
            </div>
          ))}
          </div>
        </div>
      ))}
      {editing && (
        <UsesEditor
          brandId={brandId}
          initial={uses}
          onClose={() => setEditing(false)}
          onSaved={(saved) => {
            setUses(saved);
            setEditing(false);
          }}
        />
      )}
    </section>
  );
}

// "GIPA (Full Radius W=3-6) https://…" -> { name: "GIPA", note: "Full Radius
// W=3-6", link: "https://…" }; list markers ("-", "•") are dropped and the
// note and link are optional.
export function parseInsertLine(line: string): Insert | null {
  let text = line.replace(/^\s*[-•*·]\s*/, "").trim();
  const url = text.match(/\s*(https?:\/\/\S+)\s*$/i);
  const link = url ? url[1] : null;
  if (url) text = text.slice(0, url.index).trim();
  if (!text) return null;
  const m = text.match(/^(.*?)\s*\((.*)\)\s*$/);
  return m && m[1] ? { name: m[1].trim(), note: m[2].trim() || null, link } : { name: text, note: null, link };
}

function move<T>(list: T[], from: number, to: number) {
  if (to < 0 || to >= list.length) return list;
  const next = [...list];
  const [item] = next.splice(from, 1);
  next.splice(to, 0, item);
  return next;
}

// Insert family | note | link | move / remove buttons.
const insertRow = "grid grid-cols-[minmax(0,1fr)_minmax(0,1fr)_minmax(0,2fr)_auto] items-center gap-2";
const chip = "rounded-md bg-blue-50 px-2 py-0.5 text-blue-800 dark:bg-blue-900/30 dark:text-blue-200";
const small = "rounded px-1.5 text-neutral-500 hover:bg-neutral-100 hover:text-neutral-900 disabled:opacity-30 dark:text-neutral-400 dark:hover:bg-neutral-800 dark:hover:text-neutral-100";

function UsesEditor({
  brandId,
  initial,
  onClose,
  onSaved,
}: {
  brandId: string;
  initial: InnovationUse[];
  onClose: () => void;
  onSaved: (saved: InnovationUse[]) => void;
}) {
  const [uses, setUses] = useState<InnovationUse[]>(() => initial.map((u) => ({ name: u.name, category: u.category ?? null, inserts: u.inserts.map((i) => ({ ...i })) })));
  // The brand's categories so far, offered when typing one.
  const categories = [...new Set(uses.map((u) => u.category?.trim()).filter((c): c is string => !!c))].sort((a, b) => a.localeCompare(b, undefined, { numeric: true }));
  // Per use: the "paste a list" box text.
  const [pasting, setPasting] = useState<Record<number, string>>({});
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  const update = (index: number, change: (u: InnovationUse) => InnovationUse) => setUses((list) => list.map((u, n) => (n === index ? change(u) : u)));
  const setInsert = (index: number, row: number, patch: Partial<Insert>) =>
    update(index, (u) => ({ ...u, inserts: u.inserts.map((i, n) => (n === row ? { ...i, ...patch } : i)) }));

  function addPasted(index: number) {
    const rows = (pasting[index] ?? "").split(/\r?\n/).map(parseInsertLine).filter((r): r is Insert => r !== null);
    update(index, (u) => ({ ...u, inserts: [...u.inserts, ...rows] }));
    setPasting((p) => ({ ...p, [index]: "" }));
  }

  async function save() {
    setError(null);
    if (uses.some((u) => !u.name.trim())) return setError("Enter a name for every use");
    setSaving(true);
    try {
      onSaved(await api.put<InnovationUse[]>(`/innovation-uses/${brandId}`, { uses }));
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Failed to save the uses");
    } finally {
      setSaving(false);
    }
  }

  return (
    <Modal title="Edit uses" onClose={onClose} wide>
      <div className="space-y-4" data-uses-editor>
        <datalist id="use-categories">
          {categories.map((c) => (
            <option key={c} value={c} />
          ))}
        </datalist>
        {uses.map((u, index) => (
          <div key={index} className="rounded-lg border border-neutral-200 p-3 dark:border-neutral-700" data-use-editor={index}>
            <div className="flex items-end gap-2">
              <div className="flex-1">
                <Label>Use</Label>
                <Input value={u.name} onChange={(e) => update(index, (x) => ({ ...x, name: e.target.value }))} placeholder="e.g. Undercutting" aria-label="Use name" />
              </div>
              <div className="w-44">
                <Label>Category (optional)</Label>
                <Input
                  value={u.category ?? ""}
                  onChange={(e) => update(index, (x) => ({ ...x, category: e.target.value || null }))}
                  placeholder="e.g. PENTA 24"
                  list="use-categories"
                  aria-label="Use category"
                />
              </div>
              <button type="button" className={small} disabled={index === 0} onClick={() => setUses((l) => move(l, index, index - 1))} aria-label="Move use up">
                ↑
              </button>
              <button type="button" className={small} disabled={index === uses.length - 1} onClick={() => setUses((l) => move(l, index, index + 1))} aria-label="Move use down">
                ↓
              </button>
              <Button type="button" variant="ghost" onClick={() => setUses((l) => l.filter((_, n) => n !== index))}>
                Remove use
              </Button>
            </div>
            <div className="mt-3 space-y-1.5 pl-3">
              {u.inserts.length > 0 && (
                <div className={`${insertRow} text-xs font-medium text-neutral-500 dark:text-neutral-400`}>
                  <span>Insert family</span>
                  <span>Note (optional)</span>
                  <span>E-catalog link (optional)</span>
                </div>
              )}
              {u.inserts.map((ins, row) => (
                <div key={row} className={insertRow}>
                  <Input value={ins.name} onChange={(e) => setInsert(index, row, { name: e.target.value })} placeholder="e.g. GIPA" aria-label="Insert" />
                  <Input value={ins.note ?? ""} onChange={(e) => setInsert(index, row, { note: e.target.value || null })} placeholder="e.g. W=3-6" aria-label="Note" />
                  <Input value={ins.link ?? ""} onChange={(e) => setInsert(index, row, { link: e.target.value || null })} placeholder="https://…" aria-label="E-catalog link" />
                  <span className="flex">
                    <button type="button" className={small} disabled={row === 0} onClick={() => update(index, (x) => ({ ...x, inserts: move(x.inserts, row, row - 1) }))} aria-label="Move insert up">
                      ↑
                    </button>
                    <button
                      type="button"
                      className={small}
                      disabled={row === u.inserts.length - 1}
                      onClick={() => update(index, (x) => ({ ...x, inserts: move(x.inserts, row, row + 1) }))}
                      aria-label="Move insert down"
                    >
                      ↓
                    </button>
                    <button type="button" className={small} onClick={() => update(index, (x) => ({ ...x, inserts: x.inserts.filter((_, n) => n !== row) }))} aria-label="Remove insert">
                      ✕
                    </button>
                  </span>
                </div>
              ))}
              <div className="flex flex-wrap items-start gap-2 pt-1">
                <Button type="button" variant="ghost" onClick={() => update(index, (x) => ({ ...x, inserts: [...x.inserts, { name: "", note: null }] }))}>
                  + Add insert
                </Button>
                {/* Several at once, one per line: "GIPA (W=3-6) https://…" puts W=3-6 in the note and the address in the link. */}
                <Textarea
                  rows={2}
                  className="min-w-64 flex-1"
                  value={pasting[index] ?? ""}
                  onChange={(e) => setPasting((p) => ({ ...p, [index]: e.target.value }))}
                  placeholder={"Paste several, one per line — e.g.\nGIPA (W=3-6) https://…"}
                  aria-label="Paste inserts"
                />
                <Button type="button" variant="secondary" disabled={!(pasting[index] ?? "").trim()} onClick={() => addPasted(index)}>
                  Add list
                </Button>
              </div>
            </div>
          </div>
        ))}
        <Button type="button" variant="secondary" onClick={() => setUses((l) => [...l, { name: "", inserts: [] }])}>
          + Add use
        </Button>
        {error && <p className="text-sm text-red-600 dark:text-red-400">{error}</p>}
        <div className="flex gap-2 border-t border-neutral-200 pt-3 dark:border-neutral-700">
          <Button type="button" onClick={save} disabled={saving}>
            Save
          </Button>
          <Button type="button" variant="secondary" onClick={onClose}>
            Cancel
          </Button>
        </div>
      </div>
    </Modal>
  );
}

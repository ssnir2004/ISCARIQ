import { useEffect, useState } from "react";
import { Button, Input, Label, Modal, Textarea } from "../components/ui";
import { api, ApiError } from "../lib/api";
import type { InnovationUse } from "../lib/types";

// A brand's uses on its Solutions page (e.g. CUT-GRIP "Undercutting",
// "Aluminum"), each a box with its inserts (e.g. GIPA, W=3-6). Edited as a
// whole list in a window.

type Insert = InnovationUse["inserts"][number];

export function SolutionUses({ brandId }: { brandId: string }) {
  const [uses, setUses] = useState<InnovationUse[]>([]);
  const [editing, setEditing] = useState(false);

  useEffect(() => {
    api
      .get<InnovationUse[]>(`/innovation-uses/${brandId}`)
      .then(setUses)
      .catch(() => setUses([]));
  }, [brandId]);

  return (
    <section className="mt-6" data-solution-uses>
      <div className="mb-3 flex items-center justify-between">
        <h2 className="text-lg font-semibold text-neutral-900 dark:text-neutral-100">Uses ({uses.length})</h2>
        <Button variant="secondary" onClick={() => setEditing(true)}>
          Edit uses
        </Button>
      </div>
      {uses.length === 0 ? (
        <p className="py-4 text-center text-sm text-neutral-500 dark:text-neutral-400">No uses yet.</p>
      ) : (
        <div className="grid grid-cols-[repeat(auto-fill,minmax(220px,1fr))] gap-3">
          {uses.map((u) => (
            <div key={u.id ?? u.name} className="rounded-xl border border-neutral-200 bg-white p-3 text-sm dark:border-neutral-800 dark:bg-neutral-900" data-use={u.name}>
              <h3 className="mb-2 font-semibold text-neutral-900 dark:text-neutral-100">{u.name}</h3>
              <div className="flex flex-wrap gap-1.5">
                {u.inserts.map((i, n) => (
                  <span key={n} className="rounded-md bg-blue-50 px-2 py-0.5 text-blue-800 dark:bg-blue-900/30 dark:text-blue-200" data-use-insert={i.name}>
                    <span className="font-medium">{i.name}</span>
                    {i.note && <span className="ml-1 text-xs text-blue-600 dark:text-blue-300">({i.note})</span>}
                  </span>
                ))}
                {u.inserts.length === 0 && <span className="text-xs text-neutral-400">No inserts</span>}
              </div>
            </div>
          ))}
        </div>
      )}
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

// "GIPA (Full Radius W=3-6)" -> { name: "GIPA", note: "Full Radius W=3-6" };
// list markers ("-", "•") are dropped.
export function parseInsertLine(line: string): Insert | null {
  const text = line.replace(/^\s*[-•*·]\s*/, "").trim();
  if (!text) return null;
  const m = text.match(/^(.*?)\s*\((.*)\)\s*$/);
  return m && m[1] ? { name: m[1].trim(), note: m[2].trim() || null } : { name: text, note: null };
}

function move<T>(list: T[], from: number, to: number) {
  if (to < 0 || to >= list.length) return list;
  const next = [...list];
  const [item] = next.splice(from, 1);
  next.splice(to, 0, item);
  return next;
}

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
  const [uses, setUses] = useState<InnovationUse[]>(() => initial.map((u) => ({ name: u.name, inserts: u.inserts.map((i) => ({ ...i })) })));
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
        {uses.map((u, index) => (
          <div key={index} className="rounded-lg border border-neutral-200 p-3 dark:border-neutral-700" data-use-editor={index}>
            <div className="flex items-end gap-2">
              <div className="flex-1">
                <Label>Use</Label>
                <Input value={u.name} onChange={(e) => update(index, (x) => ({ ...x, name: e.target.value }))} placeholder="e.g. Undercutting" aria-label="Use name" />
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
              {u.inserts.map((ins, row) => (
                <div key={row} className="flex items-center gap-2">
                  <Input className="w-48" value={ins.name} onChange={(e) => setInsert(index, row, { name: e.target.value })} placeholder="Insert, e.g. GIPA" aria-label="Insert" />
                  <Input className="flex-1" value={ins.note ?? ""} onChange={(e) => setInsert(index, row, { note: e.target.value || null })} placeholder="Note (optional), e.g. W=3-6" aria-label="Note" />
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
                </div>
              ))}
              <div className="flex flex-wrap items-start gap-2 pt-1">
                <Button type="button" variant="ghost" onClick={() => update(index, (x) => ({ ...x, inserts: [...x.inserts, { name: "", note: null }] }))}>
                  + Add insert
                </Button>
                {/* Several at once: one per line, "GIPA (W=3-6)" puts W=3-6 in the note. */}
                <Textarea
                  rows={2}
                  className="min-w-64 flex-1"
                  value={pasting[index] ?? ""}
                  onChange={(e) => setPasting((p) => ({ ...p, [index]: e.target.value }))}
                  placeholder={"Paste several, one per line — e.g.\nGIPA (W=3-6)"}
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

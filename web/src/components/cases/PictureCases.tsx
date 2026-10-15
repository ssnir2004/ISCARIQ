import { useCallback, useEffect, useState } from "react";
import { Button, Input, Label, Modal, Select, Textarea } from "../ui";
import { ClipboardImagePaste } from "../npaKnowledge/ClipboardImagePaste";
import { api, ApiError } from "../../lib/api";
import { ISO513_COLORS, ISO513_GROUPS } from "../../lib/npaKnowledgeConstants";
import type { Iso513Group } from "../../lib/types";

// Cases (pictures of jobs) of something, e.g. a Solutions brand or a
// chipbreaker in an application: a gallery with "+ Add case"; a case opens
// full screen with Previous / Next (← →), Edit, Delete and fit / actual
// size. Each case has a title, material (ISO group, optional), notes and a
// picture (pasted or chosen).

export interface PictureCase {
  id: string;
  title: string;
  notes: string | null;
  image: string;
  iso513Group: Iso513Group | null;
  createdAt: string;
}

export function PictureCases({
  label,
  listPath,
  endpoint,
  createExtra,
  onCountChange,
  heading = "Cases",
}: {
  // What the cases are of, shown in the viewer and the add / edit window (e.g. "CUT-GRIP").
  label: string;
  // GET list, e.g. "/innovation-cases?innovationId=…".
  listPath: string;
  // POST here, PATCH / DELETE `${endpoint}/:id`.
  endpoint: string;
  // Added to a new case (e.g. { innovationId }).
  createExtra: Record<string, unknown>;
  onCountChange?: (count: number) => void;
  heading?: string;
}) {
  const [cases, setCases] = useState<PictureCase[]>([]);
  // Index of the case open full screen, if any.
  const [open, setOpen] = useState<number | null>(null);
  // The case being edited, or "new" while adding one.
  const [editing, setEditing] = useState<PictureCase | "new" | null>(null);

  const load = useCallback(
    () =>
      api.get<PictureCase[]>(listPath).then((list) => {
        setCases(list);
        onCountChange?.(list.length);
        return list;
      }),
    [listPath, onCountChange]
  );

  useEffect(() => {
    load().catch(() => setCases([]));
  }, [load]);

  async function remove(c: PictureCase) {
    if (!confirm(`Delete the case "${c.title}"?`)) return;
    try {
      await api.delete(`${endpoint}/${c.id}`);
    } catch (err) {
      alert(err instanceof ApiError ? err.message : "Failed to delete the case");
      return;
    }
    const list = await load();
    setOpen((i) => (i === null || list.length === 0 ? null : Math.min(i, list.length - 1)));
  }

  return (
    <section data-cases>
      <div className="mb-3 flex items-center justify-between">
        <h2 className="text-lg font-semibold text-neutral-900 dark:text-neutral-100">
          {heading} ({cases.length})
        </h2>
        <Button onClick={() => setEditing("new")}>+ Add case</Button>
      </div>
      {cases.length === 0 ? (
        <p className="py-6 text-center text-sm text-neutral-500 dark:text-neutral-400">No cases yet.</p>
      ) : (
        <div className="grid grid-cols-[repeat(auto-fill,minmax(220px,1fr))] gap-4">
          {cases.map((c, i) => (
            <button
              key={c.id}
              type="button"
              onClick={() => setOpen(i)}
              className="flex flex-col overflow-hidden rounded-xl border border-neutral-200 bg-white text-left text-sm hover:border-blue-400 dark:border-neutral-800 dark:bg-neutral-900 dark:hover:border-blue-500"
              data-case={c.title}
            >
              <img src={c.image} alt={c.title} className="h-36 w-full bg-white object-cover" />
              <span className="flex items-center gap-2 p-2">
                <IsoChip group={c.iso513Group} />
                <span className="truncate font-medium text-neutral-900 dark:text-neutral-100">{c.title}</span>
              </span>
            </button>
          ))}
        </div>
      )}

      {open !== null && cases[open] && (
        <CaseViewer
          label={label}
          cases={cases}
          index={open}
          onIndex={setOpen}
          onClose={() => setOpen(null)}
          onEdit={(c) => setEditing(c)}
          onDelete={remove}
          paused={editing !== null}
        />
      )}
      {editing && (
        <CaseModal
          label={label}
          existing={editing === "new" ? null : editing}
          save={(body, existing) => (existing ? api.patch<PictureCase>(`${endpoint}/${existing.id}`, body) : api.post<PictureCase>(endpoint, { ...body, ...createExtra }))}
          onClose={() => setEditing(null)}
          onSaved={async (saved) => {
            setEditing(null);
            const list = await load();
            // Keep showing the saved case if the viewer is open.
            if (open !== null) setOpen(Math.max(0, list.findIndex((c) => c.id === saved.id)));
          }}
        />
      )}
    </section>
  );
}

export function IsoChip({ group }: { group: Iso513Group | null }) {
  return (
    <span
      className="shrink-0 rounded-full px-2 py-0.5 text-xs text-neutral-900"
      style={{ backgroundColor: group ? ISO513_COLORS[group] : "#d4d4d4" }}
      title={group ? `ISO ${group}` : "All materials"}
    >
      {group ?? "All"}
    </span>
  );
}

const headerButton = "rounded-lg px-3 py-1.5 text-neutral-300 hover:bg-neutral-800 disabled:opacity-30 disabled:hover:bg-transparent";

// One case full screen: the image fills the screen (click toggles fit /
// actual size); ← → step through the cases, Esc closes.
function CaseViewer({
  label,
  cases,
  index,
  onIndex,
  onClose,
  onEdit,
  onDelete,
  paused,
}: {
  label: string;
  cases: PictureCase[];
  index: number;
  onIndex: (i: number) => void;
  onClose: () => void;
  onEdit: (c: PictureCase) => void;
  onDelete: (c: PictureCase) => void;
  // Keys belong to the edit window while it's open.
  paused: boolean;
}) {
  const [actualSize, setActualSize] = useState(false);
  const item = cases[index];
  const prev = index > 0 ? index - 1 : null;
  const next = index < cases.length - 1 ? index + 1 : null;

  useEffect(() => setActualSize(false), [index]);

  useEffect(() => {
    if (paused) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      const target = e.key === "ArrowLeft" ? prev : e.key === "ArrowRight" ? next : null;
      if (target !== null) onIndex(target);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [prev, next, onIndex, onClose, paused]);

  return (
    <div className="fixed inset-0 z-40 flex flex-col bg-neutral-950 text-neutral-100" data-case-viewer>
      <header className="flex shrink-0 items-start justify-between gap-4 border-b border-neutral-800 px-4 py-2">
        <div className="min-w-0">
          <h1 className="truncate text-base font-semibold">
            <span className="mr-2 text-neutral-400">{label}</span>
            {item.title}
          </h1>
          <div className="mt-1 flex flex-wrap items-center gap-1.5 text-xs">
            <IsoChip group={item.iso513Group} />
            <span className="text-neutral-500">{new Date(item.createdAt).toLocaleDateString()}</span>
            {item.notes && <span className="ml-2 whitespace-pre-line text-neutral-300">{item.notes}</span>}
          </div>
        </div>
        <div className="flex shrink-0 flex-wrap items-center justify-end gap-2 text-sm">
          {cases.length > 1 && (
            <div className="flex items-center gap-1">
              <button type="button" disabled={prev === null} onClick={() => prev !== null && onIndex(prev)} className={headerButton}>
                ‹ Previous
              </button>
              <span className="text-neutral-400 tabular-nums">
                {index + 1} / {cases.length}
              </span>
              <button type="button" disabled={next === null} onClick={() => next !== null && onIndex(next)} className={headerButton}>
                Next ›
              </button>
            </div>
          )}
          <button type="button" onClick={() => onEdit(item)} className={headerButton}>
            Edit
          </button>
          <button type="button" onClick={() => onDelete(item)} className="rounded-lg px-3 py-1.5 text-red-400 hover:bg-neutral-800">
            Delete
          </button>
          <button type="button" onClick={() => setActualSize((v) => !v)} className={headerButton}>
            {actualSize ? "Fit to screen" : "Actual size"}
          </button>
          <button type="button" onClick={onClose} className="rounded-lg bg-neutral-800 px-3 py-1.5 hover:bg-neutral-700" aria-label="Close">
            ✕ Close
          </button>
        </div>
      </header>
      <main className={`flex-1 p-2 ${actualSize ? "overflow-auto" : "flex items-center justify-center overflow-hidden"}`}>
        <img
          src={item.image}
          alt={item.title}
          onClick={() => setActualSize((v) => !v)}
          className={actualSize ? "max-w-none cursor-zoom-out" : "h-full w-full cursor-zoom-in object-contain"}
        />
      </main>
    </div>
  );
}

type CaseBody = { title: string; iso513Group: Iso513Group | null; notes: string | null; image: string };

// Add or edit a case: title, material (optional), notes and a picture
// (pasted or chosen).
function CaseModal({
  label,
  existing,
  save,
  onClose,
  onSaved,
}: {
  label: string;
  existing: PictureCase | null;
  save: (body: CaseBody, existing: PictureCase | null) => Promise<PictureCase>;
  onClose: () => void;
  onSaved: (saved: PictureCase) => void;
}) {
  const [title, setTitle] = useState(existing?.title ?? "");
  const [group, setGroup] = useState<string>(existing?.iso513Group ?? "");
  const [notes, setNotes] = useState(existing?.notes ?? "");
  const [image, setImage] = useState<string | null>(existing?.image ?? null);
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  async function submit() {
    setError(null);
    if (!title.trim()) return setError("Enter a title");
    if (!image) return setError("Add a picture");
    setSaving(true);
    try {
      onSaved(await save({ title: title.trim(), iso513Group: (group || null) as Iso513Group | null, notes: notes.trim() || null, image }, existing));
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Failed to save the case");
    } finally {
      setSaving(false);
    }
  }

  return (
    <Modal title={`${existing ? "Edit" : "Add"} case — ${label}`} onClose={onClose}>
      <div className="space-y-3" data-case-form>
        <div>
          <Label>Title</Label>
          <Input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="e.g. Parting-off a Ø40 shaft" aria-label="Title" autoFocus />
        </div>
        <div>
          <Label>Material</Label>
          <Select value={group} onChange={(e) => setGroup(e.target.value)} aria-label="Material">
            <option value="">All materials</option>
            {ISO513_GROUPS.map((g) => (
              <option key={g.value} value={g.value}>
                {g.label}
              </option>
            ))}
          </Select>
        </div>
        <div>
          <Label>Notes (optional)</Label>
          <Textarea rows={3} value={notes} onChange={(e) => setNotes(e.target.value)} aria-label="Notes" />
        </div>
        <div>
          <Label>Picture</Label>
          <ClipboardImagePaste value={image} onChange={setImage} />
        </div>
        {error && <p className="text-sm text-red-600 dark:text-red-400">{error}</p>}
        <div className="flex gap-2">
          <Button type="button" onClick={submit} disabled={saving}>
            {existing ? "Save" : "Add case"}
          </Button>
          <Button type="button" variant="secondary" onClick={onClose}>
            Cancel
          </Button>
        </div>
      </div>
    </Modal>
  );
}

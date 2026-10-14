import { useCallback, useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { Button, Input, Label, Modal, Select, Textarea } from "../components/ui";
import { ClipboardImagePaste } from "../components/npaKnowledge/ClipboardImagePaste";
import { api, ApiError } from "../lib/api";
import { ISO513_COLORS, ISO513_GROUPS } from "../lib/npaKnowledgeConstants";
import type { InnovationCase, Iso513Group } from "../lib/types";
import { PARTS, str } from "./Innovations";
import { SolutionUses } from "./SolutionUses";

// A solution (brand) page: its picture and details, its uses (with their
// inserts) and its cases. A case opens full screen, with Previous / Next
// through the brand's cases.

type Brand = Record<string, unknown> & {
  id: string;
  name: string;
  description?: string | null;
  image?: string | null;
  applications?: { id: string; name: string }[];
};

export function SolutionView() {
  const { id } = useParams();
  const [brand, setBrand] = useState<Brand | null>(null);
  const [cases, setCases] = useState<InnovationCase[]>([]);
  const [error, setError] = useState<string | null>(null);
  // Index of the case open full screen, if any.
  const [open, setOpen] = useState<number | null>(null);
  // The case being edited, or "new" while adding one.
  const [editing, setEditing] = useState<InnovationCase | "new" | null>(null);

  const loadCases = useCallback(
    () => api.get<InnovationCase[]>(`/innovation-cases?innovationId=${encodeURIComponent(id ?? "")}`).then((list) => (setCases(list), list)),
    [id]
  );

  useEffect(() => {
    api
      .get<Brand>(`/innovations/${id}`)
      .then((b) => {
        setBrand(b);
        document.title = `${b.name} — Solutions`;
      })
      .catch((err) => setError(err instanceof ApiError && err.status === 404 ? "This solution no longer exists." : "Failed to load the solution."));
    loadCases().catch(() => setCases([]));
  }, [id, loadCases]);

  // Restore the app's tab title on leaving the page.
  useEffect(() => {
    const title = document.title;
    return () => {
      document.title = title;
    };
  }, []);

  async function removeCase(c: InnovationCase) {
    if (!confirm(`Delete the case "${c.title}"?`)) return;
    try {
      await api.delete(`/innovation-cases/${c.id}`);
    } catch (err) {
      alert(err instanceof ApiError ? err.message : "Failed to delete the case");
      return;
    }
    const list = await loadCases();
    setOpen((i) => (i === null || list.length === 0 ? null : Math.min(i, list.length - 1)));
  }

  if (!brand) return <p className="text-sm text-neutral-500 dark:text-neutral-400">{error ?? "Loading…"}</p>;

  const year = typeof brand.year === "number" ? brand.year : null;
  const parts = PARTS.filter((p) => str(brand[p.key]));

  return (
    <div className="max-w-6xl" data-solution-view={brand.name}>
      <Link to="/solutions" className="text-sm text-blue-600 hover:underline dark:text-blue-400">
        ← Solutions
      </Link>
      <article className="mt-3 flex flex-col gap-5 rounded-xl border border-neutral-200 bg-white p-5 shadow-sm md:flex-row dark:border-neutral-800 dark:bg-neutral-900">
        <span className="flex h-64 w-full shrink-0 items-center justify-center rounded-lg bg-white ring-1 ring-neutral-200 md:w-80 dark:ring-neutral-700">
          {brand.image ? (
            <img src={brand.image} alt={brand.name} className="max-h-60 max-w-[95%] object-contain" />
          ) : (
            <span className="text-xs text-neutral-400">No picture</span>
          )}
        </span>
        <div className="flex min-w-0 flex-1 flex-col gap-2 text-sm">
          <h1 className="text-2xl font-bold text-neutral-900 dark:text-neutral-100">{brand.name}</h1>
          <p className="flex flex-wrap items-center gap-2">
            {(brand.applications ?? []).map((a) => (
              <span key={a.id} className="rounded-full bg-blue-50 px-2 py-0.5 text-xs text-blue-700 dark:bg-blue-900/30 dark:text-blue-300">
                {a.name}
              </span>
            ))}
            {str(brand.solutionGroup) && (
              <span className="rounded-full bg-neutral-100 px-2 py-0.5 text-xs text-neutral-700 dark:bg-neutral-800 dark:text-neutral-300">{str(brand.solutionGroup)}</span>
            )}
            {year !== null && (
              <span className="text-neutral-600 dark:text-neutral-300">
                Launched <span className="font-semibold">{year}</span>
              </span>
            )}
          </p>
          {brand.description && <p className="whitespace-pre-line text-neutral-700 dark:text-neutral-200">{brand.description}</p>}
        </div>
        {parts.length > 0 && (
          <aside className="flex w-full shrink-0 flex-col gap-3 border-neutral-200 text-sm md:w-56 md:border-l md:pl-4 dark:border-neutral-800">
            {parts.map((part) => (
              <div key={part.key}>
                <p className="text-xs font-semibold tracking-wide text-neutral-500 uppercase dark:text-neutral-400">{part.title}</p>
                <p className="whitespace-pre-line text-neutral-700 dark:text-neutral-200">{str(brand[part.key])}</p>
              </div>
            ))}
          </aside>
        )}
      </article>

      <SolutionUses key={brand.id} brandId={brand.id} />

      <section className="mt-6" data-solution-cases>
        <div className="mb-3 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-neutral-900 dark:text-neutral-100">Cases ({cases.length})</h2>
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
                data-solution-case={c.title}
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
      </section>

      {open !== null && cases[open] && (
        <CaseViewer
          brand={brand.name}
          cases={cases}
          index={open}
          onIndex={setOpen}
          onClose={() => setOpen(null)}
          onEdit={(c) => setEditing(c)}
          onDelete={removeCase}
          paused={editing !== null}
        />
      )}
      {editing && (
        <CaseModal
          brandId={brand.id}
          brandName={brand.name}
          existing={editing === "new" ? null : editing}
          onClose={() => setEditing(null)}
          onSaved={async (saved) => {
            setEditing(null);
            const list = await loadCases();
            // Show a new case full screen if the viewer is open.
            if (open !== null) setOpen(Math.max(0, list.findIndex((c) => c.id === saved.id)));
          }}
        />
      )}
    </div>
  );
}

function IsoChip({ group }: { group: Iso513Group | null }) {
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
  brand,
  cases,
  index,
  onIndex,
  onClose,
  onEdit,
  onDelete,
  paused,
}: {
  brand: string;
  cases: InnovationCase[];
  index: number;
  onIndex: (i: number) => void;
  onClose: () => void;
  onEdit: (c: InnovationCase) => void;
  onDelete: (c: InnovationCase) => void;
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
    <div className="fixed inset-0 z-40 flex flex-col bg-neutral-950 text-neutral-100" data-solution-case-viewer>
      <header className="flex shrink-0 items-start justify-between gap-4 border-b border-neutral-800 px-4 py-2">
        <div className="min-w-0">
          <h1 className="truncate text-base font-semibold">
            <span className="mr-2 text-neutral-400">{brand}</span>
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

// Add or edit a case: title, material (optional), notes and a picture
// (pasted or chosen).
function CaseModal({
  brandId,
  brandName,
  existing,
  onClose,
  onSaved,
}: {
  brandId: string;
  brandName: string;
  existing: InnovationCase | null;
  onClose: () => void;
  onSaved: (saved: InnovationCase) => void;
}) {
  const [title, setTitle] = useState(existing?.title ?? "");
  const [group, setGroup] = useState<string>(existing?.iso513Group ?? "");
  const [notes, setNotes] = useState(existing?.notes ?? "");
  const [image, setImage] = useState<string | null>(existing?.image ?? null);
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  async function save() {
    setError(null);
    if (!title.trim()) return setError("Enter a title");
    if (!image) return setError("Add a picture");
    setSaving(true);
    const body = { title: title.trim(), iso513Group: group || null, notes: notes.trim() || null, image };
    try {
      const saved = existing
        ? await api.patch<InnovationCase>(`/innovation-cases/${existing.id}`, body)
        : await api.post<InnovationCase>("/innovation-cases", { ...body, innovationId: brandId });
      onSaved(saved);
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Failed to save the case");
    } finally {
      setSaving(false);
    }
  }

  return (
    <Modal title={`${existing ? "Edit" : "Add"} case — ${brandName}`} onClose={onClose}>
      <div className="space-y-3">
        <div>
          <Label>Title</Label>
          <Input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="e.g. Parting-off a Ø40 shaft" autoFocus />
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
          <Textarea rows={3} value={notes} onChange={(e) => setNotes(e.target.value)} />
        </div>
        <div>
          <Label>Picture</Label>
          <ClipboardImagePaste value={image} onChange={setImage} />
        </div>
        {error && <p className="text-sm text-red-600 dark:text-red-400">{error}</p>}
        <div className="flex gap-2">
          <Button type="button" onClick={save} disabled={saving}>
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

import { useCallback, useEffect, useState, type FormEvent } from "react";
import { api, ApiError } from "../../lib/api";
import { ISO513_COLORS } from "../../lib/npaKnowledgeConstants";
import type { GradeCase, Iso513Group } from "../../lib/types";
import { Button, Input, Label, Modal, Textarea } from "../../components/ui";
import { ClipboardImagePaste } from "../../components/npaKnowledge/ClipboardImagePaste";
import { ALL_SCOPE, caseMatches } from "../../lib/gradeCases";

// Cases (trials / case studies, usually a slide image) for one grade, as seen
// from one board context: an application (or all) and an ISO 513 group.

export function GradeCasesModal({
  grade,
  scope,
  scopeName,
  group,
  onClose,
  onChanged,
}: {
  grade: { id: string; name: string };
  scope: string;
  scopeName: string;
  group: Iso513Group;
  onClose: () => void;
  onChanged: () => void;
}) {
  const [cases, setCases] = useState<GradeCase[] | null>(null);
  const [zoomed, setZoomed] = useState<string | null>(null);
  const [adding, setAdding] = useState(false);
  const [title, setTitle] = useState("");
  const [notes, setNotes] = useState("");
  const [image, setImage] = useState<string | null>(null);
  const [onlyApp, setOnlyApp] = useState(true);
  const [onlyGroup, setOnlyGroup] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  const load = useCallback(async () => {
    const list = await api.get<GradeCase[]>(`/grade-cases?gradeId=${encodeURIComponent(grade.id)}`);
    const relevant = list.filter((c) => caseMatches(c, scope, group));
    // The list has no images; fetch each relevant case in full.
    setCases(await Promise.all(relevant.map((c) => api.get<GradeCase>(`/grade-cases/${c.id}`))));
  }, [grade.id, scope, group]);

  useEffect(() => {
    load().catch((err) => setError(err instanceof ApiError ? err.message : "Failed to load cases"));
  }, [load]);

  async function save(e: FormEvent) {
    e.preventDefault();
    if (!image) {
      setError("Add an image (paste with Ctrl+V or choose a file)");
      return;
    }
    setError(null);
    setSaving(true);
    try {
      await api.post("/grade-cases", {
        gradeId: grade.id,
        applicationId: scope !== ALL_SCOPE && onlyApp ? scope : null,
        iso513Group: onlyGroup ? group : null,
        title: title.trim(),
        notes: notes.trim() || null,
        image,
      });
      setTitle("");
      setNotes("");
      setImage(null);
      setAdding(false);
      await load();
      onChanged();
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Failed to save the case");
    } finally {
      setSaving(false);
    }
  }

  async function remove(c: GradeCase) {
    if (!confirm(`Delete the case "${c.title}"?`)) return;
    setError(null);
    try {
      await api.delete(`/grade-cases/${c.id}`);
      await load();
      onChanged();
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Failed to delete the case");
    }
  }

  const context = `${scope === ALL_SCOPE ? "All applications" : scopeName} · ISO ${group}`;

  return (
    <Modal title={`${grade.name} — cases`} onClose={onClose} wide>
      <div className="space-y-4">
        <div className="flex items-center justify-between gap-3">
          <p className="text-sm text-neutral-500 dark:text-neutral-400">{context}</p>
          {!adding && <Button onClick={() => setAdding(true)}>+ Add case</Button>}
        </div>
        {error && <p className="text-sm text-red-600 dark:text-red-400">{error}</p>}

        {adding && (
          <form onSubmit={save} className="space-y-3 rounded-lg border border-neutral-200 p-3 dark:border-neutral-700">
            <div>
              <Label>Title</Label>
              <Input value={title} onChange={(e) => setTitle(e.target.value)} placeholder={`e.g. Milling 4340 — ${grade.name} vs IC808`} required />
            </div>
            <div>
              <Label>Notes (optional)</Label>
              <Textarea rows={2} value={notes} onChange={(e) => setNotes(e.target.value)} />
            </div>
            <div>
              <Label>Image</Label>
              <ClipboardImagePaste value={image} onChange={setImage} />
            </div>
            <div className="flex flex-wrap gap-4 text-sm text-neutral-700 dark:text-neutral-300">
              {scope !== ALL_SCOPE && (
                <label className="flex items-center gap-1.5">
                  <input type="checkbox" checked={onlyApp} onChange={(e) => setOnlyApp(e.target.checked)} />
                  Only for {scopeName}
                </label>
              )}
              <label className="flex items-center gap-1.5">
                <input type="checkbox" checked={onlyGroup} onChange={(e) => setOnlyGroup(e.target.checked)} />
                Only for ISO {group}
              </label>
            </div>
            <div className="flex gap-2">
              <Button type="submit" disabled={saving}>
                {saving ? "Saving…" : "Save case"}
              </Button>
              <Button type="button" variant="secondary" onClick={() => setAdding(false)}>
                Cancel
              </Button>
            </div>
          </form>
        )}

        {cases === null ? (
          <p className="text-sm text-neutral-500 dark:text-neutral-400">Loading…</p>
        ) : cases.length === 0 ? (
          !adding && <p className="py-6 text-center text-sm text-neutral-500 dark:text-neutral-400">No cases yet for {context}.</p>
        ) : (
          cases.map((c) => (
            <div key={c.id} data-case={c.title} className="space-y-2 rounded-lg border border-neutral-200 p-3 dark:border-neutral-700">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <h3 className="font-semibold text-neutral-900 dark:text-neutral-100">{c.title}</h3>
                  <div className="mt-1 flex flex-wrap gap-1.5 text-xs">
                    <span className="rounded-full bg-neutral-100 px-2 py-0.5 text-neutral-700 dark:bg-neutral-800 dark:text-neutral-300">
                      {c.application?.name ?? "All applications"}
                    </span>
                    <span
                      className="rounded-full px-2 py-0.5 text-neutral-900"
                      style={{ backgroundColor: c.iso513Group ? ISO513_COLORS[c.iso513Group] : "#e5e5e5" }}
                    >
                      {c.iso513Group ? `ISO ${c.iso513Group}` : "All materials"}
                    </span>
                    <span className="text-neutral-400 dark:text-neutral-500">{new Date(c.createdAt).toLocaleDateString()}</span>
                  </div>
                </div>
                <Button variant="ghost" onClick={() => remove(c)}>
                  Delete
                </Button>
              </div>
              {c.notes && <p className="text-sm whitespace-pre-line text-neutral-600 dark:text-neutral-300">{c.notes}</p>}
              {c.image && (
                <button type="button" onClick={() => setZoomed(zoomed === c.id ? null : c.id)} className="block w-full" title="Click to zoom">
                  <img
                    src={c.image}
                    alt={c.title}
                    className={`mx-auto rounded-lg border border-neutral-200 dark:border-neutral-700 ${zoomed === c.id ? "w-full" : "max-h-[55vh] object-contain"}`}
                  />
                </button>
              )}
            </div>
          ))
        )}
      </div>
    </Modal>
  );
}

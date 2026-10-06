import { useState, type KeyboardEvent, type ReactNode } from "react";
import { api, ApiError } from "../../lib/api";
import { useResource } from "../../lib/useResource";
import { ALL_SCOPE } from "../../lib/gradeCases";
import type { Application, Grade, GradeFamily, ToolLine, ToolSubApplication } from "../../lib/types";
import { Button, Input, Label, Modal, Select, Textarea } from "../../components/ui";
import { ClipboardImagePaste } from "../../components/npaKnowledge/ClipboardImagePaste";

// Tool families suited to a grade family (e.g. F45SN face mills for some
// CBN grades), laid out like the catalog "line up" slides: by application,
// then a column per sub-application (Face Mill, Shoulder Mill…), with a card
// per tool.

const NONE = "Other";

export function GradeTools({
  family,
  scope,
  grades,
  onPick,
}: {
  family: GradeFamily;
  // ALL_SCOPE or an application id (the board's tab).
  scope: string;
  // The family's grades, to choose from.
  grades: Grade[];
  onPick: (grade: Grade) => void;
}) {
  const { data: all, reload } = useResource<ToolLine>(`/tool-lines?family=${family}`);
  const [editing, setEditing] = useState<ToolLine | "new" | null>(null);
  const [zoom, setZoom] = useState<ToolLine | null>(null);
  const [error, setError] = useState<string | null>(null);

  // On an application tab: tools for that application (or for any).
  const tools = scope === ALL_SCOPE ? all : all.filter((t) => t.applications.length === 0 || t.applications.some((a) => a.id === scope));
  // Sections: one per application (only the tab's on an application tab).
  const appNames = [...new Set(tools.flatMap((t) => (t.applications.length ? t.applications.map((a) => a.name) : [NONE])))]
    .filter((name) => scope === ALL_SCOPE || name === NONE || tools.some((t) => t.applications.some((a) => a.id === scope && a.name === name)))
    .sort((a, b) => (a === NONE ? 1 : b === NONE ? -1 : a.localeCompare(b)));

  async function remove(t: ToolLine) {
    if (!confirm(`Delete ${t.name}?`)) return;
    setError(null);
    try {
      await api.delete(`/tool-lines/${t.id}`);
      await reload();
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Failed to delete");
    }
  }

  const pick = (id: string) => {
    const g = grades.find((x) => x.id === id);
    if (g) onPick(g);
  };

  return (
    <div className="space-y-5" data-grade-tools>
      <div className="flex justify-end">
        <Button onClick={() => setEditing("new")}>+ Add tool</Button>
      </div>
      {error && <p className="text-sm text-red-600 dark:text-red-400">{error}</p>}
      {tools.length === 0 && <p className="py-6 text-center text-sm text-neutral-500 dark:text-neutral-400">No tools yet.</p>}

      {appNames.map((app) => {
        const appTools = tools.filter((t) => (app === NONE ? t.applications.length === 0 : t.applications.some((a) => a.name === app)));
        const subs = [...new Set(appTools.map((t) => t.subApplication?.name ?? NONE))].sort((a, b) =>
          a === NONE ? 1 : b === NONE ? -1 : a.localeCompare(b)
        );
        return (
          <section key={app} data-tools-app={app}>
            {appNames.length > 1 || scope === ALL_SCOPE ? (
              <h3 className="mb-2 text-lg font-bold text-neutral-900 dark:text-neutral-100">{app === NONE ? "Any application" : app}</h3>
            ) : null}
            <div className="grid gap-4" style={{ gridTemplateColumns: `repeat(${Math.max(subs.length, 1)}, minmax(240px, 1fr))` }}>
              {subs.map((sub) => (
                <div key={sub} className="rounded-xl border border-neutral-200 p-3 dark:border-neutral-800" data-tools-sub={sub}>
                  <h4 className="mb-3 text-center text-base font-bold text-neutral-900 underline underline-offset-4 dark:text-neutral-100">
                    {sub === NONE ? "General" : sub}
                  </h4>
                  <div className="grid grid-cols-[repeat(auto-fill,minmax(150px,1fr))] gap-3">
                    {appTools
                      .filter((t) => (t.subApplication?.name ?? NONE) === sub)
                      .map((t) => (
                        <div key={t.id} className="group relative flex flex-col items-center rounded-lg bg-neutral-50 p-2 text-center dark:bg-neutral-900" data-tool={t.name}>
                          <span className="font-bold text-neutral-900 dark:text-neutral-100">{t.name}</span>
                          {t.image ? (
                            <button type="button" onClick={() => setZoom(t)} className="my-1" title="Enlarge">
                              <img src={t.image} alt={t.name} className="h-28 w-full object-contain" />
                            </button>
                          ) : (
                            <div className="my-1 flex h-28 w-full items-center justify-center text-xs text-neutral-400">No image</div>
                          )}
                          {t.insert && (
                            <span className="text-sm text-neutral-700 dark:text-neutral-300">
                              Insert: <span className="font-semibold">{t.insert}</span>
                            </span>
                          )}
                          <div className="mt-1 flex flex-wrap justify-center gap-1">
                            {t.grades
                              .filter((g) => g.family === family)
                              .map((g) => (
                                <button
                                  key={g.id}
                                  type="button"
                                  onClick={() => pick(g.id)}
                                  className="rounded-full bg-blue-50 px-2 py-0.5 text-xs font-medium text-blue-700 hover:underline dark:bg-blue-900/30 dark:text-blue-300"
                                >
                                  {g.name}
                                </button>
                              ))}
                          </div>
                          {t.notes && <p className="mt-1 text-xs whitespace-pre-line text-neutral-500 dark:text-neutral-400">{t.notes}</p>}
                          <span className="absolute top-1 right-1 flex gap-1 opacity-0 transition-opacity group-hover:opacity-100 focus-within:opacity-100">
                            <button type="button" onClick={() => setEditing(t)} className="rounded bg-white/90 px-1.5 text-xs text-blue-600 shadow dark:bg-neutral-800 dark:text-blue-400">
                              Edit
                            </button>
                            <button type="button" onClick={() => remove(t)} className="rounded bg-white/90 px-1.5 text-xs text-red-600 shadow dark:bg-neutral-800 dark:text-red-400">
                              Delete
                            </button>
                          </span>
                        </div>
                      ))}
                  </div>
                </div>
              ))}
            </div>
          </section>
        );
      })}

      {zoom?.image && (
        <Modal title={zoom.name} onClose={() => setZoom(null)} wide>
          <img src={zoom.image} alt={zoom.name} className="mx-auto max-h-[75vh] object-contain" />
        </Modal>
      )}
      {editing && (
        <ToolLineModal
          family={family}
          grades={grades}
          existing={editing === "new" ? undefined : editing}
          defaultApplicationId={scope !== ALL_SCOPE ? scope : undefined}
          onClose={() => setEditing(null)}
          onSaved={async () => {
            setEditing(null);
            await reload();
          }}
        />
      )}
    </div>
  );
}

function Chip({ on, onClick, children }: { on: boolean; onClick: () => void; children: ReactNode }) {
  return (
    <button
      type="button"
      aria-pressed={on}
      onClick={onClick}
      className={`rounded-full border px-2.5 py-1 text-xs ${
        on ? "border-blue-500 bg-blue-50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300" : "border-neutral-200 text-neutral-600 dark:border-neutral-700 dark:text-neutral-300"
      }`}
    >
      {children}
    </button>
  );
}

const CREATE = "__create__";

function ToolLineModal({
  family,
  grades,
  existing,
  defaultApplicationId,
  onClose,
  onSaved,
}: {
  family: GradeFamily;
  grades: Grade[];
  existing?: ToolLine;
  defaultApplicationId?: string;
  onClose: () => void;
  onSaved: () => void;
}) {
  const { data: applications } = useResource<Application>("/applications");
  const { data: subs, reload: reloadSubs } = useResource<ToolSubApplication>("/tool-sub-applications");
  const [name, setName] = useState(existing?.name ?? "");
  const [applicationIds, setApplicationIds] = useState<string[]>(existing ? existing.applications.map((a) => a.id) : defaultApplicationId ? [defaultApplicationId] : []);
  const [subApplicationId, setSubApplicationId] = useState(existing?.subApplication?.id ?? "");
  const [newSub, setNewSub] = useState<string | null>(null);
  const [insert, setInsert] = useState(existing?.insert ?? "");
  // Grades of every family; only this family's are shown, others are kept.
  const [gradeIds, setGradeIds] = useState<string[]>(existing ? existing.grades.map((g) => g.id) : []);
  const [image, setImage] = useState<string | null>(existing?.image ?? null);
  const [notes, setNotes] = useState(existing?.notes ?? "");
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const toggle = (list: string[], id: string) => (list.includes(id) ? list.filter((x) => x !== id) : [...list, id]);

  async function createSub() {
    const value = (newSub ?? "").trim();
    if (!value) return;
    setError(null);
    try {
      const created = await api.post<ToolSubApplication>("/tool-sub-applications", { name: value });
      await reloadSubs();
      setSubApplicationId(created.id);
      setNewSub(null);
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Failed to create");
    }
  }

  const onSubKey = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      createSub();
    } else if (e.key === "Escape") {
      e.stopPropagation();
      setNewSub(null);
    }
  };

  async function save() {
    setError(null);
    setSaving(true);
    const body = {
      name: name.trim(),
      gradeIds,
      applicationIds,
      subApplicationId: subApplicationId || null,
      insert: insert.trim() || null,
      image,
      notes: notes.trim() || null,
    };
    try {
      if (existing) await api.patch(`/tool-lines/${existing.id}`, body);
      else await api.post("/tool-lines", body);
      onSaved();
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Failed to save");
      setSaving(false);
    }
  }

  return (
    <Modal title={existing ? `Edit ${existing.name}` : "Add tool"} onClose={onClose}>
      <div className="space-y-3" data-tool-form>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <Label>Name</Label>
            <Input value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g. F45SN" aria-label="Tool name" autoFocus />
          </div>
          <div>
            <Label>Insert</Label>
            <Input value={insert} onChange={(e) => setInsert(e.target.value)} placeholder="e.g. SNGN" aria-label="Insert" />
          </div>
        </div>
        <div>
          <Label>Application</Label>
          <div className="flex flex-wrap gap-2">
            {applications.map((a) => (
              <Chip key={a.id} on={applicationIds.includes(a.id)} onClick={() => setApplicationIds((l) => toggle(l, a.id))}>
                {a.name}
              </Chip>
            ))}
          </div>
        </div>
        <div>
          <Label>Sub-application</Label>
          <Select
            value={subApplicationId}
            onChange={(e) => (e.target.value === CREATE ? setNewSub("") : setSubApplicationId(e.target.value))}
            aria-label="Sub-application"
          >
            <option value="">— None —</option>
            {subs.map((s) => (
              <option key={s.id} value={s.id}>
                {s.name}
              </option>
            ))}
            <option value={CREATE}>+ New sub-application…</option>
          </Select>
          {newSub !== null && (
            <div className="mt-2 flex gap-2">
              <Input value={newSub} onChange={(e) => setNewSub(e.target.value)} onKeyDown={onSubKey} placeholder="e.g. Face Mill" aria-label="New sub-application" autoFocus />
              <Button type="button" onClick={createSub}>
                Create
              </Button>
              <Button type="button" variant="secondary" onClick={() => setNewSub(null)}>
                Cancel
              </Button>
            </div>
          )}
        </div>
        <div>
          <Label>Grades</Label>
          <div className="flex flex-wrap gap-2">
            {[...grades]
              .sort((a, b) => a.name.localeCompare(b.name))
              .map((g) => (
                <Chip key={g.id} on={gradeIds.includes(g.id)} onClick={() => setGradeIds((l) => toggle(l, g.id))}>
                  {g.name}
                </Chip>
              ))}
          </div>
          {existing && existing.grades.some((g) => g.family !== family) && (
            <p className="mt-1 text-xs text-neutral-500 dark:text-neutral-400">
              Also for: {existing.grades.filter((g) => g.family !== family).map((g) => g.name).join(", ")} (other families, kept)
            </p>
          )}
        </div>
        <div>
          <Label>Image (optional)</Label>
          <ClipboardImagePaste value={image} onChange={setImage} />
        </div>
        <div>
          <Label>Notes (optional)</Label>
          <Textarea dir="auto" rows={2} value={notes} onChange={(e) => setNotes(e.target.value)} />
        </div>
        {error && <p className="text-sm text-red-600 dark:text-red-400">{error}</p>}
        <div className="flex gap-2">
          <Button type="button" onClick={save} disabled={saving}>
            {saving ? "Saving…" : "Save"}
          </Button>
          <Button type="button" variant="secondary" onClick={onClose}>
            Cancel
          </Button>
        </div>
      </div>
    </Modal>
  );
}

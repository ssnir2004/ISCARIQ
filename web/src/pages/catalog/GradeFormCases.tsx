import { useCallback, useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { Link } from "react-router-dom";
import { api, ApiError } from "../../lib/api";
import { ISO513_COLORS, iso513Label } from "../../lib/npaKnowledgeConstants";
import type { Application, GradeCase, Iso513Group } from "../../lib/types";
import { Button, Input, Label, Modal, Select, Textarea } from "../../components/ui";
import { ClipboardImagePaste } from "../../components/npaKnowledge/ClipboardImagePaste";

// Fired after a case is added from the grade form, so the board refreshes its
// case counts.
export const GRADE_CASES_CHANGED = "iscariq:grade-cases-changed";

// Cases section of the grade edit form: the grade's existing cases and an
// "+ Add case" button. The new case can be limited to one of the grade's
// applications and/or materials (the form's current selection).
//
// This renders inside the grade <form>, so it uses no <form> of its own, its
// buttons are type="button", and the modal is portalled out of the form.
export function GradeFormCases({
  grade,
  applications,
  groups,
}: {
  grade: { id: string; name: string };
  applications: Application[];
  groups: Iso513Group[];
}) {
  const [cases, setCases] = useState<GradeCase[] | null>(null);
  const [adding, setAdding] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    setCases(await api.get<GradeCase[]>(`/grade-cases?gradeId=${encodeURIComponent(grade.id)}`));
  }, [grade.id]);

  useEffect(() => {
    load().catch((err) => setError(err instanceof ApiError ? err.message : "Failed to load cases"));
  }, [load]);

  return (
    <div>
      <div className="mb-1.5 flex items-center justify-between gap-2">
        <Label>Cases{cases && cases.length > 0 ? ` (${cases.length})` : ""}</Label>
        <Button type="button" variant="secondary" onClick={() => setAdding(true)}>
          + Add case
        </Button>
      </div>
      {error && <p className="text-sm text-red-600 dark:text-red-400">{error}</p>}
      {cases && cases.length === 0 && <p className="text-xs text-neutral-500 dark:text-neutral-400">No cases yet.</p>}
      {cases && cases.length > 0 && (
        <ul className="space-y-1 text-sm">
          {cases.map((c) => (
            <li key={c.id} className="flex flex-wrap items-center gap-1.5">
              <Link to={`/cases/${c.id}`} target="_blank" className="font-medium text-blue-600 hover:underline dark:text-blue-400">
                {c.title}
              </Link>
              <span className="rounded-full bg-neutral-100 px-2 py-0.5 text-xs text-neutral-700 dark:bg-neutral-800 dark:text-neutral-300">
                {c.application?.name ?? "All applications"}
              </span>
              <span
                className="rounded-full px-2 py-0.5 text-xs text-neutral-900"
                style={{ backgroundColor: c.iso513Group ? ISO513_COLORS[c.iso513Group] : "#e5e5e5" }}
              >
                {c.iso513Group ? `ISO ${c.iso513Group}` : "All materials"}
              </span>
            </li>
          ))}
        </ul>
      )}
      {adding &&
        createPortal(
          <AddCaseModal
            grade={grade}
            applications={applications}
            groups={groups}
            onClose={() => setAdding(false)}
            onSaved={async () => {
              setAdding(false);
              await load();
              window.dispatchEvent(new Event(GRADE_CASES_CHANGED));
            }}
          />,
          document.body
        )}
    </div>
  );
}

// Window for adding a case to a grade; also used by the full-screen case view.
export function AddCaseModal({
  grade,
  applications,
  groups,
  initialApplicationId = "",
  initialGroup = "",
  onClose,
  onSaved,
}: {
  grade: { id: string; name: string };
  applications: Application[];
  groups: Iso513Group[];
  // Preselected application / material ("" = all).
  initialApplicationId?: string;
  initialGroup?: Iso513Group | "";
  onClose: () => void;
  onSaved: (created: GradeCase) => void;
}) {
  const [applicationId, setApplicationId] = useState(initialApplicationId);
  const [group, setGroup] = useState<string>(initialGroup);
  const [title, setTitle] = useState("");
  const [notes, setNotes] = useState("");
  const [image, setImage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  async function save() {
    if (!title.trim()) {
      setError("Enter a title");
      return;
    }
    if (!image) {
      setError("Add an image (paste with Ctrl+V or choose a file)");
      return;
    }
    setError(null);
    setSaving(true);
    try {
      const created = await api.post<GradeCase>("/grade-cases", {
        gradeId: grade.id,
        applicationId: applicationId || null,
        iso513Group: group || null,
        title: title.trim(),
        notes: notes.trim() || null,
        image,
      });
      onSaved(created);
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Failed to save the case");
      setSaving(false);
    }
  }

  return (
    <Modal title={`${grade.name} — add case`} onClose={onClose}>
      <div className="space-y-3">
        <div>
          <Label>Title</Label>
          <Input value={title} onChange={(e) => setTitle(e.target.value)} placeholder={`e.g. Milling 4340 — ${grade.name} vs IC808`} autoFocus />
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <Label>Application</Label>
            <Select value={applicationId} onChange={(e) => setApplicationId(e.target.value)}>
              <option value="">All applications</option>
              {applications.map((a) => (
                <option key={a.id} value={a.id}>
                  {a.name}
                </option>
              ))}
            </Select>
          </div>
          <div>
            <Label>Material</Label>
            <Select value={group} onChange={(e) => setGroup(e.target.value)}>
              <option value="">All materials</option>
              {groups.map((g) => (
                <option key={g} value={g}>
                  {iso513Label(g)}
                </option>
              ))}
            </Select>
          </div>
        </div>
        <div>
          <Label>Notes (optional)</Label>
          <Textarea rows={2} value={notes} onChange={(e) => setNotes(e.target.value)} />
        </div>
        <div>
          <Label>Image</Label>
          <ClipboardImagePaste value={image} onChange={setImage} />
        </div>
        {error && <p className="text-sm text-red-600 dark:text-red-400">{error}</p>}
        <div className="flex gap-2">
          <Button type="button" onClick={save} disabled={saving}>
            {saving ? "Saving…" : "Save case"}
          </Button>
          <Button type="button" variant="secondary" onClick={onClose}>
            Cancel
          </Button>
        </div>
      </div>
    </Modal>
  );
}

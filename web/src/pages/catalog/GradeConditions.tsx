import { Fragment, useState, type ReactNode } from "react";
import { api, ApiError } from "../../lib/api";
import { useResource } from "../../lib/useResource";
import { ISO513_COLORS, MATERIAL_GROUPS } from "../../lib/npaKnowledgeConstants";
import { FAMILY_GROUPS } from "../../lib/gradeGroups";
import { ALL_SCOPE } from "../../lib/gradeCases";
import type { Application, Grade, GradeFamily, GradeRecommendation, Iso513Group, Material } from "../../lib/types";
import { coolantLabel, num, operationLabel, recommendationsFor } from "../../lib/gradeRecommendations";
import { Button, Input, Label, Modal, Select, Textarea } from "../../components/ui";

// Recommended cutting conditions for a family's grades, as a table per ISO
// material (like the catalog's "Recommended Cutting Conditions" slides):
// work material, application, rough / finish, grades, cutting speed Vc
// (m/min: min / recommended / max) and coolant.

export function GradeConditions({
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
  const { data: all, reload } = useResource<GradeRecommendation>(`/grade-recommendations?family=${family}`);
  const [editing, setEditing] = useState<GradeRecommendation | "new" | null>(null);
  const [error, setError] = useState<string | null>(null);
  const rows = recommendationsFor(all, scope);
  const groups = MATERIAL_GROUPS.filter((g) => FAMILY_GROUPS[family].includes(g.value));

  async function remove(r: GradeRecommendation) {
    if (!confirm(`Delete the recommendation for ${r.grades.map((g) => g.name).join("/")} in ${r.material.name}?`)) return;
    setError(null);
    try {
      await api.delete(`/grade-recommendations/${r.id}`);
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
    <div className="space-y-4" data-grade-conditions>
      <div className="flex items-center justify-between gap-3">
        <p className="text-sm text-neutral-500 dark:text-neutral-400">Cutting speed Vc in m/min: min / recommended / max.</p>
        <Button onClick={() => setEditing("new")}>+ Add recommendation</Button>
      </div>
      {error && <p className="text-sm text-red-600 dark:text-red-400">{error}</p>}
      {rows.length === 0 && <p className="py-6 text-center text-sm text-neutral-500 dark:text-neutral-400">No recommendations yet.</p>}

      {groups.map((group) => {
        const groupRows = rows
          .filter((r) => r.material.iso513Group === group.value)
          // Keep each work material's rows together, in the order they were added.
          .sort((a, b) => a.material.name.localeCompare(b.material.name) || a.position - b.position);
        if (groupRows.length === 0) return null;
        return (
          <div key={group.value} data-conditions-group={group.value}>
            <div className="mb-1 rounded-lg px-3 py-1.5 text-sm font-semibold text-neutral-900" style={{ backgroundColor: group.color }}>
              {group.label}
            </div>
            <div className="overflow-x-auto">
              <table className="w-full border-collapse text-sm">
                <thead>
                  <tr className="text-left text-xs text-neutral-500 dark:text-neutral-400">
                    <th className="border-b border-neutral-200 px-2 py-1.5 font-medium dark:border-neutral-700">Work material</th>
                    <th className="border-b border-neutral-200 px-2 py-1.5 font-medium dark:border-neutral-700">Application</th>
                    <th className="border-b border-neutral-200 px-2 py-1.5 font-medium dark:border-neutral-700">Operation</th>
                    <th className="border-b border-neutral-200 px-2 py-1.5 font-medium dark:border-neutral-700">Grade</th>
                    <th colSpan={3} className="border-b border-neutral-200 px-2 py-1.5 text-center font-medium dark:border-neutral-700">
                      Cutting speed (m/min)
                    </th>
                    <th className="border-b border-neutral-200 px-2 py-1.5 font-medium dark:border-neutral-700">Coolant</th>
                    <th className="border-b border-neutral-200 dark:border-neutral-700" />
                  </tr>
                </thead>
                <tbody>
                  {groupRows.map((r, i) => {
                    const first = i === 0 || groupRows[i - 1].material.id !== r.material.id;
                    const span = groupRows.filter((x) => x.material.id === r.material.id).length;
                    return (
                      <Fragment key={r.id}>
                        <tr className="group align-middle text-neutral-800 dark:text-neutral-200" data-recommendation>
                          {first && (
                            <td rowSpan={span} className="border-b border-neutral-200 px-2 py-2 font-bold dark:border-neutral-700">
                              {r.material.name}
                            </td>
                          )}
                          <td className="border-b border-neutral-200 px-2 py-2 dark:border-neutral-700">{r.applications.map((a) => a.name).join("/") || "Any"}</td>
                          <td className="border-b border-neutral-200 px-2 py-2 whitespace-pre-line dark:border-neutral-700">{operationLabel(r).replace(" / ", "\n")}</td>
                          <td className="border-b border-neutral-200 px-2 py-2 dark:border-neutral-700">
                            {r.grades.map((g, gi) => (
                              <Fragment key={g.id}>
                                {gi > 0 && "/"}
                                <button type="button" onClick={() => pick(g.id)} className="font-medium hover:underline">
                                  {g.name}
                                </button>
                              </Fragment>
                            ))}
                            {r.notes && <div className="text-xs whitespace-pre-line text-neutral-500 dark:text-neutral-400">{r.notes}</div>}
                          </td>
                          <td className="border-b border-neutral-200 px-2 py-2 text-right tabular-nums dark:border-neutral-700">{num(r.vcMin)}</td>
                          <td className="border-b border-neutral-200 px-2 py-2 text-center text-base font-extrabold tabular-nums dark:border-neutral-700">{num(r.vcRec)}</td>
                          <td className="border-b border-neutral-200 px-2 py-2 tabular-nums dark:border-neutral-700">{num(r.vcMax)}</td>
                          <td className="border-b border-neutral-200 px-2 py-2 dark:border-neutral-700">{coolantLabel(r)}</td>
                          <td className="border-b border-neutral-200 px-2 py-2 text-right whitespace-nowrap dark:border-neutral-700">
                            <span className="opacity-0 transition-opacity group-hover:opacity-100 focus-within:opacity-100">
                              <button type="button" onClick={() => setEditing(r)} className="px-1.5 text-xs text-blue-600 hover:underline dark:text-blue-400">
                                Edit
                              </button>
                              <button type="button" onClick={() => remove(r)} className="px-1.5 text-xs text-red-600 hover:underline dark:text-red-400">
                                Delete
                              </button>
                            </span>
                          </td>
                        </tr>
                      </Fragment>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        );
      })}

      {editing && (
        <RecommendationModal
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

function Chip({ on, onClick, children, color }: { on: boolean; onClick: () => void; children: ReactNode; color?: string }) {
  return (
    <button
      type="button"
      aria-pressed={on}
      onClick={onClick}
      className={`rounded-full border px-2.5 py-1 text-xs ${
        on ? "border-blue-500 bg-blue-50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300" : "border-neutral-200 text-neutral-600 dark:border-neutral-700 dark:text-neutral-300"
      }`}
      style={color && on ? { borderColor: color } : undefined}
    >
      {children}
    </button>
  );
}

function RecommendationModal({
  family,
  grades,
  existing,
  defaultApplicationId,
  onClose,
  onSaved,
}: {
  family: GradeFamily;
  grades: Grade[];
  existing?: GradeRecommendation;
  defaultApplicationId?: string;
  onClose: () => void;
  onSaved: () => void;
}) {
  const { data: materials } = useResource<Material>("/materials");
  const { data: applications } = useResource<Application>("/applications");
  const [materialId, setMaterialId] = useState(existing?.material.id ?? "");
  const [applicationIds, setApplicationIds] = useState<string[]>(existing ? existing.applications.map((a) => a.id) : defaultApplicationId ? [defaultApplicationId] : []);
  const [rough, setRough] = useState(existing?.rough ?? false);
  const [finish, setFinish] = useState(existing?.finish ?? false);
  const [gradeIds, setGradeIds] = useState<string[]>(existing ? existing.grades.map((g) => g.id) : []);
  const [vc, setVc] = useState({ min: num(existing?.vcMin), rec: num(existing?.vcRec), max: num(existing?.vcMax) });
  const [dry, setDry] = useState(existing?.dry ?? false);
  const [wet, setWet] = useState(existing?.wet ?? false);
  const [notes, setNotes] = useState(existing?.notes ?? "");
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  const familyGroups = FAMILY_GROUPS[family];
  const material = materials.find((m) => m.id === materialId);
  // Grades for the chosen material's ISO group (plus any already chosen).
  const gradeOptions = grades
    .filter((g) => !material || g.iso513Groups.includes(material.iso513Group) || gradeIds.includes(g.id))
    .sort((a, b) => a.name.localeCompare(b.name));
  const toggle = (list: string[], id: string) => (list.includes(id) ? list.filter((x) => x !== id) : [...list, id]);
  const toNumber = (v: string) => (v.trim() === "" ? null : Number(v));

  async function save() {
    setError(null);
    setSaving(true);
    const body = {
      family,
      materialId,
      gradeIds,
      applicationIds,
      rough,
      finish,
      vcMin: toNumber(vc.min),
      vcRec: toNumber(vc.rec),
      vcMax: toNumber(vc.max),
      dry,
      wet,
      notes: notes.trim() || null,
    };
    try {
      if (existing) await api.patch(`/grade-recommendations/${existing.id}`, body);
      else await api.post("/grade-recommendations", body);
      onSaved();
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Failed to save");
      setSaving(false);
    }
  }

  return (
    <Modal title={existing ? "Edit recommendation" : "Add recommendation"} onClose={onClose}>
      <div className="space-y-3" data-recommendation-form>
        <div>
          <Label>Work material</Label>
          <Select value={materialId} onChange={(e) => setMaterialId(e.target.value)} aria-label="Work material">
            <option value="">Choose…</option>
            {MATERIAL_GROUPS.filter((g) => familyGroups.includes(g.value)).map((g) => (
              <optgroup key={g.value} label={g.label}>
                {materials
                  .filter((m) => m.iso513Group === g.value)
                  .sort((a, b) => Number(b.isCategory) - Number(a.isCategory) || a.name.localeCompare(b.name))
                  .map((m) => (
                    <option key={m.id} value={m.id}>
                      {m.isCategory ? `${m.name} (all)` : m.name}
                    </option>
                  ))}
              </optgroup>
            ))}
          </Select>
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
          <p className="mt-1 text-xs text-neutral-500 dark:text-neutral-400">None selected = any application.</p>
        </div>
        <div className="flex flex-wrap gap-6">
          <div>
            <Label>Operation</Label>
            <div className="flex gap-2">
              <Chip on={rough} onClick={() => setRough((v) => !v)}>
                Rough
              </Chip>
              <Chip on={finish} onClick={() => setFinish((v) => !v)}>
                Finish
              </Chip>
            </div>
          </div>
          <div>
            <Label>Coolant</Label>
            <div className="flex gap-2">
              <Chip on={dry} onClick={() => setDry((v) => !v)}>
                DRY
              </Chip>
              <Chip on={wet} onClick={() => setWet((v) => !v)}>
                WET
              </Chip>
            </div>
          </div>
        </div>
        <div>
          <Label>Grades</Label>
          <div className="flex flex-wrap gap-2">
            {gradeOptions.map((g) => (
              <Chip key={g.id} on={gradeIds.includes(g.id)} onClick={() => setGradeIds((l) => toggle(l, g.id))} color={material ? ISO513_COLORS[material.iso513Group as Iso513Group] : undefined}>
                {g.name}
              </Chip>
            ))}
            {gradeOptions.length === 0 && <span className="text-xs text-neutral-500">No {family} grades for this material.</span>}
          </div>
        </div>
        <div>
          <Label>Cutting speed Vc (m/min)</Label>
          <div className="grid grid-cols-3 gap-2">
            <Input type="number" min="0" step="any" placeholder="Min" aria-label="Vc min" value={vc.min} onChange={(e) => setVc({ ...vc, min: e.target.value })} />
            <Input
              type="number"
              min="0"
              step="any"
              placeholder="Recommended"
              aria-label="Vc recommended"
              value={vc.rec}
              onChange={(e) => setVc({ ...vc, rec: e.target.value })}
              className="font-bold"
            />
            <Input type="number" min="0" step="any" placeholder="Max" aria-label="Vc max" value={vc.max} onChange={(e) => setVc({ ...vc, max: e.target.value })} />
          </div>
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

import { Fragment, useState, type ReactNode } from "react";
import { api, ApiError } from "../../lib/api";
import { useResource } from "../../lib/useResource";
import { ISO513_COLORS, MATERIAL_GROUPS } from "../../lib/npaKnowledgeConstants";
import { FAMILY_GROUPS } from "../../lib/gradeGroups";
import { ALL_SCOPE } from "../../lib/gradeCases";
import type { Application, Grade, GradeFamily, GradeRecommendation, Iso513Group, Material } from "../../lib/types";
import { COOLANT_LABEL, coolantLabel, operationLabel, rangeText, recommendationsFor } from "../../lib/gradeRecommendations";
import { fmt, fromUnits, toUnits, unitLabel, UnitsToggle, useUnits, type Quantity, type Units } from "../../lib/units";
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
  // Metric / imperial display (values are stored metric).
  const [units, setUnits] = useUnits();
  const L = (q: Quantity) => unitLabel(q, units);
  const range = (min: number | null, max: number | null, q: Quantity) => rangeText(toUnits(min, q, units), toUnits(max, q, units));
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
        <div className="flex flex-wrap items-center gap-3">
          <UnitsToggle units={units} onChange={setUnits} />
          <p className="text-sm text-neutral-500 dark:text-neutral-400">
            V in {L("speed")} (recommended in bold), DOC in {L("length")}, f in {L("feed")}.
          </p>
        </div>
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
        // Columns no row of this block uses are left out.
        const hasDoc = groupRows.some((r) => r.apMin != null || r.apMax != null);
        const hasFeed = groupRows.some((r) => r.feedMin != null || r.feedMax != null);
        const hasCoolant = groupRows.some((r) => r.dry || r.wet);
        const hasVc = groupRows.some((r) => r.vcMin != null || r.vcRec != null || r.vcMax != null);
        // Recommended working conditions (the ones shown on Materials).
        const has = {
          vc: groupRows.some((r) => r.recVc != null),
          feed: groupRows.some((r) => r.recFeed != null),
          ap: groupRows.some((r) => r.recAp != null),
          ae: groupRows.some((r) => r.recAe != null),
          coolant: groupRows.some((r) => r.recCoolant != null),
          tool: groupRows.some((r) => !!r.recTool),
          test: groupRows.some((r) => !!r.testReportNo),
          notes: groupRows.some((r) => !!r.recNotes),
        };
        const cell = "border-b border-neutral-200 px-2 py-2 dark:border-neutral-700";
        const recTh = "border-b border-neutral-200 bg-blue-50/60 px-2 py-1.5 font-medium dark:border-neutral-700 dark:bg-blue-900/20";
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
                    {hasVc && <th className="border-b border-neutral-200 px-2 py-1.5 text-center font-medium dark:border-neutral-700">V ({L("speed")})</th>}
                    {hasDoc && <th className="border-b border-neutral-200 px-2 py-1.5 text-center font-medium dark:border-neutral-700">DOC ({L("length")})</th>}
                    {hasFeed && <th className="border-b border-neutral-200 px-2 py-1.5 text-center font-medium dark:border-neutral-700">f ({L("feed")})</th>}
                    {hasCoolant && <th className="border-b border-neutral-200 px-2 py-1.5 font-medium dark:border-neutral-700">Coolant</th>}
                    {has.vc && <th className={`${recTh} text-center`}>Rec. Vc ({L("speed")})</th>}
                    {has.feed && <th className={`${recTh} text-center`}>Rec. f</th>}
                    {has.ap && <th className={`${recTh} text-center`}>Rec. Ap ({L("length")})</th>}
                    {has.ae && <th className={`${recTh} text-center`}>Rec. Ae ({L("length")})</th>}
                    {has.coolant && <th className={recTh}>Rec. coolant</th>}
                    {has.tool && <th className={recTh}>Rec. tool</th>}
                    {has.notes && <th className={recTh}>Rec. notes</th>}
                    {has.test && <th className="border-b border-neutral-200 px-2 py-1.5 font-medium dark:border-neutral-700">Test report</th>}
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
                              {/* The material's hardness, when known. */}
                              {r.material.hardness && (
                                <div className="text-xs font-normal text-neutral-500 dark:text-neutral-400" data-material-hardness>
                                  {r.material.hardness}
                                </div>
                              )}
                            </td>
                          )}
                          <td className="border-b border-neutral-200 px-2 py-2 dark:border-neutral-700">{r.applications.map((a) => a.name).join("/") || "Any"}</td>
                          <td className="border-b border-neutral-200 px-2 py-2 whitespace-pre-line dark:border-neutral-700">{operationLabel(r).replaceAll(" / ", "\n")}</td>
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
                          {hasVc && (
                            <td className={`${cell} text-center whitespace-nowrap tabular-nums`} data-vc>
                              {r.vcRec != null ? (
                                // min  REC  max, with the recommended speed in bold.
                                <span className="inline-flex items-baseline gap-2">
                                  <span>{fmt(r.vcMin, "speed", units)}</span>
                                  <span className="text-base font-extrabold">{fmt(r.vcRec, "speed", units)}</span>
                                  <span>{fmt(r.vcMax, "speed", units)}</span>
                                </span>
                              ) : (
                                <span className="text-base font-extrabold">{range(r.vcMin, r.vcMax, "speed")}</span>
                              )}
                            </td>
                          )}
                          {hasDoc && <td className={`${cell} text-center whitespace-nowrap tabular-nums`}>{range(r.apMin, r.apMax, "length") || "-"}</td>}
                          {hasFeed && <td className={`${cell} text-center whitespace-nowrap tabular-nums`}>{range(r.feedMin, r.feedMax, "feed") || "-"}</td>}
                          {hasCoolant && <td className={cell}>{coolantLabel(r)}</td>}
                          {has.vc && <td className={`${cell} text-center font-bold whitespace-nowrap tabular-nums`}>{fmt(r.recVc, "speed", units) || "-"}</td>}
                          {has.feed && (
                            <td className={`${cell} text-center whitespace-nowrap tabular-nums`}>{r.recFeed != null ? `${fmt(r.recFeed, "feed", units)} ${unitLabel("feed", units, r.recFeedUnit)}` : "-"}</td>
                          )}
                          {has.ap && <td className={`${cell} text-center whitespace-nowrap tabular-nums`}>{fmt(r.recAp, "length", units) || "-"}</td>}
                          {has.ae && <td className={`${cell} text-center whitespace-nowrap tabular-nums`}>{fmt(r.recAe, "length", units) || "-"}</td>}
                          {has.coolant && <td className={cell}>{r.recCoolant ? COOLANT_LABEL[r.recCoolant] : "-"}</td>}
                          {has.tool && (
                            <td className={`${cell} whitespace-pre-line`} dir="auto">
                              {r.recTool}
                            </td>
                          )}
                          {has.notes && (
                            <td className={`${cell} whitespace-pre-line`} dir="auto">
                              {r.recNotes}
                            </td>
                          )}
                          {has.test && (
                            <td className={`${cell} font-mono tabular-nums`} data-test-report>
                              {r.testReportNo}
                            </td>
                          )}
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
  // Values are typed in the units chosen when the form opened.
  const [liveUnits] = useUnits();
  const [u] = useState<Units>(liveUnits);
  const q = (v: number | null | undefined, k: Quantity) => fmt(v, k, u);
  // Back to metric; a field left as it opened keeps its stored value exactly.
  const toMetric = (text: string, k: Quantity, original: number | null | undefined) =>
    text.trim() === "" ? null : text === q(original, k) ? (original ?? null) : fromUnits(Number(text), k, u);
  // Several work materials can be chosen: the recommendation is saved once
  // per material (editing keeps this row for one of them and adds the rest).
  const [materialIds, setMaterialIds] = useState<string[]>(existing ? [existing.material.id] : []);
  const [applicationIds, setApplicationIds] = useState<string[]>(existing ? existing.applications.map((a) => a.id) : defaultApplicationId ? [defaultApplicationId] : []);
  const [rough, setRough] = useState(existing?.rough ?? false);
  const [semiFinish, setSemiFinish] = useState(existing?.semiFinish ?? false);
  const [finish, setFinish] = useState(existing?.finish ?? false);
  const [gradeIds, setGradeIds] = useState<string[]>(existing ? existing.grades.map((g) => g.id) : []);
  const [vc, setVc] = useState({ min: q(existing?.vcMin, "speed"), rec: q(existing?.vcRec, "speed"), max: q(existing?.vcMax, "speed") });
  const [ap, setAp] = useState({ min: q(existing?.apMin, "length"), max: q(existing?.apMax, "length") });
  const [feed, setFeed] = useState({ min: q(existing?.feedMin, "feed"), max: q(existing?.feedMax, "feed") });
  const [dry, setDry] = useState(existing?.dry ?? false);
  const [wet, setWet] = useState(existing?.wet ?? false);
  const [notes, setNotes] = useState(existing?.notes ?? "");
  const [testReportNo, setTestReportNo] = useState(existing?.testReportNo ?? "");
  // Recommended working conditions (optional; shown on the Materials screen).
  const [rec, setRec] = useState({
    vc: q(existing?.recVc, "speed"),
    feed: q(existing?.recFeed, "feed"),
    feedUnit: existing?.recFeedUnit ?? "PER_REV",
    ap: q(existing?.recAp, "length"),
    ae: q(existing?.recAe, "length"),
    coolant: existing?.recCoolant ?? "",
    notes: existing?.recNotes ?? "",
    tool: existing?.recTool ?? "",
  });
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  const familyGroups = FAMILY_GROUPS[family];
  const chosenGroups = [...new Set(materials.filter((m) => materialIds.includes(m.id)).map((m) => m.iso513Group))];
  // Grades for the chosen materials' ISO groups (plus any already chosen).
  const gradeOptions = grades
    .filter((g) => chosenGroups.length === 0 || g.iso513Groups.some((x) => chosenGroups.includes(x)) || gradeIds.includes(g.id))
    .sort((a, b) => a.name.localeCompare(b.name));
  const toggle = (list: string[], id: string) => (list.includes(id) ? list.filter((x) => x !== id) : [...list, id]);

  async function save() {
    setError(null);
    setSaving(true);
    if (materialIds.length === 0) {
      setError("Choose at least one work material");
      setSaving(false);
      return;
    }
    if (testReportNo.trim() && !/^\d{6}$/.test(testReportNo.trim())) {
      setError("Test report number must be 6 digits");
      setSaving(false);
      return;
    }
    const body = {
      family,
      gradeIds,
      applicationIds,
      rough,
      semiFinish,
      finish,
      vcMin: toMetric(vc.min, "speed", existing?.vcMin),
      vcRec: toMetric(vc.rec, "speed", existing?.vcRec),
      vcMax: toMetric(vc.max, "speed", existing?.vcMax),
      apMin: toMetric(ap.min, "length", existing?.apMin),
      apMax: toMetric(ap.max, "length", existing?.apMax),
      feedMin: toMetric(feed.min, "feed", existing?.feedMin),
      feedMax: toMetric(feed.max, "feed", existing?.feedMax),
      dry,
      wet,
      notes: notes.trim() || null,
      recVc: toMetric(rec.vc, "speed", existing?.recVc),
      recFeed: toMetric(rec.feed, "feed", existing?.recFeed),
      recFeedUnit: rec.feedUnit,
      recAp: toMetric(rec.ap, "length", existing?.recAp),
      recAe: toMetric(rec.ae, "length", existing?.recAe),
      recCoolant: rec.coolant || null,
      recNotes: rec.notes.trim() || null,
      recTool: rec.tool.trim() || null,
      testReportNo: testReportNo.trim() || null,
    };
    // This row keeps its own material if still chosen; the others get new rows.
    const own = existing ? (materialIds.includes(existing.material.id) ? existing.material.id : materialIds[0]) : null;
    try {
      if (existing && own) await api.patch(`/grade-recommendations/${existing.id}`, { ...body, materialId: own });
      for (const materialId of materialIds.filter((id) => id !== own)) {
        await api.post("/grade-recommendations", { ...body, materialId });
      }
      onSaved();
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Failed to save");
      setSaving(false);
    }
  }

  return (
    <Modal title={existing ? "Edit recommendation" : "Add recommendation"} onClose={onClose} full>
      <div className="mx-auto max-w-6xl space-y-4" data-recommendation-form>
        <div>
          <Label>Work material</Label>
          <div className="space-y-1.5" data-material-choices>
            {MATERIAL_GROUPS.filter((g) => familyGroups.includes(g.value)).map((g) => (
              <div key={g.value} className="flex flex-wrap items-center gap-1.5">
                <span className="w-7 shrink-0 rounded text-center text-xs font-semibold text-neutral-900" style={{ backgroundColor: g.color }} title={g.label}>
                  {g.value}
                </span>
                {materials
                  .filter((m) => m.iso513Group === g.value)
                  .sort((a, b) => Number(b.isCategory) - Number(a.isCategory) || a.name.localeCompare(b.name))
                  .map((m) => (
                    <Chip key={m.id} on={materialIds.includes(m.id)} onClick={() => setMaterialIds((l) => toggle(l, m.id))}>
                      {m.isCategory ? `${m.name} (all)` : m.name}
                    </Chip>
                  ))}
              </div>
            ))}
          </div>
          {materialIds.length > 1 && (
            <p className="mt-1 text-xs text-neutral-500 dark:text-neutral-400">Saved as {materialIds.length} rows, one per work material.</p>
          )}
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
              <Chip on={semiFinish} onClick={() => setSemiFinish((v) => !v)}>
                Semi-finish
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
              <Chip key={g.id} on={gradeIds.includes(g.id)} onClick={() => setGradeIds((l) => toggle(l, g.id))} color={chosenGroups.length === 1 ? ISO513_COLORS[chosenGroups[0] as Iso513Group] : undefined}>
                {g.name}
              </Chip>
            ))}
            {gradeOptions.length === 0 && <span className="text-xs text-neutral-500">No {family} grades for this material.</span>}
          </div>
        </div>
        <div>
          <Label>V ({unitLabel("speed", u)}) — recommended is optional</Label>
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
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label>DOC ({unitLabel("length", u)})</Label>
            <div className="grid grid-cols-2 gap-2">
              <Input type="number" min="0" step="any" placeholder="Min" aria-label="DOC min" value={ap.min} onChange={(e) => setAp({ ...ap, min: e.target.value })} />
              <Input type="number" min="0" step="any" placeholder="Max" aria-label="DOC max" value={ap.max} onChange={(e) => setAp({ ...ap, max: e.target.value })} />
            </div>
          </div>
          <div>
            <Label>f ({unitLabel("feed", u)})</Label>
            <div className="grid grid-cols-2 gap-2">
              <Input type="number" min="0" step="any" placeholder="Min" aria-label="Feed min" value={feed.min} onChange={(e) => setFeed({ ...feed, min: e.target.value })} />
              <Input type="number" min="0" step="any" placeholder="Max" aria-label="Feed max" value={feed.max} onChange={(e) => setFeed({ ...feed, max: e.target.value })} />
            </div>
          </div>
        </div>
        <div>
          <Label>Notes (optional)</Label>
          <Textarea dir="auto" rows={2} value={notes} onChange={(e) => setNotes(e.target.value)} />
        </div>
        <div className="max-w-xs">
          <Label>Test report No. (optional, 6 digits)</Label>
          <Input
            inputMode="numeric"
            maxLength={6}
            value={testReportNo}
            onChange={(e) => setTestReportNo(e.target.value.replace(/\D/g, ""))}
            placeholder="e.g. 123456"
            aria-label="Test report number"
            className="font-mono"
          />
        </div>
        <fieldset className="space-y-2 rounded-lg border border-neutral-200 p-3 dark:border-neutral-700" data-recommended-conditions>
          <legend className="px-1 text-sm font-semibold text-neutral-800 dark:text-neutral-200">Recommended working conditions (optional — shown on Materials)</legend>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            <div>
              <Label>Vc ({unitLabel("speed", u)})</Label>
              <Input type="number" min="0" step="any" aria-label="Recommended Vc" value={rec.vc} onChange={(e) => setRec({ ...rec, vc: e.target.value })} />
            </div>
            <div>
              <Label>f</Label>
              <div className="flex gap-1">
                <Input type="number" min="0" step="any" aria-label="Recommended feed" value={rec.feed} onChange={(e) => setRec({ ...rec, feed: e.target.value })} />
                <Select
                  aria-label="Feed unit"
                  value={rec.feedUnit}
                  onChange={(e) => setRec({ ...rec, feedUnit: e.target.value as GradeRecommendation["recFeedUnit"] })}
                  className="w-auto"
                >
                  <option value="PER_REV">{unitLabel("feed", u, "PER_REV")}</option>
                  <option value="PER_TOOTH">{unitLabel("feed", u, "PER_TOOTH")}</option>
                </Select>
              </div>
            </div>
            <div>
              <Label>Ap ({unitLabel("length", u)})</Label>
              <Input type="number" min="0" step="any" aria-label="Recommended ap" value={rec.ap} onChange={(e) => setRec({ ...rec, ap: e.target.value })} />
            </div>
            <div>
              <Label>Ae ({unitLabel("length", u)})</Label>
              <Input type="number" min="0" step="any" aria-label="Recommended ae" value={rec.ae} onChange={(e) => setRec({ ...rec, ae: e.target.value })} />
            </div>
          </div>
          <div>
            <Label>Recommended tool</Label>
            <Textarea dir="auto" rows={2} aria-label="Recommended tool" value={rec.tool} onChange={(e) => setRec({ ...rec, tool: e.target.value })} placeholder="e.g. HELIDO H690 F90AX D050-06-22" />
          </div>
          <div className="grid grid-cols-[auto_1fr] gap-3">
            <div>
              <Label>Coolant</Label>
              <Select aria-label="Recommended coolant" value={rec.coolant} onChange={(e) => setRec({ ...rec, coolant: e.target.value as typeof rec.coolant })}>
                <option value="">—</option>
                <option value="NONE">No</option>
                <option value="AIR">Air</option>
                <option value="OIL">Oil</option>
                <option value="WET">Wet</option>
              </Select>
            </div>
            <div>
              <Label>Notes</Label>
              <Input dir="auto" aria-label="Recommended notes" value={rec.notes} onChange={(e) => setRec({ ...rec, notes: e.target.value })} />
            </div>
          </div>
        </fieldset>
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

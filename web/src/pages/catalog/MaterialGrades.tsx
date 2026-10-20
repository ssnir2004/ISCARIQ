import { Modal } from "../../components/ui";
import { useResource } from "../../lib/useResource";
import { COOLANT_LABEL } from "../../lib/gradeRecommendations";
import { fmt, unitLabel, UnitsToggle, useUnits } from "../../lib/units";
import type { GradeFamily, GradeRecommendation, Material } from "../../lib/types";

// The grades recommended for a work material (from the Grades cutting
// conditions) with their recommended working conditions (Vc, f, Ap, Ae,
// coolant, tool, notes), by application: for a subcategory its own recommendations,
// for an ISO 513 category those of the whole group. Opened from the
// Materials screen.

const ANY = "Any application";

// The recommendations for a material: its own (subcategory) or its whole
// ISO group's (category).
export function recommendationsFor(all: GradeRecommendation[], material: Material) {
  return all.filter((r) => (material.isCategory ? r.material.iso513Group === material.iso513Group : r.material.id === material.id));
}

// One line per application with its recommended grades, shown under a
// material on the Materials screen; clicking it opens the details.
export function MaterialGradesSummary({ recs, onOpen }: { recs: GradeRecommendation[]; onOpen: () => void }) {
  if (recs.length === 0) return null;
  const byApp = new Map<string, string[]>();
  for (const r of [...recs].sort((a, b) => a.position - b.position)) {
    for (const app of r.applications.length ? r.applications.map((a) => a.name) : [ANY]) {
      const names = byApp.get(app) ?? [];
      for (const g of r.grades) if (!names.includes(g.name)) names.push(g.name);
      byApp.set(app, names);
    }
  }
  const apps = [...byApp.keys()].sort((a, b) => (a === ANY ? 1 : b === ANY ? -1 : a.localeCompare(b)));
  return (
    <button
      type="button"
      onClick={onOpen}
      className="mt-1.5 flex flex-col items-start gap-0.5 rounded-md text-left text-xs hover:bg-neutral-50 dark:hover:bg-neutral-800/60"
      title="Click for the details (Vc, f, ap, operation, coolant)"
      data-material-summary
    >
      {apps.map((app) => (
        <span key={app} className="flex flex-wrap items-center gap-1" data-summary-app={app}>
          <span className="font-semibold text-neutral-600 dark:text-neutral-300">{app}:</span>
          {byApp.get(app)!.map((g) => (
            <span key={g} className="rounded bg-blue-50 px-1.5 py-px font-semibold text-blue-800 dark:bg-blue-900/30 dark:text-blue-200">
              {g}
            </span>
          ))}
        </span>
      ))}
    </button>
  );
}

const FAMILY_LABEL: Record<GradeFamily, string> = { CARBIDE: "Carbide", CBN: "CBN", CERAMIC: "Ceramic", PCD: "PCD" };

export function MaterialGrades({ material, title, onClose }: { material: Material; title: string; onClose: () => void }) {
  const { data: all, loading } = useResource<GradeRecommendation>("/grade-recommendations");
  const recs = recommendationsFor(all, material);

  // A recommendation for several applications is listed under each.
  const apps = [...new Set(recs.flatMap((r) => (r.applications.length ? r.applications.map((a) => a.name) : [ANY])))].sort((a, b) =>
    a === ANY ? 1 : b === ANY ? -1 : a.localeCompare(b)
  );
  const inApp = (app: string) =>
    recs
      .filter((r) => (app === ANY ? r.applications.length === 0 : r.applications.some((a) => a.name === app)))
      .sort((a, b) => a.family.localeCompare(b.family) || a.position - b.position);

  const cell = "border-b border-neutral-200 px-2 py-1.5 align-top dark:border-neutral-700";
  const [units, setUnits] = useUnits();

  return (
    <Modal title={`Recommended grades — ${title}`} onClose={onClose} wide>
      <div className="space-y-5" data-material-grades>
        <UnitsToggle units={units} onChange={setUnits} />
        {loading ? (
          <p className="text-sm text-neutral-500 dark:text-neutral-400">Loading…</p>
        ) : recs.length === 0 ? (
          <p className="py-4 text-center text-sm text-neutral-500 dark:text-neutral-400">
            No grades are recommended for this material yet. Add them in Grades → Conditions.
          </p>
        ) : (
          apps.map((app) => (
            <section key={app} data-material-app={app}>
              <h3 className="mb-1.5 text-sm font-bold tracking-wide text-neutral-700 uppercase dark:text-neutral-200">{app}</h3>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="text-left text-xs text-neutral-500 dark:text-neutral-400">
                      <th className={`${cell} font-medium`}>Grades</th>
                      <th className={`${cell} font-medium`}>Family</th>
                      {material.isCategory && <th className={`${cell} font-medium`}>Material</th>}
                      <th className={`${cell} text-center font-medium`}>Vc ({unitLabel("speed", units)})</th>
                      <th className={`${cell} text-center font-medium`}>f</th>
                      <th className={`${cell} text-center font-medium`}>Ap ({unitLabel("length", units)})</th>
                      <th className={`${cell} text-center font-medium`}>Ae ({unitLabel("length", units)})</th>
                      <th className={`${cell} font-medium`}>Coolant</th>
                      <th className={`${cell} font-medium`}>Tool</th>
                      <th className={`${cell} font-medium`}>Notes</th>
                    </tr>
                  </thead>
                  <tbody>
                    {inApp(app).map((r) => (
                      <tr key={r.id} className="text-neutral-800 dark:text-neutral-200" data-material-rec>
                        <td className={cell}>
                          <span className="flex flex-wrap gap-1">
                            {r.grades.map((g) => (
                              <span key={g.id} className="rounded-md bg-blue-50 px-2 py-0.5 font-semibold text-blue-800 dark:bg-blue-900/30 dark:text-blue-200">
                                {g.name}
                              </span>
                            ))}
                          </span>
                        </td>
                        <td className={cell}>{FAMILY_LABEL[r.family]}</td>
                        {material.isCategory && <td className={cell}>{r.material.name}</td>}
                        <td className={`${cell} text-center font-bold whitespace-nowrap tabular-nums`}>{fmt(r.recVc, "speed", units) || "-"}</td>
                        <td className={`${cell} text-center whitespace-nowrap tabular-nums`}>{r.recFeed != null ? `${fmt(r.recFeed, "feed", units)} ${unitLabel("feed", units, r.recFeedUnit)}` : "-"}</td>
                        <td className={`${cell} text-center whitespace-nowrap tabular-nums`}>{fmt(r.recAp, "length", units) || "-"}</td>
                        <td className={`${cell} text-center whitespace-nowrap tabular-nums`}>{fmt(r.recAe, "length", units) || "-"}</td>
                        <td className={cell}>{r.recCoolant ? COOLANT_LABEL[r.recCoolant] : "-"}</td>
                        <td className={`${cell} whitespace-pre-line`} dir="auto" data-rec-tool>
                          {r.recTool}
                        </td>
                        <td className={`${cell} whitespace-pre-line`} dir="auto">
                          {r.recNotes}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>
          ))
        )}
      </div>
    </Modal>
  );
}

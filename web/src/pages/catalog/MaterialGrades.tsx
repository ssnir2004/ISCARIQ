import { Modal } from "../../components/ui";
import { useResource } from "../../lib/useResource";
import { coolantLabel, num, operationLabel, rangeText } from "../../lib/gradeRecommendations";
import type { GradeFamily, GradeRecommendation, Material } from "../../lib/types";

// The grades recommended for a work material (from the Grades cutting
// conditions), by application: for a subcategory its own recommendations,
// for an ISO 513 category those of the whole group. Opened from the
// Materials screen.

const FAMILY_LABEL: Record<GradeFamily, string> = { CARBIDE: "Carbide", CBN: "CBN", CERAMIC: "Ceramic", PCD: "PCD" };
const ANY = "Any application";

export function MaterialGrades({ material, title, onClose }: { material: Material; title: string; onClose: () => void }) {
  const { data: all, loading } = useResource<GradeRecommendation>("/grade-recommendations");
  const recs = all.filter((r) => (material.isCategory ? r.material.iso513Group === material.iso513Group : r.material.id === material.id));

  // A recommendation for several applications is listed under each.
  const apps = [...new Set(recs.flatMap((r) => (r.applications.length ? r.applications.map((a) => a.name) : [ANY])))].sort((a, b) =>
    a === ANY ? 1 : b === ANY ? -1 : a.localeCompare(b)
  );
  const inApp = (app: string) =>
    recs
      .filter((r) => (app === ANY ? r.applications.length === 0 : r.applications.some((a) => a.name === app)))
      .sort((a, b) => a.family.localeCompare(b.family) || a.position - b.position);

  const cell = "border-b border-neutral-200 px-2 py-1.5 align-top dark:border-neutral-700";

  return (
    <Modal title={`Recommended grades — ${title}`} onClose={onClose} wide>
      <div className="space-y-5" data-material-grades>
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
                      <th className={`${cell} font-medium`}>Operation</th>
                      <th className={`${cell} text-center font-medium`}>Vc (m/min)</th>
                      <th className={`${cell} text-center font-medium`}>f (mm/rev)</th>
                      <th className={`${cell} text-center font-medium`}>ap (mm)</th>
                      <th className={`${cell} font-medium`}>Coolant</th>
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
                          {r.notes && <div className="mt-1 text-xs whitespace-pre-line text-neutral-500 dark:text-neutral-400">{r.notes}</div>}
                        </td>
                        <td className={cell}>{FAMILY_LABEL[r.family]}</td>
                        {material.isCategory && <td className={cell}>{r.material.name}</td>}
                        <td className={`${cell} whitespace-nowrap`}>{operationLabel(r) || "-"}</td>
                        <td className={`${cell} text-center whitespace-nowrap tabular-nums`}>
                          {r.vcRec != null ? (
                            <span className="inline-flex items-baseline gap-2">
                              <span>{num(r.vcMin)}</span>
                              <span className="font-extrabold">{num(r.vcRec)}</span>
                              <span>{num(r.vcMax)}</span>
                            </span>
                          ) : (
                            rangeText(r.vcMin, r.vcMax) || "-"
                          )}
                        </td>
                        <td className={`${cell} text-center whitespace-nowrap tabular-nums`}>{rangeText(r.feedMin, r.feedMax) || "-"}</td>
                        <td className={`${cell} text-center whitespace-nowrap tabular-nums`}>{rangeText(r.apMin, r.apMax) || "-"}</td>
                        <td className={cell}>{coolantLabel(r) || "-"}</td>
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

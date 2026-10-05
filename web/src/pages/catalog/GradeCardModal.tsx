import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { api } from "../../lib/api";
import { ISO513_COLORS, MATERIAL_GROUPS } from "../../lib/npaKnowledgeConstants";
import type { Grade, GradeCase } from "../../lib/types";
import { Button, Modal } from "../../components/ui";
import { groupsIn } from "../../lib/gradeGroups";

// A grade's full card (opened from the Grades search): everything known
// about it in one place, including its cases across all applications.
export function GradeCardModal({ grade, onClose, onEdit }: { grade: Grade; onClose: () => void; onEdit: () => void }) {
  const [cases, setCases] = useState<GradeCase[] | null>(null);

  useEffect(() => {
    api
      .get<GradeCase[]>(`/grade-cases?gradeId=${encodeURIComponent(grade.id)}`)
      .then(setCases)
      .catch(() => setCases([]));
  }, [grade.id]);

  const s = grade.substrate;

  return (
    <Modal title={grade.name} onClose={onClose} wide={!!grade.image}>
      <div className="space-y-4 text-sm" data-grade-card-view={grade.name}>
        {grade.description ? (
          <p className="whitespace-pre-line text-neutral-700 dark:text-neutral-300">{grade.description}</p>
        ) : (
          <p className="text-neutral-400 italic dark:text-neutral-500">No description.</p>
        )}

        <dl className="grid grid-cols-[8rem_1fr] gap-x-3 gap-y-2">
          {/* Only carbide grades have a substrate. */}
          {grade.family === "CARBIDE" && (
            <>
              <dt className="text-neutral-500 dark:text-neutral-400">Substrate</dt>
              <dd className="text-neutral-900 dark:text-neutral-100">
                {s ? (
                  <>
                    <span className="font-medium">{s.name}</span>
                    {(s.hardness != null || s.toughness != null) && (
                      <span className="ml-2 text-neutral-500 dark:text-neutral-400">
                        {s.hardness != null && `hardness ${s.hardness}`}
                        {s.hardness != null && s.toughness != null && " · "}
                        {s.toughness != null && `KIC ${s.toughness}`}
                      </span>
                    )}
                  </>
                ) : (
                  "—"
                )}
              </dd>
            </>
          )}

          {grade.sets && grade.sets.length > 0 && (
            <>
              <dt className="text-neutral-500 dark:text-neutral-400">Groups</dt>
              <dd className="text-neutral-900 dark:text-neutral-100">{grade.sets.map((s) => s.name).join(", ")}</dd>
            </>
          )}

          <dt className="text-neutral-500 dark:text-neutral-400">Materials</dt>
          <dd className="flex flex-wrap gap-1">
            {grade.iso513Groups.length === 0
              ? "—"
              : MATERIAL_GROUPS.filter((g) => grade.iso513Groups.includes(g.value)).map((g) => (
                  <span key={g.value} className="rounded-full px-2 py-0.5 text-xs font-semibold text-neutral-900" style={{ backgroundColor: ISO513_COLORS[g.value] }}>
                    {g.label}
                  </span>
                ))}
          </dd>

          <dt className="text-neutral-500 dark:text-neutral-400">Applications</dt>
          <dd className="flex flex-wrap gap-1">
            {grade.applications.length === 0 ? (
              "—"
            ) : (
              <ul className="space-y-1">
                {grade.applications.map((a) => (
                  <li key={a.id} className="flex flex-wrap items-center gap-1" data-app-materials={a.name}>
                    <span className="mr-1 rounded-full bg-neutral-100 px-2 py-0.5 text-xs text-neutral-700 dark:bg-neutral-800 dark:text-neutral-300">
                      {a.name}
                    </span>
                    {groupsIn(grade, a.id).map((g) => (
                      <span key={g} className="rounded px-1.5 text-xs font-semibold text-neutral-900" style={{ backgroundColor: ISO513_COLORS[g] }}>
                        {g}
                      </span>
                    ))}
                  </li>
                ))}
              </ul>
            )}
          </dd>

          <dt className="text-neutral-500 dark:text-neutral-400">Cases</dt>
          <dd>
            {cases === null ? (
              <span className="text-neutral-400">Loading…</span>
            ) : cases.length === 0 ? (
              "—"
            ) : (
              <ul className="space-y-1">
                {cases.map((c) => (
                  <li key={c.id}>
                    <Link to={`/cases/${c.id}`} target="_blank" className="font-medium text-blue-600 hover:underline dark:text-blue-400">
                      {c.title}
                    </Link>
                    <span className="ml-2 text-xs text-neutral-500 dark:text-neutral-400">
                      {c.application?.name ?? "All applications"} · {c.iso513Group ? `ISO ${c.iso513Group}` : "All materials"}
                    </span>
                  </li>
                ))}
              </ul>
            )}
          </dd>
        </dl>

        {grade.image && (
          <img src={grade.image} alt={grade.name} className="mx-auto max-h-[55vh] rounded-lg border border-neutral-200 object-contain dark:border-neutral-700" />
        )}

        <div className="flex justify-end gap-2">
          <Button variant="secondary" onClick={onEdit}>
            Edit
          </Button>
          <Button onClick={onClose}>Close</Button>
        </div>
      </div>
    </Modal>
  );
}

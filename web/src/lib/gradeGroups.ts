import type { Grade, GradeFamily, GradeSet, Iso513Group } from "./types";
import { ALL_SCOPE } from "./gradeCases";

// ISO 513 groups each grade family can be used for (CBN and ceramics:
// cast iron, superalloys, hardened; PCD: non-ferrous only).
export const FAMILY_GROUPS: Record<GradeFamily, Iso513Group[]> = {
  CARBIDE: ["P", "M", "K", "N", "S", "H"],
  CBN: ["K", "S", "H", "SM"],
  CERAMIC: ["K", "S", "H"],
  PCD: ["N"],
};

// The ISO 513 groups a grade is shown under on a board: all of its groups on
// the "All" board, or in an application's board the per-application
// exception if one exists (e.g. IC830 is S in Turning but not in Milling).
export function groupsIn(grade: Pick<Grade, "iso513Groups" | "applicationGroups">, scope: string): Iso513Group[] {
  if (scope === ALL_SCOPE) return grade.iso513Groups;
  const exception = grade.applicationGroups?.find((a) => a.applicationId === scope);
  return exception ? grade.iso513Groups.filter((g) => exception.iso513Groups.includes(g)) : grade.iso513Groups;
}

// The grade's groups for one material: all of them unless the grade has a
// per-material exception for it.
export function setsIn(grade: Pick<Grade, "sets" | "materialSets">, group: Iso513Group): GradeSet[] {
  const sets = grade.sets ?? [];
  const row = grade.materialSets?.find((r) => r.iso513Group === group);
  return row ? sets.filter((s) => row.setIds.includes(s.id)) : sets;
}

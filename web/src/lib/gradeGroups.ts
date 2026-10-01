import type { Grade, Iso513Group } from "./types";
import { ALL_SCOPE } from "./gradeCases";

// The ISO 513 groups a grade is shown under on a board: all of its groups on
// the "All" board, or in an application's board the per-application
// exception if one exists (e.g. IC830 is S in Turning but not in Milling).
export function groupsIn(grade: Pick<Grade, "iso513Groups" | "applicationGroups">, scope: string): Iso513Group[] {
  if (scope === ALL_SCOPE) return grade.iso513Groups;
  const exception = grade.applicationGroups?.find((a) => a.applicationId === scope);
  return exception ? grade.iso513Groups.filter((g) => exception.iso513Groups.includes(g)) : grade.iso513Groups;
}

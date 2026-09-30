import type { GradeCase, Iso513Group } from "./types";

// Board scope meaning "every application" (as opposed to an Application id).
export const ALL_SCOPE = "all";

// Whether a case applies to a board context. A case without an application /
// group applies to all of them, and the "All" board shows every application's
// cases.
export function caseMatches(c: Pick<GradeCase, "applicationId" | "iso513Group">, scope: string, group: Iso513Group) {
  return (scope === ALL_SCOPE || c.applicationId === null || c.applicationId === scope) && (c.iso513Group === null || c.iso513Group === group);
}

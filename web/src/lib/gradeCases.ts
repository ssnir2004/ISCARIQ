import type { GradeCase, Iso513Group } from "./types";

// Board scope meaning "every application" (as opposed to an Application id).
export const ALL_SCOPE = "all";

// Full-screen address of a case. With a board context, Previous / Next there
// step through the same cases the Cases window showed; without one, through
// all of the grade's cases.
export function caseUrl(id: string, scope?: string, group?: Iso513Group) {
  return scope && group ? `/cases/${id}?scope=${encodeURIComponent(scope)}&group=${group}` : `/cases/${id}`;
}

// Whether a case applies to a board context. A case without an application /
// group applies to all of them, and the "All" board shows every application's
// cases.
export function caseMatches(c: Pick<GradeCase, "applicationId" | "iso513Group">, scope: string, group: Iso513Group) {
  return (scope === ALL_SCOPE || c.applicationId === null || c.applicationId === scope) && (c.iso513Group === null || c.iso513Group === group);
}

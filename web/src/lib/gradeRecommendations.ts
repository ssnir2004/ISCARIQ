import type { GradeRecommendation } from "./types";
import { ALL_SCOPE } from "./gradeCases";

// Display helpers for recommended cutting conditions (GradeRecommendation).

export const operationLabel = (r: Pick<GradeRecommendation, "rough" | "finish">) => [r.rough && "Rough", r.finish && "Finish"].filter(Boolean).join(" / ");
export const coolantLabel = (r: Pick<GradeRecommendation, "dry" | "wet">) => [r.dry && "DRY", r.wet && "WET"].filter(Boolean).join("/");
export const num = (v: number | null | undefined) => (v == null ? "" : String(v));

// "400 – 550 – 700" style range for compact places (grade card).
export function vcText(r: Pick<GradeRecommendation, "vcMin" | "vcRec" | "vcMax">) {
  return [r.vcMin, r.vcRec, r.vcMax].filter((v) => v != null).join(" – ");
}

// The ones that apply on a board: all on "All", else those for that
// application or for no particular application.
export function recommendationsFor(list: GradeRecommendation[], scope: string) {
  return scope === ALL_SCOPE ? list : list.filter((r) => r.applications.length === 0 || r.applications.some((a) => a.id === scope));
}

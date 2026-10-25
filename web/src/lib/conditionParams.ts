import type { GradeRecommendation } from "./types";

// The cutting-condition parameters an application can ask for besides speed
// and feed (single values, stored metric in mm), each with the recommendation
// field it is kept in. An application lists the ones it uses (Applications
// screen); with none listed, ap and ae are offered as before.
export const CONDITION_PARAMS = [
  { key: "D", label: "Workpiece diameter (D)", field: "recD" },
  { key: "CW", label: "Cutting width (CW)", field: "recCW" },
  { key: "DC", label: "Cutting diameter (DC)", field: "recDC" },
  { key: "d", label: "Pre-drilled hole diameter (d)", field: "recHoleD" },
  { key: "ap", label: "Depth of cut (ap)", field: "recAp" },
  { key: "ae", label: "Cutting width (ae)", field: "recAe" },
] as const satisfies readonly { key: string; label: string; field: keyof GradeRecommendation }[];

export type ConditionParamKey = (typeof CONDITION_PARAMS)[number]["key"];
export type ConditionParamField = (typeof CONDITION_PARAMS)[number]["field"];

const DEFAULT: ConditionParamKey[] = ["ap", "ae"];

// The parameters for some applications: those any of them lists, or ap and ae
// when none lists any (or no application is chosen).
export function paramsFor(applications: { conditionParams?: string[] | null }[]) {
  const keys = new Set(applications.flatMap((a) => a.conditionParams ?? []));
  return CONDITION_PARAMS.filter((p) => (keys.size > 0 ? keys.has(p.key) : DEFAULT.includes(p.key)));
}

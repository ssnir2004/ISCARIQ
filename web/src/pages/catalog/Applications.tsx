import { GlossaryPage, type GlossaryTagField } from "./GlossaryPage";
import { CONDITION_PARAMS } from "../../lib/conditionParams";

// Each application's cutting-condition parameters besides speed and feed
// (asked for in Grades → Conditions; none chosen = ap and ae).
const tagFields: GlossaryTagField[] = [
  {
    key: "conditionParams",
    label: "Cutting-condition parameters (besides Vc and feed)",
    options: CONDITION_PARAMS.map((p) => ({ value: p.key, label: p.label, short: p.key })),
    read: (entry) => (entry.conditionParams as string[] | undefined) ?? [],
  },
];

export function Applications() {
  return <GlossaryPage resource="/applications" title="Applications" singular="application" collapsibleForm tagFields={tagFields} />;
}

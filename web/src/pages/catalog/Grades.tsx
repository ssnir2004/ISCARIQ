import { GlossaryPage, type GlossaryTagField } from "./GlossaryPage";
import { ISO513_GROUPS } from "../../lib/npaKnowledgeConstants";

const GRADE_FIELDS: GlossaryTagField[] = [
  {
    key: "iso513Groups",
    label: "Materials (ISO 513)",
    options: ISO513_GROUPS.map((g) => ({ ...g, short: g.value })),
  },
  {
    key: "applications",
    label: "Applications",
    options: [
      { value: "MILLING", label: "Milling" },
      { value: "TURNING", label: "Turning" },
      { value: "DRILLING", label: "Drilling" },
      { value: "GROOVING", label: "Grooving" },
    ],
  },
];

export function Grades() {
  return <GlossaryPage resource="/grades" title="Grades" singular="grade" tagFields={GRADE_FIELDS} />;
}

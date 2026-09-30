import { Link } from "react-router-dom";
import { GlossaryPage, type GlossaryTagField, type GlossaryTextField } from "./GlossaryPage";
import { GradesBoard } from "./GradesBoard";
import { ISO513_GROUPS } from "../../lib/npaKnowledgeConstants";
import { useResource } from "../../lib/useResource";
import type { Application } from "../../lib/types";

const TEXT_FIELDS: GlossaryTextField[] = [
  {
    key: "substrate",
    label: "Substrate",
    placeholder: "e.g. Carbide",
    suggestions: ["Carbide", "Cermet", "Ceramic", "CBN", "PCD", "HSS"],
  },
];

export function Grades() {
  // Applications are managed on their own screen, so new ones show up here automatically.
  const { data: applications } = useResource<Application>("/applications");

  const fields: GlossaryTagField[] = [
    {
      key: "iso513Groups",
      label: "Materials (ISO 513)",
      options: ISO513_GROUPS.map((g) => ({ ...g, short: g.value })),
    },
    {
      key: "applicationIds",
      label: "Applications",
      options: applications.map((a) => ({ value: a.id, label: a.name })),
      read: (entry) => ((entry.applications as Application[] | undefined) ?? []).map((a) => a.id),
      emptyHint: (
        <>
          No applications yet.{" "}
          <Link to="/catalog/applications" className="text-blue-600 hover:underline dark:text-blue-400">
            Add them on the Applications screen
          </Link>
          .
        </>
      ),
    },
  ];

  return (
    <GlossaryPage
      resource="/grades"
      title="Grades"
      singular="grade"
      textFields={TEXT_FIELDS}
      tagFields={fields}
      renderList={(ctx) => <GradesBoard {...ctx} />}
    />
  );
}

import { Link } from "react-router-dom";
import { GlossaryPage, type GlossaryTagField } from "./GlossaryPage";
import { ISO513_GROUPS } from "../../lib/npaKnowledgeConstants";
import { useResource } from "../../lib/useResource";
import type { Application } from "../../lib/types";

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

  return <GlossaryPage resource="/grades" title="Grades" singular="grade" tagFields={fields} />;
}

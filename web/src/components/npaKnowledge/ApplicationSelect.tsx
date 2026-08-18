import { APPLICATION_CATEGORIES } from "../../lib/npaKnowledgeConstants";
import type { NpaApplicationCategory } from "../../lib/types";
import { Select } from "../ui";

export function ApplicationSelect({
  value,
  onChange,
  allowEmpty,
}: {
  value: NpaApplicationCategory | "";
  onChange: (v: NpaApplicationCategory | "") => void;
  allowEmpty?: boolean;
}) {
  return (
    <Select value={value} onChange={(e) => onChange(e.target.value as NpaApplicationCategory | "")}>
      {allowEmpty && <option value="">Any</option>}
      {!allowEmpty && (
        <option value="" disabled>
          Select…
        </option>
      )}
      {APPLICATION_CATEGORIES.map((c) => (
        <option key={c.value} value={c.value}>
          {c.label}
        </option>
      ))}
    </Select>
  );
}

import { ISO513_GROUPS } from "../../lib/npaKnowledgeConstants";
import type { Iso513Group } from "../../lib/types";

export function Iso513MultiSelect({ value, onChange }: { value: Iso513Group[]; onChange: (groups: Iso513Group[]) => void }) {
  function toggle(g: Iso513Group) {
    onChange(value.includes(g) ? value.filter((v) => v !== g) : [...value, g]);
  }

  return (
    <div className="flex flex-wrap gap-2">
      {ISO513_GROUPS.map((g) => (
        <button
          key={g.value}
          type="button"
          aria-pressed={value.includes(g.value)}
          onClick={() => toggle(g.value)}
          className={`rounded-full border px-2.5 py-1 text-xs ${
            value.includes(g.value)
              ? "border-blue-500 bg-blue-50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300"
              : "border-neutral-200 text-neutral-600 dark:border-neutral-700 dark:text-neutral-300"
          }`}
        >
          {g.label}
        </button>
      ))}
    </div>
  );
}

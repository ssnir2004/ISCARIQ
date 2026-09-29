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
          className={`rounded-full border-2 px-2.5 py-1 text-xs ${
            value.includes(g.value) ? "font-medium text-neutral-900" : "text-neutral-600 dark:text-neutral-300"
          }`}
          style={value.includes(g.value) ? { backgroundColor: g.color, borderColor: g.color } : { borderColor: g.color }}
        >
          {g.label}
        </button>
      ))}
    </div>
  );
}

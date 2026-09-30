import { Button, Card } from "../../components/ui";
import type { Substrate } from "../../lib/types";
import { GlossaryPage, type Entry, type GlossaryListContext, type GlossaryTextField } from "./GlossaryPage";
import { SubstrateMap } from "./SubstrateMap";

const TEXT_FIELDS: GlossaryTextField[] = [
  { key: "hardness", label: "Substrate hardness", type: "number", placeholder: "e.g. 1550" },
  { key: "toughness", label: "Fracture toughness (KIC)", type: "number", placeholder: "e.g. 14.5" },
];

function SubstratesList({ data, startEdit, remove }: GlossaryListContext) {
  const substrates = data as unknown as Substrate[];

  return (
    <div className="space-y-6">
      <div className="max-w-3xl space-y-2">
        {substrates.map((s) => (
          <Card key={s.id} className="flex items-start justify-between gap-3 p-3">
            <div className="text-sm">
              <span className="font-medium text-neutral-900 dark:text-neutral-100">{s.name}</span>
              {s.description && <span className="ml-2 text-neutral-500 dark:text-neutral-400">— {s.description}</span>}
              <div className="mt-1 flex flex-wrap gap-x-4 text-xs text-neutral-500 dark:text-neutral-400">
                <span>
                  Hardness: <span className="font-medium text-neutral-700 dark:text-neutral-300">{s.hardness ?? "—"}</span>
                </span>
                <span>
                  KIC: <span className="font-medium text-neutral-700 dark:text-neutral-300">{s.toughness ?? "—"}</span>
                </span>
              </div>
              <div className="mt-1 flex flex-wrap items-center gap-1">
                <span className="text-xs text-neutral-500 dark:text-neutral-400">Grades:</span>
                {(s.grades ?? []).length === 0 ? (
                  <span className="text-xs text-neutral-400 dark:text-neutral-500">none — link them from the Grades screen</span>
                ) : (
                  s.grades!.map((g) => (
                    <span key={g.id} className="rounded-full bg-neutral-100 px-2 py-0.5 text-xs text-neutral-700 dark:bg-neutral-800 dark:text-neutral-300">
                      {g.name}
                    </span>
                  ))
                )}
              </div>
            </div>
            <div className="flex shrink-0 gap-1">
              <Button variant="ghost" onClick={() => startEdit(s as unknown as Entry)}>
                Edit
              </Button>
              <Button variant="ghost" onClick={() => remove(s.id)}>
                Delete
              </Button>
            </div>
          </Card>
        ))}
      </div>

      <div>
        <h2 className="mb-3 text-lg font-semibold text-neutral-900 dark:text-neutral-100">Substrate map</h2>
        <SubstrateMap substrates={substrates} />
      </div>
    </div>
  );
}

export function Substrates() {
  return (
    <GlossaryPage
      resource="/substrates"
      title="Substrates"
      singular="substrate"
      textFields={TEXT_FIELDS}
      renderList={(ctx) => <SubstratesList {...ctx} />}
    />
  );
}

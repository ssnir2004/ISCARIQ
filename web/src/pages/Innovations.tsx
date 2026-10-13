import { GlossaryPage, type GlossaryListContext } from "./catalog/GlossaryPage";
import { Button } from "../components/ui";

// ISCAR innovations over the years, by brand: a timeline from the oldest
// brand to the newest, each with its year, product picture, field and
// a few words about it.

const str = (v: unknown) => (typeof v === "string" && v.trim() ? v.trim() : "");
const yearOf = (e: Record<string, unknown>) => (typeof e.year === "number" ? e.year : null);

function Timeline({ data, startEdit, remove }: GlossaryListContext) {
  if (data.length === 0) return <p className="py-6 text-center text-sm text-neutral-500 dark:text-neutral-400">No innovations yet.</p>;

  // Oldest first; brands without a year at the end.
  const sorted = [...data].sort((a, b) => (yearOf(a) ?? Infinity) - (yearOf(b) ?? Infinity) || a.name.localeCompare(b.name));

  return (
    <ol className="relative ml-20 border-l-2 border-blue-200 dark:border-blue-900" data-innovations>
      {sorted.map((e) => {
        const year = yearOf(e);
        const category = str(e.category);
        return (
          <li key={e.id} className="relative mb-8 pl-6 last:mb-0" data-innovation={e.name}>
            {/* The year to the left of the line, with a dot on it. */}
            <span className="absolute top-3 -left-20 w-16 text-right text-lg font-bold text-blue-700 dark:text-blue-300" data-innovation-year>
              {year ?? "—"}
            </span>
            <span className="absolute top-4.5 -left-[7px] h-3 w-3 rounded-full bg-blue-600 ring-4 ring-white dark:ring-neutral-950" />
            <article className="group flex max-w-3xl flex-col gap-4 rounded-xl border border-neutral-200 bg-white p-4 shadow-sm sm:flex-row dark:border-neutral-800 dark:bg-neutral-900">
              {/* White backing so product photos look the same in dark mode. */}
              {e.image ? (
                <span className="flex h-40 w-full shrink-0 items-center justify-center rounded-lg bg-white ring-1 ring-neutral-200 sm:w-56 dark:ring-neutral-700">
                  <img src={e.image} alt={e.name} className="max-h-36 max-w-[13rem] object-contain" data-innovation-image />
                </span>
              ) : (
                <span className="flex h-40 w-full shrink-0 items-center justify-center rounded-lg border border-dashed border-neutral-300 text-xs text-neutral-400 sm:w-56 dark:border-neutral-700 dark:text-neutral-500">
                  No picture
                </span>
              )}
              <div className="flex min-w-0 flex-1 flex-col gap-1 text-sm">
                <h3 className="text-xl font-bold text-neutral-900 dark:text-neutral-100">{e.name}</h3>
                <p className="flex flex-wrap items-center gap-2">
                  {year !== null && (
                    <span className="text-neutral-600 dark:text-neutral-300">
                      Launched <span className="font-semibold">{year}</span>
                    </span>
                  )}
                  {category && (
                    <span className="rounded-full bg-blue-50 px-2 py-0.5 text-xs text-blue-700 dark:bg-blue-900/30 dark:text-blue-300">{category}</span>
                  )}
                </p>
                {e.description && <p className="whitespace-pre-line text-neutral-600 dark:text-neutral-300">{e.description}</p>}
                <div className="mt-auto flex justify-end gap-1 pt-1 opacity-0 transition-opacity group-hover:opacity-100 focus-within:opacity-100">
                  <Button variant="ghost" onClick={() => startEdit(e)}>
                    Edit
                  </Button>
                  <Button variant="ghost" onClick={() => remove(e.id)}>
                    Delete
                  </Button>
                </div>
              </div>
            </article>
          </li>
        );
      })}
    </ol>
  );
}

export function Innovations() {
  return (
    <GlossaryPage
      resource="/innovations"
      title="Innovations"
      singular="innovation"
      nameLabel="Brand"
      collapsibleForm
      textFields={[
        { key: "year", label: "Launched (year)", type: "number", placeholder: "e.g. 1978" },
        { key: "category", label: "Field", placeholder: "e.g. Grooving & parting" },
      ]}
      renderList={(ctx) => <Timeline {...ctx} />}
    />
  );
}

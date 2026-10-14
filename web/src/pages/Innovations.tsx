import { Link } from "react-router-dom";
import { GlossaryPage, type GlossaryExtraSection, type GlossaryListContext, type GlossaryTagField, type GlossaryTextField } from "./catalog/GlossaryPage";
import { Button, Label, Textarea } from "../components/ui";
import { useResource } from "../lib/useResource";
import type { Application, InnovationUse } from "../lib/types";

// ISCAR innovations over the years, by brand: a timeline from the oldest
// brand to the newest, each with its year, product picture, field and
// a few words about it. The same brands are the Solutions screen's
// solutions (by application); only brands with a year are on the timeline.

export const str = (v: unknown) => (typeof v === "string" && v.trim() ? v.trim() : "");
const yearOf = (e: Record<string, unknown>) => (typeof e.year === "number" ? e.year : null);

function Timeline({ data, startEdit, remove }: GlossaryListContext) {
  // Oldest first.
  const sorted = data.filter((e) => yearOf(e) !== null).sort((a, b) => yearOf(a)! - yearOf(b)! || a.name.localeCompare(b.name));
  const withoutYear = data.length - sorted.length;
  const note = withoutYear > 0 && (
    <p className="mt-6 text-xs text-neutral-500 dark:text-neutral-400" data-innovations-no-year>
      {withoutYear} brand{withoutYear === 1 ? "" : "s"} without a launch year {withoutYear === 1 ? "is" : "are"} not on the timeline (see{" "}
      <Link to="/solutions" className="text-blue-600 hover:underline dark:text-blue-400">
        Solutions
      </Link>
      ).
    </p>
  );
  if (sorted.length === 0)
    return (
      <>
        <p className="py-6 text-center text-sm text-neutral-500 dark:text-neutral-400">No innovations yet.</p>
        {note}
      </>
    );

  return (
    <>
    <ol className="relative ml-20 border-l-2 border-blue-200 dark:border-blue-900" data-innovations>
      {sorted.map((e) => {
        const year = yearOf(e);
        const category = str(e.category);
        const parts = PARTS.filter((p) => str(e[p.key]));
        const uses = (e.uses as InnovationUse[] | undefined) ?? [];
        return (
          <li key={e.id} className="relative mb-8 pl-6 last:mb-0" data-innovation={e.name}>
            {/* The year to the left of the line, with a dot on it. */}
            <span className="absolute top-3 -left-20 w-16 text-right text-lg font-bold text-blue-700 dark:text-blue-300" data-innovation-year>
              {year ?? "—"}
            </span>
            <span className="absolute top-4.5 -left-[7px] h-3 w-3 rounded-full bg-blue-600 ring-4 ring-white dark:ring-neutral-950" />
            <article className="group flex max-w-5xl flex-col gap-4 rounded-xl border border-neutral-200 bg-white p-4 shadow-sm sm:flex-row dark:border-neutral-800 dark:bg-neutral-900">
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
              {/* Uses (with their inserts) and tool to the right of the description, keeping the card short. */}
              {(uses.length > 0 || parts.length > 0) && (
                <aside className="flex w-full shrink-0 flex-col gap-3 border-neutral-200 text-sm sm:w-72 sm:border-l sm:pl-4 dark:border-neutral-800" data-innovation-parts>
                  {uses.length > 0 && (
                    <div data-innovation-uses>
                      <p className="text-xs font-semibold tracking-wide text-neutral-500 uppercase dark:text-neutral-400">Uses</p>
                      <ul className="space-y-0.5 text-xs">
                        {uses.map((u, n) => (
                          <li key={n} className="text-neutral-600 dark:text-neutral-300" data-innovation-use={u.name}>
                            <span className="font-semibold text-neutral-800 dark:text-neutral-100">{u.name}:</span>{" "}
                            {u.inserts.map((i) => (i.note ? `${i.name} (${i.note})` : i.name)).join(", ")}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                  {parts.map((part) => (
                    <div key={part.key} data-innovation-part={part.key}>
                      <p className="text-xs font-semibold tracking-wide text-neutral-500 uppercase dark:text-neutral-400">{part.title}</p>
                      <p className="whitespace-pre-line text-neutral-600 dark:text-neutral-300">{str(e[part.key])}</p>
                    </div>
                  ))}
                </aside>
              )}
            </article>
          </li>
        );
      })}
    </ol>
    {note}
    </>
  );
}

// The brand's tool, described in its own box (its inserts are listed
// under its uses, on the Solutions screen).
export const PARTS = [{ key: "toolDescription", title: "Tool", label: "Tool description" }] as const;

export const partsSection: GlossaryExtraSection = {
  read: (entry) => Object.fromEntries(PARTS.map((p) => [p.key, str(entry[p.key]) || null])),
  render: ({ values, setValues }) => (
    <div className="grid grid-cols-1 gap-4">
      {PARTS.map((p) => (
        <div key={p.key}>
          <Label>{p.label}</Label>
          <Textarea
            rows={3}
            value={(values[p.key] as string | null | undefined) ?? ""}
            onChange={(ev) => setValues({ ...values, [p.key]: ev.target.value.trim() ? ev.target.value : null })}
          />
        </div>
      ))}
    </div>
  ),
};

// Form fields shared by the Innovations and Solutions screens; on Solutions
// a new brand starts in the application of the open tab.
export function useBrandFields(applicationId?: string) {
  const { data: applications } = useResource<Application>("/applications");
  const tagFields: GlossaryTagField[] = [
    {
      key: "applicationIds",
      label: "Solution for applications",
      options: applications.map((a) => ({ value: a.id, label: a.name })),
      read: (entry) => ((entry.applications as { id: string }[] | undefined) ?? []).map((a) => a.id),
      initial: applicationId ? [applicationId] : undefined,
    },
  ];
  const textFields: GlossaryTextField[] = [
    { key: "year", label: "Launched (year)", type: "number", placeholder: "e.g. 1978" },
    { key: "category", label: "Field", placeholder: "e.g. Grooving & parting" },
    { key: "solutionGroup", label: "Group in its applications", placeholder: "e.g. Parting" },
  ];
  return { tagFields, textFields };
}

export function Innovations() {
  const { tagFields, textFields } = useBrandFields();
  return (
    <GlossaryPage
      resource="/innovations"
      title="Innovations"
      singular="innovation"
      nameLabel="Brand"
      collapsibleForm
      tagFields={tagFields}
      textFields={textFields}
      extraSection={partsSection}
      renderList={(ctx) => <Timeline {...ctx} />}
    />
  );
}

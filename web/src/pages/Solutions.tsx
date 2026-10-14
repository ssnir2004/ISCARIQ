import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { GlossaryPage, type GlossaryListContext } from "./catalog/GlossaryPage";
import { Button, PageHeader, Select } from "../components/ui";
import { api, ApiError } from "../lib/api";
import { useResource } from "../lib/useResource";
import type { Application } from "../lib/types";
import { partsSection, str, useBrandFields } from "./Innovations";

// ISCAR solutions by application: a tab per application (e.g. Groove-Turn)
// with its brands in rows by group (e.g. Parting). The brands are the
// Innovations screen's brands; a brand's page holds its details and cases.

const LAST_TAB_KEY = "iscariq.solutions.tab";
const DEFAULT_TAB = "Groove-Turn";
const NO_GROUP = "Other";

type Brand = Record<string, unknown> & { id: string; name: string; applications?: { id: string; name: string }[] };

function readLastTab() {
  try {
    return localStorage.getItem(LAST_TAB_KEY);
  } catch {
    return null;
  }
}

export function Solutions() {
  const { data: applications } = useResource<Application>("/applications");
  const { data: brands, reload: reloadBrands } = useResource<Brand>("/innovations");
  const [chosen, setChosen] = useState<string | null>(readLastTab);
  const tab = applications.find((a) => a.id === chosen) ?? applications.find((a) => a.name === DEFAULT_TAB) ?? applications[0];
  const { tagFields, textFields } = useBrandFields(tab?.id);

  function choose(id: string) {
    setChosen(id);
    try {
      localStorage.setItem(LAST_TAB_KEY, id);
    } catch {
      // the tab just isn't remembered
    }
  }

  const countIn = (appId: string) => brands.filter((b) => b.applications?.some((a) => a.id === appId)).length;

  return (
    <div>
      <PageHeader title="Solutions" />
      <div role="tablist" aria-label="Applications" className="mb-4 flex flex-wrap gap-2">
        {applications.map((a) => (
          <button
            key={a.id}
            type="button"
            role="tab"
            aria-selected={a.id === tab?.id}
            onClick={() => choose(a.id)}
            className={`rounded-lg border px-4 py-2 text-sm font-medium ${
              a.id === tab?.id
                ? "border-blue-600 bg-blue-600 text-white"
                : "border-neutral-300 text-neutral-700 hover:bg-neutral-100 dark:border-neutral-700 dark:text-neutral-300 dark:hover:bg-neutral-800"
            }`}
          >
            {a.name} ({countIn(a.id)})
          </button>
        ))}
      </div>
      {tab && (
        // Keyed so each application's list and form start fresh.
        <GlossaryPage
          key={tab.id}
          resource="/innovations"
          listPath={`/innovations?applicationId=${encodeURIComponent(tab.id)}`}
          title="Solutions"
          singular="solution"
          nameLabel="Brand"
          hideHeader
          collapsibleForm
          tagFields={tagFields}
          textFields={textFields}
          extraSection={partsSection}
          renderList={(ctx) => <SolutionCards {...ctx} application={tab} brands={brands} reloadBrands={reloadBrands} />}
        />
      )}
    </div>
  );
}

function SolutionCards({
  data,
  startEdit,
  remove,
  reload,
  application,
  brands,
  reloadBrands,
}: GlossaryListContext & { application: Application; brands: Brand[]; reloadBrands: () => void }) {
  const [error, setError] = useState<string | null>(null);

  // Keep the tab counts in step with adds / edits / deletes here.
  const signature = data.map((d) => d.id).join(",");
  useEffect(() => {
    reloadBrands();
  }, [signature, reloadBrands]);

  // A brand already in the system (e.g. from Innovations) can join this application.
  const others = brands.filter((b) => !b.applications?.some((a) => a.id === application.id)).sort((a, b) => a.name.localeCompare(b.name));
  async function addExisting(id: string) {
    const brand = brands.find((b) => b.id === id);
    if (!brand) return;
    setError(null);
    try {
      await api.patch(`/innovations/${id}`, { applicationIds: [...(brand.applications ?? []).map((a) => a.id), application.id] });
      reload();
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Failed to add the brand");
    }
  }

  const groups = [...new Set(data.map((b) => str(b.solutionGroup) || NO_GROUP))].sort((a, b) =>
    a === NO_GROUP ? 1 : b === NO_GROUP ? -1 : a.localeCompare(b)
  );

  return (
    <div className="space-y-6" data-solutions>
      {others.length > 0 && (
        <div className="flex items-center gap-2 text-sm">
          <Select value="" onChange={(e) => e.target.value && addExisting(e.target.value)} aria-label="Add an existing brand" className="max-w-xs">
            <option value="">+ Add an existing brand to {application.name}…</option>
            {others.map((b) => (
              <option key={b.id} value={b.id}>
                {b.name}
              </option>
            ))}
          </Select>
          {error && <span className="text-red-600 dark:text-red-400">{error}</span>}
        </div>
      )}
      {data.length === 0 && <p className="py-6 text-center text-sm text-neutral-500 dark:text-neutral-400">No solutions for {application.name} yet.</p>}
      {groups.map((group) => (
        <section key={group} data-solution-group={group}>
          <h2 className="mb-2 text-sm font-bold tracking-wide text-neutral-600 uppercase dark:text-neutral-300">{group}</h2>
          <div className="grid grid-cols-[repeat(auto-fill,minmax(240px,1fr))] gap-4">
            {data
              .filter((b) => (str(b.solutionGroup) || NO_GROUP) === group)
              .sort((a, b) => a.name.localeCompare(b.name))
              .map((b) => {
                const cases = (b._count as { cases?: number } | undefined)?.cases ?? 0;
                return (
                  <Link
                    key={b.id}
                    to={`/solutions/brand/${b.id}`}
                    className="group flex flex-col overflow-hidden rounded-xl border border-neutral-200 bg-white text-sm shadow-sm hover:border-blue-400 dark:border-neutral-800 dark:bg-neutral-900 dark:hover:border-blue-500"
                    data-solution={b.name}
                  >
                    {/* White backing so product photos look the same in dark mode. */}
                    <span className="flex h-36 items-center justify-center bg-white">
                      {b.image ? (
                        <img src={b.image} alt={b.name} className="max-h-32 max-w-[90%] object-contain" />
                      ) : (
                        <span className="text-xs text-neutral-400">No picture</span>
                      )}
                    </span>
                    <span className="flex flex-1 flex-col gap-1 border-t border-neutral-200 p-3 dark:border-neutral-800">
                      <span className="text-base font-bold text-neutral-900 dark:text-neutral-100">{b.name}</span>
                      {/* Each line of the description on its own line; the brand's page shows all of it. */}
                      {b.description && <span className="line-clamp-6 whitespace-pre-line text-neutral-600 dark:text-neutral-300" data-solution-description>{b.description}</span>}
                      <span className="mt-auto flex items-center justify-between pt-2">
                        <span className="rounded-full bg-amber-50 px-2 py-0.5 text-xs text-amber-800 dark:bg-amber-900/30 dark:text-amber-300" data-solution-cases>
                          {cases} case{cases === 1 ? "" : "s"}
                        </span>
                        <span className="flex gap-1 opacity-0 transition-opacity group-hover:opacity-100 focus-within:opacity-100">
                          <Button
                            variant="ghost"
                            onClick={(e) => {
                              e.preventDefault();
                              startEdit(b);
                            }}
                          >
                            Edit
                          </Button>
                          <Button
                            variant="ghost"
                            onClick={(e) => {
                              e.preventDefault();
                              remove(b.id);
                            }}
                          >
                            Delete
                          </Button>
                        </span>
                      </span>
                    </span>
                  </Link>
                );
              })}
          </div>
        </section>
      ))}
    </div>
  );
}

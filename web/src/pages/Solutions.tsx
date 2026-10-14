import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { GlossaryPage, type GlossaryListContext } from "./catalog/GlossaryPage";
import { Button, PageHeader, Select } from "../components/ui";
import { api, ApiError } from "../lib/api";
import { useResource } from "../lib/useResource";
import type { Application } from "../lib/types";
import { partsSection, str, useBrandFields } from "./Innovations";

// ISCAR solutions by application: a tab per application (e.g. Groove-Turn)
// with its brands in rows by group (e.g. Parting), and an "All" tab with
// every brand (any application or none, with or without a year). The brands are the
// Innovations screen's brands; a brand's page holds its details and cases.

const LAST_TAB_KEY = "iscariq.solutions.tab";
const DEFAULT_TAB = "Groove-Turn";
const NO_GROUP = "Other";
// The "All" tab's id (application ids are cuids, so it can't clash).
const ALL = "all";

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
  const isAll = chosen === ALL;
  // null on the All tab.
  const tab = isAll ? null : (applications.find((a) => a.id === chosen) ?? applications.find((a) => a.name === DEFAULT_TAB) ?? applications[0]);
  const { tagFields, textFields } = useBrandFields(tab?.id);
  const tabs = [{ id: ALL, name: "All", count: brands.length }, ...applications.map((a) => ({ id: a.id, name: a.name, count: countIn(a.id) }))];
  const activeId = isAll ? ALL : tab?.id;

  function countIn(appId: string) {
    return brands.filter((b) => b.applications?.some((a) => a.id === appId)).length;
  }

  function choose(id: string) {
    setChosen(id);
    try {
      localStorage.setItem(LAST_TAB_KEY, id);
    } catch {
      // the tab just isn't remembered
    }
  }

  return (
    <div>
      <PageHeader title="Solutions" />
      <div role="tablist" aria-label="Applications" className="mb-4 flex flex-wrap gap-2">
        {tabs.map((a) => (
          <button
            key={a.id}
            type="button"
            role="tab"
            aria-selected={a.id === activeId}
            onClick={() => choose(a.id)}
            className={`rounded-lg border px-4 py-2 text-sm font-medium ${
              a.id === activeId
                ? "border-blue-600 bg-blue-600 text-white"
                : "border-neutral-300 text-neutral-700 hover:bg-neutral-100 dark:border-neutral-700 dark:text-neutral-300 dark:hover:bg-neutral-800"
            }`}
          >
            {a.name} ({a.count})
          </button>
        ))}
      </div>
      {(tab || isAll) && (
        // Keyed so each tab's list and form start fresh.
        <GlossaryPage
          key={activeId}
          resource="/innovations"
          listPath={tab ? `/innovations?applicationId=${encodeURIComponent(tab.id)}` : "/innovations"}
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
}: GlossaryListContext & { application: Application | null; brands: Brand[]; reloadBrands: () => void }) {
  const [error, setError] = useState<string | null>(null);

  // Keep the tab counts in step with adds / edits / deletes here.
  const signature = data.map((d) => d.id).join(",");
  useEffect(() => {
    reloadBrands();
  }, [signature, reloadBrands]);

  // A brand already in the system (e.g. from Innovations) can join this application.
  const others = application ? brands.filter((b) => !b.applications?.some((a) => a.id === application.id)).sort((a, b) => a.name.localeCompare(b.name)) : [];
  async function addExisting(id: string) {
    const brand = brands.find((b) => b.id === id);
    if (!brand || !application) return;
    setError(null);
    try {
      await api.patch(`/innovations/${id}`, { applicationIds: [...(brand.applications ?? []).map((a) => a.id), application.id] });
      reload();
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Failed to add the brand");
    }
  }

  // The All tab is one list by name (no group rows: a brand's group is
  // within its own applications).
  const appsOf = (b: Brand) => (b.applications as Brand["applications"]) ?? [];
  const groupOf = (b: Brand) => (application ? str(b.solutionGroup) || NO_GROUP : "");
  const groups = [...new Set(data.map(groupOf))].sort((a, b) => (a === NO_GROUP ? 1 : b === NO_GROUP ? -1 : a.localeCompare(b)));

  return (
    <div className="space-y-6" data-solutions>
      {application && others.length > 0 && (
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
      {data.length === 0 && (
        <p className="py-6 text-center text-sm text-neutral-500 dark:text-neutral-400">{application ? `No solutions for ${application.name} yet.` : "No brands yet."}</p>
      )}
      {groups.map((group) => (
        <section key={group} data-solution-group={group || "All"}>
          {group && <h2 className="mb-2 text-sm font-bold tracking-wide text-neutral-600 uppercase dark:text-neutral-300">{group}</h2>}
          <div className="grid grid-cols-[repeat(auto-fill,minmax(240px,1fr))] gap-4">
            {data
              .filter((b) => groupOf(b) === group)
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
                      {/* On All: where each brand belongs, and its year. */}
                      {!application && (
                        <span className="flex flex-wrap items-center gap-1 text-xs" data-solution-apps>
                          {appsOf(b).map((a) => (
                            <span key={a.id} className="rounded-full bg-blue-50 px-2 py-0.5 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300">
                              {a.name}
                            </span>
                          ))}
                          {appsOf(b).length === 0 && <span className="text-neutral-500 dark:text-neutral-400">No application</span>}
                          {typeof b.year === "number" && <span className="text-neutral-500 dark:text-neutral-400">· {b.year}</span>}
                        </span>
                      )}
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

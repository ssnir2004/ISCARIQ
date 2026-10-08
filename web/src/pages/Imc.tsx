import { lazy, Suspense, useEffect, useState } from "react";
import { GlossaryPage, type GlossaryExtraSection, type GlossaryListContext } from "./catalog/GlossaryPage";
import { Button, Label, Modal } from "../components/ui";
import { ClipboardImagePaste } from "../components/npaKnowledge/ClipboardImagePaste";
import { RulesOfThumb } from "../components/RulesOfThumb";
import { api, ApiError } from "../lib/api";
import { ImcTimeline } from "./imc/ImcTimeline";
import type { ImcCompanyLite } from "./imc/imcCountries";

// The map carries world shapes and flags, so it loads only when opened.
const ImcMap = lazy(() => import("./imc/ImcMap"));

// IMC group companies (ISCAR's parent group): name, field of activity,
// location and logo. The page shows the IMC logo
// and rules of thumb on top, then a horizontal row of cards per group.

const str = (v: unknown) => (typeof v === "string" && v.trim() ? v.trim() : "");
const NO_GROUP = "Other";
const yearOf = (c: Record<string, unknown>) => (typeof c.imcSince === "number" ? c.imcSince : Infinity);
const LOGO_KEY = "imc.logo";

function websiteHref(site: string) {
  return /^https?:\/\//i.test(site) ? site : `https://${site}`;
}

type View = "cards" | "map" | "timeline";
const VIEWS: { value: View; label: string }[] = [
  { value: "cards", label: "Cards" },
  { value: "map", label: "Map" },
  { value: "timeline", label: "Timeline" },
];
const VIEW_KEY = "iscariq.imc.view";

function readView(): View {
  try {
    const v = localStorage.getItem(VIEW_KEY);
    return VIEWS.some((x) => x.value === v) ? (v as View) : "cards";
  } catch {
    return "cards";
  }
}

// Cards / Map / Timeline of the companies (the choice is remembered).
function CompanyViews(ctx: GlossaryListContext) {
  const [view, setView] = useState<View>(readView);
  const companies: ImcCompanyLite[] = ctx.data.map((c) => ({
    id: c.id,
    name: c.name,
    country: str(c.country) || null,
    logo: str(c.logo) || null,
    imcSince: typeof c.imcSince === "number" ? c.imcSince : null,
    description: str(c.description) || null,
  }));

  function choose(v: View) {
    setView(v);
    try {
      localStorage.setItem(VIEW_KEY, v);
    } catch {
      // not remembered
    }
  }

  return (
    <div className="space-y-4">
      <div className="inline-flex rounded-lg border border-neutral-200 p-0.5 text-sm dark:border-neutral-700" role="tablist">
        {VIEWS.map((v) => (
          <button
            key={v.value}
            type="button"
            role="tab"
            aria-selected={view === v.value}
            onClick={() => choose(v.value)}
            className={`rounded-md px-3 py-1 ${view === v.value ? "bg-blue-600 text-white" : "text-neutral-600 hover:text-neutral-900 dark:text-neutral-300 dark:hover:text-white"}`}
          >
            {v.label}
          </button>
        ))}
      </div>
      {view === "map" ? (
        <Suspense fallback={<p className="text-sm text-neutral-500">Loading map…</p>}>
          <ImcMap companies={companies} />
        </Suspense>
      ) : view === "timeline" ? (
        <ImcTimeline companies={companies} />
      ) : (
        <CompanyCards {...ctx} />
      )}
    </div>
  );
}

function CompanyCards({ data, startEdit, remove }: GlossaryListContext) {
  const groups = [...new Set(data.map((c) => str(c.groupName) || NO_GROUP))].sort((a, b) =>
    a === NO_GROUP ? 1 : b === NO_GROUP ? -1 : a.localeCompare(b)
  );

  if (data.length === 0) return <p className="py-6 text-center text-sm text-neutral-500 dark:text-neutral-400">No companies yet.</p>;

  return (
    <div className="space-y-6" data-imc-companies>
      {groups.map((group) => (
        <section key={group} data-imc-group={group}>
          <h2 className="mb-2 text-sm font-semibold tracking-wide text-neutral-500 uppercase dark:text-neutral-400">{group}</h2>
          {/* One row per group, scrolling sideways when it doesn't fit. */}
          <div className="flex gap-4 overflow-x-auto pb-2" data-imc-row>
            {data
              .filter((c) => (str(c.groupName) || NO_GROUP) === group)
              // Left to right by the year they joined IMC (no year last), then by name.
              .sort((a, b) => yearOf(a) - yearOf(b) || a.name.localeCompare(b.name))
              .map((c) => {
                const where = [str(c.city), str(c.country)].filter(Boolean).join(", ");
                const site = str(c.website);
                return (
                  <article
                    key={c.id}
                    className="group flex w-72 shrink-0 flex-col overflow-hidden rounded-xl border border-neutral-200 bg-white dark:border-neutral-800 dark:bg-neutral-900"
                    data-imc-company={c.name}
                  >
                    {/* Company name on top of the card. */}
                    <h3 className="border-b border-neutral-200 px-3 py-2 text-base font-bold text-neutral-900 dark:border-neutral-800 dark:text-neutral-100" data-imc-name>
                      {c.name}
                    </h3>
                    <div className="flex flex-1 flex-col gap-1 p-3 text-sm">
                      {/* White backing so dark (transparent) logos stay visible in dark mode. */}
                      {str(c.logo) && (
                        <span className="self-start rounded-md bg-white px-2 py-1 ring-1 ring-neutral-200 dark:ring-neutral-700">
                          <img src={str(c.logo)} alt={`${c.name} logo`} className="h-8 max-w-36 object-contain" data-imc-logo />
                        </span>
                      )}
                      {str(c.activity) && <p className="font-medium text-blue-700 dark:text-blue-300">{str(c.activity)}</p>}
                      {where && <p className="text-neutral-600 dark:text-neutral-300">📍 {where}</p>}
                      {typeof c.imcSince === "number" && (
                        <p className="text-neutral-600 dark:text-neutral-300" data-imc-since>
                          IMC since <span className="font-semibold">{c.imcSince}</span>
                        </p>
                      )}
                      {c.description && <p className="text-xs whitespace-pre-line text-neutral-500 dark:text-neutral-400">{c.description}</p>}
                      {site && (
                        <a href={websiteHref(site)} target="_blank" rel="noreferrer" className="truncate text-xs text-blue-600 hover:underline dark:text-blue-400">
                          {site}
                        </a>
                      )}
                      <div className="mt-auto flex justify-end gap-1 pt-1 opacity-0 transition-opacity group-hover:opacity-100 focus-within:opacity-100">
                        <Button variant="ghost" onClick={() => startEdit(c)}>
                          Edit
                        </Button>
                        <Button variant="ghost" onClick={() => remove(c.id)}>
                          Delete
                        </Button>
                      </div>
                    </div>
                  </article>
                );
              })}
          </div>
        </section>
      ))}
    </div>
  );
}

// The company logo, as an image field in the form (companies have no other picture).
const logoSection: GlossaryExtraSection = {
  read: (entry) => ({ logo: str(entry.logo) || null }),
  render: ({ values, setValues }) => (
    <div>
      <Label>Logo (optional)</Label>
      <ClipboardImagePaste value={(values.logo as string | null) ?? null} onChange={(logo) => setValues({ ...values, logo })} />
    </div>
  ),
};

// The IMC logo at the top of the page (an app setting), with a small
// window to add, replace or remove it.
function ImcHeader() {
  const [logo, setLogo] = useState<string | null>(null);
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    api
      .get<{ value: string | null }>(`/settings/${LOGO_KEY}`)
      .then((r) => setLogo(r.value))
      .catch(() => setLogo(null));
  }, []);

  async function save() {
    setError(null);
    try {
      await api.put(`/settings/${LOGO_KEY}`, { value: draft });
      setLogo(draft);
      setEditing(false);
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Failed to save the logo");
    }
  }

  return (
    <div className="mb-4 flex items-center gap-4" data-imc-header>
      {logo && (
        <span className="rounded-lg bg-white px-3 py-1.5 ring-1 ring-neutral-200 dark:ring-neutral-700">
          <img src={logo} alt="IMC logo" className="h-14 max-w-56 object-contain" data-imc-page-logo />
        </span>
      )}
      <h1 className="text-2xl font-semibold text-neutral-900 dark:text-neutral-100">IMC</h1>
      <Button
        variant="ghost"
        onClick={() => {
          setDraft(logo);
          setEditing(true);
        }}
      >
        {logo ? "Change logo" : "+ Add logo"}
      </Button>
      {editing && (
        <Modal title="IMC logo" onClose={() => setEditing(false)}>
          <div className="space-y-3">
            <ClipboardImagePaste value={draft} onChange={setDraft} />
            {error && <p className="text-sm text-red-600 dark:text-red-400">{error}</p>}
            <div className="flex gap-2">
              <Button type="button" onClick={save}>
                Save
              </Button>
              <Button type="button" variant="secondary" onClick={() => setEditing(false)}>
                Cancel
              </Button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}

export function Imc() {
  return (
    <div>
      <ImcHeader />
      <RulesOfThumb scope="imc" />
      <GlossaryPage
        resource="/imc-companies"
        title="IMC"
        hideHeader
        noImage
        singular="company"
        collapsibleForm
        textFields={[
          { key: "groupName", label: "Group", placeholder: "e.g. Cutting tools" },
          { key: "activity", label: "Field of activity", placeholder: "e.g. Cutting tools — milling" },
          { key: "country", label: "Country (several: comma-separated)", placeholder: "e.g. Israel  or  Korea, India" },
          { key: "city", label: "City", placeholder: "e.g. Tefen" },
          { key: "website", label: "Website (optional)", placeholder: "e.g. www.iscar.com" },
          { key: "imcSince", label: "Part of IMC since (year)", type: "number", placeholder: "e.g. 2006" },
        ]}
        extraSection={logoSection}
        renderList={(ctx) => <CompanyViews {...ctx} />}
      />
    </div>
  );
}

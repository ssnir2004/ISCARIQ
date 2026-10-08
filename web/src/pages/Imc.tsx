import { useState } from "react";
import { GlossaryPage, type Entry, type GlossaryListContext } from "./catalog/GlossaryPage";
import { Button, Modal } from "../components/ui";

// IMC group companies (ISCAR's parent group): name, field of activity,
// location and a picture of the building, as cards grouped by country.

const str = (v: unknown) => (typeof v === "string" && v.trim() ? v.trim() : "");
const NO_COUNTRY = "Other";

function websiteHref(site: string) {
  return /^https?:\/\//i.test(site) ? site : `https://${site}`;
}

function CompanyCards({ data, startEdit, remove }: GlossaryListContext) {
  const [zoom, setZoom] = useState<Entry | null>(null);
  const countries = [...new Set(data.map((c) => str(c.country) || NO_COUNTRY))].sort((a, b) =>
    a === NO_COUNTRY ? 1 : b === NO_COUNTRY ? -1 : a.localeCompare(b)
  );

  if (data.length === 0) return <p className="py-6 text-center text-sm text-neutral-500 dark:text-neutral-400">No companies yet.</p>;

  return (
    <div className="space-y-6" data-imc-companies>
      {countries.map((country) => (
        <section key={country} data-imc-country={country}>
          <h2 className="mb-2 text-sm font-semibold tracking-wide text-neutral-500 uppercase dark:text-neutral-400">{country}</h2>
          <div className="grid grid-cols-[repeat(auto-fill,minmax(260px,1fr))] gap-4">
            {data
              .filter((c) => (str(c.country) || NO_COUNTRY) === country)
              .map((c) => {
                const where = [str(c.city), str(c.country)].filter(Boolean).join(", ");
                const site = str(c.website);
                return (
                  <article
                    key={c.id}
                    className="group flex flex-col overflow-hidden rounded-xl border border-neutral-200 bg-white dark:border-neutral-800 dark:bg-neutral-900"
                    data-imc-company={c.name}
                  >
                    {c.image ? (
                      <button type="button" onClick={() => setZoom(c)} title="Enlarge" className="block">
                        <img src={c.image} alt={`${c.name} building`} className="h-40 w-full object-cover" />
                      </button>
                    ) : (
                      <div className="flex h-40 items-center justify-center bg-neutral-100 text-xs text-neutral-400 dark:bg-neutral-800">No image</div>
                    )}
                    <div className="flex flex-1 flex-col gap-1 p-3 text-sm">
                      <h3 className="text-base font-bold text-neutral-900 dark:text-neutral-100">{c.name}</h3>
                      {str(c.activity) && <p className="font-medium text-blue-700 dark:text-blue-300">{str(c.activity)}</p>}
                      {where && <p className="text-neutral-600 dark:text-neutral-300">📍 {where}</p>}
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
      {zoom?.image && (
        <Modal title={zoom.name} onClose={() => setZoom(null)} wide>
          <img src={zoom.image} alt={`${zoom.name} building`} className="mx-auto max-h-[75vh] rounded-lg object-contain" />
        </Modal>
      )}
    </div>
  );
}

export function Imc() {
  return (
    <GlossaryPage
      resource="/imc-companies"
      title="IMC"
      singular="company"
      collapsibleForm
      textFields={[
        { key: "activity", label: "Field of activity", placeholder: "e.g. Cutting tools — milling" },
        { key: "country", label: "Country", placeholder: "e.g. Israel" },
        { key: "city", label: "City", placeholder: "e.g. Tefen" },
        { key: "website", label: "Website (optional)", placeholder: "e.g. www.iscar.com" },
      ]}
      renderList={(ctx) => <CompanyCards {...ctx} />}
    />
  );
}

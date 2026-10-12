import { useState, type FormEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import { api, ApiError } from "../lib/api";
import { useResource } from "../lib/useResource";
import { BRANCH_REGIONS, COUNTRY_OPTIONS, countryName, plantCountry } from "../lib/countries";
import { Flag } from "../components/Flag";
import schaefflerLogo from "../assets/schaeffler-ina-logo.png";
import type { Branch, Plant } from "../lib/types";
import { Button, Card, Input, Label, PageHeader, Select } from "../components/ui";

// ISCAR branches worldwide, in sections by sales region: a card per branch
// with its flag, country, manager, address and how many contacts and
// Schaeffler plants it has. A branch's
// page holds the details, contacts, plants and general information.
const OTHER = "Other";
const regionOf = (b: Branch) => (b.region && (BRANCH_REGIONS as readonly string[]).includes(b.region) ? b.region : OTHER);

export function Branches() {
  const { data: branches, reload } = useResource<Branch>("/branches");
  const { data: plants } = useResource<Plant>("/plants");
  const [adding, setAdding] = useState(false);
  const [name, setName] = useState("");
  const [country, setCountry] = useState("");
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  async function add(e: FormEvent) {
    e.preventDefault();
    setError(null);
    try {
      const created = await api.post<Branch>("/branches", { name: name.trim(), country: country || null });
      await reload();
      navigate(`/branches/${created.id}`);
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Failed to add the branch");
    }
  }

  const plantsIn = (code: string | null | undefined) => (code ? plants.filter((p) => plantCountry(p) === code) : []);

  return (
    <div>
      <PageHeader title={`ISCAR Branches (${branches.length})`} action={!adding && <Button onClick={() => setAdding(true)}>+ Add branch</Button>} />
      {adding && (
        <Card className="mb-6 max-w-2xl p-4">
          <form onSubmit={add} className="grid grid-cols-2 gap-3">
            <div>
              <Label>Name</Label>
              <Input value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g. ISCAR Germany" required autoFocus />
            </div>
            <div>
              <Label>Country</Label>
              <Select value={country} onChange={(e) => setCountry(e.target.value)} aria-label="Country">
                <option value="">Choose…</option>
                {COUNTRY_OPTIONS.map((c) => (
                  <option key={c.code} value={c.code}>
                    {c.name}
                  </option>
                ))}
              </Select>
            </div>
            {error && <p className="col-span-2 text-sm text-red-600 dark:text-red-400">{error}</p>}
            <div className="col-span-2 flex gap-2">
              <Button type="submit">Add branch</Button>
              <Button type="button" variant="secondary" onClick={() => setAdding(false)}>
                Cancel
              </Button>
            </div>
          </form>
        </Card>
      )}

      <div className="space-y-6" data-branches>
        {[...BRANCH_REGIONS, OTHER]
          .map((region) => ({ region, items: branches.filter((b) => regionOf(b) === region) }))
          .filter((g) => g.items.length > 0)
          .map(({ region, items }) => (
            <section key={region} data-region={region}>
              <h2 className="mb-2 text-sm font-bold tracking-wide text-neutral-600 uppercase dark:text-neutral-300">{region} ({items.length})</h2>
              <div className="grid grid-cols-[repeat(auto-fill,minmax(260px,1fr))] gap-4">
                {items.map((b) => {
                  const branchPlants = plantsIn(b.country);
                  return (
                    <Link
                      key={b.id}
                      to={`/branches/${b.id}`}
                      className="relative flex flex-col gap-1 rounded-xl border border-neutral-200 bg-white p-4 text-sm shadow-sm hover:border-blue-400 dark:border-neutral-800 dark:bg-neutral-900 dark:hover:border-blue-500"
                      data-branch={b.name}
                    >
                      {/* Branches responsible for Schaeffler plants carry the Schaeffler (INA) logo. */}
                      {branchPlants.length > 0 && (
                        <img
                          src={schaefflerLogo}
                          alt="Schaeffler plants"
                          title={`Schaeffler plants: ${branchPlants.map((p) => p.name).join(", ")}`}
                          className="absolute top-3 right-3 h-11 w-11 rounded-md bg-white object-contain p-0.5 ring-1 ring-neutral-200 dark:ring-neutral-700"
                          data-schaeffler-logo
                        />
                      )}
                      <span className={`flex items-center gap-2 text-base font-bold text-neutral-900 dark:text-neutral-100 ${branchPlants.length > 0 ? "pr-12" : ""}`}>
                        <Flag code={b.country} className="h-5 w-7" />
                        {b.name}
                      </span>
                      {b.country && <span className="text-neutral-600 dark:text-neutral-300">{countryName(b.country)}</span>}
                      {b.managerName && (
                        <span className="text-neutral-700 dark:text-neutral-200">
                          <span className="text-neutral-500 dark:text-neutral-400">Manager:</span> {b.managerName}
                        </span>
                      )}
                      {b.address && <span className="line-clamp-2 text-xs whitespace-pre-line text-neutral-500 dark:text-neutral-400">{b.address}</span>}
                      <span className="mt-auto flex flex-wrap gap-1.5 pt-2 text-xs">
                        <span className="rounded-full bg-neutral-100 px-2 py-0.5 text-neutral-700 dark:bg-neutral-800 dark:text-neutral-300">
                          {b.contacts?.length ?? 0} contacts
                        </span>
                        <span className="rounded-full bg-blue-50 px-2 py-0.5 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300">
                          {branchPlants.length} Schaeffler plants
                        </span>
                        {(b.notes?.length ?? 0) > 0 && (
                          <span className="rounded-full bg-amber-50 px-2 py-0.5 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300">{b.notes!.length} notes</span>
                        )}
                      </span>
                    </Link>
                  );
                })}
              </div>
            </section>
          ))}
      </div>
    </div>
  );
}

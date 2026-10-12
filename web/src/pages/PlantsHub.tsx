import { useEffect } from "react";
import { Navigate, NavLink, useParams } from "react-router-dom";
import { PageHeader } from "../components/ui";
import type { PlantCompany } from "../lib/types";
import { PlantsMap } from "./PlantsMap";

// One "Plants" page with a tab per company (Schaeffler, Dauch, GKN Aero);
// each tab is that company's plants map. The tab is part of the URL
// (/plants/<slug>) and the last one used is remembered.
const PLANT_TABS: { slug: string; company: PlantCompany; label: string }[] = [
  { slug: "schaeffler", company: "SCHAEFFLER", label: "Schaeffler Plants" },
  { slug: "dauch", company: "DAUCH", label: "Dauch Plants" },
  { slug: "gkn-aero", company: "GKN_AERO", label: "GKN Aero Plants" },
];

const LAST_TAB_KEY = "iscariq.plants.tab";

export function PlantsHub() {
  const { slug } = useParams();
  const tab = PLANT_TABS.find((t) => t.slug === slug);

  useEffect(() => {
    if (!tab) return;
    try {
      localStorage.setItem(LAST_TAB_KEY, tab.slug);
    } catch {
      // storage unavailable: the tab just isn't remembered
    }
  }, [tab]);

  if (!tab) {
    // /plants (or an unknown tab): go to the last tab used, else Schaeffler.
    let last = "schaeffler";
    try {
      last = localStorage.getItem(LAST_TAB_KEY) ?? last;
    } catch {
      // ignore
    }
    return <Navigate to={`/plants/${PLANT_TABS.some((t) => t.slug === last) ? last : "schaeffler"}`} replace />;
  }

  return (
    <div>
      <PageHeader title="Plants" />
      <div role="tablist" aria-label="Plant companies" className="mb-4 flex flex-wrap gap-2">
        {PLANT_TABS.map((t) => (
          <NavLink
            key={t.slug}
            to={`/plants/${t.slug}`}
            role="tab"
            aria-selected={t.slug === tab.slug}
            className={`rounded-lg border px-4 py-2 text-sm font-medium ${
              t.slug === tab.slug
                ? "border-blue-600 bg-blue-600 text-white"
                : "border-neutral-300 text-neutral-700 hover:bg-neutral-100 dark:border-neutral-700 dark:text-neutral-300 dark:hover:bg-neutral-800"
            }`}
          >
            {t.label}
          </NavLink>
        ))}
      </div>
      {/* Keyed so each company's map starts fresh. */}
      <PlantsMap key={tab.company} company={tab.company} title={tab.label} hideTitle />
    </div>
  );
}

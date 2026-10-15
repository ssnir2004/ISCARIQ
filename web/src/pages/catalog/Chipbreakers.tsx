import { useCallback, useEffect, useState, type FormEvent, type ReactNode } from "react";
import { GlossaryPage } from "./GlossaryPage";
import { ChipbreakerChart, feedText, nextColor, rangeColor, sortRanges } from "./ChipbreakerChart";
import { RulesOfThumb } from "../../components/RulesOfThumb";
import { PictureCases } from "../../components/cases/PictureCases";
import { Button, Card, Input, Label, PageHeader, Select } from "../../components/ui";
import { api, ApiError } from "../../lib/api";
import { useResource } from "../../lib/useResource";
import type { Application, Chipbreaker, ChipbreakerRange } from "../../lib/types";

// Chipbreakers by application: a tab per application with its rules of
// thumb, a feed range chart and the list of its chipbreakers (feed range,
// color and cases each), plus an "All chipbreakers" tab with every chipbreaker's
// name, description and picture.

const LAST_TAB_KEY = "iscariq.chipbreakers.tab";
const LIST_TAB = "list";
const DEFAULT_TAB = "Parting";

function readLastTab() {
  try {
    return localStorage.getItem(LAST_TAB_KEY);
  } catch {
    return null;
  }
}

export function Chipbreakers() {
  const { data: applications } = useResource<Application>("/applications");
  const { data: allRanges, reload: reloadAll } = useResource<ChipbreakerRange>("/chipbreaker-ranges");
  const [chosen, setChosen] = useState<string | null>(readLastTab);
  const isList = chosen === LIST_TAB;
  const tab = isList ? null : (applications.find((a) => a.id === chosen) ?? applications.find((a) => a.name.toLowerCase() === DEFAULT_TAB.toLowerCase()) ?? applications[0]);
  const activeId = isList ? LIST_TAB : tab?.id;

  function choose(id: string) {
    setChosen(id);
    try {
      localStorage.setItem(LAST_TAB_KEY, id);
    } catch {
      // the tab just isn't remembered
    }
  }

  const tabs = [
    ...applications.map((a) => ({ id: a.id, label: `${a.name} (${allRanges.filter((r) => r.applicationId === a.id).length})` })),
    { id: LIST_TAB, label: "All chipbreakers" },
  ];

  return (
    <div>
      <PageHeader title="Chipbreakers" />
      <div role="tablist" aria-label="Applications" className="mb-4 flex flex-wrap gap-2">
        {tabs.map((t) => (
          <button
            key={t.id}
            type="button"
            role="tab"
            aria-selected={t.id === activeId}
            onClick={() => choose(t.id)}
            className={`rounded-lg border px-4 py-2 text-sm font-medium ${
              t.id === activeId
                ? "border-blue-600 bg-blue-600 text-white"
                : "border-neutral-300 text-neutral-700 hover:bg-neutral-100 dark:border-neutral-700 dark:text-neutral-300 dark:hover:bg-neutral-800"
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>
      {isList ? (
        <GlossaryPage resource="/chipbreakers" title="Chipbreakers" singular="chipbreaker" hideHeader collapsibleForm />
      ) : (
        tab && <ApplicationChipbreakers key={tab.id} application={tab} onChange={reloadAll} />
      )}
    </div>
  );
}

function ApplicationChipbreakers({ application, onChange }: { application: Application; onChange: () => void }) {
  const { data: ranges, reload } = useResource<ChipbreakerRange>(`/chipbreaker-ranges?applicationId=${encodeURIComponent(application.id)}`);
  const { data: chipbreakers, reload: reloadChipbreakers } = useResource<Chipbreaker>("/chipbreakers");
  // The range being edited, or "new" while adding one.
  const [editing, setEditing] = useState<ChipbreakerRange | "new" | null>(null);
  // The chipbreaker whose cases are open, if any.
  const [casesOf, setCasesOf] = useState<ChipbreakerRange | null>(null);
  const [caseCounts, setCaseCounts] = useState<Record<string, number>>({});
  const sorted = sortRanges(ranges);

  const loadCounts = useCallback(() => {
    api
      .get<Record<string, number>>(`/chipbreaker-cases/counts?applicationId=${encodeURIComponent(application.id)}`)
      .then(setCaseCounts)
      .catch(() => setCaseCounts({}));
  }, [application.id]);
  useEffect(loadCounts, [loadCounts]);

  async function refresh() {
    await reload();
    onChange();
  }

  async function remove(r: ChipbreakerRange) {
    if (!confirm(`Remove ${r.chipbreaker.name} from ${application.name}? (The chipbreaker itself is kept.)`)) return;
    try {
      await api.delete(`/chipbreaker-ranges/${r.id}`);
      await refresh();
    } catch (err) {
      alert(err instanceof ApiError ? err.message : "Failed to remove the chipbreaker");
    }
  }

  return (
    <div className="space-y-4" data-chipbreakers-app={application.name}>
      <RulesOfThumb scope={`chipbreakers:${application.id}`} />

      <Card className="p-4">
        <h2 className="mb-3 text-base font-bold text-neutral-900 dark:text-neutral-100">Feed range on {application.name} chipbreakers</h2>
        {sorted.some((r) => r.feedMin != null) ? (
          <ChipbreakerChart ranges={sorted} />
        ) : (
          <p className="py-4 text-sm text-neutral-500 dark:text-neutral-400">Give chipbreakers a feed range to see them on the chart.</p>
        )}
      </Card>

      <Card className="p-4">
        <div className="mb-3 flex items-center justify-between">
          <h2 className="text-base font-bold text-neutral-900 dark:text-neutral-100">
            {application.name} chipbreakers ({sorted.length})
          </h2>
          {editing === null && <Button onClick={() => setEditing("new")}>+ Add chipbreaker</Button>}
        </div>
        {editing !== null && (
          <RangeForm
            application={application}
            chipbreakers={chipbreakers}
            taken={ranges.map((r) => r.chipbreakerId)}
            existing={editing === "new" ? null : editing}
            defaultColor={nextColor(sorted)}
            onCancel={() => setEditing(null)}
            onSaved={async () => {
              setEditing(null);
              await Promise.all([refresh(), reloadChipbreakers()]);
            }}
          />
        )}
        {sorted.length === 0 ? (
          editing === null && <p className="py-4 text-center text-sm text-neutral-500 dark:text-neutral-400">No chipbreakers for {application.name} yet.</p>
        ) : (
          <table className="w-full text-sm" data-chipbreaker-table>
            <thead>
              <tr className="border-b border-neutral-200 text-left text-xs text-neutral-500 dark:border-neutral-800 dark:text-neutral-400">
                <th className="py-2 pr-3 font-medium">Chipbreaker</th>
                <th className="py-2 pr-3 font-medium">Feed (mm/rev)</th>
                <th className="py-2 pr-3 font-medium">Description</th>
                <th className="py-2 pr-3 font-medium">Notes</th>
                <th className="py-2 pr-3 font-medium">Cases</th>
                <th />
              </tr>
            </thead>
            <tbody>
              {sorted.map((r, i) => (
                <tr key={r.id} className="border-b border-neutral-100 align-top last:border-0 dark:border-neutral-800" data-chipbreaker-row={r.chipbreaker.name}>
                  <td className="py-2 pr-3">
                    <span className="flex items-center gap-2">
                      <span className="h-4 w-4 shrink-0 rounded" style={{ backgroundColor: rangeColor(r, i) }} />
                      {r.chipbreaker.image && <img src={r.chipbreaker.image} alt="" className="h-8 w-8 rounded bg-white object-contain" />}
                      <span className="font-semibold text-neutral-900 dark:text-neutral-100">{r.chipbreaker.name}</span>
                    </span>
                  </td>
                  <td className="py-2 pr-3 whitespace-nowrap tabular-nums">
                    {feedText(r)}
                  </td>
                  <td className="py-2 pr-3 whitespace-pre-line text-neutral-600 dark:text-neutral-300">{r.chipbreaker.description}</td>
                  <td className="py-2 pr-3 whitespace-pre-line text-neutral-600 dark:text-neutral-300">{r.notes}</td>
                  <td className="py-2 pr-3">
                    <button
                      type="button"
                      onClick={() => setCasesOf(r)}
                      className="rounded-full bg-amber-50 px-2 py-0.5 text-xs whitespace-nowrap text-amber-800 hover:bg-amber-100 dark:bg-amber-900/30 dark:text-amber-300 dark:hover:bg-amber-900/60"
                      data-chipbreaker-cases={r.chipbreaker.name}
                    >
                      {caseCounts[r.chipbreakerId] ?? 0} case{(caseCounts[r.chipbreakerId] ?? 0) === 1 ? "" : "s"}
                    </button>
                  </td>
                  <td className="py-2 text-right whitespace-nowrap">
                    <Button variant="ghost" onClick={() => setEditing(r)}>
                      Edit
                    </Button>
                    <Button variant="ghost" onClick={() => remove(r)}>
                      Remove
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </Card>

      {casesOf && (
        <CasesPanel title={`${casesOf.chipbreaker.name} — ${application.name}`} onClose={() => setCasesOf(null)}>
          <PictureCases
            label={`${casesOf.chipbreaker.name} (${application.name})`}
            listPath={`/chipbreaker-cases?chipbreakerId=${encodeURIComponent(casesOf.chipbreakerId)}&applicationId=${encodeURIComponent(application.id)}`}
            endpoint="/chipbreaker-cases"
            createExtra={{ chipbreakerId: casesOf.chipbreakerId, applicationId: application.id }}
            onCountChange={loadCounts}
          />
        </CasesPanel>
      )}
    </div>
  );
}

// A window over the screen for a chipbreaker's cases; below the full-screen
// case view (z-40) and the add / edit window (z-50), so both open over it.
function CasesPanel({ title, onClose, children }: { title: string; onClose: () => void; children: ReactNode }) {
  return (
    <div className="fixed inset-0 z-30 flex items-center justify-center bg-black/50 p-4" onClick={onClose} data-cases-panel>
      <Card className="max-h-[90vh] w-full max-w-5xl overflow-y-auto p-4" onClick={(e) => e.stopPropagation()}>
        <div className="mb-3 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-neutral-900 dark:text-neutral-100">{title}</h2>
          <button
            type="button"
            onClick={onClose}
            className="rounded p-1 text-neutral-500 hover:bg-neutral-100 dark:text-neutral-400 dark:hover:bg-neutral-800"
            aria-label="Close"
          >
            ✕
          </button>
        </div>
        {children}
      </Card>
    </div>
  );
}

const NEW = "__new__";

// Add a chipbreaker to the application (an existing one, or a new one by
// name) or edit its range: feed from / to, color and notes.
function RangeForm({
  application,
  chipbreakers,
  taken,
  existing,
  defaultColor,
  onCancel,
  onSaved,
}: {
  application: Application;
  chipbreakers: Chipbreaker[];
  taken: string[];
  existing: ChipbreakerRange | null;
  defaultColor: string;
  onCancel: () => void;
  onSaved: () => void;
}) {
  const available = chipbreakers.filter((c) => !taken.includes(c.id)).sort((a, b) => a.name.localeCompare(b.name));
  const [chipbreakerId, setChipbreakerId] = useState(existing?.chipbreakerId ?? (available.length > 0 ? "" : NEW));
  const [newName, setNewName] = useState("");
  const [feedMin, setFeedMin] = useState(existing?.feedMin != null ? String(existing.feedMin) : "");
  const [feedMax, setFeedMax] = useState(existing?.feedMax != null ? String(existing.feedMax) : "");
  const [color, setColor] = useState(existing?.color ?? defaultColor);
  const [notes, setNotes] = useState(existing?.notes ?? "");
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  async function save(e: FormEvent) {
    e.preventDefault();
    setError(null);
    // The feed range is optional: both ends or neither.
    const min = feedMin.trim() ? Number(feedMin) : null;
    const max = feedMax.trim() ? Number(feedMax) : null;
    if ((min === null) !== (max === null)) return setError("Enter both ends of the feed range, or neither");
    if (min !== null && max !== null) {
      if (!(min > 0) || !(max > 0)) return setError("Feed must be above 0");
      if (min >= max) return setError("The feed range must go from low to high");
    }
    const fields = { feedMin: min, feedMax: max, color, notes: notes.trim() || null };
    setSaving(true);
    try {
      if (existing) {
        await api.patch(`/chipbreaker-ranges/${existing.id}`, fields);
      } else {
        let id = chipbreakerId;
        if (id === NEW) {
          if (!newName.trim()) {
            setError("Enter the new chipbreaker's name");
            return;
          }
          id = (await api.post<Chipbreaker>("/chipbreakers", { name: newName.trim() })).id;
        }
        if (!id) {
          setError("Choose a chipbreaker");
          return;
        }
        await api.post("/chipbreaker-ranges", { applicationId: application.id, chipbreakerId: id, ...fields });
      }
      onSaved();
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Failed to save");
    } finally {
      setSaving(false);
    }
  }

  return (
    <form onSubmit={save} className="mb-4 grid grid-cols-2 gap-3 rounded-lg border border-neutral-200 p-3 md:grid-cols-[2fr_1fr_1fr_auto] dark:border-neutral-700" data-range-form>
      <div className="col-span-2 md:col-span-1">
        <Label>Chipbreaker</Label>
        {existing ? (
          <p className="py-1.5 text-sm font-semibold text-neutral-900 dark:text-neutral-100">{existing.chipbreaker.name}</p>
        ) : (
          <div className="flex gap-2">
            <Select value={chipbreakerId} onChange={(e) => setChipbreakerId(e.target.value)} aria-label="Chipbreaker">
              <option value="">Choose…</option>
              {available.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
              <option value={NEW}>+ New chipbreaker…</option>
            </Select>
            {chipbreakerId === NEW && <Input value={newName} onChange={(e) => setNewName(e.target.value)} placeholder="Name, e.g. MF" aria-label="New chipbreaker name" autoFocus />}
          </div>
        )}
      </div>
      <div>
        <Label>Feed from (mm/rev, optional)</Label>
        <Input type="number" step="any" min="0" value={feedMin} onChange={(e) => setFeedMin(e.target.value)} placeholder="e.g. 0.04" aria-label="Feed from" />
      </div>
      <div>
        <Label>Feed to (mm/rev, optional)</Label>
        <Input type="number" step="any" min="0" value={feedMax} onChange={(e) => setFeedMax(e.target.value)} placeholder="e.g. 0.1" aria-label="Feed to" />
      </div>
      <div>
        <Label>Color</Label>
        <input type="color" value={color} onChange={(e) => setColor(e.target.value)} className="h-9 w-14 cursor-pointer rounded border border-neutral-300 bg-transparent dark:border-neutral-700" aria-label="Color" />
      </div>
      <div className="col-span-2 md:col-span-4">
        <Label>Notes (optional)</Label>
        <Input value={notes} onChange={(e) => setNotes(e.target.value)} placeholder={`e.g. first choice for ${application.name}`} aria-label="Notes" />
      </div>
      {error && <p className="col-span-2 text-sm text-red-600 md:col-span-4 dark:text-red-400">{error}</p>}
      <div className="col-span-2 flex gap-2 md:col-span-4">
        <Button type="submit" disabled={saving}>
          {existing ? "Save" : "Add"}
        </Button>
        <Button type="button" variant="secondary" onClick={onCancel}>
          Cancel
        </Button>
      </div>
    </form>
  );
}

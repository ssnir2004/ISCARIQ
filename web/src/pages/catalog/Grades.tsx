import { useEffect, useState, type KeyboardEvent } from "react";
import { Link, Navigate, NavLink, useParams } from "react-router-dom";
import { api, ApiError } from "../../lib/api";
import { Button, Input, Label, PageHeader } from "../../components/ui";
import { GlossaryPage, type GlossaryExtraSection, type GlossarySelectField, type GlossaryTagField } from "./GlossaryPage";
import { GradesBoard } from "./GradesBoard";
import { ISO513_COLORS, MATERIAL_GROUPS } from "../../lib/npaKnowledgeConstants";
import { FAMILY_GROUPS } from "../../lib/gradeGroups";
import { useResource } from "../../lib/useResource";
import type { Application, Grade, GradeFamily, Iso513Group, Substrate } from "../../lib/types";

type AppGroups = Record<string, Iso513Group[]>;

// Rows = the grade's selected applications, columns = its selected ISO 513
// groups. Unticking a cell (e.g. IC830 · Milling · S) makes the grade skip
// that group in that application only. Only rows that differ from "all
// groups" are kept in `value`.
function ApplicationGroupsMatrix({
  applications,
  groups,
  value,
  onChange,
}: {
  applications: Application[];
  groups: Iso513Group[];
  value: AppGroups;
  onChange: (v: AppGroups) => void;
}) {
  if (applications.length === 0 || groups.length === 0) return null;
  const orderedGroups = MATERIAL_GROUPS.filter((g) => groups.includes(g.value)).map((g) => g.value);
  const checked = (appId: string, g: Iso513Group) => (value[appId] ? value[appId].includes(g) : true);

  function toggle(appId: string, g: Iso513Group) {
    const current = orderedGroups.filter((x) => checked(appId, x));
    const next = current.includes(g) ? current.filter((x) => x !== g) : [...current, g];
    const copy = { ...value };
    if (next.length === orderedGroups.length) delete copy[appId];
    else copy[appId] = next;
    onChange(copy);
  }

  return (
    <div>
      <Label>Materials per application</Label>
      <p className="mb-1.5 text-xs text-neutral-500 dark:text-neutral-400">Untick a material the grade isn't used for in a specific application.</p>
      <table className="text-sm" data-app-groups-matrix>
        <thead>
          <tr>
            <th />
            {orderedGroups.map((g) => (
              <th key={g} className="px-1 pb-1">
                <span className="inline-block w-7 rounded text-center text-xs font-semibold text-neutral-900" style={{ backgroundColor: ISO513_COLORS[g] }}>
                  {g}
                </span>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {applications.map((a) => (
            <tr key={a.id}>
              <td className="pr-3 text-neutral-700 dark:text-neutral-300">{a.name}</td>
              {orderedGroups.map((g) => (
                <td key={g} className="px-1 text-center">
                  <input
                    type="checkbox"
                    aria-label={`${a.name} ${g}`}
                    checked={checked(a.id, g)}
                    onChange={() => toggle(a.id, g)}
                    className="h-4 w-4 accent-blue-600"
                  />
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

// Inline "new substrate" form shown inside the grade form. It is not a
// <form> (it sits inside the grade's form), so Enter is handled by hand.
function NewSubstrateInline({ onCreated, onCancel }: { onCreated: (id: string) => Promise<void>; onCancel: () => void }) {
  const [name, setName] = useState("");
  const [hardness, setHardness] = useState("");
  const [toughness, setToughness] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  async function save() {
    if (!name.trim()) {
      setError("Name is required");
      return;
    }
    setError(null);
    setSaving(true);
    try {
      const created = await api.post<Substrate>("/substrates", {
        name: name.trim(),
        hardness: hardness.trim() ? Number(hardness) : null,
        toughness: toughness.trim() ? Number(toughness) : null,
      });
      await onCreated(created.id);
    } catch (err) {
      setError(err instanceof ApiError && err.status === 409 ? `A substrate named "${name.trim()}" already exists` : "Failed to create the substrate");
      setSaving(false);
    }
  }

  function onKeyDown(e: KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Enter") {
      e.preventDefault(); // don't submit the grade form
      save();
    } else if (e.key === "Escape") {
      e.preventDefault();
      onCancel();
    }
  }

  return (
    <div className="mt-2 space-y-2 rounded-lg border border-blue-200 bg-blue-50/50 p-3 dark:border-blue-900 dark:bg-blue-950/20">
      <p className="text-xs font-medium text-blue-800 dark:text-blue-300">New substrate</p>
      <div className="grid grid-cols-3 gap-2">
        <Input value={name} onChange={(e) => setName(e.target.value)} onKeyDown={onKeyDown} placeholder="Name" aria-label="New substrate name" autoFocus />
        <Input type="number" step="any" value={hardness} onChange={(e) => setHardness(e.target.value)} onKeyDown={onKeyDown} placeholder="Hardness (optional)" aria-label="Substrate hardness" />
        <Input type="number" step="any" value={toughness} onChange={(e) => setToughness(e.target.value)} onKeyDown={onKeyDown} placeholder="KIC (optional)" aria-label="Fracture toughness (KIC)" />
      </div>
      {error && <p className="text-xs text-red-600 dark:text-red-400">{error}</p>}
      <div className="flex gap-2">
        <Button type="button" onClick={save} disabled={saving}>
          {saving ? "Adding…" : "Add substrate"}
        </Button>
        <Button type="button" variant="secondary" onClick={onCancel}>
          Cancel
        </Button>
      </div>
    </div>
  );
}

// One Grades screen per family (Carbide, CBN, Ceramic, PCD). They share the
// whole interface; only carbide grades have a substrate.
export function GradesScreen({ family, title, hideHeader = false }: { family: GradeFamily; title: string; hideHeader?: boolean }) {
  // Applications are managed on their own screen, so new ones show up here automatically.
  const { data: applications } = useResource<Application>("/applications");
  // Likewise substrates, from the Substrates screen.
  const { data: substrates, reload: reloadSubstrates } = useResource<Substrate>("/substrates");

  const selectFields: GlossarySelectField[] = [
    {
      key: "substrateId",
      label: "Substrate",
      options: substrates.map((s) => ({ value: s.id, label: s.name })),
      read: (entry) => (entry.substrate as Substrate | null | undefined)?.id,
      create: {
        label: "+ New substrate…",
        render: (done) => (
          <NewSubstrateInline
            onCreated={async (id) => {
              // Refresh the options first so the new substrate can be selected.
              await reloadSubstrates();
              done(id);
            }}
            onCancel={() => done(null)}
          />
        ),
      },
      emptyHint: (
        <>
          No substrates yet.{" "}
          <Link to="/catalog/substrates" className="text-blue-600 hover:underline dark:text-blue-400">
            Add them on the Substrates screen
          </Link>
          .
        </>
      ),
    },
  ];

  const fields: GlossaryTagField[] = [
    {
      key: "iso513Groups",
      label: "Materials (ISO 513)",
      // Only the materials this family can be used for.
      options: MATERIAL_GROUPS.filter((g) => FAMILY_GROUPS[family].includes(g.value)).map((g) => ({ ...g, short: g.value })),
    },
    {
      key: "applicationIds",
      label: "Applications",
      options: applications.map((a) => ({ value: a.id, label: a.name })),
      read: (entry) => ((entry.applications as Application[] | undefined) ?? []).map((a) => a.id),
      emptyHint: (
        <>
          No applications yet.{" "}
          <Link to="/catalog/applications" className="text-blue-600 hover:underline dark:text-blue-400">
            Add them on the Applications screen
          </Link>
          .
        </>
      ),
    },
  ];

  const appGroupsSection: GlossaryExtraSection = {
    read: (entry) => ({
      applicationGroups: Object.fromEntries(
        ((entry.applicationGroups as Grade["applicationGroups"]) ?? []).map((r) => [r.applicationId, r.iso513Groups])
      ),
    }),
    render: ({ tags, values, setValues }) => (
      <ApplicationGroupsMatrix
        applications={applications.filter((a) => (tags.applicationIds ?? []).includes(a.id))}
        groups={(tags.iso513Groups ?? []) as Iso513Group[]}
        value={(values.applicationGroups as AppGroups) ?? {}}
        onChange={(v) => setValues({ ...values, applicationGroups: v })}
      />
    ),
  };

  return (
    <GlossaryPage
      // Remount per family so form and board state don't carry across screens.
      key={family}
      resource="/grades"
      listPath={`/grades?family=${family}`}
      createValues={{ family }}
      title={title}
      hideHeader={hideHeader}
      singular="grade"
      selectFields={family === "CARBIDE" ? selectFields : []}
      checkboxFields={family === "CBN" ? [{ key: "coated", label: "Coated" }] : []}
      tagFields={fields}
      extraSection={appGroupsSection}
      renderList={(ctx) => <GradesBoard {...ctx} family={family} />}
    />
  );
}

// One "Grades" page with a tab per grade family; each tab is that family's
// Grades screen. The tab is part of the URL (/catalog/grades/<slug>).
const GRADE_TABS: { slug: string; family: GradeFamily; label: string }[] = [
  { slug: "sc", family: "CARBIDE", label: "Grades (SC)" },
  { slug: "cbn", family: "CBN", label: "Grades (CBN)" },
  { slug: "ceramic", family: "CERAMIC", label: "Grades (Ceramic)" },
  { slug: "pcd", family: "PCD", label: "Grades (PCD)" },
];

const LAST_TAB_KEY = "iscariq.grades.familyTab";

export function GradesHub() {
  const { slug } = useParams();
  const tab = GRADE_TABS.find((t) => t.slug === slug);

  useEffect(() => {
    if (!tab) return;
    try {
      localStorage.setItem(LAST_TAB_KEY, tab.slug);
    } catch {
      // storage unavailable: the tab just isn't remembered
    }
  }, [tab]);

  if (!tab) {
    // /catalog/grades (or an unknown tab): go to the last tab used, else SC.
    let last = "sc";
    try {
      last = localStorage.getItem(LAST_TAB_KEY) ?? "sc";
    } catch {
      // ignore
    }
    return <Navigate to={`/catalog/grades/${GRADE_TABS.some((t) => t.slug === last) ? last : "sc"}`} replace />;
  }

  return (
    <div>
      <PageHeader title="Grades" />
      <div role="tablist" aria-label="Grade families" className="mb-6 flex flex-wrap gap-2">
        {GRADE_TABS.map((t) => (
          <NavLink
            key={t.slug}
            to={`/catalog/grades/${t.slug}`}
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
      <GradesScreen key={tab.family} family={tab.family} title={tab.label} hideHeader />
    </div>
  );
}

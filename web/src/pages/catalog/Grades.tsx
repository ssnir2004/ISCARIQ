import { useState, type KeyboardEvent } from "react";
import { Link } from "react-router-dom";
import { api, ApiError } from "../../lib/api";
import { Button, Input } from "../../components/ui";
import { GlossaryPage, type GlossarySelectField, type GlossaryTagField } from "./GlossaryPage";
import { GradesBoard } from "./GradesBoard";
import { ISO513_GROUPS } from "../../lib/npaKnowledgeConstants";
import { useResource } from "../../lib/useResource";
import type { Application, Substrate } from "../../lib/types";

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

export function Grades() {
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
      options: ISO513_GROUPS.map((g) => ({ ...g, short: g.value })),
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

  return (
    <GlossaryPage
      resource="/grades"
      title="Grades"
      singular="grade"
      selectFields={selectFields}
      tagFields={fields}
      renderList={(ctx) => <GradesBoard {...ctx} />}
    />
  );
}

import { useState, type FormEvent } from "react";
import { useResource } from "../../lib/useResource";
import { api, ApiError } from "../../lib/api";
import type { CoolantPreference, CuttingCondition, Insert, InsertProblemMatch, Material, OperationType, ProblemTag } from "../../lib/types";
import { Button, Card, Input, Label, PageHeader, Select } from "../../components/ui";

const OPERATIONS: OperationType[] = ["TURNING", "MILLING", "DRILLING", "GROOVING", "THREADING", "BORING"];
const COOLANT_OPTIONS: CoolantPreference[] = ["REQUIRED", "OPTIONAL", "AVOID"];

function numOrUndefined(v: string) {
  return v === "" ? undefined : Number(v);
}

function CuttingConditionsSection({ inserts, materials }: { inserts: Insert[]; materials: Material[] }) {
  const { data, reload } = useResource<CuttingCondition>("/cutting-conditions");
  const [form, setForm] = useState({
    insertId: "",
    materialId: "",
    operationType: "TURNING" as OperationType,
    apMin: "",
    apMax: "",
    vcMin: "",
    vcMax: "",
    feedMin: "",
    feedMax: "",
    coolant: "OPTIONAL" as CoolantPreference,
  });
  const [error, setError] = useState<string | null>(null);

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);
    try {
      await api.post("/cutting-conditions", {
        insertId: form.insertId || inserts[0]?.id,
        materialId: form.materialId || materials[0]?.id,
        operationType: form.operationType,
        apMin: numOrUndefined(form.apMin),
        apMax: numOrUndefined(form.apMax),
        vcMin: numOrUndefined(form.vcMin),
        vcMax: numOrUndefined(form.vcMax),
        feedMin: numOrUndefined(form.feedMin),
        feedMax: numOrUndefined(form.feedMax),
        coolant: form.coolant,
      });
      setForm({ ...form, apMin: "", apMax: "", vcMin: "", vcMax: "", feedMin: "", feedMax: "" });
      reload();
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Failed to create cutting condition");
    }
  }

  async function remove(id: string) {
    if (!confirm("Delete this cutting condition?")) return;
    setError(null);
    try {
      await api.delete(`/cutting-conditions/${id}`);
      reload();
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Failed to delete cutting condition");
    }
  }

  return (
    <Card className="p-4">
      <h2 className="mb-3 text-sm font-semibold text-neutral-900 dark:text-neutral-100">Cutting Conditions</h2>
      <form onSubmit={onSubmit} className="mb-4 grid grid-cols-4 gap-3">
        <div>
          <Label>Insert</Label>
          <Select value={form.insertId} onChange={(e) => setForm({ ...form, insertId: e.target.value })} required>
            <option value="">Select…</option>
            {inserts.map((i) => (
              <option key={i.id} value={i.id}>
                {i.designation}
              </option>
            ))}
          </Select>
        </div>
        <div>
          <Label>Material</Label>
          <Select value={form.materialId} onChange={(e) => setForm({ ...form, materialId: e.target.value })} required>
            <option value="">Select…</option>
            {materials.map((m) => (
              <option key={m.id} value={m.id}>
                {m.iso513Group} — {m.name}
              </option>
            ))}
          </Select>
        </div>
        <div>
          <Label>Operation</Label>
          <Select value={form.operationType} onChange={(e) => setForm({ ...form, operationType: e.target.value as OperationType })}>
            {OPERATIONS.map((o) => (
              <option key={o} value={o}>
                {o}
              </option>
            ))}
          </Select>
        </div>
        <div>
          <Label>Coolant</Label>
          <Select value={form.coolant} onChange={(e) => setForm({ ...form, coolant: e.target.value as CoolantPreference })}>
            {COOLANT_OPTIONS.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </Select>
        </div>
        <div>
          <Label>ap min</Label>
          <Input type="number" step="any" value={form.apMin} onChange={(e) => setForm({ ...form, apMin: e.target.value })} />
        </div>
        <div>
          <Label>ap max</Label>
          <Input type="number" step="any" value={form.apMax} onChange={(e) => setForm({ ...form, apMax: e.target.value })} />
        </div>
        <div>
          <Label>vc min (m/min)</Label>
          <Input type="number" step="any" value={form.vcMin} onChange={(e) => setForm({ ...form, vcMin: e.target.value })} />
        </div>
        <div>
          <Label>vc max (m/min)</Label>
          <Input type="number" step="any" value={form.vcMax} onChange={(e) => setForm({ ...form, vcMax: e.target.value })} />
        </div>
        <div>
          <Label>feed min (mm/rev)</Label>
          <Input type="number" step="any" value={form.feedMin} onChange={(e) => setForm({ ...form, feedMin: e.target.value })} />
        </div>
        <div>
          <Label>feed max (mm/rev)</Label>
          <Input type="number" step="any" value={form.feedMax} onChange={(e) => setForm({ ...form, feedMax: e.target.value })} />
        </div>
        {error && <p className="col-span-4 text-sm text-red-600 dark:text-red-400">{error}</p>}
        <div className="col-span-4">
          <Button type="submit">Add Cutting Condition</Button>
        </div>
      </form>

      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead className="text-xs uppercase text-neutral-500 dark:text-neutral-400">
            <tr>
              <th className="px-2 py-1">Insert</th>
              <th className="px-2 py-1">Material</th>
              <th className="px-2 py-1">Op</th>
              <th className="px-2 py-1">ap</th>
              <th className="px-2 py-1">vc</th>
              <th className="px-2 py-1">feed</th>
              <th className="px-2 py-1">Coolant</th>
              <th className="px-2 py-1"></th>
            </tr>
          </thead>
          <tbody>
            {data.map((c) => (
              <tr key={c.id} className="border-t border-neutral-200 dark:border-neutral-800">
                <td className="px-2 py-1 font-mono">{c.insert?.designation}</td>
                <td className="px-2 py-1">{c.material?.iso513Group}</td>
                <td className="px-2 py-1">{c.operationType}</td>
                <td className="px-2 py-1">
                  {c.apMin ?? "—"}–{c.apMax ?? "—"}
                </td>
                <td className="px-2 py-1">
                  {c.vcMin ?? "—"}–{c.vcMax ?? "—"}
                </td>
                <td className="px-2 py-1">
                  {c.feedMin ?? "—"}–{c.feedMax ?? "—"}
                </td>
                <td className="px-2 py-1">{c.coolant}</td>
                <td className="px-2 py-1 text-right">
                  <Button variant="ghost" onClick={() => remove(c.id)}>
                    Delete
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Card>
  );
}

function ProblemMatchesSection({ inserts, materials, tags }: { inserts: Insert[]; materials: Material[]; tags: ProblemTag[] }) {
  const { data, reload } = useResource<InsertProblemMatch>("/insert-problem-matches");
  const [form, setForm] = useState({ insertId: "", problemTagId: "", materialId: "", priority: "0" });
  const [error, setError] = useState<string | null>(null);

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);
    try {
      await api.post("/insert-problem-matches", {
        insertId: form.insertId || inserts[0]?.id,
        problemTagId: form.problemTagId || tags[0]?.id,
        materialId: form.materialId || undefined,
        priority: Number(form.priority) || 0,
      });
      reload();
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Failed to create match");
    }
  }

  async function remove(id: string) {
    if (!confirm("Delete this match?")) return;
    setError(null);
    try {
      await api.delete(`/insert-problem-matches/${id}`);
      reload();
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Failed to delete match");
    }
  }

  return (
    <Card className="p-4">
      <h2 className="mb-3 text-sm font-semibold text-neutral-900 dark:text-neutral-100">
        Insert ↔ Problem Matches <span className="font-normal text-neutral-500">(what each insert solves)</span>
      </h2>
      <form onSubmit={onSubmit} className="mb-4 grid grid-cols-4 gap-3">
        <div>
          <Label>Insert</Label>
          <Select value={form.insertId} onChange={(e) => setForm({ ...form, insertId: e.target.value })} required>
            <option value="">Select…</option>
            {inserts.map((i) => (
              <option key={i.id} value={i.id}>
                {i.designation}
              </option>
            ))}
          </Select>
        </div>
        <div>
          <Label>Problem</Label>
          <Select value={form.problemTagId} onChange={(e) => setForm({ ...form, problemTagId: e.target.value })} required>
            <option value="">Select…</option>
            {tags.map((t) => (
              <option key={t.id} value={t.id}>
                {t.name}
              </option>
            ))}
          </Select>
        </div>
        <div>
          <Label>Material (optional)</Label>
          <Select value={form.materialId} onChange={(e) => setForm({ ...form, materialId: e.target.value })}>
            <option value="">Any</option>
            {materials.map((m) => (
              <option key={m.id} value={m.id}>
                {m.iso513Group} — {m.name}
              </option>
            ))}
          </Select>
        </div>
        <div>
          <Label>Priority</Label>
          <Input type="number" value={form.priority} onChange={(e) => setForm({ ...form, priority: e.target.value })} />
        </div>
        {error && <p className="col-span-4 text-sm text-red-600 dark:text-red-400">{error}</p>}
        <div className="col-span-4">
          <Button type="submit">Add Match</Button>
        </div>
      </form>

      <div className="space-y-1">
        {data.map((m) => (
          <div key={m.id} className="flex items-center justify-between rounded-lg px-2 py-1 text-sm hover:bg-neutral-50 dark:hover:bg-neutral-800">
            <span>
              <span className="font-mono">{m.insert?.designation}</span> solves{" "}
              <span className="font-medium">{m.problemTag?.name}</span>
              {m.material && ` in ${m.material.name}`}
              {m.priority ? ` (priority ${m.priority})` : ""}
            </span>
            <Button variant="ghost" onClick={() => remove(m.id)}>
              Delete
            </Button>
          </div>
        ))}
      </div>
    </Card>
  );
}

export function CuttingConditions() {
  const { data: inserts } = useResource<Insert>("/inserts");
  const { data: materials } = useResource<Material>("/materials");
  const { data: tags } = useResource<ProblemTag>("/problem-tags");

  return (
    <div className="max-w-6xl space-y-6">
      <PageHeader title="Cutting Conditions & Problem Matches" />
      <CuttingConditionsSection inserts={inserts} materials={materials} />
      <ProblemMatchesSection inserts={inserts} materials={materials} tags={tags} />
    </div>
  );
}

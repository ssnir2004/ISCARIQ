import { useState, type FormEvent } from "react";
import { useResource } from "../../lib/useResource";
import { api, ApiError } from "../../lib/api";
import type { CoolantPreference, Insert } from "../../lib/types";
import { Button, Card, Input, Label, PageHeader, Select } from "../../components/ui";

const COOLANT_OPTIONS: CoolantPreference[] = ["REQUIRED", "OPTIONAL", "AVOID"];

const EMPTY_FORM = {
  designation: "",
  shape: "",
  size: "",
  chipbreaker: "",
  grade: "",
  coatingType: "",
  substrate: "",
  coolantPreference: "OPTIONAL" as CoolantPreference,
  notes: "",
};

export function Inserts() {
  const { data, reload } = useResource<Insert>("/inserts");
  const [form, setForm] = useState(EMPTY_FORM);
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);
    setSubmitting(true);
    try {
      await api.post("/inserts", form);
      setForm(EMPTY_FORM);
      reload();
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Failed to create insert");
    } finally {
      setSubmitting(false);
    }
  }

  async function remove(id: string) {
    if (!confirm("Delete this insert?")) return;
    setError(null);
    try {
      await api.delete(`/inserts/${id}`);
      reload();
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Failed to delete insert");
    }
  }

  return (
    <div className="max-w-5xl">
      <PageHeader title="Inserts" />
      <Card className="mb-6 p-4">
        <form onSubmit={onSubmit} className="grid grid-cols-4 gap-4">
          <div>
            <Label>Designation</Label>
            <Input value={form.designation} onChange={(e) => setForm({ ...form, designation: e.target.value })} placeholder="CNMG120408-MF" required />
          </div>
          <div>
            <Label>Shape</Label>
            <Input value={form.shape} onChange={(e) => setForm({ ...form, shape: e.target.value })} placeholder="CNMG" required />
          </div>
          <div>
            <Label>Size</Label>
            <Input value={form.size} onChange={(e) => setForm({ ...form, size: e.target.value })} placeholder="120408" required />
          </div>
          <div>
            <Label>Chipbreaker</Label>
            <Input value={form.chipbreaker} onChange={(e) => setForm({ ...form, chipbreaker: e.target.value })} placeholder="MF" required />
          </div>
          <div>
            <Label>Grade</Label>
            <Input value={form.grade} onChange={(e) => setForm({ ...form, grade: e.target.value })} placeholder="IC907" required />
          </div>
          <div>
            <Label>Coating</Label>
            <Input value={form.coatingType} onChange={(e) => setForm({ ...form, coatingType: e.target.value })} placeholder="PVD TiAlN" />
          </div>
          <div>
            <Label>Substrate</Label>
            <Input value={form.substrate} onChange={(e) => setForm({ ...form, substrate: e.target.value })} placeholder="Carbide" />
          </div>
          <div>
            <Label>Coolant</Label>
            <Select value={form.coolantPreference} onChange={(e) => setForm({ ...form, coolantPreference: e.target.value as CoolantPreference })}>
              {COOLANT_OPTIONS.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </Select>
          </div>
          <div className="col-span-4">
            <Label>Notes</Label>
            <Input value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} />
          </div>
          {error && <p className="col-span-4 text-sm text-red-600 dark:text-red-400">{error}</p>}
          <div className="col-span-4">
            <Button type="submit" disabled={submitting}>
              Add Insert
            </Button>
          </div>
        </form>
      </Card>

      <div className="overflow-x-auto rounded-xl border border-neutral-200 dark:border-neutral-800">
        <table className="w-full text-left text-sm">
          <thead className="bg-neutral-100 text-xs uppercase text-neutral-500 dark:bg-neutral-900 dark:text-neutral-400">
            <tr>
              <th className="px-3 py-2">Designation</th>
              <th className="px-3 py-2">Shape</th>
              <th className="px-3 py-2">Size</th>
              <th className="px-3 py-2">Chipbreaker</th>
              <th className="px-3 py-2">Grade</th>
              <th className="px-3 py-2">Coating</th>
              <th className="px-3 py-2">Coolant</th>
              <th className="px-3 py-2"></th>
            </tr>
          </thead>
          <tbody>
            {data.map((i) => (
              <tr key={i.id} className="border-t border-neutral-200 dark:border-neutral-800">
                <td className="px-3 py-2 font-mono">{i.designation}</td>
                <td className="px-3 py-2">{i.shape}</td>
                <td className="px-3 py-2">{i.size}</td>
                <td className="px-3 py-2">{i.chipbreaker}</td>
                <td className="px-3 py-2">{i.grade}</td>
                <td className="px-3 py-2">{i.coatingType || "—"}</td>
                <td className="px-3 py-2">{i.coolantPreference}</td>
                <td className="px-3 py-2 text-right">
                  <Button variant="ghost" onClick={() => remove(i.id)}>
                    Delete
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

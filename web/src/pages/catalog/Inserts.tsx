import { useState, type ChangeEvent, type FormEvent } from "react";
import { useResource } from "../../lib/useResource";
import { api, ApiError } from "../../lib/api";
import type { CoolantPreference, Insert } from "../../lib/types";
import { Button, Card, Input, Label, PageHeader, Select } from "../../components/ui";

const COOLANT_OPTIONS: CoolantPreference[] = ["REQUIRED", "OPTIONAL", "AVOID"];

const EMPTY_FORM = {
  item: "",
  designation: "",
  shape: "",
  size: "",
  chipbreaker: "",
  grade: "",
  coatingType: "",
  substrate: "",
  coolantPreference: "OPTIONAL" as CoolantPreference,
  notes: "",
  image: "" as string | null,
};

function readFileAsDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

export function Inserts() {
  const { data, reload } = useResource<Insert>("/inserts");
  const [form, setForm] = useState(EMPTY_FORM);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [fileInputKey, setFileInputKey] = useState(0);

  async function onImageChange(e: ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setForm({ ...form, image: await readFileAsDataUrl(file) });
  }

  function startEdit(i: Insert) {
    setForm({
      item: i.item ?? "",
      designation: i.designation,
      shape: i.shape,
      size: i.size,
      chipbreaker: i.chipbreaker,
      grade: i.grade,
      coatingType: i.coatingType ?? "",
      substrate: i.substrate ?? "",
      coolantPreference: i.coolantPreference,
      notes: i.notes ?? "",
      image: i.image ?? "",
    });
    setEditingId(i.id);
    setError(null);
  }

  function cancelEdit() {
    setForm(EMPTY_FORM);
    setEditingId(null);
    setFileInputKey((k) => k + 1);
    setError(null);
  }

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);
    setSubmitting(true);
    try {
      if (editingId) {
        await api.patch(`/inserts/${editingId}`, form);
      } else {
        await api.post("/inserts", form);
      }
      setForm(EMPTY_FORM);
      setEditingId(null);
      setFileInputKey((k) => k + 1);
      reload();
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Failed to save insert");
    } finally {
      setSubmitting(false);
    }
  }

  async function remove(id: string) {
    if (!confirm("Delete this insert?")) return;
    setError(null);
    try {
      await api.delete(`/inserts/${id}`);
      if (editingId === id) cancelEdit();
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
            <Label>Item</Label>
            <Input value={form.item} onChange={(e) => setForm({ ...form, item: e.target.value })} placeholder="5506322" />
          </div>
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
          <div className="col-span-2">
            <Label>Image</Label>
            <div className="flex items-center gap-3">
              <Input key={fileInputKey} type="file" accept="image/*" onChange={onImageChange} />
              {form.image && (
                <img src={form.image} alt="Preview" className="h-10 w-10 rounded object-cover" />
              )}
            </div>
          </div>
          <div className="col-span-4">
            <Label>Notes</Label>
            <Input value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} />
          </div>
          {error && <p className="col-span-4 text-sm text-red-600 dark:text-red-400">{error}</p>}
          <div className="col-span-4 flex gap-2">
            <Button type="submit" disabled={submitting}>
              {editingId ? "Save Changes" : "Add Insert"}
            </Button>
            {editingId && (
              <Button type="button" variant="secondary" onClick={cancelEdit}>
                Cancel
              </Button>
            )}
          </div>
        </form>
      </Card>

      <div className="overflow-x-auto rounded-xl border border-neutral-200 dark:border-neutral-800">
        <table className="w-full text-left text-sm">
          <thead className="bg-neutral-100 text-xs uppercase text-neutral-500 dark:bg-neutral-900 dark:text-neutral-400">
            <tr>
              <th className="px-3 py-2">Image</th>
              <th className="px-3 py-2">Item</th>
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
                <td className="px-3 py-2">
                  {i.image ? (
                    <img src={i.image} alt={i.designation} className="h-10 w-10 rounded object-cover" />
                  ) : (
                    "—"
                  )}
                </td>
                <td className="px-3 py-2">{i.item || "—"}</td>
                <td className="px-3 py-2 font-mono">{i.designation}</td>
                <td className="px-3 py-2">{i.shape}</td>
                <td className="px-3 py-2">{i.size}</td>
                <td className="px-3 py-2">{i.chipbreaker}</td>
                <td className="px-3 py-2">{i.grade}</td>
                <td className="px-3 py-2">{i.coatingType || "—"}</td>
                <td className="px-3 py-2">{i.coolantPreference}</td>
                <td className="px-3 py-2 text-right">
                  <Button variant="ghost" onClick={() => startEdit(i)}>
                    Edit
                  </Button>
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

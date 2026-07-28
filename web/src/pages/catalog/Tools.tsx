import { useState, type ChangeEvent, type FormEvent } from "react";
import { useResource } from "../../lib/useResource";
import { api, ApiError } from "../../lib/api";
import type { Tool } from "../../lib/types";
import { Button, Card, Input, Label, PageHeader } from "../../components/ui";

const EMPTY_FORM = {
  image: "" as string | null,
  item: "",
  designation: "",
  tailConnection: "",
  tailSize: "",
  noseConnection: "",
  noseSize: "",
  notes: "",
};

function readFileAsDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

export function Tools() {
  const { data, reload } = useResource<Tool>("/tools");
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

  function startEdit(t: Tool) {
    setForm({
      image: t.image ?? "",
      item: t.item ?? "",
      designation: t.designation,
      tailConnection: t.tailConnection,
      tailSize: t.tailSize,
      noseConnection: t.noseConnection,
      noseSize: t.noseSize,
      notes: t.notes ?? "",
    });
    setEditingId(t.id);
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
        await api.patch(`/tools/${editingId}`, form);
      } else {
        await api.post("/tools", form);
      }
      setForm(EMPTY_FORM);
      setEditingId(null);
      setFileInputKey((k) => k + 1);
      reload();
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Failed to save tool");
    } finally {
      setSubmitting(false);
    }
  }

  async function remove(id: string) {
    if (!confirm("Delete this tool?")) return;
    setError(null);
    try {
      await api.delete(`/tools/${id}`);
      if (editingId === id) cancelEdit();
      reload();
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Failed to delete tool");
    }
  }

  return (
    <div className="max-w-5xl">
      <PageHeader title="Tools" />
      <Card className="mb-6 p-4">
        <form onSubmit={onSubmit} className="grid grid-cols-4 gap-4">
          <div className="col-span-2">
            <Label>Image</Label>
            <div className="flex items-center gap-3">
              <Input key={fileInputKey} type="file" accept="image/*" onChange={onImageChange} />
              {form.image && (
                <img src={form.image} alt="Preview" className="h-10 w-10 rounded object-cover" />
              )}
            </div>
          </div>
          <div>
            <Label>Item</Label>
            <Input value={form.item} onChange={(e) => setForm({ ...form, item: e.target.value })} placeholder="5506322" />
          </div>
          <div>
            <Label>Designation</Label>
            <Input value={form.designation} onChange={(e) => setForm({ ...form, designation: e.target.value })} required />
          </div>
          <div>
            <Label>Tail connection</Label>
            <Input value={form.tailConnection} onChange={(e) => setForm({ ...form, tailConnection: e.target.value })} required />
          </div>
          <div>
            <Label>Tail size</Label>
            <Input value={form.tailSize} onChange={(e) => setForm({ ...form, tailSize: e.target.value })} required />
          </div>
          <div>
            <Label>Nose connection</Label>
            <Input value={form.noseConnection} onChange={(e) => setForm({ ...form, noseConnection: e.target.value })} required />
          </div>
          <div>
            <Label>Nose size</Label>
            <Input value={form.noseSize} onChange={(e) => setForm({ ...form, noseSize: e.target.value })} required />
          </div>
          <div className="col-span-4">
            <Label>Notes</Label>
            <Input value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} />
          </div>
          {error && <p className="col-span-4 text-sm text-red-600 dark:text-red-400">{error}</p>}
          <div className="col-span-4 flex gap-2">
            <Button type="submit" disabled={submitting}>
              {editingId ? "Save Changes" : "Add Tool"}
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
              <th className="px-3 py-2">Tail connection</th>
              <th className="px-3 py-2">Tail size</th>
              <th className="px-3 py-2">Nose connection</th>
              <th className="px-3 py-2">Nose size</th>
              <th className="px-3 py-2">Notes</th>
              <th className="px-3 py-2"></th>
            </tr>
          </thead>
          <tbody>
            {data.map((t) => (
              <tr key={t.id} className="border-t border-neutral-200 dark:border-neutral-800">
                <td className="px-3 py-2">
                  {t.image ? (
                    <img src={t.image} alt={t.designation} className="h-10 w-10 rounded object-cover" />
                  ) : (
                    "—"
                  )}
                </td>
                <td className="px-3 py-2">{t.item || "—"}</td>
                <td className="px-3 py-2 font-mono">{t.designation}</td>
                <td className="px-3 py-2">{t.tailConnection}</td>
                <td className="px-3 py-2">{t.tailSize}</td>
                <td className="px-3 py-2">{t.noseConnection}</td>
                <td className="px-3 py-2">{t.noseSize}</td>
                <td className="px-3 py-2">{t.notes || "—"}</td>
                <td className="px-3 py-2 text-right">
                  <Button variant="ghost" onClick={() => startEdit(t)}>
                    Edit
                  </Button>
                  <Button variant="ghost" onClick={() => remove(t.id)}>
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

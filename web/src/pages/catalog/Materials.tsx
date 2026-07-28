import { useState, type FormEvent } from "react";
import { useResource } from "../../lib/useResource";
import { api, ApiError } from "../../lib/api";
import type { Iso513Group, Material } from "../../lib/types";
import { Button, Card, Input, Label, PageHeader, Select } from "../../components/ui";

const GROUPS: Iso513Group[] = ["P", "M", "K", "N", "S", "H"];

const EMPTY_FORM = {
  iso513Group: "P" as Iso513Group,
  name: "",
  description: "",
  commonUse: "",
  keyProperties: "",
  hardness: "",
};

export function Materials() {
  const { data, reload } = useResource<Material>("/materials");
  const [form, setForm] = useState(EMPTY_FORM);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  function startEdit(m: Material) {
    setForm({
      iso513Group: m.iso513Group,
      name: m.name,
      description: m.description ?? "",
      commonUse: m.commonUse ?? "",
      keyProperties: m.keyProperties ?? "",
      hardness: m.hardness ?? "",
    });
    setEditingId(m.id);
    setError(null);
  }

  function cancelEdit() {
    setForm(EMPTY_FORM);
    setEditingId(null);
    setError(null);
  }

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);
    setSubmitting(true);
    try {
      if (editingId) {
        await api.patch(`/materials/${editingId}`, form);
      } else {
        await api.post("/materials", form);
      }
      setForm(EMPTY_FORM);
      setEditingId(null);
      reload();
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Failed to save material");
    } finally {
      setSubmitting(false);
    }
  }

  async function remove(id: string) {
    if (!confirm("Delete this material?")) return;
    setError(null);
    try {
      await api.delete(`/materials/${id}`);
      if (editingId === id) cancelEdit();
      reload();
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Failed to delete material");
    }
  }

  return (
    <div className="max-w-3xl">
      <PageHeader title="Materials (ISO 513)" />
      <Card className="mb-6 p-4">
        <form onSubmit={onSubmit} className="grid grid-cols-3 gap-4">
          <div>
            <Label>ISO 513 Group</Label>
            <Select value={form.iso513Group} onChange={(e) => setForm({ ...form, iso513Group: e.target.value as Iso513Group })}>
              {GROUPS.map((g) => (
                <option key={g} value={g}>
                  {g}
                </option>
              ))}
            </Select>
          </div>
          <div>
            <Label>Name</Label>
            <Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
          </div>
          <div>
            <Label>Hardness</Label>
            <Input value={form.hardness} onChange={(e) => setForm({ ...form, hardness: e.target.value })} placeholder="45-50 HRC" />
          </div>
          <div className="col-span-3">
            <Label>Description</Label>
            <Input value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
          </div>
          <div className="col-span-3">
            <Label>Common use</Label>
            <Input value={form.commonUse} onChange={(e) => setForm({ ...form, commonUse: e.target.value })} />
          </div>
          <div className="col-span-3">
            <Label>Key properties</Label>
            <Input value={form.keyProperties} onChange={(e) => setForm({ ...form, keyProperties: e.target.value })} />
          </div>
          {error && <p className="col-span-3 text-sm text-red-600 dark:text-red-400">{error}</p>}
          <div className="col-span-3 flex gap-2">
            <Button type="submit" disabled={submitting}>
              {editingId ? "Save Changes" : "Add Material"}
            </Button>
            {editingId && (
              <Button type="button" variant="secondary" onClick={cancelEdit}>
                Cancel
              </Button>
            )}
          </div>
        </form>
      </Card>

      <div className="space-y-2">
        {data.map((m) => (
          <Card key={m.id} className="flex items-center justify-between gap-3 p-3">
            <div className="text-sm">
              <div>
                <span className="mr-2 rounded bg-neutral-100 px-1.5 py-0.5 font-mono text-xs dark:bg-neutral-800">
                  {m.iso513Group}
                </span>
                <span className="font-medium text-neutral-900 dark:text-neutral-100">{m.name}</span>
                {m.hardness && <span className="ml-2 text-neutral-500 dark:text-neutral-400">({m.hardness})</span>}
                {m.description && <span className="ml-2 text-neutral-500 dark:text-neutral-400">— {m.description}</span>}
              </div>
              {m.commonUse && (
                <div className="mt-1 text-neutral-500 dark:text-neutral-400">
                  <span className="font-medium">Common use:</span> {m.commonUse}
                </div>
              )}
              {m.keyProperties && (
                <div className="mt-1 text-neutral-500 dark:text-neutral-400">
                  <span className="font-medium">Key properties:</span> {m.keyProperties}
                </div>
              )}
            </div>
            <div className="flex shrink-0 gap-1">
              <Button variant="ghost" onClick={() => startEdit(m)}>
                Edit
              </Button>
              <Button variant="ghost" onClick={() => remove(m.id)}>
                Delete
              </Button>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}

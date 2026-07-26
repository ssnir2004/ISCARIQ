import { useState, type FormEvent } from "react";
import { useResource } from "../../lib/useResource";
import { api, ApiError } from "../../lib/api";
import type { Iso513Group, Material } from "../../lib/types";
import { Button, Card, Input, Label, PageHeader, Select } from "../../components/ui";

const GROUPS: Iso513Group[] = ["P", "M", "K", "N", "S", "H"];

export function Materials() {
  const { data, reload } = useResource<Material>("/materials");
  const [form, setForm] = useState({ iso513Group: "P" as Iso513Group, name: "", description: "" });
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);
    setSubmitting(true);
    try {
      await api.post("/materials", form);
      setForm({ iso513Group: "P", name: "", description: "" });
      reload();
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Failed to create material");
    } finally {
      setSubmitting(false);
    }
  }

  async function remove(id: string) {
    if (!confirm("Delete this material?")) return;
    setError(null);
    try {
      await api.delete(`/materials/${id}`);
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
            <Label>Description</Label>
            <Input value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
          </div>
          {error && <p className="col-span-3 text-sm text-red-600 dark:text-red-400">{error}</p>}
          <div className="col-span-3">
            <Button type="submit" disabled={submitting}>
              Add Material
            </Button>
          </div>
        </form>
      </Card>

      <div className="space-y-2">
        {data.map((m) => (
          <Card key={m.id} className="flex items-center justify-between p-3">
            <div className="text-sm">
              <span className="mr-2 rounded bg-neutral-100 px-1.5 py-0.5 font-mono text-xs dark:bg-neutral-800">
                {m.iso513Group}
              </span>
              <span className="font-medium text-neutral-900 dark:text-neutral-100">{m.name}</span>
              {m.description && <span className="ml-2 text-neutral-500 dark:text-neutral-400">— {m.description}</span>}
            </div>
            <Button variant="ghost" onClick={() => remove(m.id)}>
              Delete
            </Button>
          </Card>
        ))}
      </div>
    </div>
  );
}

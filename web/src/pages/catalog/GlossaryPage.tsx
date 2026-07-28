import { useState, type ChangeEvent, type FormEvent } from "react";
import { useResource } from "../../lib/useResource";
import { api, ApiError } from "../../lib/api";
import type { GlossaryEntry } from "../../lib/types";
import { Button, Card, Input, Label, PageHeader, Textarea } from "../../components/ui";

const EMPTY_FORM = { name: "", description: "", image: "" as string | null };

function readFileAsDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

export function GlossaryPage({ resource, title, singular }: { resource: string; title: string; singular: string }) {
  const { data, reload } = useResource<GlossaryEntry>(resource);
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

  function startEdit(entry: GlossaryEntry) {
    setForm({ name: entry.name, description: entry.description ?? "", image: entry.image ?? "" });
    setEditingId(entry.id);
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
        await api.patch(`${resource}/${editingId}`, form);
      } else {
        await api.post(resource, form);
      }
      setForm(EMPTY_FORM);
      setEditingId(null);
      setFileInputKey((k) => k + 1);
      reload();
    } catch (err) {
      setError(err instanceof ApiError ? err.message : `Failed to save ${singular}`);
    } finally {
      setSubmitting(false);
    }
  }

  async function remove(id: string) {
    if (!confirm(`Delete this ${singular}?`)) return;
    setError(null);
    try {
      await api.delete(`${resource}/${id}`);
      if (editingId === id) cancelEdit();
      reload();
    } catch (err) {
      setError(err instanceof ApiError ? err.message : `Failed to delete ${singular}`);
    }
  }

  return (
    <div className="max-w-3xl">
      <PageHeader title={title} />
      <Card className="mb-6 p-4">
        <form onSubmit={onSubmit} className="grid grid-cols-1 gap-4">
          <div>
            <Label>Name</Label>
            <Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
          </div>
          <div>
            <Label>Description</Label>
            <Textarea rows={3} value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
          </div>
          <div>
            <Label>Image (optional)</Label>
            <div className="flex items-center gap-3">
              <Input key={fileInputKey} type="file" accept="image/*" onChange={onImageChange} />
              {form.image && <img src={form.image} alt="Preview" className="h-14 w-14 rounded object-cover" />}
            </div>
          </div>
          {error && <p className="text-sm text-red-600 dark:text-red-400">{error}</p>}
          <div className="flex gap-2">
            <Button type="submit" disabled={submitting}>
              {editingId ? "Save Changes" : `Add ${singular}`}
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
        {data.map((entry) => (
          <Card key={entry.id} className="flex items-center justify-between gap-3 p-3">
            <div className="flex items-center gap-3">
              {entry.image && <img src={entry.image} alt={entry.name} className="h-10 w-10 rounded object-cover" />}
              <div className="text-sm">
                <span className="font-medium text-neutral-900 dark:text-neutral-100">{entry.name}</span>
                {entry.description && (
                  <span className="ml-2 text-neutral-500 dark:text-neutral-400">— {entry.description}</span>
                )}
              </div>
            </div>
            <div className="flex shrink-0 gap-1">
              <Button variant="ghost" onClick={() => startEdit(entry)}>
                Edit
              </Button>
              <Button variant="ghost" onClick={() => remove(entry.id)}>
                Delete
              </Button>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}

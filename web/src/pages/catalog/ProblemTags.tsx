import { useState, type FormEvent } from "react";
import { useResource } from "../../lib/useResource";
import { api, ApiError } from "../../lib/api";
import type { ProblemTag } from "../../lib/types";
import { Button, Card, Input, PageHeader } from "../../components/ui";

export function ProblemTags() {
  const { data, reload } = useResource<ProblemTag>("/problem-tags");
  const [name, setName] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);
    setSubmitting(true);
    try {
      await api.post("/problem-tags", { name });
      setName("");
      reload();
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Failed to create tag");
    } finally {
      setSubmitting(false);
    }
  }

  async function remove(id: string) {
    if (!confirm("Delete this problem tag?")) return;
    setError(null);
    try {
      await api.delete(`/problem-tags/${id}`);
      reload();
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Failed to delete problem tag");
    }
  }

  return (
    <div className="max-w-xl">
      <PageHeader title="Problem Tags" />
      <Card className="mb-6 p-4">
        <form onSubmit={onSubmit} className="flex gap-2">
          <Input placeholder="e.g. Chip breaking" value={name} onChange={(e) => setName(e.target.value)} required />
          <Button type="submit" disabled={submitting}>
            Add
          </Button>
        </form>
        {error && <p className="mt-2 text-sm text-red-600 dark:text-red-400">{error}</p>}
      </Card>

      <div className="space-y-2">
        {data.map((t) => (
          <Card key={t.id} className="flex items-center justify-between p-3">
            <span className="text-sm text-neutral-900 dark:text-neutral-100">{t.name}</span>
            <Button variant="ghost" onClick={() => remove(t.id)}>
              Delete
            </Button>
          </Card>
        ))}
      </div>
    </div>
  );
}

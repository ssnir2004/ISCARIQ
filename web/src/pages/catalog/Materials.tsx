import { useRef, useState, type FormEvent } from "react";
import { useResource } from "../../lib/useResource";
import { api, ApiError } from "../../lib/api";
import { ISO513_COLORS, ISO513_GROUPS } from "../../lib/npaKnowledgeConstants";
import type { Iso513Group, Material } from "../../lib/types";
import { Button, Card, Input, Iso513Badge, Label, PageHeader, Select } from "../../components/ui";

const EMPTY_FORM = {
  iso513Group: "P" as Iso513Group,
  name: "",
  description: "",
  commonUse: "",
  keyProperties: "",
  hardness: "",
};

function MaterialDetails({ m }: { m: Material }) {
  return (
    <>
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
    </>
  );
}

export function Materials() {
  const { data, reload } = useResource<Material>("/materials");
  const [form, setForm] = useState(EMPTY_FORM);
  const [editing, setEditing] = useState<Material | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const formRef = useRef<HTMLDivElement>(null);
  const nameRef = useRef<HTMLInputElement>(null);

  const categoryOf = (g: Iso513Group) => data.find((m) => m.isCategory && m.iso513Group === g);
  const categoryName = (g: Iso513Group) =>
    categoryOf(g)?.name ?? ISO513_GROUPS.find((x) => x.value === g)?.label.split(" — ")[1] ?? g;
  const editingCategory = editing?.isCategory ?? false;

  function focusForm(focusName: boolean) {
    formRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    if (focusName) setTimeout(() => nameRef.current?.focus(), 300);
  }

  function startAdd(g: Iso513Group) {
    setForm({ ...EMPTY_FORM, iso513Group: g });
    setEditing(null);
    setError(null);
    focusForm(true);
  }

  function startEdit(m: Material) {
    setForm({
      iso513Group: m.iso513Group,
      name: m.name,
      description: m.description ?? "",
      commonUse: m.commonUse ?? "",
      keyProperties: m.keyProperties ?? "",
      hardness: m.hardness ?? "",
    });
    setEditing(m);
    setError(null);
    focusForm(!m.isCategory);
  }

  function cancelEdit() {
    setForm(EMPTY_FORM);
    setEditing(null);
    setError(null);
  }

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);
    setSubmitting(true);
    try {
      if (editing) {
        // A category's name and group are fixed, so only send its descriptive fields.
        const { iso513Group: _group, name: _name, ...details } = form;
        await api.patch(`/materials/${editing.id}`, editing.isCategory ? details : form);
      } else {
        await api.post("/materials", form);
      }
      setForm(EMPTY_FORM);
      setEditing(null);
      reload();
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Failed to save material");
    } finally {
      setSubmitting(false);
    }
  }

  async function remove(id: string) {
    if (!confirm("Delete this subcategory?")) return;
    setError(null);
    try {
      await api.delete(`/materials/${id}`);
      if (editing?.id === id) cancelEdit();
      reload();
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Failed to delete material");
    }
  }

  return (
    <div className="max-w-3xl">
      <PageHeader title="Materials (ISO 513)" />
      <div ref={formRef} className="scroll-mt-4">
        <Card className="mb-6 p-4">
          <h2 className="mb-3 text-sm font-semibold text-neutral-900 dark:text-neutral-100">
            {editing
              ? editingCategory
                ? `Edit category ${editing.iso513Group} — ${editing.name}`
                : "Edit subcategory"
              : "Add subcategory"}
          </h2>
          <form onSubmit={onSubmit} className="grid grid-cols-3 gap-4">
            <div>
              <Label>Category</Label>
              <Select
                value={form.iso513Group}
                disabled={editingCategory}
                onChange={(e) => setForm({ ...form, iso513Group: e.target.value as Iso513Group })}
              >
                {ISO513_GROUPS.map(({ value: g }) => (
                  <option key={g} value={g}>
                    {g} — {categoryName(g)}
                  </option>
                ))}
              </Select>
            </div>
            <div>
              <Label>Name</Label>
              <Input
                ref={nameRef}
                value={form.name}
                disabled={editingCategory}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                placeholder={editingCategory ? undefined : "100Cr6"}
                required
              />
            </div>
            <div>
              <Label>Hardness</Label>
              <Input value={form.hardness} onChange={(e) => setForm({ ...form, hardness: e.target.value })} placeholder="60–65 HRC" />
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
                {editing ? "Save Changes" : "Add Subcategory"}
              </Button>
              {editing && (
                <Button type="button" variant="secondary" onClick={cancelEdit}>
                  Cancel
                </Button>
              )}
            </div>
          </form>
        </Card>
      </div>

      <div className="space-y-3">
        {ISO513_GROUPS.map(({ value: g }) => {
          const category = categoryOf(g);
          const subs = data.filter((m) => !m.isCategory && m.iso513Group === g);
          return (
            <Card key={g} className="overflow-hidden border-l-4" style={{ borderLeftColor: ISO513_COLORS[g] }}>
              <div className="flex items-start justify-between gap-3 p-3">
                <div className="text-sm">
                  <div>
                    <span className="mr-2">
                      <Iso513Badge group={g} />
                    </span>
                    <span className="font-semibold text-neutral-900 dark:text-neutral-100">{categoryName(g)}</span>
                    {category?.hardness && <span className="ml-2 text-neutral-500 dark:text-neutral-400">({category.hardness})</span>}
                    {category?.description && <span className="ml-2 text-neutral-500 dark:text-neutral-400">— {category.description}</span>}
                  </div>
                  {category && <MaterialDetails m={category} />}
                </div>
                <div className="flex shrink-0 gap-1">
                  <Button variant="ghost" onClick={() => startAdd(g)}>
                    + Subcategory
                  </Button>
                  {category && (
                    <Button variant="ghost" onClick={() => startEdit(category)}>
                      Edit
                    </Button>
                  )}
                </div>
              </div>
              <div className="border-t border-neutral-200 dark:border-neutral-800">
                {subs.length === 0 ? (
                  <p className="py-2 pr-3 pl-10 text-xs text-neutral-400 dark:text-neutral-500">No subcategories yet</p>
                ) : (
                  subs.map((m) => (
                    <div
                      key={m.id}
                      className="flex items-start justify-between gap-3 border-t border-neutral-100 py-2 pr-3 pl-10 first:border-t-0 dark:border-neutral-800"
                    >
                      <div className="text-sm">
                        <div>
                          <span className="font-medium text-neutral-900 dark:text-neutral-100">{m.name}</span>
                          {m.hardness && <span className="ml-2 text-neutral-500 dark:text-neutral-400">({m.hardness})</span>}
                          {m.description && <span className="ml-2 text-neutral-500 dark:text-neutral-400">— {m.description}</span>}
                        </div>
                        <MaterialDetails m={m} />
                      </div>
                      <div className="flex shrink-0 gap-1">
                        <Button variant="ghost" onClick={() => startEdit(m)}>
                          Edit
                        </Button>
                        <Button variant="ghost" onClick={() => remove(m.id)}>
                          Delete
                        </Button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
}

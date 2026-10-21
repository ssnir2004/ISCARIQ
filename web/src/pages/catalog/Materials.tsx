import { useRef, useState, type FormEvent } from "react";
import { AddSection } from "../../components/AddSection";
import { useResource } from "../../lib/useResource";
import { api, ApiError } from "../../lib/api";
import { ISO513_COLORS, MATERIAL_GROUPS } from "../../lib/npaKnowledgeConstants";
import type { GradeRecommendation, Iso513Group, Material } from "../../lib/types";
import { Button, Card, Input, Iso513Badge, Label, Modal, PageHeader, Select } from "../../components/ui";
import { ClipboardImagePaste } from "../../components/npaKnowledge/ClipboardImagePaste";
import { MaterialGrades, MaterialGradesSummary, recommendationsFor } from "./MaterialGrades";

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

const COLLAPSED_KEY = "iscariq.materials.collapsed";

function readCollapsed(): Iso513Group[] {
  try {
    const v = JSON.parse(localStorage.getItem(COLLAPSED_KEY) ?? "[]");
    return Array.isArray(v) ? v : [];
  } catch {
    return [];
  }
}

export function Materials() {
  const { data, reload } = useResource<Material>("/materials");
  // For each material's recommended grades, by application (Grades → Conditions).
  const { data: recommendations } = useResource<GradeRecommendation>("/grade-recommendations");
  const [form, setForm] = useState(EMPTY_FORM);
  const [editing, setEditing] = useState<Material | null>(null);
  // The material whose recommended grades are open, if any.
  const [gradesOf, setGradesOf] = useState<{ material: Material; title: string } | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  // A category's picture: edited in the form, viewed from its header.
  const [image, setImage] = useState<string | null>(null);
  const [viewing, setViewing] = useState<Material | null>(null);
  const formRef = useRef<HTMLDivElement>(null);
  const nameRef = useRef<HTMLInputElement>(null);
  // Bumped by "+ Subcategory" to open the add form.
  const [addSignal, setAddSignal] = useState(0);
  // ISO groups whose card is collapsed (remembered).
  const [collapsed, setCollapsed] = useState<Iso513Group[]>(readCollapsed);
  function setGroupOpen(g: Iso513Group, open: boolean) {
    setCollapsed((c) => {
      const next = open ? c.filter((x) => x !== g) : [...new Set([...c, g])];
      try {
        localStorage.setItem(COLLAPSED_KEY, JSON.stringify(next));
      } catch {
        // not remembered
      }
      return next;
    });
  }

  const categoryOf = (g: Iso513Group) => data.find((m) => m.isCategory && m.iso513Group === g);
  const categoryName = (g: Iso513Group) =>
    categoryOf(g)?.name ?? MATERIAL_GROUPS.find((x) => x.value === g)?.label.split(" — ")[1] ?? g;
  const editingCategory = editing?.isCategory ?? false;

  function focusForm(focusName: boolean) {
    formRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    if (focusName) setTimeout(() => nameRef.current?.focus(), 300);
  }

  function startAdd(g: Iso513Group) {
    setForm({ ...EMPTY_FORM, iso513Group: g });
    setEditing(null);
    setError(null);
    setAddSignal((n) => n + 1);
    setGroupOpen(g, true);
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
    setImage(m.image ?? null);
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
        await api.patch(`/materials/${editing.id}`, editing.isCategory ? { ...details, image } : form);
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
        <AddSection label="subcategory" editing={editing !== null} onCancelEdit={cancelEdit} openSignal={addSignal}>
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
                  {MATERIAL_GROUPS.map(({ value: g }) => (
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
              {editingCategory && (
                <div className="col-span-3">
                  <Label>Image (optional)</Label>
                  <ClipboardImagePaste value={image} onChange={setImage} />
                </div>
              )}
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
        </AddSection>
      </div>

      {gradesOf && <MaterialGrades material={gradesOf.material} title={gradesOf.title} onClose={() => setGradesOf(null)} />}
      {viewing?.image && (
        <Modal title={`${viewing.iso513Group} — ${viewing.name}`} onClose={() => setViewing(null)} wide>
          <img src={viewing.image} alt={viewing.name} className="mx-auto max-h-[75vh] rounded-lg object-contain" />
        </Modal>
      )}

      <div className="space-y-3">
        {MATERIAL_GROUPS.map(({ value: g }) => {
          const category = categoryOf(g);
          const subs = data.filter((m) => !m.isCategory && m.iso513Group === g);
          const open = !collapsed.includes(g);
          return (
            <Card key={g} className="overflow-hidden border-l-4" style={{ borderLeftColor: ISO513_COLORS[g] }} data-material-group={g}>
              {/* Clicking the header (outside its buttons) collapses / expands the card. */}
              <div
                className="flex cursor-pointer items-start justify-between gap-3 p-3"
                onClick={(e) => !(e.target as HTMLElement).closest("button, a, input") && setGroupOpen(g, !open)}
              >
                <div className="text-sm">
                  <div>
                    <button
                      type="button"
                      onClick={() => setGroupOpen(g, !open)}
                      aria-expanded={open}
                      aria-label={open ? `Collapse ${g}` : `Expand ${g}`}
                      className="mr-1.5 w-4 text-xs text-neutral-500 hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-neutral-100"
                      data-group-toggle
                    >
                      {open ? "▼" : "▶"}
                    </button>
                    <span className="mr-2">
                      <Iso513Badge group={g} />
                    </span>
                    {/* Click a material for the grades recommended for it, by application. */}
                    {category ? (
                      <button
                        type="button"
                        onClick={() => setGradesOf({ material: category, title: `${g} — ${categoryName(g)}` })}
                        className="font-semibold text-neutral-900 hover:text-blue-600 hover:underline dark:text-neutral-100 dark:hover:text-blue-400"
                        title="Recommended grades by application"
                        data-material-link={g}
                      >
                        {categoryName(g)}
                      </button>
                    ) : (
                      <span className="font-semibold text-neutral-900 dark:text-neutral-100">{categoryName(g)}</span>
                    )}
                    {category?.image && (
                      <button
                        type="button"
                        onClick={() => setViewing(category)}
                        className="ml-2 inline-flex align-middle text-neutral-500 hover:text-blue-600 dark:text-neutral-400 dark:hover:text-blue-400"
                        aria-label={`View ${categoryName(g)} image`}
                        title="View image"
                        data-category-image={g}
                      >
                        <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                          <rect x="3" y="3" width="18" height="18" rx="2" />
                          <circle cx="8.5" cy="8.5" r="1.5" />
                          <path d="m21 15-5-5L5 21" />
                        </svg>
                      </button>
                    )}
                    {category?.hardness && <span className="ml-2 text-neutral-500 dark:text-neutral-400">({category.hardness})</span>}
                    {category?.description && <span className="ml-2 text-neutral-500 dark:text-neutral-400">— {category.description}</span>}
                    {!open && (
                      <span className="ml-2 text-xs text-neutral-400 dark:text-neutral-500">
                        ({subs.length} subcategor{subs.length === 1 ? "y" : "ies"})
                      </span>
                    )}
                  </div>
                  {open && category && <MaterialDetails m={category} />}
                  {open && category && (
                    <MaterialGradesSummary
                      recs={recommendationsFor(recommendations, category)}
                      onOpen={() => setGradesOf({ material: category, title: `${g} — ${categoryName(g)}` })}
                    />
                  )}
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
              {open && (
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
                          <button
                            type="button"
                            onClick={() => setGradesOf({ material: m, title: `${g} — ${m.name}` })}
                            className="font-medium text-neutral-900 hover:text-blue-600 hover:underline dark:text-neutral-100 dark:hover:text-blue-400"
                            title="Recommended grades by application"
                            data-material-link={m.name}
                          >
                            {m.name}
                          </button>
                          {m.hardness && <span className="ml-2 text-neutral-500 dark:text-neutral-400">({m.hardness})</span>}
                          {m.description && <span className="ml-2 text-neutral-500 dark:text-neutral-400">— {m.description}</span>}
                        </div>
                        <MaterialDetails m={m} />
                        <MaterialGradesSummary recs={recommendationsFor(recommendations, m)} onOpen={() => setGradesOf({ material: m, title: `${g} — ${m.name}` })} />
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
              )}
            </Card>
          );
        })}
      </div>
    </div>
  );
}

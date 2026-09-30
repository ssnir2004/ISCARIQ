import { useState, type ChangeEvent, type FormEvent, type ReactNode } from "react";
import { useResource } from "../../lib/useResource";
import { api, ApiError } from "../../lib/api";
import type { GlossaryEntry } from "../../lib/types";
import { Button, Card, Input, Label, PageHeader, Textarea } from "../../components/ui";

const EMPTY_FORM = { name: "", description: "", image: "" as string | null };

// A multi-select field sent as an array of values under `key` (e.g. a
// Grade's ISO 513 groups or application ids). Rendered as toggle chips.
export interface GlossaryTagField {
  key: string;
  label: string;
  // `short` is shown in the list view (falls back to `label`). `color`, when
  // set, fills the chip (e.g. ISO 513 material group colors).
  options: { value: string; label: string; short?: string; color?: string }[];
  // Reads the selected values off a loaded entry, for fields the API returns
  // in a different shape (e.g. related records). Defaults to entry[key].
  read?: (entry: Entry) => string[];
  // Shown under the field when it has no options to pick from.
  emptyHint?: ReactNode;
}

// A single-line optional text field (e.g. a Grade's substrate). Suggests
// `suggestions` plus every value already used on other entries.
export interface GlossaryTextField {
  key: string;
  label: string;
  placeholder?: string;
  suggestions?: string[];
}

export type Entry = GlossaryEntry & Record<string, unknown>;
type Tags = Record<string, string[]>;
type Texts = Record<string, string>;

function emptyTexts(fields: GlossaryTextField[]): Texts {
  return Object.fromEntries(fields.map((f) => [f.key, ""]));
}

function readTags(field: GlossaryTagField, entry: Entry): string[] {
  return field.read ? field.read(entry) : ((entry[field.key] as string[] | undefined) ?? []);
}

function emptyTags(fields: GlossaryTagField[]): Tags {
  return Object.fromEntries(fields.map((f) => [f.key, []]));
}

function TagToggles({ field, value, onChange }: { field: GlossaryTagField; value: string[]; onChange: (v: string[]) => void }) {
  function toggle(v: string) {
    onChange(value.includes(v) ? value.filter((x) => x !== v) : [...value, v]);
  }
  return (
    <div className="flex flex-wrap gap-2">
      {field.options.map((o) => (
        <button
          key={o.value}
          type="button"
          aria-pressed={value.includes(o.value)}
          onClick={() => toggle(o.value)}
          className={`rounded-full px-2.5 py-1 text-xs ${
            o.color
              ? `border-2 ${value.includes(o.value) ? "font-medium text-neutral-900" : "text-neutral-600 dark:text-neutral-300"}`
              : `border ${
                  value.includes(o.value)
                    ? "border-blue-500 bg-blue-50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300"
                    : "border-neutral-200 text-neutral-600 dark:border-neutral-700 dark:text-neutral-300"
                }`
          }`}
          style={o.color ? (value.includes(o.value) ? { backgroundColor: o.color, borderColor: o.color } : { borderColor: o.color }) : undefined}
        >
          {o.label}
        </button>
      ))}
    </div>
  );
}

function readFileAsDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

export function GlossaryPage({
  resource,
  title,
  singular,
  tagFields = [],
  textFields = [],
}: {
  resource: string;
  title: string;
  singular: string;
  tagFields?: GlossaryTagField[];
  textFields?: GlossaryTextField[];
}) {
  const { data, reload } = useResource<Entry>(resource);
  const [form, setForm] = useState(EMPTY_FORM);
  const [tags, setTags] = useState<Tags>(() => emptyTags(tagFields));
  const [texts, setTexts] = useState<Texts>(() => emptyTexts(textFields));

  function suggestionsFor(field: GlossaryTextField): string[] {
    const used = data.map((e) => e[field.key]).filter((v): v is string => typeof v === "string" && v.trim() !== "");
    return [...new Set([...(field.suggestions ?? []), ...used])].sort((a, b) => a.localeCompare(b));
  }
  const [editingId, setEditingId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [fileInputKey, setFileInputKey] = useState(0);

  async function onImageChange(e: ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setForm({ ...form, image: await readFileAsDataUrl(file) });
  }

  function startEdit(entry: Entry) {
    setForm({ name: entry.name, description: entry.description ?? "", image: entry.image ?? "" });
    setTags(Object.fromEntries(tagFields.map((f) => [f.key, readTags(f, entry)])));
    setTexts(Object.fromEntries(textFields.map((f) => [f.key, (entry[f.key] as string | null | undefined) ?? ""])));
    setEditingId(entry.id);
    setError(null);
  }

  function cancelEdit() {
    setForm(EMPTY_FORM);
    setTags(emptyTags(tagFields));
    setTexts(emptyTexts(textFields));
    setEditingId(null);
    setFileInputKey((k) => k + 1);
    setError(null);
  }

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);
    setSubmitting(true);
    try {
      // Blank text fields are sent as null so clearing one actually clears it.
      const textValues = Object.fromEntries(Object.entries(texts).map(([k, v]) => [k, v.trim() || null]));
      const body = { ...form, ...textValues, ...tags };
      if (editingId) {
        await api.patch(`${resource}/${editingId}`, body);
      } else {
        await api.post(resource, body);
      }
      setForm(EMPTY_FORM);
      setTags(emptyTags(tagFields));
      setTexts(emptyTexts(textFields));
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
          {textFields.map((field) => (
            <div key={field.key}>
              <Label>{field.label}</Label>
              <Input
                list={`${field.key}-suggestions`}
                value={texts[field.key] ?? ""}
                placeholder={field.placeholder}
                onChange={(e) => setTexts({ ...texts, [field.key]: e.target.value })}
              />
              <datalist id={`${field.key}-suggestions`}>
                {suggestionsFor(field).map((s) => (
                  <option key={s} value={s} />
                ))}
              </datalist>
            </div>
          ))}
          {tagFields.map((field) => (
            <div key={field.key}>
              <Label>{field.label}</Label>
              <TagToggles field={field} value={tags[field.key] ?? []} onChange={(v) => setTags({ ...tags, [field.key]: v })} />
              {field.options.length === 0 && field.emptyHint && (
                <p className="text-xs text-neutral-500 dark:text-neutral-400">{field.emptyHint}</p>
              )}
            </div>
          ))}
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
                {textFields.map((field) => {
                  const value = entry[field.key];
                  if (typeof value !== "string" || value === "") return null;
                  return (
                    <div key={field.key} className="mt-1 text-xs text-neutral-500 dark:text-neutral-400">
                      {field.label}: <span className="font-medium text-neutral-700 dark:text-neutral-300">{value}</span>
                    </div>
                  );
                })}
                {tagFields.map((field) => {
                  const values = readTags(field, entry);
                  if (values.length === 0) return null;
                  return (
                    <div key={field.key} className="mt-1 flex flex-wrap items-center gap-1">
                      <span className="text-xs text-neutral-500 dark:text-neutral-400">{field.label}:</span>
                      {field.options
                        .filter((o) => values.includes(o.value))
                        .map((o) => (
                          <span
                            key={o.value}
                            className={`rounded-full px-2 py-0.5 text-xs ${
                              o.color ? "font-semibold text-neutral-900" : "bg-neutral-100 text-neutral-700 dark:bg-neutral-800 dark:text-neutral-300"
                            }`}
                            style={o.color ? { backgroundColor: o.color } : undefined}
                          >
                            {o.short ?? o.label}
                          </span>
                        ))}
                    </div>
                  );
                })}
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

import { useRef, useState, type ChangeEvent, type FormEvent, type ReactNode } from "react";
import { useResource } from "../../lib/useResource";
import { api, ApiError } from "../../lib/api";
import type { GlossaryEntry } from "../../lib/types";
import { Button, Card, Input, Label, Modal, PageHeader, Select, Textarea } from "../../components/ui";

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

// A single-line optional text or number field (e.g. a Substrate's hardness).
// Text fields suggest `suggestions` plus every value already used on other
// entries. Blank values are saved as null.
export interface GlossaryTextField {
  key: string;
  label: string;
  type?: "text" | "number";
  placeholder?: string;
  suggestions?: string[];
}

// An optional single choice sent as an id under `key` (e.g. a Grade's
// substrateId), or null for none.
// An on/off field (e.g. a CBN grade's "Coated"), saved as a boolean.
export interface GlossaryCheckboxField {
  key: string;
  label: string;
}

export interface GlossarySelectField {
  key: string;
  label: string;
  options: { value: string; label: string }[];
  // Reads the selected value off a loaded entry. Defaults to entry[key].
  read?: (entry: Entry) => string | null | undefined;
  // Shown under the field when it has no options to pick from.
  emptyHint?: ReactNode;
  // Lets the user create a new option on the spot: adds a "+ New …" choice
  // that shows this inline form. `done` receives the new option's value
  // (already present in `options`) to select it, or null if cancelled.
  create?: { label: string; render: (done: (value: string | null) => void) => ReactNode };
}

const CREATE_OPTION = "__create__";

export type Entry = GlossaryEntry & Record<string, unknown>;

// An extra, screen-specific part of the form (e.g. the Grades per-application
// material matrix). Its values are merged into the saved body.
export interface GlossaryExtraSection {
  // Values loaded from an entry when editing it.
  read: (entry: Entry) => Record<string, unknown>;
  render: (ctx: { tags: Record<string, string[]>; values: Record<string, unknown>; setValues: (v: Record<string, unknown>) => void }) => ReactNode;
}

// Lets a screen replace the default entry list with its own view (e.g. the
// Grades board) while reusing this page's form, edit and delete handling.
export interface GlossaryListContext {
  data: Entry[];
  startEdit: (entry: Entry) => void;
  remove: (id: string) => void;
  reload: () => void;
}
type Tags = Record<string, string[]>;
type Texts = Record<string, string>;

function emptyTexts(fields: { key: string }[]): Texts {
  return Object.fromEntries(fields.map((f) => [f.key, ""]));
}

function readSelect(field: GlossarySelectField, entry: Entry): string {
  return (field.read ? field.read(entry) : (entry[field.key] as string | null | undefined)) ?? "";
}

function readTags(field: GlossaryTagField, entry: Entry): string[] {
  return field.read ? field.read(entry) : ((entry[field.key] as string[] | undefined) ?? []);
}

function emptyTags(fields: GlossaryTagField[]): Tags {
  return Object.fromEntries(fields.map((f) => [f.key, []]));
}

// onChange receives an updater so quick successive toggles each apply to the
// latest selection rather than a stale one.
function TagToggles({
  field,
  value,
  onChange,
}: {
  field: GlossaryTagField;
  value: string[];
  onChange: (update: (current: string[]) => string[]) => void;
}) {
  function toggle(v: string) {
    onChange((current) => (current.includes(v) ? current.filter((x) => x !== v) : [...current, v]));
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
  selectFields = [],
  checkboxFields = [],
  renderList,
  showDetails = false,
  extraSection,
  listPath,
  createValues,
}: {
  resource: string;
  title: string;
  singular: string;
  tagFields?: GlossaryTagField[];
  textFields?: GlossaryTextField[];
  selectFields?: GlossarySelectField[];
  checkboxFields?: GlossaryCheckboxField[];
  renderList?: (ctx: GlossaryListContext) => ReactNode;
  // Clicking an entry in the default list opens a window with its full
  // details and image.
  showDetails?: boolean;
  extraSection?: GlossaryExtraSection;
  // GET path for the list when it differs from `resource` (e.g. a filter).
  listPath?: string;
  // Values added to every new entry (e.g. a grade's family).
  createValues?: Record<string, unknown>;
}) {
  const formRef = useRef<HTMLDivElement>(null);
  const { data, reload } = useResource<Entry>(listPath ?? resource);
  const [form, setForm] = useState(EMPTY_FORM);
  const [tags, setTags] = useState<Tags>(() => emptyTags(tagFields));
  const [texts, setTexts] = useState<Texts>(() => emptyTexts(textFields));
  const [selects, setSelects] = useState<Texts>(() => emptyTexts(selectFields));
  const [checks, setChecks] = useState<Record<string, boolean>>({});
  // Select field whose inline "create new" form is open, if any.
  const [creatingKey, setCreatingKey] = useState<string | null>(null);
  const [extraValues, setExtraValues] = useState<Record<string, unknown>>({});

  function suggestionsFor(field: GlossaryTextField): string[] {
    const used = data.map((e) => e[field.key]).filter((v): v is string => typeof v === "string" && v.trim() !== "");
    return [...new Set([...(field.suggestions ?? []), ...used])].sort((a, b) => a.localeCompare(b));
  }
  const [editingId, setEditingId] = useState<string | null>(null);
  // Entry shown in the details window (showDetails), if any.
  const [viewing, setViewing] = useState<Entry | null>(null);
  // Another entry with the name being typed (names are unique), if any.
  const typedName = form.name.trim().toLowerCase();
  const duplicate = typedName ? data.find((d) => d.id !== editingId && d.name.trim().toLowerCase() === typedName) : undefined;
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
    setTexts(Object.fromEntries(textFields.map((f) => [f.key, String((entry[f.key] as string | number | null | undefined) ?? "")])));
    setSelects(Object.fromEntries(selectFields.map((f) => [f.key, readSelect(f, entry)])));
    setChecks(Object.fromEntries(checkboxFields.map((f) => [f.key, entry[f.key] === true])));
    setExtraValues(extraSection ? extraSection.read(entry) : {});
    setEditingId(entry.id);
    setError(null);
    formRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  function cancelEdit() {
    setCreatingKey(null);
    setForm(EMPTY_FORM);
    setTags(emptyTags(tagFields));
    setTexts(emptyTexts(textFields));
    setSelects(emptyTexts(selectFields));
    setChecks({});
    setExtraValues({});
    setEditingId(null);
    setFileInputKey((k) => k + 1);
    setError(null);
  }

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    if (duplicate) {
      setError(`A ${singular} named "${duplicate.name}" already exists. Open it for editing instead of adding it again.`);
      return;
    }
    setError(null);
    setSubmitting(true);
    try {
      // Blank text fields are sent as null so clearing one actually clears it.
      const textValues = Object.fromEntries(
        textFields.map((f) => {
          const v = (texts[f.key] ?? "").trim();
          return [f.key, v === "" ? null : f.type === "number" ? Number(v) : v];
        })
      );
      const selectValues = Object.fromEntries(Object.entries(selects).map(([k, v]) => [k, v || null]));
      const checkValues = Object.fromEntries(checkboxFields.map((f) => [f.key, checks[f.key] === true]));
      const body = { ...form, ...textValues, ...selectValues, ...checkValues, ...tags, ...extraValues };
      if (editingId) {
        await api.patch(`${resource}/${editingId}`, body);
      } else {
        await api.post(resource, { ...body, ...createValues });
      }
      resetForm();
      reload();
    } catch (err) {
      setError(err instanceof ApiError ? err.message : `Failed to save ${singular}`);
    } finally {
      setSubmitting(false);
    }
  }

  function resetForm() {
    setForm(EMPTY_FORM);
    setTags(emptyTags(tagFields));
    setTexts(emptyTexts(textFields));
    setSelects(emptyTexts(selectFields));
    setChecks({});
    setExtraValues({});
    setCreatingKey(null);
    setEditingId(null);
    setFileInputKey((k) => k + 1);
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
    <div className={renderList ? "" : "max-w-3xl"}>
      <PageHeader title={title} />
      <div ref={formRef} className="max-w-3xl scroll-mt-4">
        <Card className="mb-6 p-4">
          <form onSubmit={onSubmit} className="grid grid-cols-1 gap-4">
            <div>
              <Label>Name</Label>
              <Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
              {duplicate && (
                <p className="mt-1 flex flex-wrap items-center gap-2 text-sm text-amber-700 dark:text-amber-400">
                  A {singular} named "{duplicate.name}" already exists.
                  <button type="button" onClick={() => startEdit(duplicate)} className="font-medium text-blue-600 hover:underline dark:text-blue-400">
                    Open {duplicate.name} for editing
                  </button>
                </p>
              )}
            </div>
            <div>
              <Label>Description</Label>
              <Textarea rows={3} value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
            </div>
            {textFields.map((field) => (
              <div key={field.key}>
                <Label>{field.label}</Label>
                <Input
                  type={field.type === "number" ? "number" : "text"}
                  step="any"
                  list={field.type === "number" ? undefined : `${field.key}-suggestions`}
                  value={texts[field.key] ?? ""}
                  placeholder={field.placeholder}
                  onChange={(e) => setTexts({ ...texts, [field.key]: e.target.value })}
                />
                {field.type !== "number" && (
                  <datalist id={`${field.key}-suggestions`}>
                    {suggestionsFor(field).map((s) => (
                      <option key={s} value={s} />
                    ))}
                  </datalist>
                )}
              </div>
            ))}
            {checkboxFields.map((field) => (
              <label key={field.key} className="flex w-fit items-center gap-2 text-sm text-neutral-800 dark:text-neutral-200">
                <input
                  type="checkbox"
                  className="h-4 w-4 accent-blue-600"
                  checked={checks[field.key] === true}
                  onChange={(e) => setChecks((c) => ({ ...c, [field.key]: e.target.checked }))}
                />
                {field.label}
              </label>
            ))}
            {selectFields.map((field) => (
              <div key={field.key}>
                <Label>{field.label}</Label>
                <Select
                  value={selects[field.key] ?? ""}
                  onChange={(e) =>
                    e.target.value === CREATE_OPTION ? setCreatingKey(field.key) : setSelects({ ...selects, [field.key]: e.target.value })
                  }
                >
                  <option value="">— None —</option>
                  {field.options.map((o) => (
                    <option key={o.value} value={o.value}>
                      {o.label}
                    </option>
                  ))}
                  {field.create && <option value={CREATE_OPTION}>{field.create.label}</option>}
                </Select>
                {creatingKey === field.key &&
                  field.create?.render((value) => {
                    setCreatingKey(null);
                    if (value) setSelects((s) => ({ ...s, [field.key]: value }));
                  })}
                {field.options.length === 0 && field.emptyHint && creatingKey !== field.key && (
                  <p className="mt-1 text-xs text-neutral-500 dark:text-neutral-400">{field.emptyHint}</p>
                )}
              </div>
            ))}
            {tagFields.map((field) => (
              <div key={field.key}>
                <Label>{field.label}</Label>
                <TagToggles field={field} value={tags[field.key] ?? []} onChange={(update) => setTags((t) => ({ ...t, [field.key]: update(t[field.key] ?? []) }))} />
                {field.options.length === 0 && field.emptyHint && (
                  <p className="text-xs text-neutral-500 dark:text-neutral-400">{field.emptyHint}</p>
                )}
              </div>
            ))}
            {extraSection?.render({ tags, values: extraValues, setValues: setExtraValues })}
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
      </div>

      {renderList ? (
        renderList({ data, startEdit, remove, reload })
      ) : (
        <div className="space-y-2">
          {data.map((entry) => (
            <Card
              key={entry.id}
              className={`flex items-center justify-between gap-3 p-3 ${showDetails ? "cursor-pointer hover:border-blue-300 dark:hover:border-blue-800" : ""}`}
              onClick={showDetails ? (e) => !(e.target as HTMLElement).closest("button") && setViewing(entry) : undefined}
              data-entry={entry.name}
            >
              <div className="flex items-center gap-3">
                {entry.image && <img src={entry.image} alt={entry.name} className="h-10 w-10 rounded object-cover" />}
                <div className="text-sm">
                  <span className="font-medium text-neutral-900 dark:text-neutral-100">{entry.name}</span>
                  {entry.description && (
                    <span className="ml-2 text-neutral-500 dark:text-neutral-400">— {entry.description}</span>
                  )}
                  {textFields.map((field) => {
                    const value = entry[field.key];
                    if ((typeof value !== "string" && typeof value !== "number") || value === "") return null;
                    return (
                      <div key={field.key} className="mt-1 text-xs text-neutral-500 dark:text-neutral-400">
                        {field.label}: <span className="font-medium text-neutral-700 dark:text-neutral-300">{value}</span>
                      </div>
                    );
                  })}
                  {selectFields.map((field) => {
                    const option = field.options.find((o) => o.value === readSelect(field, entry));
                    if (!option) return null;
                    return (
                      <div key={field.key} className="mt-1 text-xs text-neutral-500 dark:text-neutral-400">
                        {field.label}: <span className="font-medium text-neutral-700 dark:text-neutral-300">{option.label}</span>
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
      )}

      {viewing && (
        <Modal title={viewing.name} onClose={() => setViewing(null)} wide={!!viewing.image}>
          <div className="space-y-4" data-details={viewing.name}>
            {viewing.description ? (
              <p className="text-sm whitespace-pre-line text-neutral-700 dark:text-neutral-300">{viewing.description}</p>
            ) : (
              <p className="text-sm text-neutral-400 italic dark:text-neutral-500">No description.</p>
            )}
            {textFields.map((field) => {
              const value = viewing[field.key];
              if ((typeof value !== "string" && typeof value !== "number") || value === "") return null;
              return (
                <p key={field.key} className="text-sm text-neutral-600 dark:text-neutral-300">
                  <span className="font-medium">{field.label}:</span> {value}
                </p>
              );
            })}
            {viewing.image ? (
              <img
                src={viewing.image}
                alt={viewing.name}
                className="mx-auto max-h-[70vh] rounded-lg border border-neutral-200 object-contain dark:border-neutral-700"
              />
            ) : (
              <p className="text-sm text-neutral-400 italic dark:text-neutral-500">No image attached.</p>
            )}
            <div className="flex justify-end gap-2">
              <Button
                variant="secondary"
                onClick={() => {
                  startEdit(viewing);
                  setViewing(null);
                }}
              >
                Edit
              </Button>
              <Button onClick={() => setViewing(null)}>Close</Button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}

import { useState, type ChangeEvent, type FormEvent } from "react";
import { useResource } from "../../lib/useResource";
import { api, ApiError } from "../../lib/api";
import type { Material, Npa } from "../../lib/types";
import { Button, Card, Input, Label, Modal, PageHeader, Textarea } from "../../components/ui";

const EMPTY_FORM = {
  npaNumber: "",
  title: "",
  category: "",
  applicationType: "",
  designation: "",
  publishDate: "",
  recommendedApplications: "",
  innovation: "",
  keyAdvantages: "",
  materialsText: "",
  notes: "",
};

type AttrRow = { label: string; value: string };

function readFileAsDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

export function Npas() {
  const { data: npas, reload } = useResource<Npa>("/npas");
  const { data: materials } = useResource<Material>("/materials");

  const [form, setForm] = useState(EMPTY_FORM);
  const [attributes, setAttributes] = useState<AttrRow[]>([]);
  const [materialIds, setMaterialIds] = useState<string[]>([]);
  const [image, setImage] = useState<string | null>(null);
  const [sourceFile, setSourceFile] = useState<{ name: string; data: string } | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [detail, setDetail] = useState<Npa | null>(null);

  function resetForm() {
    setForm(EMPTY_FORM);
    setAttributes([]);
    setMaterialIds([]);
    setImage(null);
    setSourceFile(null);
    setEditingId(null);
    setError(null);
  }

  function startEdit(n: Npa) {
    setForm({
      npaNumber: n.npaNumber ?? "",
      title: n.title,
      category: n.category ?? "",
      applicationType: n.applicationType ?? "",
      designation: n.designation ?? "",
      publishDate: n.publishDate ? n.publishDate.slice(0, 10) : "",
      recommendedApplications: n.recommendedApplications ?? "",
      innovation: n.innovation ?? "",
      keyAdvantages: n.keyAdvantages ?? "",
      materialsText: n.materialsText ?? "",
      notes: n.notes ?? "",
    });
    setAttributes((n.attributes ?? []).map((a) => ({ label: a.label, value: a.value })));
    setMaterialIds((n.materials ?? []).map((m) => m.id));
    setImage(n.image ?? null);
    setSourceFile(n.sourceFileName && n.sourceFileData ? { name: n.sourceFileName, data: n.sourceFileData } : null);
    setEditingId(n.id);
    setError(null);
    setDetail(null);
  }

  function addAttrRow() {
    setAttributes((rows) => [...rows, { label: "", value: "" }]);
  }

  function updateAttrRow(i: number, field: "label" | "value", value: string) {
    setAttributes((rows) => rows.map((r, idx) => (idx === i ? { ...r, [field]: value } : r)));
  }

  function removeAttrRow(i: number) {
    setAttributes((rows) => rows.filter((_, idx) => idx !== i));
  }

  function toggleMaterial(id: string) {
    setMaterialIds((ids) => (ids.includes(id) ? ids.filter((x) => x !== id) : [...ids, id]));
  }

  async function onImagePicked(e: ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setImage(await readFileAsDataUrl(file));
  }

  async function onSourceFilePicked(e: ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setSourceFile({ name: file.name, data: await readFileAsDataUrl(file) });
  }

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);
    setSubmitting(true);
    try {
      const payload = {
        npaNumber: form.npaNumber || undefined,
        title: form.title,
        category: form.category || undefined,
        applicationType: form.applicationType || undefined,
        designation: form.designation || undefined,
        publishDate: form.publishDate || undefined,
        recommendedApplications: form.recommendedApplications || undefined,
        innovation: form.innovation || undefined,
        keyAdvantages: form.keyAdvantages || undefined,
        materialsText: form.materialsText || undefined,
        notes: form.notes || undefined,
        image: image ?? undefined,
        sourceFileName: sourceFile?.name,
        sourceFileData: sourceFile?.data,
        materialIds,
        attributes: attributes.filter((a) => a.label.trim() && a.value.trim()),
      };
      if (editingId) {
        await api.patch(`/npas/${editingId}`, payload);
      } else {
        await api.post("/npas", payload);
      }
      resetForm();
      reload();
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Failed to save NPA");
    } finally {
      setSubmitting(false);
    }
  }

  async function remove(n: Npa) {
    if (!confirm(`Delete NPA "${n.title}"?`)) return;
    setError(null);
    try {
      await api.delete(`/npas/${n.id}`);
      if (editingId === n.id) resetForm();
      if (detail?.id === n.id) setDetail(null);
      reload();
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Failed to delete NPA");
    }
  }

  return (
    <div className="max-w-5xl">
      <PageHeader title="NPA Catalog" />

      <Card className="mb-6 p-4">
        <form onSubmit={onSubmit} className="grid grid-cols-4 gap-4">
          <div>
            <Label>NPA No.</Label>
            <Input value={form.npaNumber} onChange={(e) => setForm({ ...form, npaNumber: e.target.value })} placeholder="30-2025" />
          </div>
          <div className="col-span-2">
            <Label>Title</Label>
            <Input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} required />
          </div>
          <div>
            <Label>Publish Date</Label>
            <Input type="date" value={form.publishDate} onChange={(e) => setForm({ ...form, publishDate: e.target.value })} />
          </div>
          <div>
            <Label>Category</Label>
            <Input value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} placeholder="Milling" />
          </div>
          <div>
            <Label>Application Type</Label>
            <Input
              value={form.applicationType}
              onChange={(e) => setForm({ ...form, applicationType: e.target.value })}
              placeholder="Shoulder 90°"
            />
          </div>
          <div className="col-span-2">
            <Label>Designation</Label>
            <Input
              value={form.designation}
              onChange={(e) => setForm({ ...form, designation: e.target.value })}
              placeholder="HSM90S APCR 1405"
            />
          </div>

          <div className="col-span-4">
            <Label>Recommended Applications</Label>
            <Textarea
              rows={2}
              value={form.recommendedApplications}
              onChange={(e) => setForm({ ...form, recommendedApplications: e.target.value })}
            />
          </div>
          <div className="col-span-4">
            <Label>Innovation</Label>
            <Textarea rows={2} value={form.innovation} onChange={(e) => setForm({ ...form, innovation: e.target.value })} />
          </div>
          <div className="col-span-4">
            <Label>Key Advantages</Label>
            <Textarea rows={2} value={form.keyAdvantages} onChange={(e) => setForm({ ...form, keyAdvantages: e.target.value })} />
          </div>
          <div className="col-span-4">
            <Label>Applicable Materials (free text)</Label>
            <Input
              value={form.materialsText}
              onChange={(e) => setForm({ ...form, materialsText: e.target.value })}
              placeholder="Aluminum, aluminum alloys, other non-ferrous metals"
            />
          </div>

          <div className="col-span-4">
            <Label>Linked Materials (catalog)</Label>
            <div className="flex flex-wrap gap-2 rounded-lg border border-neutral-300 p-2 dark:border-neutral-700">
              {materials.length === 0 && <span className="text-xs text-neutral-500 dark:text-neutral-400">No materials yet.</span>}
              {materials.map((m) => (
                <label
                  key={m.id}
                  className="flex items-center gap-1.5 rounded-full border border-neutral-200 px-2 py-1 text-xs dark:border-neutral-700"
                >
                  <input type="checkbox" checked={materialIds.includes(m.id)} onChange={() => toggleMaterial(m.id)} />
                  {m.name}
                </label>
              ))}
            </div>
          </div>

          <div className="col-span-4">
            <div className="mb-1 flex items-center justify-between">
              <Label>Additional Attributes</Label>
              <Button type="button" variant="secondary" onClick={addAttrRow}>
                + Add Attribute
              </Button>
            </div>
            <p className="mb-2 text-xs text-neutral-500 dark:text-neutral-400">
              Use this for anything not covered above — not every NPA lists the same properties.
            </p>
            <div className="space-y-2">
              {attributes.map((row, i) => (
                <div key={i} className="flex gap-2">
                  <Input
                    className="w-48"
                    placeholder="Label (e.g. Coolant)"
                    value={row.label}
                    onChange={(e) => updateAttrRow(i, "label", e.target.value)}
                  />
                  <Input
                    placeholder="Value"
                    value={row.value}
                    onChange={(e) => updateAttrRow(i, "value", e.target.value)}
                  />
                  <Button type="button" variant="ghost" onClick={() => removeAttrRow(i)}>
                    Remove
                  </Button>
                </div>
              ))}
            </div>
          </div>

          <div className="col-span-4">
            <Label>Notes</Label>
            <Textarea rows={2} value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} />
          </div>

          <div className="col-span-2">
            <Label>Image</Label>
            <Input type="file" accept="image/*" onChange={onImagePicked} />
            {image && <img src={image} alt="" className="mt-2 h-24 rounded-lg object-contain" />}
          </div>
          <div className="col-span-2">
            <Label>Source NPA (PDF)</Label>
            <Input type="file" accept="application/pdf" onChange={onSourceFilePicked} />
            {sourceFile && <p className="mt-1 text-xs text-neutral-500 dark:text-neutral-400">{sourceFile.name}</p>}
          </div>

          {error && <p className="col-span-4 text-sm text-red-600 dark:text-red-400">{error}</p>}
          <div className="col-span-4 flex gap-2">
            <Button type="submit" disabled={submitting}>
              {editingId ? "Save Changes" : "Add NPA"}
            </Button>
            {editingId && (
              <Button type="button" variant="secondary" onClick={resetForm}>
                Cancel
              </Button>
            )}
          </div>
        </form>
      </Card>

      <div className="space-y-2">
        {npas.map((n) => (
          <Card key={n.id} className="flex items-start justify-between gap-3 p-3">
            <button type="button" className="flex-1 text-left" onClick={() => setDetail(n)}>
              <div className="flex items-center gap-2 text-sm">
                {n.npaNumber && (
                  <span className="rounded bg-neutral-100 px-1.5 py-0.5 font-mono text-xs dark:bg-neutral-800">{n.npaNumber}</span>
                )}
                <span className="font-medium text-neutral-900 dark:text-neutral-100">{n.title}</span>
                {n.category && <span className="text-neutral-500 dark:text-neutral-400">— {n.category}</span>}
              </div>
              <div className="mt-1 flex flex-wrap gap-x-3 text-xs text-neutral-500 dark:text-neutral-400">
                {n.applicationType && <span>{n.applicationType}</span>}
                {n.designation && <span className="font-mono">{n.designation}</span>}
                {n.publishDate && <span>{new Date(n.publishDate).toLocaleDateString()}</span>}
              </div>
            </button>
            <div className="flex shrink-0 gap-1">
              <Button variant="ghost" onClick={() => startEdit(n)}>
                Edit
              </Button>
              <Button variant="ghost" onClick={() => remove(n)}>
                Delete
              </Button>
            </div>
          </Card>
        ))}
        {npas.length === 0 && <p className="text-sm text-neutral-500 dark:text-neutral-400">No NPAs yet.</p>}
      </div>

      {detail && (
        <Modal title={detail.title} onClose={() => setDetail(null)}>
          <div className="space-y-3 text-sm">
            <div className="flex flex-wrap gap-x-4 text-xs text-neutral-500 dark:text-neutral-400">
              {detail.npaNumber && <span>NPA {detail.npaNumber}</span>}
              {detail.category && <span>{detail.category}</span>}
              {detail.applicationType && <span>{detail.applicationType}</span>}
              {detail.designation && <span className="font-mono">{detail.designation}</span>}
              {detail.publishDate && <span>{new Date(detail.publishDate).toLocaleDateString()}</span>}
            </div>
            {detail.image && <img src={detail.image} alt="" className="max-h-48 rounded-lg object-contain" />}
            {detail.recommendedApplications && (
              <div>
                <div className="font-medium text-neutral-900 dark:text-neutral-100">Recommended Applications</div>
                <p className="whitespace-pre-wrap text-neutral-600 dark:text-neutral-300">{detail.recommendedApplications}</p>
              </div>
            )}
            {detail.innovation && (
              <div>
                <div className="font-medium text-neutral-900 dark:text-neutral-100">Innovation</div>
                <p className="whitespace-pre-wrap text-neutral-600 dark:text-neutral-300">{detail.innovation}</p>
              </div>
            )}
            {detail.keyAdvantages && (
              <div>
                <div className="font-medium text-neutral-900 dark:text-neutral-100">Key Advantages</div>
                <p className="whitespace-pre-wrap text-neutral-600 dark:text-neutral-300">{detail.keyAdvantages}</p>
              </div>
            )}
            {(detail.materialsText || (detail.materials && detail.materials.length > 0)) && (
              <div>
                <div className="font-medium text-neutral-900 dark:text-neutral-100">Applicable Materials</div>
                {detail.materialsText && <p className="text-neutral-600 dark:text-neutral-300">{detail.materialsText}</p>}
                {detail.materials && detail.materials.length > 0 && (
                  <p className="text-neutral-600 dark:text-neutral-300">{detail.materials.map((m) => m.name).join(", ")}</p>
                )}
              </div>
            )}
            {detail.attributes && detail.attributes.length > 0 && (
              <div>
                <div className="font-medium text-neutral-900 dark:text-neutral-100">Additional Attributes</div>
                <dl className="mt-1 space-y-1">
                  {detail.attributes.map((a) => (
                    <div key={a.id} className="flex gap-2">
                      <dt className="w-40 shrink-0 text-neutral-500 dark:text-neutral-400">{a.label}</dt>
                      <dd className="text-neutral-700 dark:text-neutral-300">{a.value}</dd>
                    </div>
                  ))}
                </dl>
              </div>
            )}
            {detail.notes && (
              <div>
                <div className="font-medium text-neutral-900 dark:text-neutral-100">Notes</div>
                <p className="whitespace-pre-wrap text-neutral-600 dark:text-neutral-300">{detail.notes}</p>
              </div>
            )}
            {detail.sourceFileName && detail.sourceFileData && (
              <a
                href={detail.sourceFileData}
                download={detail.sourceFileName}
                className="inline-block text-blue-600 hover:underline dark:text-blue-400"
              >
                Download source NPA ({detail.sourceFileName})
              </a>
            )}
          </div>
        </Modal>
      )}
    </div>
  );
}

import { useState } from "react";
import { Button, Input, Label, Modal, Textarea } from "../components/ui";
import { ClipboardImagePaste } from "../components/npaKnowledge/ClipboardImagePaste";
import { api, ApiError } from "../lib/api";
import { useResource } from "../lib/useResource";
import type { Application } from "../lib/types";
import { str } from "./Innovations";

// Edit a brand from its Solutions page: the same details as the brand form
// on the Innovations / Solutions screens.

export type BrandDetails = Record<string, unknown> & {
  id: string;
  name: string;
  description?: string | null;
  image?: string | null;
  applications?: { id: string; name: string }[];
};

export function SolutionBrandEdit({ brand, onClose, onSaved }: { brand: BrandDetails; onClose: () => void; onSaved: (saved: BrandDetails) => void }) {
  const { data: applications } = useResource<Application>("/applications");
  const [name, setName] = useState(brand.name);
  const [description, setDescription] = useState(brand.description ?? "");
  const [year, setYear] = useState(typeof brand.year === "number" ? String(brand.year) : "");
  const [category, setCategory] = useState(str(brand.category));
  const [group, setGroup] = useState(str(brand.solutionGroup));
  const [appIds, setAppIds] = useState<string[]>((brand.applications ?? []).map((a) => a.id));
  const [tool, setTool] = useState(str(brand.toolDescription));
  const [image, setImage] = useState<string | null>(brand.image || null);
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  const toggleApp = (id: string) => setAppIds((ids) => (ids.includes(id) ? ids.filter((x) => x !== id) : [...ids, id]));

  async function save() {
    setError(null);
    if (!name.trim()) return setError("Enter the brand name");
    setSaving(true);
    try {
      const saved = await api.patch<BrandDetails>(`/innovations/${brand.id}`, {
        name: name.trim(),
        description,
        image: image ?? "",
        year: year.trim() ? Number(year) : null,
        category: category.trim() || null,
        solutionGroup: group.trim() || null,
        toolDescription: tool.trim() ? tool : null,
        applicationIds: appIds,
      });
      onSaved(saved);
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Failed to save the brand");
    } finally {
      setSaving(false);
    }
  }

  return (
    <Modal title={`Edit ${brand.name}`} onClose={onClose} wide>
      <div className="space-y-3" data-brand-edit>
        <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
          <div>
            <Label>Brand</Label>
            <Input value={name} onChange={(e) => setName(e.target.value)} aria-label="Brand" />
          </div>
          <div>
            <Label>Launched (year)</Label>
            <Input type="number" value={year} onChange={(e) => setYear(e.target.value)} placeholder="e.g. 1978" aria-label="Launched (year)" />
          </div>
          <div>
            <Label>Field</Label>
            <Input value={category} onChange={(e) => setCategory(e.target.value)} placeholder="e.g. Grooving & parting" aria-label="Field" />
          </div>
          <div>
            <Label>Group in its applications</Label>
            <Input value={group} onChange={(e) => setGroup(e.target.value)} placeholder="e.g. Parting" aria-label="Group" />
          </div>
        </div>
        <div>
          <Label>Solution for applications</Label>
          <div className="flex flex-wrap gap-1.5">
            {applications.map((a) => (
              <button
                key={a.id}
                type="button"
                aria-pressed={appIds.includes(a.id)}
                onClick={() => toggleApp(a.id)}
                className={`rounded-full border px-3 py-1 text-xs ${
                  appIds.includes(a.id)
                    ? "border-blue-600 bg-blue-600 text-white"
                    : "border-neutral-300 text-neutral-700 hover:bg-neutral-100 dark:border-neutral-700 dark:text-neutral-300 dark:hover:bg-neutral-800"
                }`}
              >
                {a.name}
              </button>
            ))}
          </div>
        </div>
        <div>
          <Label>Description</Label>
          <Textarea rows={4} value={description} onChange={(e) => setDescription(e.target.value)} aria-label="Description" />
        </div>
        <div>
          <Label>Tool description</Label>
          <Textarea rows={3} value={tool} onChange={(e) => setTool(e.target.value)} aria-label="Tool description" />
        </div>
        <div>
          <Label>Picture</Label>
          <ClipboardImagePaste value={image} onChange={setImage} />
        </div>
        {error && <p className="text-sm text-red-600 dark:text-red-400">{error}</p>}
        <div className="flex gap-2 border-t border-neutral-200 pt-3 dark:border-neutral-700">
          <Button type="button" onClick={save} disabled={saving}>
            Save
          </Button>
          <Button type="button" variant="secondary" onClick={onClose}>
            Cancel
          </Button>
        </div>
      </div>
    </Modal>
  );
}

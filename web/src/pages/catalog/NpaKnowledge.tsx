import { useMemo, useState } from "react";
import { useResource } from "../../lib/useResource";
import { api, ApiError } from "../../lib/api";
import type { Iso513Group, NpaApplicationCategory, NpaKnowledgeItem } from "../../lib/types";
import { applicationLabel, availabilityLabel, iso513Label } from "../../lib/npaKnowledgeConstants";
import { Button, Card, Input, Label, Modal, PageHeader, Select } from "../../components/ui";
import { ApplicationSelect } from "../../components/npaKnowledge/ApplicationSelect";
import {
  EMPTY_NPA_KNOWLEDGE_FORM,
  NpaKnowledgeForm,
  valuesFromItem,
  type NpaKnowledgeFormValues,
} from "../../components/npaKnowledge/NpaKnowledgeForm";
import { NpaKnowledgeCard, openNpaFile } from "../../components/npaKnowledge/NpaKnowledgeCard";
import type { PendingFile } from "../../components/npaKnowledge/NpaFileDropzone";
import { NpaRecommendationFinder } from "../../components/npaKnowledge/NpaRecommendationFinder";

type Tab = "browse" | "recommend";

function payloadFromValues(values: NpaKnowledgeFormValues, file: PendingFile | null, image: string | null) {
  return {
    npaNumber: values.npaNumber,
    title: values.title,
    publicationDate: values.publicationDate || undefined,
    sourceLink: values.sourceLink || undefined,
    productFamily: values.productFamily,
    subFamily: values.subFamily || undefined,
    insertDesignation: values.insertDesignation || undefined,
    applicationCategory: values.applicationCategory,
    subApplications: values.subApplications,
    iso513Groups: values.iso513Groups,
    workpieceMaterials: values.workpieceMaterials,
    innovation: values.innovation || undefined,
    advantages: values.advantages,
    recommendedUse: values.recommendedUse,
    bestForConditions: values.bestForConditions,
    avoidWhen: values.avoidWhen || undefined,
    keySellingMessage: values.keySellingMessage || undefined,
    availability: values.availability,
    technicalNotes: values.technicalNotes || undefined,
    pricingNotes: values.pricingNotes || undefined,
    npaFileName: file?.name,
    npaFileData: file?.data,
    imageData: image ?? undefined,
  };
}

export function NpaKnowledge() {
  const { data: items, reload } = useResource<NpaKnowledgeItem>("/npa-knowledge");
  const [tab, setTab] = useState<Tab>("browse");

  const [search, setSearch] = useState("");
  const [filterCategory, setFilterCategory] = useState<NpaApplicationCategory | "">("");
  const [filterIso, setFilterIso] = useState<Iso513Group | "">("");
  const [filterFamily, setFilterFamily] = useState("");

  const [editing, setEditing] = useState<NpaKnowledgeItem | null | "new">(null);
  const [detail, setDetail] = useState<NpaKnowledgeItem | null>(null);
  const [file, setFile] = useState<PendingFile | null>(null);
  const [image, setImage] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [listError, setListError] = useState<string | null>(null);

  const families = useMemo(() => Array.from(new Set(items.map((i) => i.productFamily))).sort(), [items]);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return items.filter((i) => {
      if (filterCategory && i.applicationCategory !== filterCategory) return false;
      if (filterIso && !i.iso513Groups.includes(filterIso)) return false;
      if (filterFamily && i.productFamily !== filterFamily) return false;
      if (!q) return true;
      const haystack = [
        i.npaNumber,
        i.title,
        i.productFamily,
        i.subFamily,
        i.insertDesignation,
        i.innovation,
        i.recommendedUse,
        i.technicalNotes,
        ...i.advantages,
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();
      return haystack.includes(q);
    });
  }, [items, search, filterCategory, filterIso, filterFamily]);

  function openCreate() {
    setFile(null);
    setImage(null);
    setFormError(null);
    setEditing("new");
  }

  function openEdit(item: NpaKnowledgeItem) {
    setFile(item.npaFileName && item.npaFileData ? { name: item.npaFileName, data: item.npaFileData, size: 0, type: "" } : null);
    setImage(item.imageData ?? null);
    setFormError(null);
    setEditing(item);
    setDetail(null);
  }

  async function handleSubmit(values: NpaKnowledgeFormValues) {
    setSubmitting(true);
    setFormError(null);
    try {
      const payload = payloadFromValues(values, file, image);
      if (editing && editing !== "new") {
        await api.patch(`/npa-knowledge/${editing.id}`, payload);
      } else {
        await api.post("/npa-knowledge", payload);
      }
      setEditing(null);
      reload();
    } catch (err) {
      setFormError(err instanceof ApiError ? err.message : "Failed to save NPA knowledge record");
    } finally {
      setSubmitting(false);
    }
  }

  async function remove(item: NpaKnowledgeItem) {
    if (!confirm(`Delete "${item.title}"?`)) return;
    setListError(null);
    try {
      await api.delete(`/npa-knowledge/${item.id}`);
      if (detail?.id === item.id) setDetail(null);
      reload();
    } catch (err) {
      setListError(err instanceof ApiError ? err.message : "Failed to delete record");
    }
  }

  return (
    <div className="max-w-5xl">
      <PageHeader
        title="NPA Knowledge Base"
        action={
          <div className="flex gap-2">
            <Button variant={tab === "browse" ? "primary" : "secondary"} onClick={() => setTab("browse")}>
              Browse
            </Button>
            <Button variant={tab === "recommend" ? "primary" : "secondary"} onClick={() => setTab("recommend")}>
              Recommendation Finder
            </Button>
            {tab === "browse" && <Button onClick={openCreate}>+ New Record</Button>}
          </div>
        }
      />

      {tab === "recommend" ? (
        <NpaRecommendationFinder />
      ) : (
        <>
          <Card className="mb-4 p-4">
            <div className="grid grid-cols-4 gap-3">
              <div className="col-span-2">
                <Label>Search</Label>
                <Input
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="NPA number, title, family, designation, innovation…"
                />
              </div>
              <div>
                <Label>Application</Label>
                <ApplicationSelect value={filterCategory} onChange={setFilterCategory} allowEmpty />
              </div>
              <div>
                <Label>ISO 513 Group</Label>
                <Select value={filterIso} onChange={(e) => setFilterIso(e.target.value as Iso513Group | "")}>
                  <option value="">Any</option>
                  {(["P", "M", "K", "N", "S", "H"] as Iso513Group[]).map((g) => (
                    <option key={g} value={g}>
                      {iso513Label(g)}
                    </option>
                  ))}
                </Select>
              </div>
              <div className="col-span-4">
                <Label>Product Family</Label>
                <Select value={filterFamily} onChange={(e) => setFilterFamily(e.target.value)}>
                  <option value="">Any</option>
                  {families.map((f) => (
                    <option key={f} value={f}>
                      {f}
                    </option>
                  ))}
                </Select>
              </div>
            </div>
          </Card>

          {listError && <p className="mb-3 text-sm text-red-600 dark:text-red-400">{listError}</p>}

          <div className="space-y-2">
            {filtered.map((item) => (
              <NpaKnowledgeCard key={item.id} item={item} onView={() => setDetail(item)} onEdit={() => openEdit(item)} onDelete={() => remove(item)} />
            ))}
            {filtered.length === 0 && <p className="text-sm text-neutral-500 dark:text-neutral-400">No NPA knowledge records match.</p>}
          </div>
        </>
      )}

      {editing && (
        <Modal title={editing === "new" ? "New NPA Knowledge Record" : `Edit — ${editing.title}`} onClose={() => setEditing(null)}>
          <NpaKnowledgeForm
            initial={editing === "new" ? EMPTY_NPA_KNOWLEDGE_FORM : valuesFromItem(editing)}
            file={file}
            onFileChange={setFile}
            image={image}
            onImageChange={setImage}
            submitLabel={editing === "new" ? "Create Record" : "Save Changes"}
            onCancel={() => setEditing(null)}
            onSubmit={handleSubmit}
            submitting={submitting}
            formError={formError}
          />
        </Modal>
      )}

      {detail && (
        <Modal title={detail.title} onClose={() => setDetail(null)}>
          <div className="space-y-3 text-sm">
            <div className="flex flex-wrap gap-x-4 text-xs text-neutral-500 dark:text-neutral-400">
              <span className="font-mono">{detail.npaNumber}</span>
              <span>{applicationLabel(detail.applicationCategory)}</span>
              <span>{detail.iso513Groups.map(iso513Label).join(", ")}</span>
              <span>{availabilityLabel(detail.availability)}</span>
              {detail.publicationDate && <span>{new Date(detail.publicationDate).toLocaleDateString()}</span>}
            </div>
            {detail.imageData && <img src={detail.imageData} alt="" className="max-h-48 rounded-lg object-contain" />}
            <div>
              <div className="font-medium text-neutral-900 dark:text-neutral-100">
                {detail.productFamily}
                {detail.subFamily ? ` / ${detail.subFamily}` : ""}
              </div>
              {detail.insertDesignation && <div className="font-mono text-xs text-neutral-500 dark:text-neutral-400">{detail.insertDesignation}</div>}
            </div>
            {detail.subApplications.length > 0 && (
              <div>
                <div className="font-medium text-neutral-900 dark:text-neutral-100">Sub-Applications</div>
                <p className="text-neutral-600 dark:text-neutral-300">{detail.subApplications.join(", ")}</p>
              </div>
            )}
            {detail.workpieceMaterials.length > 0 && (
              <div>
                <div className="font-medium text-neutral-900 dark:text-neutral-100">Workpiece Materials</div>
                <p className="text-neutral-600 dark:text-neutral-300">{detail.workpieceMaterials.join(", ")}</p>
              </div>
            )}
            {detail.innovation && (
              <div>
                <div className="font-medium text-neutral-900 dark:text-neutral-100">Innovation</div>
                <p className="whitespace-pre-wrap text-neutral-600 dark:text-neutral-300">{detail.innovation}</p>
              </div>
            )}
            {detail.advantages.length > 0 && (
              <div>
                <div className="font-medium text-neutral-900 dark:text-neutral-100">Advantages</div>
                <div className="mt-1 flex flex-wrap gap-1">
                  {detail.advantages.map((a) => (
                    <span key={a} className="rounded-full bg-blue-50 px-2 py-0.5 text-xs text-blue-700 dark:bg-blue-900/30 dark:text-blue-300">
                      {a}
                    </span>
                  ))}
                </div>
              </div>
            )}
            <div>
              <div className="font-medium text-neutral-900 dark:text-neutral-100">Recommended Use</div>
              <p className="whitespace-pre-wrap text-neutral-600 dark:text-neutral-300">{detail.recommendedUse}</p>
            </div>
            {detail.bestForConditions.length > 0 && (
              <div>
                <div className="font-medium text-neutral-900 dark:text-neutral-100">Best-For Conditions</div>
                <p className="text-neutral-600 dark:text-neutral-300">{detail.bestForConditions.join(", ")}</p>
              </div>
            )}
            {detail.avoidWhen && (
              <div>
                <div className="font-medium text-neutral-900 dark:text-neutral-100">Avoid When</div>
                <p className="whitespace-pre-wrap text-neutral-600 dark:text-neutral-300">{detail.avoidWhen}</p>
              </div>
            )}
            {detail.keySellingMessage && (
              <div>
                <div className="font-medium text-neutral-900 dark:text-neutral-100">Key Selling Message</div>
                <p className="text-neutral-600 dark:text-neutral-300">{detail.keySellingMessage}</p>
              </div>
            )}
            {detail.technicalNotes && (
              <div>
                <div className="font-medium text-neutral-900 dark:text-neutral-100">Technical Notes</div>
                <p className="whitespace-pre-wrap text-neutral-600 dark:text-neutral-300">{detail.technicalNotes}</p>
              </div>
            )}
            {detail.pricingNotes && (
              <div>
                <div className="font-medium text-neutral-900 dark:text-neutral-100">Pricing Notes</div>
                <p className="whitespace-pre-wrap text-neutral-600 dark:text-neutral-300">{detail.pricingNotes}</p>
              </div>
            )}
            {detail.sourceLink && (
              <a href={detail.sourceLink} target="_blank" rel="noreferrer" className="inline-block text-blue-600 hover:underline dark:text-blue-400">
                Source link
              </a>
            )}
            <div className="flex gap-2 border-t border-neutral-200 pt-3 dark:border-neutral-800">
              {detail.npaFileData && <Button onClick={() => openNpaFile(detail)}>Open NPA</Button>}
              <Button variant="secondary" onClick={() => openEdit(detail)}>
                Edit
              </Button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}

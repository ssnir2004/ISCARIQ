import { useState } from "react";
import type { Iso513Group, NpaApplicationCategory, NpaAvailability, NpaKnowledgeItem } from "../../lib/types";
import { AVAILABILITIES, CONDITION_SUGGESTIONS, SUB_APPLICATION_SUGGESTIONS } from "../../lib/npaKnowledgeConstants";
import { Button, Input, Label, Select, Textarea } from "../ui";
import { ApplicationSelect } from "./ApplicationSelect";
import { Iso513MultiSelect } from "./Iso513MultiSelect";
import { TagInput } from "./TagInput";
import { AdvantageTagsInput } from "./AdvantageTagsInput";
import { NpaFileDropzone, type PendingFile } from "./NpaFileDropzone";
import { ClipboardImagePaste } from "./ClipboardImagePaste";

export interface NpaKnowledgeFormValues {
  npaNumber: string;
  title: string;
  publicationDate: string;
  sourceLink: string;
  productFamily: string;
  subFamily: string;
  insertDesignation: string;
  applicationCategory: NpaApplicationCategory | "";
  subApplications: string[];
  iso513Groups: Iso513Group[];
  workpieceMaterials: string[];
  innovation: string;
  advantages: string[];
  recommendedUse: string;
  bestForConditions: string[];
  avoidWhen: string;
  keySellingMessage: string;
  availability: NpaAvailability;
  technicalNotes: string;
  pricingNotes: string;
}

export const EMPTY_NPA_KNOWLEDGE_FORM: NpaKnowledgeFormValues = {
  npaNumber: "",
  title: "",
  publicationDate: "",
  sourceLink: "",
  productFamily: "",
  subFamily: "",
  insertDesignation: "",
  applicationCategory: "",
  subApplications: [],
  iso513Groups: [],
  workpieceMaterials: [],
  innovation: "",
  advantages: [],
  recommendedUse: "",
  bestForConditions: [],
  avoidWhen: "",
  keySellingMessage: "",
  availability: "NOT_SPECIFIED",
  technicalNotes: "",
  pricingNotes: "",
};

export function valuesFromItem(item: NpaKnowledgeItem): NpaKnowledgeFormValues {
  return {
    npaNumber: item.npaNumber,
    title: item.title,
    publicationDate: item.publicationDate ? item.publicationDate.slice(0, 10) : "",
    sourceLink: item.sourceLink ?? "",
    productFamily: item.productFamily,
    subFamily: item.subFamily ?? "",
    insertDesignation: item.insertDesignation ?? "",
    applicationCategory: item.applicationCategory,
    subApplications: item.subApplications,
    iso513Groups: item.iso513Groups,
    workpieceMaterials: item.workpieceMaterials,
    innovation: item.innovation ?? "",
    advantages: item.advantages,
    recommendedUse: item.recommendedUse,
    bestForConditions: item.bestForConditions,
    avoidWhen: item.avoidWhen ?? "",
    keySellingMessage: item.keySellingMessage ?? "",
    availability: item.availability,
    technicalNotes: item.technicalNotes ?? "",
    pricingNotes: item.pricingNotes ?? "",
  };
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="space-y-3 border-t border-neutral-200 pt-4 first:border-t-0 first:pt-0 dark:border-neutral-800">
      <h3 className="text-sm font-semibold text-neutral-900 dark:text-neutral-100">{title}</h3>
      <div className="grid grid-cols-2 gap-4">{children}</div>
    </div>
  );
}

function FieldError({ message }: { message?: string }) {
  if (!message) return null;
  return <p className="mt-1 text-xs text-red-600 dark:text-red-400">{message}</p>;
}

export function NpaKnowledgeForm({
  initial,
  file,
  onFileChange,
  image,
  onImageChange,
  submitLabel,
  onCancel,
  onSubmit,
  submitting,
  formError,
}: {
  initial: NpaKnowledgeFormValues;
  file: PendingFile | null;
  onFileChange: (f: PendingFile | null) => void;
  image: string | null;
  onImageChange: (img: string | null) => void;
  submitLabel: string;
  onCancel?: () => void;
  onSubmit: (values: NpaKnowledgeFormValues) => void;
  submitting: boolean;
  formError: string | null;
}) {
  const [values, setValues] = useState(initial);
  const [errors, setErrors] = useState<Partial<Record<keyof NpaKnowledgeFormValues, string>>>({});

  function set<K extends keyof NpaKnowledgeFormValues>(key: K, value: NpaKnowledgeFormValues[K]) {
    setValues((v) => ({ ...v, [key]: value }));
  }

  function validate(): boolean {
    const next: Partial<Record<keyof NpaKnowledgeFormValues, string>> = {};
    if (!values.npaNumber.trim()) next.npaNumber = "Required";
    if (!values.title.trim()) next.title = "Required";
    if (!values.productFamily.trim()) next.productFamily = "Required";
    if (!values.applicationCategory) next.applicationCategory = "Required";
    if (values.iso513Groups.length === 0) next.iso513Groups = "Select at least one ISO 513 group";
    if (!values.recommendedUse.trim()) next.recommendedUse = "Required";
    setErrors(next);
    return Object.keys(next).length === 0;
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!validate()) return;
    onSubmit(values);
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <Section title="1. Basic NPA Info">
        <div>
          <Label>NPA Number *</Label>
          <Input value={values.npaNumber} onChange={(e) => set("npaNumber", e.target.value)} placeholder="NPA 30-2025" />
          <FieldError message={errors.npaNumber} />
        </div>
        <div>
          <Label>Title *</Label>
          <Input value={values.title} onChange={(e) => set("title", e.target.value)} placeholder="EXPANSION HELIALU HSM FWP" />
          <FieldError message={errors.title} />
        </div>
        <div>
          <Label>Publication Date</Label>
          <Input type="date" value={values.publicationDate} onChange={(e) => set("publicationDate", e.target.value)} />
        </div>
        <div>
          <Label>Source Link</Label>
          <Input value={values.sourceLink} onChange={(e) => set("sourceLink", e.target.value)} placeholder="Link from the NPA email/document" />
        </div>
      </Section>

      <Section title="2. Product & Insert Family">
        <div>
          <Label>Product Family *</Label>
          <Input value={values.productFamily} onChange={(e) => set("productFamily", e.target.value)} placeholder="HELI-ALU" />
          <FieldError message={errors.productFamily} />
        </div>
        <div>
          <Label>Sub-Family</Label>
          <Input value={values.subFamily} onChange={(e) => set("subFamily", e.target.value)} placeholder="HSM90" />
        </div>
        <div className="col-span-2">
          <Label>Insert Designation</Label>
          <Input
            value={values.insertDesignation}
            onChange={(e) => set("insertDesignation", e.target.value)}
            placeholder="HSM90S APCR 140520R-FWP"
          />
        </div>
      </Section>

      <Section title="3. Application & Materials">
        <div>
          <Label>Application Category *</Label>
          <ApplicationSelect value={values.applicationCategory} onChange={(v) => set("applicationCategory", v)} />
          <FieldError message={errors.applicationCategory} />
        </div>
        <div>
          <Label>ISO 513 Groups *</Label>
          <Iso513MultiSelect value={values.iso513Groups} onChange={(v) => set("iso513Groups", v)} />
          <FieldError message={errors.iso513Groups} />
        </div>
        <div className="col-span-2">
          <Label>Sub-Applications</Label>
          <TagInput value={values.subApplications} onChange={(v) => set("subApplications", v)} suggestions={SUB_APPLICATION_SUGGESTIONS} />
        </div>
        <div className="col-span-2">
          <Label>Workpiece Materials</Label>
          <TagInput
            value={values.workpieceMaterials}
            onChange={(v) => set("workpieceMaterials", v)}
            placeholder="e.g. Aluminum alloys, stainless steel…"
          />
        </div>
      </Section>

      <Section title="4. Innovation">
        <div className="col-span-2">
          <Label>What's new</Label>
          <Textarea rows={3} value={values.innovation} onChange={(e) => set("innovation", e.target.value)} />
        </div>
      </Section>

      <Section title="5. Advantages">
        <div className="col-span-2">
          <Label>Key Advantages</Label>
          <AdvantageTagsInput value={values.advantages} onChange={(v) => set("advantages", v)} />
        </div>
      </Section>

      <Section title="6. Recommendation Guidance">
        <div className="col-span-2">
          <Label>Recommended Use *</Label>
          <Textarea rows={2} value={values.recommendedUse} onChange={(e) => set("recommendedUse", e.target.value)} />
          <FieldError message={errors.recommendedUse} />
        </div>
        <div className="col-span-2">
          <Label>Best-For Conditions</Label>
          <TagInput value={values.bestForConditions} onChange={(v) => set("bestForConditions", v)} suggestions={CONDITION_SUGGESTIONS} />
        </div>
        <div className="col-span-2">
          <Label>Avoid When</Label>
          <Textarea rows={2} value={values.avoidWhen} onChange={(e) => set("avoidWhen", e.target.value)} />
        </div>
        <div>
          <Label>Key Selling Message</Label>
          <Input value={values.keySellingMessage} onChange={(e) => set("keySellingMessage", e.target.value)} />
        </div>
        <div>
          <Label>Availability</Label>
          <Select value={values.availability} onChange={(e) => set("availability", e.target.value as NpaAvailability)}>
            {AVAILABILITIES.map((a) => (
              <option key={a.value} value={a.value}>
                {a.label}
              </option>
            ))}
          </Select>
        </div>
      </Section>

      <Section title="7. Files & Image">
        <div className="col-span-2">
          <Label>NPA File</Label>
          <NpaFileDropzone file={file} onChange={onFileChange} />
        </div>
        <div className="col-span-2">
          <Label>Representative Image</Label>
          <ClipboardImagePaste value={image} onChange={onImageChange} />
        </div>
      </Section>

      <Section title="8. Internal Notes">
        <div className="col-span-2">
          <Label>Technical Notes</Label>
          <Textarea rows={3} value={values.technicalNotes} onChange={(e) => set("technicalNotes", e.target.value)} />
        </div>
        <div className="col-span-2">
          <Label>Pricing Notes</Label>
          <Textarea rows={2} value={values.pricingNotes} onChange={(e) => set("pricingNotes", e.target.value)} />
        </div>
      </Section>

      {formError && <p className="text-sm text-red-600 dark:text-red-400">{formError}</p>}
      <div className="flex gap-2 border-t border-neutral-200 pt-4 dark:border-neutral-800">
        <Button type="submit" disabled={submitting}>
          {submitLabel}
        </Button>
        {onCancel && (
          <Button type="button" variant="secondary" onClick={onCancel}>
            Cancel
          </Button>
        )}
      </div>
    </form>
  );
}

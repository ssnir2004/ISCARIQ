import { useEffect, useState, type FormEvent } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { api, ApiError } from "../lib/api";
import type { Project, ProjectStatus } from "../lib/types";
import { Button, Card, Input, Label, PageHeader, Select, StatusBadge } from "../components/ui";

const PROJECT_STATUSES: ProjectStatus[] = [
  "ASSIGNED",
  "IN_PROGRESS",
  "DRAWING_READY",
  "SENT_TO_BRANCH",
  "CUSTOMER_SIGNED",
  "PRODUCTION_PACKAGE_IN_PROGRESS",
  "PRODUCTION_PACKAGE_READY",
  "CLOSED",
];

function AddDrawingForm({ projectId, nextVersion, onCreated }: { projectId: string; nextVersion: number; onCreated: () => void }) {
  const [open, setOpen] = useState(false);
  const [fileRef, setFileRef] = useState("");
  const [submitting, setSubmitting] = useState(false);

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    try {
      await api.post("/drawings", { projectId, version: nextVersion, fileRef, sentDate: new Date().toISOString(), status: "SENT" });
      setFileRef("");
      setOpen(false);
      onCreated();
    } finally {
      setSubmitting(false);
    }
  }

  if (!open) {
    return (
      <Button variant="secondary" onClick={() => setOpen(true)}>
        + Add Drawing (v{nextVersion})
      </Button>
    );
  }

  return (
    <form onSubmit={onSubmit} className="mt-2 flex gap-2">
      <Input placeholder="File reference / URL" value={fileRef} onChange={(e) => setFileRef(e.target.value)} />
      <Button type="submit" disabled={submitting}>
        Save
      </Button>
      <Button type="button" variant="secondary" onClick={() => setOpen(false)}>
        Cancel
      </Button>
    </form>
  );
}

export function ProjectDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [project, setProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState(true);
  const [savingStatus, setSavingStatus] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function load() {
    if (!id) return;
    setLoading(true);
    const data = await api.get<Project>(`/projects/${id}`);
    setProject(data);
    setLoading(false);
  }

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  async function updateStatus(status: ProjectStatus) {
    if (!id) return;
    setSavingStatus(true);
    try {
      await api.patch(`/projects/${id}`, { status });
      await load();
    } finally {
      setSavingStatus(false);
    }
  }

  async function openOrder(orderNumber: string) {
    if (!id) return;
    try {
      await api.post("/orders", { orderNumber, projectId: id, customerSignedDate: new Date().toISOString() });
      await load();
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Failed to open order");
    }
  }

  async function openProductionOrder(poNumber: string) {
    if (!id) return;
    try {
      await api.post("/production-orders", { poNumber, projectId: id });
      await load();
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Failed to open production order");
    }
  }

  async function deleteProject() {
    if (!id || !confirm("Delete this project? This cannot be undone.")) return;
    setError(null);
    try {
      await api.delete(`/projects/${id}`);
      if (project) navigate(`/rfqs/${project.rfqId}`);
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Failed to delete project");
    }
  }

  if (loading || !project) return <p className="text-sm text-neutral-500">Loading…</p>;

  return (
    <div className="max-w-3xl">
      <PageHeader
        title={`Project ${project.projectNumber}`}
        action={
          <Button variant="danger" onClick={deleteProject}>
            Delete
          </Button>
        }
      />

      <Card className="mb-6 p-4">
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <div className="text-xs text-neutral-500 dark:text-neutral-400">RFQ</div>
            <Link className="text-blue-600 hover:underline dark:text-blue-400" to={`/rfqs/${project.rfqId}`}>
              {project.rfq?.rfqNumber} — {project.rfq?.title}
            </Link>
          </div>
          <div>
            <div className="text-xs text-neutral-500 dark:text-neutral-400">Team</div>
            <div className="text-neutral-900 dark:text-neutral-100">
              {project.team?.department?.name} — {project.team?.code} ({project.team?.description})
            </div>
          </div>
          <div>
            <Label>Status</Label>
            <Select value={project.status} disabled={savingStatus} onChange={(e) => updateStatus(e.target.value as ProjectStatus)}>
              {PROJECT_STATUSES.map((s) => (
                <option key={s} value={s}>
                  {s.replaceAll("_", " ")}
                </option>
              ))}
            </Select>
          </div>
        </div>
      </Card>

      {error && <p className="mb-4 text-sm text-red-600 dark:text-red-400">{error}</p>}

      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        <Card className="p-4">
          <h2 className="mb-2 text-sm font-semibold text-neutral-900 dark:text-neutral-100">Drawings</h2>
          <ul className="mb-2 space-y-1 text-sm text-neutral-600 dark:text-neutral-300">
            {project.drawings?.map((d) => (
              <li key={d.id}>
                v{d.version} — {d.status} {d.fileRef ? `(${d.fileRef})` : ""}
              </li>
            ))}
            {(!project.drawings || project.drawings.length === 0) && <li className="text-neutral-400">None yet</li>}
          </ul>
          <AddDrawingForm projectId={project.id} nextVersion={(project.drawings?.length ?? 0) + 1} onCreated={load} />
        </Card>

        <Card className="p-4">
          <h2 className="mb-2 text-sm font-semibold text-neutral-900 dark:text-neutral-100">Order</h2>
          {project.order ? (
            <div className="text-sm">
              <div className="font-mono">{project.order.orderNumber}</div>
              <StatusBadge status={project.order.status} />
            </div>
          ) : (
            <InlineNumberForm label="Order Number" onSubmit={openOrder} buttonLabel="Open Order" />
          )}
        </Card>

        <Card className="p-4">
          <h2 className="mb-2 text-sm font-semibold text-neutral-900 dark:text-neutral-100">Production Order</h2>
          {project.productionOrder ? (
            <div className="text-sm">
              <div className="font-mono">{project.productionOrder.poNumber}</div>
              <StatusBadge status={project.productionOrder.status} />
            </div>
          ) : (
            <InlineNumberForm label="PO Number (7 digits)" pattern="\d{7}" maxLength={7} onSubmit={openProductionOrder} buttonLabel="Open Production Order" />
          )}
        </Card>
      </div>

      <div className="mt-6">
        <Label>Notes</Label>
        <NotesEditor projectId={project.id} initial={project.notes ?? ""} onSaved={load} />
      </div>
    </div>
  );
}

function InlineNumberForm({
  label,
  buttonLabel,
  pattern,
  maxLength,
  onSubmit,
}: {
  label: string;
  buttonLabel: string;
  pattern?: string;
  maxLength?: number;
  onSubmit: (value: string) => Promise<void>;
}) {
  const [value, setValue] = useState("");
  const [submitting, setSubmitting] = useState(false);

  async function submit(e: FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    try {
      await onSubmit(value);
      setValue("");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form onSubmit={submit} className="space-y-2">
      <Label>{label}</Label>
      <Input value={value} onChange={(e) => setValue(e.target.value)} pattern={pattern} maxLength={maxLength} required />
      <Button type="submit" className="w-full" disabled={submitting}>
        {buttonLabel}
      </Button>
    </form>
  );
}

function NotesEditor({ projectId, initial, onSaved }: { projectId: string; initial: string; onSaved: () => void }) {
  const [notes, setNotes] = useState(initial);
  const [saving, setSaving] = useState(false);

  async function save() {
    setSaving(true);
    try {
      await api.patch(`/projects/${projectId}`, { notes });
      onSaved();
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="flex gap-2">
      <textarea
        className="w-full rounded-lg border border-neutral-300 bg-white px-3 py-1.5 text-sm outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 dark:border-neutral-700 dark:bg-neutral-950 dark:text-neutral-100"
        rows={3}
        value={notes}
        onChange={(e) => setNotes(e.target.value)}
      />
      <Button onClick={save} disabled={saving}>
        Save
      </Button>
    </div>
  );
}

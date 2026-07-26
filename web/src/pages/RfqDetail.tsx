import { useEffect, useState, type FormEvent } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useResource } from "../lib/useResource";
import { api, ApiError } from "../lib/api";
import type { Rfq, RfqStatus, Team } from "../lib/types";
import { Button, Card, Input, Label, PageHeader, Select, StatusBadge } from "../components/ui";

const RFQ_STATUSES: RfqStatus[] = [
  "NEW",
  "UNDER_REVIEW",
  "SOLUTION_PROPOSED",
  "DRAWING_SENT",
  "CUSTOMER_SIGNED",
  "REJECTED",
  "CLOSED",
];

function NewProjectForm({ rfqId, teams, onCreated }: { rfqId: string; teams: Team[]; onCreated: () => void }) {
  const [open, setOpen] = useState(false);
  const [projectNumber, setProjectNumber] = useState("");
  const [teamId, setTeamId] = useState(teams[0]?.id ?? "");
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);
    setSubmitting(true);
    try {
      await api.post("/projects", { projectNumber, rfqId, teamId: teamId || teams[0]?.id });
      setProjectNumber("");
      setOpen(false);
      onCreated();
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Failed to create project");
    } finally {
      setSubmitting(false);
    }
  }

  if (!open) {
    return (
      <Button variant="secondary" onClick={() => setOpen(true)}>
        + Assign R&D Project
      </Button>
    );
  }

  return (
    <Card className="mt-3 p-4">
      <form onSubmit={onSubmit} className="grid grid-cols-2 gap-4">
        <div>
          <Label>Project Number (7 digits)</Label>
          <Input value={projectNumber} onChange={(e) => setProjectNumber(e.target.value)} pattern="\d{7}" maxLength={7} required />
        </div>
        <div>
          <Label>R&D Team</Label>
          <Select value={teamId} onChange={(e) => setTeamId(e.target.value)} required>
            {teams.map((t) => (
              <option key={t.id} value={t.id}>
                {t.department?.name} — {t.code} ({t.description})
              </option>
            ))}
          </Select>
        </div>
        {error && <p className="col-span-2 text-sm text-red-600 dark:text-red-400">{error}</p>}
        <div className="col-span-2 flex gap-2">
          <Button type="submit" disabled={submitting}>
            {submitting ? "Creating…" : "Create Project"}
          </Button>
          <Button type="button" variant="secondary" onClick={() => setOpen(false)}>
            Cancel
          </Button>
        </div>
      </form>
    </Card>
  );
}

export function RfqDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [rfq, setRfq] = useState<Rfq | null>(null);
  const [loading, setLoading] = useState(true);
  const { data: teams } = useResource<Team>("/teams");
  const [savingStatus, setSavingStatus] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function load() {
    if (!id) return;
    setLoading(true);
    const data = await api.get<Rfq>(`/rfqs/${id}`);
    setRfq(data);
    setLoading(false);
  }

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  async function updateStatus(status: RfqStatus) {
    if (!id) return;
    setSavingStatus(true);
    try {
      await api.patch(`/rfqs/${id}`, { status });
      await load();
    } finally {
      setSavingStatus(false);
    }
  }

  async function deleteRfq() {
    if (!id || !confirm("Delete this RFQ? This cannot be undone.")) return;
    setError(null);
    try {
      await api.delete(`/rfqs/${id}`);
      navigate("/");
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Failed to delete RFQ");
    }
  }

  if (loading || !rfq) return <p className="text-sm text-neutral-500">Loading…</p>;

  return (
    <div className="max-w-3xl">
      <PageHeader
        title={`RFQ ${rfq.rfqNumber} — ${rfq.title}`}
        action={
          <Button variant="danger" onClick={deleteRfq}>
            Delete
          </Button>
        }
      />

      {error && <p className="mb-4 text-sm text-red-600 dark:text-red-400">{error}</p>}

      <Card className="mb-6 p-4">
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <div className="text-xs text-neutral-500 dark:text-neutral-400">Branch</div>
            <div className="text-neutral-900 dark:text-neutral-100">{rfq.branch?.name}</div>
          </div>
          <div>
            <div className="text-xs text-neutral-500 dark:text-neutral-400">Customer</div>
            <div className="text-neutral-900 dark:text-neutral-100">{rfq.customer}</div>
          </div>
          <div>
            <div className="text-xs text-neutral-500 dark:text-neutral-400">Material</div>
            <div className="text-neutral-900 dark:text-neutral-100">{rfq.materialDescription || "—"}</div>
          </div>
          <div>
            <div className="text-xs text-neutral-500 dark:text-neutral-400">Problem</div>
            <div className="text-neutral-900 dark:text-neutral-100">{rfq.problemDescription || "—"}</div>
          </div>
          <div>
            <Label>Status</Label>
            <Select value={rfq.status} disabled={savingStatus} onChange={(e) => updateStatus(e.target.value as RfqStatus)}>
              {RFQ_STATUSES.map((s) => (
                <option key={s} value={s}>
                  {s.replaceAll("_", " ")}
                </option>
              ))}
            </Select>
          </div>
        </div>
      </Card>

      <h2 className="mb-3 text-sm font-semibold text-neutral-900 dark:text-neutral-100">R&D Projects</h2>
      <div className="space-y-2">
        {rfq.projects?.map((p) => (
          <Link key={p.id} to={`/projects/${p.id}`}>
            <Card className="p-3 transition hover:border-blue-400 dark:hover:border-blue-600">
              <div className="flex items-center justify-between">
                <div>
                  <span className="font-mono text-sm text-neutral-500 dark:text-neutral-400">{p.projectNumber}</span>
                  <span className="ml-2 text-sm text-neutral-900 dark:text-neutral-100">
                    {p.team?.department?.name} — {p.team?.code}
                  </span>
                </div>
                <StatusBadge status={p.status} />
              </div>
            </Card>
          </Link>
        ))}
        {(!rfq.projects || rfq.projects.length === 0) && (
          <p className="text-sm text-neutral-500 dark:text-neutral-400">No project assigned yet.</p>
        )}
      </div>
      <NewProjectForm rfqId={rfq.id} teams={teams} onCreated={load} />
    </div>
  );
}

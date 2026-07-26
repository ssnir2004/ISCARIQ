import { useState, type FormEvent } from "react";
import { Link } from "react-router-dom";
import { useResource } from "../lib/useResource";
import { api, ApiError } from "../lib/api";
import type { Branch, Rfq } from "../lib/types";
import { Button, Card, Input, Label, PageHeader, Select, StatusBadge } from "../components/ui";

function todayIsoDate() {
  return new Date().toISOString().slice(0, 10);
}

function NewRfqForm({ branches, onCreated }: { branches: Branch[]; onCreated: () => void }) {
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({
    rfqNumber: "",
    branchId: branches[0]?.id ?? "",
    title: "",
    rfqDate: todayIsoDate(),
    contactPerson: "",
  });
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);
    setSubmitting(true);
    try {
      await api.post("/rfqs", form);
      setForm({ rfqNumber: "", branchId: branches[0]?.id ?? "", title: "", rfqDate: todayIsoDate(), contactPerson: "" });
      setOpen(false);
      onCreated();
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Failed to create RFQ");
    } finally {
      setSubmitting(false);
    }
  }

  if (!open) {
    return <Button onClick={() => setOpen(true)}>+ New RFQ</Button>;
  }

  return (
    <Card className="mb-6 p-4">
      <form onSubmit={onSubmit} className="grid grid-cols-2 gap-4">
        <div>
          <Label>RFQ Number (6 digits)</Label>
          <Input
            value={form.rfqNumber}
            onChange={(e) => setForm({ ...form, rfqNumber: e.target.value })}
            pattern="\d{6}"
            maxLength={6}
            required
          />
        </div>
        <div>
          <Label>Branch</Label>
          <Select value={form.branchId} onChange={(e) => setForm({ ...form, branchId: e.target.value })} required>
            {branches.map((b) => (
              <option key={b.id} value={b.id}>
                {b.name}
              </option>
            ))}
          </Select>
        </div>
        <div className="col-span-2">
          <Label>Title</Label>
          <Input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} required />
        </div>
        <div>
          <Label>Date</Label>
          <Input
            type="date"
            value={form.rfqDate}
            onChange={(e) => setForm({ ...form, rfqDate: e.target.value })}
            required
          />
        </div>
        <div>
          <Label>Contact Person</Label>
          <Input
            value={form.contactPerson}
            onChange={(e) => setForm({ ...form, contactPerson: e.target.value })}
            placeholder="Who opened this RFQ at the branch"
          />
        </div>
        {error && <p className="col-span-2 text-sm text-red-600 dark:text-red-400">{error}</p>}
        <div className="col-span-2 flex gap-2">
          <Button type="submit" disabled={submitting}>
            {submitting ? "Creating…" : "Create RFQ"}
          </Button>
          <Button type="button" variant="secondary" onClick={() => setOpen(false)}>
            Cancel
          </Button>
        </div>
      </form>
    </Card>
  );
}

export function Pipeline() {
  const { data: rfqs, loading, reload } = useResource<Rfq>("/rfqs");
  const { data: branches } = useResource<Branch>("/branches");

  return (
    <div>
      <PageHeader title="RFQ Pipeline" action={<NewRfqForm branches={branches} onCreated={reload} />} />
      {loading && <p className="text-sm text-neutral-500">Loading…</p>}
      {!loading && rfqs.length === 0 && (
        <p className="text-sm text-neutral-500">No RFQs yet. Create one to get started.</p>
      )}
      <div className="space-y-3">
        {rfqs.map((rfq) => (
          <Link key={rfq.id} to={`/rfqs/${rfq.id}`}>
            <Card className="p-4 transition hover:border-blue-400 dark:hover:border-blue-600">
              <div className="flex items-center justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-sm text-neutral-500 dark:text-neutral-400">{rfq.rfqNumber}</span>
                    <span className="font-medium text-neutral-900 dark:text-neutral-100">{rfq.title}</span>
                  </div>
                  <div className="mt-1 text-xs text-neutral-500 dark:text-neutral-400">
                    {rfq.branch?.name} · {rfq.customer} · {new Date(rfq.rfqDate).toLocaleDateString()}
                    {rfq.contactPerson ? ` · ${rfq.contactPerson}` : ""}
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {rfq.projects && rfq.projects.length > 0 && (
                    <span className="text-xs text-neutral-500 dark:text-neutral-400">
                      {rfq.projects.length} project{rfq.projects.length > 1 ? "s" : ""}
                    </span>
                  )}
                  <StatusBadge status={rfq.status} />
                </div>
              </div>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}

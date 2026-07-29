import { useEffect, useState, type ChangeEvent, type FormEvent } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { useResource } from "../../lib/useResource";
import { api, ApiError } from "../../lib/api";
import type { Insert, TestReport } from "../../lib/types";
import { Button, Card, Input, Label, Modal, PageHeader, Select, Textarea } from "../../components/ui";

const EMPTY_FORM = {
  insertId: "",
  testNo: "",
  testDate: "",
  description: "",
  result: "",
  country: "",
  customer: "",
  performer: "",
};

const EMPTY_FILE_FORM = {
  description: "",
  fileDate: "",
  notes: "",
};

function readFileAsDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

export function TestReports() {
  const [searchParams, setSearchParams] = useSearchParams();
  const insertIdFilter = searchParams.get("insertId") ?? "";

  const { data: testReports, reload } = useResource<TestReport>("/test-reports");
  const { data: inserts } = useResource<Insert>("/inserts");
  const [form, setForm] = useState(EMPTY_FORM);
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [filesFor, setFilesFor] = useState<TestReport | null>(null);
  const [fileForm, setFileForm] = useState(EMPTY_FILE_FORM);
  const [fileError, setFileError] = useState<string | null>(null);
  const [fileInputKey, setFileInputKey] = useState(0);
  const [pendingFile, setPendingFile] = useState<{ name: string; data: string } | null>(null);

  useEffect(() => {
    if (insertIdFilter) {
      setForm((f) => (f.insertId ? f : { ...f, insertId: insertIdFilter }));
    }
  }, [insertIdFilter]);

  // Keep the files modal in sync as the underlying list reloads (e.g. after adding/deleting a file).
  useEffect(() => {
    if (!filesFor) return;
    const fresh = testReports.find((r) => r.id === filesFor.id);
    if (fresh) setFilesFor(fresh);
  }, [testReports, filesFor?.id]);

  const filtered = insertIdFilter ? testReports.filter((r) => r.insertId === insertIdFilter) : testReports;
  const filterInsert = insertIdFilter ? inserts.find((i) => i.id === insertIdFilter) : null;

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);
    setSubmitting(true);
    try {
      await api.post("/test-reports", {
        insertId: form.insertId || inserts[0]?.id,
        testNo: form.testNo,
        testDate: form.testDate,
        description: form.description || undefined,
        result: form.result,
        country: form.country || undefined,
        customer: form.customer || undefined,
        performer: form.performer || undefined,
      });
      setForm({ ...EMPTY_FORM, insertId: insertIdFilter });
      reload();
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Failed to save test report");
    } finally {
      setSubmitting(false);
    }
  }

  async function remove(r: TestReport) {
    if (!confirm(`Delete test report ${r.testNo}? This also deletes its filed documents.`)) return;
    setError(null);
    try {
      for (const f of r.files ?? []) {
        await api.delete(`/test-report-files/${f.id}`);
      }
      await api.delete(`/test-reports/${r.id}`);
      if (filesFor?.id === r.id) setFilesFor(null);
      reload();
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Failed to delete test report");
    }
  }

  async function onFilePicked(e: ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setPendingFile({ name: file.name, data: await readFileAsDataUrl(file) });
  }

  async function addFile(e: FormEvent) {
    e.preventDefault();
    if (!filesFor || !pendingFile) return;
    setFileError(null);
    try {
      await api.post("/test-report-files", {
        testReportId: filesFor.id,
        fileName: pendingFile.name,
        fileData: pendingFile.data,
        description: fileForm.description || undefined,
        fileDate: fileForm.fileDate || undefined,
        notes: fileForm.notes || undefined,
      });
      setFileForm(EMPTY_FILE_FORM);
      setPendingFile(null);
      setFileInputKey((k) => k + 1);
      reload();
    } catch (err) {
      setFileError(err instanceof ApiError ? err.message : "Failed to file document");
    }
  }

  async function removeFile(id: string) {
    if (!confirm("Delete this document?")) return;
    setFileError(null);
    try {
      await api.delete(`/test-report-files/${id}`);
      reload();
    } catch (err) {
      setFileError(err instanceof ApiError ? err.message : "Failed to delete document");
    }
  }

  return (
    <div className="max-w-6xl">
      <PageHeader
        title={filterInsert ? `Test Reports — ${filterInsert.designation}` : "Test Reports"}
        action={
          filterInsert && (
            <Link to="/catalog/test-reports" className="text-sm text-blue-600 hover:underline dark:text-blue-400">
              View all test reports
            </Link>
          )
        }
      />

      <Card className="mb-6 p-4">
        <form onSubmit={onSubmit} className="grid grid-cols-4 gap-4">
          <div>
            <Label>Insert</Label>
            <Select value={form.insertId} onChange={(e) => setForm({ ...form, insertId: e.target.value })} required>
              <option value="" disabled>
                Select insert…
              </option>
              {inserts.map((i) => (
                <option key={i.id} value={i.id}>
                  {i.designation}
                </option>
              ))}
            </Select>
          </div>
          <div>
            <Label>Test No.</Label>
            <Input value={form.testNo} onChange={(e) => setForm({ ...form, testNo: e.target.value })} required />
          </div>
          <div>
            <Label>Test Date</Label>
            <Input type="date" value={form.testDate} onChange={(e) => setForm({ ...form, testDate: e.target.value })} required />
          </div>
          <div>
            <Label>Result</Label>
            <Input value={form.result} onChange={(e) => setForm({ ...form, result: e.target.value })} required />
          </div>
          <div className="col-span-4">
            <Label>Description</Label>
            <Input
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              placeholder="Brief description of the trial"
            />
          </div>
          <div>
            <Label>Country</Label>
            <Input value={form.country} onChange={(e) => setForm({ ...form, country: e.target.value })} />
          </div>
          <div>
            <Label>Customer</Label>
            <Input value={form.customer} onChange={(e) => setForm({ ...form, customer: e.target.value })} />
          </div>
          <div>
            <Label>Performer</Label>
            <Input value={form.performer} onChange={(e) => setForm({ ...form, performer: e.target.value })} />
          </div>
          {error && <p className="col-span-4 text-sm text-red-600 dark:text-red-400">{error}</p>}
          <div className="col-span-4">
            <Button type="submit" disabled={submitting}>
              Add Test Report
            </Button>
          </div>
        </form>
      </Card>

      <div className="overflow-x-auto rounded-xl border border-neutral-200 dark:border-neutral-800">
        <table className="w-full text-left text-sm">
          <thead className="bg-neutral-100 text-xs uppercase text-neutral-500 dark:bg-neutral-900 dark:text-neutral-400">
            <tr>
              <th className="px-3 py-2">Insert</th>
              <th className="px-3 py-2">Test No.</th>
              <th className="px-3 py-2">Test Date</th>
              <th className="px-3 py-2">Description</th>
              <th className="px-3 py-2">Result</th>
              <th className="px-3 py-2">Country</th>
              <th className="px-3 py-2">Customer</th>
              <th className="px-3 py-2">Performer</th>
              <th className="px-3 py-2">Documents</th>
              <th className="px-3 py-2"></th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((r) => (
              <tr key={r.id} className="border-t border-neutral-200 dark:border-neutral-800">
                <td className="px-3 py-2 font-mono">
                  {r.insert ? (
                    <button
                      type="button"
                      className="underline decoration-dotted underline-offset-2 hover:text-blue-600 dark:hover:text-blue-400"
                      onClick={() => setSearchParams({ insertId: r.insertId })}
                    >
                      {r.insert.designation}
                    </button>
                  ) : (
                    "—"
                  )}
                </td>
                <td className="px-3 py-2">{r.testNo}</td>
                <td className="px-3 py-2">{new Date(r.testDate).toLocaleDateString()}</td>
                <td className="px-3 py-2 max-w-xs truncate">{r.description || "—"}</td>
                <td className="px-3 py-2">{r.result}</td>
                <td className="px-3 py-2">{r.country || "—"}</td>
                <td className="px-3 py-2">{r.customer || "—"}</td>
                <td className="px-3 py-2">{r.performer || "—"}</td>
                <td className="px-3 py-2">
                  <Button variant="ghost" onClick={() => setFilesFor(r)}>
                    {r.files?.length ? `${r.files.length} doc${r.files.length === 1 ? "" : "s"}` : "File document"}
                  </Button>
                </td>
                <td className="px-3 py-2 text-right">
                  <Button variant="ghost" onClick={() => remove(r)}>
                    Delete
                  </Button>
                </td>
              </tr>
            ))}
            {filtered.length === 0 && (
              <tr>
                <td className="px-3 py-6 text-center text-neutral-500 dark:text-neutral-400" colSpan={10}>
                  No test reports yet.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {filesFor && (
        <Modal
          title={`Documents — ${filesFor.testNo} (${filesFor.insert?.designation ?? ""})`}
          onClose={() => {
            setFilesFor(null);
            setFileForm(EMPTY_FILE_FORM);
            setPendingFile(null);
            setFileError(null);
          }}
        >
          <div className="space-y-3">
            {(filesFor.files ?? []).map((f) => (
              <div key={f.id} className="rounded-lg border border-neutral-200 p-3 dark:border-neutral-800">
                <div className="flex items-start justify-between gap-2">
                  <a
                    href={f.fileData}
                    download={f.fileName}
                    className="break-all text-sm font-medium text-blue-600 hover:underline dark:text-blue-400"
                  >
                    {f.fileName}
                  </a>
                  <Button variant="ghost" onClick={() => removeFile(f.id)}>
                    Delete
                  </Button>
                </div>
                {f.description && <p className="mt-1 text-sm text-neutral-700 dark:text-neutral-300">{f.description}</p>}
                <div className="mt-1 text-xs text-neutral-500 dark:text-neutral-400">
                  {f.fileDate && <span>{new Date(f.fileDate).toLocaleDateString()}</span>}
                </div>
                {f.notes && <p className="mt-1 whitespace-pre-wrap text-xs text-neutral-500 dark:text-neutral-400">{f.notes}</p>}
              </div>
            ))}
            {(filesFor.files ?? []).length === 0 && (
              <p className="text-sm text-neutral-500 dark:text-neutral-400">No documents filed yet.</p>
            )}

            <form onSubmit={addFile} className="space-y-2 border-t border-neutral-200 pt-3 dark:border-neutral-800">
              <div>
                <Label>Document</Label>
                <Input key={fileInputKey} type="file" onChange={onFilePicked} required />
              </div>
              <div>
                <Label>Description</Label>
                <Input value={fileForm.description} onChange={(e) => setFileForm({ ...fileForm, description: e.target.value })} />
              </div>
              <div>
                <Label>Date</Label>
                <Input type="date" value={fileForm.fileDate} onChange={(e) => setFileForm({ ...fileForm, fileDate: e.target.value })} />
              </div>
              <div>
                <Label>Notes</Label>
                <Textarea rows={2} value={fileForm.notes} onChange={(e) => setFileForm({ ...fileForm, notes: e.target.value })} />
              </div>
              {fileError && <p className="text-sm text-red-600 dark:text-red-400">{fileError}</p>}
              <Button type="submit" disabled={!pendingFile}>
                File Document
              </Button>
            </form>
          </div>
        </Modal>
      )}
    </div>
  );
}

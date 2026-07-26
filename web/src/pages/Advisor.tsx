import { useState } from "react";
import { useResource } from "../lib/useResource";
import { api, ApiError } from "../lib/api";
import type { AdvisorRecommendation, Material, OperationType, ProblemTag } from "../lib/types";
import { Button, Card, Input, Label, PageHeader, Select, StatusBadge } from "../components/ui";

const OPERATIONS: OperationType[] = ["TURNING", "MILLING", "DRILLING", "GROOVING", "THREADING", "BORING"];

export function Advisor() {
  const { data: materials } = useResource<Material>("/materials");
  const { data: tags } = useResource<ProblemTag>("/problem-tags");

  const [operationType, setOperationType] = useState<OperationType>("TURNING");
  const [materialId, setMaterialId] = useState("");
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [ap, setAp] = useState("");
  const [results, setResults] = useState<AdvisorRecommendation[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  function toggleTag(id: string) {
    setSelectedTags((prev) => (prev.includes(id) ? prev.filter((t) => t !== id) : [...prev, id]));
  }

  async function runAdvisor() {
    setError(null);
    setLoading(true);
    try {
      const res = await api.post<{ recommendations: AdvisorRecommendation[] }>("/advisor", {
        operationType,
        materialId: materialId || materials[0]?.id,
        problemTagIds: selectedTags,
        ap: ap === "" ? undefined : Number(ap),
      });
      setResults(res.recommendations);
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Advisor query failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="max-w-4xl">
      <PageHeader title="Insert Advisor" />
      <Card className="mb-6 p-4">
        <div className="grid grid-cols-3 gap-4">
          <div>
            <Label>Operation</Label>
            <Select value={operationType} onChange={(e) => setOperationType(e.target.value as OperationType)}>
              {OPERATIONS.map((o) => (
                <option key={o} value={o}>
                  {o}
                </option>
              ))}
            </Select>
          </div>
          <div>
            <Label>Material</Label>
            <Select value={materialId} onChange={(e) => setMaterialId(e.target.value)}>
              <option value="">Select…</option>
              {materials.map((m) => (
                <option key={m.id} value={m.id}>
                  {m.iso513Group} — {m.name}
                </option>
              ))}
            </Select>
          </div>
          <div>
            <Label>Depth of cut (ap, mm) — optional</Label>
            <Input type="number" step="any" value={ap} onChange={(e) => setAp(e.target.value)} />
          </div>
        </div>

        <div className="mt-4">
          <Label>Problems observed</Label>
          <div className="flex flex-wrap gap-2">
            {tags.map((t) => (
              <button
                key={t.id}
                type="button"
                onClick={() => toggleTag(t.id)}
                className={`rounded-full border px-3 py-1 text-xs font-medium transition ${
                  selectedTags.includes(t.id)
                    ? "border-blue-500 bg-blue-50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300"
                    : "border-neutral-300 text-neutral-600 hover:bg-neutral-100 dark:border-neutral-700 dark:text-neutral-300 dark:hover:bg-neutral-800"
                }`}
              >
                {t.name}
              </button>
            ))}
          </div>
        </div>

        {error && <p className="mt-4 text-sm text-red-600 dark:text-red-400">{error}</p>}

        <div className="mt-4">
          <Button onClick={runAdvisor} disabled={loading || !materialId}>
            {loading ? "Searching…" : "Get Recommendations"}
          </Button>
        </div>
      </Card>

      {results && (
        <div className="space-y-3">
          {results.length === 0 && (
            <p className="text-sm text-neutral-500 dark:text-neutral-400">
              No matching inserts found. Add cutting conditions / problem matches in the catalog.
            </p>
          )}
          {results.map((r, idx) => (
            <Card key={r.cuttingCondition.id} className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-lg font-bold text-neutral-400 dark:text-neutral-600">#{idx + 1}</span>
                  <span className="font-mono text-base font-medium text-neutral-900 dark:text-neutral-100">
                    {r.insert.designation}
                  </span>
                  <span className="text-sm text-neutral-500 dark:text-neutral-400">
                    {r.insert.grade} · {r.insert.chipbreaker}
                  </span>
                </div>
                {!r.apFit && <StatusBadge status="OUT_OF_AP_RANGE" />}
              </div>
              <div className="mt-2 grid grid-cols-4 gap-3 text-sm text-neutral-600 dark:text-neutral-300">
                <div>
                  <div className="text-xs text-neutral-400">vc (m/min)</div>
                  {r.cuttingCondition.vcMin ?? "—"}–{r.cuttingCondition.vcMax ?? "—"}
                </div>
                <div>
                  <div className="text-xs text-neutral-400">feed (mm/rev)</div>
                  {r.cuttingCondition.feedMin ?? "—"}–{r.cuttingCondition.feedMax ?? "—"}
                </div>
                <div>
                  <div className="text-xs text-neutral-400">ap (mm)</div>
                  {r.cuttingCondition.apMin ?? "—"}–{r.cuttingCondition.apMax ?? "—"}
                </div>
                <div>
                  <div className="text-xs text-neutral-400">Coolant</div>
                  {r.cuttingCondition.coolant}
                </div>
              </div>
              {r.matchedProblems.length > 0 && (
                <div className="mt-2 flex flex-wrap gap-1">
                  {r.matchedProblems.map((p) => (
                    <span
                      key={p}
                      className="rounded-full bg-emerald-100 px-2 py-0.5 text-xs text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-300"
                    >
                      solves: {p}
                    </span>
                  ))}
                </div>
              )}
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}

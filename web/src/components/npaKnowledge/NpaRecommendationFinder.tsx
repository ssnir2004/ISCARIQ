import { useState } from "react";
import { api, ApiError } from "../../lib/api";
import type { Iso513Group, NpaApplicationCategory, NpaRecommendationResult } from "../../lib/types";
import { applicationLabel, iso513Label, CONDITION_SUGGESTIONS } from "../../lib/npaKnowledgeConstants";
import { Button, Card, Label } from "../ui";
import { ApplicationSelect } from "./ApplicationSelect";
import { openNpaFile } from "./NpaKnowledgeCard";

const GOAL_OPTIONS = [
  "Chip evacuation",
  "High productivity",
  "Long tool life",
  "Surface finish",
  "Unstable setup",
  "Long overhang",
  "Thin wall",
  "High feed",
  "Roughing",
  "Finishing",
];

export function NpaRecommendationFinder() {
  const [applicationCategory, setApplicationCategory] = useState<NpaApplicationCategory | "">("");
  const [iso513Group, setIso513Group] = useState<Iso513Group | "">("");
  const [goal, setGoal] = useState("");
  const [results, setResults] = useState<NpaRecommendationResult[] | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function search() {
    setLoading(true);
    setError(null);
    try {
      const data = await api.post<NpaRecommendationResult[]>("/npa-knowledge/recommend", {
        applicationCategory: applicationCategory || undefined,
        iso513Group: iso513Group || undefined,
        advantageTags: goal ? [goal] : [],
        conditionTags: goal ? [goal] : [],
        searchText: goal || undefined,
      });
      setResults(data);
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Failed to get recommendations");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div>
      <Card className="mb-6 p-4">
        <div className="grid grid-cols-3 gap-4">
          <div>
            <Label>Application Category</Label>
            <ApplicationSelect value={applicationCategory} onChange={setApplicationCategory} allowEmpty />
          </div>
          <div>
            <Label>ISO 513 Group</Label>
            <select
              className="w-full rounded-lg border border-neutral-300 bg-white px-3 py-1.5 text-sm outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 dark:border-neutral-700 dark:bg-neutral-950 dark:text-neutral-100"
              value={iso513Group}
              onChange={(e) => setIso513Group(e.target.value as Iso513Group | "")}
            >
              <option value="">Any</option>
              {(["P", "M", "K", "N", "S", "H"] as Iso513Group[]).map((g) => (
                <option key={g} value={g}>
                  {iso513Label(g)}
                </option>
              ))}
            </select>
          </div>
          <div>
            <Label>Customer Problem / Goal</Label>
            <select
              className="w-full rounded-lg border border-neutral-300 bg-white px-3 py-1.5 text-sm outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 dark:border-neutral-700 dark:bg-neutral-950 dark:text-neutral-100"
              value={goal}
              onChange={(e) => setGoal(e.target.value)}
            >
              <option value="">Any</option>
              {GOAL_OPTIONS.map((g) => (
                <option key={g} value={g}>
                  {g}
                </option>
              ))}
            </select>
          </div>
          <div className="col-span-3">
            <Button type="button" onClick={search} disabled={loading}>
              {loading ? "Searching…" : "Find Recommendations"}
            </Button>
          </div>
          {error && <p className="col-span-3 text-sm text-red-600 dark:text-red-400">{error}</p>}
        </div>
      </Card>

      {results && (
        <div className="space-y-3">
          {results.length === 0 && <p className="text-sm text-neutral-500 dark:text-neutral-400">No matching NPA knowledge records.</p>}
          {results.map(({ item, score, reasons }) => (
            <Card key={item.id} className="flex gap-3 p-3">
              {item.imageData ? (
                <img src={item.imageData} alt="" className="h-20 w-20 shrink-0 rounded-lg object-cover" />
              ) : (
                <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-lg bg-neutral-100 text-xs text-neutral-400 dark:bg-neutral-800">
                  No image
                </div>
              )}
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-2 text-sm">
                  <span className="rounded-full bg-emerald-100 px-2 py-0.5 text-xs font-semibold text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-300">
                    Score {score}
                  </span>
                  <span className="font-medium text-neutral-900 dark:text-neutral-100">{item.productFamily}</span>
                  {item.insertDesignation && <span className="font-mono text-xs">{item.insertDesignation}</span>}
                  <span className="text-xs text-neutral-500 dark:text-neutral-400">{applicationLabel(item.applicationCategory)}</span>
                </div>
                {reasons.length > 0 && (
                  <p className="mt-1 text-xs text-neutral-500 dark:text-neutral-400">Why it matched: {reasons.join("; ")}</p>
                )}
                {item.innovation && <p className="mt-1 text-xs text-neutral-600 dark:text-neutral-300">{item.innovation}</p>}
                {item.advantages.length > 0 && (
                  <div className="mt-1 flex flex-wrap gap-1">
                    {item.advantages.map((a) => (
                      <span key={a} className="rounded-full bg-blue-50 px-2 py-0.5 text-xs text-blue-700 dark:bg-blue-900/30 dark:text-blue-300">
                        {a}
                      </span>
                    ))}
                  </div>
                )}
                {item.recommendedUse && <p className="mt-1 text-xs text-neutral-600 dark:text-neutral-300">{item.recommendedUse}</p>}
              </div>
              {item.npaFileData && (
                <Button variant="ghost" className="self-start" onClick={() => openNpaFile(item)}>
                  Open NPA
                </Button>
              )}
            </Card>
          ))}
        </div>
      )}

      {!results && (
        <p className="text-xs text-neutral-500 dark:text-neutral-400">
          Suggested goals: {CONDITION_SUGGESTIONS.join(", ")}
        </p>
      )}
    </div>
  );
}

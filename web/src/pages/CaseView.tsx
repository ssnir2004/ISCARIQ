import { useEffect, useState } from "react";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import { api, ApiError } from "../lib/api";
import { ISO513_COLORS } from "../lib/npaKnowledgeConstants";
import type { GradeCase, Iso513Group } from "../lib/types";
import { caseMatches, caseUrl } from "../lib/gradeCases";

// Close the tab this case was opened in (from the Cases window); if the
// browser refuses because the tab wasn't opened by script, go back instead.
function closeView() {
  window.close();
  if (!window.closed) history.back();
}

// Full-screen view of one grade case, opened in a new tab from the Cases
// window. The image fills the screen; clicking it toggles fit / actual size.
export function CaseView() {
  const { id } = useParams();
  const [item, setItem] = useState<GradeCase | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [actualSize, setActualSize] = useState(false);
  const navigate = useNavigate();
  // Board context the case was opened from (if any): Previous / Next step
  // through the same cases; otherwise through all of the grade's cases.
  const [params] = useSearchParams();
  const scope = params.get("scope") ?? undefined;
  const group = (params.get("group") as Iso513Group | null) ?? undefined;
  const [siblings, setSiblings] = useState<string[]>([]);
  const gradeId = item?.gradeId;

  useEffect(() => {
    if (!gradeId) return;
    api
      .get<GradeCase[]>(`/grade-cases?gradeId=${encodeURIComponent(gradeId)}`)
      .then((list) => setSiblings(list.filter((c) => !scope || !group || caseMatches(c, scope, group)).map((c) => c.id)))
      .catch(() => setSiblings([]));
  }, [gradeId, scope, group]);

  const position = id ? siblings.indexOf(id) : -1;
  const prevId = position > 0 ? siblings[position - 1] : null;
  const nextId = position >= 0 && position < siblings.length - 1 ? siblings[position + 1] : null;

  useEffect(() => {
    setActualSize(false);
    api
      .get<GradeCase>(`/grade-cases/${id}`)
      .then((c) => {
        setItem(c);
        document.title = `${c.grade?.name ?? "Case"} — ${c.title}`;
      })
      .catch((err) => setError(err instanceof ApiError && err.status === 404 ? "This case no longer exists." : "Failed to load the case."));
  }, [id]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeView();
      const target = e.key === "ArrowLeft" ? prevId : e.key === "ArrowRight" ? nextId : null;
      if (target) navigate(caseUrl(target, scope, group), { replace: true });
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [prevId, nextId, scope, group, navigate]);

  return (
    <div className="flex h-screen flex-col bg-neutral-950 text-neutral-100">
      <header className="flex shrink-0 items-start justify-between gap-4 border-b border-neutral-800 px-4 py-2">
        {item ? (
          <div className="min-w-0">
            <h1 className="truncate text-base font-semibold">
              <span className="mr-2 text-neutral-400">{item.grade?.name}</span>
              {item.title}
            </h1>
            <div className="mt-1 flex flex-wrap items-center gap-1.5 text-xs">
              <span className="rounded-full bg-neutral-800 px-2 py-0.5">{item.application?.name ?? "All applications"}</span>
              <span
                className="rounded-full px-2 py-0.5 text-neutral-900"
                style={{ backgroundColor: item.iso513Group ? ISO513_COLORS[item.iso513Group] : "#d4d4d4" }}
              >
                {item.iso513Group ? `ISO ${item.iso513Group}` : "All materials"}
              </span>
              <span className="text-neutral-500">{new Date(item.createdAt).toLocaleDateString()}</span>
              {item.notes && <span className="ml-2 whitespace-pre-line text-neutral-300">{item.notes}</span>}
            </div>
          </div>
        ) : (
          <div className="text-sm text-neutral-400">{error ?? "Loading…"}</div>
        )}
        <div className="flex shrink-0 items-center gap-2 text-sm">
          {siblings.length > 1 && position >= 0 && (
            <div className="flex items-center gap-1" data-case-nav>
              <button
                type="button"
                disabled={!prevId}
                onClick={() => prevId && navigate(caseUrl(prevId, scope, group), { replace: true })}
                className="rounded-lg px-3 py-1.5 text-neutral-300 hover:bg-neutral-800 disabled:opacity-30 disabled:hover:bg-transparent"
              >
                ‹ Previous
              </button>
              <span className="text-neutral-400 tabular-nums">
                {position + 1} / {siblings.length}
              </span>
              <button
                type="button"
                disabled={!nextId}
                onClick={() => nextId && navigate(caseUrl(nextId, scope, group), { replace: true })}
                className="rounded-lg px-3 py-1.5 text-neutral-300 hover:bg-neutral-800 disabled:opacity-30 disabled:hover:bg-transparent"
              >
                Next ›
              </button>
            </div>
          )}
          {item?.image && (
            <button type="button" onClick={() => setActualSize((v) => !v)} className="rounded-lg px-3 py-1.5 text-neutral-300 hover:bg-neutral-800">
              {actualSize ? "Fit to screen" : "Actual size"}
            </button>
          )}
          <button type="button" onClick={closeView} className="rounded-lg bg-neutral-800 px-3 py-1.5 hover:bg-neutral-700" aria-label="Close">
            ✕ Close
          </button>
        </div>
      </header>
      <main className={`flex-1 p-2 ${actualSize ? "overflow-auto" : "flex items-center justify-center overflow-hidden"}`}>
        {item?.image && (
          <img
            src={item.image}
            alt={item.title}
            onClick={() => setActualSize((v) => !v)}
            // Fit mode scales the image up or down to fill the screen.
            className={actualSize ? "max-w-none cursor-zoom-out" : "h-full w-full cursor-zoom-in object-contain"}
          />
        )}
      </main>
    </div>
  );
}

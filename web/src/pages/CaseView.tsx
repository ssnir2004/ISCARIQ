import { useCallback, useEffect, useState } from "react";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import { api, ApiError } from "../lib/api";
import { ISO513_COLORS } from "../lib/npaKnowledgeConstants";
import type { Grade, GradeCase, Iso513Group } from "../lib/types";
import { ALL_SCOPE, caseMatches, caseUrl } from "../lib/gradeCases";
import { AddCaseModal } from "./catalog/GradeFormCases";

// Opened in this tab (from the Grades board): go back to it. Opened in a new
// tab (from the Cases window): close that tab.
function closeView() {
  if (history.length > 1) {
    history.back();
  } else {
    window.close();
  }
}

const headerButton = "rounded-lg px-3 py-1.5 text-neutral-300 hover:bg-neutral-800 disabled:opacity-30 disabled:hover:bg-transparent";

// Full-screen view of one grade case, opened from the Grades board or the
// Cases window. The image fills the screen; clicking it toggles fit / actual
// size. Previous / Next step through the grade's cases, and cases can be
// added, edited and deleted here.
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
  // The grade itself, for the applications / materials a new case can use.
  const [grade, setGrade] = useState<Grade | null>(null);
  const [adding, setAdding] = useState(false);
  const [editing, setEditing] = useState(false);
  const [actionError, setActionError] = useState<string | null>(null);

  const loadItem = useCallback(
    () =>
      api
        .get<GradeCase>(`/grade-cases/${id}`)
        .then((c) => {
          setItem(c);
          setError(null);
          document.title = `${c.grade?.name ?? "Case"} — ${c.title}`;
        })
        .catch((err) => setError(err instanceof ApiError && err.status === 404 ? "This case no longer exists." : "Failed to load the case.")),
    [id]
  );

  const loadSiblings = useCallback(async () => {
    if (!gradeId) return;
    const list = await api.get<GradeCase[]>(`/grade-cases?gradeId=${encodeURIComponent(gradeId)}`);
    const ids = list.filter((c) => !scope || !group || caseMatches(c, scope, group)).map((c) => c.id);
    setSiblings(ids);
    return ids;
  }, [gradeId, scope, group]);

  useEffect(() => {
    loadSiblings().catch(() => setSiblings([]));
  }, [loadSiblings]);

  useEffect(() => {
    if (!gradeId) return;
    api
      .get<Grade>(`/grades/${gradeId}`)
      .then(setGrade)
      .catch(() => setGrade(null));
  }, [gradeId]);

  const position = id ? siblings.indexOf(id) : -1;
  const prevId = position > 0 ? siblings[position - 1] : null;
  const nextId = position >= 0 && position < siblings.length - 1 ? siblings[position + 1] : null;
  const goTo = useCallback((caseId: string) => navigate(caseUrl(caseId, scope, group), { replace: true }), [navigate, scope, group]);

  useEffect(() => {
    setActualSize(false);
    setEditing(false);
    setActionError(null);
    loadItem();
  }, [loadItem]);

  useEffect(() => {
    // Keys belong to the add / edit window while it's open.
    if (adding || editing) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeView();
      const target = e.key === "ArrowLeft" ? prevId : e.key === "ArrowRight" ? nextId : null;
      if (target) goTo(target);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [prevId, nextId, goTo, adding, editing]);

  async function remove() {
    if (!item || !confirm(`Delete the case "${item.title}"?`)) return;
    setActionError(null);
    try {
      await api.delete(`/grade-cases/${item.id}`);
    } catch (err) {
      setActionError(err instanceof ApiError ? err.message : "Failed to delete the case");
      return;
    }
    // Show the next case (or the previous one); with none left, close.
    const then = nextId ?? prevId;
    if (then) {
      setSiblings((s) => s.filter((x) => x !== item.id));
      goTo(then);
    } else {
      closeView();
    }
  }

  // A new case starts from the board context it was opened from.
  const contextApp = scope && scope !== ALL_SCOPE ? scope : "";

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
            {actionError && <p className="mt-1 text-xs text-red-400">{actionError}</p>}
          </div>
        ) : (
          <div className="text-sm text-neutral-400">{error ?? "Loading…"}</div>
        )}
        <div className="flex shrink-0 flex-wrap items-center justify-end gap-2 text-sm">
          {siblings.length > 1 && position >= 0 && (
            <div className="flex items-center gap-1" data-case-nav>
              <button type="button" disabled={!prevId} onClick={() => prevId && goTo(prevId)} className={headerButton}>
                ‹ Previous
              </button>
              <span className="text-neutral-400 tabular-nums">
                {position + 1} / {siblings.length}
              </span>
              <button type="button" disabled={!nextId} onClick={() => nextId && goTo(nextId)} className={headerButton}>
                Next ›
              </button>
            </div>
          )}
          {item && (
            <div className="flex items-center gap-1" data-case-actions>
              <button type="button" onClick={() => setAdding(true)} className={headerButton}>
                + Add case
              </button>
              <button type="button" onClick={() => setEditing(true)} className={headerButton}>
                Edit
              </button>
              <button type="button" onClick={remove} className="rounded-lg px-3 py-1.5 text-red-400 hover:bg-neutral-800">
                Delete
              </button>
            </div>
          )}
          {item?.image && (
            <button type="button" onClick={() => setActualSize((v) => !v)} className={headerButton}>
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
      {editing && item && (
        <AddCaseModal
          grade={{ id: item.gradeId, name: item.grade?.name ?? grade?.name ?? "" }}
          applications={grade?.applications ?? []}
          groups={grade?.iso513Groups ?? []}
          existing={item}
          onClose={() => setEditing(false)}
          onSaved={async () => {
            setEditing(false);
            await loadItem();
            // A changed application / material can take the case out of this
            // view's set; then show it among all of the grade's cases.
            const ids = await loadSiblings().catch(() => undefined);
            if (ids && !ids.includes(item.id)) navigate(caseUrl(item.id), { replace: true });
          }}
        />
      )}
      {adding && item && (
        <AddCaseModal
          grade={{ id: item.gradeId, name: item.grade?.name ?? grade?.name ?? "" }}
          applications={grade?.applications ?? []}
          groups={grade?.iso513Groups ?? []}
          initialApplicationId={grade?.applications.some((a) => a.id === contextApp) ? contextApp : ""}
          initialGroup={group && grade?.iso513Groups.includes(group) ? group : ""}
          onClose={() => setAdding(false)}
          onSaved={async (created) => {
            setAdding(false);
            // Show the new case if it belongs to this view's set; otherwise
            // switch to all of the grade's cases so it can be shown.
            const ids = await loadSiblings().catch(() => undefined);
            if (ids?.includes(created.id)) goTo(created.id);
            else navigate(caseUrl(created.id), { replace: true });
          }}
        />
      )}
    </div>
  );
}

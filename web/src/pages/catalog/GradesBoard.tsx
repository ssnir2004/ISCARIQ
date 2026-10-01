import { useRef, useState, type PointerEvent } from "react";
import { api, ApiError } from "../../lib/api";
import { ISO513_COLORS, ISO513_GROUPS } from "../../lib/npaKnowledgeConstants";
import { useResource } from "../../lib/useResource";
import type { Application, Grade, GradeCase, GradeColumnOrder, Iso513Group } from "../../lib/types";
import { Button, Card } from "../../components/ui";
import type { Entry, GlossaryListContext } from "./GlossaryPage";
import { GradesChart } from "./GradesChart";
import { GradeCasesModal } from "./GradeCasesModal";
import { GradeSearch } from "./GradeSearch";
import { GradeCardModal } from "./GradeCardModal";
import { ALL_SCOPE, caseMatches } from "../../lib/gradeCases";

// Grades laid out in one column per ISO 513 group, each ranked by hand from
// Harder (top) to Tougher (bottom) by dragging. There is one board for all
// grades plus one per Application (tabs), and the order is saved per board
// and column, so a grade has its own position in each. An application board
// with no saved order for a column starts from the "All" board's order.
//
// Dragging uses pointer events rather than native HTML5 drag and drop, so it
// behaves the same with a mouse and on touch screens (via the ⋮⋮ handle).

type Dragging = { group: Iso513Group; id: string; startY: number; active: boolean; index: number | null };

const ALL = "all";
const TAB_STORAGE_KEY = "iscariq.grades.boardTab";
const VIEW_STORAGE_KEY = "iscariq.grades.view";
const CHART_GROUP_STORAGE_KEY = "iscariq.grades.chartGroup";

type View = "table" | "chart";

function readStored(key: string, fallback: string): string {
  try {
    return localStorage.getItem(key) ?? fallback;
  } catch {
    return fallback;
  }
}

function store(key: string, value: string) {
  try {
    localStorage.setItem(key, value);
  } catch {
    // storage unavailable: the choice just isn't remembered
  }
}

const readStoredTab = () => readStored(TAB_STORAGE_KEY, ALL);

const orderKey = (scope: string, group: Iso513Group) => `${scope}:${group}`;

// Pixels the pointer must move before a press turns into a drag, so plain
// clicks (e.g. on Edit) still work.
const DRAG_THRESHOLD = 4;

function orderColumn(group: Iso513Group, grades: Grade[], savedIds: string[] | undefined): Grade[] {
  const inGroup = grades.filter((g) => g.iso513Groups.includes(group));
  const byId = new Map(inGroup.map((g) => [g.id, g]));
  const ranked = (savedIds ?? []).map((id) => byId.get(id)).filter((g): g is Grade => g !== undefined);
  const rankedIds = new Set(ranked.map((g) => g.id));
  // Grades not ranked yet (e.g. newly added) go to the bottom, by name.
  const rest = inGroup.filter((g) => !rankedIds.has(g.id)).sort((a, b) => a.name.localeCompare(b.name));
  return [...ranked, ...rest];
}

// Insert position (0..cards.length) for a pointer at clientY among a column's cards.
function dropIndexAt(column: HTMLElement, clientY: number): number {
  const cards = [...column.querySelectorAll<HTMLElement>("[data-grade-card]")];
  const i = cards.findIndex((card) => {
    const rect = card.getBoundingClientRect();
    return clientY < rect.top + rect.height / 2;
  });
  return i === -1 ? cards.length : i;
}

function DropLine() {
  return <div className="h-0.5 rounded bg-blue-500" />;
}

export function GradesBoard({ data, startEdit, remove }: GlossaryListContext) {
  const grades = data as unknown as Grade[];
  const { data: savedOrders } = useResource<GradeColumnOrder>("/grade-order");
  const { data: applications } = useResource<Application>("/applications");
  const [storedTab, setStoredTab] = useState(readStoredTab);
  const [view, setView] = useState<View>(() => (readStored(VIEW_STORAGE_KEY, "table") === "chart" ? "chart" : "table"));
  const [chartGroup, setChartGroup] = useState<Iso513Group>(() => {
    const g = readStored(CHART_GROUP_STORAGE_KEY, "P");
    return ISO513_GROUPS.some((x) => x.value === g) ? (g as Iso513Group) : "P";
  });
  // Fall back to "All" if the remembered application no longer exists.
  const scope = storedTab === ALL || applications.some((a) => a.id === storedTab) ? storedTab : ALL;
  // Orders changed in this session (by orderKey), applied optimistically before the save returns.
  const [localOrders, setLocalOrders] = useState<Record<string, string[] | undefined>>({});
  const [dragging, setDragging] = useState<Dragging | null>(null);
  const [error, setError] = useState<string | null>(null);
  const columnRefs = useRef<Partial<Record<Iso513Group, HTMLDivElement | null>>>({});

  const orderFor = (s: string, g: Iso513Group) =>
    localOrders[orderKey(s, g)] ?? savedOrders.find((o) => o.scope === s && o.iso513Group === g)?.gradeIds;
  const savedFor = (g: Iso513Group) => orderFor(scope, g) ?? (scope === ALL ? undefined : orderFor(ALL, g));

  const inScope = (s: string) => (s === ALL ? grades : grades.filter((g) => g.applications.some((a) => a.id === s)));
  const boardGrades = inScope(scope);
  const unassigned = boardGrades.filter((g) => g.iso513Groups.length === 0);

  // Cases (trials) per grade; the list has no images, just enough for counts.
  const { data: cases, reload: reloadCases } = useResource<GradeCase>("/grade-cases");
  const [casesFor, setCasesFor] = useState<{ grade: Grade; group: Iso513Group } | null>(null);
  // Grade whose full card is open (picked from the search box).
  const [cardFor, setCardFor] = useState<Grade | null>(null);
  const caseCount = (gradeId: string, group: Iso513Group) =>
    cases.filter((c) => c.gradeId === gradeId && caseMatches(c, scope, group)).length;

  function selectTab(s: string) {
    setStoredTab(s);
    setDragging(null);
    store(TAB_STORAGE_KEY, s);
  }

  function selectView(v: View) {
    setView(v);
    store(VIEW_STORAGE_KEY, v);
  }

  function selectChartGroup(g: Iso513Group) {
    setChartGroup(g);
    store(CHART_GROUP_STORAGE_KEY, g);
  }

  const scopeName = scope === ALL ? "All" : (applications.find((a) => a.id === scope)?.name ?? "All");

  function onPointerDown(e: PointerEvent<HTMLDivElement>, group: Iso513Group, id: string) {
    if (e.button !== 0 || (e.target as HTMLElement).closest("button")) return;
    e.currentTarget.setPointerCapture(e.pointerId);
    setDragging({ group, id, startY: e.clientY, active: false, index: null });
  }

  function onPointerMove(e: PointerEvent<HTMLDivElement>) {
    if (!dragging) return;
    const active = dragging.active || Math.abs(e.clientY - dragging.startY) > DRAG_THRESHOLD;
    if (!active) return;
    const column = columnRefs.current[dragging.group];
    const index = column ? dropIndexAt(column, e.clientY) : null;
    if (active !== dragging.active || index !== dragging.index) setDragging({ ...dragging, active, index });
  }

  async function onPointerUp(e: PointerEvent<HTMLDivElement>, column: Grade[]) {
    const drag = dragging;
    setDragging(null);
    // A press that never turned into a drag is a click: open the grade's cases.
    if (drag && !drag.active && !(e.target as HTMLElement).closest("button")) {
      const grade = column.find((g) => g.id === drag.id);
      // Only when there is something to show; new cases are added via the Cases button.
      if (grade && caseCount(grade.id, drag.group) > 0) setCasesFor({ grade, group: drag.group });
      return;
    }
    if (!drag?.active || drag.index === null) return;

    const ids = column.map((g) => g.id);
    const from = ids.indexOf(drag.id);
    let to = drag.index;
    if (from < to) to -= 1; // removing the card shifts later positions up
    if (from === -1 || from === to) return;
    ids.splice(from, 1);
    ids.splice(to, 0, drag.id);

    const key = orderKey(scope, drag.group);
    const previous = localOrders[key];
    setLocalOrders((o) => ({ ...o, [key]: ids }));
    setError(null);
    try {
      await api.put(`/grade-order/${scope}/${drag.group}`, { gradeIds: ids });
    } catch (err) {
      setLocalOrders((o) => ({ ...o, [key]: previous }));
      setError(err instanceof ApiError ? err.message : "Failed to save the new order");
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-end justify-between gap-2 border-b border-neutral-200 dark:border-neutral-800">
        <div role="tablist" className="flex flex-wrap gap-1">
          {[{ id: ALL, name: "All" }, ...[...applications].sort((a, b) => a.name.localeCompare(b.name))].map((tab) => (
            <button
              key={tab.id}
              type="button"
              role="tab"
              aria-selected={scope === tab.id}
              onClick={() => selectTab(tab.id)}
              className={`-mb-px border-b-2 px-3 py-1.5 text-sm ${
                scope === tab.id
                  ? "border-blue-500 font-medium text-blue-700 dark:text-blue-300"
                  : "border-transparent text-neutral-500 hover:text-neutral-800 dark:text-neutral-400 dark:hover:text-neutral-200"
              }`}
            >
              {tab.name}
              <span className="ml-1.5 text-xs opacity-60">{inScope(tab.id).length}</span>
            </button>
          ))}
        </div>
        <div className="flex items-end gap-2">
          <GradeSearch grades={grades} onPick={setCardFor} />
          <div className="mb-1.5 inline-flex rounded-lg border border-neutral-200 p-0.5 text-sm dark:border-neutral-700">
            {(["table", "chart"] as View[]).map((v) => (
              <button
                key={v}
                type="button"
                aria-pressed={view === v}
                onClick={() => selectView(v)}
                className={`rounded-md px-3 py-1 capitalize ${
                  view === v ? "bg-blue-600 text-white" : "text-neutral-600 hover:text-neutral-900 dark:text-neutral-300 dark:hover:text-white"
                }`}
              >
                {v}
              </button>
            ))}
          </div>
        </div>
      </div>
      {error && <p className="text-sm text-red-600 dark:text-red-400">{error}</p>}
      {view === "chart" ? (
        <div className="space-y-3">
          <div className="flex flex-wrap gap-2">
            {ISO513_GROUPS.map((g) => (
              <button
                key={g.value}
                type="button"
                aria-pressed={chartGroup === g.value}
                onClick={() => selectChartGroup(g.value)}
                className={`rounded-full border-2 px-2.5 py-1 text-xs ${
                  chartGroup === g.value ? "font-medium text-neutral-900" : "text-neutral-600 dark:text-neutral-300"
                }`}
                style={chartGroup === g.value ? { backgroundColor: g.color, borderColor: g.color } : { borderColor: g.color }}
              >
                {g.label}
                <span className="ml-1 opacity-60">{boardGrades.filter((x) => x.iso513Groups.includes(g.value)).length}</span>
              </button>
            ))}
          </div>
          <GradesChart
            key={`${scope}:${chartGroup}`}
            scope={scope}
            scopeName={scopeName}
            group={chartGroup}
            groupLabel={ISO513_GROUPS.find((g) => g.value === chartGroup)?.label ?? chartGroup}
            grades={orderColumn(chartGroup, boardGrades, savedFor(chartGroup))}
            caseCount={(gradeId) => caseCount(gradeId, chartGroup)}
            onOpenCases={(grade) => setCasesFor({ grade, group: chartGroup })}
          />
        </div>
      ) : (
        <div className="flex gap-3">
          {/* Hardness axis: the order within every column runs Harder -> Tougher. */}
          <div className="flex w-6 shrink-0 flex-col items-center pt-10 text-[11px] font-semibold text-neutral-500 dark:text-neutral-400">
            <span aria-hidden>▲</span>
            <span className="rotate-180 [writing-mode:vertical-rl]">Harder</span>
            <div className="my-2 w-1 flex-1 rounded-full bg-gradient-to-b from-neutral-700 to-neutral-300 dark:from-neutral-200 dark:to-neutral-700" />
            <span className="rotate-180 [writing-mode:vertical-rl]">Tougher</span>
            <span aria-hidden>▼</span>
          </div>

          <div className="flex-1 overflow-x-auto">
            <div className="grid min-w-[720px] grid-cols-6 gap-2">
              {ISO513_GROUPS.map(({ value: group, label }) => {
                const column = orderColumn(group, boardGrades, savedFor(group));
                const dropIndex = dragging?.active && dragging.group === group ? dragging.index : null;
                return (
                  <div key={group} className="flex flex-col" data-column={group}>
                    <div
                      className="mb-2 rounded-lg px-2 py-1.5 text-xs font-semibold text-neutral-900"
                      style={{ backgroundColor: ISO513_COLORS[group] }}
                      title={label}
                    >
                      {label}
                      <span className="float-right font-normal opacity-70">{column.length}</span>
                    </div>
                    <div
                      ref={(el) => {
                        columnRefs.current[group] = el;
                      }}
                      className="flex min-h-24 flex-1 flex-col gap-1.5 rounded-lg bg-neutral-100/70 p-1.5 dark:bg-neutral-900/50"
                    >
                      {column.length === 0 && (
                        <p className="py-4 text-center text-[11px] text-neutral-400 dark:text-neutral-500">No grades</p>
                      )}
                      {column.map((grade, index) => {
                        const isDragged = dragging?.active && dragging.group === group && dragging.id === grade.id;
                        return (
                          <div key={grade.id} className="flex flex-col gap-1.5">
                            {dropIndex === index && <DropLine />}
                            <div
                              data-grade-card
                              onPointerDown={(e) => onPointerDown(e, group, grade.id)}
                              onPointerMove={onPointerMove}
                              onPointerUp={(e) => onPointerUp(e, column)}
                              onPointerCancel={() => setDragging(null)}
                              className={`group cursor-grab rounded-lg border border-neutral-200 bg-white p-2 text-xs shadow-sm select-none active:cursor-grabbing dark:border-neutral-700 dark:bg-neutral-900 ${
                                isDragged ? "opacity-40" : ""
                              }`}
                            >
                              <div className="flex items-start justify-between gap-1">
                                <span className="font-semibold text-neutral-900 dark:text-neutral-100">
                                  <span className="mr-1 touch-none text-neutral-300 dark:text-neutral-600" aria-hidden>
                                    ⋮⋮
                                  </span>
                                  {grade.name}
                                  {caseCount(grade.id, group) > 0 && (
                                    <span
                                      className="ml-1.5 rounded-full bg-amber-100 px-1.5 py-0.5 text-[10px] font-medium text-amber-800 dark:bg-amber-900/40 dark:text-amber-300"
                                      title="Cases (click the card to open)"
                                    >
                                      📷 {caseCount(grade.id, group)}
                                    </span>
                                  )}
                                </span>
                                <span className="flex shrink-0 gap-1 opacity-0 transition-opacity group-hover:opacity-100 focus-within:opacity-100">
                                  <button
                                    type="button"
                                    onClick={() => setCasesFor({ grade, group })}
                                    className="text-amber-700 hover:underline dark:text-amber-400"
                                  >
                                    Cases
                                  </button>
                                  <button
                                    type="button"
                                    onClick={() => startEdit(grade as unknown as Entry)}
                                    className="text-blue-600 hover:underline dark:text-blue-400"
                                  >
                                    Edit
                                  </button>
                                  <button type="button" onClick={() => remove(grade.id)} className="text-red-600 hover:underline dark:text-red-400">
                                    Delete
                                  </button>
                                </span>
                              </div>
                              {grade.description && (
                                <div className="mt-0.5 line-clamp-2 text-neutral-600 dark:text-neutral-300" title={grade.description}>
                                  {grade.description}
                                </div>
                              )}
                              {grade.substrate && <div className="mt-0.5 text-neutral-500 dark:text-neutral-400">{grade.substrate.name}</div>}
                              {/* Other applications only: the current tab's application is implied. */}
                              {grade.applications.some((a) => a.id !== scope) && (
                                <div className="mt-1 flex flex-wrap gap-1">
                                  {grade.applications.filter((a) => a.id !== scope).map((a) => (
                                    <span
                                      key={a.id}
                                      className="rounded-full bg-neutral-100 px-1.5 py-0.5 text-[10px] text-neutral-600 dark:bg-neutral-800 dark:text-neutral-300"
                                    >
                                      {a.name}
                                    </span>
                                  ))}
                                </div>
                              )}
                            </div>
                          </div>
                        );
                      })}
                      {dropIndex === column.length && column.length > 0 && <DropLine />}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {cardFor && (
        <GradeCardModal
          grade={grades.find((g) => g.id === cardFor.id) ?? cardFor}
          onClose={() => setCardFor(null)}
          onEdit={() => {
            startEdit(cardFor as unknown as Entry);
            setCardFor(null);
          }}
        />
      )}

      {casesFor && (
        <GradeCasesModal
          grade={casesFor.grade}
          scope={scope === ALL ? ALL_SCOPE : scope}
          scopeName={scopeName}
          group={casesFor.group}
          onClose={() => setCasesFor(null)}
          onChanged={reloadCases}
        />
      )}

      {unassigned.length > 0 && (
        <Card className="p-3">
          <h3 className="mb-2 text-xs font-semibold text-neutral-700 dark:text-neutral-300">No material group yet — edit to assign one</h3>
          <div className="flex flex-wrap gap-2">
            {unassigned.map((g) => (
              <span key={g.id} className="flex items-center gap-1 rounded-lg border border-neutral-200 px-2 py-1 text-xs dark:border-neutral-700">
                <span className="font-medium">{g.name}</span>
                <Button variant="ghost" onClick={() => startEdit(g as unknown as Entry)}>
                  Edit
                </Button>
                <Button variant="ghost" onClick={() => remove(g.id)}>
                  Delete
                </Button>
              </span>
            ))}
          </div>
        </Card>
      )}
    </div>
  );
}

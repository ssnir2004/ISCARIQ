import { useRef, useState, type PointerEvent } from "react";
import { api, ApiError } from "../../lib/api";
import { ISO513_COLORS, ISO513_GROUPS } from "../../lib/npaKnowledgeConstants";
import { useResource } from "../../lib/useResource";
import type { Grade, GradeColumnOrder, Iso513Group } from "../../lib/types";
import { Button, Card } from "../../components/ui";
import type { Entry, GlossaryListContext } from "./GlossaryPage";

// Grades laid out in one column per ISO 513 group, each ranked by hand from
// Harder (top) to Tougher (bottom) by dragging. The order is saved per
// column, so a grade in several groups has its own position in each.
//
// Dragging uses pointer events rather than native HTML5 drag and drop, so it
// behaves the same with a mouse and on touch screens (via the ⋮⋮ handle).

type Dragging = { group: Iso513Group; id: string; startY: number; active: boolean; index: number | null };

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
  // Orders changed in this session, applied optimistically before the save returns.
  const [localOrders, setLocalOrders] = useState<Partial<Record<Iso513Group, string[]>>>({});
  const [dragging, setDragging] = useState<Dragging | null>(null);
  const [error, setError] = useState<string | null>(null);
  const columnRefs = useRef<Partial<Record<Iso513Group, HTMLDivElement | null>>>({});

  const savedFor = (g: Iso513Group) => localOrders[g] ?? savedOrders.find((o) => o.iso513Group === g)?.gradeIds;
  const unassigned = grades.filter((g) => g.iso513Groups.length === 0);

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

  async function onPointerUp(column: Grade[]) {
    const drag = dragging;
    setDragging(null);
    if (!drag?.active || drag.index === null) return;

    const ids = column.map((g) => g.id);
    const from = ids.indexOf(drag.id);
    let to = drag.index;
    if (from < to) to -= 1; // removing the card shifts later positions up
    if (from === -1 || from === to) return;
    ids.splice(from, 1);
    ids.splice(to, 0, drag.id);

    const group = drag.group;
    const previous = localOrders[group];
    setLocalOrders((o) => ({ ...o, [group]: ids }));
    setError(null);
    try {
      await api.put(`/grade-order/${group}`, { gradeIds: ids });
    } catch (err) {
      setLocalOrders((o) => ({ ...o, [group]: previous }));
      setError(err instanceof ApiError ? err.message : "Failed to save the new order");
    }
  }

  return (
    <div className="space-y-4">
      {error && <p className="text-sm text-red-600 dark:text-red-400">{error}</p>}
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
              const column = orderColumn(group, grades, savedFor(group));
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
                            onPointerUp={() => onPointerUp(column)}
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
                              </span>
                              <span className="flex shrink-0 gap-1 opacity-0 transition-opacity group-hover:opacity-100 focus-within:opacity-100">
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
                            {grade.substrate && <div className="mt-0.5 text-neutral-500 dark:text-neutral-400">{grade.substrate}</div>}
                            {grade.applications.length > 0 && (
                              <div className="mt-1 flex flex-wrap gap-1">
                                {grade.applications.map((a) => (
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

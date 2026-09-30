import { useRef, useState, type PointerEvent } from "react";
import { api, ApiError } from "../../lib/api";
import { ISO513_COLORS } from "../../lib/npaKnowledgeConstants";
import { useResource } from "../../lib/useResource";
import type { Grade, GradeChartBox, Iso513Group } from "../../lib/types";
import { Button } from "../../components/ui";

// Speed (y, up) / Tough (x, right) chart for one board scope and ISO 513
// group. Each grade is a box spanning its range: drag it to move, drag the
// corner handle to resize. Positions are percentages of the plot area, saved
// per scope + group + grade. Grades without a saved box are laid out on a
// diagonal from the board ranking (hardest top-left, toughest bottom-right).

type Box = { x: number; y: number; w: number; h: number };
type Drag = { gradeId: string; mode: "move" | "resize"; startX: number; startY: number; start: Box; box: Box };

const MIN_BOX = 4;

const clamp = (n: number, min: number, max: number) => Math.min(max, Math.max(min, n));
const round = (n: number) => Math.round(n * 10) / 10;

// Diagonal layout, sized so neighbouring boxes don't cover each other's
// resize handles (they only overlap once there are more than ~12 grades).
function defaultBox(index: number, count: number): Box {
  const size = round(clamp(100 / count - 1, 8, 22));
  const t = count > 1 ? index / (count - 1) : 0;
  return { x: round(t * (100 - size)), y: round(t * (100 - size)), w: size, h: size };
}

function Arrowhead({ direction }: { direction: "up" | "right" }) {
  return (
    <svg
      aria-hidden
      viewBox="0 0 12 12"
      className={`absolute h-3 w-3 fill-neutral-500 dark:fill-neutral-400 ${
        direction === "up" ? "-top-3 -left-[7px]" : "-right-3 -bottom-[7px]"
      }`}
    >
      <path d={direction === "up" ? "M6 0 L12 12 L0 12 Z" : "M12 6 L0 0 L0 12 Z"} />
    </svg>
  );
}

export function GradesChart({
  scope,
  scopeName,
  group,
  groupLabel,
  grades,
}: {
  scope: string;
  scopeName: string;
  group: Iso513Group;
  groupLabel: string;
  // Grades in this group, in board order (Harder first).
  grades: Grade[];
}) {
  const { data: savedBoxes, reload } = useResource<GradeChartBox>("/grade-chart");
  // Boxes changed in this session, by grade id, applied before the save returns.
  const [local, setLocal] = useState<Record<string, Box | null>>({});
  const [drag, setDrag] = useState<Drag | null>(null);
  // The last box touched stays on top, so its handle stays reachable when boxes overlap.
  const [topId, setTopId] = useState<string | null>(null);
  const dragRef = useRef<Drag | null>(null);
  const plotRef = useRef<HTMLDivElement>(null);
  const [error, setError] = useState<string | null>(null);

  const localKey = (gradeId: string) => `${scope}:${group}:${gradeId}`;
  function boxFor(grade: Grade, index: number): Box {
    if (drag?.gradeId === grade.id) return drag.box;
    const override = local[localKey(grade.id)];
    if (override) return override;
    if (override !== null) {
      const saved = savedBoxes.find((b) => b.scope === scope && b.iso513Group === group && b.gradeId === grade.id);
      if (saved) return saved;
    }
    return defaultBox(index, grades.length);
  }

  function onPointerDown(e: PointerEvent<HTMLDivElement>, grade: Grade, index: number, mode: Drag["mode"]) {
    if (e.button !== 0) return;
    e.stopPropagation();
    e.currentTarget.setPointerCapture(e.pointerId);
    const start = boxFor(grade, index);
    const next = { gradeId: grade.id, mode, startX: e.clientX, startY: e.clientY, start, box: start };
    dragRef.current = next;
    setDrag(next);
    setTopId(grade.id);
  }

  function onPointerMove(e: PointerEvent<HTMLDivElement>) {
    const d = dragRef.current;
    const plot = plotRef.current?.getBoundingClientRect();
    if (!d || !plot) return;
    const dx = ((e.clientX - d.startX) / plot.width) * 100;
    const dy = ((e.clientY - d.startY) / plot.height) * 100;
    const s = d.start;
    const box =
      d.mode === "move"
        ? { ...s, x: round(clamp(s.x + dx, 0, 100 - s.w)), y: round(clamp(s.y + dy, 0, 100 - s.h)) }
        : { ...s, w: round(clamp(s.w + dx, MIN_BOX, 100 - s.x)), h: round(clamp(s.h + dy, MIN_BOX, 100 - s.y)) };
    const next = { ...d, box };
    dragRef.current = next;
    setDrag(next);
  }

  async function onPointerUp() {
    const d = dragRef.current;
    dragRef.current = null;
    setDrag(null);
    if (!d) return;
    const { box, start } = d;
    if (box.x === start.x && box.y === start.y && box.w === start.w && box.h === start.h) return;
    const key = localKey(d.gradeId);
    const previous = local[key];
    setLocal((l) => ({ ...l, [key]: box }));
    setError(null);
    try {
      await api.put(`/grade-chart/${scope}/${group}/${d.gradeId}`, box);
    } catch (err) {
      setLocal((l) => ({ ...l, [key]: previous }));
      setError(err instanceof ApiError ? err.message : "Failed to save the box");
    }
  }

  async function resetLayout() {
    if (!confirm(`Reset the ${scopeName} ISO ${group} chart to the default layout (from the board ranking)?`)) return;
    setError(null);
    try {
      await api.delete(`/grade-chart/${scope}/${group}`);
      // null marks "no saved box" until the reload arrives.
      setLocal((l) => ({ ...l, ...Object.fromEntries(grades.map((g) => [localKey(g.id), null])) }));
      reload();
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Failed to reset the chart");
    }
  }

  const color = ISO513_COLORS[group];

  return (
    <div className="max-w-4xl">
      <div className="mb-2 flex items-center justify-between gap-3">
        <h3 className="text-base font-semibold text-neutral-900 dark:text-neutral-100">
          {scopeName} ISO {group}
          <span className="ml-2 text-xs font-normal text-neutral-500 dark:text-neutral-400">{groupLabel}</span>
        </h3>
        <Button variant="secondary" onClick={resetLayout} disabled={grades.length === 0}>
          Reset layout
        </Button>
      </div>
      {error && <p className="mb-2 text-sm text-red-600 dark:text-red-400">{error}</p>}

      <div className="flex gap-2">
        {/* Y axis label */}
        <div className="flex w-5 items-center justify-center">
          <span className="rotate-180 text-sm font-semibold text-neutral-700 [writing-mode:vertical-rl] dark:text-neutral-300">Speed</span>
        </div>
        <div className="flex-1">
          <div className="relative border-b-2 border-l-2 border-neutral-500 dark:border-neutral-400">
            <Arrowhead direction="up" />
            <Arrowhead direction="right" />
            <div
              ref={plotRef}
              className="relative m-3 aspect-[4/3] touch-none select-none"
              onPointerMove={onPointerMove}
              onPointerUp={onPointerUp}
              onPointerCancel={() => {
                dragRef.current = null;
                setDrag(null);
              }}
            >
              {grades.length === 0 && (
                <p className="absolute inset-0 flex items-center justify-center text-sm text-neutral-400 dark:text-neutral-500">
                  No grades for {scopeName} in ISO {group}
                </p>
              )}
              {grades.map((grade, index) => {
                const box = boxFor(grade, index);
                const active = drag?.gradeId === grade.id;
                const onTop = topId === grade.id;
                return (
                  <div
                    key={grade.id}
                    data-chart-box={grade.name}
                    onPointerDown={(e) => onPointerDown(e, grade, index, "move")}
                    className={`absolute flex cursor-move flex-col items-center justify-center overflow-hidden rounded-xl border-2 text-center text-neutral-900 shadow ${
                      active ? "z-30 shadow-lg" : onTop ? "z-20" : "z-10"
                    }`}
                    style={{
                      left: `${box.x}%`,
                      top: `${box.y}%`,
                      width: `${box.w}%`,
                      height: `${box.h}%`,
                      backgroundColor: `${color}cc`,
                      borderColor: color,
                    }}
                    title={`${grade.name} — drag to move, drag the corner to resize`}
                  >
                    <span className="text-sm font-bold leading-tight">{grade.name}</span>
                    {grade.substrate && <span className="text-[10px] leading-tight opacity-75">{grade.substrate.name}</span>}
                    <div
                      data-resize-handle
                      onPointerDown={(e) => onPointerDown(e, grade, index, "resize")}
                      className="absolute right-0 bottom-0 h-3.5 w-3.5 cursor-nwse-resize rounded-tl bg-neutral-900/40"
                      aria-label={`Resize ${grade.name}`}
                    />
                  </div>
                );
              })}
            </div>
          </div>
          {/* X axis label */}
          <div className="mt-1 text-center text-sm font-semibold text-neutral-700 dark:text-neutral-300">Tough</div>
        </div>
      </div>
    </div>
  );
}

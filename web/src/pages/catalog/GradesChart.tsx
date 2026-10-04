import { useRef, useState, type PointerEvent } from "react";
import { api, ApiError } from "../../lib/api";
import { ISO513_COLORS } from "../../lib/npaKnowledgeConstants";
import { useResource } from "../../lib/useResource";
import type { Grade, GradeChartBox, Iso513Group } from "../../lib/types";
import { Button } from "../../components/ui";

// Speed (y, up) / Tough (x, right) chart for one board scope and ISO 513
// group. Each block spans a range: drag it to move, drag the corner handle to
// resize. A block is one grade, or several grades merged into one box (they
// share a mergeId and a box). Positions are percentages of the plot area,
// saved per scope + group + grade. Grades without a saved box are laid out
// on a diagonal from the board ranking (hardest top-left, toughest
// bottom-right).

type Box = { x: number; y: number; w: number; h: number };
type Block = { key: string; mergeId: string | null; grades: Grade[]; index: number };
type Drag = { key: string; mode: "move" | "resize"; startX: number; startY: number; start: Box; box: Box; target: HTMLElement };

const MIN_BOX = 4;

const clamp = (n: number, min: number, max: number) => Math.min(max, Math.max(min, n));
const round = (n: number) => Math.round(n * 10) / 10;
const sameBox = (a: Box, b: Box) => a.x === b.x && a.y === b.y && a.w === b.w && a.h === b.h;

// Diagonal layout, sized so neighbouring boxes don't cover each other's
// resize handles (they only overlap once there are more than ~12 grades).
function defaultBox(index: number, count: number): Box {
  const size = round(clamp(100 / count - 1, 8, 22));
  const t = count > 1 ? index / (count - 1) : 0;
  return { x: round(t * (100 - size)), y: round(t * (100 - size)), w: size, h: size };
}

// Smallest box containing all the given boxes.
function boundingBox(boxes: Box[]): Box {
  const x = Math.min(...boxes.map((b) => b.x));
  const y = Math.min(...boxes.map((b) => b.y));
  const w = Math.max(...boxes.map((b) => b.x + b.w)) - x;
  const h = Math.max(...boxes.map((b) => b.y + b.h)) - y;
  return { x: round(x), y: round(y), w: round(w), h: round(h) };
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
  caseCount,
  onOpenCases,
}: {
  scope: string;
  scopeName: string;
  group: Iso513Group;
  groupLabel: string;
  // Grades in this group, in board order (Harder first).
  grades: Grade[];
  caseCount: (gradeId: string) => number;
  // Called when a grade is clicked without being moved or resized.
  onOpenCases: (grade: Grade) => void;
}) {
  const { data: savedBoxes, reload } = useResource<GradeChartBox>("/grade-chart");
  // Blocks moved in this session, by block key, applied before the save
  // returns; null means "no saved box" (after a reset).
  const [local, setLocal] = useState<Record<string, Box | null>>({});
  const [drag, setDrag] = useState<Drag | null>(null);
  // The last block touched stays on top, so its handle stays reachable when blocks overlap.
  const [topKey, setTopKey] = useState<string | null>(null);
  const dragRef = useRef<Drag | null>(null);
  const plotRef = useRef<HTMLDivElement>(null);
  const [error, setError] = useState<string | null>(null);
  // Merge mode: clicks select blocks instead of dragging them.
  const [merging, setMerging] = useState(false);
  const [selected, setSelected] = useState<string[]>([]);

  const savedFor = (gradeId: string) => savedBoxes.find((b) => b.scope === scope && b.iso513Group === group && b.gradeId === gradeId);

  // Group grades into blocks: merged grades share their mergeId's block.
  const blocks: Block[] = [];
  grades.forEach((grade, index) => {
    const mergeId = savedFor(grade.id)?.mergeId ?? null;
    const existing = mergeId ? blocks.find((b) => b.mergeId === mergeId) : undefined;
    if (existing) existing.grades.push(grade);
    else blocks.push({ key: mergeId ? `m:${mergeId}` : `g:${grade.id}`, mergeId, grades: [grade], index });
  });

  function boxOf(block: Block): Box {
    if (drag?.key === block.key) return drag.box;
    const override = local[block.key];
    if (override) return override;
    if (override !== null) {
      const saved = savedFor(block.grades[0].id);
      if (saved) return saved;
    }
    return defaultBox(block.index, grades.length);
  }

  function onPointerDown(e: PointerEvent<HTMLDivElement>, block: Block, mode: Drag["mode"]) {
    if (e.button !== 0 || (e.target as HTMLElement).closest("button")) return;
    e.stopPropagation();
    if (merging) {
      setSelected((s) => (s.includes(block.key) ? s.filter((k) => k !== block.key) : [...s, block.key]));
      return;
    }
    e.currentTarget.setPointerCapture(e.pointerId);
    const start = boxOf(block);
    const next = { key: block.key, mode, startX: e.clientX, startY: e.clientY, start, box: start, target: e.target as HTMLElement };
    dragRef.current = next;
    setDrag(next);
    setTopKey(block.key);
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
    const block = blocks.find((b) => b.key === d.key);
    if (!block) return;
    if (sameBox(d.box, d.start)) {
      // A click: open the cases of the grade clicked (or the block's only grade).
      const clickedId = d.target.closest<HTMLElement>("[data-grade-id]")?.dataset.gradeId;
      const grade = block.grades.find((g) => g.id === clickedId) ?? (block.grades.length === 1 ? block.grades[0] : undefined);
      if (grade && caseCount(grade.id) > 0) onOpenCases(grade);
      return;
    }
    const previous = local[block.key];
    setLocal((l) => ({ ...l, [block.key]: d.box }));
    setError(null);
    try {
      if (block.mergeId) await api.put(`/grade-chart/${scope}/${group}/block/${block.mergeId}`, d.box);
      else await api.put(`/grade-chart/${scope}/${group}/${block.grades[0].id}`, d.box);
    } catch (err) {
      setLocal((l) => ({ ...l, [block.key]: previous }));
      setError(err instanceof ApiError ? err.message : "Failed to save the box");
    }
  }

  async function mergeSelected() {
    const chosen = blocks.filter((b) => selected.includes(b.key));
    const gradeIds = chosen.flatMap((b) => b.grades.map((g) => g.id));
    if (gradeIds.length < 2) return;
    setError(null);
    try {
      // The merged block covers all the boxes it replaces.
      await api.put(`/grade-chart/${scope}/${group}/merge`, { gradeIds, box: boundingBox(chosen.map(boxOf)) });
      await reload();
      setLocal({});
      setSelected([]);
      setMerging(false);
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Failed to merge the blocks");
    }
  }

  async function split(block: Block) {
    if (!block.mergeId) return;
    setError(null);
    try {
      // The first grade keeps the block's box; the others return to the default layout.
      await api.delete(`/grade-chart/${scope}/${group}/block/${block.mergeId}?keep=${encodeURIComponent(block.grades[0].id)}`);
      await reload();
      setLocal({});
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Failed to split the block");
    }
  }

  async function resetLayout() {
    if (!confirm(`Reset the ${scopeName} ISO ${group} chart to the default layout (from the board ranking)? Merged blocks are split.`)) return;
    setError(null);
    try {
      await api.delete(`/grade-chart/${scope}/${group}`);
      await reload();
      setLocal({});
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Failed to reset the chart");
    }
  }

  const color = ISO513_COLORS[group];
  const selectedGradeCount = blocks.filter((b) => selected.includes(b.key)).reduce((n, b) => n + b.grades.length, 0);

  return (
    <div className="max-w-4xl">
      <div className="mb-2 flex flex-wrap items-center justify-between gap-3">
        <h3 className="text-base font-semibold text-neutral-900 dark:text-neutral-100">
          {scopeName} ISO {group}
          <span className="ml-2 text-xs font-normal text-neutral-500 dark:text-neutral-400">{groupLabel}</span>
        </h3>
        <div className="flex flex-wrap items-center gap-2">
          {merging ? (
            <>
              <span className="text-xs text-neutral-500 dark:text-neutral-400">Click the blocks to merge</span>
              <Button onClick={mergeSelected} disabled={selectedGradeCount < 2}>
                Merge ({selectedGradeCount})
              </Button>
              <Button
                variant="secondary"
                onClick={() => {
                  setMerging(false);
                  setSelected([]);
                }}
              >
                Cancel
              </Button>
            </>
          ) : (
            <>
              <Button variant="secondary" onClick={() => setMerging(true)} disabled={blocks.length < 2}>
                Merge blocks
              </Button>
              <Button variant="secondary" onClick={resetLayout} disabled={grades.length === 0}>
                Reset layout
              </Button>
            </>
          )}
        </div>
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
              {blocks.map((block) => {
                const box = boxOf(block);
                const active = drag?.key === block.key;
                const onTop = topKey === block.key;
                const isSelected = selected.includes(block.key);
                const single = block.grades.length === 1 ? block.grades[0] : null;
                return (
                  <div
                    key={block.key}
                    data-chart-box={block.grades.map((g) => g.name).join("+")}
                    onPointerDown={(e) => onPointerDown(e, block, "move")}
                    className={`group absolute flex flex-col items-center justify-center overflow-hidden rounded-xl border-2 text-center text-neutral-900 shadow ${
                      merging ? "cursor-pointer" : "cursor-move"
                    } ${active ? "z-30 shadow-lg" : onTop ? "z-20" : "z-10"} ${isSelected ? "ring-4 ring-blue-500" : ""}`}
                    style={{
                      left: `${box.x}%`,
                      top: `${box.y}%`,
                      width: `${box.w}%`,
                      height: `${box.h}%`,
                      backgroundColor: `${color}cc`,
                      borderColor: color,
                    }}
                    title={
                      merging
                        ? "Click to select for merging"
                        : `${block.grades.map((g) => g.name).join(", ")} — click a name for its cases, drag to move, drag the corner to resize`
                    }
                  >
                    {block.grades.map((g) => (
                      <span key={g.id} data-grade-id={g.id} className={`font-bold leading-tight ${block.grades.length > 3 ? "text-xs" : "text-sm"}`}>
                        {g.name}
                        {caseCount(g.id) > 0 && <span className="ml-1 text-[10px] font-medium">📷{caseCount(g.id)}</span>}
                      </span>
                    ))}
                    {single?.substrate && <span className="text-[10px] leading-tight opacity-75">{single.substrate.name}</span>}
                    {block.mergeId && !merging && (
                      <button
                        type="button"
                        onClick={() => split(block)}
                        className="absolute top-0.5 right-0.5 rounded bg-neutral-900/50 px-1 text-[10px] text-white opacity-0 transition-opacity group-hover:opacity-100 focus:opacity-100"
                        title="Split this block back into separate grades"
                      >
                        Split
                      </button>
                    )}
                    {!merging && (
                      <div
                        data-resize-handle
                        onPointerDown={(e) => onPointerDown(e, block, "resize")}
                        className="absolute right-0 bottom-0 h-3.5 w-3.5 cursor-nwse-resize rounded-tl bg-neutral-900/40"
                        aria-label={`Resize ${block.grades.map((g) => g.name).join(", ")}`}
                      />
                    )}
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

import { useEffect, useRef, useState, type PointerEvent } from "react";
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
// One drag can move several selected blocks together (resizing is always one block).
type DragItem = { key: string; start: Box; box: Box };
type Drag = { items: DragItem[]; mode: "move" | "resize"; startX: number; startY: number; target: HTMLElement };
// Selection rectangle drawn by dragging on empty chart space (plot percentages).
type Marquee = { x0: number; y0: number; x1: number; y1: number; additive: boolean };

const overlaps = (a: Box, b: Box) => a.x < b.x + b.w && b.x < a.x + a.w && a.y < b.y + b.h && b.y < a.y + a.h;

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

// Largest uncovered part of `box` once `covers` (blocks drawn above it) are
// laid over it, as a rectangle in percentages of the box itself, so a
// block's label can sit where it's actually visible. Works on a grid: marks
// covered cells, then finds the largest all-visible rectangle of cells.
// A fully covered block gets its whole area (label stays centred).
const LABEL_GRID = 24;
function visibleArea(box: Box, covers: Box[]): Box {
  const whole = { x: 0, y: 0, w: 100, h: 100 };
  const hits = covers.filter((c) => overlaps(box, c));
  if (hits.length === 0) return whole;
  const n = LABEL_GRID;
  const free: boolean[][] = Array.from({ length: n }, (_, r) =>
    Array.from({ length: n }, (_, c) => {
      const px = box.x + ((c + 0.5) / n) * box.w;
      const py = box.y + ((r + 0.5) / n) * box.h;
      return !hits.some((h) => px >= h.x && px <= h.x + h.w && py >= h.y && py <= h.y + h.h);
    })
  );
  // Maximal rectangle of free cells (histogram method, row by row).
  const heights = new Array(n).fill(0);
  let best = { area: 0, r: 0, c: 0, w: 0, h: 0 };
  for (let r = 0; r < n; r++) {
    for (let c = 0; c < n; c++) heights[c] = free[r][c] ? heights[c] + 1 : 0;
    for (let c = 0; c < n; c++) {
      let minH = Infinity;
      for (let c2 = c; c2 < n && heights[c2] > 0; c2++) {
        minH = Math.min(minH, heights[c2]);
        // Weight by real proportions so wide/tall blocks compare fairly.
        const area = (c2 - c + 1) * box.w * minH * box.h;
        if (area > best.area) best = { area, r: r - minH + 1, c, w: c2 - c + 1, h: minH };
      }
    }
  }
  if (best.area === 0) return whole;
  return { x: (best.c / n) * 100, y: (best.r / n) * 100, w: (best.w / n) * 100, h: (best.h / n) * 100 };
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
  variant,
}: {
  scope: string;
  scopeName: string;
  // Shown after the title when a board has several charts (e.g. "Coated").
  variant?: string;
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
  // Stacking changes made in this session (block key -> z), before the reload.
  const [localZ, setLocalZ] = useState<Record<string, number>>({});
  const dragRef = useRef<Drag | null>(null);
  const plotRef = useRef<HTMLDivElement>(null);
  const [error, setError] = useState<string | null>(null);
  // Merge mode: clicks select blocks instead of dragging them.
  const [merging, setMerging] = useState(false);
  // Selected block keys: from merge mode, Ctrl/Shift+click, or a selection
  // rectangle. Dragging a selected block moves the whole selection.
  const [selected, setSelected] = useState<string[]>([]);
  const [marquee, setMarquee] = useState<Marquee | null>(null);
  const marqueeRef = useRef<Marquee | null>(null);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setSelected([]);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

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
    const dragged = drag?.items.find((i) => i.key === block.key);
    if (dragged) return dragged.box;
    const override = local[block.key];
    if (override) return override;
    if (override !== null) {
      const saved = savedFor(block.grades[0].id);
      if (saved) return saved;
    }
    return defaultBox(block.index, grades.length);
  }

  // Pointer position as plot percentages.
  function plotPoint(e: PointerEvent<HTMLDivElement>) {
    const r = plotRef.current!.getBoundingClientRect();
    return { x: clamp(((e.clientX - r.left) / r.width) * 100, 0, 100), y: clamp(((e.clientY - r.top) / r.height) * 100, 0, 100) };
  }

  function onPointerDown(e: PointerEvent<HTMLDivElement>, block: Block, mode: Drag["mode"]) {
    if (e.button !== 0 || (e.target as HTMLElement).closest("button")) return;
    e.stopPropagation();
    // Merge mode, or Ctrl/Shift+click: toggle the block in the selection.
    if (mode === "move" && (merging || e.ctrlKey || e.metaKey || e.shiftKey)) {
      setSelected((s) => (s.includes(block.key) ? s.filter((k) => k !== block.key) : [...s, block.key]));
      return;
    }
    e.currentTarget.setPointerCapture(e.pointerId);
    // Dragging a selected block moves the whole selection; any other block
    // moves alone and clears the selection.
    const inSelection = mode === "move" && selected.includes(block.key) && selected.length > 1;
    if (!selected.includes(block.key)) setSelected([]);
    const moving = inSelection ? blocks.filter((b) => selected.includes(b.key)) : [block];
    const next: Drag = {
      items: moving.map((b) => ({ key: b.key, start: boxOf(b), box: boxOf(b) })),
      mode,
      startX: e.clientX,
      startY: e.clientY,
      target: e.target as HTMLElement,
    };
    dragRef.current = next;
    setDrag(next);
  }

  // Pressing on empty chart space starts a selection rectangle.
  function onPlotPointerDown(e: PointerEvent<HTMLDivElement>) {
    if (e.button !== 0 || e.target !== e.currentTarget) return;
    e.currentTarget.setPointerCapture(e.pointerId);
    const { x, y } = plotPoint(e);
    const next = { x0: x, y0: y, x1: x, y1: y, additive: merging || e.ctrlKey || e.metaKey || e.shiftKey };
    marqueeRef.current = next;
    setMarquee(next);
  }

  function onPointerMove(e: PointerEvent<HTMLDivElement>) {
    if (marqueeRef.current) {
      const { x, y } = plotPoint(e);
      const next = { ...marqueeRef.current, x1: x, y1: y };
      marqueeRef.current = next;
      setMarquee(next);
      return;
    }
    const d = dragRef.current;
    const plot = plotRef.current?.getBoundingClientRect();
    if (!d || !plot) return;
    let dx = ((e.clientX - d.startX) / plot.width) * 100;
    let dy = ((e.clientY - d.startY) / plot.height) * 100;
    let items: DragItem[];
    if (d.mode === "move") {
      // Shift every block by the same amount, limited so none leaves the chart.
      dx = clamp(dx, Math.max(...d.items.map((i) => -i.start.x)), Math.min(...d.items.map((i) => 100 - i.start.x - i.start.w)));
      dy = clamp(dy, Math.max(...d.items.map((i) => -i.start.y)), Math.min(...d.items.map((i) => 100 - i.start.y - i.start.h)));
      items = d.items.map((i) => ({ ...i, box: { ...i.start, x: round(i.start.x + dx), y: round(i.start.y + dy) } }));
    } else {
      items = d.items.map((i) => ({
        ...i,
        box: { ...i.start, w: round(clamp(i.start.w + dx, MIN_BOX, 100 - i.start.x)), h: round(clamp(i.start.h + dy, MIN_BOX, 100 - i.start.y)) },
      }));
    }
    const next = { ...d, items };
    dragRef.current = next;
    setDrag(next);
  }

  async function onPointerUp() {
    const m = marqueeRef.current;
    if (m) {
      marqueeRef.current = null;
      setMarquee(null);
      const rect = { x: Math.min(m.x0, m.x1), y: Math.min(m.y0, m.y1), w: Math.abs(m.x1 - m.x0), h: Math.abs(m.y1 - m.y0) };
      if (rect.w < 0.5 && rect.h < 0.5) {
        // A plain click on empty space clears the selection.
        if (!m.additive) setSelected([]);
        return;
      }
      const hits = blocks.filter((b) => overlaps(boxOf(b), rect)).map((b) => b.key);
      setSelected((s) => (m.additive ? [...new Set([...s, ...hits])] : hits));
      return;
    }

    const d = dragRef.current;
    dragRef.current = null;
    setDrag(null);
    if (!d) return;
    const moved = d.items.filter((i) => !sameBox(i.box, i.start));
    if (moved.length === 0) {
      if (d.items.length !== 1) return;
      // A click: open the cases of the grade clicked (or the block's only grade).
      const block = blocks.find((b) => b.key === d.items[0].key);
      const clickedId = d.target.closest<HTMLElement>("[data-grade-id]")?.dataset.gradeId;
      const grade = block?.grades.find((g) => g.id === clickedId) ?? (block?.grades.length === 1 ? block.grades[0] : undefined);
      if (grade && caseCount(grade.id) > 0) onOpenCases(grade);
      return;
    }
    const previous = Object.fromEntries(moved.map((i) => [i.key, local[i.key]]));
    setLocal((l) => ({ ...l, ...Object.fromEntries(moved.map((i) => [i.key, i.box])) }));
    setError(null);
    try {
      await Promise.all(
        moved.map((i) => {
          const block = blocks.find((b) => b.key === i.key)!;
          return block.mergeId
            ? api.put(`/grade-chart/${scope}/${group}/block/${block.mergeId}`, i.box)
            : api.put(`/grade-chart/${scope}/${group}/${block.grades[0].id}`, i.box);
        })
      );
    } catch (err) {
      setLocal((l) => ({ ...l, ...previous }));
      setError(err instanceof ApiError ? err.message : "Failed to save the boxes");
    }
  }

  // Saved stacking order of a block (higher = in front); default 0.
  const zOf = (block: Block) => localZ[block.key] ?? savedFor(block.grades[0].id)?.z ?? 0;
  // Draw order: by z, then board order. Index in this list = layer.
  const stack = [...blocks].sort((a, b) => zOf(a) - zOf(b) || a.index - b.index);

  // Brings blocks to the front (or sends them to the back) of the stack,
  // keeping their order among themselves, and saves each block's new z.
  async function restack(keys: string[], where: "front" | "back") {
    const moving = stack.filter((b) => keys.includes(b.key));
    if (moving.length === 0) return;
    const others = stack.filter((b) => !keys.includes(b.key)).map(zOf);
    const base = where === "front" ? (others.length ? Math.max(...others) : 0) + 1 : (others.length ? Math.min(...others) : 0) - moving.length;
    const updates = moving.map((b, i) => ({ block: b, z: base + i }));
    setLocalZ((m) => ({ ...m, ...Object.fromEntries(updates.map((u) => [u.block.key, u.z])) }));
    setError(null);
    try {
      await Promise.all(
        updates.map(({ block, z }) => {
          const { x, y, w, h } = boxOf(block);
          const body = { x, y, w, h, z };
          return block.mergeId
            ? api.put(`/grade-chart/${scope}/${group}/block/${block.mergeId}`, body)
            : api.put(`/grade-chart/${scope}/${group}/${block.grades[0].id}`, body);
        })
      );
    } catch (err) {
      setLocalZ((m) => Object.fromEntries(Object.entries(m).filter(([k]) => !keys.includes(k))));
      setError(err instanceof ApiError ? err.message : "Failed to change the stacking order");
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
          {variant && <span className="ml-1.5 rounded bg-neutral-200 px-1.5 py-0.5 text-xs font-medium dark:bg-neutral-800">{variant}</span>}
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
              {selected.length > 0 ? (
                <>
                  <span className="text-xs text-neutral-500 dark:text-neutral-400">
                    {selected.length} selected{selected.length > 1 ? " — drag one to move them all" : ""}
                  </span>
                  <Button variant="secondary" onClick={() => restack(selected, "front")}>
                    Bring to front
                  </Button>
                  <Button variant="secondary" onClick={() => restack(selected, "back")}>
                    Send to back
                  </Button>
                  {selected.length > 1 && (
                    <Button onClick={mergeSelected} disabled={selectedGradeCount < 2}>
                      Merge selected ({selectedGradeCount})
                    </Button>
                  )}
                  <Button variant="secondary" onClick={() => setSelected([])}>
                    Clear selection
                  </Button>
                </>
              ) : (
                <span className="text-xs text-neutral-400 dark:text-neutral-500">Drag on empty space to select several blocks</span>
              )}
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
              onPointerDown={onPlotPointerDown}
              onPointerMove={onPointerMove}
              onPointerUp={onPointerUp}
              onPointerCancel={() => {
                dragRef.current = null;
                setDrag(null);
                marqueeRef.current = null;
                setMarquee(null);
              }}
            >
              {marquee && (
                <div
                  aria-hidden
                  data-marquee
                  className="pointer-events-none absolute z-40 rounded border-2 border-dashed border-blue-500 bg-blue-500/10"
                  style={{
                    left: `${Math.min(marquee.x0, marquee.x1)}%`,
                    top: `${Math.min(marquee.y0, marquee.y1)}%`,
                    width: `${Math.abs(marquee.x1 - marquee.x0)}%`,
                    height: `${Math.abs(marquee.y1 - marquee.y0)}%`,
                  }}
                />
              )}
              {grades.length === 0 && (
                <p className="absolute inset-0 flex items-center justify-center text-sm text-neutral-400 dark:text-neutral-500">
                  No grades for {scopeName} in ISO {group}
                </p>
              )}
              {blocks.map((block) => {
                const box = boxOf(block);
                const active = !!drag?.items.some((i) => i.key === block.key);
                const layer = stack.indexOf(block);
                const isSelected = selected.includes(block.key);
                const single = block.grades.length === 1 ? block.grades[0] : null;
                // Blocks drawn above this one: higher layers, plus any block being
                // dragged (always on top) unless it's this one.
                const above = active
                  ? []
                  : blocks.filter((b) => b !== block && (stack.indexOf(b) > layer || drag?.items.some((i) => i.key === b.key))).map(boxOf);
                const label = visibleArea(box, above);
                return (
                  <div
                    key={block.key}
                    data-chart-box={block.grades.map((g) => g.name).join("+")}
                    onPointerDown={(e) => onPointerDown(e, block, "move")}
                    className={`group absolute flex flex-col items-center justify-center overflow-hidden rounded-xl border-2 text-center text-neutral-900 shadow ${
                      merging ? "cursor-pointer" : "cursor-move"
                    } ${active ? "shadow-lg" : ""} ${isSelected ? "ring-4 ring-blue-500" : ""}`}
                    style={{
                      // Saved stacking order; the block being dragged is drawn above all.
                      zIndex: active ? 1000 : 10 + layer,
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
                    {/* Label centred in the largest part of the block not hidden by blocks above it. */}
                    <div
                      data-block-label
                      className="absolute flex flex-col items-center justify-center overflow-hidden"
                      style={{ left: `${label.x}%`, top: `${label.y}%`, width: `${label.w}%`, height: `${label.h}%` }}
                    >
                      {block.grades.map((g) => (
                        <span key={g.id} data-grade-id={g.id} className={`font-bold leading-tight ${block.grades.length > 3 ? "text-xs" : "text-sm"}`}>
                          {g.name}
                          {caseCount(g.id) > 0 && <span className="ml-1 text-[10px] font-medium">📷{caseCount(g.id)}</span>}
                        </span>
                      ))}
                      {single?.substrate && <span className="text-[10px] leading-tight opacity-75">{single.substrate.name}</span>}
                    </div>
                    {!merging && blocks.length > 1 && (
                      <span className="absolute top-0.5 left-0.5 flex gap-0.5 opacity-0 transition-opacity group-hover:opacity-100 focus-within:opacity-100">
                        <button
                          type="button"
                          onClick={() => restack([block.key], "front")}
                          className="rounded bg-neutral-900/50 px-1 text-[10px] text-white"
                          title="Bring to front"
                        >
                          Front
                        </button>
                        <button
                          type="button"
                          onClick={() => restack([block.key], "back")}
                          className="rounded bg-neutral-900/50 px-1 text-[10px] text-white"
                          title="Send to back"
                        >
                          Back
                        </button>
                      </span>
                    )}
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

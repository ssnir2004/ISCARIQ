import { useEffect, useState, type DragEvent } from "react";
import { ISO513_COLORS, MATERIAL_GROUPS } from "../../lib/npaKnowledgeConstants";
import type { Grade, Iso513Group } from "../../lib/types";
import { api, ApiError } from "../../lib/api";
import { Button } from "../../components/ui";

// Map of a board's grades: a box per grade type (e.g. ceramic ALUMINA) and
// material, in the material's ISO color, listing the type's grades for that
// material in the board's Harder -> Tougher order. A type whose grades are
// the same for two materials gets one box split diagonally between them.
// The boxes' order can be changed ("Edit order": drag, or ◀ ▶) and is saved
// per board (an app setting).

// Material names as used on the map.
const MAP_LABELS: Record<Iso513Group, string> = {
  P: "Steel",
  M: "Stainless steel",
  K: "Cast Iron",
  N: "Non-ferrous",
  S: "High temp. alloys",
  H: "Hardened steel",
  SM: "Sintered materials",
};

const OTHER = "Other";

// Readable text on a material color: dark on light colors, else white.
function isLight(hex: string) {
  const n = parseInt(hex.slice(1), 16);
  const [r, g, b] = [(n >> 16) & 255, (n >> 8) & 255, n & 255];
  return (0.299 * r + 0.587 * g + 0.114 * b) / 255 > 0.7;
}

// Round ISO badge, as on the catalog material icons.
function MaterialBadge({ group }: { group: Iso513Group }) {
  const color = ISO513_COLORS[group];
  const name = MATERIAL_GROUPS.find((g) => g.value === group)?.label.split("— ")[1] ?? "";
  return (
    <div
      aria-hidden
      className="flex h-16 w-16 shrink-0 flex-col items-center justify-center rounded-full border-[3px] border-white/80 text-center shadow-md"
      style={{ backgroundColor: color, color: isLight(color) ? "#171717" : "#fff" }}
    >
      <span className="text-2xl leading-none font-extrabold">{group}</span>
      <span className="mt-0.5 px-1 text-[7px] leading-tight font-semibold">{name}</span>
    </div>
  );
}

function GradeList({ grades, light, onPick }: { grades: Grade[]; light: boolean; onPick: (g: Grade) => void }) {
  return (
    <ul className="space-y-0.5">
      {grades.map((g) => (
        <li key={g.id}>
          <button
            type="button"
            onClick={() => onPick(g)}
            className={`text-lg leading-tight font-extrabold hover:underline ${light ? "text-neutral-900" : "text-white [text-shadow:0_1px_2px_rgb(0_0_0/0.35)]"}`}
          >
            {g.name}
          </button>
        </li>
      ))}
    </ul>
  );
}

type Cell = { type: string; groups: Iso513Group[]; grades: Grade[][] };
const cellKey = (c: Pick<Cell, "type" | "groups">) => `${c.type}:${c.groups.join("+")}`;
// App setting key for a board's map order (e.g. "CERAMIC:app-x" -> "gradesmap.ceramic.app-x").
const orderKey = (scope: string) => `gradesmap.${scope.toLowerCase().replace(/[^a-z0-9._-]/g, ".")}`.slice(0, 50);

export function GradesMap({
  scope,
  groups,
  columnFor,
  onPick,
}: {
  // The board (stored scope), whose map order is saved.
  scope: string;
  // Materials shown (those with grades on this board), in display order.
  groups: Iso513Group[];
  // A material's grades on this board, Harder -> Tougher.
  columnFor: (group: Iso513Group) => Grade[];
  onPick: (grade: Grade) => void;
}) {
  const columns = groups.map((g) => ({ group: g, grades: columnFor(g) }));
  const typeOf = (g: Grade) => g.type?.name ?? OTHER;
  const types = [...new Set(columns.flatMap((c) => c.grades.map(typeOf)))].sort((a, b) =>
    a === OTHER ? 1 : b === OTHER ? -1 : a.localeCompare(b)
  );

  const cells: Cell[] = types.flatMap((type) => {
    const parts = columns.map((c) => ({ group: c.group, grades: c.grades.filter((g) => typeOf(g) === type) })).filter((p) => p.grades.length > 0);
    // Same grades for exactly two materials: one box, split diagonally.
    const ids = (list: Grade[]) => list.map((g) => g.id).sort().join(",");
    if (parts.length === 2 && ids(parts[0].grades) === ids(parts[1].grades)) {
      return [{ type, groups: [parts[0].group, parts[1].group], grades: [parts[0].grades, parts[1].grades] }];
    }
    return parts.map((p) => ({ type, groups: [p.group], grades: [p.grades] }));
  });

  // Saved order (box keys); boxes not in it follow in the default order.
  const [order, setOrder] = useState<string[]>([]);
  const [editing, setEditing] = useState(false);
  const [dragKey, setDragKey] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  useEffect(() => {
    api
      .get<{ value: string | null }>(`/settings/${orderKey(scope)}`)
      .then((r) => setOrder(r.value ? (JSON.parse(r.value) as string[]) : []))
      .catch(() => setOrder([]));
  }, [scope]);
  const rank = (c: Cell) => {
    const i = order.indexOf(cellKey(c));
    return i < 0 ? order.length + cells.indexOf(c) : i;
  };
  const sorted = [...cells].sort((a, b) => rank(a) - rank(b));
  const keys = sorted.map(cellKey);

  async function save(next: string[]) {
    setOrder(next);
    setError(null);
    try {
      await api.put(`/settings/${orderKey(scope)}`, { value: next.length ? JSON.stringify(next) : null });
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Failed to save the order");
    }
  }
  // Puts a box at a place in the order (another box's place, or one step).
  function moveTo(key: string, target: number) {
    const next = keys.filter((k) => k !== key);
    next.splice(Math.max(0, Math.min(target, next.length)), 0, key);
    save(next);
  }
  function dropOn(e: DragEvent, targetKey: string) {
    e.preventDefault();
    if (dragKey && dragKey !== targetKey) moveTo(dragKey, keys.indexOf(targetKey));
    setDragKey(null);
  }

  if (cells.length === 0) return null;

  return (
    <div className="space-y-2">
      <div className="flex flex-wrap items-center justify-between gap-2">
        {!columns.some((c) => c.grades.some((g) => g.type)) ? (
          <p className="text-sm text-neutral-500 dark:text-neutral-400">Set each grade's Type in its form to group the map by type.</p>
        ) : (
          <span className="text-xs text-neutral-500 dark:text-neutral-400">{editing ? "Drag a box onto another to move it there, or use ◀ ▶" : ""}</span>
        )}
        <div className="flex gap-2">
          {editing && order.length > 0 && (
            <Button variant="secondary" onClick={() => save([])}>
              Reset order
            </Button>
          )}
          <Button variant={editing ? "primary" : "secondary"} onClick={() => setEditing((v) => !v)} data-map-edit>
            {editing ? "✓ Done" : "✏ Edit order"}
          </Button>
        </div>
      </div>
      {error && <p className="text-sm text-red-600 dark:text-red-400">{error}</p>}
      <div className="grid grid-cols-[repeat(auto-fill,minmax(250px,1fr))] gap-1" data-grades-map>
        {sorted.map((cell, index) => {
          const key = cellKey(cell);
          // Edit mode: the box can be dragged, and stepped with ◀ ▶.
          const editProps = editing
            ? {
                draggable: true,
                onDragStart: () => setDragKey(key),
                onDragEnd: () => setDragKey(null),
                onDragOver: (e: DragEvent) => e.preventDefault(),
                onDrop: (e: DragEvent) => dropOn(e, key),
              }
            : {};
          const editClass = editing ? `cursor-move outline-2 outline-white/70 outline-dashed ${dragKey === key ? "opacity-50" : ""}` : "";
          const arrows = editing && (
            <span className="absolute top-1 right-1 z-10 flex gap-0.5" data-map-arrows>
              <button type="button" disabled={index === 0} onClick={() => moveTo(key, index - 1)} className="rounded bg-neutral-900/60 px-1.5 text-xs text-white disabled:opacity-30" aria-label="Move earlier">
                ◀
              </button>
              <button
                type="button"
                disabled={index === sorted.length - 1}
                onClick={() => moveTo(key, index + 1)}
                className="rounded bg-neutral-900/60 px-1.5 text-xs text-white disabled:opacity-30"
                aria-label="Move later"
              >
                ▶
              </button>
            </span>
          );
          const [a, b] = cell.groups;
          const colorA = ISO513_COLORS[a];
          const lightA = isLight(colorA);
          if (b) {
            const colorB = ISO513_COLORS[b];
            const lightB = isLight(colorB);
            return (
              <div
                key={key}
                data-map-cell={cell.type}
                data-map-groups={`${a}+${b}`}
                className={`relative col-span-2 flex min-h-72 flex-col justify-between p-4 ${editClass}`}
                style={{ background: `linear-gradient(to bottom right, ${colorA} 50%, ${colorB} 50%)` }}
                {...editProps}
              >
                {arrows}
                <div className="flex items-start justify-between gap-3">
                  <div className="space-y-3">
                    <h3 className="text-2xl font-extrabold tracking-wide text-neutral-900">{cell.type}</h3>
                    <div className="flex items-start gap-6">
                      <GradeList grades={cell.grades[0]} light={lightA} onPick={onPick} />
                      <span className="max-w-[9rem] text-lg leading-tight font-bold text-neutral-900">{MAP_LABELS[a]}</span>
                    </div>
                  </div>
                  <MaterialBadge group={a} />
                </div>
                <div className="flex items-end justify-between gap-3">
                  <MaterialBadge group={b} />
                  <div className="flex items-end gap-6">
                    <span className={`max-w-[9rem] text-lg leading-tight font-bold ${lightB ? "text-neutral-900" : "text-white"}`}>{MAP_LABELS[b]}</span>
                    <GradeList grades={cell.grades[1]} light={lightB} onPick={onPick} />
                  </div>
                </div>
              </div>
            );
          }
          return (
            <div
              key={key}
              data-map-cell={cell.type}
              data-map-groups={a}
              className={`relative flex min-h-72 flex-col gap-3 p-4 ${editClass}`}
              style={{ backgroundColor: colorA }}
              {...editProps}
            >
              {arrows}
              <h3 className="text-2xl font-extrabold tracking-wide text-neutral-900">{cell.type}</h3>
              <div className="flex flex-1 items-center gap-4">
                <GradeList grades={cell.grades[0]} light={lightA} onPick={onPick} />
                <span className="flex-1 text-center text-lg leading-tight font-bold text-neutral-900">{MAP_LABELS[a]}</span>
              </div>
              <div className="flex justify-end">
                <MaterialBadge group={a} />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

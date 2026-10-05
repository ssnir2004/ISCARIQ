import { ISO513_COLORS, MATERIAL_GROUPS } from "../../lib/npaKnowledgeConstants";
import type { Grade, Iso513Group } from "../../lib/types";

// Map of a board's grades: a box per grade type (e.g. ceramic ALUMINA) and
// material, in the material's ISO color, listing the type's grades for that
// material in the board's Harder -> Tougher order. A type whose grades are
// the same for two materials gets one box split diagonally between them.

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

export function GradesMap({
  groups,
  columnFor,
  onPick,
}: {
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

  if (cells.length === 0) return null;

  return (
    <div className="space-y-2">
      {!columns.some((c) => c.grades.some((g) => g.type)) && (
        <p className="text-sm text-neutral-500 dark:text-neutral-400">Set each grade's Type in its form to group the map by type.</p>
      )}
      <div className="grid grid-cols-[repeat(auto-fill,minmax(250px,1fr))] gap-1" data-grades-map>
        {cells.map((cell) => {
          const [a, b] = cell.groups;
          const colorA = ISO513_COLORS[a];
          const lightA = isLight(colorA);
          if (b) {
            const colorB = ISO513_COLORS[b];
            const lightB = isLight(colorB);
            return (
              <div
                key={`${cell.type}:${a}+${b}`}
                data-map-cell={cell.type}
                data-map-groups={`${a}+${b}`}
                className="relative col-span-2 flex min-h-72 flex-col justify-between p-4"
                style={{ background: `linear-gradient(to bottom right, ${colorA} 50%, ${colorB} 50%)` }}
              >
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
              key={`${cell.type}:${a}`}
              data-map-cell={cell.type}
              data-map-groups={a}
              className="relative flex min-h-72 flex-col gap-3 p-4"
              style={{ backgroundColor: colorA }}
            >
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

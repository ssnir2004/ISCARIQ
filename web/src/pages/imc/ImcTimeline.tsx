import type { ImcCompanyLite } from "./imcCountries";

// When each company joined IMC, as a timeline like the group's history
// slide: a band of arrow segments in rotating colours, a ring per company
// with its year on one side and its logo (or name) on the other, alternating
// above and below so neighbours don't collide.

const COLORS = ["#2563eb", "#262626", "#0891b2", "#0d9488", "#38bdf8", "#f59e0b", "#b91c1c", "#16a34a", "#9ca3af", "#7c3aed"];
const PER_ROW = 6;

function Logo({ c }: { c: ImcCompanyLite }) {
  return c.logo ? (
    <span className="rounded-md bg-white px-2 py-1 ring-1 ring-neutral-200 dark:ring-neutral-700">
      <img src={c.logo} alt={c.name} title={c.name} className="h-9 max-w-32 object-contain" />
    </span>
  ) : (
    <span className="text-center text-sm font-bold text-neutral-900 dark:text-neutral-100">{c.name}</span>
  );
}

function Year({ year }: { year: number }) {
  return <span className="text-base font-semibold text-neutral-800 tabular-nums dark:text-neutral-200">{year}</span>;
}

export function ImcTimeline({ companies }: { companies: ImcCompanyLite[] }) {
  const dated = companies
    .filter((c): c is ImcCompanyLite & { imcSince: number } => typeof c.imcSince === "number")
    .sort((a, b) => a.imcSince - b.imcSince || a.name.localeCompare(b.name));
  const undated = companies.filter((c) => typeof c.imcSince !== "number");
  const rows: (typeof dated)[] = [];
  for (let i = 0; i < dated.length; i += PER_ROW) rows.push(dated.slice(i, i + PER_ROW));

  if (dated.length === 0) {
    return <p className="py-6 text-center text-sm text-neutral-500 dark:text-neutral-400">Set "Part of IMC since" on companies to see the timeline.</p>;
  }

  return (
    <div className="space-y-8" data-imc-timeline>
      {rows.map((row, r) => (
        <div key={r} className="grid" style={{ gridTemplateColumns: `repeat(${PER_ROW}, minmax(0, 1fr))` }}>
          {row.map((c, i) => {
            const index = r * PER_ROW + i;
            const color = COLORS[index % COLORS.length];
            const up = index % 2 === 0; // logo above the band, year below
            const last = i === row.length - 1;
            return (
              <div key={c.id} className="flex flex-col items-center" data-timeline-item={c.name}>
                <div className="flex h-16 items-end justify-center pb-1">{up ? <Logo c={c} /> : <Year year={c.imcSince} />}</div>
                <div className="h-3 w-px border-l border-dotted border-neutral-400" />
                <div className="relative flex h-9 w-full items-center justify-center">
                  {/* Band segment: an arrow on the row's last segment. */}
                  <div
                    className="absolute inset-y-1.5 -right-px -left-px"
                    style={{
                      backgroundColor: color,
                      clipPath: last ? "polygon(0 0, calc(100% - 14px) 0, 100% 50%, calc(100% - 14px) 100%, 0 100%)" : undefined,
                      borderRadius: i === 0 ? "999px 0 0 999px" : undefined,
                    }}
                  />
                  <span className="relative h-9 w-9 rounded-full border-4 bg-white" style={{ borderColor: color }} />
                </div>
                <div className="h-3 w-px border-l border-dotted border-neutral-400" />
                <div className="flex h-16 items-start justify-center pt-1">{up ? <Year year={c.imcSince} /> : <Logo c={c} />}</div>
              </div>
            );
          })}
        </div>
      ))}
      {undated.length > 0 && (
        <p className="text-xs text-neutral-500 dark:text-neutral-400">No year yet: {undated.map((c) => c.name).join(", ")}</p>
      )}
    </div>
  );
}

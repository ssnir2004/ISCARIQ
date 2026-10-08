import type { ImcCompanyLite } from "./imcCountries";

// When each company joined IMC, as a timeline like the group's history
// slide: a band of arrow segments in rotating colours, a ring per company
// with its year on one side and its logo (or name) on the other, alternating
// above and below so neighbours don't collide.

const COLORS = ["#2563eb", "#262626", "#0891b2", "#0d9488", "#38bdf8", "#f59e0b", "#b91c1c", "#16a34a", "#9ca3af", "#7c3aed"];
const PER_ROW = 8;

// The company's logo (or name). Hovering it shows its description in a
// small card, above or below the logo (away from the band), kept inside the
// timeline at the ends of a row.
function Logo({ c, above, align }: { c: ImcCompanyLite; above: boolean; align: "left" | "center" | "right" }) {
  const position = align === "left" ? "left-0" : align === "right" ? "right-0" : "left-1/2 -translate-x-1/2";
  return (
    <span className="group/logo relative inline-flex" tabIndex={c.description ? 0 : undefined} data-timeline-logo={c.name}>
      {c.logo ? (
        <span className="rounded-md bg-white px-1.5 py-0.5 ring-1 ring-neutral-200 dark:ring-neutral-700">
          <img src={c.logo} alt={c.name} className="h-6 max-w-24 object-contain" />
        </span>
      ) : (
        <span className="text-center text-xs font-bold text-neutral-900 dark:text-neutral-100">{c.name}</span>
      )}
      <span
        role="tooltip"
        className={`pointer-events-none absolute ${position} z-30 hidden w-64 rounded-lg border border-neutral-200 bg-white p-2.5 text-left text-xs text-neutral-700 shadow-lg group-hover/logo:block group-focus/logo:block dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-200 ${
          above ? "bottom-full mb-2" : "top-full mt-2"
        }`}
        data-timeline-tooltip
      >
        <span className="mb-1 block font-bold text-neutral-900 dark:text-neutral-100">
          {c.name}
          {c.imcSince ? <span className="ml-1 font-normal text-neutral-500">· IMC since {c.imcSince}</span> : null}
        </span>
        <span className="block whitespace-pre-line">{c.description || "No description."}</span>
      </span>
    </span>
  );
}

function Year({ year }: { year: number }) {
  return <span className="text-sm font-semibold text-neutral-800 tabular-nums dark:text-neutral-200">{year}</span>;
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
    <div className="mx-auto max-w-4xl space-y-5" data-imc-timeline>
      {rows.map((row, r) => (
        <div key={r} className="grid" style={{ gridTemplateColumns: `repeat(${PER_ROW}, minmax(0, 1fr))` }}>
          {row.map((c, i) => {
            const index = r * PER_ROW + i;
            const color = COLORS[index % COLORS.length];
            const up = index % 2 === 0; // logo above the band, year below
            const last = i === row.length - 1;
            const align = i < 2 ? "left" : i >= PER_ROW - 2 ? "right" : "center";
            return (
              <div key={c.id} className="flex flex-col items-center" data-timeline-item={c.name}>
                <div className="flex h-10 items-end justify-center pb-0.5">{up ? <Logo c={c} above align={align} /> : <Year year={c.imcSince} />}</div>
                <div className="h-2 w-px border-l border-dotted border-neutral-400" />
                <div className="relative flex h-6 w-full items-center justify-center">
                  {/* Band segment: an arrow on the row's last segment. */}
                  <div
                    className="absolute inset-y-1 -right-px -left-px"
                    style={{
                      backgroundColor: color,
                      clipPath: last ? "polygon(0 0, calc(100% - 10px) 0, 100% 50%, calc(100% - 10px) 100%, 0 100%)" : undefined,
                      borderRadius: i === 0 ? "999px 0 0 999px" : undefined,
                    }}
                  />
                  <span className="relative h-6 w-6 rounded-full border-[3px] bg-white" style={{ borderColor: color }} />
                </div>
                <div className="h-2 w-px border-l border-dotted border-neutral-400" />
                <div className="flex h-10 items-start justify-center pt-0.5">{up ? <Year year={c.imcSince} /> : <Logo c={c} above={false} align={align} />}</div>
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

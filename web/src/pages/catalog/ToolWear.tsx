import { useState, type ReactNode } from "react";
import { Link } from "react-router-dom";
import { Card, Iso513Badge, PageHeader } from "../../components/ui";
import { RulesOfThumb } from "../../components/RulesOfThumb";
import type { Iso513Group } from "../../lib/types";

// Tool wear: how to recognise each type of wear on a cutting edge, why it
// happens and what to change. The text and sketches are our own; admins add
// their own rules of thumb ("wear").

type Zone = "flank" | "rake" | "edge";
type Severity = "ok" | "fix" | "stop";
type Lever = "Cutting data" | "Grade" | "Geometry" | "Setup";

type Wear = {
  id: string;
  name: string;
  severity: Severity;
  zones: Zone[];
  looks: string;
  why: string[];
  // What to change, by lever.
  fix: [Lever, string][];
  typical?: { groups?: Iso513Group[]; note?: string };
  note?: string;
  sketch: ReactNode;
};

const ZONES: { value: Zone; label: string }[] = [
  { value: "flank", label: "On the flank (side face)" },
  { value: "rake", label: "On the rake face (top)" },
  { value: "edge", label: "On the edge line or corner" },
];

const SEVERITY: Record<Severity, { label: string; className: string; title: string }> = {
  ok: {
    label: "Normal",
    className: "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-300",
    title: "The wear to aim for: even and predictable",
  },
  fix: {
    label: "Correct it",
    className: "bg-amber-100 text-amber-800 dark:bg-amber-900/40 dark:text-amber-300",
    title: "A sign that the grade, geometry or cutting data should change",
  },
  stop: {
    label: "Avoid",
    className: "bg-red-100 text-red-800 dark:bg-red-900/40 dark:text-red-300",
    title: "Breakage: damages the insert, the seat and the part",
  },
};

const LEVER_LINKS: Partial<Record<Lever, string>> = {
  Grade: "/catalog/grades",
  Geometry: "/catalog/chipbreakers",
};

// ---------- Sketches ----------
// One schematic of the edge for every type: the rake face (top, shaded), the
// flank (below) and the cutting edge between them, with the corner on the
// left and the depth-of-cut line (ap) on the right. Wear is drawn in red.

const WEAR = "#ef4444";

function Edge({ children, label = true }: { children?: ReactNode; label?: boolean }) {
  return (
    <svg viewBox="0 0 160 86" className="h-24 w-full text-neutral-600 dark:text-neutral-400" aria-hidden>
      <path d="M14 14 H150 V44 H26 Q14 44 14 32 Z" className="fill-neutral-100 dark:fill-neutral-800" />
      <path d="M26 44 H150 V80 H26 Z" className="fill-white dark:fill-neutral-900" />
      <path d="M14 14 V32 Q14 44 26 44 V80" fill="none" stroke="currentColor" strokeWidth="1" />
      <path d="M26 44 H150" fill="none" stroke="currentColor" strokeWidth="2" />
      <path d="M112 8 V84" stroke="currentColor" strokeWidth="0.8" strokeDasharray="3 3" />
      {label && (
        <g className="fill-current" fontSize="7">
          <text x="116" y="12">
            ap
          </text>
          <text x="120" y="30">
            rake
          </text>
          <text x="120" y="66">
            flank
          </text>
        </g>
      )}
      {children}
    </svg>
  );
}

const SKETCH = {
  flank: (
    <Edge>
      <path d="M26 44 H112 V54 H26 Z" fill={WEAR} fillOpacity="0.35" stroke={WEAR} strokeWidth="1" />
    </Edge>
  ),
  crater: (
    <Edge>
      <ellipse cx="64" cy="31" rx="30" ry="7" fill={WEAR} fillOpacity="0.35" stroke={WEAR} strokeWidth="1" />
    </Edge>
  ),
  plastic: (
    <Edge>
      <path d="M26 44 Q34 56 50 50 Q70 46 90 44" fill="none" stroke={WEAR} strokeWidth="2" />
      <path d="M26 44 H90" fill="none" stroke="currentColor" strokeWidth="1" strokeDasharray="2 2" />
    </Edge>
  ),
  notch: (
    <Edge>
      <path d="M104 44 L112 60 L118 44 Z" fill={WEAR} fillOpacity="0.5" stroke={WEAR} strokeWidth="1" />
      <path d="M26 44 H104 V48 H26 Z" fill={WEAR} fillOpacity="0.2" />
    </Edge>
  ),
  thermal: (
    <Edge>
      {[34, 46, 58, 70, 82, 94].map((x) => (
        <path key={x} d={`M${x} 36 L${x + 1} 54`} stroke={WEAR} strokeWidth="1.5" />
      ))}
    </Edge>
  ),
  mechanical: (
    <Edge>
      <path d="M30 40 Q60 38 104 40" fill="none" stroke={WEAR} strokeWidth="1.5" />
      <path d="M36 35 Q66 33 98 35" fill="none" stroke={WEAR} strokeWidth="1.2" />
    </Edge>
  ),
  chipping: (
    <Edge>
      <path d="M40 44 l3 4 l4 -4 M60 44 l2 5 l5 -5 M80 44 l3 3 l3 -3 M96 44 l2 4 l3 -4" fill={WEAR} fillOpacity="0.5" stroke={WEAR} strokeWidth="1.2" />
    </Edge>
  ),
  fracture: (
    <Edge>
      <path d="M14 22 L30 28 L42 22 L58 36 L70 44 L66 58 L74 70 L60 80 L26 80 Q14 70 14 44 Z" fill={WEAR} fillOpacity="0.35" stroke={WEAR} strokeWidth="1.2" />
    </Edge>
  ),
  bue: (
    <Edge>
      <path d="M36 44 Q38 32 52 30 Q70 28 82 36 Q86 42 84 44 Z" fill={WEAR} fillOpacity="0.45" stroke={WEAR} strokeWidth="1" />
    </Edge>
  ),
  hammering: (
    <Edge>
      <path d="M122 44 l3 5 l3 -5 M134 44 l2 4 l3 -4" fill={WEAR} fillOpacity="0.5" stroke={WEAR} strokeWidth="1.2" />
      <path d="M126 10 q16 8 6 28" fill="none" stroke={WEAR} strokeWidth="1" strokeDasharray="2 2" />
    </Edge>
  ),
};

// ---------- The wear types ----------

const WEARS: Wear[] = [
  {
    id: "flank",
    name: "Flank wear",
    severity: "ok",
    zones: ["flank"],
    looks: "An even, flat worn band on the flank, just under the cutting edge, along the part of the edge in cut.",
    why: [
      "Abrasion: hard particles in the material (carbides, sand, scale) grind the flank.",
      "If it grows fast: cutting speed too high, or the grade is not wear-resistant enough.",
    ],
    fix: [
      ["Cutting data", "Lower the cutting speed (Vc)."],
      ["Grade", "A harder, more wear-resistant grade (e.g. a thicker CVD coating)."],
    ],
    typical: { groups: ["K", "H"], note: "and abrasive materials in general" },
    note: "This is the wear to aim for: even and predictable, so the edge can be indexed on time. Act only when it grows too fast or unevenly.",
    sketch: SKETCH.flank,
  },
  {
    id: "crater",
    name: "Crater wear",
    severity: "fix",
    zones: ["rake"],
    looks: "A hollow on the rake face, a little behind the edge, where the chip slides at its hottest.",
    why: ["Heat: at high temperature the chip and the carbide exchange atoms (diffusion), mainly when cutting steel.", "Cutting speed too high; hard particles add abrasion."],
    fix: [
      ["Cutting data", "Lower the cutting speed first, then the feed."],
      ["Grade", "A grade with an aluminium-oxide (Al₂O₃) CVD coating, which does not react with the chip."],
      ["Geometry", "A more positive chipbreaker, which cuts with less heat."],
    ],
    typical: { groups: ["P"] },
    note: "A deep crater weakens the edge and spoils chip control.",
    sketch: SKETCH.crater,
  },
  {
    id: "plastic",
    name: "Plastic deformation",
    severity: "fix",
    zones: ["edge", "flank"],
    looks: "The edge sinks or bulges at the corner; the edge line is no longer straight (dashed: the original edge).",
    why: ["Heat and pressure together are too high: high speed and feed, or a hard material.", "The grade loses its hardness at that temperature (not enough hot hardness)."],
    fix: [
      ["Cutting data", "Lower the cutting speed first (temperature), then the feed (pressure)."],
      ["Grade", "A harder grade (less cobalt) that keeps its hardness when hot."],
      ["Geometry", "A stronger edge and a larger corner radius spread the load."],
    ],
    typical: { groups: ["S", "H"], note: "and hard steels" },
    note: "It snowballs: the deformed edge makes more heat, until the edge breaks.",
    sketch: SKETCH.plastic,
  },
  {
    id: "notch",
    name: "Notch wear",
    severity: "fix",
    zones: ["flank", "edge"],
    looks: "A local notch at the depth-of-cut line (ap), where the edge leaves the material.",
    why: [
      "A hard surface at that line: a work-hardened layer left by the previous pass, or a cast or forged skin.",
      "Air reaches the edge there (oxidation) and material sticks to it (adhesion).",
    ],
    fix: [
      ["Cutting data", "Vary the depth of cut between passes so the notch does not hit the same spot."],
      ["Geometry", "A smaller entering angle (larger lead angle) or a round insert spreads the line."],
      ["Grade", "A more wear-resistant grade. With ceramics in heat-resistant alloys, raise the speed rather than lower it."],
    ],
    typical: { groups: ["M", "S"] },
    sketch: SKETCH.notch,
  },
  {
    id: "thermal",
    name: "Thermal cracks",
    severity: "fix",
    zones: ["edge"],
    looks: "Short cracks across the edge (perpendicular to it), often several side by side, like a comb.",
    why: ["Heating and cooling cycles: interrupted cuts, milling (the edge goes in and out of the cut), on-and-off coolant."],
    fix: [
      ["Setup", "Coolant: plenty and constant, or none at all. In milling, often cut dry."],
      ["Grade", "A tougher grade that resists thermal shock."],
      ["Cutting data", "Lower the cutting speed."],
    ],
    typical: { note: "Milling, interrupted cuts" },
    note: "Pieces between the cracks break out and the edge chips; act early.",
    sketch: SKETCH.thermal,
  },
  {
    id: "mechanical",
    name: "Mechanical fatigue cracks",
    severity: "fix",
    zones: ["rake", "edge"],
    looks: "Cracks along the edge (parallel to it).",
    why: ["Repeated force shocks, each too small to break the edge: entering the cut, a changing depth or direction of load, vibration."],
    fix: [
      ["Grade", "A tougher grade."],
      ["Cutting data", "Lower the feed, at least when entering the cut."],
      ["Setup", "Change how the tool enters the cut (e.g. roll into it in milling) and improve stability."],
    ],
    typical: { note: "Milling, interrupted cuts" },
    sketch: SKETCH.mechanical,
  },
  {
    id: "chipping",
    name: "Chipping",
    severity: "fix",
    zones: ["edge"],
    looks: "Small pieces missing along the edge line: the edge breaks rather than wears.",
    why: ["The edge is too weak for the load: a brittle grade or a sharp, weak geometry.", "Interrupted cuts and vibration; built-up edge tearing pieces away."],
    fix: [
      ["Grade", "A tougher grade."],
      ["Geometry", "A stronger edge (honed edge, negative land, chamfer)."],
      ["Cutting data", "Lower the feed at the start of the cut. If there is built-up edge, fix that first (raise the speed)."],
      ["Setup", "Improve stability."],
    ],
    note: "Under a magnifier, tell it apart from flank wear: chipping is jagged, flank wear is a smooth band.",
    sketch: SKETCH.chipping,
  },
  {
    id: "fracture",
    name: "Fracture",
    severity: "stop",
    zones: ["edge"],
    looks: "A large part of the edge or corner is gone. Often also damages the seat (shim) and the part.",
    why: [
      "Overload: feed or depth of cut too high for the insert, a grade too brittle, an insert too small or thin.",
      "Often the end of another wear left too long (plastic deformation, chipping, cracks).",
    ],
    fix: [
      ["Setup", "Find the wear that came before the fracture and fix it; index the edge earlier."],
      ["Cutting data", "Lower the feed and/or depth of cut."],
      ["Grade", "A tougher grade."],
      ["Geometry", "A stronger insert: thicker, larger, a stronger corner angle, single-sided."],
    ],
    sketch: SKETCH.fracture,
  },
  {
    id: "bue",
    name: "Built-up edge (BUE)",
    severity: "fix",
    zones: ["rake", "edge"],
    looks: "Workpiece material welded onto the edge. The surface finish gets worse; when the lump tears off it takes bits of the edge with it.",
    why: ["Cutting temperature too low (cutting speed too low) with high pressure.", "A sticky material: low-carbon steel, stainless steel, aluminium; a negative geometry."],
    fix: [
      ["Cutting data", "Raise the cutting speed (the main remedy)."],
      ["Geometry", "A sharp, positive edge with a smooth rake face."],
      ["Grade", "A smooth coating (PVD), or an uncoated polished grade for aluminium."],
      ["Setup", "Coolant."],
    ],
    typical: { groups: ["N", "M"], note: "and low-carbon steel" },
    sketch: SKETCH.bue,
  },
  {
    id: "hammering",
    name: "Chip hammering",
    severity: "fix",
    zones: ["edge"],
    looks: "Damage on the part of the edge that is NOT in cut (beyond ap), sometimes on the top of the insert.",
    why: ["Long chips are bent back and strike the edge."],
    fix: [
      ["Geometry", "Another chipbreaker that sends the chip away from the edge."],
      ["Cutting data", "Change the feed a little."],
      ["Setup", "Change the entering (lead) angle."],
      ["Grade", "A tougher grade."],
    ],
    sketch: SKETCH.hammering,
  },
];

// ---------- Why edges wear ----------

const MECHANISMS: {
  name: string;
  load: string;
  how: string;
  causes: string;
  resist: ReactNode;
}[] = [
  {
    name: "Abrasion",
    load: "Abrasive",
    how: "Hard particles in the material grind the tool, like a grinding wheel.",
    causes: "Flank wear, part of crater wear",
    resist: (
      <>
        Hardness: a hard <Link to="/catalog/substrates">substrate</Link>, a thick <Link to="/catalog/coatings">CVD coating</Link>.
      </>
    ),
  },
  {
    name: "Diffusion",
    load: "Chemical",
    how: "At high temperature atoms move between the chip and the tool (carbide and steel especially).",
    causes: "Crater wear",
    resist: (
      <>
        A chemically inert <Link to="/catalog/coatings">coating</Link> (Al₂O₃); a lower cutting speed. Hardness does not help much.
      </>
    ),
  },
  {
    name: "Oxidation",
    load: "Chemical",
    how: "Heat and air oxidise the tool where air reaches the edge, at the end of the cut.",
    causes: "Notch wear",
    resist: (
      <>
        An oxidation-resistant <Link to="/catalog/coatings">coating</Link> (Al₂O₃).
      </>
    ),
  },
  {
    name: "Fatigue",
    load: "Thermal + mechanical",
    how: "Repeated heating and cooling, and repeated force shocks, in interrupted cuts.",
    causes: "Thermal cracks, mechanical cracks, chipping, fracture",
    resist: (
      <>
        Toughness: a tougher <Link to="/catalog/grades">grade</Link> (more cobalt), a stronger edge, a stable setup.
      </>
    ),
  },
  {
    name: "Adhesion",
    load: "Mechanical + thermal",
    how: "At low temperature and high pressure the material welds onto the edge and tears off.",
    causes: "Built-up edge, notch wear (in work-hardening materials), chipping",
    resist: (
      <>
        A higher cutting speed, a sharp positive <Link to="/catalog/chipbreakers">geometry</Link>, a smooth coating.
      </>
    ),
  },
];

// ---------- Layout pieces ----------

function Section({ title, subtitle, children }: { title: string; subtitle?: string; children: ReactNode }) {
  return (
    <Card className="mb-6 p-4">
      <h2 className="font-semibold text-neutral-900 dark:text-neutral-100">{title}</h2>
      {subtitle && <p className="mb-3 text-sm text-neutral-500 dark:text-neutral-400">{subtitle}</p>}
      <div className={subtitle ? "" : "mt-3"}>{children}</div>
    </Card>
  );
}

function SeverityBadge({ severity }: { severity: Severity }) {
  const s = SEVERITY[severity];
  return (
    <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${s.className}`} title={s.title}>
      {s.label}
    </span>
  );
}

function Label({ children }: { children: ReactNode }) {
  return <div className="mb-0.5 text-xs font-semibold uppercase tracking-wide text-neutral-500 dark:text-neutral-400">{children}</div>;
}

function WearCard({ wear, n }: { wear: Wear; n: number }) {
  const levers = [...new Set(wear.fix.map(([l]) => l))];
  return (
    <div className="flex flex-col rounded-lg border border-neutral-200 p-3 dark:border-neutral-700" data-wear={wear.id}>
      <div className="mb-1 flex items-center justify-between gap-2">
        <h3 className="font-semibold text-neutral-900 dark:text-neutral-100">
          {n}. {wear.name}
        </h3>
        <SeverityBadge severity={wear.severity} />
      </div>
      {wear.sketch}
      <div className="mt-2 space-y-2 text-sm text-neutral-700 dark:text-neutral-300">
        <div>
          <Label>How it looks</Label>
          <p>{wear.looks}</p>
        </div>
        <div>
          <Label>Why</Label>
          <ul className="list-disc space-y-0.5 pl-5">
            {wear.why.map((w) => (
              <li key={w}>{w}</li>
            ))}
          </ul>
        </div>
        <div>
          <Label>What to change</Label>
          <ul className="space-y-1">
            {levers.map((lever) => (
              <li key={lever}>
                {LEVER_LINKS[lever] ? (
                  <Link to={LEVER_LINKS[lever]!} className="font-medium text-blue-600 hover:underline dark:text-blue-400">
                    {lever}
                  </Link>
                ) : (
                  <span className="font-medium text-neutral-900 dark:text-neutral-100">{lever}</span>
                )}
                {": "}
                {wear.fix
                  .filter(([l]) => l === lever)
                  .map(([, t]) => t)
                  .join(" ")}
              </li>
            ))}
          </ul>
        </div>
        {wear.typical && (
          <div className="flex flex-wrap items-center gap-1 text-xs text-neutral-500 dark:text-neutral-400">
            <span>Typical in:</span>
            {wear.typical.groups?.map((g) => (
              <Iso513Badge key={g} group={g} />
            ))}
            {wear.typical.note && <span>{wear.typical.note}</span>}
          </div>
        )}
        {wear.note && <p className="rounded bg-neutral-50 px-2 py-1 text-xs text-neutral-600 dark:bg-neutral-800/50 dark:text-neutral-400">{wear.note}</p>}
      </div>
    </div>
  );
}

// The cutting speed / feed window: too slow builds up an edge, too fast
// overheats it, too much feed breaks it.
function WorkingWindow() {
  const text = "fill-neutral-800 dark:fill-neutral-200";
  return (
    <svg viewBox="0 0 420 250" className="w-full max-w-2xl" role="img" aria-label="Cutting speed against feed: the working window and the wear outside it">
      <rect x="50" y="20" width="350" height="190" className="fill-neutral-50 dark:fill-neutral-800/40" />
      <rect x="50" y="20" width="80" height="190" fill="#f59e0b" fillOpacity="0.25" />
      <rect x="310" y="20" width="90" height="190" fill={WEAR} fillOpacity="0.18" />
      <rect x="130" y="20" width="180" height="45" fill="#7c3aed" fillOpacity="0.18" />
      <rect x="130" y="175" width="180" height="35" fill="#0ea5e9" fillOpacity="0.15" />
      <rect x="150" y="85" width="140" height="75" rx="8" fill="#10b981" fillOpacity="0.3" stroke="#10b981" />
      <g fontSize="11" textAnchor="middle" className={text}>
        <text x="220" y="118" fontWeight="600">
          Working window
        </text>
        <text x="220" y="134">
          even flank wear
        </text>
        <text x="90" y="105">
          Built-up
        </text>
        <text x="90" y="119">
          edge
        </text>
        <text x="355" y="98">
          Crater wear,
        </text>
        <text x="355" y="112">
          plastic
        </text>
        <text x="355" y="126">
          deformation
        </text>
        <text x="220" y="40">
          Chipping, fracture,
        </text>
        <text x="220" y="54">
          plastic deformation
        </text>
        <text x="220" y="196">
          Rubbing; notch in work-hardening materials
        </text>
      </g>
      <g stroke="currentColor" className="text-neutral-500" strokeWidth="1.2" fill="none">
        <path d="M50 210 H405 M50 210 V15" />
        <path d="M400 205 L407 210 L400 215 M45 22 L50 15 L55 22" />
      </g>
      <g fontSize="11" className="fill-neutral-600 dark:fill-neutral-400">
        <text x="405" y="230" textAnchor="end">
          Cutting speed Vc →
        </text>
        <text x="16" y="120" transform="rotate(-90 16 120)" textAnchor="middle">
          Feed f →
        </text>
      </g>
    </svg>
  );
}

// Where flank wear (VB, VBmax) and crater depth (KT) are measured.
function MeasureSketch() {
  return (
    <div className="grid gap-4 sm:grid-cols-2">
      <svg viewBox="0 0 200 110" className="w-full text-neutral-600 dark:text-neutral-400" role="img" aria-label="Flank wear VB and VBmax, seen on the flank">
        <path d="M20 20 H185" stroke="currentColor" strokeWidth="2" />
        <path d="M20 20 V100 M185 20 V100" stroke="currentColor" strokeWidth="0.8" />
        <path d="M20 20 H185 V34 Q150 36 120 33 Q100 48 92 33 Q60 35 20 38 Z" fill={WEAR} fillOpacity="0.3" stroke={WEAR} />
        <g stroke="currentColor" strokeWidth="0.8">
          <path d="M150 20 V34 M146 20 H154 M146 34 H154" />
          <path d="M100 20 V47 M96 47 H104" />
        </g>
        <g fontSize="9" className="fill-current">
          <text x="156" y="30">
            VB
          </text>
          <text x="104" y="56">
            VBmax
          </text>
          <text x="22" y="14">
            edge
          </text>
          <text x="60" y="80">
            flank (seen from the side)
          </text>
        </g>
      </svg>
      <svg viewBox="0 0 200 110" className="w-full text-neutral-600 dark:text-neutral-400" role="img" aria-label="Crater depth KT, seen in a section through the edge">
        <path d="M20 30 H60 Q80 52 110 30 H185 V100 H30 L20 30" className="fill-neutral-100 dark:fill-neutral-800" stroke="currentColor" />
        <path d="M60 30 H110" stroke="currentColor" strokeDasharray="3 3" />
        <path d="M60 30 Q80 52 110 30" fill={WEAR} fillOpacity="0.35" stroke={WEAR} />
        <g stroke="currentColor" strokeWidth="0.8">
          <path d="M84 30 V41 M80 41 H88" />
        </g>
        <g fontSize="9" className="fill-current">
          <text x="90" y="40">
            KT
          </text>
          <text x="14" y="24">
            edge
          </text>
          <text x="120" y="24">
            rake face
          </text>
          <text x="70" y="80">
            section through the insert
          </text>
        </g>
      </svg>
    </div>
  );
}

export function ToolWear() {
  const [zone, setZone] = useState<Zone | null>(null);
  const shown = WEARS.map((w, i) => ({ w, n: i + 1 })).filter(({ w }) => !zone || w.zones.includes(zone));
  const chip = (on: boolean) =>
    `rounded-full border px-3 py-1 text-sm ${
      on
        ? "border-blue-600 bg-blue-600 text-white"
        : "border-neutral-300 text-neutral-700 hover:bg-neutral-100 dark:border-neutral-700 dark:text-neutral-300 dark:hover:bg-neutral-800"
    }`;

  return (
    <div>
      <PageHeader title="Tool Wear" />
      <p className="mb-6 max-w-4xl text-sm text-neutral-600 dark:text-neutral-400">
        Every edge wears; the goal is even, predictable flank wear, so the edge can be indexed on time. Any other wear is a signal: look at the edge under a magnifier, find the
        type below, and change one thing at a time. An edge is worn out in <b>finishing</b> when the surface or the size is no longer right (a little wear at the corner is enough),
        and in <b>roughing</b> when chip control is lost or the edge is close to breaking.
      </p>

      <Section title="1. Identify the wear" subtitle="Where on the edge do you see it?">
        <div className="mb-4 flex flex-wrap gap-2" role="group" aria-label="Where the wear is">
          <button type="button" className={chip(zone === null)} onClick={() => setZone(null)} data-viewer-ok>
            All
          </button>
          {ZONES.map((z) => (
            <button key={z.value} type="button" className={chip(zone === z.value)} onClick={() => setZone(z.value)} data-viewer-ok>
              {z.label}
            </button>
          ))}
        </div>
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3" data-wear-cards>
          {shown.map(({ w, n }) => (
            <WearCard key={w.id} wear={w} n={n} />
          ))}
        </div>
      </Section>

      <Section title="2. Why edges wear" subtitle="Four loads act on the edge: mechanical, thermal, chemical and abrasive. They wear it in five ways.">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[640px] text-left text-sm [&_a]:text-blue-600 [&_a]:hover:underline dark:[&_a]:text-blue-400" data-wear-mechanisms>
            <thead className="text-xs uppercase tracking-wide text-neutral-500 dark:text-neutral-400">
              <tr className="border-b border-neutral-200 dark:border-neutral-700">
                <th className="py-1.5 pr-3 font-semibold">Mechanism</th>
                <th className="py-1.5 pr-3 font-semibold">Load</th>
                <th className="py-1.5 pr-3 font-semibold">What happens</th>
                <th className="py-1.5 pr-3 font-semibold">Leads to</th>
                <th className="py-1.5 font-semibold">What resists it</th>
              </tr>
            </thead>
            <tbody className="text-neutral-700 dark:text-neutral-300">
              {MECHANISMS.map((m) => (
                <tr key={m.name} className="border-b border-neutral-100 align-top last:border-0 dark:border-neutral-800">
                  <td className="py-2 pr-3 font-medium text-neutral-900 dark:text-neutral-100">{m.name}</td>
                  <td className="py-2 pr-3">{m.load}</td>
                  <td className="py-2 pr-3">{m.how}</td>
                  <td className="py-2 pr-3">{m.causes}</td>
                  <td className="py-2">{m.resist}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="mt-3 text-sm text-neutral-600 dark:text-neutral-400">
          Hardness fights abrasion; toughness fights fatigue and breakage; the coating fights the chemical wear. No grade has everything, which is why the wear you see tells you
          which way to move.
        </p>
      </Section>

      <Section title="3. The working window" subtitle="Cutting speed sets the temperature, feed sets the load. Outside the window, the edge tells you which way you went.">
        <WorkingWindow />
        <ul className="mt-3 list-disc space-y-0.5 pl-5 text-sm text-neutral-700 dark:text-neutral-300">
          <li>Built-up edge → raise the speed. Crater or plastic deformation → lower the speed first.</li>
          <li>Chipping or fracture → lower the feed or choose a tougher grade and a stronger edge.</li>
          <li>Feed too small → the edge rubs instead of cutting; in stainless steel and superalloys it works the surface harder.</li>
        </ul>
      </Section>

      <Section title="4. Measuring wear" subtitle="Look at the edge under a magnifier and measure from the original edge.">
        <MeasureSketch />
        <ul className="mt-3 list-disc space-y-0.5 pl-5 text-sm text-neutral-700 dark:text-neutral-300">
          <li>
            <b>VB</b>: the average width of the flank wear band, when it is even.
          </li>
          <li>
            <b>VBmax</b>: the widest point, when one spot wears much more (a notch, for example); note where it is.
          </li>
          <li>
            <b>KT</b>: the depth of the crater on the rake face.
          </li>
          <li>
            For tool-life tests, ISO 3685 uses VB = 0.3 mm (even wear) or VBmax = 0.6 mm as the end of life. In finishing, the limit is usually much smaller and is set by the
            surface.
          </li>
          <li>Measure at fixed intervals (minutes or parts) to see how fast the wear grows, not only how big it is.</li>
        </ul>
      </Section>

      <RulesOfThumb scope="wear" />
    </div>
  );
}

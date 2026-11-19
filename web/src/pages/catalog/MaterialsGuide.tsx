import { useState, type ReactNode } from "react";
import { Card, Iso513Badge } from "../../components/ui";
import { RulesOfThumb } from "../../components/RulesOfThumb";
import { ISO513_COLORS } from "../../lib/npaKnowledgeConstants";
import type { Iso513Group } from "../../lib/types";

// "Understanding materials": how work materials are divided into the ISO 513
// groups and their sub-types, and what each group means for the grade, the
// chipbreaker and the cutting edge. Rules of thumb, kept simple; each group
// also has its own editable list of rules ("materials:<group>").

type Guide = {
  group: Iso513Group;
  name: string;
  what: string;
  // Sub-types, by the rule that tells them apart.
  types: { by: string; items: string[] }[];
  behaviour: string[];
  choose: string[];
};

const GUIDES: Guide[] = [
  {
    group: "P",
    name: "Steel",
    what: "Iron with up to about 2% carbon, no graphite.",
    types: [
      {
        by: "By alloy content",
        items: [
          "Unalloyed (carbon steel): the carbon content decides. Below ~0.25% C soft and gummy; 0.25–0.55% C the easiest to machine; above that harder and more abrasive.",
          "Low-alloyed (under ~5% alloying elements, e.g. Cr, Mo, Ni for strength and hardenability).",
          "High-alloyed and tool steels (over ~5% alloying elements).",
          "Ferritic and martensitic stainless steels: magnetic, they cut like alloyed steel.",
        ],
      },
      { by: "By condition", items: ["Annealed (soft) or quenched & tempered (harder, up to ~45 HRC)."] },
    ],
    behaviour: ["Long, continuous chips.", "Machinability drops as carbon, alloy content and hardness rise; very soft, low-carbon steel tends to build up on the edge."],
    choose: ["The chipbreaker is the key choice: chip control.", "A P grade with a CVD coating; the harder the steel, the more wear-resistant the grade."],
  },
  {
    group: "M",
    name: "Stainless steel",
    what: "Iron with at least 10.5% chromium plus nickel, giving an austenitic, non-magnetic structure.",
    types: [
      {
        by: "By structure",
        items: [
          "Austenitic (e.g. 304, 316): the most common.",
          "Duplex (half ferritic, half austenitic, ~22–25% Cr): stronger, harder to machine.",
          "Super-austenitic and precipitation hardening (PH): higher alloyed, more demanding.",
        ],
      },
    ],
    behaviour: ["Work-hardens: the surface just cut becomes harder.", "Sticky and a poor heat conductor, so heat stays at the edge.", "Tough, long chips."],
    choose: [
      "A sharp, positive edge.",
      "Feed and depth of cut not too small, to cut below the work-hardened layer.",
      "A tough M grade with a PVD or thin CVD coating; use coolant.",
    ],
  },
  {
    group: "K",
    name: "Cast iron",
    what: "Iron with over 2% carbon, most of it as graphite.",
    types: [
      {
        by: "By graphite shape",
        items: [
          "Grey (flakes): brittle, short chips, the easiest.",
          "Compacted graphite, CGI (worm-like): between grey and nodular.",
          "Nodular / ductile (spheres): stronger, chips closer to steel.",
          "Malleable: heat-treated white iron, behaves close to nodular.",
          "White / chilled: carbides instead of graphite, very hard (treat as H).",
        ],
      },
      { by: "By matrix", items: ["Ferritic (softer) or pearlitic (harder, stronger)."] },
    ],
    behaviour: ["Short chips.", "Abrasive (sand inclusions, carbides): flank wear is the main wear."],
    choose: [
      "Edge strength matters more than the chipbreaker.",
      "A hard, wear-resistant K grade with a thick alumina coating; ceramics or CBN for high speed in grey iron.",
      "Often machined dry.",
    ],
  },
  {
    group: "N",
    name: "Non-ferrous",
    what: "Aluminum, copper and its alloys, plastics and composites.",
    types: [
      {
        by: "Aluminum: wrought or cast",
        items: ["Wrought: easy to machine.", "Cast: the silicon content decides; above ~12% Si it becomes abrasive."],
      },
      { by: "Copper and its alloys", items: ["Brass machines easily; pure copper is sticky; bronze in between."] },
      { by: "Others", items: ["Plastics and composites (abrasive fibers wear the edge)."] },
    ],
    behaviour: ["Soft, low cutting forces, high cutting speeds.", "Tends to stick and build up on the edge."],
    choose: ["A very sharp, polished, positive edge.", "An uncoated or DLC-coated grade; PCD for high-silicon aluminum and composites."],
  },
  {
    group: "S",
    name: "Superalloys & titanium",
    what: "Alloys that keep their strength at high temperature.",
    types: [
      {
        by: "By base metal",
        items: [
          "Nickel based (e.g. 718, 625): the most common and demanding.",
          "Cobalt based: similar to nickel, more abrasive.",
          "Iron based heat-resistant alloys: the easiest of the group.",
          "Titanium: alpha, alpha-beta (e.g. Ti6Al4V, the most common) and beta.",
        ],
      },
    ],
    behaviour: ["Heat concentrates at the edge (poor heat conduction).", "Work-hardens; notch wear at the depth-of-cut line."],
    choose: [
      "Low cutting speed.",
      "A positive but strong edge; round inserts or a small entering angle spread the load.",
      "High-pressure coolant.",
      "A fine-grained, tough grade with a PVD coating; ceramics for roughing nickel alloys.",
    ],
  },
  {
    group: "H",
    name: "Hardened materials",
    what: "Materials at about 45–68 HRC, whatever they started as.",
    types: [{ by: "Typical", items: ["Hardened steels and tool steels.", "Chilled cast iron.", "Hard-facing (welded or sprayed hard layers)."] }],
    behaviour: ["High cutting forces and heat; abrasive.", "Short chips."],
    choose: ["CBN or ceramics.", "A negative edge with a strong chamfer.", "Small depths of cut and a rigid set-up."],
  },
];

const QUESTIONS: { q: string; answers: { a: string; groups: Iso513Group[] }[] }[] = [
  {
    q: "1. What is the base metal?",
    answers: [
      { a: "Aluminum, copper, plastics", groups: ["N"] },
      { a: "Nickel, cobalt, titanium", groups: ["S"] },
      { a: "Iron: go on to question 2", groups: [] },
    ],
  },
  {
    q: "2. Iron: what is its structure?",
    answers: [
      { a: "Steel (up to ~2% C)", groups: ["P"] },
      { a: "Austenitic stainless (Cr + Ni, non-magnetic)", groups: ["M"] },
      { a: "Cast iron with graphite (over 2% C)", groups: ["K"] },
    ],
  },
  {
    q: "3. How hard is it?",
    answers: [{ a: "Over ~45 HRC, whatever it is", groups: ["H"] }],
  },
];

const CROSS_RULES = [
  "Harder material → lower cutting speed.",
  "Long chips (P, M, N) → the chipbreaker is the key choice. Short chips (K, H) → edge strength is.",
  "Sticky materials (M, N, S) → a sharp, positive edge.",
  "Abrasive materials (K, H, high-silicon aluminum) → a wear-resistant grade.",
  "Poor heat conductors (M, S) → coolant and a moderate cutting speed.",
];

const OPEN_KEY = "iscariq.materialsGuide.open";
const GROUP_KEY = "iscariq.materialsGuide.group";

function read(key: string) {
  try {
    return localStorage.getItem(key);
  } catch {
    return null;
  }
}
function write(key: string, value: string) {
  try {
    localStorage.setItem(key, value);
  } catch {
    // Not remembered.
  }
}

function Section({ title, children }: { title: string; children: ReactNode }) {
  return (
    <div>
      <h3 className="mb-2 text-sm font-semibold text-neutral-900 dark:text-neutral-100">{title}</h3>
      {children}
    </div>
  );
}

function Bullets({ items }: { items: string[] }) {
  return (
    <ul className="list-disc space-y-0.5 pl-5">
      {items.map((t) => (
        <li key={t}>{t}</li>
      ))}
    </ul>
  );
}

export function MaterialsGuide({ onOpenGrades }: { onOpenGrades?: (group: Iso513Group) => void }) {
  const [open, setOpen] = useState(() => read(OPEN_KEY) === "1");
  const [group, setGroup] = useState<Iso513Group>(() => (GUIDES.find((g) => g.group === read(GROUP_KEY))?.group ?? "P"));
  const guide = GUIDES.find((g) => g.group === group)!;

  const toggle = () => {
    write(OPEN_KEY, open ? "0" : "1");
    setOpen(!open);
  };
  const choose = (g: Iso513Group) => {
    write(GROUP_KEY, g);
    setGroup(g);
  };

  return (
    <Card className="mb-6" data-materials-guide>
      <button type="button" onClick={toggle} aria-expanded={open} className="flex w-full items-center gap-2 p-4 text-left" data-viewer-ok>
        <span className="w-4 text-xs text-neutral-500 dark:text-neutral-400">{open ? "▼" : "▶"}</span>
        <span className="font-semibold text-neutral-900 dark:text-neutral-100">Understanding materials</span>
        <span className="text-sm text-neutral-500 dark:text-neutral-400">— how they are divided into groups, and what each group means for the grade and the chipbreaker</span>
      </button>
      {open && (
        <div className="space-y-6 border-t border-neutral-200 p-4 text-sm text-neutral-700 dark:border-neutral-800 dark:text-neutral-300">
          <Section title="Three questions decide the group">
            <div className="grid gap-3 md:grid-cols-3">
              {QUESTIONS.map(({ q, answers }) => (
                <div key={q} className="rounded-lg border border-neutral-200 p-3 dark:border-neutral-700">
                  <div className="mb-2 font-medium text-neutral-900 dark:text-neutral-100">{q}</div>
                  <ul className="space-y-1.5">
                    {answers.map(({ a, groups }) => (
                      <li key={a} className="flex items-center justify-between gap-2">
                        <span>{a}</span>
                        <span className="flex shrink-0 gap-1">
                          {groups.map((g) => (
                            <button key={g} type="button" onClick={() => choose(g)} title={`About ${g}`} data-viewer-ok>
                              <Iso513Badge group={g} />
                            </button>
                          ))}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </Section>

          <Section title="The groups">
            <div role="tablist" aria-label="Material groups" className="mb-3 flex flex-wrap gap-2">
              {GUIDES.map((g) => (
                <button
                  key={g.group}
                  type="button"
                  role="tab"
                  aria-selected={g.group === group}
                  onClick={() => choose(g.group)}
                  className={`rounded-lg border-2 px-3 py-1 text-sm font-medium ${
                    g.group === group ? "text-neutral-900" : "border-neutral-300 text-neutral-700 hover:bg-neutral-100 dark:border-neutral-700 dark:text-neutral-300 dark:hover:bg-neutral-800"
                  }`}
                  style={g.group === group ? { backgroundColor: ISO513_COLORS[g.group], borderColor: ISO513_COLORS[g.group] } : undefined}
                  data-viewer-ok
                >
                  {g.group} · {g.name}
                </button>
              ))}
            </div>
            <div className="rounded-lg border-l-4 bg-neutral-50 p-4 dark:bg-neutral-800/40" style={{ borderLeftColor: ISO513_COLORS[group] }} data-guide-group={group}>
              <p className="mb-3">
                <span className="font-semibold text-neutral-900 dark:text-neutral-100">{guide.name}: </span>
                {guide.what}
              </p>
              <div className="grid gap-4 lg:grid-cols-3">
                <div>
                  <div className="mb-1 text-xs font-semibold uppercase tracking-wide text-neutral-500 dark:text-neutral-400">Types</div>
                  {guide.types.map((t) => (
                    <div key={t.by} className="mb-2">
                      <div className="font-medium text-neutral-900 dark:text-neutral-100">{t.by}</div>
                      <Bullets items={t.items} />
                    </div>
                  ))}
                </div>
                <div>
                  <div className="mb-1 text-xs font-semibold uppercase tracking-wide text-neutral-500 dark:text-neutral-400">How it cuts</div>
                  <Bullets items={guide.behaviour} />
                </div>
                <div>
                  <div className="mb-1 text-xs font-semibold uppercase tracking-wide text-neutral-500 dark:text-neutral-400">What to choose</div>
                  <Bullets items={guide.choose} />
                  {onOpenGrades && (
                    <button type="button" onClick={() => onOpenGrades(group)} className="mt-2 text-sm font-medium text-blue-600 hover:underline dark:text-blue-400" data-viewer-ok>
                      Recommended grades for {group} →
                    </button>
                  )}
                </div>
              </div>
              <div className="mt-4">
                <RulesOfThumb key={group} scope={`materials:${group}`} />
              </div>
            </div>
          </Section>

          <Section title="Rules across all groups">
            <Bullets items={CROSS_RULES} />
          </Section>
        </div>
      )}
    </Card>
  );
}

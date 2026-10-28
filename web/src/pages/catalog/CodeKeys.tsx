import { useState } from "react";
import { Link } from "react-router-dom";
import { CodeKey } from "../../components/CodeKey";
import { Input, PageHeader } from "../../components/ui";
import { DECODERS, type DecoderName } from "../../lib/insertDecoders";
import { useResource } from "../../lib/useResource";
import type { Application, InnovationUse } from "../../lib/types";

// Code keys by application, then by type: each application has its tools key
// (e.g. Turning: ISO toolholders and boring bars), Turning also has the insert
// keys of each grade family (carbide, CBN, ceramic, PCD) and Parting the keys
// of its brands (DO-GRIP), each with its designation decoder.

const LAST_TAB_KEY = "iscariq.codekeys.tab";
const LAST_TYPE_KEY = "iscariq.codekeys.type";
const DEFAULT_TAB = "Turning";

interface KeyType {
  id: string;
  label: string;
  settingKey: string;
  defaultTitle: string;
  decoder?: DecoderName;
}

// The Turning insert keys (the setting keys the Grades screen used).
const TURNING_INSERTS: KeyType[] = [
  { id: "carbide", label: "Carbide insert", settingKey: "codekey.carbide", defaultTitle: "Carbide insert code key", decoder: "iso-insert" },
  { id: "cbn", label: "CBN insert", settingKey: "codekey.cbn", defaultTitle: "CBN insert code key", decoder: "cbn" },
  { id: "ceramic", label: "Ceramic insert", settingKey: "codekey.ceramic", defaultTitle: "Ceramic insert code key", decoder: "ceramic" },
  { id: "pcd", label: "PCD insert", settingKey: "codekey.pcd", defaultTitle: "PCD insert code key", decoder: "pcd" },
];

// The Parting families' keys (inserts and tools).
const PARTING_BRANDS: KeyType[] = [
  { id: "do-grip", label: "DO-GRIP", settingKey: "codekey.dogrip", defaultTitle: "DO-GRIP code key", decoder: "do-grip" },
  { id: "tang-grip", label: "TANG-GRIP", settingKey: "codekey.tanggrip", defaultTitle: "TANG-GRIP code key", decoder: "tang-grip" },
  { id: "heli-grip", label: "HELI-GRIP", settingKey: "codekey.heligrip", defaultTitle: "HELI-GRIP code key", decoder: "heli-grip" },
  { id: "top-grip", label: "TOP-GRIP", settingKey: "codekey.topgrip", defaultTitle: "TOP-GRIP code key", decoder: "top-grip" },
  { id: "swisscut", label: "SWISSCUT", settingKey: "codekey.swisscut", defaultTitle: "SWISSCUT code key", decoder: "swisscut" },
  { id: "cham-groove", label: "CHAM-GROOVE", settingKey: "codekey.chamgroove", defaultTitle: "CHAM-GROOVE code key", decoder: "cham-groove" },
  { id: "quick-i-groove", label: "QUICK-I-GROOVE", settingKey: "codekey.quickigroove", defaultTitle: "QUICK-I-GROOVE code key", decoder: "quick-i-groove" },
  { id: "heliface", label: "HELIFACE", settingKey: "codekey.heliface", defaultTitle: "HELIFACE code key", decoder: "heliface" },
  { id: "self-grip", label: "SELF-GRIP", settingKey: "codekey.selfgrip", defaultTitle: "SELF-GRIP code key", decoder: "self-grip" },
  { id: "groove4cut", label: "GROOVE4CUT", settingKey: "codekey.groove4cut", defaultTitle: "GROOVE4CUT code key", decoder: "groove4cut" },
  { id: "quick-penta", label: "QUICK-PENTA", settingKey: "codekey.quickpenta", defaultTitle: "QUICK-PENTA code key", decoder: "quick-penta" },
  { id: "penta-iq", label: "PENTA IQ GRIP", settingKey: "codekey.pentaiq", defaultTitle: "PENTA IQ GRIP code key", decoder: "penta-iq" },
  { id: "flashpenta", label: "FLASHPENTA", settingKey: "codekey.flashpenta", defaultTitle: "FLASHPENTA code key", decoder: "flashpenta" },
  { id: "penta", label: "PENTACUT", settingKey: "codekey.penta", defaultTitle: "PENTACUT code key", decoder: "penta" },
  { id: "cut-grip", label: "CUT-GRIP", settingKey: "codekey.cutgrip", defaultTitle: "CUT-GRIP code key", decoder: "cut-grip" },
  { id: "bgm", label: "ISCAR-PARTING", settingKey: "codekey.bgm", defaultTitle: "ISCAR-PARTING code key", decoder: "bgm" },
  { id: "gft", label: "SLIM-GRIP", settingKey: "codekey.gft", defaultTitle: "SLIM-GRIP code key", decoder: "gft" },
];

const MORE_TYPES: Record<string, KeyType[]> = { [DEFAULT_TAB.toLowerCase()]: TURNING_INSERTS, parting: PARTING_BRANDS };
// Applications whose brand keys already cover their tools, so no Tools key.
const NO_TOOLS_KEY = new Set(["parting"]);

function keyTypes(app: Application): KeyType[] {
  // The tools key keeps its decoder in its own data (e.g. "iso-turning").
  const name = app.name.trim().toLowerCase();
  const tools: KeyType = { id: "tools", label: "Tools", settingKey: `codekey.app.${app.id}`, defaultTitle: `${app.name} code key` };
  return [...(NO_TOOLS_KEY.has(name) ? [] : [tools]), ...(MORE_TYPES[name] ?? [])];
}

// Every key with a decoder, for the designation search (the Turning tools
// key's decoder is in its data: ISO toolholders).
function searchable(applications: Application[]) {
  return applications.flatMap((app) =>
    keyTypes(app)
      .map((t) => (t.id === "tools" && app.name.trim().toLowerCase() === DEFAULT_TAB.toLowerCase() ? { ...t, decoder: "iso-turning" as DecoderName } : t))
      .filter((t) => t.decoder)
      .map((type) => ({ app, type }))
  );
}

const norm = (s: string) => s.toUpperCase().replace(/[^A-Z0-9]/g, "");

// Solutions uses listing a designation's insert family: the family name before
// its first "-" or "(" (each of "A/B" alternatives) starts the designation,
// e.g. TAG N3C in "TAG N-C/W/M", DGN 3102J in "DGN/DGNM-J/JS/JT".
function familyKeys(insert: string) {
  const head = insert.split(/[-(]/)[0];
  const parts = head.split("/").map((p) => p.trim());
  // "DGR/L" means DGR or DGL; "PENTA 24R/L" means PENTA 24R or PENTA 24L.
  const keys = parts.map((p, i) => (i > 0 && p.length <= 2 && parts[0].length > p.length ? parts[0].slice(0, parts[0].length - p.length) + p : p));
  return keys.map(norm).filter((k) => k.length >= 3);
}

// The chipformers an insert family lists after its first "-" (e.g. TAG N-C/W/M
// -> C, W, M; DGN-J/JS-D -> J, JS, D); none when it lists none.
function familyChips(insert: string) {
  const dash = insert.indexOf("-");
  if (dash < 0) return [];
  return insert
    .slice(dash + 1)
    .split(/[/\-\s(]/)
    .map((t) => t.trim().toUpperCase())
    .filter((t) => /^[A-Z]{1,4}$/.test(t));
}

type Brand = { id: string; name: string; uses?: (InnovationUse & { category?: string | null })[] };

function read(key: string) {
  try {
    return localStorage.getItem(key);
  } catch {
    return null;
  }
}

function remember(key: string, value: string) {
  try {
    localStorage.setItem(key, value);
  } catch {
    // just not remembered
  }
}

export function CodeKeys() {
  const { data: applications } = useResource<Application>("/applications");
  const [chosen, setChosen] = useState<string | null>(() => read(LAST_TAB_KEY));
  const [chosenType, setChosenType] = useState<string | null>(() => read(LAST_TYPE_KEY));
  const tab = applications.find((a) => a.id === chosen) ?? applications.find((a) => a.name.toLowerCase() === DEFAULT_TAB.toLowerCase()) ?? applications[0];
  const types = tab ? keyTypes(tab) : [];
  const type = types.find((t) => t.id === chosenType) ?? types[0];
  // The designation search, and the designation picked from it for the open key.
  const [query, setQuery] = useState("");
  const [picked, setPicked] = useState<string | undefined>();
  const { data: brands } = useResource<Brand>("/innovations");

  const q = query.trim();
  const matched = q.length >= 3 ? searchable(applications).flatMap(({ app, type: t }) => {
    const r = DECODERS[t.decoder!].decode(q);
    return r ? [{ app, type: t, result: r }] : [];
  }) : [];
  // The ISO toolholder key reads almost any letters-and-digits code, so it only
  // counts when no brand family's key recognizes the designation.
  const decoded = matched.some((d) => d.type.decoder !== "iso-turning") ? matched.filter((d) => d.type.decoder !== "iso-turning") : matched;
  const nq = norm(q);
  // The designation's chipformer as decoded (e.g. J, or JS with sharp corners).
  const chips = new Set(
    decoded.flatMap(({ result }) => {
      const chip = result.parts.find((p) => p.key?.endsWith("chip"))?.code;
      const sharp = result.parts.some((p) => p.key?.endsWith("sharp"));
      return chip && /^[A-Z]+$/.test(chip) ? [chip, ...(sharp ? [`${chip}S`] : [])] : [];
    })
  );
  const uses = q.length >= 3 ? brands.flatMap((b) =>
    (b.uses ?? []).flatMap((u) =>
      u.inserts
        .filter((i) => {
          if (!familyKeys(i.name).some((k) => nq.startsWith(k))) return false;
          // A family listing its chipformers must list the designation's.
          const listed = familyChips(i.name);
          return chips.size === 0 || listed.length === 0 || listed.some((c) => chips.has(c));
        })
        .map((i) => ({ brand: b, use: u, insert: i }))
    )
  ) : [];

  function open(appId: string, typeId: string) {
    setChosen(appId);
    remember(LAST_TAB_KEY, appId);
    setChosenType(typeId);
    remember(LAST_TYPE_KEY, typeId);
    setPicked(q);
  }

  return (
    <div>
      <PageHeader title="Code keys" />
      {/* Which family an insert or tool belongs to: every key's decoder, and the Solutions uses listing it. */}
      <section className="mb-5 rounded-xl border border-neutral-200 bg-white p-3 dark:border-neutral-800 dark:bg-neutral-900" data-designation-search>
        <Input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Find any insert or tool designation, e.g. TAG N3C, DGN 3102J, GIP 3.00E-0.40, PCLNR 2525M-12, WNMG 080408"
          aria-label="Find a designation"
          className="font-mono"
        />
        {q.length >= 3 && (
          <div className="mt-3 space-y-3 text-sm">
            {decoded.length === 0 && uses.length === 0 && <p className="text-neutral-500 dark:text-neutral-400">No code key or solution reads this designation.</p>}
            {decoded.length > 0 && (
              <div>
                <p className="mb-1 text-xs font-semibold tracking-wide text-neutral-500 uppercase dark:text-neutral-400">Code keys</p>
                <ul className="space-y-1">
                  {decoded.map(({ app, type: t, result }) => (
                    <li key={`${app.id}:${t.id}`} data-search-key={t.id}>
                      <button
                        type="button"
                        onClick={() => open(app.id, t.id)}
                        className="w-full rounded-lg border border-neutral-200 px-3 py-1.5 text-left hover:border-blue-400 hover:bg-blue-50 dark:border-neutral-700 dark:hover:bg-blue-950/30"
                      >
                        <span className="font-semibold text-blue-700 dark:text-blue-300">
                          {app.name} → {t.label}
                        </span>{" "}
                        <span className="text-neutral-500 dark:text-neutral-400">· {result.kind}</span>
                        <span className="ml-2 font-mono text-xs text-neutral-600 dark:text-neutral-300">{result.parts.map((p) => p.code).join(" · ")}</span>
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            )}
            {uses.length > 0 && (
              <div>
                <p className="mb-1 text-xs font-semibold tracking-wide text-neutral-500 uppercase dark:text-neutral-400">Solutions</p>
                <ul className="space-y-1">
                  {uses.map(({ brand, use, insert }, n) => (
                    <li key={n} className="rounded-lg border border-neutral-200 px-3 py-1.5 dark:border-neutral-700" data-search-use={brand.name}>
                      <Link
                        to={`/solutions/brand/${brand.id}${use.category ? `?category=${encodeURIComponent(use.category)}` : ""}`}
                        className="font-semibold text-blue-700 hover:underline dark:text-blue-300"
                      >
                        {brand.name}
                        {use.category ? ` · ${use.category}` : ""}
                      </Link>{" "}
                      <span className="text-neutral-600 dark:text-neutral-300">– {use.name}: </span>
                      {insert.link ? (
                        <a href={insert.link} target="_blank" rel="noreferrer" className="font-medium hover:underline" title="Open in the e-catalog">
                          {insert.name} ↗
                        </a>
                      ) : (
                        <span className="font-medium">{insert.name}</span>
                      )}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}
      </section>
      <Tabs
        label="Applications"
        items={applications.map((a) => ({ id: a.id, label: a.name }))}
        active={tab?.id}
        onChoose={(id) => {
          setChosen(id);
          remember(LAST_TAB_KEY, id);
        }}
      />
      {types.length > 1 && (
        <Tabs
          label="Code key types"
          small
          items={types}
          active={type?.id}
          onChoose={(id) => {
            setChosenType(id);
            remember(LAST_TYPE_KEY, id);
          }}
        />
      )}
      {type && (
        <CodeKey
          key={`${type.settingKey}:${picked ?? ""}`}
          settingKey={type.settingKey}
          defaultTitle={type.defaultTitle}
          decoder={type.decoder}
          decodeText={picked}
          defaultOpen
        />
      )}
    </div>
  );
}

function Tabs({ label, items, active, onChoose, small }: { label: string; items: { id: string; label: string }[]; active?: string; onChoose: (id: string) => void; small?: boolean }) {
  return (
    <div role="tablist" aria-label={label} className="mb-4 flex flex-wrap gap-2">
      {items.map((t) => (
        <button
          key={t.id}
          type="button"
          role="tab"
          aria-selected={t.id === active}
          onClick={() => onChoose(t.id)}
          className={`rounded-lg border font-medium ${small ? "px-3 py-1 text-xs" : "px-4 py-2 text-sm"} ${
            t.id === active
              ? "border-blue-600 bg-blue-600 text-white"
              : "border-neutral-300 text-neutral-700 hover:bg-neutral-100 dark:border-neutral-700 dark:text-neutral-300 dark:hover:bg-neutral-800"
          }`}
        >
          {t.label}
        </button>
      ))}
    </div>
  );
}

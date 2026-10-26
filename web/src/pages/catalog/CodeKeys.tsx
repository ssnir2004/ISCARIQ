import { useState } from "react";
import { CodeKey } from "../../components/CodeKey";
import { PageHeader } from "../../components/ui";
import type { DecoderName } from "../../lib/insertDecoders";
import { useResource } from "../../lib/useResource";
import type { Application } from "../../lib/types";

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
  { id: "penta", label: "PENTA", settingKey: "codekey.penta", defaultTitle: "PENTA code key", decoder: "penta" },
  { id: "gim", label: "GIM (CUT-GRIP)", settingKey: "codekey.gim", defaultTitle: "GIM code key", decoder: "gim" },
  { id: "bgm", label: "BGM (narrow)", settingKey: "codekey.bgm", defaultTitle: "BGM code key", decoder: "bgm" },
  { id: "gft", label: "GFT (thin)", settingKey: "codekey.gft", defaultTitle: "GFT code key", decoder: "gft" },
];

const MORE_TYPES: Record<string, KeyType[]> = { [DEFAULT_TAB.toLowerCase()]: TURNING_INSERTS, parting: PARTING_BRANDS };

function keyTypes(app: Application): KeyType[] {
  // The tools key keeps its decoder in its own data (e.g. "iso-turning").
  const tools: KeyType = { id: "tools", label: "Tools", settingKey: `codekey.app.${app.id}`, defaultTitle: `${app.name} code key` };
  return [tools, ...(MORE_TYPES[app.name.trim().toLowerCase()] ?? [])];
}

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

  return (
    <div>
      <PageHeader title="Code keys" />
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
      {type && <CodeKey key={type.settingKey} settingKey={type.settingKey} defaultTitle={type.defaultTitle} decoder={type.decoder} defaultOpen />}
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

import { useEffect, useState } from "react";
import { NavLink, Outlet } from "react-router-dom";
import { api } from "../lib/api";
import { useAuth } from "../lib/auth";

const NAV = [
  { to: "/", label: "Pipeline", end: true },
  { to: "/plants", label: "Plants" },
  { to: "/imc", label: "IMC" },
  { to: "/innovations", label: "Innovations" },
  { to: "/solutions", label: "Solutions" },
  { to: "/branches", label: "ISCAR Branches" },
  { to: "/advisor", label: "Insert Advisor" },
  { to: "/calculators", label: "Calculators" },
  { to: "/catalog/npas", label: "NPA Catalog" },
  { to: "/catalog/npa-knowledge", label: "NPA Knowledge Base" },
  { to: "/catalog/inserts", label: "Inserts" },
  { to: "/catalog/test-reports", label: "Test Reports" },
  { to: "/catalog/tools", label: "Tools" },
  { to: "/catalog/cutting-conditions", label: "Cutting Conditions" },
  { to: "/catalog/shapes", label: "Shapes" },
  { to: "/catalog/chipbreakers", label: "Chipbreakers" },
  { to: "/catalog/grades", label: "Grades" },
  { to: "/catalog/code-keys", label: "Code keys" },
  { to: "/catalog/applications", label: "Applications" },
  { to: "/catalog/substrates", label: "Substrates" },
  { to: "/catalog/coatings", label: "Coatings" },
  { to: "/catalog/materials", label: "Materials" },
  { to: "/catalog/problem-tags", label: "Problem Tags" },
  { to: "/catalog/teams", label: "Teams & Departments" },
];

// The menu's order and sections, per user (setting "nav.<user id>"): screens
// by path, sections with a title and dividers (a plain line, no title).
type Entry = { kind: "item"; to: string } | { kind: "section"; id: string; title: string; divider?: boolean };

const DEFAULT_LAYOUT: Entry[] = NAV.map((n) => ({ kind: "item", to: n.to }));

// A saved layout, without screens that no longer exist and with new ones last.
function withAllScreens(saved: Entry[]): Entry[] {
  const known = new Set(NAV.map((n) => n.to));
  const kept = saved.filter((e) => e.kind === "section" || known.has(e.to));
  const placed = new Set(kept.flatMap((e) => (e.kind === "item" ? [e.to] : [])));
  return [...kept, ...NAV.filter((n) => !placed.has(n.to)).map((n): Entry => ({ kind: "item", to: n.to }))];
}

const keyOf = (e: Entry) => (e.kind === "item" ? e.to : e.id);

export function Layout() {
  const { user, logout } = useAuth();
  const [layout, setLayout] = useState<Entry[]>(DEFAULT_LAYOUT);
  const [editing, setEditing] = useState<Entry[] | null>(null);
  const [dragged, setDragged] = useState<number | null>(null);
  const [saving, setSaving] = useState(false);
  const settingKey = user ? `nav.${user.id.toLowerCase()}` : null;

  useEffect(() => {
    if (!settingKey) return;
    api
      .get<{ value: string | null }>(`/settings/${settingKey}`)
      .then((r) => setLayout(r.value ? withAllScreens(JSON.parse(r.value)) : DEFAULT_LAYOUT))
      .catch(() => setLayout(DEFAULT_LAYOUT));
  }, [settingKey]);

  const move = (from: number, to: number) =>
    setEditing((cur) => {
      if (!cur || to < 0 || to >= cur.length || from === to) return cur;
      const next = [...cur];
      const [e] = next.splice(from, 1);
      next.splice(to, 0, e);
      return next;
    });

  const save = async () => {
    if (!editing || !settingKey) return;
    setSaving(true);
    try {
      await api.put(`/settings/${settingKey}`, { value: JSON.stringify(editing) });
      setLayout(editing);
      setEditing(null);
    } finally {
      setSaving(false);
    }
  };

  const label = (to: string) => NAV.find((n) => n.to === to)?.label ?? to;
  const smallButton = "rounded px-1.5 text-neutral-400 hover:bg-neutral-200 hover:text-neutral-700 disabled:opacity-30 dark:hover:bg-neutral-700 dark:hover:text-neutral-200";

  return (
    <div className="flex min-h-screen">
      <aside className="flex w-56 shrink-0 flex-col border-r border-neutral-200 bg-white dark:border-neutral-800 dark:bg-neutral-900">
        <div className="border-b border-neutral-200 px-4 py-4 dark:border-neutral-800">
          <div className="text-sm font-semibold text-neutral-900 dark:text-neutral-100">ISCARIQ</div>
          <div className="text-xs text-neutral-500 dark:text-neutral-400">Schaeffler Account</div>
        </div>
        {editing ? (
          <div className="flex-1 space-y-1 p-2">
            <div className="px-1 pb-1 text-xs text-neutral-500 dark:text-neutral-400">Drag to reorder; add sections or dividers to group screens.</div>
            {editing.map((e, i) => (
              <div
                key={keyOf(e)}
                draggable
                onDragStart={() => setDragged(i)}
                onDragOver={(ev) => {
                  ev.preventDefault();
                  if (dragged !== null && dragged !== i) {
                    move(dragged, i);
                    setDragged(i);
                  }
                }}
                onDragEnd={() => setDragged(null)}
                className={`flex cursor-grab items-center gap-1 rounded-lg border px-2 py-1.5 text-sm ${
                  dragged === i ? "opacity-50" : ""
                } ${
                  e.kind === "section"
                    ? "border-blue-300 bg-blue-50 dark:border-blue-800 dark:bg-blue-950/40"
                    : "border-neutral-200 text-neutral-700 dark:border-neutral-700 dark:text-neutral-200"
                }`}
              >
                <span className="select-none text-neutral-400">⋮⋮</span>
                {e.kind === "item" ? (
                  <span className="flex-1 truncate">{label(e.to)}</span>
                ) : e.divider ? (
                  <span className="flex flex-1 items-center gap-2 text-xs text-neutral-400">
                    <span className="flex-1 border-t border-neutral-400 dark:border-neutral-500" />
                    Divider
                    <span className="flex-1 border-t border-neutral-400 dark:border-neutral-500" />
                  </span>
                ) : (
                  <input
                    value={e.title}
                    placeholder="Separator"
                    onChange={(ev) => setEditing((cur) => cur && cur.map((x, j) => (j === i ? { ...e, title: ev.target.value } : x)))}
                    className="min-w-0 flex-1 rounded border border-neutral-300 bg-white px-1.5 py-0.5 text-xs font-semibold uppercase tracking-wide dark:border-neutral-600 dark:bg-neutral-900"
                  />
                )}
                <button type="button" title="Move up" disabled={i === 0} onClick={() => move(i, i - 1)} className={smallButton}>
                  ↑
                </button>
                <button type="button" title="Move down" disabled={i === editing.length - 1} onClick={() => move(i, i + 1)} className={smallButton}>
                  ↓
                </button>
                {e.kind === "section" && (
                  <button type="button" title={e.divider ? "Remove divider" : "Remove section"} onClick={() => setEditing((cur) => cur && cur.filter((_, j) => j !== i))} className={smallButton}>
                    ✕
                  </button>
                )}
              </div>
            ))}
            <div className="flex gap-1">
              <button
                type="button"
                onClick={() => setEditing((cur) => cur && [...cur, { kind: "section", id: `s${Date.now()}`, title: "New section" }])}
                className="flex-1 rounded-lg border border-dashed border-neutral-300 px-2 py-1.5 text-sm text-neutral-600 hover:bg-neutral-100 dark:border-neutral-700 dark:text-neutral-300 dark:hover:bg-neutral-800"
              >
                + Section
              </button>
              <button
                type="button"
                onClick={() => setEditing((cur) => cur && [...cur, { kind: "section", id: `d${Date.now()}`, title: "", divider: true }])}
                className="flex-1 rounded-lg border border-dashed border-neutral-300 px-2 py-1.5 text-sm text-neutral-600 hover:bg-neutral-100 dark:border-neutral-700 dark:text-neutral-300 dark:hover:bg-neutral-800"
              >
                + Divider
              </button>
            </div>
            <div className="flex gap-1 pt-2">
              <button type="button" disabled={saving} onClick={save} className="flex-1 rounded-lg bg-blue-600 px-3 py-1.5 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-50">
                {saving ? "Saving…" : "Save"}
              </button>
              <button type="button" onClick={() => setEditing(null)} className="rounded-lg px-3 py-1.5 text-sm text-neutral-600 hover:bg-neutral-100 dark:text-neutral-300 dark:hover:bg-neutral-800">
                Cancel
              </button>
            </div>
            <button type="button" onClick={() => setEditing(DEFAULT_LAYOUT)} className="w-full px-3 py-1 text-left text-xs text-neutral-500 hover:underline dark:text-neutral-400">
              Reset to default order
            </button>
          </div>
        ) : (
          <nav className="flex-1 space-y-1 p-2">
            {layout.map((e, i) =>
              e.kind === "section" && e.divider ? (
                <div key={e.id} className="mx-3 my-2 border-t border-neutral-300 dark:border-neutral-700" />
              ) : e.kind === "section" ? (
                <div key={e.id} className={`px-3 pb-1 ${i > 0 ? "mt-3 border-t border-neutral-200 pt-3 dark:border-neutral-800" : "pt-1"}`}>
                  {e.title && <div className="text-xs font-semibold uppercase tracking-wide text-neutral-400 dark:text-neutral-500">{e.title}</div>}
                </div>
              ) : (
                <NavLink
                  key={e.to}
                  to={e.to}
                  end={NAV.find((n) => n.to === e.to)?.end}
                  className={({ isActive }) =>
                    `block rounded-lg px-3 py-2 text-sm font-medium ${
                      isActive
                        ? "bg-blue-50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300"
                        : "text-neutral-600 hover:bg-neutral-100 dark:text-neutral-300 dark:hover:bg-neutral-800"
                    }`
                  }
                >
                  {label(e.to)}
                </NavLink>
              ),
            )}
          </nav>
        )}
        <div className="border-t border-neutral-200 p-3 text-xs dark:border-neutral-800">
          <div className="mb-2 truncate text-neutral-500 dark:text-neutral-400">{user?.email}</div>
          {!editing && (
            <button
              onClick={() => setEditing(layout)}
              className="w-full rounded-lg px-3 py-1.5 text-left text-neutral-600 hover:bg-neutral-100 dark:text-neutral-300 dark:hover:bg-neutral-800"
            >
              Customize menu
            </button>
          )}
          <NavLink
            to="/change-password"
            className="block w-full rounded-lg px-3 py-1.5 text-left text-neutral-600 hover:bg-neutral-100 dark:text-neutral-300 dark:hover:bg-neutral-800"
          >
            Change Password
          </NavLink>
          <button
            onClick={() => logout()}
            className="w-full rounded-lg px-3 py-1.5 text-left text-neutral-600 hover:bg-neutral-100 dark:text-neutral-300 dark:hover:bg-neutral-800"
          >
            Sign out
          </button>
        </div>
      </aside>
      <main className="flex-1 overflow-x-auto bg-neutral-50 p-6 dark:bg-neutral-950">
        <Outlet />
      </main>
    </div>
  );
}

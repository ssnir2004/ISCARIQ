import { useState, type KeyboardEvent } from "react";
import type { Grade } from "../../lib/types";

// Search box for the Grades screen: type part of a grade name, pick a match
// (click, or arrows + Enter) to open its card.
export function GradeSearch({ grades, onPick }: { grades: Grade[]; onPick: (grade: Grade) => void }) {
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState(0);

  const q = query.trim().toLowerCase();
  const matches = q
    ? grades
        .filter((g) => g.name.toLowerCase().includes(q) || (g.description ?? "").toLowerCase().includes(q))
        // Names starting with the query first, then by name.
        .sort((a, b) => Number(!a.name.toLowerCase().startsWith(q)) - Number(!b.name.toLowerCase().startsWith(q)) || a.name.localeCompare(b.name))
        .slice(0, 8)
    : [];

  function pick(grade: Grade) {
    onPick(grade);
    setQuery("");
    setOpen(false);
  }

  function onKeyDown(e: KeyboardEvent<HTMLInputElement>) {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActive((i) => Math.min(i + 1, matches.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActive((i) => Math.max(i - 1, 0));
    } else if (e.key === "Enter" && matches[active]) {
      e.preventDefault();
      pick(matches[active]);
    } else if (e.key === "Escape") {
      setOpen(false);
    }
  }

  return (
    <div className="relative mb-1.5 w-56">
      <input
        type="search"
        value={query}
        placeholder="Search grade…"
        aria-label="Search grade"
        onChange={(e) => {
          setQuery(e.target.value);
          setActive(0);
          setOpen(true);
        }}
        onFocus={() => setOpen(true)}
        // Delay so a click on a result registers before the list closes.
        onBlur={() => setTimeout(() => setOpen(false), 150)}
        onKeyDown={onKeyDown}
        className="w-full rounded-lg border border-neutral-300 bg-white px-3 py-1 text-sm outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 dark:border-neutral-700 dark:bg-neutral-950 dark:text-neutral-100"
      />
      {open && q && (
        <ul
          role="listbox"
          className="absolute right-0 z-40 mt-1 max-h-72 w-72 overflow-y-auto rounded-lg border border-neutral-200 bg-white py-1 text-sm shadow-lg dark:border-neutral-700 dark:bg-neutral-900"
        >
          {matches.length === 0 ? (
            <li className="px-3 py-2 text-neutral-500 dark:text-neutral-400">No grade matches "{query.trim()}"</li>
          ) : (
            matches.map((g, i) => (
              <li
                key={g.id}
                role="option"
                aria-selected={i === active}
                onMouseDown={(e) => e.preventDefault()}
                onClick={() => pick(g)}
                onMouseEnter={() => setActive(i)}
                className={`cursor-pointer px-3 py-1.5 ${i === active ? "bg-blue-50 dark:bg-blue-900/30" : ""}`}
              >
                <span className="font-medium text-neutral-900 dark:text-neutral-100">{g.name}</span>
                {g.description && <span className="ml-2 truncate text-xs text-neutral-500 dark:text-neutral-400">{g.description}</span>}
              </li>
            ))
          )}
        </ul>
      )}
    </div>
  );
}

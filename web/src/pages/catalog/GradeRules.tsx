import { useState, type KeyboardEvent } from "react";
import { api, ApiError } from "../../lib/api";
import { useResource } from "../../lib/useResource";
import type { GradeFamily, GradeRule } from "../../lib/types";
import { Button, Card, Textarea } from "../../components/ui";

const OPEN_KEY = "iscariq.grades.rulesOpen.";

function readOpen(family: GradeFamily) {
  try {
    return localStorage.getItem(OPEN_KEY + family) !== "0";
  } catch {
    return true;
  }
}

// Rules of thumb for one grade family: a numbered list shown on the family's
// Grades tab, with add, edit, delete and reorder. Collapsible (remembered
// per family). Text may be in any language (dir="auto").
export function GradeRules({ family }: { family: GradeFamily }) {
  const { data: rules, reload } = useResource<GradeRule>(`/grade-rules?family=${family}`);
  const [open, setOpen] = useState(() => readOpen(family));
  const [draft, setDraft] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editText, setEditText] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  function toggle() {
    setOpen((o) => {
      try {
        localStorage.setItem(OPEN_KEY + family, o ? "0" : "1");
      } catch {
        // not remembered
      }
      return !o;
    });
  }

  async function run(action: () => Promise<unknown>, failure: string) {
    setError(null);
    setBusy(true);
    try {
      await action();
      await reload();
      return true;
    } catch (err) {
      setError(err instanceof ApiError ? err.message : failure);
      return false;
    } finally {
      setBusy(false);
    }
  }

  async function add() {
    const text = draft.trim();
    if (!text) return;
    if (await run(() => api.post("/grade-rules", { family, text }), "Failed to add the rule")) setDraft("");
  }

  async function saveEdit() {
    const text = editText.trim();
    if (!editingId || !text) return;
    if (await run(() => api.patch(`/grade-rules/${editingId}`, { text }), "Failed to save the rule")) setEditingId(null);
  }

  function remove(rule: GradeRule) {
    if (!confirm("Delete this rule?")) return;
    run(() => api.delete(`/grade-rules/${rule.id}`), "Failed to delete the rule");
  }

  function move(index: number, step: number) {
    const ids = rules.map((r) => r.id);
    const [id] = ids.splice(index, 1);
    ids.splice(index + step, 0, id);
    run(() => api.put("/grade-rules/order", { family, ids }), "Failed to reorder");
  }

  // Enter saves; Shift+Enter starts a new line.
  const onEnter = (save: () => void) => (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      save();
    }
  };

  return (
    <Card className="mb-4 p-3" data-grade-rules>
      <button type="button" onClick={toggle} aria-expanded={open} className="flex w-full items-center gap-2 text-left">
        <span className="text-xs text-neutral-500">{open ? "▼" : "▶"}</span>
        <span className="font-semibold text-neutral-900 dark:text-neutral-100">Rules of thumb</span>
        <span className="text-xs text-neutral-500 dark:text-neutral-400">{rules.length}</span>
      </button>
      {open && (
        <div className="mt-2 space-y-2">
          {rules.length === 0 && <p className="text-sm text-neutral-500 dark:text-neutral-400">No rules yet. Add the first one below.</p>}
          <ol className="space-y-1">
            {rules.map((rule, i) => (
              <li key={rule.id} className="group flex items-start gap-2 rounded-lg px-1 py-0.5 hover:bg-neutral-50 dark:hover:bg-neutral-800/50">
                <span className="w-6 shrink-0 pt-0.5 text-right text-sm font-semibold text-neutral-500 tabular-nums">{i + 1}.</span>
                {editingId === rule.id ? (
                  <div className="flex-1 space-y-1">
                    <Textarea
                      dir="auto"
                      rows={2}
                      value={editText}
                      onChange={(e) => setEditText(e.target.value)}
                      onKeyDown={(e) => (e.key === "Escape" ? setEditingId(null) : onEnter(saveEdit)(e))}
                      aria-label="Rule text"
                      autoFocus
                    />
                    <div className="flex gap-2">
                      <Button type="button" onClick={saveEdit} disabled={busy}>
                        Save
                      </Button>
                      <Button type="button" variant="secondary" onClick={() => setEditingId(null)}>
                        Cancel
                      </Button>
                    </div>
                  </div>
                ) : (
                  <>
                    <p dir="auto" className="flex-1 text-sm whitespace-pre-line text-neutral-800 dark:text-neutral-200" data-rule>
                      {rule.text}
                    </p>
                    <span className="flex shrink-0 gap-0.5 text-xs opacity-0 transition-opacity group-hover:opacity-100 focus-within:opacity-100">
                      <button type="button" disabled={i === 0 || busy} onClick={() => move(i, -1)} className="rounded px-1.5 py-0.5 hover:bg-neutral-200 disabled:opacity-30 dark:hover:bg-neutral-700" aria-label="Move up">
                        ↑
                      </button>
                      <button
                        type="button"
                        disabled={i === rules.length - 1 || busy}
                        onClick={() => move(i, 1)}
                        className="rounded px-1.5 py-0.5 hover:bg-neutral-200 disabled:opacity-30 dark:hover:bg-neutral-700"
                        aria-label="Move down"
                      >
                        ↓
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setEditingId(rule.id);
                          setEditText(rule.text);
                        }}
                        className="rounded px-1.5 py-0.5 text-blue-600 hover:bg-neutral-200 dark:text-blue-400 dark:hover:bg-neutral-700"
                      >
                        Edit
                      </button>
                      <button type="button" onClick={() => remove(rule)} className="rounded px-1.5 py-0.5 text-red-600 hover:bg-neutral-200 dark:text-red-400 dark:hover:bg-neutral-700">
                        Delete
                      </button>
                    </span>
                  </>
                )}
              </li>
            ))}
          </ol>
          <div className="flex items-start gap-2">
            <Textarea
              dir="auto"
              rows={1}
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
              onKeyDown={onEnter(add)}
              placeholder="Add a rule (Enter to add, Shift+Enter for a new line)"
              aria-label="New rule"
              className="flex-1"
            />
            <Button type="button" onClick={add} disabled={busy || !draft.trim()}>
              Add rule
            </Button>
          </div>
          {error && <p className="text-sm text-red-600 dark:text-red-400">{error}</p>}
        </div>
      )}
    </Card>
  );
}

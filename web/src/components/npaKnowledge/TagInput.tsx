import { useState, type KeyboardEvent } from "react";
import { Input } from "../ui";

export function TagInput({
  value,
  onChange,
  suggestions = [],
  placeholder = "Type and press Enter…",
}: {
  value: string[];
  onChange: (tags: string[]) => void;
  suggestions?: string[];
  placeholder?: string;
}) {
  const [draft, setDraft] = useState("");

  function addTag(raw: string) {
    const tag = raw.trim();
    if (!tag || value.includes(tag)) return;
    onChange([...value, tag]);
    setDraft("");
  }

  function removeTag(tag: string) {
    onChange(value.filter((t) => t !== tag));
  }

  function onKeyDown(e: KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault();
      addTag(draft);
    } else if (e.key === "Backspace" && !draft && value.length > 0) {
      removeTag(value[value.length - 1]);
    }
  }

  const remainingSuggestions = suggestions.filter((s) => !value.includes(s));

  return (
    <div>
      <div className="flex flex-wrap gap-1.5 rounded-lg border border-neutral-300 p-2 dark:border-neutral-700">
        {value.map((tag) => (
          <span
            key={tag}
            className="flex items-center gap-1 rounded-full bg-blue-50 px-2 py-0.5 text-xs text-blue-700 dark:bg-blue-900/30 dark:text-blue-300"
          >
            {tag}
            <button type="button" onClick={() => removeTag(tag)} className="text-blue-500 hover:text-blue-800 dark:hover:text-blue-100">
              ✕
            </button>
          </span>
        ))}
        <Input
          className="min-w-[10rem] flex-1 border-none p-0 focus:ring-0"
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          onKeyDown={onKeyDown}
          onBlur={() => draft && addTag(draft)}
          placeholder={value.length === 0 ? placeholder : ""}
        />
      </div>
      {remainingSuggestions.length > 0 && (
        <div className="mt-1.5 flex flex-wrap gap-1.5">
          {remainingSuggestions.map((s) => (
            <button
              key={s}
              type="button"
              onClick={() => addTag(s)}
              className="rounded-full border border-neutral-200 px-2 py-0.5 text-xs text-neutral-500 hover:border-blue-400 hover:text-blue-600 dark:border-neutral-700 dark:text-neutral-400 dark:hover:border-blue-500 dark:hover:text-blue-400"
            >
              + {s}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

import { useEffect, useState, type ReactNode } from "react";
import { Button } from "./ui";

// An add form hidden behind a "+ Add …" button that opens and closes it
// ("✕ Close" while open). While an entry is being edited the form shows
// regardless; closing it then cancels the edit.
export function AddSection({
  label,
  editing = false,
  onCancelEdit,
  openSignal,
  children,
}: {
  // What is added, e.g. "insert" -> "+ Add insert".
  label: string;
  editing?: boolean;
  onCancelEdit?: () => void;
  // Opens the form whenever it changes (e.g. a "+ Subcategory" button elsewhere).
  openSignal?: number;
  children: ReactNode;
}) {
  const [open, setOpen] = useState(false);
  useEffect(() => {
    if (openSignal) setOpen(true);
  }, [openSignal]);
  const shown = open || editing;

  function toggle() {
    if (!shown) return setOpen(true);
    setOpen(false);
    if (editing) onCancelEdit?.();
  }

  return (
    <>
      <Button type="button" variant={shown ? "secondary" : "primary"} className={shown ? "mb-3" : "mb-6"} onClick={toggle} aria-expanded={shown} data-add-toggle>
        {shown ? "✕ Close" : `+ Add ${label}`}
      </Button>
      {shown && children}
    </>
  );
}

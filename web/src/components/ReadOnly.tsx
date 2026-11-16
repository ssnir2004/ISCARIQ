import { useEffect, type RefObject } from "react";

// For viewers: hides the controls that change data (add, edit, delete, save,
// move, upload, …) inside `root`, including ones rendered later. The server
// refuses any change by a viewer anyway; this keeps the screens clean.
// Mark a control `data-viewer-ok` to keep it.
// "+ Add …" and "+ New …" but not a map's "+" zoom button.
const EDIT_WORDS = /^(\+\s*\p{L}|✎|✏|🗑|(edit|delete|remove|rename|save|saving|add|new|upload|import|replace|move|duplicate|discard|customize)\b)/iu;
const EDIT_LABELS = /\b(edit|delete|remove|rename|upload|replace|move|reorder|drag)\b/i;

function isEditControl(el: HTMLElement) {
  if (el.closest("[data-viewer-ok]")) return false;
  if (el instanceof HTMLInputElement && el.type === "file") return true;
  if (el.dataset.addToggle !== undefined) return true;
  const text = (el.textContent ?? "").trim();
  const label = `${el.getAttribute("aria-label") ?? ""} ${el.getAttribute("title") ?? ""}`;
  return EDIT_WORDS.test(text) || EDIT_LABELS.test(label) || el.classList.contains("bg-red-600");
}

function hide(root: HTMLElement) {
  root.querySelectorAll<HTMLElement>("button, input[type=file], [role=button], label:has(> input[type=file])").forEach((el) => {
    if (el.dataset.viewerHidden === undefined && isEditControl(el)) {
      el.dataset.viewerHidden = "";
      el.style.setProperty("display", "none", "important");
    }
  });
  root.querySelectorAll<HTMLElement>("[draggable=true]").forEach((el) => {
    if (!el.closest("[data-viewer-ok]")) el.draggable = false;
  });
}

export function useReadOnly(root: RefObject<HTMLElement | null>, readOnly: boolean) {
  useEffect(() => {
    const el = root.current;
    if (!readOnly || !el) return;
    hide(el);
    let queued = false;
    const observer = new MutationObserver(() => {
      if (queued) return;
      queued = true;
      // A timer, not requestAnimationFrame, which doesn't run in background tabs.
      setTimeout(() => {
        queued = false;
        hide(el);
      }, 0);
    });
    observer.observe(el, { childList: true, subtree: true, characterData: true });
    return () => observer.disconnect();
  }, [root, readOnly]);
}

import { useEffect, useRef, type ClipboardEvent } from "react";
import { Button } from "../ui";

function readFileAsDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

export function ClipboardImagePaste({ value, onChange }: { value: string | null; onChange: (dataUrl: string | null) => void }) {
  const zoneRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  async function handlePaste(e: ClipboardEvent<HTMLDivElement>) {
    const item = Array.from(e.clipboardData.items).find((i) => i.type.startsWith("image/"));
    const file = item?.getAsFile();
    if (!file) return;
    e.preventDefault();
    onChange(await readFileAsDataUrl(file));
  }

  async function onFilePicked(files: FileList | null) {
    const file = files?.[0];
    if (!file) return;
    onChange(await readFileAsDataUrl(file));
  }

  useEffect(() => {
    // Also allow pasting anywhere while this field is the last-focused target.
    const el = zoneRef.current;
    if (!el) return;
    el.tabIndex = 0;
  }, []);

  if (value) {
    return (
      <div className="flex items-center gap-3">
        <img src={value} alt="Representative" className="h-20 w-20 rounded-lg border border-neutral-200 object-cover dark:border-neutral-700" />
        <div className="flex flex-col gap-1">
          <Button type="button" variant="secondary" onClick={() => inputRef.current?.click()}>
            Replace
          </Button>
          <Button type="button" variant="ghost" onClick={() => onChange(null)}>
            Remove
          </Button>
        </div>
        <input ref={inputRef} type="file" accept="image/*" className="hidden" onChange={(e) => onFilePicked(e.target.files)} />
      </div>
    );
  }

  return (
    <div
      ref={zoneRef}
      onPaste={handlePaste}
      onClick={() => inputRef.current?.click()}
      className="flex cursor-pointer flex-col items-center justify-center gap-1 rounded-lg border-2 border-dashed border-neutral-300 p-4 text-center text-xs text-neutral-500 outline-none hover:border-blue-400 focus:border-blue-500 dark:border-neutral-700 dark:text-neutral-400"
    >
      <span>Click to focus, then press Ctrl+V to paste an image — or click to choose a file</span>
      <input ref={inputRef} type="file" accept="image/*" className="hidden" onChange={(e) => onFilePicked(e.target.files)} />
    </div>
  );
}

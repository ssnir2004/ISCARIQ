import { useRef, useState, type DragEvent } from "react";
import { Button } from "../ui";

export interface PendingFile {
  name: string;
  data: string;
  size: number;
  type: string;
}

function readFileAsDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

function formatSize(bytes: number) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export function NpaFileDropzone({
  file,
  onChange,
  accept = ".pdf,.msg,.docx,.pptx,image/*",
}: {
  file: PendingFile | null;
  onChange: (file: PendingFile | null) => void;
  accept?: string;
}) {
  const [dragging, setDragging] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  async function handleFiles(files: FileList | null) {
    const f = files?.[0];
    if (!f) return;
    onChange({ name: f.name, data: await readFileAsDataUrl(f), size: f.size, type: f.type || "unknown" });
  }

  function onDrop(e: DragEvent<HTMLDivElement>) {
    e.preventDefault();
    setDragging(false);
    handleFiles(e.dataTransfer.files);
  }

  if (file) {
    return (
      <div className="flex items-center justify-between gap-2 rounded-lg border border-neutral-300 p-3 text-sm dark:border-neutral-700">
        <div className="min-w-0">
          <div className="truncate font-medium text-neutral-900 dark:text-neutral-100">{file.name}</div>
          <div className="text-xs text-neutral-500 dark:text-neutral-400">
            {formatSize(file.size)} · {file.type}
          </div>
        </div>
        <div className="flex shrink-0 gap-1">
          <Button type="button" variant="secondary" onClick={() => inputRef.current?.click()}>
            Replace
          </Button>
          <Button type="button" variant="ghost" onClick={() => onChange(null)}>
            Remove
          </Button>
        </div>
        <input ref={inputRef} type="file" accept={accept} className="hidden" onChange={(e) => handleFiles(e.target.files)} />
      </div>
    );
  }

  return (
    <div
      onDragOver={(e) => {
        e.preventDefault();
        setDragging(true);
      }}
      onDragLeave={() => setDragging(false)}
      onDrop={onDrop}
      onClick={() => inputRef.current?.click()}
      className={`flex cursor-pointer flex-col items-center justify-center gap-1 rounded-lg border-2 border-dashed p-6 text-center text-sm transition ${
        dragging
          ? "border-blue-500 bg-blue-50 dark:bg-blue-900/20"
          : "border-neutral-300 text-neutral-500 hover:border-blue-400 dark:border-neutral-700 dark:text-neutral-400"
      }`}
    >
      <span className="font-medium">Drag NPA file here or click to upload</span>
      <span className="text-xs">PDF, MSG, DOCX, PPTX, image…</span>
      <input ref={inputRef} type="file" accept={accept} className="hidden" onChange={(e) => handleFiles(e.target.files)} />
    </div>
  );
}

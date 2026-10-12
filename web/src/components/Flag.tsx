import { useEffect, useState } from "react";

// A country's flag (ISO alpha-2 code). The flag set is large, so it loads
// once, on demand, in its own chunk; until then nothing is shown.

type Flags = Record<string, string>;
let cache: Flags | null = null;
let loading: Promise<Flags> | null = null;

function loadFlags() {
  loading ??= import("country-flag-icons/string/3x2").then((m) => (cache = m as unknown as Flags));
  return loading;
}

export function Flag({ code, className = "h-4 w-6" }: { code: string | null | undefined; className?: string }) {
  const [flags, setFlags] = useState<Flags | null>(cache);

  useEffect(() => {
    if (!flags) loadFlags().then(setFlags);
  }, [flags]);

  const svg = code && flags ? flags[code.toUpperCase()] : undefined;
  if (!svg) return null;
  return (
    <img
      src={`data:image/svg+xml;utf8,${encodeURIComponent(svg)}`}
      alt=""
      aria-hidden
      className={`inline-block shrink-0 rounded-[2px] object-cover ring-1 ring-black/10 ${className}`}
      data-flag={code}
    />
  );
}

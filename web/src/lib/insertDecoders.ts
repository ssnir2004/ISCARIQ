import { decodeIsoTurning } from "./isoTurning";

// Designation decoders for the code keys: each splits a designation into
// parts, each naming the key's section (by its key or title) and the code;
// numeric parts come with their value in words. The code key then shows each
// part's meaning (and picture) from its tables.

export interface DecodedPart {
  // The code key section: by key (e.g. "p5") or by title.
  key?: string;
  title?: string;
  code: string;
  text?: string;
  // The code key row to show when it isn't the code itself (e.g. "M…W").
  lookup?: string;
}
export interface Decoded {
  kind: string;
  parts: DecodedPart[];
}

export type DecoderName = "iso-turning" | "iso-insert" | "cbn" | "ceramic" | "pcd" | "do-grip";

const mm = (digits: string, scale = 1) => `${Number((Number(digits) * scale).toFixed(3))} mm`;
const squash = (s: string) => s.toUpperCase().replace(/\s+/g, "");
// The ISO 1832 base shared by CBN, ceramic and PCD inserts (e.g. CNGA 120408).
const ISO_BASE = "ISO insert (shape, clearance, tolerance, type, size, thickness, corner radius — see the Carbide code key)";

// ISO 1832 carbide insert, e.g. WNMG 080408 E-GN. Spaces after the shape
// letters separate parts like dashes (so "080408 SF" is chipformer SF, not
// cutting edge S); the cutting edge letter stands alone.
function decodeIsoInsert(text: string): Decoded | null {
  const d = text.toUpperCase().trim().replace(/^([A-Z]{4})\s+/, "$1").replace(/\s+/g, "-").replace(/-+/g, "-");
  const m = d.match(/^([A-Z])([A-Z])([A-Z])([A-Z])(\d{2})(T\d|\d{2})(\d{2})-?([FETS](?=-|$))?-?(.+)?$/);
  if (!m) return null;
  return {
    kind: "ISO insert",
    parts: [
      { title: "1 · Shape", code: m[1] },
      { title: "2 · Clearance angle", code: m[2] },
      { title: "3 · Tolerance", code: m[3] },
      { title: "4 · Type", code: m[4] },
      { title: "5 · Cutting edge length", code: m[5], text: `Cutting edge length ${mm(m[5])}` },
      { title: "6 · Thickness", code: m[6] },
      { title: "7 · Corner radius", code: m[7] },
      ...(m[8] ? [{ title: "8 · Cutting edge (optional)", code: m[8] }] : []),
      ...(m[9] ? [{ title: "9 · Chipformer", code: m[9] }] : []),
    ],
  };
}

// CBN insert, e.g. CNGA 120408S (N) 2MT MF BI15HC (edge preparation may
// carry its land: S01220 = W 0.12 mm, A 20°).
function decodeCbn(text: string): Decoded | null {
  const m = squash(text).match(/^([A-Z]{4}\d{6})(LF|LE|LS|HF|HE|HS|[SETP])(\d{5})?(?:\(([RLN])\))?(\d?MT|#MT|HS|S|L)?(MF|MM|MR)?(BI\d{2})([HKS])?(C)?$/);
  if (!m) return null;
  const semi = m[2].length === 2;
  return {
    kind: "CBN insert",
    parts: [
      { code: m[1], text: ISO_BASE },
      { title: semi ? "Edge preparation – Semi-Standard" : "Edge preparation – Standard", code: m[2] },
      ...(m[3] ? [{ code: m[3], text: `Negative land: W ${mm(m[3].slice(0, 3), 0.01)}, A ${Number(m[3].slice(3))}°` }] : []),
      ...(m[4] ? [{ title: "Hand", code: m[4] }] : []),
      ...(m[5] ? [{ title: "Number of cutting edges / form", code: m[5] }] : []),
      ...(m[6] ? [{ title: "Chip breaker", code: m[6] }] : []),
      { title: "CBN grade", code: m[7] },
      ...(m[8] ? [{ title: "Target material", code: m[8] }] : []),
      ...(m[9] ? [{ title: "Coating", code: m[9] }] : []),
    ],
  };
}

// Ceramic insert, e.g. CNGA 120408 WL T01020 IS45C.
function decodeCeramic(text: string): Decoded | null {
  const m = squash(text).match(/^([A-Z]{4}\d{6})(AG|WL)?([SETP])(\d{3})(\d{2})?(IS\d{2})(C)?$/);
  if (!m) return null;
  return {
    kind: "Ceramic insert",
    parts: [
      { code: m[1], text: ISO_BASE },
      ...(m[2] ? [{ title: "Chip breaker or Wiper", code: m[2] }] : []),
      { title: "Edge preparation – Standard", code: m[3] },
      { title: "Chamfer width and honing", code: `${m[3]}${m[4]}`, text: `${mm(m[4], 0.01)}` },
      ...(m[5] ? [{ title: "Chamfer angle", code: m[5] }] : []),
      { title: "Ceramic grade", code: m[6] },
      ...(m[7] ? [{ title: "Coating", code: m[7] }] : []),
    ],
  };
}

// PCD insert, e.g. CNGA 120408F (N) L MD ID5.
function decodePcd(text: string): Decoded | null {
  const m = squash(text).match(/^([A-Z]{4}\d{6})(F)?(?:\(([RLN])\))?(HS|MT|L)?(MD|RD)?(ID\d)$/);
  if (!m) return null;
  return {
    kind: "PCD insert",
    parts: [
      { code: m[1], text: ISO_BASE },
      ...(m[2] ? [{ title: "Edge preparation – Standard", code: m[2] }] : []),
      ...(m[3] ? [{ title: "Hand", code: m[3] }] : []),
      ...(m[4] ? [{ title: "Form", code: m[4] }] : []),
      ...(m[5] ? [{ title: "Chip breaker", code: m[5] }] : []),
      { title: "PCD grade / target material", code: m[6] },
    ],
  };
}

// DO-GRIP parting insert, e.g. DGR 3100JS-15D: family DG (HG: 3 mm twisted
// geometry), hand, a variant letter (e.g. DGNC), nominal width and corner
// radii (x10 mm), chipformer (a trailing S: sharp corners), lead angle in
// degrees. Sections keyed "dg-<part>".
function decodeDoGrip(text: string): Decoded | null {
  const m = text
    .toUpperCase()
    .replace(/\s+/g, "")
    .match(/^(DG|HG)([NRL])([A-Z])?-?(\d{2})(\d{2})([A-Z]+)?(?:-(\d{1,2})(D)?)?$/);
  if (!m) return null;
  const width = Number(m[4]) / 10;
  const radius = Number(m[5]) / 10;
  // JS = chipformer J with sharp corners (S); a lone S is a chipformer itself.
  const chip = m[6] && m[6].length > 1 && m[6].endsWith("S") ? [m[6].slice(0, -1), "S"] : m[6] ? [m[6]] : [];
  return {
    kind: "DO-GRIP insert",
    parts: [
      { key: "dg-family", code: m[1] },
      { key: "dg-hand", code: m[2] },
      ...(m[3] ? [{ key: "dg-variant", code: m[3] }] : []),
      { key: "dg-width", code: m[4], text: `Nominal insert width ${width} mm` },
      { key: "dg-radius", code: m[5], text: radius ? `Corner radii ${radius} mm` : "Corner radii 0 (sharp)" },
      ...(chip[0] ? [{ key: "dg-chip", code: chip[0] }] : []),
      ...(chip[1] ? [{ key: "dg-sharp", code: chip[1] }] : []),
      ...(m[7] ? [{ key: "dg-lead", code: m[7], text: `Lead angle ${Number(m[7])}°` }] : []),
      ...(m[8] ? [{ key: "dg-degree", code: m[8] }] : []),
    ],
  };
}

export const DECODERS: Record<DecoderName, { decode: (text: string) => Decoded | null; examples: string }> = {
  "iso-turning": { decode: decodeIsoTurning, examples: "MWLNR 2525M-08W or S25S MWLNR-08W" },
  "iso-insert": { decode: decodeIsoInsert, examples: "WNMG 080408 E-GN" },
  cbn: { decode: decodeCbn, examples: "CNGA 120408S (N) 2MT MF BI15HC" },
  ceramic: { decode: decodeCeramic, examples: "CNGA 120408 WL T01020 IS45C" },
  pcd: { decode: decodePcd, examples: "CNGA 120408F (N) L MD ID5" },
  "do-grip": { decode: decodeDoGrip, examples: "DGR 3100JS-15D or DGN 3102J" },
};

// A table row for a code: exact, else a pattern row ("##", "BIxx", "ISxx")
// whose x / # stand for any character.
export function findRow<R extends { code: string }>(rows: R[], code: string): R | undefined {
  return (
    rows.find((r) => r.code === code) ??
    rows.find((r) => r.code.length === code.length && /[x#]/.test(r.code) && [...r.code].every((c, i) => c === "x" || c === "#" || c === code[i]))
  );
}

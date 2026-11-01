import type { Decoded, DecodedPart } from "./insertDecoders";
import { TL_FAMS, TL_SHAPES } from "./turningLinesData";

// Turning catalog brands (turning, grooving & parting, Swiss-type and
// threading lines): one decoder per brand, driven by the e-catalog's items. A
// designation is matched by its shape (digits as #, spaces and the grade
// dropped: PICCO R 050.06-2 -> PICCOR#.#-#), which gives its brand and
// family; the tokens are then read one by one.

const GRADE = /^(IC|IB|IS|ID|IN|IW|IK)\d{2,4}[A-Z]{0,3}$/;
const PREFIX = new Set(["HSK", "AVC", "KIT", "VDI", "SET"]);
const LENGTH: Record<string, number> = { A: 32, B: 40, C: 50, D: 60, E: 70, F: 80, G: 90, H: 100, J: 110, K: 125, L: 140, M: 150, N: 160, P: 170, Q: 180, R: 200, S: 250, T: 300, U: 350, V: 400, W: 450, Y: 500 };
const THREADS: Record<string, string> = {
  ISO: "ISO metric thread", UN: "Unified (UN) thread", W: "Whitworth thread", BSPT: "BSPT pipe thread", NPT: "NPT pipe thread", NPTF: "NPTF dryseal pipe thread",
  TR: "Trapezoidal DIN 103 thread", ACME: "ACME thread", STACME: "Stub ACME thread", API: "API thread", RND: "Round DIN 405 thread", ABUT: "American buttress thread",
  BUT: "Buttress thread", EL: "Elastic thread", MJ: "MJ aerospace thread", UNJ: "UNJ aerospace thread", PG: "PG conduit thread", NPS: "NPS straight pipe thread",
};

export function normalize(text: string) {
  return text.toUpperCase().replace(/\([^)]*\)/g, "").replace(/[*°]/g, "").replace(/\s*-\s*/g, "-").replace(/\s*\/\s*/g, "/").replace(/\s+/g, " ").trim();
}

function shapeOf(s: string): [string, string | null] {
  const t = s.split(" ");
  const grade = t.length > 1 && GRADE.test(t[t.length - 1]) ? t.pop()! : null;
  return [t.join("").replace(/\d+(\.\d+)?/g, "#"), grade];
}

function readTokens(s: string, insert: boolean, desc: string, parts: DecodedPart[]) {
  let family = false;
  for (const tok of s.split(/[\s-]+/).filter(Boolean)) {
    let m: RegExpMatchArray | null;
    if (!family && (m = tok.match(/^(\d{2})([A-Z]{2,}[A-Z0-9]*)$/))) {
      parts.push({ key: "t-size", code: m[1], text: `Insert size ${Number(m[1])} (inscribed circle / cutting edge length code)` });
      parts.push({ key: "t-family", code: m[2], text: desc });
      family = true;
    } else if (!family && /^[A-Z]{2,}/.test(tok) && !PREFIX.has(tok)) {
      parts.push({ key: "t-family", code: tok, text: desc });
      family = true;
    } else if ((m = tok.match(/^C(\d)$/))) {
      parts.push({ key: "t-adapt", code: tok, text: `CAMFIX C${m[1]} polygonal taper adaptation` });
    } else if (PREFIX.has(tok)) {
      parts.push({ key: "t-adapt", code: tok, text: { HSK: "HSK adaptation", AVC: "Anti-vibration (WHISPERLINE) bar", KIT: "Kit", VDI: "VDI adaptation", SET: "Set" }[tok]! });
    } else if (THREADS[tok]) {
      parts.push({ key: "t-thread", code: tok, text: THREADS[tok] });
    } else if (!insert && (m = tok.match(/^(\d{2})(\d{2})([A-Z])$/)) && LENGTH[m[3]]) {
      parts.push({ key: "t-shank", code: tok, text: `Shank ${Number(m[1])} × ${Number(m[2])} mm, tool length ${m[3]} (${LENGTH[m[3]]} mm)` });
    } else if (insert && /^\d{3,4}[A-Z]{0,3}$/.test(tok)) {
      parts.push({ key: "t-size", code: tok, text: `Size code ${tok}: width / insert size, then corner radius or version (see the catalog)` });
    } else if (!insert && (m = tok.match(/^(\d{2})(\d{2})$/))) {
      parts.push({ key: "t-shank", code: tok, text: `Shank ${Number(m[1])} × ${Number(m[2])} mm` });
    } else if (insert && (m = tok.match(/^(\d{2})(\d{2}|T\d)(\d{2})([A-Z]*)$/))) {
      parts.push({ key: "t-size", code: tok, text: `Insert size ${Number(m[1])}, thickness code ${m[2]}, corner radius ${Number(m[3]) / 10} mm${m[4] ? ` (${m[4]})` : ""}` });
    } else if ((m = tok.match(/^D(\d+(?:\.\d+)?)$/))) {
      parts.push({ key: "t-dims", code: tok, text: `Diameter ${Number(m[1])} mm (minimum bore or bar diameter)` });
    } else if (/^\d+\.\d+$/.test(tok)) {
      parts.push({ key: "t-dims", code: tok, text: `Dimension ${tok} mm: width, corner radius, pitch or depth (see the catalog)` });
    } else if (/^\d+$/.test(tok)) {
      parts.push({ key: "t-dims", code: tok, text: `Size code ${tok}: insert size, width, depth, pitch or TPI (see the catalog)` });
    } else if (tok === "R" || tok === "L" || tok === "N") {
      parts.push({ key: "t-hand", code: tok, text: { R: "Right-hand", L: "Left-hand", N: "Neutral" }[tok]! });
    } else if (tok === "JHP" || tok === "MC" || tok === "SL" || tok === "Y" || tok === "IQ" || tok === "Q") {
      parts.push({ key: "t-option", code: tok, text: { JHP: "JETHP: high-pressure coolant through the tool", MC: "Multi-coolant connection (JHP-MC)", SL: "Safety-lock clamping", Y: "Y-axis tool", IQ: "IQ version", Q: "Q-LOCK clamping" }[tok]! });
    } else {
      parts.push({ key: "t-suffix", code: tok, text: `Version, chipformer or dimension code ${tok} (see the catalog)` });
    }
  }
}

export const turningLineDecoder = (brand: string) => (text: string): Decoded | null => {
  const s = normalize(text);
  const [shape, grade] = shapeOf(s);
  const fam = TL_SHAPES[shape]?.find((f) => TL_FAMS[f][0] === brand);
  if (fam === undefined) return null;
  const desc = TL_FAMS[fam][2];
  const insert = /\binserts?\b/i.test(desc) && !/holder|tool|head|blade|bar|adapt|block|kit|carrying/i.test(desc);
  const parts: DecodedPart[] = [];
  readTokens(grade ? s.slice(0, -grade.length).trim() : s, insert, desc, parts);
  if (grade) parts.push({ key: "t-grade", code: grade, text: `Carbide grade ${grade}` });
  return { kind: `${brand} ${insert ? "insert" : "tool"}`, parts };
};

// An existing brand key's decoder, reading also the e-catalog items it doesn't.
export const withTurningLine = (decode: (text: string) => Decoded | null, brand: string) => {
  const line = turningLineDecoder(brand);
  return (text: string): Decoded | null => decode(text) ?? line(text);
};

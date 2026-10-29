import type { Decoded, DecodedPart } from "./insertDecoders";
import { IM_KEYS, IM_LINES, IM_REFINED } from "./indexableMillingData";

// Indexable milling (Code keys -> Indexable Milling): one decoder per brand,
// driven by the e-catalog's families. A designation's family key is its first
// token up to a dash (ADKT 1505PDR-HM -> ADKT, F90LN D040-04-16-R-N11 ->
// F90LN), after the line prefix when it has one (HM90 E90A-D16-2-C16 -> HM90
// E90A). The key gives the brand(s) and the family's description; families
// shared by brands are told apart by the designation's last segment (FDN
// ...-LN12 vs FDN ...-R06). The rest is read token by token.

const LINES = new Set(IM_LINES);
const famOf = (t: string) => {
  const f = t.includes("-") ? t.split("-")[0] : t;
  const m = f.match(/^([A-Z]+)\d{4,}/);
  return m ? m[1] : f;
};
const mmText = (v: number) => `${Number(v.toFixed(3))} mm`;

function readRest(rest: string, parts: DecodedPart[]) {
  for (const tok of rest.split(/[-\s]+/).filter(Boolean)) {
    let m: RegExpMatchArray | null;
    if ((m = tok.match(/^D(\d+(?:\.\d+)?)(?:\/([\d.]+))?$/))) {
      const v = Number(m[1]);
      parts.push({ key: "t-dia", code: tok, text: `Cutting diameter ${mmText(v)}${m[2] ? ` (${m[2]}")` : ""}` });
    } else if ((m = tok.match(/^([CW])(\d{1,2}(?:\.\d+)?)$/))) {
      parts.push({ key: "t-shank", code: tok, text: `${m[1] === "C" ? "Cylindrical" : "Weldon"} shank, diameter ${mmText(Number(m[2]))}` });
    } else if ((m = tok.match(/^M(\d{2})$/))) {
      parts.push({ key: "t-shank", code: tok, text: `FLEX-FIT M${Number(m[1])} threaded connection` });
    } else if ((m = tok.match(/^MMT(\d{2})$/))) {
      parts.push({ key: "t-shank", code: tok, text: `MULTI-MASTER T${m[1]} connection` });
    } else if ((m = tok.match(/^L(\d{2,4})$/))) {
      parts.push({ key: "t-length", code: tok, text: `Length ${Number(m[1])} mm` });
    } else if (tok === "R" || tok === "L" || tok === "R/L") {
      parts.push({ key: "t-hand", code: tok, text: tok === "R" ? "Right-hand" : tok === "L" ? "Left-hand" : "Right- or left-hand" });
    } else if ((m = tok.match(/^R(\d*\.?\d+)$/))) {
      parts.push({ key: "t-corner", code: tok, text: `Corner radius ${mmText(Number(m[1]))}` });
    } else if (/^\d{4,6}[A-Z]*$/.test(tok) || /^\d{2}T\d[A-Z0-9]*$/.test(tok)) {
      parts.push({ key: "i-size", code: tok, text: `Insert size, thickness and corner code ${tok} (see the catalog)` });
    } else if (/^\d+(\.\d+)?$/.test(tok)) {
      parts.push({ key: "t-dims", code: tok, text: `Dimension code ${tok}: teeth, bore, length or insert size (see the catalog)` });
    } else {
      parts.push({ key: "t-suffix", code: tok, text: `Version, chipformer or adaptation code ${tok} (see the catalog)` });
    }
  }
}

function parseIndexable(text: string): { brands: string[]; decoded: Decoded } | null {
  const s = text.toUpperCase().trim().replace(/\s+/g, " ");
  const tokens = s.split(" ");
  const line = tokens.length > 1 && LINES.has(tokens[0]) ? tokens[0] : null;
  const famTok = line ? tokens[1] : tokens[0];
  const fam = famOf(famTok);
  const key = line ? `${line} ${fam}` : fam;
  const entry = IM_KEYS[key];
  // ER endmills read ER D..; the solid ER-S4 corner rounding endmills and the
  // FINISHRED / CHATTER-FREE kits are other brands' (only HM90 kits here).
  if (!entry || (key === "ER" && !s.startsWith("ER D")) || (key === "KIT" && !s.includes("HM90"))) return null;
  const segs = s.split(/[-\s]+/);
  const brands = IM_REFINED[`${key}|${segs[segs.length - 1].replace(/[\d./]+/g, "#")}`] ?? entry[0];
  const parts: DecodedPart[] = [];
  if (line) parts.push({ key: "t-line", code: line, text: `${line} line` });
  parts.push({ key: "t-family", code: fam, text: entry[1] });
  const rest = s.slice(s.indexOf(famTok) + fam.length);
  readRest(rest, parts);
  const insert = /^\s*\d/.test(rest) && !/carrying|endmill|face mill|cutter|shell mill|plunger/i.test(entry[1]);
  return { brands, decoded: { kind: insert ? "Indexable milling insert" : "Indexable milling tool", parts } };
}

export const indexableDecoder = (brand: string) => (text: string): Decoded | null => {
  const p = parseIndexable(text);
  return p && p.brands.includes(brand) ? { ...p.decoded, kind: `${brand} ${p.decoded.kind.toLowerCase().replace("indexable milling ", "")}` } : null;
};

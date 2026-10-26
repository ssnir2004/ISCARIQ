import type { Decoded, DecodedPart } from "./insertDecoders";

// Designation decoders for the Parting code keys (Code keys -> Parting), one
// per family: its inserts (e.g. TAG N3C, PENTA 24R150J15D) and its tools
// (e.g. TGFH 26K-3, DGTR 12B-2D24SH, PCHR 12-D22-2-IQ). Parts name their code
// key section by key: inserts "i-<part>", tools "t-<part>".

const squash = (s: string) => s.toUpperCase().replace(/\s+/g, "");
const mm = (n: number) => `${Number(n.toFixed(2))} mm`;

// TANG-GRIP insert: TAG N3C, TAG R3C-15D, TAG N2.4JT.
export function decodeTag(text: string): Decoded | null {
  const m = squash(text).match(/^TAG([NRL])(\d+(?:\.\d+)?)([A-Z]+)(?:-(\d{1,2})D)?$/);
  if (!m) return decodeTool(text, TANG_GRIP_TOOLS);
  return {
    kind: "TANG-GRIP insert",
    parts: [
      { key: "i-family", code: "TAG" },
      { key: "i-hand", code: m[1] },
      { key: "i-width", code: m[2], text: `Cutting width ${mm(Number(m[2]))}` },
      { key: "i-chip", code: m[3] },
      ...(m[4] ? [{ key: "i-lead", code: `${m[4]}D`, text: `Lead angle ${Number(m[4])}°` }] : []),
    ],
  };
}

// PENTA insert: PENTA 24N200J020 (width and corner radius x100 mm), PENTA
// 24R150J15D / D22R200J-6D (lead angle), PENTA 17N100P010R/LS.
export function decodePenta(text: string): Decoded | null {
  const m = squash(text).match(/^PENTA(17|24|34|D22|D32|D40)([NRL])(\d{3})([A-Z]+?)(\d{3})?(?:-?(\d{1,2})D)?(R\/LS|RS|LS)?$/);
  if (!m) return decodeTool(text, PENTA_TOOLS);
  const radius = m[5] ? Number(m[5]) / 100 : null;
  return {
    kind: "PENTA insert",
    parts: [
      { key: "i-family", code: "PENTA" },
      { key: "i-size", code: m[1] },
      { key: "i-hand", code: m[2] },
      { key: "i-width", code: m[3], text: `Cutting width ${mm(Number(m[3]) / 100)}` },
      { key: "i-chip", code: m[4] },
      ...(m[5] ? [{ key: "i-radius", code: m[5], text: radius ? `Corner radius ${mm(radius)}` : "Sharp corners (no radius)" }] : []),
      ...(m[6] ? [{ key: "i-lead", code: `${m[6]}D`, text: `Lead angle ${Number(m[6])}°` }] : []),
      ...(m[7] ? [{ key: "i-side", code: m[7] }] : []),
    ],
  };
}

// CUT-GRIP utility insert: GIM 3J, GIM 2.2JS-15RA, GIM 3-4LA, GIM 4.6UT.
export function decodeGim(text: string): Decoded | null {
  const m = squash(text).match(/^GIM(\d+(?:\.\d+)?)([A-Z]*?)(S)?(?:-(\d{1,2})([RL])A)?$/);
  if (!m) return null;
  return {
    kind: "GIM insert",
    parts: [
      { key: "i-family", code: "GIM" },
      { key: "i-width", code: m[1], text: `Cutting width ${mm(Number(m[1]))}` },
      ...(m[2] ? [{ key: "i-chip", code: m[2] }] : []),
      ...(m[3] ? [{ key: "i-sharp", code: "S" }] : []),
      ...(m[4] ? [{ key: "i-lead", code: `${m[4]}${m[5]}A`, text: `Lead angle ${Number(m[4])}°, ${m[5] === "R" ? "right" : "left"}-hand` }] : []),
    ],
  };
}

// Narrow insert: BGM N1001J (width and corner radius x10 mm), BGM R1001J-15D.
export function decodeBgm(text: string): Decoded | null {
  const m = squash(text).match(/^BGM([NRL])(\d{2})(\d{2})([A-Z]+)(?:-(\d{1,2})D)?$/);
  if (!m) return decodeTool(text, BGM_TOOLS);
  return {
    kind: "BGM insert",
    parts: [
      { key: "i-family", code: "BGM" },
      { key: "i-hand", code: m[1] },
      { key: "i-width", code: m[2], text: `Cutting width ${mm(Number(m[2]) / 10)}` },
      { key: "i-radius", code: m[3], text: `Corner radius ${mm(Number(m[3]) / 10)}` },
      { key: "i-chip", code: m[4] },
      ...(m[5] ? [{ key: "i-lead", code: `${m[5]}D`, text: `Lead angle ${Number(m[5])}°` }] : []),
    ],
  };
}

// Thin insert: GFT 1.2J-0.14 (width, chipformer, corner radius), GFT 1.2.
export function decodeGft(text: string): Decoded | null {
  const m = squash(text).match(/^GFT(\d+(?:\.\d+)?)([A-Z]*)(?:-(\d+(?:\.\d+)?))?$/);
  if (!m) return null;
  return {
    kind: "GFT insert",
    parts: [
      { key: "i-family", code: "GFT" },
      { key: "i-width", code: m[1], text: `Cutting width ${mm(Number(m[1]))}` },
      ...(m[2] ? [{ key: "i-chip", code: m[2] }] : []),
      ...(m[3] ? [{ key: "i-radius", code: m[3], text: `Corner radius ${mm(Number(m[3]))}` }] : []),
    ],
  };
}

// SELF-GRIP insert: GFN 3J, GFN 3 (C type), GFR 3JS-8D, GFF 3R (face grooving).
export function decodeSelfGrip(text: string): Decoded | null {
  const s = squash(text);
  const face = s.match(/^GFF(\d+(?:\.\d+)?)([NRL])$/);
  if (face) {
    return {
      kind: "SELF-GRIP face grooving insert",
      parts: [
        { key: "i-family", code: "GFF" },
        { key: "i-width", code: face[1], text: `Cutting width ${mm(Number(face[1]))}` },
        { key: "i-hand", code: face[2] },
      ],
    };
  }
  const m = s.match(/^GF([NRL])(\d+(?:\.\d+)?)([A-RT-Z]*)(S)?(?:-(\d{1,2})D)?$/);
  if (!m) return decodeTool(text, SELF_GRIP_TOOLS);
  return {
    kind: "SELF-GRIP insert",
    parts: [
      { key: "i-family", code: "GF" },
      { key: "i-hand", code: m[1] },
      { key: "i-width", code: m[2], text: `Cutting width ${mm(Number(m[2]))}` },
      { key: "i-chip", code: m[3] || "-", lookup: m[3] || "(none)" },
      ...(m[4] ? [{ key: "i-sharp", code: "S" }] : []),
      ...(m[5] ? [{ key: "i-lead", code: `${m[5]}D`, text: `Lead angle ${Number(m[5])}°` }] : []),
    ],
  };
}

// Tool families per brand (longest first), and whether a hand letter follows.
export const TANG_GRIP_TOOLS = ["TAGPAD", "TGFH", "TGFS", "TGSU", "TGAD", "TGAQ", "TGT", "ADMP", "THMP"];
export const DO_GRIP_TOOLS = ["DGPAD", "DGFH", "DGFS", "DGAD", "HGAD", "DGAQ", "DGT"];
export const PENTA_TOOLS = ["PCHB", "PCAD", "PCH"];
export const BGM_TOOLS = ["BGT"];
export const SELF_GRIP_TOOLS = ["SGFFA", "SGFFH", "SGFF", "SGFH", "SGFS", "SGTF", "SGAF", "SGB", "SGF"];

// Face grooving tools: which of their numbers is the minimum face diameter
// (blades: the first; integral tools: the second, after the shank).
const FACE_DMIN: Record<string, number> = { SGFFA: 0, SGFFH: 0, SGFF: 1 };

// A tool: its family (e.g. TGFH), hand (R / L / N, when given), then its
// numbers and suffixes, e.g. TGFH 26K-3 (blade height 26, coolant, insert
// width 3), TGFS 0-17-2 (angle 0°), DGTR 12B-2D24SH, TGTR 2020-D65-3-JHP-MC,
// PCHR 16-24-5 (PENTA 24 seat), PCHR 12-D22-2-IQ.
export function decodeTool(text: string, families: string[]): Decoded | null {
  const d = text
    .toUpperCase()
    .trim()
    .replace(/D\s+(\d{2,3})\b/g, "D$1")
    .replace(/(\d)\s*T\s*(\d{2})\b/g, "$1T$2")
    .replace(/\s+/g, "-");
  const family = [...families].sort((a, b) => b.length - a.length).find((f) => d.startsWith(f));
  if (!family) return null;
  let rest = d.slice(family.length);
  const parts: DecodedPart[] = [{ key: "t-family", code: family }];
  const hand = rest.match(/^(R\/L|R|L|N)(?=S?(-|$))/);
  if (hand) {
    parts.push({ key: "t-hand", code: hand[1] });
    rest = rest.slice(hand[1].length);
  }
  if (/^S(-|$)/.test(rest)) {
    parts.push({ key: "t-suffix", code: "S" });
    rest = rest.slice(1);
  }
  const penta = family.startsWith("PC");
  let sized = false;
  let angled = !family.endsWith("FS");
  let pentaSize = false;
  // Numbers seen so far (for the face grooving tools' minimum diameter).
  let numbers = 0;
  const dminAt = FACE_DMIN[family];
  for (const token of rest.split("-").filter(Boolean)) {
    let m: RegExpMatchArray | null;
    if (dminAt !== undefined && /^\d{2,3}$/.test(token) && numbers++ === dminAt) {
      parts.push({ key: "t-dmin", code: token, text: `Minimum face grooving diameter ${Number(token)} mm` });
      if (dminAt === 0) sized = true;
    } else if (/^(R\/L|R|L|N)$/.test(token)) {
      parts.push({ key: "t-hand", code: token });
    } else if ((m = token.match(/^(\d{2})T(\d{2})$/)) && !sized) {
      parts.push({ key: "t-height", code: m[1], text: `Blade height ${Number(m[1])} mm` }, { key: "t-suffix", code: `T${m[2]}`, lookup: "T##" });
      sized = true;
    } else if ((m = token.match(/^(\d{2,3})([KCB])?([RL])$/)) && !sized) {
      parts.push({ key: "t-height", code: m[1], text: `Blade height / shank ${Number(m[1])} mm` });
      if (m[2]) parts.push({ key: "t-suffix", code: m[2] });
      parts.push({ key: "t-hand", code: m[3] });
      sized = true;
    } else if (!angled && /^\d{1,2}$/.test(token)) {
      // Multi-spindle blades (TGFS / DGFS) start with their angle a°.
      parts.push({ key: "t-angle", code: token, text: `Angle a° = ${Number(token)}°` });
      angled = true;
    } else if ((m = token.match(/^(\d{2})(\d{2})(K)?$/)) && !sized) {
      parts.push({ key: "t-height", code: `${m[1]}${m[2]}`, text: `Shank ${Number(m[1])} x ${Number(m[2])} mm` });
      if (m[3]) parts.push({ key: "t-suffix", code: "K" });
      sized = true;
    } else if ((m = token.match(/^(\d{1,3})([KCB])?$/)) && !sized && Number(m[1]) >= 8) {
      parts.push({ key: "t-height", code: m[1], text: `Blade height / shank ${Number(m[1])} mm` });
      if (m[2]) parts.push({ key: "t-suffix", code: m[2] });
      sized = true;
    } else if (penta && (m = token.match(/^(17|24|34)(N)?$/))) {
      parts.push({ key: "t-penta", code: m[1], text: `For PENTA ${m[1]} inserts` });
      if (m[2]) parts.push({ key: "t-hand", code: "N" });
      pentaSize = true;
    } else if (pentaSize && /^\d$/.test(token)) {
      // e.g. PCHR 16-24-5: a variant of the tool (see the catalog).
      parts.push({ key: "t-suffix", code: token, lookup: "#" });
    } else if ((m = token.match(/^(\d+(?:\.\d+)?)(N|R\/LE|RE|LE|R\/L|R|L|B)?(D\d{2,3})?(SH)?$/))) {
      parts.push({ key: "t-width", code: m[1], text: `Insert width ${mm(Number(m[1]))}` });
      if (m[2]) parts.push({ key: m[2] === "B" ? "t-suffix" : "t-hand", code: m[2] });
      if (m[3]) parts.push({ key: "t-dia", code: m[3], text: `${m[3]}: ${Number(m[3].slice(1))} mm` });
      if (m[4]) parts.push({ key: "t-suffix", code: "SH" });
    } else if ((m = token.match(/^D(\d{2,3})$/))) {
      parts.push({ key: "t-dia", code: token, text: `${token}: ${Number(m[1])} mm` });
    } else if ((m = token.match(/^(\d)Z$/))) {
      parts.push({ key: "t-pockets", code: token, text: `${m[1]} pockets` });
    } else if ((m = token.match(/^L(\d{2,3})$/))) {
      parts.push({ key: "t-suffix", code: token, lookup: "L###", text: `Tool length ${m[1]} mm` });
    } else if ((m = token.match(/^TR(\d+)$/))) {
      parts.push({ key: "t-suffix", code: token, lookup: "TR" });
    } else if ((m = token.match(/^(\d+(?:\.\d+)?)JHP$/))) {
      parts.push({ key: "t-width", code: m[1], text: `Insert width ${mm(Number(m[1]))}` }, { key: "t-suffix", code: "JHP" });
    } else {
      parts.push({ key: "t-suffix", code: token });
    }
  }
  return { kind: "Tool", parts };
}

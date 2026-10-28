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

// CUT-GRIP inserts. Precision (ground): GIP 3.00E-0.40 (width, type, corner
// radius, suffix), GIPI 3.00-1.5UL, GIP 1.57-0.15 RX, GIPA 4.00-2.00YZ-D.
// Utility: GIMY 808 (width 8, radius 0.8), GIMY 315-UN, GDMW 2.4, GEMI 2002N
// (width and radius x10), GIMY 635-318. Parting: GIM 3J (see decodeGim).
const PRECISION = ["GIPA", "GIPI", "GIPM", "GIPY", "GIP", "GIFG", "GIFI", "GIF", "GIG", "GEPI", "GIA", "GITM", "GINI", "GIDA"];
const UTILITY = ["GDMU", "GDMW", "GDMY", "GDMF", "GDMA", "GDMN", "GDMT", "GDMM", "GIMIY", "GIMY", "GIMF", "GIMN", "GIMT", "GIMM", "GEMI"];

export function decodeCutGrip(text: string): Decoded | null {
  const s = squash(text);
  const fam = (list: string[]) => list.find((f) => s.startsWith(f) && /^[\d.]/.test(s.slice(f.length)));
  const p = fam(PRECISION);
  if (p) {
    const m = s.slice(p.length).match(/^(\d+(?:\.\d+)?)([EK])?-(\d+(?:\.\d+)?)(UN|UR|UL|RX|LX|YZ|CB|L|R)?(?:-?(D))?$/);
    if (!m) return null;
    // GIDA sizes are x10 (80-40 = 8.0 mm, radius 4.0 mm).
    const k = p === "GIDA" ? 10 : 1;
    const w = Number(m[1]) / k;
    const re = Number(m[3]) / k;
    return {
      kind: "CUT-GRIP precision insert",
      parts: [
        { key: "i-family", code: p },
        { key: "i-width", code: m[1], text: `Cutting width ${mm(w)}` },
        ...(m[2] ? [{ key: "i-type", code: m[2] }] : []),
        { key: "i-radius", code: m[3], text: re > 0 && Math.abs(re * 2 - w) < 0.02 ? `Corner radius ${mm(re)} (full radius)` : `Corner radius ${mm(re)}` },
        ...(m[4] ? [{ key: "i-variant", code: m[4] }] : []),
        ...(m[5] ? [{ key: "i-variant", code: "D" }] : []),
      ],
    };
  }
  const u = fam(UTILITY);
  if (u) {
    const m = s.slice(u.length).match(/^(\d+(?:\.\d+)?)([A-Z]*?)(?:-(\d{3}))?(?:-?(UN))?$/);
    if (!m) return null;
    let w: number;
    let re: number | null;
    if (m[1].includes(".") || m[1].length <= 2) [w, re] = [Number(m[1]), null];
    else if (m[3]) [w, re] = [Number(m[1]) / 100, Number(m[3]) / 100];
    else if (u === "GEMI") [w, re] = [Number(m[1].slice(0, 2)) / 10, Number(m[1].slice(2)) / 10];
    else [w, re] = [Number(m[1].slice(0, -2)), Number(m[1].slice(-2)) / 10];
    return {
      kind: "CUT-GRIP utility insert",
      parts: [
        { key: "i-family", code: u },
        { key: "i-width", code: m[3] ? `${m[1]}-${m[3]}` : m[1], text: re === null ? `Cutting width ${mm(w)}` : `Cutting width ${mm(w)}, corner radius ${mm(re)}${Math.abs(re * 2 - w) < 0.02 ? " (full radius)" : ""}` },
        ...(m[2] ? [{ key: "i-variant", code: m[2] }] : []),
        ...(m[4] ? [{ key: "i-variant", code: "UN" }] : []),
      ],
    };
  }
  return decodeGim(text) ?? decodeTool(text, CUT_GRIP_TOOLS);
}

// GROOVE4CUT insert (4 cutting edges): QGI 30N200PF020 (size 30, hand, width
// and corner radius x100 mm, chipformer).
export function decodeGroove4Cut(text: string): Decoded | null {
  const m = squash(text).match(/^QGI(30)([NRL])(\d{3})([A-Z]+?)(\d{3})$/);
  if (!m) return decodeTool(text, GROOVE4CUT_TOOLS);
  const radius = Number(m[5]) / 100;
  return {
    kind: "GROOVE4CUT insert",
    parts: [
      { key: "i-family", code: "QGI" },
      { key: "i-size", code: m[1] },
      { key: "i-hand", code: m[2] },
      { key: "i-width", code: m[3], text: `Cutting width ${mm(Number(m[3]) / 100)}` },
      { key: "i-chip", code: m[4] },
      { key: "i-radius", code: m[5], text: radius ? `Corner radius ${mm(radius)}` : "Sharp corners (no radius)" },
    ],
  };
}

// HELI-GRIP insert: GRIP 3002Y (width and corner radius x10 mm), GRIP
// 318-040Y (x100), HGPL 3015Y (face machining), GRIPA 3.00-0.40 (ground).
export function decodeHeliGrip(text: string): Decoded | null {
  const s = squash(text);
  const ground = s.match(/^GRIPA(\d+(?:\.\d+)?)-(\d+(?:\.\d+)?)$/);
  if (ground) {
    const [w, re] = [Number(ground[1]), Number(ground[2])];
    return {
      kind: "HELI-GRIP ground insert",
      parts: [
        { key: "i-family", code: "GRIPA" },
        { key: "i-width", code: ground[1], text: `Cutting width ${mm(w)}` },
        { key: "i-radius", code: ground[2], text: `Corner radius ${mm(re)}${Math.abs(re * 2 - w) < 0.02 ? " (full radius)" : ""}` },
      ],
    };
  }
  const m = s.match(/^(GRIP|HGPL)(\d{3,4})(?:-(\d{3}))?([A-Z])$/);
  if (!m) return decodeTool(text, HELI_GRIP_TOOLS);
  const [w, re] = m[3] ? [Number(m[2]) / 100, Number(m[3]) / 100] : [Number(m[2].slice(0, 2)) / 10, Number(m[2].slice(2)) / 10];
  return {
    kind: "HELI-GRIP insert",
    parts: [
      { key: "i-family", code: m[1] },
      { key: "i-width", code: m[3] ? `${m[2]}-${m[3]}` : m[2], text: `Cutting width ${mm(w)}, corner radius ${mm(re)}${Math.abs(re * 2 - w) < 0.02 ? " (full radius)" : ""}` },
      { key: "i-chip", code: m[4] },
    ],
  };
}

// Tool families per brand (longest first), and whether a hand letter follows.
export const TANG_GRIP_TOOLS = ["TAGPAD", "TGFH", "TGFS", "TGSU", "TGAD", "TGAQ", "TGT", "ADMP", "THMP"];
export const DO_GRIP_TOOLS = ["DGPAD", "DGFH", "DGFS", "DGAD", "HGAD", "DGAQ", "DGT"];
export const PENTA_TOOLS = ["PCHB", "PCAD", "PCH"];
export const BGM_TOOLS = ["BGT"];
export const GROOVE4CUT_TOOLS = ["QTH"];
export const HELI_GRIP_TOOLS = ["HELII", "HELI", "HGFH"];
export const CUT_GRIP_TOOLS = ["CGFG", "CGH", "GHFG", "GHMP", "GHM", "GHD", "GHG", "GHS", "GEHS", "PHG", "PHS", "GAFG", "GAD", "PAD", "THD"];
export const SELF_GRIP_TOOLS = ["SGFFA", "SGFFH", "SGFF", "SGFH", "SGFS", "SGTF", "SGAF", "SGB", "SGF"];

// Face grooving tools: which of their numbers is the minimum face diameter
// (blades: the first; integral tools: the second, after the shank).
const FACE_DMIN: Record<string, number> = { SGFFA: 0, SGFFH: 0, SGFF: 1, GAFG: 0, GHFG: 1, CGFG: 1 };
// Adapters whose first number is the insert width (e.g. GADR 8, PADR 2.4).
const WIDTH_FIRST = new Set(["GAD", "PAD"]);

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
  // A CAMFIX shank before the family (e.g. C4 GHDR-3).
  const camfix = d.match(/^C(\d)-/);
  const body = camfix ? d.slice(camfix[0].length) : d;
  const family = [...families].sort((a, b) => b.length - a.length).find((f) => body.startsWith(f));
  if (!family) return null;
  let rest = body.slice(family.length);
  const parts: DecodedPart[] = [...(camfix ? [{ key: "t-suffix", code: `C${camfix[1]}`, lookup: "C#" }] : []), { key: "t-family", code: family }];
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
  // GROOVE4CUT tools name their insert size after the shank (QTHR 16-30).
  const quad = family === "QTH";
  let sized = false;
  let angled = !family.endsWith("FS");
  let pentaSize = false;
  let sizedWidth = !WIDTH_FIRST.has(family);
  // Numbers seen so far (for the face grooving tools' minimum diameter).
  let numbers = 0;
  const dminAt = FACE_DMIN[family];
  for (const token of rest.split("-").filter(Boolean)) {
    let m: RegExpMatchArray | null;
    if (dminAt !== undefined && (m = token.match(/^(\d{2,3})([RL])?$/)) && numbers++ === dminAt) {
      parts.push({ key: "t-dmin", code: m[1], text: `Minimum face grooving diameter ${Number(m[1])} mm` });
      if (m[2]) parts.push({ key: "t-hand", code: m[2] });
      if (dminAt === 0) sized = true;
    } else if (!sizedWidth && (m = token.match(/^(\d+(?:\.\d+)?)$/))) {
      parts.push({ key: "t-width", code: m[1], text: `Insert width ${mm(Number(m[1]))}` });
      sizedWidth = true;
      sized = true;
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
    } else if (family === "HELII" && sized && (m = token.match(/^(\d)(\d{2})$/))) {
      parts.push({ key: "t-width", code: m[1], text: `Insert width ${mm(Number(m[1]))}` }, { key: "t-depth", code: m[2], text: `Max. grooving depth ${Number(m[2])} mm` });
    } else if (quad && token === "30") {
      parts.push({ key: "t-seat", code: token, text: "For QGI 30 inserts" });
    } else if (penta && (m = token.match(/^(17|24|34)(N)?$/))) {
      parts.push({ key: "t-penta", code: m[1], text: `For PENTA ${m[1]} inserts` });
      if (m[2]) parts.push({ key: "t-hand", code: "N" });
      pentaSize = true;
    } else if (pentaSize && /^\d$/.test(token)) {
      // e.g. PCHR 16-24-5: a variant of the tool (see the catalog).
      parts.push({ key: "t-suffix", code: token, lookup: "#" });
    } else if (sized && /^\d{3}$/.test(token)) {
      // e.g. GHDR 32-812: a pocket / insert variant (see the catalog).
      parts.push({ key: "t-suffix", code: token, lookup: "###" });
    } else if ((m = token.match(/^(\d+(?:\.\d+)?)(N|R\/LE|RE|LE|R\/L|R|L|B)?(D\d{2,3})?(SH)?$/))) {
      parts.push({ key: "t-width", code: m[1], text: `Insert width ${mm(Number(m[1]))}` });
      if (m[2]) parts.push({ key: m[2] === "B" ? "t-suffix" : "t-hand", code: m[2] });
      if (m[3]) parts.push({ key: "t-dia", code: m[3], text: `${m[3]}: ${Number(m[3].slice(1))} mm` });
      if (m[4]) parts.push({ key: "t-suffix", code: "SH" });
    } else if ((sized || /^\d(\.\d+)?T/.test(token)) && (m = token.match(/^(\d+(?:\.\d+)?)T(\d+(?:\.\d+)?)(PR)?$/))) {
      // e.g. GHDL 2525-14T12: insert width 14, T12.
      parts.push({ key: "t-width", code: m[1], text: `Insert width ${mm(Number(m[1]))}` }, { key: "t-suffix", code: `T${m[2]}`, lookup: "T##" });
    } else if (sized && (m = token.match(/^(\d+(?:\.\d+)?)(DG|D|S)$/))) {
      // e.g. CGHN 32-3D (double-ended), 32-3S (single-ended), 32-3DG.
      parts.push({ key: "t-width", code: m[1], text: `Insert width ${mm(Number(m[1]))}` }, { key: "t-suffix", code: m[2] });
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

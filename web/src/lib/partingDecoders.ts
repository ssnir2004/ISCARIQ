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

// PENTACUT insert: PENTA 24N200J020 (width and corner radius x100 mm), PENTA
// 24R150J15D / D22R200J-6D (lead angle), PENTA 17N100P010R/LS, PENTA
// 17L03SP6D-RS (width x10), QUICK-PENTA PENTA 24N080NF01RS-SL (safety lock,
// radius x10), face PENTA 34F239-0.15-22L, PENTA 17-100NP08LS, back turning
// PENTA 17ER08-07K0RS, blanks PENTAS 27-10FT and FLASHPENTA PMN D32-2C02.
function decodeAnyPenta(text: string): Decoded | null {
  const s = squash(text);
  const radiusText = (re: number) => (re ? `Corner radius ${mm(re)}` : "Sharp corners (no radius)");
  let m = s.match(/^PENTAS27-(\d{2})FT$/);
  if (m) {
    return {
      kind: "PENTACUT blank",
      parts: [
        { key: "i-family", code: "PENTAS" },
        { key: "i-size", code: "27" },
        { key: "i-width", code: m[1], text: `Cutting edge width ${mm(Number(m[1]))}` },
        { key: "i-chip", code: "FT" },
      ],
    };
  }
  if ((m = s.match(/^PENTA34F(\d{3})-(\d+\.\d+)-(\d{2})([RL])(S)?$/))) {
    return {
      kind: "PENTACUT face grooving insert",
      parts: [
        { key: "i-family", code: "PENTA" },
        { key: "i-size", code: "34" },
        { key: "i-size", code: "F", text: "Face grooving and recessing" },
        { key: "i-width", code: m[1], text: `Cutting width ${mm(Number(m[1]) / 100)}` },
        { key: "i-radius", code: m[2], text: radiusText(Number(m[2])) },
        { key: "i-dmin", code: m[3], text: `Minimum axial grooving diameter ${mm(Number(m[3]))}` },
        { key: "i-side", code: m[4] + (m[5] ?? "") },
      ],
    };
  }
  if ((m = s.match(/^PENTA17-(\d{3})(NP)(\d{2})(RS|LS)$/))) {
    return {
      kind: "PENTACUT insert",
      parts: [
        { key: "i-family", code: "PENTA" },
        { key: "i-size", code: "17" },
        { key: "i-width", code: m[1], text: `Cutting width ${mm(Number(m[1]) / 100)}` },
        { key: "i-chip", code: m[2] },
        { key: "i-radius", code: m[3], text: radiusText(Number(m[3]) / 100) },
        { key: "i-side", code: m[4] },
      ],
    };
  }
  if ((m = s.match(/^PENTA17E([RL])(\d{2})-(\d{2})K(\d{1,2})(RS|LS)$/))) {
    return {
      kind: "PENTACUT back turning insert",
      parts: [
        { key: "i-family", code: "PENTA" },
        { key: "i-size", code: "17" },
        { key: "i-type", code: "E" },
        { key: "i-hand", code: m[1] },
        { key: "i-radius", code: m[2], text: radiusText(Number(m[2]) / 100) },
        { key: "i-width", code: m[3], text: `Cutting width ${mm(Number(m[3]) / 10)}` },
        { key: "i-rake", code: `K${m[4]}`, text: `Rake angle ${Number(m[4])}°` },
        { key: "i-side", code: m[5] },
      ],
    };
  }
  if ((m = s.match(/^PMND(22|32|40)-(\d)([A-Z]+?)(?:(\d{2})|-(\d+(?:\.\d+)?))$/))) {
    const re = m[4] ? Number(m[4]) / 10 : Number(m[5]);
    return {
      kind: "FLASHPENTA utility insert",
      parts: [
        { key: "i-family", code: "PMN" },
        { key: "i-size", code: `D${m[1]}` },
        { key: "i-width", code: m[2], text: `Cutting width ${mm(Number(m[2]))}` },
        { key: "i-chip", code: m[3] },
        { key: "i-radius", code: m[4] ?? `-${m[5]}`, text: `${radiusText(re)}${Math.abs(re * 2 - Number(m[2])) < 0.02 ? " (full radius)" : ""}` },
      ],
    };
  }
  m = s.match(/^PENTA(17|24|34|D22|D32|D40)([NRL])(\d{2,3})([A-Z]+?)(\d{2,3})?(?:-?(\d{1,2})D)?-?(R\/LS|RS|LS)?-?(SL)?$/);
  if (!m) return decodeTool(text, PENTA_TOOLS);
  // Two digits are x10 (PENTA 17L03SP: 0.3 mm; NF01: 0.1 mm), three x100.
  const width = Number(m[3]) / (m[3].length === 2 ? 10 : 100);
  const radius = m[5] ? Number(m[5]) / (m[5].length === 2 ? 10 : 100) : null;
  return {
    kind: m[8] ? "QUICK-PENTA insert" : "PENTACUT insert",
    parts: [
      { key: "i-family", code: "PENTA" },
      { key: "i-size", code: m[1] },
      { key: "i-hand", code: m[2] },
      { key: "i-width", code: m[3], text: `Cutting width ${mm(width)}` },
      { key: "i-chip", code: m[4] },
      ...(m[5] ? [{ key: "i-radius", code: m[5], text: radiusText(radius!) }] : []),
      ...(m[6] ? [{ key: "i-lead", code: `${m[6]}D`, text: `Lead angle ${Number(m[6])}°` }] : []),
      ...(m[7] ? [{ key: "i-side", code: m[7] }] : []),
      ...(m[8] ? [{ key: "i-lock", code: "SL" }] : []),
    ],
  };
}

// QUICK-PENTA (safety lock SL inserts, QC tools) and PENTA IQ GRIP (PENTA D
// inserts, PCHR/L-D## tools) have their own keys; PENTACUT has the rest of the
// PENTA designations.
const isQuickPenta = (d: Decoded) => d.parts.some((p) => p.key === "i-lock" || (p.key === "t-suffix" && p.code === "QC"));
const isPentaIq = (d: Decoded) =>
  d.parts.some((p) => (p.key === "i-size" && p.code.startsWith("D") && d.parts[0].code === "PENTA") || p.key === "t-dia");

export function decodePenta(text: string): Decoded | null {
  const d = decodeAnyPenta(text);
  return d && !isQuickPenta(d) && !isPentaIq(d) ? d : null;
}

// PENTA IQ GRIP: PENTA D32N200C020, PENTA D22R200J-6D, PCHR 12-D22-2-IQ.
export function decodePentaIq(text: string): Decoded | null {
  const d = decodeAnyPenta(text);
  return d && isPentaIq(d) ? d : null;
}

// QUICK-PENTA: PENTA 24N200C020SL, PENTA 24N080NF01RS-SL, PCHR 20-24-JHP-MC-QC.
export function decodeQuickPenta(text: string): Decoded | null {
  const d = decodeAnyPenta(text);
  return d && isQuickPenta(d) ? d : null;
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

// TOP-GRIP insert: TGMF 302 (width 3, corner radius x10: 0.2 mm), TGMF 315
// (full radius), TGMF 635-080 (x100), TGMA 304K (cast iron).
export function decodeTopGrip(text: string): Decoded | null {
  const m = squash(text).match(/^(TGMF|TGMP|TGMA)(\d{3})(?:-(\d{3}))?([A-Z])?$/);
  if (!m) return decodeTool(text, TOP_GRIP_TOOLS);
  const [w, re] = m[3] ? [Number(m[2]) / 100, Number(m[3]) / 100] : [Number(m[2][0]), Number(m[2].slice(1)) / 10];
  return {
    kind: "TOP-GRIP insert",
    parts: [
      { key: "i-family", code: m[1] },
      { key: "i-width", code: m[3] ? `${m[2]}-${m[3]}` : m[2], text: `Cutting width ${mm(w)}, corner radius ${mm(re)}${Math.abs(re * 2 - w) < 0.02 ? " (full radius)" : ""}` },
      ...(m[4] ? [{ key: "i-variant", code: m[4] }] : []),
    ],
  };
}

// SWISSCUT insert (SCI 22 / SCI 41): grooving and parting SCIL 22-050L12-00
// (width x100, lead angle, corner radius x100) or SCIL 41-150L15K7 (rake angle
// K), chipformers SCIL 22-100NP08 / SCIL 22-150NX080 (radius x100 / x1000),
// back / front turning SCIR 22-BR10-05K15 (type, hand, radius x100, width x10,
// rake angle).
export function decodeSwissCut(text: string): Decoded | null {
  const s = squash(text);
  const head = s.match(/^SCI([RL])(22|41)-(.+)$/);
  if (!head) return decodeTool(text, SWISSCUT_TOOLS);
  const parts: DecodedPart[] = [
    { key: "i-family", code: "SCI" },
    { key: "i-hand", code: head[1] },
    { key: "i-size", code: head[2] },
  ];
  const rest = head[3];
  let m: RegExpMatchArray | null;
  if ((m = rest.match(/^(\d{3})(NP|NX)(\d{2,3})$/))) {
    const re = Number(m[3]) / (m[3].length === 3 ? 1000 : 100);
    parts.push(
      { key: "i-width", code: m[1], text: `Cutting width ${mm(Number(m[1]) / 100)}` },
      { key: "i-chip", code: m[2] },
      { key: "i-radius", code: m[3], text: re ? `Corner radius ${mm(re)}` : "Sharp corners (no radius)" },
    );
  } else if ((m = rest.match(/^(\d{3})(N|[RL](\d{1,2}))-?(?:K(\d{1,2})|(\d{2}))$/))) {
    parts.push({ key: "i-width", code: m[1], text: `Cutting width ${mm(Number(m[1]) / 100)}` });
    parts.push(m[3] ? { key: "i-lead", code: m[2], text: `Lead angle ${Number(m[3])}°, ${m[2][0] === "R" ? "right" : "left"}` } : { key: "i-lead", code: "N", text: "Neutral (no lead angle)" });
    if (m[4] !== undefined) parts.push({ key: "i-rake", code: `K${m[4]}`, text: `Rake angle ${Number(m[4])}°` });
    else parts.push({ key: "i-radius", code: m[5], text: Number(m[5]) ? `Corner radius ${mm(Number(m[5]) / 100)}` : "Sharp corners (no radius)" });
  } else if ((m = rest.match(/^([BEA])([RL]|D)(A)?(\d{2})-(\d{2})K(\d{1,2})$/))) {
    parts.push(
      { key: "i-type", code: m[1] + (m[3] ?? "") },
      { key: "i-dir", code: m[2] },
      { key: "i-radius", code: m[4], text: Number(m[4]) ? `Corner radius ${mm(Number(m[4]) / 100)}` : "Sharp corners (no radius)" },
      { key: "i-width", code: m[5], text: `Cutting width ${mm(Number(m[5]) / 10)}` },
      { key: "i-rake", code: `K${m[6]}`, text: `Rake angle ${Number(m[6])}°` },
    );
  } else return null;
  return { kind: "SWISSCUT insert", parts };
}

// CHAM-GROOVE insert: internal GIQR 8-1.50-0.05 (Dmin, width, corner radius),
// deep GIQR 11-15-2.00-0.10 (Dmin 15), full radius GIQR 11-2.00-R100 (x100),
// profiling GIQR 8-A18-0.15 / back boring GIQR 8-B18-0.15, face GFQR 12-1.50-0.20;
// solid carbide bars MGCH 06, MGCH 08C, MGCH 06-L100.
export function decodeChamGroove(text: string): Decoded | null {
  const s = squash(text);
  let m = s.match(/^MGCH(\d{2})(C)?(?:-L(\d{2,3}))?$/);
  if (m) {
    const parts: DecodedPart[] = [
      { key: "t-family", code: "MGCH" },
      { key: "t-height", code: m[1], text: `Shank diameter ${mm(Number(m[1]))}` },
    ];
    if (m[2]) parts.push({ key: "t-suffix", code: "C" });
    if (m[3]) parts.push({ key: "t-length", code: `L${m[3]}`, text: `Bar length ${mm(Number(m[3]))}` });
    return { kind: "CHAM-GROOVE bar", parts };
  }
  m = s.match(/^(GIQ|GFQ)([RL])(\d{1,2})-(?:(\d{2})-)?(?:([AB])(\d{2})|(\d+\.\d+))-(R)?(\d+(?:\.\d+)?)$/);
  if (!m) return null;
  const parts: DecodedPart[] = [
    { key: "i-family", code: m[1] },
    { key: "i-hand", code: m[2] },
    { key: "i-size", code: m[3], text: `Insert size ${m[3]} (minimum ${m[1] === "GFQ" ? "face groove" : "bore"} diameter ${mm(Number(m[3]))})` },
  ];
  if (m[4]) parts.push({ key: "i-deep", code: m[4], text: `Deep grooving, minimum bore diameter ${mm(Number(m[4]))}` });
  if (m[5]) parts.push({ key: "i-type", code: m[5] + m[6] });
  else parts.push({ key: "i-width", code: m[7], text: `Cutting width ${mm(Number(m[7]))}` });
  const re = m[8] ? Number(m[9]) / 100 : Number(m[9]);
  parts.push({ key: "i-radius", code: (m[8] ?? "") + m[9], text: m[8] ? `Full radius ${mm(re)}` : re ? `Corner radius ${mm(re)}` : "Sharp corners (no radius)" });
  return { kind: "CHAM-GROOVE insert", parts };
}

// QUICK-I-GROOVE: 4-edge internal inserts GQIN 1.50-0.10 (width, corner radius)
// and bars GQHINR 16C-16.5-20 (shank, coolant, Dmin, reduced length).
export function decodeQuickIGroove(text: string): Decoded | null {
  const s = squash(text);
  let m = s.match(/^GQIN(\d+\.\d+)-(\d+\.\d+)$/);
  if (m) {
    const re = Number(m[2]);
    return {
      kind: "QUICK-I-GROOVE insert",
      parts: [
        { key: "i-family", code: "GQIN" },
        { key: "i-width", code: m[1], text: `Cutting width ${mm(Number(m[1]))}` },
        { key: "i-radius", code: m[2], text: re ? `Corner radius ${mm(re)}` : "Sharp corners (no radius)" },
      ],
    };
  }
  m = s.match(/^GQHIN([RL])(\d{2})(C)?-(\d+(?:\.\d+)?)(?:-(\d{2,3}))?$/);
  if (!m) return null;
  const parts: DecodedPart[] = [
    { key: "t-family", code: "GQHIN" },
    { key: "t-hand", code: m[1] },
    { key: "t-height", code: m[2], text: `Shank diameter ${mm(Number(m[2]))}` },
  ];
  if (m[3]) parts.push({ key: "t-suffix", code: "C" });
  parts.push({ key: "t-dmin", code: m[4], text: `Minimum bore diameter ${mm(Number(m[4]))}` });
  if (m[5]) parts.push({ key: "t-length", code: m[5], text: `Reduced (neck) length ${mm(Number(m[5]))}` });
  return { kind: "QUICK-I-GROOVE bar", parts };
}

// HELIFACE insert: HFPR 3003 (width 3, corner radius x10: 0.3 mm), HFPR 4020
// (full radius), HFPN 2002. Tools: adapters HFAIR 140C-4T30DG / HGAIR 12-3T6
// (Dmin, coolant, width T max depth), blades HFFR 48-4T25 / HFFH 100L-2,
// holders HFHR 20-25-3T12 / HGHR 1212-12-3T6 / HFHR 20M, bars HFIR 16MC,
// cartridges CR HFIR-16M / IH-HFAIR and IM40 HFIR-MC.
const HELIFACE_TOOLS = ["HFPAD", "HFHP", "HFFH", "HFFA", "HFAI", "HFAE", "HGAI", "HGAE", "HFF", "HFH", "HFI", "HGH"];
const HELIFACE_SHANK_FIRST = ["HFH", "HGH", "HFHP", "HFI"];
export function decodeHeliFace(text: string): Decoded | null {
  const s = squash(text);
  let m = s.match(/^HFP([RLN])(\d)(\d{3})$/);
  if (m) {
    const w = Number(m[2]), re = Number(m[3]) / 10;
    return {
      kind: "HELIFACE insert",
      parts: [
        { key: "i-family", code: "HFP" },
        { key: "i-hand", code: m[1] },
        { key: "i-width", code: m[2] + m[3], text: `Cutting width ${mm(w)}, corner radius ${mm(re)}${Math.abs(re * 2 - w) < 0.02 ? " (full radius)" : ""}` },
      ],
    };
  }
  m = s.match(new RegExp(`^(IM\\d{2}|CR|IH-)?(${HELIFACE_TOOLS.join("|")})([RL])?-?(.*)$`));
  if (!m) return null;
  const family = m[2];
  const parts: DecodedPart[] = [];
  if (m[1]) parts.push({ key: "t-prefix", code: m[1].replace("-", "") });
  parts.push({ key: "t-family", code: family });
  if (m[3]) parts.push({ key: "t-hand", code: m[3] });
  let shank = !HELIFACE_SHANK_FIRST.includes(family);
  for (const token of m[4] ? m[4].split("-") : []) {
    let t: RegExpMatchArray | null;
    if ((t = token.match(/^(\d{4})$/))) {
      parts.push({ key: "t-height", code: t[1], text: `Shank ${Number(t[1].slice(0, 2))} x ${Number(t[1].slice(2))} mm` });
      shank = true;
    } else if ((t = token.match(/^(\d{2})(MC|M)$/))) {
      parts.push({ key: "t-height", code: t[1], text: `Shank / bar size ${mm(Number(t[1]))}` }, { key: "t-suffix", code: t[2] });
      shank = true;
    } else if ((t = token.match(/^(\d{2,3})([RL])?(C)?$/))) {
      if (!shank) {
        parts.push({ key: "t-height", code: t[1], text: `Shank size ${mm(Number(t[1]))}` });
        shank = true;
      } else parts.push({ key: "t-dmin", code: t[1], text: `Minimum face groove diameter ${mm(Number(t[1]))}` });
      if (t[2]) parts.push({ key: "t-hand", code: t[2] });
      if (t[3]) parts.push({ key: "t-suffix", code: "C" });
    } else if ((t = token.match(/^(\d)T(\d{1,2})(DG)?$/))) {
      parts.push({ key: "t-width", code: t[1], text: `Insert width ${mm(Number(t[1]))}` }, { key: "t-depth", code: `T${t[2]}`, text: `Maximum cutting depth ${mm(Number(t[2]))}` });
      if (t[3]) parts.push({ key: "t-suffix", code: "DG" });
    } else if ((t = token.match(/^(\d)(M)?$/))) {
      parts.push({ key: "t-width", code: t[1], text: `Insert width ${mm(Number(t[1]))}` });
      if (t[2]) parts.push({ key: "t-suffix", code: "M" });
    } else if (token === "MC" || token === "M") parts.push({ key: "t-suffix", code: token });
    else return null;
  }
  return { kind: "HELIFACE tool", parts };
}

// Tool families per brand (longest first), and whether a hand letter follows.
export const TANG_GRIP_TOOLS = ["TAGPAD", "TGFH", "TGFS", "TGSU", "TGAD", "TGAQ", "TGT", "ADMP", "THMP"];
export const DO_GRIP_TOOLS = ["DGPAD", "DGFH", "DGFS", "DGAD", "HGAD", "DGAQ", "DGT"];
export const PENTA_TOOLS = ["PCHB", "PCHP", "PCAD", "PCH"];
export const BGM_TOOLS = ["BGT"];
export const GROOVE4CUT_TOOLS = ["QTH"];
export const HELI_GRIP_TOOLS = ["HELII", "HELI", "HGFH"];
export const TOP_GRIP_TOOLS = ["TGD", "TGH", "TGI"];
export const SWISSCUT_TOOLS = ["SCH"];
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
  let sized = family === "PCAD";
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
    } else if (family === "SCH" && (m = token.match(/^(22|41)(BF)$/))) {
      // SWISSCUT holders: insert series and back and front clamping (e.g. 22BF).
      parts.push({ key: "t-seat", code: m[1], text: `For SCI ${m[1]} inserts` }, { key: "t-suffix", code: "BF" });
    } else if (quad && token === "30") {
      parts.push({ key: "t-seat", code: token, text: "For QGI 30 inserts" });
    } else if (penta && (m = token.match(/^(17|24|27|34)([NRL])?$/))) {
      // The PENTA seat (27: PENTAS 27 wide blanks), and the insert's hand.
      parts.push({ key: "t-penta", code: m[1], text: `For PENTA ${m[1]} inserts` });
      if (m[2]) parts.push({ key: "t-hand", code: m[2] });
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
    } else if (sized && (m = token.match(/^(\d+(?:\.\d+)?)(DG|D|S|M)$/))) {
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

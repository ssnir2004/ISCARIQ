import type { Decoded, DecodedPart } from "./insertDecoders";

// Designation decoders for the Drilling code keys (Code keys -> Drilling), one
// per family: its heads (e.g. ICP 040) and its drill bodies (e.g. DCN
// 060-018-12R-3D). Parts name their code key section by key: heads "i-<part>",
// bodies "t-<part>".

const squash = (s: string) => s.toUpperCase().replace(/\s+/g, "");
const mm = (n: number) => `${Number(n.toFixed(2))} mm`;
// Three digits are x10 (ICP 040 = 4.0 mm), four x100 (ICK 0635 = 6.35 mm).
const dia = (code: string) => Number(code) / (code.length === 4 ? 100 : 10);

// SUMO-CHAM: heads ICP 040, ICK 0635, ICP 060-2M, IHP 138-BD, FCP 088 / FCP
// 040-IQ (flat bottom); drill
// bodies DCN 060-018-12R-3D (smallest head, length, shank and its type, depth
// ratio), DCNS 075-022-080B-3D, DCNM 060-018-M12-3D (FLEX-FIT), DCN
// 040-008-MMT05-2D (MULTI-MASTER), DCN 040-012-06-3D-PICCO, DCNT 068-021-12A-M8
// (pre-thread hole for M8) and DCN 135-050-16N-5D-BD.
export function decodeSumoCham(text: string): Decoded | null {
  const s = squash(text);
  let m = s.match(/^(ICP|ICM|ICK|ICN|ICG|IHP|QCP)(\d{3,4})(?:-(2M|BD))?$/) ?? s.match(/^(FCP)(\d{3,4})(?:-(IQ))?$/);
  if (m) {
    return {
      kind: "SUMO-CHAM drilling head",
      parts: [
        { key: "i-family", code: m[1] },
        { key: "i-dia", code: m[2], text: `Drilling diameter ${mm(dia(m[2]))}` },
        ...(m[3] ? [{ key: "i-suffix", code: m[3] }] : []),
      ],
    };
  }
  m = s.match(/^(DCNS|DCNM|DCNT|DCN)(\d{3})-(\d{3})-(.+)$/);
  if (!m) return null;
  const parts: DecodedPart[] = [
    { key: "t-family", code: m[1] },
    m[1] === "DCNT"
      ? { key: "t-dia", code: m[2], text: `Pre-thread hole diameter ${mm(dia(m[2]))}` }
      : { key: "t-dia", code: m[2], text: `For heads from ${mm(dia(m[2]))}` },
    { key: "t-length", code: m[3], text: `Usable length about ${Number(m[3])} mm` },
  ];
  const depth = (code: string) => ({ key: "t-depth", code: `${code}D`, text: `Drilling depth ${code}xD` });
  const rest = m[4];
  let r: RegExpMatchArray | null;
  if ((r = rest.match(/^(\d{2})([RACN])-(\d+(?:\.\d+)?)D(?:-(BD))?$/))) {
    parts.push({ key: "t-height", code: r[1], text: `Shank diameter ${mm(Number(r[1]))}` }, { key: "t-shank", code: r[2] }, depth(r[3]));
    // The BD bodies all read 050 there, whatever their length.
    if (r[4]) {
      parts[2] = { key: "t-length", code: m[3], text: "Length code (see the catalog)" };
      parts.push({ key: "t-suffix", code: "BD" });
    }
  } else if ((r = rest.match(/^(\d{3})(B)-(\d+)D$/))) {
    parts.push({ key: "t-height", code: r[1], text: `Shank diameter ${mm(Number(r[1]) / 10)}` }, { key: "t-shank", code: r[2] }, depth(r[3]));
  } else if ((r = rest.match(/^(M\d{2})-(\d+)D$/))) {
    parts.push({ key: "t-connection", code: r[1], text: `FLEX-FIT ${r[1]} thread connection` }, depth(r[2]));
  } else if ((r = rest.match(/^(MMT\d{2})-(\d+)D$/))) {
    parts.push({ key: "t-connection", code: r[1], text: `MULTI-MASTER ${r[1].slice(2)} connection` }, depth(r[2]));
  } else if ((r = rest.match(/^(\d{2})-(\d+)D-PICCO$/))) {
    parts.push({ key: "t-height", code: r[1], text: `Shank diameter ${mm(Number(r[1]))}` }, depth(r[2]), { key: "t-connection", code: "PICCO" });
  } else if ((r = rest.match(/^(\d{2})([A])-(M\d{1,2})$/))) {
    parts.push({ key: "t-height", code: r[1], text: `Shank diameter ${mm(Number(r[1]))}` }, { key: "t-shank", code: r[2] }, { key: "t-thread", code: r[3], text: `For ${r[3]} threads` });
  } else return null;
  return { kind: "SUMO-CHAM drill body", parts };
}

// SUMO-CHAM IQ: self-centering heads HCP 040-IQ, HCP 1605-IQ (on DCN drill
// bodies, see SUMO-CHAM).
export function decodeSumoChamIq(text: string): Decoded | null {
  const m = squash(text).match(/^HCP(\d{3,4})-IQ$/);
  if (!m) return null;
  return {
    kind: "SUMO-CHAM IQ drilling head",
    parts: [
      { key: "i-family", code: "HCP" },
      { key: "i-dia", code: m[1], text: `Drilling diameter ${mm(dia(m[1]))}` },
      { key: "i-suffix", code: "IQ" },
    ],
  };
}

// Exchangeable-head drill lines that share one designation scheme: heads
// FAM ###[-SUFFIX] (diameter x10 / x100, e.g. H3P 120-IQ, IDI 068-SG, HFP
// 330-SPADE IQ) and bodies FAM ###-###-##X-#D[-SUFFIX] (smallest head x10,
// length, shank and its type, depth ratio, e.g. D3N 120-036-16A-3D, DCM
// 075-026-8B-3.5D) or FAM ###-###-##X-M## (pre-thread bodies, e.g. DCT
// 068-021-14B-M8).
interface HeadBodyLine {
  brand: string;
  heads: string[];
  bodies: string[];
}
function decodeHeadBody(text: string, line: HeadBodyLine): Decoded | null {
  const s = squash(text);
  const fam = (list: string[]) => [...list].sort((a, b) => b.length - a.length).find((f) => s.startsWith(f) && /^\d/.test(s.slice(f.length)));
  const head = fam(line.heads);
  let m: RegExpMatchArray | null;
  if (head && (m = s.slice(head.length).match(/^(\d{3,4})(?:-([A-Z0-9]+(?:-[A-Z0-9]+)?))?$/))) {
    return {
      kind: `${line.brand} drilling head`,
      parts: [
        { key: "i-family", code: head },
        { key: "i-dia", code: m[1], text: `Drilling diameter ${mm(dia(m[1]))}` },
        ...(m[2] ? [{ key: "i-suffix", code: m[2] }] : []),
      ],
    };
  }
  const body = fam(line.bodies);
  if (!body || !(m = s.slice(body.length).match(/^(\d{3})-(\d{3})-(\d{1,2})([A-Z])-(?:(\d+(?:\.\d+)?)D|(M\d{1,2}))(?:-([A-Z]+))?$/))) return null;
  const parts: DecodedPart[] = [
    { key: "t-family", code: body },
    m[6]
      ? { key: "t-dia", code: m[1], text: `Pre-thread hole diameter ${mm(dia(m[1]))}` }
      : { key: "t-dia", code: m[1], text: `For heads from ${mm(dia(m[1]))}` },
    { key: "t-length", code: m[2], text: m[7] === "BD" ? "Length code (see the catalog)" : `Usable length about ${Number(m[2])} mm` },
    { key: "t-height", code: m[3], text: `Shank diameter ${mm(Number(m[3]))}` },
    { key: "t-shank", code: m[4] },
    m[6] ? { key: "t-thread", code: m[6], text: `For ${m[6]} threads` } : { key: "t-depth", code: `${m[5]}D`, text: `Drilling depth ${m[5]}xD` },
  ];
  if (m[7]) parts.push({ key: "t-suffix", code: m[7] });
  return { kind: `${line.brand} drill body`, parts };
}

// QUICK-3-CHAM: 3 flute heads H3P 120-IQ, F3P 143-IQ (flat), F3B 2381-IQ
// (counterboring) on D3N bodies (D3N 120-036-16A-3D).
export function decodeQuick3Cham(text: string): Decoded | null {
  return decodeHeadBody(text, { brand: "QUICK-3-CHAM", heads: ["H3P", "F3P", "F3B"], bodies: ["D3N"] });
}

// SUMO-L-DRILL: double margin heads ILP 120-2M on DLN side screw lock bodies
// (DLN 120-036-16A-3D).
export function decodeSumoLDrill(text: string): Decoded | null {
  return decodeHeadBody(text, { brand: "SUMO-L-DRILL", heads: ["ILP"], bodies: ["DLN"] });
}

// SPADE-CHAM: large diameter indexable heads HFP 330-SPADE IQ, IFP 338-SPADE IQ,
// IFHP 3334-SPADE-BD on DFN bodies (DFN 330-099-32A-3D-IQ, DFN 330-070-32A-5D-BD).
export function decodeSpadeCham(text: string): Decoded | null {
  return decodeHeadBody(text, { brand: "SPADE-CHAM", heads: ["HFP", "IFP", "IFHP"], bodies: ["DFN"] });
}

// CHAM-DRILL: heads IDI 068-SG / IDI 109-SK on DCM bodies (DCM 075-022-12A-3D,
// DCM 075-026-8B-3.5D), pre-thread DCT 068-021-14B-M8, chamfering rings RING DCM
// 100 (for DCM 100 drills) and their XOGX 090700-45DT inserts.
export function decodeChamDrill(text: string): Decoded | null {
  const s = squash(text);
  let m = s.match(/^RINGDCM(\d{3})$/);
  if (m) {
    return {
      kind: "CHAM-DRILL chamfering ring",
      parts: [
        { key: "t-family", code: "RING DCM", text: "Chamfering ring for CHAM-DRILL (DCM) drills" },
        { key: "t-dia", code: m[1], text: `For DCM ${m[1]} drills (heads from ${mm(dia(m[1]))})` },
      ],
    };
  }
  if ((m = s.match(/^XOGX(\d{2})(\d{2})(\d{2})-(\d{2})([A-Z]+)$/))) {
    return {
      kind: "CHAM-DRILL chamfering ring insert",
      parts: [
        { key: "i-family", code: "XOGX" },
        { key: "i-size", code: `${m[1]}${m[2]}${m[3]}`, text: `Size ${Number(m[1])} x ${Number(m[2])} mm` + " (inferred)" },
        { key: "i-angle", code: m[4], text: `Chamfer angle ${Number(m[4])}°` },
        { key: "i-chip", code: m[5] },
      ],
    };
  }
  return decodeHeadBody(text, { brand: "CHAM-DRILL", heads: ["IDI"], bodies: ["DCM", "DCT"] });
}

// SUMO-GUN: modular shank gundrills carrying SUMO-CHAM heads, MNSNT
// 100-200-MF16X1 (smallest head x10, usable length, MF16x1 connection thread).
export function decodeSumoGun(text: string): Decoded | null {
  const m = squash(text).match(/^MNSNT(\d{3})-(\d{3})-MF(\d{2})X(\d)$/);
  if (!m) return null;
  return {
    kind: "SUMO-GUN gundrill",
    parts: [
      { key: "t-family", code: "MNSNT" },
      { key: "t-dia", code: m[1], text: `For SUMO-CHAM heads from ${mm(dia(m[1]))}` },
      { key: "t-length", code: m[2], text: `Usable length ${Number(m[2])} mm` },
      { key: "t-connection", code: `MF${m[3]}X${m[4]}`, text: `Modular shank thread M${m[3]} x ${m[4]}` },
    ],
  };
}

// DR-TWIST: indexable insert drills DR120-036-16-04-3D-N (diameter x10, or in
// mm from 26 mm with a leading 0: DR030 = 30 mm; usable length, shank, insert
// size, depth ratio, N rotating / T non-rotating), large diameter DR-CA drills
// 062-155-50-10/11CA, and their inserts SOMT 120408-DT, SOMT 09T306-GF, XOMT
// 060204-DT, AOMT 040204-90DT.
export function decodeDrTwist(text: string): Decoded | null {
  const s = squash(text);
  let m = s.match(/^(SOMT|SOMX|SOGX|SOGT|XOMT|AOMT|AOGT)(\d{2})([\dT]\d)(\d{2})-(\d{2})?([A-Z]{2})$/);
  if (m) {
    return {
      kind: "DR-TWIST insert",
      parts: [
        { key: "i-family", code: m[1] },
        { key: "i-size", code: m[2], text: `Insert size ${m[2]}` },
        { key: "i-thick", code: m[3], lookup: m[3].includes("T") ? "#T#" : "##" },
        { key: "i-radius", code: m[4], text: `Corner radius ${mm(Number(m[4]) / 10)}` },
        ...(m[5] ? [{ key: "i-angle", code: m[5], text: `${Number(m[5])}° insert (chamfering)` }] : []),
        { key: "i-chip", code: m[6] },
      ],
    };
  }
  if ((m = s.match(/^DR(\d{3})-(\d{3})-(\d{2})-(\d{2})-(\d+)D-([NT])$/))) {
    const d = m[1].startsWith("0") ? Number(m[1]) : Number(m[1]) / 10;
    return {
      kind: "DR-TWIST drill",
      parts: [
        { key: "t-family", code: "DR" },
        { key: "t-dia", code: m[1], text: `Drilling diameter ${mm(d)}` },
        { key: "t-length", code: m[2], text: `Usable length about ${Number(m[2])} mm` },
        { key: "t-height", code: m[3], text: `Shank diameter ${mm(Number(m[3]))}` },
        { key: "t-insert", code: m[4], text: `For size ${m[4]} inserts` },
        { key: "t-depth", code: `${m[5]}D`, text: `Drilling depth ${m[5]}xD` },
        { key: "t-type", code: m[6] },
      ],
    };
  }
  if ((m = s.match(/^(\d{3})-(\d{3})-(\d{2})-(\d{2})\/(\d{2})CA$/))) {
    return {
      kind: "DR-TWIST large diameter drill",
      parts: [
        { key: "t-dia", code: m[1], text: `Drilling diameter ${mm(Number(m[1]))}` },
        { key: "t-length", code: m[2], text: `Usable length about ${Number(m[2])} mm` },
        { key: "t-height", code: m[3], text: `Shank diameter ${mm(Number(m[3]))}` },
        { key: "t-insert", code: `${m[4]}/${m[5]}`, text: `For size ${m[4]} / ${m[5]} inserts` },
        { key: "t-type", code: "CA" },
      ],
    };
  }
  return null;
}

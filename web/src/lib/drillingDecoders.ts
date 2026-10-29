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

// COMBI-CHAM: large diameter drills with a pilot SUMO-CHAM head and peripheral
// inserts, MNC 260-130 A32-150-06-5D (diameter x10, usable length, shank,
// pilot ICP head x10, insert size, depth ratio) or ...-169-W5-8D (WCGX size 05
// peripheral inserts), and their wiper inserts SOGX 050204-W, SOGT 09T306-W.
export function decodeCombiCham(text: string): Decoded | null {
  const s = squash(text);
  let m = s.match(/^(SOGX|SOGT)(\d{2})([\dT]\d)(\d{2})-W$/);
  if (m) {
    return {
      kind: "COMBI-CHAM insert",
      parts: [
        { key: "i-family", code: m[1] },
        { key: "i-size", code: m[2], text: `Insert size ${m[2]}` },
        { key: "i-thick", code: m[3], lookup: m[3].includes("T") ? "#T#" : "##" },
        { key: "i-radius", code: m[4], text: `Corner radius ${mm(Number(m[4]) / 10)}` },
        { key: "i-chip", code: "W" },
      ],
    };
  }
  if (!(m = s.match(/^MNC(\d{3})-(\d{3})([A-Z])(\d{2})-(\d{3})-(W?\d{1,2})-(\d+)D$/))) return null;
  return {
    kind: "COMBI-CHAM drill",
    parts: [
      { key: "t-family", code: "MNC" },
      { key: "t-dia", code: m[1], text: `Drilling diameter ${mm(dia(m[1]))}` },
      { key: "t-length", code: m[2], text: `Usable length about ${Number(m[2])} mm` },
      { key: "t-shank", code: m[3] },
      { key: "t-height", code: m[4], text: `Shank diameter ${mm(Number(m[4]))}` },
      { key: "t-pilot", code: m[5], text: `Pilot SUMO-CHAM head ICP ${m[5]} (${mm(dia(m[5]))})` },
      m[6].startsWith("W")
        ? { key: "t-insert", code: m[6], text: `Peripheral WCGX size ${m[6].slice(1).padStart(2, "0")} inserts` }
        : { key: "t-insert", code: m[6], text: `Peripheral size ${m[6]} inserts (SOGX / SOGT)` },
      { key: "t-depth", code: `${m[7]}D`, text: `Drilling depth ${m[7]}xD` },
    ],
  };
}

// MODU-DRILL: modular bodies MD-BODY-33-36-108-32A-3D (head range, length,
// shank, depth) and extensions MD-EXTENSION-33-36-200, carrying heads MD-DFN
// 330 HEAD, MD-DR-DH 330 070606-06 (square inserts), MD-MNC 280-119-W5 (pilot
// ICP 119-MNC 4F, WCGX 05 inserts) or MD-MNC 280-IMH28-119-W5; WCGX
// 05T308-W-DC peripheral inserts.
export function decodeModuDrill(text: string): Decoded | null {
  const s = squash(text);
  let m = s.match(/^MD-(BODY|EXTENSION)-(\d{2})-(\d{2})-(\d{3})(?:-(\d{2})([A-Z]))?(?:-(\d+)D)?$/);
  if (m) {
    const parts: DecodedPart[] = [
      { key: "t-family", code: `MD-${m[1]}` },
      { key: "t-range", code: `${m[2]}-${m[3]}`, text: `For heads ${Number(m[2])} – ${Number(m[3])} mm` },
      { key: "t-length", code: m[4], text: m[1] === "EXTENSION" ? `Extends the length by ${Number(m[4])} mm` : `Length about ${Number(m[4])} mm` },
    ];
    if (m[5]) parts.push({ key: "t-height", code: m[5], text: `Shank diameter ${mm(Number(m[5]))}` }, { key: "t-shank", code: m[6] });
    if (m[7]) parts.push({ key: "t-depth", code: `${m[7]}D`, text: `Drilling depth ${m[7]}xD` });
    return { kind: "MODU-DRILL body", parts };
  }
  if ((m = s.match(/^MD-DFN(\d{3})HEAD$/))) {
    return { kind: "MODU-DRILL head", parts: [{ key: "h-family", code: "MD-DFN" }, { key: "h-dia", code: m[1], text: `Drilling diameter ${mm(dia(m[1]))}` }] };
  }
  if ((m = s.match(/^MD-DR-DH(\d{3})(\d{6})-(\d{2})$/))) {
    return {
      kind: "MODU-DRILL head",
      parts: [
        { key: "h-family", code: "MD-DR-DH" },
        { key: "h-dia", code: m[1], text: `Drilling diameter ${mm(dia(m[1]))}` },
        { key: "h-insert", code: m[2], text: `Square inserts ...${m[2]}` },
        { key: "h-variant", code: m[3], lookup: "##" },
      ],
    };
  }
  if ((m = s.match(/^MD-MNC(\d{3})-(?:(IMH\d{2})-)?(\d{3})-W(\d)$/))) {
    return {
      kind: "MODU-DRILL head",
      parts: [
        { key: "h-family", code: "MD-MNC" },
        { key: "h-dia", code: m[1], text: `Drilling diameter ${mm(dia(m[1]))}` },
        ...(m[2] ? [{ key: "h-imh", code: m[2], text: `IMH ${m[2].slice(3)} pilot head connection` }] : []),
        { key: "h-pilot", code: m[3], text: `Pilot SUMO-CHAM head ICP ${m[3]}-MNC (${mm(dia(m[3]))})` },
        { key: "h-insert", code: `W${m[4]}`, text: `WCGX size 0${m[4]} peripheral inserts` },
      ],
    };
  }
  if ((m = s.match(/^ICP(\d{3})-MNC(\d)F$/))) {
    return {
      kind: "MODU-DRILL pilot head",
      parts: [
        { key: "i-family", code: "ICP", text: "SUMO-CHAM pilot head for modular combi drills" },
        { key: "i-dia", code: m[1], text: `Drilling diameter ${mm(dia(m[1]))}` },
        { key: "i-suffix", code: `MNC ${m[2]}F` },
      ],
    };
  }
  if ((m = s.match(/^WCGX(\d{2})([\dT]\d)(\d{2})-W-([A-Z]+)$/))) {
    return {
      kind: "MODU-DRILL insert",
      parts: [
        { key: "i-family", code: "WCGX" },
        { key: "i-size", code: m[1], text: `Insert size ${m[1]}` },
        { key: "i-thick", code: m[2], lookup: m[2].includes("T") ? "#T#" : "##" },
        { key: "i-radius", code: m[3], text: `Corner radius ${mm(Number(m[3]) / 10)}` },
        { key: "i-suffix", code: "W" },
        { key: "i-chip", code: m[4] },
      ],
    };
  }
  return null;
}

// MULTI-FUNCTION TOOLS: DRG-MF-10R-2.25D-12A-05 (diameter, hand, depth ratio,
// shank, XCMT insert size) for drilling, boring, turning, facing and grooving,
// their XCMT 050204-MF / 040104L-MF inserts, and PICCO R-MF 6-3 L06 / PICCO
// R-MFT60 6-4 L08 solid carbide tools (hand, shank, diameter, length; MFT60:
// with 60° threading).
export function decodeMultiFunction(text: string): Decoded | null {
  const s = squash(text);
  let m = s.match(/^(DRG|DR)-MF-(\d{2})([RL])-(\d+(?:\.\d+)?)D-(\d{2})([A-Z])-(\d{2})$/);
  if (m) {
    return {
      kind: "MULTI-FUNCTION tool",
      parts: [
        { key: "t-family", code: `${m[1]}-MF` },
        { key: "t-dia", code: m[2], text: `Drilling diameter ${mm(Number(m[2]))}` },
        { key: "t-hand", code: m[3] },
        { key: "t-depth", code: `${m[4]}D`, text: `Drilling depth ${m[4]}xD` },
        { key: "t-height", code: m[5], text: `Shank diameter ${mm(Number(m[5]))}` },
        { key: "t-shank", code: m[6] },
        { key: "t-insert", code: m[7], text: `For XCMT ${m[7]}... inserts` },
      ],
    };
  }
  if ((m = s.match(/^XCMT(\d{2})([\dT]\d)(\d{2})([RL])?-MF$/))) {
    return {
      kind: "MULTI-FUNCTION insert",
      parts: [
        { key: "i-family", code: "XCMT" },
        { key: "i-size", code: m[1], text: `Insert size ${m[1]}` },
        { key: "i-thick", code: m[2], lookup: m[2].includes("T") ? "#T#" : "##" },
        { key: "i-radius", code: m[3], text: `Corner radius ${mm(Number(m[3]) / 10)}` },
        ...(m[4] ? [{ key: "i-hand", code: m[4] }] : []),
        { key: "i-chip", code: "MF" },
      ],
    };
  }
  if ((m = s.match(/^PICCO([RL])-(MFT60|MF)(\d)-(\d)L(\d{2})$/))) {
    return {
      kind: "PICCO multifunction tool",
      parts: [
        { key: "p-family", code: "PICCO" },
        { key: "p-hand", code: m[1] },
        { key: "p-type", code: m[2] },
        { key: "p-shank", code: m[3], text: `Shank diameter ${mm(Number(m[3]))}` },
        { key: "p-dia", code: m[4], text: `Diameter ${mm(Number(m[4]))}` },
        { key: "p-length", code: `L${m[5]}`, text: `Usable length ${Number(m[5])} mm` },
      ],
    };
  }
  return null;
}

// SOLID-DRILL: solid carbide drills SCD 121-043-140 AP3 / SCCD 040-017-060 ACP3
// (diameter x10 or x100, length, shank x10, line), SCD 0330-025-040 FNPCD, SCD
// 030-014-060 PICCO 3D, pre-thread SCDT 068-021-100-M8 and chamfering / spot
// drilling ECD-S2 030/90C03-38 (diameter, point angle, shank, overall length).
export function decodeSolidDrill(text: string): Decoded | null {
  const s = squash(text);
  let m = s.match(/^(SCCD|SCDT|SCD)(\d{3,4})-(\d{3})-(\d{3})(?:-(M\d{1,2})|([A-Z][A-Z0-9]*?)(\d+D)?)$/);
  if (m) {
    const parts: DecodedPart[] = [
      { key: "t-family", code: m[1] },
      { key: "t-dia", code: m[2], text: `Drilling diameter ${mm(dia(m[2]))}` },
      { key: "t-length", code: m[3], text: `Flute / usable length about ${Number(m[3])} mm` },
      { key: "t-height", code: m[4], text: `Shank diameter ${mm(Number(m[4]) / 10)}` },
    ];
    if (m[5]) parts.push({ key: "t-thread", code: m[5], text: `For ${m[5]} threads` });
    else parts.push({ key: "t-line", code: m[6] + (m[7] ?? "") });
    return { kind: "SOLID-DRILL drill", parts };
  }
  if ((m = s.match(/^ECD-S2(\d{2,3})\/(\d{2,3})C(\d{2})-(\d{2})$/))) {
    return {
      kind: "SOLID-DRILL chamfering and spot drill",
      parts: [
        { key: "t-family", code: "ECD-S2" },
        { key: "t-dia", code: m[1], text: `Diameter ${mm(m[1].length === 3 ? dia(m[1]) : Number(m[1]))}` },
        { key: "t-angle", code: m[2], text: `Point angle ${Number(m[2])}°` },
        { key: "t-height", code: `C${m[3]}`, text: `Cylindrical shank ${mm(Number(m[3]))}` },
        { key: "t-length", code: m[4], text: `Overall length ${Number(m[4])} mm` },
      ],
    };
  }
  return null;
}

// CHAMRING: chamfering drill holders CHAMRING 080-WN20-06 (drill size x10,
// WN shank, XCGT insert size) carrying XCGT 060300-45DT inserts (size, chamfer
// angle, chipformer), for drilling and chamfering in one operation.
export function decodeChamring(text: string): Decoded | null {
  const s = squash(text);
  let m = s.match(/^CHAMRING(\d{3})-WN(\d{2})-(\d{2})$/);
  if (m) {
    return {
      kind: "CHAMRING chamfering holder",
      parts: [
        { key: "t-family", code: "CHAMRING" },
        { key: "t-dia", code: m[1], text: `For drills from ${mm(dia(m[1]))}` },
        { key: "t-height", code: `WN${m[2]}`, text: `WN shank ${mm(Number(m[2]))}` },
        { key: "t-insert", code: m[3], text: `For XCGT ${m[3]}... inserts` },
      ],
    };
  }
  if (!(m = s.match(/^XCGT(\d{2})(\d{2})(\d{2})-(\d{2})([A-Z]+)$/))) return null;
  return {
    kind: "CHAMRING insert",
    parts: [
      { key: "i-family", code: "XCGT" },
      { key: "i-size", code: `${m[1]}${m[2]}${m[3]}`, text: `Insert size ${m[1]}` },
      { key: "i-angle", code: m[4], text: `Chamfer angle ${Number(m[4])}°` },
      { key: "i-chip", code: m[5] },
    ],
  };
}

// MULTI-MASTER drilling heads: MM HCD100-120-2T06 (diameter x10 or inch, point
// angle), MM ECD-10X90-2T06 (spot drill: diameter, angle), MM ECS-A3.15X08-2T05
// (DIN 332 form, pilot and body diameters), MM ECF45-080-4T05, MM EDF, MM
// EFCB110A08-4T06, MM ECDF080A100-2T05, MM SPD080-08-3T06; each ends with the
// number of flutes and the T thread size of the MULTI-MASTER connection.
export function decodeMultiMasterDrill(text: string): Decoded | null {
  const s = squash(text);
  const m = s.match(/^MM(HCD|ECF|ECS|EDF|ECDF|ECD|EFCB|SPD)-?(.+?)-(\d)T(\d{2})(-M)?$/);
  if (!m) return null;
  const [, fam, dims] = m;
  const parts: DecodedPart[] = [{ key: "t-family", code: fam }];
  let d: RegExpMatchArray | null;
  if (fam === "ECS" && (d = dims.match(/^([AB])(\d+\.\d+)X(\d+)$/))) {
    parts.push(
      { key: "t-form", code: d[1] },
      { key: "t-dia", code: d[2], text: `Pilot diameter ${mm(Number(d[2]))}` },
      { key: "t-dims", code: d[3], text: `Body diameter code ${d[3]} (see the catalog)` },
    );
  } else if (fam === "ECD" && (d = dims.match(/^(\d{2})X(\d{2,3})$/))) {
    parts.push({ key: "t-dia", code: d[1], text: `Diameter ${mm(Number(d[1]))}` }, { key: "t-angle", code: d[2], text: `Point angle ${Number(d[2])}°` });
  } else if (fam === "HCD" && (d = dims.match(/^(\d{3}|\.\d{3})-(\d{3})$/))) {
    parts.push(
      { key: "t-dia", code: d[1], text: d[1].startsWith(".") ? `Diameter ${d[1]} inch` : `Diameter ${mm(dia(d[1]))}` },
      { key: "t-angle", code: d[2], text: `Point angle ${Number(d[2])}°` },
    );
  } else if ((d = dims.match(/^(\d{3,4})(?:[A-]|$)(.*)$/)) && fam !== "ECF") {
    parts.push({ key: "t-dia", code: d[1], text: `Diameter ${mm(dia(d[1]))}` });
    if (d[2]) parts.push({ key: "t-dims", code: d[2], text: `Dimension code ${d[2]} (see the catalog)` });
  } else {
    parts.push({ key: "t-dims", code: dims, text: `Dimension code ${dims} (see the catalog)` });
  }
  parts.push({ key: "t-flutes", code: m[3], text: `${m[3]} flutes` }, { key: "t-connection", code: `T${m[4]}`, text: `MULTI-MASTER T${m[4]} connection` });
  if (m[5]) parts.push({ key: "t-suffix", code: "M" });
  return { kind: "MULTI-MASTER head", parts };
}

// Deep hole drilling (BTA / ejector) tube tools shared by TRI-DEEP, FINE-BEAM
// and ISCAR-DEEP-DRILL: DSD-EF 14.00-14.60-FT (system, thread connection,
// diameter range, line), DSD-E3 17.71-18.40-DTL, DSD-E0 8.00-8.99 NOM 0, DSD-EC
// 38.00-39.60; and their indexable inserts (TOGT 070304-DT, NPMT 050304R-G-I).
const DEEP_SYSTEM: Record<string, string> = {
  DSD: "Single tube (BTA) drill",
  DDD: "Double tube (ejector) drill",
  DSC: "Single tube counterbore",
  DDC: "Double tube counterboring drill",
  DSTR: "Single tube trepanning drill",
};
function decodeDeepTube(s: string): { parts: DecodedPart[]; line?: string } | null {
  const m = s.match(/^(DSTR|DSD|DDD|DSC|DDC)-(E0|E1|E2|E3|EF|IF|EC|IC|EA|IA)(\d+\.\d+)-(\d+\.\d+)(?:-([A-Z]+)|NOM(\d))?$/);
  if (!m) return null;
  const inch = Number(m[3]) < 2;
  const parts: DecodedPart[] = [
    { key: "t-family", code: m[1], text: DEEP_SYSTEM[m[1]] },
    { key: "t-connection", code: m[2] },
    { key: "t-dia", code: `${m[3]}-${m[4]}`, text: `Diameter range ${m[3]} – ${m[4]}${inch ? " inch" : " mm"}` },
  ];
  if (m[5]) parts.push({ key: "t-line", code: m[5] });
  if (m[6] !== undefined) parts.push({ key: "t-line", code: `NOM ${m[6]}`, lookup: "NOM #" });
  return { parts, line: m[5] };
}

function decodeDeepInsert(s: string, families: string[], brand: string): Decoded | null {
  const m = s.match(/^([A-Z]{4})(\d{2})(\d{2})(\d{2})([RL])?-([A-Z]+)(?:-([A-Z]))?$/);
  if (!m || !families.includes(m[1])) return null;
  return {
    kind: `${brand} insert`,
    parts: [
      { key: "i-family", code: m[1] },
      { key: "i-size", code: m[2], text: `Insert size ${m[2]}` },
      { key: "i-thick", code: m[3], lookup: "##" },
      { key: "i-radius", code: m[4], text: `Corner radius ${mm(Number(m[4]) / 10)}` },
      ...(m[5] ? [{ key: "i-hand", code: m[5] }] : []),
      { key: "i-chip", code: m[6] },
      ...(m[7] ? [{ key: "i-position", code: m[7] }] : []),
    ],
  };
}

// TRI-DEEP: gundrills GD-DH 14.00-15D-M25-07 (diameter, depth ratio, driver,
// insert size), GD-DHL 12.00X800-34 / 14.00-800-23 (long, overall length),
// heads GDH-08.00 MKT, tube drills DSD-EF ...-FT / FTA, and TOGT / LOGT / ZSGT
// inserts with 3 / 2 / 1 chip splitting edges.
export function decodeTriDeep(text: string): Decoded | null {
  const s = squash(text);
  const insert = decodeDeepInsert(s, ["TOGT", "LOGT", "ZSGT"], "TRI-DEEP");
  if (insert) return insert;
  const tube = decodeDeepTube(s);
  if (tube) return tube.line?.startsWith("FT") ? { kind: "TRI-DEEP deep drill", parts: tube.parts } : null;
  let m = s.match(/^GDH-(\d+\.\d+)MKT$/);
  if (m) return { kind: "TRI-DEEP gundrill head", parts: [{ key: "t-family", code: "GDH" }, { key: "t-dia", code: m[1], text: `Diameter ${mm(Number(m[1]))}` }, { key: "t-line", code: "MKT" }] };
  if (!(m = s.match(/^GD-(DHL|DH)(\d+\.\d+)(?:-(\d+)D-([A-Z]+\d+(?:\.\d+)?)-(\d{2})(-N)?|[-X](\d{3,4})-([A-Z]*\d+(?:\.\d+)?))$/))) return null;
  const parts: DecodedPart[] = [
    { key: "t-family", code: `GD-${m[1]}` },
    { key: "t-dia", code: m[2], text: `Diameter ${mm(Number(m[2]))}` },
  ];
  if (m[3]) {
    parts.push(
      { key: "t-depth", code: `${m[3]}D`, text: `Drilling depth ${m[3]}xD` },
      { key: "t-driver", code: m[4], text: `Driver / shank code ${m[4]} (see the catalog)` },
      { key: "t-insert", code: m[5], text: `For size ${m[5]} inserts` },
    );
    if (m[6]) parts.push({ key: "t-suffix", code: "N" });
  } else {
    parts.push({ key: "t-length", code: m[7], text: `Overall length ${Number(m[7])} mm` }, { key: "t-driver", code: m[8], text: `Driver / insert code ${m[8]} (see the catalog)` });
  }
  return { kind: "TRI-DEEP gundrill", parts };
}

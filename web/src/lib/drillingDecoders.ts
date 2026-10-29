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

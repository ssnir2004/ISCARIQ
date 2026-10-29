import type { Decoded, DecodedPart } from "./insertDecoders";

// Designation decoders for the Drilling code keys (Code keys -> Drilling), one
// per family: its heads (e.g. ICP 040) and its drill bodies (e.g. DCN
// 060-018-12R-3D). Parts name their code key section by key: heads "i-<part>",
// bodies "t-<part>".

const squash = (s: string) => s.toUpperCase().replace(/\s+/g, "");
const mm = (n: number) => `${Number(n.toFixed(2))} mm`;
// Three digits are x10 (ICP 040 = 4.0 mm), four x100 (ICK 0635 = 6.35 mm).
const dia = (code: string) => Number(code) / (code.length === 4 ? 100 : 10);

// SUMO-CHAM: heads ICP 040, ICK 0635, ICP 060-2M, IHP 138-BD, HCP 040-IQ; drill
// bodies DCN 060-018-12R-3D (smallest head, length, shank and its type, depth
// ratio), DCNS 075-022-080B-3D, DCNM 060-018-M12-3D (FLEX-FIT), DCN
// 040-008-MMT05-2D (MULTI-MASTER), DCN 040-012-06-3D-PICCO, DCNT 068-021-12A-M8
// (pre-thread hole for M8) and DCN 135-050-16N-5D-BD.
export function decodeSumoCham(text: string): Decoded | null {
  const s = squash(text);
  let m = s.match(/^(ICP|ICM|ICK|ICN|ICG|IHP|QCP|HCP)(\d{3,4})(?:-(2M|BD|IQ))?$/);
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

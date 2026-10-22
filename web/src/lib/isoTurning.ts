// Decodes ISO turning toolholder and boring bar designations into their
// positions, with ISCAR's prefixes and suffixes, e.g.
//   MWLNR 2525M-08W        -> 4 M, 5 W, 6 L, 7 N, 8 R, 9 25, 10 25, 3 M, 11 08, 12 W
//   S25S MWLNR-08W         -> 1 S, 2 25, 3 S, 4 M, 5 W, 6 L, 7 N, 8 R, 11 08, 12 W
//   C5 PWLNR-35060-08X-JHP -> C5, 4 P … 8 R, 35060, 11 08, X, JHP
// Each ISO part is keyed "p<position>" (the code key's section keys); prefixes
// and suffixes are keyed "px". Numeric positions come with their value in words.

export interface DecodedPart {
  key: string;
  code: string;
  // For numeric positions (diameter, shank, insert size).
  text?: string;
  // The code key row to show when it isn't the code itself (e.g. "M…W").
  lookup?: string;
}

const mm = (digits: string) => `${Number(digits)} mm`;

// Prefixes before the ISO code, in any order (e.g. C5, HSK A63WH-, AVC-D25-).
const PREFIXES: [RegExp, (m: RegExpMatchArray) => DecodedPart[]][] = [
  [/^C(\d)[- ]/, (m) => [{ key: "px", code: `C${m[1]}` }]],
  [/^HSK ?(A\d+WH)[- ]/, (m) => [{ key: "px", code: `HSK ${m[1]}`, lookup: "HSK" }]],
  [/^NQCH(\d*)[- ]/, (m) => [{ key: "px", code: `NQCH${m[1]}`, lookup: "NQCH" }]],
  [/^AVC-(?:D(\d{2})-)?/, (m) => [{ key: "px", code: "AVC" }, ...(m[1] ? [{ key: "px", code: `D${m[1]}`, text: `Head diameter ${mm(m[1])}` }] : [])]],
  [/^Y-/, () => [{ key: "px", code: "Y" }]],
  [/^Q(\d)-/, (m) => [{ key: "px", code: `Q${m[1]}` }]],
];

// Position 12 codes; any other letters after the insert size are suffixes.
function sizeLetters(letters: string): DecodedPart[] {
  const parts: DecodedPart[] = [];
  for (let rest = letters; rest; ) {
    const code = rest.startsWith("MW") ? "MW" : rest[0];
    parts.push({ key: ["W", "MW", "S"].includes(code) ? "p12" : "px", code });
    rest = rest.slice(code.length);
  }
  return parts;
}

export function decodeIsoTurning(designation: string): { kind: "Toolholder" | "Boring bar" | "Interchangeable head"; parts: DecodedPart[] } | null {
  let d = designation.toUpperCase().trim().replace(/\s+/g, " ");
  const prefixes: DecodedPart[] = [];
  for (let found = true; found; ) {
    found = false;
    for (const [re, parts] of PREFIXES) {
      const m = d.match(re);
      if (m) {
        prefixes.push(...parts(m));
        d = d.slice(m[0].length).trim();
        found = true;
      }
    }
  }
  // Boring bar: 1 2 3 before the ISO code.
  const bar = d.match(/^([SACE])(\d{2})([A-Z])[- ]?(?=[A-Z]{5})/);
  if (bar) d = d.slice(bar[0].length);
  // 4 5 6 7 8 (MULTI-WEDGE "MU" has no insert shape).
  const core = d.match(/^(MU)()([A-Z])([A-Z])([RLN])|^([A-Z])([A-Z])([A-Z])([A-Z])([RLN])/);
  if (!core) return null;
  const [clamp, shape, approach, clearance, hand] = core[1] ? core.slice(1, 6) : core.slice(6, 11);
  let rest = d.slice(core[0].length).replace(/^\/[RL]/, "");
  const parts: DecodedPart[] = [...prefixes];
  if (bar) {
    parts.push({ key: "p1", code: bar[1] }, { key: "p2", code: bar[2], text: `Bar diameter ${mm(bar[2])}` }, { key: "p3", code: bar[3] });
  }
  const clampPart: DecodedPart = { key: "p4", code: clamp };
  parts.push(clampPart);
  if (shape) parts.push({ key: "p5", code: shape });
  parts.push({ key: "p6", code: approach }, { key: "p7", code: clearance }, { key: "p8", code: hand });
  // 9 10 3: shank height, width and tool length (toolholders).
  const shank = !bar && rest.match(/^[- ]?(\d{2})(\d{2})([A-Z])/);
  if (shank) {
    parts.push(
      { key: "p9", code: shank[1], text: `Shank height ${mm(shank[1])}` },
      { key: "p10", code: shank[2], text: `Shank width ${mm(shank[2])}` },
      { key: "p3", code: shank[3] },
    );
    rest = rest.slice(shank[0].length);
  }
  let sized = false;
  for (const token of rest.split(/[- ]+/).filter(Boolean)) {
    const size = !sized && token.match(/^(\d{2})([A-Z]*)$/);
    if (size) {
      sized = true;
      parts.push({ key: "p11", code: size[1], text: shape === "R" ? `Insert diameter ${mm(size[1])}` : `Cutting edge length ${mm(size[1])}` });
      parts.push(...sizeLetters(size[2]));
    } else if (/^\d{5}$/.test(token)) {
      parts.push({ key: "px", code: token });
    } else if (/^H\d{3}$/.test(token)) {
      parts.push({ key: "px", code: token, text: `Dimension H ${mm(token.slice(1))}` });
    } else {
      parts.push({ key: ["W", "MW", "S"].includes(token) ? "p12" : "px", code: token });
    }
  }
  // M with a wedge (W / MW at position 12) is a top wedge lock, else pin and clamp.
  if (clamp === "M" && parts.some((p) => p.key === "p12" && (p.code === "W" || p.code === "MW"))) clampPart.lookup = "M…W";
  if (!shank && !bar && !sized && prefixes.length === 0) return null;
  return { kind: bar ? "Boring bar" : prefixes.some((p) => p.code === "AVC") ? "Interchangeable head" : "Toolholder", parts };
}

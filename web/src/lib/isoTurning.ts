// Decodes ISO turning toolholder and boring bar designations into their
// positions, e.g.
//   MWLNR 2525M-08W   -> 4 M, 5 W, 6 L, 7 N, 8 R, 9 25, 10 25, 3 M, 11 08, 12 W
//   S25S MWLNR-08W    -> 1 S, 2 25, 3 S, 4 M, 5 W, 6 L, 7 N, 8 R, 11 08, 12 W
// Each part is keyed "p<position>" (the code key's section keys). Numeric
// positions come with their value in words.

export interface DecodedPart {
  key: string;
  code: string;
  // For numeric positions (diameter, shank, insert size).
  text?: string;
}

const mm = (digits: string) => `${Number(digits)} mm`;

export function decodeIsoTurning(designation: string): { kind: "Toolholder" | "Boring bar"; parts: DecodedPart[] } | null {
  const d = designation.toUpperCase().replace(/\s+/g, "");
  // Toolholder: 4 5 6 7 8 9 10 3 - 11 12
  let m = d.match(/^([A-Z])([A-Z])([A-Z])([A-Z])([RLN])(\d{2})(\d{2})([A-Z])-?(\d{2})([A-Z]{1,2})?$/);
  if (m) {
    return {
      kind: "Toolholder",
      parts: [
        { key: "p4", code: m[1] },
        { key: "p5", code: m[2] },
        { key: "p6", code: m[3] },
        { key: "p7", code: m[4] },
        { key: "p8", code: m[5] },
        { key: "p9", code: m[6], text: `Shank height ${mm(m[6])}` },
        { key: "p10", code: m[7], text: `Shank width ${mm(m[7])}` },
        { key: "p3", code: m[8] },
        { key: "p11", code: m[9], text: `Cutting edge length ${mm(m[9])}` },
        ...(m[10] ? [{ key: "p12", code: m[10] }] : []),
      ],
    };
  }
  // Boring bar: 1 2 3 - 4 5 6 7 8 - 11 12
  m = d.match(/^([SACE])(\d{2})([A-Z])-?([A-Z])([A-Z])([A-Z])([A-Z])([RLN])-?(\d{2})([A-Z]{1,2})?$/);
  if (m) {
    return {
      kind: "Boring bar",
      parts: [
        { key: "p1", code: m[1] },
        { key: "p2", code: m[2], text: `Bar diameter ${mm(m[2])}` },
        { key: "p3", code: m[3] },
        { key: "p4", code: m[4] },
        { key: "p5", code: m[5] },
        { key: "p6", code: m[6] },
        { key: "p7", code: m[7] },
        { key: "p8", code: m[8] },
        { key: "p11", code: m[9], text: `Cutting edge length ${mm(m[9])}` },
        ...(m[10] ? [{ key: "p12", code: m[10] }] : []),
      ],
    };
  }
  return null;
}

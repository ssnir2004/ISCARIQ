import type { Decoded, DecodedPart } from "./insertDecoders";

// Designation decoders for the Milling code keys (Code keys -> Milling), one
// per brand. Parts name their code key section by key: heads "t-<part>",
// shanks and accessories "s-<part>".

const squash = (s: string) => s.toUpperCase().replace(/\s+/g, "");
const mm = (n: number) => `${Number(n.toFixed(3))} mm`;
const inch = (code: string) => `${Number(code)}"`;
// Diameter codes: three digits x10 (080 = 8.0 mm); a leading point is inches
// (.375 = 3/8"); a larger three digit code on an inch head (500) is thousandths.
const diaText = (code: string) =>
  code.startsWith(".") ? `Diameter ${inch(code)}` : /^\d\.\d+$/.test(code) ? `Diameter ${code}"` : `Diameter ${mm(Number(code) / 10)}`;
const conn = (t: string): DecodedPart => ({ key: "t-connection", code: `T${t}`, text: `MULTI-MASTER T${t} connection` });
const flutes = (n: string): DecodedPart => ({ key: "t-flutes", code: n, text: `${Number(n)} flutes` });
const dims = (code: string): DecodedPart => ({ key: "t-dims", code, text: `Dimension code ${code} (see the catalog)` });

// Corner codes: R000 sharp, R0.5 / R4 in mm, R05 x10 (0.5 mm), R020 x100
// (0.2 mm); C3 / C01 chamfer x10 (0.3 / 0.1 mm).
function corner(code: string): DecodedPart {
  const n = code.slice(1);
  if (code[0] === "C") return { key: "t-corner", code, text: `Corner chamfer ${mm(Number(n) / 10)}` };
  const r = n.includes(".") || n.length === 1 ? Number(n) : Number(n) / (n.length === 2 ? 10 : 100);
  return { key: "t-corner", code, text: r === 0 ? "Sharp corner" : `Corner radius ${mm(r)}` };
}

// MULTI-MASTER milling: interchangeable solid carbide heads on a T## threaded
// connection (MM EC100A07R1.0-4T06: family, diameter x10, helix, flute
// length, corner, flutes, connection; T-slot, groove, thread, barrel, blank
// and corner rounding heads; MT thread milling heads), the shanks that carry
// them (MM S-A-L090-C12-T08), extensions, keys and wrenches. The drilling,
// chamfering and centering heads (HCD, ECF, ECS, EDF, ECDF, ECD, EFCB, SPD)
// are in the Drilling key; the FEED-MILL heads (FF, EFF) in MULTI-FEED-MASTER.
export function decodeMultiMasterMill(text: string): Decoded | null {
  const spaced = text.toUpperCase().trim().replace(/\s+/g, " ");
  const head = (parts: DecodedPart[]): Decoded => ({ kind: "MULTI-MASTER milling head", parts });
  // MT thread milling heads keep their spaces: MT 10D6 1.5ISO-MMT05.
  let m = spaced.match(/^MT ?(\d{2}(?:\.\d)?)([A-F])(\d{1,2}(?:\.\d)?) ([\d.]+)(ISO|UN|W)-MMT{1,2}(\d{2})$/);
  if (m) {
    const pitch = m[5] === "ISO" ? `Pitch ${mm(Number(m[4]))}` : `${Number(m[4])} threads per inch`;
    return head([
      { key: "t-family", code: "MT" },
      { key: "t-dia", code: m[1], text: `Diameter ${mm(Number(m[1]))}` },
      { key: "t-version", code: m[2] },
      { key: "t-apmx", code: m[3], text: `Cutting length ${mm(Number(m[3]))}` },
      { key: "t-pitch", code: m[4], text: pitch },
      { key: "t-profile", code: m[5] },
      conn(m[6]),
    ]);
  }
  const s = squash(text);
  if (!s.startsWith("MM")) return null;
  const b = s.slice(2);

  // Standard heads: EC100A07R1.0-4T06, EB120H09CF-3T08I, ECK080H05R04-6T05CF.
  m = b.match(/^(EBA|EBC|ECK|ECU|ERS|ERA|EFS|ETR|HCR|HRF|HBR|EC|EA|EB|HC|HT)(\d{3})([A-Z])?(\d{1,2})?(R[\d.]+|C\d+)?(CF)?-(\d{1,2})T(\d{2})(CF|H2|H|I|C)?$/);
  if (m) {
    const parts: DecodedPart[] = [{ key: "t-family", code: m[1] }, { key: "t-dia", code: m[2], text: diaText(m[2]) }];
    if (m[3]) parts.push({ key: "t-helix", code: m[3] });
    if (m[4]) parts.push({ key: "t-apmx", code: m[4], text: `Cutting length ${Number(m[4])} mm` });
    if (m[5]) parts.push(corner(m[5]));
    if (m[6]) parts.push({ key: "t-suffix", code: "CF" });
    parts.push(flutes(m[7]), conn(m[8]));
    if (m[9]) parts.push({ key: "t-suffix", code: m[9] });
    return head(parts);
  }
  // Tapered heads: ET11/8H4R10CF-8T08H (diameter, taper, helix, corner).
  m = b.match(/^ET(\d{2})\/(\d+)H(\d)(R\d{2})CF-(\d{1,2})T(\d{2})(H)?$/);
  if (m) {
    return head([
      { key: "t-family", code: "ET" },
      { key: "t-dia", code: m[1], text: `Diameter ${mm(Number(m[1]))}` },
      dims(`/${m[2]}H${m[3]}`),
      corner(m[4]),
      { key: "t-suffix", code: "CF" },
      flutes(m[5]),
      conn(m[6]),
      ...(m[7] ? [{ key: "t-suffix", code: "H" }] : []),
    ]);
  }
  // Barrel heads: ELB08R16A05-4T05 (diameter, profile radius, corner) and
  // EOB08R1.5R80A13-4T05 (shank diameter, tip radius, profile radius).
  m = b.match(/^(ELBA|ELB)(\d{2})R(\d{2})A(\d{2})-(\d)T(\d{2})$/);
  if (m) {
    return head([
      { key: "t-family", code: m[1] },
      { key: "t-dia", code: m[2], text: `Diameter ${Number(m[2])} mm` },
      { key: "t-profile", code: `R${m[3]}`, text: `Profile radius ${Number(m[3])} mm` },
      { key: "t-corner", code: `A${m[4]}`, text: `Corner radius ${mm(Number(m[4]) / 10)}` },
      flutes(m[5]),
      conn(m[6]),
    ]);
  }
  m = b.match(/^(EOBA|EOB)(\d{2})(R[\d.]+)R(\d{2})A(\d{2})-(\d)T(\d{2})$/);
  if (m) {
    return head([
      { key: "t-family", code: m[1] },
      { key: "t-dia", code: m[2], text: `Shank diameter ${Number(m[2])} mm` },
      corner(m[3]),
      { key: "t-profile", code: `R${m[4]}`, text: `Profile radius ${Number(m[4])} mm` },
      dims(`A${m[5]}`),
      flutes(m[6]),
      conn(m[7]),
    ]);
  }
  // T-slot, circlip, dovetail and double groove heads: TS077-N07A-4T05,
  // TS135-H30D-06T05, TS127C118T035-6T05, TS105-45D-06T04, TS155-04T10-8238.
  m = b.match(/^TS(\d{3})C(\d{3})T(\d{3})-(\d{1,2})T(\d{2})$/);
  if (m) {
    return head([
      { key: "t-family", code: "TS" },
      { key: "t-dia", code: m[1], text: diaText(m[1]) },
      { key: "t-width", code: `C${m[2]}`, text: `Circlip groove width ${mm(Number(m[2]) / 100)}` },
      { key: "t-depth", code: `T${m[3]}`, text: `Groove depth ${mm(Number(m[3]) / 100)}` },
      flutes(m[4]),
      conn(m[5]),
    ]);
  }
  m = b.match(/^TS(\d{3}|\.\d{3})-(?:(.+?)-)?(\d{1,2})T(\d{2})(?:-(\d{4}))?$/);
  if (m) {
    const parts: DecodedPart[] = [{ key: "t-family", code: "TS" }, { key: "t-dia", code: m[1], text: diaText(m[1]) }];
    const g = m[2] ?? "";
    let d: RegExpMatchArray | null;
    if ((d = g.match(/^([NH])(\d{2,3})([A-Z])$/))) {
      const w = m[1].startsWith(".") ? `Groove width .${d[2]}"` : `Groove width ${mm(Number(d[2]) / 10)}`;
      parts.push({ key: "t-profile", code: d[1] }, { key: "t-width", code: d[2], text: w }, { key: "t-grade", code: d[3] });
    } else if ((d = g.match(/^(45|60|75)D$/))) {
      parts.push({ key: "t-profile", code: `${d[1]}D`, text: `Dovetail ${d[1]}°` });
    } else if ((d = g.match(/^45-(\d{2})([A-Z])$/))) {
      parts.push({ key: "t-profile", code: "45", text: "45° chamfering" }, dims(d[1]), { key: "t-grade", code: d[2] });
    } else if (g) {
      parts.push(dims(g));
    }
    parts.push(flutes(m[3]), conn(m[4]));
    if (m[5]) parts.push({ key: "t-drawing", code: m[5], text: `Drawing number ${m[5]}` });
    return head(parts);
  }
  // Small diameter groove heads: GRIT22K076-000-4T8 (size, width x100, corner
  // x100), GRIT18K-45A-3T6, GRIT28K-45D-6T10, GRIT28P-2.6-DR4.0.
  m = b.match(/^GRIT(\d{2})([KP])(.+?)(?:-(\d{1,2})T(\d{1,2}))?$/);
  if (m) {
    const parts: DecodedPart[] = [{ key: "t-family", code: "GRIT" }, { key: "t-size", code: m[1] }, { key: "t-grade", code: m[2] }];
    let d: RegExpMatchArray | null;
    if ((d = m[3].match(/^(\d{3,4})-(\d{3})$/))) {
      parts.push({ key: "t-width", code: d[1], text: `Groove width ${mm(Number(d[1]) / 100)}` }, { key: "t-corner", code: d[2], text: Number(d[2]) ? `Corner radius ${mm(Number(d[2]) / 100)}` : "Sharp corner" });
    } else if ((d = m[3].match(/^-(45|60|75)([AD])$/))) {
      parts.push({ key: "t-profile", code: `${d[1]}${d[2]}`, text: d[2] === "D" ? `Dovetail ${d[1]}°` : `${d[1]}° chamfering` });
    } else if (!m[4] && (d = m[3].match(/^-([\d.]+)-DR([\d.]+)$/))) {
      parts.push({ key: "t-width", code: d[1], text: `Groove width ${mm(Number(d[1]))}` }, { key: "t-corner", code: `DR${d[2]}`, text: `Double-sided corner radius ${mm(Number(d[2]))}` });
    } else return null;
    if (m[4]) parts.push(flutes(m[4]), conn(m[5].padStart(2, "0")));
    return head(parts);
  }
  // Thread milling heads: TRF12A60-P080-5T05 (pitch x100 mm), TRF12-W55-P11-5T05
  // (threads per inch), TRD16-M60-05P-3T06 (partial profile, pitch range).
  m = b.match(/^TRF(\d{2})(?:-W55-P(\d{1,2})|A60-P(\d{3}))-(\d)T(\d{2})$/);
  if (m) {
    return head([
      { key: "t-family", code: "TRF" },
      { key: "t-size", code: m[1] },
      m[2]
        ? { key: "t-pitch", code: `W55-P${m[2]}`, text: `55° Whitworth, ${Number(m[2])} threads per inch` }
        : { key: "t-pitch", code: `A60-P${m[3]}`, text: `60° profile, pitch ${mm(Number(m[3]) / 100)}` },
      flutes(m[4]),
      conn(m[5]),
    ]);
  }
  m = b.match(/^TRD(\d{2})-(M60|W55)-(\d{2})P-(\d)T(\d{2})$/);
  if (m) {
    return head([
      { key: "t-family", code: "TRD" },
      { key: "t-size", code: m[1] },
      { key: "t-profile", code: m[2] },
      dims(`${m[3]}P`),
      flutes(m[4]),
      conn(m[5]),
    ]);
  }
  // Face milling heads: FM100-36R0.2-06T05 (diameter, cutting length x10, corner).
  m = b.match(/^FM(\d{3})-(\d{2})(R[\d.]+)-(\d{2})T(\d{2})$/);
  if (m) {
    const inchHead = Number(m[1]) > 320;
    return head([
      { key: "t-family", code: "FM" },
      { key: "t-dia", code: m[1], text: inchHead ? `Diameter .${m[1]}"` : diaText(m[1]) },
      { key: "t-apmx", code: m[2], text: inchHead ? `Cutting length .${m[2]}"` : `Cutting length ${mm(Number(m[2]) / 10)}` },
      inchHead ? { key: "t-corner", code: m[3], text: `Corner radius .${m[3].slice(1)}"` } : corner(m[3]),
      flutes(m[4]),
      conn(m[5]),
    ]);
  }
  // Involute spline heads: SS22M100Z1720-4T08 (module x100, teeth range).
  m = b.match(/^SS(\d{2})M(\d{3})Z(\d{2})(\d{2})-(\d)T(\d{2})$/);
  if (m) {
    return head([
      { key: "t-family", code: "SS" },
      { key: "t-size", code: m[1] },
      { key: "t-module", code: `M${m[2]}`, text: `Module ${Number(m[2]) / 100}` },
      { key: "t-teeth", code: `Z${m[3]}${m[4]}`, text: `For ${Number(m[3])} – ${Number(m[4])} teeth` },
      flutes(m[5]),
      conn(m[6]),
    ]);
  }
  // Corner rounding: HR1.0/047-5.8-2T05 (radius mm / inch, dimension).
  m = b.match(/^(HR|ER)([\d.]+)\/(\d{3})-([\d.]+)-(\d)T(\d{2})$/);
  if (m) {
    return head([
      { key: "t-family", code: m[1] },
      { key: "t-corner", code: `${m[2]}/${m[3]}`, text: `Corner rounding radius ${mm(Number(m[2]))} (.${m[3]}")` },
      dims(m[4]),
      flutes(m[5]),
      conn(m[6]),
    ]);
  }
  // Engraving: EPG080/30-F50-1T05 (diameter, point angle, flat tip x100).
  m = b.match(/^EPG(\d{3})\/(\d{2})(?:-F(\d{2}))?-(\d)T(\d{2})$/);
  if (m) {
    return head([
      { key: "t-family", code: "EPG" },
      { key: "t-dia", code: m[1], text: diaText(m[1]) },
      { key: "t-angle", code: m[2], text: `Point angle ${Number(m[2])}°` },
      ...(m[3] ? [{ key: "t-corner", code: `F${m[3]}`, text: `Flat tip ${mm(Number(m[3]) / 100)}` }] : []),
      flutes(m[4]),
      conn(m[5]),
    ]);
  }
  // Double chamfering: HDF100-090-2T05.
  m = b.match(/^HDF(\d{3})-(\d{3})-(\d)T(\d{2})$/);
  if (m) {
    return head([
      { key: "t-family", code: "HDF" },
      { key: "t-dia", code: m[1], text: diaText(m[1]) },
      { key: "t-angle", code: m[2], text: `Chamfer angle ${Number(m[2])}°` },
      flutes(m[3]),
      conn(m[4]),
    ]);
  }
  // Blank heads: ESR-G080-10T05, ESR-G.375-.56T06, ESR-G320-55-T21NECK, TC138N-19-G-T05.
  m = b.match(/^(ESR|ESB)-([GF])(\d{3}|\.\d{3}|\d\.\d{2})-([\d.]+)-?T(\d{2})(\d{2}|NECK)?$/);
  if (m) {
    const len = m[4].startsWith(".") || m[3].startsWith(".") || m[3].includes(".") ? `Length ${m[4]}"` : `Length ${mm(Number(m[4]))}`;
    return {
      kind: "MULTI-MASTER blank head",
      parts: [
        { key: "t-family", code: m[1] },
        { key: "t-grade", code: m[2] },
        { key: "t-dia", code: m[3], text: diaText(m[3]) },
        { key: "t-apmx", code: m[4], text: len },
        conn(m[5]),
        ...(m[6] ? [m[6] === "NECK" ? { key: "t-suffix", code: "NECK" } : dims(m[6])] : []),
      ],
    };
  }
  m = b.match(/^TC(\d{3})N-(\d{2,3})-G-T(\d{2})$/);
  if (m) {
    return {
      kind: "MULTI-MASTER blank head",
      parts: [
        { key: "t-family", code: "TC" },
        { key: "t-dia", code: m[1], text: diaText(m[1]) },
        { key: "t-width", code: m[2], text: `Width ${mm(Number(m[2]) / 10)}` },
        { key: "t-grade", code: "G" },
        conn(m[3]),
      ],
    };
  }
  return decodeMultiMasterShank(b);
}

// Shanks: S-A-L090-C12-T08 (type, overall length, shank, connection),
// S-A-L090/040C20T12C-CH (and the length to the head), S-A-H035-HSKA40-T05
// (integral adaptations), TS-A / GRT shanks for T-slot and slitting heads, CAB
// extensions and reducers, keys and wrenches.
function decodeMultiMasterShank(b: string): Decoded | null {
  const shank = (parts: DecodedPart[]): Decoded => ({ kind: "MULTI-MASTER shank", parts });
  let m = b.match(/^(S-[ABD]|TS2?-A)-L(\d{3})(?:\/(\d{2,3}))?-?(C|W|SL)(\d{2})(?:-(\d{3}))?-?T(\d{2})(AV|C|W)?(?:-([A-Z]+(?:-[A-Z]+)?))?$/);
  if (m) {
    const parts: DecodedPart[] = [
      { key: "s-family", code: m[1] },
      { key: "s-length", code: `L${m[2]}`, text: `Overall length ${Number(m[2])} mm` },
    ];
    const reach = m[3] ?? m[6];
    if (reach) parts.push({ key: "s-reach", code: reach, text: `Length to the head ${Number(reach)} mm` });
    parts.push({ key: "s-shank", code: m[4] }, { key: "s-dia", code: m[5], text: `Shank diameter ${Number(m[5])} mm` }, conn(m[7]));
    for (const x of [m[8], ...(m[9]?.split("-") ?? [])].filter(Boolean) as string[]) {
      if (x === "CH") parts.push({ key: "s-suffix", code: "C" }, { key: "s-suffix", code: "H" });
      else parts.push({ key: "s-suffix", code: x });
    }
    return shank(parts);
  }
  m = b.match(/^(S-[ABD])-H([\d.]+)-(ER\d{2}|HSK[A-Z]\d{2,3}|BT\d{2}|SK\d{2}|DIN\d{2}|CAT\d{2}|C\d)-T(\d{2})(?:-(H))?$/);
  if (m) {
    return shank([
      { key: "s-family", code: m[1] },
      { key: "s-reach", code: `H${m[2]}`, text: `Projection ${mm(Number(m[2]))}` },
      { key: "s-adaptation", code: m[3], text: m[3].startsWith("C") && m[3].length === 2 ? `CAMFIX ${m[3]} adaptation (ISO 26623-1)` : `${m[3].replace(/^(HSK)([A-Z])/, "$1 $2").replace(/^(ER|BT|SK|DIN|CAT)/, "$1 ")} adaptation` },
      conn(m[4]),
      ...(m[5] ? [{ key: "s-suffix", code: "H" }] : []),
    ]);
  }
  m = b.match(/^GRT-(\d{3})(C)?-T(\d{2})$/);
  if (m) {
    return shank([
      { key: "s-family", code: "GRT" },
      { key: "s-dia", code: m[1], text: `Shank diameter ${mm(Number(m[1]) / 10)}` },
      ...(m[2] ? [{ key: "s-suffix", code: "C" }] : []),
      conn(m[3]),
    ]);
  }
  m = b.match(/^CABT(\d{2})(M|T)(\d{2})-([\d.]+)\/([\d.]+)(?:-([WC]))?$/);
  if (m) {
    return {
      kind: m[2] === "M" ? "MULTI-MASTER extension" : "MULTI-MASTER reducer",
      parts: [
        { key: "s-family", code: "CAB" },
        conn(m[1]),
        m[2] === "M"
          ? { key: "s-adaptation", code: `M${m[3]}`, text: `M${Number(m[3])} FLEX-FIT thread` }
          : { key: "s-adaptation", code: `T${m[3]}`, text: `Carries T${m[3]} heads` },
        { key: "s-length", code: `${m[4]}/${m[5]}`, text: `Length ${mm(Number(m[4]))} (${m[5]}")` },
        ...(m[6] ? [{ key: "s-suffix", code: m[6] }] : []),
      ],
    };
  }
  m = b.match(/^(KEY|WRENCH|EGR)([\dE.X-]+)\*?$/);
  if (m) return { kind: "MULTI-MASTER accessory", parts: [{ key: "s-family", code: m[1] }, { key: "s-size", code: m[2], text: `Size ${m[2]}` }] };
  return null;
}

// MULTI-FEED-MASTER: FEED-MILL heads on the MULTI-MASTER connection, MM
// FF100R1.5-L12-2T06 (diameter, corner radius, head length) and MM
// EFF080T3R1.62-4T05 (diameter, geometry, programmed radius for CAM).
export function decodeMultiFeedMaster(text: string): Decoded | null {
  const b = squash(text).replace(/^MM/, "");
  let m = b.match(/^FF(\d{3})R([\d.]+)(?:-L(\d{2}))?-(\d)T(\d{2})$/);
  if (m) {
    const inchHead = Number(m[1]) > 320;
    return {
      kind: "MULTI-FEED-MASTER head",
      parts: [
        { key: "t-family", code: "FF" },
        { key: "t-dia", code: m[1], text: inchHead ? `Diameter .${m[1]}"` : diaText(m[1]) },
        { key: "t-corner", code: `R${m[2]}`, text: inchHead ? `Corner radius .${m[2]}"` : `Corner radius ${mm(Number(m[2]))}` },
        ...(m[3] ? [{ key: "t-length", code: `L${m[3]}`, text: inchHead ? `Head length .${m[3]}"` : `Head length about ${Number(m[3])} mm` }] : []),
        flutes(m[4]),
        conn(m[5]),
      ],
    };
  }
  m = b.match(/^EFF(\d{3}|\.\d{2,3})([A-Z])(\d{1,2})R([\d.]+)-(\d)T(\d{2})(H)?$/);
  if (!m) return null;
  const inchHead = m[1].startsWith(".");
  return {
    kind: "MULTI-FEED-MASTER head",
    parts: [
      { key: "t-family", code: "EFF" },
      { key: "t-dia", code: m[1], text: diaText(m[1]) },
      { key: "t-geometry", code: m[2] },
      dims(m[3]),
      { key: "t-corner", code: `R${m[4]}`, text: inchHead ? `Programmed radius (Rg) for CAM .${m[4]}"` : `Programmed radius (Rg) for CAM ${mm(Number(m[4]))}` },
      flutes(m[5]),
      conn(m[6]),
      ...(m[7] ? [{ key: "t-suffix", code: "H" }] : []),
    ],
  };
}

// Solid carbide endmills. Two designation styles: the compact one,
// EC020A10-4C05R0.4 (family, diameter x10, helix, cutting length, flutes,
// shank type and diameter, corner) and the line one, EC-H4M 06-12C06CFR0.2-57
// (family, helix, flutes, length, diameter, cutting length / neck, shank,
// CHATTER-FREE, corner, overall length). The brand follows the family: ECK
// Ti-TURBO, EFS FINISHRED, EFF / EFP SOLID-FEED-MILL, ERF / ERC / ECR / EBRF /
// ECP-E SOLIDSHRED, ELB / EOB / ETB NEOBARREL, other CF tools CHATTER-FREE,
// the rest SOLIDMILL.
export type SolidBrand = "SOLIDMILL" | "CHATTER-FREE" | "SOLIDSHRED" | "FINISHRED" | "SOLID-FEED-MILL" | "Ti-TURBO" | "NEOBARREL";

// Dimension codes in mm: the first two digits are whole millimeters, the rest
// decimals (06 = 6, 015 = 1.5, 0675 = 6.75, 100 = 10); one digit is mm.
const num = (code: string) => (code.includes(".") || code.length < 3 ? Number(code) : Number(`${code.slice(0, 2)}.${code.slice(2)}`));
const len = (key: string, label: string, code: string, v: number): DecodedPart => ({ key, code, text: `${label} ${mm(v)}` });
// A cutting length short of half the diameter is in mm (EC-B6 060-026 = 26
// mm); on a micro tool 04 is 0.4 mm.
const apmx = (code: string, d: number) => {
  const v = num(code);
  if (d && d < 1 && /^0\d$/.test(code)) return Number(code) / 10;
  return code.length === 3 && code.startsWith("0") && d && v < d / 2 ? Number(code) : v;
};
// Corner radius: R0.2 / R1. / R2 in mm, R02 x10, R005 x100; a radius beyond
// the tool's half diameter is a tenth of it (EC-A2 005-007 R05 = 0.05 mm).
function solidCorner(code: string, d: number, programmed: boolean): DecodedPart {
  const n = code.replace(/^RP?/, "");
  let r = n.includes(".") || n.length === 1 ? Number(n.endsWith(".") ? n.slice(0, -1) : n) : Number(n) / (n.length === 2 ? 10 : 100);
  if (d && r > d / 2 && !n.includes(".")) r /= 10;
  return { key: "t-corner", code, text: programmed ? `Programmed radius (Rg) for CAM ${mm(r)}` : r ? `Corner radius ${mm(r)}` : "Sharp corner" };
}

const OLD_FAMILIES = "ECCS|ECXL|ECC|ECL|ECH|ECA|ECS|ECU|EBM|EBL|ERF|ERC|EC|EB";

// The rest after the shank: CF, corner, chamfer, line letter and overall
// length (H57, -57, L38), suffixes.
function solidTail(tail: string, d: number, parts: DecodedPart[]): boolean {
  let t = tail;
  let m: RegExpMatchArray | null;
  while (t) {
    if ((m = t.match(/^[- ]+/)) && t.length > m[0].length && !/^ \d{1,2}$/.test(t)) t = t.slice(m[0].length);
    if ((m = t.match(/^CF/))) parts.push({ key: "t-cf", code: "CF" });
    else if ((m = t.match(/^CH(\d{2})/))) parts.push({ key: "t-chamfer", code: m[0], text: `Corner chamfer ${mm(Number(m[1]) / 10)}` });
    else if ((m = t.match(/^RP?(?=[\d.]*\d)\d*\.?\d*/))) parts.push(solidCorner(m[0], d, m[0].startsWith("RP")));
    else if ((m = t.match(/^(\d{2})UF$/))) parts.push({ key: "t-suffix", code: m[0], text: `Grade code ${m[0]} (see the catalog)` });
    else if ((m = t.match(/^(DA|[MHESTNFA])?(\d{2,3})(?=$|[A-Z -])/))) {
      if (m[1]) parts.push({ key: "t-line", code: m[1] });
      parts.push({ key: "t-oal", code: m[2], text: `Overall length ${Number(m[2])} mm` });
    } else if ((m = t.match(/^L(\d{2,3})/))) parts.push({ key: "t-oal", code: m[0], text: `Overall length ${Number(m[1])} mm` });
    else if ((m = t.match(/^ (\d{1,2})$/))) parts.push({ key: "t-suffix", code: m[1], text: `Additional code ${m[1]} (see the catalog)` });
    else if ((m = t.match(/^(CE|[CDTMHE])/))) parts.push({ key: "t-suffix", code: m[1] });
    else return false;
    t = t.slice(m[0].length);
  }
  return true;
}

function solidBrand(base: string, helix: string, cf: boolean): SolidBrand {
  if (base === "ECK") return "Ti-TURBO";
  if (base === "EFS") return "FINISHRED";
  if (base === "EFF" || base === "EFP") return "SOLID-FEED-MILL";
  if (["ERF", "ERC", "ECR", "EBRF"].includes(base) || (base === "ECP" && helix === "E")) return "SOLIDSHRED";
  return cf ? "CHATTER-FREE" : "SOLIDMILL";
}

function parseSolid(text: string): { brand: SolidBrand; decoded: Decoded } | null {
  const s = text.toUpperCase().trim().replace(/\s+/g, " ");
  const tool = (brand: SolidBrand, parts: DecodedPart[], kind = `${brand} solid carbide endmill`) => ({ brand, decoded: { kind, parts } });
  const shank = (type: string, d: string): DecodedPart[] => [{ key: "s-shank", code: type }, len("s-dia", "Shank diameter", d, num(d))];
  const oal = (code: string): DecodedPart => ({ key: "t-oal", code, text: `Overall length ${Number(code)} mm` });
  let m: RegExpMatchArray | null;

  // Kits: KIT EFS-B44 C6-8-10-12 90, KIT EC-E4L 6-8-10-12C CF9.
  if ((m = s.match(/^KIT (EFS-B44|EC-E4L) C?([\d-]+)C? (?:CF)?(\d{1,2})$/))) {
    const brand: SolidBrand = m[1].startsWith("EFS") ? "FINISHRED" : "CHATTER-FREE";
    return tool(brand, [{ key: "t-family", code: "KIT" }, { key: "t-dims", code: m[2], text: `${m[1]} endmills of ${m[2].split("-").join(", ")} mm` }], `${brand} endmill kit`);
  }
  // Barrel endmills: ELB-R0.75R16A5-6C8-63, EOB-AL-R2R85A20/9-4C10-72, ETB-R1R250A10/20-4C08-63.
  if ((m = s.match(/^(ELB|EOB|ETB)(-AL)?-R([\d.]+)R(\d{2,4})A(\d{1,2})(?:\/(\d{1,2}))?-(\d)C(\d{1,2})-(\d{2,3})$/))) {
    const a = `A${m[5]}${m[6] ? `/${m[6]}` : ""}`;
    return tool("NEOBARREL", [
      { key: "t-family", code: m[1] },
      ...(m[2] ? [{ key: "t-suffix", code: "AL", text: "For aluminum" }] : []),
      len("t-corner", "Tip radius", `R${m[3]}`, Number(m[3])),
      len("t-profile", "Profile radius", `R${m[4]}`, Number(m[4])),
      { key: "t-dims", code: a, text: `Profile code ${a} (see the catalog)` },
      flutes(m[7]),
      ...shank("C", m[8]),
      oal(m[9]),
    ], "NEOBARREL barrel endmill");
  }
  if ((m = s.match(/^(HCT|HLB) D(\d{3})-QF$/))) {
    return tool("NEOBARREL", [{ key: "t-family", code: m[1] }, len("t-dia", "Diameter", `D${m[2]}`, Number(m[2]) / 10), { key: "t-suffix", code: "QF" }], "NEOBARREL barrel insert");
  }
  // Chamfering endmills: ECF D-1.0/60-4C04 (tip diameter, angle).
  if ((m = s.match(/^ECF D-([\d.]+)\/(\d{2})-(\d)([CW])(\d{2})$/))) {
    return tool("SOLIDMILL", [
      { key: "t-family", code: "ECF" },
      len("t-dia", "Tip diameter", m[1], Number(m[1])),
      { key: "t-angle", code: m[2], text: `${Number(m[2])}° chamfer` },
      flutes(m[3]),
      ...shank(m[4], m[5]),
    ]);
  }
  // Corner rounding endmills: ER-S4 R0.5D5.0C06-50.
  if ((m = s.match(/^ER-S(\d) R([\d.]+)D([\d.]+)([CW])(\d{2})-(\d{2,3})$/))) {
    return tool("SOLIDMILL", [
      { key: "t-family", code: "ER" },
      { key: "t-helix", code: "S" },
      flutes(m[1]),
      len("t-corner", "Corner rounding radius", `R${m[2]}`, Number(m[2])),
      len("t-dia", "Tip diameter", `D${m[3]}`, Number(m[3])),
      ...shank(m[4], m[5]),
      oal(m[6]),
    ]);
  }
  // Composite endmills: EPNF060S15-3L/9C06F57.
  if ((m = s.match(/^EPNF(\d{3})S(\d{2})-(\d)L\/(\d{1,2})C(\d{1,2})F(\d{2})$/))) {
    return tool("SOLIDMILL", [
      { key: "t-family", code: "EPNF" },
      len("t-dia", "Diameter", m[1], Number(m[1]) / 10),
      len("t-apmx", "Cutting length", `S${m[2]}`, Number(m[2])),
      flutes(m[3]),
      len("t-neck", "Neck length", `L/${m[4]}`, Number(m[4])),
      ...shank("C", m[5]),
      { key: "t-line", code: "F" },
      oal(m[6]),
    ]);
  }

  // Compact style: EC020B07-4C03R0.25-38, EB020A03/06-4C03L38, ERC060E13-3C06CH05DA57.
  m = s.match(new RegExp(`^(${OLD_FAMILIES})(\\d{3})([ABEF])(\\d{2,3})(?:\\/(\\d{2}))?[- ](\\d)([CW])(\\d{2})(.*)$`));
  if (m) {
    const d = Number(m[2]) / 10;
    const parts: DecodedPart[] = [
      { key: "t-family", code: m[1] },
      len("t-dia", "Diameter", m[2], d),
      { key: "t-helix", code: m[3] },
      len("t-apmx", "Cutting length", m[4], m[4].length === 3 ? Number(m[4]) / 10 : Number(m[4])),
    ];
    if (m[5]) parts.push(len("t-neck", "Neck length", `/${m[5]}`, Number(m[5])));
    parts.push(flutes(m[6]), ...shank(m[7], m[8]));
    if (!solidTail(m[9], d, parts)) return null;
    return tool(solidBrand(m[1], m[3], false), parts);
  }

  // Line style: EC-H4M 06-12C06CFR0.2-57, ECA-B-3 04-12C06-57, ESB-A2 03 02/30C06M80,
  // EFF-S2-04 2/14C06R0.57M58, ECR-T4M 06-10-C06-57, ECA-H320-40/100C20CF-R02C.
  m = s.match(/^([A-Z]{2,5})-([A-Z])(\d(?:\d(?=[A-Z -]))?)?(XL|MF|CF|[SMLX])?(?:-(\d)(?!\d))?(?:-(\d{2}))? ?(.+)$/);
  if (!m) return null;
  const [, base, helix, nof, length, nof2, efDia, rest] = m;
  let d = efDia ? Number(efDia) : 0;
  let r: RegExpMatchArray | null;
  const parts: DecodedPart[] = [{ key: "t-family", code: base }, { key: "t-helix", code: helix }];
  // EFS-B44: a geometry code, not 44 flutes.
  if (nof && Number(nof) > 20) parts.push({ key: "t-dims", code: nof, text: `Geometry code ${nof} (see the catalog)` });
  else if (nof || nof2) parts.push(flutes(nof ?? nof2));
  if (length === "CF") parts.push({ key: "t-cf", code: "CF" });
  else if (length) parts.push({ key: "t-length", code: length });
  if (efDia) {
    // EFF-S2-04 2/14..., EFF-S4-04 020/14...
    r = rest.match(/^(\d{1,3})\/(\d{2})(.*)$/);
    if (!r) return null;
    parts.push(len("t-dia", "Diameter", efDia, d), len("t-apmx", "Cutting length", r[1], num(r[1])), len("t-neck", "Neck length", `/${r[2]}`, Number(r[2])));
  } else if ((r = rest.match(/^(\d{2}) (\d{1,2})\/(\d{2})(.*)$/))) {
    // Spherical ball nose: ESB-A2 03 02/30C06M80.
    d = Number(r[1]);
    parts.push(len("t-dia", "Diameter", r[1], d), { key: "t-dims", code: r[2], text: `Spherical code ${r[2]} (see the catalog)` }, len("t-neck", "Neck length", `/${r[3]}`, Number(r[3])));
  } else if ((r = rest.match(/^(\d{1,4})-(\d{1,4}(?:\.\d)?)(?:\/([\d.]+))?(?:\/([\d.]+))?-?(.*)$/))) {
    d = num(r[1]);
    parts.push(len("t-dia", "Diameter", r[1], d), len("t-apmx", "Cutting length", r[2], apmx(r[2], d)));
    if (r[3]) parts.push(d >= 1 && /^\d{2,3}$/.test(r[3]) ? len("t-neck", "Neck length", `/${r[3]}`, Number(r[3])) : { key: "t-neck", code: `/${r[3]}`, text: `Neck length code ${r[3]} (see the catalog)` });
    if (r[4]) parts.push({ key: "t-taper", code: `/${r[4]}`, text: `Taper ${r[4]}° per side` });
  } else return null;
  const sh = r[r.length - 1].match(/^(SL|[CW])(\d{1,3})(.*)$/);
  if (!sh) return null;
  parts.push(...shank(sh[1], sh[2]));
  if (!solidTail(sh[3], d, parts)) return null;
  return tool(solidBrand(base, helix, parts.some((p) => p.key === "t-cf")), parts);
}

const solidDecoder = (brand: SolidBrand) => (text: string): Decoded | null => {
  const p = parseSolid(text);
  return p && p.brand === brand ? p.decoded : null;
};
export const decodeSolidmill = solidDecoder("SOLIDMILL");
export const decodeChatterFree = solidDecoder("CHATTER-FREE");
export const decodeSolidshred = solidDecoder("SOLIDSHRED");
export const decodeFinishred = solidDecoder("FINISHRED");
export const decodeSolidFeedMill = solidDecoder("SOLID-FEED-MILL");
export const decodeTiTurbo = solidDecoder("Ti-TURBO");
export const decodeNeobarrel = solidDecoder("NEOBARREL");

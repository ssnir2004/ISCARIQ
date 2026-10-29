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

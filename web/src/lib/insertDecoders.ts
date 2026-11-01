import { decodeChamDrill, decodeChamring, decodeCombiCham, decodeDrTwist, decodeFineBeam, decodeIscarDeepDrill, decodeIscarGundrills, decodeModuDrill, decodeMultiFunction, decodeMultiMasterDrill, decodeQuick3Cham, decodeSolidDrill, decodeSpadeCham, decodeSumoCham, decodeSumoChamIq, decodeSumoGun, decodeSumoLDrill, decodeTriDeep } from "./drillingDecoders";
import { decodeChatterFree, decodeFinishred, decodeMultiFeedMaster, decodeMultiMasterMill, decodeNeobarrel, decodeSolidFeedMill, decodeSolidmill, decodeSolidshred, decodeTiTurbo } from "./millingDecoders";
import { indexableDecoder } from "./indexableMillingDecoders";
import { turningLineDecoder, withTurningLine } from "./turningLinesDecoders";
import { decodeIsoTurning } from "./isoTurning";
import { DO_GRIP_TOOLS, decodeBgm, decodeCutGrip, decodeDoveIqGrip, decodeGft, decodeGim, decodeGroove4Cut, decodeFlashPenta, decodeHeliGrip, decodeMinCut, decodePenta, decodePentaIq, decodeQuickPenta, decodeChamGroove, decodeHeliFace, decodeQuickIGroove, decodeSelfGrip, decodeSumoGrip, decodeSwissCut, decodeTag, decodeTopGrip, decodeTool } from "./partingDecoders";

// Designation decoders for the code keys: each splits a designation into
// parts, each naming the key's section (by its key or title) and the code;
// numeric parts come with their value in words. The code key then shows each
// part's meaning (and picture) from its tables.

export interface DecodedPart {
  // The code key section: by key (e.g. "p5") or by title.
  key?: string;
  title?: string;
  code: string;
  text?: string;
  // The code key row to show when it isn't the code itself (e.g. "M…W").
  lookup?: string;
}
export interface Decoded {
  kind: string;
  parts: DecodedPart[];
}

export type DecoderName = "iso-turning" | "iso-insert" | "cbn" | "ceramic" | "pcd" | "do-grip" | "tang-grip" | "penta" | "gim" | "bgm" | "gft" | "self-grip" | "cut-grip" | "groove4cut" | "heli-grip" | "top-grip" | "swisscut" | "cham-groove" | "quick-i-groove" | "heliface" | "quick-penta" | "penta-iq" | "flashpenta" | "sumo-grip" | "dove-iq-grip" | "mincut" | "sumo-cham" | "sumo-cham-iq" | "quick-3-cham" | "sumo-l-drill" | "spade-cham" | "cham-drill" | "sumo-gun" | "dr-twist" | "combi-cham" | "modu-drill" | "multi-function" | "solid-drill" | "chamring" | "multi-master-drill" | "tri-deep" | "fine-beam" | "iscar-deep-drill" | "iscar-gundrills" | "multi-master-mill" | "multi-feed-master" | "solidmill" | "chatter-free" | "solidshred" | "finishred" | "solid-feed-mill" | "ti-turbo" | "neobarrel" | `im-${string}` | `tl-${string}`;

const mm = (digits: string, scale = 1) => `${Number((Number(digits) * scale).toFixed(3))} mm`;
const squash = (s: string) => s.toUpperCase().replace(/\s+/g, "");
// The ISO 1832 base shared by CBN, ceramic and PCD inserts (e.g. CNGA 120408).
const ISO_BASE = "ISO insert (shape, clearance, tolerance, type, size, thickness, corner radius — see the Carbide code key)";

// ISO 1832 carbide insert, e.g. WNMG 080408 E-GN. Spaces after the shape
// letters separate parts like dashes (so "080408 SF" is chipformer SF, not
// cutting edge S); the cutting edge letter stands alone.
function decodeIsoInsert(text: string): Decoded | null {
  const d = text.toUpperCase().trim().replace(/^([A-Z]{4})\s+/, "$1").replace(/\s+/g, "-").replace(/-+/g, "-");
  const m = d.match(/^([A-Z])([A-Z])([A-Z])([A-Z])(\d{2})(T\d|\d{2})(\d{2})-?([FETS](?=-|$))?-?(.+)?$/);
  if (!m) return null;
  return {
    kind: "ISO insert",
    parts: [
      { title: "1 · Shape", code: m[1] },
      { title: "2 · Clearance angle", code: m[2] },
      { title: "3 · Tolerance", code: m[3] },
      { title: "4 · Type", code: m[4] },
      { title: "5 · Cutting edge length", code: m[5], text: `Cutting edge length ${mm(m[5])}` },
      { title: "6 · Thickness", code: m[6] },
      { title: "7 · Corner radius", code: m[7] },
      ...(m[8] ? [{ title: "8 · Cutting edge (optional)", code: m[8] }] : []),
      ...(m[9] ? [{ title: "9 · Chipformer", code: m[9] }] : []),
    ],
  };
}

// CBN insert, e.g. CNGA 120408S (N) 2MT MF BI15HC (edge preparation may
// carry its land: S01220 = W 0.12 mm, A 20°).
function decodeCbn(text: string): Decoded | null {
  const m = squash(text).match(/^([A-Z]{4}\d{6})(LF|LE|LS|HF|HE|HS|[SETP])(\d{5})?(?:\(([RLN])\))?(\d?MT|#MT|HS|S|L)?(MF|MM|MR)?(BI\d{2})([HKS])?(C)?$/);
  if (!m) return null;
  const semi = m[2].length === 2;
  return {
    kind: "CBN insert",
    parts: [
      { code: m[1], text: ISO_BASE },
      { title: semi ? "Edge preparation – Semi-Standard" : "Edge preparation – Standard", code: m[2] },
      ...(m[3] ? [{ code: m[3], text: `Negative land: W ${mm(m[3].slice(0, 3), 0.01)}, A ${Number(m[3].slice(3))}°` }] : []),
      ...(m[4] ? [{ title: "Hand", code: m[4] }] : []),
      ...(m[5] ? [{ title: "Number of cutting edges / form", code: m[5] }] : []),
      ...(m[6] ? [{ title: "Chip breaker", code: m[6] }] : []),
      { title: "CBN grade", code: m[7] },
      ...(m[8] ? [{ title: "Target material", code: m[8] }] : []),
      ...(m[9] ? [{ title: "Coating", code: m[9] }] : []),
    ],
  };
}

// Ceramic insert, e.g. CNGA 120408 WL T01020 IS45C.
function decodeCeramic(text: string): Decoded | null {
  const m = squash(text).match(/^([A-Z]{4}\d{6})(AG|WL)?([SETP])(\d{3})(\d{2})?(IS\d{2})(C)?$/);
  if (!m) return null;
  return {
    kind: "Ceramic insert",
    parts: [
      { code: m[1], text: ISO_BASE },
      ...(m[2] ? [{ title: "Chip breaker or Wiper", code: m[2] }] : []),
      { title: "Edge preparation – Standard", code: m[3] },
      { title: "Chamfer width and honing", code: `${m[3]}${m[4]}`, text: `${mm(m[4], 0.01)}` },
      ...(m[5] ? [{ title: "Chamfer angle", code: m[5] }] : []),
      { title: "Ceramic grade", code: m[6] },
      ...(m[7] ? [{ title: "Coating", code: m[7] }] : []),
    ],
  };
}

// PCD insert, e.g. CNGA 120408F (N) L MD ID5.
function decodePcd(text: string): Decoded | null {
  const m = squash(text).match(/^([A-Z]{4}\d{6})(F)?(?:\(([RLN])\))?(HS|MT|L)?(MD|RD)?(ID\d)$/);
  if (!m) return null;
  return {
    kind: "PCD insert",
    parts: [
      { code: m[1], text: ISO_BASE },
      ...(m[2] ? [{ title: "Edge preparation – Standard", code: m[2] }] : []),
      ...(m[3] ? [{ title: "Hand", code: m[3] }] : []),
      ...(m[4] ? [{ title: "Form", code: m[4] }] : []),
      ...(m[5] ? [{ title: "Chip breaker", code: m[5] }] : []),
      { title: "PCD grade / target material", code: m[6] },
    ],
  };
}

// DO-GRIP parting insert, e.g. DGR 3100JS-15D: family DG (HG: 3 mm twisted
// geometry), hand, a variant letter (e.g. DGNC), nominal width and corner
// radii (x10 mm), chipformer (a trailing S: sharp corners), lead angle in
// degrees. Sections keyed "dg-<part>".
function decodeDoGrip(text: string): Decoded | null {
  const m = text
    .toUpperCase()
    .replace(/\s+/g, "")
    .match(/^(DG|HG)([NRL])([A-Z])?-?(\d{2})(\d{2})([A-Z]+)?(?:-(\d{1,2})(D)?)?(-XL)?$/);
  if (!m) return decodeTool(text, DO_GRIP_TOOLS);
  const width = Number(m[4]) / 10;
  const radius = Number(m[5]) / 10;
  // JS = chipformer J with sharp corners (S); a lone S is a chipformer itself.
  const chip = m[6] && m[6].length > 1 && m[6].endsWith("S") ? [m[6].slice(0, -1), "S"] : m[6] ? [m[6]] : [];
  return {
    kind: "DO-GRIP insert",
    parts: [
      { key: "dg-family", code: m[1] },
      { key: "dg-hand", code: m[2] },
      ...(m[3] ? [{ key: "dg-variant", code: m[3] }] : []),
      { key: "dg-width", code: m[4], text: `Nominal insert width ${width} mm` },
      { key: "dg-radius", code: m[5], text: radius ? `Corner radii ${radius} mm` : "Corner radii 0 (sharp)" },
      ...(chip[0] ? [{ key: "dg-chip", code: chip[0] }] : []),
      ...(chip[1] ? [{ key: "dg-sharp", code: chip[1] }] : []),
      ...(m[7] ? [{ key: "dg-lead", code: m[7], text: `Lead angle ${Number(m[7])}°` }] : []),
      ...(m[8] ? [{ key: "dg-degree", code: m[8] }] : []),
      ...(m[9] ? [{ key: "dg-xl", code: "XL" }] : []),
    ],
  };
}

export const DECODERS: Record<DecoderName, { decode: (text: string) => Decoded | null; examples: string }> = {
  "sumo-l-drill": { decode: decodeSumoLDrill, examples: "ILP 120-2M, ILP 1588-2M or DLN 120-036-16A-3D" },
  "quick-3-cham": { decode: decodeQuick3Cham, examples: "H3P 120-IQ, F3B 2381-IQ or D3N 120-036-16A-3D" },
  "sumo-cham-iq": { decode: decodeSumoChamIq, examples: "HCP 040-IQ, HCP 1605-IQ or HCP 329-IQ" },
  "sumo-cham": { decode: decodeSumoCham, examples: "ICP 040, ICK 0635-2M or DCN 060-018-12R-3D" },
  "spade-cham": { decode: decodeSpadeCham, examples: "HFP 330-SPADE IQ, IFHP 3334-SPADE-BD or DFN 330-099-32A-3D-IQ" },
  "cham-drill": { decode: decodeChamDrill, examples: "IDI 068-SG, DCM 075-022-12A-3D or RING DCM 100" },
  "sumo-gun": { decode: decodeSumoGun, examples: "MNSNT 100-200-MF16X1 or MNSNT 250-780-MF20X1" },
  "dr-twist": { decode: decodeDrTwist, examples: "DR120-036-16-04-3D-N, SOMT 120408-DT or XOMT 060204-GF" },
  "combi-cham": { decode: decodeCombiCham, examples: "MNC 260-130 A32-150-06-5D, MNC 332-265 A32-169-W5-8D or SOGX 050204-W" },
  "modu-drill": { decode: decodeModuDrill, examples: "MD-BODY-33-36-108-32A-3D, MD-MNC 280-119-W5 or ICP 119-MNC 4F" },
  "multi-function": { decode: decodeMultiFunction, examples: "DRG-MF-10R-2.25D-12A-05, XCMT 050204-MF or PICCO R-MFT60 6-4 L08" },
  "solid-drill": { decode: decodeSolidDrill, examples: "SCD 060-020-060 AP3N, SCD 030-097-060 SXC30 or SCCD 040-017-060 ACP3" },
  "chamring": { decode: decodeChamring, examples: "CHAMRING 080-WN20-06 or XCGT 060300-45DT" },
  "multi-master-drill": { decode: decodeMultiMasterDrill, examples: "MM HCD100-120-2T06, MM ECD-10X90-2T06 or MM SPD080-08-3T06" },
  "tri-deep": { decode: decodeTriDeep, examples: "GD-DH 14.00-15D-M25-07, DSD-EF 14.00-14.60-FT or TOGT 070304-DT" },
  "fine-beam": { decode: decodeFineBeam, examples: "DSD-EF 25.00-26.40-FB, NPHT 060304R-G-P or NPMT 050304R-G-I" },
  "iscar-deep-drill": { decode: decodeIscarDeepDrill, examples: "DSD-E3 22.91-24.10-DTG, DSD-EC 38.00-39.60 or TPMX 140304R-B" },
  "iscar-gundrills": { decode: decodeIscarGundrills, examples: "STCGD-05500-0200-05-IC908, GD-05520-0500-57-E R-IC908 or SPGD-05520-0500-02051-01-IC908" },
  "multi-master-mill": { decode: withTurningLine(decodeMultiMasterMill, "MULTI-MASTER"), examples: "MM EC100A07R1.0-4T06, MM TS135-H30D-06T05 or MM S-A-L090-C12-T08" },
  "multi-feed-master": { decode: decodeMultiFeedMaster, examples: "MM EFF080T3R1.62-4T05 or MM FF100R1.5-L12-2T06" },
  "solidmill": { decode: decodeSolidmill, examples: "EC100B22-4C10, EC-A4 08-20C08R.5E63 or EB-A2 03-08C06M70" },
  "chatter-free": { decode: decodeChatterFree, examples: "EC-H4M 06-12C06CFR0.2-57, EC-E4L 06-14/20C06CF57 or ECA-H3 06-09/18C06CF-R02" },
  "solidshred": { decode: decodeSolidshred, examples: "ECR-B4M 10-20C10-72, ECP-E4L 06-14/20C06S57 or ERF100A22-4C10" },
  "finishred": { decode: decodeFinishred, examples: "EFS-B44 10-22C10-72 or EFS-E44 10-22C10CF72" },
  "solid-feed-mill": { decode: decodeSolidFeedMill, examples: "EFF-S4-10 040/30C10R1.6M or EFP-E4CF 10-20C10R1.7M72" },
  "ti-turbo": { decode: decodeTiTurbo, examples: "ECK-H4M 10-20C10CFR0.5-72 or ECK-H7 10-22C10CFR0.5T72" },
  "neobarrel": { decode: decodeNeobarrel, examples: "EOB-R2R85A24/8-4C10-72, ELB-R1R20A7-6C10-72 or HCT D120-QF" },
  "im-heli2000": { decode: indexableDecoder("HELI-2000"), examples: "HM90 E90A, HM90 E90AD, HM90 ADCT …" },
  "im-helimill": { decode: indexableDecoder("HELI-MILL"), examples: "ADCR, ADK, ADKR …" },
  "im-helialu": { decode: indexableDecoder("HELI-ALU"), examples: "APCR, HM90 EAL, HM90 APCR …" },
  "im-heliquad": { decode: indexableDecoder("HELI-QUAD"), examples: "E45X, E90SP, E90X …" },
  "im-heli4mill": { decode: indexableDecoder("HELI-4-MILL"), examples: "SOMT, E90SO, SOCT …" },
  "im-quad2000": { decode: indexableDecoder("QUAD-2000"), examples: "QPMR, QOMT, QPMT …" },
  "im-xquad": { decode: indexableDecoder("X-QUAD"), examples: "SDMT, SDK, SDHT …" },
  "im-heli3mill": { decode: indexableDecoder("HELI-3-MILL"), examples: "HM390 TDCT, HM390 TDKT, HM390 TDKR …" },
  "im-nanmill": { decode: indexableDecoder("NAN-MILL"), examples: "HM390 TPKR, HM390 ETP …" },
  "im-heliplus": { decode: indexableDecoder("HELI-PLUS"), examples: "HP F90AN, HP ADCT, HP ADKT …" },
  "im-helitang": { decode: indexableDecoder("HELI-TANG"), examples: "FDN, SDN, T490 ELN …" },
  "im-sumomill": { decode: indexableDecoder("SUMO-MILL"), examples: "T290 ELN, T290 LNHT, T290 LNMT …" },
  "im-iscarmill": { decode: indexableDecoder("ISCAR-MILL"), examples: "T230, E30, T245 …" },
  "im-helido": { decode: indexableDecoder("HELI-DO"), examples: "RXMT, ONHU, ONMU …" },
  "im-tormill": { decode: indexableDecoder("TOR-MILL"), examples: "E93CN, CNHT, CNMT …" },
  "im-roundmill": { decode: indexableDecoder("ROUND-MILL"), examples: "ERCM, ER, FR …" },
  "im-chammill": { decode: indexableDecoder("CHAM-MILL"), examples: "R90MT, O45MT, ERCM …" },
  "im-chamfmill": { decode: indexableDecoder("CHAMF-MILL"), examples: "CH45, PNMT …" },
  "im-heliocto": { decode: indexableDecoder("HELI-OCTO"), examples: "OEKT, OEMT, REMT …" },
  "im-tangmill": { decode: indexableDecoder("TANG-MILL"), examples: "FDN, SDN, SSB …" },
  "im-16mill": { decode: indexableDecoder("16-MILL"), examples: "F45NM, ONHU, ONMU …" },
  "im-neodo": { decode: indexableDecoder("NEO-DO"), examples: "S890 SZMU, S890 SZHU, S890 FSZ …" },
  "im-doveiqmill": { decode: indexableDecoder("DOVE-IQ-MILL"), examples: "IQ845 FSY, IQ845 FSYD063, IQ845 FSYD080 …" },
  "im-logiq8tang": { decode: indexableDecoder("LOGIQ-8-TANG"), examples: "T890HT FLN, T890HT FLND50, T890HT FLND63 …" },
  "im-alufraise": { decode: indexableDecoder("ALU-FRAISE"), examples: "CA, SPN, CARW …" },
  "im-alutang": { decode: indexableDecoder("ALU-TANG"), examples: "F90LN …" },
  "im-tangfin": { decode: indexableDecoder("TANG-FIN"), examples: "HTF …" },
  "im-mill2000": { decode: indexableDecoder("MILL-2000"), examples: "3M E90AX, 3M F90AX, 3M SM …" },
  "im-millshred": { decode: indexableDecoder("MILL-SHRED"), examples: "RCCW, RCMW, FRW …" },
  "im-quickxflute": { decode: indexableDecoder("QUICK-X-FLUTE"), examples: "S890 SNMU, S890 SM …" },
  "im-isoshred": { decode: indexableDecoder("ISO-SHRED"), examples: "SEMT, SPKR …" },
  "im-tangplunge": { decode: indexableDecoder("TANG-PLUNGE"), examples: "HTP, TS …" },
  "im-iscarplunger": { decode: indexableDecoder("ISCAR-PLUNGER"), examples: "PLHT, PLX, XCMT …" },
  "im-ballplus": { decode: indexableDecoder("BALL-PLUS"), examples: "HBR, HBF, HCM …" },
  "im-heliball": { decode: indexableDecoder("HELI-BALL"), examples: "CR, CDP, CM …" },
  "im-dropmill": { decode: indexableDecoder("DROP-MILL"), examples: "BCM, BCR, BLR …" },
  "im-tor6mill": { decode: indexableDecoder("TOR-6-MILL"), examples: "TR6 TNCU, TR6 TNMU, TR90 TXMT …" },
  "im-quickdmill": { decode: indexableDecoder("QUICK-D-MILL"), examples: "MDR ANMU, MDR D16/.63, MDR D20/.79 …" },
  "im-feedmill": { decode: indexableDecoder("FEED-MILL"), examples: "FF EW, FF FW, FF WOCT …" },
  "im-mill4feed": { decode: indexableDecoder("MILL-4-FEED"), examples: "FFQ4 SOMT, FFQ4 SOMW, FFQ4 D040 …" },
  "im-logiq4feed": { decode: indexableDecoder("LOGIQ-4-FEED"), examples: "FFX4 ED12, FFX4 ED16, FFX4 ED20 …" },
  "im-heli6feed": { decode: indexableDecoder("HELI-6-FEED"), examples: "FF FWX, H600 WXCU, FF EWX …" },
  "im-heli12feed": { decode: indexableDecoder("HELI-12-FEED"), examples: "MF FHX, H1200 HXCU …" },
  "im-neofeed": { decode: indexableDecoder("NEO-FEED"), examples: "FFQ8 D050, FFQ8 D063, FFQ8 D066 …" },
  "im-nan3feed": { decode: indexableDecoder("NAN-3-FEED"), examples: "FFT3 EFM, FFT3 EFMD08/.31, FFT3 EFMD10/.39 …" },
  "im-micro3feed": { decode: indexableDecoder("MICRO-3-FEED"), examples: "FFT3 EFM, FFT3 EFMD10/.39, FFT3 EFMD12/.47 …" },
  "im-16feedmill": { decode: indexableDecoder("16-FEED-MILL"), examples: "FF NM …" },
  "im-cermill": { decode: indexableDecoder("CER-MILL"), examples: "ERP, FFN, EFN …" },
  "im-helislot": { decode: indexableDecoder("HELI-SLOT"), examples: "ETS, SM, FDN …" },
  "im-tangslot": { decode: indexableDecoder("TANG-SLOT"), examples: "FDN, SDN, LNET …" },
  "im-minitangslot": { decode: indexableDecoder("MINI-TANG-SLOT"), examples: "ETS, FDN, SDN …" },
  "im-tangslit": { decode: indexableDecoder("TANG-SLIT"), examples: "TGSF …" },
  "im-slimslit": { decode: indexableDecoder("SLIM-SLIT"), examples: "SGST …" },
  "im-selfgrip": { decode: indexableDecoder("SELF-GRIP"), examples: "GSFN, GSFU, SGSF …" },
  "im-cutgrip": { decode: indexableDecoder("CUT-GRIP"), examples: "GM …" },
  "im-chamslit": { decode: indexableDecoder("CHAM-SLIT"), examples: "TRIB, TRI …" },
  "im-modugear": { decode: indexableDecoder("MODU-GEAR"), examples: "ETS, LNET …" },
  "im-millthread": { decode: withTurningLine(indexableDecoder("MILL-THREAD"), "MILL-THREAD"), examples: "MTSRH, MTSR, MTE …" },
  "im-quickmthread": { decode: indexableDecoder("QUICK-M-THREAD"), examples: "MTET …" },
  "im-solidthread": { decode: withTurningLine(indexableDecoder("SOLID-THREAD"), "SOLID-THREAD"), examples: "MTECS, MTEC, MTECB …" },
  "im-solidmthread": { decode: withTurningLine(indexableDecoder("SOLID-M-THREAD"), "SOLID-M-THREAD"), examples: "MTECBF, MTECM, MTECK …" },
  "im-hssmill": { decode: indexableDecoder("HSS-MILL"), examples: "EBH, EH, ERH …" },
  "im-tslot": { decode: indexableDecoder("T-SLOT"), examples: "SD …" },
  "im-tface": { decode: indexableDecoder("T-FACE"), examples: "SD …" },
  "im-tgear": { decode: indexableDecoder("T-GEAR"), examples: "SD …" },
  "tl-quickturn": { decode: turningLineDecoder("QUICK-TURN"), examples: "Q6-DMXNL 2525M-12-SL-JHP or Q6-MNMG120608-M3P-SL" },
  "tl-quicktlock": { decode: turningLineDecoder("QUICK-T-LOCK"), examples: "Q3-SMXCL 2525M-16-SL-JHP or Q3-SMXCN 2525M-16-SL-JHP" },
  "tl-jetrturn": { decode: turningLineDecoder("JET-R-TURN"), examples: "DDJNL 2020X-15-JHP-MC or DCLNL 2020X-12-JHP-MC" },
  "tl-heliturnld": { decode: turningLineDecoder("HELI-TURN-LD"), examples: "CNMX 090604-M3PW or PCLNL 2020K-09X" },
  "tl-multiwedge": { decode: turningLineDecoder("MULTI-WEDGE"), examples: "MULNL 2525M-12MW or S25T MULNR-12MW" },
  "tl-doveiqturn": { decode: turningLineDecoder("DOVE-IQ-TURN"), examples: "PWXOL 2525M-10-TF-IQ or WOMG 100716-T3P-IQ" },
  "tl-neoturn": { decode: turningLineDecoder("NEO-TURN"), examples: "XNMG 090404-F3P or XNMG 090404-M3P" },
  "tl-minipturn": { decode: turningLineDecoder("MINI-P-TURN"), examples: "WNGP 040302L-F2M or WNGP 040302L-F2P" },
  "tl-alupturn": { decode: turningLineDecoder("ALU-P-TURN"), examples: "CNGG 090402-F3N-P or WNGG 060402-F3N-P" },
  "tl-heavysuperturn": { decode: turningLineDecoder("HEAVY-SUPER-TURN"), examples: "LOMX 402224-H6P or PLBOL 5050T-40" },
  "tl-heliturn": { decode: turningLineDecoder("HELI-TURN"), examples: "SLANL 1616H-11 TANG or LNMX 110408L-HT" },
  "tl-logiq4turn": { decode: turningLineDecoder("LOGIQ-4-TURN"), examples: "CXMG 090401-F3P or CXMG 090408-M3P" },
  "tl-safetlock": { decode: turningLineDecoder("SAFE-T-LOCK"), examples: "DCMT 13T504-F3P-SL or SDNCN 1616H-13-SL" },
  "tl-neoswiss": { decode: turningLineDecoder("NEO-SWISS"), examples: "NQCH12-SCACL-09S-JHP or NQCH10-SDACR-11S-JHP" },
  "tl-neoyswiss": { decode: turningLineDecoder("NEO-Y-SWISS"), examples: "Y-SDJCR 1212K-11S or Y-SVJCR 1212K-11S" },
  "tl-isoyturn": { decode: turningLineDecoder("ISO-Y-TURN"), examples: "HSK A63WH-SDJCN-13SL-125Y or C4 SDJCN-13-SL-H65-Y" },
  "tl-whisperline": { decode: turningLineDecoder("WHISPERLINE"), examples: "AVC-D16-SCLCL-06 or AVC-D32-DDUNL-11T" },
  "tl-iscarthread": { decode: turningLineDecoder("ISCAR-THREAD"), examples: "11ER A 55 IC250 or 11EL A 60 IC908" },
  "tl-logiq6turn": { decode: turningLineDecoder("LOGIQ-6-TURN"), examples: "D6NGG 160402-F3P or D6NMG 160404-M3P" },
  "tl-feedturn": { decode: turningLineDecoder("FEED-TURN"), examples: "SLLNL 2525M-16HF or LNMX 1608L-HF" },
  "tl-swissturn": { decode: turningLineDecoder("SWISS-TURN"), examples: "CCGT 0602005-F1M-12P or DCGT 0702005-F1M-12P" },
  "tl-chamturn": { decode: turningLineDecoder("CHAM-TURN"), examples: "SC45MT 100508-SM or CC95MT 100504-SM" },
  "tl-modulargrip": { decode: turningLineDecoder("MODULAR-GRIP"), examples: "HGPAD 3L-T12 or CGPAD 3L-T16" },
  "tl-vlock": { decode: turningLineDecoder("V-LOCK"), examples: "SXCNN 1212 K10-06 or XNUW 1003-06" },
  "tl-formtool": { decode: turningLineDecoder("FORM-TOOL"), examples: "FTHN 2525M-3010 or FTB 3010" },
  "tl-quick2cutmini": { decode: turningLineDecoder("QUICK2CUT MINI"), examples: "TGV N033P-000 or TGV L1.00P-0.05-8D" },
  "tl-quickswiss": { decode: turningLineDecoder("QUICK-SWISS"), examples: "SBTT-SDNCN07-JHP or SBTT-SVVCN11-JHP" },
  "tl-swissgrip": { decode: turningLineDecoder("SWISSGRIP"), examples: "THQR 10-D16 or SGAQ D10-0.6" },
  "tl-piccojet": { decode: turningLineDecoder("PICCO-JET"), examples: "PICJ RT20D08R04-4 or PICJ RT20D40R10-10C" },
  "tl-piccocut": { decode: turningLineDecoder("PICCO-CUT"), examples: "PICCO R 050.06-2 or PICCO R 002.0050-5" },
  "tl-piccoindex": { decode: turningLineDecoder("PICCO-INDEX"), examples: "PICIN E05-T20-SCLCL-03 or PICIN E06-T25-MGSIL-06" },
  "tl-minicham": { decode: turningLineDecoder("MINI-CHAM"), examples: "MGUHR 06-04L10 or UMGR 4.0-0.0" },
  "tl-iscarbroach": { decode: turningLineDecoder("ISCAR-BROACH"), examples: "SXCIB 25-22-50 or XNUWB 13-6.12-0.85" },
  "tl-fixgrip": { decode: turningLineDecoder("FIX-GRIP"), examples: "FGPA 6.00-3.00 or FGHR 2525-6A" },
  "tl-tanggripiq": { decode: turningLineDecoder("TANG-GRIP-IQ"), examples: "TGTL 1010-1.4-IQ or TGSU 35-1.4-IQ" },
  "tl-modugrip": { decode: turningLineDecoder("MODU-GRIP"), examples: "TGAD 2LE-D54-JHP or DGAD 2LE-D38-JHP" },
  "tl-feedgrip": { decode: turningLineDecoder("FEED-GRIP"), examples: "TAG N3HF" },
  "tl-logiqfgrip": { decode: turningLineDecoder("LOGIQ-F-GRIP"), examples: "TGTBQ 20L-D52-JHP or TGTBY L32-D82R-JHP" },
  "tl-tangfgrip": { decode: turningLineDecoder("TANG-F-GRIP"), examples: "TGAQ D52-2-2Z-JHP or TGAQ D42-2-2Z" },
  "tl-dofgrip": { decode: turningLineDecoder("DO-F-GRIP"), examples: "DGAQ D52-2-2Z-JHP or DGAQ D52-2-2Z" },
  "tl-jetcrown": { decode: turningLineDecoder("JET-CROWN"), examples: "TGAQ D42-2-2Z-ECD or TGTBQ 20L-D65-ECD-JHP" },
  "tl-tang5grip": { decode: turningLineDecoder("TANG-5-GRIP"), examples: "ADMP D45-2.0" },
  "tl-piccomft": { decode: turningLineDecoder("PICCO-MFT"), examples: "PICCO R-MFT60 6-4 L08" },
  "tl-quickthread": { decode: turningLineDecoder("QUICK-THREAD"), examples: "16ER 0.75 ISO 3M-Q IC908 or 16IR 1.00 ISO 3M-Q IC908" },
  "tl-notchgrip": { decode: turningLineDecoder("NOTCH-GRIP"), examples: "ING3031LCB or INGP2031L" },
  "tl-jetcut": { decode: turningLineDecoder("JET-CUT"), examples: "SEL 2020 K16-JHP or SEL 2020X16 JHP-MC" },
  "tl-cermturn": { decode: turningLineDecoder("CER-M-TURN"), examples: "C5 CXXNL-35060-AD09/12JHP or CXXNL 2525M-AD-09/12-JHP" },
  "tl-decaiqthread": { decode: turningLineDecoder("DECA-IQ-THREAD"), examples: "SEL 1212 F16TT-JHP or TTG-16E-0.50-ISO IC908" },
  "tl-iscartaps": { decode: turningLineDecoder("ISCAR-TAPS"), examples: "TPSN M-2X0.4-H or TPGN M-2X0.4-S" },
  "tl-onetap": { decode: turningLineDecoder("ONE-TAP"), examples: "TPGN M-8X1.25-M-B or TPGN M-2X0.4-M" },
  "tl-picco3cut": { decode: turningLineDecoder("PICCO-3-CUT"), examples: "PMC LT20D30R10-10" },
  "tl-piccomf": { decode: turningLineDecoder("PICCO-MF"), examples: "PICCO R-MF 6-3 L06" },
  "tl-spinjet": { decode: turningLineDecoder("SPIN-JET"), examples: "V60 TJS or V60 TJS P" },
  "tl-threadqlock": { decode: turningLineDecoder("THREAD-Q-LOCK"), examples: "16ER A 60-Q IC808 or 16ER AG 55-Q IC808" },
  "iso-turning": { decode: decodeIsoTurning, examples: "MWLNR 2525M-08W or S25S MWLNR-08W" },
  "iso-insert": { decode: decodeIsoInsert, examples: "WNMG 080408 E-GN" },
  cbn: { decode: decodeCbn, examples: "CNGA 120408S (N) 2MT MF BI15HC" },
  ceramic: { decode: decodeCeramic, examples: "CNGA 120408 WL T01020 IS45C" },
  pcd: { decode: decodePcd, examples: "CNGA 120408F (N) L MD ID5" },
  "do-grip": { decode: withTurningLine(decodeDoGrip, "DO-GRIP"), examples: "DGR 3100JS-15D, DGN 3102J or DGFH 32C-3" },
  "tang-grip": { decode: withTurningLine(decodeTag, "TANG-GRIP"), examples: "TAG N3C, TAG R3C-15D or TGFH 26K-3" },
  flashpenta: { decode: withTurningLine(decodeFlashPenta, "FLASHPENTA"), examples: "PMN D32-2C02, PMN D40-3PB02 or PMN D22-3J-1.5" },
  "penta-iq": { decode: withTurningLine(decodePentaIq, "PENTA IQ GRIP"), examples: "PENTA D32N200C020, PENTA D22R200J-6D or PCHR 12-D22-2-IQ" },
  "quick-penta": { decode: withTurningLine(decodeQuickPenta, "QUICK-PENTA"), examples: "PENTA 24N200C020SL, PENTA 24N080NF01RS-SL or PCHR 20-24-JHP-MC-QC" },
  penta: { decode: withTurningLine(decodePenta, "PENTACUT"), examples: "PENTA 24N200J020, PENTA 17L100P-15D-RS, PENTA 34F239-0.15-22L or PCHR 16-24-5" },
  gim: { decode: decodeGim, examples: "GIM 3J or GIM 2.2JS-15RA" },
  bgm: { decode: withTurningLine(decodeBgm, "ISCAR-PARTING"), examples: "BGM N1001J or BGTR 16B-D20-JHP" },
  gft: { decode: withTurningLine(decodeGft, "SLIM-GRIP"), examples: "GFT 1.2J-0.14" },
  "self-grip": { decode: withTurningLine(decodeSelfGrip, "SELF-GRIP"), examples: "GFN 3J, GFR 3JS-8D or SGFH 26K-3" },
  "cut-grip": { decode: withTurningLine(decodeCutGrip, "CUT-GRIP"), examples: "GIP 3.00E-0.40, GIMY 808 or GHDR 16-3" },
  groove4cut: { decode: withTurningLine(decodeGroove4Cut, "GROOVE4CUT"), examples: "QGI 30N200PF020 or QTHR 16-30-JHP-MC" },
  heliface: { decode: withTurningLine(decodeHeliFace, "HELIFACE"), examples: "HFPR 4004, HFAIR 140C-4T30DG or HFHR 20-25-3T12" },
  "quick-i-groove": { decode: withTurningLine(decodeQuickIGroove, "QUICK-I-GROOVE"), examples: "GQIN 1.50-0.10 or GQHINR 16C-16.5-20" },
  "cham-groove": { decode: withTurningLine(decodeChamGroove, "CHAM-GROOVE"), examples: "GIQR 8-1.50-0.05, GIQL 11-15-2.00-R100 or MGCH 08C" },
  "dove-iq-grip": { decode: withTurningLine(decodeDoveIqGrip, "DOVE IQ GRIP"), examples: "TIGER 1008Y-IQ, THDR 2525-10T20-IQ or CR THDN-10-IQ" },
  mincut: { decode: withTurningLine(decodeMinCut, "MIN-CUT"), examples: "MIFR 8-1.50-0.20, MIGR 8-1.20-0.05 or MIFHR 10C-8" },
  "sumo-grip": { decode: withTurningLine(decodeSumoGrip, "SUMO-GRIP"), examples: "TAGB 608Y, TAGBA 80-40YZ or TGBHR 25C-14T20" },
  swisscut: { decode: withTurningLine(decodeSwissCut, "SWISSCUT"), examples: "SCIL 22-050L12-00, SCIR 22-BR10-05K15 or SCHR 10-22BF" },
  "top-grip": { decode: withTurningLine(decodeTopGrip, "TOP-GRIP"), examples: "TGMF 302, TGMA 404K or TGDR 2020-3M" },
  "heli-grip": { decode: withTurningLine(decodeHeliGrip, "HELI-GRIP"), examples: "GRIP 3002Y, GRIPA 3.00-0.40 or HELIR 2525-3T20" },
};

// A table row for a code: exact, else a pattern row ("##", "BIxx", "ISxx")
// whose x / # stand for any character.
export function findRow<R extends { code: string }>(rows: R[], code: string): R | undefined {
  return (
    rows.find((r) => r.code === code) ??
    rows.find((r) => r.code.length === code.length && /[x#]/.test(r.code) && [...r.code].every((c, i) => c === "x" || c === "#" || c === code[i]))
  );
}

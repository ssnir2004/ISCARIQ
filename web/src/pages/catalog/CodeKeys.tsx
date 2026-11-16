import { useState } from "react";
import { Link } from "react-router-dom";
import { CodeKey, DecodedTable, useCodeKeyData } from "../../components/CodeKey";
import { Input, PageHeader } from "../../components/ui";
import { DECODERS, type Decoded, type DecoderName } from "../../lib/insertDecoders";
import { useResource } from "../../lib/useResource";
import type { Application, InnovationUse } from "../../lib/types";

// Code keys by application, then by type: each application has its tools key
// (e.g. Turning: ISO toolholders and boring bars), Turning also has the insert
// keys of each grade family (carbide, CBN, ceramic, PCD) and Parting the keys
// of its brands (DO-GRIP), each with its designation decoder.

const LAST_TAB_KEY = "iscariq.codekeys.tab";
const LAST_TYPE_KEY = "iscariq.codekeys.type";
const DEFAULT_TAB = "Turning";

interface KeyType {
  id: string;
  label: string;
  settingKey: string;
  defaultTitle: string;
  decoder?: DecoderName;
}

// The Turning insert keys (the setting keys the Grades screen used).
const TURNING_INSERTS: KeyType[] = [
  { id: "carbide", label: "Carbide insert", settingKey: "codekey.carbide", defaultTitle: "Carbide insert code key", decoder: "iso-insert" },
  { id: "cbn", label: "CBN insert", settingKey: "codekey.cbn", defaultTitle: "CBN insert code key", decoder: "cbn" },
  { id: "ceramic", label: "Ceramic insert", settingKey: "codekey.ceramic", defaultTitle: "Ceramic insert code key", decoder: "ceramic" },
  { id: "pcd", label: "PCD insert", settingKey: "codekey.pcd", defaultTitle: "PCD insert code key", decoder: "pcd" },
];

// The Parting families' keys (inserts and tools).
const PARTING_BRANDS: KeyType[] = [
  { id: "do-grip", label: "DO-GRIP", settingKey: "codekey.dogrip", defaultTitle: "DO-GRIP code key", decoder: "do-grip" },
  { id: "tang-grip", label: "TANG-GRIP", settingKey: "codekey.tanggrip", defaultTitle: "TANG-GRIP code key", decoder: "tang-grip" },
  { id: "heli-grip", label: "HELI-GRIP", settingKey: "codekey.heligrip", defaultTitle: "HELI-GRIP code key", decoder: "heli-grip" },
  { id: "top-grip", label: "TOP-GRIP", settingKey: "codekey.topgrip", defaultTitle: "TOP-GRIP code key", decoder: "top-grip" },
  { id: "swisscut", label: "SWISSCUT", settingKey: "codekey.swisscut", defaultTitle: "SWISSCUT code key", decoder: "swisscut" },
  { id: "cham-groove", label: "CHAM-GROOVE", settingKey: "codekey.chamgroove", defaultTitle: "CHAM-GROOVE code key", decoder: "cham-groove" },
  { id: "quick-i-groove", label: "QUICK-I-GROOVE", settingKey: "codekey.quickigroove", defaultTitle: "QUICK-I-GROOVE code key", decoder: "quick-i-groove" },
  { id: "heliface", label: "HELIFACE", settingKey: "codekey.heliface", defaultTitle: "HELIFACE code key", decoder: "heliface" },
  { id: "sumo-grip", label: "SUMO-GRIP", settingKey: "codekey.sumogrip", defaultTitle: "SUMO-GRIP code key", decoder: "sumo-grip" },
  { id: "dove-iq-grip", label: "DOVE IQ GRIP", settingKey: "codekey.doveiqgrip", defaultTitle: "DOVE IQ GRIP code key", decoder: "dove-iq-grip" },
  { id: "mincut", label: "MIN-CUT", settingKey: "codekey.mincut", defaultTitle: "MIN-CUT code key", decoder: "mincut" },
  { id: "self-grip", label: "SELF-GRIP", settingKey: "codekey.selfgrip", defaultTitle: "SELF-GRIP code key", decoder: "self-grip" },
  { id: "groove4cut", label: "GROOVE4CUT", settingKey: "codekey.groove4cut", defaultTitle: "GROOVE4CUT code key", decoder: "groove4cut" },
  { id: "quick-penta", label: "QUICK-PENTA", settingKey: "codekey.quickpenta", defaultTitle: "QUICK-PENTA code key", decoder: "quick-penta" },
  { id: "penta-iq", label: "PENTA IQ GRIP", settingKey: "codekey.pentaiq", defaultTitle: "PENTA IQ GRIP code key", decoder: "penta-iq" },
  { id: "flashpenta", label: "FLASHPENTA", settingKey: "codekey.flashpenta", defaultTitle: "FLASHPENTA code key", decoder: "flashpenta" },
  { id: "penta", label: "PENTACUT", settingKey: "codekey.penta", defaultTitle: "PENTACUT code key", decoder: "penta" },
  { id: "cut-grip", label: "CUT-GRIP", settingKey: "codekey.cutgrip", defaultTitle: "CUT-GRIP code key", decoder: "cut-grip" },
  { id: "bgm", label: "ISCAR-PARTING", settingKey: "codekey.bgm", defaultTitle: "ISCAR-PARTING code key", decoder: "bgm" },
  { id: "gft", label: "SLIM-GRIP", settingKey: "codekey.gft", defaultTitle: "SLIM-GRIP code key", decoder: "gft" },
];

// The Drilling families' keys (heads and drill bodies).
const DRILLING_BRANDS: KeyType[] = [
  { id: "sumo-cham", label: "SUMO-CHAM", settingKey: "codekey.sumocham", defaultTitle: "SUMO-CHAM code key", decoder: "sumo-cham" },
  { id: "sumo-cham-iq", label: "SUMO-CHAM IQ", settingKey: "codekey.sumochamiq", defaultTitle: "SUMO-CHAM IQ code key", decoder: "sumo-cham-iq" },
  { id: "quick-3-cham", label: "QUICK-3-CHAM", settingKey: "codekey.quick3cham", defaultTitle: "QUICK-3-CHAM code key", decoder: "quick-3-cham" },
  { id: "sumo-l-drill", label: "SUMO-L-DRILL", settingKey: "codekey.sumoldrill", defaultTitle: "SUMO-L-DRILL code key", decoder: "sumo-l-drill" },
  { id: "spade-cham", label: "SPADE-CHAM", settingKey: "codekey.spadecham", defaultTitle: "SPADE-CHAM code key", decoder: "spade-cham" },
  { id: "cham-drill", label: "CHAM-DRILL", settingKey: "codekey.chamdrill", defaultTitle: "CHAM-DRILL code key", decoder: "cham-drill" },
  { id: "sumo-gun", label: "SUMO-GUN", settingKey: "codekey.sumogun", defaultTitle: "SUMO-GUN code key", decoder: "sumo-gun" },
  { id: "dr-twist", label: "DR-TWIST", settingKey: "codekey.drtwist", defaultTitle: "DR-TWIST code key", decoder: "dr-twist" },
  { id: "combi-cham", label: "COMBI-CHAM", settingKey: "codekey.combicham", defaultTitle: "COMBI-CHAM code key", decoder: "combi-cham" },
  { id: "modu-drill", label: "MODU-DRILL", settingKey: "codekey.modudrill", defaultTitle: "MODU-DRILL code key", decoder: "modu-drill" },
  { id: "multi-function", label: "MULTI-FUNCTION TOOLS", settingKey: "codekey.multifunction", defaultTitle: "MULTI-FUNCTION TOOLS code key", decoder: "multi-function" },
  { id: "solid-drill", label: "SOLID-DRILL", settingKey: "codekey.soliddrill", defaultTitle: "SOLID-DRILL code key", decoder: "solid-drill" },
  { id: "chamring", label: "CHAMRING", settingKey: "codekey.chamring", defaultTitle: "CHAMRING code key", decoder: "chamring" },
  { id: "multi-master-drill", label: "MULTI-MASTER", settingKey: "codekey.multimasterdrill", defaultTitle: "MULTI-MASTER code key", decoder: "multi-master-drill" },
  { id: "tri-deep", label: "TRI-DEEP", settingKey: "codekey.trideep", defaultTitle: "TRI-DEEP code key", decoder: "tri-deep" },
  { id: "fine-beam", label: "FINE-BEAM", settingKey: "codekey.finebeam", defaultTitle: "FINE-BEAM code key", decoder: "fine-beam" },
  { id: "iscar-deep-drill", label: "ISCAR-DEEP-DRILL", settingKey: "codekey.iscardeepdrill", defaultTitle: "ISCAR-DEEP-DRILL code key", decoder: "iscar-deep-drill" },
  { id: "iscar-gundrills", label: "ISCAR-GUNDRILLS", settingKey: "codekey.iscargundrills", defaultTitle: "ISCAR-GUNDRILLS code key", decoder: "iscar-gundrills" },
];

// Milling brands, from the ISCAR milling catalog (solid endmills and
// MULTI-MASTER: the "Endmills(SC) & MM" application where milling is split).
const MILLING_BRANDS: KeyType[] = [
  { id: "multi-master-mill", label: "MULTI-MASTER", settingKey: "codekey.multimastermill", defaultTitle: "MULTI-MASTER code key", decoder: "multi-master-mill" },
  { id: "multi-feed-master", label: "MULTI-FEED-MASTER", settingKey: "codekey.multifeedmaster", defaultTitle: "MULTI-FEED-MASTER code key", decoder: "multi-feed-master" },
  { id: "solidmill", label: "SOLIDMILL", settingKey: "codekey.solidmill", defaultTitle: "SOLIDMILL code key", decoder: "solidmill" },
  { id: "chatter-free", label: "CHATTER-FREE", settingKey: "codekey.chatterfree", defaultTitle: "CHATTER-FREE code key", decoder: "chatter-free" },
  { id: "solidshred", label: "SOLIDSHRED", settingKey: "codekey.solidshred", defaultTitle: "SOLIDSHRED code key", decoder: "solidshred" },
  { id: "finishred", label: "FINISHRED", settingKey: "codekey.finishred", defaultTitle: "FINISHRED code key", decoder: "finishred" },
  { id: "solid-feed-mill", label: "SOLID-FEED-MILL", settingKey: "codekey.solidfeedmill", defaultTitle: "SOLID-FEED-MILL code key", decoder: "solid-feed-mill" },
  { id: "ti-turbo", label: "Ti-TURBO", settingKey: "codekey.titurbo", defaultTitle: "Ti-TURBO code key", decoder: "ti-turbo" },
  { id: "neobarrel", label: "NEOBARREL", settingKey: "codekey.neobarrel", defaultTitle: "NEOBARREL code key", decoder: "neobarrel" },
  { id: "im-hssmill", label: "HSS-MILL", settingKey: "codekey.im.hssmill", defaultTitle: "HSS-MILL code key", decoder: "im-hssmill" },
  { id: "im-tslot", label: "T-SLOT", settingKey: "codekey.im.tslot", defaultTitle: "T-SLOT code key", decoder: "im-tslot" },
  { id: "im-tface", label: "T-FACE", settingKey: "codekey.im.tface", defaultTitle: "T-FACE code key", decoder: "im-tface" },
  { id: "im-tgear", label: "T-GEAR", settingKey: "codekey.im.tgear", defaultTitle: "T-GEAR code key", decoder: "im-tgear" },
];

// Indexable milling brands, from the ISCAR milling catalog, in catalog order.
const INDEXABLE_MILLING_BRANDS: KeyType[] = [
  { id: "im-heli2000", label: "HELI-2000", settingKey: "codekey.im.heli2000", defaultTitle: "HELI-2000 code key", decoder: "im-heli2000" },
  { id: "im-helimill", label: "HELI-MILL", settingKey: "codekey.im.helimill", defaultTitle: "HELI-MILL code key", decoder: "im-helimill" },
  { id: "im-helialu", label: "HELI-ALU", settingKey: "codekey.im.helialu", defaultTitle: "HELI-ALU code key", decoder: "im-helialu" },
  { id: "im-heliquad", label: "HELI-QUAD", settingKey: "codekey.im.heliquad", defaultTitle: "HELI-QUAD code key", decoder: "im-heliquad" },
  { id: "im-heli4mill", label: "HELI-4-MILL", settingKey: "codekey.im.heli4mill", defaultTitle: "HELI-4-MILL code key", decoder: "im-heli4mill" },
  { id: "im-quad2000", label: "QUAD-2000", settingKey: "codekey.im.quad2000", defaultTitle: "QUAD-2000 code key", decoder: "im-quad2000" },
  { id: "im-xquad", label: "X-QUAD", settingKey: "codekey.im.xquad", defaultTitle: "X-QUAD code key", decoder: "im-xquad" },
  { id: "im-heli3mill", label: "HELI-3-MILL", settingKey: "codekey.im.heli3mill", defaultTitle: "HELI-3-MILL code key", decoder: "im-heli3mill" },
  { id: "im-nanmill", label: "NAN-MILL", settingKey: "codekey.im.nanmill", defaultTitle: "NAN-MILL code key", decoder: "im-nanmill" },
  { id: "im-heliplus", label: "HELI-PLUS", settingKey: "codekey.im.heliplus", defaultTitle: "HELI-PLUS code key", decoder: "im-heliplus" },
  { id: "im-helitang", label: "HELI-TANG", settingKey: "codekey.im.helitang", defaultTitle: "HELI-TANG code key", decoder: "im-helitang" },
  { id: "im-sumomill", label: "SUMO-MILL", settingKey: "codekey.im.sumomill", defaultTitle: "SUMO-MILL code key", decoder: "im-sumomill" },
  { id: "im-iscarmill", label: "ISCAR-MILL", settingKey: "codekey.im.iscarmill", defaultTitle: "ISCAR-MILL code key", decoder: "im-iscarmill" },
  { id: "im-helido", label: "HELI-DO", settingKey: "codekey.im.helido", defaultTitle: "HELI-DO code key", decoder: "im-helido" },
  { id: "im-tormill", label: "TOR-MILL", settingKey: "codekey.im.tormill", defaultTitle: "TOR-MILL code key", decoder: "im-tormill" },
  { id: "im-roundmill", label: "ROUND-MILL", settingKey: "codekey.im.roundmill", defaultTitle: "ROUND-MILL code key", decoder: "im-roundmill" },
  { id: "im-chammill", label: "CHAM-MILL", settingKey: "codekey.im.chammill", defaultTitle: "CHAM-MILL code key", decoder: "im-chammill" },
  { id: "im-chamfmill", label: "CHAMF-MILL", settingKey: "codekey.im.chamfmill", defaultTitle: "CHAMF-MILL code key", decoder: "im-chamfmill" },
  { id: "im-heliocto", label: "HELI-OCTO", settingKey: "codekey.im.heliocto", defaultTitle: "HELI-OCTO code key", decoder: "im-heliocto" },
  { id: "im-tangmill", label: "TANG-MILL", settingKey: "codekey.im.tangmill", defaultTitle: "TANG-MILL code key", decoder: "im-tangmill" },
  { id: "im-16mill", label: "16-MILL", settingKey: "codekey.im.16mill", defaultTitle: "16-MILL code key", decoder: "im-16mill" },
  { id: "im-neodo", label: "NEO-DO", settingKey: "codekey.im.neodo", defaultTitle: "NEO-DO code key", decoder: "im-neodo" },
  { id: "im-doveiqmill", label: "DOVE-IQ-MILL", settingKey: "codekey.im.doveiqmill", defaultTitle: "DOVE-IQ-MILL code key", decoder: "im-doveiqmill" },
  { id: "im-logiq8tang", label: "LOGIQ-8-TANG", settingKey: "codekey.im.logiq8tang", defaultTitle: "LOGIQ-8-TANG code key", decoder: "im-logiq8tang" },
  { id: "im-alufraise", label: "ALU-FRAISE", settingKey: "codekey.im.alufraise", defaultTitle: "ALU-FRAISE code key", decoder: "im-alufraise" },
  { id: "im-alutang", label: "ALU-TANG", settingKey: "codekey.im.alutang", defaultTitle: "ALU-TANG code key", decoder: "im-alutang" },
  { id: "im-tangfin", label: "TANG-FIN", settingKey: "codekey.im.tangfin", defaultTitle: "TANG-FIN code key", decoder: "im-tangfin" },
  { id: "im-mill2000", label: "MILL-2000", settingKey: "codekey.im.mill2000", defaultTitle: "MILL-2000 code key", decoder: "im-mill2000" },
  { id: "im-millshred", label: "MILL-SHRED", settingKey: "codekey.im.millshred", defaultTitle: "MILL-SHRED code key", decoder: "im-millshred" },
  { id: "im-quickxflute", label: "QUICK-X-FLUTE", settingKey: "codekey.im.quickxflute", defaultTitle: "QUICK-X-FLUTE code key", decoder: "im-quickxflute" },
  { id: "im-isoshred", label: "ISO-SHRED", settingKey: "codekey.im.isoshred", defaultTitle: "ISO-SHRED code key", decoder: "im-isoshred" },
  { id: "im-tangplunge", label: "TANG-PLUNGE", settingKey: "codekey.im.tangplunge", defaultTitle: "TANG-PLUNGE code key", decoder: "im-tangplunge" },
  { id: "im-iscarplunger", label: "ISCAR-PLUNGER", settingKey: "codekey.im.iscarplunger", defaultTitle: "ISCAR-PLUNGER code key", decoder: "im-iscarplunger" },
  { id: "im-ballplus", label: "BALL-PLUS", settingKey: "codekey.im.ballplus", defaultTitle: "BALL-PLUS code key", decoder: "im-ballplus" },
  { id: "im-heliball", label: "HELI-BALL", settingKey: "codekey.im.heliball", defaultTitle: "HELI-BALL code key", decoder: "im-heliball" },
  { id: "im-dropmill", label: "DROP-MILL", settingKey: "codekey.im.dropmill", defaultTitle: "DROP-MILL code key", decoder: "im-dropmill" },
  { id: "im-tor6mill", label: "TOR-6-MILL", settingKey: "codekey.im.tor6mill", defaultTitle: "TOR-6-MILL code key", decoder: "im-tor6mill" },
  { id: "im-quickdmill", label: "QUICK-D-MILL", settingKey: "codekey.im.quickdmill", defaultTitle: "QUICK-D-MILL code key", decoder: "im-quickdmill" },
  { id: "im-feedmill", label: "FEED-MILL", settingKey: "codekey.im.feedmill", defaultTitle: "FEED-MILL code key", decoder: "im-feedmill" },
  { id: "im-mill4feed", label: "MILL-4-FEED", settingKey: "codekey.im.mill4feed", defaultTitle: "MILL-4-FEED code key", decoder: "im-mill4feed" },
  { id: "im-logiq4feed", label: "LOGIQ-4-FEED", settingKey: "codekey.im.logiq4feed", defaultTitle: "LOGIQ-4-FEED code key", decoder: "im-logiq4feed" },
  { id: "im-heli6feed", label: "HELI-6-FEED", settingKey: "codekey.im.heli6feed", defaultTitle: "HELI-6-FEED code key", decoder: "im-heli6feed" },
  { id: "im-heli12feed", label: "HELI-12-FEED", settingKey: "codekey.im.heli12feed", defaultTitle: "HELI-12-FEED code key", decoder: "im-heli12feed" },
  { id: "im-neofeed", label: "NEO-FEED", settingKey: "codekey.im.neofeed", defaultTitle: "NEO-FEED code key", decoder: "im-neofeed" },
  { id: "im-nan3feed", label: "NAN-3-FEED", settingKey: "codekey.im.nan3feed", defaultTitle: "NAN-3-FEED code key", decoder: "im-nan3feed" },
  { id: "im-micro3feed", label: "MICRO-3-FEED", settingKey: "codekey.im.micro3feed", defaultTitle: "MICRO-3-FEED code key", decoder: "im-micro3feed" },
  { id: "im-16feedmill", label: "16-FEED-MILL", settingKey: "codekey.im.16feedmill", defaultTitle: "16-FEED-MILL code key", decoder: "im-16feedmill" },
  { id: "im-cermill", label: "CER-MILL", settingKey: "codekey.im.cermill", defaultTitle: "CER-MILL code key", decoder: "im-cermill" },
  { id: "im-helislot", label: "HELI-SLOT", settingKey: "codekey.im.helislot", defaultTitle: "HELI-SLOT code key", decoder: "im-helislot" },
  { id: "im-tangslot", label: "TANG-SLOT", settingKey: "codekey.im.tangslot", defaultTitle: "TANG-SLOT code key", decoder: "im-tangslot" },
  { id: "im-minitangslot", label: "MINI-TANG-SLOT", settingKey: "codekey.im.minitangslot", defaultTitle: "MINI-TANG-SLOT code key", decoder: "im-minitangslot" },
  { id: "im-tangslit", label: "TANG-SLIT", settingKey: "codekey.im.tangslit", defaultTitle: "TANG-SLIT code key", decoder: "im-tangslit" },
  { id: "im-slimslit", label: "SLIM-SLIT", settingKey: "codekey.im.slimslit", defaultTitle: "SLIM-SLIT code key", decoder: "im-slimslit" },
  { id: "im-selfgrip", label: "SELF-GRIP", settingKey: "codekey.im.selfgrip", defaultTitle: "SELF-GRIP code key", decoder: "im-selfgrip" },
  { id: "im-cutgrip", label: "CUT-GRIP", settingKey: "codekey.im.cutgrip", defaultTitle: "CUT-GRIP code key", decoder: "im-cutgrip" },
  { id: "im-chamslit", label: "CHAM-SLIT", settingKey: "codekey.im.chamslit", defaultTitle: "CHAM-SLIT code key", decoder: "im-chamslit" },
  { id: "im-modugear", label: "MODU-GEAR", settingKey: "codekey.im.modugear", defaultTitle: "MODU-GEAR code key", decoder: "im-modugear" },
  { id: "im-millthread", label: "MILL-THREAD", settingKey: "codekey.im.millthread", defaultTitle: "MILL-THREAD code key", decoder: "im-millthread" },
  { id: "im-quickmthread", label: "QUICK-M-THREAD", settingKey: "codekey.im.quickmthread", defaultTitle: "QUICK-M-THREAD code key", decoder: "im-quickmthread" },
  { id: "im-solidthread", label: "SOLID-THREAD", settingKey: "codekey.im.solidthread", defaultTitle: "SOLID-THREAD code key", decoder: "im-solidthread" },
  { id: "im-solidmthread", label: "SOLID-M-THREAD", settingKey: "codekey.im.solidmthread", defaultTitle: "SOLID-M-THREAD code key", decoder: "im-solidmthread" },
];

// The turning catalog's brands (turning, grooving & parting, Swiss-type and
// threading lines), by application, in catalog order.
const TURNING_CATALOG_BRANDS: Record<string, KeyType[]> = {
  "parting": [
    { id: "tl-quick2cutmini", label: "QUICK2CUT MINI", settingKey: "codekey.tl.quick2cutmini", defaultTitle: "QUICK2CUT MINI code key", decoder: "tl-quick2cutmini" },
    { id: "tl-swissgrip", label: "SWISSGRIP", settingKey: "codekey.tl.swissgrip", defaultTitle: "SWISSGRIP code key", decoder: "tl-swissgrip" },
    { id: "tl-tanggripiq", label: "TANG-GRIP-IQ", settingKey: "codekey.tl.tanggripiq", defaultTitle: "TANG-GRIP-IQ code key", decoder: "tl-tanggripiq" },
    { id: "tl-modugrip", label: "MODU-GRIP", settingKey: "codekey.tl.modugrip", defaultTitle: "MODU-GRIP code key", decoder: "tl-modugrip" },
    { id: "tl-feedgrip", label: "FEED-GRIP", settingKey: "codekey.tl.feedgrip", defaultTitle: "FEED-GRIP code key", decoder: "tl-feedgrip" },
    { id: "tl-logiqfgrip", label: "LOGIQ-F-GRIP", settingKey: "codekey.tl.logiqfgrip", defaultTitle: "LOGIQ-F-GRIP code key", decoder: "tl-logiqfgrip" },
    { id: "tl-tangfgrip", label: "TANG-F-GRIP", settingKey: "codekey.tl.tangfgrip", defaultTitle: "TANG-F-GRIP code key", decoder: "tl-tangfgrip" },
    { id: "tl-dofgrip", label: "DO-F-GRIP", settingKey: "codekey.tl.dofgrip", defaultTitle: "DO-F-GRIP code key", decoder: "tl-dofgrip" },
    { id: "tl-jetcrown", label: "JET-CROWN", settingKey: "codekey.tl.jetcrown", defaultTitle: "JET-CROWN code key", decoder: "tl-jetcrown" },
    { id: "tl-tang5grip", label: "TANG-5-GRIP", settingKey: "codekey.tl.tang5grip", defaultTitle: "TANG-5-GRIP code key", decoder: "tl-tang5grip" },
  ],
  "grooving": [
    { id: "tl-vlock", label: "V-LOCK", settingKey: "codekey.tl.vlock", defaultTitle: "V-LOCK code key", decoder: "tl-vlock" },
    { id: "tl-formtool", label: "FORM-TOOL", settingKey: "codekey.tl.formtool", defaultTitle: "FORM-TOOL code key", decoder: "tl-formtool" },
    { id: "tl-iscarbroach", label: "ISCAR-BROACH", settingKey: "codekey.tl.iscarbroach", defaultTitle: "ISCAR-BROACH code key", decoder: "tl-iscarbroach" },
    { id: "tl-jetcut", label: "JET-CUT", settingKey: "codekey.tl.jetcut", defaultTitle: "JET-CUT code key", decoder: "tl-jetcut" },
  ],
  "groove-turn": [
    { id: "tl-modulargrip", label: "MODULAR-GRIP", settingKey: "codekey.tl.modulargrip", defaultTitle: "MODULAR-GRIP code key", decoder: "tl-modulargrip" },
    { id: "tl-fixgrip", label: "FIX-GRIP", settingKey: "codekey.tl.fixgrip", defaultTitle: "FIX-GRIP code key", decoder: "tl-fixgrip" },
    { id: "tl-spinjet", label: "SPIN-JET", settingKey: "codekey.tl.spinjet", defaultTitle: "SPIN-JET code key", decoder: "tl-spinjet" },
  ],
  "threading": [
    { id: "tl-iscarthread", label: "ISCAR-THREAD", settingKey: "codekey.tl.iscarthread", defaultTitle: "ISCAR-THREAD code key", decoder: "tl-iscarthread" },
    { id: "tl-minicham", label: "MINI-CHAM", settingKey: "codekey.tl.minicham", defaultTitle: "MINI-CHAM code key", decoder: "tl-minicham" },
    { id: "tl-quickthread", label: "QUICK-THREAD", settingKey: "codekey.tl.quickthread", defaultTitle: "QUICK-THREAD code key", decoder: "tl-quickthread" },
    { id: "tl-notchgrip", label: "NOTCH-GRIP", settingKey: "codekey.tl.notchgrip", defaultTitle: "NOTCH-GRIP code key", decoder: "tl-notchgrip" },
    { id: "tl-decaiqthread", label: "DECA-IQ-THREAD", settingKey: "codekey.tl.decaiqthread", defaultTitle: "DECA-IQ-THREAD code key", decoder: "tl-decaiqthread" },
    { id: "tl-iscartaps", label: "ISCAR-TAPS", settingKey: "codekey.tl.iscartaps", defaultTitle: "ISCAR-TAPS code key", decoder: "tl-iscartaps" },
    { id: "tl-onetap", label: "ONE-TAP", settingKey: "codekey.tl.onetap", defaultTitle: "ONE-TAP code key", decoder: "tl-onetap" },
    { id: "tl-threadqlock", label: "THREAD-Q-LOCK", settingKey: "codekey.tl.threadqlock", defaultTitle: "THREAD-Q-LOCK code key", decoder: "tl-threadqlock" },
  ],
  "turning": [
    { id: "tl-quickturn", label: "QUICK-TURN", settingKey: "codekey.tl.quickturn", defaultTitle: "QUICK-TURN code key", decoder: "tl-quickturn" },
    { id: "tl-quicktlock", label: "QUICK-T-LOCK", settingKey: "codekey.tl.quicktlock", defaultTitle: "QUICK-T-LOCK code key", decoder: "tl-quicktlock" },
    { id: "tl-jetrturn", label: "JET-R-TURN", settingKey: "codekey.tl.jetrturn", defaultTitle: "JET-R-TURN code key", decoder: "tl-jetrturn" },
    { id: "tl-heliturnld", label: "HELI-TURN-LD", settingKey: "codekey.tl.heliturnld", defaultTitle: "HELI-TURN-LD code key", decoder: "tl-heliturnld" },
    { id: "tl-multiwedge", label: "MULTI-WEDGE", settingKey: "codekey.tl.multiwedge", defaultTitle: "MULTI-WEDGE code key", decoder: "tl-multiwedge" },
    { id: "tl-doveiqturn", label: "DOVE-IQ-TURN", settingKey: "codekey.tl.doveiqturn", defaultTitle: "DOVE-IQ-TURN code key", decoder: "tl-doveiqturn" },
    { id: "tl-neoturn", label: "NEO-TURN", settingKey: "codekey.tl.neoturn", defaultTitle: "NEO-TURN code key", decoder: "tl-neoturn" },
    { id: "tl-minipturn", label: "MINI-P-TURN", settingKey: "codekey.tl.minipturn", defaultTitle: "MINI-P-TURN code key", decoder: "tl-minipturn" },
    { id: "tl-alupturn", label: "ALU-P-TURN", settingKey: "codekey.tl.alupturn", defaultTitle: "ALU-P-TURN code key", decoder: "tl-alupturn" },
    { id: "tl-heavysuperturn", label: "HEAVY-SUPER-TURN", settingKey: "codekey.tl.heavysuperturn", defaultTitle: "HEAVY-SUPER-TURN code key", decoder: "tl-heavysuperturn" },
    { id: "tl-heliturn", label: "HELI-TURN", settingKey: "codekey.tl.heliturn", defaultTitle: "HELI-TURN code key", decoder: "tl-heliturn" },
    { id: "tl-logiq4turn", label: "LOGIQ-4-TURN", settingKey: "codekey.tl.logiq4turn", defaultTitle: "LOGIQ-4-TURN code key", decoder: "tl-logiq4turn" },
    { id: "tl-safetlock", label: "SAFE-T-LOCK", settingKey: "codekey.tl.safetlock", defaultTitle: "SAFE-T-LOCK code key", decoder: "tl-safetlock" },
    { id: "tl-isoyturn", label: "ISO-Y-TURN", settingKey: "codekey.tl.isoyturn", defaultTitle: "ISO-Y-TURN code key", decoder: "tl-isoyturn" },
    { id: "tl-whisperline", label: "WHISPERLINE", settingKey: "codekey.tl.whisperline", defaultTitle: "WHISPERLINE code key", decoder: "tl-whisperline" },
    { id: "tl-logiq6turn", label: "LOGIQ-6-TURN", settingKey: "codekey.tl.logiq6turn", defaultTitle: "LOGIQ-6-TURN code key", decoder: "tl-logiq6turn" },
    { id: "tl-feedturn", label: "FEED-TURN", settingKey: "codekey.tl.feedturn", defaultTitle: "FEED-TURN code key", decoder: "tl-feedturn" },
    { id: "tl-chamturn", label: "CHAM-TURN", settingKey: "codekey.tl.chamturn", defaultTitle: "CHAM-TURN code key", decoder: "tl-chamturn" },
    { id: "tl-cermturn", label: "CER-M-TURN", settingKey: "codekey.tl.cermturn", defaultTitle: "CER-M-TURN code key", decoder: "tl-cermturn" },
  ],
  "turning for swiss-type": [
    { id: "tl-neoswiss", label: "NEO-SWISS", settingKey: "codekey.tl.neoswiss", defaultTitle: "NEO-SWISS code key", decoder: "tl-neoswiss" },
    { id: "tl-neoyswiss", label: "NEO-Y-SWISS", settingKey: "codekey.tl.neoyswiss", defaultTitle: "NEO-Y-SWISS code key", decoder: "tl-neoyswiss" },
    { id: "tl-swissturn", label: "SWISS-TURN", settingKey: "codekey.tl.swissturn", defaultTitle: "SWISS-TURN code key", decoder: "tl-swissturn" },
    { id: "tl-quickswiss", label: "QUICK-SWISS", settingKey: "codekey.tl.quickswiss", defaultTitle: "QUICK-SWISS code key", decoder: "tl-quickswiss" },
    { id: "tl-piccojet", label: "PICCO-JET", settingKey: "codekey.tl.piccojet", defaultTitle: "PICCO-JET code key", decoder: "tl-piccojet" },
    { id: "tl-piccocut", label: "PICCO-CUT", settingKey: "codekey.tl.piccocut", defaultTitle: "PICCO-CUT code key", decoder: "tl-piccocut" },
    { id: "tl-piccoindex", label: "PICCO-INDEX", settingKey: "codekey.tl.piccoindex", defaultTitle: "PICCO-INDEX code key", decoder: "tl-piccoindex" },
    { id: "tl-piccomft", label: "PICCO-MFT", settingKey: "codekey.tl.piccomft", defaultTitle: "PICCO-MFT code key", decoder: "tl-piccomft" },
    { id: "tl-picco3cut", label: "PICCO-3-CUT", settingKey: "codekey.tl.picco3cut", defaultTitle: "PICCO-3-CUT code key", decoder: "tl-picco3cut" },
    { id: "tl-piccomf", label: "PICCO-MF", settingKey: "codekey.tl.piccomf", defaultTitle: "PICCO-MF code key", decoder: "tl-piccomf" },
  ],
};

const MORE_TYPES: Record<string, KeyType[]> = { [DEFAULT_TAB.toLowerCase()]: TURNING_INSERTS, parting: PARTING_BRANDS, drilling: DRILLING_BRANDS, milling: MILLING_BRANDS, "endmills(sc) & mm": MILLING_BRANDS, "indexable milling": INDEXABLE_MILLING_BRANDS };
for (const [app, types] of Object.entries(TURNING_CATALOG_BRANDS)) MORE_TYPES[app] = [...(MORE_TYPES[app] ?? []), ...types];
// Applications whose brand keys already cover their tools, so no Tools key.
const NO_TOOLS_KEY = new Set(["parting", "drilling", "milling", "endmills(sc) & mm", "indexable milling"]);

// Each application's general key reads a designation of any of its families
// and names the family. Parting, grooving and groove-turn read each other's
// families, since their tools and inserts overlap.
const GENERAL: KeyType = { id: "general", label: "General", settingKey: "", defaultTitle: "" };
const PARTING_GROUP = ["parting", "grooving", "groove-turn"];
const generalGroup = (name: string) => (PARTING_GROUP.includes(name) ? PARTING_GROUP : [name]);
// Decoders reading any ISO code: they count only when no family reads it.
const GENERIC = new Set<DecoderName>(["iso-turning", "iso-insert"]);

function ownKeyTypes(app: { id: string; name: string }): KeyType[] {
  // The tools key keeps its decoder in its own data (e.g. "iso-turning").
  const name = app.name.trim().toLowerCase();
  const tools: KeyType = { id: "tools", label: "Tools", settingKey: `codekey.app.${app.id}`, defaultTitle: `${app.name} code key` };
  return [...(NO_TOOLS_KEY.has(name) ? [] : [tools]), ...(MORE_TYPES[name] ?? [])];
}

// The key types with a decoder (the Turning tools key: ISO toolholders).
function decoding(app: { id: string; name: string }) {
  const turning = app.name.trim().toLowerCase() === DEFAULT_TAB.toLowerCase();
  return ownKeyTypes(app)
    .map((t) => (t.id === "tools" && turning ? { ...t, label: "ISO toolholders", decoder: "iso-turning" as DecoderName } : t))
    .filter((t) => t.decoder);
}

// The families a general key reads, with the application each belongs to.
function generalFamilies(applications: Application[], name: string) {
  return generalGroup(name).flatMap((n) => {
    const app = applications.find((a) => a.name.trim().toLowerCase() === n);
    return decoding(app ?? { id: "", name: n }).map((type) => ({ app, appName: app?.name ?? n, type }));
  });
}

function keyTypes(app: Application, applications: Application[] = []): KeyType[] {
  const general = generalFamilies(applications.length ? applications : [app], app.name.trim().toLowerCase()).length > 1;
  return [...(general ? [GENERAL] : []), ...ownKeyTypes(app)];
}

// Every key with a decoder, for the designation search (the Turning tools
// key's decoder is in its data: ISO toolholders).
function searchable(applications: Application[]) {
  return applications.flatMap((app) => decoding(app).map((type) => ({ app, type })));
}

const norm = (s: string) => s.toUpperCase().replace(/[^A-Z0-9]/g, "");

// Solutions uses listing a designation's insert family: the family name before
// its first "-" or "(" (each of "A/B" alternatives) starts the designation,
// e.g. TAG N3C in "TAG N-C/W/M", DGN 3102J in "DGN/DGNM-J/JS/JT".
function familyKeys(insert: string) {
  const head = insert.split(/[-(]/)[0];
  const parts = head.split("/").map((p) => p.trim());
  // "DGR/L" means DGR or DGL; "PENTA 24R/L" means PENTA 24R or PENTA 24L.
  const keys = parts.map((p, i) => (i > 0 && p.length <= 2 && parts[0].length > p.length ? parts[0].slice(0, parts[0].length - p.length) + p : p));
  return keys.map(norm).filter((k) => k.length >= 3);
}

// The chipformers an insert family lists after its first "-" (e.g. TAG N-C/W/M
// -> C, W, M; DGN-J/JS-D -> J, JS, D); none when it lists none.
function familyChips(insert: string) {
  const dash = insert.indexOf("-");
  if (dash < 0) return [];
  return insert
    .slice(dash + 1)
    .split(/[/\-\s(]/)
    .map((t) => t.trim().toUpperCase())
    .filter((t) => /^[A-Z]{1,4}$/.test(t));
}

type Brand = { id: string; name: string; uses?: (InnovationUse & { category?: string | null })[] };

// A family's Solution, matched by name (TANG-GRIP, TANG GRIP and TANGGRIP alike).
function solutionOf(brands: Brand[], family: string) {
  const key = norm(family);
  return brands.find((b) => norm(b.name) === key);
}

function SolutionLink({ brand }: { brand?: Brand }) {
  if (!brand) return null;
  return (
    <Link to={`/solutions/brand/${brand.id}`} className="text-xs font-medium whitespace-nowrap text-blue-600 hover:underline dark:text-blue-400" data-family-solution={brand.name}>
      {brand.name} Solution →
    </Link>
  );
}

function read(key: string) {
  try {
    return localStorage.getItem(key);
  } catch {
    return null;
  }
}

function remember(key: string, value: string) {
  try {
    localStorage.setItem(key, value);
  } catch {
    // just not remembered
  }
}

export function CodeKeys() {
  const { data: applications } = useResource<Application>("/applications");
  const [chosen, setChosen] = useState<string | null>(() => read(LAST_TAB_KEY));
  const [chosenType, setChosenType] = useState<string | null>(() => read(LAST_TYPE_KEY));
  const tab = applications.find((a) => a.id === chosen) ?? applications.find((a) => a.name.toLowerCase() === DEFAULT_TAB.toLowerCase()) ?? applications[0];
  const types = tab ? keyTypes(tab, applications) : [];
  const type = types.find((t) => t.id === chosenType) ?? types[0];
  // The designation search, and the designation picked from it for the open key.
  const [query, setQuery] = useState("");
  const [picked, setPicked] = useState<string | undefined>();
  const { data: brands } = useResource<Brand>("/innovations");

  const q = query.trim();
  const matched = q.length >= 3 ? searchable(applications).flatMap(({ app, type: t }) => {
    const r = DECODERS[t.decoder!].decode(q);
    return r ? [{ app, type: t, result: r }] : [];
  }) : [];
  // The ISO toolholder key reads almost any letters-and-digits code, so it only
  // counts when no brand family's key recognizes the designation.
  const decoded = matched.some((d) => d.type.decoder !== "iso-turning") ? matched.filter((d) => d.type.decoder !== "iso-turning") : matched;
  const nq = norm(q);
  // The designation's chipformer as decoded (e.g. J, or JS with sharp corners).
  const chips = new Set(
    decoded.flatMap(({ result }) => {
      const chip = result.parts.find((p) => p.key?.endsWith("chip"))?.code;
      const sharp = result.parts.some((p) => p.key?.endsWith("sharp"));
      return chip && /^[A-Z]+$/.test(chip) ? [chip, ...(sharp ? [`${chip}S`] : [])] : [];
    })
  );
  const uses = q.length >= 3 ? brands.flatMap((b) =>
    (b.uses ?? []).flatMap((u) =>
      u.inserts
        .filter((i) => {
          if (!familyKeys(i.name).some((k) => nq.startsWith(k))) return false;
          // A family listing its chipformers must list the designation's.
          const listed = familyChips(i.name);
          return chips.size === 0 || listed.length === 0 || listed.some((c) => chips.has(c));
        })
        .map((i) => ({ brand: b, use: u, insert: i }))
    )
  ) : [];

  function open(appId: string, typeId: string) {
    setChosen(appId);
    remember(LAST_TAB_KEY, appId);
    setChosenType(typeId);
    remember(LAST_TYPE_KEY, typeId);
    setPicked(q);
  }

  return (
    <div>
      <PageHeader title="Code keys" />
      {/* Which family an insert or tool belongs to: every key's decoder, and the Solutions uses listing it. */}
      <section className="mb-5 rounded-xl border border-neutral-200 bg-white p-3 dark:border-neutral-800 dark:bg-neutral-900" data-designation-search>
        <Input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Find any insert or tool designation, e.g. TAG N3C, DGN 3102J, GIP 3.00E-0.40, PCLNR 2525M-12, WNMG 080408"
          aria-label="Find a designation"
          className="font-mono"
        />
        {q.length >= 3 && (
          <div className="mt-3 space-y-3 text-sm">
            {decoded.length === 0 && uses.length === 0 && <p className="text-neutral-500 dark:text-neutral-400">No code key or solution reads this designation.</p>}
            {decoded.length > 0 && (
              <div>
                <p className="mb-1 text-xs font-semibold tracking-wide text-neutral-500 uppercase dark:text-neutral-400">Code keys</p>
                <ul className="space-y-1">
                  {decoded.map(({ app, type: t, result }) => (
                    <li key={`${app.id}:${t.id}`} data-search-key={t.id} className="flex items-center gap-3">
                      <button
                        type="button"
                        onClick={() => open(app.id, t.id)}
                        className="min-w-0 flex-1 rounded-lg border border-neutral-200 px-3 py-1.5 text-left hover:border-blue-400 hover:bg-blue-50 dark:border-neutral-700 dark:hover:bg-blue-950/30"
                      >
                        <span className="font-semibold text-blue-700 dark:text-blue-300">
                          {app.name} → {t.label}
                        </span>{" "}
                        <span className="text-neutral-500 dark:text-neutral-400">· {result.kind}</span>
                        <span className="ml-2 font-mono text-xs text-neutral-600 dark:text-neutral-300">{result.parts.map((p) => p.code).join(" · ")}</span>
                      </button>
                      {!GENERIC.has(t.decoder!) && <SolutionLink brand={solutionOf(brands, t.label)} />}
                    </li>
                  ))}
                </ul>
              </div>
            )}
            {uses.length > 0 && (
              <div>
                <p className="mb-1 text-xs font-semibold tracking-wide text-neutral-500 uppercase dark:text-neutral-400">Solutions</p>
                <ul className="space-y-1">
                  {uses.map(({ brand, use, insert }, n) => (
                    <li key={n} className="rounded-lg border border-neutral-200 px-3 py-1.5 dark:border-neutral-700" data-search-use={brand.name}>
                      <Link
                        to={`/solutions/brand/${brand.id}${use.category ? `?category=${encodeURIComponent(use.category)}` : ""}`}
                        className="font-semibold text-blue-700 hover:underline dark:text-blue-300"
                      >
                        {brand.name}
                        {use.category ? ` · ${use.category}` : ""}
                      </Link>{" "}
                      <span className="text-neutral-600 dark:text-neutral-300">– {use.name}: </span>
                      {insert.link ? (
                        <a href={insert.link} target="_blank" rel="noreferrer" className="font-medium hover:underline" title="Open in the e-catalog">
                          {insert.name} ↗
                        </a>
                      ) : (
                        <span className="font-medium">{insert.name}</span>
                      )}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}
      </section>
      <Tabs
        label="Applications"
        items={applications.map((a) => ({ id: a.id, label: a.name }))}
        active={tab?.id}
        onChoose={(id) => {
          setChosen(id);
          remember(LAST_TAB_KEY, id);
        }}
      />
      {types.length > 1 && (
        <Tabs
          label="Code key types"
          small
          items={types}
          active={type?.id}
          onChoose={(id) => {
            setChosenType(id);
            remember(LAST_TYPE_KEY, id);
          }}
        />
      )}
      {type?.id === "general" && tab && <GeneralKey key={tab.id} app={tab} applications={applications} brands={brands} onOpen={(appId, typeId, text) => { open(appId, typeId); setPicked(text); }} />}
      {type && type.id !== "general" && (
        <CodeKey
          key={`${type.settingKey}:${picked ?? ""}`}
          settingKey={type.settingKey}
          defaultTitle={type.defaultTitle}
          decoder={type.decoder}
          decodeText={picked}
          defaultOpen
        />
      )}
    </div>
  );
}

function Tabs({ label, items, active, onChoose, small }: { label: string; items: { id: string; label: string }[]; active?: string; onChoose: (id: string) => void; small?: boolean }) {
  return (
    <div role="tablist" aria-label={label} className="mb-4 flex flex-wrap gap-2">
      {items.map((t) => (
        <button
          key={t.id}
          type="button"
          role="tab"
          aria-selected={t.id === active}
          onClick={() => onChoose(t.id)}
          className={`rounded-lg border font-medium ${small ? "px-3 py-1 text-xs" : "px-4 py-2 text-sm"} ${
            // Applications are blue; families (code key types) are emerald.
            t.id === active
              ? small
                ? "border-emerald-600 bg-emerald-600 text-white"
                : "border-blue-600 bg-blue-600 text-white"
              : small
                ? "border-emerald-300 text-emerald-800 hover:bg-emerald-50 dark:border-emerald-800 dark:text-emerald-300 dark:hover:bg-emerald-950/40"
                : "border-neutral-300 text-neutral-700 hover:bg-neutral-100 dark:border-neutral-700 dark:text-neutral-300 dark:hover:bg-neutral-800"
          }`}
        >
          {t.label}
        </button>
      ))}
    </div>
  );
}

// Type a parting, grooving or groove-turn designation (an insert or a tool,
// with or without its grade) to see its family and each part's meaning.
function GeneralKey({ app, applications, brands, onOpen }: { app: Application; applications: Application[]; brands: Brand[]; onOpen: (appId: string, typeId: string, text: string) => void }) {
  const [text, setText] = useState("");
  const name = app.name.trim().toLowerCase();
  const parting = PARTING_GROUP.includes(name);
  const families = generalFamilies(applications, name);
  const examples = families
    .filter((f) => !GENERIC.has(f.type.decoder!))
    .slice(0, 5)
    .map((f) => DECODERS[f.type.decoder!].examples.split(/ or |, /)[0]);
  const q = text.trim();
  // A trailing ISCAR grade (e.g. IC908, IB85, ID5) is read apart from the designation.
  const graded = q.match(/^(.+?)\s+(I[A-Z]\d{1,4}[A-Z]?)$/i);
  const designation = graded ? graded[1] : q;
  const grade = graded?.[2].toUpperCase();
  const read = designation.length >= 3
    ? families.flatMap((f) => {
        const result = DECODERS[f.type.decoder!].decode(designation);
        if (!result) return [];
        return [{ ...f, result: grade ? { ...result, parts: [...result.parts, { title: "Grade", code: grade, text: `ISCAR grade ${grade}` }] } : result }];
      })
    : [];
  // A generic ISO reading counts only when no family reads the designation.
  const matches = read.some((m) => !GENERIC.has(m.type.decoder!)) ? read.filter((m) => !GENERIC.has(m.type.decoder!)) : read;
  return (
    <div className="rounded-xl border border-neutral-200 bg-white p-4 dark:border-neutral-800 dark:bg-neutral-900" data-general-key>
      <h2 className="mb-1 font-semibold text-neutral-900 dark:text-neutral-100">{parting ? "Parting & grooving" : app.name} code key</h2>
      <p className="mb-3 text-sm text-neutral-500 dark:text-neutral-400">Type an insert or tool designation of any family to see its family and what each part means.</p>
      <Input
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder={`e.g. ${examples.join(", ")}`}
        aria-label="Designation to classify"
        className="max-w-2xl font-mono"
        autoFocus
      />
      {q.length >= 3 && matches.length === 0 && (
        <p className="mt-3 text-sm text-red-600 dark:text-red-400">No {parting ? "parting or grooving" : app.name} family reads this designation.</p>
      )}
      {matches.length > 1 && <p className="mt-3 text-sm text-amber-700 dark:text-amber-400">{matches.length} families read this designation: {matches.map((m) => m.type.label).join(" · ")}</p>}
      <div className="mt-3 space-y-3">
        {matches.map((m) => (
          <GeneralMatch
            key={m.type.id}
            family={m.type.label}
            solution={GENERIC.has(m.type.decoder!) ? undefined : solutionOf(brands, m.type.label)}
            appName={m.appName}
            settingKey={m.type.settingKey}
            result={m.result}
            onOpen={m.app ? () => onOpen(m.app!.id, m.type.id, designation) : undefined}
          />
        ))}
      </div>
      <details className="mt-4 text-xs text-neutral-500 dark:text-neutral-400">
        <summary className="cursor-pointer">Families read here ({families.length})</summary>
        <p className="mt-1">{families.map((f) => f.type.label).join(" · ")}</p>
      </details>
    </div>
  );
}

function GeneralMatch({ family, solution, appName, settingKey, result, onOpen }: { family: string; solution?: Brand; appName: string; settingKey: string; result: Decoded; onOpen?: () => void }) {
  const data = useCodeKeyData(settingKey);
  return (
    <div className="rounded-lg border border-emerald-200 bg-emerald-50/50 p-3 dark:border-emerald-900 dark:bg-emerald-950/20" data-general-match={family}>
      <div className="mb-2 flex flex-wrap items-center gap-2">
        {solution ? (
          <Link to={`/solutions/brand/${solution.id}`} title={`Open the ${solution.name} Solution`} className="rounded-md bg-emerald-600 px-2.5 py-0.5 text-sm font-bold text-white hover:bg-emerald-700" data-family-solution={solution.name}>
            {family} ↗
          </Link>
        ) : (
          <span className="rounded-md bg-emerald-600 px-2.5 py-0.5 text-sm font-bold text-white">{family}</span>
        )}
        <span className="text-sm text-neutral-700 dark:text-neutral-200">{result.kind === "Tool" ? `${family} tool` : result.kind}</span>
        <span className="text-xs text-neutral-500 dark:text-neutral-400">· {appName}</span>
        {onOpen && (
          <button type="button" onClick={onOpen} className="ml-auto text-xs font-medium text-blue-600 hover:underline dark:text-blue-400">
            Open the {family} key →
          </button>
        )}
      </div>
      <DecodedTable data={data} result={result} />
    </div>
  );
}

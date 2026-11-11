import type { Iso513Group } from "./types";

// Specific cutting force by material group: kc1.1 (N/mm², at a 1 mm chip and
// 0° rake) and its curve slope mc. Numbered as the groups are in the catalog.
export type KcMaterial = { id: string; group: Iso513Group; name: string; kc1: number; mc: number };

const row = (id: string, group: Iso513Group, name: string, kc1: number, mc: number): KcMaterial => ({ id, group, name: `${id.split("-")[0]} - ${name}`, kc1, mc });

export const KC_MATERIALS: KcMaterial[] = [
  row("01", "P", "Non-alloyed steel, about 0.15% C, annealed", 1350, 0.21),
  row("02", "P", "Non-alloyed steel, about 0.45% C, annealed", 1500, 0.22),
  row("03", "P", "Non-alloyed steel, about 0.45% C, annealed", 1675, 0.24),
  row("04", "P", "Non-alloyed steel, about 0.75% C, annealed", 1700, 0.24),
  row("05", "P", "Non-alloyed steel, about 0.75% C, quenched & tempered", 1900, 0.24),
  row("06", "P", "Low-alloyed steel, annealed", 1775, 0.24),
  row("07", "P", "Low-alloyed steel, quenched & tempered", 1675, 0.24),
  row("08", "P", "Low-alloyed steel, quenched & tempered", 1725, 0.24),
  row("09", "P", "Low-alloyed steel, quenched & tempered", 1800, 0.24),
  row("10", "P", "High-alloyed steel, tool steel, annealed", 2450, 0.23),
  row("11", "P", "High-alloyed steel, tool steel, quenched & tempered", 2500, 0.23),
  row("12", "P", "Stainless steel, ferritic/martensitic, annealed", 1875, 0.21),
  row("13", "P", "Stainless steel, martensitic, quenched & tempered", 1875, 0.21),
  row("14", "M", "Stainless steel, austenitic", 2150, 0.2),
  row("14-duplex", "M", "Stainless steel, duplex", 2150, 0.2),
  row("14-ph", "M", "Stainless steel, precipitation hardening", 2150, 0.2),
  row("15", "K", "Grey cast iron, pearlitic/ferritic", 1150, 0.2),
  row("16", "K", "Grey cast iron, pearlitic (martensitic)", 1350, 0.28),
  row("17", "K", "Nodular cast iron, ferritic", 1225, 0.25),
  row("18", "K", "Nodular cast iron, pearlitic", 1350, 0.28),
  row("19", "K", "Malleable cast iron, ferritic", 1225, 0.25),
  row("20", "K", "Malleable cast iron, pearlitic", 1420, 0.3),
  row("21", "N", "Aluminium, wrought, alloyed, not curable", 700, 0.25),
  row("22", "N", "Aluminium, wrought, alloyed, curable, hardened", 800, 0.25),
  row("23", "N", "Aluminium, cast, alloyed ≤12% Si, not curable", 700, 0.25),
  row("24", "N", "Aluminium, cast, alloyed ≤12% Si, curable, hardened", 700, 0.25),
  row("25", "N", "Aluminium, alloyed >12% Si & Li alloys", 750, 0.25),
  row("26", "N", "Copper & Cu alloys, cutting alloys, >1% Pb", 700, 0.27),
  row("27", "N", "Copper & Cu alloys, CuZn, CuSnZn (brass)", 700, 0.27),
  row("28", "N", "Copper & Cu alloys, CuSn, lead-free & electrolytic copper", 700, 0.27),
  row("31", "S", "Heat resistant super alloys, Fe based, annealed", 2600, 0.24),
  row("32", "S", "Heat resistant super alloys, Fe based, aged", 3100, 0.24),
  row("33", "S", "Heat resistant super alloys, Ni or Co based, annealed", 3300, 0.24),
  row("34", "S", "Heat resistant super alloys, Ni or Co based, aged", 3300, 0.24),
  row("35", "S", "Heat resistant super alloys, Ni or Co based, cast", 3300, 0.24),
  row("36", "S", "Titanium alloys, pure titanium", 1700, 0.23),
  row("37", "S", "Titanium alloys, alpha + beta alloys, hardened", 2110, 0.22),
  row("38", "H", "Hardened steel", 4600, 0.1),
  row("39", "H", "Hardened steel", 4700, 0.1),
  row("40", "H", "Chilled cast iron", 4600, 0.08),
  row("41", "H", "Hardened cast iron", 4500, 0.08),
];

export const DEFAULT_KC_MATERIAL = KC_MATERIALS.find((m) => m.id === "06")!;

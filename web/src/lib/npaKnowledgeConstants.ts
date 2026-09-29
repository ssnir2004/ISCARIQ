import type { Iso513Group, NpaApplicationCategory, NpaAvailability } from "./types";

export const APPLICATION_CATEGORIES: { value: NpaApplicationCategory; label: string }[] = [
  { value: "MILLING", label: "Milling" },
  { value: "TURNING", label: "Turning" },
  { value: "GROOVING", label: "Grooving" },
  { value: "PARTING", label: "Parting" },
  { value: "DRILLING", label: "Drilling" },
  { value: "THREADING", label: "Threading" },
  { value: "REAMING", label: "Reaming" },
  { value: "BORING", label: "Boring" },
  { value: "OTHER", label: "Other" },
];

// Standard ISO 513 color coding for workpiece material groups.
export const ISO513_COLORS: Record<Iso513Group, string> = {
  P: "#00AEEF",
  M: "#FFE600",
  K: "#EE4035",
  N: "#00A859",
  S: "#F58A4B",
  H: "#BFBFBF",
};

export const ISO513_GROUPS: { value: Iso513Group; label: string; color: string }[] = [
  { value: "P", label: "P — Steel", color: ISO513_COLORS.P },
  { value: "M", label: "M — Stainless Steel", color: ISO513_COLORS.M },
  { value: "K", label: "K — Cast Iron", color: ISO513_COLORS.K },
  { value: "N", label: "N — Non-Ferrous", color: ISO513_COLORS.N },
  { value: "S", label: "S — Superalloys / Titanium", color: ISO513_COLORS.S },
  { value: "H", label: "H — Hardened Materials", color: ISO513_COLORS.H },
];

export const AVAILABILITIES: { value: NpaAvailability; label: string }[] = [
  { value: "IN_STOCK", label: "In stock" },
  { value: "COMING_SOON", label: "Coming soon" },
  { value: "ASK_PRICING", label: "Ask pricing department" },
  { value: "NOT_SPECIFIED", label: "Not specified" },
];

export const SUB_APPLICATION_SUGGESTIONS = [
  "Shoulder milling",
  "Face milling",
  "Slotting",
  "Roughing",
  "Finishing",
  "Long reach machining",
  "Thin wall machining",
  "Unstable setup",
  "High feed",
  "General",
];

export const ADVANTAGE_SUGGESTIONS = [
  "Better chip evacuation",
  "Lower cutting forces",
  "Higher productivity",
  "Improved surface finish",
  "Better stability",
  "Longer tool life",
];

export const CONDITION_SUGGESTIONS = [
  "Long overhang",
  "Thin wall",
  "Poor workholding",
  "High RPM",
  "Rough machining",
  "Chip control issue",
  "Productivity improvement",
  "Surface finish improvement",
  "Heat reduction",
];

export function applicationLabel(value: NpaApplicationCategory) {
  return APPLICATION_CATEGORIES.find((c) => c.value === value)?.label ?? value;
}

export function iso513Label(value: Iso513Group) {
  return ISO513_GROUPS.find((g) => g.value === value)?.label ?? value;
}

export function availabilityLabel(value: NpaAvailability) {
  return AVAILABILITIES.find((a) => a.value === value)?.label ?? value;
}

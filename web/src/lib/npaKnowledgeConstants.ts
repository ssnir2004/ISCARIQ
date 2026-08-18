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

export const ISO513_GROUPS: { value: Iso513Group; label: string }[] = [
  { value: "P", label: "P — Steel" },
  { value: "M", label: "M — Stainless Steel" },
  { value: "K", label: "K — Cast Iron" },
  { value: "N", label: "N — Non-Ferrous" },
  { value: "S", label: "S — Superalloys / Titanium" },
  { value: "H", label: "H — Hardened Materials" },
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

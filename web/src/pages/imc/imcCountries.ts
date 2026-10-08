import countries from "i18n-iso-countries";
import en from "i18n-iso-countries/langs/en.json";

countries.registerLocale(en);

// What the IMC views need of a company.
export type ImcCompanyLite = { id: string; name: string; country?: string | null; logo?: string | null; imcSince?: number | null };

// "Korea, India" -> ["Korea", "India"] (comma, semicolon or slash).
export function splitCountries(value: string | null | undefined) {
  return (value ?? "")
    .split(/[,;/]/)
    .map((s) => s.trim())
    .filter(Boolean);
}

// Common short or informal names the ISO list doesn't know.
const ALIASES: Record<string, string> = {
  korea: "KR",
  "south korea": "KR",
  usa: "US",
  "u.s.a.": "US",
  "u.s.": "US",
  us: "US",
  america: "US",
  "united states of america": "US",
  uk: "GB",
  "u.k.": "GB",
  england: "GB",
  britain: "GB",
  "great britain": "GB",
  "united kingdom": "GB",
  russia: "RU",
  czechia: "CZ",
  "czech republic": "CZ",
  holland: "NL",
  "the netherlands": "NL",
  taiwan: "TW",
  vietnam: "VN",
  turkey: "TR",
  turkiye: "TR",
  uae: "AE",
  "hong kong": "HK",
};

// ISO alpha-2 code for a country name ("Israel", "Korea", "IL"), or null.
export function countryCode(name: string): string | null {
  const key = name.trim().toLowerCase();
  if (!key) return null;
  if (ALIASES[key]) return ALIASES[key];
  const code = countries.getAlpha2Code(name.trim(), "en");
  if (code) return code;
  const upper = name.trim().toUpperCase();
  return upper.length === 2 && countries.isValid(upper) ? upper : null;
}

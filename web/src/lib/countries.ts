import countries from "i18n-iso-countries";
import en from "i18n-iso-countries/langs/en.json";
import type { Plant } from "./types";

countries.registerLocale(en);

// Country name for an ISO alpha-2 code ("DE" -> "Germany"): the official
// name unless it is long or formal ("People's Republic of China"), then
// the common one ("China").
export function countryName(code: string | null | undefined) {
  if (!code) return "";
  const official = countries.getName(code, "en", { select: "official" });
  if (!official) return code;
  if (official.length <= 20 && !official.includes(",")) return official;
  return countries.getName(code, "en", { select: "alias" }) ?? official;
}

// Every country, by name, for pickers.
export const COUNTRY_OPTIONS: { code: string; name: string }[] = Object.keys(countries.getAlpha2Codes())
  .map((code) => ({ code, name: countryName(code) }))
  .sort((a, b) => a.name.localeCompare(b.name));

// The country of a Schaeffler plant: plants on the Germany map carry a
// German state code, the others an ISO country code.
export function plantCountry(plant: Pick<Plant, "mapView" | "regionCode">) {
  return plant.mapView === "GERMANY" ? "DE" : (plant.regionCode ?? "").toUpperCase();
}

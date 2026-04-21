import { headers } from "next/headers";

export type GeoRegion = "sea" | "south_asia" | "africa" | "europe" | "global";

const SEA = new Set(["MY", "ID", "PH", "TH", "VN", "SG", "MM", "KH", "LA", "BN", "TL"]);
const SOUTH_ASIA = new Set(["IN", "PK", "BD", "LK", "NP", "AF", "MV", "BT"]);
const AFRICA = new Set([
  "ZA", "NG", "KE", "ET", "GH", "TZ", "UG", "ZM", "ZW", "RW", "MZ", "CM",
  "CI", "SN", "MG", "AO", "TN", "MA", "DZ", "EG", "SD", "CD", "ML", "NE",
]);
const EUROPE = new Set([
  "NL", "DE", "FR", "BE", "AT", "CH", "SE", "NO", "DK", "FI", "PL", "CZ",
  "HU", "RO", "SK", "HR", "SI", "PT", "ES", "IT", "GR", "IE", "LU", "LT",
  "LV", "EE", "BG", "RS", "BA",
]);

export type GeoInfo = {
  country: string;
  region: GeoRegion;
  regionLabel: string;
  hasRegionalPricing: boolean;
};

export async function getGeoInfo(): Promise<GeoInfo> {
  const h = await headers();
  const country = h.get("x-vercel-ip-country") ?? "";

  let region: GeoRegion = "global";
  let regionLabel = "Global";
  let hasRegionalPricing = false;

  if (SEA.has(country)) {
    region = "sea";
    regionLabel = "Southeast Asia";
    hasRegionalPricing = true;
  } else if (SOUTH_ASIA.has(country)) {
    region = "south_asia";
    regionLabel = "South Asia";
    hasRegionalPricing = true;
  } else if (AFRICA.has(country)) {
    region = "africa";
    regionLabel = "Africa";
    hasRegionalPricing = true;
  } else if (EUROPE.has(country)) {
    region = "europe";
    regionLabel = "Europe";
    hasRegionalPricing = false;
  }

  return { country, region, regionLabel, hasRegionalPricing };
}

const COUNTRY_NAMES: Record<string, string> = {
  MY: "Malaysia", ID: "Indonesia", PH: "Philippines", TH: "Thailand",
  VN: "Vietnam", SG: "Singapore", MM: "Myanmar", KH: "Cambodia",
  IN: "India", PK: "Pakistan", BD: "Bangladesh", LK: "Sri Lanka",
  NG: "Nigeria", KE: "Kenya", ZA: "South Africa", GH: "Ghana",
  NL: "Netherlands", DE: "Germany", FR: "France", BE: "Belgium",
  AU: "Australia", NZ: "New Zealand", CA: "Canada", GB: "United Kingdom",
  US: "United States",
};

export function countryName(code: string): string {
  return COUNTRY_NAMES[code] ?? code;
}

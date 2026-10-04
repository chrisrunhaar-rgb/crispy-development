// Multi-currency prices for the one-time, permanent-access model.
// Set by Chris 2026-10-04 (Telegram 17695 for Personal/seat, 17716-17717 for
// coaching-minute packs: 10% off 3 hours, 30% off 5 hours). Prices include VAT.
// Client-safe: no server imports here. Server-side resolution lives in
// lib/pricing-server.ts.

export type Currency = "usd" | "eur" | "sgd" | "idr" | "myr" | "thb" | "inr";
export type MinutePackId = "1hr" | "3hr" | "5hr";

export const CURRENCIES: Currency[] = ["usd", "eur", "sgd", "idr", "myr", "thb", "inr"];

type PriceRow = {
  personal: number;
  seat: number;
  minutes: Record<MinutePackId, number>;
};

// Whole units of each currency (dollars, euros, rupiah...), not cents.
export const PRICES: Record<Currency, PriceRow> = {
  usd: { personal: 15, seat: 20, minutes: { "1hr": 10, "3hr": 27, "5hr": 35 } },
  eur: { personal: 14, seat: 18, minutes: { "1hr": 9, "3hr": 24, "5hr": 32 } },
  sgd: { personal: 20, seat: 25, minutes: { "1hr": 13, "3hr": 35, "5hr": 46 } },
  idr: { personal: 200000, seat: 250000, minutes: { "1hr": 130000, "3hr": 350000, "5hr": 450000 } },
  myr: { personal: 50, seat: 65, minutes: { "1hr": 35, "3hr": 95, "5hr": 120 } },
  thb: { personal: 400, seat: 500, minutes: { "1hr": 250, "3hr": 675, "5hr": 875 } },
  inr: { personal: 800, seat: 1000, minutes: { "1hr": 500, "3hr": 1350, "5hr": 1750 } },
};

// EU member states pay in euros, including the non-euro ones.
const EU = new Set([
  "AT", "BE", "BG", "HR", "CY", "CZ", "DK", "EE", "FI", "FR", "DE", "GR", "HU", "IE",
  "IT", "LV", "LT", "LU", "MT", "NL", "PL", "PT", "RO", "SK", "SI", "ES", "SE",
]);

const COUNTRY_CURRENCY: Record<string, Currency> = {
  SG: "sgd", ID: "idr", MY: "myr", TH: "thb", IN: "inr",
};

/** Currency for a visitor's IP country. Anything not listed pays in USD. */
export function currencyForCountry(country: string | null | undefined): Currency {
  const c = (country ?? "").toUpperCase();
  if (EU.has(c)) return "eur";
  return COUNTRY_CURRENCY[c] ?? "usd";
}

export function isCurrency(v: unknown): v is Currency {
  return typeof v === "string" && (CURRENCIES as string[]).includes(v);
}

/** Stripe amount in the smallest unit. All seven are two-decimal in Stripe, IDR included. */
export function toStripeAmount(amount: number): number {
  return Math.round(amount * 100);
}

function group(n: number, sep: string): string {
  return Math.round(n).toString().replace(/\B(?=(\d{3})+(?!\d))/g, sep);
}

/** "$15", "€14", "S$20", "Rp 200.000", "RM50", "฿400", "₹1,000". */
export function formatPrice(currency: Currency, amount: number): string {
  switch (currency) {
    case "usd": return `$${group(amount, ",")}`;
    case "eur": return `€${group(amount, ".")}`;
    case "sgd": return `S$${group(amount, ",")}`;
    case "idr": return `Rp ${group(amount, ".")}`;
    case "myr": return `RM${group(amount, ",")}`;
    case "thb": return `฿${group(amount, ",")}`;
    case "inr": return `₹${group(amount, ",")}`;
  }
}

/**
 * Fill price placeholders in copy: {personal}, {seat}, {diff} (seat minus
 * personal), {1hr}, {3hr}, {5hr}, and {team:N} for N seats.
 */
export function fillPrices(text: string, currency: Currency): string {
  const p = PRICES[currency];
  const f = (n: number) => formatPrice(currency, n);
  return text
    .replace(/\{team:(\d+)\}/g, (_, n) => f(p.seat * Number(n)))
    .replace(/\{personal\}/g, f(p.personal))
    .replace(/\{seat\}/g, f(p.seat))
    .replace(/\{diff\}/g, f(p.seat - p.personal))
    .replace(/\{(1hr|3hr|5hr)\}/g, (_, k: MinutePackId) => f(p.minutes[k]));
}

/** Display strings for one currency, handy to pass to client components. */
export function priceLabels(currency: Currency) {
  const p = PRICES[currency];
  const f = (n: number) => formatPrice(currency, n);
  return {
    currency,
    personal: f(p.personal),
    seat: f(p.seat),
    upgradeSeat: f(p.seat - p.personal),
    minutes: { "1hr": f(p.minutes["1hr"]), "3hr": f(p.minutes["3hr"]), "5hr": f(p.minutes["5hr"]) },
    team: (people: number) => f(p.seat * people),
  };
}

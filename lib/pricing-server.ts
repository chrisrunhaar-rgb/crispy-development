import { headers } from "next/headers";
import { createAdminClient } from "@/lib/supabase/admin";
import { currencyForCountry, isCurrency, type Currency } from "@/lib/pricing";

/**
 * Which currency this person pays in.
 * 1. Locked currency: memberships.currency is set by the Stripe webhook on
 *    their first paid purchase. Every later purchase follows it (Chris,
 *    Telegram 17711). Null means "not locked yet".
 * 2. Otherwise the visitor's IP country (x-vercel-ip-country).
 * 3. Otherwise USD.
 */
export async function resolveCurrency(userId?: string | null): Promise<Currency> {
  if (userId) {
    const locked = await getLockedCurrency(userId);
    if (locked) return locked;
  }
  const h = await headers();
  return currencyForCountry(h.get("x-vercel-ip-country"));
}

export async function getLockedCurrency(userId: string): Promise<Currency | null> {
  const admin = createAdminClient();
  const { data } = await admin
    .from("memberships")
    .select("currency")
    .eq("user_id", userId)
    .maybeSingle();
  return isCurrency(data?.currency) ? data.currency : null;
}

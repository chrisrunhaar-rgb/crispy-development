import PricingContent from "./PricingContent";
import { createClient } from "@/lib/supabase/server";
import { resolveCurrency } from "@/lib/pricing-server";

export const metadata = {
  title: "Pricing — Crispy Leaders",
  description:
    "Monthly or annual access to all Crispy Leaders resources, pathways, and AI coaching.",
};

export default async function PricingPage() {
  // Same currency the checkout will charge: a signed-in buyer's locked
  // currency first, otherwise the visitor's IP country, otherwise USD.
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  return <PricingContent currency={await resolveCurrency(user?.id)} />;
}

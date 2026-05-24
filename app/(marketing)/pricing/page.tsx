import { headers } from "next/headers";
import PricingContent from "./PricingContent";

export const metadata = {
  title: "Pricing — Crispy Leaders",
  description:
    "One payment, lifetime access to all Crispy Leaders resources, pathways, and AI coaching.",
};

export default async function PricingPage() {
  const h = await headers();
  const country = h.get("x-vercel-ip-country") ?? "";
  const isIndonesia = country === "ID";

  return <PricingContent isIndonesia={isIndonesia} />;
}

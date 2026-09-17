import PricingContent from "./PricingContent";

export const metadata = {
  title: "Pricing — Crispy Leaders",
  description:
    "Monthly or annual access to all Crispy Leaders resources, pathways, and AI coaching.",
};

export default async function PricingPage() {
  // IDR pricing paused 2026-09-17 (Chris: Xendit ruled out, no other Indonesia
  // payment rail confirmed) — show USD pricing to all visitors for now.
  return <PricingContent isIndonesia={false} />;
}

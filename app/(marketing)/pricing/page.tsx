import { headers } from "next/headers";
import PricingContent from "./PricingContent";

export const metadata = {
  title: "Pricing — Crispy Leaders",
  description:
    "Monthly or annual access to all Crispy Leaders resources, pathways, and AI coaching.",
};

export default async function PricingPage({
  searchParams,
}: {
  searchParams: Promise<{ preview?: string }>;
}) {
  const h = await headers();
  const country = h.get("x-vercel-ip-country") ?? "";
  const params = await searchParams;
  const isIndonesia = country === "ID" || params.preview === "ID";

  return <PricingContent isIndonesia={isIndonesia} />;
}

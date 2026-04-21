import { Metadata } from "next";
import { createClient } from "@/lib/supabase/server";
import BuildingTrustClient from "./BuildingTrustClient";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Building Trust Across Cultures — Crispy Development",
  description: "Discover how trust is built differently across cultures and how to earn it as a cross-cultural leader.",
};

export default async function BuildingTrustPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  const pathway = (user?.user_metadata?.pathway as string | null | undefined) ?? null;
  const savedResources = (user?.user_metadata?.saved_resources ?? []) as string[];
  const isSaved = savedResources.includes("building-trust-across-cultures");
  return <BuildingTrustClient userPathway={pathway} isSaved={isSaved} />;
}

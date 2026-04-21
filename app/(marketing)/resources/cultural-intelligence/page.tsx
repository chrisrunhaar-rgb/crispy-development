import { Metadata } from "next";
import { createClient } from "@/lib/supabase/server";
import CulturalIntelligenceClient from "./CulturalIntelligenceClient";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Cultural Intelligence (CQ) — Crispy Development",
  description: "Understand the four dimensions of Cultural Intelligence and how to develop CQ as a cross-cultural leader.",
};

export default async function CulturalIntelligencePage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  const pathway = (user?.user_metadata?.pathway as string | null | undefined) ?? null;
  const savedResources = (user?.user_metadata?.saved_resources ?? []) as string[];
  const isSaved = savedResources.includes("cultural-intelligence");
  return <CulturalIntelligenceClient userPathway={pathway} isSaved={isSaved} />;
}

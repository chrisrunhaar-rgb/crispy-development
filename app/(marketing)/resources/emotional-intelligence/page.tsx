import { Metadata } from "next";
import { createClient } from "@/lib/supabase/server";
import EmotionalIntelligenceClient from "./EmotionalIntelligenceClient";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Emotional Intelligence — Crispy Development",
  description: "Develop the five components of emotional intelligence for more effective cross-cultural leadership.",
};

export default async function EmotionalIntelligencePage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  const pathway = (user?.user_metadata?.pathway as string | null | undefined) ?? null;
  const savedResources = (user?.user_metadata?.saved_resources ?? []) as string[];
  const isSaved = savedResources.includes("emotional-intelligence");
  return <EmotionalIntelligenceClient userPathway={pathway} isSaved={isSaved} />;
}

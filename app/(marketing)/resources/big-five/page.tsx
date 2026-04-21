import { Metadata } from "next";
import { createClient } from "@/lib/supabase/server";
import BigFiveClient from "./BigFiveClient";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Big Five (OCEAN) — Crispy Development",
  description: "Discover your Big Five personality profile and understand how Openness, Conscientiousness, Extraversion, Agreeableness, and Emotional Stability shape how you lead.",
};

export default async function BigFivePage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  const savedScores = (user?.user_metadata?.big_five_scores ?? null) as Record<string, number> | null;
  const isSaved = ((user?.user_metadata?.saved_resources ?? []) as string[]).includes("big-five");
  return <BigFiveClient isSaved={isSaved} savedScores={savedScores} />;
}

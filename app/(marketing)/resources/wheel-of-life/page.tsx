import { Metadata } from "next";
import { createClient } from "@/lib/supabase/server";
import WheelOfLifeClient from "./WheelOfLifeClient";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "The Wheel of Life — Crispy Development",
  description: "A visual self-assessment tool covering eight life domains: Health, Family, Finance, Relaxation, Lifelong Learning, Spiritual, Community, and Ministry. Identify where you're thriving — and where to grow.",
};

export default async function WheelOfLifePage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  const pathway = (user?.user_metadata?.pathway as string | null | undefined) ?? null;
  const savedResources = (user?.user_metadata?.saved_resources ?? []) as string[];
  const isSaved = savedResources.includes("wheel-of-life");
  const savedScores = (user?.user_metadata?.wheel_of_life_scores ?? null) as Record<string, number> | null;
  return <WheelOfLifeClient userPathway={pathway} isSaved={isSaved} savedScores={savedScores} />;
}

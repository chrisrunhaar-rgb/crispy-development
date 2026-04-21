import { Metadata } from "next";
import { createClient } from "@/lib/supabase/server";
import MBTIClient from "./MBTIClient";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Myers-Briggs (MBTI) — Crispy Development",
  description: "Discover your Myers-Briggs type and understand the psychological preferences that shape how you perceive the world and make decisions.",
};

export default async function MBTIPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  const savedType = (user?.user_metadata?.mbti_type ?? null) as string | null;
  const savedScores = (user?.user_metadata?.mbti_scores ?? null) as Record<string, number> | null;
  const isSaved = ((user?.user_metadata?.saved_resources ?? []) as string[]).includes("myers-briggs");
  return <MBTIClient isSaved={isSaved} savedType={savedType} savedScores={savedScores} />;
}

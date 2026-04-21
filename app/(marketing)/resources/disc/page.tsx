import { Metadata } from "next";
import { createClient } from "@/lib/supabase/server";
import DiscClient from "./DiscClient";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "DISC Personality Profile — Crispy Development",
  description: "Understand your behavioural style and how it shapes the way you lead, communicate, and collaborate.",
};

export default async function DiscPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  const savedResources = (user?.user_metadata?.saved_resources ?? []) as string[];
  const isSaved = savedResources.includes("disc");
  const discResult = (user?.user_metadata?.disc_result ?? null) as string | null;
  const discScores = (user?.user_metadata?.disc_scores ?? null) as { D: number; I: number; S: number; C: number } | null;
  return <DiscClient isSaved={isSaved} discResult={discResult} discScores={discScores} />;
}

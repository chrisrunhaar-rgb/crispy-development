import { Metadata } from "next";
import { createClient } from "@/lib/supabase/server";
import SmartGoalsClient from "./SmartGoalsClient";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "SMART Goals — Crispy Development",
  description: "A practical goal-setting framework: Specific, Motivational, Achievable, Relevant, Trackable. Learn how to set goals that actually stick — and what to do when they don't.",
};

export default async function SmartGoalsPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  const pathway = (user?.user_metadata?.pathway as string | null | undefined) ?? null;
  const savedResources = (user?.user_metadata?.saved_resources ?? []) as string[];
  const isSaved = savedResources.includes("smart-goals");
  const savedGoal = (user?.user_metadata?.smart_goal ?? null) as Record<string, string> | null;
  return <SmartGoalsClient userPathway={pathway} isSaved={isSaved} savedGoal={savedGoal} />;
}

import { Metadata } from "next";
import { createClient } from "@/lib/supabase/server";
import FixedGrowthMindsetClient from "./FixedGrowthMindsetClient";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Fixed vs. Growth Mindset — Crispy Development",
  description: "Carol Dweck's research shows that the way we think about our abilities shapes everything we do. Learn the difference between a fixed and growth mindset — and how to shift yours.",
};

export default async function FixedGrowthMindsetPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  const pathway = (user?.user_metadata?.pathway as string | null | undefined) ?? null;
  const savedResources = (user?.user_metadata?.saved_resources ?? []) as string[];
  const isSaved = savedResources.includes("fixed-growth-mindset");
  const savedScore = (user?.user_metadata?.mindset_score ?? null) as number | null;
  return <FixedGrowthMindsetClient userPathway={pathway} isSaved={isSaved} savedScore={savedScore} />;
}

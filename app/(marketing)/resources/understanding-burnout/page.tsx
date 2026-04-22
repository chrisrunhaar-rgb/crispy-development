import { Metadata } from "next";
import { createClient } from "@/lib/supabase/server";
import UnderstandingBurnoutClient from "./UnderstandingBurnoutClient";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Understanding Burnout — Crispy Development",
  description: "The three types of burnout and how to build the resilience that lasts. A guide for cross-cultural leaders.",
};

export default async function UnderstandingBurnoutPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  const pathway = (user?.user_metadata?.pathway as string | null | undefined) ?? null;
  const savedResources = (user?.user_metadata?.saved_resources ?? []) as string[];
  const isSaved = savedResources.includes("understanding-burnout");
  return <UnderstandingBurnoutClient userPathway={pathway} isSaved={isSaved} />;
}

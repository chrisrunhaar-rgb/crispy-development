import { Metadata } from "next";
import { createClient } from "@/lib/supabase/server";
import AboveBelowClient from "./AboveBelowClient";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Above & Below the Line — Crispy Development",
  description: "Are you leading as a Victor or a Victim? The Above-Below the Line framework helps you recognize reactive patterns — blame, excuse, denial — and choose ownership, accountability, and responsibility instead.",
};

export default async function AboveBelowPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  const pathway = (user?.user_metadata?.pathway as string | null | undefined) ?? null;
  const savedResources = (user?.user_metadata?.saved_resources ?? []) as string[];
  const isSaved = savedResources.includes("above-below-the-line");
  return <AboveBelowClient userPathway={pathway} isSaved={isSaved} />;
}

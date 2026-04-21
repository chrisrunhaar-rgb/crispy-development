import { Metadata } from "next";
import { createClient } from "@/lib/supabase/server";
import DecisionMakingClient from "./DecisionMakingClient";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Decision-Making Across Cultures — Crispy Development",
  description: "Understand different decision-making styles and how to lead decisively in multicultural contexts.",
};

export default async function DecisionMakingPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  const pathway = (user?.user_metadata?.pathway as string | null | undefined) ?? null;
  const savedResources = (user?.user_metadata?.saved_resources ?? []) as string[];
  const isSaved = savedResources.includes("decision-making");
  return <DecisionMakingClient userPathway={pathway} isSaved={isSaved} />;
}

import { Metadata } from "next";
import { createClient } from "@/lib/supabase/server";
import TeamHealthClient from "./TeamHealthClient";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Team Health — Crispy Development",
  description: "Assess and build a healthier team using markers, warning signs, and a practical self-assessment.",
};

export default async function TeamHealthPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  const pathway = (user?.user_metadata?.pathway as string | null | undefined) ?? null;
  const savedResources = (user?.user_metadata?.saved_resources ?? []) as string[];
  const isSaved = savedResources.includes("team-health");
  return <TeamHealthClient userPathway={pathway} isSaved={isSaved} />;
}

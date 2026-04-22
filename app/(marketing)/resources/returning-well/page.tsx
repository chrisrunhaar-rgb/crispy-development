import { Metadata } from "next";
import { createClient } from "@/lib/supabase/server";
import ReturningWellClient from "./ReturningWellClient";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Returning Well — Crispy Development",
  description: "Processing the transition back to your home culture after long-term cross-cultural service.",
};

export default async function ReturningWellPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  const pathway = (user?.user_metadata?.pathway as string | null | undefined) ?? null;
  const savedResources = (user?.user_metadata?.saved_resources ?? []) as string[];
  const isSaved = savedResources.includes("returning-well");
  return <ReturningWellClient userPathway={pathway} isSaved={isSaved} />;
}

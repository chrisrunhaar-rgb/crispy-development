import { Metadata } from "next";
import { createClient } from "@/lib/supabase/server";
import LadderOfInferenceClient from "./LadderOfInferenceClient";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "The Ladder of Inference — Crispy Development",
  description: "Most conflicts and misunderstandings start at the top of the Ladder — where we act on beliefs formed from incomplete data. Learn to trace your thinking back to the ground floor.",
};

export default async function LadderOfInferencePage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  const pathway = (user?.user_metadata?.pathway as string | null | undefined) ?? null;
  const savedResources = (user?.user_metadata?.saved_resources ?? []) as string[];
  const isSaved = savedResources.includes("ladder-of-inference");
  return <LadderOfInferenceClient userPathway={pathway} isSaved={isSaved} />;
}

import { Metadata } from "next";
import { createClient } from "@/lib/supabase/server";
import PsychologicalFirstAidClient from "./PsychologicalFirstAidClient";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Psychological First Aid — Crispy Development",
  description: "Equipping leaders to support teammates in crisis using the RAPID model for immediate, compassionate intervention.",
};

export default async function PsychologicalFirstAidPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  const pathway = (user?.user_metadata?.pathway as string | null | undefined) ?? null;
  const savedResources = (user?.user_metadata?.saved_resources ?? []) as string[];
  const isSaved = savedResources.includes("psychological-first-aid");
  return <PsychologicalFirstAidClient userPathway={pathway} isSaved={isSaved} />;
}

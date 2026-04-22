import { Metadata } from "next";
import { createClient } from "@/lib/supabase/server";
import EmotionalSafetyFamiliesClient from "./EmotionalSafetyFamiliesClient";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Emotional Safety for Families — Crispy Development",
  description:
    "How to build emotional safety at home when ministry demands are high — and model humility through relational repair.",
};

export default async function EmotionalSafetyFamiliesPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  const pathway =
    (user?.user_metadata?.pathway as string | null | undefined) ?? null;
  const savedResources = (user?.user_metadata?.saved_resources ??
    []) as string[];
  const isSaved = savedResources.includes("emotional-safety-families");
  return (
    <EmotionalSafetyFamiliesClient userPathway={pathway} isSaved={isSaved} />
  );
}

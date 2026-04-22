import { Metadata } from "next";
import { createClient } from "@/lib/supabase/server";
import SustainablePaceClient from "./SustainablePaceClient";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Sustainable Pace — Crispy Development",
  description: "Build the practical health architecture that keeps leaders going for the long haul — the Five Spheres of Care, a Stress Audit, and three categories of habits for body, mind, and spirit.",
};

export default async function SustainablePacePage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  const pathway = (user?.user_metadata?.pathway as string | null | undefined) ?? null;
  const savedResources = (user?.user_metadata?.saved_resources ?? []) as string[];
  const isSaved = savedResources.includes("sustainable-pace");
  return <SustainablePaceClient userPathway={pathway} isSaved={isSaved} />;
}

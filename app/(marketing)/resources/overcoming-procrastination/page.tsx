import { Metadata } from "next";
import { createClient } from "@/lib/supabase/server";
import OvercomingProcrastinationClient from "./OvercomingProcrastinationClient";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Overcoming Procrastination — Crispy Development",
  description: "Procrastination isn't laziness — it's usually fear, perfectionism, or overwhelm in disguise. A 5-step framework to identify your triggers, uncover root causes, and build momentum.",
};

export default async function OvercomingProcrastinationPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  const pathway = (user?.user_metadata?.pathway as string | null | undefined) ?? null;
  const savedResources = (user?.user_metadata?.saved_resources ?? []) as string[];
  const isSaved = savedResources.includes("overcoming-procrastination");
  return <OvercomingProcrastinationClient userPathway={pathway} isSaved={isSaved} />;
}

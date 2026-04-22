import { Metadata } from "next";
import { createClient } from "@/lib/supabase/server";
import HealthyTransitionsClient from "./HealthyTransitionsClient";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Healthy Transitions — Crispy Development",
  description: "The RAFT model for navigating re-entry, role change, or any major life transition well.",
};

export default async function HealthyTransitionsPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  const pathway = (user?.user_metadata?.pathway as string | null | undefined) ?? null;
  const savedResources = (user?.user_metadata?.saved_resources ?? []) as string[];
  const isSaved = savedResources.includes("healthy-transitions");
  return <HealthyTransitionsClient userPathway={pathway} isSaved={isSaved} />;
}

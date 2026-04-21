import { Metadata } from "next";
import { createClient } from "@/lib/supabase/server";
import PowerDistanceClient from "./PowerDistanceClient";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Power Distance — Crispy Development",
  description: "Understand how power distance shapes leadership expectations across cultures.",
};

export default async function PowerDistancePage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  const pathway = (user?.user_metadata?.pathway as string | null | undefined) ?? null;
  const savedResources = (user?.user_metadata?.saved_resources ?? []) as string[];
  const isSaved = savedResources.includes("power-distance");
  return <PowerDistanceClient userPathway={pathway} isSaved={isSaved} />;
}

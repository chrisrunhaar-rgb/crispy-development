import { Metadata } from "next";
import { createClient } from "@/lib/supabase/server";
import LeadingWithoutLosingFaithClient from "./LeadingWithoutLosingFaithClient";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Leading Without Losing Your Faith — Crispy Development",
  description: "Maintaining spiritual rootedness when leadership demands are high and cultural confusion is real.",
};

export default async function LeadingWithoutLosingFaithPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  const pathway = (user?.user_metadata?.pathway as string | null | undefined) ?? null;
  const savedResources = (user?.user_metadata?.saved_resources ?? []) as string[];
  const isSaved = savedResources.includes("leading-without-losing-faith");
  return <LeadingWithoutLosingFaithClient userPathway={pathway} isSaved={isSaved} />;
}

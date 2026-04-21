import { Metadata } from "next";
import { createClient } from "@/lib/supabase/server";
import TimeAndCultureClient from "./TimeAndCultureClient";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Time & Culture — Crispy Development",
  description: "Explore how monochronic and polychronic time orientations shape teamwork and leadership.",
};

export default async function TimeAndCulturePage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  const pathway = (user?.user_metadata?.pathway as string | null | undefined) ?? null;
  const savedResources = (user?.user_metadata?.saved_resources ?? []) as string[];
  const isSaved = savedResources.includes("time-and-culture");
  return <TimeAndCultureClient userPathway={pathway} isSaved={isSaved} />;
}

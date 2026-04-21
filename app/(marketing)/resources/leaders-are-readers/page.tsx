import { Metadata } from "next";
import { createClient } from "@/lib/supabase/server";
import LeadersReadersClient from "./LeadersReadersClient";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Leaders are Readers — Crispy Development",
  description: "Great leaders commit to continuous learning. Discover why reading is a cornerstone of effective leadership and how to build a sustainable reading habit.",
};

export default async function LeadersReadersPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  const pathway = (user?.user_metadata?.pathway as string | null | undefined) ?? null;
  const savedResources = (user?.user_metadata?.saved_resources ?? []) as string[];
  const isSaved = savedResources.includes("leaders-are-readers");
  return <LeadersReadersClient userPathway={pathway} isSaved={isSaved} />;
}

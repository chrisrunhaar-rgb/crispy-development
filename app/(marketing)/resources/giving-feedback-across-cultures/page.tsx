import { Metadata } from "next";
import { createClient } from "@/lib/supabase/server";
import GivingFeedbackClient from "./GivingFeedbackClient";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Giving Feedback Across Cultures — Crispy Development",
  description: "Learn how to give feedback that lands well across cultural boundaries — without losing clarity or relationship.",
};

export default async function GivingFeedbackPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  const pathway = (user?.user_metadata?.pathway as string | null | undefined) ?? null;
  const savedResources = (user?.user_metadata?.saved_resources ?? []) as string[];
  const isSaved = savedResources.includes("giving-feedback-across-cultures");
  return <GivingFeedbackClient userPathway={pathway} isSaved={isSaved} />;
}

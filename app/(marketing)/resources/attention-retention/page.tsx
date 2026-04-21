import { Metadata } from "next";
import { createClient } from "@/lib/supabase/server";
import AttentionRetentionClient from "./AttentionRetentionClient";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Attention & Retention — Crispy Development",
  description: "Understand how attention and retention work in adult learning. Apply evidence-based principles to design training that sticks — across any culture or context.",
};

export default async function AttentionRetentionPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  const pathway = (user?.user_metadata?.pathway as string | null | undefined) ?? null;
  const savedResources = (user?.user_metadata?.saved_resources ?? []) as string[];
  const isSaved = savedResources.includes("attention-retention");
  return <AttentionRetentionClient userPathway={pathway} isSaved={isSaved} />;
}

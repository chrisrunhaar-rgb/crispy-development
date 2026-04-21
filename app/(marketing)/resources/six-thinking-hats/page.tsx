import { Metadata } from "next";
import { createClient } from "@/lib/supabase/server";
import SixThinkingHatsClient from "./SixThinkingHatsClient";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Six Thinking Hats — Crispy Development",
  description: "Edward de Bono's Six Thinking Hats framework helps teams make better decisions by deliberately separating six modes of thinking — facts, feelings, creativity, optimism, caution, and process.",
};

export default async function SixThinkingHatsPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  const pathway = (user?.user_metadata?.pathway as string | null | undefined) ?? null;
  const savedResources = (user?.user_metadata?.saved_resources ?? []) as string[];
  const isSaved = savedResources.includes("six-thinking-hats");
  return <SixThinkingHatsClient userPathway={pathway} isSaved={isSaved} />;
}

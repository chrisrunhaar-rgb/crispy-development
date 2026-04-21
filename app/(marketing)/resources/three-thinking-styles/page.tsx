import { Metadata } from "next";
import { createClient } from "@/lib/supabase/server";
import ThinkingStylesClient from "./ThinkingStylesClient";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Three Thinking Styles — Crispy Development",
  description: "Discover your thinking style — Conceptual, Holistic, or Intuitional — and learn how it shapes your cross-cultural leadership.",
};

export default async function ThreeThinkingStylesPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  const pathway = (user?.user_metadata?.pathway as string | null | undefined) ?? null;
  const savedResources = (user?.user_metadata?.saved_resources ?? []) as string[];
  const isSaved = savedResources.includes("three-thinking-styles");
  return <ThinkingStylesClient userPathway={pathway} isSaved={isSaved} />;
}

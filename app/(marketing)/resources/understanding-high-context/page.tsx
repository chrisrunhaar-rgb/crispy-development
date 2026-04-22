import { Metadata } from "next";
import { createClient } from "@/lib/supabase/server";
import UnderstandingHighContextClient from "./UnderstandingHighContextClient";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Understanding High-Context Cultures — Crispy Development",
  description: "How communication styles shape relationships — and what that means for cross-cultural teams.",
};

export default async function UnderstandingHighContextPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  const pathway = (user?.user_metadata?.pathway as string | null | undefined) ?? null;
  const savedResources = (user?.user_metadata?.saved_resources ?? []) as string[];
  const isSaved = savedResources.includes("understanding-high-context");
  return <UnderstandingHighContextClient userPathway={pathway} isSaved={isSaved} />;
}

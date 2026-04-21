import { Metadata } from "next";
import { createClient } from "@/lib/supabase/server";
import EnneagramClient from "./EnneagramClient";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Enneagram — Crispy Development",
  description: "Discover your Enneagram type and understand the core motivations, fears, and growth paths that shape how you lead, connect, and serve.",
};

export default async function EnneagramPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  const savedResources = (user?.user_metadata?.saved_resources ?? []) as string[];
  const isSaved = savedResources.includes("enneagram");
  const savedType = (user?.user_metadata?.enneagram_type ?? null) as number | null;
  const savedScores = (user?.user_metadata?.enneagram_scores ?? null) as Record<string, number> | null;
  return <EnneagramClient isSaved={isSaved} savedType={savedType} savedScores={savedScores} />;
}

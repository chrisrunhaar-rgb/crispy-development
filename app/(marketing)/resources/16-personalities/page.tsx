import { Metadata } from "next";
import { createClient } from "@/lib/supabase/server";
import Personalities16Client from "./Personalities16Client";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "16 Personalities — Crispy Development",
  description: "Discover your 16 Personalities type and understand how your character shapes the way you lead, communicate, and grow.",
};

export default async function Personalities16Page() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  const savedType = (user?.user_metadata?.personalities16_type ?? null) as string | null;
  const savedScores = (user?.user_metadata?.personalities16_scores ?? null) as Record<string, number> | null;
  const isSaved = ((user?.user_metadata?.saved_resources ?? []) as string[]).includes("16-personalities");
  return <Personalities16Client isSaved={isSaved} savedType={savedType} savedScores={savedScores} />;
}

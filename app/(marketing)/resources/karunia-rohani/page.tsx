import { Metadata } from "next";
import { createClient } from "@/lib/supabase/server";
import KaruniaClient from "./KaruniaClient";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Tes Karunia Rohani — Crispy Development",
  description: "Temukan karunia rohani yang Allah berikan kepadamu — dan bagaimana karunia itu bisa dimaksimalkan dalam pelayanan dan kepemimpinan.",
};

export default async function KaruniaRohaniPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  const savedResources = (user?.user_metadata?.saved_resources ?? []) as string[];
  const isSaved = savedResources.includes("karunia-rohani");
  const karuniaTopGifts = (user?.user_metadata?.karunia_top_gifts ?? null) as string[] | null;
  const karuniaScores = (user?.user_metadata?.karunia_scores ?? null) as Record<string, number> | null;
  return <KaruniaClient isSaved={isSaved} karuniaTopGifts={karuniaTopGifts} karuniaScores={karuniaScores} isLoggedIn={!!user} />;
}

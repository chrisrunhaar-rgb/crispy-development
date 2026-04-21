import { Metadata } from "next";
import { createClient } from "@/lib/supabase/server";
import SabbathLeadershipClient from "./SabbathLeadershipClient";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Sabbath Leadership — Crispy Development",
  description: "Learn how Sabbath rhythms protect leaders from burnout and sustain fruitful ministry.",
};

export default async function SabbathLeadershipPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  const pathway = (user?.user_metadata?.pathway as string | null | undefined) ?? null;
  const savedResources = (user?.user_metadata?.saved_resources ?? []) as string[];
  const isSaved = savedResources.includes("sabbath-leadership");
  return <SabbathLeadershipClient userPathway={pathway} isSaved={isSaved} />;
}

import { Metadata } from "next";
import { createClient } from "@/lib/supabase/server";
import InfluentialLeadershipClient from "./InfluentialLeadershipClient";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "The Influential Leadership Framework — Crispy Development",
  description: "A systematic approach to leading with influence across cultural boundaries.",
};

export default async function InfluentialLeadershipPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  const pathway = (user?.user_metadata?.pathway as string | null | undefined) ?? null;
  const savedResources = (user?.user_metadata?.saved_resources ?? []) as string[];
  const isSaved = savedResources.includes("influential-leadership-framework");
  return <InfluentialLeadershipClient userPathway={pathway} isSaved={isSaved} />;
}

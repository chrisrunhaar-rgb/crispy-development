import { Metadata } from "next";
import { createClient } from "@/lib/supabase/server";
import ConflictResolutionClient from "./ConflictResolutionClient";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Conflict Resolution Across Cultures — Crispy Development",
  description: "Navigate cross-cultural conflict with wisdom, using proven frameworks and cultural sensitivity.",
};

export default async function ConflictResolutionPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  const pathway = (user?.user_metadata?.pathway as string | null | undefined) ?? null;
  const savedResources = (user?.user_metadata?.saved_resources ?? []) as string[];
  const isSaved = savedResources.includes("conflict-resolution");
  return <ConflictResolutionClient userPathway={pathway} isSaved={isSaved} />;
}

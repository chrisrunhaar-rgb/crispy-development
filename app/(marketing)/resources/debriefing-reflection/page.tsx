import { Metadata } from "next";
import { createClient } from "@/lib/supabase/server";
import DebriefingReflectionClient from "./DebriefingReflectionClient";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Debriefing & Reflection — Crispy Development",
  description: "Use structured debriefing and the ORID framework to turn experience into lasting growth.",
};

export default async function DebriefingReflectionPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  const pathway = (user?.user_metadata?.pathway as string | null | undefined) ?? null;
  const savedResources = (user?.user_metadata?.saved_resources ?? []) as string[];
  const isSaved = savedResources.includes("debriefing-reflection");
  return <DebriefingReflectionClient userPathway={pathway} isSaved={isSaved} />;
}

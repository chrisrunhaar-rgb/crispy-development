import { Metadata } from "next";
import { createClient } from "@/lib/supabase/server";
import CognitiveBiasesClient from "./CognitiveBiasesClient";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Cognitive Biases in Leadership — Crispy Development",
  description: "Recognize the cognitive biases that undermine cross-cultural leadership and learn how to counter them.",
};

export default async function CognitiveBiasesPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  const pathway = (user?.user_metadata?.pathway as string | null | undefined) ?? null;
  const savedResources = (user?.user_metadata?.saved_resources ?? []) as string[];
  const isSaved = savedResources.includes("cognitive-biases");
  return <CognitiveBiasesClient userPathway={pathway} isSaved={isSaved} />;
}

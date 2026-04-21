import { Metadata } from "next";
import { createClient } from "@/lib/supabase/server";
import InterculturalCommunicationClient from "./InterculturalCommunicationClient";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Intercultural Communication — Crispy Development",
  description: "Learn the four key dimensions of intercultural communication and how to bridge them.",
};

export default async function InterculturalCommunicationPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  const pathway = (user?.user_metadata?.pathway as string | null | undefined) ?? null;
  const savedResources = (user?.user_metadata?.saved_resources ?? []) as string[];
  const isSaved = savedResources.includes("intercultural-communication");
  return <InterculturalCommunicationClient userPathway={pathway} isSaved={isSaved} />;
}

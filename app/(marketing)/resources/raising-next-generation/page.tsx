import { Metadata } from "next";
import { createClient } from "@/lib/supabase/server";
import RaisingNextGenerationClient from "./RaisingNextGenerationClient";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Raising the Next Generation — Crispy Development",
  description: "Use the Paul-Timothy model to intentionally invest in and release the next generation of leaders.",
};

export default async function RaisingNextGenerationPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  const pathway = (user?.user_metadata?.pathway as string | null | undefined) ?? null;
  const savedResources = (user?.user_metadata?.saved_resources ?? []) as string[];
  const isSaved = savedResources.includes("raising-next-generation");
  return <RaisingNextGenerationClient userPathway={pathway} isSaved={isSaved} />;
}

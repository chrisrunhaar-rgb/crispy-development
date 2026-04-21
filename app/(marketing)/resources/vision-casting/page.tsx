import { Metadata } from "next";
import { createClient } from "@/lib/supabase/server";
import VisionCastingClient from "./VisionCastingClient";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Vision Casting — Crispy Development",
  description: "Learn how to craft and communicate a compelling vision that moves people across cultural contexts.",
};

export default async function VisionCastingPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  const pathway = (user?.user_metadata?.pathway as string | null | undefined) ?? null;
  const savedResources = (user?.user_metadata?.saved_resources ?? []) as string[];
  const isSaved = savedResources.includes("vision-casting");
  return <VisionCastingClient userPathway={pathway} isSaved={isSaved} />;
}

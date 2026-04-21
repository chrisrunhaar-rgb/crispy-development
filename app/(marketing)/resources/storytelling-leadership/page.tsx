import { Metadata } from "next";
import { createClient } from "@/lib/supabase/server";
import StorytellingLeadershipClient from "./StorytellingLeadershipClient";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Storytelling in Leadership — Crispy Development",
  description: "Harness the power of story to inspire, align, and move people across cultural boundaries.",
};

export default async function StorytellingLeadershipPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  const pathway = (user?.user_metadata?.pathway as string | null | undefined) ?? null;
  const savedResources = (user?.user_metadata?.saved_resources ?? []) as string[];
  const isSaved = savedResources.includes("storytelling-leadership");
  return <StorytellingLeadershipClient userPathway={pathway} isSaved={isSaved} />;
}

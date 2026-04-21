import { Metadata } from "next";
import { createClient } from "@/lib/supabase/server";
import ServantLeadershipClient from "./ServantLeadershipClient";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Servant Leadership — Crispy Development",
  description: "Explore the biblical and practical foundations of servant leadership across cultures.",
};

export default async function ServantLeadershipPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  const pathway = (user?.user_metadata?.pathway as string | null | undefined) ?? null;
  const savedResources = (user?.user_metadata?.saved_resources ?? []) as string[];
  const isSaved = savedResources.includes("servant-leadership");
  return <ServantLeadershipClient userPathway={pathway} isSaved={isSaved} />;
}

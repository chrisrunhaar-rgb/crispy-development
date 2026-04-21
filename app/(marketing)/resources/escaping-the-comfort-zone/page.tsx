import { Metadata } from "next";
import { createClient } from "@/lib/supabase/server";
import ComfortZoneClient from "./ComfortZoneClient";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Escaping the Comfort Zone — Crispy Development",
  description: "Identify where your comfort zone ends and growth begins. Understand the four zones — Comfort, Fear, Learning, and Growth — and take steps toward meaningful change.",
};

export default async function ComfortZonePage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  const pathway = (user?.user_metadata?.pathway as string | null | undefined) ?? null;
  const savedResources = (user?.user_metadata?.saved_resources ?? []) as string[];
  const isSaved = savedResources.includes("escaping-the-comfort-zone");
  return <ComfortZoneClient userPathway={pathway} isSaved={isSaved} />;
}

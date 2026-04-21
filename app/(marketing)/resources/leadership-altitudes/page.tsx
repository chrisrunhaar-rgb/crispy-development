import { Metadata } from "next";
import { createClient } from "@/lib/supabase/server";
import LeadershipAltitudesClient from "./LeadershipAltitudesClient";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Leadership Altitudes — Crispy Development",
  description: "Understand the five altitude levels of leadership — from Team Member to International Organization — and learn to lead with perspective, trust, and strategic clarity.",
};

export default async function LeadershipAltitudesPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  const pathway = (user?.user_metadata?.pathway as string | null | undefined) ?? null;
  const savedResources = (user?.user_metadata?.saved_resources ?? []) as string[];
  const isSaved = savedResources.includes("leadership-altitudes");
  return <LeadershipAltitudesClient userPathway={pathway} isSaved={isSaved} />;
}

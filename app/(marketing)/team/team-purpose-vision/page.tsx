import { Metadata } from "next";
import { createClient } from "@/lib/supabase/server";
import TeamPurposeVisionClient from "./TeamPurposeVisionClient";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Team Purpose & Vision — Crispy Development",
  description: "Define your why before your what. A guided workshop to help your team articulate a shared purpose and vision that goes beyond tasks and goals.",
};

export default async function TeamPurposeVisionPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  return <TeamPurposeVisionClient user={user} />;
}

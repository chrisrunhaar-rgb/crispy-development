import { Metadata } from "next";
import { createClient } from "@/lib/supabase/server";
import RedLightGreenLightClient from "./RedLightGreenLightClient";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Red Light & Green Light Thinking — Crispy Development",
  description: "A simple framework to help teams separate creative idea generation (Green Light) from critical evaluation and decision-making (Red Light). Lead better meetings and make sharper decisions.",
};

export default async function RedLightGreenLightPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  const pathway = (user?.user_metadata?.pathway as string | null | undefined) ?? null;
  const savedResources = (user?.user_metadata?.saved_resources ?? []) as string[];
  const isSaved = savedResources.includes("red-light-green-light");
  const savedScore = (user?.user_metadata?.rlgl_score ?? null) as number | null;
  return <RedLightGreenLightClient userPathway={pathway} isSaved={isSaved} savedScore={savedScore} />;
}

import { Metadata } from "next";
import { createClient } from "@/lib/supabase/server";
import IdentityUnderPressureClient from "./IdentityUnderPressureClient";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Identity Under Pressure — Crispy Development",
  description: "Maintaining a grounded sense of self when living and leading between worlds.",
};

export default async function IdentityUnderPressurePage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  const pathway = (user?.user_metadata?.pathway as string | null | undefined) ?? null;
  const savedResources = (user?.user_metadata?.saved_resources ?? []) as string[];
  const isSaved = savedResources.includes("identity-under-pressure");
  return <IdentityUnderPressureClient userPathway={pathway} isSaved={isSaved} />;
}

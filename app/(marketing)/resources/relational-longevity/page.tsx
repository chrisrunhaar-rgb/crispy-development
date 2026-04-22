import { Metadata } from "next";
import { createClient } from "@/lib/supabase/server";
import RelationalLongevityClient from "./RelationalLongevityClient";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Relational Longevity — Crispy Development",
  description:
    "Why relational breakdown is the leading cause of premature departure from the field — and how to build the interpersonal skills that keep teams together.",
};

export default async function RelationalLongevityPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  const pathway = (user?.user_metadata?.pathway as string | null | undefined) ?? null;
  const savedResources = (user?.user_metadata?.saved_resources ?? []) as string[];
  const isSaved = savedResources.includes("relational-longevity");
  return <RelationalLongevityClient userPathway={pathway} isSaved={isSaved} />;
}

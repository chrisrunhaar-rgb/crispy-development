import { Metadata } from "next";
import { createClient } from "@/lib/supabase/server";
import ManagingUpClient from "./ManagingUpClient";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Managing Up — Crispy Development",
  description: "Learn how to communicate upward effectively and give your leader what they need to lead well.",
};

export default async function ManagingUpPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  const pathway = (user?.user_metadata?.pathway as string | null | undefined) ?? null;
  const savedResources = (user?.user_metadata?.saved_resources ?? []) as string[];
  const isSaved = savedResources.includes("managing-up");
  return <ManagingUpClient userPathway={pathway} isSaved={isSaved} />;
}

import { Metadata } from "next";
import { createClient } from "@/lib/supabase/server";
import JohariWindowClient from "./JohariWindowClient";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "The Johari Window — Crispy Development",
  description: "Use the Johari Window model to grow in self-awareness and deepen trust with your team.",
};

export default async function JohariWindowPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  const pathway = (user?.user_metadata?.pathway as string | null | undefined) ?? null;
  const savedResources = (user?.user_metadata?.saved_resources ?? []) as string[];
  const isSaved = savedResources.includes("johari-window");
  return <JohariWindowClient userPathway={pathway} isSaved={isSaved} />;
}

import { Metadata } from "next";
import { createClient } from "@/lib/supabase/server";
import TrustSafetyClient from "./TrustSafetyClient";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Trust & Psychological Safety — Crispy Development",
  description: "Discover what psychological safety really is, why it's the foundation of every high-performing team, and how to measure and build it on yours.",
};

export default async function TrustPsychologicalSafetyPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  return <TrustSafetyClient user={user} />;
}

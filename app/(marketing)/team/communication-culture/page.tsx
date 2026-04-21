import { Metadata } from "next";
import { createClient } from "@/lib/supabase/server";
import CommunicationCultureClient from "./CommunicationCultureClient";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Communication Culture — Crispy Development",
  description: "Your team communicates every day — and misunderstands each other almost as often. Discover your communication style and learn how to build a culture where every voice is heard.",
};

export default async function CommunicationCulturePage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  return <CommunicationCultureClient user={user} />;
}

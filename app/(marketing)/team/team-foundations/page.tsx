import { Metadata } from "next";
import { createClient } from "@/lib/supabase/server";
import TeamFoundationsClient from "./TeamFoundationsClient";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Team Foundations — Crispy Development",
  description: "Build the relational bedrock your team needs to thrive. Explore what it really means to move from a group to a team — and why foundations matter more than strategy.",
};

export default async function TeamFoundationsPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  return <TeamFoundationsClient user={user} />;
}

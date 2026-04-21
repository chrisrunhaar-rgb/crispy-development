import { Metadata } from "next";
import { createClient } from "@/lib/supabase/server";
import BigFiveTeamClient from "./BigFiveTeamClient";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Big Five (OCEAN) — Team | Crispy Development",
  description:
    "Understand how your team's OCEAN scores explain friction, collaboration patterns, and how people respond to change and challenge.",
};

export default async function BigFiveTeamPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  return <BigFiveTeamClient user={user ?? null} />;
}

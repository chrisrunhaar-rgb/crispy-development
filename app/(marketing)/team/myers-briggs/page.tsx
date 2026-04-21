import { Metadata } from "next";
import { createClient } from "@/lib/supabase/server";
import MBTITeamClient from "./MBTITeamClient";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Myers-Briggs — Team | Crispy Development",
  description:
    "Understand how your teammates recharge, process information, make decisions, and structure their work. A team MBTI assessment for cross-cultural leaders.",
};

export default async function MBTITeamPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  return <MBTITeamClient user={user ?? null} />;
}

import { Metadata } from "next";
import { createClient } from "@/lib/supabase/server";
import DecisionMakingClient from "./DecisionMakingClient";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Decision Making — Crispy Development",
  description: "Nothing slows a team down more than confusion about how decisions get made. Learn the three decision modes, what breaks decision-making in cross-cultural teams, and how to build a shared decision culture.",
};

export default async function DecisionMakingPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  return <DecisionMakingClient user={user} />;
}

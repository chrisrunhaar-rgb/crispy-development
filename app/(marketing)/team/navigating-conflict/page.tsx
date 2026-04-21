import { Metadata } from "next";
import { createClient } from "@/lib/supabase/server";
import NavigatingConflictClient from "./NavigatingConflictClient";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Navigating Conflict — Crispy Development",
  description: "Every team that does real work has conflict. Learn how to move through it in a way that builds trust rather than erodes it — with a cross-cultural conflict framework and a personal conflict style assessment.",
};

export default async function NavigatingConflictPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  return <NavigatingConflictClient user={user} />;
}

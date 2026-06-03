import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import CompletionClient from "./CompletionClient";

export const metadata = { title: "Challenge Complete — Influential Leadership Challenge" };

export default async function CompletePage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const admin = createAdminClient();

  const [{ data: enrollment }, { data: journalEntries }] = await Promise.all([
    admin.from("challenge_enrollments").select("status, completed_at").eq("user_id", user.id).maybeSingle(),
    admin.from("challenge_journal_entries").select("day_number, answer_1, answer_2").eq("user_id", user.id).order("day_number", { ascending: true }),
  ]);

  if (!enrollment) redirect("/challenge");

  const firstName = (user.user_metadata?.first_name as string | undefined) ?? "";
  const lastName  = (user.user_metadata?.last_name  as string | undefined) ?? "";

  return (
    <CompletionClient
      firstName={firstName}
      lastName={lastName}
      completedAt={enrollment.completed_at ?? new Date().toISOString()}
      journalEntries={(journalEntries ?? []) as { day_number: number; answer_1: string | null; answer_2: string | null }[]}
    />
  );
}

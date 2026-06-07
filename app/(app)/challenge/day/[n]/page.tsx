import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import DayClient from "./DayClient";

export async function generateMetadata({ params }: { params: Promise<{ n: string }> }) {
  const { n } = await params;
  return { title: `Day ${n} — Influential Leadership Challenge` };
}

export default async function ChallengeDayPage({ params }: { params: Promise<{ n: string }> }) {
  const { n } = await params;
  const dayNumber = parseInt(n, 10);

  if (isNaN(dayNumber) || dayNumber < 1 || dayNumber > 60) {
    redirect("/challenge");
  }

  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect(`/login?next=/challenge/day/${dayNumber}`);

  const admin = createAdminClient();

  const [{ data: enrollment }, { data: module }, { data: journalEntry }] = await Promise.all([
    admin.from("challenge_enrollments").select("id, current_day, status, path, group_id").eq("user_id", user.id).maybeSingle(),
    admin.from("challenge_modules").select("*").eq("day_number", dayNumber).maybeSingle(),
    admin.from("challenge_journal_entries").select("answer_1, answer_2, peer_answer, updated_at").eq("user_id", user.id).eq("day_number", dayNumber).maybeSingle(),
  ]);

  if (!enrollment) {
    redirect("/challenge/solo");
  }

  if (!module) {
    redirect("/challenge");
  }

  // Language: user metadata takes precedence over cookie for cross-device consistency
  const cookieStore = await cookies();
  const cookieLang = cookieStore.get("crispy-lang")?.value;
  const metaLang = (user.user_metadata as Record<string, unknown>)?.language_preference as string | undefined;
  const langCookie = ((metaLang ?? cookieLang ?? "en") === "id" ? "id" : "en") as "en" | "id";

  // Overlay Indonesian content fields when lang=id
  if (langCookie === "id") {
    const fields = [
      "title",
      "core_idea",
      "content",
      "biblical_foundation",
      "personal_reflection_q1",
      "personal_reflection_q2",
      "peer_question",
      "implementation_challenge",
      "chapter_title",
    ] as const;
    for (const f of fields) {
      const idVal = (module as Record<string, unknown>)[`${f}_id`];
      if (idVal) (module as Record<string, unknown>)[f] = idVal;
    }
  }

  const currentDay = enrollment.current_day ?? 1;
  const isLocked = dayNumber > currentDay;

  return (
    <DayClient
      module={module}
      dayNumber={dayNumber}
      currentDay={currentDay}
      isLocked={isLocked}
      initialJournal={journalEntry ? { answer1: journalEntry.answer_1 ?? "", answer2: journalEntry.answer_2 ?? "", peerAnswer: journalEntry.peer_answer ?? "" } : null}
      firstName={(user.user_metadata?.first_name as string | undefined) ?? ""}
      hasGroup={!!enrollment.group_id}
    />
  );
}

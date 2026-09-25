import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import StepClient from "./StepClient";

export const metadata = { title: "Influential Leadership Journey" };

export default async function JourneyStepPage({ params }: { params: Promise<{ n: string }> }) {
  const { n } = await params;
  const stepNumber = parseInt(n, 10);
  if (isNaN(stepNumber) || stepNumber < 1 || stepNumber > 60) redirect("/journey/iceberg");

  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect(`/login?next=/journey/step/${stepNumber}`);

  const admin = createAdminClient();
  const [{ data: module }, { data: completion }, { data: journal }, { count: doneCount }, { data: upTo }] = await Promise.all([
    admin.from("challenge_modules").select("*").eq("day_number", stepNumber).maybeSingle(),
    supabase.from("journey_step_completions").select("step_number").eq("user_id", user.id).eq("step_number", stepNumber).maybeSingle(),
    supabase.from("challenge_journal_entries").select("answer_1, answer_2, ai_question, ai_answer").eq("user_id", user.id).eq("day_number", stepNumber).maybeSingle(),
    supabase.from("journey_step_completions").select("step_number", { count: "exact", head: true }).eq("user_id", user.id),
    admin.from("challenge_modules").select("day_number, chapter_title").gte("day_number", 1).lte("day_number", stepNumber).order("day_number"),
  ]);
  if (!module) redirect("/journey/iceberg");

  const cookieStore = await cookies();
  const metaLang = (user.user_metadata as Record<string, unknown>)?.language_preference as string | undefined;
  const lang = ((metaLang ?? cookieStore.get("crispy-lang")?.value ?? "en") === "id" ? "id" : "en") as "en" | "id";

  // Same "chapter.position" numbering as the iceberg map, e.g. 3.2.
  let ch = 0, local = 0, prevTitle: string | null | undefined;
  (upTo ?? []).forEach((r, i) => {
    if (i === 0 || r.chapter_title !== prevTitle) { ch++; local = 0; }
    local++;
    prevTitle = r.chapter_title;
  });
  const chapterCode = ch ? `${ch}.${local}` : String(stepNumber);

  const m = module as Record<string, unknown>;
  const field = (f: string) => ((lang === "id" && m[`${f}_id`]) || m[f] || null) as string | null;

  return (
    <StepClient
      stepNumber={stepNumber}
      chapterCode={chapterCode}
      lang={lang}
      doneCount={doneCount ?? 0}
      initiallyCompleted={!!completion}
      step={{
        title: field("title") ?? "",
        chapter_title: field("chapter_title"),
        core_idea: field("core_idea"),
        content: field("content"),
        biblical_foundation: field("biblical_foundation"),
        implementation_challenge: field("implementation_challenge"),
        q1: field("personal_reflection_q1"),
        q2: field("personal_reflection_q2"),
      }}
      initialJournal={{
        answer1: journal?.answer_1 ?? "",
        answer2: journal?.answer_2 ?? "",
        aiQuestion: journal?.ai_question ?? null,
        aiAnswer: journal?.ai_answer ?? "",
      }}
    />
  );
}

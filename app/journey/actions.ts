"use server";

import { cookies } from "next/headers";
import { revalidatePath } from "next/cache";
import { GoogleGenAI } from "@google/genai";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";

function validStep(n: number) {
  return Number.isInteger(n) && n >= 1 && n <= 60;
}

async function getUserAndLang() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { supabase, user: null, lang: "en" as const };
  const cookieStore = await cookies();
  const metaLang = (user.user_metadata as Record<string, unknown>)?.language_preference as string | undefined;
  const lang = ((metaLang ?? cookieStore.get("crispy-lang")?.value ?? "en") === "id" ? "id" : "en") as "en" | "id";
  return { supabase, user, lang };
}

export async function completeStep(stepNumber: number) {
  if (!validStep(stepNumber)) return { error: "Invalid step" };
  const { supabase, user } = await getUserAndLang();
  if (!user) return { error: "Not signed in" };

  const { error } = await supabase
    .from("journey_step_completions")
    .upsert({ user_id: user.id, step_number: stepNumber }, { onConflict: "user_id,step_number", ignoreDuplicates: true });
  if (error) return { error: error.message };

  revalidatePath("/journey");
  revalidatePath("/dashboard");
  return { ok: true };
}

type ModuleRow = Record<string, string | number | null>;

function pick(m: ModuleRow | undefined, field: string, lang: "en" | "id"): string {
  if (!m) return "";
  const idVal = lang === "id" ? m[`${field}_id`] : null;
  return String(idVal || m[field] || "");
}

/**
 * One personalised coach question for this step, built from the step itself
 * plus the person's earlier journal answers. Cached on the journal row.
 */
export async function getStepAiQuestion(stepNumber: number): Promise<string | null> {
  try {
    if (!validStep(stepNumber)) return null;
    const { supabase, user, lang } = await getUserAndLang();
    if (!user) return null;

    const { data: existing } = await supabase
      .from("challenge_journal_entries")
      .select("ai_question")
      .eq("user_id", user.id)
      .eq("day_number", stepNumber)
      .maybeSingle();
    if (existing?.ai_question) return existing.ai_question;

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) return null;

    const admin = createAdminClient();
    const [{ data: modules }, { data: earlier }] = await Promise.all([
      admin.from("challenge_modules")
        .select("day_number, title, title_id, core_idea, core_idea_id, personal_reflection_q1, personal_reflection_q1_id, personal_reflection_q2, personal_reflection_q2_id"),
      supabase.from("challenge_journal_entries")
        .select("day_number, answer_1, answer_2, ai_question, ai_answer, updated_at")
        .eq("user_id", user.id)
        .neq("day_number", stepNumber)
        .order("updated_at", { ascending: false })
        .limit(20),
    ]);

    const modMap = new Map<number, ModuleRow>((modules ?? []).map(m => [m.day_number as number, m as ModuleRow]));
    const current = modMap.get(stepNumber);
    if (!current) return null;

    const stepLabel = lang === "id" ? "Langkah" : "Step";
    const thisStep = [
      `${stepLabel} ${stepNumber}: ${pick(current, "title", lang)}`,
      pick(current, "core_idea", lang),
      `Q1: ${pick(current, "personal_reflection_q1", lang)}`,
      `Q2: ${pick(current, "personal_reflection_q2", lang)}`,
    ].filter(Boolean).join("\n");

    const filled = (earlier ?? [])
      .filter(e => e.answer_1?.trim() || e.answer_2?.trim() || e.ai_answer?.trim())
      .slice(0, 8);

    const history = filled.map(e => {
      const mod = modMap.get(e.day_number);
      const lines = [`${stepLabel} ${e.day_number}: ${pick(mod, "title", lang)}`];
      if (e.answer_1?.trim()) lines.push(`Q: ${pick(mod, "personal_reflection_q1", lang)}\nA: ${e.answer_1.trim()}`);
      if (e.answer_2?.trim()) lines.push(`Q: ${pick(mod, "personal_reflection_q2", lang)}\nA: ${e.answer_2.trim()}`);
      if (e.ai_question && e.ai_answer?.trim()) lines.push(`Q: ${e.ai_question}\nA: ${e.ai_answer.trim()}`);
      return lines.join("\n");
    }).join("\n\n");

    const prompt = lang === "id"
      ? `Kamu adalah pelatih untuk perjalanan kepemimpinan 60 langkah. Orang ini baru menyelesaikan langkah di bawah. Tuliskan SATU pertanyaan refleksi pribadi untuk mereka.

Aturan:
- Hubungkan dengan inti langkah ini.${history ? "\n- Gunakan jawaban jurnal mereka sebelumnya agar pertanyaannya terasa pribadi. Sentuh celah, pola, atau ketegangan nyata dalam apa yang mereka tulis." : ""}
- Jangan ulangi Q1 atau Q2.
- Bahasa Indonesia sehari-hari yang natural. Tidak ada jargon.
- Singkat dan langsung. Satu kalimat. Kurang dari 20 kata.
- Terdengar seperti orang nyata yang berbicara, bukan buku teks.

Contoh buruk: "Asumsi dasar apa yang memposisikan bisnismu sebagai kekuatan berlawanan daripada lingkup bagi roh yang kamu nurture?"
Contoh baik: "Seperti apa jadinya jika imanmu benar-benar membentuk cara kamu memimpin timmu minggu ini?"

Kembalikan hanya pertanyaannya. Tidak ada yang lain.

LANGKAH INI:
${thisStep}${history ? `\n\nJAWABAN JURNAL SEBELUMNYA:\n${history}` : ""}`
      : `You are a coach for a 60-step leadership journey. This person just finished the step below. Write ONE personal reflection question for them.

Rules:
- Connect it to the heart of this step.${history ? "\n- Use their earlier journal answers so the question feels personal. Touch a real gap, pattern, or tension in what they wrote." : ""}
- Do not repeat Q1 or Q2.
- Plain, everyday English. No jargon, no academic language.
- Short and direct. One sentence. Under 20 words.
- Sound like a real person talking, not a textbook.

Bad example: "What foundational assumption positions your business as an opposing force rather than a sphere for your nurtured spirit?"
Good example: "What would it look like if your faith actually shaped how you ran your business this week?"

Return only the question. Nothing else.

THIS STEP:
${thisStep}${history ? `\n\nEARLIER JOURNAL ANSWERS:\n${history}` : ""}`;

    const ai = new GoogleGenAI({ apiKey });
    const result = await ai.models.generateContent({ model: "gemini-2.5-flash", contents: prompt });
    const question = result.text?.trim().replace(/^["“]|["”]$/g, "");
    if (!question) return null;

    await supabase
      .from("challenge_journal_entries")
      .upsert({ user_id: user.id, day_number: stepNumber, ai_question: question }, { onConflict: "user_id,day_number" });

    return question;
  } catch {
    return null;
  }
}

export async function saveStepJournal(
  stepNumber: number,
  answer1: string,
  answer2: string,
  aiQuestion: string | null,
  aiAnswer: string,
) {
  if (!validStep(stepNumber)) return { error: "Invalid step" };
  const { supabase, user } = await getUserAndLang();
  if (!user) return { error: "Not signed in" };

  const row: Record<string, unknown> = {
    user_id: user.id,
    day_number: stepNumber,
    answer_1: answer1,
    answer_2: answer2,
    ai_answer: aiAnswer,
    updated_at: new Date().toISOString(),
  };
  if (aiQuestion) row.ai_question = aiQuestion;

  const { error } = await supabase
    .from("challenge_journal_entries")
    .upsert(row, { onConflict: "user_id,day_number" });
  if (error) return { error: error.message };

  revalidatePath("/journey/journal");
  return { ok: true };
}

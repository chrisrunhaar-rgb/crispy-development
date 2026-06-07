import { redirect } from "next/navigation";
import Link from "next/link";
import { cookies } from "next/headers";
import { GoogleGenAI } from "@google/genai";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import JournalList from "./JournalList";

export const metadata = { title: "My Journal — Influential Leadership Challenge" };

const navy   = "oklch(22% 0.10 260)";
const orange = "oklch(65% 0.15 45)";
const mid    = "oklch(52% 0.008 260)";

type JournalEntry = { day_number: number; answer_1: string | null; answer_2: string | null; updated_at: string };
type Module = {
  day_number: number;
  title: string;
  title_id: string | null;
  personal_reflection_q1: string | null;
  personal_reflection_q1_id: string | null;
  personal_reflection_q2: string | null;
  personal_reflection_q2_id: string | null;
};

type NormalizedModule = { day_number: number; title: string; personal_reflection_q1: string | null; personal_reflection_q2: string | null };

function normalizeModules(modules: Module[], lang: string): Record<number, NormalizedModule> {
  return Object.fromEntries(
    modules.map(m => [
      m.day_number,
      {
        day_number: m.day_number,
        title: (lang === "id" && m.title_id) ? m.title_id : m.title,
        personal_reflection_q1: (lang === "id" && m.personal_reflection_q1_id) ? m.personal_reflection_q1_id : m.personal_reflection_q1,
        personal_reflection_q2: (lang === "id" && m.personal_reflection_q2_id) ? m.personal_reflection_q2_id : m.personal_reflection_q2,
      },
    ])
  );
}

async function getAiPrompt(
  userId: string,
  entries: JournalEntry[],
  normalizedMap: Record<number, NormalizedModule>,
  admin: ReturnType<typeof createAdminClient>,
  lang: string
): Promise<string | null> {
  try {
    const today = new Date().toISOString().slice(0, 10);
    const cacheKey = lang === "id" ? `${today}_id` : today;

    const { data: cached } = await admin
      .from("challenge_ai_journal_prompts")
      .select("prompt_text")
      .eq("user_id", userId)
      .eq("generated_date", cacheKey)
      .maybeSingle();
    if (cached?.prompt_text) return cached.prompt_text;

    const filledEntries = entries.filter(e => e.answer_1?.trim() || e.answer_2?.trim());
    if (filledEntries.length < 2) return null;

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) return null;

    const context = filledEntries.map(e => {
      const mod = normalizedMap[e.day_number];
      const lines: string[] = [`${lang === "id" ? "Hari" : "Day"} ${e.day_number}: ${mod?.title ?? ""}`];
      if (mod?.personal_reflection_q1 && e.answer_1?.trim())
        lines.push(`Q: ${mod.personal_reflection_q1}\nA: ${e.answer_1.trim()}`);
      if (mod?.personal_reflection_q2 && e.answer_2?.trim())
        lines.push(`Q: ${mod.personal_reflection_q2}\nA: ${e.answer_2.trim()}`);
      return lines.join("\n");
    }).join("\n\n");

    const prompt = lang === "id"
      ? `Kamu adalah pelatih untuk tantangan kepemimpinan 60 hari. Baca entri jurnal ini dan tuliskan SATU pertanyaan untuk mendorong pemikiran orang ini maju.

Aturan:
- Bahasa Indonesia sehari-hari yang natural. Tidak ada jargon.
- Singkat dan langsung. Satu kalimat. Kurang dari 20 kata.
- Tanyakan sesuatu yang belum mereka jawab — celah atau ketegangan nyata dalam apa yang mereka tulis.
- Terdengar seperti orang nyata yang berbicara, bukan buku teks.

Contoh buruk: "Asumsi dasar apa yang memposisikan bisnismu sebagai kekuatan berlawanan daripada lingkup bagi roh yang kamu nurture?"
Contoh baik: "Seperti apa jadinya jika imanmu benar-benar membentuk cara kamu memimpin timmu minggu ini?"

Kembalikan hanya pertanyaannya. Tidak ada yang lain.

ENTRI JURNAL:
${context}`
      : `You are a coach for a 60-day leadership challenge. Read these journal entries and write ONE question to push the person's thinking forward.

Rules:
- Plain, everyday English. No jargon, no academic language.
- Short and direct. One sentence. Under 20 words.
- Ask something they haven't answered yet — a genuine gap or tension in what they wrote.
- Sound like a real person talking, not a textbook.

Bad example: "What foundational assumption positions your business as an opposing force rather than a sphere for your nurtured spirit?"
Good example: "What would it look like if your faith actually shaped how you ran your business this week?"

Return only the question. Nothing else.

JOURNAL ENTRIES:
${context}`;

    const ai = new GoogleGenAI({ apiKey });
    const result = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
    });
    const question = result.text?.trim();
    if (!question) return null;

    await admin
      .from("challenge_ai_journal_prompts")
      .upsert({ user_id: userId, prompt_text: question, generated_date: cacheKey });

    return question;
  } catch {
    return null;
  }
}

export default async function ChallengeJournalPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login?next=/challenge/journal");

  const cookieStore = await cookies();
  const cookieLang = cookieStore.get("crispy-lang")?.value;
  const metaLang = (user.user_metadata as Record<string, unknown>)?.language_preference as string | undefined;
  const lang = ((metaLang ?? cookieLang ?? "en") === "id" ? "id" : "en");

  const admin = createAdminClient();

  const [{ data: rawEntries }, { data: rawModules }] = await Promise.all([
    admin
      .from("challenge_journal_entries")
      .select("day_number, answer_1, answer_2, updated_at")
      .eq("user_id", user.id)
      .order("day_number", { ascending: true }),
    admin
      .from("challenge_modules")
      .select("day_number, title, title_id, personal_reflection_q1, personal_reflection_q1_id, personal_reflection_q2, personal_reflection_q2_id")
      .order("day_number", { ascending: true }),
  ]);

  const entries = (rawEntries ?? []) as JournalEntry[];
  const modules = (rawModules ?? []) as Module[];
  const normalizedMap = normalizeModules(modules, lang);

  const firstName = (user.user_metadata?.first_name as string | undefined) ?? "there";
  const entryCount = entries.filter(e => e.answer_1?.trim() || e.answer_2?.trim()).length;

  const aiPrompt = await getAiPrompt(user.id, entries, normalizedMap, admin, lang);

  const isId = lang === "id";
  const s = {
    back: isId ? "← Dasbor" : "← Dashboard",
    myJournal: isId ? "Jurnal Saya" : "My Journal",
    entryCount: entryCount === 1
      ? (isId ? `${entryCount} entri` : `${entryCount} entry`)
      : (isId ? `${entryCount} entri` : `${entryCount} entries`),
    challengeName: isId ? "Tantangan Kepemimpinan Berpengaruh" : "Influential Leadership Challenge",
    heading: isId ? `Jurnal ${firstName}` : `${firstName}'s Journal`,
    private: isId ? "Refleksi pribadimu, hanya untuk kamu." : "Your personal reflections, private to you.",
    aiLabel: isId ? "AI Coach · Pertanyaan Hari Ini" : "AI Coach · Today's Question",
    noEntries: isId ? "Belum ada entri jurnal. Mulai menulis refleksimu pada sesi harian." : "No journal entries yet. Start writing reflections on your daily sessions.",
    goToDashboard: isId ? "Pergi ke Dasbor" : "Go to Dashboard",
  };

  return (
    <div style={{ minHeight: "calc(100dvh - 80px)", background: "oklch(97% 0.005 80)" }}>
      {/* Top bar */}
      <div style={{ background: navy, padding: "0.875rem clamp(1rem, 4vw, 2rem)", display: "flex", alignItems: "center", justifyContent: "space-between", gap: "1rem" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "0.875rem" }}>
          <Link href="/dashboard" style={{ color: "oklch(72% 0.04 260)", textDecoration: "none", fontSize: "0.75rem", fontFamily: "var(--font-montserrat)", display: "flex", alignItems: "center", gap: "0.25rem" }}>
            {s.back}
          </Link>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/il-challenge-icon.png" alt="" width={28} height={28} style={{ borderRadius: "50%", objectFit: "cover" }} />
          <span style={{ fontFamily: "var(--font-montserrat)", fontSize: "0.7rem", fontWeight: 700, color: "oklch(97% 0.005 80)", letterSpacing: "0.08em", textTransform: "uppercase" }}>
            {s.myJournal}
          </span>
        </div>
        <span style={{ fontFamily: "var(--font-montserrat)", fontSize: "0.7rem", color: "oklch(65% 0.04 260)" }}>
          {s.entryCount}
        </span>
      </div>

      <div style={{ maxWidth: "680px", margin: "0 auto", padding: "clamp(1.5rem, 4vw, 2.5rem) clamp(1rem, 4vw, 2rem)" }}>

        {/* Header */}
        <div style={{ marginBottom: "2rem" }}>
          <p style={{ fontFamily: "var(--font-montserrat)", fontSize: "0.62rem", fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", color: orange, marginBottom: "0.375rem" }}>
            {s.challengeName}
          </p>
          <h1 style={{ fontFamily: "var(--font-montserrat)", fontWeight: 900, fontSize: "clamp(1.375rem, 3vw, 1.75rem)", color: navy, lineHeight: 1.2 }}>
            {s.heading}
          </h1>
          <p style={{ fontFamily: "var(--font-montserrat)", fontSize: "0.875rem", color: mid, marginTop: "0.5rem", lineHeight: 1.6 }}>
            {s.private}
          </p>
        </div>

        {/* AI Reflection Prompt */}
        {aiPrompt && (
          <div style={{ background: navy, borderRadius: "12px", padding: "1.5rem", marginBottom: "2rem" }}>
            <p style={{ fontFamily: "var(--font-montserrat)", fontSize: "0.58rem", fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", color: orange, marginBottom: "0.75rem" }}>
              {s.aiLabel}
            </p>
            <p style={{ fontFamily: "var(--font-cormorant)", fontWeight: 600, fontSize: "clamp(1.1rem, 2.5vw, 1.3rem)", color: "white", lineHeight: 1.55, margin: 0 }}>
              {aiPrompt}
            </p>
          </div>
        )}

        {entries.length === 0 ? (
          <div style={{ textAlign: "center", padding: "3rem 1rem" }}>
            <p style={{ fontFamily: "var(--font-montserrat)", fontSize: "0.9rem", color: mid, lineHeight: 1.6, marginBottom: "1.25rem" }}>
              {s.noEntries}
            </p>
            <Link
              href="/dashboard"
              style={{ fontFamily: "var(--font-montserrat)", fontWeight: 700, fontSize: "0.875rem", color: "white", background: navy, padding: "0.75rem 1.75rem", borderRadius: "8px", textDecoration: "none", display: "inline-block" }}
            >
              {s.goToDashboard}
            </Link>
          </div>
        ) : (
          <JournalList
            entries={entries}
            moduleMap={normalizedMap}
          />
        )}
      </div>
    </div>
  );
}

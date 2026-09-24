import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";

const navy     = "oklch(22% 0.10 260)";
const orange   = "oklch(65% 0.15 45)";
const offWhite = "oklch(97% 0.005 80)";
const mid      = "oklch(52% 0.008 260)";

export const metadata = { title: "My Journal | Influential Leadership Journey" };

export default async function JourneyJournalPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login?next=/journey/journal");

  const cookieStore = await cookies();
  const metaLang = (user.user_metadata as Record<string, unknown>)?.language_preference as string | undefined;
  const isId = (metaLang ?? cookieStore.get("crispy-lang")?.value ?? "en") === "id";

  const admin = createAdminClient();
  const [{ data: entries }, { data: modules }] = await Promise.all([
    supabase.from("challenge_journal_entries")
      .select("day_number, answer_1, answer_2, ai_question, ai_answer, updated_at")
      .eq("user_id", user.id)
      .order("day_number"),
    admin.from("challenge_modules")
      .select("day_number, title, title_id, personal_reflection_q1, personal_reflection_q1_id, personal_reflection_q2, personal_reflection_q2_id"),
  ]);

  const modMap = new Map((modules ?? []).map(m => [m.day_number as number, m]));
  const pick = (m: Record<string, unknown> | undefined, f: string) =>
    ((isId && m?.[`${f}_id`]) || m?.[f] || "") as string;

  const filled = (entries ?? []).filter(e =>
    e.answer_1?.trim() || e.answer_2?.trim() || e.ai_answer?.trim()
  );

  const t = isId
    ? { back: "← Perjalanan", eyebrow: "Perjalanan Kepemimpinan yang Berpengaruh", title: "Jurnal saya", intro: "Semua refleksimu dari perjalanan ini, di satu tempat. Hanya kamu yang bisa melihatnya.", empty: "Belum ada jawaban jurnal. Selesaikan satu langkah dan tuliskan refleksimu.", start: "Ke perjalanan", step: "Langkah", edit: "Buka langkah ini", noAnswer: "Belum dijawab" }
    : { back: "← Journey", eyebrow: "Influential Leadership Journey", title: "My journal", intro: "All your reflections from the journey, in one place. Only you can see them.", empty: "No journal answers yet. Complete a step and write down your reflections.", start: "Go to the journey", step: "Step", edit: "Open this step", noAnswer: "Not answered yet" };

  const qa = (q: string, a: string | null | undefined, key: string) => q ? (
    <div key={key} style={{ marginBottom: "1rem" }}>
      <p style={{ fontFamily: "var(--font-montserrat)", fontSize: "0.82rem", fontWeight: 600, color: navy, lineHeight: 1.5, margin: "0 0 0.35rem" }}>{q}</p>
      <p style={{ fontFamily: "var(--font-montserrat)", fontSize: "0.88rem", color: a?.trim() ? "oklch(30% 0.008 260)" : mid, fontStyle: a?.trim() ? "normal" : "italic", lineHeight: 1.7, margin: 0, whiteSpace: "pre-wrap" }}>
        {a?.trim() || t.noAnswer}
      </p>
    </div>
  ) : null;

  return (
    <div style={{ minHeight: "100vh", background: offWhite }}>
      <header style={{ background: navy, color: offWhite, padding: "1.25rem 1rem 2rem" }}>
        <div style={{ maxWidth: 760, margin: "0 auto" }}>
          <Link href="/journey" style={{ fontFamily: "var(--font-montserrat)", fontSize: "0.75rem", fontWeight: 600, color: "oklch(80% 0.03 260)", textDecoration: "none" }}>{t.back}</Link>
          <p style={{ fontFamily: "var(--font-montserrat)", fontWeight: 700, fontSize: "0.68rem", letterSpacing: "0.14em", textTransform: "uppercase", color: orange, margin: "1.5rem 0 0.5rem" }}>{t.eyebrow}</p>
          <h1 style={{ fontFamily: "var(--font-cormorant)", fontWeight: 600, fontSize: "clamp(2rem, 5vw, 2.75rem)", lineHeight: 1.1, margin: 0 }}>{t.title}</h1>
          <p style={{ fontFamily: "var(--font-montserrat)", fontSize: "0.88rem", lineHeight: 1.6, color: "oklch(85% 0.02 260)", margin: "0.75rem 0 0" }}>{t.intro}</p>
        </div>
      </header>

      <main style={{ maxWidth: 760, margin: "0 auto", padding: "2rem 1rem 4rem" }}>
        {filled.length === 0 ? (
          <div style={{ background: "white", border: "1px solid oklch(88% 0.006 80)", borderRadius: 12, padding: "2rem", textAlign: "center" }}>
            <p style={{ fontFamily: "var(--font-montserrat)", fontSize: "0.9rem", color: mid, lineHeight: 1.6, margin: "0 0 1.25rem" }}>{t.empty}</p>
            <Link href="/journey" style={{ fontFamily: "var(--font-montserrat)", fontWeight: 700, fontSize: "0.85rem", color: navy, background: orange, padding: "0.75rem 1.4rem", borderRadius: 8, textDecoration: "none", display: "inline-block" }}>{t.start}</Link>
          </div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
            {filled.map((e, i) => {
              const m = modMap.get(e.day_number) as Record<string, unknown> | undefined;
              return (
                <details key={e.day_number} open={i === filled.length - 1} style={{ background: "white", border: "1px solid oklch(88% 0.006 80)", borderRadius: 12, padding: "1rem 1.25rem" }}>
                  <summary style={{ cursor: "pointer", fontFamily: "var(--font-montserrat)", listStylePosition: "outside" }}>
                    <span style={{ fontWeight: 700, fontSize: "0.65rem", letterSpacing: "0.12em", textTransform: "uppercase", color: orange, marginRight: "0.6rem" }}>{t.step} {e.day_number}</span>
                    <span style={{ fontWeight: 700, fontSize: "0.95rem", color: navy }}>{pick(m, "title")}</span>
                  </summary>
                  <div style={{ marginTop: "1rem" }}>
                    {qa(pick(m, "personal_reflection_q1"), e.answer_1, "q1")}
                    {qa(pick(m, "personal_reflection_q2"), e.answer_2, "q2")}
                    {e.ai_question && qa(e.ai_question, e.ai_answer, "ai")}
                    <Link href={`/journey/step/${e.day_number}`} style={{ fontFamily: "var(--font-montserrat)", fontWeight: 700, fontSize: "0.78rem", color: navy }}>{t.edit} →</Link>
                  </div>
                </details>
              );
            })}
          </div>
        )}
      </main>
    </div>
  );
}

import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";

const navy     = "oklch(30% 0.12 260)";
const rule     = "oklch(84% 0.01 80)";
const text     = "oklch(32% 0.06 260)";
const orangeDeep = "oklch(58% 0.16 45)";
const orange   = "oklch(65% 0.15 45)";
const offWhite = "oklch(97% 0.005 80)";
const mid      = "oklch(48% 0.04 260)";

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
      <p style={{ fontFamily: "var(--font-montserrat)", fontSize: "0.88rem", color: a?.trim() ? text : mid, fontStyle: a?.trim() ? "normal" : "italic", lineHeight: 1.7, margin: 0, whiteSpace: "pre-wrap" }}>
        {a?.trim() || t.noAnswer}
      </p>
    </div>
  ) : null;

  return (
    <div className="jrn" style={{ minHeight: "100vh", background: offWhite }}>
      <style>{`.jrn a:focus-visible, .jrn button:focus-visible, .jrn summary:focus-visible, .jrn textarea:focus-visible { outline: 2px solid oklch(65% 0.15 45); outline-offset: 3px; } @media (prefers-reduced-motion: reduce) { .jrn *, .jrn *::before, .jrn *::after { transition: none !important; animation: none !important; } }`}</style>
      <header style={{ background: offWhite, color: navy, padding: "1.25rem 1rem 2rem", borderBottom: `1px solid ${rule}` }}>
        <div style={{ maxWidth: 760, margin: "0 auto" }}>
          <Link href="/journey" style={{ fontFamily: "var(--font-montserrat)", fontSize: "0.75rem", fontWeight: 600, color: mid, textDecoration: "none" }}>{t.back}</Link>
          <p style={{ fontFamily: "var(--font-montserrat)", fontWeight: 700, fontSize: "0.68rem", letterSpacing: "0.14em", textTransform: "uppercase", color: orangeDeep, margin: "1.5rem 0 0.5rem" }}>{t.eyebrow}</p>
          <h1 style={{ fontFamily: "var(--font-cormorant)", fontStyle: "italic", fontWeight: 500, fontSize: "clamp(2.1rem, 5vw, 2.9rem)", lineHeight: 1.05, color: navy, margin: 0 }}>{t.title}</h1>
          <p style={{ fontFamily: "var(--font-montserrat)", fontSize: "0.88rem", lineHeight: 1.6, color: text, margin: "0.75rem 0 0" }}>{t.intro}</p>
        </div>
      </header>

      <main style={{ maxWidth: 760, margin: "0 auto", padding: "2rem 1rem 4rem" }}>
        {filled.length === 0 ? (
          <div style={{ background: "oklch(90.5% 0.012 80)", borderTop: `2px solid ${orange}`, padding: "2rem", textAlign: "center" }}>
            <p style={{ fontFamily: "var(--font-montserrat)", fontSize: "0.9rem", color: mid, lineHeight: 1.6, margin: "0 0 1.25rem" }}>{t.empty}</p>
            <Link href="/journey" style={{ fontFamily: "var(--font-montserrat)", fontWeight: 700, fontSize: "0.85rem", color: offWhite, background: navy, padding: "0.8rem 1.4rem", textDecoration: "none", display: "inline-block" }}>{t.start}</Link>
          </div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", borderTop: `1px solid ${navy}` }}>
            {filled.map((e, i) => {
              const m = modMap.get(e.day_number) as Record<string, unknown> | undefined;
              return (
                <details key={e.day_number} open={i === filled.length - 1} style={{ borderBottom: `1px solid ${rule}`, padding: "1.1rem 0" }}>
                  <summary style={{ cursor: "pointer", fontFamily: "var(--font-montserrat)", listStylePosition: "outside" }}>
                    <span style={{ fontWeight: 700, fontSize: "0.65rem", letterSpacing: "0.12em", textTransform: "uppercase", color: orangeDeep, marginRight: "0.6rem" }}>{t.step} {e.day_number}</span>
                    <span style={{ fontFamily: "var(--font-cormorant)", fontStyle: "italic", fontWeight: 500, fontSize: "1.3rem", color: navy }}>{pick(m, "title")}</span>
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

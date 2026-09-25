import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import StonePath, { type PathStep } from "./StonePath";

const navy    = "oklch(30% 0.12 260)";
const muted   = "oklch(48% 0.04 260)";
const text    = "oklch(32% 0.06 260)";
const rule    = "oklch(84% 0.01 80)";
const orangeDeep = "oklch(58% 0.16 45)";
const orange  = "oklch(65% 0.15 45)";
const green   = "oklch(55% 0.14 150)";
const offWhite = "oklch(97% 0.005 80)";

export const metadata = { title: "Influential Leadership Journey | Crispy Development" };

export default async function JourneyPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login?next=/journey");

  const cookieStore = await cookies();
  const metaLang = (user.user_metadata as Record<string, unknown>)?.language_preference as string | undefined;
  const lang = ((metaLang ?? cookieStore.get("crispy-lang")?.value ?? "en") === "id" ? "id" : "en") as "en" | "id";
  const isId = lang === "id";

  const admin = createAdminClient();
  const [{ data: modules }, { data: completions }] = await Promise.all([
    admin.from("challenge_modules")
      .select("day_number, title, title_id, chapter_title, chapter_title_id")
      .order("day_number"),
    supabase.from("journey_step_completions")
      .select("step_number")
      .eq("user_id", user.id),
  ]);

  const rows = (modules ?? []).filter(m => m.day_number >= 1 && m.day_number <= 60);
  const steps: PathStep[] = rows.map((m, i) => {
    const prev = rows[i - 1];
    return {
      n: m.day_number,
      title: (isId && m.title_id) || m.title || "",
      chapter: (isId && m.chapter_title_id) || m.chapter_title || null,
      chapterStart: !prev || prev.chapter_title !== m.chapter_title,
    };
  });

  const completed = (completions ?? []).map(c => c.step_number as number);
  const doneSet = new Set(completed);
  const total = steps.length || 60;
  const doneCount = steps.filter(s => doneSet.has(s.n)).length;
  const nextStep = steps.find(s => !doneSet.has(s.n))?.n ?? null;
  const pct = Math.round((doneCount / total) * 100);

  const t = isId
    ? {
        eyebrow: "Perjalanan Kepemimpinan yang Berpengaruh",
        title: "Satu langkah pada satu waktu",
        intro: "60 langkah untuk memimpin dari hati. Mulailah dari batu yang menyala, atau pilih langkah mana pun yang ingin kamu jelajahi.",
        authorPre: "Semua isi modul ini diambil dari buku T.J. Addington, ",
        authorPost: ". Kami berterima kasih kepadanya atas izin untuk menggunakan materi ini, sehingga lebih banyak orang dapat berfokus pada kepemimpinan berpengaruh yang mengubah hidup.",
        progress: `${doneCount} dari ${total} langkah selesai`,
        cont: nextStep ? `Lanjutkan: Langkah ${nextStep}` : "Lihat perjalananmu",
        start: "Mulai: Langkah 1",
        journal: "Jurnal saya",
        done: "Selesai",
        next: "Langkah berikutnya",
        open: "Belum dimulai",
        finished: "Kamu telah menyelesaikan seluruh 60 langkah. Luar biasa.",
        back: "← Dasbor",
      }
    : {
        eyebrow: "Influential Leadership Journey",
        title: "One step at a time",
        intro: "60 steps to lead from the heart. Start with the glowing stone, or pick any step you want to explore.",
        authorPre: "All module content comes from T.J. Addington's book ",
        authorPost: ". We are grateful for his approval to use this material, so it can help more people focus on life-changing influential leadership.",
        progress: `${doneCount} of ${total} steps completed`,
        cont: nextStep ? `Continue: Step ${nextStep}` : "View your journey",
        start: "Start: Step 1",
        journal: "My journal",
        done: "Completed",
        next: "Next step",
        open: "Not started",
        finished: "You have completed all 60 steps. Well done.",
        back: "← Dashboard",
      };

  const btnBase = {
    display: "inline-block",
    fontFamily: "var(--font-montserrat)",
    fontWeight: 700,
    fontSize: "0.8rem",
    letterSpacing: "0.04em",
    padding: "0.75rem 1.25rem",
    textDecoration: "none",
  } as const;

  const legendDot = (bg: string, extra?: React.CSSProperties) => (
    <span style={{ display: "inline-block", width: 16, height: 12, borderRadius: "45% 55% 50% 40%", background: bg, ...extra }} />
  );

  return (
    <div className="jrn" style={{ minHeight: "100vh", background: offWhite }}>
      <style>{`.jrn a:focus-visible, .jrn button:focus-visible, .jrn summary:focus-visible, .jrn textarea:focus-visible { outline: 2px solid oklch(65% 0.15 45); outline-offset: 3px; } @media (prefers-reduced-motion: reduce) { .jrn *, .jrn *::before, .jrn *::after { transition: none !important; animation: none !important; } }`}</style>
      <header style={{ background: offWhite, color: navy, padding: "1.25rem 1rem 2rem", borderBottom: `1px solid ${rule}` }}>
        <div style={{ maxWidth: 1080, margin: "0 auto" }}>
          <Link href="/dashboard" style={{ fontFamily: "var(--font-montserrat)", fontSize: "0.75rem", fontWeight: 600, color: muted, textDecoration: "none" }}>
            {t.back}
          </Link>
          <p style={{ fontFamily: "var(--font-montserrat)", fontWeight: 700, fontSize: "0.68rem", letterSpacing: "0.14em", textTransform: "uppercase", color: orangeDeep, margin: "1.5rem 0 0.5rem" }}>
            {t.eyebrow}
          </p>
          <h1 style={{ fontFamily: "var(--font-cormorant)", fontStyle: "italic", fontWeight: 500, fontSize: "clamp(2.1rem, 5vw, 3.1rem)", lineHeight: 1.05, color: navy, margin: 0 }}>
            {t.title}
          </h1>
          <p style={{ fontFamily: "var(--font-montserrat)", fontSize: "0.9rem", lineHeight: 1.6, color: text, maxWidth: 560, margin: "0.75rem 0 1.5rem" }}>
            {t.intro}
          </p>
          <p style={{ fontFamily: "var(--font-montserrat)", fontSize: "0.78rem", lineHeight: 1.6, color: muted, maxWidth: 560, margin: "-0.75rem 0 1.5rem", paddingLeft: "0.75rem", borderLeft: `2px solid ${orange}` }}>
            {t.authorPre}<em>Deep Influence</em>{t.authorPost}
          </p>

          <div style={{ maxWidth: 420 }}>
            <div style={{ display: "flex", justifyContent: "space-between", fontFamily: "var(--font-montserrat)", fontSize: "0.75rem", fontWeight: 600, color: text, marginBottom: "0.4rem" }}>
              <span>{t.progress}</span>
              <span>{pct}%</span>
            </div>
            <div style={{ height: 6, background: rule, overflow: "hidden" }}>
              <div style={{ width: `${pct}%`, height: "100%", background: green }} />
            </div>
          </div>

          <div style={{ display: "flex", flexWrap: "wrap", gap: "0.75rem", marginTop: "1.5rem" }}>
            {nextStep && (
              <Link href={`/journey/step/${nextStep}`} style={{ ...btnBase, background: navy, color: offWhite }}>
                {doneCount === 0 ? t.start : t.cont} →
              </Link>
            )}
            <Link href="/journey/journal" style={{ ...btnBase, background: "transparent", color: navy, border: `1px solid ${navy}` }}>
              {t.journal}
            </Link>
          </div>
          {!nextStep && (
            <p style={{ fontFamily: "var(--font-montserrat)", fontWeight: 600, fontSize: "0.9rem", color: "oklch(45% 0.12 150)", marginTop: "1rem" }}>{t.finished}</p>
          )}
        </div>
      </header>

      <main style={{ maxWidth: 1080, margin: "0 auto", padding: "1.5rem 1rem 4rem" }}>
        <div style={{ display: "flex", flexWrap: "wrap", gap: "1.25rem", fontFamily: "var(--font-montserrat)", fontSize: "0.72rem", fontWeight: 600, color: muted, marginBottom: "0.5rem" }}>
          <span style={{ display: "inline-flex", alignItems: "center", gap: "0.4rem" }}>{legendDot(green)} {t.done}</span>
          <span style={{ display: "inline-flex", alignItems: "center", gap: "0.4rem" }}>{legendDot("oklch(72% 0.025 65)", { boxShadow: `0 0 0 2px ${orange}, 0 0 8px ${orange}` })} {t.next}</span>
          <span style={{ display: "inline-flex", alignItems: "center", gap: "0.4rem" }}>{legendDot("oklch(72% 0.025 65)")} {t.open}</span>
        </div>

        <StonePath steps={steps} completed={completed} nextStep={nextStep} lang={lang} />
      </main>
    </div>
  );
}

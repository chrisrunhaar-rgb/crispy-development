import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import type { PathStep } from "../StonePath";
import IcebergMap from "./IcebergMap";

const navy    = "oklch(30% 0.12 260)";
const muted   = "oklch(48% 0.04 260)";
const text    = "oklch(32% 0.06 260)";
const rule    = "oklch(84% 0.01 80)";
const orangeDeep = "oklch(58% 0.16 45)";
const green   = "oklch(55% 0.14 150)";
const offWhite = "oklch(97% 0.005 80)";

export const metadata = {
  title: "Iceberg preview | Crispy Development",
  robots: { index: false, follow: false },
};

// Preview of the 3D iceberg map. Replaces the stone path on /journey once approved.
export default async function IcebergPreviewPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login?next=/journey/iceberg");

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
        eyebrow: "Pratinjau",
        title: "Apa yang ada di bawah permukaan",
        intro: "Di atas air adalah apa yang orang lihat dari seorang pemimpin. Ke-60 langkah ada di bawahnya. Seret untuk memutar, perbesar untuk melihat lebih dekat, dan ketuk sebuah sisi untuk membuka langkahnya.",
        progress: `${doneCount} dari ${total} langkah selesai`,
        back: "← Kembali ke perjalanan",
      }
    : {
        eyebrow: "Preview",
        title: "What lies beneath the surface",
        intro: "Above the water is what people see of a leader. All 60 steps sit below it. Drag to turn the iceberg, zoom in for a closer look, and tap a facet to open its step.",
        progress: `${doneCount} of ${total} steps completed`,
        back: "← Back to the journey",
      };

  return (
    <div className="jrn" style={{ minHeight: "100vh", background: offWhite }}>
      <style>{`.jrn a:focus-visible, .jrn button:focus-visible { outline: 2px solid oklch(65% 0.15 45); outline-offset: 3px; } @media (prefers-reduced-motion: reduce) { .jrn *, .jrn *::before, .jrn *::after { transition: none !important; animation: none !important; } }`}</style>
      <header style={{ background: offWhite, color: navy, padding: "1.25rem 1rem 1.5rem", borderBottom: `1px solid ${rule}` }}>
        <div style={{ maxWidth: 1080, margin: "0 auto" }}>
          <Link href="/journey" style={{ fontFamily: "var(--font-montserrat)", fontSize: "0.75rem", fontWeight: 600, color: muted, textDecoration: "none" }}>
            {t.back}
          </Link>
          <p style={{ fontFamily: "var(--font-montserrat)", fontWeight: 700, fontSize: "0.68rem", letterSpacing: "0.14em", textTransform: "uppercase", color: orangeDeep, margin: "1.25rem 0 0.5rem" }}>
            {t.eyebrow}
          </p>
          <h1 style={{ fontFamily: "var(--font-cormorant)", fontStyle: "italic", fontWeight: 500, fontSize: "clamp(2rem, 5vw, 3rem)", lineHeight: 1.05, color: navy, margin: 0, textWrap: "balance" }}>
            {t.title}
          </h1>
          <p style={{ fontFamily: "var(--font-montserrat)", fontSize: "0.88rem", lineHeight: 1.6, color: text, maxWidth: 580, margin: "0.75rem 0 1.25rem" }}>
            {t.intro}
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
        </div>
      </header>

      <IcebergMap steps={steps} completed={completed} nextStep={nextStep} lang={lang} />
    </div>
  );
}

import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import type { PathStep } from "../StonePath";
import IcebergMap from "./IcebergMap";

const navy    = "oklch(30% 0.12 260)";
const muted   = "oklch(48% 0.04 260)";
const rule    = "oklch(84% 0.01 80)";
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
        intro: "Di atas air adalah apa yang orang lihat dari seorang pemimpin. Kepemimpinan yang Berpengaruh adalah apa yang ada di bawahnya. Seret untuk memutar gunung es, perbesar untuk melihat lebih dekat, dan ketuk sebuah sisi untuk membukanya.",
        progress: `${doneCount} dari ${total} modul selesai`,
        back: "← Kembali ke perjalanan",
      }
    : {
        eyebrow: "Preview",
        title: "What lies beneath the surface",
        intro: "Above the water is what people see of a leader. Influential Leadership is what sits below it. Drag to turn the iceberg, zoom in for a closer look, and tap a facet to open it.",
        progress: `${doneCount} of ${total} modules completed`,
        back: "← Back to the journey",
      };

  return (
    <div className="jrn" style={{ minHeight: "100vh", background: offWhite }}>
      <style>{`.jrn a:focus-visible, .jrn button:focus-visible { outline: 2px solid oklch(65% 0.15 45); outline-offset: 3px; } @media (prefers-reduced-motion: reduce) { .jrn *, .jrn *::before, .jrn *::after { transition: none !important; animation: none !important; } }`}</style>
      <header style={{ background: offWhite, color: navy, padding: "1.25rem 1rem 1.25rem", borderBottom: `1px solid ${rule}` }}>
        <div style={{ maxWidth: 1148, margin: "0 auto" }}>
          <Link href="/journey" style={{ fontFamily: "var(--font-montserrat)", fontSize: "0.75rem", fontWeight: 600, color: muted, textDecoration: "none" }}>
            {t.back}
          </Link>
        </div>
      </header>

      <IcebergMap steps={steps} completed={completed} nextStep={nextStep} lang={lang} heading={{ eyebrow: t.eyebrow, title: t.title, intro: t.intro, progress: t.progress, pct }} />
    </div>
  );
}

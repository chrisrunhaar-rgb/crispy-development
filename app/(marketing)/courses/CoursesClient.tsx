"use client";
import Link from "next/link";
import { useLanguage } from "@/lib/LanguageContext";
import { T, SERIF, SANS, KIT_CSS, Eyebrow, h2Style, bodyStyle, PrimaryLink, TextLink } from "@/components/promo/PromoKit";

type CourseRow = {
  id: string;
  slug: string;
  title: string;
  title_id: string | null;
  description: string | null;
  description_id: string | null;
  is_free: boolean;
  order_index: number;
  course_chapters: { count: number }[];
};

type Props = {
  courses: CourseRow[];
  progressMap: Record<string, number>;
  isLoggedIn: boolean;
};

const CRS_CSS = `
.crs { display: flex; flex-direction: column; gap: clamp(3rem, 7vw, 5.5rem); }
.crs-top { display: grid; grid-template-columns: minmax(0, 1fr); gap: 1.5rem; }
.crs-split { display: grid; grid-template-columns: minmax(0, 1fr); gap: clamp(1.5rem, 4vw, 3rem); }
.crs-row { display: grid; grid-template-columns: 2.5rem minmax(0, 1fr); gap: 0.75rem 1rem; padding-block: clamp(1.75rem, 4vw, 2.5rem); border-bottom: 1px solid ${T.rule}; text-decoration: none; }
.crs-side { grid-column: 2; display: flex; flex-wrap: wrap; align-items: center; gap: 1rem 1.5rem; }
.crs-row:hover .crs-title { color: ${T.navyMid}; }
.crs-row:hover .crs-cta { color: ${T.orangeDeep}; }
.crs-row:focus-visible { outline: 2px solid ${T.orange}; outline-offset: 4px; }
@media (min-width: 960px) {
  .crs-top { grid-template-columns: minmax(0, 7fr) minmax(0, 5fr); align-items: end; }
  .crs-split { grid-template-columns: minmax(0, 5fr) minmax(0, 7fr); }
  .crs-row { grid-template-columns: 2.5rem minmax(0, 1fr) 15rem; align-items: center; column-gap: clamp(1.5rem, 3.5vw, 2.75rem); }
  .crs-side { grid-column: 3; flex-direction: column; align-items: flex-end; text-align: right; }
}
@media (prefers-reduced-motion: reduce) { .crs-title, .crs-cta { transition: none !important; } }
`;

export default function CoursesClient({ courses, progressMap, isLoggedIn }: Props) {
  const { lang } = useLanguage();
  const isId = lang === "id";

  return (
    <div style={{ background: T.offWhite }}>
      <div className="container-wide crs" lang={lang} style={{ paddingBlock: "clamp(2.5rem, 6vw, 4.5rem)" }}>
        <style>{KIT_CSS + CRS_CSS}</style>

        {/* ── TOP: title + intro, no hero ── */}
        <header className="crs-top">
          <div style={{ display: "flex", flexDirection: "column", gap: "0.9rem" }}>
            <Eyebrow>{isId ? "Kursus" : "Courses"}</Eyebrow>
            <h1 style={{ ...h2Style(), fontSize: "clamp(2.1rem, 4.4vw, 3.1rem)", lineHeight: 1.05 }}>
              {isId ? "Kuasai alat yang diandalkan tim Anda." : "Master the tools your team relies on."}
            </h1>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
            <p style={{ ...bodyStyle, maxWidth: "38ch" }}>
              {isId
                ? "Pelatihan langsung untuk pemimpin lintas budaya, sesuai kecepatan Anda sendiri."
                : "Hands-on training for cross-cultural leaders, at your own pace."}
            </p>
            <p style={{ margin: 0, fontFamily: SANS, fontSize: "0.72rem", fontWeight: 600, color: T.muted }}>
              {courses.length} {isId ? "kursus" : "courses"} · {isId ? "Khusus anggota" : "Members only"}
            </p>
          </div>
        </header>

        {/* ── COURSES ── */}
        <section aria-label={isId ? "Kursus" : "Courses"} style={{ borderTop: `1px solid ${T.navy}` }}>
          {courses.map((course, i) => {
            const chapterCount = course.course_chapters?.[0]?.count ?? 0;
            const completed = progressMap[course.id] ?? 0;
            const pct = chapterCount > 0 ? Math.round((completed / chapterCount) * 100) : 0;
            const displayTitle = isId && course.title_id ? course.title_id : course.title;
            const displayDesc = isId && course.description_id ? course.description_id : course.description;

            return (
              <Link key={course.id} href={`/courses/${course.slug}`} className="crs-row">
                <span aria-hidden="true" style={{ fontFamily: SERIF, fontStyle: "italic", fontSize: "1.2rem", color: T.orangeDeep, lineHeight: 1.3 }}>
                  {String(i + 1).padStart(2, "0")}
                </span>

                <div style={{ display: "flex", flexDirection: "column", gap: "0.7rem", minWidth: 0 }}>
                  <h2 className="crs-title" style={{ margin: 0, fontFamily: SERIF, fontStyle: "italic", fontWeight: 500, fontSize: "clamp(1.5rem, 2.8vw, 2rem)", lineHeight: 1.12, color: T.navy, textWrap: "balance", transition: "color 0.2s" }}>
                    {displayTitle}
                  </h2>
                  {displayDesc && <p style={{ ...bodyStyle, fontSize: "0.9rem" }}>{displayDesc}</p>}
                  <p style={{ margin: 0, fontFamily: SANS, fontSize: "0.66rem", fontWeight: 700, letterSpacing: "0.16em", textTransform: "uppercase", color: T.muted }}>
                    {chapterCount} {isId ? "bagian" : "chapters"}
                  </p>
                </div>

                <div className="crs-side">
                  {isLoggedIn && chapterCount > 0 && (
                    <ProgressRing pct={pct} completed={completed} total={chapterCount} />
                  )}
                  <span className="crs-cta" style={{ fontFamily: SANS, fontSize: "0.8rem", fontWeight: 700, color: T.navy, transition: "color 0.2s", whiteSpace: "nowrap" }}>
                    {!isLoggedIn
                      ? (isId ? "Masuk untuk akses" : "Sign in to access")
                      : completed > 0
                        ? (isId ? "Lanjutkan" : "Continue")
                        : (isId ? "Mulai kursus" : "Start course")}{" "}
                    <span aria-hidden="true">→</span>
                  </span>
                </div>
              </Link>
            );
          })}
        </section>

        {/* ── LOGGED-OUT CTA ── */}
        {!isLoggedIn && (
          <section aria-labelledby="crs-cta" className="crs-split" style={{ borderTop: `2px solid ${T.orange}`, paddingTop: "clamp(2rem, 5vw, 3rem)" }}>
            <h2 id="crs-cta" style={h2Style()}>
              {isId ? "Masuk untuk mulai belajar." : "Sign in to start learning."}
            </h2>
            <div style={{ display: "flex", flexDirection: "column", gap: "1.25rem", alignItems: "flex-start" }}>
              <p style={bodyStyle}>
                {isId
                  ? "Kursus terbuka untuk anggota. Buat akun atau masuk, dan kemajuan Anda tersimpan di setiap bagian."
                  : "Courses are open to members. Create an account or sign in, and your progress is saved chapter by chapter."}
              </p>
              <div style={{ display: "flex", flexWrap: "wrap", alignItems: "center", gap: "1rem 1.5rem" }}>
                <PrimaryLink href="/signup?redirectTo=/courses">{isId ? "Buat akun" : "Create an account"}</PrimaryLink>
                <TextLink href="/login?redirectTo=/courses">{isId ? "Sudah punya akun? Masuk" : "Already a member? Sign in"}</TextLink>
              </div>
            </div>
          </section>
        )}

        {/* ── LIBRARY BAND ── */}
        <section aria-labelledby="crs-more" style={{ background: T.band, padding: "clamp(2rem, 5vw, 3.5rem) clamp(1.25rem, 4.5vw, 3.5rem)" }}>
          <div className="crs-split">
            <div style={{ display: "flex", flexDirection: "column", gap: "1.1rem" }}>
              <Eyebrow>{isId ? "Lebih lanjut" : "Keep going"}</Eyebrow>
              <h2 id="crs-more" style={h2Style()}>
                {isId ? "Dari alat ke kepemimpinan." : "From tools to leadership."}
              </h2>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: "1.25rem", alignItems: "flex-start", alignSelf: "end" }}>
              <p style={bodyStyle}>
                {isId
                  ? "Perpustakaan berisi modul pelatihan tentang budaya, komunikasi, dan memimpin tim lintas budaya."
                  : "The Library holds training modules on culture, communication, and leading teams across cultures."}
              </p>
              <TextLink href="/resources">{isId ? "Buka Perpustakaan" : "Open the Library"}</TextLink>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}

function ProgressRing({ pct, completed, total }: { pct: number; completed: number; total: number }) {
  const r = 16;
  const circ = 2 * Math.PI * r;
  const dash = (pct / 100) * circ;

  return (
    <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
      <svg width="40" height="40" viewBox="0 0 40 40" aria-hidden="true">
        <circle cx="20" cy="20" r={r} fill="none" stroke={T.rule} strokeWidth="3" />
        <circle
          cx="20" cy="20" r={r}
          fill="none"
          stroke={pct === 100 ? "oklch(45% 0.10 155)" : T.orange}
          strokeWidth="3"
          strokeDasharray={`${dash} ${circ}`}
          strokeLinecap="round"
          transform="rotate(-90 20 20)"
        />
        <text
          x="20" y="20"
          textAnchor="middle"
          dominantBaseline="central"
          style={{ fontFamily: SANS, fontWeight: 700, fontSize: "9px" }}
          fill={T.navy}
        >
          {pct}%
        </text>
      </svg>
      <span style={{ fontFamily: SANS, fontSize: "0.68rem", color: T.muted }}>
        {completed}/{total}
      </span>
    </div>
  );
}

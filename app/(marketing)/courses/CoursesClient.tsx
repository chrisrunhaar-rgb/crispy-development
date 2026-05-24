"use client";
import Link from "next/link";
import { useLanguage } from "@/lib/LanguageContext";

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

export default function CoursesClient({ courses, progressMap, isLoggedIn }: Props) {
  const { lang } = useLanguage();
  const isId = lang === "id";

  return (
    <div style={{ background: "oklch(97% 0.005 80)", minHeight: "100vh" }}>
      {/* ── PAGE HEADER ── */}
      <section style={{ background: "oklch(22% 0.10 260)", paddingTop: "clamp(4rem, 7vw, 7rem)", paddingBottom: "clamp(4rem, 7vw, 7rem)", position: "relative", overflow: "hidden" }}>
        <div aria-hidden="true" style={{ position: "absolute", inset: 0, backgroundImage: "url('/pathway-courses.jpg')", backgroundSize: "cover", backgroundPosition: "center 35%", opacity: 0.15, pointerEvents: "none" }} />
        <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: "3px", background: "oklch(65% 0.15 45)" }} />
        <div aria-hidden="true" style={{ position: "absolute", inset: 0, backgroundImage: "radial-gradient(circle, oklch(97% 0.005 80 / 0.06) 1px, transparent 1px)", backgroundSize: "28px 28px", pointerEvents: "none" }} />

        <div className="container-wide" style={{ position: "relative" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "0.875rem", marginBottom: "1.5rem" }}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/logo-icon-dark-badge.png" alt="Crispy Development" width={28} height={28} style={{ flexShrink: 0, display: "block" }} />
            <p style={{ fontFamily: "var(--font-montserrat)", fontSize: "0.7rem", fontWeight: 700, letterSpacing: "0.2em", textTransform: "uppercase", color: "oklch(65% 0.15 45)", margin: 0 }}>
              {isId ? "Kursus" : "Courses"}
            </p>
          </div>
          <div style={{ width: "48px", height: "2px", background: "oklch(65% 0.15 45)", marginBottom: "1.75rem" }} />

          <h1 className="t-section" style={{ marginBottom: "1rem", maxWidth: "560px", color: "oklch(97% 0.005 80)" }}>
            {isId ? <>Kursus<br />Praktis.</> : <>Practical<br />Courses.</>}
          </h1>

          <p style={{ fontFamily: "var(--font-montserrat)", fontSize: "0.9375rem", color: "oklch(80% 0.025 260)", maxWidth: "52ch", lineHeight: 1.75 }}>
            {isId
              ? "Pelatihan langsung untuk pemimpin lintas budaya. Kuasai alat digital yang diandalkan tim Anda — sesuai kecepatan Anda sendiri."
              : "Hands-on training for cross-cultural leaders. Master the digital tools your team relies on — at your own pace."
            }
          </p>
        </div>
      </section>

      {/* Courses meta bar */}
      <div style={{ background: "oklch(94% 0.006 80)", borderTop: "1px solid oklch(88% 0.008 80)" }}>
        <div className="container-wide" style={{ display: "flex", alignItems: "center", gap: "1.25rem", paddingTop: "0.8rem", paddingBottom: "0.8rem" }}>
          <span style={{ fontFamily: "var(--font-montserrat)", fontWeight: 700, fontSize: "0.63rem", letterSpacing: "0.16em", textTransform: "uppercase", color: "oklch(65% 0.15 45)" }}>
            {courses.length} {isId ? "kursus" : "courses"}
          </span>
          <span style={{ width: "3px", height: "3px", borderRadius: "50%", background: "oklch(72% 0.006 260)", display: "inline-block" }} />
          <span style={{ fontFamily: "var(--font-montserrat)", fontSize: "0.7rem", color: "oklch(55% 0.008 260)" }}>
            {isId ? "Perlu akun" : "Account required"}
          </span>
        </div>
      </div>

      {/* ── COURSE CARDS ── */}
      <section style={{ padding: "clamp(3rem, 6vw, 5rem) 0" }}>
        <div className="container-wide">
          <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(min(100%, 340px), 1fr))",
            gap: "2rem",
          }}>
            {courses.map((course) => {
              const chapterCount = course.course_chapters?.[0]?.count ?? 0;
              const completed = progressMap[course.id] ?? 0;
              const pct = chapterCount > 0 ? Math.round((completed / chapterCount) * 100) : 0;
              const displayTitle = isId && course.title_id ? course.title_id : course.title;
              const displayDesc = isId && course.description_id ? course.description_id : course.description;

              return (
                <Link
                  key={course.id}
                  href={`/courses/${course.slug}`}
                  className="course-card"
                  style={{
                    display: "block",
                    textDecoration: "none",
                    background: "oklch(100% 0 0)",
                    border: "1px solid oklch(88% 0.008 80)",
                    padding: "2rem",
                    transition: "border-color 0.15s, box-shadow 0.15s",
                  }}
                >
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "1.25rem" }}>
                    <span style={{
                      fontFamily: "var(--font-montserrat)", fontWeight: 700, fontSize: "0.55rem",
                      letterSpacing: "0.08em", textTransform: "uppercase",
                      color: "oklch(45% 0.14 45)",
                      background: "oklch(95% 0.04 60)",
                      padding: "2px 8px",
                      borderRadius: 999,
                    }}>
                      {isId ? "Khusus anggota" : "Members only"}
                    </span>
                    {isLoggedIn && chapterCount > 0 && (
                      <ProgressRing pct={pct} completed={completed} total={chapterCount} />
                    )}
                  </div>

                  <h2 style={{
                    fontFamily: "var(--font-cormorant)", fontWeight: 600,
                    fontSize: "clamp(1.5rem, 2.8vw, 1.9rem)", lineHeight: 1.15,
                    color: "oklch(22% 0.10 260)", marginBottom: "0.875rem",
                  }}>
                    {displayTitle}
                  </h2>

                  <p style={{
                    fontFamily: "var(--font-montserrat)", fontSize: "0.875rem", lineHeight: 1.65,
                    color: "oklch(48% 0.007 260)", marginBottom: "1.5rem",
                  }}>
                    {displayDesc}
                  </p>

                  <div style={{
                    display: "flex", alignItems: "center", justifyContent: "space-between",
                    paddingTop: "1.25rem",
                    borderTop: "1px solid oklch(90% 0.006 80)",
                  }}>
                    <span style={{
                      fontFamily: "var(--font-montserrat)", fontSize: "0.72rem",
                      color: "oklch(58% 0.006 260)",
                    }}>
                      {chapterCount} {isId ? "bagian" : "chapters"}
                    </span>
                    <span
                      className="course-card-cta"
                      style={{
                        fontFamily: "var(--font-montserrat)", fontWeight: 600, fontSize: "0.78rem",
                        letterSpacing: "0.05em", color: "oklch(65% 0.15 45)",
                        transition: "color 0.15s",
                      }}
                    >
                      {!isLoggedIn
                        ? (isId ? "Masuk untuk akses →" : "Sign in to access →")
                        : completed > 0
                          ? (isId ? "Lanjutkan →" : "Continue →")
                          : (isId ? "Mulai kursus →" : "Start course →")
                      }
                    </span>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      <style>{`
        .course-card:hover {
          border-color: oklch(65% 0.15 45);
          box-shadow: 0 4px 24px oklch(22% 0.10 260 / 0.08);
        }
        .course-card:hover .course-card-cta {
          color: oklch(55% 0.13 45);
        }
      `}</style>
    </div>
  );
}

function ProgressRing({ pct, completed, total }: { pct: number; completed: number; total: number }) {
  const r = 16;
  const circ = 2 * Math.PI * r;
  const dash = (pct / 100) * circ;

  return (
    <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
      <svg width="40" height="40" viewBox="0 0 40 40">
        <circle cx="20" cy="20" r={r} fill="none" stroke="oklch(90% 0.008 80)" strokeWidth="3" />
        <circle
          cx="20" cy="20" r={r}
          fill="none"
          stroke={pct === 100 ? "oklch(45% 0.10 155)" : "oklch(65% 0.15 45)"}
          strokeWidth="3"
          strokeDasharray={`${dash} ${circ}`}
          strokeLinecap="round"
          transform="rotate(-90 20 20)"
        />
        <text
          x="20" y="20"
          textAnchor="middle"
          dominantBaseline="central"
          style={{ fontFamily: "var(--font-montserrat)", fontWeight: 700, fontSize: "9px" }}
          fill="oklch(22% 0.10 260)"
        >
          {pct}%
        </text>
      </svg>
      <span style={{
        fontFamily: "var(--font-montserrat)", fontSize: "0.68rem",
        color: "oklch(55% 0.008 260)",
      }}>
        {completed}/{total}
      </span>
    </div>
  );
}

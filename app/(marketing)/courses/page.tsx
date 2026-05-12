import type { Metadata } from "next";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";

export const metadata: Metadata = {
  title: "Courses | Crispy Development",
  description: "Free, practical courses for cross-cultural leaders. Master the digital tools your team uses every day.",
};

type CourseRow = {
  id: string;
  slug: string;
  title: string;
  description: string | null;
  is_free: boolean;
  order_index: number;
  course_chapters: { count: number }[];
};

export default async function CoursesPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  const { data: courses } = await supabase
    .from("courses")
    .select("*, course_chapters(count)")
    .order("order_index") as { data: CourseRow[] | null };

  // Per-course completion counts for logged-in user
  let progressMap: Record<string, number> = {};
  if (user && courses) {
    // course_chapters in CourseRow is a count object — query actual chapters separately
    const { data: chapters } = await supabase
      .from("course_chapters")
      .select("id, course_id")
      .in("course_id", courses.map((c) => c.id));

    if (chapters && chapters.length > 0) {
      const chapterToCourse: Record<string, string> = {};
      for (const ch of chapters) chapterToCourse[ch.id] = ch.course_id;

      const { data: progress } = await supabase
        .from("course_progress")
        .select("chapter_id")
        .eq("user_id", user.id)
        .in("chapter_id", chapters.map((ch) => ch.id));

      if (progress) {
        for (const row of progress) {
          const courseId = chapterToCourse[row.chapter_id];
          if (courseId) progressMap[courseId] = (progressMap[courseId] ?? 0) + 1;
        }
      }
    }
  }

  const courseList = courses ?? [];

  return (
    <div style={{ background: "oklch(97% 0.005 80)", minHeight: "100vh" }}>
      {/* ── PAGE HEADER ── */}
      <section style={{ position: "relative", overflow: "hidden" }}>
        <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: "5px", background: "oklch(65% 0.15 45)" }} />
        <div className="container-wide" style={{
          paddingTop: "clamp(3.5rem, 7vw, 6rem)",
          paddingBottom: "clamp(2.5rem, 5vw, 4rem)",
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginBottom: "1.75rem" }}>
            <div style={{ background: "oklch(65% 0.15 45)", padding: "0.28rem 0.75rem", display: "inline-flex", alignItems: "center" }}>
              <span style={{
                fontFamily: "var(--font-montserrat)", fontWeight: 800, fontSize: "0.6rem",
                letterSpacing: "0.3em", textTransform: "uppercase",
                color: "oklch(97% 0.005 80)",
              }}>
                Courses
              </span>
            </div>
            <span style={{
              fontFamily: "var(--font-montserrat)", fontWeight: 500, fontSize: "0.63rem",
              letterSpacing: "0.16em", textTransform: "uppercase",
              color: "oklch(55% 0.008 260)",
            }}>
              Crispy Development
            </span>
          </div>

          <h1 style={{
            fontFamily: "var(--font-cormorant)", fontWeight: 600,
            fontSize: "clamp(2.6rem, 5.5vw, 4.5rem)", lineHeight: 1.05,
            color: "oklch(22% 0.10 260)", marginBottom: "1.5rem",
            letterSpacing: "-0.01em",
          }}>
            Practical<br />Courses
          </h1>

          <p style={{
            fontFamily: "var(--font-montserrat)", fontSize: "1rem", lineHeight: 1.7,
            color: "oklch(45% 0.008 260)", maxWidth: "500px",
          }}>
            Free, hands-on training for cross-cultural leaders. Master the digital tools your team relies on — at your own pace.
          </p>
        </div>

        <div style={{
          background: "oklch(94% 0.006 80)",
          borderTop: "1px solid oklch(88% 0.008 80)",
        }}>
          <div className="container-wide" style={{
            display: "flex", alignItems: "center", gap: "1.25rem",
            paddingTop: "0.8rem", paddingBottom: "0.8rem",
          }}>
            <span style={{
              fontFamily: "var(--font-montserrat)", fontWeight: 700, fontSize: "0.63rem",
              letterSpacing: "0.16em", textTransform: "uppercase",
              color: "oklch(65% 0.15 45)",
            }}>
              {courseList.length} courses
            </span>
            <span style={{ width: "3px", height: "3px", borderRadius: "50%", background: "oklch(72% 0.006 260)", display: "inline-block" }} />
            <span style={{
              fontFamily: "var(--font-montserrat)", fontSize: "0.7rem",
              color: "oklch(55% 0.008 260)",
            }}>
              Free to access
            </span>
          </div>
        </div>
      </section>

      {/* ── COURSE CARDS ── */}
      <section style={{ padding: "clamp(3rem, 6vw, 5rem) 0" }}>
        <div className="container-wide">
          <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(min(100%, 340px), 1fr))",
            gap: "2rem",
          }}>
            {courseList.map((course) => {
              const chapterCount = course.course_chapters?.[0]?.count ?? 0;
              const completed = progressMap[course.id] ?? 0;
              const pct = chapterCount > 0 ? Math.round((completed / chapterCount) * 100) : 0;

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
                  {/* Top row: free badge + progress */}
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "1.25rem" }}>
                    {course.is_free ? (
                      <span style={{
                        fontFamily: "var(--font-montserrat)", fontWeight: 700, fontSize: "0.6rem",
                        letterSpacing: "0.18em", textTransform: "uppercase",
                        color: "oklch(45% 0.10 155)",
                        background: "oklch(92% 0.04 155)",
                        padding: "0.2rem 0.6rem",
                      }}>
                        Free
                      </span>
                    ) : (
                      <span style={{
                        fontFamily: "var(--font-montserrat)", fontWeight: 700, fontSize: "0.6rem",
                        letterSpacing: "0.18em", textTransform: "uppercase",
                        color: "oklch(65% 0.15 45)",
                        background: "oklch(95% 0.04 45)",
                        padding: "0.2rem 0.6rem",
                      }}>
                        Premium
                      </span>
                    )}
                    {user && chapterCount > 0 && (
                      <ProgressRing pct={pct} completed={completed} total={chapterCount} />
                    )}
                  </div>

                  <h2 style={{
                    fontFamily: "var(--font-cormorant)", fontWeight: 600,
                    fontSize: "clamp(1.5rem, 2.8vw, 1.9rem)", lineHeight: 1.15,
                    color: "oklch(22% 0.10 260)", marginBottom: "0.875rem",
                  }}>
                    {course.title}
                  </h2>

                  <p style={{
                    fontFamily: "var(--font-montserrat)", fontSize: "0.875rem", lineHeight: 1.65,
                    color: "oklch(48% 0.007 260)", marginBottom: "1.5rem",
                  }}>
                    {course.description}
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
                      {chapterCount} chapters
                    </span>
                    <span
                      className="course-card-cta"
                      style={{
                        fontFamily: "var(--font-montserrat)", fontWeight: 600, fontSize: "0.78rem",
                        letterSpacing: "0.05em", color: "oklch(65% 0.15 45)",
                        transition: "color 0.15s",
                      }}
                    >
                      {user && completed > 0 ? "Continue →" : "Start course →"}
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

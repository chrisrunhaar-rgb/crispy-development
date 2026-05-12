import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

type Chapter = {
  id: string;
  slug: string;
  title: string;
  subtitle: string | null;
  order_index: number;
};

type Course = {
  id: string;
  slug: string;
  title: string;
  description: string | null;
  is_free: boolean;
  course_chapters: Chapter[];
};

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const supabase = await createClient();
  const { data: course } = await supabase
    .from("courses")
    .select("title, description")
    .eq("slug", slug)
    .single();
  if (!course) return { title: "Course | Crispy Development" };
  return {
    title: `${course.title} | Crispy Development`,
    description: course.description ?? undefined,
  };
}

export default async function CoursePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  const { data: course } = await supabase
    .from("courses")
    .select("*, course_chapters(id, slug, title, subtitle, order_index)")
    .eq("slug", slug)
    .order("order_index", { referencedTable: "course_chapters" })
    .single() as { data: Course | null };

  if (!course) notFound();

  const chapters = course.course_chapters ?? [];

  // Completed chapter IDs for this user
  let completedIds = new Set<string>();
  if (user && chapters.length > 0) {
    const { data: progress } = await supabase
      .from("course_progress")
      .select("chapter_id")
      .eq("user_id", user.id)
      .in("chapter_id", chapters.map((c) => c.id));
    if (progress) {
      completedIds = new Set(progress.map((p) => p.chapter_id));
    }
  }

  const completedCount = completedIds.size;
  const firstIncomplete = chapters.find((ch) => !completedIds.has(ch.id));
  const startChapter = firstIncomplete ?? chapters[0];

  return (
    <div style={{ background: "oklch(97% 0.005 80)", minHeight: "100vh" }}>
      {/* ── HEADER ── */}
      <section style={{ position: "relative" }}>
        <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: "5px", background: "oklch(65% 0.15 45)" }} />
        <div className="container-wide" style={{
          paddingTop: "clamp(3rem, 6vw, 5rem)",
          paddingBottom: "clamp(2rem, 4vw, 3rem)",
        }}>
          {/* Breadcrumb */}
          <div style={{
            display: "flex", alignItems: "center", gap: "0.5rem",
            marginBottom: "2rem",
            fontFamily: "var(--font-montserrat)", fontSize: "0.72rem",
          }}>
            <Link href="/courses" style={{ color: "oklch(55% 0.008 260)", textDecoration: "none" }}>
              Courses
            </Link>
            <span style={{ color: "oklch(70% 0.006 260)" }}>›</span>
            <span style={{ color: "oklch(38% 0.007 260)" }}>{course.title}</span>
          </div>

          <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: "2rem", flexWrap: "wrap" }}>
            <div style={{ flex: "1 1 360px" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginBottom: "1rem" }}>
                {course.is_free && (
                  <span style={{
                    fontFamily: "var(--font-montserrat)", fontWeight: 700, fontSize: "0.6rem",
                    letterSpacing: "0.18em", textTransform: "uppercase",
                    color: "oklch(45% 0.10 155)",
                    background: "oklch(92% 0.04 155)",
                    padding: "0.2rem 0.6rem",
                  }}>
                    Free
                  </span>
                )}
                <span style={{
                  fontFamily: "var(--font-montserrat)", fontSize: "0.72rem",
                  color: "oklch(58% 0.006 260)",
                }}>
                  {chapters.length} chapters
                </span>
              </div>

              <h1 style={{
                fontFamily: "var(--font-cormorant)", fontWeight: 600,
                fontSize: "clamp(2.2rem, 4.5vw, 3.5rem)", lineHeight: 1.05,
                color: "oklch(22% 0.10 260)", marginBottom: "1rem",
                letterSpacing: "-0.01em",
              }}>
                {course.title}
              </h1>

              <p style={{
                fontFamily: "var(--font-montserrat)", fontSize: "0.9375rem", lineHeight: 1.7,
                color: "oklch(45% 0.008 260)", maxWidth: "520px",
              }}>
                {course.description}
              </p>
            </div>

            {/* Start / continue CTA */}
            {startChapter && (
              <div style={{
                background: "oklch(22% 0.10 260)",
                padding: "1.5rem",
                minWidth: "200px",
                display: "flex", flexDirection: "column", gap: "0.75rem",
              }}>
                {user && completedCount > 0 ? (
                  <>
                    <span style={{
                      fontFamily: "var(--font-montserrat)", fontWeight: 700, fontSize: "0.6rem",
                      letterSpacing: "0.18em", textTransform: "uppercase",
                      color: "oklch(65% 0.15 45)",
                    }}>
                      Your progress
                    </span>
                    <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
                      <div style={{
                        flex: 1, height: "4px",
                        background: "oklch(40% 0.08 260)",
                        borderRadius: "2px", overflow: "hidden",
                      }}>
                        <div style={{
                          width: `${Math.round((completedCount / chapters.length) * 100)}%`,
                          height: "100%",
                          background: "oklch(65% 0.15 45)",
                        }} />
                      </div>
                      <span style={{
                        fontFamily: "var(--font-montserrat)", fontSize: "0.7rem",
                        color: "oklch(72% 0.006 260)", whiteSpace: "nowrap",
                      }}>
                        {completedCount}/{chapters.length}
                      </span>
                    </div>
                  </>
                ) : null}
                <Link
                  href={`/courses/${course.slug}/${startChapter.slug}`}
                  style={{
                    display: "block",
                    background: "oklch(65% 0.15 45)",
                    color: "oklch(97% 0.005 80)",
                    padding: "0.75rem 1.25rem",
                    textDecoration: "none",
                    fontFamily: "var(--font-montserrat)", fontWeight: 700,
                    fontSize: "0.8rem", letterSpacing: "0.04em",
                    textAlign: "center",
                  }}
                >
                  {user && completedCount > 0 ? "Continue →" : "Start course →"}
                </Link>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* ── CHAPTER LIST ── */}
      <section style={{
        padding: "clamp(2rem, 4vw, 3.5rem) 0",
        borderTop: "1px solid oklch(88% 0.008 80)",
      }}>
        <div className="container-wide" style={{ maxWidth: "720px" }}>
          <h2 style={{
            fontFamily: "var(--font-montserrat)", fontWeight: 700, fontSize: "0.68rem",
            letterSpacing: "0.18em", textTransform: "uppercase",
            color: "oklch(52% 0.008 260)", marginBottom: "1.5rem",
          }}>
            Chapters
          </h2>

          <div style={{ display: "flex", flexDirection: "column", gap: "0.125rem" }}>
            {chapters.map((ch, idx) => {
              const done = completedIds.has(ch.id);
              return (
                <Link
                  key={ch.id}
                  href={`/courses/${course.slug}/${ch.slug}`}
                  className="chapter-row"
                  style={{
                    display: "flex", alignItems: "flex-start", gap: "1rem",
                    padding: "1rem 1.25rem",
                    background: "oklch(100% 0 0)",
                    border: "1px solid oklch(90% 0.006 80)",
                    textDecoration: "none",
                    transition: "border-color 0.15s, background 0.15s",
                  }}
                >
                  {/* Number / checkmark */}
                  <div style={{
                    width: "2rem", height: "2rem", minWidth: "2rem",
                    borderRadius: "50%",
                    background: done ? "oklch(45% 0.10 155)" : "oklch(93% 0.006 80)",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    marginTop: "0.125rem",
                  }}>
                    {done ? (
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="20 6 9 17 4 12" />
                      </svg>
                    ) : (
                      <span style={{
                        fontFamily: "var(--font-montserrat)", fontWeight: 700, fontSize: "0.7rem",
                        color: "oklch(55% 0.008 260)",
                      }}>
                        {idx + 1}
                      </span>
                    )}
                  </div>

                  <div style={{ flex: 1 }}>
                    <div style={{
                      fontFamily: "var(--font-montserrat)", fontWeight: 600, fontSize: "0.9rem",
                      color: "oklch(22% 0.10 260)", lineHeight: 1.3, marginBottom: "0.3rem",
                    }}>
                      {ch.title}
                    </div>
                    {ch.subtitle && (
                      <div style={{
                        fontFamily: "var(--font-montserrat)", fontSize: "0.78rem", lineHeight: 1.5,
                        color: "oklch(55% 0.008 260)",
                      }}>
                        {ch.subtitle}
                      </div>
                    )}
                  </div>

                  <div style={{
                    fontFamily: "var(--font-montserrat)", fontWeight: 600, fontSize: "0.72rem",
                    color: "oklch(65% 0.15 45)",
                    alignSelf: "center",
                    whiteSpace: "nowrap",
                  }}>
                    →
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      <style>{`
        .chapter-row:hover {
          border-color: oklch(65% 0.15 45);
          background: oklch(98.5% 0.003 80) !important;
        }
      `}</style>
    </div>
  );
}

import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import ChapterActions from "./ChapterActions";
import ChapterQuiz from "./ChapterQuiz";

type QuizQuestion = {
  id: string;
  question: string;
  options: string[];
  correct_answer: string;
  order_index: number;
};

type Chapter = {
  id: string;
  slug: string;
  title: string;
  subtitle: string | null;
  order_index: number;
  content_html: string | null;
  content_html_id: string | null;
  course_id: string;
};

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string; "chapter-slug": string }>;
}): Promise<Metadata> {
  const { slug, "chapter-slug": chapterSlug } = await params;
  const supabase = await createClient();
  const { data: ch } = await supabase
    .from("course_chapters")
    .select("title, subtitle, courses!inner(slug)")
    .eq("slug", chapterSlug)
    .eq("courses.slug", slug)
    .single();
  if (!ch) return { title: "Chapter | Crispy Development" };
  return {
    title: `${ch.title} | Crispy Development`,
    description: ch.subtitle ?? undefined,
  };
}

export default async function ChapterPage({
  params,
  searchParams,
}: {
  params: Promise<{ slug: string; "chapter-slug": string }>;
  searchParams: Promise<{ lang?: string }>;
}) {
  const { slug, "chapter-slug": chapterSlug } = await params;
  const { lang } = await searchParams;
  const isId = lang === "id";
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  // Fetch all chapters for this course (to build prev/next)
  const { data: courseData } = await supabase
    .from("courses")
    .select("id, title, slug, course_chapters(id, slug, title, subtitle, order_index, content_html, content_html_id, course_id)")
    .eq("slug", slug)
    .order("order_index", { referencedTable: "course_chapters" })
    .single() as { data: { id: string; title: string; slug: string; course_chapters: Chapter[] } | null };

  if (!courseData) notFound();

  const chapters = courseData.course_chapters ?? [];
  const chapterIndex = chapters.findIndex((c) => c.slug === chapterSlug);
  if (chapterIndex === -1) notFound();

  const chapter = chapters[chapterIndex];
  const prev = chapters[chapterIndex - 1] ?? null;
  const next = chapters[chapterIndex + 1] ?? null;

  // Check if completed
  let isCompleted = false;
  if (user) {
    const { data: prog } = await supabase
      .from("course_progress")
      .select("id")
      .eq("user_id", user.id)
      .eq("chapter_id", chapter.id)
      .single();
    isCompleted = !!prog;
  }

  // Fetch quiz questions
  const { data: quizData } = await supabase
    .from("course_quiz_questions")
    .select("id, question, options, correct_answer, order_index")
    .eq("chapter_id", chapter.id)
    .order("order_index") as { data: QuizQuestion[] | null };
  const quizQuestions = quizData ?? [];

  const langSuffix = isId ? "?lang=id" : "";
  const prevHref = prev ? `/courses/${slug}/${prev.slug}${langSuffix}` : null;
  const nextHref = next ? `/courses/${slug}/${next.slug}${langSuffix}` : null;

  return (
    <div style={{ background: "oklch(97% 0.005 80)", minHeight: "100vh", display: "flex", flexDirection: "column" }}>
      {/* ── CHAPTER HEADER ── */}
      <section style={{
        background: "oklch(22% 0.10 260)",
        padding: "clamp(1.5rem, 3vw, 2.5rem) 0",
        position: "relative",
      }}>
        <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: "4px", background: "oklch(65% 0.15 45)" }} />
        <div className="container-wide">
          {/* Breadcrumb */}
          <div style={{
            display: "flex", alignItems: "center", gap: "0.5rem",
            marginBottom: "1.25rem",
            fontFamily: "var(--font-montserrat)", fontSize: "0.7rem",
          }}>
            <Link href="/courses" style={{ color: "oklch(55% 0.04 260)", textDecoration: "none" }}>
              Courses
            </Link>
            <span style={{ color: "oklch(40% 0.04 260)" }}>›</span>
            <Link href={`/courses/${slug}`} style={{ color: "oklch(55% 0.04 260)", textDecoration: "none" }}>
              {courseData.title}
            </Link>
            <span style={{ color: "oklch(40% 0.04 260)" }}>›</span>
            <span style={{ color: "oklch(72% 0.04 260)" }}>
              Part {chapterIndex + 1}
            </span>
          </div>

          <h1 style={{
            fontFamily: "var(--font-cormorant)", fontWeight: 600,
            fontSize: "clamp(1.7rem, 3.5vw, 2.5rem)", lineHeight: 1.1,
            color: "oklch(97% 0.005 80)", marginBottom: "0.625rem",
          }}>
            {chapter.title}
          </h1>

          {chapter.subtitle && (
            <p style={{
              fontFamily: "var(--font-montserrat)", fontSize: "0.875rem", lineHeight: 1.6,
              color: "oklch(68% 0.04 260)",
            }}>
              {chapter.subtitle}
            </p>
          )}

          {/* Language toggle */}
          <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginTop: "1rem" }}>
            <Link
              href={`/courses/${slug}/${chapterSlug}`}
              style={{
                fontFamily: "var(--font-montserrat)", fontWeight: 700, fontSize: "0.63rem",
                letterSpacing: "0.1em", padding: "0.2rem 0.6rem",
                background: !isId ? "oklch(65% 0.15 45)" : "oklch(35% 0.06 260)",
                color: "oklch(97% 0.005 80)",
                textDecoration: "none",
              }}
            >
              EN
            </Link>
            {chapter.content_html_id ? (
              <Link
                href={`/courses/${slug}/${chapterSlug}?lang=id`}
                style={{
                  fontFamily: "var(--font-montserrat)", fontWeight: 700, fontSize: "0.63rem",
                  letterSpacing: "0.1em", padding: "0.2rem 0.6rem",
                  background: isId ? "oklch(65% 0.15 45)" : "oklch(35% 0.06 260)",
                  color: "oklch(97% 0.005 80)",
                  textDecoration: "none",
                }}
              >
                ID
              </Link>
            ) : null}
          </div>

          {/* Progress indicator */}
          <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginTop: "1.25rem" }}>
            {chapters.map((ch, i) => (
              <Link
                key={ch.id}
                href={`/courses/${slug}/${ch.slug}`}
                title={ch.title}
                style={{
                  display: "block",
                  height: "4px",
                  flex: 1,
                  background: i === chapterIndex
                    ? "oklch(65% 0.15 45)"
                    : i < chapterIndex
                    ? "oklch(45% 0.08 260)"
                    : "oklch(35% 0.06 260)",
                  borderRadius: "2px",
                  transition: "background 0.15s",
                }}
              />
            ))}
          </div>
          <div style={{
            fontFamily: "var(--font-montserrat)", fontSize: "0.65rem",
            color: "oklch(50% 0.04 260)",
            marginTop: "0.4rem",
          }}>
            {chapterIndex + 1} of {chapters.length}
          </div>
        </div>
      </section>

      {/* ── CHAPTER CONTENT ── */}
      <section style={{ flex: 1, padding: "clamp(2rem, 4vw, 3.5rem) 0" }}>
        <div className="container-wide" style={{ maxWidth: "740px" }}>
          <style>{`
            .chapter-content h3 {
              font-family: var(--font-cormorant);
              font-weight: 600;
              font-size: clamp(1.25rem, 2.2vw, 1.5rem);
              color: oklch(22% 0.10 260);
              margin: 2rem 0 0.75rem;
              line-height: 1.2;
            }
            .chapter-content h4 {
              font-family: var(--font-montserrat);
              font-weight: 700;
              font-size: 0.65rem;
              letter-spacing: 0.2em;
              text-transform: uppercase;
              color: oklch(55% 0.008 260);
              margin: 1.75rem 0 0.625rem;
            }
            .chapter-content p {
              font-family: var(--font-montserrat);
              font-size: 0.9375rem;
              line-height: 1.75;
              color: oklch(28% 0.007 260);
              margin-bottom: 1rem;
            }
            .chapter-content ul, .chapter-content ol {
              font-family: var(--font-montserrat);
              font-size: 0.9375rem;
              line-height: 1.75;
              color: oklch(28% 0.007 260);
              padding-left: 1.5rem;
              margin-bottom: 1rem;
            }
            .chapter-content li { margin-bottom: 0.375rem; }
            .chapter-content strong { color: oklch(22% 0.10 260); }
            .chapter-content .tip {
              background: oklch(97% 0.04 50);
              border-left: 4px solid oklch(65% 0.15 45);
              padding: 0.875rem 1.125rem;
              margin: 1.25rem 0;
              font-family: var(--font-montserrat);
              font-size: 0.875rem;
              line-height: 1.65;
              color: oklch(32% 0.007 260);
            }
            .chapter-content .note {
              background: oklch(95% 0.015 260);
              border-left: 4px solid oklch(48% 0.12 260);
              padding: 0.875rem 1.125rem;
              margin: 1.25rem 0;
              font-family: var(--font-montserrat);
              font-size: 0.875rem;
              line-height: 1.65;
              color: oklch(32% 0.007 260);
            }
            .chapter-content .warning {
              background: oklch(97% 0.02 20);
              border-left: 4px solid oklch(55% 0.18 25);
              padding: 0.875rem 1.125rem;
              margin: 1.25rem 0;
              font-family: var(--font-montserrat);
              font-size: 0.875rem;
              line-height: 1.65;
              color: oklch(32% 0.007 260);
            }
            .chapter-content .label {
              font-family: var(--font-montserrat);
              font-weight: 700;
              font-size: 0.65rem;
              letter-spacing: 0.12em;
              text-transform: uppercase;
              color: oklch(52% 0.008 260);
              display: block;
              margin-bottom: 0.375rem;
            }
            .chapter-content table {
              width: 100%;
              border-collapse: collapse;
              margin: 1.25rem 0;
              font-family: var(--font-montserrat);
              font-size: 0.875rem;
            }
            .chapter-content th {
              background: oklch(22% 0.10 260);
              color: oklch(97% 0.005 80);
              padding: 0.625rem 0.875rem;
              text-align: left;
              font-weight: 600;
              font-size: 0.8rem;
            }
            .chapter-content td {
              border: 1px solid oklch(88% 0.008 80);
              padding: 0.625rem 0.875rem;
              color: oklch(30% 0.007 260);
              line-height: 1.55;
            }
            .chapter-content tr:nth-child(even) td { background: oklch(97% 0.003 80); }
            .chapter-content figure.chapter-screenshot {
              margin: 1.5rem 0;
              border: 1px solid oklch(88% 0.008 80);
              border-radius: 0;
              overflow: hidden;
            }
            .chapter-content figure.chapter-screenshot img {
              width: 100%;
              height: auto;
              display: block;
            }
            .chapter-content figure.chapter-screenshot figcaption {
              font-family: var(--font-montserrat);
              font-size: 0.72rem;
              font-style: italic;
              color: oklch(52% 0.008 260);
              background: oklch(97% 0.003 80);
              border-top: 1px solid oklch(88% 0.008 80);
              padding: 0.5rem 0.75rem;
            }
            .chapter-content a {
              color: oklch(48% 0.12 260);
              text-underline-offset: 2px;
            }
          `}</style>

          {(() => {
            const content = isId ? (chapter.content_html_id ?? chapter.content_html) : chapter.content_html;
            return content ? (
              <div className="chapter-content" dangerouslySetInnerHTML={{ __html: content }} />
            ) : (
              <p style={{ fontFamily: "var(--font-montserrat)", fontSize: "0.9375rem", color: "oklch(58% 0.008 260)" }}>
                Content coming soon.
              </p>
            );
          })()}
        </div>
      </section>

      {/* ── CHAPTER QUIZ ── */}
      {quizQuestions.length > 0 && <ChapterQuiz questions={quizQuestions} />}

      {/* ── STICKY BOTTOM ACTIONS ── */}
      <ChapterActions
        chapterId={chapter.id}
        isCompleted={isCompleted}
        prevHref={prevHref}
        nextHref={nextHref}
        userId={user?.id ?? null}
      />
    </div>
  );
}

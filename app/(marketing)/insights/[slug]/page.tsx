import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { insights, getInsight, formatDate } from "@/lib/insights";

export function generateStaticParams() {
  return insights.map(i => ({ slug: i.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const article = getInsight(slug);
  if (!article) return {};
  return {
    title: `${article.title} | Crispy Development`,
    description: article.hook,
    robots: { index: false, follow: false },
  };
}

export default async function InsightPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const article = getInsight(slug);
  if (!article) notFound();

  const paragraphs = article.body.trim().split("\n\n");

  return (
    <div style={{ background: "oklch(97% 0.005 80)", minHeight: "100vh" }}>

      {/* ── ARTICLE HEADER ── */}
      <section style={{
        background: "oklch(22% 0.10 260)",
        padding: "clamp(3rem, 6vw, 5.5rem) 0 clamp(2.5rem, 5vw, 4.5rem)",
        position: "relative", overflow: "hidden",
      }}>
        <div aria-hidden="true" style={{
          position: "absolute", inset: 0,
          backgroundImage: "radial-gradient(circle, oklch(97% 0.005 80 / 0.05) 1px, transparent 1px)",
          backgroundSize: "32px 32px", pointerEvents: "none",
        }} />
        <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: "3px", background: "oklch(65% 0.15 45)" }} />

        <div className="container-wide" style={{ position: "relative", maxWidth: "720px" }}>
          {/* Breadcrumb */}
          <Link href="/insights" style={{
            fontFamily: "var(--font-montserrat)", fontWeight: 600, fontSize: "0.7rem",
            letterSpacing: "0.12em", textTransform: "uppercase",
            color: "oklch(65% 0.15 45)", textDecoration: "none",
            display: "inline-flex", alignItems: "center", gap: "0.4rem",
            marginBottom: "1.75rem",
          }}>
            ← Insights
          </Link>

          {/* Tag */}
          <p style={{
            fontFamily: "var(--font-montserrat)", fontWeight: 700, fontSize: "0.65rem",
            letterSpacing: "0.22em", textTransform: "uppercase",
            color: "oklch(65% 0.15 45 / 0.75)", marginBottom: "1rem",
          }}>
            {article.tag}
          </p>

          {/* Title */}
          <h1 style={{
            fontFamily: "var(--font-cormorant)", fontWeight: 600,
            fontSize: "clamp(2.2rem, 5vw, 3.5rem)", lineHeight: 1.1,
            color: "oklch(97% 0.005 80)", marginBottom: "1.5rem",
          }}>
            {article.title}
          </h1>

          {/* Hook */}
          <p style={{
            fontFamily: "var(--font-cormorant)", fontStyle: "italic", fontWeight: 400,
            fontSize: "clamp(1.15rem, 2.2vw, 1.4rem)", lineHeight: 1.55,
            color: "oklch(78% 0.008 260)", marginBottom: "2rem",
          }}>
            {article.hook}
          </p>

          {/* Meta */}
          <div style={{ display: "flex", alignItems: "center", gap: "1.5rem" }}>
            <span style={{
              fontFamily: "var(--font-montserrat)", fontSize: "0.72rem",
              color: "oklch(62% 0.006 260)",
            }}>
              {formatDate(article.date)}
            </span>
            <span style={{ width: "4px", height: "4px", borderRadius: "50%", background: "oklch(50% 0.006 260)", display: "inline-block" }} />
            <span style={{
              fontFamily: "var(--font-montserrat)", fontSize: "0.72rem",
              color: "oklch(62% 0.006 260)",
            }}>
              {article.readMinutes} min read
            </span>
          </div>
        </div>
      </section>

      {/* ── ARTICLE BODY ── */}
      <section style={{ padding: "clamp(3rem, 6vw, 5rem) 0" }}>
        <div className="container-wide" style={{ maxWidth: "720px" }}>

          {paragraphs.map((para, i) => (
            <p key={i} style={{
              fontFamily: "var(--font-montserrat)", fontSize: "1.05rem", lineHeight: 1.8,
              color: "oklch(28% 0.008 260)", marginBottom: "1.75rem",
            }}>
              {para}
            </p>
          ))}

          {/* Go deeper */}
          {article.resourceSlug && (
            <div style={{
              marginTop: "3rem",
              padding: "2rem",
              border: "1px solid oklch(88% 0.008 80)",
              borderLeft: "4px solid oklch(65% 0.15 45)",
              background: "oklch(100% 0 0)",
            }}>
              <p style={{
                fontFamily: "var(--font-montserrat)", fontWeight: 700, fontSize: "0.7rem",
                letterSpacing: "0.18em", textTransform: "uppercase",
                color: "oklch(65% 0.15 45)", marginBottom: "0.625rem",
              }}>
                Go deeper
              </p>
              <p style={{
                fontFamily: "var(--font-montserrat)", fontSize: "0.9rem", lineHeight: 1.65,
                color: "oklch(38% 0.007 260)", marginBottom: "1rem",
              }}>
                Want the full framework, assessments, and real-world examples? Explore the complete resource on this topic.
              </p>
              <Link href={`/resources/${article.resourceSlug}`} style={{
                fontFamily: "var(--font-montserrat)", fontWeight: 700, fontSize: "0.8rem",
                letterSpacing: "0.06em", textTransform: "uppercase",
                color: "oklch(22% 0.10 260)", textDecoration: "none",
                display: "inline-flex", alignItems: "center", gap: "0.5rem",
              }}>
                {article.resourceLabel} →
              </Link>
            </div>
          )}

          {/* Further reading */}
          {article.furtherReading && article.furtherReading.length > 0 && (
            <div style={{ marginTop: "2.5rem" }}>
              <p style={{
                fontFamily: "var(--font-montserrat)", fontWeight: 700, fontSize: "0.7rem",
                letterSpacing: "0.18em", textTransform: "uppercase",
                color: "oklch(52% 0.008 260)", marginBottom: "0.875rem",
              }}>
                Further reading
              </p>
              <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                {article.furtherReading.map((link, i) => (
                  <li key={i}>
                    <a
                      href={link.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{
                        fontFamily: "var(--font-montserrat)", fontSize: "0.85rem",
                        color: "oklch(45% 0.12 260)", textDecoration: "none",
                        display: "inline-flex", alignItems: "center", gap: "0.35rem",
                      }}
                    >
                      {link.label} ↗
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Back link */}
          <div style={{ marginTop: "3.5rem", paddingTop: "2rem", borderTop: "1px solid oklch(88% 0.008 80)" }}>
            <Link href="/insights" style={{
              fontFamily: "var(--font-montserrat)", fontWeight: 600, fontSize: "0.78rem",
              letterSpacing: "0.08em", textTransform: "uppercase",
              color: "oklch(52% 0.008 260)", textDecoration: "none",
              display: "inline-flex", alignItems: "center", gap: "0.4rem",
            }}>
              ← All insights
            </Link>
          </div>
        </div>
      </section>

    </div>
  );
}

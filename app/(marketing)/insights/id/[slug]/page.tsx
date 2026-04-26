import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { insights, getInsight, formatDate } from "@/lib/insights";
import { SubscribeForm } from "../../_components/SubscribeForm";

export function generateStaticParams() {
  return insights.map(i => ({ slug: i.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const article = getInsight(slug);
  if (!article) return {};
  return {
    title: `${article.id?.title ?? article.title} | Crispy Development`,
    description: article.id?.hook ?? article.hook,
    robots: { index: false, follow: false },
  };
}

export default async function InsightIdPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const article = getInsight(slug);
  if (!article) notFound();

  const body = article.id?.body ?? article.body;
  const paragraphs = body.trim().split("\n\n");

  return (
    <div style={{ background: "oklch(97% 0.005 80)", minHeight: "100vh" }}>
      {/* ── ARTICLE HEADER ── */}
      <section style={{
        background: "oklch(97% 0.005 80)",
        position: "relative", overflow: "hidden",
        borderBottom: "1px solid oklch(88% 0.008 80)",
      }}>
        <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: "5px", background: "oklch(65% 0.15 45)" }} />

        {/* Background illustration watermark */}
        {article.illustration && (
          <div style={{
            position: "absolute", top: "50%", right: "-60px",
            transform: "translateY(-50%)",
            width: "clamp(280px, 40vw, 480px)", aspectRatio: "1",
            pointerEvents: "none", zIndex: 0,
          }}>
            <Image
              src={article.illustration}
              alt=""
              fill
              style={{ objectFit: "contain", mixBlendMode: "multiply", opacity: 0.14 }}
              sizes="480px"
            />
          </div>
        )}

        <div className="container-wide" style={{
          position: "relative", maxWidth: "720px", zIndex: 1,
          paddingTop: "clamp(3rem, 6vw, 5.5rem)",
          paddingBottom: "clamp(2.5rem, 5vw, 4.5rem)",
        }}>
          {/* Breadcrumb + language switcher */}
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "1.75rem" }}>
            <Link href="/insights/id" style={{
              fontFamily: "var(--font-montserrat)", fontWeight: 600, fontSize: "0.7rem",
              letterSpacing: "0.12em", textTransform: "uppercase",
              color: "oklch(65% 0.15 45)", textDecoration: "none",
              display: "inline-flex", alignItems: "center", gap: "0.4rem",
            }}>
              ← Bytes
            </Link>
            <div style={{ display: "flex", gap: "0.25rem" }}>
              <Link href={`/insights/${article.slug}`} style={{
                fontFamily: "var(--font-montserrat)", fontWeight: 500, fontSize: "0.63rem",
                letterSpacing: "0.12em", color: "oklch(58% 0.008 260)",
                padding: "0.25rem 0.5rem", textDecoration: "none",
              }}>EN</Link>
              <span style={{
                fontFamily: "var(--font-montserrat)", fontWeight: 700, fontSize: "0.63rem",
                letterSpacing: "0.12em", color: "oklch(22% 0.10 260)",
                padding: "0.25rem 0.5rem",
              }}>ID</span>
            </div>
          </div>

          {/* Tag */}
          <p style={{
            fontFamily: "var(--font-montserrat)", fontWeight: 700, fontSize: "0.65rem",
            letterSpacing: "0.22em", textTransform: "uppercase",
            color: "oklch(65% 0.15 45)", marginBottom: "1rem",
          }}>
            {article.tag}
          </p>

          {/* Title */}
          <h1 style={{
            fontFamily: "var(--font-cormorant)", fontWeight: 600,
            fontSize: "clamp(2.2rem, 5vw, 3.5rem)", lineHeight: 1.1,
            color: "oklch(22% 0.10 260)", marginBottom: "1.5rem",
          }}>
            {article.id?.title ?? article.title}
          </h1>

          {/* Hook */}
          <p style={{
            fontFamily: "var(--font-cormorant)", fontStyle: "italic", fontWeight: 400,
            fontSize: "clamp(1.15rem, 2.2vw, 1.4rem)", lineHeight: 1.55,
            color: "oklch(38% 0.007 260)", marginBottom: "2rem",
          }}>
            {article.id?.hook ?? article.hook}
          </p>

          {/* Meta */}
          <div style={{ display: "flex", alignItems: "center", gap: "1.5rem" }}>
            <span style={{
              fontFamily: "var(--font-montserrat)", fontSize: "0.72rem",
              color: "oklch(52% 0.008 260)",
            }}>
              {formatDate(article.date)}
            </span>
            <span style={{ width: "4px", height: "4px", borderRadius: "50%", background: "oklch(68% 0.006 260)", display: "inline-block" }} />
            <span style={{
              fontFamily: "var(--font-montserrat)", fontSize: "0.72rem",
              color: "oklch(52% 0.008 260)",
            }}>
              {article.readMinutes} menit baca
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
              background: "oklch(94% 0.006 80)",
            }}>
              <p style={{
                fontFamily: "var(--font-montserrat)", fontWeight: 700, fontSize: "0.7rem",
                letterSpacing: "0.18em", textTransform: "uppercase",
                color: "oklch(65% 0.15 45)", marginBottom: "0.625rem",
              }}>
                Pelajari lebih lanjut
              </p>
              <p style={{
                fontFamily: "var(--font-montserrat)", fontSize: "0.9rem", lineHeight: 1.65,
                color: "oklch(38% 0.007 260)", marginBottom: "1rem",
              }}>
                Ingin framework lengkap, penilaian, dan contoh nyata? Jelajahi sumber lengkap tentang topik ini.
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
                Bacaan lanjutan
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

          <SubscribeForm lang="id" />

          {/* About the writer */}
          <div style={{ marginTop: "3rem", paddingTop: "2rem", borderTop: "1px solid oklch(88% 0.008 80)" }}>
            <p style={{
              fontFamily: "var(--font-montserrat)", fontWeight: 700, fontSize: "0.68rem",
              letterSpacing: "0.18em", textTransform: "uppercase",
              color: "oklch(52% 0.008 260)", marginBottom: "0.75rem",
            }}>
              Tentang penulis
            </p>
            <p style={{
              fontFamily: "var(--font-montserrat)", fontSize: "0.875rem", lineHeight: 1.75,
              color: "oklch(42% 0.007 260)",
            }}>
              Chris Runhaar telah hidup dan bekerja lintas budaya selama hampir dua dekade, mengembangkan sumber daya kepemimpinan dan pelatihan untuk pekerja lapangan, staf NGO, dan tim lintas budaya. Ia menulis bytes ini bukan sebagai peneliti, melainkan sebagai seseorang yang telah ada di lapangan, berusaha membuat ide kepemimpinan yang kompleks menjadi mudah dicerna dan dapat diterapkan.
            </p>
          </div>

          {/* Back link */}
          <div style={{ marginTop: "3.5rem", paddingTop: "2rem", borderTop: "1px solid oklch(88% 0.008 80)" }}>
            <Link href="/insights/id" style={{
              fontFamily: "var(--font-montserrat)", fontWeight: 600, fontSize: "0.78rem",
              letterSpacing: "0.08em", textTransform: "uppercase",
              color: "oklch(52% 0.008 260)", textDecoration: "none",
              display: "inline-flex", alignItems: "center", gap: "0.4rem",
            }}>
              ← Semua bytes
            </Link>
          </div>
        </div>
      </section>

    </div>
  );
}

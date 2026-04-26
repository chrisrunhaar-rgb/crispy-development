import type { Metadata } from "next";
import Link from "next/link";
import { insights, formatDate } from "@/lib/insights";
import { InsightsNavDropdown } from "../_components/InsightsNavDropdown";

export const metadata: Metadata = {
  title: "Leadership Bytes — Wawasan | Crispy Development",
  description: "Artikel singkat dan praktis tentang kepemimpinan lintas budaya.",
  robots: { index: false, follow: false },
};

export default function InsightsIdPage() {
  const latest = insights.slice(0, 3);
  const archive = insights.slice(3);

  return (
    <div style={{ background: "oklch(97% 0.005 80)", minHeight: "100vh" }}>
      <style>{`
        .bytes-featured:hover .bytes-featured-title {
          color: oklch(48% 0.12 260);
        }
        .bytes-featured:hover .bytes-read-link {
          color: oklch(55% 0.13 45);
        }
        .bytes-secondary:hover .bytes-secondary-title {
          color: oklch(48% 0.12 260);
        }
        .bytes-secondary:hover .bytes-secondary-read {
          color: oklch(55% 0.13 45);
        }
      `}</style>

      {/* ── PAGE HEADER ── */}
      <section style={{
        background: "oklch(97% 0.005 80)",
        position: "relative",
        overflow: "hidden",
      }}>
        <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: "5px", background: "oklch(65% 0.15 45)" }} />

        <div className="container-wide" style={{
          position: "relative",
          paddingTop: "clamp(3.5rem, 7vw, 6rem)",
          paddingBottom: "clamp(2.5rem, 5vw, 4rem)",
        }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "1.75rem" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
              <div style={{
                background: "oklch(65% 0.15 45)",
                padding: "0.28rem 0.75rem",
                display: "inline-flex", alignItems: "center",
              }}>
                <span style={{
                  fontFamily: "var(--font-montserrat)", fontWeight: 800, fontSize: "0.6rem",
                  letterSpacing: "0.3em", textTransform: "uppercase",
                  color: "oklch(97% 0.005 80)",
                }}>
                  Bytes
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
            <div style={{ display: "flex", gap: "0.25rem" }}>
              <Link href="/insights" style={{
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

          <h1 style={{
            fontFamily: "var(--font-cormorant)", fontWeight: 600,
            fontSize: "clamp(2.6rem, 5.5vw, 4.5rem)", lineHeight: 1.05,
            color: "oklch(22% 0.10 260)", marginBottom: "1.5rem",
            letterSpacing: "-0.01em",
          }}>
            Leadership<br />Bytes
          </h1>

          <p style={{
            fontFamily: "var(--font-montserrat)", fontSize: "1rem", lineHeight: 1.7,
            color: "oklch(45% 0.008 260)", maxWidth: "500px",
          }}>
            Bacaan singkat dan praktis tentang kepemimpinan lintas budaya. Topik aktual, contoh nyata, terhubung ke sumber yang lebih dalam.
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
              {insights.length} artikel
            </span>
            <span style={{ width: "3px", height: "3px", borderRadius: "50%", background: "oklch(72% 0.006 260)", display: "inline-block" }} />
            <span style={{
              fontFamily: "var(--font-montserrat)", fontSize: "0.7rem",
              color: "oklch(55% 0.008 260)",
            }}>
              Diperbarui secara berkala
            </span>
          </div>
        </div>
      </section>

      {/* ── LATEST BYTES ── */}
      <section style={{ padding: "clamp(3rem, 6vw, 5rem) 0" }}>
        <div className="container-wide">

          {/* Featured — latest article */}
          <Link
            href={`/insights/id/${latest[0].slug}`}
            className="bytes-featured"
            style={{ display: "block", textDecoration: "none", marginBottom: "3rem" }}
          >
            <div style={{ paddingBottom: "2.75rem", borderBottom: "1px solid oklch(88% 0.008 80)" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "1.25rem", marginBottom: "1.25rem" }}>
                <span style={{
                  fontFamily: "var(--font-montserrat)", fontWeight: 700, fontSize: "0.63rem",
                  letterSpacing: "0.18em", textTransform: "uppercase",
                  color: "oklch(65% 0.15 45)",
                }}>
                  {latest[0].tag}
                </span>
                <span style={{
                  fontFamily: "var(--font-montserrat)", fontSize: "0.7rem",
                  color: "oklch(62% 0.006 260)",
                }}>
                  {latest[0].readMinutes} menit baca
                </span>
              </div>

              <h2
                className="bytes-featured-title"
                style={{
                  fontFamily: "var(--font-cormorant)", fontWeight: 600,
                  fontSize: "clamp(1.9rem, 4vw, 3rem)", lineHeight: 1.1,
                  color: "oklch(22% 0.10 260)", marginBottom: "1rem",
                  transition: "color 0.15s",
                }}
              >
                {latest[0].id?.title ?? latest[0].title}
              </h2>

              <p style={{
                fontFamily: "var(--font-montserrat)", fontSize: "1rem", lineHeight: 1.7,
                color: "oklch(42% 0.007 260)", maxWidth: "620px", marginBottom: "1.75rem",
              }}>
                {latest[0].id?.hook ?? latest[0].hook}
              </p>

              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                <span style={{
                  fontFamily: "var(--font-montserrat)", fontSize: "0.72rem",
                  color: "oklch(58% 0.006 260)",
                }}>
                  {formatDate(latest[0].date)}
                </span>
                <span
                  className="bytes-read-link"
                  style={{
                    fontFamily: "var(--font-montserrat)", fontWeight: 600, fontSize: "0.78rem",
                    letterSpacing: "0.05em", color: "oklch(65% 0.15 45)",
                    transition: "color 0.15s",
                  }}
                >
                  Baca byte ini →
                </span>
              </div>
            </div>
          </Link>

          {/* Secondary — next 2 articles */}
          <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(min(100%, 300px), 1fr))",
            gap: "2rem",
          }}>
            {latest.slice(1).map((article) => (
              <Link
                key={article.slug}
                href={`/insights/id/${article.slug}`}
                className="bytes-secondary"
                style={{ display: "block", textDecoration: "none" }}
              >
                <div style={{ paddingBottom: "1.75rem" }}>
                  <span style={{
                    fontFamily: "var(--font-montserrat)", fontWeight: 700, fontSize: "0.6rem",
                    letterSpacing: "0.18em", textTransform: "uppercase",
                    color: "oklch(65% 0.15 45)", display: "block", marginBottom: "0.75rem",
                  }}>
                    {article.tag}
                  </span>

                  <h3
                    className="bytes-secondary-title"
                    style={{
                      fontFamily: "var(--font-cormorant)", fontWeight: 600,
                      fontSize: "clamp(1.3rem, 2.5vw, 1.65rem)", lineHeight: 1.15,
                      color: "oklch(22% 0.10 260)", marginBottom: "0.875rem",
                      transition: "color 0.15s",
                    }}
                  >
                    {article.id?.title ?? article.title}
                  </h3>

                  <p style={{
                    fontFamily: "var(--font-montserrat)", fontSize: "0.875rem", lineHeight: 1.65,
                    color: "oklch(48% 0.007 260)", marginBottom: "1.25rem",
                  }}>
                    {article.id?.hook ?? article.hook}
                  </p>

                  <div style={{
                    display: "flex", alignItems: "center", justifyContent: "space-between",
                    paddingTop: "1rem", borderTop: "1px solid oklch(90% 0.006 80)",
                  }}>
                    <span style={{
                      fontFamily: "var(--font-montserrat)", fontSize: "0.7rem",
                      color: "oklch(58% 0.006 260)",
                    }}>
                      {formatDate(article.date)}
                    </span>
                    <span
                      className="bytes-secondary-read"
                      style={{
                        fontFamily: "var(--font-montserrat)", fontWeight: 600, fontSize: "0.72rem",
                        color: "oklch(65% 0.15 45)", transition: "color 0.15s",
                      }}
                    >
                      Baca →
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>

          {/* Archive nav */}
          {archive.length > 0 && (
            <div style={{
              marginTop: "3rem", paddingTop: "2rem",
              borderTop: "1px solid oklch(88% 0.008 80)",
              display: "flex", alignItems: "center", gap: "1.5rem", flexWrap: "wrap",
            }}>
              <span style={{
                fontFamily: "var(--font-montserrat)", fontWeight: 700, fontSize: "0.63rem",
                letterSpacing: "0.16em", textTransform: "uppercase",
                color: "oklch(52% 0.008 260)", whiteSpace: "nowrap",
              }}>
                Bytes sebelumnya
              </span>
              <InsightsNavDropdown
                articles={archive.map((a) => ({ slug: a.slug, title: a.id?.title ?? a.title }))}
                basePath="/insights/id"
              />
            </div>
          )}

        </div>
      </section>

      {/* ── ABOUT THE WRITER ── */}
      <section style={{
        background: "oklch(94% 0.006 80)",
        borderTop: "1px solid oklch(88% 0.008 80)",
        padding: "clamp(2.5rem, 5vw, 4rem) 0",
      }}>
        <div className="container-wide" style={{ maxWidth: "720px" }}>
          <p style={{
            fontFamily: "var(--font-montserrat)", fontWeight: 700, fontSize: "0.68rem",
            letterSpacing: "0.18em", textTransform: "uppercase",
            color: "oklch(52% 0.008 260)", marginBottom: "1.25rem",
          }}>
            Tentang penulis
          </p>
          <p style={{
            fontFamily: "var(--font-cormorant)", fontStyle: "italic",
            fontSize: "clamp(1.1rem, 2vw, 1.3rem)", lineHeight: 1.6,
            color: "oklch(30% 0.008 260)", marginBottom: "1rem",
          }}>
            Chris Runhaar adalah pendiri Crispy Development, sebuah platform untuk pemimpin Kristen lintas budaya.
          </p>
          <p style={{
            fontFamily: "var(--font-montserrat)", fontSize: "0.9375rem", lineHeight: 1.75,
            color: "oklch(40% 0.007 260)", marginBottom: "0.875rem",
          }}>
            Ia telah hidup dan bekerja lintas budaya selama hampir dua dekade. Ia memimpin tim NGO dan pengembangan komunitas di Asia Tenggara dan Afrika, dan belakangan ini berfokus pada pengembangan kepemimpinan dan pelatihan untuk tim lintas budaya, pekerja lapangan, dan pemimpin ekspatriat.
          </p>
          <p style={{
            fontFamily: "var(--font-montserrat)", fontSize: "0.9375rem", lineHeight: 1.75,
            color: "oklch(40% 0.007 260)",
          }}>
            Leadership Bytes adalah upayanya untuk menyampaikan pemikiran kepemimpinan dalam format yang mudah dipahami: cukup singkat untuk dibaca saat istirahat rapat, cukup spesifik untuk bermanfaat, dan cukup jujur untuk memulai percakapan yang sesungguhnya. Setiap byte terhubung ke sumber yang lebih dalam bagi mereka yang ingin melanjutkan.
          </p>
        </div>
      </section>

    </div>
  );
}

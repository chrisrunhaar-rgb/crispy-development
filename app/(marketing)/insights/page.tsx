import type { Metadata } from "next";
import Link from "next/link";
import { insights, formatDate } from "@/lib/insights";
import { InsightsNavDropdown } from "./_components/InsightsNavDropdown";

export const metadata: Metadata = {
  title: "Leadership Bytes — Insights | Crispy Development",
  description: "Short, practical articles on cross-cultural leadership. Timely topics, real-world examples, linked to deeper resources.",
  robots: { index: false, follow: false },
};

export default function InsightsPage() {
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
          <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginBottom: "1.75rem" }}>
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
            Short, practical reads on cross-cultural leadership. Timely topics, real examples, linked to the deeper resources.
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
              {insights.length} articles
            </span>
            <span style={{ width: "3px", height: "3px", borderRadius: "50%", background: "oklch(72% 0.006 260)", display: "inline-block" }} />
            <span style={{
              fontFamily: "var(--font-montserrat)", fontSize: "0.7rem",
              color: "oklch(55% 0.008 260)",
            }}>
              Updated regularly
            </span>
          </div>
        </div>
      </section>

      {/* ── LATEST BYTES ── */}
      <section style={{ padding: "clamp(3rem, 6vw, 5rem) 0" }}>
        <div className="container-wide">

          {/* Featured — latest article */}
          <Link
            href={`/insights/${latest[0].slug}`}
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
                  {latest[0].readMinutes} min read
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
                {latest[0].title}
              </h2>

              <p style={{
                fontFamily: "var(--font-montserrat)", fontSize: "1rem", lineHeight: 1.7,
                color: "oklch(42% 0.007 260)", maxWidth: "620px", marginBottom: "1.75rem",
              }}>
                {latest[0].hook}
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
                  Read this byte →
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
                href={`/insights/${article.slug}`}
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
                    {article.title}
                  </h3>

                  <p style={{
                    fontFamily: "var(--font-montserrat)", fontSize: "0.875rem", lineHeight: 1.65,
                    color: "oklch(48% 0.007 260)", marginBottom: "1.25rem",
                  }}>
                    {article.hook}
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
                      Read →
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
                Previous bytes
              </span>
              <InsightsNavDropdown
                articles={archive.map((a) => ({ slug: a.slug, title: a.title }))}
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
            About the writer
          </p>
          <p style={{
            fontFamily: "var(--font-cormorant)", fontStyle: "italic",
            fontSize: "clamp(1.1rem, 2vw, 1.3rem)", lineHeight: 1.6,
            color: "oklch(30% 0.008 260)", marginBottom: "1rem",
          }}>
            Chris Runhaar is the founder of Crispy Development, a platform for cross-cultural Christian leaders.
          </p>
          <p style={{
            fontFamily: "var(--font-montserrat)", fontSize: "0.9375rem", lineHeight: 1.75,
            color: "oklch(40% 0.007 260)", marginBottom: "0.875rem",
          }}>
            He has lived and worked across cultures for nearly two decades. He led NGO and community development teams across Southeast Asia and Africa, and more recently focused on leadership development and training for cross-cultural teams, field workers, and expat leaders.
          </p>
          <p style={{
            fontFamily: "var(--font-montserrat)", fontSize: "0.9375rem", lineHeight: 1.75,
            color: "oklch(40% 0.007 260)",
          }}>
            Leadership Bytes is his attempt to put leadership thinking in a format that travels well: short enough to read in a meeting break, specific enough to be useful, and honest enough to start a real conversation. Every byte links to the deeper resources for those who want to go further.
          </p>
        </div>
      </section>

    </div>
  );
}

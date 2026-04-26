import type { Metadata } from "next";
import Link from "next/link";
import { insights, formatDate } from "@/lib/insights";

export const metadata: Metadata = {
  title: "Leadership Bytes — Insights | Crispy Development",
  description: "Short, practical articles on cross-cultural leadership. Timely topics, real-world examples, linked to deeper resources.",
  robots: { index: false, follow: false },
};

export default function InsightsPage() {
  return (
    <div style={{ background: "oklch(97% 0.005 80)", minHeight: "100vh" }}>
      <style>{`
        .insight-card {
          background: oklch(100% 0 0);
          border: 1px solid oklch(88% 0.008 80);
          padding: 2rem;
          height: 100%;
          display: flex;
          flex-direction: column;
          gap: 1rem;
          transition: border-color 0.15s, box-shadow 0.15s;
          text-decoration: none;
        }
        .insight-card:hover {
          border-color: oklch(65% 0.15 45);
          box-shadow: 0 4px 24px oklch(22% 0.10 260 / 0.08);
        }
      `}</style>

      {/* ── PAGE HEADER ── */}
      <section style={{
        background: "oklch(22% 0.10 260)",
        padding: "clamp(3.5rem, 7vw, 6rem) 0 clamp(3rem, 6vw, 5rem)",
        position: "relative",
        overflow: "hidden",
      }}>
        <div aria-hidden="true" style={{
          position: "absolute", inset: 0,
          backgroundImage: "radial-gradient(circle, oklch(97% 0.005 80 / 0.05) 1px, transparent 1px)",
          backgroundSize: "32px 32px",
          pointerEvents: "none",
        }} />
        <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: "3px", background: "oklch(65% 0.15 45)" }} />

        <div className="container-wide" style={{ position: "relative" }}>
          <p style={{
            fontFamily: "var(--font-montserrat)", fontWeight: 700, fontSize: "0.72rem",
            letterSpacing: "0.22em", textTransform: "uppercase",
            color: "oklch(65% 0.15 45)", marginBottom: "1.25rem",
          }}>
            Insights
          </p>
          <h1 style={{
            fontFamily: "var(--font-cormorant)", fontWeight: 600,
            fontSize: "clamp(2.4rem, 5vw, 4rem)", lineHeight: 1.08,
            color: "oklch(97% 0.005 80)", marginBottom: "1.25rem",
          }}>
            Leadership Bytes
          </h1>
          <p style={{
            fontFamily: "var(--font-montserrat)", fontSize: "1rem", lineHeight: 1.7,
            color: "oklch(75% 0.008 260)", maxWidth: "540px",
          }}>
            Short, practical reads on cross-cultural leadership. Timely topics, real examples, linked to the deeper resources on this site.
          </p>
        </div>
      </section>

      {/* ── ARTICLE GRID ── */}
      <section style={{ padding: "clamp(3rem, 6vw, 5rem) 0" }}>
        <div className="container-wide">
          <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(min(100%, 340px), 1fr))",
            gap: "1.5rem",
          }}>
            {insights.map((article) => (
              <Link
                key={article.slug}
                href={`/insights/${article.slug}`}
                className="insight-card"
              >
                <>
                  {/* Tag + read time */}
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                    <span style={{
                      fontFamily: "var(--font-montserrat)", fontWeight: 700, fontSize: "0.65rem",
                      letterSpacing: "0.18em", textTransform: "uppercase",
                      color: "oklch(65% 0.15 45)",
                    }}>
                      {article.tag}
                    </span>
                    <span style={{
                      fontFamily: "var(--font-montserrat)", fontSize: "0.7rem",
                      color: "oklch(62% 0.006 260)",
                    }}>
                      {article.readMinutes} min read
                    </span>
                  </div>

                  {/* Orange divider */}
                  <div style={{ width: "40px", height: "3px", background: "oklch(65% 0.15 45)" }} />

                  {/* Title */}
                  <h2 style={{
                    fontFamily: "var(--font-cormorant)", fontWeight: 600,
                    fontSize: "clamp(1.35rem, 2.5vw, 1.65rem)", lineHeight: 1.15,
                    color: "oklch(22% 0.10 260)", flex: 1,
                  }}>
                    {article.title}
                  </h2>

                  {/* Hook */}
                  <p style={{
                    fontFamily: "var(--font-montserrat)", fontSize: "0.875rem", lineHeight: 1.65,
                    color: "oklch(45% 0.006 260)",
                  }}>
                    {article.hook}
                  </p>

                  {/* Footer */}
                  <div style={{
                    display: "flex", alignItems: "center", justifyContent: "space-between",
                    paddingTop: "1rem", borderTop: "1px solid oklch(92% 0.005 80)",
                    marginTop: "auto",
                  }}>
                    <span style={{
                      fontFamily: "var(--font-montserrat)", fontSize: "0.72rem",
                      color: "oklch(62% 0.006 260)",
                    }}>
                      {formatDate(article.date)}
                    </span>
                    <span style={{
                      fontFamily: "var(--font-montserrat)", fontWeight: 600, fontSize: "0.75rem",
                      letterSpacing: "0.04em", color: "oklch(65% 0.15 45)",
                    }}>
                      Read →
                    </span>
                  </div>
                </>
              </Link>
            ))}
          </div>
        </div>
      </section>

    </div>
  );
}

import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Worth Reading | Crispy Development",
  description: "Articles from the web worth reading — handpicked for cross-cultural leaders navigating life and work across cultures.",
};

type Article = {
  image: string;
  source: string;
  title: string;
  summary: string;
  author: string;
  date: string;
  url: string;
};

const articles: Article[] = [
  {
    image: "/article-hcamag-cultural-awareness.png",
    source: "Human Resources Director Asia",
    title: "Cultural Awareness: The Key to Managing Global Workplaces",
    summary: "A new global report reveals striking differences in how employees approach work across cultures — from Japan's long hours to Finland's work-life balance. Expert Michele Haugh argues cultural awareness must be taught, modelled, and practised consistently: when leaders learn the cultural rhythms that matter to their people, it shifts conversations from assumptions to curiosity.",
    author: "Dexter Tilo",
    date: "May 2026",
    url: "https://www.hcamag.com/asia/news/general/cultural-awareness-the-key-to-managing-global-workplaces/574686",
  },
  {
    image: "/article-tgc-cultural-realities.jpg",
    source: "The Gospel Coalition Africa",
    title: "Don't Ignore Cultural Realities When Doing Ministry Together",
    summary: "Cross-cultural ministry partnerships between Africans and foreigners bring real rewards — and real friction. Written by African and Western voices together, this piece offers honest, practical guidance on navigating cultural differences, building genuine partnership, and approaching collaboration with humility on both sides.",
    author: "Jonny Kabiswa Kyazze & Anthony Sytsma",
    date: "April 2026",
    url: "https://africa.thegospelcoalition.org/article/dont-ignore-cultural-realities-when-doing-ministry-together/",
  },
  {
    image: "/article-global-integration-leadership.webp",
    source: "Global Integration",
    title: "Global Leadership: Balancing Control and Empowerment in Complex Teams",
    summary: "Global leadership is undermined by five structural barriers — distance, culture, time zones, technology, and organisational boundaries. This piece explores why authority-based leadership fails in global teams, and what effective leaders do differently: influence over control, clarity over proximity, trust over hierarchy.",
    author: "Kevan Hall",
    date: "March 2026",
    url: "https://www.global-integration.com/insights/global-leadership-balancing-control-and-empowerment-in-complex-teams/",
  },
];

export default function ArticlesPage() {
  return (
    <div style={{ background: "oklch(97% 0.005 80)", minHeight: "100vh" }}>
      {/* ── PAGE HEADER ── */}
      <section style={{ background: "oklch(30% 0.12 260)", paddingTop: "clamp(4rem, 7vw, 7rem)", paddingBottom: "clamp(4rem, 7vw, 7rem)", position: "relative", overflow: "hidden" }}>
        <div aria-hidden="true" style={{ position: "absolute", inset: 0, backgroundImage: "url('/pathway-articles.jpg')", backgroundSize: "cover", backgroundPosition: "center 40%", opacity: 0.22, pointerEvents: "none" }} />
        <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: "3px", background: "oklch(65% 0.15 45)" }} />

        <div className="container-wide" style={{ position: "relative" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "0.625rem", marginBottom: "1rem" }}>
            <img src="/logo-icon.png" alt="" width={22} height={22} style={{ filter: "brightness(0) invert(1)", opacity: 0.75, flexShrink: 0 }} />
            <p className="t-label" style={{ color: "oklch(65% 0.15 45)", margin: 0 }}>From the Web</p>
          </div>

          <h1 className="t-section" style={{ marginBottom: "1rem", maxWidth: "560px", color: "oklch(97% 0.005 80)" }}>
            Worth<br />Reading.
          </h1>

          <p style={{ fontFamily: "var(--font-montserrat)", fontSize: "0.9375rem", color: "oklch(72% 0.04 260)", maxWidth: "52ch", lineHeight: 1.7 }}>
            The best writing on cross-cultural leadership, faith in the workplace, and leading across difference — handpicked from the web.
          </p>
        </div>
      </section>

      {/* ── ARTICLES ── */}
      <section style={{ padding: "clamp(3rem, 6vw, 5rem) 0" }}>
        <div className="container-wide">
          <div style={{ display: "flex", flexDirection: "column", gap: "2.5rem" }}>
            {articles.map((article, i) => (
              <a
                key={i}
                href={article.url}
                target="_blank"
                rel="noopener noreferrer"
                className="article-card"
                style={{ textDecoration: "none", display: "block" }}
              >
                <div style={{
                  display: "grid",
                  gridTemplateColumns: "minmax(0, 2fr) minmax(0, 3fr)",
                  gap: 0,
                  background: "oklch(100% 0 0)",
                  border: "1px solid oklch(88% 0.008 80)",
                  overflow: "hidden",
                  transition: "box-shadow 0.15s, border-color 0.15s",
                }}
                  className="article-card-inner"
                >
                  {/* Image */}
                  <div style={{
                    aspectRatio: "16/10",
                    overflow: "hidden",
                    flexShrink: 0,
                  }}>
                    <img
                      src={article.image}
                      alt=""
                      style={{ width: "100%", height: "100%", objectFit: "cover", display: "block", transition: "transform 0.3s" }}
                      className="article-card-img"
                    />
                  </div>

                  {/* Content */}
                  <div style={{ padding: "2rem 2.25rem", display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
                    <div>
                      <span style={{
                        fontFamily: "var(--font-montserrat)", fontWeight: 700, fontSize: "0.58rem",
                        letterSpacing: "0.14em", textTransform: "uppercase",
                        color: "oklch(65% 0.15 45)", display: "block", marginBottom: "0.75rem",
                      }}>
                        {article.source}
                      </span>

                      <h2 style={{
                        fontFamily: "var(--font-cormorant)", fontWeight: 600,
                        fontSize: "clamp(1.35rem, 2.2vw, 1.75rem)", lineHeight: 1.2,
                        color: "oklch(22% 0.10 260)", marginBottom: "1rem",
                      }}
                        className="article-card-title"
                      >
                        {article.title}
                      </h2>

                      <p style={{
                        fontFamily: "var(--font-montserrat)", fontSize: "0.875rem", lineHeight: 1.7,
                        color: "oklch(45% 0.007 260)",
                      }}>
                        {article.summary}
                      </p>
                    </div>

                    <div style={{
                      display: "flex", alignItems: "center", justifyContent: "space-between",
                      paddingTop: "1.25rem", marginTop: "1.5rem",
                      borderTop: "1px solid oklch(90% 0.006 80)",
                    }}>
                      <div>
                        <span style={{ fontFamily: "var(--font-montserrat)", fontSize: "0.72rem", fontWeight: 600, color: "oklch(38% 0.008 260)", display: "block" }}>
                          {article.author}
                        </span>
                        <span style={{ fontFamily: "var(--font-montserrat)", fontSize: "0.68rem", color: "oklch(58% 0.006 260)" }}>
                          {article.date}
                        </span>
                      </div>
                      <span className="article-card-cta" style={{
                        fontFamily: "var(--font-montserrat)", fontWeight: 600, fontSize: "0.78rem",
                        letterSpacing: "0.04em", color: "oklch(65% 0.15 45)",
                        transition: "color 0.15s",
                      }}>
                        Read article →
                      </span>
                    </div>
                  </div>
                </div>
              </a>
            ))}
          </div>
        </div>
      </section>

      <style>{`
        .article-card-inner:hover {
          border-color: oklch(65% 0.15 45);
          box-shadow: 0 4px 24px oklch(22% 0.10 260 / 0.08);
        }
        .article-card:hover .article-card-title {
          color: oklch(42% 0.12 260);
        }
        .article-card:hover .article-card-cta {
          color: oklch(55% 0.13 45);
        }
        .article-card:hover .article-card-img {
          transform: scale(1.03);
        }
        @media (max-width: 640px) {
          .article-card-inner {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </div>
  );
}

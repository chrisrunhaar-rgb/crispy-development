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
    image: "https://www.talaera.com/app/uploads/2026/05/high-vs-low-power-distance-featured.png",
    source: "Talaera",
    title: "High vs. Low Power Distance: Why Your Team Won't Speak Up",
    summary: "When you ask for input and the room goes quiet, that silence is rarely indifference. This piece unpacks power distance — the cultural dimension that shapes whether team members feel safe to challenge a leader or offer dissenting views. It diagnoses a compounding effect: team members from high power distance cultures often face both cultural deference and language insecurity simultaneously, each reinforcing the other. Practical and direct, with concrete structural fixes for leaders who want to hear what their teams actually think.",
    author: "Talaera",
    date: "May 2026",
    url: "https://www.talaera.com/culture/high-vs-low-power-distance/",
  },
  {
    image: "/pathway-library.jpg",
    source: "UGM Faculty of Economics & Business",
    title: "Cross-Cultural Leadership Is Key to Leading Businesses in the Age of Globalization",
    summary: "A guest lecture at Universitas Gadjah Mada by Prof. Renato Pereira (ISCTE Business School) makes the case that cross-cultural leadership is now a core business competency, not a soft skill. Using Hofstede's cultural dimensions — power distance, uncertainty avoidance, individualism vs. collectivism, masculinity vs. femininity — Pereira shows how cultural frameworks shape communication, decision-making, and negotiation across borders. The bottom line: there is no single leadership formula for global business, only the willingness to understand and learn from cultural difference.",
    author: "Prof. Renato Pereira, reported by Najwa Anggi Namira",
    date: "May 2026",
    url: "https://feb.ugm.ac.id/en/news/23464-cross-cultural-leadership-is-key-to-leading-businesses-in-the-age-of-globalization",
  },
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
  {
    image: "https://colinmbcooper.com/wp-content/uploads/2026/03/2715138d-008b-430c-9779-5489602b8086-feature.png",
    source: "Colin MB Cooper",
    title: "7 Proven Cross-Cultural Leadership Strategies That Drive Results",
    summary: "Most cross-cultural training teaches stereotypes disguised as insights. This piece cuts through to what actually works: a four-part cultural intelligence framework applied across seven concrete strategies — adapting leadership style by cultural context, building trust differently in task-based versus relationship-based cultures, and designing inclusive decision processes that don't default to dominant cultural norms.",
    author: "Colin MB Cooper",
    date: "March 2026",
    url: "https://colinmbcooper.com/7-proven-cross-cultural-leadership-strategies-that-drive-results/",
  },
  {
    image: "/pathway-team.jpg",
    source: "Asana",
    title: "Building Cultural Intelligence Makes You a Better Manager",
    summary: "Cultural intelligence isn't about memorising cultural facts — it is a skill built over time. Written for managers of distributed and global teams, this guide unpacks the four dimensions of CQ (drive, knowledge, strategy, action), how it differs from emotional intelligence, and practical steps: learning team members' cultural norms, reading body language across cultures, and adjusting feedback styles accordingly.",
    author: "Asana",
    date: "February 2026",
    url: "https://asana.com/resources/cultural-intelligence",
  },
  {
    image: "/pathway-articles.jpg",
    source: "Annual Review of Organizational Psychology",
    title: "Cross-Cultural Leadership: What We Know, What We Need to Know, and Where We Need to Go",
    summary: "A rigorous academic review of what the research actually says about cross-cultural leadership. Den Hartog and De Hoogh examine how societal culture shapes leadership processes and their effects — covering implicit leadership theories, followership across cultures, and the challenges of leading multicultural teams. One of the most comprehensive surveys of the field, drawing on decades of empirical research to identify what we know with confidence and where the gaps remain.",
    author: "Deanne N. Den Hartog & Annebel H.B. De Hoogh",
    date: "January 2024",
    url: "https://www.annualreviews.org/content/journals/10.1146/annurev-orgpsych-110721-033711",
  },
];

export default function ArticlesPage() {
  return (
    <div style={{ background: "oklch(97% 0.005 80)", minHeight: "100vh" }}>

      {/* ── PAGE HEADER ── */}
      <section style={{ background: "oklch(22% 0.10 260)", paddingTop: "clamp(4rem, 7vw, 7rem)", paddingBottom: "clamp(4rem, 7vw, 7rem)", position: "relative", overflow: "hidden" }}>
        {/* Photo overlay */}
        <div aria-hidden="true" style={{ position: "absolute", inset: 0, backgroundImage: "url('/pathway-articles.jpg')", backgroundSize: "cover", backgroundPosition: "center 40%", opacity: 0.18, pointerEvents: "none" }} />
        {/* Dot grid */}
        <div aria-hidden="true" style={{ position: "absolute", inset: 0, backgroundImage: "radial-gradient(circle, oklch(97% 0.005 80 / 0.06) 1px, transparent 1px)", backgroundSize: "28px 28px", pointerEvents: "none" }} />
        {/* Orange accent line */}
        <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: "3px", background: "oklch(65% 0.15 45)" }} />
        {/* Concentric rings */}
        <div aria-hidden="true" style={{ position: "absolute", bottom: "-180px", right: "-180px", width: "480px", height: "480px", borderRadius: "50%", border: "1px solid oklch(97% 0.005 80 / 0.05)", pointerEvents: "none" }}>
          <div style={{ position: "absolute", top: "70px", left: "70px", right: "70px", bottom: "70px", borderRadius: "50%", border: "1px solid oklch(65% 0.15 45 / 0.15)" }} />
        </div>

        <div className="container-wide" style={{ position: "relative" }}>
          {/* Eyebrow */}
          <div style={{ display: "flex", alignItems: "center", gap: "0.875rem", marginBottom: "1.5rem" }}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/logo-icon-dark-badge.png" alt="Crispy Development" width={28} height={28} style={{ flexShrink: 0, display: "block" }} />
            <p style={{ fontFamily: "var(--font-montserrat)", fontSize: "0.7rem", fontWeight: 700, letterSpacing: "0.2em", textTransform: "uppercase", color: "oklch(65% 0.15 45)", margin: 0 }}>
              From the Web
            </p>
          </div>

          {/* Accent rule */}
          <div style={{ width: "48px", height: "2px", background: "oklch(65% 0.15 45)", marginBottom: "1.75rem" }} />

          <h1 style={{ fontFamily: "var(--font-cormorant)", fontStyle: "italic", fontWeight: 600, fontSize: "clamp(2.8rem, 5.5vw, 5.5rem)", lineHeight: 1.0, color: "oklch(97% 0.005 80)", margin: "0 0 1.5rem", maxWidth: "560px" }}>
            Worth<br />Reading.
          </h1>

          <p style={{ fontFamily: "var(--font-montserrat)", fontSize: "0.9375rem", color: "oklch(80% 0.025 260)", maxWidth: "50ch", lineHeight: 1.75, margin: 0 }}>
            The best writing on cross-cultural leadership, faith in the workplace, and leading across difference — handpicked from the web.
          </p>
        </div>
      </section>

      {/* ── ARTICLES ── */}
      <section style={{ padding: "clamp(3.5rem, 7vw, 6rem) 0" }}>
        <div className="container-wide">
          <div style={{ display: "flex", flexDirection: "column", gap: "0" }}>
            {articles.map((article, i) => (
              <a
                key={i}
                href={article.url}
                target="_blank"
                rel="noopener noreferrer"
                className="art-card"
                style={{ textDecoration: "none", display: "block", borderBottom: "1px solid oklch(88% 0.008 80)" }}
              >
                <div
                  className="art-card-inner"
                  style={{
                    display: "grid",
                    gridTemplateColumns: "minmax(0, 2fr) minmax(0, 3fr)",
                    gap: 0,
                    background: "oklch(100% 0 0)",
                    borderLeft: "3px solid transparent",
                    transition: "border-color 0.2s, background 0.2s",
                  }}
                >
                  {/* Image */}
                  <div style={{ aspectRatio: "3/2", overflow: "hidden" }}>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={article.image}
                      alt=""
                      style={{ width: "100%", height: "100%", objectFit: "cover", display: "block", transition: "transform 0.35s ease" }}
                      className="art-card-img"
                    />
                  </div>

                  {/* Content */}
                  <div style={{ padding: "clamp(1.5rem, 3vw, 2.25rem) clamp(1.5rem, 3vw, 2.5rem)", display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
                    <div>
                      {/* Index + source row */}
                      <div style={{ display: "flex", alignItems: "center", gap: "0.625rem", marginBottom: "0.875rem" }}>
                        <span style={{ fontFamily: "var(--font-montserrat)", fontSize: "0.68rem", fontWeight: 700, color: "oklch(80% 0.008 260)", letterSpacing: "0.06em", fontVariantNumeric: "tabular-nums" }}>
                          {String(i + 1).padStart(2, "0")}
                        </span>
                        <span style={{ width: "1px", height: "12px", background: "oklch(82% 0.008 80)", flexShrink: 0 }} />
                        <span style={{ fontFamily: "var(--font-montserrat)", fontWeight: 700, fontSize: "0.68rem", letterSpacing: "0.14em", textTransform: "uppercase", color: "oklch(65% 0.15 45)" }}>
                          {article.source}
                        </span>
                      </div>

                      <h2
                        className="art-card-title"
                        style={{
                          fontFamily: "var(--font-cormorant)", fontWeight: 600,
                          fontSize: "clamp(1.35rem, 2.2vw, 1.8rem)", lineHeight: 1.2,
                          color: "oklch(22% 0.10 260)", margin: "0 0 1rem",
                          transition: "color 0.2s",
                        }}
                      >
                        {article.title}
                      </h2>

                      <p style={{ fontFamily: "var(--font-montserrat)", fontSize: "0.875rem", lineHeight: 1.75, color: "oklch(45% 0.007 260)", margin: 0 }}>
                        {article.summary}
                      </p>
                    </div>

                    {/* Footer */}
                    <div style={{
                      display: "flex", alignItems: "center", justifyContent: "space-between",
                      paddingTop: "1.25rem", marginTop: "1.5rem",
                      borderTop: "1px solid oklch(90% 0.006 80)",
                      gap: "1rem",
                    }}>
                      <p style={{ fontFamily: "var(--font-montserrat)", fontSize: "0.75rem", color: "oklch(52% 0.006 260)", margin: 0, lineHeight: 1.4 }}>
                        {article.author}
                        <span style={{ color: "oklch(72% 0.005 260)", margin: "0 0.375rem" }}>·</span>
                        {article.date}
                      </p>
                      <span
                        className="art-card-cta"
                        style={{
                          fontFamily: "var(--font-montserrat)", fontWeight: 700, fontSize: "0.75rem",
                          letterSpacing: "0.04em", color: "oklch(65% 0.15 45)",
                          whiteSpace: "nowrap", flexShrink: 0,
                          transition: "color 0.2s",
                        }}
                      >
                        Read →
                      </span>
                    </div>
                  </div>
                </div>
              </a>
            ))}
          </div>

          {/* Curation note */}
          <div style={{ marginTop: "3.5rem", paddingTop: "2rem", borderTop: "1px solid oklch(88% 0.008 80)", display: "flex", alignItems: "flex-start", gap: "0.875rem", maxWidth: "60ch" }}>
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true" style={{ color: "oklch(65% 0.15 45)", flexShrink: 0, marginTop: "2px" }}>
              <path d="M8 1.5C4.41 1.5 1.5 4.41 1.5 8S4.41 14.5 8 14.5 14.5 11.59 14.5 8 11.59 1.5 8 1.5zm0 2a1 1 0 1 1 0 2 1 1 0 0 1 0-2zm0 3.5h.01c.54 0 .99.45.99 1v3.5a1 1 0 1 1-2 0V8c0-.55.45-1 1-1H8z" fill="currentColor" fillRule="evenodd" />
            </svg>
            <p style={{ fontFamily: "var(--font-montserrat)", fontSize: "0.8rem", lineHeight: 1.75, color: "oklch(52% 0.006 260)", margin: 0 }}>
              These articles are curated by Crispy Development — not sponsored or affiliated. We share what we find genuinely useful for cross-cultural leaders.
            </p>
          </div>
        </div>
      </section>

      <style>{`
        .art-card-inner:hover {
          border-left-color: oklch(65% 0.15 45);
          background: oklch(99.5% 0.002 80);
        }
        .art-card:hover .art-card-title {
          color: oklch(38% 0.12 255);
        }
        .art-card:hover .art-card-cta {
          color: oklch(55% 0.13 45);
        }
        .art-card:hover .art-card-img {
          transform: scale(1.04);
        }
        @media (max-width: 640px) {
          .art-card-inner {
            grid-template-columns: 1fr !important;
          }
        }
        @media (prefers-reduced-motion: reduce) {
          .art-card-inner, .art-card-img { transition: none !important; }
        }
      `}</style>
    </div>
  );
}

"use client";
import { T, SERIF, SANS, KIT_CSS, Eyebrow, h2Style, bodyStyle, PrimaryLink, TextLink } from "@/components/promo/PromoKit";

type Article = {
  image?: string;
  source: string;
  title: string;
  summary: string;
  author: string;
  date: string;
  url: string;
};

// Images are each article's own og:image. No local stand-ins: if a site
// exposes no image, the row shows a typographic tile instead.
const articles: Article[] = [
  {
    image: "https://lausanne.org/wp-content/uploads/2024/02/LGA-Article2-Burnout-header-scaled.jpg",
    source: "Lausanne Movement",
    title: "Burnout Among Cross-Cultural Workers: The Systemic Causes Sending Organisations Miss",
    summary: "A member care trainer who led his own family through severe burnout draws on his MA dissertation to argue that burnout among cross-cultural workers is largely a systemic problem, not a personal failure. Using Maslach and Leiter's six organisational risk factors, Billy Drum identifies how lack of control, unrealistic workload expectations, values mismatch, breakdown of community, inadequate reward, and perceived unfairness combine to push cross-cultural workers toward collapse. A Barna estimate puts the figure at 1,500 North American ministry workers leaving monthly in part due to burnout, at a financial cost of USD 500,000 per worker in the first four years alone. But the real cost lands on families, teams, and gospel witness. Drum ends with concrete preventative tools (the Maslach Burnout Inventory and Areas of Worklife Survey), calling mission agencies to move from reactive care to structural change. Essential reading for any leader responsible for the health of a cross-cultural team.",
    author: "Billy Drum",
    date: "2024",
    url: "https://lausanne.org/global-analysis/burnout-among-missionaries",
  },
  {
    image: "https://scx1.b-cdn.net/csz/news/800a/2020/businesstrav.jpg",
    source: "Phys.org / Journal of Global Mobility",
    title: "Why Sending Staff Overseas Often Fails, and How Companies Can Fix It",
    summary: "University of Portsmouth and Reutlingen University researchers interviewed expats, host-country colleagues, managers, and HR professionals at a multinational retail company to understand why international assignments succeed or struggle. The finding cuts through the usual focus on the expat: success depends far more on workplace relationships than formal policies. Local line managers are the pivotal factor: how they set the tone for collaboration determines whether knowledge transfer and cross-cultural trust actually develop. Structured onboarding, a shared workplace language, intercultural training for all staff (not just the expat), and informal social contact all matter. The takeaway: organisations need to move beyond an individual-focused approach and invest in the wider relational environment.",
    author: "Liza Howe-Walsh & Hannah Scollan, University of Portsmouth",
    date: "May 2026",
    url: "https://phys.org/news/2026-05-staff-overseas-companies.html",
  },
  {
    image: "https://www.talaera.com/app/uploads/2026/05/high-vs-low-power-distance-featured.png",
    source: "Talaera",
    title: "High vs. Low Power Distance: Why Your Team Won't Speak Up",
    summary: "When you ask for input and the room goes quiet, that silence is rarely indifference. This piece unpacks power distance, the cultural dimension that shapes whether team members feel safe to challenge a leader or offer dissenting views. It diagnoses a compounding effect: team members from high power distance cultures often face both cultural deference and language insecurity simultaneously, each reinforcing the other. Practical and direct, with concrete structural fixes for leaders who want to hear what their teams actually think.",
    author: "Talaera",
    date: "May 2026",
    url: "https://www.talaera.com/culture/high-vs-low-power-distance/",
  },
  {
    image: "https://feb.ugm.ac.id/wp-content/uploads/sites/47/2026/05/GUEST-LECTURE-RENATO-1.png",
    source: "UGM Faculty of Economics & Business",
    title: "Cross-Cultural Leadership Is Key to Leading Businesses in the Age of Globalization",
    summary: "A guest lecture at Universitas Gadjah Mada by Prof. Renato Pereira (ISCTE Business School) makes the case that cross-cultural leadership is now a core business competency, not a soft skill. Using Hofstede's cultural dimensions (power distance, uncertainty avoidance, individualism vs. collectivism, masculinity vs. femininity), Pereira shows how cultural frameworks shape communication, decision-making, and negotiation across borders. The bottom line: there is no single leadership formula for global business, only the willingness to understand and learn from cultural difference.",
    author: "Prof. Renato Pereira, reported by Najwa Anggi Namira",
    date: "May 2026",
    url: "https://feb.ugm.ac.id/en/news/23464-cross-cultural-leadership-is-key-to-leading-businesses-in-the-age-of-globalization",
  },
  {
    image: "/article-hcamag-cultural-awareness.png",
    source: "Human Resources Director Asia",
    title: "Cultural Awareness: The Key to Managing Global Workplaces",
    summary: "A new global report reveals striking differences in how employees approach work across cultures, from Japan's long hours to Finland's work-life balance. Expert Michele Haugh argues cultural awareness must be taught, modelled, and practised consistently: when leaders learn the cultural rhythms that matter to their people, it shifts conversations from assumptions to curiosity.",
    author: "Dexter Tilo",
    date: "May 2026",
    url: "https://www.hcamag.com/asia/news/general/cultural-awareness-the-key-to-managing-global-workplaces/574686",
  },
  {
    image: "/article-tgc-cultural-realities.jpg",
    source: "The Gospel Coalition Africa",
    title: "Don't Ignore Cultural Realities When Doing Ministry Together",
    summary: "Cross-cultural ministry partnerships between Africans and foreigners bring real rewards and real friction. Written by African and Western voices together, this piece offers honest, practical guidance on navigating cultural differences, building genuine partnership, and approaching collaboration with humility on both sides.",
    author: "Jonny Kabiswa Kyazze & Anthony Sytsma",
    date: "April 2026",
    url: "https://africa.thegospelcoalition.org/article/dont-ignore-cultural-realities-when-doing-ministry-together/",
  },
  {
    image: "/article-global-integration-leadership.webp",
    source: "Global Integration",
    title: "Global Leadership: Balancing Control and Empowerment in Complex Teams",
    summary: "Global leadership is undermined by five structural barriers: distance, culture, time zones, technology, and organisational boundaries. This piece explores why authority-based leadership fails in global teams, and what effective leaders do differently: influence over control, clarity over proximity, trust over hierarchy.",
    author: "Kevan Hall",
    date: "March 2026",
    url: "https://www.global-integration.com/insights/global-leadership-balancing-control-and-empowerment-in-complex-teams/",
  },
  {
    image: "https://colinmbcooper.com/wp-content/uploads/2026/03/2715138d-008b-430c-9779-5489602b8086-feature.png",
    source: "Colin MB Cooper",
    title: "7 Proven Cross-Cultural Leadership Strategies That Drive Results",
    summary: "Most cross-cultural training teaches stereotypes disguised as insights. This piece cuts through to what actually works: a four-part cultural intelligence framework applied across seven concrete strategies: adapting leadership style by cultural context, building trust differently in task-based versus relationship-based cultures, and designing inclusive decision processes that don't default to dominant cultural norms.",
    author: "Colin MB Cooper",
    date: "March 2026",
    url: "https://colinmbcooper.com/7-proven-cross-cultural-leadership-strategies-that-drive-results/",
  },
  {
    image: "https://assets.asana.biz/transform/ee45f1ba-1204-4189-864f-5b00ad0a414a/web-RC26-grid-ai-milestones-launch-batch4",
    source: "Asana",
    title: "Building Cultural Intelligence Makes You a Better Manager",
    summary: "Cultural intelligence isn't about memorising cultural facts. It is a skill built over time. Written for managers of distributed and global teams, this guide unpacks the four dimensions of CQ (drive, knowledge, strategy, action), how it differs from emotional intelligence, and practical steps: learning team members' cultural norms, reading body language across cultures, and adjusting feedback styles accordingly.",
    author: "Asana",
    date: "February 2026",
    url: "https://asana.com/resources/cultural-intelligence",
  },
  {
    source: "Annual Review of Organizational Psychology",
    title: "Cross-Cultural Leadership: What We Know, What We Need to Know, and Where We Need to Go",
    summary: "A rigorous academic review of what the research actually says about cross-cultural leadership. Den Hartog and De Hoogh examine how societal culture shapes leadership processes and their effects, covering implicit leadership theories, followership across cultures, and the challenges of leading multicultural teams. One of the most comprehensive surveys of the field, drawing on decades of empirical research to identify what we know with confidence and where the gaps remain.",
    author: "Deanne N. Den Hartog & Annebel H.B. De Hoogh",
    date: "January 2024",
    url: "https://www.annualreviews.org/content/journals/10.1146/annurev-orgpsych-110721-033711",
  },
];

const ART_CSS = `
.art { display: flex; flex-direction: column; gap: clamp(3rem, 7vw, 5.5rem); }
.art-top { display: grid; grid-template-columns: minmax(0, 1fr); gap: 1.5rem; }
.art-split { display: grid; grid-template-columns: minmax(0, 1fr); gap: clamp(1.5rem, 4vw, 3rem); }
.art-row { display: grid; grid-template-columns: minmax(0, 1fr); gap: 1.25rem; padding-block: clamp(1.75rem, 4vw, 2.5rem); border-bottom: 1px solid ${T.rule}; text-decoration: none; }
.art-num { display: none; }
.art-img { aspect-ratio: 3 / 2; overflow: hidden; background: ${T.band}; border-radius: 2px; }
.art-img img { width: 100%; height: 100%; object-fit: cover; display: block; transition: transform 0.4s ease; }
.art-row:hover .art-img img { transform: scale(1.03); }
.art-row:hover .art-title { color: ${T.navyMid}; }
.art-row:hover .art-cta { color: ${T.orangeDeep}; }
.art-row:focus-visible { outline: 2px solid ${T.orange}; outline-offset: 4px; }
@media (min-width: 760px) {
  .art-row { grid-template-columns: minmax(0, 4fr) minmax(0, 7fr); gap: clamp(1.5rem, 3.5vw, 2.75rem); }
}
@media (min-width: 960px) {
  .art-top { grid-template-columns: minmax(0, 7fr) minmax(0, 5fr); align-items: end; }
  .art-split { grid-template-columns: minmax(0, 5fr) minmax(0, 7fr); }
  .art-row { grid-template-columns: 2.5rem minmax(0, 4fr) minmax(0, 7fr); }
  .art-num { display: block; }
}
@media (prefers-reduced-motion: reduce) { .art-img img { transition: none; } .art-row:hover .art-img img { transform: none; } }
`;

export default function ArticlesContent() {
  return (
    <div style={{ background: T.offWhite }}>
      <div className="container-wide art" style={{ paddingBlock: "clamp(2.5rem, 6vw, 4.5rem)" }}>
        <style>{KIT_CSS + ART_CSS}</style>

        {/* ── TOP: title + intro, no hero ── */}
        <header className="art-top">
          <div style={{ display: "flex", flexDirection: "column", gap: "0.9rem" }}>
            <Eyebrow>Worth reading</Eyebrow>
            <h1 style={{ ...h2Style(), fontSize: "clamp(2.1rem, 4.4vw, 3.1rem)", lineHeight: 1.05 }}>
              Good writing on leading across cultures.
            </h1>
          </div>
          <p style={{ ...bodyStyle, maxWidth: "38ch" }}>
            Handpicked from around the web: cross-cultural leadership, faith at work, and leading people who see the world differently than you do.
          </p>
        </header>

        {/* ── ARTICLES ── */}
        <section aria-label="Articles" style={{ borderTop: `1px solid ${T.navy}` }}>
          {articles.map((a, i) => (
            <a key={a.url} href={a.url} target="_blank" rel="noopener noreferrer" className="art-row">
              <span aria-hidden="true" className="art-num" style={{ fontFamily: SERIF, fontStyle: "italic", fontSize: "1.2rem", color: T.orangeDeep, lineHeight: 1.2 }}>
                {String(i + 1).padStart(2, "0")}
              </span>

              <div className="art-img">
                {a.image ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={a.image} alt="" loading={i < 2 ? "eager" : "lazy"} />
                ) : (
                  <div aria-hidden="true" style={{ height: "100%", display: "flex", alignItems: "flex-end", padding: "1.25rem", borderTop: `2px solid ${T.orange}` }}>
                    <span style={{ fontFamily: SERIF, fontStyle: "italic", fontSize: "1.35rem", lineHeight: 1.2, color: T.navy }}>{a.source}</span>
                  </div>
                )}
              </div>

              <div style={{ display: "flex", flexDirection: "column", gap: "0.85rem", minWidth: 0 }}>
                <p style={{ margin: 0, fontFamily: SANS, fontSize: "0.66rem", fontWeight: 700, letterSpacing: "0.16em", textTransform: "uppercase", color: T.orangeDeep }}>
                  {a.source}
                </p>
                <h2 className="art-title" style={{ margin: 0, fontFamily: SERIF, fontStyle: "italic", fontWeight: 500, fontSize: "clamp(1.4rem, 2.4vw, 1.85rem)", lineHeight: 1.15, color: T.navy, textWrap: "balance", transition: "color 0.2s" }}>
                  {a.title}
                </h2>
                <p style={{ ...bodyStyle, fontSize: "0.9rem" }}>{a.summary}</p>
                <div style={{ display: "flex", flexWrap: "wrap", alignItems: "baseline", justifyContent: "space-between", gap: "0.5rem 1.5rem", marginTop: "0.25rem" }}>
                  <span style={{ fontFamily: SANS, fontSize: "0.75rem", color: T.muted }}>
                    {a.author} · {a.date}
                  </span>
                  <span className="art-cta" style={{ fontFamily: SANS, fontSize: "0.8rem", fontWeight: 700, color: T.navy, transition: "color 0.2s", whiteSpace: "nowrap" }}>
                    Read the article <span aria-hidden="true">↗</span>
                    <span style={{ position: "absolute", width: 1, height: 1, overflow: "hidden", clip: "rect(0 0 0 0)" }}> (opens in a new tab)</span>
                  </span>
                </div>
              </div>
            </a>
          ))}
        </section>

        {/* ── CURATION NOTE ── */}
        <section aria-labelledby="art-note" style={{ background: T.band, padding: "clamp(2rem, 5vw, 3.5rem) clamp(1.25rem, 4.5vw, 3.5rem)" }}>
          <div className="art-split">
            <div style={{ display: "flex", flexDirection: "column", gap: "1.1rem" }}>
              <Eyebrow>How we choose</Eyebrow>
              <h2 id="art-note" style={h2Style()}>Handpicked, never sponsored.</h2>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: "1.25rem", alignItems: "flex-start", alignSelf: "end" }}>
              <p style={bodyStyle}>
                We share what we find genuinely useful for cross-cultural leaders. Nothing here is paid for or affiliated. Read something that belongs on this list? Send it our way.
              </p>
              <TextLink href="/contact">Suggest an article</TextLink>
            </div>
          </div>
        </section>

        {/* ── NEXT STEP ── */}
        <section aria-labelledby="art-cta" className="art-split" style={{ borderTop: `2px solid ${T.orange}`, paddingTop: "clamp(2rem, 5vw, 3rem)" }}>
          <h2 id="art-cta" style={h2Style()}>Ready to go deeper than an article?</h2>
          <div style={{ display: "flex", flexDirection: "column", gap: "1.25rem", alignItems: "flex-start" }}>
            <p style={bodyStyle}>
              The Library turns these ideas into practical training modules you can work through on your own or with your team.
            </p>
            <div style={{ display: "flex", flexWrap: "wrap", alignItems: "center", gap: "1rem 1.5rem" }}>
              <PrimaryLink href="/resources">Open the Library</PrimaryLink>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}

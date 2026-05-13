"use client";

import Link from "next/link";
import { useLanguage } from "@/lib/LanguageContext";
import { InsightsNavDropdown } from "./_components/InsightsNavDropdown";
import { type Insight, formatDate } from "@/lib/insights";

export default function InsightsClient({ insights }: { insights: Insight[] }) {
  const { lang } = useLanguage();
  const isId = lang === "id";

  const latest = insights.slice(0, 3);
  const archive = insights.slice(3);

  const basePath = isId ? "/insights/id" : "/insights";

  const ui = isId
    ? {
        label: "Leadership Bytes",
        tagline: "Bacaan singkat dan praktis tentang kepemimpinan lintas budaya. Topik aktual, contoh nyata, terhubung ke sumber yang lebih dalam.",
        readMin: (n: number) => `${n} menit baca`,
        readFeatured: "Baca byte ini →",
        readSecondary: "Baca →",
        previousBytes: "Bytes sebelumnya",
        aboutLabel: "Tentang penulis",
        aboutIntro: "Chris Runhaar adalah pendiri Crispy Development, sebuah platform untuk pemimpin Kristen lintas budaya.",
        aboutBody1: "Ia telah hidup dan bekerja lintas budaya selama hampir dua dekade. Ia memimpin tim NGO dan pengembangan komunitas di Asia Tenggara dan Afrika, dan belakangan ini berfokus pada pengembangan kepemimpinan dan pelatihan untuk tim lintas budaya, pekerja lapangan, dan pemimpin ekspatriat.",
        aboutBody2: "Leadership Bytes adalah upayanya untuk menyampaikan pemikiran kepemimpinan dalam format yang mudah dipahami: cukup singkat untuk dibaca saat istirahat rapat, cukup spesifik untuk bermanfaat, dan cukup jujur untuk memulai percakapan yang sesungguhnya. Setiap byte terhubung ke sumber yang lebih dalam bagi mereka yang ingin melanjutkan.",
      }
    : {
        label: "Leadership Bytes",
        tagline: "Short, practical reads on cross-cultural leadership. Timely topics, real examples, linked to the deeper resources.",
        readMin: (n: number) => `${n} min read`,
        readFeatured: "Read this byte →",
        readSecondary: "Read →",
        previousBytes: "Previous bytes",
        aboutLabel: "About the writer",
        aboutIntro: "Chris Runhaar is the founder of Crispy Development, a platform for cross-cultural Christian leaders.",
        aboutBody1: "He has lived and worked across cultures for nearly two decades. He led NGO and community development teams across Southeast Asia and Africa, and more recently focused on leadership development and training for cross-cultural teams, field workers, and expat leaders.",
        aboutBody2: "Leadership Bytes is his attempt to put leadership thinking in a format that travels well: short enough to read in a meeting break, specific enough to be useful, and honest enough to start a real conversation. Every byte links to the deeper resources for those who want to go further.",
      };

  const articleTitle = (a: Insight) => (isId && a.id?.title) ? a.id.title : a.title;
  const articleHook = (a: Insight) => (isId && a.id?.hook) ? a.id.hook : a.hook;

  return (
    <div style={{ background: "oklch(97% 0.005 80)", minHeight: "100vh" }}>
      <style>{`
        .bytes-featured:hover .bytes-featured-title { color: oklch(48% 0.12 260); }
        .bytes-featured:hover .bytes-read-link { color: oklch(55% 0.13 45); }
        .bytes-secondary:hover .bytes-secondary-title { color: oklch(48% 0.12 260); }
        .bytes-secondary:hover .bytes-secondary-read { color: oklch(55% 0.13 45); }
      `}</style>

      {/* ── PAGE HEADER ── */}
      <section style={{ background: "oklch(30% 0.12 260)", paddingTop: "clamp(4rem, 7vw, 7rem)", paddingBottom: "clamp(4rem, 7vw, 7rem)", position: "relative", overflow: "hidden" }}>
        <div aria-hidden="true" style={{ position: "absolute", inset: 0, backgroundImage: "url('/pathway-bytes.jpg')", backgroundSize: "cover", backgroundPosition: "center 40%", opacity: 0.22, pointerEvents: "none" }} />
        <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: "3px", background: "oklch(65% 0.15 45)" }} />

        <div className="container-wide" style={{ position: "relative" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "0.625rem", marginBottom: "1rem" }}>
            <img src="/logo-icon.png" alt="" width={22} height={22} style={{ filter: "brightness(0) invert(1)", opacity: 0.75, flexShrink: 0 }} />
            <p className="t-label" style={{ color: "oklch(65% 0.15 45)", margin: 0 }}>{ui.label}</p>
          </div>

          <h1 className="t-section" style={{ marginBottom: "1rem", maxWidth: "560px", color: "oklch(97% 0.005 80)" }}>
            Leadership<br />Bytes.
          </h1>

          <p style={{ fontFamily: "var(--font-montserrat)", fontSize: "0.9375rem", color: "oklch(72% 0.04 260)", maxWidth: "52ch", lineHeight: 1.7 }}>
            {ui.tagline}
          </p>
        </div>
      </section>

      {/* ── LATEST BYTES ── */}
      <section style={{ padding: "clamp(3rem, 6vw, 5rem) 0" }}>
        <div className="container-wide">

          {/* Featured — latest article */}
          <Link
            href={`${basePath}/${latest[0].slug}`}
            className="bytes-featured"
            style={{ display: "block", textDecoration: "none", marginBottom: "3rem" }}
          >
            <div style={{ paddingBottom: "2.75rem", borderBottom: "1px solid oklch(88% 0.008 80)" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "1.25rem", marginBottom: "1.25rem" }}>
                <span style={{ fontFamily: "var(--font-montserrat)", fontWeight: 700, fontSize: "0.63rem", letterSpacing: "0.18em", textTransform: "uppercase", color: "oklch(65% 0.15 45)" }}>
                  {latest[0].tag}
                </span>
                <span style={{ fontFamily: "var(--font-montserrat)", fontSize: "0.7rem", color: "oklch(62% 0.006 260)" }}>
                  {ui.readMin(latest[0].readMinutes)}
                </span>
              </div>

              <h2 className="bytes-featured-title" style={{ fontFamily: "var(--font-cormorant)", fontWeight: 600, fontSize: "clamp(1.9rem, 4vw, 3rem)", lineHeight: 1.1, color: "oklch(22% 0.10 260)", marginBottom: "1rem", transition: "color 0.15s" }}>
                {articleTitle(latest[0])}
              </h2>

              <p style={{ fontFamily: "var(--font-montserrat)", fontSize: "1rem", lineHeight: 1.7, color: "oklch(42% 0.007 260)", maxWidth: "620px", marginBottom: "1.75rem" }}>
                {articleHook(latest[0])}
              </p>

              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                <span style={{ fontFamily: "var(--font-montserrat)", fontSize: "0.72rem", color: "oklch(58% 0.006 260)" }}>
                  {formatDate(latest[0].date)}
                </span>
                <span className="bytes-read-link" style={{ fontFamily: "var(--font-montserrat)", fontWeight: 600, fontSize: "0.78rem", letterSpacing: "0.05em", color: "oklch(65% 0.15 45)", transition: "color 0.15s" }}>
                  {ui.readFeatured}
                </span>
              </div>
            </div>
          </Link>

          {/* Secondary — next 2 articles */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(min(100%, 300px), 1fr))", gap: "2rem" }}>
            {latest.slice(1).map((article) => (
              <Link key={article.slug} href={`${basePath}/${article.slug}`} className="bytes-secondary" style={{ display: "block", textDecoration: "none" }}>
                <div style={{ paddingBottom: "1.75rem" }}>
                  <span style={{ fontFamily: "var(--font-montserrat)", fontWeight: 700, fontSize: "0.6rem", letterSpacing: "0.18em", textTransform: "uppercase", color: "oklch(65% 0.15 45)", display: "block", marginBottom: "0.75rem" }}>
                    {article.tag}
                  </span>

                  <h3 className="bytes-secondary-title" style={{ fontFamily: "var(--font-cormorant)", fontWeight: 600, fontSize: "clamp(1.3rem, 2.5vw, 1.65rem)", lineHeight: 1.15, color: "oklch(22% 0.10 260)", marginBottom: "0.875rem", transition: "color 0.15s" }}>
                    {articleTitle(article)}
                  </h3>

                  <p style={{ fontFamily: "var(--font-montserrat)", fontSize: "0.875rem", lineHeight: 1.65, color: "oklch(48% 0.007 260)", marginBottom: "1.25rem" }}>
                    {articleHook(article)}
                  </p>

                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", paddingTop: "1rem", borderTop: "1px solid oklch(90% 0.006 80)" }}>
                    <span style={{ fontFamily: "var(--font-montserrat)", fontSize: "0.7rem", color: "oklch(58% 0.006 260)" }}>
                      {formatDate(article.date)}
                    </span>
                    <span className="bytes-secondary-read" style={{ fontFamily: "var(--font-montserrat)", fontWeight: 600, fontSize: "0.72rem", color: "oklch(65% 0.15 45)", transition: "color 0.15s" }}>
                      {ui.readSecondary}
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>

          {/* Archive nav */}
          {archive.length > 0 && (
            <div style={{ marginTop: "3rem", paddingTop: "2rem", borderTop: "1px solid oklch(88% 0.008 80)", display: "flex", alignItems: "center", gap: "1.5rem", flexWrap: "wrap" }}>
              <span style={{ fontFamily: "var(--font-montserrat)", fontWeight: 700, fontSize: "0.63rem", letterSpacing: "0.16em", textTransform: "uppercase", color: "oklch(52% 0.008 260)", whiteSpace: "nowrap" }}>
                {ui.previousBytes}
              </span>
              <InsightsNavDropdown
                articles={archive.map((a) => ({ slug: a.slug, title: articleTitle(a) }))}
                basePath={basePath}
              />
            </div>
          )}

        </div>
      </section>

      {/* ── ABOUT THE WRITER ── */}
      <section style={{ background: "oklch(94% 0.006 80)", borderTop: "1px solid oklch(88% 0.008 80)", padding: "clamp(2.5rem, 5vw, 4rem) 0" }}>
        <div className="container-wide" style={{ maxWidth: "720px" }}>
          <p style={{ fontFamily: "var(--font-montserrat)", fontWeight: 700, fontSize: "0.68rem", letterSpacing: "0.18em", textTransform: "uppercase", color: "oklch(52% 0.008 260)", marginBottom: "1.25rem" }}>
            {ui.aboutLabel}
          </p>
          <p style={{ fontFamily: "var(--font-cormorant)", fontStyle: "italic", fontSize: "clamp(1.1rem, 2vw, 1.3rem)", lineHeight: 1.6, color: "oklch(30% 0.008 260)", marginBottom: "1rem" }}>
            {ui.aboutIntro}
          </p>
          <p style={{ fontFamily: "var(--font-montserrat)", fontSize: "0.9375rem", lineHeight: 1.75, color: "oklch(40% 0.007 260)", marginBottom: "0.875rem" }}>
            {ui.aboutBody1}
          </p>
          <p style={{ fontFamily: "var(--font-montserrat)", fontSize: "0.9375rem", lineHeight: 1.75, color: "oklch(40% 0.007 260)" }}>
            {ui.aboutBody2}
          </p>
        </div>
      </section>

    </div>
  );
}

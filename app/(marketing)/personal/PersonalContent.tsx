"use client";

import Link from "next/link";
import { useLanguage } from "@/lib/LanguageContext";

const personalFeatureKeys = [
  "Curated Leadership Content",
  "Reflection Tools",
  "Progress Tracking",
  "Community Access",
  "8 PDF Resources",
] as const;

const personalFeatureDescriptions: Record<string, Record<string, string>> = {
  en: {
    "Curated Leadership Content": "Resources selected specifically for cross-cultural contexts — not generic leadership advice repurposed.",
    "Reflection Tools": "Structured prompts and frameworks for processing the unique pressures of leading across cultures.",
    "Progress Tracking": "See what you've completed, what's next, and how far you've come in your pathway.",
    "Community Access": "Connect with other cross-cultural leaders who understand your context.",
    "8 PDF Resources": "A foundational library covering culture, leadership, identity, and faith — yours to keep.",
  },
  id: {
    "Curated Leadership Content": "Sumber daya yang dipilih khusus untuk konteks lintas budaya — bukan saran kepemimpinan generik.",
    "Reflection Tools": "Prompt dan kerangka terstruktur untuk memproses tekanan unik memimpin lintas budaya.",
    "Progress Tracking": "Lihat apa yang sudah diselesaikan, apa yang berikutnya, dan seberapa jauh perjalananmu.",
    "Community Access": "Terhubung dengan pemimpin lintas budaya lain yang memahami konteksmu.",
    "8 PDF Resources": "Perpustakaan dasar yang mencakup budaya, kepemimpinan, identitas, dan iman — milikmu.",
  },
  nl: {
    "Curated Leadership Content": "Materialen specifiek geselecteerd voor cross-culturele contexten — geen generiek hergebruikt advies.",
    "Reflection Tools": "Gestructureerde prompts en kaders voor het verwerken van de unieke druk van leidinggeven over culturen heen.",
    "Progress Tracking": "Zie wat je hebt afgerond, wat er nog komt en hoe ver je bent op je traject.",
    "Community Access": "Maak contact met andere cross-culturele leiders die jouw context begrijpen.",
    "8 PDF Resources": "Een basisbibliotheek over cultuur, leiderschap, identiteit en geloof — voor jou te bewaren.",
  },
};

const featureTitles: Record<string, Record<string, string>> = {
  en: {
    "Curated Leadership Content": "Curated Leadership Content",
    "Reflection Tools": "Reflection Tools",
    "Progress Tracking": "Progress Tracking",
    "Community Access": "Community Access",
    "8 PDF Resources": "8 PDF Resources",
  },
  id: {
    "Curated Leadership Content": "Konten Kepemimpinan Terkurasi",
    "Reflection Tools": "Alat Refleksi",
    "Progress Tracking": "Pelacakan Kemajuan",
    "Community Access": "Akses Komunitas",
    "8 PDF Resources": "8 Sumber Daya PDF",
  },
  nl: {
    "Curated Leadership Content": "Gecureerde Leiderschapscontent",
    "Reflection Tools": "Reflectietools",
    "Progress Tracking": "Voortgangsbewaking",
    "Community Access": "Gemeenschapstoegang",
    "8 PDF Resources": "8 PDF-materialen",
  },
};

export default function PersonalContent({ ctaHref = "/signup?pathway=personal" }: { ctaHref?: string }) {
  const { t, lang } = useLanguage();
  const p = t.personal;
  const langKey = lang in personalFeatureDescriptions ? lang : "en";

  return (
    <>
      {/* ── HERO ── */}
      <section style={{ background: "oklch(30% 0.12 260)", paddingTop: "clamp(4rem, 7vw, 7rem)", paddingBottom: "clamp(4rem, 7vw, 7rem)", position: "relative", overflow: "hidden" }}>
        {/* Photo background */}
        <div aria-hidden="true" style={{ position: "absolute", inset: 0, backgroundImage: "url('/pathway-team.jpg')", backgroundSize: "cover", backgroundPosition: "center 30%", opacity: 0.22, pointerEvents: "none" }} />
        <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: "3px", background: "oklch(65% 0.15 45)" }} />
        <div className="container-wide" style={{ position: "relative" }}>
          <span className="pathway-badge" style={{ background: "oklch(97% 0.005 80 / 0.12)", color: "oklch(88% 0.008 80)", marginBottom: "1.5rem", display: "inline-flex" }}>{p.label}</span>
          <h1 className="t-hero" style={{ color: "oklch(97% 0.005 80)", marginBottom: "1.25rem", maxWidth: "14ch" }}>
            {p.h1}
          </h1>
          <p className="t-tagline" style={{ color: "oklch(78% 0.04 260)", maxWidth: "52ch", marginBottom: "2.5rem" }}>
            {p.tagline}
          </p>
          <Link href={ctaHref} className="btn-primary">
            {p.ctaPrimary2} →
          </Link>
        </div>
      </section>

      {/* ── WHAT IS IT ── */}
      <section style={{ paddingBlock: "clamp(4rem, 7vw, 7rem)", background: "oklch(97% 0.005 80)" }}>
        <div className="container-wide">
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: "clamp(3rem, 6vw, 6rem)", alignItems: "start" }}>
            <div>
              <p className="t-label" style={{ color: "oklch(65% 0.15 45)", marginBottom: "1rem" }}>{p.whatLabel}</p>
              <h2 className="t-section" style={{ marginBottom: "1.5rem" }}>
                {p.whatHeading.split("\n").map((line, i) => <span key={i}>{line}{i === 0 && <br />}</span>)}
              </h2>
              <p style={{ fontFamily: "var(--font-montserrat)", fontSize: "0.9375rem", lineHeight: 1.75, color: "oklch(42% 0.008 260)", maxWidth: "52ch" }}>
                {p.memberDesc}
              </p>
              <p className="t-tagline" style={{ color: "oklch(52% 0.008 260)", marginTop: "1.5rem", fontStyle: "italic" }}>
                {p.ctaQuote}
              </p>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: "0" }}>
              {personalFeatureKeys.map((key, i) => (
                <div key={key} style={{ paddingBlock: "1.5rem", borderTop: i === 0 ? "none" : "1px solid oklch(88% 0.008 80)", display: "flex", gap: "1.5rem", alignItems: "flex-start" }}>
                  <span style={{ fontFamily: "var(--font-montserrat)", fontWeight: 800, fontSize: "1.5rem", color: "oklch(88% 0.008 80)", lineHeight: 1, flexShrink: 0, minWidth: "2.5rem" }}>
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <div>
                    <h3 style={{ fontFamily: "var(--font-montserrat)", fontWeight: 700, fontSize: "0.9375rem", color: "oklch(22% 0.005 260)", marginBottom: "0.375rem" }}>
                      {featureTitles[langKey]?.[key] ?? featureTitles.en[key]}
                    </h3>
                    <p style={{ fontFamily: "var(--font-montserrat)", fontSize: "0.875rem", lineHeight: 1.6, color: "oklch(52% 0.008 260)" }}>
                      {personalFeatureDescriptions[langKey]?.[key] ?? personalFeatureDescriptions.en[key]}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <div className="divider" />

      {/* ── ACCESS TIERS ── */}
      <section style={{ paddingBlock: "clamp(4rem, 7vw, 7rem)", background: "oklch(97% 0.005 80)" }}>
        <div className="container-wide">
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "1px", background: "oklch(88% 0.008 80)", maxWidth: "760px" }}>
            {/* Free tier */}
            <div style={{ background: "oklch(97% 0.005 80)", padding: "2rem" }}>
              <p className="t-label" style={{ color: "oklch(65% 0.15 45)", marginBottom: "0.75rem", fontSize: "0.62rem" }}>{p.freeTitle}</p>
              <h3 style={{ fontFamily: "var(--font-montserrat)", fontWeight: 800, fontSize: "1.375rem", color: "oklch(22% 0.005 260)", lineHeight: 1.2, marginBottom: "0.5rem" }}>
                {p.freePrice}<br />{p.freePeriod}
              </h3>
              <p style={{ fontFamily: "var(--font-montserrat)", fontSize: "0.875rem", color: "oklch(52% 0.008 260)", marginBottom: "1.75rem" }}>{p.freeDesc}</p>
              <ul style={{ listStyle: "none", padding: 0, margin: "0 0 2rem", display: "flex", flexDirection: "column", gap: "0.625rem" }}>
                {p.freeFeatures.map((item: string) => (
                  <li key={item} style={{ display: "flex", gap: "0.625rem", fontSize: "0.875rem", color: "oklch(38% 0.008 260)" }}>
                    <span style={{ color: "oklch(65% 0.15 45)", fontWeight: 700, flexShrink: 0 }}>✓</span>
                    {item}
                  </li>
                ))}
              </ul>
              <Link href={ctaHref} className="btn-outline-navy" style={{ width: "100%", justifyContent: "center" }}>
                {p.freeCta}
              </Link>
            </div>

            {/* Member tier */}
            <div style={{ background: "oklch(30% 0.12 260)", padding: "2rem" }}>
              <p className="t-label" style={{ color: "oklch(65% 0.15 45)", marginBottom: "0.75rem", fontSize: "0.62rem" }}>{p.memberTitle}</p>
              <h3 style={{ fontFamily: "var(--font-montserrat)", fontWeight: 800, fontSize: "1.375rem", color: "oklch(97% 0.005 80)", lineHeight: 1.2, marginBottom: "0.5rem" }}>
                {p.memberPrice}<br />{p.memberPeriod}
              </h3>
              <p style={{ fontFamily: "var(--font-montserrat)", fontSize: "0.875rem", color: "oklch(72% 0.04 260)", marginBottom: "1.75rem" }}>{p.memberDesc}</p>
              <ul style={{ listStyle: "none", padding: 0, margin: "0 0 2rem", display: "flex", flexDirection: "column", gap: "0.625rem" }}>
                {p.memberFeatures.map((item: string) => (
                  <li key={item} style={{ display: "flex", gap: "0.625rem", fontSize: "0.875rem", color: "oklch(78% 0.04 260)" }}>
                    <span style={{ color: "oklch(65% 0.15 45)", fontWeight: 700, flexShrink: 0 }}>✓</span>
                    {item}
                  </li>
                ))}
              </ul>
              <p style={{ fontFamily: "var(--font-montserrat)", fontSize: "0.75rem", color: "oklch(65% 0.04 260)", marginBottom: "1.25rem" }}>{p.memberNote}</p>
              <Link href={ctaHref} className="btn-primary" style={{ width: "100%", justifyContent: "center" }}>
                {p.waitlistCta} →
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section style={{ paddingBlock: "clamp(4rem, 7vw, 7rem)", background: "oklch(30% 0.12 260)", position: "relative" }}>
        <div style={{ position: "absolute", left: "clamp(1.5rem, 5vw, 4rem)", top: "clamp(4rem, 7vw, 7rem)", bottom: "clamp(4rem, 7vw, 7rem)", width: "3px", background: "oklch(65% 0.15 45)" }} />
        <div className="container-wide" style={{ paddingLeft: "2.5rem" }}>
          <p className="t-tagline" style={{ color: "oklch(65% 0.15 45)", marginBottom: "1.25rem", fontStyle: "italic" }}>
            {p.ctaQuote}
          </p>
          <h2 className="t-section" style={{ color: "oklch(97% 0.005 80)", marginBottom: "1.25rem" }}>
            {p.ctaHeading.split("\n").map((line, i) => <span key={i}>{line}{i === 0 && <br />}</span>)}
          </h2>
          <p style={{ fontFamily: "var(--font-montserrat)", fontSize: "0.9375rem", lineHeight: 1.7, color: "oklch(72% 0.04 260)", marginBottom: "3rem", maxWidth: "48ch" }}>
            {p.tagline}
          </p>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: "1px", background: "oklch(22% 0.10 260 / 0.5)", maxWidth: "760px" }}>
            <div style={{ background: "oklch(26% 0.11 260)", padding: "2rem" }}>
              <span className="pathway-badge" style={{ background: "oklch(97% 0.005 80 / 0.1)", color: "oklch(82% 0.06 260)", marginBottom: "1rem", display: "inline-flex", fontSize: "0.58rem" }}>{t.home.personalBadge}</span>
              <h3 style={{ fontFamily: "var(--font-montserrat)", fontWeight: 700, fontSize: "1rem", color: "oklch(97% 0.005 80)", marginBottom: "0.5rem", lineHeight: 1.3 }}>{t.home.personalHeading}</h3>
              <p style={{ fontFamily: "var(--font-montserrat)", fontSize: "0.8125rem", lineHeight: 1.6, color: "oklch(65% 0.04 260)", marginBottom: "1.5rem" }}>{t.home.personalBody}</p>
              <Link href={ctaHref} className="btn-primary" style={{ fontSize: "0.75rem", padding: "0.6rem 1.25rem" }}>{p.ctaPrimary} →</Link>
            </div>
            <div style={{ background: "oklch(24% 0.10 260)", padding: "2rem" }}>
              <span className="pathway-badge team" style={{ background: "oklch(97% 0.005 80 / 0.1)", color: "oklch(82% 0.06 260)", marginBottom: "1rem", display: "inline-flex", fontSize: "0.58rem" }}>{t.home.teamBadge}</span>
              <h3 style={{ fontFamily: "var(--font-montserrat)", fontWeight: 700, fontSize: "1rem", color: "oklch(97% 0.005 80)", marginBottom: "0.5rem", lineHeight: 1.3 }}>{t.home.teamHeading}</h3>
              <p style={{ fontFamily: "var(--font-montserrat)", fontSize: "0.8125rem", lineHeight: 1.6, color: "oklch(65% 0.04 260)", marginBottom: "1.5rem" }}>{t.home.teamBody}</p>
              <Link href="/team" className="btn-outline-navy" style={{ fontSize: "0.75rem", padding: "0.6rem 1.25rem", color: "oklch(78% 0.04 260)", borderColor: "oklch(42% 0.008 260)" }}>{t.nav.teamFull} →</Link>
            </div>
            <div style={{ background: "oklch(22% 0.10 260)", padding: "2rem" }}>
              <span className="pathway-badge" style={{ background: "oklch(97% 0.005 80 / 0.1)", color: "oklch(82% 0.06 260)", marginBottom: "1rem", display: "inline-flex", fontSize: "0.58rem" }}>{t.home.peerBadge}</span>
              <h3 style={{ fontFamily: "var(--font-montserrat)", fontWeight: 700, fontSize: "1rem", color: "oklch(97% 0.005 80)", marginBottom: "0.5rem", lineHeight: 1.3 }}>{t.home.peerHeading}</h3>
              <p style={{ fontFamily: "var(--font-montserrat)", fontSize: "0.8125rem", lineHeight: 1.6, color: "oklch(65% 0.04 260)", marginBottom: "1.5rem" }}>{t.home.peerBody}</p>
              <Link href="/peer-groups" className="btn-outline-navy" style={{ fontSize: "0.75rem", padding: "0.6rem 1.25rem", color: "oklch(78% 0.04 260)", borderColor: "oklch(42% 0.008 260)" }}>{t.home.peerCta} →</Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

"use client";

import Link from "next/link";
import { useLanguage } from "@/lib/LanguageContext";
import type { GeoInfo } from "@/lib/geo";

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

export default function PersonalContent({ ctaHref = "/signup?pathway=personal", geo }: { ctaHref?: string; geo?: GeoInfo }) {
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

      {/* ── PRICING COMING SOON ── */}
      <section style={{ paddingBlock: "clamp(4rem, 7vw, 7rem)", background: "oklch(22% 0.10 260)" }}>
        <div className="container-wide">
          <div style={{ marginBottom: "3rem" }}>
            <div style={{ display: "inline-flex", alignItems: "center", gap: "0.5rem", background: "oklch(65% 0.15 45 / 0.15)", border: "1px solid oklch(65% 0.15 45 / 0.35)", padding: "0.375rem 0.875rem", marginBottom: "1.25rem" }}>
              <span style={{ fontFamily: "var(--font-montserrat)", fontSize: "0.62rem", fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", color: "oklch(65% 0.15 45)" }}>Membership Pricing</span>
            </div>
            <h2 className="t-section" style={{ color: "oklch(97% 0.005 80)", marginBottom: "0.75rem" }}>Launching soon</h2>
            <p style={{ fontFamily: "var(--font-montserrat)", fontSize: "0.9rem", color: "oklch(72% 0.04 260)", maxWidth: "48ch" }}>
              12 months of unlimited access — resources, assessments, and peer groups in one plan.
            </p>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: "1px", background: "oklch(38% 0.06 260)", maxWidth: "680px" }}>
            {/* FREE */}
            <div style={{ background: "oklch(28% 0.11 260)", padding: "2rem", display: "flex", flexDirection: "column", gap: "1rem" }}>
              <div>
                <p style={{ fontFamily: "var(--font-montserrat)", fontSize: "0.62rem", fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", color: "oklch(55% 0.008 260)", marginBottom: "0.5rem" }}>Free</p>
                <div style={{ display: "flex", alignItems: "baseline", gap: "0.25rem", marginBottom: "0.25rem" }}>
                  <span style={{ fontFamily: "var(--font-montserrat)", fontWeight: 800, fontSize: "2rem", color: "oklch(97% 0.005 80)" }}>$0</span>
                </div>
                <p style={{ fontFamily: "var(--font-montserrat)", fontSize: "0.8rem", color: "oklch(62% 0.006 260)" }}>Always free · no account needed</p>
              </div>
              <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: "0.5rem", flex: 1 }}>
                {["4 core leadership modules", "Three Thinking Styles", "Leadership Altitudes", "Comfort Zone + Six Thinking Hats", "1 free assessment — Spiritual Giftings"].map(f => (
                  <li key={f} style={{ display: "flex", gap: "0.625rem", fontFamily: "var(--font-montserrat)", fontSize: "0.8rem", color: "oklch(72% 0.04 260)", alignItems: "flex-start" }}>
                    <span style={{ color: "oklch(65% 0.15 45)", fontWeight: 700, flexShrink: 0 }}>✓</span>{f}
                  </li>
                ))}
              </ul>
              <Link href="/resources" style={{ fontFamily: "var(--font-montserrat)", fontSize: "0.75rem", fontWeight: 700, letterSpacing: "0.06em", color: "oklch(97% 0.005 80)", textDecoration: "none", border: "1px solid oklch(55% 0.008 260)", padding: "0.5rem 1rem", textAlign: "center" }}>
                Start free →
              </Link>
            </div>

            {/* PERSONAL */}
            <div style={{ background: "oklch(28% 0.11 260)", padding: "2rem", display: "flex", flexDirection: "column", gap: "1rem", position: "relative" }}>
              <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: "3px", background: "oklch(65% 0.15 45)" }} />
              <div>
                <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "0.5rem", flexWrap: "wrap" }}>
                  <p style={{ fontFamily: "var(--font-montserrat)", fontSize: "0.62rem", fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", color: "oklch(65% 0.15 45)", margin: 0 }}>Personal</p>
                  <span style={{ fontFamily: "var(--font-montserrat)", fontSize: "0.55rem", fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", color: "oklch(65% 0.15 45)", background: "oklch(65% 0.15 45 / 0.15)", border: "1px solid oklch(65% 0.15 45 / 0.4)", padding: "0.1rem 0.4rem" }}>+ Peer Groups FREE</span>
                </div>
                <div style={{ display: "flex", alignItems: "baseline", gap: "0.25rem", marginBottom: "0.25rem" }}>
                  <span style={{ fontFamily: "var(--font-montserrat)", fontWeight: 800, fontSize: "2rem", color: "oklch(97% 0.005 80)" }}>$149</span>
                  <span style={{ fontFamily: "var(--font-montserrat)", fontSize: "0.8rem", color: "oklch(62% 0.006 260)" }}>/yr</span>
                </div>
                <p style={{ fontFamily: "var(--font-montserrat)", fontSize: "0.8rem", color: "oklch(62% 0.006 260)" }}>12 months unlimited access to:</p>
              </div>
              <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: "0.5rem", flex: 1 }}>
                <li style={{ display: "flex", gap: "0.625rem", fontFamily: "var(--font-montserrat)", fontSize: "0.8rem", color: "oklch(72% 0.04 260)", alignItems: "flex-start" }}>
                  <span style={{ color: "oklch(65% 0.15 45)", fontWeight: 700, flexShrink: 0 }}>✓</span>
                  30+ leadership resources — <Link href="/resources" style={{ color: "oklch(65% 0.15 45)", textDecoration: "none", fontWeight: 700 }}>browse all →</Link>
                </li>
                <li style={{ display: "flex", gap: "0.625rem", fontFamily: "var(--font-montserrat)", fontSize: "0.8rem", color: "oklch(72% 0.04 260)", alignItems: "flex-start" }}>
                  <span style={{ color: "oklch(65% 0.15 45)", fontWeight: 700, flexShrink: 0 }}>✓</span>
                  8 assessments — <Link href="/resources" style={{ color: "oklch(65% 0.15 45)", textDecoration: "none", fontWeight: 700 }}>see all →</Link>
                </li>
                {["Personal leadership journey", "Progress tracking", "New content added monthly", "🎁 Peer Groups — free gift"].map(f => (
                  <li key={f} style={{ display: "flex", gap: "0.625rem", fontFamily: "var(--font-montserrat)", fontSize: "0.8rem", color: "oklch(72% 0.04 260)", alignItems: "flex-start" }}>
                    <span style={{ color: "oklch(65% 0.15 45)", fontWeight: 700, flexShrink: 0 }}>✓</span>{f}
                  </li>
                ))}
              </ul>
              <div style={{ fontFamily: "var(--font-montserrat)", fontSize: "0.75rem", fontWeight: 700, letterSpacing: "0.06em", textTransform: "uppercase", color: "oklch(65% 0.15 45)", padding: "0.5rem 1rem", border: "1px solid oklch(65% 0.15 45 / 0.4)", textAlign: "center" }}>
                Coming Soon
              </div>
            </div>
          </div>

          {geo?.hasRegionalPricing && (
            <div style={{ display: "flex", alignItems: "center", gap: "0.625rem", marginTop: "1.5rem", background: "oklch(65% 0.15 45 / 0.12)", border: "1px solid oklch(65% 0.15 45 / 0.3)", padding: "0.625rem 1rem" }}>
              <span style={{ fontSize: "0.85rem" }}>📍</span>
              <p style={{ fontFamily: "var(--font-montserrat)", fontSize: "0.775rem", color: "oklch(82% 0.04 45)", lineHeight: 1.5, margin: 0 }}>
                <strong>You&apos;re browsing from {geo.regionLabel}</strong> — regional pricing will apply when plans launch. Prices will be lower than the USD rates shown.
              </p>
            </div>
          )}
          <p style={{ fontFamily: "var(--font-montserrat)", fontSize: "0.75rem", color: "oklch(48% 0.008 260)", marginTop: "0.875rem" }}>
            USD pricing shown · Regional rates for SE Asia, South Asia &amp; Africa · <Link href="/team" style={{ color: "oklch(65% 0.15 45)", textDecoration: "none" }}>See Team plan →</Link>
          </p>
        </div>
      </section>
    </>
  );
}

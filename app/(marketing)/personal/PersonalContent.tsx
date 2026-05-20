"use client";

import Link from "next/link";
import { useLanguage } from "@/lib/LanguageContext";

const personalFeatureKeys = [
  "Curated Leadership Content",
  "Reflection Tools",
  "Progress Tracking",
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

export default function PersonalContent({ ctaHref = "/membership" }: { ctaHref?: string }) {
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
          <div style={{ display: "flex", alignItems: "center", gap: "0.625rem", marginBottom: "1rem" }}>
            <img src="/logo-icon.png" alt="" width={22} height={22} style={{ filter: "brightness(0) invert(1)", opacity: 0.75, flexShrink: 0 }} />
            <p className="t-label" style={{ color: "oklch(65% 0.15 45)", margin: 0 }}>{p.label}</p>
          </div>
          <h1 style={{ fontFamily: "var(--font-cormorant)", fontStyle: "italic", fontWeight: 600, fontSize: "clamp(3rem, 6vw, 5.5rem)", lineHeight: 1.08, color: "oklch(97% 0.005 80)", marginBottom: "1rem", maxWidth: "560px" }}>
            {p.h1}
          </h1>
          <p style={{ fontFamily: "var(--font-montserrat)", fontSize: "0.9375rem", color: "oklch(72% 0.04 260)", maxWidth: "52ch", lineHeight: 1.7, marginBottom: "2.5rem" }}>
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
              <p className="t-tagline" style={{ color: "oklch(52% 0.008 260)", marginTop: "1.5rem" }}>
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

      {/* ── DASHBOARD PREVIEW ── */}
<section style={{ paddingBlock: "clamp(3rem, 6vw, 6rem)", background: "oklch(97% 0.005 80)" }}>
  <div className="container-wide">
    <p className="t-label" style={{ color: "oklch(65% 0.15 45)", marginBottom: "0.75rem", textAlign: "center" }}>
      {lang === "id" ? "Dasbor Anggota" : "Member Dashboard"}
    </p>
    <h2 className="t-section" style={{ textAlign: "center", marginBottom: "2.5rem" }}>
      {lang === "id" ? "Perjalananmu, dalam satu tampilan." : "Your pathway, in one view."}
    </h2>
    <div style={{ maxWidth: "860px", margin: "0 auto", borderRadius: "6px", overflow: "hidden", boxShadow: "0 8px 40px oklch(22% 0.05 260 / 0.18)" }}>
      <img
        src={lang === "id" ? "/dashboard-id.png" : "/dashboard-en.png"}
        alt={lang === "id" ? "Contoh dasbor pribadi" : "Personal dashboard preview"}
        style={{ width: "100%", display: "block" }}
      />
    </div>
  </div>
</section>

      <div className="divider" />

      {/* ── APPLY CTA ── */}
      <section style={{ paddingBlock: "clamp(4rem, 7vw, 7rem)", background: "oklch(22% 0.10 260)" }}>
        <div className="container-wide">
          <div style={{ width: "3px", height: "40px", background: "oklch(65% 0.15 45)", marginBottom: "2rem" }} />
          <h2 className="t-section" style={{ color: "oklch(97% 0.005 80)", marginBottom: "1rem", maxWidth: "480px" }}>
            {lang === "id" ? "Bergabunglah dengan komunitas." : lang === "nl" ? "Word lid van de gemeenschap." : "Join the community."}
          </h2>
          <p style={{ fontFamily: "var(--font-montserrat)", fontSize: "0.9375rem", lineHeight: 1.75, color: "oklch(72% 0.04 260)", maxWidth: "48ch", marginBottom: "2.5rem" }}>
            {lang === "id"
              ? "Kami meninjau setiap lamaran secara pribadi. Tidak semua orang akan diterima."
              : "We review every application personally. Not everyone will be accepted."}
          </p>
          <Link href={ctaHref} className="btn-primary" style={{ display: "inline-flex" }}>
            {p.ctaPrimary2} →
          </Link>
        </div>
      </section>
    </>
  );
}

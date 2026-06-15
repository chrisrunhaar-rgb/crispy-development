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
};

export default function PersonalContent({ ctaHref = "/pricing" }: { ctaHref?: string }) {
  const { t, lang } = useLanguage();
  const p = t.personal;
  const langKey = lang in personalFeatureDescriptions ? lang : "en";

  return (
    <>
      {/* ── HERO ── */}
      <section style={{ background: "oklch(22% 0.10 260)", paddingTop: "clamp(4rem, 7vw, 7rem)", paddingBottom: "clamp(4rem, 7vw, 7rem)", position: "relative", overflow: "hidden" }}>
        {/* Photo background */}
        <div aria-hidden="true" style={{ position: "absolute", inset: 0, backgroundImage: "url('/pathway-team.jpg')", backgroundSize: "cover", backgroundPosition: "center 30%", opacity: 0.15, pointerEvents: "none" }} />
        <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: "3px", background: "oklch(65% 0.15 45)" }} />
        <div aria-hidden="true" style={{ position: "absolute", inset: 0, backgroundImage: "radial-gradient(circle, oklch(97% 0.005 80 / 0.06) 1px, transparent 1px)", backgroundSize: "28px 28px", pointerEvents: "none" }} />
        <div className="container-wide" style={{ position: "relative" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "0.875rem", marginBottom: "1.5rem" }}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/logo-icon-dark-badge.png" alt="Crispy Development" width={28} height={28} style={{ flexShrink: 0, display: "block" }} />
            <p style={{ fontFamily: "var(--font-montserrat)", fontSize: "0.7rem", fontWeight: 700, letterSpacing: "0.2em", textTransform: "uppercase", color: "oklch(65% 0.15 45)", margin: 0 }}>{p.label}</p>
          </div>
          <div style={{ width: "48px", height: "2px", background: "oklch(65% 0.15 45)", marginBottom: "1.75rem" }} />
          <h1 style={{ fontFamily: "var(--font-cormorant)", fontStyle: "italic", fontWeight: 600, fontSize: "clamp(2.8rem, 5.5vw, 5.5rem)", lineHeight: 1.0, color: "oklch(97% 0.005 80)", margin: "0 0 1.5rem", maxWidth: "560px" }}>
            {p.h1}
          </h1>
          <p style={{ fontFamily: "var(--font-montserrat)", fontSize: "0.9375rem", color: "oklch(80% 0.025 260)", maxWidth: "52ch", lineHeight: 1.75, marginBottom: "2.5rem" }}>
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
    <div style={{ maxWidth: "960px", margin: "0 auto", position: "relative", display: "flex", alignItems: "flex-end" }}>

      {/* Laptop dashboard */}
      <div style={{ flex: "1 1 0", borderRadius: "10px", overflow: "hidden", boxShadow: "0 12px 48px oklch(22% 0.10 260 / 0.2)" }}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/dashboard-personal.jpg"
          alt={lang === "id" ? "Contoh dasbor pribadi" : "Personal dashboard preview"}
          style={{ width: "100%", display: "block" }}
        />
      </div>

      {/* Phone — overlaps laptop by pulling left */}
      <div style={{
        flexShrink: 0,
        width: "clamp(110px, 16vw, 185px)",
        background: "oklch(12% 0.06 260)",
        borderRadius: "clamp(20px, 3.2vw, 34px)",
        padding: "clamp(5px, 0.7vw, 8px)",
        boxShadow: "0 24px 64px oklch(8% 0.10 260 / 0.55), inset 0 0 0 1px oklch(97% 0.005 80 / 0.12)",
        position: "relative",
        marginLeft: "clamp(-40px, -6vw, -60px)",
        marginBottom: "clamp(12px, 2.5vw, 28px)",
        zIndex: 2,
      }}>
        {/* Side button */}
        <div style={{ position: "absolute", right: "-3px", top: "24%", width: "3px", height: "12%", background: "oklch(22% 0.06 260)", borderRadius: "0 2px 2px 0" }} />
        {/* Volume buttons */}
        <div style={{ position: "absolute", left: "-3px", top: "19%", width: "3px", height: "7%", background: "oklch(22% 0.06 260)", borderRadius: "2px 0 0 2px" }} />
        <div style={{ position: "absolute", left: "-3px", top: "28%", width: "3px", height: "7%", background: "oklch(22% 0.06 260)", borderRadius: "2px 0 0 2px" }} />
        {/* Dynamic island */}
        <div style={{ width: "28%", height: "clamp(5px, 0.9vw, 9px)", background: "oklch(8% 0.04 260)", borderRadius: "999px", margin: "0 auto clamp(4px, 0.6vw, 6px)" }} />
        {/* Screen */}
        <div style={{ borderRadius: "clamp(14px, 2.4vw, 26px)", overflow: "hidden" }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/dashboard-mobile.jpg"
            alt={lang === "id" ? "Tampilan mobile dasbor" : "Dashboard mobile view"}
            style={{ width: "100%", display: "block" }}
          />
        </div>
        {/* Home indicator */}
        <div style={{ width: "28%", height: "3px", background: "oklch(45% 0.008 260)", borderRadius: "2px", margin: "clamp(4px, 0.6vw, 6px) auto 0" }} />
      </div>

    </div>
  </div>
</section>

      <div className="divider" />

      {/* ── APPLY CTA ── */}
      <section style={{ paddingBlock: "clamp(4rem, 7vw, 7rem)", background: "oklch(22% 0.10 260)" }}>
        <div className="container-wide">
          <div style={{ width: "3px", height: "40px", background: "oklch(65% 0.15 45)", marginBottom: "2rem" }} />
          <h2 className="t-section" style={{ color: "oklch(97% 0.005 80)", marginBottom: "1rem", maxWidth: "480px" }}>
            {lang === "id" ? "Mulai perjalananmu." : "Start your journey."}
          </h2>
          <p style={{ fontFamily: "var(--font-montserrat)", fontSize: "0.9375rem", lineHeight: 1.75, color: "oklch(72% 0.04 260)", maxWidth: "48ch", marginBottom: "2.5rem" }}>
            {lang === "id"
              ? "Akses penuh ke seluruh perpustakaan, dasbor pribadi, dan 60 menit WayPoint AI Coaching. Langganan bulanan atau tahunan — batalkan kapan saja."
              : "Full library access, personal dashboard, and 60 min WayPoint AI Coaching. Monthly or annual subscription — cancel any time."}
          </p>
          <Link href={ctaHref} className="btn-primary" style={{ display: "inline-flex" }}>
            {p.ctaPrimary2} →
          </Link>
        </div>
      </section>
    </>
  );
}

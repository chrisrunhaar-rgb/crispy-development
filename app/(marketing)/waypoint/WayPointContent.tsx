"use client";

import Link from "next/link";
import { useLanguage } from "@/lib/LanguageContext";

const translations = {
  en: {
    heroLabel: "WayPoint Coach",
    heroBadge: "Beta",
    heroH1Line1: "A private space",
    heroH1Line2: "to think out loud.",
    heroTagline: "An AI voice coaching conversation whenever you need one. It doesn’t give advice. It asks the right questions — and helps you find your own clarity.",
    heroCtaNonUser: "Available to Crispy Leaders members",
    heroCtaUser: "Available in your dashboard",
    heroCtaButton: "Apply for membership →",
    heroCtaButtonUser: "Open WayPoint →",
    sectionH2: "You already have the answers.",
    sectionSubtitle: "WayPoint doesn’t coach you by telling you what to do. It creates space for you to hear what you already know.",
    tile1Label: "Not advice",
    tile1H3: "The right questions, not the right answers",
    tile1Body: "WayPoint listens and asks. You think and discover. We believe leaders already carry the wisdom they need — the work is finding it.",
    tile2Label: "Completely confidential",
    tile2H3: "What you say stays with you",
    tile2Body: "Your session is private. No one at Crispy Development reads your conversation. AI coaching only works when the space is safe — so we built it that way from the start.",
    tile3Label: "Faith-rooted",
    tile3H3: "Bring your whole self",
    tile3Body: "Faith is welcome here — not prescribed, just present. WayPoint holds space for the spiritual dimension of cross-cultural leadership without pushing an agenda.",
    tile4Label: "Always available",
    tile4H3: "When you need it, it’s there",
    tile4Body: "No scheduling. No waiting list. Whether you’re in a moment of transition, carrying tension from the week, or just need space to think — open a session.",
    replacementNote: "WayPoint is not a replacement for pastoral care, human community, or professional support. It’s a thinking tool — and that’s what makes it valuable.",
    ctaLabel: "Membership",
    ctaH2NonUser: "Access WayPoint\nthrough membership.",
    ctaH2User: "Ready to think out loud?",
    ctaBodyNonUser: "WayPoint is part of the Crispy Leaders platform. Apply for membership — every application is reviewed personally.",
    ctaBodyUser: "WayPoint is available in your dashboard.",
    ctaExploreButton: "Explore for free",
  },
  id: {
    heroLabel: "WayPoint Coach",
    heroBadge: "Beta",
    heroH1Line1: "Ruang yang hanya milikmu",
    heroH1Line2: "untuk berpikir keras.",
    heroTagline: "Percakapan coaching suara AI — kapan pun kamu butuhkan. Bukan untuk memberi saran. Tapi untuk mengajukan pertanyaan yang tepat — dan membantu kamu menemukan kejernihan sendiri.",
    heroCtaNonUser: "Tersedia untuk anggota Crispy Leaders",
    heroCtaUser: "Tersedia di dashboard kamu",
    heroCtaButton: "Daftar keanggotaan →",
    heroCtaButtonUser: "Buka WayPoint →",
    sectionH2: "Kamu sudah punya jawabannya.",
    sectionSubtitle: "WayPoint tidak melatih kamu dengan memberi tahu apa yang harus dilakukan. WayPoint menciptakan ruang agar kamu bisa mendengar apa yang sudah kamu ketahui.",
    tile1Label: "Bukan saran",
    tile1H3: "Pertanyaan yang tepat, bukan jawaban yang tepat",
    tile1Body: "WayPoint mendengarkan dan bertanya. Kamu berpikir dan menemukan. Kami percaya para pemimpin sudah membawa hikmat yang mereka butuhkan — tugasnya adalah menemukannya.",
    tile2Label: "Sepenuhnya rahasia",
    tile2H3: "Apa yang kamu katakan, tetap bersamamu",
    tile2Body: "Sesimu bersifat pribadi. Tidak ada seorang pun di Crispy Development yang membaca percakapanmu. Coaching AI hanya bisa bekerja jika ruangnya aman — dan itulah yang kami bangun sejak awal.",
    tile3Label: "Berakar pada iman",
    tile3H3: "Bawa dirimu sepenuhnya",
    tile3Body: "Iman selamat datang di sini — bukan diwajibkan, hanya hadir. WayPoint memberi ruang bagi dimensi spiritual dalam kepemimpinan lintas budaya, tanpa memaksakan agenda apapun.",
    tile4Label: "Selalu tersedia",
    tile4H3: "Kapan kamu butuhkan, ada di sini",
    tile4Body: "Tidak perlu jadwal. Tidak ada daftar tunggu. Apakah kamu sedang dalam masa transisi, membawa beban dari minggu ini, atau sekadar butuh ruang untuk berpikir — buka sesi.",
    replacementNote: "WayPoint bukan pengganti pendampingan pastoral, komunitas manusia, atau dukungan profesional. Ini adalah alat berpikir — dan itulah yang membuatnya berharga.",
    ctaLabel: "Keanggotaan",
    ctaH2NonUser: "Akses WayPoint\nmelalui keanggotaan.",
    ctaH2User: "Siap berpikir keras?",
    ctaBodyNonUser: "WayPoint adalah bagian dari platform Crispy Leaders. Daftar keanggotaan — setiap pendaftaran ditinjau secara personal.",
    ctaBodyUser: "WayPoint tersedia di dashboard kamu.",
    ctaExploreButton: "Jelajahi gratis",
  },
};

export default function WayPointContent({ isLoggedIn }: { isLoggedIn: boolean }) {
  const { lang } = useLanguage();
  const t = lang === "id" ? translations.id : translations.en;

  return (
    <>
      {/* ── HERO ── */}
      <section
        style={{
          background: "oklch(18% 0.08 260)",
          paddingTop: "clamp(5rem, 10vw, 10rem)",
          paddingBottom: "clamp(5rem, 10vw, 10rem)",
          position: "relative",
          overflow: "hidden",
        }}
      >
        <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: "3px", background: "oklch(65% 0.15 45)" }} />
        <div aria-hidden="true" style={{ position: "absolute", inset: 0, backgroundImage: "radial-gradient(circle, oklch(97% 0.005 80 / 0.05) 1px, transparent 1px)", backgroundSize: "28px 28px", pointerEvents: "none" }} />
        {[600, 480, 360].map((size) => (
          <div key={size} aria-hidden="true" style={{ position: "absolute", bottom: `-${size / 2 + 40}px`, right: `-${size / 2 + 40}px`, width: `${size}px`, height: `${size}px`, borderRadius: "50%", border: "1px solid oklch(97% 0.005 80 / 0.05)", pointerEvents: "none" }} />
        ))}

        <div className="container-wide" style={{ position: "relative" }}>
          <div style={{ maxWidth: "640px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "0.875rem", marginBottom: "1.75rem", flexWrap: "wrap" }}>
              <p className="t-label" style={{ color: "oklch(65% 0.15 45)", margin: 0 }}>{t.heroLabel}</p>
              <span style={{ fontFamily: "var(--font-montserrat)", fontSize: "0.6rem", fontWeight: 700, letterSpacing: "0.18em", textTransform: "uppercase", background: "oklch(65% 0.15 45 / 0.2)", border: "1px solid oklch(65% 0.15 45 / 0.5)", color: "oklch(65% 0.15 45)", padding: "0.25rem 0.6rem", lineHeight: 1 }}>
                {t.heroBadge}
              </span>
            </div>

            <h1 style={{ fontFamily: "var(--font-cormorant)", fontStyle: "italic", fontWeight: 400, fontSize: "clamp(3.2rem, 7vw, 6.5rem)", lineHeight: 1.0, color: "oklch(97% 0.005 80)", marginBottom: "2rem" }}>
              {t.heroH1Line1}<br />{t.heroH1Line2}
            </h1>

            <p style={{ fontFamily: "var(--font-montserrat)", fontSize: "clamp(0.95rem, 1.8vw, 1.0625rem)", lineHeight: 1.75, color: "oklch(75% 0.04 260)", marginBottom: "2.75rem", maxWidth: "48ch" }}>
              {t.heroTagline}
            </p>

            <div style={{ display: "flex", flexWrap: "wrap", gap: "1rem", alignItems: "center" }}>
              {isLoggedIn ? (
                <>
                  <Link href="/coach" className="btn-primary">{t.heroCtaButtonUser}</Link>
                  <p style={{ fontFamily: "var(--font-montserrat)", fontSize: "0.775rem", color: "oklch(52% 0.008 260)", margin: 0 }}>{t.heroCtaUser}</p>
                </>
              ) : (
                <>
                  <Link href="/membership" className="btn-primary">{t.heroCtaButton}</Link>
                  <p style={{ fontFamily: "var(--font-montserrat)", fontSize: "0.775rem", color: "oklch(52% 0.008 260)", margin: 0, lineHeight: 1.5 }}>{t.heroCtaNonUser}</p>
                </>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* ── WHAT IT DOES FOR YOU ── */}
      <section style={{ background: "oklch(97% 0.005 80)", paddingBlock: "clamp(4.5rem, 8vw, 8rem)" }}>
        <div className="container-wide">
          <div style={{ marginBottom: "clamp(2.5rem, 5vw, 4rem)", maxWidth: "540px" }}>
            <h2 style={{ fontFamily: "var(--font-cormorant)", fontStyle: "italic", fontWeight: 400, fontSize: "clamp(2rem, 4vw, 3.5rem)", lineHeight: 1.1, color: "oklch(22% 0.10 260)", marginBottom: "1.25rem" }}>
              {t.sectionH2}
            </h2>
            <p style={{ fontFamily: "var(--font-montserrat)", fontSize: "0.9375rem", lineHeight: 1.75, color: "oklch(42% 0.008 260)" }}>
              {t.sectionSubtitle}
            </p>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: "2px", background: "oklch(88% 0.008 80)", marginBottom: "clamp(2.5rem, 5vw, 4rem)" }}>

            <div style={{ background: "oklch(97% 0.005 80)", padding: "clamp(2rem, 4vw, 2.75rem)" }}>
              <p style={{ fontFamily: "var(--font-montserrat)", fontSize: "0.62rem", fontWeight: 700, letterSpacing: "0.2em", textTransform: "uppercase", color: "oklch(65% 0.15 45)", marginBottom: "1rem" }}>{t.tile1Label}</p>
              <h3 style={{ fontFamily: "var(--font-montserrat)", fontWeight: 700, fontSize: "1rem", color: "oklch(22% 0.10 260)", marginBottom: "0.875rem", lineHeight: 1.3 }}>{t.tile1H3}</h3>
              <p style={{ fontFamily: "var(--font-montserrat)", fontSize: "0.875rem", lineHeight: 1.75, color: "oklch(42% 0.008 260)", margin: 0 }}>{t.tile1Body}</p>
            </div>

            <div style={{ background: "oklch(22% 0.10 260)", padding: "clamp(2rem, 4vw, 2.75rem)", position: "relative", overflow: "hidden" }}>
              <div aria-hidden="true" style={{ position: "absolute", inset: 0, backgroundImage: "radial-gradient(circle, oklch(97% 0.005 80 / 0.04) 1px, transparent 1px)", backgroundSize: "28px 28px", pointerEvents: "none" }} />
              <div style={{ position: "relative" }}>
                <p style={{ fontFamily: "var(--font-montserrat)", fontSize: "0.62rem", fontWeight: 700, letterSpacing: "0.2em", textTransform: "uppercase", color: "oklch(65% 0.15 45)", marginBottom: "1rem" }}>{t.tile2Label}</p>
                <h3 style={{ fontFamily: "var(--font-montserrat)", fontWeight: 700, fontSize: "1rem", color: "oklch(97% 0.005 80)", marginBottom: "0.875rem", lineHeight: 1.3 }}>{t.tile2H3}</h3>
                <p style={{ fontFamily: "var(--font-montserrat)", fontSize: "0.875rem", lineHeight: 1.75, color: "oklch(72% 0.04 260)", margin: 0 }}>{t.tile2Body}</p>
              </div>
            </div>

            <div style={{ background: "oklch(97% 0.005 80)", padding: "clamp(2rem, 4vw, 2.75rem)" }}>
              <p style={{ fontFamily: "var(--font-montserrat)", fontSize: "0.62rem", fontWeight: 700, letterSpacing: "0.2em", textTransform: "uppercase", color: "oklch(65% 0.15 45)", marginBottom: "1rem" }}>{t.tile3Label}</p>
              <h3 style={{ fontFamily: "var(--font-montserrat)", fontWeight: 700, fontSize: "1rem", color: "oklch(22% 0.10 260)", marginBottom: "0.875rem", lineHeight: 1.3 }}>{t.tile3H3}</h3>
              <p style={{ fontFamily: "var(--font-montserrat)", fontSize: "0.875rem", lineHeight: 1.75, color: "oklch(42% 0.008 260)", margin: 0 }}>{t.tile3Body}</p>
            </div>

            <div style={{ background: "oklch(18% 0.08 260)", padding: "clamp(2rem, 4vw, 2.75rem)", position: "relative", overflow: "hidden" }}>
              <div aria-hidden="true" style={{ position: "absolute", inset: 0, backgroundImage: "radial-gradient(circle, oklch(97% 0.005 80 / 0.04) 1px, transparent 1px)", backgroundSize: "28px 28px", pointerEvents: "none" }} />
              <div style={{ position: "relative" }}>
                <p style={{ fontFamily: "var(--font-montserrat)", fontSize: "0.62rem", fontWeight: 700, letterSpacing: "0.2em", textTransform: "uppercase", color: "oklch(65% 0.15 45)", marginBottom: "1rem" }}>{t.tile4Label}</p>
                <h3 style={{ fontFamily: "var(--font-montserrat)", fontWeight: 700, fontSize: "1rem", color: "oklch(97% 0.005 80)", marginBottom: "0.875rem", lineHeight: 1.3 }}>{t.tile4H3}</h3>
                <p style={{ fontFamily: "var(--font-montserrat)", fontSize: "0.875rem", lineHeight: 1.75, color: "oklch(68% 0.04 260)", margin: 0 }}>{t.tile4Body}</p>
              </div>
            </div>

          </div>

          <div style={{ borderLeft: "3px solid oklch(88% 0.008 80)", paddingLeft: "1.5rem", maxWidth: "56ch" }}>
            <p style={{ fontFamily: "var(--font-montserrat)", fontSize: "0.8375rem", lineHeight: 1.75, color: "oklch(55% 0.006 260)", margin: 0, fontStyle: "italic" }}>
              {t.replacementNote}
            </p>
          </div>
        </div>
      </section>

      {/* ── MEMBERSHIP CTA ── */}
      <section style={{ background: "oklch(22% 0.10 260)", paddingBlock: "clamp(5rem, 9vw, 9rem)", position: "relative", overflow: "hidden", textAlign: "center" }}>
        <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: "3px", background: "oklch(65% 0.15 45)" }} />
        <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, height: "3px", background: "oklch(65% 0.15 45)" }} />
        {[560, 480, 400].map((size) => (
          <div key={size} aria-hidden="true" style={{ position: "absolute", bottom: `-${size / 2 + 20}px`, left: "50%", transform: "translateX(-50%)", width: `${size}px`, height: `${size}px`, borderRadius: "50%", border: "1px solid oklch(97% 0.005 80 / 0.06)", pointerEvents: "none" }} />
        ))}

        <div className="container-wide" style={{ position: "relative" }}>
          <div style={{ maxWidth: "540px", margin: "0 auto" }}>
            <p style={{ fontFamily: "var(--font-montserrat)", fontSize: "0.68rem", fontWeight: 700, letterSpacing: "0.22em", textTransform: "uppercase", color: "oklch(65% 0.15 45)", marginBottom: "2rem" }}>
              {t.ctaLabel}
            </p>

            <h2 style={{ fontFamily: "var(--font-cormorant)", fontStyle: "italic", fontWeight: 400, fontSize: "clamp(2.8rem, 6vw, 5rem)", lineHeight: 1.0, color: "oklch(97% 0.005 80)", marginBottom: "1.75rem" }}>
              {isLoggedIn
                ? t.ctaH2User
                : t.ctaH2NonUser.split("\n").map((line, i, arr) => (
                    <span key={i}>{line}{i < arr.length - 1 && <br />}</span>
                  ))}
            </h2>

            <p style={{ fontFamily: "var(--font-montserrat)", fontSize: "0.9375rem", lineHeight: 1.75, color: "oklch(72% 0.04 260)", marginBottom: "2.5rem", maxWidth: "44ch", marginLeft: "auto", marginRight: "auto" }}>
              {isLoggedIn ? t.ctaBodyUser : t.ctaBodyNonUser}
            </p>

            {isLoggedIn ? (
              <Link href="/coach" className="btn-primary">{t.heroCtaButtonUser}</Link>
            ) : (
              <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "center", gap: "1rem" }}>
                <Link href="/membership" className="btn-primary">{t.heroCtaButton}</Link>
                <Link href="/resources" style={{ fontFamily: "var(--font-montserrat)", fontWeight: 700, fontSize: "0.8rem", padding: "0.75rem 1.5rem", border: "1px solid oklch(97% 0.005 80 / 0.22)", color: "oklch(97% 0.005 80)", textDecoration: "none", display: "inline-flex", alignItems: "center", letterSpacing: "0.03em" }}>
                  {t.ctaExploreButton}
                </Link>
              </div>
            )}
          </div>
        </div>
      </section>
    </>
  );
}

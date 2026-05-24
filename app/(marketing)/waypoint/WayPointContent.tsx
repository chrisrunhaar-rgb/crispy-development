"use client";

import Image from "next/image";
import Link from "next/link";
import { useLanguage } from "@/lib/LanguageContext";

const translations = {
  en: {
    heroLabel: "WayPoint Coach",
    heroBadge: "Beta",
    heroH1Line1: "A private space",
    heroH1Line2: "to think out loud.",
    heroTagline: "An AI voice coaching conversation whenever you need one. It doesn't give advice. It asks the right questions — and helps you find your own clarity.",
    heroCtaNonUser: "Available to Crispy Leaders members",
    heroCtaUser: "Available in your dashboard",
    heroCtaButton: "Apply for membership →",
    heroCtaButtonUser: "Open WayPoint →",
    sectionH2: "You already have the answers.",
    sectionSubtitle: "WayPoint doesn't coach you by telling you what to do. It creates space for you to hear what you already know.",
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
    tile4H3: "When you need it, it's there",
    tile4Body: "No scheduling. No waiting list. Whether you're in a moment of transition, carrying tension from the week, or just need space to think — open a session.",
    replacementNote: "WayPoint is not a replacement for pastoral care, human community, or professional support. It's a thinking tool — and that's what makes it valuable.",
    ctaLabel: "Membership",
    ctaH2NonUser: "Access WayPoint\nthrough membership.",
    ctaH2User: "Ready to think out loud?",
    ctaBodyNonUser: "WayPoint is part of the Crispy Leaders platform. Apply for membership — every application is reviewed personally.",
    ctaBodyUser: "WayPoint is available in your dashboard.",
    ctaExploreButton: "Browse free resources",
  },
  id: {
    heroLabel: "WayPoint Coach",
    heroBadge: "Beta",
    heroH1Line1: "Ruang yang hanya milikmu",
    heroH1Line2: "untuk berpikir dengan bebas.",
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
    ctaH2User: "Siap berpikir dengan bebas?",
    ctaBodyNonUser: "WayPoint adalah bagian dari platform Crispy Leaders. Daftar keanggotaan — setiap pendaftaran ditinjau secara personal.",
    ctaBodyUser: "WayPoint tersedia di dashboard kamu.",
    ctaExploreButton: "Jelajahi sumber daya gratis",
  },
};


export default function WayPointContent({ isLoggedIn }: { isLoggedIn: boolean }) {
  const { lang } = useLanguage();
  const t = lang === "id" ? translations.id : translations.en;

  return (
    <>
      <style>{`
        .wp-tiles {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          border: 1px solid oklch(88% 0.008 80);
        }
        @media (max-width: 540px) {
          .wp-tiles { grid-template-columns: 1fr; }
          .wp-tile { border-right: none !important; }
        }
        .wp-mark-grid {
          display: grid;
          grid-template-columns: 1fr 2fr;
          gap: clamp(3rem, 6vw, 6rem);
          align-items: center;
          max-width: 900px;
        }
        @media (max-width: 640px) {
          .wp-mark-grid { grid-template-columns: 1fr; }
          .wp-mark-logo { max-width: 180px !important; margin: 0 auto 2.5rem; }
          .wp-mark-text { border-left: none !important; padding-left: 0 !important; border-top: 2px solid oklch(65% 0.15 45 / 0.35); padding-top: 2.5rem !important; }
        }
        @media (prefers-reduced-motion: no-preference) {
          .wp-tile { transition: background 0.2s ease; }
        }
      `}</style>

      {/* ── HERO ── */}
      <section style={{ background: "oklch(22% 0.10 260)", paddingTop: "clamp(5rem, 10vw, 9rem)", paddingBottom: "clamp(5rem, 10vw, 9rem)", position: "relative", overflow: "hidden" }}>
        {/* Orange accent line at top */}
        <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: "3px", background: "oklch(65% 0.15 45)" }} />

        {/* Dot grid texture */}
        <div aria-hidden="true" style={{ position: "absolute", inset: 0, backgroundImage: "radial-gradient(circle, oklch(97% 0.005 80 / 0.07) 1px, transparent 1px)", backgroundSize: "28px 28px", pointerEvents: "none" }} />

        {/* Concentric ring decorations */}
        <div aria-hidden="true" style={{ position: "absolute", bottom: "-200px", right: "-200px", width: "560px", height: "560px", borderRadius: "50%", border: "1px solid oklch(97% 0.005 80 / 0.06)", pointerEvents: "none" }}>
          <div style={{ position: "absolute", top: "80px", left: "80px", right: "80px", bottom: "80px", borderRadius: "50%", border: "1px solid oklch(97% 0.005 80 / 0.06)" }}>
            <div style={{ position: "absolute", top: "80px", left: "80px", right: "80px", bottom: "80px", borderRadius: "50%", border: "1px solid oklch(65% 0.15 45 / 0.18)" }} />
          </div>
        </div>

        <div className="container-wide" style={{ position: "relative" }}>
          {/* Compass mark — decorative, right side */}
          <div aria-hidden="true" style={{ position: "absolute", right: 0, top: "50%", transform: "translateY(-50%)", width: "min(38vw, 380px)", height: "min(38vw, 380px)", pointerEvents: "none", mixBlendMode: "screen", opacity: 0.45 }}>
            <Image src="/images/waypoint/waypoint-logo-circle.png" alt="" fill style={{ objectFit: "contain" }} priority />
          </div>

          <div style={{ maxWidth: "600px", position: "relative" }}>
            {/* Eyebrow */}
            <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginBottom: "2rem" }}>
              <p style={{ fontFamily: "var(--font-montserrat)", fontSize: "0.7rem", fontWeight: 700, letterSpacing: "0.2em", textTransform: "uppercase", color: "oklch(65% 0.15 45)", margin: 0 }}>
                WayPoint · AI Coaching
              </p>
              <span style={{ fontFamily: "var(--font-montserrat)", fontSize: "0.6rem", fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: "oklch(22% 0.10 260)", background: "oklch(65% 0.15 45)", padding: "0.22rem 0.65rem", borderRadius: "2px" }}>
                Beta
              </span>
            </div>

            {/* Accent rule */}
            <div style={{ width: "48px", height: "2px", background: "oklch(65% 0.15 45)", marginBottom: "1.75rem" }} />

            <h1 style={{ fontFamily: "var(--font-cormorant)", fontStyle: "italic", fontWeight: 600, fontSize: "clamp(2.8rem, 5.5vw, 5.5rem)", lineHeight: 1.0, color: "oklch(97% 0.005 80)", margin: "0 0 1.75rem" }}>
              {t.heroH1Line1}<br />{t.heroH1Line2}
            </h1>

            <p style={{ fontFamily: "var(--font-cormorant)", fontStyle: "italic", fontSize: "clamp(1.15rem, 2vw, 1.4rem)", lineHeight: 1.75, color: "oklch(82% 0.035 260)", margin: "0 0 3rem", maxWidth: "50ch" }}>
              {t.heroTagline}
            </p>

            <div style={{ display: "flex", flexWrap: "wrap", gap: "1rem", alignItems: "center" }}>
              {isLoggedIn ? (
                <>
                  <Link href="/coach" className="btn-primary" style={{ fontSize: "0.875rem", minHeight: "48px", display: "inline-flex", alignItems: "center" }}>
                    {t.heroCtaButtonUser}
                  </Link>
                  <p style={{ fontFamily: "var(--font-montserrat)", fontSize: "0.775rem", color: "oklch(68% 0.015 260)", margin: 0, lineHeight: 1.5 }}>
                    {t.heroCtaUser}
                  </p>
                </>
              ) : (
                <>
                  <Link href="/membership" className="btn-primary" style={{ fontSize: "0.875rem", minHeight: "48px", display: "inline-flex", alignItems: "center" }}>
                    {t.heroCtaButton}
                  </Link>
                  <p style={{ fontFamily: "var(--font-montserrat)", fontSize: "0.775rem", color: "oklch(68% 0.015 260)", margin: 0, lineHeight: 1.5 }}>
                    {t.heroCtaNonUser}
                  </p>
                </>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* ── WHAT IT DOES ── */}
      <section style={{ background: "oklch(97% 0.005 80)", paddingBlock: "clamp(5rem, 9vw, 9rem)" }}>
        <div className="container-wide">
          {/* Section header */}
          <div style={{ marginBottom: "clamp(3rem, 5vw, 4.5rem)", maxWidth: "560px" }}>
            <h2 style={{ fontFamily: "var(--font-cormorant)", fontStyle: "italic", fontWeight: 600, fontSize: "clamp(2.2rem, 4vw, 3.75rem)", lineHeight: 1.05, color: "oklch(22% 0.10 260)", margin: "0 0 1.25rem" }}>
              {t.sectionH2}
            </h2>
            <p style={{ fontFamily: "var(--font-montserrat)", fontSize: "0.9375rem", lineHeight: 1.8, color: "oklch(42% 0.008 260)", margin: 0 }}>
              {t.sectionSubtitle}
            </p>
          </div>

          {/* 2×2 tile grid — checkerboard light/dark */}
          <div className="wp-tiles" style={{ marginBottom: "clamp(3rem, 5vw, 4.5rem)" }}>

            {/* Tile 1 — light, top-left */}
            <div className="wp-tile" style={{ padding: "clamp(2rem, 4vw, 3rem)", borderRight: "1px solid oklch(88% 0.008 80)", borderBottom: "1px solid oklch(88% 0.008 80)", background: "oklch(97% 0.005 80)" }}>
              <p style={{ fontFamily: "var(--font-montserrat)", fontSize: "0.7rem", fontWeight: 700, letterSpacing: "0.18em", textTransform: "uppercase", color: "oklch(65% 0.15 45)", margin: "0 0 0.875rem" }}>
                {t.tile1Label}
              </p>
              <h3 style={{ fontFamily: "var(--font-montserrat)", fontWeight: 700, fontSize: "1rem", color: "oklch(22% 0.10 260)", margin: "0 0 0.875rem", lineHeight: 1.35 }}>
                {t.tile1H3}
              </h3>
              <p style={{ fontFamily: "var(--font-montserrat)", fontSize: "0.875rem", lineHeight: 1.8, color: "oklch(42% 0.008 260)", margin: 0 }}>
                {t.tile1Body}
              </p>
            </div>

            {/* Tile 2 — dark navy, top-right */}
            <div className="wp-tile" style={{ padding: "clamp(2rem, 4vw, 3rem)", borderBottom: "1px solid oklch(14% 0.06 260)", background: "oklch(22% 0.10 260)", position: "relative", overflow: "hidden" }}>
              <div aria-hidden="true" style={{ position: "absolute", inset: 0, backgroundImage: "radial-gradient(circle, oklch(97% 0.005 80 / 0.04) 1px, transparent 1px)", backgroundSize: "24px 24px", pointerEvents: "none" }} />
              <div style={{ position: "relative" }}>
                <p style={{ fontFamily: "var(--font-montserrat)", fontSize: "0.7rem", fontWeight: 700, letterSpacing: "0.18em", textTransform: "uppercase", color: "oklch(65% 0.15 45)", margin: "0 0 0.875rem" }}>
                  {t.tile2Label}
                </p>
                <h3 style={{ fontFamily: "var(--font-montserrat)", fontWeight: 700, fontSize: "1rem", color: "oklch(97% 0.005 80)", margin: "0 0 0.875rem", lineHeight: 1.35 }}>
                  {t.tile2H3}
                </h3>
                <p style={{ fontFamily: "var(--font-montserrat)", fontSize: "0.875rem", lineHeight: 1.8, color: "oklch(76% 0.03 260)", margin: 0 }}>
                  {t.tile2Body}
                </p>
              </div>
            </div>

            {/* Tile 3 — deeper dark, bottom-left */}
            <div className="wp-tile" style={{ padding: "clamp(2rem, 4vw, 3rem)", borderRight: "1px solid oklch(14% 0.06 260)", background: "oklch(18% 0.08 260)", position: "relative", overflow: "hidden" }}>
              <div aria-hidden="true" style={{ position: "absolute", inset: 0, backgroundImage: "radial-gradient(circle, oklch(97% 0.005 80 / 0.04) 1px, transparent 1px)", backgroundSize: "24px 24px", pointerEvents: "none" }} />
              <div style={{ position: "relative" }}>
                <p style={{ fontFamily: "var(--font-montserrat)", fontSize: "0.7rem", fontWeight: 700, letterSpacing: "0.18em", textTransform: "uppercase", color: "oklch(65% 0.15 45)", margin: "0 0 0.875rem" }}>
                  {t.tile3Label}
                </p>
                <h3 style={{ fontFamily: "var(--font-montserrat)", fontWeight: 700, fontSize: "1rem", color: "oklch(97% 0.005 80)", margin: "0 0 0.875rem", lineHeight: 1.35 }}>
                  {t.tile3H3}
                </h3>
                <p style={{ fontFamily: "var(--font-montserrat)", fontSize: "0.875rem", lineHeight: 1.8, color: "oklch(76% 0.03 260)", margin: 0 }}>
                  {t.tile3Body}
                </p>
              </div>
            </div>

            {/* Tile 4 — light, bottom-right */}
            <div className="wp-tile" style={{ padding: "clamp(2rem, 4vw, 3rem)", background: "oklch(97% 0.005 80)" }}>
              <p style={{ fontFamily: "var(--font-montserrat)", fontSize: "0.7rem", fontWeight: 700, letterSpacing: "0.18em", textTransform: "uppercase", color: "oklch(65% 0.15 45)", margin: "0 0 0.875rem" }}>
                {t.tile4Label}
              </p>
              <h3 style={{ fontFamily: "var(--font-montserrat)", fontWeight: 700, fontSize: "1rem", color: "oklch(22% 0.10 260)", margin: "0 0 0.875rem", lineHeight: 1.35 }}>
                {t.tile4H3}
              </h3>
              <p style={{ fontFamily: "var(--font-montserrat)", fontSize: "0.875rem", lineHeight: 1.8, color: "oklch(42% 0.008 260)", margin: 0 }}>
                {t.tile4Body}
              </p>
            </div>

          </div>

          {/* Replacement note — styled aside */}
          <div style={{ display: "flex", gap: "1rem", alignItems: "flex-start", maxWidth: "62ch", padding: "1.5rem 1.75rem", background: "oklch(94% 0.006 80)", borderLeft: "3px solid oklch(65% 0.15 45 / 0.5)" }}>
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true" style={{ color: "oklch(58% 0.012 260)", flexShrink: 0, marginTop: "2px" }}>
              <circle cx="8" cy="8" r="7" stroke="currentColor" strokeWidth="1.5" />
              <path d="M8 5v4M8 11v.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
            </svg>
            <p style={{ fontFamily: "var(--font-montserrat)", fontSize: "0.84rem", lineHeight: 1.75, color: "oklch(48% 0.006 260)", margin: 0 }}>
              {t.replacementNote}
            </p>
          </div>
        </div>
      </section>

      {/* ── THE MARK ── */}
      <section style={{ background: "oklch(22% 0.10 260)", paddingBlock: "clamp(5rem, 9vw, 9rem)", position: "relative", overflow: "hidden" }}>
        <div aria-hidden="true" style={{ position: "absolute", inset: 0, backgroundImage: "radial-gradient(circle, oklch(97% 0.005 80 / 0.03) 1px, transparent 1px)", backgroundSize: "28px 28px", pointerEvents: "none" }} />

        <div className="container-wide" style={{ position: "relative" }}>
          <div className="wp-mark-grid">

            {/* Left: logo */}
            <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-start" }}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/images/waypoint/waypoint-logo-circle.png"
                alt="WayPoint mark"
                className="wp-mark-logo"
                style={{ width: "100%", maxWidth: "340px", height: "auto", display: "block" }}
              />
            </div>

            {/* Right: explanations */}
            <div className="wp-mark-text" style={{ borderLeft: "2px solid oklch(65% 0.15 45 / 0.4)", paddingLeft: "clamp(1.5rem, 3vw, 2.5rem)", paddingTop: 0 }}>
              <div style={{ marginBottom: "2.5rem" }}>
                <p style={{ fontFamily: "var(--font-montserrat)", fontSize: "0.64rem", fontWeight: 700, letterSpacing: "0.18em", textTransform: "uppercase", color: "oklch(65% 0.15 45)", margin: "0 0 0.5rem" }}>
                  Compass rose
                </p>
                <p style={{ fontFamily: "var(--font-cormorant)", fontStyle: "italic", fontWeight: 600, fontSize: "clamp(1.5rem, 2.5vw, 1.9rem)", color: "oklch(97% 0.005 80)", margin: "0 0 0.5rem", lineHeight: 1.1 }}>
                  Orientation.
                </p>
                <p style={{ fontFamily: "var(--font-montserrat)", fontSize: "0.875rem", lineHeight: 1.75, color: "oklch(70% 0.02 260)", margin: 0 }}>
                  Finding your footing in unfamiliar terrain.
                </p>
              </div>

              <div style={{ marginBottom: "3rem" }}>
                <p style={{ fontFamily: "var(--font-montserrat)", fontSize: "0.64rem", fontWeight: 700, letterSpacing: "0.18em", textTransform: "uppercase", color: "oklch(65% 0.15 45)", margin: "0 0 0.5rem" }}>
                  Location pin
                </p>
                <p style={{ fontFamily: "var(--font-cormorant)", fontStyle: "italic", fontWeight: 600, fontSize: "clamp(1.5rem, 2.5vw, 1.9rem)", color: "oklch(97% 0.005 80)", margin: "0 0 0.5rem", lineHeight: 1.1 }}>
                  Destination.
                </p>
                <p style={{ fontFamily: "var(--font-montserrat)", fontSize: "0.875rem", lineHeight: 1.75, color: "oklch(70% 0.02 260)", margin: 0 }}>
                  Knowing where you&apos;re headed.
                </p>
              </div>

              <p style={{ fontFamily: "var(--font-cormorant)", fontStyle: "italic", fontWeight: 600, fontSize: "clamp(1.6rem, 2.8vw, 2.1rem)", color: "oklch(97% 0.005 80)", margin: "0 0 2rem", lineHeight: 1.2 }}>
                WayPoint helps you find both.
              </p>

              <p style={{ fontFamily: "var(--font-montserrat)", fontSize: "0.8rem", lineHeight: 1.7, color: "oklch(52% 0.008 260)", margin: 0 }}>
                WayPoint is a product of{" "}
                <Link href="/" style={{ color: "oklch(65% 0.15 45)", textDecoration: "none", fontWeight: 600 }}>
                  Crispy Development
                </Link>
                {" "}— built for cross-cultural leaders inside the Crispy Leaders platform.
              </p>
            </div>

          </div>
        </div>
      </section>

      {/* ── MEMBERSHIP CTA ── */}
      <section style={{ background: "oklch(97% 0.005 80)", paddingBlock: "clamp(6rem, 10vw, 10rem)", position: "relative", overflow: "hidden", textAlign: "center", borderTop: "1px solid oklch(88% 0.008 80)" }}>
        {[600, 500, 400].map((size) => (
          <div key={size} aria-hidden="true" style={{ position: "absolute", bottom: `-${size / 2}px`, left: "50%", transform: "translateX(-50%)", width: `${size}px`, height: `${size}px`, borderRadius: "50%", border: "1px solid oklch(22% 0.10 260 / 0.05)", pointerEvents: "none" }} />
        ))}

        <div className="container-wide" style={{ position: "relative" }}>
          <div style={{ maxWidth: "520px", margin: "0 auto" }}>
            <p style={{ fontFamily: "var(--font-montserrat)", fontSize: "0.7rem", fontWeight: 700, letterSpacing: "0.22em", textTransform: "uppercase", color: "oklch(65% 0.15 45)", margin: "0 0 2rem" }}>
              {t.ctaLabel}
            </p>

            <h2 style={{ fontFamily: "var(--font-cormorant)", fontStyle: "italic", fontWeight: 600, fontSize: "clamp(3rem, 6.5vw, 5.5rem)", lineHeight: 1.0, color: "oklch(22% 0.10 260)", margin: "0 0 1.75rem" }}>
              {isLoggedIn
                ? t.ctaH2User
                : t.ctaH2NonUser.split("\n").map((line, i, arr) => (
                    <span key={i}>{line}{i < arr.length - 1 && <br />}</span>
                  ))}
            </h2>

            <p style={{ fontFamily: "var(--font-montserrat)", fontSize: "0.9375rem", lineHeight: 1.8, color: "oklch(42% 0.008 260)", margin: "0 auto 2.75rem", maxWidth: "44ch" }}>
              {isLoggedIn ? t.ctaBodyUser : t.ctaBodyNonUser}
            </p>

            {isLoggedIn ? (
              <Link href="/coach" className="btn-primary" style={{ minHeight: "48px", display: "inline-flex", alignItems: "center" }}>
                {t.heroCtaButtonUser}
              </Link>
            ) : (
              <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "center", gap: "1rem" }}>
                <Link href="/membership" className="btn-primary" style={{ minHeight: "48px", display: "inline-flex", alignItems: "center" }}>
                  {t.heroCtaButton}
                </Link>
                <Link href="/resources" style={{ fontFamily: "var(--font-montserrat)", fontWeight: 700, fontSize: "0.8rem", padding: "0.75rem 1.5rem", minHeight: "48px", border: "1.5px solid oklch(22% 0.10 260 / 0.3)", color: "oklch(22% 0.10 260)", textDecoration: "none", display: "inline-flex", alignItems: "center", letterSpacing: "0.03em" }}>
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

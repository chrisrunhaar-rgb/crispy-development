"use client";

import Link from "next/link";
import { useLanguage } from "@/lib/LanguageContext";

const teamFeatureDescriptions: Record<string, { title: string; description: string }[]> = {
  en: [
    { title: "Team Dashboard", description: "A shared view of your team — members, selected content, and group activity." },
    { title: "Member Management", description: "Invite team members via email or shareable link. Remove or manage access at any time." },
    { title: "Content Selection", description: "Browse the full training library and choose what your team sees. You're in control." },
    { title: "Personal Pathway Included", description: "Every team member also gets full access to the Personal Pathway features." },
    { title: "Team Discussion Space", description: "A dedicated space for your team to discuss content and share insights." },
    { title: "Leader Tools", description: "Additional resources and guides specifically for team leaders in cross-cultural contexts." },
  ],
  id: [
    { title: "Dasbor Tim", description: "Tampilan bersama tim Anda — anggota, konten yang dipilih, dan aktivitas kelompok." },
    { title: "Manajemen Anggota", description: "Undang anggota tim via email atau tautan yang bisa dibagikan. Hapus atau kelola akses kapan saja." },
    { title: "Pemilihan Konten", description: "Telusuri perpustakaan pelatihan lengkap dan pilih apa yang dilihat tim Anda. Anda yang mengendalikan." },
    { title: "Jalur Pribadi Termasuk", description: "Setiap anggota tim juga mendapat akses penuh ke fitur Jalur Pribadi." },
    { title: "Ruang Diskusi Tim", description: "Ruang khusus bagi tim Anda untuk mendiskusikan konten dan berbagi wawasan." },
    { title: "Alat Pemimpin", description: "Sumber daya dan panduan tambahan khusus untuk pemimpin tim dalam konteks lintas budaya." },
  ],
  nl: [
    { title: "Teamdashboard", description: "Een gedeeld overzicht van je team — leden, geselecteerde content en groepsactiviteit." },
    { title: "Ledenbeheer", description: "Nodig teamleden uit via e-mail of deelbare link. Verwijder of beheer toegang op elk moment." },
    { title: "Contentselectie", description: "Doorzoek de volledige contentbibliotheek en kies wat je team ziet. Jij hebt de controle." },
    { title: "Persoonlijk Traject Inbegrepen", description: "Elk teamlid heeft ook volledige toegang tot de functies van het Persoonlijk Traject." },
    { title: "Teamdiscussieruimte", description: "Een speciale ruimte voor je team om content te bespreken en inzichten te delen." },
    { title: "Leiderstools", description: "Extra materialen en gidsen specifiek voor teamleiders in cross-culturele contexten." },
  ],
};

export default function TeamContent({ ctaHref = "/pricing" }: { ctaHref?: string }) {
  const { t, lang } = useLanguage();
  const p = t.team;
  const langKey = lang in teamFeatureDescriptions ? lang : "en";
  const features = teamFeatureDescriptions[langKey];

  return (
    <>
      {/* ── HERO ── */}
      <section style={{ background: "oklch(22% 0.10 260)", paddingTop: "clamp(4rem, 7vw, 7rem)", paddingBottom: "clamp(4rem, 7vw, 7rem)", position: "relative", overflow: "hidden" }}>
        {/* Photo background */}
        <div aria-hidden="true" style={{ position: "absolute", inset: 0, backgroundImage: "url('/pathway-personal.jpg')", backgroundSize: "cover", backgroundPosition: "center 30%", opacity: 0.15, pointerEvents: "none" }} />
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

      {/* ── HOW IT WORKS ── */}
      <style>{`
        .how-it-works-grid {
          display: grid;
          grid-template-columns: 1fr;
          gap: 0;
        }
        @media (min-width: 768px) {
          .how-it-works-grid {
            grid-template-columns: repeat(3, 1fr);
          }
        }
        .how-step {
          padding: clamp(2rem, 4vw, 2.75rem) clamp(1.5rem, 3vw, 2.5rem);
          border-bottom: 1px solid oklch(88% 0.008 80);
          display: flex;
          flex-direction: column;
          gap: 0;
        }
        @media (min-width: 768px) {
          .how-step {
            border-bottom: none;
            border-right: 1px solid oklch(88% 0.008 80);
          }
          .how-step:last-child {
            border-right: none;
          }
        }
        .how-step:last-child {
          border-bottom: none;
        }
      `}</style>
      <section style={{ paddingTop: "clamp(3.5rem, 6vw, 5rem)", background: "oklch(97% 0.005 80)", borderBottom: "1px solid oklch(88% 0.008 80)" }}>
        <div className="container-wide">
          {/* Section header */}
          <div style={{ marginBottom: "clamp(2.5rem, 5vw, 4rem)" }}>
            <p style={{ fontFamily: "var(--font-montserrat)", fontSize: "0.62rem", fontWeight: 700, letterSpacing: "0.22em", textTransform: "uppercase", color: "oklch(65% 0.15 45)", margin: "0 0 1rem" }}>{p.howLabel}</p>
            <h2 style={{ fontFamily: "var(--font-cormorant)", fontStyle: "italic", fontWeight: 600, fontSize: "clamp(2rem, 4vw, 3rem)", lineHeight: 1.1, color: "oklch(22% 0.10 260)", margin: 0, maxWidth: "480px" }}>
              {p.howHeading.split("\n").map((line: string, i: number) => (
                <span key={i}>{line}{i < p.howHeading.split("\n").length - 1 && <br />}</span>
              ))}
            </h2>
          </div>

          {/* Steps grid — 1 col mobile, 3 col desktop */}
          <div className="how-it-works-grid">
            {p.steps.map((step: { num: string; title: string; body: string }) => (
              <div key={step.num} className="how-step">
                {/* Large display number */}
                <span style={{
                  fontFamily: "var(--font-cormorant)",
                  fontStyle: "italic",
                  fontWeight: 600,
                  fontSize: "clamp(3rem, 5vw, 4rem)",
                  lineHeight: 1,
                  color: "oklch(65% 0.15 45)",
                  display: "block",
                  marginBottom: "1rem",
                }}>
                  {step.num}
                </span>
                {/* Thin orange rule */}
                <div style={{ width: "32px", height: "2px", background: "oklch(65% 0.15 45)", marginBottom: "1.25rem" }} />
                {/* Step title */}
                <h3 style={{
                  fontFamily: "var(--font-cormorant)",
                  fontStyle: "italic",
                  fontWeight: 600,
                  fontSize: "clamp(1.25rem, 2.2vw, 1.5rem)",
                  lineHeight: 1.2,
                  color: "oklch(22% 0.10 260)",
                  margin: "0 0 0.875rem",
                }}>
                  {step.title}
                </h3>
                {/* Step body */}
                <p style={{
                  fontFamily: "var(--font-montserrat)",
                  fontSize: "0.875rem",
                  lineHeight: 1.75,
                  color: "oklch(45% 0.010 260)",
                  margin: 0,
                }}>
                  {step.body}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <div className="divider" />

      {/* ── DASHBOARD PREVIEW ── */}
      <section style={{ paddingBlock: "clamp(4rem, 7vw, 7rem)", background: "oklch(97% 0.005 80)" }}>
        <div className="container-wide">
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: "clamp(3rem, 6vw, 6rem)", alignItems: "start" }}>
            <div>
              <p className="t-label" style={{ color: "oklch(65% 0.15 45)", marginBottom: "1rem" }}>{p.previewLabel}</p>
              <h2 className="t-section" style={{ marginBottom: "1.5rem" }}>
                {p.previewHeading.split("\n").map((line, i) => <span key={i}>{line}{i === 0 && <br />}</span>)}
              </h2>
              <p style={{ fontFamily: "var(--font-montserrat)", fontSize: "0.9375rem", lineHeight: 1.75, color: "oklch(42% 0.008 260)", maxWidth: "48ch", marginBottom: "2rem" }}>
                {(p as typeof p & { previewBody?: string }).previewBody ?? p.tagline}
              </p>
              <Link href={ctaHref} className="btn-primary">
                {p.ctaPrimary2} →
              </Link>
            </div>

            {/* Team dashboard + phone */}
            <style>{`
              .team-dash-wrap { position: relative; }
              .team-phone-abs {
                position: absolute;
                bottom: clamp(-20px, -3vw, -36px);
                left: clamp(-120px, -18vw, -180px);
                width: clamp(100px, 14vw, 170px);
              }
              .team-phone-inline { display: none; }
              @media (max-width: 700px) {
                .team-dash-wrap { display: flex; align-items: flex-end; }
                .team-phone-abs  { display: none; }
                .team-phone-inline {
                  display: block;
                  flex-shrink: 0;
                  width: clamp(100px, 28vw, 150px);
                  margin-right: clamp(-30px, -5vw, -45px);
                  margin-bottom: clamp(10px, 2vw, 20px);
                  z-index: 2;
                  position: relative;
                }
              }
            `}</style>
            <div className="team-dash-wrap">

              {/* Phone inline — mobile only, left side */}
              <div className="team-phone-inline" style={{
                background: "oklch(12% 0.06 260)",
                borderRadius: "clamp(18px, 4vw, 28px)",
                padding: "clamp(4px, 1vw, 7px)",
                boxShadow: "0 16px 40px oklch(8% 0.10 260 / 0.5), inset 0 0 0 1px oklch(97% 0.005 80 / 0.1)",
              }}>
                <div style={{ width: "28%", height: "6px", background: "oklch(8% 0.04 260)", borderRadius: "999px", margin: "0 auto 4px" }} />
                <div style={{ borderRadius: "clamp(12px, 3vw, 20px)", overflow: "hidden" }}>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src="/dashboard-team-mobile.jpg" alt="" style={{ width: "100%", display: "block" }} />
                </div>
                <div style={{ width: "28%", height: "3px", background: "oklch(45% 0.008 260)", borderRadius: "2px", margin: "4px auto 0" }} />
              </div>

              {/* Laptop */}
              <div style={{ flex: "1 1 0", borderRadius: "8px", overflow: "hidden", boxShadow: "0 16px 48px oklch(10% 0.10 260 / 0.35)" }}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src="/dashboard-team.png" alt={lang === "id" ? "Pratinjau dasbor tim" : "Team dashboard preview"} style={{ display: "block", width: "100%" }} />
              </div>

              {/* Phone absolute — desktop only, bottom-left */}
              <div className="team-phone-abs" style={{
                background: "oklch(12% 0.06 260)",
                borderRadius: "clamp(18px, 2.8vw, 30px)",
                padding: "clamp(4px, 0.6vw, 7px)",
                boxShadow: "0 24px 64px oklch(8% 0.10 260 / 0.6), inset 0 0 0 1px oklch(97% 0.005 80 / 0.12)",
                zIndex: 2,
              }}>
                <div style={{ position: "absolute", right: "-3px", top: "24%", width: "3px", height: "11%", background: "oklch(22% 0.06 260)", borderRadius: "0 2px 2px 0" }} />
                <div style={{ position: "absolute", left: "-3px", top: "19%", width: "3px", height: "6%", background: "oklch(22% 0.06 260)", borderRadius: "2px 0 0 2px" }} />
                <div style={{ position: "absolute", left: "-3px", top: "27%", width: "3px", height: "6%", background: "oklch(22% 0.06 260)", borderRadius: "2px 0 0 2px" }} />
                <div style={{ width: "28%", height: "clamp(4px, 0.8vw, 8px)", background: "oklch(8% 0.04 260)", borderRadius: "999px", margin: "0 auto clamp(3px, 0.5vw, 5px)" }} />
                <div style={{ borderRadius: "clamp(12px, 2.2vw, 22px)", overflow: "hidden" }}>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src="/dashboard-team-mobile.jpg" alt={lang === "id" ? "Tampilan mobile dasbor tim" : "Team dashboard mobile view"} style={{ width: "100%", display: "block" }} />
                </div>
                <div style={{ width: "28%", height: "3px", background: "oklch(45% 0.008 260)", borderRadius: "2px", margin: "clamp(3px, 0.5vw, 5px) auto 0" }} />
              </div>

            </div>
          </div>
        </div>
      </section>

      {/* ── FEATURES ── */}
      <style>{`
        .team-tile {
          background: oklch(27% 0.11 260);
          border: 1px solid oklch(97% 0.005 80 / 0.07);
          border-radius: 12px;
          padding: clamp(1.5rem, 2.5vw, 2rem);
          cursor: default;
          transition: transform 0.25s cubic-bezier(0.22,1,0.36,1), box-shadow 0.25s ease, background 0.2s ease, border-color 0.2s ease;
          will-change: transform;
        }
        .team-tile:hover {
          transform: translateY(-6px) rotate(-0.4deg);
          box-shadow: 0 20px 48px oklch(8% 0.10 260 / 0.5);
          background: oklch(30% 0.12 260);
          border-color: oklch(65% 0.15 45 / 0.3);
        }
        .team-tile:nth-child(even):hover { transform: translateY(-6px) rotate(0.4deg); }
      `}</style>
      <section style={{ paddingBlock: "clamp(4rem, 6vw, 6rem)", background: "oklch(22% 0.10 260)" }}>
        <div className="container-wide">
          <p className="t-label" style={{ color: "oklch(65% 0.15 45)", marginBottom: "0.875rem" }}>{p.featuresLabel}</p>
          <h2 className="t-section" style={{ color: "oklch(97% 0.005 80)", marginBottom: "2.5rem", maxWidth: "420px" }}>
            {(p.featuresHeading ?? p.howHeading).split("\n").map((line: string, i: number) => <span key={i}>{line}{i === 0 && <br />}</span>)}
          </h2>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))", gap: "clamp(0.75rem, 1.5vw, 1.25rem)" }}>
            {features.map((f, i) => (
              <div key={f.title} className="team-tile">
                <div style={{ display: "flex", alignItems: "center", gap: "0.625rem", marginBottom: "1rem" }}>
                  <span style={{ fontFamily: "var(--font-montserrat)", fontSize: "0.58rem", fontWeight: 800, letterSpacing: "0.12em", color: "oklch(65% 0.15 45 / 0.6)" }}>
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <div style={{ flex: 1, height: "1px", background: "oklch(65% 0.15 45 / 0.25)" }} />
                  <div style={{ width: "6px", height: "6px", borderRadius: "50%", background: "oklch(65% 0.15 45)" }} />
                </div>
                <h3 style={{ fontFamily: "var(--font-cormorant)", fontStyle: "italic", fontWeight: 600, fontSize: "clamp(1.1rem, 1.8vw, 1.3rem)", lineHeight: 1.2, color: "oklch(97% 0.005 80)", marginBottom: "0.625rem" }}>{f.title}</h3>
                <p style={{ fontFamily: "var(--font-montserrat)", fontSize: "0.825rem", lineHeight: 1.7, color: "oklch(68% 0.025 260)", margin: 0 }}>{f.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── APPLY CTA ── */}
      <section style={{ paddingBlock: "clamp(4rem, 7vw, 7rem)", background: "oklch(22% 0.10 260)" }}>
        <div className="container-wide">
          <Link href={ctaHref} className="btn-primary" style={{ display: "inline-flex" }}>
            {p.ctaPrimary2} →
          </Link>
        </div>
      </section>
    </>
  );
}

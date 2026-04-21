"use client";

import Link from "next/link";
import { useLanguage } from "@/lib/LanguageContext";

const teamFeatureDescriptions: Record<string, { title: string; description: string }[]> = {
  en: [
    { title: "Team Dashboard", description: "A shared view of your team — members, selected content, and group activity." },
    { title: "Member Management", description: "Invite team members via email or shareable link. Remove or manage access at any time." },
    { title: "Content Selection", description: "Browse the full content library and choose what your team sees. You're in control." },
    { title: "Personal Pathway Included", description: "Every team member also gets full access to the Personal Pathway features." },
    { title: "Team Discussion Space", description: "A dedicated space for your team to discuss content and share insights." },
    { title: "Leader Tools", description: "Additional resources and guides specifically for team leaders in cross-cultural contexts." },
  ],
  id: [
    { title: "Dasbor Tim", description: "Tampilan bersama tim Anda — anggota, konten yang dipilih, dan aktivitas kelompok." },
    { title: "Manajemen Anggota", description: "Undang anggota tim via email atau tautan yang bisa dibagikan. Hapus atau kelola akses kapan saja." },
    { title: "Pemilihan Konten", description: "Telusuri perpustakaan konten lengkap dan pilih apa yang dilihat tim Anda. Anda yang mengendalikan." },
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

export default function TeamContent({ ctaHref = "/signup?pathway=personal" }: { ctaHref?: string }) {
  const { t, lang } = useLanguage();
  const p = t.team;
  const langKey = lang in teamFeatureDescriptions ? lang : "en";
  const features = teamFeatureDescriptions[langKey];

  return (
    <>
      {/* ── HERO ── */}
      <section style={{ background: "oklch(30% 0.12 260)", paddingTop: "clamp(4rem, 7vw, 7rem)", paddingBottom: "clamp(4rem, 7vw, 7rem)", position: "relative", overflow: "hidden" }}>
        {/* Photo background */}
        <div aria-hidden="true" style={{ position: "absolute", inset: 0, backgroundImage: "url('/pathway-personal.jpg')", backgroundSize: "cover", backgroundPosition: "center 30%", opacity: 0.22, pointerEvents: "none" }} />
        <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: "3px", background: "oklch(65% 0.15 45)" }} />
        <div className="container-wide" style={{ position: "relative" }}>
          <span className="pathway-badge team" style={{ background: "oklch(97% 0.005 80 / 0.1)", color: "oklch(88% 0.008 80)", marginBottom: "1.5rem", display: "inline-flex" }}>{p.label}</span>
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

      {/* ── HOW IT WORKS ── */}
      <section style={{ paddingBlock: "clamp(4rem, 7vw, 7rem)", background: "oklch(97% 0.005 80)" }}>
        <div className="container-wide">
          <p className="t-label" style={{ color: "oklch(65% 0.15 45)", marginBottom: "0.875rem" }}>{p.howLabel}</p>
          <h2 className="t-section" style={{ marginBottom: "3.5rem", maxWidth: "420px" }}>
            {p.howHeading.split("\n").map((line, i) => <span key={i}>{line}{i === 0 && <br />}</span>)}
          </h2>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: "1px", background: "oklch(88% 0.008 80)" }}>
            {p.steps.map((step: { num: string; title: string; body: string }) => (
              <div key={step.num} style={{ background: "oklch(97% 0.005 80)", padding: "2.5rem 2rem" }}>
                <p style={{ fontFamily: "var(--font-montserrat)", fontWeight: 800, fontSize: "3rem", color: "oklch(92% 0.005 260)", lineHeight: 1, marginBottom: "1.5rem" }}>{step.num}</p>
                <h3 style={{ fontFamily: "var(--font-montserrat)", fontWeight: 700, fontSize: "1.0625rem", color: "oklch(22% 0.005 260)", marginBottom: "0.625rem" }}>{step.title}</h3>
                <p style={{ fontFamily: "var(--font-montserrat)", fontSize: "0.9rem", lineHeight: 1.65, color: "oklch(48% 0.008 260)" }}>{step.body}</p>
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
                {p.tagline}
              </p>
              <Link href={ctaHref} className="btn-primary">
                {p.ctaPrimary2} →
              </Link>
            </div>

            {/* Mock dashboard preview */}
            <div style={{ background: "oklch(30% 0.12 260)", padding: "1.5rem", fontFamily: "var(--font-montserrat)" }}>
              <p style={{ fontSize: "0.7rem", fontWeight: 600, letterSpacing: "0.15em", textTransform: "uppercase", color: "oklch(65% 0.15 45)", marginBottom: "1.25rem" }}>Team Dashboard</p>
              <h4 style={{ fontSize: "1.0625rem", fontWeight: 700, color: "oklch(97% 0.005 80)", marginBottom: "1.5rem" }}>Your Team Name</h4>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1px", background: "oklch(97% 0.005 80 / 0.1)", marginBottom: "1.5rem" }}>
                {[{ n: "4", label: lang === "id" ? "Anggota" : lang === "nl" ? "Leden" : "Members" }, { n: "3", label: lang === "id" ? "Item konten" : lang === "nl" ? "Content-items" : "Content items" }].map(s => (
                  <div key={s.label} style={{ background: "oklch(30% 0.12 260)", padding: "1rem" }}>
                    <p style={{ fontWeight: 800, fontSize: "1.75rem", color: "oklch(97% 0.005 80)", lineHeight: 1 }}>{s.n}</p>
                    <p style={{ fontSize: "0.75rem", color: "oklch(72% 0.04 260)", marginTop: "0.25rem" }}>{s.label}</p>
                  </div>
                ))}
              </div>
              <p style={{ fontSize: "0.65rem", fontWeight: 600, letterSpacing: "0.14em", textTransform: "uppercase", color: "oklch(72% 0.04 260)", marginBottom: "0.75rem" }}>
                {lang === "id" ? "Anggota" : lang === "nl" ? "Leden" : "Members"}
              </p>
              {["Maria S.", "James K.", "Priya M.", "David L."].map(name => (
                <div key={name} style={{ display: "flex", alignItems: "center", gap: "0.75rem", paddingBlock: "0.5rem", borderBottom: "1px solid oklch(97% 0.005 80 / 0.06)" }}>
                  <div style={{ width: "28px", height: "28px", borderRadius: "50%", background: "oklch(65% 0.15 45 / 0.2)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "0.7rem", fontWeight: 700, color: "oklch(65% 0.15 45)" }}>
                    {name[0]}
                  </div>
                  <span style={{ fontSize: "0.875rem", color: "oklch(88% 0.008 80)" }}>{name}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── FEATURES ── */}
      <section style={{ paddingBlock: "clamp(4rem, 6vw, 6rem)", background: "oklch(30% 0.12 260)" }}>
        <div className="container-wide">
          <p className="t-label" style={{ color: "oklch(65% 0.15 45)", marginBottom: "0.875rem" }}>{p.featuresLabel}</p>
          <h2 className="t-section" style={{ color: "oklch(97% 0.005 80)", marginBottom: "3rem", maxWidth: "420px" }}>
            {p.howHeading.split("\n").map((line, i) => <span key={i}>{line}{i === 0 && <br />}</span>)}
          </h2>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: "1.5rem 3rem" }}>
            {features.map(f => (
              <div key={f.title}>
                <h3 style={{ fontFamily: "var(--font-montserrat)", fontWeight: 700, fontSize: "0.9375rem", color: "oklch(97% 0.005 80)", marginBottom: "0.5rem" }}>{f.title}</h3>
                <p style={{ fontFamily: "var(--font-montserrat)", fontSize: "0.875rem", lineHeight: 1.65, color: "oklch(72% 0.04 260)" }}>{f.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── PRICING COMING SOON ── */}
      <section style={{ paddingBlock: "clamp(4rem, 7vw, 7rem)", background: "oklch(22% 0.10 260)" }}>
        <div className="container-wide">
          <div style={{ marginBottom: "3rem" }}>
            <div style={{ display: "inline-flex", alignItems: "center", gap: "0.5rem", background: "oklch(65% 0.15 45 / 0.15)", border: "1px solid oklch(65% 0.15 45 / 0.35)", padding: "0.375rem 0.875rem", marginBottom: "1.25rem" }}>
              <span style={{ fontFamily: "var(--font-montserrat)", fontSize: "0.62rem", fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", color: "oklch(65% 0.15 45)" }}>Team Pricing</span>
            </div>
            <h2 className="t-section" style={{ color: "oklch(97% 0.005 80)", marginBottom: "0.75rem" }}>Launching soon</h2>
            <p style={{ fontFamily: "var(--font-montserrat)", fontSize: "0.9rem", color: "oklch(72% 0.04 260)", maxWidth: "48ch" }}>
              One Team plan covers the leader and up to 8 members — all with Personal + Peer access included. No auto-renewal.
            </p>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: "1px", background: "oklch(38% 0.06 260)", maxWidth: "820px" }}>
            {/* PERSONAL + PEER */}
            <div style={{ background: "oklch(28% 0.11 260)", padding: "2rem", display: "flex", flexDirection: "column", gap: "1rem" }}>
              <div>
                <p style={{ fontFamily: "var(--font-montserrat)", fontSize: "0.62rem", fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", color: "oklch(55% 0.008 260)", marginBottom: "0.5rem" }}>Personal + Peer</p>
                <div style={{ display: "flex", alignItems: "baseline", gap: "0.25rem", marginBottom: "0.25rem" }}>
                  <span style={{ fontFamily: "var(--font-montserrat)", fontWeight: 800, fontSize: "2rem", color: "oklch(97% 0.005 80)" }}>$149</span>
                  <span style={{ fontFamily: "var(--font-montserrat)", fontSize: "0.8rem", color: "oklch(62% 0.006 260)" }}>/yr</span>
                </div>
                <p style={{ fontFamily: "var(--font-montserrat)", fontSize: "0.8rem", color: "oklch(62% 0.006 260)" }}>Per person · included with Team</p>
              </div>
              <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: "0.5rem", flex: 1 }}>
                {["Full library access", "8 personality assessments", "Peer Group access", "Personal journey tracking"].map(f => (
                  <li key={f} style={{ display: "flex", gap: "0.625rem", fontFamily: "var(--font-montserrat)", fontSize: "0.8rem", color: "oklch(72% 0.04 260)", alignItems: "flex-start" }}>
                    <span style={{ color: "oklch(65% 0.15 45)", fontWeight: 700, flexShrink: 0 }}>✓</span>{f}
                  </li>
                ))}
              </ul>
              <div style={{ fontFamily: "var(--font-montserrat)", fontSize: "0.75rem", fontWeight: 700, letterSpacing: "0.06em", textTransform: "uppercase", color: "oklch(55% 0.008 260)", padding: "0.5rem 1rem", border: "1px solid oklch(42% 0.06 260)", textAlign: "center" }}>
                Coming Soon
              </div>
            </div>

            {/* TEAM */}
            <div style={{ background: "oklch(28% 0.11 260)", padding: "2rem", display: "flex", flexDirection: "column", gap: "1rem", position: "relative" }}>
              <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: "3px", background: "oklch(65% 0.15 45)" }} />
              <div>
                <p style={{ fontFamily: "var(--font-montserrat)", fontSize: "0.62rem", fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", color: "oklch(65% 0.15 45)", marginBottom: "0.5rem" }}>Team</p>
                <div style={{ display: "flex", alignItems: "baseline", gap: "0.25rem", marginBottom: "0.25rem" }}>
                  <span style={{ fontFamily: "var(--font-montserrat)", fontWeight: 800, fontSize: "2rem", color: "oklch(97% 0.005 80)" }}>$497</span>
                  <span style={{ fontFamily: "var(--font-montserrat)", fontSize: "0.8rem", color: "oklch(62% 0.006 260)" }}>/yr</span>
                </div>
                <p style={{ fontFamily: "var(--font-montserrat)", fontSize: "0.8rem", color: "oklch(62% 0.006 260)" }}>Leader + up to 8 members · no auto-renewal</p>
              </div>
              <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: "0.5rem", flex: 1 }}>
                {["Everything in Personal + Peer for all 9", "Team journey dashboard", "Team assessments + reflections", "Leader content toolkit", "Member progress tracking"].map(f => (
                  <li key={f} style={{ display: "flex", gap: "0.625rem", fontFamily: "var(--font-montserrat)", fontSize: "0.8rem", color: "oklch(72% 0.04 260)", alignItems: "flex-start" }}>
                    <span style={{ color: "oklch(65% 0.15 45)", fontWeight: 700, flexShrink: 0 }}>✓</span>{f}
                  </li>
                ))}
              </ul>
              <div style={{ fontFamily: "var(--font-montserrat)", fontSize: "0.75rem", fontWeight: 700, letterSpacing: "0.06em", textTransform: "uppercase", color: "oklch(65% 0.15 45)", padding: "0.5rem 1rem", border: "1px solid oklch(65% 0.15 45 / 0.4)", textAlign: "center" }}>
                Coming Soon
              </div>
            </div>

            {/* COACHING */}
            <div style={{ background: "oklch(28% 0.11 260)", padding: "2rem", display: "flex", flexDirection: "column", gap: "1rem" }}>
              <div>
                <p style={{ fontFamily: "var(--font-montserrat)", fontSize: "0.62rem", fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", color: "oklch(55% 0.008 260)", marginBottom: "0.5rem" }}>Coaching</p>
                <div style={{ display: "flex", alignItems: "baseline", gap: "0.25rem", marginBottom: "0.25rem" }}>
                  <span style={{ fontFamily: "var(--font-montserrat)", fontWeight: 800, fontSize: "2rem", color: "oklch(97% 0.005 80)" }}>$297</span>
                  <span style={{ fontFamily: "var(--font-montserrat)", fontSize: "0.8rem", color: "oklch(62% 0.006 260)" }}>/yr</span>
                </div>
                <p style={{ fontFamily: "var(--font-montserrat)", fontSize: "0.8rem", color: "oklch(62% 0.006 260)" }}>Application-based · EN · ID · NL only</p>
              </div>
              <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: "0.5rem", flex: 1 }}>
                {["Personal + Team included", "1-on-1 coaching with Chris", "Personalised development plan", "Cultural context coaching", "Limited spots — approval required"].map(f => (
                  <li key={f} style={{ display: "flex", gap: "0.625rem", fontFamily: "var(--font-montserrat)", fontSize: "0.8rem", color: "oklch(72% 0.04 260)", alignItems: "flex-start" }}>
                    <span style={{ color: "oklch(65% 0.15 45)", fontWeight: 700, flexShrink: 0 }}>✓</span>{f}
                  </li>
                ))}
              </ul>
              <div style={{ fontFamily: "var(--font-montserrat)", fontSize: "0.75rem", fontWeight: 700, letterSpacing: "0.06em", textTransform: "uppercase", color: "oklch(55% 0.008 260)", padding: "0.5rem 1rem", border: "1px solid oklch(42% 0.06 260)", textAlign: "center" }}>
                Coming Soon
              </div>
            </div>
          </div>

          <p style={{ fontFamily: "var(--font-montserrat)", fontSize: "0.75rem", color: "oklch(48% 0.008 260)", marginTop: "1.5rem" }}>
            USD pricing shown · Regional rates available for SE Asia, South Asia &amp; Africa
          </p>
        </div>
      </section>
    </>
  );
}

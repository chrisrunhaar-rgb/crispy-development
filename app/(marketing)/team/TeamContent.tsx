"use client";

import Link from "next/link";
import { useLanguage } from "@/lib/LanguageContext";
import type { GeoInfo } from "@/lib/geo";

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

const teamPricingLabels: Record<string, Record<string, string>> = {
  en: {
    "Team Pricing": "Team Pricing",
    "Launching soon": "Launching soon",
    "plan_description": "One Team plan. Leader + 8 members. All with full Personal access. Annual — that's it.",
    "Team Dashboard": "Team Dashboard",
    "Your Team Name": "Your Team Name",
    "Members": "Members",
    "Content items": "Content items",
    "Personal": "Personal",
    "Per person": "Per person — included in Team",
    "Personal journey": "Personal journey + tracking",
    "Peer free": "🎁 Peer Groups free",
    "See Personal": "See Personal →",
    "Team": "Team",
    "worth": "Leader + 8 members — worth $1,192 separately",
    "Full access": "Full Personal access for all 9",
    "Dashboard": "Full Team Dashboard",
    "Chat": "Team Coach support via Chat",
    "Roadmap": "Tailored roadmap — cross-cultural teams",
    "EN ID": "EN + ID fully supported",
    "Coming soon": "Coming soon",
    "Coaching": "Coaching",
    "Add-on": "Add-on",
    "Requires": "Requires Personal or Team · EN · ID · NL",
    "sessions": "4 personal development sessions",
    "plan": "Personal development plan",
    "Chris": "1-on-1 with Chris",
    "cultural": "Cultural context coaching",
    "Application": "Application-based — limited spots",
    "pricing_note": "USD pricing shown · Regional rates for SE Asia, South Asia & Africa · Annual plans only",
    "browsing": "You're browsing from {region}",
    "regional": "regional pricing will apply when plans launch. Prices will be lower than the USD rates shown.",
  },
  id: {
    "Team Pricing": "Harga Tim",
    "Launching soon": "Akan Segera Diluncurkan",
    "plan_description": "Satu paket Tim. Pemimpin + 8 anggota. Semua dengan akses Pribadi penuh. Tahunan — itu saja.",
    "Team Dashboard": "Dasbor Tim",
    "Your Team Name": "Nama Tim Anda",
    "Members": "Anggota",
    "Content items": "Item konten",
    "Personal": "Pribadi",
    "Per person": "Per orang — termasuk dalam Tim",
    "Personal journey": "Perjalanan pribadi + pelacakan",
    "Peer free": "🎁 Kelompok Sejawat gratis",
    "See Personal": "Lihat Pribadi →",
    "Team": "Tim",
    "worth": "Pemimpin + 8 anggota — senilai $1.192 secara terpisah",
    "Full access": "Akses Pribadi penuh untuk semua 9",
    "Dashboard": "Dasbor Tim Lengkap",
    "Chat": "Dukungan Pelatih Tim via Chat",
    "Roadmap": "Roadmap yang disesuaikan — tim lintas budaya",
    "EN ID": "EN + ID sepenuhnya didukung",
    "Coming soon": "Segera Hadir",
    "Coaching": "Pelatihan",
    "Add-on": "Add-on",
    "Requires": "Memerlukan Pribadi atau Tim · EN · ID · NL",
    "sessions": "4 sesi pengembangan pribadi",
    "plan": "Rencana pengembangan pribadi",
    "Chris": "Satu-satu dengan Chris",
    "cultural": "Pelatihan konteks budaya",
    "Application": "Berbasis aplikasi — tempat terbatas",
    "pricing_note": "Harga USD ditampilkan · Tarif regional untuk Asia Tenggara, Asia Selatan & Afrika · Paket tahunan saja",
    "browsing": "Anda menjelajahi dari {region}",
    "regional": "harga regional akan berlaku saat paket diluncurkan. Harganya akan lebih rendah dari tarif USD yang ditampilkan.",
  },
  nl: {
    "Team Pricing": "Teamprijs",
    "Launching soon": "Binnenkort beschikbaar",
    "plan_description": "Één Teamplan. Leider + 8 leden. Allemaal met volledige Persoonlijke toegang. Jaarlijks — dat is alles.",
    "Team Dashboard": "Teamdashboard",
    "Your Team Name": "Jouw Teamnaam",
    "Members": "Leden",
    "Content items": "Content-items",
    "Personal": "Persoonlijk",
    "Per person": "Per persoon — inbegrepen in Team",
    "Personal journey": "Persoonlijke reis + tracking",
    "Peer free": "🎁 Peergroepen gratis",
    "See Personal": "Zie Persoonlijk →",
    "Team": "Team",
    "worth": "Leider + 8 leden — waard $1.192 afzonderlijk",
    "Full access": "Volledige Persoonlijke toegang voor alle 9",
    "Dashboard": "Volledig Teamdashboard",
    "Chat": "Teamcoach-ondersteuning via Chat",
    "Roadmap": "Op maat gesneden roadmap — cross-culturele teams",
    "EN ID": "EN + ID volledig ondersteund",
    "Coming soon": "Binnenkort beschikbaar",
    "Coaching": "Coaching",
    "Add-on": "Add-on",
    "Requires": "Vereist Persoonlijk of Team · EN · ID · NL",
    "sessions": "4 persoonlijke ontwikkelingssessies",
    "plan": "Persoonlijk ontwikkelingsplan",
    "Chris": "One-on-one met Chris",
    "cultural": "Culturele contextcoaching",
    "Application": "Op aanvraag gebaseerd — beperkte plaatsen",
    "pricing_note": "USD-prijzen weergegeven · Regionale tarieven voor Zuidoost-Azië, Zuid-Azië en Afrika · Alleen jaarplannen",
    "browsing": "Je blader vanuit {region}",
    "regional": "regionale prijsstelling zal van toepassing zijn bij lancering van plannen. Prijzen zullen lager zijn dan de weergegeven USD-tarieven.",
  },
};

export default function TeamContent({ ctaHref = "/signup?pathway=personal", geo }: { ctaHref?: string; geo?: GeoInfo }) {
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
              <p style={{ fontSize: "0.7rem", fontWeight: 600, letterSpacing: "0.15em", textTransform: "uppercase", color: "oklch(65% 0.15 45)", marginBottom: "1.25rem" }}>{lang === "id" ? "Dasbor Tim" : lang === "nl" ? "Teamdashboard" : "Team Dashboard"}</p>
              <h4 style={{ fontSize: "1.0625rem", fontWeight: 700, color: "oklch(97% 0.005 80)", marginBottom: "1.5rem" }}>{lang === "id" ? "Nama Tim Anda" : lang === "nl" ? "Jouw Teamnaam" : "Your Team Name"}</h4>
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
              <span style={{ fontFamily: "var(--font-montserrat)", fontSize: "0.62rem", fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", color: "oklch(65% 0.15 45)" }}>{teamPricingLabels[langKey]["Team Pricing"]}</span>
            </div>
            <h2 className="t-section" style={{ color: "oklch(97% 0.005 80)", marginBottom: "0.75rem" }}>{teamPricingLabels[langKey]["Launching soon"]}</h2>
            <p style={{ fontFamily: "var(--font-montserrat)", fontSize: "0.9rem", color: "oklch(72% 0.04 260)", maxWidth: "52ch" }}>
              {teamPricingLabels[langKey]["plan_description"]}
            </p>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: "1px", background: "oklch(38% 0.06 260)" }}>

            {/* PERSONAL (for reference) */}
            <div style={{ background: "oklch(28% 0.11 260)", padding: "2rem", display: "flex", flexDirection: "column", gap: "1rem" }}>
              <div>
                <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "0.5rem", flexWrap: "wrap" }}>
                  <p style={{ fontFamily: "var(--font-montserrat)", fontSize: "0.62rem", fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", color: "oklch(55% 0.008 260)", margin: 0 }}>{teamPricingLabels[langKey]["Personal"]}</p>
                  <span style={{ fontFamily: "var(--font-montserrat)", fontSize: "0.55rem", fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", color: "oklch(65% 0.15 45)", background: "oklch(65% 0.15 45 / 0.12)", border: "1px solid oklch(65% 0.15 45 / 0.3)", padding: "0.1rem 0.4rem" }}>{lang === "id" ? "+ Sejawat Gratis" : lang === "nl" ? "+ Peer Gratis" : "+ Peer Free"}</span>
                </div>
                <div style={{ display: "flex", alignItems: "baseline", gap: "0.25rem", marginBottom: "0.25rem" }}>
                  <span style={{ fontFamily: "var(--font-montserrat)", fontWeight: 800, fontSize: "2rem", color: "oklch(97% 0.005 80)" }}>$149</span>
                  <span style={{ fontFamily: "var(--font-montserrat)", fontSize: "0.8rem", color: "oklch(62% 0.006 260)" }}>/yr</span>
                </div>
                <p style={{ fontFamily: "var(--font-montserrat)", fontSize: "0.8rem", color: "oklch(62% 0.006 260)" }}>{teamPricingLabels[langKey]["Per person"]}</p>
              </div>
              <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: "0.5rem", flex: 1 }}>
                <li style={{ display: "flex", gap: "0.625rem", fontFamily: "var(--font-montserrat)", fontSize: "0.8rem", color: "oklch(72% 0.04 260)", alignItems: "flex-start" }}>
                  <span style={{ color: "oklch(65% 0.15 45)", fontWeight: 700, flexShrink: 0 }}>✓</span>
                  {lang === "id" ? "30+ sumber daya — " : lang === "nl" ? "30+ materialen — " : "30+ resources — "}<Link href="/resources" style={{ color: "oklch(65% 0.15 45)", textDecoration: "none", fontWeight: 700 }}>{lang === "id" ? "jelajahi semua →" : lang === "nl" ? "bekijk alles →" : "browse all →"}</Link>
                </li>
                <li style={{ display: "flex", gap: "0.625rem", fontFamily: "var(--font-montserrat)", fontSize: "0.8rem", color: "oklch(72% 0.04 260)", alignItems: "flex-start" }}>
                  <span style={{ color: "oklch(65% 0.15 45)", fontWeight: 700, flexShrink: 0 }}>✓</span>
                  {lang === "id" ? "8 penilaian — " : lang === "nl" ? "8 beoordelingen — " : "8 assessments — "}<Link href="/resources" style={{ color: "oklch(65% 0.15 45)", textDecoration: "none", fontWeight: 700 }}>{lang === "id" ? "lihat semua →" : lang === "nl" ? "zie alles →" : "see all →"}</Link>
                </li>
                {(lang === "id" ? [
                  "Perjalanan pribadi + pelacakan",
                  "🎁 Kelompok Sejawat gratis"
                ] : lang === "nl" ? [
                  "Persoonlijke reis + tracking",
                  "🎁 Peergroepen gratis"
                ] : [
                  "Personal journey + tracking",
                  "🎁 Peer Groups free"
                ]).map(f => (
                  <li key={f} style={{ display: "flex", gap: "0.625rem", fontFamily: "var(--font-montserrat)", fontSize: "0.8rem", color: "oklch(72% 0.04 260)", alignItems: "flex-start" }}>
                    <span style={{ color: "oklch(65% 0.15 45)", fontWeight: 700, flexShrink: 0 }}>✓</span>{f}
                  </li>
                ))}
              </ul>
              <Link href="/personal" style={{ fontFamily: "var(--font-montserrat)", fontSize: "0.75rem", fontWeight: 700, letterSpacing: "0.06em", color: "oklch(72% 0.04 260)", textDecoration: "none", border: "1px solid oklch(42% 0.06 260)", padding: "0.5rem 1rem", textAlign: "center" }}>
                {lang === "id" ? "Lihat Pribadi →" : lang === "nl" ? "Zie Persoonlijk →" : "See Personal →"}
              </Link>
            </div>

            {/* TEAM */}
            <div style={{ background: "oklch(28% 0.11 260)", padding: "2rem", display: "flex", flexDirection: "column", gap: "1rem", position: "relative" }}>
              <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: "3px", background: "oklch(65% 0.15 45)" }} />
              <div>
                <p style={{ fontFamily: "var(--font-montserrat)", fontSize: "0.62rem", fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", color: "oklch(65% 0.15 45)", marginBottom: "0.5rem" }}>{teamPricingLabels[langKey]["Team"]}</p>
                <div style={{ display: "flex", alignItems: "baseline", gap: "0.25rem", marginBottom: "0.25rem" }}>
                  <span style={{ fontFamily: "var(--font-montserrat)", fontWeight: 800, fontSize: "2rem", color: "oklch(97% 0.005 80)" }}>$497</span>
                  <span style={{ fontFamily: "var(--font-montserrat)", fontSize: "0.8rem", color: "oklch(62% 0.006 260)" }}>/yr</span>
                </div>
                <p style={{ fontFamily: "var(--font-montserrat)", fontSize: "0.8rem", color: "oklch(62% 0.006 260)" }}>{teamPricingLabels[langKey]["worth"]}</p>
              </div>
              <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: "0.5rem", flex: 1 }}>
                {(lang === "id" ? [
                  "Akses Pribadi penuh untuk semua 9",
                  "Dasbor Tim Lengkap",
                  "Dukungan Pelatih Tim via Chat",
                  "Roadmap yang disesuaikan — tim lintas budaya",
                  "EN + ID sepenuhnya didukung"
                ] : lang === "nl" ? [
                  "Volledige Persoonlijke toegang voor alle 9",
                  "Volledig Teamdashboard",
                  "Teamcoach-ondersteuning via Chat",
                  "Op maat gesneden roadmap — cross-culturele teams",
                  "EN + ID volledig ondersteund"
                ] : [
                  "Full Personal access for all 9",
                  "Full Team Dashboard",
                  "Team Coach support via Chat",
                  "Tailored roadmap — cross-cultural teams",
                  "EN + ID fully supported"
                ]).map(f => (
                  <li key={f} style={{ display: "flex", gap: "0.625rem", fontFamily: "var(--font-montserrat)", fontSize: "0.8rem", color: "oklch(72% 0.04 260)", alignItems: "flex-start" }}>
                    <span style={{ color: "oklch(65% 0.15 45)", fontWeight: 700, flexShrink: 0 }}>✓</span>{f}
                  </li>
                ))}
                <li style={{ display: "flex", gap: "0.625rem", fontFamily: "var(--font-montserrat)", fontSize: "0.8rem", color: "oklch(58% 0.006 260)", alignItems: "flex-start", fontStyle: "italic" }}>
                  <span style={{ color: "oklch(52% 0.008 260)", fontWeight: 700, flexShrink: 0 }}>+</span>{lang === "id" ? "NL, FR, ZH segera hadir" : lang === "nl" ? "NL, FR, ZH binnenkort beschikbaar" : "NL, FR, ZH coming soon"}
                </li>
              </ul>
              <div style={{ fontFamily: "var(--font-montserrat)", fontSize: "0.75rem", fontWeight: 700, letterSpacing: "0.06em", textTransform: "uppercase", color: "oklch(65% 0.15 45)", padding: "0.5rem 1rem", border: "1px solid oklch(65% 0.15 45 / 0.4)", textAlign: "center" }}>
                {teamPricingLabels[langKey]["Coming soon"]}
              </div>
            </div>

            {/* COACHING ADD-ON */}
            <div style={{ background: "oklch(28% 0.11 260)", padding: "2rem", display: "flex", flexDirection: "column", gap: "1rem" }}>
              <div>
                <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "0.5rem" }}>
                  <p style={{ fontFamily: "var(--font-montserrat)", fontSize: "0.62rem", fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", color: "oklch(55% 0.008 260)", margin: 0 }}>{lang === "id" ? "Pelatihan" : lang === "nl" ? "Coaching" : "Coaching"}</p>
                  <span style={{ fontFamily: "var(--font-montserrat)", fontSize: "0.55rem", fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", color: "oklch(68% 0.008 260)", background: "oklch(36% 0.06 260)", border: "1px solid oklch(45% 0.06 260)", padding: "0.1rem 0.4rem" }}>{lang === "id" ? "Tambahan" : lang === "nl" ? "Add-on" : "Add-on"}</span>
                </div>
                <div style={{ display: "flex", alignItems: "baseline", gap: "0.25rem", marginBottom: "0.25rem" }}>
                  <span style={{ fontFamily: "var(--font-montserrat)", fontWeight: 800, fontSize: "2rem", color: "oklch(97% 0.005 80)" }}>$297</span>
                  <span style={{ fontFamily: "var(--font-montserrat)", fontSize: "0.8rem", color: "oklch(62% 0.006 260)" }}>/yr</span>
                </div>
                <p style={{ fontFamily: "var(--font-montserrat)", fontSize: "0.8rem", color: "oklch(62% 0.006 260)" }}>{teamPricingLabels[langKey]["Requires"]}</p>
              </div>
              <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: "0.5rem", flex: 1 }}>
                {(lang === "id" ? [
                  "4 sesi pengembangan pribadi",
                  "Rencana pengembangan pribadi",
                  "Satu-satu dengan Chris",
                  "Pelatihan konteks budaya",
                  "Berbasis aplikasi — tempat terbatas"
                ] : lang === "nl" ? [
                  "4 persoonlijke ontwikkelingssessies",
                  "Persoonlijk ontwikkelingsplan",
                  "One-on-one met Chris",
                  "Culturele contextcoaching",
                  "Op aanvraag gebaseerd — beperkte plaatsen"
                ] : [
                  "4 personal development sessions",
                  "Personal development plan",
                  "1-on-1 with Chris",
                  "Cultural context coaching",
                  "Application-based — limited spots"
                ]).map(f => (
                  <li key={f} style={{ display: "flex", gap: "0.625rem", fontFamily: "var(--font-montserrat)", fontSize: "0.8rem", color: "oklch(72% 0.04 260)", alignItems: "flex-start" }}>
                    <span style={{ color: "oklch(65% 0.15 45)", fontWeight: 700, flexShrink: 0 }}>✓</span>{f}
                  </li>
                ))}
              </ul>
              <div style={{ fontFamily: "var(--font-montserrat)", fontSize: "0.75rem", fontWeight: 700, letterSpacing: "0.06em", textTransform: "uppercase", color: "oklch(55% 0.008 260)", padding: "0.5rem 1rem", border: "1px solid oklch(42% 0.06 260)", textAlign: "center" }}>
                {lang === "id" ? "Segera Hadir" : lang === "nl" ? "Binnenkort beschikbaar" : "Coming Soon"}
              </div>
            </div>

          </div>

          <p style={{ fontFamily: "var(--font-montserrat)", fontSize: "0.75rem", color: "oklch(48% 0.008 260)", marginTop: "1.5rem" }}>
            {lang === "id" ? "Harga USD ditampilkan · Tarif regional untuk Asia Tenggara, Asia Selatan & Afrika · Paket tahunan saja" : lang === "nl" ? "USD-prijzen weergegeven · Regionale tarieven voor Zuidoost-Azië, Zuid-Azië en Afrika · Alleen jaarplannen" : "USD pricing shown · Regional rates for SE Asia, South Asia & Africa · Annual plans only"}
          </p>
          {geo?.hasRegionalPricing && (
            <div style={{ display: "flex", alignItems: "center", gap: "0.625rem", marginTop: "1.75rem", background: "oklch(65% 0.15 45 / 0.12)", border: "1px solid oklch(65% 0.15 45 / 0.3)", padding: "0.625rem 1rem" }}>
              <span style={{ fontSize: "0.85rem" }}>📍</span>
              <p style={{ fontFamily: "var(--font-montserrat)", fontSize: "0.775rem", color: "oklch(82% 0.04 45)", lineHeight: 1.5, margin: 0 }}>
                <strong>{lang === "id" ? `Anda menjelajahi dari ${geo.regionLabel}` : lang === "nl" ? `Je blader vanuit ${geo.regionLabel}` : `You're browsing from ${geo.regionLabel}`}</strong> — {lang === "id" ? "harga regional akan berlaku saat paket diluncurkan. Harganya akan lebih rendah dari tarif USD yang ditampilkan." : lang === "nl" ? "regionale prijsstelling zal van toepassing zijn bij lancering van plannen. Prijzen zullen lager zijn dan de weergegeven USD-tarieven." : "regional pricing will apply when plans launch. Prices will be lower than the USD rates shown."}
              </p>
            </div>
          )}
        </div>
      </section>
    </>
  );
}

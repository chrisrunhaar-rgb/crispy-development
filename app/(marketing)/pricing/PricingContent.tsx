"use client";

import { useState } from "react";
import Link from "next/link";
import { useLanguage } from "@/lib/LanguageContext";

interface Props {
  isIndonesia: boolean;
}

// ── Checkout button — Stripe-ready stub ──────────────────────────────────────
function CheckoutButton({
  plan,
  isIndonesia,
  variant,
}: {
  plan: "personal" | "team";
  isIndonesia: boolean;
  variant: "orange" | "navy";
}) {
  const { lang } = useLanguage();
  const [status, setStatus] = useState<"idle" | "loading" | "unavailable">("idle");
  const [hovered, setHovered] = useState(false);

  async function go() {
    setStatus("loading");
    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ plan, currency: isIndonesia ? "idr" : "usd" }),
      });
      const data = await res.json();
      if (data.checkoutUrl) {
        window.location.href = data.checkoutUrl;
      } else {
        setStatus("unavailable");
      }
    } catch {
      setStatus("unavailable");
    }
  }

  const labels = {
    en: {
      personal: "Get started →",
      team: "Set up your team →",
      loading: "Loading…",
      unavailable: "Payment setup in progress — contact us to arrange access.",
      contact: "get in touch",
    },
    id: {
      personal: "Mulai sekarang →",
      team: "Bangun tim Anda →",
      loading: "Memuat…",
      unavailable: "Pembayaran sedang disiapkan — hubungi kami untuk mengatur akses.",
      contact: "hubungi kami",
    },
  };
  const l = labels[lang === "id" ? "id" : "en"];

  const active = hovered && status !== "loading";
  const btnStyle: React.CSSProperties = {
    background: variant === "orange"
      ? active ? "oklch(60% 0.14 45)" : "oklch(65% 0.15 45)"
      : active ? "oklch(18% 0.10 260)" : "oklch(22% 0.10 260)",
    color: "oklch(97% 0.005 80)",
  };

  return (
    <div>
      <button
        onClick={go}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        disabled={status === "loading"}
        style={{
          ...btnStyle,
          fontFamily: "var(--font-montserrat)",
          fontWeight: 700,
          fontSize: "0.875rem",
          letterSpacing: "0.04em",
          padding: "0.9rem 2.25rem",
          borderRadius: 999,
          border: "none",
          cursor: status === "loading" ? "default" : "pointer",
          opacity: status === "loading" ? 0.65 : 1,
          transition: "background-color 0.15s ease, opacity 0.2s ease",
          display: "inline-block",
        }}
      >
        {status === "loading" ? l.loading : plan === "personal" ? l.personal : l.team}
      </button>

      {status === "unavailable" && (
        <p
          style={{
            fontFamily: "var(--font-montserrat)",
            fontSize: "0.78rem",
            lineHeight: 1.6,
            color: variant === "orange" ? "oklch(72% 0.04 260)" : "oklch(45% 0.008 260)",
            marginTop: "1rem",
            maxWidth: "32ch",
          }}
        >
          {l.unavailable}{" "}
          <a
            href="mailto:hello@crispyleaders.com"
            style={{
              color: "inherit",
              textDecoration: "underline",
              fontWeight: 700,
            }}
          >
            {l.contact}
          </a>
          .
        </p>
      )}
    </div>
  );
}

// ── FAQ accordion ────────────────────────────────────────────────────────────
function FAQItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div style={{ paddingBlock: "1.375rem", borderTop: "1px solid oklch(88% 0.008 80)" }}>
      <button
        onClick={() => setOpen(!open)}
        aria-expanded={open}
        style={{
          width: "100%",
          background: "none",
          border: "none",
          cursor: "pointer",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-start",
          gap: "1.5rem",
          padding: 0,
          textAlign: "left",
        }}
      >
        <span
          style={{
            fontFamily: "var(--font-montserrat)",
            fontWeight: 700,
            fontSize: "0.9375rem",
            color: "oklch(22% 0.005 260)",
            lineHeight: 1.4,
          }}
        >
          {q}
        </span>
        <span
          aria-hidden
          style={{
            fontFamily: "var(--font-montserrat)",
            fontWeight: 300,
            fontSize: "1.5rem",
            color: "oklch(65% 0.15 45)",
            flexShrink: 0,
            lineHeight: 1,
            marginTop: "0.1em",
            display: "inline-block",
            transform: open ? "rotate(45deg)" : "rotate(0deg)",
            transition: "transform 0.2s ease-out",
          }}
        >
          +
        </span>
      </button>
      {open && (
        <p
          className="pricing-faq-answer"
          style={{
            fontFamily: "var(--font-montserrat)",
            fontSize: "0.875rem",
            lineHeight: 1.75,
            color: "oklch(42% 0.008 260)",
            marginTop: "1rem",
            maxWidth: "58ch",
          }}
        >
          {a}
        </p>
      )}
    </div>
  );
}

// ── Feature list item ────────────────────────────────────────────────────────
function Feature({ text, light }: { text: string; light?: boolean }) {
  return (
    <li
      style={{
        display: "flex",
        gap: "0.875rem",
        alignItems: "flex-start",
        fontFamily: "var(--font-montserrat)",
        fontSize: "0.875rem",
        lineHeight: 1.55,
        color: light ? "oklch(82% 0.025 260)" : "oklch(38% 0.008 260)",
      }}
    >
      <span
        style={{
          color: "oklch(65% 0.15 45)",
          fontWeight: 800,
          flexShrink: 0,
          fontSize: "0.75rem",
          marginTop: "0.2em",
          letterSpacing: "-0.02em",
        }}
      >
        →
      </span>
      {text}
    </li>
  );
}

// ── Main component ───────────────────────────────────────────────────────────
export default function PricingContent({ isIndonesia }: Props) {
  const { lang } = useLanguage();
  const id = lang === "id";

  // ── Copy ────────────────────────────────────────────────────────────────
  const copy = {
    eyebrow: id ? "Akses · Harga" : "Access · Pricing",
    h1: id ? "Satu pembayaran.\nAkses seumur hidup." : "One payment.\nLifetime access.",
    tagline: id
      ? "Sumber daya, jalur, dan coaching AI untuk pemimpin lintas budaya. Tidak ada langganan. Tidak ada perpanjangan. Siapa pun bisa bergabung."
      : "Resources, pathways, and AI coaching for cross-cultural leaders. No subscription. No renewal. Open to all.",

    personalLabel: id ? "Jalur Pribadi" : "Personal Pathway",
    personalPrice: isIndonesia ? "RP 399.000" : "$49",
    personalPeriod: id
      ? "pembayaran sekali · akses seumur hidup"
      : "one-time · lifetime access",
    personalFeatures: id
      ? [
          "Seluruh perpustakaan konten (53+ sumber daya)",
          "Dasbor pribadi + pelacakan kemajuan",
          "Semua penilaian tersimpan ke profil Anda",
          "60 menit WayPoint AI coaching gratis",
          "Konten baru saat diluncurkan",
        ]
      : [
          "Full content library (53+ resources)",
          "Personal dashboard + progress tracking",
          "All assessments saved to your profile",
          "60 min WayPoint AI coaching included",
          "New content as it launches",
        ],

    teamLabel: id ? "Jalur Tim · 8 Kursi" : "Team Pathway · 8 Seats",
    teamPrice: isIndonesia ? "RP 1.499.000" : "$199",
    teamPeriod: id
      ? "pembayaran sekali · 8 kursi anggota · seumur hidup"
      : "one-time · 8 member seats · lifetime",
    teamValue: isIndonesia
      ? "RP 187k per anggota · hemat 53% dari harga individual"
      : "$24.88 per member · 49% off individual plans",
    teamFeatures: id
      ? [
          "Perjalanan tim yang unik — progres bersama, dipandu pemimpin",
          "8 penilaian kepemimpinan pribadi — satu per anggota",
          "Seluruh perpustakaan konten untuk semua 8 anggota",
          "60 menit WayPoint AI coaching per anggota (8 jam total)",
          "Dasbor tim + kontrol konten pemimpin",
          "Alat kepemimpinan lintas budaya khusus pemimpin tim",
        ]
      : [
          "Unique team journey — shared, leader-paced progression",
          "8 personal leadership assessments — one per member",
          "Full content library for all 8 members",
          "60 min AI coaching per member (8 hours total)",
          "Team dashboard + leader content controls",
          "Cross-cultural leader tools and guides",
        ],
    teamNote: id
      ? `Pemimpin memerlukan Jalur Pribadi${isIndonesia ? " (RP 399.000)" : " ($49)"} — dibeli terpisah. Kursi melekat pada pembelian.`
      : `Leader requires a Personal plan${isIndonesia ? " (RP 399.000)" : " ($49)"} — purchased separately. Seats remain with the purchase.`,

    freeBanner: id
      ? "Hanya menjelajah? Mulai dengan sumber daya gratis kami — tidak perlu pembelian."
      : "Just exploring? Start with our free resources — no purchase required.",
    freeCta: id ? "Lihat sumber daya gratis →" : "Browse free resources →",

    coachingEyebrow: "WayPoint AI Coaching",
    coachingH2: id ? "60 menit disertakan.\nLebih banyak saat Anda butuh." : "60 minutes included.\nMore when you need it.",
    coachingSub: id
      ? "WayPoint adalah coach AI berbasis suara yang dirancang khusus untuk pemimpin lintas budaya. Tersedia dalam sesi 10 menit, kapan saja."
      : "WayPoint is a voice-based AI coach built for cross-cultural leaders. Available in 10-minute sessions, any time.",
    coachingAddons: id ? "Butuh lebih banyak? Tambahkan jam ekstra:" : "Need more time? Add extra hours:",
    coachingNote: id
      ? "Jam coaching tersedia setelah pembelian. Tidak ada kadaluwarsa."
      : "Coaching hours unlock after purchase. Hours never expire.",

    faqLabel: id ? "Pertanyaan Umum" : "Common Questions",
    faqH2: id ? "Yang perlu Anda tahu." : "What you need to know.",
    faqs: id
      ? [
          {
            q: "Apakah ini berlangganan?",
            a: "Tidak. Satu pembayaran, akses seumur hidup. Tidak ada perpanjangan, tidak ada biaya berulang.",
          },
          {
            q: "Bisakah saya upgrade dari Personal ke Team?",
            a: "Ya — hubungi kami dan kami akan mengatur selisih harganya.",
          },
          {
            q: "Apa yang termasuk dalam coaching AI?",
            a: "Setiap paket berbayar menyertakan 60 menit WayPoint AI coaching — coach AI berbasis suara yang dilatih untuk pemimpin lintas budaya. Jam tambahan tersedia sebagai add-on setelah pembelian.",
          },
          {
            q: "Apakah kursi tim bisa dialihkan?",
            a: "Tidak. Kursi tim tidak dapat dialihkan ke anggota lain. Jika anggota tim pergi, pembelian tim baru diperlukan untuk menambah anggota pengganti.",
          },
        ]
      : [
          {
            q: "Is this a subscription?",
            a: "No. One payment, lifetime access. No renewals, no recurring charges.",
          },
          {
            q: "Can I upgrade from Personal to Team?",
            a: "Yes — contact us and we'll arrange the price difference.",
          },
          {
            q: "What's included in the AI coaching?",
            a: "Every paid plan includes 60 minutes of WayPoint AI coaching — a voice-based AI coach trained for cross-cultural leaders. Additional hours are available as add-ons after purchase.",
          },
          {
            q: "Are team seats transferable?",
            a: "No. Team seats are non-transferable. If a team member leaves, a new team purchase is needed to add a replacement.",
          },
        ],
  };

  const packages = [
    {
      label: id ? "1 jam" : "1 hour",
      usd: "$10",
      idr: "RP 150.000",
      per: id ? "per jam" : "per hour",
    },
    {
      label: id ? "5 jam" : "5 hours",
      usd: "$39",
      idr: "RP 599.000",
      per: id ? "→ $7.80/jam" : "→ $7.80/hr",
    },
    {
      label: id ? "10 jam" : "10 hours",
      usd: "$69",
      idr: "RP 1.099.000",
      per: id ? "→ $6.90/jam" : "→ $6.90/hr",
      bestValue: true,
    },
  ];

  return (
    <>
      {/* eslint-disable-next-line react/no-danger */}
      <style dangerouslySetInnerHTML={{ __html: `
        .pricing-free-link:hover { text-decoration: underline; }
        .pricing-contact-link:hover { text-decoration: underline; }
        @keyframes pricingFadeDown {
          from { opacity: 0; transform: translateY(-5px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .pricing-faq-answer { animation: pricingFadeDown 0.18s ease-out; }
      `}} />
      {/* ── HERO ──────────────────────────────────────────────────────────── */}
      <section
        style={{
          background: "oklch(22% 0.10 260)",
          paddingTop: "clamp(5rem, 9vw, 9rem)",
          paddingBottom: "clamp(4rem, 7vw, 7rem)",
          position: "relative",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            height: "3px",
            background: "oklch(65% 0.15 45)",
          }}
        />
        <div className="container-wide" style={{ position: "relative" }}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "0.875rem",
              marginBottom: "1.5rem",
            }}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/logo-icon-dark-badge.png"
              alt="Crispy Development"
              width={24}
              height={24}
              style={{ flexShrink: 0 }}
            />
            <p
              style={{
                fontFamily: "var(--font-montserrat)",
                fontSize: "0.7rem",
                fontWeight: 700,
                letterSpacing: "0.2em",
                textTransform: "uppercase",
                color: "oklch(65% 0.15 45)",
                margin: 0,
              }}
            >
              {copy.eyebrow}
            </p>
          </div>
          <div
            style={{ width: "48px", height: "2px", background: "oklch(65% 0.15 45)", marginBottom: "1.75rem" }}
          />
          <h1
            style={{
              fontFamily: "var(--font-cormorant)",
              fontStyle: "italic",
              fontWeight: 600,
              fontSize: "clamp(3.2rem, 7vw, 7rem)",
              lineHeight: 1.0,
              color: "oklch(97% 0.005 80)",
              margin: "0 0 1.75rem",
              maxWidth: "14ch",
              whiteSpace: "pre-line",
            }}
          >
            {copy.h1}
          </h1>
          <p
            style={{
              fontFamily: "var(--font-montserrat)",
              fontSize: "0.9375rem",
              lineHeight: 1.75,
              color: "oklch(68% 0.035 260)",
              maxWidth: "50ch",
              margin: 0,
            }}
          >
            {copy.tagline}
          </p>
        </div>
      </section>

      {/* ── TWO-PANEL PRICING ─────────────────────────────────────────────── */}
      <div style={{ display: "flex", flexWrap: "wrap" }}>
        {/* ── Personal ── navy panel */}
        <div
          style={{
            flex: "1 1 340px",
            background: "oklch(27% 0.11 260)",
            padding: "clamp(2.5rem, 5vw, 4.5rem) clamp(1.75rem, 5vw, 4rem)",
            display: "flex",
            flexDirection: "column",
          }}
        >
          <p
            style={{
              fontFamily: "var(--font-montserrat)",
              fontSize: "0.68rem",
              fontWeight: 700,
              letterSpacing: "0.22em",
              textTransform: "uppercase",
              color: "oklch(65% 0.15 45)",
              margin: "0 0 2.5rem",
            }}
          >
            {copy.personalLabel}
          </p>

          <div style={{ marginBottom: "0.375rem" }}>
            <span
              style={{
                fontFamily: "var(--font-cormorant)",
                fontStyle: "italic",
                fontWeight: 300,
                fontSize: "clamp(4.5rem, 9vw, 8rem)",
                lineHeight: 0.9,
                color: "oklch(97% 0.005 80)",
                display: "block",
              }}
            >
              {copy.personalPrice}
            </span>
          </div>
          <p
            style={{
              fontFamily: "var(--font-montserrat)",
              fontSize: "0.68rem",
              fontWeight: 600,
              letterSpacing: "0.12em",
              textTransform: "uppercase",
              color: "oklch(52% 0.04 260)",
              margin: "0.875rem 0 2.5rem",
            }}
          >
            {copy.personalPeriod}
          </p>

          <ul
            style={{
              listStyle: "none",
              padding: 0,
              margin: "0 0 2.5rem",
              display: "flex",
              flexDirection: "column",
              gap: "1rem",
              flexGrow: 1,
            }}
          >
            {copy.personalFeatures.map((f) => (
              <Feature key={f} text={f} light />
            ))}
          </ul>

          <CheckoutButton plan="personal" isIndonesia={isIndonesia} variant="orange" />
        </div>

        {/* ── Team ── cream panel */}
        <div
          style={{
            flex: "1 1 340px",
            background: "oklch(96% 0.006 80)",
            padding: "clamp(2.5rem, 5vw, 4.5rem) clamp(1.75rem, 5vw, 4rem)",
            display: "flex",
            flexDirection: "column",
          }}
        >
          <p
            style={{
              fontFamily: "var(--font-montserrat)",
              fontSize: "0.68rem",
              fontWeight: 700,
              letterSpacing: "0.22em",
              textTransform: "uppercase",
              color: "oklch(65% 0.15 45)",
              margin: "0 0 1.25rem",
            }}
          >
            {copy.teamLabel}
          </p>

          <p
            style={{
              fontFamily: "var(--font-montserrat)",
              fontSize: "0.72rem",
              lineHeight: 1.55,
              color: "oklch(48% 0.008 260)",
              fontStyle: "italic",
              margin: "0 0 1.75rem",
            }}
          >
            {copy.teamNote}
          </p>

          <div style={{ marginBottom: "0.375rem" }}>
            <span
              style={{
                fontFamily: "var(--font-cormorant)",
                fontStyle: "italic",
                fontWeight: 300,
                fontSize: "clamp(4.5rem, 9vw, 8rem)",
                lineHeight: 0.9,
                color: "oklch(22% 0.10 260)",
                display: "block",
              }}
            >
              {copy.teamPrice}
            </span>
          </div>
          <p
            style={{
              fontFamily: "var(--font-montserrat)",
              fontSize: "0.68rem",
              fontWeight: 600,
              letterSpacing: "0.12em",
              textTransform: "uppercase",
              color: "oklch(55% 0.008 260)",
              margin: "0.875rem 0 0.875rem",
            }}
          >
            {copy.teamPeriod}
          </p>

          <p
            style={{
              fontFamily: "var(--font-montserrat)",
              fontSize: "0.72rem",
              fontWeight: 700,
              color: "oklch(65% 0.15 45)",
              margin: "0 0 2.5rem",
            }}
          >
            {copy.teamValue}
          </p>

          <ul
            style={{
              listStyle: "none",
              padding: 0,
              margin: "0 0 2.5rem",
              display: "flex",
              flexDirection: "column",
              gap: "1rem",
              flexGrow: 1,
            }}
          >
            {copy.teamFeatures.map((f) => (
              <Feature key={f} text={f} />
            ))}
          </ul>

          <CheckoutButton plan="team" isIndonesia={isIndonesia} variant="navy" />
        </div>
      </div>

      {/* ── FREE RESOURCES STRIP ──────────────────────────────────────────── */}
      <div
        style={{
          background: "oklch(94% 0.012 55)",
          padding: "1.25rem clamp(1.75rem, 5vw, 4rem)",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          flexWrap: "wrap",
          gap: "0.75rem 2rem",
        }}
      >
        <p
          style={{
            fontFamily: "var(--font-montserrat)",
            fontSize: "0.875rem",
            color: "oklch(35% 0.08 50)",
            margin: 0,
          }}
        >
          {copy.freeBanner}
        </p>
        <Link
          href="/resources"
          className="pricing-free-link"
          style={{
            fontFamily: "var(--font-montserrat)",
            fontWeight: 700,
            fontSize: "0.8rem",
            letterSpacing: "0.04em",
            color: "oklch(42% 0.12 45)",
            textDecoration: "none",
            whiteSpace: "nowrap",
          }}
        >
          {copy.freeCta}
        </Link>
      </div>

      {/* ── AI COACHING SECTION ───────────────────────────────────────────── */}
      <section
        style={{
          background: "oklch(22% 0.10 260)",
          paddingBlock: "clamp(4rem, 7vw, 6.5rem)",
        }}
      >
        <div className="container-wide">
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
              gap: "clamp(3rem, 6vw, 5rem)",
              alignItems: "start",
            }}
          >
            {/* Left — coaching intro */}
            <div>
              <p
                style={{
                  fontFamily: "var(--font-montserrat)",
                  fontSize: "0.68rem",
                  fontWeight: 700,
                  letterSpacing: "0.22em",
                  textTransform: "uppercase",
                  color: "oklch(65% 0.15 45)",
                  margin: "0 0 1.5rem",
                }}
              >
                {copy.coachingEyebrow}
              </p>
              <h2
                style={{
                  fontFamily: "var(--font-cormorant)",
                  fontStyle: "italic",
                  fontWeight: 600,
                  fontSize: "clamp(2.2rem, 4.5vw, 4rem)",
                  lineHeight: 1.08,
                  color: "oklch(97% 0.005 80)",
                  margin: "0 0 1.5rem",
                  maxWidth: "18ch",
                  whiteSpace: "pre-line",
                }}
              >
                {copy.coachingH2}
              </h2>
              <p
                style={{
                  fontFamily: "var(--font-montserrat)",
                  fontSize: "0.9rem",
                  lineHeight: 1.75,
                  color: "oklch(68% 0.035 260)",
                  maxWidth: "44ch",
                  margin: 0,
                }}
              >
                {copy.coachingSub}
              </p>
            </div>

            {/* Right — add-on packages */}
            <div>
              <p
                style={{
                  fontFamily: "var(--font-montserrat)",
                  fontSize: "0.68rem",
                  fontWeight: 700,
                  letterSpacing: "0.18em",
                  textTransform: "uppercase",
                  color: "oklch(48% 0.03 260)",
                  margin: "0 0 1.5rem",
                }}
              >
                {copy.coachingAddons}
              </p>

              {packages.map((pkg) => (
                <div
                  key={pkg.label}
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    paddingBlock: "1.125rem",
                    paddingInline: "0",
                    borderTop: "1px solid oklch(97% 0.005 80 / 0.08)",
                  }}
                >
                  <div>
                    <span
                      style={{
                        fontFamily: "var(--font-montserrat)",
                        fontWeight: 700,
                        fontSize: "1rem",
                        color: "oklch(88% 0.008 80)",
                        display: "flex",
                        alignItems: "center",
                        gap: "0.625rem",
                      }}
                    >
                      {pkg.label}
                      {"bestValue" in pkg && pkg.bestValue && (
                        <span
                          style={{
                            fontFamily: "var(--font-montserrat)",
                            fontSize: "0.58rem",
                            fontWeight: 700,
                            letterSpacing: "0.12em",
                            textTransform: "uppercase",
                            color: "oklch(65% 0.15 45)",
                            padding: "0.15em 0.5em",
                            border: "1px solid oklch(65% 0.15 45 / 0.5)",
                          }}
                        >
                          {id ? "Terbaik" : "Best value"}
                        </span>
                      )}
                    </span>
                    <span
                      style={{
                        fontFamily: "var(--font-montserrat)",
                        fontSize: "0.72rem",
                        color: "oklch(48% 0.03 260)",
                      }}
                    >
                      {pkg.per}
                    </span>
                  </div>
                  <span
                    style={{
                      fontFamily: "var(--font-cormorant)",
                      fontStyle: "italic",
                      fontWeight: 500,
                      fontSize: "2rem",
                      color: "oklch(97% 0.005 80)",
                      lineHeight: 1,
                    }}
                  >
                    {isIndonesia ? pkg.idr : pkg.usd}
                  </span>
                </div>
              ))}

              <div style={{ borderTop: "1px solid oklch(97% 0.005 80 / 0.08)" }} />
              <p
                style={{
                  fontFamily: "var(--font-montserrat)",
                  fontSize: "0.75rem",
                  color: "oklch(45% 0.025 260)",
                  margin: "1.25rem 0 0",
                  fontStyle: "italic",
                }}
              >
                {copy.coachingNote}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ── FAQ ──────────────────────────────────────────────────────────── */}
      <section
        style={{
          background: "oklch(97% 0.005 80)",
          paddingBlock: "clamp(4rem, 7vw, 6.5rem)",
        }}
      >
        <div className="container-wide" style={{ maxWidth: "680px" }}>
          <p
            className="t-label"
            style={{ color: "oklch(65% 0.15 45)", marginBottom: "1rem" }}
          >
            {copy.faqLabel}
          </p>
          <h2 className="t-section" style={{ marginBottom: "2.5rem" }}>
            {copy.faqH2}
          </h2>
          <div style={{ paddingBottom: "0.5rem" }}>
            {copy.faqs.map((faq) => (
              <FAQItem key={faq.q} q={faq.q} a={faq.a} />
            ))}
          </div>
          <div style={{ borderTop: "1px solid oklch(88% 0.008 80)" }} />

          {/* Contact link */}
          <p
            style={{
              fontFamily: "var(--font-montserrat)",
              fontSize: "0.875rem",
              color: "oklch(48% 0.008 260)",
              marginTop: "2.5rem",
            }}
          >
            {id ? "Pertanyaan lain? " : "Another question? "}
            <a
              href="mailto:hello@crispyleaders.com"
              className="pricing-contact-link"
              style={{
                color: "oklch(32% 0.10 260)",
                fontWeight: 700,
                textDecoration: "none",
              }}
            >
              {id ? "Kirim pesan kepada kami." : "Send us a message."}
            </a>
          </p>
        </div>
      </section>
    </>
  );
}

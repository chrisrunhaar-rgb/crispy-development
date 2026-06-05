"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useLanguage } from "@/lib/LanguageContext";
import { createClient } from "@/lib/supabase/client";

interface Props {
  isIndonesia: boolean;
}

type BillingPeriod = "monthly" | "annual";

// ── Checkout button ──────────────────────────────────────────────────────────
function CheckoutButton({
  plan,
  isIndonesia,
  variant,
  billingPeriod,
}: {
  plan: "personal" | "team";
  isIndonesia: boolean;
  variant: "orange" | "navy";
  billingPeriod: BillingPeriod;
}) {
  const { lang } = useLanguage();
  const [status, setStatus] = useState<"idle" | "loading" | "unavailable">("idle");
  const [hovered, setHovered] = useState(false);
  const [signedIn, setSignedIn] = useState<boolean | null>(null);

  useEffect(() => {
    const supabase = createClient();
    supabase.auth.getUser().then(({ data }) => setSignedIn(!!data.user));
  }, []);

  async function go() {
    setStatus("loading");
    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          plan,
          currency: isIndonesia ? "idr" : "usd",
          billingPeriod,
        }),
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
      unavailable: "Payment setup in progress.",
      contact: "",
    },
    id: {
      personal: "Mulai sekarang →",
      team: "Bangun tim Anda →",
      loading: "Memuat…",
      unavailable: "Pembayaran sedang disiapkan.",
      contact: "",
    },
  };
  const l = labels[lang === "id" ? "id" : "en"];

  const active = hovered && status !== "loading";
  const btnStyle: React.CSSProperties = {
    background:
      variant === "orange"
        ? active
          ? "oklch(60% 0.14 45)"
          : "oklch(65% 0.15 45)"
        : active
        ? "oklch(18% 0.10 260)"
        : "oklch(22% 0.10 260)",
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
          borderRadius: 12,
          border: "none",
          cursor: status === "loading" ? "default" : "pointer",
          opacity: status === "loading" ? 0.65 : 1,
          transition: "background-color 0.15s ease, opacity 0.2s ease",
          display: "inline-block",
          width: "100%",
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
          {l.unavailable}
        </p>
      )}

      {signedIn === false && (
        <p
          style={{
            fontFamily: "var(--font-montserrat)",
            fontSize: "0.75rem",
            lineHeight: 1.6,
            color: variant === "orange" ? "oklch(68% 0.04 260)" : "oklch(48% 0.008 260)",
            marginTop: "0.875rem",
          }}
        >
          {lang === "id" ? "Sudah punya akun? " : "Already have an account? "}
          <Link
            href="/login?redirect=/pricing"
            style={{
              color: variant === "orange" ? "oklch(82% 0.06 260)" : "oklch(32% 0.10 260)",
              fontWeight: 700,
              textDecoration: "underline",
            }}
          >
            {lang === "id" ? "Masuk terlebih dahulu" : "Sign in first"}
          </Link>
          {" "}{lang === "id" ? "untuk melanjutkan ke jalur tim." : "to extend to team pathway."}
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

// ── Savings badge ────────────────────────────────────────────────────────────
function SavingsBadge({ label }: { label: string }) {
  return (
    <span
      style={{
        display: "inline-block",
        background: "oklch(65% 0.15 45)",
        color: "oklch(97% 0.005 80)",
        fontFamily: "var(--font-montserrat)",
        fontWeight: 700,
        fontSize: "0.65rem",
        letterSpacing: "0.08em",
        textTransform: "uppercase",
        padding: "0.25em 0.65em",
        borderRadius: "999px",
        marginLeft: "0.75rem",
        verticalAlign: "middle",
        lineHeight: 1.4,
      }}
    >
      {label}
    </span>
  );
}

// ── Main component ───────────────────────────────────────────────────────────
export default function PricingContent({ isIndonesia }: Props) {
  const { lang } = useLanguage();
  const id = lang === "id";
  const [billing, setBilling] = useState<BillingPeriod>("monthly");
  const annual = billing === "annual";

  // ── Copy ────────────────────────────────────────────────────────────────
  const copy = {
    eyebrow: id ? "Akses · Harga" : "Access · Pricing",
    h1: id ? "Sumber daya. Coaching. Komunitas." : "Resources. Coaching. Community.",
    tagline: id
      ? "Sumber daya, jalur, dan coaching AI untuk pemimpin lintas budaya. Siapa pun bisa bergabung."
      : "Resources, pathways, and AI coaching for cross-cultural leaders. Open to all.",

    toggleMonthly: id ? "Bulanan" : "Monthly",
    toggleAnnual: id ? "Tahunan" : "Annual",

    // PERSONAL ───────────────────────────────────────────────────────────
    personalLabel: id ? "Personal" : "Personal",

    personalMonthlyPrice: isIndonesia ? "RP 99.000" : "$7.99",
    personalMonthlyPeriod: id ? "per bulan · perpanjangan otomatis" : "per month · auto-renews",
    personalMonthlyNote: id ? "Tanpa WayPoint · perpanjangan otomatis" : "No WayPoint · auto-renews",
    personalMonthlyFeatures: id
      ? [
          "53 modul pelatihan dengan dasbor kemajuan",
          "Dasbor pribadi + pelacakan kemajuan",
          "8 asesmen personal (DISC · Enneagram · 5 Bahasa Cinta · Roda Kehidupan · Gaya Berpikir · Karunia Rohani · Big Five · 16 Kepribadian)",
          "Konten baru saat diluncurkan",
        ]
      : [
          "53 training modules with progress dashboard",
          "Personal dashboard + progress tracking",
          "8 personal assessments (DISC · Enneagram · 5 Love Languages · Wheel of Life · Thinking Styles · Spiritual Gifts · Big Five · 16 Personalities)",
          "New content as it launches",
        ],

    personalAnnualPrice: isIndonesia ? "RP 749.000" : "$59",
    personalAnnualPeriod: id ? "per tahun" : "per year",
    personalAnnualBadge: id ? "Hemat 38%" : "Save 38%",
    personalAnnualFeatures: id
      ? [
          "60 menit WayPoint AI Coaching disertakan",
        ]
      : [
          "60 min WayPoint AI Coaching included",
        ],

    // TEAM ───────────────────────────────────────────────────────────────
    teamLabel: id ? "Tim · 8 Kursi" : "Team · 8 Seats",

    teamMonthlyPrice: isIndonesia ? "RP 399.000" : "$39",
    teamMonthlyPeriod: id ? "per bulan · perpanjangan otomatis" : "per month · auto-renews",
    teamMonthlyValue: isIndonesia
      ? "Hanya RP 49.875 per anggota"
      : "Only $4.88/member",
    teamMonthlyNote: id ? "Tanpa WayPoint · perpanjangan otomatis" : "No WayPoint · auto-renews",
    teamMonthlyFeatures: id
      ? [
          "Perjalanan pengembangan tim yang unik",
          "Jalur personal untuk semua 8 anggota",
          "Dasbor tim + kontrol pemimpin",
          "Alat kepemimpinan lintas budaya",
        ]
      : [
          "Unique team development journey",
          "Personal pathway for all 8 members",
          "Team dashboard + leader controls",
          "Cross-cultural tools",
        ],

    teamAnnualPrice: isIndonesia ? "RP 2.990.000" : "$299",
    teamAnnualPeriod: id ? "per tahun" : "per year",
    teamAnnualBadge: id ? "Hemat 36%" : "Save 36%",
    teamAnnualValue: isIndonesia ? "Hanya RP 373.750 per anggota" : "Only $37.38/member",
    teamAnnualFeatures: id
      ? [
          "4 jam total WayPoint AI Coaching (30 menit per anggota)",
        ]
      : [
          "4 hours total WayPoint AI Coaching included (30 min/member)",
        ],

    // FAQ ────────────────────────────────────────────────────────────────
    faqLabel: id ? "Pertanyaan Umum" : "Common Questions",
    faqH2: id ? "Yang perlu Anda tahu." : "What you need to know.",
    faqs: id
      ? [
          {
            q: "Apakah ini berlangganan?",
            a: "Ya — paket Bulanan dan Tahunan sama-sama berlangganan. Paket Bulanan diperpanjang otomatis setiap bulan. Paket Tahunan diperpanjang setiap tahun. Anda dapat membatalkan kapan saja dari dasbor akun Anda.",
          },
          {
            q: "Bagaimana cara membatalkan?",
            a: "Masuk ke dasbor akun Anda dan batalkan kapan saja. Akses tetap aktif hingga akhir periode penagihan saat ini. Tidak ada biaya pembatalan.",
          },
          {
            q: "Apa perbedaan Bulanan dan Tahunan?",
            a: "Paket Bulanan memberikan akses ke seluruh perpustakaan konten tanpa coaching WayPoint. Paket Tahunan termasuk menit coaching WayPoint AI dan harga lebih hemat secara keseluruhan.",
          },
          {
            q: "Apa yang termasuk dalam coaching AI WayPoint?",
            a: "WayPoint adalah coach AI berbasis suara yang dirancang untuk pemimpin lintas budaya. Paket Tahunan Personal menyertakan 60 menit; Paket Tahunan Tim menyertakan 4 jam total (30 menit per anggota).",
          },
          {
            q: "Bisakah saya upgrade dari Bulanan ke Tahunan?",
            a: "Ya — hubungi kami di hello@crispyleaders.com dan kami akan mengatur penyesuaian harga.",
          },
          {
            q: "Apakah kursi tim bisa dialihkan?",
            a: "Tidak. Kursi tim tidak dapat dialihkan ke anggota lain setelah ditetapkan.",
          },
        ]
      : [
          {
            q: "Is this a subscription?",
            a: "Yes — both Monthly and Annual plans are subscriptions. Monthly renews each month. Annual renews each year. You can cancel any time from your account dashboard.",
          },
          {
            q: "How do I cancel?",
            a: "Log in to your account dashboard and cancel any time. Access remains active until the end of your current billing period. No cancellation fees.",
          },
          {
            q: "What's the difference between Monthly and Annual?",
            a: "Monthly gives you full access to all 53 training modules without WayPoint coaching. Annual includes WayPoint AI coaching minutes and better overall value.",
          },
          {
            q: "What's included in WayPoint AI coaching?",
            a: "WayPoint is a voice-based AI coach built for cross-cultural leaders. The Personal Annual plan includes 60 minutes; the Team Annual plan includes 4 hours total (30 min per member).",
          },
          {
            q: "Can I upgrade from Monthly to Annual?",
            a: "Yes — contact us at hello@crispyleaders.com and we'll arrange the price difference.",
          },
          {
            q: "Are team seats transferable?",
            a: "No. Team seats are non-transferable once assigned.",
          },
        ],
  };

  // Derived values for the active billing period
  const personalPrice = annual ? copy.personalAnnualPrice : copy.personalMonthlyPrice;
  const personalPeriod = annual ? copy.personalAnnualPeriod : copy.personalMonthlyPeriod;
  const personalFeatures = annual
    ? [...copy.personalMonthlyFeatures, ...copy.personalAnnualFeatures]
    : copy.personalMonthlyFeatures;

  const teamPrice = annual ? copy.teamAnnualPrice : copy.teamMonthlyPrice;
  const teamPeriod = annual ? copy.teamAnnualPeriod : copy.teamMonthlyPeriod;
  const teamFeatures = annual
    ? [...copy.teamMonthlyFeatures, ...copy.teamAnnualFeatures]
    : copy.teamMonthlyFeatures;

  return (
    <>
      {/* eslint-disable-next-line react/no-danger */}
      <style dangerouslySetInnerHTML={{ __html: `
        .pricing-contact-link:hover { text-decoration: underline; }
        @keyframes pricingFadeDown {
          from { opacity: 0; transform: translateY(-5px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .pricing-faq-answer { animation: pricingFadeDown 0.18s ease-out; }
        .pricing-toggle-btn {
          background: none;
          border: none;
          cursor: pointer;
          font-family: var(--font-montserrat);
          font-weight: 700;
          font-size: 0.8rem;
          letter-spacing: 0.06em;
          text-transform: uppercase;
          padding: 0.5rem 1.25rem;
          border-radius: 8px;
          transition: background 0.15s ease, color 0.15s ease;
        }
        .pricing-toggle-btn.active {
          background: oklch(22% 0.10 260);
          color: oklch(97% 0.005 80);
        }
        .pricing-toggle-btn.inactive {
          background: none;
          color: oklch(48% 0.008 260);
        }
        .pricing-toggle-btn.inactive:hover {
          color: oklch(22% 0.10 260);
        }
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
            style={{
              width: "48px",
              height: "2px",
              background: "oklch(65% 0.15 45)",
              marginBottom: "1.75rem",
            }}
          />
          <h1
            style={{
              fontFamily: "var(--font-cormorant)",
              fontStyle: "italic",
              fontWeight: 600,
              fontSize: "clamp(2rem, 4vw, 3.5rem)",
              lineHeight: 1.1,
              color: "oklch(97% 0.005 80)",
              margin: "0 0 1.75rem",
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

      {/* ── PRICING CARDS ─────────────────────────────────────────────────── */}
      <section
        style={{
          background: "oklch(94% 0.008 80)",
          paddingBlock: "clamp(3rem, 6vw, 5rem)",
        }}
      >
        <div className="container-wide">

          {/* Toggle */}
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              marginBottom: "clamp(2rem, 4vw, 3rem)",
            }}
          >
            <div
              style={{
                display: "inline-flex",
                alignItems: "center",
                background: "oklch(88% 0.008 80)",
                borderRadius: "12px",
                padding: "4px",
                gap: "2px",
              }}
            >
              <button
                className={`pricing-toggle-btn ${billing === "monthly" ? "active" : "inactive"}`}
                onClick={() => setBilling("monthly")}
              >
                {copy.toggleMonthly}
              </button>
              <button
                className={`pricing-toggle-btn ${billing === "annual" ? "active" : "inactive"}`}
                onClick={() => setBilling("annual")}
              >
                {copy.toggleAnnual}
                {billing === "monthly" && (
                  <span
                    style={{
                      display: "inline-block",
                      background: "oklch(65% 0.15 45)",
                      color: "oklch(97% 0.005 80)",
                      fontSize: "0.58rem",
                      fontWeight: 700,
                      letterSpacing: "0.06em",
                      padding: "0.15em 0.5em",
                      borderRadius: "999px",
                      marginLeft: "0.5rem",
                      verticalAlign: "middle",
                      lineHeight: 1.4,
                    }}
                  >
                    {id ? "Hemat" : "Save"}
                  </span>
                )}
              </button>
            </div>
          </div>

          {/* Indonesian pricing notice */}
          {isIndonesia && (
            <p
              style={{
                fontFamily: "var(--font-montserrat)",
                fontSize: "0.75rem",
                lineHeight: 1.6,
                color: "oklch(48% 0.008 260)",
                textAlign: "center",
                marginBottom: "1.5rem",
                padding: "0.75rem 1.25rem",
                background: "oklch(90% 0.008 80)",
                borderRadius: "8px",
              }}
            >
              {id
                ? "Harga IDR hanya tersedia untuk pengguna Indonesia. Pembayaran melalui rekening bank Indonesia."
                : "IDR pricing is available for Indonesian subscribers only. Payment via Indonesian bank account."}
            </p>
          )}

          {/* Card grid */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
              gap: "clamp(1.25rem, 3vw, 2rem)",
              alignItems: "stretch",
            }}
          >
            {/* ── Personal card — navy ── */}
            <div
              style={{
                background: "oklch(27% 0.11 260)",
                borderRadius: "16px",
                padding: "clamp(2rem, 4vw, 2.75rem)",
                display: "flex",
                flexDirection: "column",
                gap: 0,
              }}
            >
              {/* Label */}
              <p
                style={{
                  fontFamily: "var(--font-montserrat)",
                  fontSize: "0.68rem",
                  fontWeight: 700,
                  letterSpacing: "0.22em",
                  textTransform: "uppercase",
                  color: "oklch(65% 0.15 45)",
                  margin: "0 0 1.75rem",
                }}
              >
                {copy.personalLabel}
              </p>

              {/* Price row */}
              <div
                style={{
                  display: "flex",
                  alignItems: "baseline",
                  gap: "0.5rem",
                  flexWrap: "wrap",
                  marginBottom: "0.375rem",
                }}
              >
                <span
                  style={{
                    fontFamily: "var(--font-cormorant)",
                    fontStyle: "italic",
                    fontWeight: 300,
                    fontSize: "clamp(2rem, 3.5vw, 2.75rem)",
                    lineHeight: 1,
                    color: "oklch(97% 0.005 80)",
                  }}
                >
                  {personalPrice}
                </span>
                {annual && <SavingsBadge label={copy.personalAnnualBadge} />}
              </div>

              {/* Period */}
              <p
                style={{
                  fontFamily: "var(--font-montserrat)",
                  fontSize: "0.68rem",
                  fontWeight: 600,
                  letterSpacing: "0.12em",
                  textTransform: "uppercase",
                  color: "oklch(52% 0.04 260)",
                  margin: "0.625rem 0 1.75rem",
                }}
              >
                {personalPeriod}
              </p>

              {/* Features */}
              <ul
                style={{
                  listStyle: "none",
                  padding: 0,
                  margin: "0 0 2rem",
                  display: "flex",
                  flexDirection: "column",
                  gap: "0.875rem",
                  flexGrow: 1,
                }}
              >
                {personalFeatures.map((f) => (
                  <Feature key={f} text={f} light />
                ))}
              </ul>

              <CheckoutButton
                plan="personal"
                isIndonesia={isIndonesia}
                variant="orange"
                billingPeriod={billing}
              />
            </div>

            {/* ── Team card — off-white ── */}
            <div
              style={{
                background: "oklch(96% 0.006 80)",
                borderRadius: "16px",
                padding: "clamp(2rem, 4vw, 2.75rem)",
                display: "flex",
                flexDirection: "column",
                gap: 0,
              }}
            >
              {/* Label */}
              <p
                style={{
                  fontFamily: "var(--font-montserrat)",
                  fontSize: "0.68rem",
                  fontWeight: 700,
                  letterSpacing: "0.22em",
                  textTransform: "uppercase",
                  color: "oklch(65% 0.15 45)",
                  margin: "0 0 1.75rem",
                }}
              >
                {copy.teamLabel}
              </p>

              {/* Price row */}
              <div
                style={{
                  display: "flex",
                  alignItems: "baseline",
                  gap: "0.5rem",
                  flexWrap: "wrap",
                  marginBottom: "0.375rem",
                }}
              >
                <span
                  style={{
                    fontFamily: "var(--font-cormorant)",
                    fontStyle: "italic",
                    fontWeight: 300,
                    fontSize: "clamp(2rem, 3.5vw, 2.75rem)",
                    lineHeight: 1,
                    color: "oklch(22% 0.10 260)",
                  }}
                >
                  {teamPrice}
                </span>
                <span
                  style={{
                    fontFamily: "var(--font-montserrat)",
                    fontSize: "0.72rem",
                    fontWeight: 500,
                    color: "oklch(55% 0.008 260)",
                    lineHeight: 1,
                  }}
                >
                  {isIndonesia
                    ? annual ? "" : "(Rp 50.000/anggota)"
                    : annual ? "" : "(less than $5 per member)"}
                </span>
                {annual && <SavingsBadge label={copy.teamAnnualBadge} />}
              </div>

              {/* Period */}
              <p
                style={{
                  fontFamily: "var(--font-montserrat)",
                  fontSize: "0.68rem",
                  fontWeight: 600,
                  letterSpacing: "0.12em",
                  textTransform: "uppercase",
                  color: "oklch(55% 0.008 260)",
                  margin: "0.625rem 0 1.75rem",
                }}
              >
                {teamPeriod}
              </p>

              {/* Features */}
              <ul
                style={{
                  listStyle: "none",
                  padding: 0,
                  margin: "0 0 1.25rem",
                  display: "flex",
                  flexDirection: "column",
                  gap: "0.875rem",
                  flexGrow: 1,
                }}
              >
                {teamFeatures.map((f) => (
                  <Feature key={f} text={f} />
                ))}
              </ul>

              {/* Team leader note */}
              <CheckoutButton
                plan="team"
                isIndonesia={isIndonesia}
                variant="navy"
                billingPeriod={billing}
              />
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

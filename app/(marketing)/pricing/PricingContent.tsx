"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { useLanguage } from "@/lib/LanguageContext";
import { createClient } from "@/lib/supabase/client";
import { PRICES, formatPrice, fillPrices, type Currency } from "@/lib/pricing";

interface Props {
  // Resolved on the server (locked currency > IP country > USD), the same
  // way api/checkout picks the currency it charges in.
  currency: Currency;
}

// ── Path icons ───────────────────────────────────────────────────────────────
// Same glyphs used on /signup and the dashboard's Personal/Team tab toggle —
// identical viewBox and path/circle data. Kept as a local copy here (not
// imported from SignupForm.tsx) so this file stays independent from the
// signup flow, sized down for a corner badge rather than a large tile icon.
function PersonalPathIcon({ size = 22 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 16 16" fill="none" aria-hidden="true">
      <circle cx="8" cy="5" r="3" stroke="currentColor" strokeWidth="1.5" />
      <path d="M2 14c0-3.314 2.686-5 6-5s6 1.686 6 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

function TeamPathIcon({ size = 22 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 16 16" fill="none" aria-hidden="true">
      <circle cx="8" cy="4.5" r="2.5" stroke="currentColor" strokeWidth="1.5" />
      <path d="M3.5 14c0-2.485 2.015-4.5 4.5-4.5s4.5 2.015 4.5 4.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      <circle cx="3.5" cy="6" r="2" stroke="currentColor" strokeWidth="1.5" />
      <path d="M1 14c0-2.2 1.1-3.5 2.5-3.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      <circle cx="12.5" cy="6" r="2" stroke="currentColor" strokeWidth="1.5" />
      <path d="M15 14c0-2.2-1.1-3.5-2.5-3.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

// ── Checkout button ──────────────────────────────────────────────────────────
function CheckoutButton({
  plan,
  variant,
  autoTrigger,
  teamSize,
}: {
  plan: "personal" | "team";
  variant: "orange" | "navy";
  autoTrigger?: boolean;
  teamSize?: number;
}) {
  const { lang } = useLanguage();
  const [status, setStatus] = useState<"idle" | "loading" | "unavailable">("idle");
  const [hovered, setHovered] = useState(false);
  const [signedIn, setSignedIn] = useState<boolean | null>(null);
  const autoFired = useRef(false);

  useEffect(() => {
    const supabase = createClient();
    supabase.auth.getUser().then(({ data }) => setSignedIn(!!data.user));
  }, []);

  // Just confirmed their email after starting checkout from this plan's button —
  // continue them straight into Stripe instead of making them click again.
  useEffect(() => {
    if (autoTrigger && signedIn === true && !autoFired.current) {
      autoFired.current = true;
      go();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [autoTrigger, signedIn]);

  async function go() {
    // Remember the chosen team size so it survives the signup detour.
    if (plan === "team" && teamSize) {
      try { sessionStorage.setItem(TEAM_SIZE_KEY, String(teamSize)); } catch {}
    }
    // Logged-out visitor: account comes first, then payment — send them to
    // signup with the pathway pre-selected and a way back to finish checkout.
    if (signedIn === false) {
      window.location.href = `/signup?pathway=${plan}&redirectTo=${encodeURIComponent("/pricing")}`;
      return;
    }
    setStatus("loading");
    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ plan, type: "lifetime", quantity: plan === "team" ? teamSize : undefined }),
      });
      if (res.status === 401) {
        // signedIn hadn't resolved yet when they clicked — same redirect.
        window.location.href = `/signup?pathway=${plan}&redirectTo=${encodeURIComponent("/pricing")}`;
        return;
      }
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
            href="/login?redirectTo=/pricing"
            style={{
              color: variant === "orange" ? "oklch(82% 0.06 260)" : "oklch(32% 0.10 260)",
              fontWeight: 700,
              textDecoration: "underline",
            }}
          >
            {lang === "id" ? "Masuk terlebih dahulu" : "Sign in first"}
          </Link>
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
        whiteSpace: "pre-line",
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

const TEAM_SIZE_KEY = "pricing_team_size";
const MIN_TEAM = 2;
const MAX_TEAM = 10;

// ── Main component ───────────────────────────────────────────────────────────
export default function PricingContent({ currency }: Props) {
  const { lang } = useLanguage();
  const id = lang === "id";
  const P = PRICES[currency];
  const fmt = (n: number) => formatPrice(currency, n);

  // Landed here right after confirming a signup that started on this page —
  // continue that plan's checkout automatically (see app/auth/callback/route.ts).
  const [autoPlan, setAutoPlan] = useState<"personal" | "team" | null>(null);
  useEffect(() => {
    const auto = new URLSearchParams(window.location.search).get("autocheckout");
    if (auto === "personal" || auto === "team") setAutoPlan(auto);
  }, []);

  const [teamSize, setTeamSize] = useState(5);
  useEffect(() => {
    try {
      const saved = Number(sessionStorage.getItem(TEAM_SIZE_KEY));
      // eslint-disable-next-line react-hooks/set-state-in-effect
      if (saved >= MIN_TEAM && saved <= MAX_TEAM) setTeamSize(saved);
    } catch {}
  }, []);

  // ── Copy ────────────────────────────────────────────────────────────────
  const copy = {
    // FREE TIER ──────────────────────────────────────────────────────────
    freeLine: fillPrices(
      id
        ? "Gratis: modul pilihan, dengan dasbor untuk menyimpan kemajuan Anda. Personal: semua 50+ modul dan 8 asesmen, {personal} sekali bayar."
        : "Free: selected modules, with a dashboard that saves your progress. Personal: all 50+ modules and 8 assessments, {personal} one time.",
      currency,
    ),
    freeLink: id ? "Buat akun gratis" : "Create a free account",

    // PERSONAL ───────────────────────────────────────────────────────────
    personalLabel: "Personal",
    personalPrice: fmt(P.personal),
    personalPriceNote: id ? "Sekali bayar · Akses permanen" : "One-time purchase · Permanent access",
    personalFeatures: id
      ? [
          "50+ modul pelatihan dengan dasbor kemajuan",
          "Dasbor pribadi + pelacakan kemajuan",
          "8 Asesmen Kepribadian\nDISC - Enneagram - 5 Bahasa Penghargaan - Roda Kehidupan - Tiga Gaya Berpikir - Karunia Rohani - Big Five - 16 Kepribadian",
          "Konten baru saat diluncurkan",
        ]
      : [
          "50+ training modules on Cross-Cultural Leadership",
          "Personal dashboard + progress tracking",
          "8 Personality Assessments\nDISC - Enneagram - 5 Languages of Appreciation - Wheel of Life - Three Thinking Styles - Spiritual Gifts - Big Five - 16 Personalities",
          "Direct access to new content as it launches",
        ],

    // TEAM ───────────────────────────────────────────────────────────────
    teamLabel: id ? "Tim · 2 sampai 10 orang" : "Team · 2 to 10 people",
    teamPrice: fmt(P.seat),
    teamPriceSubNote: id ? "per orang, termasuk pemimpin" : "per person, leader included",
    teamSizeLabel: id ? "Ukuran tim" : "Team size",
    teamSizeValue: (n: number) => (id ? `${n} orang` : `${n} people`),
    teamTotal: (n: number) => `Total ${fmt(n)}`,
    teamMore: id ? "Lebih dari 10 orang? Hubungi kami" : "More than 10 people? Contact us",
    teamPriceNote: id ? "Sekali bayar · Akses permanen" : "One-time purchase · Permanent access",
    teamFeatures: id
      ? [
          "Akun Personal lengkap untuk setiap anggota tim",
          "Perjalanan Pertumbuhan Tim, ditulis khusus untuk pengembangan tim",
          "Hasil asesmen seluruh tim, terlihat oleh semua anggota",
          "Dasbor tim + kontrol pemimpin",
        ]
      : [
          "A full Personal account for every team member",
          "The Team Growth Journey, written for team development",
          "The whole team's assessment results, visible to everyone",
          "Team dashboard + leader controls",
        ],

    // FAQ ────────────────────────────────────────────────────────────────
    faqLabel: id ? "Pertanyaan Umum" : "Common Questions",
    faqH2: id ? "Yang perlu Anda tahu." : "What you need to know.",
    faqs: id
      ? [
          {
            q: "Apakah ini berlangganan?",
            a: "Tidak. Ini pembayaran satu kali: Anda membayar sekali dan mendapatkan akses permanen ke seluruh perpustakaan konten. Tidak ada pembayaran berulang, dan tidak ada yang perlu dibatalkan.",
          },
          {
            q: "Apa yang termasuk dalam paket Personal dan Tim?",
            a: `Paket Personal memberikan satu orang akses permanen ke seluruh perpustakaan konten, dasbor pribadi, dan seluruh asesmen kepribadian. Paket Tim memberikan semua isi Personal kepada setiap anggota tim, ditambah Perjalanan Pertumbuhan Tim: modul yang ditulis khusus untuk pengembangan tim dan membentuk budaya tim. Anda juga mendapat hasil seluruh tim dan dasbor tim dengan kontrol untuk pemimpin.`,
          },
          {
            q: "Bagaimana harga paket Tim dihitung?",
            a: `Anda membayar ${fmt(P.seat)} per orang, sekali bayar, dan pemimpin tim juga dihitung. Pilih ukuran tim antara 2 dan 10 orang sebelum membayar. Tim berisi 5 orang berarti ${fmt(P.seat * 5)}. Untuk tim lebih dari 10 orang, hubungi kami.`,
          },
          {
            q: "Bisakah saya menambah anggota tim nanti?",
            a: `Bisa. Pemimpin tim dapat menambah tempat dari pengaturan tim, ${fmt(P.seat)} per tempat, sampai total 10 orang.`,
          },
          {
            q: "Bisakah saya beralih dari Personal ke Tim nanti?",
            a: `Bisa. Beli paket Tim saat masuk dengan akun Personal Anda. Tempat Anda sendiri hanya dikenai selisihnya, ${fmt(P.seat - P.personal)}. Setiap anggota tim lainnya ${fmt(P.seat)}.`,
          },
          {
            q: "Apakah akun tim bisa dialihkan ke orang lain?",
            a: "Tidak. Akun tim tidak dapat dialihkan ke anggota lain setelah ditetapkan.",
          },
          {
            q: "Apakah ada kebijakan pengembalian dana?",
            a: "Hubungi kami di hello@crispyleaders.com jika ada kendala dengan pembelian Anda dan kami akan meninjaunya langsung dengan Anda.",
          },
        ]
      : [
          {
            q: "Is this a subscription?",
            a: "No. This is a one-time payment: you pay once and get lifetime access to the full content library. Nothing recurring, and nothing to cancel.",
          },
          {
            q: "What's included in Personal vs Team?",
            a: `Personal gives one person lifetime access to the full content library, a personal dashboard, and every personality assessment. Team gives everything in Personal to every person on the team, plus the Team Growth Journey: modules written for team development and shaping team culture. You also get the whole team's results and a team dashboard with leader controls.`,
          },
          {
            q: "How is Team priced?",
            a: `You pay ${fmt(P.seat)} per person, once, and the leader counts as one of the team. Pick a team size from 2 to 10 people before you pay. A team of 5 is ${fmt(P.seat * 5)}. For more than 10 people, contact us.`,
          },
          {
            q: "Can I add people to my team later?",
            a: `Yes. The team leader can add seats from team settings at ${fmt(P.seat)} per seat, up to 10 people in total.`,
          },
          {
            q: "Can I move from Personal to Team later?",
            a: `Yes. Buy Team while logged in to your Personal account. Your own seat only costs the difference, ${fmt(P.seat - P.personal)}. Everyone else on the team is ${fmt(P.seat)}.`,
          },
          {
            q: "Are team accounts transferable?",
            a: "No. Team accounts are non-transferable once assigned.",
          },
          {
            q: "What's your refund policy?",
            a: "Reach out to hello@crispyleaders.com if something isn't working out with your purchase and we'll look at it directly with you.",
          },
        ],
  };

  return (
    <>
      {/* eslint-disable-next-line react/no-danger */}
      <style dangerouslySetInnerHTML={{ __html: `
        .pricing-contact-link:hover { text-decoration: underline; }
        .pricing-team-size { display: flex; align-items: center; justify-content: space-between; gap: 0.75rem; flex-wrap: wrap; margin-bottom: 1rem; font-family: var(--font-montserrat); }
        .pricing-team-size-label { font-size: 0.8rem; font-weight: 700; color: oklch(38% 0.008 260); }
        .pricing-stepper { display: flex; align-items: center; border: 1px solid oklch(84% 0.008 80); border-radius: 10px; background: oklch(99% 0.003 80); }
        .pricing-stepper button { width: 44px; height: 44px; border: none; background: none; font-size: 1.1rem; font-weight: 700; color: oklch(22% 0.10 260); cursor: pointer; }
        .pricing-stepper button:disabled { color: oklch(78% 0.008 260); cursor: default; }
        .pricing-stepper span { min-width: 6.5rem; text-align: center; font-size: 0.875rem; font-weight: 700; color: oklch(22% 0.10 260); }
        .pricing-team-total { font-size: 0.95rem; font-weight: 800; color: oklch(22% 0.10 260); }
        .pricing-team-more { display: inline-block; margin: -0.25rem 0 1rem; font-family: var(--font-montserrat); font-size: 0.8rem; font-weight: 700; color: oklch(32% 0.10 260); text-decoration: none; }
        @keyframes pricingFadeDown {
          from { opacity: 0; transform: translateY(-5px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .pricing-faq-answer { animation: pricingFadeDown 0.18s ease-out; }
      `}} />

      {/* ── PRICING CARDS ─────────────────────────────────────────────────── */}
      <section
        style={{
          background: "oklch(94% 0.008 80)",
          paddingBlock: "clamp(3rem, 6vw, 5rem)",
        }}
      >
        <div className="container-wide">

          <p
            style={{
              fontFamily: "var(--font-montserrat)",
              fontSize: "0.95rem",
              lineHeight: 1.6,
              color: "oklch(32% 0.05 260)",
              textAlign: "center",
              margin: "0 auto clamp(1.5rem, 3vw, 2rem)",
              maxWidth: "60ch",
            }}
          >
            {copy.freeLine}{" "}
            <Link href="/signup" style={{ color: "oklch(22% 0.10 260)", fontWeight: 700, textDecoration: "underline" }}>
              {copy.freeLink}
            </Link>
          </p>

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
                position: "relative",
              }}
            >
              {/* Icon — absolutely positioned so its size is independent of the
                  label row's height; sizing it up here never pushes the price
                  row (or anything else) further down the card. */}
              <span
                style={{
                  position: "absolute",
                  top: "clamp(2rem, 4vw, 2.75rem)",
                  right: "clamp(2rem, 4vw, 2.75rem)",
                  color: "oklch(65% 0.15 45)",
                }}
              >
                <PersonalPathIcon size={40} />
              </span>

              {/* Label */}
              <div style={{ marginBottom: "1.75rem" }}>
                <p
                  style={{
                    fontFamily: "var(--font-montserrat)",
                    fontSize: "1.2rem",
                    fontWeight: 800,
                    letterSpacing: "0.01em",
                    color: "oklch(65% 0.15 45)",
                    margin: 0,
                    maxWidth: "70%",
                  }}
                >
                  {copy.personalLabel}
                </p>
              </div>

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
                  {copy.personalPrice}
                </span>
              </div>

              {/* Price note */}
              <p
                style={{
                  fontFamily: "var(--font-montserrat)",
                  fontSize: "0.8rem",
                  fontWeight: 600,
                  color: "oklch(72% 0.04 260)",
                  margin: "0.625rem 0 1.75rem",
                }}
              >
                {copy.personalPriceNote}
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
                {copy.personalFeatures.map((f) => (
                  <Feature key={f} text={f} light />
                ))}
              </ul>

              <CheckoutButton
                plan="personal"
                variant="orange"
                autoTrigger={autoPlan === "personal"}
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
                position: "relative",
              }}
            >
              {/* Icon — absolutely positioned so its size is independent of the
                  label row's height; sizing it up here never pushes the price
                  row (or anything else) further down the card. */}
              <span
                style={{
                  position: "absolute",
                  top: "clamp(2rem, 4vw, 2.75rem)",
                  right: "clamp(2rem, 4vw, 2.75rem)",
                  color: "oklch(65% 0.15 45)",
                }}
              >
                <TeamPathIcon size={40} />
              </span>

              {/* Label */}
              <div style={{ marginBottom: "1.75rem" }}>
                <p
                  style={{
                    fontFamily: "var(--font-montserrat)",
                    fontSize: "1.2rem",
                    fontWeight: 800,
                    letterSpacing: "0.01em",
                    color: "oklch(65% 0.15 45)",
                    margin: 0,
                    maxWidth: "70%",
                  }}
                >
                  {copy.teamLabel}
                </p>
              </div>

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
                  {copy.teamPrice}
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
                  {copy.teamPriceSubNote}
                </span>
              </div>

              {/* Price note */}
              <p
                style={{
                  fontFamily: "var(--font-montserrat)",
                  fontSize: "0.8rem",
                  fontWeight: 600,
                  color: "oklch(48% 0.04 260)",
                  margin: "0.625rem 0 1.75rem",
                }}
              >
                {copy.teamPriceNote}
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
                {copy.teamFeatures.map((f) => (
                  <Feature key={f} text={f} />
                ))}
              </ul>

              {/* Team size picker */}
              <div className="pricing-team-size">
                <span className="pricing-team-size-label">{copy.teamSizeLabel}</span>
                <div className="pricing-stepper">
                  <button
                    type="button"
                    aria-label={id ? "Kurangi" : "Fewer people"}
                    onClick={() => setTeamSize((n) => Math.max(MIN_TEAM, n - 1))}
                    disabled={teamSize <= MIN_TEAM}
                  >
                    −
                  </button>
                  <span aria-live="polite">{copy.teamSizeValue(teamSize)}</span>
                  <button
                    type="button"
                    aria-label={id ? "Tambah" : "More people"}
                    onClick={() => setTeamSize((n) => Math.min(MAX_TEAM, n + 1))}
                    disabled={teamSize >= MAX_TEAM}
                  >
                    +
                  </button>
                </div>
                <span className="pricing-team-total">{copy.teamTotal(teamSize * P.seat)}</span>
              </div>
              <Link href="/contact" className="pricing-contact-link pricing-team-more">
                {copy.teamMore} →
              </Link>

              <CheckoutButton
                plan="team"
                variant="navy"
                autoTrigger={autoPlan === "team"}
                teamSize={teamSize}
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

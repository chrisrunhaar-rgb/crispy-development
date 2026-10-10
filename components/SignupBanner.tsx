"use client";

import Link from "next/link";
import { useLanguage } from "@/lib/LanguageContext";

// Promo card shown to logged-out visitors on free modules (e.g. paid reel traffic).
// Rendered mid-page by the module client, after the reader has had some value.

const navy = "oklch(22% 0.10 260)";
const orange = "oklch(65% 0.15 45)";
const muted = "oklch(45% 0.05 260)";
const charcoal = "oklch(38% 0.05 260)";
// Use the self-hosted next/font variables; the literal family names do not resolve.
const cormorant = "var(--font-cormorant, Georgia, serif)";
const montserrat = "var(--font-montserrat, Montserrat, sans-serif)";

const COPY = {
  en: {
    eyebrow: "Free account",
    mid: {
      headline: "This is one of 50+ short modules for cross-cultural leaders.",
      support: "A free account keeps what you read in one place. A paid account opens the whole library.",
      button: "Create your free account",
    },
    end: {
      headline: "Save this module and open the next one, free.",
      support: "Create a free account in under a minute. Here is what you get.",
      button: "Create a free account and continue",
    },
    benefits: [
      "Free: save modules and your progress in My Pathway, and open the free modules any time",
      "Paid: all 50+ modules and 8 assessments, for one payment and yours for good",
    ],
    alt: "Preview of My Pathway",
  },
  id: {
    eyebrow: "Akun gratis",
    mid: {
      headline: "Ini satu dari 50+ modul singkat untuk pemimpin lintas budaya.",
      support: "Akun gratis menyimpan semua yang Anda baca di satu tempat. Akun berbayar membuka seluruh pustaka.",
      button: "Buat akun gratis",
    },
    end: {
      headline: "Simpan modul ini dan buka modul berikutnya, gratis.",
      support: "Buat akun gratis dalam kurang dari satu menit. Ini yang Anda dapatkan.",
      button: "Buat akun gratis dan lanjutkan",
    },
    benefits: [
      "Gratis: simpan modul dan kemajuan Anda di Jalur Saya, dan buka modul gratis kapan saja",
      "Berbayar: semua 50+ modul dan 8 asesmen, sekali bayar dan menjadi milik Anda selamanya",
    ],
    alt: "Pratinjau Jalur Saya",
  },
};

const CSS = `
.sb-card { container-type: inline-size; }
.sb-grid { display: grid; grid-template-columns: 1fr; }
.sb-visual { order: -1; position: relative; background: ${navy}; min-height: 196px; }
.sb-shot-clip { position: absolute; inset: 0; overflow: hidden; }
.sb-shot {
  position: absolute; left: 112px; top: 28px; width: 150%; max-width: 620px; height: auto;
  border-radius: 8px; display: block;
  box-shadow: 0 24px 48px oklch(10% 0.08 260 / 0.55);
}
.sb-logo {
  position: absolute; left: 24px; bottom: -40px; width: 80px; height: 80px; z-index: 1;
  border-radius: 50%; box-shadow: 0 8px 20px oklch(22% 0.10 260 / 0.28);
}
.sb-copy { padding: 60px 24px 32px; }
.sb-cta { transition: transform 200ms cubic-bezier(0.22, 1, 0.36, 1), box-shadow 200ms cubic-bezier(0.22, 1, 0.36, 1); }
.sb-cta:hover { transform: translateY(-1px); box-shadow: 0 10px 22px oklch(65% 0.15 45 / 0.35); }
.sb-cta:active { transform: scale(0.98); }
.sb-cta:focus-visible { outline: 3px solid ${navy}; outline-offset: 3px; }
@container (min-width: 640px) {
  .sb-grid { grid-template-columns: minmax(0, 1.35fr) minmax(0, 1fr); }
  .sb-visual { order: 0; min-height: 100%; }
  .sb-shot { left: 52px; top: 112px; width: 200%; max-width: none; }
  .sb-logo { left: -40px; top: 40px; bottom: auto; }
  .sb-copy { padding: 44px 64px 44px 44px; }
}
@media (prefers-reduced-motion: reduce) {
  .sb-cta { transition: none; }
  .sb-cta:hover, .sb-cta:active { transform: none; }
}
`;

function Check() {
  return (
    <svg width="22" height="22" viewBox="0 0 22 22" aria-hidden="true" style={{ flexShrink: 0, marginTop: 1 }}>
      <circle cx="11" cy="11" r="11" fill="oklch(93% 0.02 260)" />
      <path d="M6.5 11.4l3 3 6-6.6" fill="none" stroke={navy} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export default function SignupBanner({ redirectTo, variant = "mid" }: { redirectTo: string; variant?: "mid" | "end" }) {
  const { lang } = useLanguage();
  const all = COPY[lang === "id" ? "id" : "en"];
  const c = { ...all, ...all[variant] };

  return (
    <aside
      aria-label={c.eyebrow}
      className="sb-card"
      style={{
        background: "oklch(99.3% 0.003 80)",
        border: "1px solid oklch(88% 0.01 80)",
        borderRadius: 16,
        overflow: "hidden",
        boxShadow: "0 1px 2px oklch(22% 0.10 260 / 0.04), 0 18px 40px -20px oklch(22% 0.10 260 / 0.22)",
      }}
    >
      <style>{CSS}</style>
      <div className="sb-grid">
        <div className="sb-copy">
          <p style={{
            fontFamily: montserrat, fontSize: 12, fontWeight: 700, letterSpacing: "0.12em",
            textTransform: "uppercase", color: muted, margin: "0 0 14px",
          }}>
            {c.eyebrow}
          </p>
          <h2 style={{
            fontFamily: cormorant, fontWeight: 600, color: navy,
            fontSize: "clamp(32px, 5vw, 42px)", lineHeight: 1.05, letterSpacing: "-0.01em",
            margin: "0 0 14px", textWrap: "balance",
          }}>
            {c.headline}
          </h2>
          <p style={{
            fontFamily: montserrat, fontSize: 15, lineHeight: 1.6, color: charcoal,
            margin: "0 0 24px", maxWidth: "52ch",
          }}>
            {c.support}
          </p>
          <ul style={{ listStyle: "none", padding: 0, margin: "0 0 30px", display: "grid", gap: 12 }}>
            {c.benefits.map((b) => (
              <li key={b} style={{
                display: "flex", gap: 12, alignItems: "flex-start",
                fontFamily: montserrat, fontSize: 14.5, lineHeight: 1.55, color: navy, fontWeight: 500,
              }}>
                <Check />
                <span>{b}</span>
              </li>
            ))}
          </ul>
          <Link
            href={`/signup?redirectTo=${encodeURIComponent(redirectTo)}`}
            className="sb-cta"
            style={{
              display: "inline-flex", alignItems: "center", justifyContent: "center", gap: 10,
              minHeight: 48, padding: "14px 28px", borderRadius: 12,
              background: orange, color: navy, textDecoration: "none",
              fontFamily: montserrat, fontSize: 15, fontWeight: 700, letterSpacing: "0.03em",
            }}
          >
            {c.button}
            <svg width="16" height="16" viewBox="0 0 16 16" aria-hidden="true">
              <path d="M3 8h9.5M8.5 3.5L13 8l-4.5 4.5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </Link>
        </div>

        <div className="sb-visual">
          <div className="sb-shot-clip">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/dashboard-personal.jpg" alt={c.alt} className="sb-shot" loading="lazy" decoding="async" />
          </div>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/logo-icon-dark-badge.png" alt="" className="sb-logo" width={80} height={80} />
        </div>
      </div>
    </aside>
  );
}

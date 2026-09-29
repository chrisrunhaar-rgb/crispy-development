"use client";

import { useState } from "react";
import Link from "next/link";

// Small slideshow launcher. Pass it to <LangToggle extra={...} /> so it sits
// beside the EN/ID switch. Hover/focus shows the tooltip, click opens the
// slideshow (phones get a "bigger screen needed" notice).

type Lang = "en" | "id";
type Bi = { en: string; id: string };

const navy = "oklch(22% 0.10 260)";
const amber = "oklch(65% 0.15 45)";
const subText = "oklch(52% 0.008 260)";

export default function PresentLauncher({ href, lang, title, text }: { href: string; lang: Lang; title: Bi; text: Bi }) {
  const [smallScreen, setSmallScreen] = useState(false);
  const t = (b: Bi) => (lang === "id" ? b.id : b.en);
  const tipId = "present-launcher-tip";

  return (
    <>
      <style>{`
        .present-launcher { position: relative; display: inline-flex; }
        .present-launcher a { width: 36px; height: 36px; border-radius: 999px; display: inline-flex; align-items: center; justify-content: center; background: oklch(18% 0.09 260); border: 1px solid oklch(100% 0 0 / 0.14); transition: background 0.2s ease, border-color 0.2s ease; }
        .present-launcher a:hover, .present-launcher a:focus-visible { background: oklch(65% 0.15 45 / 0.22); border-color: ${amber}; outline: none; }
        .present-launcher-tip { position: absolute; right: 0; top: calc(100% + 10px); z-index: 20; width: min(300px, calc(100vw - 48px)); padding: 14px 16px; border-radius: 10px; background: oklch(99.5% 0.002 80); box-shadow: 0 12px 32px oklch(0% 0 0 / 0.3); opacity: 0; transform: translateY(-6px); pointer-events: none; transition: opacity 0.2s ease, transform 0.2s ease; text-align: left; font-family: var(--font-montserrat), Montserrat, sans-serif; }
        .present-launcher:hover .present-launcher-tip, .present-launcher:focus-within .present-launcher-tip { opacity: 1; transform: translateY(0); }
        @media (prefers-reduced-motion: reduce) { .present-launcher-tip { transition: none; transform: none; } }
      `}</style>
      <div className="present-launcher">
        <Link href={href}
          aria-label={lang === "id" ? "Buka slideshow" : "Open the slideshow"}
          aria-describedby={tipId}
          onClick={e => { if (window.innerWidth < 768) { e.preventDefault(); setSmallScreen(true); } }}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={amber} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><rect x="3" y="4" width="18" height="12" rx="2" /><path d="M12 16v4M8 20h8" /></svg>
        </Link>
        <div id={tipId} role="tooltip" className="present-launcher-tip">
          <p style={{ margin: "0 0 4px", fontSize: 14, fontWeight: 700, color: navy }}>{t(title)}</p>
          <p style={{ margin: 0, fontSize: 13, lineHeight: 1.5, color: subText }}>{t(text)}</p>
        </div>
      </div>

      {smallScreen && (
        <div role="dialog" aria-modal="true" aria-labelledby="present-small-title" onClick={() => setSmallScreen(false)}
          style={{ position: "fixed", inset: 0, zIndex: 1000, background: "oklch(14% 0.05 260 / 0.6)", display: "flex", alignItems: "center", justifyContent: "center", padding: 24 }}>
          <div onClick={e => e.stopPropagation()}
            style={{ background: "oklch(99.5% 0.002 80)", borderRadius: 16, padding: "28px 24px", maxWidth: 340, textAlign: "center", boxShadow: "0 20px 60px oklch(0% 0 0 / 0.3)", fontFamily: "Montserrat, sans-serif" }}>
            <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke={amber} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" style={{ display: "block", margin: "0 auto 14px" }}>
              <rect x="3" y="4" width="18" height="12" rx="2" /><path d="M12 16v4M8 20h8" />
            </svg>
            <p id="present-small-title" style={{ fontFamily: "Cormorant Garamond, Georgia, serif", fontSize: 24, fontWeight: 600, color: navy, margin: "0 0 8px", lineHeight: 1.2 }}>
              {lang === "id" ? "Butuh layar yang lebih besar" : "A bigger screen is needed"}
            </p>
            <p style={{ fontSize: 14, lineHeight: 1.6, color: subText, margin: "0 0 20px" }}>
              {lang === "id"
                ? "Mode presentasi berfungsi di tablet atau komputer. Buka modul ini di sana untuk menampilkan slide."
                : "Presentation mode works on a tablet or computer. Open this module there to show the slides."}
            </p>
            <button type="button" onClick={() => setSmallScreen(false)} autoFocus
              style={{ minHeight: 44, padding: "0 24px", borderRadius: 8, border: "none", background: navy, color: "oklch(99.5% 0.002 80)", fontWeight: 700, fontSize: 14, cursor: "pointer", fontFamily: "Montserrat, sans-serif" }}>
              OK
            </button>
          </div>
        </div>
      )}
    </>
  );
}

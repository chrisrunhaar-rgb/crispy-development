"use client";

import Link from "next/link";

// Small one-pager launcher, the image twin of PresentLauncher. Pass it to
// <LangToggle extra={...} /> next to PresentLauncher. Click opens the image
// viewer with save, print and download (components/OnePagerViewer).

type Lang = "en" | "id";
type Bi = { en: string; id: string };

const navy = "oklch(22% 0.10 260)";
const amber = "oklch(65% 0.15 45)";
const subText = "oklch(52% 0.008 260)";

export default function OnePagerLauncher({ href, lang, title, text }: { href: string; lang: Lang; title: Bi; text: Bi }) {
  const t = (b: Bi) => (lang === "id" ? b.id : b.en);
  const tipId = "onepager-launcher-tip";

  return (
    <>
      <style>{`
        .onepager-launcher { position: relative; display: inline-flex; }
        .onepager-launcher a { width: 36px; height: 36px; border-radius: 999px; display: inline-flex; align-items: center; justify-content: center; background: oklch(18% 0.09 260); border: 1px solid oklch(100% 0 0 / 0.14); transition: background 0.2s ease, border-color 0.2s ease; }
        .onepager-launcher a:hover, .onepager-launcher a:focus-visible { background: oklch(65% 0.15 45 / 0.22); border-color: ${amber}; outline: none; }
        .onepager-launcher-tip { position: absolute; right: 0; top: calc(100% + 10px); z-index: 20; width: min(300px, calc(100vw - 48px)); padding: 14px 16px; border-radius: 10px; background: oklch(99.5% 0.002 80); box-shadow: 0 12px 32px oklch(0% 0 0 / 0.3); opacity: 0; transform: translateY(-6px); pointer-events: none; transition: opacity 0.2s ease, transform 0.2s ease; text-align: left; font-family: var(--font-montserrat), Montserrat, sans-serif; }
        .onepager-launcher:hover .onepager-launcher-tip, .onepager-launcher:focus-within .onepager-launcher-tip { opacity: 1; transform: translateY(0); }
        @media (prefers-reduced-motion: reduce) { .onepager-launcher-tip { transition: none; transform: none; } }
      `}</style>
      <div className="onepager-launcher">
        <Link href={href}
          aria-label={lang === "id" ? "Buka gambar ringkasan" : "Open the one-page summary"}
          aria-describedby={tipId}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={amber} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><rect x="3" y="3" width="18" height="18" rx="2" /><circle cx="8.5" cy="8.5" r="1.5" /><path d="M21 15l-5-5L5 21" /></svg>
        </Link>
        <div id={tipId} role="tooltip" className="onepager-launcher-tip">
          <p style={{ margin: "0 0 4px", fontSize: 14, fontWeight: 700, color: navy }}>{t(title)}</p>
          <p style={{ margin: 0, fontSize: 13, lineHeight: 1.5, color: subText }}>{t(text)}</p>
        </div>
      </div>
    </>
  );
}

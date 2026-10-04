"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

// Phone support shared by every resources/<slug>/present slideshow.
// Android: PRESENT goes full screen and locks to landscape on the tap itself.
// iPhone: Safari allows neither, so a portrait phone sees a "turn your phone"
// screen and the slides fill the landscape view once it is rotated.

type Lang = "en" | "id";

const navy = "oklch(22% 0.10 260)";
const orange = "oklch(65% 0.15 45)";
const offWhite = "oklch(97% 0.01 80)";

// Portrait phones get the rotate screen; landscape phones get the slides
export const PHONE_PORTRAIT_QUERY = "(max-width: 767px) and (orientation: portrait)";
const PHONE_QUERY = "(max-width: 767px), (max-height: 500px) and (pointer: coarse)";

export function isPhone() {
  return typeof window !== "undefined" && window.matchMedia(PHONE_QUERY).matches;
}

// Full screen, then turn to landscape where the browser allows it (Android).
// Must run inside a tap so the browser accepts it.
export function enterPresentFullscreen(el?: HTMLElement | null) {
  const target = el ?? document.documentElement;
  if (!target.requestFullscreen || document.fullscreenElement) return;
  target.requestFullscreen()
    .then(() => (screen.orientation as ScreenOrientation & { lock?: (o: string) => Promise<void> })?.lock?.("landscape"))
    .catch(() => {});
}

// Call from a PRESENT link's onClick: on phones, go full screen + landscape
// before the slideshow page opens.
export function presentLinkTap() {
  if (isPhone()) enterPresentFullscreen();
}

// Inside a slideshow: true on phones (so the stage drops its margin), keeps
// isFull in sync, and leaves full screen when the slideshow closes so the
// module page behind it isn't stuck full screen.
export function usePresentPhone(onFullChange?: (full: boolean) => void) {
  const [phone, setPhone] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia(PHONE_QUERY);
    const upd = () => setPhone(mq.matches);
    upd();
    mq.addEventListener("change", upd);
    const onFull = () => onFullChange?.(!!document.fullscreenElement);
    onFull();
    document.addEventListener("fullscreenchange", onFull);
    return () => {
      mq.removeEventListener("change", upd);
      document.removeEventListener("fullscreenchange", onFull);
      if (document.fullscreenElement) document.exitFullscreen?.().catch(() => {});
    };
  }, [onFullChange]);
  return phone;
}

export function PresentRotateNotice({ lang, moduleHref }: { lang: Lang; moduleHref: string }) {
  const [canFull, setCanFull] = useState(false);
  useEffect(() => { setCanFull(!!document.fullscreenEnabled && !document.fullscreenElement); }, []);
  const t = (en: string, id: string) => (lang === "id" ? id : en);

  return (
    <div style={{ position: "fixed", inset: 0, zIndex: 1000, background: navy, display: "flex", alignItems: "center", justifyContent: "center", padding: 24, fontFamily: "var(--font-montserrat), Montserrat, sans-serif" }}>
      <style>{`
        .pp-turn { animation: ppTurn 2.4s ease-in-out infinite; transform-origin: center; }
        @keyframes ppTurn { 0%, 25% { transform: rotate(0deg); } 55%, 100% { transform: rotate(-90deg); } }
        @media (prefers-reduced-motion: reduce) { .pp-turn { animation: none; transform: rotate(-90deg); } }
      `}</style>
      <div style={{ maxWidth: 340, textAlign: "center" }}>
        <svg className="pp-turn" width="56" height="56" viewBox="0 0 24 24" fill="none" stroke={orange} strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" style={{ display: "block", margin: "0 auto 24px" }}>
          <rect x="7" y="2" width="10" height="20" rx="2" /><path d="M11 18h2" />
        </svg>
        <p style={{ fontFamily: "var(--font-cormorant), 'Cormorant Garamond', Georgia, serif", fontSize: 30, fontWeight: 600, color: offWhite, margin: "0 0 12px", lineHeight: 1.2 }}>
          {t("Turn your phone sideways", "Putar ponsel Anda ke samping")}
        </p>
        <p style={{ fontSize: 15, lineHeight: 1.6, color: "oklch(82% 0.03 80)", margin: "0 0 28px" }}>
          {t("The slides fill the screen in landscape.", "Slide memenuhi layar dalam posisi mendatar.")}
        </p>
        {canFull && (
          <button type="button" onClick={() => enterPresentFullscreen()}
            style={{ display: "flex", alignItems: "center", justifyContent: "center", width: "100%", minHeight: 48, marginBottom: 12, borderRadius: 8, border: "none", background: orange, color: "white", fontWeight: 700, fontSize: 15, cursor: "pointer", fontFamily: "inherit" }}>
            {t("Start full screen", "Mulai layar penuh")}
          </button>
        )}
        <Link href={moduleHref} style={{ display: "inline-flex", alignItems: "center", justifyContent: "center", minHeight: 44, padding: "0 22px", color: offWhite, fontWeight: 700, fontSize: 14, textDecoration: "underline" }}>
          {t("Back to the module", "Kembali ke modul")}
        </Link>
      </div>
    </div>
  );
}

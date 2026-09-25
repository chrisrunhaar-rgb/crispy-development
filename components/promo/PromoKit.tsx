"use client";

import { useEffect, useRef, useState, type CSSProperties, type ReactNode } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

/* ─────────────────────────────────────────────────────────────────────────────
   Shared building blocks for the light promo pages (home, WayPoint).
   Same visual system as the Personal and Team pathway pages.
   ───────────────────────────────────────────────────────────────────────── */
export const T = {
  navy: "oklch(30% 0.12 260)",
  navyDeep: "oklch(22% 0.10 260)",
  navyMid: "oklch(38% 0.11 260)",
  orange: "oklch(65% 0.15 45)",
  orangeDeep: "oklch(58% 0.16 45)",
  offWhite: "oklch(97% 0.005 80)",
  band: "oklch(90.5% 0.012 80)",
  rule: "oklch(84% 0.01 80)",
  ruleOnBand: "oklch(79% 0.012 80)",
  charcoal: "oklch(22% 0.005 260)",
  body: "oklch(38% 0.007 260)",
  muted: "oklch(48% 0.04 260)",
  onNavy: "oklch(97% 0.005 80)",
  onNavyBody: "oklch(87% 0.025 260)",
  onNavyMuted: "oklch(78% 0.04 260)",
};
export const SERIF = "var(--font-cormorant), Georgia, serif";
export const SANS = "var(--font-montserrat), system-ui, sans-serif";

export const KIT_CSS = `
.pk-rise { animation: pk-rise 0.8s cubic-bezier(0.22, 1, 0.36, 1) both; }
@keyframes pk-rise { from { opacity: 0; transform: translateY(14px); } to { opacity: 1; transform: none; } }
.pk-btn { transition: background-color 0.2s ease, transform 0.15s ease; }
.pk-btn:hover { background-color: ${T.navyMid} !important; }
.pk-btn-orange:hover { background-color: oklch(52% 0.15 45) !important; }
.pk-btn-light:hover { background-color: oklch(90% 0.012 80) !important; }
.pk-btn:active { transform: translateY(1px); }
.pk-btn:focus-visible, .pk-link:focus-visible { outline: 2px solid ${T.orange}; outline-offset: 3px; }
.pk-link { text-decoration: underline; text-decoration-color: ${T.orange}; text-decoration-thickness: 1.5px; text-underline-offset: 0.3em; transition: color 0.2s ease; }
.pk-link:hover { color: ${T.navyMid} !important; }
@media (prefers-reduced-motion: reduce) {
  .pk-rise { animation: none; }
  .pk-btn, .pk-link { transition: none; }
}
`;

export function Eyebrow({ children, onDark = false }: { children: ReactNode; onDark?: boolean }) {
  return (
    <p style={{ display: "flex", alignItems: "center", gap: "0.75rem", margin: 0, fontFamily: SANS, fontSize: "0.68rem", fontWeight: 700, letterSpacing: "0.18em", textTransform: "uppercase", color: onDark ? T.onNavyMuted : T.muted }}>
      <span aria-hidden="true" style={{ display: "block", width: "1.75rem", height: "2px", background: T.orange, flexShrink: 0 }} />
      {children}
    </p>
  );
}

export const h2Style = (onDark = false): CSSProperties => ({
  fontFamily: SERIF, fontStyle: "italic", fontWeight: 500,
  fontSize: "clamp(1.9rem, 3.6vw, 2.75rem)", lineHeight: 1.12,
  color: onDark ? T.onNavy : T.navy, margin: 0, textWrap: "balance",
});

export const bodyStyle: CSSProperties = { fontFamily: SANS, fontSize: "0.97rem", lineHeight: 1.75, color: T.body, margin: 0, maxWidth: "66ch" };

export function Caption({ children, onDark = false }: { children: ReactNode; onDark?: boolean }) {
  return (
    <figcaption style={{ fontFamily: SERIF, fontStyle: "italic", fontSize: "1.1rem", lineHeight: 1.45, color: onDark ? T.onNavyBody : T.body, maxWidth: "52ch", marginTop: "1rem" }}>
      {children}
    </figcaption>
  );
}

export function BrowserFrame({ aspect, url = "crispyleaders.com/dashboard", children }: { aspect: string; url?: string; children: ReactNode }) {
  return (
    <div style={{
      borderRadius: "10px", overflow: "hidden", background: T.offWhite,
      border: `1px solid oklch(30% 0.12 260 / 0.18)`,
      boxShadow: "0 40px 70px -40px oklch(30% 0.12 260 / 0.45), 0 2px 6px oklch(30% 0.12 260 / 0.06)",
    }}>
      <div aria-hidden="true" style={{ display: "flex", alignItems: "center", gap: "0.75rem", height: "2.1rem", padding: "0 0.875rem", background: "oklch(93.5% 0.008 80)", borderBottom: "1px solid oklch(87% 0.01 80)" }}>
        <span style={{ display: "flex", gap: "0.35rem" }}>
          {[0, 1, 2].map(i => <span key={i} style={{ width: 8, height: 8, borderRadius: "50%", background: "oklch(79% 0.012 80)" }} />)}
        </span>
        <span style={{ flex: 1, maxWidth: "16rem", margin: "0 auto", height: "1.2rem", borderRadius: "0.6rem", background: "oklch(97% 0.005 80)", fontFamily: SANS, fontSize: "0.6rem", lineHeight: "1.2rem", color: T.muted, textAlign: "center", overflow: "hidden", whiteSpace: "nowrap" }}>
          {url}
        </span>
        <span style={{ width: "2.2rem" }} />
      </div>
      <div style={{ position: "relative", aspectRatio: aspect }}>{children}</div>
    </div>
  );
}

export function PhoneFrame({ src, alt, aspect = "540 / 1080", maxWidth = "15rem", priority = false }: { src: string; alt: string; aspect?: string; maxWidth?: string; priority?: boolean }) {
  return (
    <div style={{
      width: "100%", maxWidth, margin: "0 auto", padding: "0.5rem", borderRadius: "2rem",
      background: "oklch(16% 0.04 260)", boxShadow: "0 0 0 1px oklch(97% 0.005 80 / 0.14), 0 40px 70px -30px oklch(0% 0 0 / 0.55)",
    }}>
      <div style={{ position: "relative", aspectRatio: aspect, borderRadius: "1.55rem", overflow: "hidden" }}>
        <Image src={src} alt={alt} fill priority={priority} sizes="240px" style={{ objectFit: "cover", objectPosition: "top" }} />
      </div>
    </div>
  );
}

export type PromoVideo = { webm: string; mp4: string; poster: string };

/* Sources attach only once the clip nears the viewport */
export function LazyVideo({ video, label }: { video: PromoVideo; label: string }) {
  const ref = useRef<HTMLVideoElement>(null);
  const [load, setLoad] = useState(false);
  const [still, setStill] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    setStill(window.matchMedia("(prefers-reduced-motion: reduce)").matches);
    if (typeof IntersectionObserver === "undefined") { setLoad(true); return; }
    const io = new IntersectionObserver(entries => {
      if (entries.some(e => e.isIntersecting)) { setLoad(true); io.disconnect(); }
    }, { rootMargin: "200px" });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  useEffect(() => {
    const el = ref.current;
    if (!load || !el) return;
    el.load();
    if (!still) el.play().catch(() => {});
  }, [load, still]);

  return (
    <video
      ref={ref}
      aria-label={label}
      poster={video.poster}
      muted
      loop
      playsInline
      controls={still}
      preload="none"
      style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", objectPosition: "top", display: "block" }}
    >
      {load && <source src={video.webm} type="video/webm" />}
      {load && <source src={video.mp4} type="video/mp4" />}
    </video>
  );
}

type Tone = "navy" | "orange" | "light";
export function PrimaryLink({ href, children, tone = "navy" }: { href: string; children: ReactNode; tone?: Tone }) {
  const bg = tone === "orange" ? T.orangeDeep : tone === "light" ? T.offWhite : T.navy;
  const fg = tone === "light" ? T.navyDeep : T.onNavy;
  return (
    <Link href={href} className={`pk-btn${tone === "orange" ? " pk-btn-orange" : tone === "light" ? " pk-btn-light" : ""}`} style={{
      display: "inline-flex", alignItems: "center", gap: "0.75rem", minHeight: 48,
      padding: "0.875rem 1.5rem", background: bg, color: fg,
      fontFamily: SANS, fontSize: "0.8rem", fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase",
      textDecoration: "none", borderRadius: 2,
    }}>
      {children}
      <ArrowRight aria-hidden="true" size={16} strokeWidth={2} />
    </Link>
  );
}

export function TextLink({ href, children, onDark = false }: { href: string; children: ReactNode; onDark?: boolean }) {
  return (
    <Link href={href} className="pk-link" style={{ fontFamily: SANS, fontSize: "0.9rem", fontWeight: 600, color: onDark ? T.onNavy : T.navy }}>
      {children}
    </Link>
  );
}

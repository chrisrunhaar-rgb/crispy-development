"use client";

import Image from "next/image";
import Link from "next/link";
import { useState, useEffect, useRef } from "react";
import { useLanguage } from "@/lib/LanguageContext";

export default function HomeContent() {
  const { t, lang } = useLanguage();
  const h = t.home;
  const [activeTile, setActiveTile] = useState<number | null>(null);
  const reasonRefs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    const obs = new IntersectionObserver(
      (entries) => entries.forEach((e) => {
        if (e.isIntersecting) e.target.classList.add("reason-visible");
        else e.target.classList.remove("reason-visible");
      }),
      { threshold: 0.15, rootMargin: "0px 0px -40px 0px" }
    );
    reasonRefs.current.forEach((el) => { if (el) obs.observe(el); });
    return () => obs.disconnect();
  }, []);

  const freeModules = [
    { slug: "three-thinking-styles",  label: "Framework",  title: "Three Thinking Styles",       hook: "Discover why smart people reach opposite conclusions.",         bg: "oklch(22% 0.10 260)", text: "oklch(97% 0.005 80)", accent: "oklch(65% 0.15 45)" },
    { slug: "leadership-altitudes",   label: "Model",      title: "Leadership Altitudes",         hook: "Know when to zoom in and when to fly high.",                  bg: "oklch(97% 0.005 80)", text: "oklch(22% 0.10 260)", accent: "oklch(65% 0.15 45)" },
    { slug: "escaping-the-comfort-zone", label: "Challenge",  title: "Escaping the Comfort Zone",    hook: "The zone that feels safe is the one holding you back.",        bg: "oklch(30% 0.12 260)", text: "oklch(97% 0.005 80)", accent: "oklch(65% 0.15 45)" },
    { slug: "karunia-rohani",         label: "Assessment", title: "Spiritual Gifts",               hook: "Find out how God has wired you to serve.",                    bg: "oklch(97% 0.005 80)", text: "oklch(22% 0.10 260)", accent: "oklch(65% 0.15 45)" },
  ];

  const mockItems = [
    { title: "Three Thinking Styles", done: true },
    { title: "Leadership Altitudes", done: false, active: true },
    { title: "Escaping the Comfort Zone", done: false },
    { title: "Building Trust Across Cultures", done: false },
  ];

  return (
    <>
      {/* ── HERO ── */}
      <section style={{ background: "oklch(22% 0.10 260)", paddingTop: "clamp(5rem, 9vw, 9rem)", paddingBottom: "clamp(5rem, 9vw, 9rem)", position: "relative", overflow: "hidden" }}>
        {/* Top orange rule */}
        <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: "3px", background: "oklch(65% 0.15 45)" }} />

        {/* Dot grid */}
        <div aria-hidden="true" style={{ position: "absolute", inset: 0, backgroundImage: "radial-gradient(circle, oklch(97% 0.005 80 / 0.07) 1px, transparent 1px)", backgroundSize: "28px 28px", pointerEvents: "none" }} />

        {/* Concentric arcs */}
        <div aria-hidden="true" style={{ position: "absolute", bottom: "-180px", right: "-180px", width: "520px", height: "520px", borderRadius: "50%", border: "1px solid oklch(97% 0.005 80 / 0.06)", pointerEvents: "none" }}>
          <div style={{ position: "absolute", top: "70px", left: "70px", right: "70px", bottom: "70px", borderRadius: "50%", border: "1px solid oklch(97% 0.005 80 / 0.06)" }}>
            <div className="animate-arc-pulse" style={{ position: "absolute", top: "70px", left: "70px", right: "70px", bottom: "70px", borderRadius: "50%", border: "1px solid oklch(65% 0.15 45 / 0.18)" }} />
          </div>
        </div>

        <div className="container-wide" style={{ position: "relative" }}>
          {/* Compass mark — outer div centers (translateY), inner div carries the rotation animations */}
          <div aria-hidden="true" style={{ position: "absolute", right: "0", top: "50%", transform: "translateY(-50%)", width: "min(42vw, 420px)", height: "min(42vw, 420px)", pointerEvents: "none", mixBlendMode: "screen", opacity: 0.55 }}>
            <div className="animate-compass" style={{ position: "absolute", inset: 0 }}>
              <Image src="/logo-icon.png" alt="" fill style={{ objectFit: "contain" }} priority />
            </div>
          </div>

          <div style={{ maxWidth: "640px", position: "relative" }}>
            {/* Eyebrow */}
            <div style={{ display: "flex", alignItems: "center", gap: "0.875rem", marginBottom: "2rem" }}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/logo-icon-dark-badge.png" alt="Crispy Development" width={28} height={28} style={{ flexShrink: 0, display: "block" }} />
              <p className="animate-fade-up" style={{ fontFamily: "var(--font-montserrat)", fontWeight: 700, fontSize: "0.7rem", letterSpacing: "0.2em", textTransform: "uppercase", color: "oklch(65% 0.15 45)", margin: 0 }}>
                {h.label}
              </p>
            </div>
            {/* Accent rule */}
            <div style={{ width: "48px", height: "2px", background: "oklch(65% 0.15 45)", marginBottom: "1.75rem" }} />

            <h1 className="t-hero animate-fade-up animate-delay-1" style={{ fontFamily: "var(--font-cormorant)", fontStyle: "italic", fontWeight: 600, color: "oklch(97% 0.005 80)", margin: "0 0 1.75rem" }}>
              {h.h1a}
            </h1>
            <p className="t-tagline animate-fade-up animate-delay-2" style={{ color: "oklch(82% 0.03 260)", marginBottom: "2.75rem", maxWidth: "52ch" }}>
              {h.tagline}
            </p>
            <Link href="/membership" className="btn-primary animate-fade-up animate-delay-3" style={{ fontSize: "0.875rem", minHeight: "48px", display: "inline-flex", alignItems: "center" }}>
              {h.heroCta ?? "Apply for membership →"}
            </Link>
          </div>
        </div>
      </section>

      {/* ── PATHWAYS ── */}
      <section style={{ paddingBlock: "clamp(4rem, 7vw, 7rem)", background: "oklch(97% 0.005 80)" }}>
        <div className="container-wide">
          <div style={{ marginBottom: "3.5rem", maxWidth: "560px" }}>
            <p className="t-label" style={{ color: "oklch(65% 0.15 45)", marginBottom: "0.875rem" }}>{h.pathwaysLabel}</p>
            <h2 className="t-section">{h.pathwaysHeading.split("\n").map((line, i) => <span key={i}>{line}{i === 0 && <br />}</span>)}</h2>
          </div>

          {/* 2 square tiles */}
          {(() => {
            const pathways = [
              { href: "/personal", image: "/pathway-team.jpg", imagePosition: "center 30%", badgeLabel: h.personalBadge, heading: h.personalHeading, body: h.personalBody, features: h.personalFeatures, ctaLabel: h.personalCta },
              { href: "/team", image: "/pathway-personal.jpg", imagePosition: "center 25%", badgeLabel: h.teamBadge, heading: h.teamHeading, body: h.teamBody, features: h.teamFeatures, ctaLabel: h.teamCta },
            ];
            const active = activeTile !== null ? pathways[activeTile] : null;
            return (
              <>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: "2px", background: "oklch(88% 0.008 80)" }}>
                  {pathways.map((p, i) => (
                    <button
                      key={i}
                      type="button"
                      onClick={() => setActiveTile(activeTile === i ? null : i)}
                      style={{
                        position: "relative",
                        height: "clamp(140px, 22vw, 300px)",
                        overflow: "hidden",
                        cursor: "pointer",
                        border: "none",
                        padding: 0,
                        display: "block",
                        width: "100%",
                        background: "oklch(22% 0.10 260)",
                      }}
                    >
                      <Image
                        src={p.image}
                        alt={p.heading}
                        fill
                        style={{ objectFit: "cover", objectPosition: p.imagePosition, transition: "transform 0.4s ease", transform: activeTile === i ? "scale(1.04)" : "scale(1)" }}
                      />
                      <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to bottom, transparent 25%, oklch(22% 0.10 260 / 0.55) 55%, oklch(22% 0.10 260 / 0.92) 100%)" }} />
                      <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, padding: "clamp(0.75rem, 2vw, 1.25rem)", textAlign: "left" }}>
                        <p style={{ fontFamily: "var(--font-kalam)", fontWeight: 700, fontSize: "clamp(0.85rem, 1.8vw, 1.2rem)", color: "oklch(65% 0.15 45)", margin: "0 0 0.2rem", lineHeight: 1 }}>
                          {p.badgeLabel}
                        </p>
                        <h3 style={{ fontFamily: "var(--font-montserrat)", fontWeight: 800, fontSize: "clamp(0.8rem, 1.6vw, 1.1rem)", color: "oklch(97% 0.005 80)", margin: 0, lineHeight: 1.2, letterSpacing: "-0.01em" }}>
                          {p.heading}
                        </h3>
                      </div>
                      {/* Active indicator */}
                      {activeTile === i && (
                        <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, height: "3px", background: "oklch(65% 0.15 45)" }} />
                      )}
                    </button>
                  ))}
                </div>

                {/* Detail panel */}
                {active && (
                  <div style={{ background: "oklch(22% 0.10 260)", borderTop: "3px solid oklch(65% 0.15 45)", padding: "clamp(1.5rem, 4vw, 2.5rem)" }}>
                    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: "2rem", alignItems: "start" }}>
                      <p style={{ fontFamily: "var(--font-montserrat)", fontSize: "0.9375rem", lineHeight: 1.75, color: "oklch(72% 0.04 260)", margin: 0 }}>
                        {active.body}
                      </p>
                      <div>
                        <ul style={{ listStyle: "none", padding: 0, margin: "0 0 1.5rem", display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                          {active.features.slice(0, 3).map((item: string) => (
                            <li key={item} style={{ display: "flex", gap: "0.625rem", fontSize: "0.8125rem", color: "oklch(62% 0.008 260)", alignItems: "flex-start" }}>
                              <span style={{ color: "oklch(65% 0.15 45)", fontWeight: 700, flexShrink: 0, marginTop: "0.1em" }}>✓</span>
                              {item}
                            </li>
                          ))}
                        </ul>
                        <Link href={active.href} className="btn-primary" style={{ fontSize: "0.8rem" }}>
                          {active.ctaLabel} →
                        </Link>
                      </div>
                    </div>
                  </div>
                )}
              </>
            );
          })()}
        </div>
      </section>

      {/* ── PLATFORM PREVIEW ── */}
      <section style={{ background: "oklch(22% 0.10 260)", paddingBlock: "clamp(4rem, 6vw, 6rem)", overflow: "hidden" }}>
        <div className="container-wide">
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "clamp(2rem, 5vw, 5rem)", alignItems: "center" }}>
            <div>
              <p className="t-label" style={{ color: "oklch(65% 0.15 45)", marginBottom: "1rem", fontSize: "0.62rem" }}>{h.platformLabel}</p>
              <h2 className="t-section" style={{ color: "oklch(97% 0.005 80)", marginBottom: "1.5rem" }}>
                {h.platformHeading.split("\n").map((line, i) => <span key={i}>{line}{i === 0 && <br />}</span>)}
              </h2>
              <p style={{ fontFamily: "var(--font-montserrat)", fontSize: "0.9375rem", lineHeight: 1.7, color: "oklch(72% 0.04 260)", maxWidth: "44ch", marginBottom: "2rem" }}>{h.platformBody}</p>
              <Link href="/resources" className="btn-primary">{h.platformCta} <span style={{ fontSize: "0.9em" }}>→</span></Link>
            </div>
            <div>
              <div style={{ borderRadius: "6px", overflow: "hidden", boxShadow: "0 32px 64px oklch(10% 0.08 260 / 0.5)" }}>
                <img
                  src="/dashboard-personal.jpg"
                  alt={lang === "id" ? "Contoh dasbor pribadi" : "Personal dashboard preview"}
                  style={{ width: "100%", display: "block" }}
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── CHALLENGE FEATURE SECTION ── */}
      <section style={{ background: "oklch(15% 0.085 262)", paddingBlock: "clamp(3.5rem, 6vw, 5.5rem)", position: "relative", overflow: "hidden" }}>
        {/* Iceberg — atmospheric right-side element */}
        <div
          aria-hidden="true"
          style={{
            position: "absolute", top: 0, right: 0, bottom: 0,
            width: "clamp(260px, 42vw, 560px)",
            pointerEvents: "none",
            overflow: "hidden",
          }}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/iceberg-full.jpg"
            alt=""
            style={{
              width: "100%", height: "100%",
              objectFit: "cover", objectPosition: "center 40%",
              display: "block", opacity: 0.18,
            }}
          />
          {/* Fade left edge of iceberg into the section bg */}
          <div style={{
            position: "absolute", inset: 0,
            background: "linear-gradient(to right, oklch(15% 0.085 262) 0%, oklch(15% 0.085 262 / 0.6) 35%, transparent 70%)",
          }} />
        </div>

        {/* Top accent rule */}
        <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: "2px", background: "oklch(65% 0.15 45 / 0.5)" }} />

        <div className="container-wide" style={{ position: "relative" }}>
          <div style={{ maxWidth: "620px" }}>
            {/* Eyebrow */}
            <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginBottom: "1.5rem" }}>
              <span style={{
                fontFamily: "var(--font-montserrat)", fontSize: "0.6rem", fontWeight: 800,
                letterSpacing: "0.2em", textTransform: "uppercase",
                color: "oklch(65% 0.15 45)",
                border: "1px solid oklch(65% 0.15 45 / 0.4)",
                padding: "0.28em 0.75em", borderRadius: "3px",
              }}>
                {lang === "id" ? "Gratis" : "Free"}
              </span>
              <span style={{
                fontFamily: "var(--font-montserrat)", fontSize: "0.6rem", fontWeight: 700,
                letterSpacing: "0.16em", textTransform: "uppercase",
                color: "oklch(55% 0.04 260)",
              }}>
                {lang === "id" ? "Tantangan · 60 hari" : "Challenge · 60 days"}
              </span>
            </div>

            {/* Headline */}
            <h2 style={{
              fontFamily: "var(--font-cormorant)", fontStyle: "italic", fontWeight: 600,
              fontSize: "clamp(2rem, 4vw, 3.25rem)", lineHeight: 1.05,
              color: "oklch(97% 0.005 80)", margin: "0 0 1rem",
            }}>
              {lang === "id"
                ? "Kepemimpinan dimulai\ndari dalam."
                : "Leadership starts\non the inside."}
            </h2>

            {/* Body */}
            <p style={{
              fontFamily: "var(--font-montserrat)", fontSize: "0.9rem", lineHeight: 1.75,
              color: "oklch(65% 0.035 260)", margin: "0 0 2rem", maxWidth: "46ch",
            }}>
              {lang === "id"
                ? "Tantangan Kepemimpinan Berpengaruh — perjalanan 60 hari berdasarkan Deep Influence karya T.J. Addington. Untuk pemimpin dan tim yang ingin bertumbuh dari dalam ke luar."
                : "The Influential Leadership Challenge — a 60-day guided journey based on T.J. Addington's Deep Influence. For leaders and teams who want to grow from the inside out."}
            </p>

            {/* CTA */}
            <Link
              href="/influential-leadership-challenge"
              style={{
                display: "inline-flex", alignItems: "center", gap: "0.5rem",
                fontFamily: "var(--font-montserrat)", fontWeight: 800, fontSize: "0.8rem",
                letterSpacing: "0.08em", textTransform: "uppercase",
                color: "oklch(22% 0.10 260)", background: "oklch(65% 0.15 45)",
                padding: "0.875rem 2rem", borderRadius: "4px", textDecoration: "none",
                transition: "background 0.15s ease",
              }}
              onMouseEnter={(e) => { (e.currentTarget as HTMLAnchorElement).style.background = "oklch(60% 0.14 45)"; }}
              onMouseLeave={(e) => { (e.currentTarget as HTMLAnchorElement).style.background = "oklch(65% 0.15 45)"; }}
            >
              {lang === "id" ? "Ikuti Sekarang" : "Join Now"} <span aria-hidden="true">→</span>
            </Link>
          </div>
        </div>
      </section>

      {/* ── WHY JOIN ── */}
      <style>{`
        .reason-tile {
          background: oklch(27% 0.11 260);
          border-radius: 14px;
          border: 1px solid oklch(34% 0.08 260);
          border-top: 3px solid oklch(65% 0.15 45);
          padding: clamp(1.5rem, 3vw, 2.25rem);
          display: flex;
          flex-direction: column;
          gap: 0.875rem;
          cursor: default;
          opacity: 0;
          transform: translateY(36px) scale(0.97);
          transition: opacity 0.5s cubic-bezier(0.22,1,0.36,1), transform 0.5s cubic-bezier(0.22,1,0.36,1), box-shadow 0.25s ease;
          will-change: transform, opacity;
        }
        .reason-tile:hover {
          transform: translateY(-5px) rotate(-0.3deg) scale(1.01) !important;
          box-shadow: 0 16px 40px oklch(8% 0.10 260 / 0.4);
        }
        .reason-tile:nth-child(even):hover { transform: translateY(-5px) rotate(0.3deg) scale(1.01) !important; }
        .reason-visible {
          opacity: 1 !important;
          transform: translateY(0) scale(1) !important;
        }
      `}</style>
      <section style={{ paddingBlock: "clamp(5rem, 8vw, 8rem)", background: "oklch(22% 0.10 260)" }}>
        <div className="container-wide">

          <div style={{ marginBottom: "3rem" }}>
            <p className="t-label" style={{ color: "oklch(65% 0.15 45)", marginBottom: "1rem" }}>
              {h.membershipLabel ?? "Membership"}
            </p>
            <h2 className="t-section" style={{ color: "oklch(97% 0.005 80)", marginBottom: 0, maxWidth: "520px" }}>
              {h.membershipHeading ?? <>Why leaders<br />join this platform.</>}
            </h2>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: "clamp(0.875rem, 1.5vw, 1.25rem)", marginBottom: "3rem" }}>
            {[
              {
                num: "01",
                title: h.reason1Title ?? "Content built for your context",
                body: h.reason1Body ?? "53+ resources and 8 assessments designed specifically for cross-cultural leaders — not generic leadership advice repurposed for a global audience.",
                delay: "0ms",
              },
              {
                num: "02",
                title: h.reason2Title ?? "Finally, someone names your reality",
                body: h.reason2Body ?? "Most leadership content ignores the cross-cultural dimension entirely. This platform is built around the pressures, tensions, and opportunities that come with leading across cultures.",
                delay: "80ms",
              },
              {
                num: "03",
                title: h.reason3Title ?? "A community that understands",
                body: h.reason3Body ?? "Others here have navigated the same tensions. The same expectations, the same re-entry fog, the same question of whether your context is real leadership. This is a room that already knows.",
                delay: "160ms",
              },
              {
                num: "04",
                title: h.reason4Title ?? "A journey, not just content",
                body: h.reason4Body ?? "A personal dashboard with progress tracking, saved assessments, and a structured pathway. Not just resources to consume — a development journey to follow.",
                delay: "240ms",
              },
              {
                num: "05",
                title: h.reason5Title ?? "Simple subscription",
                body: h.reason5Body ?? "Monthly or annual. Full library access, personal dashboard, and WayPoint AI coaching included. Cancel any time.",
                delay: "320ms",
              },
              {
                num: "06",
                title: h.reason6Title ?? "Built for leaders with a calling",
                body: h.reason6Body ?? "Cross-cultural leadership often comes with something deeper than a career goal. This platform takes the spiritual dimension seriously — the calling, the doubt, and the resilience that grows from faith under pressure.",
                delay: "400ms",
              },
            ].map(({ num, title, body, delay }, i) => (
              <div
                key={num}
                ref={(el) => { reasonRefs.current[i] = el; }}
                className="reason-tile"
                style={{ transitionDelay: delay }}
              >
                <span style={{ fontFamily: "var(--font-montserrat)", fontSize: "0.6rem", fontWeight: 800, letterSpacing: "0.14em", color: "oklch(65% 0.15 45 / 0.7)" }}>{num}</span>
                <p style={{ fontFamily: "var(--font-cormorant)", fontStyle: "italic", fontWeight: 600, fontSize: "clamp(1.15rem, 1.8vw, 1.35rem)", lineHeight: 1.2, color: "oklch(97% 0.005 80)", margin: 0 }}>{title}</p>
                <p style={{ fontFamily: "var(--font-montserrat)", fontSize: "0.825rem", lineHeight: 1.75, color: "oklch(70% 0.025 260)", margin: 0 }}>{body}</p>
              </div>
            ))}
          </div>

          <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-start", gap: "1rem" }}>
            <Link href="/pricing" className="btn-primary">
              {h.membershipCta ?? "Join today →"}
            </Link>
            <p style={{ fontFamily: "var(--font-montserrat)", fontSize: "0.775rem", color: "oklch(55% 0.025 260)", lineHeight: 1.6 }}>
              {h.membershipNote ?? "Monthly or annual. Cancel any time."}
            </p>
          </div>

        </div>
      </section>
    </>
  );
}


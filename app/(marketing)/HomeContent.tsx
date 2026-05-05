"use client";

import dynamic from "next/dynamic";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { useLanguage } from "@/lib/LanguageContext";

const LogoRevealPlayer = dynamic(
  () => import("@/components/Animations/LogoRevealPlayer"),
  { ssr: false }
);

export default function HomeContent() {
  const { t } = useLanguage();
  const h = t.home;
  const [activeTile, setActiveTile] = useState<number | null>(null);

  const freeModules = [
    { slug: "three-thinking-styles",  label: "Framework",  title: "Three Thinking Styles",       hook: "Discover why smart people reach opposite conclusions.",         bg: "oklch(22% 0.10 260)", text: "oklch(97% 0.005 80)", accent: "oklch(65% 0.15 45)" },
    { slug: "leadership-altitudes",   label: "Model",      title: "Leadership Altitudes",         hook: "Know when to zoom in and when to fly high.",                  bg: "oklch(97% 0.005 80)", text: "oklch(22% 0.10 260)", accent: "oklch(65% 0.15 45)" },
    { slug: "escaping-the-comfort-zone", label: "Challenge",  title: "Escaping the Comfort Zone",    hook: "The zone that feels safe is the one holding you back.",        bg: "oklch(30% 0.12 260)", text: "oklch(97% 0.005 80)", accent: "oklch(65% 0.15 45)" },
    { slug: "karunia-rohani",         label: "Assessment", title: "Spiritual Giftings",            hook: "Find out how God has wired you to serve.",                    bg: "oklch(97% 0.005 80)", text: "oklch(22% 0.10 260)", accent: "oklch(65% 0.15 45)" },
  ];

  const mockItems = [
    { title: "Three Thinking Styles", done: true },
    { title: "Leadership Altitudes", done: false, active: true },
    { title: "Escaping the Comfort Zone", done: false },
    { title: "Building Trust Across Cultures", done: false },
  ];

  return (
    <>
      <LogoRevealPlayer />
      {/* ── HERO ── */}
      <section style={{ background: "oklch(30% 0.12 260)", paddingTop: "clamp(4rem, 8vw, 8rem)", paddingBottom: "clamp(4rem, 8vw, 8rem)", position: "relative", overflow: "hidden" }}>
        {/* Top orange rule */}
        <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: "3px", background: "oklch(65% 0.15 45)" }} />

        {/* Dot grid */}
        <div aria-hidden="true" style={{ position: "absolute", inset: 0, backgroundImage: "radial-gradient(circle, oklch(97% 0.005 80 / 0.06) 1px, transparent 1px)", backgroundSize: "32px 32px", pointerEvents: "none" }} />

        {/* Concentric arcs */}
        <div aria-hidden="true" style={{ position: "absolute", bottom: "-180px", right: "-180px", width: "520px", height: "520px", borderRadius: "50%", border: "1px solid oklch(97% 0.005 80 / 0.05)", pointerEvents: "none" }}>
          <div style={{ position: "absolute", top: "70px", left: "70px", right: "70px", bottom: "70px", borderRadius: "50%", border: "1px solid oklch(97% 0.005 80 / 0.05)" }}>
            <div style={{ position: "absolute", top: "70px", left: "70px", right: "70px", bottom: "70px", borderRadius: "50%", border: "1px solid oklch(65% 0.15 45 / 0.15)" }} />
          </div>
        </div>

        <div className="container-wide" style={{ position: "relative" }}>
          {/* Compass — constrained within container so it stays close to text on wide screens */}
          <div aria-hidden="true" style={{ position: "absolute", right: "0", top: "50%", transform: "translateY(-50%)", width: "min(42vw, 420px)", height: "min(42vw, 420px)", pointerEvents: "none", mixBlendMode: "screen", opacity: 0.55 }}>
            <Image src="/logo-icon.png" alt="" fill style={{ objectFit: "contain" }} priority />
          </div>

          <div style={{ maxWidth: "640px" }}>
            <p className="t-label animate-fade-up" style={{ color: "oklch(65% 0.15 45)", marginBottom: "1.75rem", fontSize: "0.8rem" }}>
              {h.label}
            </p>
            <h1 className="t-hero animate-fade-up animate-delay-1" style={{ color: "oklch(97% 0.005 80)", marginBottom: "1.5rem" }}>
              {h.h1a}<br />{h.h1b}
            </h1>
            <p className="t-tagline animate-fade-up animate-delay-2" style={{ color: "oklch(78% 0.04 260)", marginBottom: "2.75rem", maxWidth: "52ch" }}>
              {h.tagline}
            </p>
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

          {/* 3 square tiles */}
          {(() => {
            const pathways = [
              { href: "/personal", image: "/pathway-team.jpg", imagePosition: "center 30%", badgeLabel: h.personalBadge, heading: h.personalHeading, body: h.personalBody, features: h.personalFeatures, ctaLabel: h.personalCta },
              { href: "/team", image: "/pathway-personal.jpg", imagePosition: "center 25%", badgeLabel: h.teamBadge, heading: h.teamHeading, body: h.teamBody, features: h.teamFeatures, ctaLabel: h.teamCta },
              { href: "/peer-groups", image: "/pathway-peer.jpg", imagePosition: "center 30%", badgeLabel: h.peerBadge, heading: h.peerHeading, body: h.peerBody, features: h.peerFeatures, ctaLabel: h.peerCta },
            ];
            const active = activeTile !== null ? pathways[activeTile] : null;
            return (
              <>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "2px", background: "oklch(88% 0.008 80)" }}>
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
              {/* Dashboard mockup */}
              <div style={{ background: "oklch(97% 0.005 80)", border: "1px solid oklch(52% 0.008 260 / 0.3)", overflow: "hidden", boxShadow: "0 32px 64px oklch(10% 0.08 260 / 0.5)" }}>
                {/* Header bar */}
                <div style={{ background: "oklch(30% 0.12 260)", padding: "0.875rem 1.25rem", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                  <div>
                    <p style={{ fontFamily: "var(--font-montserrat)", fontSize: "0.55rem", fontWeight: 600, letterSpacing: "0.18em", textTransform: "uppercase", color: "oklch(65% 0.15 45)", marginBottom: "0.2rem" }}>Personal Dashboard</p>
                    <p style={{ fontFamily: "var(--font-montserrat)", fontSize: "0.8rem", fontWeight: 700, color: "oklch(97% 0.005 80)" }}>Welcome back.</p>
                  </div>
                  <div style={{ width: "26px", height: "26px", borderRadius: "50%", background: "oklch(65% 0.15 45)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <span style={{ fontFamily: "var(--font-montserrat)", fontWeight: 800, fontSize: "0.6rem", color: "white" }}>CR</span>
                  </div>
                </div>
                {/* Tab switcher */}
                <div style={{ background: "oklch(28% 0.11 260)", padding: "0.5rem 1.25rem", display: "flex", gap: "0.25rem" }}>
                  {["Personal", "Team", "Peer Group"].map((tab, i) => (
                    <span key={tab} style={{ fontFamily: "var(--font-montserrat)", fontSize: "0.58rem", fontWeight: 700, letterSpacing: "0.06em", textTransform: "uppercase", padding: "0.3rem 0.75rem", borderRadius: 100, background: i === 0 ? "oklch(65% 0.15 45)" : "transparent", color: i === 0 ? "white" : "oklch(52% 0.008 260)", whiteSpace: "nowrap" }}>
                      {tab}
                    </span>
                  ))}
                </div>
                {/* Assessment section */}
                <div style={{ padding: "0.875rem 1.25rem 0.5rem" }}>
                  <p style={{ fontFamily: "var(--font-montserrat)", fontSize: "0.52rem", fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", color: "oklch(52% 0.008 260)", marginBottom: "0.625rem" }}>My Assessment Results</p>
                  <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "0.5rem", marginBottom: "0.75rem" }}>
                    {[
                      { label: "DISC", color: "#C44A2A", done: true },
                      { label: "Wheel", color: "#3b5fa0", done: true },
                      { label: "Thinking", color: "oklch(48% 0.18 300)", done: false },
                      { label: "Gifts", color: "oklch(65% 0.15 45)", done: false },
                    ].map((tile) => (
                      <div key={tile.label} style={{ background: tile.done ? `${tile.color}12` : "oklch(93% 0.005 80)", border: `1px solid ${tile.done ? tile.color + "40" : "oklch(88% 0.008 80)"}`, padding: "0.5rem 0.375rem", display: "flex", flexDirection: "column", alignItems: "center", gap: "0.25rem" }}>
                        <div style={{ width: "22px", height: "22px", borderRadius: "50%", background: tile.done ? tile.color : "oklch(82% 0.006 80)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                          {tile.done && <span style={{ fontSize: "0.5rem", color: "white", fontWeight: 700 }}>✓</span>}
                        </div>
                        <p style={{ fontFamily: "var(--font-montserrat)", fontSize: "0.5rem", fontWeight: 700, color: tile.done ? "oklch(28% 0.008 260)" : "oklch(62% 0.006 260)", textAlign: "center", lineHeight: 1.2 }}>{tile.label}</p>
                      </div>
                    ))}
                  </div>
                </div>
                {/* Journey progress */}
                <div style={{ padding: "0 1.25rem 0.875rem", display: "flex", alignItems: "center", gap: "0.75rem" }}>
                  <div style={{ flex: 1, height: "3px", background: "oklch(88% 0.008 80)" }}>
                    <div style={{ height: "100%", width: "25%", background: "oklch(65% 0.15 45)" }} />
                  </div>
                  <span style={{ fontFamily: "var(--font-montserrat)", fontSize: "0.6rem", fontWeight: 700, color: "oklch(42% 0.008 260)", whiteSpace: "nowrap" }}>2 / 8 {h.mockupProgress}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── ORANGE RULE ── */}
      <div style={{ height: "3px", background: "oklch(65% 0.15 45)" }} />

      {/* ── WHY JOIN ── */}
      <section style={{ paddingBlock: "clamp(5rem, 8vw, 8rem)", background: "oklch(22% 0.10 260)" }}>
        <div className="container-wide">

          <div style={{ marginBottom: "3.5rem" }}>
            <div style={{ display: "inline-flex", alignItems: "center", gap: "0.5rem", background: "oklch(65% 0.15 45 / 0.15)", border: "1px solid oklch(65% 0.15 45 / 0.35)", padding: "0.375rem 0.875rem", marginBottom: "1.25rem" }}>
              <span style={{ fontFamily: "var(--font-montserrat)", fontSize: "0.62rem", fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", color: "oklch(65% 0.15 45)" }}>
                {h.membershipLabel ?? "Membership"}
              </span>
            </div>
            <h2 className="t-section" style={{ color: "oklch(97% 0.005 80)", marginBottom: "1rem", maxWidth: "520px" }}>
              {h.membershipHeading ?? <>Why leaders<br />join this platform.</>}
            </h2>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "1px", background: "oklch(38% 0.06 260)", marginBottom: "3rem" }}>
            {[
              {
                num: "01",
                title: h.reason1Title ?? "Content built for your context",
                body: h.reason1Body ?? "30+ resources and 8 assessments designed specifically for cross-cultural leaders — not generic leadership advice repurposed for a global audience.",
              },
              {
                num: "02",
                title: h.reason2Title ?? "Finally, someone names your reality",
                body: h.reason2Body ?? "Most leadership content ignores the cross-cultural dimension entirely. This platform is built around the pressures, tensions, and opportunities that come with leading across cultures.",
              },
              {
                num: "03",
                title: h.reason3Title ?? "A community that understands",
                body: h.reason3Body ?? "Peer groups with other leaders navigating the same complexity — different countries, same calling. The kind of connection that's hard to find anywhere else.",
              },
              {
                num: "04",
                title: h.reason4Title ?? "A journey, not just content",
                body: h.reason4Body ?? "A personal dashboard with progress tracking, saved assessments, and a structured pathway. Not just resources to consume — a development journey to follow.",
              },
              {
                num: "05",
                title: h.reason5Title ?? "Not open to everyone",
                body: h.reason5Body ?? "Membership is application-based and personally reviewed. That means the community stays focused, the quality stays high, and you know the people around you belong here.",
              },
            ].map(({ num, title, body }) => (
              <div key={num} style={{ background: "oklch(28% 0.11 260)", padding: "clamp(1.5rem, 4vw, 2rem)", display: "flex", flexDirection: "column", gap: "1rem" }}>
                <span style={{ fontFamily: "var(--font-montserrat)", fontSize: "0.62rem", fontWeight: 700, letterSpacing: "0.14em", color: "oklch(65% 0.15 45)" }}>{num}</span>
                <p style={{ fontFamily: "var(--font-montserrat)", fontWeight: 700, fontSize: "0.9375rem", color: "oklch(97% 0.005 80)", margin: 0, lineHeight: 1.3 }}>{title}</p>
                <p style={{ fontFamily: "var(--font-montserrat)", fontSize: "0.8375rem", lineHeight: 1.7, color: "oklch(68% 0.04 260)", margin: 0 }}>{body}</p>
              </div>
            ))}
          </div>

          <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-start", gap: "1rem" }}>
            <Link href="/membership" className="btn-primary">
              {h.membershipCta ?? "Apply for membership →"}
            </Link>
            <p style={{ fontFamily: "var(--font-montserrat)", fontSize: "0.775rem", color: "oklch(52% 0.008 260)", lineHeight: 1.6 }}>
              {h.membershipNote ?? "Free during the early phase. Every application is reviewed personally."}
            </p>
          </div>

        </div>
      </section>
    </>
  );
}


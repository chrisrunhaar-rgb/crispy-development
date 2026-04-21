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

import type { GeoInfo } from "@/lib/geo";

export default function HomeContent({ geo }: { geo?: GeoInfo }) {
  const { t } = useLanguage();
  const h = t.home;
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null);

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

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "1px", background: "oklch(88% 0.008 80)", alignItems: "stretch" }}>

            {/* Personal */}
            <PathwayCard
              href="/personal"
              image="/pathway-team.jpg"
              imagePosition="center 30%"
              badgeLabel={h.personalBadge}
              heading={h.personalHeading}
              body={h.personalBody}
              features={h.personalFeatures}
              ctaLabel={h.personalCta}
            />

            {/* Team */}
            <PathwayCard
              href="/team"
              image="/pathway-personal.jpg"
              imagePosition="center 25%"
              badgeLabel={h.teamBadge}
              heading={h.teamHeading}
              body={h.teamBody}
              features={h.teamFeatures}
              ctaLabel={h.teamCta}
            />

            {/* Peer Group */}
            <PathwayCard
              href="/peer-groups"
              image="/pathway-peer.jpg"
              imagePosition="center 30%"
              badgeLabel={h.peerBadge}
              heading={h.peerHeading}
              body={h.peerBody}
              features={h.peerFeatures}
              ctaLabel={h.peerCta}
            />

          </div>
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
                <div style={{ background: "oklch(30% 0.12 260)", padding: "0.875rem 1.25rem", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                  <div>
                    <p style={{ fontFamily: "var(--font-montserrat)", fontSize: "0.55rem", fontWeight: 600, letterSpacing: "0.18em", textTransform: "uppercase", color: "oklch(65% 0.15 45)", marginBottom: "0.2rem" }}>{h.mockupLabel}</p>
                    <p style={{ fontFamily: "var(--font-montserrat)", fontSize: "0.8rem", fontWeight: 700, color: "oklch(97% 0.005 80)" }}>{h.mockupTitle}</p>
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                    {[0.45, 0.2, 0.1].map((op, i) => (
                      <div key={i} style={{ width: "7px", height: "7px", borderRadius: "50%", background: i === 0 ? "oklch(65% 0.15 45)" : `oklch(52% 0.008 260 / ${op})` }} />
                    ))}
                  </div>
                </div>
                <div style={{ padding: "0.75rem 1.25rem", background: "oklch(93% 0.006 80)", borderBottom: "1px solid oklch(88% 0.008 80)", display: "flex", alignItems: "center", gap: "1rem" }}>
                  <div style={{ flex: 1, height: "3px", background: "oklch(88% 0.008 80)" }}>
                    <div style={{ height: "100%", width: "12.5%", background: "oklch(65% 0.15 45)" }} />
                  </div>
                  <span style={{ fontFamily: "var(--font-montserrat)", fontSize: "0.65rem", fontWeight: 700, color: "oklch(42% 0.008 260)", whiteSpace: "nowrap" }}>1 / 8 {h.mockupProgress}</span>
                </div>
                {mockItems.map((item, i) => (
                  <div key={i} style={{ display: "flex", alignItems: "center", gap: "0.875rem", padding: "0.75rem 1.25rem", borderTop: i === 0 ? "none" : "1px solid oklch(88% 0.008 80)", background: item.active ? "oklch(65% 0.15 45 / 0.05)" : "transparent" }}>
                    <div style={{ width: "24px", height: "24px", flexShrink: 0, background: item.done ? "oklch(65% 0.15 45)" : "oklch(88% 0.008 80)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                      {item.done
                        ? <span style={{ color: "white", fontSize: "0.6rem", fontWeight: 700 }}>✓</span>
                        : <span style={{ fontFamily: "var(--font-montserrat)", fontSize: "0.55rem", fontWeight: 700, color: "oklch(62% 0.006 260)" }}>{String(i + 1).padStart(2, "0")}</span>
                      }
                    </div>
                    <p style={{ fontFamily: "var(--font-montserrat)", fontSize: "0.78rem", fontWeight: item.active ? 700 : 500, color: item.done ? "oklch(62% 0.006 260)" : "oklch(22% 0.005 260)", flex: 1, lineHeight: 1.3 }}>{item.title}</p>
                    {item.active && <span style={{ fontFamily: "var(--font-montserrat)", fontSize: "0.6rem", fontWeight: 700, color: "oklch(65% 0.15 45)", letterSpacing: "0.06em", whiteSpace: "nowrap" }}>{h.mockupRead}</span>}
                  </div>
                ))}
                <div style={{ padding: "0.75rem 1.25rem", borderTop: "1px solid oklch(88% 0.008 80)" }}>
                  <p style={{ fontFamily: "var(--font-montserrat)", fontSize: "0.65rem", color: "oklch(72% 0.006 260)", letterSpacing: "0.06em" }}>{h.mockupMore}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── ORANGE RULE ── */}
      <div style={{ height: "3px", background: "oklch(65% 0.15 45)" }} />

      {/* ── FREE RESOURCES ── */}
      <section style={{ paddingBlock: "clamp(4rem, 7vw, 7rem)", background: "oklch(97% 0.005 80)" }}>
        <div className="container-wide">
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", flexWrap: "wrap", gap: "1.5rem", marginBottom: "3rem" }}>
            <div>
              <p className="t-label" style={{ color: "oklch(65% 0.15 45)", marginBottom: "0.875rem" }}>{h.resourcesLabel}</p>
              <h2 className="t-section" style={{ maxWidth: "480px" }}>
                Four ideas that will<br />change how you lead.
              </h2>
            </div>
            <Link href="/resources" style={{ fontFamily: "var(--font-montserrat)", fontSize: "0.8rem", fontWeight: 600, letterSpacing: "0.06em", color: "oklch(30% 0.12 260)", textDecoration: "none", whiteSpace: "nowrap" }}>
              {h.resourcesLink}
            </Link>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: "1px", background: "oklch(88% 0.008 80)" }}>
            {freeModules.map((m) => (
              <Link
                key={m.slug}
                href={`/resources/${m.slug}`}
                style={{
                  background: m.bg,
                  padding: "clamp(1.5rem, 3vw, 2.25rem)",
                  textDecoration: "none",
                  display: "flex",
                  flexDirection: "column",
                  gap: "0.75rem",
                  minHeight: "180px",
                }}
              >
                <p style={{ fontFamily: "var(--font-montserrat)", fontSize: "0.6rem", fontWeight: 700, letterSpacing: "0.14em", textTransform: "uppercase", color: "oklch(65% 0.15 45)", margin: 0 }}>
                  {m.label}
                </p>
                <h3 style={{ fontFamily: "var(--font-montserrat)", fontWeight: 800, fontSize: "clamp(1rem, 1.5vw + 0.5rem, 1.375rem)", lineHeight: 1.2, color: m.text, margin: 0 }}>
                  {m.title}
                </h3>
                <p style={{ fontFamily: "var(--font-cormorant)", fontSize: "clamp(0.95rem, 1vw + 0.4rem, 1.15rem)", fontStyle: "italic", lineHeight: 1.5, color: m.text, opacity: 0.75, margin: 0, flex: 1 }}>
                  {m.hook}
                </p>
                <span style={{ fontFamily: "var(--font-montserrat)", fontSize: "0.75rem", fontWeight: 700, letterSpacing: "0.06em", color: "oklch(65% 0.15 45)", marginTop: "auto" }}>
                  Explore free →
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── PRICING COMING SOON ── */}
      <section style={{ paddingBlock: "clamp(5rem, 8vw, 8rem)", background: "oklch(22% 0.10 260)" }}>
        <div className="container-wide">
          <div style={{ textAlign: "center", marginBottom: "3.5rem" }}>
            <div style={{ display: "inline-flex", alignItems: "center", gap: "0.5rem", background: "oklch(65% 0.15 45 / 0.15)", border: "1px solid oklch(65% 0.15 45 / 0.35)", padding: "0.375rem 0.875rem", marginBottom: "1.25rem" }}>
              <span style={{ fontFamily: "var(--font-montserrat)", fontSize: "0.62rem", fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", color: "oklch(65% 0.15 45)" }}>
                Launching Soon
              </span>
            </div>
            <h2 className="t-section" style={{ color: "oklch(97% 0.005 80)", marginBottom: "1rem" }}>
              Simple pricing.<br />Serious impact.
            </h2>
            <p style={{ fontFamily: "var(--font-montserrat)", fontSize: "0.9375rem", lineHeight: 1.7, color: "oklch(72% 0.04 260)", maxWidth: "48ch", margin: "0 auto" }}>
              Start free — always. Full access and team tools launch with membership.
            </p>
          </div>

          {(() => {
            const myr = geo?.hasRegionalPricing;
            const plans = [
              {
                id: "free",
                label: "Free",
                badgeLabel: null,
                price: myr ? "RM 0" : "$0",
                priceSuffix: null,
                sub: "Always free · no account needed",
                features: [
                  "4 core leadership modules",
                  "Three Thinking Styles",
                  "Leadership Altitudes",
                  "Comfort Zone + Six Thinking Hats",
                  "1 free assessment — Spiritual Giftings",
                ],
                cta: { href: "/resources", label: "Start free →", style: "outline" as const },
                highlight: false,
              },
              {
                id: "personal",
                label: "Personal",
                badgeLabel: "+ Peer Groups FREE",
                price: myr ? "RM 650" : "$149",
                priceSuffix: "/yr",
                sub: "12 months unlimited access to:",
                features: [
                  "30+ leadership resources",
                  "8 assessments",
                  "Personal leadership journey",
                  "Progress tracking",
                  "New content added monthly",
                  "Peer Groups — included free",
                ],
                cta: null,
                highlight: true,
              },
              {
                id: "team",
                label: "Team",
                badgeLabel: null,
                price: myr ? "RM 2,200" : "$497",
                priceSuffix: "/yr",
                sub: myr ? "Leader + up to 8 members" : "Leader + up to 8 members (worth $1,192)",
                features: [
                  "Full Personal access for all 9",
                  "Full Team Dashboard",
                  "Team Coach support via Chat",
                  "Tailored roadmap — cross-cultural teams",
                  "EN + ID fully supported",
                ],
                cta: null,
                highlight: false,
              },
              {
                id: "coaching",
                label: "Coaching",
                badgeLabel: "Add-on",
                price: myr ? "RM 1,300" : "$297",
                priceSuffix: "/yr",
                sub: "Requires Personal or Team · EN · ID · NL",
                features: [
                  "4 personal development sessions",
                  "Personal development plan",
                  "1-on-1 with Chris",
                  "Cultural context coaching",
                  "Application-based — limited spots",
                ],
                cta: null,
                highlight: false,
              },
            ];

            const anySelected = selectedPlan !== null;

            return (
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: "1px", background: "oklch(42% 0.06 260)", alignItems: "stretch" }}>
                {plans.map((plan) => {
                  const isSelected = selectedPlan === plan.id;
                  const isDimmed = anySelected && !isSelected;

                  return (
                    <div
                      key={plan.id}
                      onClick={() => setSelectedPlan(plan.id === selectedPlan ? null : plan.id)}
                      style={{
                        background: "oklch(28% 0.11 260)",
                        padding: "clamp(1.5rem, 4vw, 2rem)",
                        display: "flex",
                        flexDirection: "column",
                        gap: "1rem",
                        position: "relative",
                        cursor: "pointer",
                        border: isSelected ? "1px solid oklch(65% 0.15 45)" : "1px solid transparent",
                        opacity: isDimmed ? 0.4 : 1,
                        transition: "opacity 0.25s ease, border-color 0.2s ease",
                        outline: "none",
                      }}
                    >
                      {plan.highlight && (
                        <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: "3px", background: "oklch(65% 0.15 45)" }} />
                      )}

                      {/* Label row */}
                      <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", flexWrap: "wrap" }}>
                        <p style={{
                          fontFamily: "var(--font-montserrat)",
                          fontSize: "0.62rem",
                          fontWeight: 700,
                          letterSpacing: "0.12em",
                          textTransform: "uppercase",
                          color: plan.highlight ? "oklch(65% 0.15 45)" : "oklch(55% 0.008 260)",
                          margin: 0,
                        }}>{plan.label}</p>
                        {plan.badgeLabel && plan.id !== "coaching" && (
                          <span style={{ fontFamily: "var(--font-montserrat)", fontSize: "0.55rem", fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", color: "oklch(65% 0.15 45)", background: "oklch(65% 0.15 45 / 0.15)", border: "1px solid oklch(65% 0.15 45 / 0.4)", padding: "0.1rem 0.4rem" }}>
                            {plan.badgeLabel}
                          </span>
                        )}
                        {plan.id === "coaching" && (
                          <span style={{ fontFamily: "var(--font-montserrat)", fontSize: "0.55rem", fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", color: "oklch(68% 0.008 260)", background: "oklch(36% 0.06 260)", border: "1px solid oklch(45% 0.06 260)", padding: "0.1rem 0.4rem" }}>
                            Add-on
                          </span>
                        )}
                      </div>

                      {/* Price row — fixed height so amounts align across cards */}
                      <div style={{ minHeight: "3.5rem" }}>
                        <div style={{ display: "flex", alignItems: "baseline", gap: "0.25rem", marginBottom: "0.25rem" }}>
                          <span style={{ fontFamily: "var(--font-montserrat)", fontWeight: 800, fontSize: "2rem", color: "oklch(97% 0.005 80)" }}>{plan.price}</span>
                          {plan.priceSuffix && (
                            <span style={{ fontFamily: "var(--font-montserrat)", fontSize: "0.8rem", color: "oklch(62% 0.006 260)" }}>{plan.priceSuffix}</span>
                          )}
                        </div>
                        <p style={{ fontFamily: "var(--font-montserrat)", fontSize: "0.8rem", color: "oklch(62% 0.006 260)", margin: 0 }}>{plan.sub}</p>
                      </div>

                      {/* Features — always visible */}
                      <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: "0.5rem", flex: 1 }}>
                        {plan.features.map(f => (
                          <li key={f} style={{ display: "flex", gap: "0.625rem", fontFamily: "var(--font-montserrat)", fontSize: "0.8rem", color: "oklch(72% 0.04 260)", alignItems: "flex-start" }}>
                            <span style={{ color: "oklch(65% 0.15 45)", fontWeight: 700, flexShrink: 0 }}>✓</span>{f}
                          </li>
                        ))}
                        {plan.id === "team" && (
                          <li style={{ display: "flex", gap: "0.625rem", fontFamily: "var(--font-montserrat)", fontSize: "0.8rem", color: "oklch(58% 0.006 260)", alignItems: "flex-start", fontStyle: "italic" }}>
                            <span style={{ color: "oklch(52% 0.008 260)", fontWeight: 700, flexShrink: 0 }}>+</span>NL, FR, ZH coming soon
                          </li>
                        )}
                      </ul>

                      {/* CTA */}
                      {plan.cta ? (
                        <Link
                          href={plan.cta.href}
                          onClick={e => e.stopPropagation()}
                          style={{ fontFamily: "var(--font-montserrat)", fontSize: "0.75rem", fontWeight: 700, letterSpacing: "0.06em", color: "oklch(97% 0.005 80)", textDecoration: "none", border: "1px solid oklch(55% 0.008 260)", padding: "0.5rem 1rem", textAlign: "center" }}
                        >
                          {plan.cta.label}
                        </Link>
                      ) : (
                        <div style={{ fontFamily: "var(--font-montserrat)", fontSize: "0.75rem", fontWeight: 700, letterSpacing: "0.06em", textTransform: "uppercase", color: plan.highlight ? "oklch(65% 0.15 45)" : "oklch(55% 0.008 260)", padding: "0.5rem 1rem", border: `1px solid ${plan.highlight ? "oklch(65% 0.15 45 / 0.4)" : "oklch(42% 0.06 260)"}`, textAlign: "center" }}>
                          Coming Soon
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            );
          })()}

          <p style={{ fontFamily: "var(--font-montserrat)", fontSize: "0.75rem", color: "oklch(52% 0.008 260)", textAlign: "center", marginTop: "1.75rem" }}>
            {geo?.hasRegionalPricing
              ? "Prices shown in MYR · Annual plans only"
              : "Prices shown in USD · Regional pricing available for SE Asia, South Asia & Africa · Annual plans only"
            }
          </p>
        </div>
      </section>
    </>
  );
}

// ── PathwayCard ──────────────────────────────────────────────────────────────

function PathwayCard({
  href, image, imagePosition, badgeLabel, heading, body, features, ctaLabel,
}: {
  href: string; image: string; imagePosition: string;
  badgeLabel: string; heading: string; body: string;
  features: readonly string[]; ctaLabel: string;
}) {
  const [hovered, setHovered] = useState(false);

  return (
    <div style={{ background: "oklch(22% 0.10 260)", display: "flex", flexDirection: "column" }}>
      {/* Image with text overlay */}
      <div style={{ position: "relative", height: "clamp(280px, 28vw, 360px)", overflow: "hidden", flexShrink: 0 }}>
        <Image
          src={image}
          alt={heading}
          fill
          style={{ objectFit: "cover", objectPosition: imagePosition, transition: "transform 0.6s cubic-bezier(0.4, 0, 0.2, 1)" }}
        />
        {/* Strong overlay: transparent top → navy bottom */}
        <div style={{
          position: "absolute", inset: 0,
          background: "linear-gradient(to bottom, transparent 20%, oklch(22% 0.10 260 / 0.65) 55%, oklch(22% 0.10 260) 85%)",
        }} />
        {/* Text sitting on gradient */}
        <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, padding: "clamp(1.25rem, 3vw, 1.75rem)" }}>
          <p style={{
            fontFamily: "var(--font-kalam)",
            fontWeight: 700,
            fontSize: "clamp(1.25rem, 2vw + 0.5rem, 1.625rem)",
            color: "oklch(65% 0.15 45)",
            margin: "0 0 0.375rem",
            lineHeight: 1,
            letterSpacing: "0.01em",
          }}>
            {badgeLabel}
          </p>
          <h3 style={{
            fontFamily: "var(--font-montserrat)",
            fontWeight: 800,
            fontSize: "clamp(1.1rem, 2vw + 0.25rem, 1.5rem)",
            color: "oklch(97% 0.005 80)",
            lineHeight: 1.15,
            margin: 0,
            letterSpacing: "-0.02em",
          }}>
            {heading}
          </h3>
        </div>
      </div>

      {/* Card body */}
      <div style={{ padding: "clamp(1.25rem, 3vw, 1.75rem)", display: "flex", flexDirection: "column", gap: "1.25rem", flex: 1 }}>
        <p style={{ fontFamily: "var(--font-montserrat)", fontSize: "0.875rem", lineHeight: 1.7, color: "oklch(72% 0.04 260)", margin: 0 }}>
          {body}
        </p>
        <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: "0.5rem" }}>
          {features.slice(0, 3).map((item: string) => (
            <li key={item} style={{ display: "flex", gap: "0.625rem", fontSize: "0.8125rem", color: "oklch(62% 0.008 260)", alignItems: "flex-start" }}>
              <span style={{ color: "oklch(65% 0.15 45)", fontWeight: 700, flexShrink: 0, marginTop: "0.1em" }}>✓</span>
              {item}
            </li>
          ))}
        </ul>

        {/* Footstep CTA */}
        <div style={{ marginTop: "auto", paddingTop: "0.5rem" }}>
          <Link
            href={href}
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={() => setHovered(false)}
            style={{
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
              fontFamily: "var(--font-montserrat)",
              fontWeight: 700,
              fontSize: "0.75rem",
              letterSpacing: "0.1em",
              textTransform: "uppercase",
              textDecoration: "none",
              padding: "0.625rem 1.75rem",
              borderRadius: "999px",
              border: "1px solid",
              borderColor: hovered ? "oklch(65% 0.15 45)" : "oklch(45% 0.08 260)",
              background: hovered ? "oklch(65% 0.15 45)" : "transparent",
              color: hovered ? "oklch(97% 0.005 80)" : "oklch(72% 0.04 260)",
              transition: "all 0.2s ease",
              minWidth: "10rem",
            }}
          >
            {hovered ? "Start Your Pathway →" : ctaLabel}
          </Link>
        </div>
      </div>
    </div>
  );
}

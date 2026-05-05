"use client";

import Link from "next/link";
import { useLanguage } from "@/lib/LanguageContext";
import WorldMap from "@/components/WorldMap";

type Group = {
  id: string;
  name: string;
  region: string;
  timezone: string;
  pathway: string;
  max_size: number;
  is_open: boolean;
};

export default function PeerGroupsContent({ groups, ctaHref = "/membership", isMember = false }: { groups: Group[]; ctaHref?: string; isMember?: boolean }) {
  const { t } = useLanguage();
  const p = t.peer;

  return (
    <>
      {/* ── HERO ── */}
      <section style={{ background: "oklch(30% 0.12 260)", paddingTop: "clamp(4rem, 7vw, 7rem)", paddingBottom: "clamp(4rem, 7vw, 7rem)", position: "relative", overflow: "hidden" }}>
        {/* Photo background */}
        <div aria-hidden="true" style={{ position: "absolute", inset: 0, backgroundImage: "url('/pathway-peer.jpg')", backgroundSize: "cover", backgroundPosition: "center 30%", opacity: 0.22, pointerEvents: "none" }} />
        <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: "3px", background: "oklch(65% 0.15 45)" }} />
        <div className="container-wide" style={{ position: "relative" }}>
          <span className="pathway-badge" style={{ background: "oklch(97% 0.005 80 / 0.12)", color: "oklch(88% 0.008 80)", marginBottom: "1.5rem", display: "inline-flex" }}>
            {p.label}
          </span>
          <h1 className="t-hero" style={{ color: "oklch(97% 0.005 80)", marginBottom: "1.25rem", maxWidth: "16ch" }}>
            {p.h1.split("\n").map((line, i) => <span key={i}>{line}{i === 0 && <br />}</span>)}
          </h1>
          <p className="t-tagline" style={{ color: "oklch(78% 0.04 260)", maxWidth: "52ch", marginBottom: "2.5rem" }}>
            {p.tagline}
          </p>
          <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap" }}>
            <Link href="#groups" className="btn-primary">{p.ctaPrimary} →</Link>
            <Link href={ctaHref} className="btn-ghost">{p.ctaSecondary}</Link>
          </div>
        </div>
      </section>

      {/* ── WORLD MAP ── */}
      <section style={{ background: "oklch(22% 0.10 260)", paddingBlock: "clamp(4rem, 6vw, 6rem)" }}>
        <div className="container-wide">
          <p className="t-label" style={{ color: "oklch(65% 0.15 45)", marginBottom: "0.875rem", fontSize: "0.62rem" }}>{p.mapLabel}</p>
          <h2 className="t-section" style={{ color: "oklch(97% 0.005 80)", marginBottom: "0.75rem" }}>{p.mapHeading}</h2>
          <p style={{ fontFamily: "var(--font-montserrat)", fontSize: "0.9375rem", color: "oklch(65% 0.04 260)", marginBottom: "2rem", maxWidth: "44ch" }}>
            {p.mapBody}
          </p>
          <WorldMap groups={groups} isMember={isMember} />
        </div>
      </section>

      {/* ── ACTIVE GROUPS ── */}
      <section id="groups" style={{ paddingBlock: "clamp(4rem, 6vw, 6rem)", background: "oklch(97% 0.005 80)" }}>
        <div className="container-wide">
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", flexWrap: "wrap", gap: "1.5rem", marginBottom: "2.5rem" }}>
            <div>
              <p className="t-label" style={{ color: "oklch(65% 0.15 45)", marginBottom: "0.5rem", fontSize: "0.62rem" }}>Open Groups</p>
              <h2 className="t-section">
                {groups.length} group{groups.length !== 1 ? "s" : ""} forming.
              </h2>
            </div>
            <Link href={isMember ? "/peer-groups/apply" : "/membership"} className="btn-primary">{p.initiateCta} →</Link>
          </div>

          {groups.length === 0 ? (
            <div style={{ padding: "4rem 2rem", textAlign: "center", background: "oklch(96% 0.004 80)", border: "1px solid oklch(88% 0.008 80)" }}>
              <p style={{ fontFamily: "var(--font-cormorant)", fontSize: "1.25rem", fontStyle: "italic", color: "oklch(52% 0.008 260)", marginBottom: "1rem" }}>
                &ldquo;{p.ctaQuote.replace(/[""]/g, "")}&rdquo;
              </p>
              <p style={{ fontFamily: "var(--font-montserrat)", fontSize: "0.9rem", color: "oklch(52% 0.008 260)", marginBottom: "2rem", maxWidth: "42ch", margin: "0 auto 2rem" }}>
                {p.groupsEmpty}
              </p>
              <Link href={isMember ? "/peer-groups/apply" : "/membership"} className="btn-outline-navy">{p.initiateCta}</Link>
            </div>
          ) : (
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: "1.5rem" }}>
              {groups.map(group => (
                <div key={group.id} style={{ background: "white", border: "1px solid oklch(88% 0.008 80)", padding: "1.75rem", display: "flex", flexDirection: "column", gap: "1rem" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                    <span className="pathway-badge" style={{ fontSize: "0.58rem" }}>{group.pathway === "team" ? "Team" : group.pathway === "personal" ? "Personal" : "Both"}</span>
                    {group.is_open && <span style={{ fontFamily: "var(--font-montserrat)", fontSize: "0.6rem", fontWeight: 700, letterSpacing: "0.1em", color: "oklch(45% 0.14 145)", background: "oklch(92% 0.06 145)", padding: "0.2rem 0.5rem" }}>OPEN</span>}
                  </div>
                  <h3 style={{ fontFamily: "var(--font-montserrat)", fontWeight: 700, fontSize: "1.0625rem", color: "oklch(22% 0.005 260)", lineHeight: 1.3 }}>{group.name}</h3>
                  <div style={{ display: "flex", flexDirection: "column", gap: "0.375rem" }}>
                    <p style={{ fontFamily: "var(--font-montserrat)", fontSize: "0.8125rem", color: "oklch(52% 0.008 260)" }}>📍 {group.region}</p>
                    <p style={{ fontFamily: "var(--font-montserrat)", fontSize: "0.8125rem", color: "oklch(52% 0.008 260)" }}>🕐 {group.timezone}</p>
                    <p style={{ fontFamily: "var(--font-montserrat)", fontSize: "0.8125rem", color: "oklch(52% 0.008 260)" }}>👥 Up to {group.max_size}</p>
                  </div>
                  <div style={{ marginTop: "auto" }}>
                    <span style={{ fontFamily: "var(--font-montserrat)", fontSize: "0.7rem", fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", color: "oklch(65% 0.15 45)", border: "1px solid oklch(65% 0.15 45 / 0.4)", padding: "0.4rem 0.875rem", display: "inline-block" }}>
                      Coming Soon
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* ── HOW IT WORKS ── */}
      <section style={{ paddingBlock: "clamp(3.5rem, 6vw, 6rem)", background: "oklch(97% 0.005 80)", borderTop: "1px solid oklch(88% 0.008 80)" }}>
        <div className="container-wide">
          <p className="t-label" style={{ color: "oklch(65% 0.15 45)", marginBottom: "0.875rem" }}>{p.howLabel}</p>
          <h2 className="t-section" style={{ marginBottom: "3rem", maxWidth: "480px" }}>
            {p.howSteps[0].num} steps.<br />One community.
          </h2>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: "2rem" }}>
            {p.howSteps.map((step: { num: string; title: string; body: string }) => (
              <div key={step.num} style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
                <span style={{ fontFamily: "var(--font-montserrat)", fontSize: "0.62rem", fontWeight: 700, letterSpacing: "0.2em", color: "oklch(65% 0.15 45)" }}>{step.num}</span>
                <h3 style={{ fontFamily: "var(--font-montserrat)", fontWeight: 700, fontSize: "1.0625rem", color: "oklch(22% 0.005 260)" }}>{step.title}</h3>
                <p style={{ fontFamily: "var(--font-montserrat)", fontSize: "0.9rem", lineHeight: 1.7, color: "oklch(48% 0.008 260)" }}>{step.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── PEER INCLUDED / COMING SOON ── */}
      <section style={{ paddingBlock: "clamp(4rem, 7vw, 7rem)", background: "oklch(22% 0.10 260)" }}>
        <div className="container-wide">
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "1px", background: "oklch(38% 0.06 260)", maxWidth: "680px" }}>

            {/* Peer included note */}
            <div style={{ background: "oklch(28% 0.11 260)", padding: "2rem", display: "flex", flexDirection: "column", gap: "1rem" }}>
              <div style={{ display: "inline-flex", alignItems: "center", gap: "0.5rem", background: "oklch(65% 0.15 45 / 0.15)", border: "1px solid oklch(65% 0.15 45 / 0.35)", padding: "0.25rem 0.625rem", alignSelf: "flex-start" }}>
                <span style={{ fontFamily: "var(--font-montserrat)", fontSize: "0.6rem", fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: "oklch(65% 0.15 45)" }}>Included Free</span>
              </div>
              <h3 style={{ fontFamily: "var(--font-montserrat)", fontWeight: 700, fontSize: "1.0625rem", color: "oklch(97% 0.005 80)", lineHeight: 1.3 }}>
                Peer Groups are free with any paid plan
              </h3>
              <p style={{ fontFamily: "var(--font-montserrat)", fontSize: "0.875rem", lineHeight: 1.65, color: "oklch(72% 0.04 260)" }}>
                Personal + Peer ($149/yr) and Team ($497/yr) both include full Peer Group access. You don&apos;t pay extra for community.
              </p>
              <Link href="/personal" style={{ fontFamily: "var(--font-montserrat)", fontSize: "0.75rem", fontWeight: 700, letterSpacing: "0.06em", color: "oklch(97% 0.005 80)", textDecoration: "none", border: "1px solid oklch(55% 0.008 260)", padding: "0.5rem 1rem", display: "inline-block", alignSelf: "flex-start" }}>
                See Personal plan →
              </Link>
            </div>

            {/* Coming Soon */}
            <div style={{ background: "oklch(28% 0.11 260)", padding: "2rem", display: "flex", flexDirection: "column", gap: "1rem", position: "relative" }}>
              <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: "3px", background: "oklch(65% 0.15 45)" }} />
              <p className="t-label" style={{ color: "oklch(65% 0.15 45)", fontSize: "0.62rem" }}>Peer Groups</p>
              <h3 style={{ fontFamily: "var(--font-montserrat)", fontWeight: 700, fontSize: "1.0625rem", color: "oklch(97% 0.005 80)", lineHeight: 1.3 }}>
                Groups launching soon
              </h3>
              <p style={{ fontFamily: "var(--font-montserrat)", fontSize: "0.875rem", lineHeight: 1.65, color: "oklch(72% 0.04 260)" }}>
                Cohorts in English, Indonesian, and Dutch. Small groups of cross-cultural leaders who meet regularly and grow together.
              </p>
              <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                {["English (Global)", "Indonesian (Asia Pacific)", "Dutch (Europe / Global)"].map(f => (
                  <li key={f} style={{ display: "flex", gap: "0.625rem", fontFamily: "var(--font-montserrat)", fontSize: "0.8rem", color: "oklch(72% 0.04 260)", alignItems: "flex-start" }}>
                    <span style={{ color: "oklch(65% 0.15 45)", fontWeight: 700, flexShrink: 0 }}>→</span>{f}
                  </li>
                ))}
              </ul>
              <div style={{ fontFamily: "var(--font-montserrat)", fontSize: "0.75rem", fontWeight: 700, letterSpacing: "0.06em", textTransform: "uppercase", color: "oklch(65% 0.15 45)", padding: "0.5rem 1rem", border: "1px solid oklch(65% 0.15 45 / 0.4)", textAlign: "center", marginTop: "auto" }}>
                Coming Soon
              </div>
            </div>

          </div>
        </div>
      </section>
    </>
  );
}

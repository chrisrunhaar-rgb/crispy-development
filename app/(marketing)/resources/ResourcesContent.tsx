"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import { useLanguage } from "@/lib/LanguageContext";
import { TOPICS, RESOURCES } from "@/lib/resources-data";
import { saveResourceToDashboard } from "./actions";

type View = "category" | "list";

interface Props {
  userId: string | null;
  pathway: string | null;
  isTeamLeader: boolean;
  savedResources?: string[];
}

const FORMAT_COLORS: Record<string, string> = {
  Article: "oklch(42% 0.14 260)",
  Assessment: "oklch(44% 0.14 300)",
  Worksheet: "oklch(46% 0.16 145)",
  Guide: "oklch(65% 0.15 45)",
};

export default function ResourcesContent({ userId, pathway, isTeamLeader, savedResources = [] }: Props) {
  const { t } = useLanguage();
  const r = t.resources;
  const [view, setView] = useState<View>("list");
  const [localSaved, setLocalSaved] = useState<Set<string>>(new Set(savedResources));
  const [pendingSlug, setPendingSlug] = useState<string | null>(null);
  const [activeLanguage, setActiveLanguage] = useState<string | null>(null);
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [, startTransition] = useTransition();

  function handleAddToDashboard(slug: string, e: React.MouseEvent) {
    e.preventDefault();
    e.stopPropagation();
    if (localSaved.has(slug)) return;
    setPendingSlug(slug);
    startTransition(async () => {
      await saveResourceToDashboard(slug);
      setLocalSaved(prev => new Set([...prev, slug]));
      setPendingSlug(null);
    });
  }

  const sortedResources = [...RESOURCES].sort((a, b) =>
    a.title.localeCompare(b.title)
  );

  const filteredResources = sortedResources.filter(r => {
    if (activeLanguage && !r.languages.includes(activeLanguage as "en" | "id" | "nl")) return false;
    if (activeCategory && !r.topics.includes(activeCategory)) return false;
    return true;
  });

  const freeCount = filteredResources.filter(r => !r.gated).length;
  const lockedCount = filteredResources.filter(r => r.gated).length;

  const hasActiveFilters = activeLanguage !== null || activeCategory !== null;

  const filterPillBase: React.CSSProperties = {
    fontFamily: "var(--font-montserrat)",
    fontSize: "0.65rem",
    fontWeight: 700,
    letterSpacing: "0.06em",
    textTransform: "uppercase",
    padding: "0.3rem 0.75rem",
    border: "1px solid oklch(82% 0.008 80)",
    cursor: "pointer",
    transition: "all 0.12s",
    background: "white",
    color: "oklch(45% 0.008 260)",
  };

  const filterPillActive: React.CSSProperties = {
    ...filterPillBase,
    background: "oklch(65% 0.15 45)",
    color: "white",
    border: "1px solid oklch(65% 0.15 45)",
  };

  const toggleBtnBase: React.CSSProperties = {
    fontFamily: "var(--font-montserrat)",
    fontSize: "0.75rem",
    fontWeight: 700,
    letterSpacing: "0.06em",
    textTransform: "uppercase",
    padding: "0.5rem 1.25rem",
    border: "1px solid oklch(82% 0.008 80)",
    cursor: "pointer",
    transition: "all 0.15s",
  };

  return (
    <>
      {/* ── HEADER ── */}
      <section style={{ borderBottom: "1px solid oklch(88% 0.008 80)", paddingTop: "clamp(3rem, 5vw, 5rem)", paddingBottom: "clamp(2rem, 4vw, 3.5rem)", background: "oklch(97% 0.005 80)" }}>
        <div className="container-wide">
          <p className="t-label" style={{ color: "oklch(65% 0.15 45)", marginBottom: "1rem" }}>{r.label}</p>
          <h1 className="t-section" style={{ marginBottom: "1rem", maxWidth: "500px" }}>
            {r.h1.split("\n").map((line, i) => <span key={i}>{line}{i === 0 && <br />}</span>)}
          </h1>
          <p style={{ fontFamily: "var(--font-montserrat)", fontSize: "0.9375rem", color: "oklch(52% 0.008 260)", maxWidth: "52ch", lineHeight: 1.7, marginBottom: "1.75rem" }}>
            {r.tagline}
          </p>

          {/* View toggle */}
          <div style={{ display: "flex", gap: 0 }}>
            <button
              onClick={() => setView("list")}
              style={{
                ...toggleBtnBase,
                background: view === "list" ? "oklch(30% 0.12 260)" : "white",
                color: view === "list" ? "white" : "oklch(45% 0.008 260)",
                borderRight: "none",
              }}
            >
              A–Z List
            </button>
            <button
              onClick={() => setView("category")}
              style={{
                ...toggleBtnBase,
                background: view === "category" ? "oklch(30% 0.12 260)" : "white",
                color: view === "category" ? "white" : "oklch(45% 0.008 260)",
              }}
            >
              By Category
            </button>
          </div>

          {isTeamLeader && pathway === "team" && (
            <div style={{ marginTop: "1.25rem" }}>
              <Link href="/dashboard" style={{ fontFamily: "var(--font-montserrat)", fontSize: "0.8125rem", fontWeight: 700, color: "oklch(30% 0.12 260)", textDecoration: "none" }}>
                ← Team Dashboard
              </Link>
            </div>
          )}
        </div>
      </section>

      {/* ── CATEGORY VIEW ── */}
      {view === "category" && (
        <section style={{ paddingBlock: "clamp(2.5rem, 5vw, 5rem)", background: "oklch(97% 0.005 80)" }}>
          <div className="container-wide">
            <p style={{ fontFamily: "var(--font-montserrat)", fontSize: "0.75rem", fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", color: "oklch(58% 0.008 260)", marginBottom: "1.5rem" }}>
              {TOPICS.length} categories
            </p>
            <div style={{ border: "1px solid oklch(88% 0.008 80)", display: "flex", flexDirection: "column", gap: "1px", background: "oklch(88% 0.008 80)" }}>
              {TOPICS.map(topic => {
                const count = RESOURCES.filter(res => res.topics.includes(topic.slug)).length;
                const freeCount = RESOURCES.filter(res => res.topics.includes(topic.slug) && !res.gated).length;
                const lockedCount = count - freeCount;
                return (
                  <Link key={topic.slug} href={`/resources/topic/${topic.slug}`} style={{ textDecoration: "none", display: "block" }}>
                    <div
                      style={{
                        background: "oklch(99% 0.002 80)",
                        padding: "clamp(1rem, 3vw, 1.375rem) clamp(1rem, 4vw, 2rem)",
                        display: "grid",
                        gridTemplateColumns: "auto 1fr auto",
                        gap: "1.125rem",
                        alignItems: "center",
                        transition: "background 0.12s",
                        cursor: "pointer",
                      }}
                      onMouseEnter={e => (e.currentTarget.style.background = "oklch(65% 0.15 45 / 0.06)")}
                      onMouseLeave={e => (e.currentTarget.style.background = "oklch(99% 0.002 80)")}
                    >
                      <svg
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="oklch(65% 0.15 45)"
                        strokeWidth={1.5}
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        style={{ width: "1.375rem", height: "1.375rem", flexShrink: 0 }}
                      >
                        <path d={topic.icon} />
                      </svg>
                      <div style={{ minWidth: 0 }}>
                        <p style={{ fontFamily: "var(--font-montserrat)", fontWeight: 700, fontSize: "clamp(0.875rem, 2vw, 0.9375rem)", color: "oklch(22% 0.005 260)", marginBottom: "0.25rem", lineHeight: 1.2 }}>
                          {topic.title}
                        </p>
                        <p style={{ fontFamily: "var(--font-montserrat)", fontSize: "0.8rem", color: "oklch(52% 0.008 260)", lineHeight: 1.5, marginBottom: "0.5rem", maxWidth: "60ch" }}>
                          {topic.description}
                        </p>
                        <div style={{ display: "flex", gap: "0.625rem", alignItems: "center" }}>
                          <span style={{ fontFamily: "var(--font-montserrat)", fontSize: "0.62rem", fontWeight: 700, letterSpacing: "0.06em", textTransform: "uppercase", color: "oklch(42% 0.008 260)" }}>
                            {count} {count === 1 ? "resource" : "resources"}
                          </span>
                          {!userId && lockedCount > 0 && (
                            <span style={{ fontFamily: "var(--font-montserrat)", fontSize: "0.6rem", color: "oklch(62% 0.008 260)" }}>
                              · {freeCount} free
                            </span>
                          )}
                        </div>
                      </div>
                      <span style={{ fontSize: "1rem", color: "oklch(65% 0.008 260)", flexShrink: 0 }}>→</span>
                    </div>
                  </Link>
                );
              })}
            </div>

            {!userId && (
              <p style={{ fontFamily: "var(--font-montserrat)", fontSize: "0.8125rem", color: "oklch(58% 0.008 260)", marginTop: "1.75rem", lineHeight: 1.6 }}>
                Free resources are open to everyone.{" "}
                <Link href="/signup" style={{ color: "oklch(30% 0.12 260)", fontWeight: 600, textDecoration: "none" }}>Create an account</Link>
                {" "}to unlock the full library.
              </p>
            )}
          </div>
        </section>
      )}

      {/* ── LIST VIEW ── */}
      {view === "list" && (
        <section style={{ paddingBlock: "clamp(2.5rem, 5vw, 5rem)", background: "oklch(97% 0.005 80)" }}>
          <div className="container-wide">

            {/* Filter row */}
            <div style={{ marginBottom: "1.5rem", display: "flex", flexDirection: "column", gap: "0.75rem" }}>
              {/* Language filters */}
              <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap", alignItems: "center" }}>
                <span style={{ fontFamily: "var(--font-montserrat)", fontSize: "0.65rem", fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", color: "oklch(55% 0.008 260)", marginRight: "0.25rem" }}>
                  Language
                </span>
                {[{ key: "en", label: "English" }, { key: "id", label: "Indonesian" }, { key: "nl", label: "Dutch" }].map(lang => (
                  <button
                    key={lang.key}
                    onClick={() => setActiveLanguage(activeLanguage === lang.key ? null : lang.key)}
                    style={activeLanguage === lang.key ? filterPillActive : filterPillBase}
                  >
                    {lang.label}
                  </button>
                ))}
              </div>

              {/* Category filters */}
              <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap", alignItems: "center" }}>
                <span style={{ fontFamily: "var(--font-montserrat)", fontSize: "0.65rem", fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", color: "oklch(55% 0.008 260)", marginRight: "0.25rem" }}>
                  Category
                </span>
                {TOPICS.map(topic => (
                  <button
                    key={topic.slug}
                    onClick={() => setActiveCategory(activeCategory === topic.slug ? null : topic.slug)}
                    style={activeCategory === topic.slug ? filterPillActive : filterPillBase}
                  >
                    {topic.title}
                  </button>
                ))}
                {hasActiveFilters && (
                  <button
                    onClick={() => { setActiveLanguage(null); setActiveCategory(null); }}
                    style={{ ...filterPillBase, color: "oklch(55% 0.14 25)", border: "1px solid oklch(82% 0.04 25)" }}
                  >
                    Clear filters ×
                  </button>
                )}
              </div>
            </div>

            <p style={{ fontFamily: "var(--font-montserrat)", fontSize: "0.75rem", fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", color: "oklch(58% 0.008 260)", marginBottom: "1.5rem" }}>
              {filteredResources.length}{hasActiveFilters ? ` of ${sortedResources.length}` : ""} resources — A to Z
              {!userId && lockedCount > 0 && (
                <span style={{ fontWeight: 400, textTransform: "none", letterSpacing: 0, marginLeft: "0.75rem", color: "oklch(62% 0.008 260)" }}>
                  · {freeCount} free · {lockedCount} require an account
                </span>
              )}
            </p>
            {filteredResources.length === 0 && (
              <p style={{ fontFamily: "var(--font-montserrat)", fontSize: "0.875rem", color: "oklch(55% 0.008 260)", padding: "2rem 0" }}>
                No resources match those filters.{" "}
                <button onClick={() => { setActiveLanguage(null); setActiveCategory(null); }} style={{ background: "none", border: "none", cursor: "pointer", color: "oklch(30% 0.12 260)", fontFamily: "var(--font-montserrat)", fontSize: "0.875rem", fontWeight: 700, padding: 0, textDecoration: "underline" }}>
                  Clear filters
                </button>
              </p>
            )}
            <div style={{ border: "1px solid oklch(88% 0.008 80)", display: "flex", flexDirection: "column", gap: "1px", background: "oklch(88% 0.008 80)" }}>
              {filteredResources.map((resource) => {
                const isAccessible = !resource.gated || !!userId;
                const hasPage = !!resource.slug;
                const isClickable = hasPage && isAccessible;

                const cardInner = (
                  <div
                    style={{
                      background: isAccessible ? "oklch(99% 0.002 80)" : "oklch(98% 0.003 80)",
                      padding: "clamp(1rem, 3vw, 1.5rem) clamp(1rem, 4vw, 2rem)",
                      display: "grid",
                      gridTemplateColumns: "1fr auto",
                      gap: "1rem",
                      alignItems: "start",
                      opacity: hasPage ? 1 : 0.65,
                      cursor: isClickable ? "pointer" : "default",
                      transition: "background 0.12s",
                    }}
                    onMouseEnter={isClickable ? (e) => (e.currentTarget.style.background = "oklch(30% 0.12 260 / 0.04)") : undefined}
                    onMouseLeave={isClickable ? (e) => (e.currentTarget.style.background = isAccessible ? "oklch(99% 0.002 80)" : "oklch(98% 0.003 80)") : undefined}
                  >
                    <div style={{ minWidth: 0 }}>
                      {/* Title row */}
                      <div style={{ display: "flex", alignItems: "center", gap: "0.625rem", flexWrap: "wrap", marginBottom: "0.375rem" }}>
                        <h3 style={{
                          fontFamily: "var(--font-montserrat)",
                          fontWeight: 700,
                          fontSize: "clamp(0.9rem, 2vw, 1rem)",
                          color: isAccessible ? "oklch(22% 0.005 260)" : "oklch(42% 0.005 260)",
                          margin: 0,
                          lineHeight: 1.25,
                        }}>
                          {resource.title}
                        </h3>
                      </div>

                      {/* Description */}
                      <p style={{
                        fontFamily: "var(--font-montserrat)",
                        fontSize: "0.8125rem",
                        color: isAccessible ? "oklch(48% 0.008 260)" : "oklch(62% 0.005 260)",
                        lineHeight: 1.6,
                        margin: "0 0 0.75rem",
                        maxWidth: "68ch",
                      }}>
                        {resource.description}
                      </p>

                      {/* Meta row */}
                      <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap", alignItems: "center" }}>
                        {/* Format badge */}
                        <span style={{
                          fontFamily: "var(--font-montserrat)",
                          fontSize: "0.6rem",
                          fontWeight: 700,
                          letterSpacing: "0.08em",
                          textTransform: "uppercase",
                          color: isAccessible ? (FORMAT_COLORS[resource.format] ?? "oklch(42% 0.08 260)") : "oklch(62% 0.005 260)",
                          background: isAccessible ? `${FORMAT_COLORS[resource.format] ?? "oklch(42% 0.08 260)"} / 0.1` : "oklch(92% 0.003 80)",
                          padding: "2px 7px",
                          borderRadius: 3,
                        }}>
                          {resource.format}
                        </span>

                        {/* Time */}
                        <span style={{
                          fontFamily: "var(--font-montserrat)",
                          fontSize: "0.65rem",
                          color: isAccessible ? "oklch(55% 0.008 260)" : "oklch(68% 0.005 260)",
                          fontWeight: 600,
                        }}>
                          {resource.time}
                        </span>

                        {/* Languages */}
                        <span style={{
                          fontFamily: "var(--font-montserrat)",
                          fontSize: "0.65rem",
                          fontWeight: 700,
                          letterSpacing: "0.06em",
                          color: isAccessible ? "oklch(52% 0.08 260)" : "oklch(65% 0.005 260)",
                          background: "oklch(92% 0.005 260)",
                          padding: "2px 7px",
                          borderRadius: 3,
                        }}>
                          {resource.languages.map(l => l.toUpperCase()).join(" · ")}
                        </span>
                      </div>
                    </div>

                    {/* Right column */}
                    <div style={{ flexShrink: 0, display: "flex", flexDirection: "column", alignItems: "flex-end", gap: "0.5rem", paddingTop: "0.125rem" }}>
                      {/* Signed-in user: save to dashboard */}
                      {isClickable && userId && (
                        localSaved.has(resource.slug!) ? (
                          <span style={{ fontFamily: "var(--font-montserrat)", fontSize: "0.62rem", fontWeight: 700, color: "oklch(55% 0.15 145)", whiteSpace: "nowrap" }}>
                            ✓ Saved
                          </span>
                        ) : (
                          <button
                            onClick={(e) => handleAddToDashboard(resource.slug!, e)}
                            disabled={pendingSlug === resource.slug}
                            style={{
                              fontFamily: "var(--font-montserrat)", fontSize: "0.62rem", fontWeight: 700,
                              letterSpacing: "0.06em", textTransform: "uppercase",
                              background: "transparent", color: "oklch(30% 0.12 260)",
                              border: "1px solid oklch(30% 0.12 260)", padding: "0.25rem 0.625rem",
                              cursor: pendingSlug === resource.slug ? "wait" : "pointer",
                              whiteSpace: "nowrap", opacity: pendingSlug === resource.slug ? 0.5 : 1,
                            }}
                          >
                            {pendingSlug === resource.slug ? "…" : "+ Add to Dashboard"}
                          </button>
                        )
                      )}
                      {/* Not signed in, gated resource: sign-up CTA */}
                      {!userId && resource.gated && hasPage && (
                        <Link
                          href={`/signup?redirectTo=/resources/${resource.slug}`}
                          onClick={e => e.stopPropagation()}
                          style={{
                            fontFamily: "var(--font-montserrat)", fontSize: "0.62rem", fontWeight: 700,
                            letterSpacing: "0.06em", textTransform: "uppercase",
                            background: "oklch(30% 0.12 260)", color: "oklch(97% 0.005 80)",
                            padding: "0.3rem 0.75rem", textDecoration: "none",
                            whiteSpace: "nowrap",
                          }}
                        >
                          Sign up to access →
                        </Link>
                      )}
                      {/* Arrow for accessible resources */}
                      {isClickable ? (
                        <span style={{ fontSize: "1rem", color: "oklch(65% 0.008 260)" }}>→</span>
                      ) : !hasPage ? (
                        <span style={{ fontFamily: "var(--font-montserrat)", fontSize: "0.6rem", fontWeight: 700, letterSpacing: "0.06em", textTransform: "uppercase", color: "oklch(68% 0.008 260)" }}>
                          Soon
                        </span>
                      ) : null}
                    </div>
                  </div>
                );

                // Accessible resources with a page → link
                if (isClickable) {
                  return (
                    <Link key={resource.id} href={`/resources/${resource.slug}`} style={{ textDecoration: "none", display: "block" }}>
                      {cardInner}
                    </Link>
                  );
                }
                // No page yet → plain div
                return <div key={resource.id}>{cardInner}</div>;
              })}
            </div>

            {!userId && lockedCount > 0 && (
              <div style={{ display: "flex", alignItems: "center", gap: "1.25rem", marginTop: "1.75rem", padding: "1rem 1.25rem", background: "oklch(30% 0.12 260 / 0.05)" }}>
                <div style={{ flex: 1 }}>
                  <p style={{ fontFamily: "var(--font-montserrat)", fontWeight: 700, fontSize: "0.875rem", color: "oklch(28% 0.008 260)", marginBottom: "0.25rem" }}>
                    {lockedCount} resources require a free account
                  </p>
                  <p style={{ fontFamily: "var(--font-montserrat)", fontSize: "0.8rem", color: "oklch(52% 0.008 260)" }}>
                    Create your free account to unlock the full library and save resources to your personal dashboard.
                  </p>
                </div>
                <Link href="/signup" style={{
                  fontFamily: "var(--font-montserrat)", fontWeight: 700, fontSize: "0.75rem",
                  letterSpacing: "0.06em", textTransform: "uppercase",
                  background: "oklch(30% 0.12 260)", color: "oklch(97% 0.005 80)",
                  padding: "0.625rem 1.25rem", textDecoration: "none", whiteSpace: "nowrap", flexShrink: 0,
                }}>
                  Create free account →
                </Link>
              </div>
            )}
          </div>
        </section>
      )}

      {/* ── CTA ── */}
      {!userId && (
        <section style={{ paddingBlock: "clamp(4rem, 7vw, 7rem)", background: "oklch(30% 0.12 260)", position: "relative" }}>
          <div style={{ position: "absolute", left: "clamp(1.5rem, 5vw, 4rem)", top: "clamp(4rem, 7vw, 7rem)", bottom: "clamp(4rem, 7vw, 7rem)", width: "3px", background: "oklch(65% 0.15 45)" }} />
          <div className="container-wide">
            <div style={{ maxWidth: "600px", paddingLeft: "2.5rem" }}>
              <p className="t-tagline" style={{ color: "oklch(65% 0.15 45)", marginBottom: "1.25rem", fontStyle: "italic" }}>
                {r.ctaQuote}
              </p>
              <h2 className="t-section" style={{ color: "oklch(97% 0.005 80)", marginBottom: "1.25rem" }}>
                {r.ctaHeading}
              </h2>
              <p style={{ fontFamily: "var(--font-montserrat)", fontSize: "0.9375rem", lineHeight: 1.7, color: "oklch(72% 0.04 260)", marginBottom: "2rem", maxWidth: "44ch" }}>
                {r.tagline}
              </p>
              <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap" }}>
                <Link href="/signup" className="btn-primary">{r.ctaPrimary} →</Link>
                <Link href="/peer-groups" className="btn-ghost">{t.home.peerCta}</Link>
              </div>
            </div>
          </div>
        </section>
      )}
    </>
  );
}

function TopicTile({
  title,
  description,
  icon,
  count,
  freeCount,
  userId,
}: {
  title: string;
  description: string;
  icon: string;
  count: number;
  freeCount: number;
  userId: string | null;
}) {
  const lockedCount = count - freeCount;

  return (
    <div
      style={{
        background: "oklch(99% 0.002 80)",
        padding: "clamp(1rem, 3vw, 1.75rem)",
        display: "flex",
        flexDirection: "column",
        gap: "0.75rem",
        cursor: "pointer",
        transition: "background 0.15s",
        minHeight: "clamp(130px, 18vw, 175px)",
      }}
      onMouseEnter={e => (e.currentTarget.style.background = "oklch(30% 0.12 260 / 0.04)")}
      onMouseLeave={e => (e.currentTarget.style.background = "oklch(99% 0.002 80)")}
    >
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="oklch(65% 0.15 45)"
        strokeWidth={1.5}
        strokeLinecap="round"
        strokeLinejoin="round"
        style={{ width: "clamp(1.125rem, 3vw, 1.5rem)", height: "clamp(1.125rem, 3vw, 1.5rem)", flexShrink: 0 }}
      >
        <path d={icon} />
      </svg>

      <div>
        <p style={{
          fontFamily: "var(--font-montserrat)",
          fontWeight: 700,
          fontSize: "clamp(0.8125rem, 2vw, 0.9375rem)",
          color: "oklch(22% 0.005 260)",
          lineHeight: 1.2,
          marginBottom: "0.3rem",
        }}>
          {title}
        </p>
        <p style={{
          fontFamily: "var(--font-montserrat)",
          fontSize: "0.7rem",
          color: "oklch(58% 0.008 260)",
          lineHeight: 1.4,
          display: "-webkit-box",
          WebkitLineClamp: 2,
          WebkitBoxOrient: "vertical" as const,
          overflow: "hidden",
        }}>
          {description}
        </p>
      </div>

      <div style={{ marginTop: "auto", display: "flex", alignItems: "center", gap: "0.5rem" }}>
        <span style={{ fontFamily: "var(--font-montserrat)", fontSize: "0.62rem", fontWeight: 700, letterSpacing: "0.08em", color: "oklch(42% 0.008 260)" }}>
          {count} {count === 1 ? "resource" : "resources"}
        </span>
        {!userId && lockedCount > 0 && (
          <span style={{ fontFamily: "var(--font-montserrat)", fontSize: "0.6rem", color: "oklch(62% 0.008 260)" }}>
            · {freeCount} free
          </span>
        )}
        <span style={{ marginLeft: "auto", fontSize: "0.75rem", color: "oklch(65% 0.008 260)" }}>→</span>
      </div>
    </div>
  );
}

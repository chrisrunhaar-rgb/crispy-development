"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import Image from "next/image";
import { useLanguage } from "@/lib/LanguageContext";
import { RESOURCES, Resource } from "@/lib/resources-data";
import { saveResourceToDashboard } from "./actions";

interface Props {
  userId: string | null;
  pathway: string | null;
  isTeamLeader: boolean;
  savedResources?: string[];
  moduleStatuses?: Record<string, string>;
  moduleCategories?: Record<string, string>;
}

const FORMAT_COLORS: Record<string, string> = {
  Article: "oklch(42% 0.14 260)",
  Assessment: "oklch(44% 0.14 300)",
  Worksheet: "oklch(46% 0.16 145)",
  Guide: "oklch(65% 0.15 45)",
};

const SECTION_ORDER = [
  { key: "assessments", label: "Assessments" },
  { key: "cross-cultural", label: "Cross-Cultural" },
  { key: "leadership", label: "Leadership" },
  { key: "team-facilitation", label: "Team & Facilitation" },
  { key: "personal-development", label: "Personal Development" },
  { key: "thinking-tools", label: "Thinking Tools" },
  { key: "faith-calling", label: "Faith & Calling" },
  { key: "self-care", label: "Self-Care & Resilience" },
];

function getModuleAccess(
  slug: string | null,
  gated: boolean,
  moduleStatuses: Record<string, string>
): "development" | "live_free" | "live_paid" {
  if (!slug) return "development";
  const status = moduleStatuses[slug];
  if (status === "live_free") return "live_free";
  if (status === "live_paid") return "live_paid";
  if (status === "development") return "development";
  return gated ? "live_paid" : "live_free";
}

function getLibraryCategory(
  resource: Resource,
  moduleCategories: Record<string, string>
): string {
  if (resource.slug && moduleCategories[resource.slug]) {
    return moduleCategories[resource.slug];
  }
  if (resource.format === "Assessment") return "assessments";
  return resource.topics[0] ?? "personal-development";
}

function ResourceTile({
  resource,
  userId,
  moduleStatuses,
  localSaved,
  pendingSlug,
  onAddToDashboard,
  lang,
  localTitle,
  localDescription,
}: {
  resource: Resource;
  userId: string | null;
  moduleStatuses: Record<string, string>;
  localSaved: Set<string>;
  pendingSlug: string | null;
  onAddToDashboard: (slug: string, e: React.MouseEvent) => void;
  lang: string;
  localTitle: (r: Resource) => string;
  localDescription: (r: Resource) => string;
}) {
  const [hovered, setHovered] = useState(false);
  const access = getModuleAccess(resource.slug, resource.gated, moduleStatuses);
  const isClickable =
    !!resource.slug && (access === "live_free" || access === "live_paid");

  const borderColor =
    access === "live_free"
      ? "#059669"
      : access === "live_paid"
      ? "#E07540"
      : "#D1D5DB";

  const badgeLabel =
    access === "live_free"
      ? "FREE"
      : access === "live_paid"
      ? "MEMBERS ONLY"
      : "COMING SOON";

  const badgeStyle: React.CSSProperties =
    access === "live_free"
      ? { color: "#059669", background: "#D1FAE5" }
      : access === "live_paid"
      ? { color: "#E07540", background: "#FEF3EC" }
      : { color: "#9CA3AF", background: "#F3F4F6" };

  const tileStyle: React.CSSProperties = {
    border: "1px solid oklch(88% 0.008 80)",
    borderLeft: `3px solid ${borderColor}`,
    padding: "1rem 1.125rem",
    display: "flex",
    flexDirection: "column",
    minHeight: "220px",
    background:
      access === "development"
        ? "oklch(96% 0.003 260)"
        : "oklch(99.5% 0.002 80)",
    opacity: access === "development" ? 0.7 : 1,
    transition: "box-shadow 0.12s, transform 0.12s",
    cursor: isClickable ? "pointer" : "default",
    textDecoration: "none",
    boxShadow:
      hovered && isClickable
        ? "0 2px 8px oklch(0% 0 0 / 0.08)"
        : "none",
    transform:
      hovered && isClickable ? "translateY(-1px)" : "none",
  };

  const inner = (
    <div
      style={tileStyle}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* Status badge */}
      <div>
        <span
          style={{
            fontFamily: "var(--font-montserrat)",
            fontSize: "0.55rem",
            fontWeight: 700,
            letterSpacing: "0.08em",
            textTransform: "uppercase",
            padding: "2px 6px",
            borderRadius: 3,
            ...badgeStyle,
          }}
        >
          {badgeLabel}
        </span>
      </div>

      {/* Title */}
      <p
        style={{
          fontFamily: "var(--font-montserrat)",
          fontWeight: 700,
          fontSize: "0.9375rem",
          color: "oklch(22% 0.005 260)",
          marginTop: "0.5rem",
          marginBottom: 0,
          lineHeight: 1.25,
        }}
      >
        {localTitle(resource)}
      </p>

      {/* Description — 2-line clamp */}
      <p
        style={{
          fontFamily: "var(--font-montserrat)",
          fontSize: "0.8125rem",
          color: "oklch(52% 0.008 260)",
          lineHeight: 1.6,
          marginTop: "0.375rem",
          marginBottom: 0,
          display: "-webkit-box",
          WebkitLineClamp: 2,
          WebkitBoxOrient: "vertical",
          overflow: "hidden",
        }}
      >
        {localDescription(resource)}
      </p>

      {/* Bottom row */}
      <div
        style={{
          marginTop: "auto",
          paddingTop: "0.75rem",
          display: "flex",
          flexDirection: "column",
          gap: "0.5rem",
        }}
      >
        <div style={{ display: "flex", gap: "0.5rem", alignItems: "center", flexWrap: "wrap" }}>
          {/* Format badge */}
          <span
            style={{
              fontFamily: "var(--font-montserrat)",
              fontSize: "0.6rem",
              fontWeight: 700,
              letterSpacing: "0.08em",
              textTransform: "uppercase",
              color: FORMAT_COLORS[resource.format] ?? "oklch(42% 0.08 260)",
              padding: "2px 7px",
              borderRadius: 3,
              background: "oklch(93% 0.005 80)",
            }}
          >
            {resource.format}
          </span>

          {/* Time */}
          <span
            style={{
              fontFamily: "var(--font-montserrat)",
              fontSize: "0.65rem",
              color: "oklch(55% 0.008 260)",
              fontWeight: 600,
            }}
          >
            {resource.time}
          </span>
        </div>

      </div>
    </div>
  );

  if (isClickable) {
    return (
      <Link
        href={`/resources/${resource.slug}`}
        style={{ textDecoration: "none", display: "block" }}
      >
        {inner}
      </Link>
    );
  }

  return <div>{inner}</div>;
}

export default function ResourcesContent({
  userId,
  pathway,
  isTeamLeader,
  savedResources = [],
  moduleStatuses = {},
  moduleCategories = {},
}: Props) {
  const { t, lang } = useLanguage();
  const r = t.resources;
  const [localSaved, setLocalSaved] = useState<Set<string>>(
    new Set(savedResources)
  );
  const [pendingSlug, setPendingSlug] = useState<string | null>(null);
  const [, startTransition] = useTransition();
  const [openSections, setOpenSections] = useState<Set<string>>(new Set());

  function toggleSection(key: string) {
    setOpenSections(prev => {
      const next = new Set(prev);
      if (next.has(key)) next.delete(key);
      else next.add(key);
      return next;
    });
  }

  function handleAddToDashboard(slug: string, e: React.MouseEvent) {
    e.preventDefault();
    e.stopPropagation();
    if (localSaved.has(slug)) return;
    setPendingSlug(slug);
    startTransition(async () => {
      await saveResourceToDashboard(slug);
      setLocalSaved((prev) => new Set([...prev, slug]));
      setPendingSlug(null);
    });
  }

  function localTitle(resource: Resource) {
    if (lang === "id" && resource.titleId) return resource.titleId;
    if (lang === "nl" && resource.titleNl) return resource.titleNl;
    return resource.title;
  }

  function localDescription(resource: Resource) {
    if (lang === "id" && resource.descriptionId) return resource.descriptionId;
    if (lang === "nl" && resource.descriptionNl) return resource.descriptionNl;
    return resource.description;
  }

  return (
    <>
      {/* ── HEADER ── */}
      <section
        style={{
          paddingTop: "clamp(3rem, 5vw, 5rem)",
          paddingBottom: "clamp(2.5rem, 4vw, 4rem)",
          background: "oklch(30% 0.12 260)",
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* Vertical orange accent bar */}
        <div
          style={{
            position: "absolute",
            left: "clamp(1.5rem, 5vw, 4rem)",
            top: "clamp(3rem, 5vw, 5rem)",
            bottom: "clamp(2.5rem, 4vw, 4rem)",
            width: "3px",
            background: "oklch(65% 0.15 45)",
          }}
        />

        {/* Decorative compass rose — large, right-side, faint */}
        <div
          aria-hidden="true"
          style={{
            position: "absolute",
            right: "clamp(-2rem, 2vw, 2rem)",
            top: "50%",
            transform: "translateY(-50%)",
            width: "clamp(160px, 30vw, 320px)",
            height: "clamp(160px, 30vw, 320px)",
            opacity: 0.08,
            pointerEvents: "none",
          }}
        >
          <Image
            src="/logo-icon.png"
            alt=""
            fill
            style={{ objectFit: "contain", filter: "brightness(0) invert(1)" }}
          />
        </div>

        <div className="container-wide" style={{ paddingLeft: "calc(clamp(1.5rem, 5vw, 4rem) + 1.75rem)" }}>
          {/* Logo + label row */}
          <div style={{ display: "flex", alignItems: "center", gap: "0.625rem", marginBottom: "1rem" }}>
            <Image
              src="/logo-icon.png"
              alt="Crispy Development"
              width={22}
              height={22}
              style={{ filter: "brightness(0) invert(1)", opacity: 0.75, flexShrink: 0 }}
            />
            <p
              className="t-label"
              style={{ color: "oklch(65% 0.15 45)", margin: 0 }}
            >
              {r.label}
            </p>
          </div>

          <h1 className="t-section" style={{ marginBottom: "1rem", maxWidth: "560px", color: "oklch(97% 0.005 80)" }}>
            {r.h1.split("\n").map((line, i) => (
              <span key={i}>
                {line}
                {i === 0 && <br />}
              </span>
            ))}
          </h1>
          <p
            style={{
              fontFamily: "var(--font-montserrat)",
              fontSize: "0.9375rem",
              color: "oklch(72% 0.04 260)",
              maxWidth: "52ch",
              lineHeight: 1.7,
            }}
          >
            {r.tagline}
          </p>

          {isTeamLeader && pathway === "team" && (
            <div style={{ marginTop: "1.25rem" }}>
              <Link
                href="/dashboard"
                style={{
                  fontFamily: "var(--font-montserrat)",
                  fontSize: "0.8125rem",
                  fontWeight: 700,
                  color: "oklch(65% 0.15 45)",
                  textDecoration: "none",
                }}
              >
                ← Team Dashboard
              </Link>
            </div>
          )}
        </div>
      </section>

      {/* ── SECTIONS ── */}
      <section style={{ paddingBlock: "clamp(2rem, 4vw, 4rem)", background: "oklch(97% 0.005 80)" }}>
        <div className="container-wide">
          {SECTION_ORDER.map((section) => {
            const sectionResources = RESOURCES.filter(
              (res) => getLibraryCategory(res, moduleCategories) === section.key
            );
            if (sectionResources.length === 0) return null;
            const isOpen = openSections.has(section.key);

            return (
              <div key={section.key} style={{ borderBottom: "1px solid oklch(88% 0.008 80)" }}>
                {/* Accordion header */}
                <button
                  onClick={() => toggleSection(section.key)}
                  style={{
                    width: "100%",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    padding: "1.25rem 0",
                    background: "none",
                    border: "none",
                    cursor: "pointer",
                    textAlign: "left",
                    gap: "1rem",
                  }}
                >
                  <div style={{ display: "flex", alignItems: "baseline", gap: "0.75rem" }}>
                    <span style={{
                      fontFamily: "var(--font-montserrat)",
                      fontWeight: 700,
                      fontSize: "clamp(0.95rem, 2.5vw, 1.125rem)",
                      color: "oklch(22% 0.005 260)",
                    }}>
                      {section.label}
                    </span>
                    <span style={{
                      fontFamily: "var(--font-montserrat)",
                      fontSize: "0.68rem",
                      fontWeight: 700,
                      letterSpacing: "0.08em",
                      textTransform: "uppercase",
                      color: "oklch(62% 0.008 260)",
                    }}>
                      {sectionResources.length} {sectionResources.length === 1 ? "resource" : "resources"}
                    </span>
                  </div>
                  <span style={{
                    fontFamily: "var(--font-montserrat)",
                    fontSize: "0.75rem",
                    color: "oklch(55% 0.008 260)",
                    flexShrink: 0,
                    transform: isOpen ? "rotate(180deg)" : "rotate(0deg)",
                    transition: "transform 0.2s ease",
                    display: "inline-block",
                  }}>▼</span>
                </button>

                {/* Tiles — shown when open */}
                {isOpen && (
                  <div style={{ paddingBottom: "1.75rem" }}>
                    <div className="resource-grid">
                      {sectionResources.map((resource) => (
                        <ResourceTile
                          key={resource.id}
                          resource={resource}
                          userId={userId}
                          moduleStatuses={moduleStatuses}
                          localSaved={localSaved}
                          pendingSlug={pendingSlug}
                          onAddToDashboard={handleAddToDashboard}
                          lang={lang}
                          localTitle={localTitle}
                          localDescription={localDescription}
                        />
                      ))}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>

      {/* ── MEMBERSHIP CTA ── */}
      {!userId && (
        <section style={{ paddingBlock: "clamp(4rem, 7vw, 7rem)", background: "oklch(30% 0.12 260)", position: "relative" }}>
          <div style={{ position: "absolute", left: "clamp(1.5rem, 5vw, 4rem)", top: 0, bottom: 0, width: "3px", background: "oklch(65% 0.15 45)" }} />
          <div className="container-wide">
            <div style={{ maxWidth: "560px", paddingLeft: "2.5rem" }}>
              <p className="t-label" style={{ color: "oklch(65% 0.15 45)", marginBottom: "1rem" }}>Membership</p>
              <h2 className="t-section" style={{ color: "oklch(97% 0.005 80)", marginBottom: "1.25rem" }}>
                Get access to the full library.
              </h2>
              <p style={{ fontFamily: "var(--font-montserrat)", fontSize: "0.9375rem", lineHeight: 1.7, color: "oklch(72% 0.04 260)", marginBottom: "2rem", maxWidth: "44ch" }}>
                30+ resources, 8 assessments, and team tools — all for Christian cross-cultural leaders. Free during the early phase. Apply to join.
              </p>
              <Link href="/membership" className="btn-primary" style={{ display: "inline-flex" }}>
                Apply for membership →
              </Link>
            </div>
          </div>
        </section>
      )}
    </>
  );
}

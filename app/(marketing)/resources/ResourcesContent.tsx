"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import { useLanguage } from "@/lib/LanguageContext";
import { RESOURCES, Resource } from "@/lib/resources-data";
import { saveResourceToDashboard } from "./actions";
import { trackResourceSaved } from "@/lib/ga-events";

interface Props {
  userId: string | null;
  pathway: string | null;
  isTeamLeader: boolean;
  savedResources?: string[];
  moduleStatuses?: Record<string, string>;
  moduleCategories?: Record<string, string>;
  moduleFormats?: Record<string, string[]>;
}

const TYPE_COLORS: Record<string, string> = {
  "Assessment":      "oklch(52% 0.15 280)",
  "Self Evaluation": "oklch(42% 0.14 170)",
  "Thinking Tool":   "oklch(40% 0.14 230)",
  "Guide":           "oklch(48% 0.15 45)",
  "Deep Dive":       "oklch(40% 0.15 10)",
  "Worksheet":       "oklch(46% 0.16 145)",
  "Article":         "oklch(42% 0.14 260)",
  "Interactive":     "oklch(45% 0.14 200)",
  "Video":           "oklch(45% 0.15 30)",
};

const TYPE_LABELS_ID: Record<string, string> = {
  "Assessment":      "Asesmen",
  "Self Evaluation": "Evaluasi Diri",
  "Thinking Tool":   "Alat Berpikir",
  "Guide":           "Panduan",
  "Deep Dive":       "Kajian Mendalam",
  "Worksheet":       "Lembar Kerja",
  "Article":         "Artikel",
  "Interactive":     "Interaktif",
  "Video":           "Video",
};

const SECTION_ORDER = [
  { key: "assessments",        label: "Assessments",          labelId: "Asesmen" },
  { key: "cross-cultural",     label: "Cross-Cultural",       labelId: "Lintas Budaya" },
  { key: "leadership",         label: "Leadership",           labelId: "Kepemimpinan" },
  { key: "team-facilitation",  label: "Team & Facilitation",  labelId: "Tim & Fasilitasi" },
  { key: "personal-development", label: "Personal Development", labelId: "Pengembangan Diri" },
  { key: "thinking-tools",     label: "Thinking Tools",       labelId: "Alat Berpikir" },
  { key: "faith-calling",      label: "Faith & Calling",      labelId: "Iman & Panggilan" },
  { key: "self-care",          label: "Self-Care & Resilience", labelId: "Perawatan Diri & Ketahanan" },
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
  if (resource.slug && resource.slug in moduleCategories) {
    const cat = moduleCategories[resource.slug];
    return cat || "__hidden__"; // "" = explicitly UNSET → hidden from all sections
  }
  if (resource.format === "Assessment") return "assessments";
  return resource.topics[0] ?? "personal-development";
}

function ResourceTile({
  resource,
  userId,
  moduleStatuses,
  moduleFormats,
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
  moduleFormats: Record<string, string[]>;
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
  const types: string[] = resource.slug ? (moduleFormats[resource.slug] ?? []) : [];
  const displayTypes = types.length > 0 ? types : [resource.format];

  const barColor =
    access === "live_free"
      ? "oklch(55% 0.15 150)"
      : access === "live_paid"
      ? "oklch(65% 0.15 45)"
      : "oklch(85% 0.005 260)";

  const barLabel =
    access === "live_free"
      ? (lang === "id" ? "GRATIS" : "FREE")
      : access === "live_paid"
      ? (lang === "id" ? "ANGGOTA" : "MEMBER")
      : (lang === "id" ? "SEGERA" : "COMING SOON");

  const cleanTime = resource.time.replace(/\s*\+\s*quiz/gi, "");
  const displayTime = lang === "id" ? cleanTime.replace(/\bmin\b/, "mnt") : cleanTime;

  const inner = (
    <div
      style={{
        display: "flex",
        border: "1px solid oklch(88% 0.008 80)",
        borderRadius: "4px",
        overflow: "hidden",
        background: access === "development" ? "oklch(96% 0.003 260)" : "oklch(99.5% 0.002 80)",
        opacity: access === "development" ? 0.65 : 1,
        cursor: isClickable ? "pointer" : "default",
        transition: "box-shadow 0.12s, transform 0.12s",
        boxShadow: hovered && isClickable ? "0 2px 8px oklch(0% 0 0 / 0.08)" : "none",
        transform: hovered && isClickable ? "translateY(-1px)" : "none",
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* Left bar */}
      <div style={{
        width: "36px",
        flexShrink: 0,
        background: barColor,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}>
          <span style={{
            fontFamily: "var(--font-montserrat)",
            fontSize: "0.45rem",
            fontWeight: 800,
            letterSpacing: "0.14em",
            color: access === "development" ? "oklch(52% 0.008 260)" : "oklch(99% 0.002 80)",
            writingMode: "vertical-lr",
            textTransform: "uppercase",
            userSelect: "none",
          }}>
            {barLabel}
          </span>
      </div>

      {/* Content */}
      <div style={{
        flex: 1,
        padding: "0.75rem 1rem",
        display: "flex",
        flexDirection: "column",
        gap: "0.2rem",
        minWidth: 0,
      }}>
        <p style={{
          fontFamily: "var(--font-montserrat)",
          fontWeight: 700,
          fontSize: "0.875rem",
          color: "oklch(22% 0.005 260)",
          margin: 0,
          overflow: "hidden",
          whiteSpace: "nowrap",
          textOverflow: "ellipsis",
        }}>
          {localTitle(resource)}
        </p>
        <p style={{
          fontFamily: "var(--font-montserrat)",
          fontSize: "0.75rem",
          color: "oklch(52% 0.008 260)",
          margin: 0,
          lineHeight: 1.4,
          display: "-webkit-box",
          WebkitLineClamp: 2,
          WebkitBoxOrient: "vertical",
          overflow: "hidden",
        }}>
          {localDescription(resource)}
        </p>
        <div style={{
          display: "flex",
          alignItems: "center",
          gap: "0.5rem",
          marginTop: "0.3rem",
          flexWrap: "wrap",
        }}>
          <span style={{
            fontFamily: "var(--font-montserrat)",
            fontSize: "0.65rem",
            color: "oklch(55% 0.008 260)",
            fontWeight: 600,
            flexShrink: 0,
          }}>
            {displayTime}
          </span>
          {displayTypes.map(type => {
            const color = TYPE_COLORS[type] ?? "oklch(42% 0.08 260)";
            return (
              <span key={type} style={{
                fontFamily: "var(--font-montserrat)",
                fontSize: "0.55rem",
                fontWeight: 700,
                letterSpacing: "0.08em",
                textTransform: "uppercase",
                color,
                background: "oklch(93% 0.005 80)",
                padding: "1px 6px",
                borderRadius: 999,
                flexShrink: 0,
              }}>
                {lang === "id" ? (TYPE_LABELS_ID[type] ?? type) : type}
              </span>
            );
          })}
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
  moduleFormats = {},
}: Props) {
  const { t, lang } = useLanguage();
  const r = t.resources;
  const [localSaved, setLocalSaved] = useState<Set<string>>(
    new Set(savedResources)
  );
  const [pendingSlug, setPendingSlug] = useState<string | null>(null);
  const [, startTransition] = useTransition();
  const [openSections, setOpenSections] = useState<Set<string>>(new Set());
  const [searchQuery, setSearchQuery] = useState("");

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
      trackResourceSaved(slug, true);
      setLocalSaved((prev) => new Set([...prev, slug]));
      setPendingSlug(null);
    });
  }

  function localTitle(resource: Resource) {
    if (lang === "id" && resource.titleId) return resource.titleId;
    return resource.title;
  }

  function localDescription(resource: Resource) {
    if (lang === "id" && resource.descriptionId) return resource.descriptionId;
    return resource.description;
  }

  const trimmedQuery = searchQuery.trim().toLowerCase();
  const searchResults = trimmedQuery
    ? RESOURCES.filter((res) => {
        const haystack = [
          res.title,
          res.description,
          res.titleId ?? "",
          res.descriptionId ?? "",
        ].join(" ").toLowerCase();
        return haystack.includes(trimmedQuery);
      })
    : null;

  return (
    <>
      {/* ── HEADER ── */}
      <section
        style={{
          paddingTop: "clamp(4rem, 7vw, 7rem)",
          paddingBottom: "clamp(4rem, 7vw, 7rem)",
          background: "oklch(22% 0.10 260)",
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* Photo background */}
        <div aria-hidden="true" style={{ position: "absolute", inset: 0, backgroundImage: "url('/pathway-library.jpg')", backgroundSize: "cover", backgroundPosition: "center 40%", opacity: 0.15, pointerEvents: "none" }} />
        <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: "3px", background: "oklch(65% 0.15 45)" }} />
        <div aria-hidden="true" style={{ position: "absolute", inset: 0, backgroundImage: "radial-gradient(circle, oklch(97% 0.005 80 / 0.06) 1px, transparent 1px)", backgroundSize: "28px 28px", pointerEvents: "none" }} />

        <div className="container-wide" style={{ position: "relative" }}>
          {/* Logo + label row */}
          <div style={{ display: "flex", alignItems: "center", gap: "0.875rem", marginBottom: "1.5rem" }}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/logo-icon-dark-badge.png" alt="Crispy Development" width={28} height={28} style={{ flexShrink: 0, display: "block" }} />
            <p style={{ fontFamily: "var(--font-montserrat)", fontSize: "0.7rem", fontWeight: 700, letterSpacing: "0.2em", textTransform: "uppercase", color: "oklch(65% 0.15 45)", margin: 0 }}>
              {r.label}
            </p>
          </div>
          <div style={{ width: "48px", height: "2px", background: "oklch(65% 0.15 45)", marginBottom: "1.75rem" }} />

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
              color: "oklch(80% 0.025 260)",
              maxWidth: "52ch",
              lineHeight: 1.75,
            }}
          >
            {r.tagline}
          </p>

          {/* Search */}
          <div style={{ marginTop: "1.75rem", maxWidth: "420px", position: "relative" }}>
            <svg
              viewBox="0 0 20 20"
              fill="none"
              stroke="oklch(60% 0.04 260)"
              strokeWidth="1.8"
              style={{ position: "absolute", left: "0.875rem", top: "50%", transform: "translateY(-50%)", width: 16, height: 16, pointerEvents: "none" }}
            >
              <circle cx="8.5" cy="8.5" r="5.5" />
              <line x1="13" y1="13" x2="18" y2="18" />
            </svg>
            <input
              type="search"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={lang === "id" ? "Cari modul..." : "Search modules..."}
              style={{
                width: "100%",
                boxSizing: "border-box",
                paddingLeft: "2.5rem",
                paddingRight: searchQuery ? "2.5rem" : "1rem",
                paddingBlock: "0.65rem",
                fontFamily: "var(--font-montserrat)",
                fontSize: "0.875rem",
                color: "oklch(22% 0.005 260)",
                background: "oklch(97% 0.005 80)",
                border: "1.5px solid oklch(60% 0.04 260 / 0.4)",
                borderRadius: "6px",
                outline: "none",
              }}
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                aria-label="Clear search"
                style={{
                  position: "absolute", right: "0.75rem", top: "50%", transform: "translateY(-50%)",
                  background: "none", border: "none", cursor: "pointer",
                  color: "oklch(55% 0.008 260)", fontSize: "1rem", lineHeight: 1, padding: 0,
                }}
              >
                ×
              </button>
            )}
          </div>

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

          {/* Search results */}
          {searchResults !== null && (
            <div>
              <p style={{
                fontFamily: "var(--font-montserrat)",
                fontSize: "0.8rem",
                fontWeight: 600,
                color: "oklch(52% 0.008 260)",
                marginBottom: "1.25rem",
              }}>
                {searchResults.length === 0
                  ? (lang === "id" ? "Tidak ada hasil ditemukan." : "No results found.")
                  : lang === "id"
                    ? `${searchResults.length} modul ditemukan`
                    : `${searchResults.length} module${searchResults.length === 1 ? "" : "s"} found`}
              </p>
              {searchResults.length > 0 && (
                <div className="resource-grid">
                  {searchResults.map((resource) => (
                    <ResourceTile
                      key={resource.id}
                      resource={resource}
                      userId={userId}
                      moduleStatuses={moduleStatuses}
                      moduleFormats={moduleFormats}
                      localSaved={localSaved}
                      pendingSlug={pendingSlug}
                      onAddToDashboard={handleAddToDashboard}
                      lang={lang}
                      localTitle={localTitle}
                      localDescription={localDescription}
                    />
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Category accordions — hidden while searching */}
          {searchResults === null && SECTION_ORDER.map((section) => {
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
                      color: isOpen ? "oklch(65% 0.15 45)" : "oklch(22% 0.005 260)",
                      transition: "color 0.15s",
                    }}>
                      {lang === "id" ? section.labelId : section.label}
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
                          moduleFormats={moduleFormats}
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

      {/* ── CHALLENGE BANNER ── */}
      <section style={{ background: "oklch(95% 0.012 260)", paddingBlock: "clamp(3.5rem, 6vw, 5.5rem)", position: "relative", overflow: "hidden", borderTop: "3px solid oklch(65% 0.15 45)", borderBottom: "3px solid oklch(65% 0.15 45)" }}>
        {/* Iceberg */}
        <div aria-hidden="true" style={{ position: "absolute", top: 0, right: 0, bottom: 0, width: "clamp(260px, 42vw, 560px)", pointerEvents: "none", overflow: "hidden" }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/iceberg-full.jpg" alt="" style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: "center 40%", display: "block", opacity: 0.55 }} />
          <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to right, oklch(95% 0.012 260) 0%, oklch(95% 0.012 260 / 0.6) 35%, transparent 70%)" }} />
        </div>

        <div className="container-wide" style={{ position: "relative" }}>
          <div style={{ maxWidth: "620px" }}>
            {/* Eyebrow */}
            <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginBottom: "1.5rem" }}>
              <span style={{ fontFamily: "var(--font-montserrat)", fontSize: "0.6rem", fontWeight: 800, letterSpacing: "0.2em", textTransform: "uppercase", color: "oklch(65% 0.15 45)", border: "1px solid oklch(65% 0.15 45 / 0.6)", padding: "0.28em 0.75em", borderRadius: "3px" }}>
                {lang === "id" ? "Gratis" : "Free"}
              </span>
              <span style={{ fontFamily: "var(--font-montserrat)", fontSize: "0.6rem", fontWeight: 700, letterSpacing: "0.16em", textTransform: "uppercase", color: "oklch(42% 0.07 260)" }}>
                {lang === "id" ? "Tantangan · 60 hari" : "Challenge · 60 days"}
              </span>
            </div>

            {/* Headline */}
            <h2 style={{ fontFamily: "var(--font-cormorant)", fontStyle: "italic", fontWeight: 600, fontSize: "clamp(2rem, 4vw, 3.25rem)", lineHeight: 1.05, color: "oklch(22% 0.10 260)", margin: "0 0 1rem" }}>
              {lang === "id" ? "Kepemimpinan dimulai\ndari dalam." : "Leadership starts\non the inside."}
            </h2>

            {/* Body */}
            <p style={{ fontFamily: "var(--font-montserrat)", fontSize: "0.9rem", lineHeight: 1.75, color: "oklch(38% 0.05 260)", margin: "0 0 2rem", maxWidth: "46ch" }}>
              {lang === "id"
                ? "Tantangan Kepemimpinan Berpengaruh — perjalanan 60 hari berdasarkan Deep Influence karya T.J. Addington. Untuk pemimpin dan tim yang ingin bertumbuh dari dalam ke luar."
                : "The Influential Leadership Challenge — a 60-day guided journey based on T.J. Addington's Deep Influence. For leaders and teams who want to grow from the inside out."}
            </p>

            {/* CTA */}
            <Link
              href="/influential-leadership-challenge"
              style={{ display: "inline-flex", alignItems: "center", gap: "0.5rem", fontFamily: "var(--font-montserrat)", fontWeight: 800, fontSize: "0.8rem", letterSpacing: "0.08em", textTransform: "uppercase", color: "oklch(22% 0.10 260)", background: "oklch(65% 0.15 45)", padding: "0.875rem 2rem", borderRadius: "4px", textDecoration: "none" }}
            >
              {lang === "id" ? "Ikuti Sekarang" : "Join Now"} <span aria-hidden="true">→</span>
            </Link>
          </div>
        </div>
      </section>

      {/* ── CONTRIBUTE SECTION ── */}
      <section style={{ paddingBlock: "clamp(2.5rem, 5vw, 4rem)", background: "oklch(97% 0.005 80)" }}>
        <div className="container-wide">
          <div style={{ maxWidth: "600px" }}>
            <p style={{
              fontFamily: "var(--font-montserrat)",
              fontSize: "0.62rem",
              fontWeight: 700,
              letterSpacing: "0.14em",
              textTransform: "uppercase",
              color: "oklch(65% 0.15 45)",
              marginBottom: "1rem",
            }}>
              {lang === "id" ? "Ikut Berkontribusi" : "Get Involved"}
            </p>
            <p style={{
              fontFamily: "var(--font-montserrat)",
              fontSize: "clamp(0.9rem, 2vw, 1rem)",
              lineHeight: 1.75,
              color: "oklch(35% 0.008 260)",
              marginBottom: "1.25rem",
              maxWidth: "52ch",
            }}>
              {lang === "id"
                ? "Perpustakaan kami terus berkembang. Kami mengembangkan materi pelatihan baru seputar topik-topik yang relevan dalam kepemimpinan lintas budaya, dan kami ingin mendengar pendapat Anda. Ingin menyarankan topik modul baru atau ikut terlibat dalam pengembangannya?"
                : "Our library is always growing. We develop new training materials around timely topics in cross-cultural leadership, and we'd love your input. Want to suggest a new module topic or get involved in developing one?"}
            </p>
            <Link
              href="/contact"
              style={{
                fontFamily: "var(--font-montserrat)",
                fontSize: "0.875rem",
                fontWeight: 700,
                color: "oklch(65% 0.15 45)",
                textDecoration: "none",
                display: "inline-flex",
                alignItems: "center",
                gap: "0.3rem",
              }}
            >
              {lang === "id" ? "Hubungi kami →" : "Get in touch →"}
            </Link>
          </div>
        </div>
      </section>

      {/* ── MEMBERSHIP CTA ── */}
      {!userId && (
        <section style={{ paddingBlock: "clamp(4rem, 7vw, 7rem)", background: "oklch(22% 0.10 260)", position: "relative" }}>
          <div style={{ position: "absolute", left: "clamp(1.5rem, 5vw, 4rem)", top: 0, bottom: 0, width: "3px", background: "oklch(65% 0.15 45)" }} />
          <div className="container-wide">
            <div style={{ maxWidth: "560px", paddingLeft: "2.5rem" }}>
              <p className="t-label" style={{ color: "oklch(65% 0.15 45)", marginBottom: "1rem" }}>{r.label}</p>
              <h2 className="t-section" style={{ color: "oklch(97% 0.005 80)", marginBottom: "1.25rem" }}>
                {lang === "id" ? "Jelajahi semua modul pelatihan." : "Explore all training modules."}
              </h2>
              <p style={{ fontFamily: "var(--font-montserrat)", fontSize: "0.9375rem", lineHeight: 1.7, color: "oklch(72% 0.04 260)", marginBottom: "2rem", maxWidth: "44ch" }}>
                {lang === "id"
                  ? "Modul pelatihan mandiri untuk pemimpin Kristen lintas budaya. Daftar untuk bergabung."
                  : "Self-paced training modules for Christian cross-cultural leaders. Apply to join."}
              </p>
              <Link href="/membership" className="btn-primary" style={{ display: "inline-flex" }}>
                {lang === "id" ? "Daftar keanggotaan →" : "Apply for membership →"}
              </Link>
            </div>
          </div>
        </section>
      )}
    </>
  );
}

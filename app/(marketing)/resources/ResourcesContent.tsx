"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import { useLanguage } from "@/lib/LanguageContext";
import { RESOURCES, Resource } from "@/lib/resources-data";
import { saveResourceToDashboard } from "./actions";
import { trackResourceSaved } from "@/lib/ga-events";
import { T, SERIF, SANS, KIT_CSS, Eyebrow, h2Style, bodyStyle, PrimaryLink, TextLink } from "@/components/promo/PromoKit";

interface Props {
  userId: string | null;
  pathway: string | null;
  isTeamLeader: boolean;
  savedResources?: string[];
  moduleStatuses?: Record<string, string>;
  moduleCategories?: Record<string, string>;
  moduleFormats?: Record<string, string[]>;
  isAdmin?: boolean;
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

const LIB_CSS = `
.lib { display: flex; flex-direction: column; gap: clamp(3rem, 7vw, 5.5rem); }
.lib-top { display: grid; grid-template-columns: minmax(0, 1fr); gap: 1.5rem; }
.lib-split { display: grid; grid-template-columns: minmax(0, 1fr); gap: clamp(1.5rem, 4vw, 3rem); }
.lib-search:focus-visible, .lib-acc:focus-visible { outline: 2px solid ${T.orange}; outline-offset: 3px; }
.lib-acc:hover .lib-acc-label { color: ${T.navyMid} !important; }
.lib-chev { transition: transform 0.2s ease; }
@media (min-width: 960px) {
  .lib-top { grid-template-columns: minmax(0, 7fr) minmax(0, 5fr); align-items: end; }
  .lib-split { grid-template-columns: minmax(0, 5fr) minmax(0, 7fr); }
}
@media (prefers-reduced-motion: reduce) { .lib-chev { transition: none; } }
`;

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
  isAdmin = false,
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
  isAdmin?: boolean;
}) {
  const [hovered, setHovered] = useState(false);
  const access = getModuleAccess(resource.slug, resource.gated, moduleStatuses);
  // Admin can open development modules to review drafts before release.
  const isAdminDraft = isAdmin && !!resource.slug && access === "development";
  const isClickable =
    !!resource.slug && (access === "live_free" || access === "live_paid" || isAdminDraft);
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
        opacity: access === "development" && !isAdminDraft ? 0.65 : 1,
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
          {isAdminDraft && (
            <span style={{
              fontFamily: "var(--font-montserrat)",
              fontSize: "0.55rem",
              fontWeight: 800,
              letterSpacing: "0.08em",
              textTransform: "uppercase",
              color: "oklch(99% 0.002 80)",
              background: "oklch(65% 0.15 45)",
              padding: "1px 6px",
              borderRadius: 999,
              marginRight: "0.4rem",
              verticalAlign: "middle",
            }}>
              {lang === "id" ? "Draf" : "Draft"}
            </span>
          )}
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
  isAdmin = false,
}: Props) {
  const { lang } = useLanguage();
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
          ...(res.keywords ?? []),
        ].join(" ").toLowerCase();
        return haystack.includes(trimmedQuery);
      })
    : null;

  const sectionsWithItems = SECTION_ORDER
    .map(section => ({
      ...section,
      items: RESOURCES.filter(res => getLibraryCategory(res, moduleCategories) === section.key),
    }))
    .filter(section => section.items.length > 0);

  const tile = (resource: Resource) => (
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
      isAdmin={isAdmin}
    />
  );

  return (
    <div style={{ background: T.offWhite }}>
      <div className="container-wide lib" lang={lang} style={{ paddingBlock: "clamp(2.5rem, 6vw, 4.5rem)" }}>
        <style>{KIT_CSS + LIB_CSS}</style>

        {/* ── TOP: title + search, no hero ── */}
        <header className="lib-top">
          <div style={{ display: "flex", flexDirection: "column", gap: "0.9rem" }}>
            <Eyebrow>{lang === "id" ? "Perpustakaan" : "Library"}</Eyebrow>
            <h1 style={{ ...h2Style(), fontSize: "clamp(2.1rem, 4.4vw, 3.1rem)", lineHeight: 1.05 }}>
              {lang === "id" ? "Modul pelatihan untuk pemimpin lintas budaya." : "Training modules for cross-cultural leaders."}
            </h1>
            {isTeamLeader && pathway === "team" && (
              <div>
                <TextLink href="/dashboard">{lang === "id" ? "Kembali ke dasbor tim" : "Back to team dashboard"}</TextLink>
              </div>
            )}
          </div>
          <div style={{ position: "relative", width: "100%", maxWidth: "26rem", justifySelf: "end" }}>
            <svg
              viewBox="0 0 20 20"
              fill="none"
              stroke={T.muted}
              strokeWidth="1.8"
              aria-hidden="true"
              style={{ position: "absolute", left: "0.95rem", top: "50%", transform: "translateY(-50%)", width: 16, height: 16, pointerEvents: "none" }}
            >
              <circle cx="8.5" cy="8.5" r="5.5" />
              <line x1="13" y1="13" x2="18" y2="18" />
            </svg>
            <input
              type="search"
              className="lib-search"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={lang === "id" ? "Cari modul..." : "Search modules..."}
              aria-label={lang === "id" ? "Cari modul" : "Search modules"}
              style={{
                width: "100%",
                boxSizing: "border-box",
                minHeight: 48,
                paddingLeft: "2.6rem",
                paddingRight: searchQuery ? "2.6rem" : "1rem",
                fontFamily: SANS,
                fontSize: "0.9rem",
                color: T.charcoal,
                background: "oklch(99.5% 0.002 80)",
                border: `1px solid ${T.rule}`,
                borderRadius: 2,
              }}
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                aria-label={lang === "id" ? "Hapus pencarian" : "Clear search"}
                style={{
                  position: "absolute", right: "0.4rem", top: "50%", transform: "translateY(-50%)",
                  minWidth: 36, minHeight: 36,
                  background: "none", border: "none", cursor: "pointer",
                  color: T.muted, fontSize: "1.1rem", lineHeight: 1, padding: 0,
                }}
              >
                ×
              </button>
            )}
          </div>
        </header>

        {/* ── LIBRARY ── */}
        <section aria-label={lang === "id" ? "Modul" : "Modules"} style={{ borderTop: `1px solid ${T.navy}` }}>
          {searchResults !== null && (
            <div style={{ paddingTop: "1.5rem" }}>
              <p style={{ fontFamily: SANS, fontSize: "0.8rem", fontWeight: 600, color: T.muted, margin: "0 0 1.25rem" }}>
                {searchResults.length === 0
                  ? (lang === "id" ? "Tidak ada hasil ditemukan." : "No results found.")
                  : lang === "id"
                    ? `${searchResults.length} modul ditemukan`
                    : `${searchResults.length} module${searchResults.length === 1 ? "" : "s"} found`}
              </p>
              {searchResults.length > 0 && <div className="resource-grid">{searchResults.map(tile)}</div>}
            </div>
          )}

          {searchResults === null && sectionsWithItems.map((section, i) => {
            const isOpen = openSections.has(section.key);
            return (
              <div key={section.key} style={{ borderBottom: `1px solid ${T.rule}` }}>
                <button
                  className="lib-acc"
                  onClick={() => toggleSection(section.key)}
                  aria-expanded={isOpen}
                  style={{
                    width: "100%",
                    display: "grid",
                    gridTemplateColumns: "2.5rem minmax(0, 1fr) auto auto",
                    alignItems: "center",
                    gap: "0.75rem",
                    padding: "1.25rem 0",
                    background: "none",
                    border: "none",
                    cursor: "pointer",
                    textAlign: "left",
                  }}
                >
                  <span aria-hidden="true" style={{ fontFamily: SERIF, fontStyle: "italic", fontSize: "1.2rem", color: T.orangeDeep }}>
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <span className="lib-acc-label" style={{ fontFamily: SERIF, fontStyle: "italic", fontWeight: 500, fontSize: "clamp(1.4rem, 2.8vw, 1.8rem)", lineHeight: 1.15, color: isOpen ? T.orangeDeep : T.navy }}>
                    {lang === "id" ? section.labelId : section.label}
                  </span>
                  <span style={{ fontFamily: SANS, fontSize: "0.72rem", fontWeight: 600, color: T.muted }}>
                    {section.items.length}
                  </span>
                  <span aria-hidden="true" className="lib-chev" style={{ fontSize: "0.7rem", color: T.muted, display: "inline-block", transform: isOpen ? "rotate(180deg)" : "none" }}>▼</span>
                </button>
                {isOpen && (
                  <div style={{ paddingBottom: "1.75rem" }}>
                    <div className="resource-grid">{section.items.map(tile)}</div>
                  </div>
                )}
              </div>
            );
          })}
        </section>

        {/* ── GET INVOLVED ── */}
        <section aria-labelledby="lib-involved" style={{ background: T.band, padding: "clamp(2rem, 5vw, 3.5rem) clamp(1.25rem, 4.5vw, 3.5rem)" }}>
          <div className="lib-split">
            <div style={{ display: "flex", flexDirection: "column", gap: "1.1rem" }}>
              <Eyebrow>{lang === "id" ? "Ikut berkontribusi" : "Get involved"}</Eyebrow>
              <h2 id="lib-involved" style={h2Style()}>
                {lang === "id" ? "Perpustakaan ini terus bertumbuh." : "This library keeps growing."}
              </h2>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: "1.25rem", alignItems: "flex-start", alignSelf: "end" }}>
              <p style={bodyStyle}>
                {lang === "id"
                  ? "Kami terus mengembangkan materi pelatihan baru seputar topik-topik penting dalam kepemimpinan lintas budaya, dan kami ingin mendengar masukan Anda. Ingin menyarankan topik modul baru atau ikut mengembangkannya?"
                  : "We keep developing new training materials on timely topics in cross-cultural leadership, and we'd love your input. Want to suggest a new module topic or help develop one?"}
              </p>
              <TextLink href="/contact">{lang === "id" ? "Hubungi kami" : "Get in touch"}</TextLink>
            </div>
          </div>
        </section>

        {/* ── LOGGED-OUT CTA ── */}
        {!userId && (
          <section aria-labelledby="lib-cta" className="lib-split" style={{ borderTop: `2px solid ${T.orange}`, paddingTop: "clamp(2rem, 5vw, 3rem)" }}>
            <h2 id="lib-cta" style={h2Style()}>
              {lang === "id" ? "Buka seluruh perpustakaan." : "Open up the whole library."}
            </h2>
            <div style={{ display: "flex", flexDirection: "column", gap: "1.25rem", alignItems: "flex-start" }}>
              <p style={bodyStyle}>
                {lang === "id"
                  ? "Modul gratis terbuka dengan akun gratis. Modul anggota sudah termasuk dalam jalur Personal dan Team."
                  : "Free modules open with a free account. Member modules come with the Personal and Team paths."}
              </p>
              <div style={{ display: "flex", flexWrap: "wrap", alignItems: "center", gap: "1rem 1.5rem" }}>
                <PrimaryLink href="/pricing">{lang === "id" ? "Lihat harga" : "See pricing"}</PrimaryLink>
                <TextLink href="/personal">Personal</TextLink>
                <TextLink href="/team">Team</TextLink>
              </div>
            </div>
          </section>
        )}
      </div>
    </div>
  );
}

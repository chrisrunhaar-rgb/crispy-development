"use client";

import { motion } from "motion/react";
import { useState } from "react";
import type { CSSProperties } from "react";
import type { Resource, Lang } from "@/lib/resources-data";

const t = (en: string, id: string, lang: Lang) => (lang === "id" ? id : en);

export interface ExploreSection {
  key: string;
  label: string;
  labelId: string;
  hue: number;
  hookEn: string;
  hookId: string;
  pullQuoteEn?: string;
  pullQuoteId?: string;
  items: Resource[];
}

interface Props {
  section: ExploreSection;
  lang: Lang;
  moduleFormats: Record<string, string[]>;
  onSelect: (resource: Resource) => void;
}

const containerVariants = {
  hidden: {},
  show: {
    transition: { staggerChildren: 0.06, delayChildren: 0.05 },
  },
};

const tileVariants = {
  hidden: { opacity: 0, y: 18 },
  show: { opacity: 1, y: 0, transition: { duration: 0.45, ease: "easeOut" } },
};

// Long topics (e.g. 24-module Personal Development) show a capped preview grid plus
// an "Explore all N" tile so a single scroll-snap panel never blows past one
// viewport's worth of content on mobile. Short topics render everything, no cap.
const VISIBLE_CAP = 8;

export default function TopicSection({ section, lang, moduleFormats, onSelect }: Props) {
  const [expanded, setExpanded] = useState(false);
  const label = lang === "id" ? section.labelId : section.label;
  const hook = lang === "id" ? section.hookId : section.hookEn;
  const pullQuote = lang === "id" ? section.pullQuoteId : section.pullQuoteEn;
  const accent = `oklch(65% 0.15 ${section.hue})`;
  const isLarge = section.items.length > 8;
  const isCapped = isLarge && !expanded && section.items.length > VISIBLE_CAP;
  const visibleItems = isCapped ? section.items.slice(0, VISIBLE_CAP) : section.items;
  const hiddenCount = section.items.length - visibleItems.length;

  return (
    <motion.section
      className="explore-section"
      style={{ "--section-accent": accent } as CSSProperties}
      initial={{ opacity: 0, y: 32 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.15 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
    >
      <div className="container-wide">
        <div className="explore-section-head">
          <span className="explore-section-eyebrow" style={{ color: accent }}>
            {label} &middot; {section.items.length}{" "}
            {t(section.items.length === 1 ? "module" : "modules", "modul", lang)}
          </span>
          <p style={{ maxWidth: "640px", fontSize: "1.05rem", lineHeight: 1.5, color: "oklch(38% 0.007 260)" }}>
            {hook}
          </p>
        </div>

        <motion.div
          className={isLarge ? "explore-tile-grid" : "explore-list"}
          variants={containerVariants}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.1 }}
        >
          {visibleItems.map((resource) => {
            const title = lang === "id" && resource.titleId ? resource.titleId : resource.title;
            const types = resource.slug ? moduleFormats[resource.slug] : undefined;
            const displayFormat = types && types.length > 0 ? types[0] : resource.format;
            return (
              <motion.button
                key={resource.id}
                type="button"
                className="explore-tile"
                variants={tileVariants}
                onClick={() => onSelect(resource)}
              >
                <span
                  style={{
                    fontFamily: "var(--font-montserrat)",
                    fontWeight: 600,
                    fontSize: "0.95rem",
                    color: "oklch(22% 0.005 260)",
                  }}
                >
                  {title}
                </span>
                <span style={{ fontSize: "0.75rem", color: "oklch(52% 0.008 260)" }}>
                  {resource.time} &middot; {displayFormat}
                </span>
              </motion.button>
            );
          })}

          {isCapped && (
            <motion.button
              type="button"
              className="explore-tile explore-tile-expand"
              variants={tileVariants}
              onClick={() => setExpanded(true)}
            >
              <span
                style={{
                  fontFamily: "var(--font-montserrat)",
                  fontWeight: 700,
                  fontSize: "0.95rem",
                  letterSpacing: "0.02em",
                }}
              >
                {t(`Explore all ${section.items.length}`, `Jelajahi semua ${section.items.length}`, lang)}
                {" →"}
              </span>
              <span style={{ fontSize: "0.75rem", opacity: 0.85 }}>
                {t(`${hiddenCount} more`, `${hiddenCount} lainnya`, lang)}
              </span>
            </motion.button>
          )}
        </motion.div>

        {!isLarge && pullQuote && <p className="explore-pull-quote">&ldquo;{pullQuote}&rdquo;</p>}
      </div>
    </motion.section>
  );
}

"use client";

import { motion, AnimatePresence } from "motion/react";
import { useEffect, useRef } from "react";
import type { CSSProperties } from "react";
import type { Resource, Lang } from "@/lib/resources-data";

const t = (en: string, id: string, lang: Lang) => (lang === "id" ? id : en);

interface Props {
  resource: Resource;
  lang: Lang;
  accentHue: number;
  onClose: () => void;
}

export default function ModulePopup({ resource, lang, accentHue, onClose }: Props) {
  const title = lang === "id" && resource.titleId ? resource.titleId : resource.title;
  const outcomes = resource.outcomes && resource.outcomes.length > 0 ? resource.outcomes : null;
  const cardRef = useRef<HTMLDivElement>(null);

  // Escape closes the popup; focus moves to the dialog on open so screen
  // readers announce it immediately (critique finding: neither existed before).
  useEffect(() => {
    cardRef.current?.focus();
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [onClose]);

  return (
    <AnimatePresence>
      <motion.div
        className="explore-popup-overlay"
        style={{ "--section-accent": `oklch(65% 0.15 ${accentHue})` } as CSSProperties}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.2 }}
        onClick={onClose}
        role="presentation"
      >
        <motion.div
          ref={cardRef}
          className="explore-popup-card"
          initial={{ opacity: 0, y: 24, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 12, scale: 0.98 }}
          transition={{ duration: 0.25, ease: "easeOut" }}
          onClick={(e) => e.stopPropagation()}
          role="dialog"
          aria-modal="true"
          aria-label={title}
          tabIndex={-1}
          style={{ outline: "none" }}
        >
          <button
            type="button"
            onClick={onClose}
            aria-label={t("Close", "Tutup", lang)}
            style={{
              float: "right",
              background: "none",
              border: "none",
              fontSize: "1.5rem",
              lineHeight: 1,
              cursor: "pointer",
              color: "oklch(45% 0.006 260)",
              width: "2.75rem",
              height: "2.75rem",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              margin: "-0.5rem -0.5rem 0 0",
            }}
          >
            &times;
          </button>

          <div
            className="t-label"
            style={{
              fontSize: "0.7rem",
              fontWeight: 700,
              letterSpacing: "0.06em",
              textTransform: "uppercase",
              color: "oklch(45% 0.006 260)",
              marginBottom: "0.5rem",
            }}
          >
            {resource.time}
          </div>

          <h3
            style={{
              fontFamily: "var(--font-montserrat)",
              fontWeight: 700,
              fontSize: "1.4rem",
              color: "oklch(22% 0.005 260)",
              marginBottom: "1rem",
            }}
          >
            {title}
          </h3>

          <div style={{ display: "flex", flexDirection: "column", gap: "0.6rem" }}>
            {outcomes ? (
              outcomes.map((outcome, i) => (
                <div key={i} style={{ display: "flex", gap: "0.6rem", alignItems: "flex-start" }}>
                  <span
                    aria-hidden="true"
                    style={{
                      marginTop: "0.4rem",
                      width: "0.4rem",
                      height: "0.4rem",
                      borderRadius: "999px",
                      background: `oklch(65% 0.15 ${accentHue})`,
                      flexShrink: 0,
                    }}
                  />
                  <p style={{ margin: 0, fontSize: "0.95rem", lineHeight: 1.5, color: "oklch(38% 0.007 260)" }}>
                    {outcome}
                  </p>
                </div>
              ))
            ) : (
              <p style={{ margin: 0, fontSize: "0.9rem", fontStyle: "italic", color: "oklch(60% 0.006 260)" }}>
                {/* Defensive fallback only — all 54 resources have outcomes populated per Decision 3 */}
                {t("Outcomes coming soon.", "Hasil pembelajaran segera hadir.", lang)}
              </p>
            )}
          </div>

          {resource.slug && (
            <a
              href={`/resources/${resource.slug}`}
              style={{
                display: "inline-block",
                marginTop: "1.5rem",
                fontFamily: "var(--font-montserrat)",
                fontWeight: 600,
                fontSize: "0.85rem",
                color: `oklch(50% 0.15 ${accentHue})`,
                textDecoration: "none",
              }}
            >
              {t("Open module", "Buka modul", lang)} &rarr;
            </a>
          )}
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

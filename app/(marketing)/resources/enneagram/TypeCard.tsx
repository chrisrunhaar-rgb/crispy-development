"use client";

import { useState, useEffect } from "react";

type Lang = "en" | "id" | "nl";
type T3 = { en: string; id: string; nl: string };

interface EnneagramType {
  number: number;
  name: T3;
  tagline: T3;
  color: string;
  colorLight: string;
  overview: T3;
  motivation: T3;
  fear: T3;
  strengths: { en: string[]; id: string[]; nl: string[] };
  blindspots: { en: string[]; id: string[]; nl: string[] };
  communication: T3;
  crossCultural: T3;
}

function tFn(obj: T3, lang: Lang): string {
  return obj[lang];
}

const TYPE_IMAGES: Record<number, string> = {
  1: "/enneagram-types/type-1.jpeg",
  2: "/enneagram-types/type-2.jpeg",
  3: "/enneagram-types/type-3.jpeg",
  4: "/enneagram-types/type-4.jpeg",
  5: "/enneagram-types/type-5.jpeg",
  6: "/enneagram-types/type-6.jpeg",
  7: "/enneagram-types/type-7.jpeg",
  8: "/enneagram-types/type-8.jpeg",
  9: "/enneagram-types/type-9.jpeg",
};

export default function TypeCard({
  type,
  lang,
  isFlipped,
  onClick,
  onClickClose,
}: {
  type: EnneagramType;
  lang: Lang;
  isFlipped: boolean;
  onClick: () => void;
  onClickClose?: () => void;
}) {
  const bgImage = TYPE_IMAGES[type.number] || null;

  return (
    <div
      onClick={onClick}
      style={{
        perspective: "1000px",
        cursor: "pointer",
        height: "100%",
        width: "100%",
      }}
    >
      <div
        style={{
          position: "relative",
          width: "100%",
          height: "100%",
          transition: "transform 0.5s cubic-bezier(0.68, -0.55, 0.265, 1.55)",
          transformStyle: "preserve-3d",
          transform: isFlipped ? "rotateY(180deg)" : "rotateY(0deg)",
        }}
      >
        {/* FRONT */}
        <div
          style={{
            position: "absolute",
            width: "100%",
            height: "100%",
            backfaceVisibility: "hidden",
            backgroundColor: type.color,
            backgroundImage: bgImage ? `url(${bgImage})` : undefined,
            backgroundSize: "cover",
            backgroundPosition: "center",
            borderRadius: "0.5rem",
            padding: "1rem",
            display: "flex",
            flexDirection: "column",
            justifyContent: "flex-end",
            boxShadow: "0 2px 8px rgba(0,0,0,0.12)",
            overflow: "hidden",
          }}
        >
          {bgImage && (
            <div
              style={{
                position: "absolute",
                inset: 0,
                background: `linear-gradient(135deg, color-mix(in oklch, ${type.color} 80%, transparent) 0%, color-mix(in oklch, ${type.color} 80%, transparent) 100%)`,
              }}
            />
          )}
          <div style={{ position: "relative", zIndex: 1 }}>
            <div
              style={{
                fontFamily: "var(--font-montserrat)",
                fontSize: "1.75rem",
                fontWeight: 800,
                color: "white",
                marginBottom: "0.25rem",
                lineHeight: 1,
              }}
            >
              {type.number}
            </div>
            <div
              style={{
                fontFamily: "var(--font-montserrat)",
                fontSize: "0.75rem",
                fontWeight: 700,
                color: "white",
                marginBottom: "0.5rem",
              }}
            >
              {tFn(type.name, lang)}
            </div>
            <div
              style={{
                fontFamily: "var(--font-cormorant)",
                fontSize: "0.7rem",
                color: "rgba(255,255,255,0.95)",
                lineHeight: 1.4,
                fontStyle: "italic",
              }}
            >
              {tFn(type.tagline, lang)}
            </div>
          </div>
        </div>

        {/* BACK */}
        <div
          style={{
            position: "absolute",
            width: "100%",
            height: "100%",
            backfaceVisibility: "hidden",
            backgroundColor: "white",
            borderRadius: "0.5rem",
            padding: "0.875rem",
            display: "flex",
            flexDirection: "column",
            justifyContent: "flex-start",
            boxShadow: "0 2px 8px rgba(0,0,0,0.12)",
            overflow: "auto",
            transform: "rotateY(180deg)",
            borderLeft: `3px solid ${type.color}`,
          }}
        >
          <div
            style={{
              fontFamily: "var(--font-montserrat)",
              fontSize: "0.6rem",
              fontWeight: 700,
              letterSpacing: "0.08em",
              textTransform: "uppercase",
              color: type.color,
              marginBottom: "0.375rem",
            }}
          >
            Type {type.number}
          </div>
          <div
            style={{
              fontFamily: "var(--font-montserrat)",
              fontSize: "0.75rem",
              fontWeight: 700,
              color: "#333",
              marginBottom: "0.75rem",
              lineHeight: 1.3,
            }}
          >
            {tFn(type.name, lang)}
          </div>

          <div style={{ fontSize: "0.7rem", color: "#666", lineHeight: 1.5 }}>
            <p style={{ marginBottom: "0.5rem", fontWeight: 600, color: type.color, fontSize: "0.65rem" }}>
              {lang === "en" ? "Motivation" : lang === "id" ? "Motivasi" : "Motivatie"}
            </p>
            <p style={{ marginBottom: "0.75rem", fontSize: "0.68rem" }}>{tFn(type.motivation, lang)}</p>

            <p style={{ marginBottom: "0.5rem", fontWeight: 600, color: type.color, fontSize: "0.65rem" }}>
              {lang === "en" ? "Challenge" : lang === "id" ? "Tantangan" : "Uitdaging"}
            </p>
            <p style={{ marginBottom: "0.75rem", fontSize: "0.68rem" }}>{tFn(type.fear, lang)}</p>

            <p style={{ marginBottom: "0.5rem", fontWeight: 600, color: type.color, fontSize: "0.65rem" }}>
              {lang === "en" ? "Growth" : lang === "id" ? "Pertumbuhan" : "Groei"}
            </p>
            <p style={{ fontSize: "0.65rem" }}>{tFn(type.communication, lang)}</p>
          </div>
        </div>
      </div>
    </div>
  );
}

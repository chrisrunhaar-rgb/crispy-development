"use client";

import { useState } from "react";
import TypeCard from "./TypeCard";

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

export default function EnneagramTypesGrid({
  types,
  lang,
}: {
  types: EnneagramType[];
  lang: Lang;
}) {
  const [flipped, setFlipped] = useState<number | null>(null);

  return (
    <div style={{ marginBottom: "3rem" }}>
      <div
        style={{
          fontFamily: "var(--font-montserrat)",
          fontSize: "2rem",
          fontWeight: 700,
          color: "#333",
          marginBottom: "2rem",
          textAlign: "center",
        }}
      >
        {lang === "en"
          ? "The Nine Types"
          : lang === "id"
            ? "Sembilan Tipe"
            : "De Negen Types"}
      </div>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(3, 1fr)",
          gap: "1.25rem",
          padding: "0 1rem",
          maxWidth: "900px",
          margin: "0 auto",
        }}
      >
        {types.map((type) => (
          <div
            key={type.number}
            style={{
              aspectRatio: "1 / 1",
            }}
            onMouseEnter={(e) => {
              if (flipped !== type.number) {
                (e.currentTarget as HTMLElement).style.filter =
                  "brightness(1.1) drop-shadow(0 8px 16px rgba(0,0,0,0.2))";
              }
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLElement).style.filter = "brightness(1)";
            }}
          >
            <TypeCard
              type={type}
              lang={lang}
              isFlipped={flipped === type.number}
              onClick={() =>
                setFlipped(flipped === type.number ? null : type.number)
              }
              onClickClose={() => setFlipped(null)}
            />
          </div>
        ))}
      </div>
    </div>
  );
}

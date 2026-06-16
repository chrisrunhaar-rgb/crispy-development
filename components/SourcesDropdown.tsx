"use client";
import { useState } from "react";

const navy     = "oklch(22% 0.10 260)";
const orange   = "oklch(65% 0.15 45)";
const offWhite = "oklch(96% 0.005 80)";
const lightGray = "oklch(88% 0.008 80)";
const bodyText = "oklch(38% 0.05 260)";

const SUPERSCRIPTS = ["¹","²","³","⁴","⁵","⁶","⁷","⁸","⁹","¹⁰"];

interface SourcesDropdownProps {
  sources: string[];
  lang?: "en" | "id";
  markerStyle?: "superscript" | "number";
  background?: string;
}

export default function SourcesDropdown({
  sources,
  lang = "en",
  markerStyle = "superscript",
  background = lightGray,
}: SourcesDropdownProps) {
  const [open, setOpen] = useState(false);

  const label = lang === "id"
    ? `Sumber yang digunakan dalam modul ini (${sources.length})`
    : `Resources used in this module (${sources.length})`;

  return (
    <div style={{ background, padding: "32px 24px" }}>
      <div style={{ maxWidth: 780, margin: "0 auto" }}>
        <button
          onClick={() => setOpen(o => !o)}
          style={{
            display: "flex", alignItems: "center", gap: 10,
            background: "none", border: "none", cursor: "pointer", padding: 0,
            width: "100%", textAlign: "left",
          }}
          aria-expanded={open}
        >
          <span style={{
            fontFamily: "Montserrat, sans-serif", fontSize: 11, fontWeight: 700,
            letterSpacing: "0.14em", textTransform: "uppercase", color: orange,
          }}>
            {label}
          </span>
          <svg
            width="14" height="14" viewBox="0 0 24 24"
            fill="none" stroke={orange} strokeWidth="2.5"
            strokeLinecap="round" strokeLinejoin="round"
            style={{
              transform: open ? "rotate(180deg)" : "none",
              transition: "transform 0.2s", flexShrink: 0,
            }}
          >
            <polyline points="6 9 12 15 18 9" />
          </svg>
        </button>

        {open && (
          <div style={{
            marginTop: 20,
            display: "flex", flexDirection: "column", gap: 10,
            paddingTop: 16, borderTop: `1px solid ${navy}20`,
          }}>
            {sources.map((src, i) => (
              <div key={i} style={{ display: "flex", gap: 10, alignItems: "flex-start" }}>
                <span style={{
                  fontFamily: "Montserrat, sans-serif",
                  fontSize: 11, color: orange, fontWeight: 700,
                  flexShrink: 0, marginTop: 2, minWidth: 18,
                }}>
                  {markerStyle === "superscript" ? SUPERSCRIPTS[i] : `${i + 1}.`}
                </span>
                <p style={{
                  fontFamily: "Montserrat, sans-serif",
                  fontSize: 12, color: bodyText, lineHeight: 1.75, margin: 0,
                }}>
                  {src.replace(/^[¹²³⁴⁵⁶⁷⁸⁹]\s*/, "")}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

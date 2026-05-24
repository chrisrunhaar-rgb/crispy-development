"use client";
import { useState } from "react";

const wp = {
  navy: "oklch(22% 0.10 260)",
  orange: "oklch(65% 0.15 45)",
  offWhite: "oklch(97% 0.005 80)",
  bodyText: "oklch(38% 0.007 260)",
  mutedText: "oklch(52% 0.006 260)",
  lightGray: "oklch(88% 0.008 80)",
};

const FLAG_COLS = [
  {
    header: "Always On",
    color: "oklch(22% 0.10 260)",
    items: ["Suicidal ideation", "Abuse", "Safety threat", "Mental health crisis"],
  },
  {
    header: "Default On",
    color: "oklch(38% 0.007 260)",
    items: [
      "Burnout",
      "Moral injury",
      "Trauma indicators",
      "Relationship crisis",
      "Intent to leave field",
      "Spiritual crisis",
    ],
  },
  {
    header: "Optional",
    color: wp.mutedText,
    items: [
      "Team conflict",
      "Financial stress",
      "Cultural overwhelm",
      "Grief and loss",
      "Re-entry stress",
      "Isolation",
      "Physical health concerns",
      "Boundary violations",
      "Language burnout",
      "Authority conflict",
    ],
  },
];

export default function WelfareFlagsDropdown() {
  const [open, setOpen] = useState(false);
  return (
    <div style={{ marginTop: "1.25rem", borderTop: `1px solid oklch(85% 0.04 45)` }}>
      <button
        onClick={() => setOpen((o) => !o)}
        style={{
          width: "100%",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          padding: "0.75rem 0",
          background: "none",
          border: "none",
          cursor: "pointer",
          fontFamily: "var(--font-montserrat)",
          fontSize: "0.7rem",
          fontWeight: 700,
          letterSpacing: "0.1em",
          textTransform: "uppercase",
          color: wp.orange,
        }}
      >
        <span>Mode B welfare flags — you choose which are active</span>
        <span
          style={{
            fontSize: "0.9rem",
            transition: "transform 0.2s",
            display: "inline-block",
            transform: open ? "rotate(180deg)" : "none",
          }}
        >
          ▾
        </span>
      </button>
      {open && (
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(3, 1fr)",
            gap: 0,
            border: `1px solid ${wp.lightGray}`,
            marginBottom: "0.75rem",
          }}
        >
          {FLAG_COLS.map((col, ci) => (
            <div
              key={col.header}
              style={{ borderRight: ci < 2 ? `1px solid ${wp.lightGray}` : undefined }}
            >
              <div
                style={{
                  padding: "0.5rem 0.875rem",
                  fontFamily: "var(--font-montserrat)",
                  fontSize: "0.58rem",
                  fontWeight: 700,
                  letterSpacing: "0.12em",
                  textTransform: "uppercase",
                  color: col.color,
                  background: "oklch(97% 0.006 80)",
                  borderBottom: `1px solid ${wp.lightGray}`,
                }}
              >
                {col.header}
              </div>
              {col.items.map((item) => (
                <div
                  key={item}
                  style={{
                    padding: "0.375rem 0.875rem",
                    fontFamily: "var(--font-montserrat)",
                    fontSize: "0.78rem",
                    color: wp.bodyText,
                    borderBottom: `1px solid oklch(94% 0.005 80)`,
                    lineHeight: 1.4,
                  }}
                >
                  {item}
                </div>
              ))}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

"use client";

import { useState, useTransition } from "react";
import { updateTeamAssessments } from "./team-actions";

const ASSESSMENTS = [
  { id: "disc", label: "DISC Profile", description: "Behavioural styles & leadership preferences", live: true },
  { id: "karunia-rohani", label: "Karunia Rohani", description: "Spiritual gifts assessment (EN/ID)", live: true },
  { id: "three-thinking-styles", label: "Three Thinking Styles", description: "How your team thinks & solves problems", live: true },
  { id: "wheel-of-life", label: "Wheel of Life", description: "Holistic life balance assessment", live: true },

  { id: "16-personalities", label: "16 Personalities", description: "In-depth personality profiles", live: true },
  { id: "enneagram", label: "Enneagram", description: "Core motivations & growth paths", live: true },
  { id: "big-five", label: "Big Five (OCEAN)", description: "Five-factor personality traits", live: true },
];

export default function TeamAssessmentSelector({
  teamId,
  initialSelected,
}: {
  teamId: string;
  initialSelected: string[];
}) {
  const [selected, setSelected] = useState<string[]>(initialSelected);
  const [isPending, startTransition] = useTransition();
  const [saved, setSaved] = useState(false);

  function toggle(id: string) {
    const next = selected.includes(id)
      ? selected.filter(s => s !== id)
      : [...selected, id];
    setSelected(next);
    setSaved(false);
    startTransition(async () => {
      await updateTeamAssessments(teamId, next);
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    });
  }

  return (
    <div>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "1.25rem", flexWrap: "wrap", gap: "0.5rem" }}>
        <div>
          <p className="t-label" style={{ color: "oklch(65% 0.15 45)", fontSize: "0.62rem", marginBottom: "0.25rem" }}>Team Assessments</p>
          <h3 style={{ fontFamily: "var(--font-montserrat)", fontWeight: 700, fontSize: "1rem", color: "oklch(22% 0.005 260)", margin: 0 }}>
            Select assessments for your team&apos;s pathway
          </h3>
        </div>
        {saved && (
          <span style={{ fontFamily: "var(--font-montserrat)", fontSize: "0.72rem", fontWeight: 600, color: "oklch(40% 0.15 145)", letterSpacing: "0.04em" }}>
            ✓ Saved
          </span>
        )}
        {isPending && !saved && (
          <span style={{ fontFamily: "var(--font-montserrat)", fontSize: "0.72rem", color: "oklch(55% 0.008 260)", letterSpacing: "0.04em" }}>
            Saving…
          </span>
        )}
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))", gap: "0.75rem" }}>
        {ASSESSMENTS.map(a => {
          const isOn = selected.includes(a.id);
          return (
            <button
              key={a.id}
              onClick={() => a.live && toggle(a.id)}
              disabled={!a.live || isPending}
              style={{
                textAlign: "left",
                padding: "1rem 1.125rem",
                border: isOn && a.live
                  ? "1.5px solid oklch(65% 0.15 45)"
                  : "1.5px solid oklch(88% 0.008 80)",
                background: isOn && a.live
                  ? "oklch(65% 0.15 45 / 0.07)"
                  : a.live ? "white" : "oklch(96% 0.003 80)",
                cursor: a.live ? "pointer" : "default",
                opacity: a.live ? 1 : 0.55,
                transition: "border-color 0.15s, background 0.15s",
              }}
            >
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "0.35rem" }}>
                <span style={{
                  fontFamily: "var(--font-montserrat)", fontWeight: 700, fontSize: "0.8125rem",
                  color: isOn && a.live ? "oklch(65% 0.15 45)" : "oklch(22% 0.005 260)",
                }}>
                  {a.label}
                </span>
                {a.live ? (
                  <span style={{
                    width: "16px", height: "16px", flexShrink: 0,
                    borderRadius: "50%",
                    border: isOn ? "none" : "1.5px solid oklch(75% 0.008 80)",
                    background: isOn ? "oklch(65% 0.15 45)" : "transparent",
                    display: "flex", alignItems: "center", justifyContent: "center",
                  }}>
                    {isOn && <span style={{ color: "white", fontSize: "0.6rem", lineHeight: 1 }}>✓</span>}
                  </span>
                ) : (
                  <span style={{
                    fontFamily: "var(--font-montserrat)", fontSize: "0.55rem", fontWeight: 700,
                    letterSpacing: "0.08em", color: "oklch(60% 0.008 260)",
                    background: "oklch(90% 0.005 80)", padding: "0.15rem 0.4rem",
                    textTransform: "uppercase",
                  }}>
                    Soon
                  </span>
                )}
              </div>
              <p style={{ fontFamily: "var(--font-montserrat)", fontSize: "0.75rem", color: "oklch(52% 0.008 260)", margin: 0, lineHeight: 1.45 }}>
                {a.description}
              </p>
            </button>
          );
        })}
      </div>

      <p style={{ fontFamily: "var(--font-montserrat)", fontSize: "0.75rem", color: "oklch(60% 0.008 260)", marginTop: "0.875rem", lineHeight: 1.5 }}>
        Selected assessments become steps in your team&apos;s journey. Changes apply immediately.
      </p>
    </div>
  );
}

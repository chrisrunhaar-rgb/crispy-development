"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter, usePathname } from "next/navigation";

const navy = "oklch(30% 0.12 260)";
const orange = "oklch(65% 0.15 45)";

type TourStep = {
  targetId: string;
  title: string;
  body: string;
};

const STEPS: TourStep[] = [
  {
    targetId: "tour-header",
    title: "Your leadership hub",
    body: "Welcome to your personal dashboard — everything you need for cross-cultural leadership development in one place.",
  },
  {
    targetId: "tour-tabs",
    title: "Personal · Team · Peer",
    body: "Switch between pathways as you grow. Team and Peer Group tabs unlock when you apply or are invited.",
  },
  {
    targetId: "tour-journey",
    title: "Your development journey",
    body: "Save resources from the library here to build your personal plan. Mark them complete as you work through them.",
  },
  {
    targetId: "tour-progress",
    title: "Track your progress",
    body: "See how many resources you've completed. Every finished assessment and module counts here.",
  },
  {
    targetId: "tour-assessments",
    title: "Assessment results",
    body: "Complete assessments — DISC, Wheel of Life, Enneagram, and more — to see your results stored here.",
  },
];

type Rect = { top: number; left: number; width: number; height: number };

const PAD = 10;
const TW = 290;

export default function DashboardTour({ show }: { show: boolean }) {
  const router = useRouter();
  const pathname = usePathname();
  const [step, setStep] = useState(0);
  const [rect, setRect] = useState<Rect | null>(null);

  const measure = useCallback(() => {
    const el = document.getElementById(STEPS[step]?.targetId ?? "");
    if (!el) return;
    const r = el.getBoundingClientRect();
    setRect({ top: r.top, left: r.left, width: r.width, height: r.height });
  }, [step]);

  useEffect(() => {
    if (!show) return;
    const el = document.getElementById(STEPS[step]?.targetId ?? "");
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "center" });
      setTimeout(measure, 450);
    } else {
      measure();
    }
    window.addEventListener("resize", measure);
    window.addEventListener("scroll", measure, { passive: true });
    return () => {
      window.removeEventListener("resize", measure);
      window.removeEventListener("scroll", measure);
    };
  }, [show, step, measure]);

  function dismiss() {
    router.replace(pathname);
  }

  function next() {
    if (step < STEPS.length - 1) {
      setStep((s) => s + 1);
    } else {
      dismiss();
    }
  }

  function prev() {
    if (step > 0) setStep((s) => s - 1);
  }

  if (!show || !rect) return null;

  const current = STEPS[step];

  // Tooltip vertical: prefer below the target, flip above if near bottom
  const spaceBelow = window.innerHeight - (rect.top + rect.height + PAD);
  const TH = 160;
  let ttTop: number;
  if (spaceBelow >= TH + 12) {
    ttTop = rect.top + rect.height + PAD;
  } else {
    ttTop = rect.top - TH - PAD;
  }
  ttTop = Math.max(8, Math.min(ttTop, window.innerHeight - TH - 8));

  let ttLeft = rect.left + rect.width / 2 - TW / 2;
  ttLeft = Math.max(12, Math.min(ttLeft, window.innerWidth - TW - 12));

  return (
    <>
      {/* Full-screen click-blocker */}
      <div
        onClick={dismiss}
        style={{
          position: "fixed",
          inset: 0,
          zIndex: 998,
          cursor: "default",
        }}
      />

      {/* Spotlight ring over target */}
      <div
        style={{
          position: "fixed",
          top: rect.top - PAD,
          left: rect.left - PAD,
          width: rect.width + PAD * 2,
          height: rect.height + PAD * 2,
          borderRadius: "4px",
          boxShadow: "0 0 0 2px white, 0 0 0 9999px rgba(0,0,0,0.52)",
          zIndex: 999,
          pointerEvents: "none",
        }}
      />

      {/* Tooltip */}
      <div
        style={{
          position: "fixed",
          top: ttTop,
          left: ttLeft,
          width: TW,
          zIndex: 1000,
          background: "white",
          border: `2px solid ${orange}`,
          boxShadow: "0 8px 32px rgba(0,0,0,0.18)",
          padding: "1.125rem 1.25rem",
        }}
      >
        <p style={{ fontFamily: "var(--font-montserrat)", fontSize: "0.6rem", fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: orange, margin: "0 0 0.375rem" }}>
          {step + 1} of {STEPS.length}
        </p>
        <p style={{ fontFamily: "var(--font-montserrat)", fontWeight: 800, fontSize: "0.9375rem", color: navy, margin: "0 0 0.375rem", lineHeight: 1.3 }}>
          {current.title}
        </p>
        <p style={{ fontFamily: "var(--font-montserrat)", fontSize: "0.8rem", color: "oklch(48% 0.008 260)", lineHeight: 1.6, margin: "0 0 1rem" }}>
          {current.body}
        </p>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <button
            type="button"
            onClick={dismiss}
            style={{ fontFamily: "var(--font-montserrat)", fontSize: "0.72rem", color: "oklch(55% 0.008 260)", background: "none", border: "none", cursor: "pointer", padding: "0.25rem 0", textDecoration: "underline" }}
          >
            Skip tour
          </button>
          <div style={{ display: "flex", gap: "0.5rem" }}>
            {step > 0 && (
              <button
                type="button"
                onClick={prev}
                style={{ fontFamily: "var(--font-montserrat)", fontWeight: 700, fontSize: "0.72rem", color: navy, background: "none", border: "1px solid oklch(82% 0.008 80)", padding: "0.4rem 0.875rem", cursor: "pointer" }}
              >
                ← Back
              </button>
            )}
            <button
              type="button"
              onClick={next}
              style={{ fontFamily: "var(--font-montserrat)", fontWeight: 700, fontSize: "0.72rem", color: "white", background: orange, border: "none", padding: "0.4rem 0.875rem", cursor: "pointer" }}
            >
              {step < STEPS.length - 1 ? "Next →" : "Done ✓"}
            </button>
          </div>
        </div>
      </div>
    </>
  );
}

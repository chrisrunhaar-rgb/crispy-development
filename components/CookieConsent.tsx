"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

const STORAGE_KEY = "cookie_consent";

declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
  }
}

function grantConsent() {
  window.gtag?.("consent", "update", {
    analytics_storage: "granted",
    ad_storage: "denied",
  });
}

export default function CookieConsent() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) {
      setVisible(true);
    } else if (stored === "granted") {
      grantConsent();
    }
  }, []);

  function accept() {
    localStorage.setItem(STORAGE_KEY, "granted");
    grantConsent();
    setVisible(false);
  }

  function decline() {
    localStorage.setItem(STORAGE_KEY, "denied");
    setVisible(false);
  }

  if (!visible) return null;

  return (
    <div
      role="dialog"
      aria-label="Cookie consent"
      style={{
        position: "fixed",
        bottom: "1.5rem",
        left: "1.5rem",
        right: "1.5rem",
        maxWidth: "480px",
        zIndex: 9999,
        background: "oklch(22% 0.10 260)",
        border: "1px solid oklch(38% 0.06 260)",
        padding: "1.25rem 1.5rem",
        boxShadow: "0 8px 32px oklch(0% 0 0 / 0.35)",
      }}
    >
      <p style={{ fontFamily: "var(--font-montserrat)", fontSize: "0.8125rem", color: "oklch(82% 0.02 260)", lineHeight: 1.65, marginBottom: "1rem" }}>
        We use Google Analytics to understand how visitors use this site. No personal data is stored.{" "}
        <Link href="/privacy" style={{ color: "oklch(65% 0.15 45)", textDecoration: "none" }}>
          Privacy Policy
        </Link>
      </p>
      <div style={{ display: "flex", gap: "0.75rem", flexWrap: "wrap" }}>
        <button
          onClick={accept}
          style={{
            fontFamily: "var(--font-montserrat)",
            fontWeight: 700,
            fontSize: "0.75rem",
            letterSpacing: "0.06em",
            textTransform: "uppercase",
            background: "oklch(65% 0.15 45)",
            color: "white",
            border: "none",
            padding: "0.625rem 1.25rem",
            cursor: "pointer",
          }}
        >
          Accept
        </button>
        <button
          onClick={decline}
          style={{
            fontFamily: "var(--font-montserrat)",
            fontWeight: 600,
            fontSize: "0.75rem",
            letterSpacing: "0.06em",
            textTransform: "uppercase",
            background: "transparent",
            color: "oklch(62% 0.006 260)",
            border: "1px solid oklch(38% 0.06 260)",
            padding: "0.625rem 1.25rem",
            cursor: "pointer",
          }}
        >
          Decline
        </button>
      </div>
    </div>
  );
}

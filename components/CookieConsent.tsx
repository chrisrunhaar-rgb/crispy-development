"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useLanguage } from "@/lib/LanguageContext";

const STORAGE_KEY = "cookie_consent";

// Google's script is only fetched after Accept, so Decline sends nothing to Google.
function grantConsent(gaId: string) {
  window.gtag?.("consent", "update", {
    analytics_storage: "granted",
    ad_storage: "denied",
  });
  if (document.getElementById("ga4-src")) return;
  const s = document.createElement("script");
  s.id = "ga4-src";
  s.async = true;
  s.src = `https://www.googletagmanager.com/gtag/js?id=${gaId}`;
  document.head.appendChild(s);
}

const COPY = {
  en: { text: "We use Google Analytics cookies to see how visitors use this site. They don't tell us who you are.", policy: "Privacy Policy", accept: "Accept", decline: "Decline", label: "Cookie consent" },
  id: { text: "Kami memakai cookie Google Analytics untuk melihat cara pengunjung memakai situs ini. Cookie ini tidak memberi tahu kami siapa Anda.", policy: "Kebijakan Privasi", accept: "Terima", decline: "Tolak", label: "Persetujuan cookie" },
};

export default function CookieConsent({ gaId }: { gaId: string }) {
  const [visible, setVisible] = useState(false);
  const { lang } = useLanguage();
  const t = lang === "id" ? COPY.id : COPY.en;

  useEffect(() => {
    // Reading localStorage must wait for the client, so showing the banner happens here.
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setVisible(true);
    } else if (stored === "granted") {
      grantConsent(gaId);
    }
  }, [gaId]);

  function accept() {
    localStorage.setItem(STORAGE_KEY, "granted");
    grantConsent(gaId);
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
      aria-label={t.label}
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
        {t.text}{" "}
        <Link href="/privacy" style={{ color: "oklch(65% 0.15 45)", textDecoration: "none" }}>
          {t.policy}
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
          {t.accept}
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
          {t.decline}
        </button>
      </div>
    </div>
  );
}

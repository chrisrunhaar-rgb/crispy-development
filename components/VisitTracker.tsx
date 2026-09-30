"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";

// Sends one anonymous page-view ping per page to /api/track (no cookies).
// Visiting /admin marks this browser as the owner's, and it is never counted again.
// Also records the site language being read (EN/ID toggle), plus one extra ping
// when the visitor switches language, so switchers are counted too.

function siteLang(): string {
  try {
    const c = document.cookie.split("; ").find(r => r.startsWith("crispy-lang="));
    return (c ? c.split("=")[1] : localStorage.getItem("crispy-lang")) || "en";
  } catch {
    return "en";
  }
}

function send(payload: string) {
  try {
    if (navigator.sendBeacon && navigator.sendBeacon("/api/track", new Blob([payload], { type: "application/json" }))) return;
  } catch {}
  fetch("/api/track", { method: "POST", body: payload, keepalive: true, headers: { "Content-Type": "application/json" } }).catch(() => {});
}

function ignored(): boolean {
  try { return localStorage.getItem("cl_ignore") === "1"; } catch { return false; }
}

export default function VisitTracker() {
  const pathname = usePathname();
  const firstView = useRef(true);

  useEffect(() => {
    if (!pathname) return;
    try {
      if (pathname.startsWith("/admin")) {
        localStorage.setItem("cl_ignore", "1");
        return;
      }
      if (localStorage.getItem("cl_ignore") === "1") return;
    } catch {}

    const params = new URLSearchParams(window.location.search);
    const isFirst = firstView.current;
    firstView.current = false;

    const payload = JSON.stringify({
      path: pathname,
      referrer: isFirst ? document.referrer : "",
      nav: !isFirst,
      lang: (navigator.language || "").slice(0, 2).toLowerCase(),
      siteLang: siteLang(),
      utm: {
        source: params.get("utm_source"),
        medium: params.get("utm_medium"),
        campaign: params.get("utm_campaign"),
      },
    });

    send(payload);
  }, [pathname]);

  useEffect(() => {
    const onSwitch = (e: Event) => {
      const l = (e as CustomEvent<string>).detail;
      if (!l || ignored() || window.location.pathname.startsWith("/admin")) return;
      send(JSON.stringify({ path: window.location.pathname, nav: true, langPing: true, siteLang: l }));
    };
    window.addEventListener("crispy-lang-change", onSwitch);
    return () => window.removeEventListener("crispy-lang-change", onSwitch);
  }, []);

  return null;
}

"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";

// Sends one anonymous page-view ping per page to /api/track (no cookies).
// Visiting /admin marks this browser as the owner's, and it is never counted again.
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
      utm: {
        source: params.get("utm_source"),
        medium: params.get("utm_medium"),
        campaign: params.get("utm_campaign"),
      },
    });

    try {
      if (navigator.sendBeacon && navigator.sendBeacon("/api/track", new Blob([payload], { type: "application/json" }))) return;
    } catch {}
    fetch("/api/track", { method: "POST", body: payload, keepalive: true, headers: { "Content-Type": "application/json" } }).catch(() => {});
  }, [pathname]);

  return null;
}

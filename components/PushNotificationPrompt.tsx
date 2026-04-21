"use client";

import { useEffect, useState } from "react";

const STORAGE_KEY = "crispy-push-prompt-dismissed";

function urlBase64ToUint8Array(base64String: string): ArrayBuffer {
  const padding = "=".repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding).replace(/-/g, "+").replace(/_/g, "/");
  const rawData = atob(base64);
  const arr = new Uint8Array(rawData.length);
  for (let i = 0; i < rawData.length; i++) arr[i] = rawData.charCodeAt(i);
  return arr.buffer;
}

async function subscribePush() {
  const reg = await navigator.serviceWorker.ready;
  const sub = await reg.pushManager.subscribe({
    userVisibleOnly: true,
    applicationServerKey: urlBase64ToUint8Array(
      process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY!
    ),
  });
  const subJson = sub.toJSON();
  await fetch("/api/push/subscribe", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      endpoint: sub.endpoint,
      keys: { p256dh: subJson.keys?.p256dh, auth: subJson.keys?.auth },
    }),
  });
}

export default function PushNotificationPrompt() {
  const [visible, setVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);

  useEffect(() => {
    // Only show in supported browsers
    if (
      !("Notification" in window) ||
      !("serviceWorker" in navigator) ||
      !("PushManager" in window)
    ) return;

    // Already decided
    if (Notification.permission !== "default") return;

    // Already dismissed
    if (localStorage.getItem(STORAGE_KEY)) return;

    // Show after a short delay so the page settles first
    const t = setTimeout(() => setVisible(true), 3000);
    return () => clearTimeout(t);
  }, []);

  function dismiss() {
    localStorage.setItem(STORAGE_KEY, "1");
    setVisible(false);
  }

  async function allow() {
    setLoading(true);
    try {
      const perm = await Notification.requestPermission();
      if (perm === "granted") {
        await subscribePush();
        setDone(true);
        setTimeout(() => setVisible(false), 1800);
      } else {
        dismiss();
      }
    } catch {
      dismiss();
    } finally {
      setLoading(false);
      if (!done) localStorage.setItem(STORAGE_KEY, "1");
    }
  }

  if (!visible) return null;

  return (
    <div
      role="banner"
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        zIndex: 200,
        background: "oklch(30% 0.12 260)",
        color: "oklch(97% 0.005 80)",
        display: "flex",
        alignItems: "center",
        gap: "0.75rem",
        padding: "0.75rem 1rem",
        boxShadow: "0 2px 12px oklch(0% 0 0 / 0.25)",
        animation: "cd-slide-down 0.3s ease-out",
      }}
    >
      <style>{`
        @keyframes cd-slide-down {
          from { transform: translateY(-100%); opacity: 0; }
          to   { transform: translateY(0);    opacity: 1; }
        }
      `}</style>

      <span style={{ fontSize: "1.1rem", flexShrink: 0 }}>🔔</span>

      <p style={{
        flex: 1,
        margin: 0,
        fontFamily: "var(--font-montserrat)",
        fontSize: "0.78rem",
        fontWeight: 500,
        lineHeight: 1.4,
      }}>
        {done
          ? "You're all set — we'll let you know when new resources drop."
          : "Get notified when new resources are added to your library."}
      </p>

      {!done && (
        <div style={{ display: "flex", gap: "0.5rem", flexShrink: 0 }}>
          <button
            onClick={allow}
            disabled={loading}
            style={{
              fontFamily: "var(--font-montserrat)",
              fontSize: "0.72rem",
              fontWeight: 700,
              letterSpacing: "0.06em",
              background: "oklch(65% 0.15 45)",
              color: "#fff",
              border: "none",
              padding: "0.4rem 0.875rem",
              cursor: loading ? "not-allowed" : "pointer",
              opacity: loading ? 0.7 : 1,
              whiteSpace: "nowrap",
            }}
          >
            {loading ? "…" : "Allow"}
          </button>
          <button
            onClick={dismiss}
            disabled={loading}
            style={{
              fontFamily: "var(--font-montserrat)",
              fontSize: "0.72rem",
              fontWeight: 600,
              letterSpacing: "0.04em",
              background: "transparent",
              color: "oklch(75% 0.03 260)",
              border: "1px solid oklch(97% 0.005 80 / 0.25)",
              padding: "0.4rem 0.75rem",
              cursor: "pointer",
              whiteSpace: "nowrap",
            }}
          >
            Not now
          </button>
        </div>
      )}
    </div>
  );
}

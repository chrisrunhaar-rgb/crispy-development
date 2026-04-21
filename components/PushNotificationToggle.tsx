"use client";

import { useEffect, useState } from "react";

type PermState = "default" | "granted" | "denied" | "unsupported";

export default function PushNotificationToggle() {
  const [permState, setPermState] = useState<PermState>("default");
  const [subscribed, setSubscribed] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!("Notification" in window) || !("serviceWorker" in navigator) || !("PushManager" in window)) {
      setPermState("unsupported");
      return;
    }
    setPermState(Notification.permission as PermState);

    // Check if already subscribed
    navigator.serviceWorker.ready.then((reg) => {
      reg.pushManager.getSubscription().then((sub) => {
        setSubscribed(!!sub);
      });
    });
  }, []);

  async function handleEnable() {
    setLoading(true);
    try {
      const perm = await Notification.requestPermission();
      setPermState(perm as PermState);
      if (perm !== "granted") return;

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

      setSubscribed(true);
    } finally {
      setLoading(false);
    }
  }

  async function handleDisable() {
    setLoading(true);
    try {
      const reg = await navigator.serviceWorker.ready;
      const sub = await reg.pushManager.getSubscription();
      if (sub) {
        await fetch("/api/push/subscribe", {
          method: "DELETE",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ endpoint: sub.endpoint }),
        });
        await sub.unsubscribe();
      }
      setSubscribed(false);
    } finally {
      setLoading(false);
    }
  }

  if (permState === "unsupported") return null;

  const btnStyle: React.CSSProperties = {
    fontFamily: "var(--font-montserrat)",
    fontSize: "0.72rem",
    fontWeight: 700,
    letterSpacing: "0.06em",
    border: "1px solid oklch(88% 0.008 80)",
    background: "transparent",
    color: "oklch(52% 0.008 260)",
    padding: "0.4rem 0.875rem",
    cursor: loading ? "not-allowed" : "pointer",
    opacity: loading ? 0.6 : 1,
    whiteSpace: "nowrap",
  };

  if (permState === "denied") {
    return (
      <span style={{ fontFamily: "var(--font-montserrat)", fontSize: "0.72rem", color: "oklch(62% 0.006 260)" }}>
        Notifications blocked
      </span>
    );
  }

  if (subscribed && permState === "granted") {
    return (
      <button style={btnStyle} onClick={handleDisable} disabled={loading} type="button">
        {loading ? "…" : "🔔 Notifications on"}
      </button>
    );
  }

  return (
    <button style={btnStyle} onClick={handleEnable} disabled={loading} type="button">
      {loading ? "…" : "🔕 Notifications off"}
    </button>
  );
}

function urlBase64ToUint8Array(base64String: string): ArrayBuffer {
  const padding = "=".repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding).replace(/-/g, "+").replace(/_/g, "/");
  const rawData = atob(base64);
  const arr = new Uint8Array(rawData.length);
  for (let i = 0; i < rawData.length; i++) arr[i] = rawData.charCodeAt(i);
  return arr.buffer;
}

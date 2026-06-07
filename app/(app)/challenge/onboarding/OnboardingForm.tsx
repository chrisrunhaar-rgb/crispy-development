"use client";

import { useActionState, useState, useEffect, useRef } from "react";
import { saveOnboardingPrefs } from "@/app/challenge/actions";

const navy     = "oklch(22% 0.10 260)";
const orange   = "oklch(65% 0.15 45)";
const offWhite = "oklch(97% 0.005 80)";
const mid      = "oklch(52% 0.008 260)";
const green    = "oklch(55% 0.18 150)";

const DAYS_EN = [
  { value: 1, label: "Mon" },
  { value: 2, label: "Tue" },
  { value: 3, label: "Wed" },
  { value: 4, label: "Thu" },
  { value: 5, label: "Fri" },
  { value: 6, label: "Sat" },
  { value: 0, label: "Sun" },
];

const DAYS_ID = [
  { value: 1, label: "Sen" },
  { value: 2, label: "Sel" },
  { value: 3, label: "Rab" },
  { value: 4, label: "Kam" },
  { value: 5, label: "Jum" },
  { value: 6, label: "Sab" },
  { value: 0, label: "Min" },
];

type Lang = "en" | "id";

interface BeforeInstallPromptEvent extends Event {
  prompt(): Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
}

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

const copy = {
  en: {
    heading: "Set up your challenge",
    subheading: "These settings help you build a consistent rhythm. You can change them anytime.",
    installHeading: "Install the Crispy app",
    installHint: "Add to your home screen for the best experience and offline access.",
    installBtn: "Install app",
    installIosStep: "Tap Share",
    installIosStep2: "then Add to Home Screen",
    installed: "App installed",
    notifHeading: "Allow daily reminders",
    notifHint: "We'll nudge you at your chosen time so you never miss a day.",
    notifBtn: "Allow notifications",
    notifGranted: "Notifications enabled",
    notifDenied: "Enable notifications in your browser settings.",
    readingDays: "Which days will you read?",
    readingDaysHint: "These are the days you'll get a gentle nudge. Pick whatever fits your schedule.",
    notificationTime: "What time works best for you?",
    notificationTimeHint: "We'll send your daily reading reminder at this time.",
    startBtn: "Start the challenge →",
    starting: "Starting...",
    skip: "Skip for now",
  },
  id: {
    heading: "Siapkan tantangan Anda",
    subheading: "Pengaturan ini membantu Anda membangun ritme yang konsisten. Anda bisa mengubahnya kapan saja.",
    installHeading: "Pasang aplikasi Crispy",
    installHint: "Tambahkan ke layar utama untuk pengalaman terbaik dan akses offline.",
    installBtn: "Pasang aplikasi",
    installIosStep: "Ketuk Bagikan",
    installIosStep2: "lalu Tambahkan ke Layar Utama",
    installed: "Aplikasi terpasang",
    notifHeading: "Izinkan pengingat harian",
    notifHint: "Kami akan mengingatkan Anda di waktu yang dipilih agar tidak melewatkan satu hari pun.",
    notifBtn: "Izinkan notifikasi",
    notifGranted: "Notifikasi aktif",
    notifDenied: "Aktifkan notifikasi di pengaturan browser Anda.",
    readingDays: "Hari apa Anda akan membaca?",
    readingDaysHint: "Hari-hari ini adalah saat Anda akan mendapat pengingat. Pilih yang sesuai jadwal.",
    notificationTime: "Pukul berapa yang paling nyaman?",
    notificationTimeHint: "Kami akan mengirim pengingat harian Anda pada waktu ini.",
    startBtn: "Mulai tantangan →",
    starting: "Memulai...",
    skip: "Lewati untuk sekarang",
  },
};

const initialState = { error: "" };

export default function OnboardingForm({ initialLang = "en", firstName }: { initialLang?: Lang; firstName?: string }) {
  const [selectedDays, setSelectedDays] = useState<number[]>([1, 2, 3, 4, 5]);
  const [time, setTime]                 = useState("08:00");
  const [lang]                          = useState<Lang>(initialLang);
  const [timezone, setTimezone]         = useState("UTC");

  // PWA install state
  const [isInstalled, setIsInstalled]       = useState(false);
  const [isIOS, setIsIOS]                   = useState(false);
  const [installLoading, setInstallLoading] = useState(false);
  const installPromptRef = useRef<BeforeInstallPromptEvent | null>(null);

  // Notification state
  const [notifStatus, setNotifStatus] = useState<"default" | "granted" | "denied" | "loading">("default");

  useEffect(() => {
    setTimezone(Intl.DateTimeFormat().resolvedOptions().timeZone || "UTC");

    // Detect if already installed as PWA
    const standalone =
      window.matchMedia("(display-mode: standalone)").matches ||
      (navigator as Navigator & { standalone?: boolean }).standalone === true;
    setIsInstalled(standalone);

    // Detect iOS
    const ios = /iPad|iPhone|iPod/.test(navigator.userAgent) && !(window as Window & { MSStream?: unknown }).MSStream;
    setIsIOS(ios);

    // Capture install prompt (Android/Chrome)
    const handleInstallPrompt = (e: Event) => {
      e.preventDefault();
      installPromptRef.current = e as BeforeInstallPromptEvent;
    };
    window.addEventListener("beforeinstallprompt", handleInstallPrompt);

    // Check current notification permission
    if ("Notification" in window) {
      setNotifStatus(Notification.permission as "default" | "granted" | "denied");
    }

    return () => window.removeEventListener("beforeinstallprompt", handleInstallPrompt);
  }, []);

  const c    = copy[lang];
  const DAYS = lang === "id" ? DAYS_ID : DAYS_EN;

  const [state, formAction, pending] = useActionState(
    async (_prev: typeof initialState, formData: FormData) => {
      selectedDays.forEach(d => formData.append("notification_days", String(d)));
      formData.set("notification_time", time);
      formData.set("timezone", timezone);
      formData.set("language", lang);
      return (await saveOnboardingPrefs(formData)) ?? initialState;
    },
    initialState,
  );

  function toggleDay(v: number) {
    setSelectedDays(p => p.includes(v) ? p.filter(d => d !== v) : [...p, v]);
  }

  async function handleInstall() {
    if (!installPromptRef.current) return;
    setInstallLoading(true);
    try {
      await installPromptRef.current.prompt();
      const { outcome } = await installPromptRef.current.userChoice;
      if (outcome === "accepted") {
        setIsInstalled(true);
        installPromptRef.current = null;
      }
    } finally {
      setInstallLoading(false);
    }
  }

  async function handleNotifAllow() {
    if (!("Notification" in window)) return;
    setNotifStatus("loading");
    try {
      const perm = await Notification.requestPermission();
      setNotifStatus(perm as "default" | "granted" | "denied");
      if (perm === "granted" && "serviceWorker" in navigator) {
        await subscribePush();
      }
    } catch {
      setNotifStatus("default");
    }
  }

  // Show install block if: not installed AND (iOS OR install prompt available)
  // We render it always on iOS (can't detect prompt availability until interaction)
  // On non-iOS, only render if there's a prompt ref (updated reactively isn't possible,
  // so we show it initially and hide after install)
  const showInstallBlock = !isInstalled;

  return (
    <div style={{ width: "100%", maxWidth: "480px" }}>
      {/* Challenge icon */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src="/il-challenge-icon.png" alt="" width={72} height={72}
        style={{ borderRadius: "50%", objectFit: "cover", display: "block", marginBottom: "1.5rem" }} />

      <h1 style={{ fontFamily: "var(--font-montserrat)", fontWeight: 800, fontSize: "1.75rem", color: navy, lineHeight: 1.15, marginBottom: "0.5rem" }}>
        {firstName ? `${firstName}, ` : ""}{c.heading}
      </h1>
      <p style={{ fontFamily: "var(--font-montserrat)", fontSize: "0.875rem", color: mid, lineHeight: 1.65, marginBottom: "2rem" }}>
        {c.subheading}
      </p>

      {/* ── Install block ─────────────────────────────────────────── */}
      {showInstallBlock && (
        <div style={setupCard}>
          <div style={{ display: "flex", alignItems: "flex-start", gap: "0.75rem" }}>
            <span style={stepIcon}>📲</span>
            <div style={{ flex: 1 }}>
              <p style={stepHeading}>{c.installHeading}</p>
              <p style={stepHint}>{c.installHint}</p>

              {isIOS ? (
                <div style={iosInstructions}>
                  <span style={{ fontSize: "1rem" }}>⬆️</span>
                  <span style={{ fontFamily: "var(--font-montserrat)", fontSize: "0.8rem", color: mid }}>
                    {c.installIosStep} <strong style={{ color: navy }}>→</strong> {c.installIosStep2}
                  </span>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={handleInstall}
                  disabled={installLoading}
                  style={actionBtn}
                >
                  {installLoading ? "…" : c.installBtn}
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {isInstalled && (
        <div style={doneRow}>
          <span style={checkCircle}>✓</span>
          <span style={{ fontFamily: "var(--font-montserrat)", fontSize: "0.875rem", fontWeight: 600, color: green }}>
            {c.installed}
          </span>
        </div>
      )}

      {/* ── Notifications block ───────────────────────────────────── */}
      {notifStatus === "default" && (
        <div style={{ ...setupCard, marginTop: "0.75rem" }}>
          <div style={{ display: "flex", alignItems: "flex-start", gap: "0.75rem" }}>
            <span style={stepIcon}>🔔</span>
            <div style={{ flex: 1 }}>
              <p style={stepHeading}>{c.notifHeading}</p>
              <p style={stepHint}>{c.notifHint}</p>
              <button
                type="button"
                onClick={handleNotifAllow}
                disabled={notifStatus === "loading"}
                style={actionBtn}
              >
                {c.notifBtn}
              </button>
            </div>
          </div>
        </div>
      )}

      {notifStatus === "loading" && (
        <div style={{ ...setupCard, marginTop: "0.75rem" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
            <span style={stepIcon}>🔔</span>
            <span style={{ fontFamily: "var(--font-montserrat)", fontSize: "0.875rem", color: mid }}>…</span>
          </div>
        </div>
      )}

      {notifStatus === "granted" && (
        <div style={{ ...doneRow, marginTop: "0.75rem" }}>
          <span style={checkCircle}>✓</span>
          <span style={{ fontFamily: "var(--font-montserrat)", fontSize: "0.875rem", fontWeight: 600, color: green }}>
            {c.notifGranted}
          </span>
        </div>
      )}

      {notifStatus === "denied" && (
        <div style={{ ...setupCard, marginTop: "0.75rem", background: "oklch(97% 0.005 30)", borderColor: "oklch(85% 0.05 30)" }}>
          <div style={{ display: "flex", alignItems: "flex-start", gap: "0.75rem" }}>
            <span style={stepIcon}>🔕</span>
            <p style={{ ...stepHint, margin: 0 }}>{c.notifDenied}</p>
          </div>
        </div>
      )}

      <div style={{ height: "1.75rem" }} />

      <form action={formAction}>

        {/* Reading days */}
        <div style={{ marginBottom: "2rem" }}>
          <p style={sectionLabel}>{c.readingDays}</p>
          <p style={hint}>{c.readingDaysHint}</p>
          <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap" }}>
            {DAYS.map(d => (
              <button
                key={d.value}
                type="button"
                onClick={() => toggleDay(d.value)}
                style={{
                  fontFamily: "var(--font-montserrat)", fontWeight: 700, fontSize: "0.8125rem",
                  padding: "0.5625rem 1rem", borderRadius: "8px", border: "1px solid",
                  cursor: "pointer",
                  background: selectedDays.includes(d.value) ? navy : "white",
                  color: selectedDays.includes(d.value) ? offWhite : mid,
                  borderColor: selectedDays.includes(d.value) ? navy : "oklch(82% 0.006 260)",
                  transition: "background 0.15s, color 0.15s",
                }}
              >
                {d.label}
              </button>
            ))}
          </div>
        </div>

        {/* Notification time */}
        <div style={{ marginBottom: "2.5rem" }}>
          <p style={sectionLabel}>{c.notificationTime}</p>
          <p style={hint}>{c.notificationTimeHint}</p>
          <input
            type="time"
            value={time}
            onChange={e => setTime(e.target.value)}
            style={{
              fontFamily: "var(--font-montserrat)", fontSize: "1.125rem", fontWeight: 700,
              color: navy, background: "white", border: "1px solid oklch(82% 0.006 260)",
              borderRadius: "8px", padding: "0.75rem 1rem", outline: "none",
            }}
          />
        </div>

        {state.error && (
          <p style={{ fontFamily: "var(--font-montserrat)", fontSize: "0.8rem", color: "oklch(50% 0.22 15)", marginBottom: "1rem" }}>
            {state.error}
          </p>
        )}

        <button
          type="submit"
          disabled={pending || selectedDays.length === 0}
          style={{
            width: "100%", fontFamily: "var(--font-montserrat)", fontWeight: 700,
            fontSize: "1rem", color: offWhite, background: navy, border: "none",
            borderRadius: "8px", padding: "0.9375rem", cursor: pending ? "not-allowed" : "pointer",
            opacity: pending || selectedDays.length === 0 ? 0.7 : 1, marginBottom: "1rem",
          }}
        >
          {pending ? c.starting : c.startBtn}
        </button>

        {/* Skip link */}
        <div style={{ textAlign: "center" }}>
          <button
            type="button"
            onClick={async () => {
              const fd = new FormData();
              fd.set("notification_time", "08:00");
              fd.set("timezone", timezone);
              fd.set("language", lang);
              fd.append("notification_days", "1");
              fd.append("notification_days", "2");
              fd.append("notification_days", "3");
              fd.append("notification_days", "4");
              fd.append("notification_days", "5");
              await saveOnboardingPrefs(fd);
            }}
            style={{
              fontFamily: "var(--font-montserrat)", fontSize: "0.8125rem",
              color: mid, background: "none", border: "none", cursor: "pointer",
              textDecoration: "underline", padding: 0,
            }}
          >
            {c.skip}
          </button>
        </div>

      </form>

      {/* Progress dots */}
      <div style={{ display: "flex", gap: "0.375rem", marginTop: "2.5rem" }}>
        <span style={{ width: "20px", height: "4px", borderRadius: "2px", background: orange }} />
        <span style={{ width: "8px",  height: "4px", borderRadius: "2px", background: "oklch(85% 0.006 80)" }} />
      </div>
    </div>
  );
}

const sectionLabel: React.CSSProperties = {
  fontFamily: "var(--font-montserrat)", fontWeight: 700, fontSize: "0.9375rem",
  color: navy, marginBottom: "0.375rem",
};

const hint: React.CSSProperties = {
  fontFamily: "var(--font-montserrat)", fontSize: "0.8rem", color: mid,
  lineHeight: 1.6, marginBottom: "0.875rem",
};

const setupCard: React.CSSProperties = {
  background: "oklch(97% 0.006 260)",
  border: "1px solid oklch(88% 0.01 260)",
  borderRadius: "10px",
  padding: "1rem",
};

const doneRow: React.CSSProperties = {
  display: "flex",
  alignItems: "center",
  gap: "0.5rem",
  padding: "0.5rem 0",
};

const checkCircle: React.CSSProperties = {
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
  width: "20px",
  height: "20px",
  borderRadius: "50%",
  background: green,
  color: "white",
  fontSize: "0.7rem",
  fontWeight: 700,
  flexShrink: 0,
};

const stepIcon: React.CSSProperties = {
  fontSize: "1.25rem",
  flexShrink: 0,
  marginTop: "1px",
};

const stepHeading: React.CSSProperties = {
  fontFamily: "var(--font-montserrat)", fontWeight: 700, fontSize: "0.9rem",
  color: navy, margin: "0 0 0.25rem",
};

const stepHint: React.CSSProperties = {
  fontFamily: "var(--font-montserrat)", fontSize: "0.78rem", color: mid,
  lineHeight: 1.55, margin: "0 0 0.75rem",
};

const actionBtn: React.CSSProperties = {
  fontFamily: "var(--font-montserrat)", fontWeight: 700, fontSize: "0.8125rem",
  background: navy, color: offWhite, border: "none", borderRadius: "6px",
  padding: "0.5rem 1rem", cursor: "pointer",
};

const iosInstructions: React.CSSProperties = {
  display: "flex",
  alignItems: "center",
  gap: "0.5rem",
  background: "white",
  border: "1px solid oklch(88% 0.01 260)",
  borderRadius: "6px",
  padding: "0.5rem 0.75rem",
};

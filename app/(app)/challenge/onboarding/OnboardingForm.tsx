"use client";

import { useState, useEffect, useRef } from "react";
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

const phoneIcon = (
  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={mid} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="5" y="2" width="14" height="20" rx="2"/>
    <circle cx="12" cy="17" r="1" fill={mid} stroke="none"/>
  </svg>
);

const bellIcon = (
  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={mid} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/>
    <path d="M13.73 21a2 2 0 0 1-3.46 0"/>
  </svg>
);

const bellOffIcon = (
  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="oklch(65% 0.12 30)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M13.73 21a2 2 0 0 1-3.46 0"/>
    <path d="M18.63 13A17.89 17.89 0 0 1 18 8"/>
    <path d="M6.26 6.26A5.86 5.86 0 0 0 6 8c0 7-3 9-3 9h14"/>
    <path d="M18 8a6 6 0 0 0-9.33-4.99"/>
    <line x1="1" y1="1" x2="23" y2="23"/>
  </svg>
);

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
    continueBtn: "Continue →",
    skip: "Skip for now",
    pathHeading: "How do you want to do this?",
    pathSubheading: "You can change this later.",
    soloTitle: "Solo",
    soloDesc: "Work through the challenge at your own pace. Private journal, daily content.",
    facilitatorTitle: "Become a facilitator",
    facilitatorDesc: "Lead a small group. Set a schedule, share an invite link, track progress.",
    joinTitle: "Join a group",
    joinDesc: "Browse open groups and apply to join one that fits your context.",
    back: "← Back",
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
    continueBtn: "Lanjutkan →",
    skip: "Lewati untuk sekarang",
    pathHeading: "Bagaimana Anda ingin menjalaninya?",
    pathSubheading: "Anda bisa mengubah ini nanti.",
    soloTitle: "Sendiri",
    soloDesc: "Jalani tantangan sesuai ritme Anda. Jurnal pribadi, konten harian.",
    facilitatorTitle: "Jadi fasilitator",
    facilitatorDesc: "Pimpin kelompok kecil. Atur jadwal, bagikan tautan undangan, pantau kemajuan.",
    joinTitle: "Bergabung dengan kelompok",
    joinDesc: "Jelajahi kelompok terbuka dan daftar untuk bergabung.",
    back: "← Kembali",
  },
};

export default function OnboardingForm({ initialLang = "en", firstName }: { initialLang?: Lang; firstName?: string }) {
  const [selectedDays, setSelectedDays] = useState<number[]>([1, 2, 3, 4, 5]);
  const [time, setTime]                 = useState("08:00");
  const [lang]                          = useState<Lang>(initialLang);
  const [timezone, setTimezone]         = useState("UTC");
  const [step, setStep]                 = useState<"setup" | "path">("setup");
  const [pathPending, setPathPending]   = useState<string | null>(null);
  const [pathError, setPathError]       = useState("");
  const [skipPending, setSkipPending]   = useState(false);

  // PWA install state
  const [isInstalled, setIsInstalled]       = useState(false);
  const [promptReady, setPromptReady]       = useState(false);
  const [isIOS, setIsIOS]                   = useState(false);
  const [installLoading, setInstallLoading] = useState(false);
  const installPromptRef = useRef<BeforeInstallPromptEvent | null>(null);

  // Notification state
  const [notifStatus, setNotifStatus] = useState<"default" | "granted" | "denied" | "loading">("default");

  useEffect(() => {
    setTimezone(Intl.DateTimeFormat().resolvedOptions().timeZone || "UTC");

    const standalone =
      window.matchMedia("(display-mode: standalone)").matches ||
      (navigator as Navigator & { standalone?: boolean }).standalone === true;
    if (standalone) {
      setIsInstalled(true);
    } else if ("getInstalledRelatedApps" in navigator) {
      (navigator as Navigator & { getInstalledRelatedApps?: () => Promise<unknown[]> })
        .getInstalledRelatedApps?.()
        .then(apps => { if (apps.length > 0) setIsInstalled(true); })
        .catch(() => {});
    }

    const ios = /iPad|iPhone|iPod/.test(navigator.userAgent) && !(window as Window & { MSStream?: unknown }).MSStream;
    setIsIOS(ios);

    const handleInstallPrompt = (e: Event) => {
      e.preventDefault();
      installPromptRef.current = e as BeforeInstallPromptEvent;
      setPromptReady(true);
    };
    window.addEventListener("beforeinstallprompt", handleInstallPrompt);

    if ("Notification" in window) {
      setNotifStatus(Notification.permission as "default" | "granted" | "denied");
    }

    return () => window.removeEventListener("beforeinstallprompt", handleInstallPrompt);
  }, []);

  const c    = copy[lang];
  const DAYS = lang === "id" ? DAYS_ID : DAYS_EN;

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

  async function handlePathSelect(path: "solo" | "facilitator" | "join") {
    if (pathPending) return;
    setPathPending(path);
    setPathError("");
    const fd = new FormData();
    selectedDays.forEach(d => fd.append("notification_days", String(d)));
    fd.set("notification_time", time);
    fd.set("timezone", timezone);
    fd.set("language", lang);
    fd.set("path", path);
    const result = await saveOnboardingPrefs(fd);
    if (result?.error) {
      setPathError(result.error);
      setPathPending(null);
    }
  }

  async function handleSkip() {
    if (skipPending) return;
    setSkipPending(true);
    const fd = new FormData();
    fd.set("notification_time", "08:00");
    fd.set("timezone", timezone);
    fd.set("language", lang);
    fd.append("notification_days", "1");
    fd.append("notification_days", "2");
    fd.append("notification_days", "3");
    fd.append("notification_days", "4");
    fd.append("notification_days", "5");
    fd.set("path", "solo");
    await saveOnboardingPrefs(fd);
    setSkipPending(false);
  }

  const showInstallBlock = !isInstalled && (promptReady || isIOS);

  return (
    <div style={{ width: "100%", maxWidth: "480px" }}>
      {/* Challenge icon */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src="/il-challenge-icon.png" alt="" width={72} height={72}
        style={{ borderRadius: "50%", objectFit: "cover", display: "block", marginBottom: "1.5rem" }} />

      {/* ── Step 1: Schedule setup ───────────────────────────────── */}
      {step === "setup" && (
        <>
          <h1 style={{ fontFamily: "var(--font-montserrat)", fontWeight: 800, fontSize: "1.75rem", color: navy, lineHeight: 1.15, marginBottom: "0.5rem" }}>
            {firstName ? `${firstName}, ` : ""}{c.heading}
          </h1>
          <p style={{ fontFamily: "var(--font-montserrat)", fontSize: "0.875rem", color: mid, lineHeight: 1.65, marginBottom: "2rem" }}>
            {c.subheading}
          </p>

          {/* Install block */}
          {showInstallBlock && (
            <div style={setupCard}>
              <div style={{ display: "flex", alignItems: "flex-start", gap: "0.625rem" }}>
                <span style={stepIcon}>{phoneIcon}</span>
                <div style={{ flex: 1 }}>
                  <p style={stepHeading}>{c.installHeading}</p>
                  <p style={stepHint}>{c.installHint}</p>
                  {isIOS ? (
                    <div style={iosInstructions}>
                      <span style={{ fontFamily: "var(--font-montserrat)", fontSize: "0.8rem", color: mid }}>
                        {c.installIosStep} <strong style={{ color: navy }}>→</strong> {c.installIosStep2}
                      </span>
                    </div>
                  ) : (
                    <button type="button" onClick={handleInstall} disabled={installLoading} style={actionBtn}>
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

          {/* Notifications block */}
          {notifStatus === "default" && (
            <div style={{ ...setupCard, marginTop: "0.75rem" }}>
              <div style={{ display: "flex", alignItems: "flex-start", gap: "0.625rem" }}>
                <span style={stepIcon}>{bellIcon}</span>
                <div style={{ flex: 1 }}>
                  <p style={stepHeading}>{c.notifHeading}</p>
                  <p style={stepHint}>{c.notifHint}</p>
                  <button type="button" onClick={handleNotifAllow} style={actionBtn}>
                    {c.notifBtn}
                  </button>
                </div>
              </div>
            </div>
          )}

          {notifStatus === "loading" && (
            <div style={{ ...setupCard, marginTop: "0.75rem" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "0.625rem" }}>
                <span style={stepIcon}>{bellIcon}</span>
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
              <div style={{ display: "flex", alignItems: "flex-start", gap: "0.625rem" }}>
                <span style={stepIcon}>{bellOffIcon}</span>
                <p style={{ ...stepHint, margin: 0 }}>{c.notifDenied}</p>
              </div>
            </div>
          )}

          <div style={{ height: "1.75rem" }} />

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

          {/* Continue */}
          <button
            type="button"
            disabled={selectedDays.length === 0}
            onClick={() => setStep("path")}
            style={{
              width: "100%", fontFamily: "var(--font-montserrat)", fontWeight: 700,
              fontSize: "1rem", color: offWhite, background: navy, border: "none",
              borderRadius: "8px", padding: "0.9375rem", cursor: selectedDays.length === 0 ? "not-allowed" : "pointer",
              opacity: selectedDays.length === 0 ? 0.7 : 1, marginBottom: "1rem",
            }}
          >
            {c.continueBtn}
          </button>

          {/* Skip */}
          <div style={{ textAlign: "center" }}>
            <button
              type="button"
              disabled={skipPending}
              onClick={handleSkip}
              style={{
                fontFamily: "var(--font-montserrat)", fontSize: "0.8125rem",
                color: mid, background: "none", border: "none", cursor: "pointer",
                textDecoration: "underline", padding: 0,
              }}
            >
              {skipPending ? "…" : c.skip}
            </button>
          </div>
        </>
      )}

      {/* ── Step 2: Path selection ───────────────────────────────── */}
      {step === "path" && (
        <>
          <h1 style={{ fontFamily: "var(--font-montserrat)", fontWeight: 800, fontSize: "1.75rem", color: navy, lineHeight: 1.15, marginBottom: "0.5rem" }}>
            {c.pathHeading}
          </h1>
          <p style={{ fontFamily: "var(--font-montserrat)", fontSize: "0.875rem", color: mid, lineHeight: 1.65, marginBottom: "2rem" }}>
            {c.pathSubheading}
          </p>

          <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem", marginBottom: "1.5rem" }}>
            {/* Solo */}
            <button
              type="button"
              disabled={pathPending !== null}
              onClick={() => handlePathSelect("solo")}
              style={makePathCard(pathPending === "solo")}
            >
              <div style={pathCardInner}>
                <div>
                  <p style={pathTitle}>{c.soloTitle}</p>
                  <p style={pathDesc}>{c.soloDesc}</p>
                </div>
                <span style={pathArrow}>{pathPending === "solo" ? "…" : "→"}</span>
              </div>
            </button>

            {/* Facilitator */}
            <button
              type="button"
              disabled={pathPending !== null}
              onClick={() => handlePathSelect("facilitator")}
              style={makePathCard(pathPending === "facilitator")}
            >
              <div style={pathCardInner}>
                <div>
                  <p style={pathTitle}>{c.facilitatorTitle}</p>
                  <p style={pathDesc}>{c.facilitatorDesc}</p>
                </div>
                <span style={pathArrow}>{pathPending === "facilitator" ? "…" : "→"}</span>
              </div>
            </button>

            {/* Join group */}
            <button
              type="button"
              disabled={pathPending !== null}
              onClick={() => handlePathSelect("join")}
              style={makePathCard(pathPending === "join")}
            >
              <div style={pathCardInner}>
                <div>
                  <p style={pathTitle}>{c.joinTitle}</p>
                  <p style={pathDesc}>{c.joinDesc}</p>
                </div>
                <span style={pathArrow}>{pathPending === "join" ? "…" : "→"}</span>
              </div>
            </button>
          </div>

          {pathError && (
            <p style={{ fontFamily: "var(--font-montserrat)", fontSize: "0.8rem", color: "oklch(50% 0.22 15)", marginBottom: "1rem" }}>
              {pathError}
            </p>
          )}

          <div style={{ textAlign: "center" }}>
            <button
              type="button"
              onClick={() => setStep("setup")}
              style={{
                fontFamily: "var(--font-montserrat)", fontSize: "0.8125rem",
                color: mid, background: "none", border: "none", cursor: "pointer",
                textDecoration: "underline", padding: 0,
              }}
            >
              {c.back}
            </button>
          </div>
        </>
      )}

      {/* Progress dots */}
      <div style={{ display: "flex", gap: "0.375rem", marginTop: "2.5rem" }}>
        <span style={{ width: "20px", height: "4px", borderRadius: "2px", background: step === "setup" ? orange : "oklch(85% 0.006 80)", transition: "background 0.2s" }} />
        <span style={{ width: step === "path" ? "20px" : "8px", height: "4px", borderRadius: "2px", background: step === "path" ? orange : "oklch(85% 0.006 80)", transition: "width 0.2s, background 0.2s" }} />
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
  padding: "0.75rem",
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
  display: "flex",
  alignItems: "center",
  flexShrink: 0,
  marginTop: "1px",
};

const stepHeading: React.CSSProperties = {
  fontFamily: "var(--font-montserrat)", fontWeight: 700, fontSize: "0.9rem",
  color: navy, margin: "0 0 0.2rem",
};

const stepHint: React.CSSProperties = {
  fontFamily: "var(--font-montserrat)", fontSize: "0.78rem", color: mid,
  lineHeight: 1.55, margin: "0 0 0.625rem",
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

function makePathCard(active: boolean): React.CSSProperties {
  return {
    width: "100%", background: "white",
    border: `1px solid ${active ? navy : "oklch(85% 0.006 80)"}`,
    borderRadius: "12px", padding: "1.125rem 1.25rem",
    cursor: active ? "not-allowed" : "pointer",
    textAlign: "left", opacity: active ? 0.8 : 1,
  };
}

const pathCardInner: React.CSSProperties = {
  display: "flex", justifyContent: "space-between", alignItems: "center", gap: "1rem",
};

const pathTitle: React.CSSProperties = {
  fontFamily: "var(--font-montserrat)", fontWeight: 800, fontSize: "0.9375rem",
  color: navy, margin: "0 0 0.25rem",
};

const pathDesc: React.CSSProperties = {
  fontFamily: "var(--font-montserrat)", fontSize: "0.8rem",
  color: mid, lineHeight: 1.5, maxWidth: "34ch", margin: 0,
};

const pathArrow: React.CSSProperties = {
  fontFamily: "var(--font-montserrat)", fontSize: "1.1rem",
  color: orange, flexShrink: 0, fontWeight: 700,
};

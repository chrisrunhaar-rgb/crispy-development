"use client";

import { useActionState, useState } from "react";
import { saveOnboardingPrefs } from "@/app/challenge/actions";

const navy     = "oklch(22% 0.10 260)";
const orange   = "oklch(65% 0.15 45)";
const offWhite = "oklch(97% 0.005 80)";
const mid      = "oklch(52% 0.008 260)";

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

const copy = {
  en: {
    heading: "Set up your challenge",
    subheading: "These settings help you build a consistent rhythm. You can change them anytime.",
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

  const c    = copy[lang];
  const DAYS = lang === "id" ? DAYS_ID : DAYS_EN;

  const [state, formAction, pending] = useActionState(
    async (_prev: typeof initialState, formData: FormData) => {
      selectedDays.forEach(d => formData.append("notification_days", String(d)));
      formData.set("notification_time", time);
      formData.set("language", lang);
      return (await saveOnboardingPrefs(formData)) ?? initialState;
    },
    initialState,
  );

  function toggleDay(v: number) {
    setSelectedDays(p => p.includes(v) ? p.filter(d => d !== v) : [...p, v]);
  }

  return (
    <div style={{ width: "100%", maxWidth: "480px" }}>
      {/* Challenge icon */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src="/il-challenge-icon.png" alt="" width={72} height={72}
        style={{ borderRadius: "50%", objectFit: "cover", display: "block", marginBottom: "1.5rem" }} />

      <h1 style={{ fontFamily: "var(--font-montserrat)", fontWeight: 800, fontSize: "1.75rem", color: navy, lineHeight: 1.15, marginBottom: "0.5rem" }}>
        {firstName ? `${firstName}, ` : ""}{c.heading}
      </h1>
      <p style={{ fontFamily: "var(--font-montserrat)", fontSize: "0.875rem", color: mid, lineHeight: 1.65, marginBottom: "2.5rem" }}>
        {c.subheading}
      </p>

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

        {/* Skip link — submits with no days to skip onboarding */}
        <div style={{ textAlign: "center" }}>
          <button
            type="button"
            onClick={async () => {
              const fd = new FormData();
              fd.set("notification_time", "08:00");
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

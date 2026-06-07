"use client";

import { useState, useTransition } from "react";
import { updateNotificationPrefs } from "@/app/challenge/actions";

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

const copy = {
  en: {
    heading: "Notification settings",
    subheading: "Change when you receive your daily challenge reminder.",
    readingDays: "Which days will you read?",
    notificationTime: "What time works best for you?",
    saveBtn: "Save changes",
    saving: "Saving…",
    back: "← Back",
  },
  id: {
    heading: "Pengaturan notifikasi",
    subheading: "Ubah kapan kamu menerima pengingat harian tantangan ini.",
    readingDays: "Hari apa kamu akan membaca?",
    notificationTime: "Pukul berapa yang paling nyaman?",
    saveBtn: "Simpan perubahan",
    saving: "Menyimpan…",
    back: "← Kembali",
  },
};

export default function SettingsForm({
  lang,
  initialTime,
  initialDays,
}: {
  lang: "en" | "id";
  initialTime: string;
  initialDays: number[];
}) {
  const [selectedDays, setSelectedDays] = useState<number[]>(initialDays);
  const [time, setTime] = useState(initialTime);
  const [isPending, startTransition] = useTransition();
  const c = copy[lang];
  const DAYS = lang === "id" ? DAYS_ID : DAYS_EN;

  function toggleDay(v: number) {
    setSelectedDays(p => p.includes(v) ? p.filter(d => d !== v) : [...p, v]);
  }

  function handleSave() {
    if (isPending || selectedDays.length === 0) return;
    startTransition(async () => {
      const fd = new FormData();
      fd.set("notification_time", time);
      fd.set("timezone", Intl.DateTimeFormat().resolvedOptions().timeZone || "UTC");
      selectedDays.forEach(d => fd.append("notification_days", String(d)));
      await updateNotificationPrefs(fd);
    });
  }

  return (
    <div style={{ maxWidth: "480px" }}>
      <h1 style={{
        fontFamily: "var(--font-montserrat)", fontWeight: 800,
        fontSize: "1.5rem", color: navy, lineHeight: 1.15, marginBottom: "0.5rem",
      }}>
        {c.heading}
      </h1>
      <p style={{
        fontFamily: "var(--font-montserrat)", fontSize: "0.875rem",
        color: mid, lineHeight: 1.65, marginBottom: "2rem",
      }}>
        {c.subheading}
      </p>

      {/* Reading days */}
      <div style={{ marginBottom: "2rem" }}>
        <p style={sectionLabel}>{c.readingDays}</p>
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

      <button
        type="button"
        disabled={isPending || selectedDays.length === 0}
        onClick={handleSave}
        style={{
          width: "100%", fontFamily: "var(--font-montserrat)", fontWeight: 700,
          fontSize: "1rem", color: offWhite, background: orange, border: "none",
          borderRadius: "8px", padding: "0.9375rem", cursor: (isPending || selectedDays.length === 0) ? "not-allowed" : "pointer",
          opacity: (isPending || selectedDays.length === 0) ? 0.7 : 1,
        }}
      >
        {isPending ? c.saving : c.saveBtn}
      </button>
    </div>
  );
}

const sectionLabel: React.CSSProperties = {
  fontFamily: "var(--font-montserrat)", fontWeight: 700, fontSize: "0.9375rem",
  color: navy, marginBottom: "0.875rem",
};

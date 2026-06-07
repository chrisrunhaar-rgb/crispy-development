"use client";

import { useActionState, useState, useMemo } from "react";
import Link from "next/link";
import { createGroup } from "@/app/challenge/group-actions";

const navy     = "oklch(22% 0.10 260)";
const orange   = "oklch(65% 0.15 45)";
const offWhite = "oklch(97% 0.005 80)";
const mid      = "oklch(52% 0.008 260)";
const pillNavy = "oklch(30% 0.12 260)";

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

const SESSIONS = 60;

function calcEndDate(startDateStr: string, daysPerWeek: number): string {
  if (!startDateStr || daysPerWeek === 0) return "";
  const start = new Date(startDateStr + "T00:00:00");
  const weeksNeeded = Math.ceil(SESSIONS / daysPerWeek);
  const end = new Date(start);
  end.setDate(end.getDate() + weeksNeeded * 7 - 1);
  return end.toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" });
}

const initialState = { error: "" };

type Lang = "en" | "id";

async function callSetLanguage(lang: Lang) {
  try {
    await fetch("/api/set-language", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ lang }),
    });
  } catch {
    // fire and forget
  }
}

function setLangCookie(lang: Lang) {
  document.cookie = `crispy-lang=${lang}; path=/; max-age=31536000; samesite=lax`;
}

const copy = {
  en: {
    back: "← Back",
    pathLabel: "Facilitator path",
    heading: "Create your group",
    subheading: "You'll get an invite link to share. Members read together on the same schedule.",
    groupName: "Group name",
    groupNamePlaceholder: "e.g. Leadership Team 2025",
    description: "Description",
    optional: "(optional)",
    descriptionPlaceholder: "What's this group about? Who's it for?",
    readingDays: "Reading days",
    readingDaysHint: "Which days do members read? Members can read any day, but these are the scheduled nudge days.",
    startDate: "Start date",
    estimatedEnd: "Estimated end date",
    pickReadingDays: "Pick reading days",
    pickStartDate: "Pick a start date",
    onlineMeetings: "Online meetings",
    onlineMeetingsDesc: "Highly recommended. Each topic has a guided discussion script for the facilitator — making it easy to lead the group conversation online.",
    frequency: "Frequency",
    weekly: "Weekly",
    biweekly: "Bi-weekly",
    meetingDay: "Meeting day",
    meetingTime: "Meeting time",
    meetingLink: "Meeting link",
    openGroup: "Open group",
    openGroupDesc: "Anyone can discover and apply to join. You approve each member.",
    creating: "Creating group...",
    create: "Create group →",
  },
  id: {
    back: "← Kembali",
    pathLabel: "Jalur fasilitator",
    heading: "Buat kelompok Anda",
    subheading: "Anda akan mendapat tautan undangan untuk dibagikan. Anggota membaca bersama sesuai jadwal yang sama.",
    groupName: "Nama kelompok",
    groupNamePlaceholder: "mis. Tim Kepemimpinan 2025",
    description: "Deskripsi",
    optional: "(opsional)",
    descriptionPlaceholder: "Tentang apa kelompok ini? Untuk siapa?",
    readingDays: "Hari membaca",
    readingDaysHint: "Hari apa anggota membaca? Anggota bisa membaca kapan saja, tapi hari ini adalah jadwal pengingat.",
    startDate: "Tanggal mulai",
    estimatedEnd: "Perkiraan tanggal selesai",
    pickReadingDays: "Pilih hari membaca",
    pickStartDate: "Pilih tanggal mulai",
    onlineMeetings: "Pertemuan online",
    onlineMeetingsDesc: "Sangat disarankan. Setiap topik memiliki panduan diskusi untuk fasilitator — memudahkan memimpin percakapan kelompok secara online.",
    frequency: "Frekuensi",
    weekly: "Mingguan",
    biweekly: "Dua minggu sekali",
    meetingDay: "Hari pertemuan",
    meetingTime: "Waktu pertemuan",
    meetingLink: "Tautan pertemuan",
    openGroup: "Kelompok terbuka",
    openGroupDesc: "Siapa saja bisa menemukan dan mendaftar untuk bergabung. Anda menyetujui setiap anggota.",
    creating: "Membuat kelompok...",
    create: "Buat kelompok →",
  },
};

export default function CreateGroupForm({ initialLang = "en" }: { initialLang?: Lang }) {
  const [selectedDays, setSelectedDays] = useState<number[]>([1, 2, 3, 4, 5]);
  const [isPublic, setIsPublic]           = useState(false);
  const [hasMeetings, setHasMeetings]     = useState(false);
  const [meetingFrequency, setMeetingFrequency] = useState<"weekly" | "biweekly">("weekly");
  const [meetingDay, setMeetingDay]       = useState<number | null>(null);
  const [meetingTime, setMeetingTime]     = useState("");
  const [startDate, setStartDate]         = useState("");
  const [selectedLang, setSelectedLang]   = useState<Lang>(initialLang);

  const c = copy[selectedLang];
  const DAYS = selectedLang === "id" ? DAYS_ID : DAYS_EN;

  const endDateDisplay = useMemo(
    () => calcEndDate(startDate, selectedDays.length),
    [startDate, selectedDays.length]
  );

  const [state, formAction, pending] = useActionState(
    async (_prev: typeof initialState, formData: FormData) => {
      selectedDays.forEach(d => formData.append("schedule_days", String(d)));
      formData.set("is_public", String(isPublic));
      formData.set("has_meetings", String(hasMeetings));
      if (hasMeetings) {
        formData.set("meeting_frequency", meetingFrequency);
        if (meetingDay !== null) formData.set("meeting_day", String(meetingDay));
        formData.set("meeting_time", meetingTime);
      }
      formData.set("language", selectedLang);
      const result = await createGroup(formData);
      return result ?? initialState;
    },
    initialState,
  );

  function toggleDay(day: number) {
    setSelectedDays(prev =>
      prev.includes(day) ? prev.filter(d => d !== day) : [...prev, day]
    );
  }

  const todayStr = new Date().toISOString().split("T")[0];

  return (
    <div style={{ width: "100%", maxWidth: "520px" }}>
      <Link href="/challenge/solo" style={{ fontFamily: "var(--font-montserrat)", fontSize: "0.75rem", color: mid, textDecoration: "none", display: "inline-flex", alignItems: "center", gap: "0.375rem", marginBottom: "1.5rem" }}>
        {c.back}
      </Link>

      <p style={{ fontFamily: "var(--font-montserrat)", fontSize: "0.62rem", fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", color: orange, marginBottom: "0.5rem" }}>
        {c.pathLabel}
      </p>
      <h1 style={{ fontFamily: "var(--font-montserrat)", fontWeight: 800, fontSize: "1.75rem", color: navy, lineHeight: 1.15, marginBottom: "0.5rem" }}>
        {c.heading}
      </h1>
      <p style={{ fontFamily: "var(--font-montserrat)", fontSize: "0.875rem", color: mid, lineHeight: 1.6, marginBottom: "2rem" }}>
        {c.subheading}
      </p>

      <form action={formAction}>
        <div style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>

          {/* Name */}
          <div>
            <label style={labelStyle}>{c.groupName}</label>
            <input name="name" type="text" required placeholder={c.groupNamePlaceholder} style={inputStyle} />
          </div>

          {/* Description */}
          <div>
            <label style={labelStyle}>{c.description} <span style={{ fontWeight: 400, color: mid }}>{c.optional}</span></label>
            <textarea name="description" rows={3} placeholder={c.descriptionPlaceholder} style={{ ...inputStyle, resize: "vertical" }} />
          </div>

          {/* Reading days */}
          <div>
            <label style={labelStyle}>{c.readingDays}</label>
            <p style={{ fontFamily: "var(--font-montserrat)", fontSize: "0.75rem", color: mid, marginBottom: "0.75rem" }}>
              {c.readingDaysHint}
            </p>
            <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap" }}>
              {DAYS.map(d => (
                <button
                  key={d.value}
                  type="button"
                  onClick={() => toggleDay(d.value)}
                  style={{
                    fontFamily: "var(--font-montserrat)", fontWeight: 700, fontSize: "0.75rem",
                    padding: "0.5rem 0.875rem", borderRadius: "8px", border: "1px solid",
                    cursor: "pointer",
                    background: selectedDays.includes(d.value) ? navy : "white",
                    color: selectedDays.includes(d.value) ? offWhite : mid,
                    borderColor: selectedDays.includes(d.value) ? navy : "oklch(82% 0.006 260)",
                  }}
                >
                  {d.label}
                </button>
              ))}
            </div>
          </div>

          {/* Start date + end date */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.75rem" }}>
            <div>
              <label style={labelStyle}>{c.startDate}</label>
              <input
                name="start_date"
                type="date"
                min={todayStr}
                value={startDate}
                onChange={e => setStartDate(e.target.value)}
                style={inputStyle}
              />
            </div>
            <div>
              <label style={labelStyle}>{c.estimatedEnd}</label>
              <div style={{ ...inputStyle, color: endDateDisplay ? navy : "oklch(70% 0.006 260)", background: "oklch(94% 0.004 80)", display: "flex", alignItems: "center" }}>
                {endDateDisplay || (selectedDays.length === 0 ? c.pickReadingDays : c.pickStartDate)}
              </div>
            </div>
          </div>

          {/* Online meetings toggle */}
          <div style={{ background: "white", border: `1px solid ${hasMeetings ? orange.replace(")", " / 0.4)") : "oklch(88% 0.006 80)"}`, borderRadius: "12px", padding: "1rem 1.25rem" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: "1rem" }}>
              <div style={{ flex: 1 }}>
                <p style={{ fontFamily: "var(--font-montserrat)", fontWeight: 700, fontSize: "0.875rem", color: navy, marginBottom: "0.25rem" }}>
                  {c.onlineMeetings}
                </p>
                <p style={{ fontFamily: "var(--font-montserrat)", fontSize: "0.8rem", color: mid, lineHeight: 1.55 }}>
                  {c.onlineMeetingsDesc}
                </p>
              </div>
              <button
                type="button"
                onClick={() => setHasMeetings(p => !p)}
                style={{
                  width: "44px", height: "24px", borderRadius: "12px", border: "none", cursor: "pointer",
                  background: hasMeetings ? orange : "oklch(82% 0.006 260)",
                  position: "relative", flexShrink: 0, transition: "background 0.2s",
                }}
              >
                <span style={{
                  position: "absolute", top: "2px", left: hasMeetings ? "22px" : "2px",
                  width: "20px", height: "20px", borderRadius: "50%", background: "white",
                  transition: "left 0.2s",
                }} />
              </button>
            </div>

            {hasMeetings && (
              <div style={{ marginTop: "1rem", paddingTop: "1rem", borderTop: "1px solid oklch(90% 0.006 80)", display: "flex", flexDirection: "column", gap: "1rem" }}>

                {/* Frequency */}
                <div>
                  <label style={labelStyle}>{c.frequency}</label>
                  <div style={{ display: "flex", gap: "0.625rem" }}>
                    {(["weekly", "biweekly"] as const).map(opt => (
                      <button
                        key={opt}
                        type="button"
                        onClick={() => setMeetingFrequency(opt)}
                        style={{
                          fontFamily: "var(--font-montserrat)", fontWeight: 700, fontSize: "0.8rem",
                          padding: "0.5rem 1.125rem", borderRadius: "8px", border: "1px solid",
                          cursor: "pointer",
                          background: meetingFrequency === opt ? navy : "white",
                          color: meetingFrequency === opt ? offWhite : mid,
                          borderColor: meetingFrequency === opt ? navy : "oklch(82% 0.006 260)",
                        }}
                      >
                        {opt === "weekly" ? c.weekly : c.biweekly}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Meeting day */}
                <div>
                  <label style={labelStyle}>{c.meetingDay}</label>
                  <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap" }}>
                    {DAYS.map(d => (
                      <button
                        key={d.value}
                        type="button"
                        onClick={() => setMeetingDay(prev => prev === d.value ? null : d.value)}
                        style={{
                          fontFamily: "var(--font-montserrat)", fontWeight: 700, fontSize: "0.75rem",
                          padding: "0.5rem 0.875rem", borderRadius: "8px", border: "1px solid",
                          cursor: "pointer",
                          background: meetingDay === d.value ? orange : "white",
                          color: meetingDay === d.value ? "white" : mid,
                          borderColor: meetingDay === d.value ? orange : "oklch(82% 0.006 260)",
                        }}
                      >
                        {d.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Meeting time */}
                <div>
                  <label style={labelStyle}>{c.meetingTime}</label>
                  <input
                    type="time"
                    value={meetingTime}
                    onChange={e => setMeetingTime(e.target.value)}
                    style={{ ...inputStyle, maxWidth: "160px" }}
                  />
                </div>

                {/* Meeting link */}
                <div>
                  <label style={labelStyle}>{c.meetingLink} <span style={{ fontWeight: 400, color: mid }}>{c.optional}</span></label>
                  <input
                    name="meeting_link"
                    type="url"
                    placeholder="https://zoom.us/j/... or https://teams.microsoft.com/..."
                    style={inputStyle}
                  />
                </div>

              </div>
            )}
          </div>

          {/* Open group toggle */}
          <div style={{ background: "white", border: "1px solid oklch(88% 0.006 80)", borderRadius: "12px", padding: "1rem 1.25rem", display: "flex", justifyContent: "space-between", alignItems: "center", gap: "1rem" }}>
            <div>
              <p style={{ fontFamily: "var(--font-montserrat)", fontWeight: 700, fontSize: "0.875rem", color: navy, marginBottom: "0.25rem" }}>{c.openGroup}</p>
              <p style={{ fontFamily: "var(--font-montserrat)", fontSize: "0.8rem", color: mid, lineHeight: 1.5 }}>
                {c.openGroupDesc}
              </p>
            </div>
            <button
              type="button"
              onClick={() => setIsPublic(p => !p)}
              style={{
                width: "44px", height: "24px", borderRadius: "12px", border: "none", cursor: "pointer",
                background: isPublic ? orange : "oklch(82% 0.006 260)",
                position: "relative", flexShrink: 0, transition: "background 0.2s",
              }}
            >
              <span style={{
                position: "absolute", top: "2px", left: isPublic ? "22px" : "2px",
                width: "20px", height: "20px", borderRadius: "50%", background: "white",
                transition: "left 0.2s",
              }} />
            </button>
          </div>

          {/* Language selector */}
          <div>
            <label style={langLabelStyle}>Language / Bahasa</label>
            <div style={{ display: "flex", gap: "0.5rem" }}>
              {(["en", "id"] as const).map(lang => (
                <button
                  key={lang}
                  type="button"
                  onClick={() => setSelectedLang(lang)}
                  style={pillStyle(selectedLang === lang)}
                >
                  {lang === "en" ? "English" : "Bahasa Indonesia"}
                </button>
              ))}
            </div>
          </div>

        </div>

        {state.error && (
          <p style={{ fontFamily: "var(--font-montserrat)", fontSize: "0.8125rem", color: "oklch(50% 0.22 15)", marginTop: "1rem" }}>
            {state.error}
          </p>
        )}

        <button
          type="submit"
          disabled={pending || selectedDays.length === 0}
          style={{ width: "100%", fontFamily: "var(--font-montserrat)", fontWeight: 700, fontSize: "0.9375rem", color: offWhite, background: navy, border: "none", borderRadius: "8px", padding: "0.9375rem", cursor: pending ? "not-allowed" : "pointer", opacity: pending || selectedDays.length === 0 ? 0.7 : 1, marginTop: "1.5rem" }}
        >
          {pending ? c.creating : c.create}
        </button>
      </form>
    </div>
  );
}

const labelStyle: React.CSSProperties = {
  fontFamily: "var(--font-montserrat)", fontSize: "0.7rem", fontWeight: 700,
  color: "oklch(42% 0.008 260)", display: "block", marginBottom: "0.375rem",
  letterSpacing: "0.04em", textTransform: "uppercase",
};

const langLabelStyle: React.CSSProperties = {
  fontFamily: "var(--font-montserrat)", fontSize: "0.72rem", fontWeight: 700,
  letterSpacing: "0.08em", textTransform: "uppercase", color: "oklch(52% 0.008 260)",
  marginBottom: "0.5rem", display: "block",
};

function pillStyle(active: boolean): React.CSSProperties {
  return {
    fontFamily: "var(--font-montserrat)", fontSize: "0.875rem", fontWeight: 700,
    padding: "0.5rem 1.25rem", borderRadius: "999px", cursor: "pointer",
    background: active ? pillNavy : "#fff",
    color: active ? "#fff" : pillNavy,
    border: active ? "none" : `2px solid ${pillNavy}`,
  };
}

const inputStyle: React.CSSProperties = {
  width: "100%", fontFamily: "var(--font-montserrat)", fontSize: "0.9375rem",
  color: "oklch(22% 0.10 260)", background: "white",
  border: "1px solid oklch(82% 0.006 260)", borderRadius: "8px",
  padding: "0.75rem 1rem", outline: "none", boxSizing: "border-box",
};

"use client";

import { useState, useTransition } from "react";
import { joinGroupByCode } from "@/app/challenge/group-actions";
import { useLanguage } from "@/lib/LanguageContext";

const navy     = "oklch(22% 0.10 260)";
const orange   = "oklch(65% 0.15 45)";
const offWhite = "oklch(97% 0.005 80)";
const mid      = "oklch(52% 0.008 260)";
const DAY_NAMES = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

const DAYS_EN = [
  { value: 1, label: "Mon" }, { value: 2, label: "Tue" }, { value: 3, label: "Wed" },
  { value: 4, label: "Thu" }, { value: 5, label: "Fri" }, { value: 6, label: "Sat" }, { value: 0, label: "Sun" },
];
const DAYS_ID = [
  { value: 1, label: "Sen" }, { value: 2, label: "Sel" }, { value: 3, label: "Rab" },
  { value: 4, label: "Kam" }, { value: 5, label: "Jum" }, { value: 6, label: "Sab" }, { value: 0, label: "Min" },
];

export default function JoinGroupClient({ code, groupName, groupDescription, scheduleDays, memberCount, maxMembers, isFull, lang }: {
  code: string;
  groupName: string;
  groupDescription: string | null;
  scheduleDays: number[];
  memberCount: number;
  maxMembers: number;
  isFull: boolean;
  lang: "en" | "id";
}) {
  const [isPending, startTransition] = useTransition();
  const { t } = useLanguage();
  const c = t.challenge;

  const DAYS = lang === "id" ? DAYS_ID : DAYS_EN;
  const [selectedDays, setSelectedDays] = useState<number[]>(scheduleDays.length > 0 ? scheduleDays : [1, 2, 3, 4, 5]);
  const [time, setTime] = useState("08:00");

  const notifHeading = lang === "id" ? "Kapan kamu ingin diingatkan?" : "When do you want your reminder?";
  const notifHint = lang === "id"
    ? "Kami akan kirim notifikasi push pada hari dan jam yang kamu pilih."
    : "We'll send you a push notification on the days and time you choose.";
  const daysLabel = lang === "id" ? "Hari membaca" : "Reading days";
  const timeLabel = lang === "id" ? "Jam" : "Time";

  function toggleDay(v: number) {
    setSelectedDays(p => p.includes(v) ? p.filter(d => d !== v) : [...p, v]);
  }

  function handleJoin() {
    startTransition(async () => {
      const tz = Intl.DateTimeFormat().resolvedOptions().timeZone || "UTC";
      await joinGroupByCode(code, time, selectedDays, tz);
    });
  }

  return (
    <div style={{ minHeight: "100dvh", background: offWhite, display: "flex", alignItems: "center", justifyContent: "center", padding: "2rem 1.5rem" }}>
      <div style={{ width: "100%", maxWidth: "420px" }}>
        <p style={{ fontFamily: "var(--font-montserrat)", fontSize: "0.62rem", fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", color: orange, marginBottom: "0.5rem" }}>
          {c.youreInvited}
        </p>
        <h1 style={{ fontFamily: "var(--font-montserrat)", fontWeight: 800, fontSize: "1.5rem", color: navy, marginBottom: "0.375rem" }}>
          {groupName}
        </h1>
        {groupDescription && (
          <p style={{ fontFamily: "var(--font-montserrat)", fontSize: "0.875rem", color: mid, lineHeight: 1.6, marginBottom: "0.875rem" }}>
            {groupDescription}
          </p>
        )}
        <p style={{ fontFamily: "var(--font-montserrat)", fontSize: "0.78rem", color: mid, marginBottom: "2rem" }}>
          {(memberCount !== 1 ? c.membersReadsPlural : c.membersReads)
            .replace("{n}", String(memberCount))
            .replace("{days}", scheduleDays.sort().map(d => DAY_NAMES[d]).join(", "))}
          {" "}&nbsp;({maxMembers} max)
        </p>

        {isFull ? (
          <p style={{ fontFamily: "var(--font-montserrat)", fontSize: "0.875rem", color: "oklch(50% 0.22 15)" }}>
            {c.groupFull}
          </p>
        ) : (
          <>
            {/* Notification prefs */}
            <div style={{ background: "white", border: "1px solid oklch(88% 0.006 80)", borderRadius: "12px", padding: "1.25rem", marginBottom: "1.5rem" }}>
              <p style={{ fontFamily: "var(--font-montserrat)", fontWeight: 700, fontSize: "0.9375rem", color: navy, marginBottom: "0.25rem" }}>
                {notifHeading}
              </p>
              <p style={{ fontFamily: "var(--font-montserrat)", fontSize: "0.78rem", color: mid, lineHeight: 1.55, marginBottom: "1.125rem" }}>
                {notifHint}
              </p>

              <p style={{ fontFamily: "var(--font-montserrat)", fontWeight: 700, fontSize: "0.72rem", letterSpacing: "0.06em", textTransform: "uppercase", color: mid, marginBottom: "0.5rem" }}>
                {daysLabel}
              </p>
              <div style={{ display: "flex", gap: "0.375rem", flexWrap: "wrap", marginBottom: "1rem" }}>
                {DAYS.map(d => (
                  <button
                    key={d.value}
                    type="button"
                    onClick={() => toggleDay(d.value)}
                    style={{
                      fontFamily: "var(--font-montserrat)", fontWeight: 700, fontSize: "0.8125rem",
                      padding: "0.5rem 0.875rem", borderRadius: "8px", border: "1px solid",
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

              <p style={{ fontFamily: "var(--font-montserrat)", fontWeight: 700, fontSize: "0.72rem", letterSpacing: "0.06em", textTransform: "uppercase", color: mid, marginBottom: "0.5rem" }}>
                {timeLabel}
              </p>
              <input
                type="time"
                value={time}
                onChange={e => setTime(e.target.value)}
                style={{ fontFamily: "var(--font-montserrat)", fontSize: "1rem", fontWeight: 700, color: navy, background: "oklch(95% 0.004 80)", border: "1px solid oklch(85% 0.006 80)", borderRadius: "8px", padding: "0.625rem 0.875rem", outline: "none" }}
              />
            </div>

            <button
              onClick={handleJoin}
              disabled={isPending || selectedDays.length === 0}
              style={{ width: "100%", fontFamily: "var(--font-montserrat)", fontWeight: 700, fontSize: "1rem", color: offWhite, background: navy, border: "none", borderRadius: "8px", padding: "0.9375rem", cursor: (isPending || selectedDays.length === 0) ? "not-allowed" : "pointer", opacity: (isPending || selectedDays.length === 0) ? 0.7 : 1 }}
            >
              {isPending ? c.joining : c.joinGroup}
            </button>
          </>
        )}
      </div>
    </div>
  );
}

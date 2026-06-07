"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import { reviewApplication, toggleGroupPublic, updateGroupDetails } from "@/app/challenge/group-actions";
import { updateNotificationPrefs } from "@/app/challenge/actions";
import { useLanguage } from "@/lib/LanguageContext";

const navy     = "oklch(22% 0.10 260)";
const orange   = "oklch(65% 0.15 45)";
const offWhite = "oklch(97% 0.005 80)";
const mid      = "oklch(52% 0.008 260)";


type Group = {
  id: string;
  name: string;
  description: string | null;
  group_code: string;
  is_public: boolean;
  max_members: number;
  schedule_days: number[];
  memberCount: number;
  inviteUrl: string;
  notify_time: string | null;
  notify_timezone: string;
  start_date: string | null;
  currentDay: number;
  language?: string | null;
};

type Application = {
  id: string;
  group_id: string;
  user_id: string;
  status: string;
  answer_1: string | null;
  answer_2: string | null;
};

const DAY_NAMES = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

const PERSONAL_DAYS_EN = [
  { value: 1, label: "Mon" }, { value: 2, label: "Tue" }, { value: 3, label: "Wed" },
  { value: 4, label: "Thu" }, { value: 5, label: "Fri" }, { value: 6, label: "Sat" }, { value: 0, label: "Sun" },
];
const PERSONAL_DAYS_ID = [
  { value: 1, label: "Sen" }, { value: 2, label: "Sel" }, { value: 3, label: "Rab" },
  { value: 4, label: "Kam" }, { value: 5, label: "Jum" }, { value: 6, label: "Sab" }, { value: 0, label: "Min" },
];

export default function FacilitatorDashboard({
  groups,
  pendingApplications,
  firstName,
  personalTime,
  personalDays,
  lang,
}: {
  groups: Group[];
  pendingApplications: Application[];
  newlyCreatedId: string | null;
  newGroupCode: string | null;
  firstName: string;
  personalTime: string;
  personalDays: number[];
  lang: "en" | "id";
}) {
  const { t } = useLanguage();
  const c = t.challenge;

  const [copied, setCopied] = useState(false);
  const [isPending, startTransition] = useTransition();
  const [sendStatus, setSendStatus] = useState<"idle" | "sending" | "done" | "error">("idle");
  const [editingDetails, setEditingDetails] = useState(false);
  const [editName, setEditName] = useState(groups[0]?.name ?? "");
  const [editDescription, setEditDescription] = useState(groups[0]?.description ?? "");
  const [editLanguage, setEditLanguage] = useState<"en" | "id">((groups[0]?.language as "en" | "id") ?? "en");
  const [detailsSaving, setDetailsSaving] = useState(false);
  const [detailsError, setDetailsError] = useState<string | null>(null);
  const [pDays, setPDays] = useState<number[]>(personalDays);
  const [pTime, setPTime] = useState(personalTime);
  const [pSaved, setPSaved] = useState(false);
  const [pPending, startPTransition] = useTransition();

  const group = groups[0] ?? null;

  function copy(text: string) {
    navigator.clipboard.writeText(text).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    });
  }

  function handleTogglePublic(groupId: string, current: boolean) {
    startTransition(async () => { await toggleGroupPublic(groupId, !current); });
  }

  async function handleSendNow() {
    if (!group) return;
    setSendStatus("sending");
    try {
      const res = await fetch("/api/push/challenge-group", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          groupId: group.id,
          title: "📖 Time to read",
          message: `Day ${group.name} — open your challenge session now.`,
          url: "/challenge/day/1",
        }),
      });
      setSendStatus(res.ok ? "done" : "error");
    } catch { setSendStatus("error"); }
    setTimeout(() => setSendStatus("idle"), 3000);
  }

  function handleReview(appId: string, action: "approve" | "reject") {
    startTransition(async () => { await reviewApplication(appId, action); });
  }

  function handleSavePersonal() {
    if (pPending || pSaved || pDays.length === 0) return;
    startPTransition(async () => {
      const fd = new FormData();
      fd.set("notification_time", pTime);
      fd.set("timezone", Intl.DateTimeFormat().resolvedOptions().timeZone || "UTC");
      pDays.forEach(d => fd.append("notification_days", String(d)));
      await updateNotificationPrefs(fd);
      setPSaved(true);
      setTimeout(() => setPSaved(false), 2500);
    });
  }

  return (
    <div style={{ minHeight: "calc(100dvh - 80px)", background: offWhite }}>
      {/* Top bar */}
      <div style={{ background: navy, padding: "0.875rem clamp(1rem, 4vw, 2rem)", display: "flex", alignItems: "center", gap: "0.875rem" }}>
        <Link href="/dashboard" style={{ color: "oklch(72% 0.04 260)", textDecoration: "none", fontSize: "0.75rem", fontFamily: "var(--font-montserrat)" }}>
          {c.backDashboard}
        </Link>
        <span style={{ fontFamily: "var(--font-montserrat)", fontSize: "0.7rem", fontWeight: 700, color: offWhite, letterSpacing: "0.08em", textTransform: "uppercase" }}>
          {c.facilitatorLabel}
        </span>
      </div>

      <div style={{ maxWidth: "600px", margin: "0 auto", padding: "clamp(1.5rem, 4vw, 2.5rem) clamp(1rem, 4vw, 2rem)" }}>

        {!group ? (
          <div style={{ textAlign: "center", paddingBlock: "3rem" }}>
            <p style={{ fontFamily: "var(--font-montserrat)", fontSize: "0.9rem", color: mid, marginBottom: "1.5rem" }}>
              {c.noGroupYet}
            </p>
            <Link href="/challenge/group/create" style={{ fontFamily: "var(--font-montserrat)", fontWeight: 700, fontSize: "0.875rem", color: offWhite, background: navy, padding: "0.75rem 1.75rem", borderRadius: "8px", textDecoration: "none" }}>
              {c.createGroup}
            </Link>
          </div>
        ) : (
          <>
            {/* Group header */}
            <div style={{ marginBottom: "1.5rem" }}>
              <p style={{ fontFamily: "var(--font-montserrat)", fontSize: "0.62rem", fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", color: orange, marginBottom: "0.375rem" }}>
                {c.yourGroup}
              </p>
              {editingDetails ? (
                <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem", marginBottom: "0.75rem" }}>
                  <input
                    value={editName}
                    onChange={e => setEditName(e.target.value)}
                    placeholder="Group name"
                    style={{ fontFamily: "var(--font-montserrat)", fontWeight: 700, fontSize: "1.1rem", color: navy, border: "1.5px solid oklch(72% 0.08 260)", borderRadius: "8px", padding: "0.5rem 0.75rem", outline: "none" }}
                  />
                  <textarea
                    value={editDescription}
                    onChange={e => setEditDescription(e.target.value)}
                    placeholder="Short description (optional)"
                    rows={2}
                    style={{ fontFamily: "var(--font-montserrat)", fontSize: "0.875rem", color: navy, border: "1.5px solid oklch(82% 0.006 260)", borderRadius: "8px", padding: "0.5rem 0.75rem", outline: "none", resize: "vertical" }}
                  />
                  <div>
                    <p style={{ fontFamily: "var(--font-montserrat)", fontSize: "0.65rem", fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", color: mid, marginBottom: "0.4rem" }}>Challenge language</p>
                    <div style={{ display: "flex", gap: "0.5rem" }}>
                      {(["en", "id"] as const).map(lang => (
                        <button
                          key={lang}
                          onClick={() => setEditLanguage(lang)}
                          style={{ fontFamily: "var(--font-montserrat)", fontWeight: 700, fontSize: "0.78rem", padding: "0.4rem 0.875rem", border: editLanguage === lang ? "none" : `1.5px solid oklch(82% 0.006 260)`, borderRadius: "6px", background: editLanguage === lang ? navy : "white", color: editLanguage === lang ? "white" : navy, cursor: "pointer" }}
                        >
                          {lang === "en" ? "English" : "Bahasa Indonesia"}
                        </button>
                      ))}
                    </div>
                  </div>
                  {detailsError && <p style={{ fontFamily: "var(--font-montserrat)", fontSize: "0.78rem", color: "oklch(52% 0.2 25)", margin: 0 }}>{detailsError}</p>}
                  <div style={{ display: "flex", gap: "0.625rem" }}>
                    <button
                      onClick={async () => {
                        setDetailsSaving(true);
                        setDetailsError(null);
                        const res = await updateGroupDetails(group.id, editName, editDescription || null, editLanguage);
                        setDetailsSaving(false);
                        if (res?.error) { setDetailsError(res.error); } else { setEditingDetails(false); }
                      }}
                      disabled={detailsSaving}
                      style={{ fontFamily: "var(--font-montserrat)", fontWeight: 700, fontSize: "0.78rem", color: "white", background: detailsSaving ? "oklch(62% 0.06 260)" : navy, border: "none", borderRadius: "7px", padding: "0.5rem 1rem", cursor: detailsSaving ? "not-allowed" : "pointer" }}
                    >
                      {detailsSaving ? "Saving…" : "Save"}
                    </button>
                    <button
                      onClick={() => { setEditingDetails(false); setEditName(group.name); setEditDescription(group.description ?? ""); setEditLanguage((group.language as "en" | "id") ?? "en"); setDetailsError(null); }}
                      style={{ fontFamily: "var(--font-montserrat)", fontWeight: 600, fontSize: "0.78rem", color: mid, background: "transparent", border: `1px solid oklch(82% 0.006 260)`, borderRadius: "7px", padding: "0.5rem 1rem", cursor: "pointer" }}
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                <>
                  <div style={{ display: "flex", alignItems: "flex-start", gap: "0.75rem", marginBottom: "0.25rem" }}>
                    <h1 style={{ fontFamily: "var(--font-montserrat)", fontWeight: 800, fontSize: "1.5rem", color: navy, margin: 0, flex: 1 }}>
                      {group.name}
                    </h1>
                    <button
                      onClick={() => setEditingDetails(true)}
                      style={{ fontFamily: "var(--font-montserrat)", fontSize: "0.7rem", fontWeight: 600, color: mid, background: "transparent", border: "none", cursor: "pointer", padding: "0.25rem 0", flexShrink: 0, marginTop: "0.25rem" }}
                    >
                      Edit
                    </button>
                  </div>
                  {group.description && (
                    <p style={{ fontFamily: "var(--font-montserrat)", fontSize: "0.875rem", color: mid, lineHeight: 1.6 }}>
                      {group.description}
                    </p>
                  )}
                </>
              )}
              <p style={{ fontFamily: "var(--font-montserrat)", fontSize: "0.78rem", color: mid, marginTop: "0.5rem" }}>
                {(group.memberCount !== 1 ? c.membersReadsPlural : c.membersReads)
                  .replace("{n}", String(group.memberCount))
                  .replace("{days}", group.schedule_days.sort().map(d => DAY_NAMES[d]).join(", "))}
              </p>
            </div>

            {/* Invite link — single, prominent */}
            <div style={{ background: "white", border: "1px solid oklch(88% 0.006 80)", borderRadius: "12px", padding: "1.25rem", marginBottom: "1.25rem" }}>
              <p style={{ fontFamily: "var(--font-montserrat)", fontWeight: 700, fontSize: "0.875rem", color: navy, marginBottom: "0.375rem" }}>
                {c.inviteLink}
              </p>
              <p style={{ fontFamily: "var(--font-montserrat)", fontSize: "0.78rem", color: mid, lineHeight: 1.55, marginBottom: "0.75rem" }}>
                {c.inviteLinkHint}
              </p>
              <div style={{ display: "flex", gap: "0.5rem" }}>
                <div style={{ fontFamily: "var(--font-montserrat)", fontSize: "0.8rem", color: mid, background: "oklch(94% 0.004 80)", border: "1px solid oklch(88% 0.006 80)", borderRadius: "6px", padding: "0.6rem 0.875rem", flex: 1, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                  {group.inviteUrl}
                </div>
                <button
                  onClick={() => copy(group.inviteUrl)}
                  style={{ fontFamily: "var(--font-montserrat)", fontWeight: 700, fontSize: "0.8rem", color: offWhite, background: copied ? "oklch(42% 0.14 145)" : navy, border: "none", borderRadius: "6px", padding: "0.6rem 1.1rem", cursor: "pointer", whiteSpace: "nowrap", flexShrink: 0, transition: "background 0.2s" }}
                >
                  {copied ? c.copied : c.copy}
                </button>
                <a
                  href={`https://wa.me/?text=${encodeURIComponent("Join my Influential Leadership Challenge group: " + group.inviteUrl)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{ display: "flex", alignItems: "center", gap: "0.35rem", background: "#25D366", border: "none", borderRadius: "6px", padding: "0.6rem 0.875rem", cursor: "pointer", whiteSpace: "nowrap", flexShrink: 0, textDecoration: "none" }}
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="white" xmlns="http://www.w3.org/2000/svg">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                  </svg>
                  <span style={{ fontFamily: "var(--font-montserrat)", fontWeight: 700, fontSize: "0.8rem", color: "white" }}>{c.shareWhatsApp}</span>
                </a>
              </div>
              <p style={{ fontFamily: "var(--font-montserrat)", fontSize: "0.72rem", color: mid, marginTop: "0.5rem" }}>
                {c.groupCode} <strong style={{ color: navy, letterSpacing: "0.08em" }}>{group.group_code}</strong>
              </p>
            </div>

            {/* Actions row */}
            <div style={{ display: "flex", gap: "0.75rem", marginBottom: "1.5rem", flexWrap: "wrap", alignItems: "center" }}>
              {(() => {
                const startDate = group.start_date ? new Date(group.start_date + "T00:00:00") : null;
                const today = new Date(); today.setHours(0, 0, 0, 0);
                if (startDate && startDate > today) {
                  return (
                    <p style={{ fontFamily: "var(--font-montserrat)", fontSize: "0.8125rem", color: mid, margin: 0 }}>
                      {c.startsDate.replace("{date}", startDate.toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" }))}
                    </p>
                  );
                }
                return (
                  <Link
                    href={`/challenge/day/${group.currentDay}`}
                    style={{ fontFamily: "var(--font-montserrat)", fontWeight: 700, fontSize: "0.8125rem", color: offWhite, background: navy, padding: "0.625rem 1.25rem", borderRadius: "8px", textDecoration: "none" }}
                  >
                    {group.currentDay <= 1 ? c.startChallenge : c.continueDay.replace("{n}", String(group.currentDay))}
                  </Link>
                );
              })()}

              {/* Open group toggle */}
              <button
                type="button"
                onClick={() => handleTogglePublic(group.id, group.is_public)}
                disabled={isPending}
                style={{ fontFamily: "var(--font-montserrat)", fontWeight: 600, fontSize: "0.8125rem", color: navy, background: "white", border: "1px solid oklch(82% 0.006 260)", padding: "0.625rem 1.25rem", borderRadius: "8px", cursor: "pointer" }}
              >
                {group.is_public ? c.openGroup : c.makeOpenGroup}
              </button>
            </div>

            {/* Team reminders — send-now only */}
            <div style={{ background: "white", border: "1px solid oklch(88% 0.006 80)", borderRadius: "12px", padding: "1.25rem", marginBottom: "1.25rem" }}>
              <p style={{ fontFamily: "var(--font-montserrat)", fontWeight: 700, fontSize: "0.875rem", color: navy, marginBottom: "0.25rem" }}>
                {c.memberNotifications}
              </p>
              <p style={{ fontFamily: "var(--font-montserrat)", fontSize: "0.78rem", color: mid, lineHeight: 1.55, marginBottom: "1rem" }}>
                {c.memberNotificationsHint}
              </p>
              <button
                onClick={handleSendNow}
                disabled={sendStatus === "sending"}
                style={{ fontFamily: "var(--font-montserrat)", fontWeight: 700, fontSize: "0.78rem", color: navy, background: "white", border: `1px solid ${navy}`, borderRadius: "6px", padding: "0.5rem 1rem", cursor: "pointer" }}
              >
                {sendStatus === "sending" ? c.sending : sendStatus === "done" ? c.sent : sendStatus === "error" ? c.sendFailed : c.sendNow}
              </button>
            </div>

            {/* Personal notification settings */}
            {(() => {
              const PDAYS = lang === "id" ? PERSONAL_DAYS_ID : PERSONAL_DAYS_EN;
              const pLabel = lang === "id" ? "Notifikasi saya sendiri" : "My personal notifications";
              const pHint = lang === "id"
                ? "Pengingat harian untuk sesi tantangan kamu sendiri."
                : "Your own daily reminder for the challenge sessions.";
              const pDayLabel = lang === "id" ? "Hari kamu membaca" : "Days you read";
              const pTimeLabel = lang === "id" ? "Pukul berapa?" : "What time?";
              const pSaveLabel = lang === "id" ? "Simpan" : "Save";
              const pSavingLabel = lang === "id" ? "Menyimpan…" : "Saving…";
              const pSavedLabel = lang === "id" ? "✓ Tersimpan" : "✓ Saved";
              return (
                <div style={{ background: "white", border: "1px solid oklch(88% 0.006 80)", borderRadius: "12px", padding: "1.25rem", marginBottom: "1.25rem" }}>
                  <p style={{ fontFamily: "var(--font-montserrat)", fontWeight: 700, fontSize: "0.875rem", color: navy, marginBottom: "0.25rem" }}>
                    {pLabel}
                  </p>
                  <p style={{ fontFamily: "var(--font-montserrat)", fontSize: "0.78rem", color: mid, lineHeight: 1.55, marginBottom: "1rem" }}>
                    {pHint}
                  </p>
                  <p style={{ fontFamily: "var(--font-montserrat)", fontWeight: 700, fontSize: "0.72rem", letterSpacing: "0.06em", textTransform: "uppercase", color: mid, marginBottom: "0.5rem" }}>
                    {pDayLabel}
                  </p>
                  <div style={{ display: "flex", gap: "0.375rem", flexWrap: "wrap", marginBottom: "0.875rem" }}>
                    {PDAYS.map(d => (
                      <button
                        key={d.value}
                        type="button"
                        onClick={() => setPDays(prev => prev.includes(d.value) ? prev.filter(x => x !== d.value) : [...prev, d.value])}
                        style={{
                          fontFamily: "var(--font-montserrat)", fontWeight: 700, fontSize: "0.78rem",
                          padding: "0.4375rem 0.75rem", borderRadius: "6px", border: "1px solid",
                          cursor: "pointer",
                          background: pDays.includes(d.value) ? navy : "white",
                          color: pDays.includes(d.value) ? offWhite : mid,
                          borderColor: pDays.includes(d.value) ? navy : "oklch(82% 0.006 260)",
                          transition: "background 0.15s, color 0.15s",
                        }}
                      >
                        {d.label}
                      </button>
                    ))}
                  </div>
                  <p style={{ fontFamily: "var(--font-montserrat)", fontWeight: 700, fontSize: "0.72rem", letterSpacing: "0.06em", textTransform: "uppercase", color: mid, marginBottom: "0.5rem" }}>
                    {pTimeLabel}
                  </p>
                  <div style={{ display: "flex", gap: "0.625rem", alignItems: "center", flexWrap: "wrap" }}>
                    <input
                      type="time"
                      value={pTime}
                      onChange={e => setPTime(e.target.value)}
                      style={{ fontFamily: "var(--font-montserrat)", fontSize: "0.9rem", color: navy, background: "oklch(95% 0.004 80)", border: "1px solid oklch(85% 0.006 80)", borderRadius: "6px", padding: "0.5rem 0.75rem", outline: "none" }}
                    />
                    <button
                      onClick={handleSavePersonal}
                      disabled={pPending || pSaved || pDays.length === 0}
                      style={{ fontFamily: "var(--font-montserrat)", fontWeight: 700, fontSize: "0.78rem", color: offWhite, border: "none", borderRadius: "6px", padding: "0.5rem 1rem", cursor: (pPending || pSaved || pDays.length === 0) ? "not-allowed" : "pointer", background: pSaved ? "oklch(42% 0.14 145)" : navy, transition: "background 0.2s" }}
                    >
                      {pSaved ? pSavedLabel : pPending ? pSavingLabel : pSaveLabel}
                    </button>
                  </div>
                </div>
              );
            })()}

            {/* Pending applications */}
            {pendingApplications.length > 0 && (
              <div>
                <p style={{ fontFamily: "var(--font-montserrat)", fontSize: "0.62rem", fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", color: orange, marginBottom: "0.875rem" }}>
                  {c.applications.replace("{n}", String(pendingApplications.length))}
                </p>
                <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
                  {pendingApplications.map(app => (
                    <div key={app.id} style={{ background: "white", border: "1px solid oklch(88% 0.006 80)", borderRadius: "12px", padding: "1.125rem" }}>
                      {app.answer_1 && (
                        <p style={{ fontFamily: "var(--font-montserrat)", fontSize: "0.875rem", color: "oklch(35% 0.008 260)", lineHeight: 1.65, marginBottom: "0.875rem" }}>
                          {app.answer_1}
                        </p>
                      )}
                      <div style={{ display: "flex", gap: "0.625rem" }}>
                        <button
                          onClick={() => handleReview(app.id, "approve")}
                          disabled={isPending}
                          style={{ fontFamily: "var(--font-montserrat)", fontWeight: 700, fontSize: "0.8rem", color: offWhite, background: "oklch(42% 0.14 145)", border: "none", borderRadius: "6px", padding: "0.5rem 1rem", cursor: "pointer" }}
                        >
                          {c.approve}
                        </button>
                        <button
                          onClick={() => handleReview(app.id, "reject")}
                          disabled={isPending}
                          style={{ fontFamily: "var(--font-montserrat)", fontWeight: 700, fontSize: "0.8rem", color: mid, background: "none", border: "1px solid oklch(82% 0.006 260)", borderRadius: "6px", padding: "0.5rem 1rem", cursor: "pointer" }}
                        >
                          {c.decline}
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}

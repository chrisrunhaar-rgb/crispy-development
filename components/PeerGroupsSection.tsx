"use client";

import { useState, useTransition, useRef } from "react";
import { useActionState } from "react";
import Link from "next/link";
import {
  setPeerGroupTopic,
  setPeerGroupLanguage,
  setPeerGroupOpen,
  setPeerGroupName,
  approvePeerMember,
  removePeerMember,
  sendPeerBroadcast,
  applyToJoinPeerGroup,
  getOpenPeerGroups,
} from "@/app/(app)/dashboard/peer-actions";
import { submitCoachMessage } from "@/app/auth/actions";
import PeerInviteButton from "@/components/PeerInviteButton";

// ── Types ──────────────────────────────────────────────────────────────────

export type PeerMember = {
  id: string;
  name: string;
  email: string;
  status: "pending" | "active";
  questionnaireAnswers: { location: string; experience: string; contribution: string } | null;
  completedModules?: number;
  isInitiator?: boolean;
};

export type PeerBroadcast = {
  id: string;
  message: string;
  sent_at: string;
};

export type InitiatedGroup = {
  id: string;
  name: string;
  region: string;
  timezone: string;
  is_open: boolean;
  current_topic: string | null;
  language: string;
  members: PeerMember[];
  broadcasts: PeerBroadcast[];
};

export type JoinedGroup = {
  id: string;
  name: string;
  region: string;
  timezone: string;
  current_topic: string | null;
  language: string;
  members: PeerMember[];
};

type CoachMsg = {
  id: string;
  message: string;
  subject: string | null;
  created_at: string;
  reply: string | null;
  replied_at: string | null;
  status: string;
};

type CoachState = { error?: string; success?: boolean } | null;

// ── Constants ──────────────────────────────────────────────────────────────

const PEER_TOPICS = [
  "Fundraising Coaching Track",
  "Influential Leadership",
  "Child Protection Course",
  "Zoom Course",
  "Teams Course",
];

const TOPIC_COURSE_URL: Record<string, { en: string; id: string }> = {
  "Zoom Course": { en: "/resources/zoom-training", id: "/resources/zoom-training-id" },
  "Teams Course": { en: "/resources/teams-training", id: "/resources/teams-training-id" },
};

const LANG_LABELS: Record<string, string> = { en: "English", id: "Bahasa Indonesia", nl: "Nederlands" };

function fmtDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" });
}

// ── Shared styles ──────────────────────────────────────────────────────────

const labelStyle: React.CSSProperties = {
  display: "block",
  fontFamily: "var(--font-montserrat)",
  fontSize: "0.62rem",
  fontWeight: 700,
  letterSpacing: "0.12em",
  textTransform: "uppercase",
  color: "oklch(55% 0.008 260)",
  marginBottom: "0.4rem",
};

const inputStyle: React.CSSProperties = {
  width: "100%",
  boxSizing: "border-box",
  fontFamily: "var(--font-montserrat)",
  fontSize: "0.875rem",
  color: "oklch(22% 0.005 260)",
  background: "oklch(99% 0.002 80)",
  border: "1px solid oklch(84% 0.008 80)",
  padding: "0.625rem 0.75rem",
  outline: "none",
};

const textareaStyle: React.CSSProperties = {
  ...inputStyle,
  resize: "vertical" as const,
  lineHeight: 1.6,
};

// ── InitiatedGroupCard ─────────────────────────────────────────────────────

function InitiatedGroupCard({ group, initiatorName, totalModules }: { group: InitiatedGroup; initiatorName: string; totalModules: number }) {
  const [expanded, setExpanded] = useState(false);
  const [localName, setLocalName] = useState(group.name);
  const [nameEditing, setNameEditing] = useState(false);
  const [nameInput, setNameInput] = useState(group.name);
  const [nameSaving, startNameTransition] = useTransition();
  const [localTopic, setLocalTopic] = useState(group.current_topic ?? "");
  const [localLang, setLocalLang] = useState(group.language);
  const [localOpen, setLocalOpen] = useState(group.is_open);
  const [localMembers, setLocalMembers] = useState<PeerMember[]>(group.members);
  const [localBroadcasts, setLocalBroadcasts] = useState<PeerBroadcast[]>(group.broadcasts);

  const [topicSaving, startTopicTransition] = useTransition();
  const [langSaving, startLangTransition] = useTransition();
  const [openSaving, startOpenTransition] = useTransition();
  const [approvingId, setApprovingId] = useState<string | null>(null);
  const [removingId, setRemovingId] = useState<string | null>(null);
  const [expandedAnswersId, setExpandedAnswersId] = useState<string | null>(null);

  const [broadcastMsg, setBroadcastMsg] = useState("");
  const [broadcastSending, setBroadcastSending] = useState(false);
  const [broadcastResult, setBroadcastResult] = useState<string | null>(null);
  const [broadcastHistoryOpen, setBroadcastHistoryOpen] = useState(false);


  const pendingMembers = localMembers.filter(m => m.status === "pending");
  const activeMembers = localMembers.filter(m => m.status === "active");

  function handleTopicChange(topic: string) {
    setLocalTopic(topic);
    startTopicTransition(async () => {
      await setPeerGroupTopic(group.id, topic);
    });
  }

  function handleLangChange(lang: string) {
    setLocalLang(lang);
    startLangTransition(async () => {
      await setPeerGroupLanguage(group.id, lang);
    });
  }

  function handleOpenToggle() {
    const next = !localOpen;
    setLocalOpen(next);
    startOpenTransition(async () => {
      await setPeerGroupOpen(group.id, next);
    });
  }

  async function handleApprove(memberId: string) {
    setApprovingId(memberId);
    const result = await approvePeerMember(group.id, memberId);
    if (!result.error) {
      setLocalMembers(prev =>
        prev.map(m => m.id === memberId ? { ...m, status: "active" as const } : m)
      );
    }
    setApprovingId(null);
  }

  async function handleRemove(memberId: string) {
    setRemovingId(memberId);
    const result = await removePeerMember(group.id, memberId);
    if (!result.error) {
      setLocalMembers(prev => prev.filter(m => m.id !== memberId));
    }
    setRemovingId(null);
  }

  async function handleBroadcast(e: React.FormEvent) {
    e.preventDefault();
    if (!broadcastMsg.trim()) return;
    setBroadcastSending(true);
    setBroadcastResult(null);
    const result = await sendPeerBroadcast(group.id, broadcastMsg.trim());
    if (result.error) {
      setBroadcastResult(`Error: ${result.error}`);
    } else {
      const newEntry: PeerBroadcast = { id: Date.now().toString(), message: broadcastMsg.trim(), sent_at: new Date().toISOString() };
      setLocalBroadcasts(prev => [newEntry, ...prev]);
      setBroadcastMsg("");
      setBroadcastResult("Sent ✓");
      setTimeout(() => setBroadcastResult(null), 2500);
    }
    setBroadcastSending(false);
  }

  return (
    <div style={{ border: "1px solid oklch(86% 0.008 80)", background: "white" }}>
      {/* Card header */}
      <button
        onClick={() => setExpanded(o => !o)}
        style={{
          width: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "1.125rem 1.5rem",
          background: expanded ? "oklch(30% 0.12 260)" : "white",
          border: "none",
          cursor: "pointer",
          textAlign: "left",
          gap: "1rem",
          transition: "background 0.18s",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "1rem", flex: 1, minWidth: 0 }}>
          <div style={{
            width: "8px", height: "8px", borderRadius: "50%",
            background: localOpen ? "oklch(55% 0.15 145)" : "oklch(62% 0.008 260)",
            flexShrink: 0,
          }} />
          <div style={{ minWidth: 0 }}>
            <p style={{
              fontFamily: "var(--font-montserrat)",
              fontWeight: 700,
              fontSize: "0.9375rem",
              color: expanded ? "oklch(97% 0.005 80)" : "oklch(22% 0.005 260)",
              lineHeight: 1.2,
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
            }}>
              {localName}
            </p>
            <p style={{
              fontFamily: "var(--font-montserrat)",
              fontSize: "0.7rem",
              color: expanded ? "oklch(72% 0.04 260)" : "oklch(55% 0.008 260)",
              marginTop: "0.2rem",
            }}>
              {localTopic || "No topic set"} · {activeMembers.length} member{activeMembers.length !== 1 ? "s" : ""}
              {pendingMembers.length > 0 && (
                <span style={{ color: "oklch(65% 0.15 45)", fontWeight: 700 }}>
                  {" "}· {pendingMembers.length} pending
                </span>
              )}
            </p>
          </div>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", flexShrink: 0 }}>
          <span style={{
            fontFamily: "var(--font-montserrat)",
            fontSize: "0.6rem",
            fontWeight: 700,
            letterSpacing: "0.1em",
            textTransform: "uppercase",
            padding: "0.25rem 0.625rem",
            background: localOpen
              ? (expanded ? "oklch(55% 0.15 145 / 0.2)" : "oklch(55% 0.15 145 / 0.1)")
              : (expanded ? "oklch(62% 0.008 260 / 0.2)" : "oklch(88% 0.008 80)"),
            color: localOpen
              ? "oklch(42% 0.14 145)"
              : (expanded ? "oklch(72% 0.04 260)" : "oklch(52% 0.008 260)"),
          }}>
            {localOpen ? "Open" : "Closed"}
          </span>
          <span style={{
            fontFamily: "var(--font-montserrat)",
            fontSize: "0.7rem",
            color: expanded ? "oklch(72% 0.04 260)" : "oklch(52% 0.008 260)",
          }}>
            {expanded ? "▲" : "▼"}
          </span>
        </div>
      </button>

      {/* Expanded content */}
      {expanded && (
        <div style={{ padding: "1.5rem", display: "flex", flexDirection: "column", gap: "1.5rem", borderTop: "1px solid oklch(88% 0.008 80)" }}>

          {/* Row 0: Group name */}
          <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
            {nameEditing ? (
              <form
                onSubmit={e => {
                  e.preventDefault();
                  if (!nameInput.trim()) return;
                  startNameTransition(async () => {
                    const res = await setPeerGroupName(group.id, nameInput.trim());
                    if (!res.error) { setLocalName(nameInput.trim()); setNameEditing(false); }
                  });
                }}
                style={{ display: "flex", gap: "0.375rem", alignItems: "center" }}
              >
                <input
                  value={nameInput}
                  onChange={e => setNameInput(e.target.value)}
                  autoFocus
                  disabled={nameSaving}
                  maxLength={80}
                  style={{ ...inputStyle, width: "auto", flex: 1, fontSize: "0.9rem", fontWeight: 700, padding: "0.3rem 0.5rem" }}
                />
                <button type="submit" disabled={nameSaving || !nameInput.trim()} style={{ fontFamily: "var(--font-montserrat)", fontSize: "0.62rem", fontWeight: 700, letterSpacing: "0.06em", textTransform: "uppercase", padding: "0.35rem 0.75rem", background: "oklch(30% 0.12 260)", color: "white", border: "none", cursor: nameSaving ? "not-allowed" : "pointer" }}>
                  {nameSaving ? "…" : "Save"}
                </button>
                <button type="button" onClick={() => { setNameEditing(false); setNameInput(localName); }} style={{ fontFamily: "var(--font-montserrat)", fontSize: "0.62rem", fontWeight: 700, letterSpacing: "0.06em", textTransform: "uppercase", padding: "0.35rem 0.75rem", background: "none", border: "1px solid oklch(84% 0.008 80)", color: "oklch(55% 0.008 260)", cursor: "pointer" }}>
                  Cancel
                </button>
              </form>
            ) : (
              <>
                <p style={{ fontFamily: "var(--font-montserrat)", fontWeight: 700, fontSize: "0.9rem", color: "oklch(22% 0.005 260)" }}>{localName}</p>
                <button onClick={() => { setNameEditing(true); setNameInput(localName); }} style={{ fontFamily: "var(--font-montserrat)", fontSize: "0.6rem", fontWeight: 700, letterSpacing: "0.06em", textTransform: "uppercase", color: "oklch(48% 0.10 260)", background: "none", border: "none", cursor: "pointer", padding: "0.2rem 0.4rem", textDecoration: "underline" }}>
                  Rename
                </button>
              </>
            )}
          </div>

          {/* Row 1: Topic + Language */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr auto", gap: "1.5rem", alignItems: "start" }}>
            {/* Topic */}
            <div>
              <label style={labelStyle}>Current Topic</label>
              <select
                value={localTopic}
                onChange={e => handleTopicChange(e.target.value)}
                disabled={topicSaving}
                style={{ ...inputStyle, opacity: topicSaving ? 0.6 : 1 }}
              >
                <option value="">— Select a topic —</option>
                {PEER_TOPICS.map(t => (
                  <option key={t} value={t}>{t}</option>
                ))}
              </select>
              {!localTopic && (
                <p style={{ fontFamily: "var(--font-montserrat)", fontSize: "0.65rem", color: "oklch(65% 0.15 45)", marginTop: "0.375rem", fontWeight: 600 }}>
                  Set a topic to unlock inviting
                </p>
              )}
              {localTopic && TOPIC_COURSE_URL[localTopic] && (
                <Link
                  href={TOPIC_COURSE_URL[localTopic][localLang === "id" ? "id" : "en"]}
                  style={{ display: "inline-block", marginTop: "0.5rem", fontFamily: "var(--font-montserrat)", fontSize: "0.65rem", fontWeight: 700, letterSpacing: "0.06em", textTransform: "uppercase", color: "oklch(30% 0.12 260)", textDecoration: "none", borderBottom: "1px solid currentColor", paddingBottom: "1px" }}
                >
                  Open course →
                </Link>
              )}
            </div>

            {/* Language */}
            <div>
              <label style={labelStyle}>Language</label>
              <div style={{ display: "flex", gap: "0.375rem" }}>
                {(["en", "id", "nl"] as const).map(lang => (
                  <button
                    key={lang}
                    onClick={() => handleLangChange(lang)}
                    disabled={langSaving}
                    style={{
                      fontFamily: "var(--font-montserrat)",
                      fontSize: "0.62rem",
                      fontWeight: 700,
                      letterSpacing: "0.06em",
                      textTransform: "uppercase",
                      padding: "0.4rem 0.625rem",
                      border: "none",
                      cursor: langSaving ? "not-allowed" : "pointer",
                      background: localLang === lang ? "oklch(30% 0.12 260)" : "oklch(92% 0.005 80)",
                      color: localLang === lang ? "white" : "oklch(45% 0.008 260)",
                      transition: "all 0.15s",
                    }}
                  >
                    {lang.toUpperCase()}
                  </button>
                ))}
              </div>
              {langSaving && (
                <p style={{ fontFamily: "var(--font-montserrat)", fontSize: "0.6rem", color: "oklch(62% 0.008 260)", marginTop: "0.3rem" }}>Saving…</p>
              )}
            </div>
          </div>

          {/* Row 2: Open/Close toggle */}
          <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
            <button
              onClick={handleOpenToggle}
              disabled={openSaving}
              style={{
                fontFamily: "var(--font-montserrat)",
                fontSize: "0.62rem",
                fontWeight: 700,
                letterSpacing: "0.08em",
                textTransform: "uppercase",
                padding: "0.4rem 1rem",
                border: "1px solid",
                cursor: openSaving ? "not-allowed" : "pointer",
                borderColor: localOpen ? "oklch(55% 0.15 145)" : "oklch(65% 0.15 45)",
                background: "white",
                color: localOpen ? "oklch(42% 0.14 145)" : "oklch(52% 0.12 45)",
                transition: "all 0.15s",
              }}
            >
              {openSaving ? "Saving…" : localOpen ? "Close group to new members" : "Reopen group"}
            </button>
            <p style={{ fontFamily: "var(--font-montserrat)", fontSize: "0.7rem", color: "oklch(58% 0.008 260)" }}>
              {localOpen ? "Group is visible in worldwide search" : "Group is hidden from search"}
            </p>
          </div>

          {/* Row 3: Invite */}
          <div style={{ background: "oklch(97.5% 0.003 80)", padding: "1rem 1.25rem", display: "flex", alignItems: "center", gap: "1rem", flexWrap: "wrap" }}>
            {localTopic ? (
              <PeerInviteButton
                groupId={group.id}
                groupName={localName}
                topic={localTopic}
                initiatorName={initiatorName}
                language={(localLang as "en" | "id" | "nl") || "en"}
              />
            ) : (
              <p style={{ fontFamily: "var(--font-montserrat)", fontSize: "0.75rem", color: "oklch(65% 0.15 45)", fontWeight: 600, lineHeight: 1.5 }}>
                Set a topic to enable inviting.
              </p>
            )}
          </div>

          {/* Row 4: Members */}
          <div>
            <p style={labelStyle}>
              Members ({localMembers.length})
              {pendingMembers.length > 0 && (
                <span style={{ color: "oklch(65% 0.15 45)", marginLeft: "0.5rem", letterSpacing: "0.06em" }}>
                  · {pendingMembers.length} pending approval
                </span>
              )}
            </p>

            {localMembers.length === 0 ? (
              <p style={{ fontFamily: "var(--font-montserrat)", fontSize: "0.8rem", color: "oklch(58% 0.008 260)", paddingBlock: "0.5rem" }}>
                No members yet. Share the invite message to start.
              </p>
            ) : (
              <div style={{ display: "flex", flexDirection: "column", gap: "1px", background: "oklch(88% 0.008 80)" }}>
                {localMembers.map(member => (
                  <div key={member.id} style={{ background: member.status === "pending" ? "oklch(99% 0.01 50)" : "white" }}>
                    <div style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "0.875rem",
                      padding: "0.75rem 1rem",
                    }}>
                      {/* Avatar */}
                      <div style={{
                        width: "32px", height: "32px", flexShrink: 0,
                        background: member.status === "pending" ? "oklch(65% 0.15 45 / 0.15)" : "oklch(30% 0.12 260 / 0.1)",
                        display: "flex", alignItems: "center", justifyContent: "center",
                      }}>
                        <span style={{
                          fontFamily: "var(--font-montserrat)",
                          fontSize: "0.62rem",
                          fontWeight: 800,
                          color: member.status === "pending" ? "oklch(65% 0.15 45)" : "oklch(30% 0.12 260)",
                        }}>
                          {member.name[0]?.toUpperCase()}
                        </span>
                      </div>

                      {/* Name + status + progress */}
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ display: "flex", alignItems: "center", gap: "0.4rem" }}>
                          <p style={{
                            fontFamily: "var(--font-montserrat)",
                            fontWeight: 600,
                            fontSize: "0.8375rem",
                            color: "oklch(22% 0.005 260)",
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                            whiteSpace: "nowrap",
                          }}>
                            {member.name}
                          </p>
                          {member.isInitiator && (
                            <span style={{ fontFamily: "var(--font-montserrat)", fontSize: "0.55rem", fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", color: "oklch(42% 0.14 145)", flexShrink: 0 }}>
                              You
                            </span>
                          )}
                        </div>
                        {member.status === "pending" && (
                          <span style={{
                            fontFamily: "var(--font-montserrat)",
                            fontSize: "0.58rem",
                            fontWeight: 800,
                            letterSpacing: "0.1em",
                            textTransform: "uppercase",
                            color: "oklch(65% 0.15 45)",
                          }}>
                            Pending
                          </span>
                        )}
                        {member.status === "active" && member.completedModules !== undefined && totalModules > 0 && (
                          <div style={{ marginTop: "0.3rem" }}>
                            <div style={{ height: "3px", background: "oklch(88% 0.008 80)", borderRadius: "1.5px", overflow: "hidden" }}>
                              <div style={{ height: "100%", width: `${Math.min(100, Math.round(member.completedModules / totalModules * 100))}%`, background: "oklch(55% 0.15 145)", borderRadius: "1.5px" }} />
                            </div>
                            <p style={{ fontFamily: "var(--font-montserrat)", fontSize: "0.57rem", color: "oklch(58% 0.008 260)", marginTop: "0.15rem" }}>
                              {member.completedModules}/{totalModules} modules
                            </p>
                          </div>
                        )}
                      </div>

                      {/* Actions */}
                      <div style={{ display: "flex", gap: "0.5rem", alignItems: "center", flexShrink: 0 }}>
                        {member.status === "pending" && member.questionnaireAnswers && (
                          <button
                            onClick={() => setExpandedAnswersId(expandedAnswersId === member.id ? null : member.id)}
                            style={{
                              fontFamily: "var(--font-montserrat)",
                              fontSize: "0.58rem",
                              fontWeight: 700,
                              letterSpacing: "0.06em",
                              textTransform: "uppercase",
                              color: "oklch(48% 0.10 260)",
                              background: "none",
                              border: "none",
                              cursor: "pointer",
                              padding: "0.25rem 0.5rem",
                              textDecoration: "underline",
                            }}
                          >
                            {expandedAnswersId === member.id ? "Hide" : "Answers"}
                          </button>
                        )}
                        {member.status === "pending" && (
                          <button
                            onClick={() => handleApprove(member.id)}
                            disabled={approvingId === member.id}
                            style={{
                              fontFamily: "var(--font-montserrat)",
                              fontSize: "0.62rem",
                              fontWeight: 700,
                              letterSpacing: "0.06em",
                              textTransform: "uppercase",
                              padding: "0.3rem 0.75rem",
                              background: approvingId === member.id ? "oklch(72% 0.008 260)" : "oklch(42% 0.14 145)",
                              color: "white",
                              border: "none",
                              cursor: approvingId === member.id ? "not-allowed" : "pointer",
                              transition: "background 0.15s",
                            }}
                          >
                            {approvingId === member.id ? "…" : "Approve"}
                          </button>
                        )}
                        <button
                          onClick={() => handleRemove(member.id)}
                          disabled={removingId === member.id}
                          style={{
                            fontFamily: "var(--font-montserrat)",
                            fontSize: "0.58rem",
                            fontWeight: 700,
                            letterSpacing: "0.06em",
                            textTransform: "uppercase",
                            color: "oklch(58% 0.008 260)",
                            background: "none",
                            border: "none",
                            cursor: removingId === member.id ? "not-allowed" : "pointer",
                            padding: "0.25rem",
                            opacity: removingId === member.id ? 0.4 : 0.7,
                          }}
                        >
                          ✕
                        </button>
                      </div>
                    </div>

                    {/* Questionnaire answers */}
                    {expandedAnswersId === member.id && member.questionnaireAnswers && (
                      <div style={{
                        padding: "0.75rem 1rem 0.875rem",
                        background: "oklch(97% 0.005 80)",
                        borderTop: "1px solid oklch(90% 0.006 80)",
                        display: "flex",
                        flexDirection: "column",
                        gap: "0.5rem",
                      }}>
                        {[
                          { label: "Location", value: member.questionnaireAnswers.location },
                          { label: "Experience", value: member.questionnaireAnswers.experience },
                          { label: "Contribution", value: member.questionnaireAnswers.contribution },
                        ].map(({ label, value }) => (
                          <div key={label}>
                            <p style={{ fontFamily: "var(--font-montserrat)", fontSize: "0.6rem", fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: "oklch(58% 0.008 260)", marginBottom: "0.15rem" }}>
                              {label}
                            </p>
                            <p style={{ fontFamily: "var(--font-montserrat)", fontSize: "0.8rem", color: "oklch(28% 0.008 260)", lineHeight: 1.5 }}>
                              {value || "—"}
                            </p>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Row 5: Broadcast */}
          <div style={{ background: "oklch(97.5% 0.003 80)", padding: "1rem 1.25rem" }}>
            <p style={labelStyle}>Message Your Group</p>
            <form onSubmit={handleBroadcast} style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
              <textarea
                value={broadcastMsg}
                onChange={e => setBroadcastMsg(e.target.value)}
                placeholder="Send a message to all active members…"
                rows={3}
                maxLength={300}
                style={textareaStyle}
                required
              />
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: "0.75rem" }}>
                <button
                  type="button"
                  onClick={() => setBroadcastHistoryOpen(o => !o)}
                  style={{
                    fontFamily: "var(--font-montserrat)",
                    fontSize: "0.62rem",
                    fontWeight: 700,
                    letterSpacing: "0.06em",
                    textTransform: "uppercase",
                    background: "none",
                    border: "none",
                    cursor: "pointer",
                    color: "oklch(55% 0.008 260)",
                    padding: 0,
                    display: "flex",
                    alignItems: "center",
                    gap: "0.3rem",
                  }}
                >
                  {localBroadcasts.length > 0 ? `${localBroadcasts.length} sent` : "No messages yet"}
                  <span style={{ fontSize: "0.5rem", opacity: 0.6 }}>{broadcastHistoryOpen ? "▲" : "▼"}</span>
                </button>
                <button
                  type="submit"
                  disabled={broadcastSending || !broadcastMsg.trim()}
                  style={{
                    fontFamily: "var(--font-montserrat)",
                    fontWeight: 700,
                    fontSize: "0.68rem",
                    letterSpacing: "0.07em",
                    textTransform: "uppercase",
                    background: (broadcastSending || !broadcastMsg.trim()) ? "oklch(78% 0.08 45)" : "oklch(65% 0.15 45)",
                    color: "white",
                    border: "none",
                    padding: "0.5rem 1.125rem",
                    cursor: (broadcastSending || !broadcastMsg.trim()) ? "not-allowed" : "pointer",
                    transition: "background 0.15s",
                    whiteSpace: "nowrap",
                  }}
                >
                  {broadcastSending ? "Sending…" : "Send to Group →"}
                </button>
              </div>
              {broadcastResult && (
                <p style={{
                  fontFamily: "var(--font-montserrat)",
                  fontSize: "0.75rem",
                  color: broadcastResult.startsWith("Error") ? "oklch(45% 0.18 25)" : "oklch(40% 0.14 145)",
                  fontWeight: 500,
                }}>
                  {broadcastResult}
                </p>
              )}
            </form>

            {broadcastHistoryOpen && localBroadcasts.length > 0 && (
              <div style={{ marginTop: "0.875rem", display: "flex", flexDirection: "column", gap: "1px", background: "oklch(88% 0.008 80)" }}>
                {localBroadcasts.slice(0, 8).map(b => (
                  <div key={b.id} style={{ background: "white", padding: "0.5rem 0.75rem" }}>
                    <p style={{ fontFamily: "var(--font-montserrat)", fontSize: "0.62rem", color: "oklch(58% 0.008 260)", marginBottom: "0.15rem" }}>
                      {fmtDate(b.sent_at)}
                    </p>
                    <p style={{ fontFamily: "var(--font-montserrat)", fontSize: "0.78rem", color: "oklch(32% 0.008 260)", lineHeight: 1.5 }}>
                      {b.message}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Group details */}
          <p style={{ fontFamily: "var(--font-montserrat)", fontSize: "0.7rem", color: "oklch(58% 0.008 260)" }}>
            📍 {group.region} · 🕐 {group.timezone} · {LANG_LABELS[localLang] ?? localLang}
          </p>
        </div>
      )}
    </div>
  );
}

// ── JoinedGroupCard ────────────────────────────────────────────────────────

function JoinedGroupCard({ group, totalModules }: { group: JoinedGroup; totalModules: number }) {
  const [expanded, setExpanded] = useState(false);

  return (
    <div style={{ border: "1px solid oklch(86% 0.008 80)", background: "white" }}>
      <button
        onClick={() => setExpanded(o => !o)}
        style={{
          width: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "1.125rem 1.5rem",
          background: "white",
          border: "none",
          cursor: "pointer",
          textAlign: "left",
          gap: "1rem",
        }}
      >
        <div style={{ flex: 1, minWidth: 0 }}>
          <p style={{
            fontFamily: "var(--font-montserrat)",
            fontWeight: 700,
            fontSize: "0.9375rem",
            color: "oklch(22% 0.005 260)",
            lineHeight: 1.2,
            overflow: "hidden",
            textOverflow: "ellipsis",
            whiteSpace: "nowrap",
          }}>
            {group.name}
          </p>
          <p style={{
            fontFamily: "var(--font-montserrat)",
            fontSize: "0.7rem",
            color: "oklch(55% 0.008 260)",
            marginTop: "0.2rem",
          }}>
            {group.current_topic || "No topic set"} · {group.members.length} member{group.members.length !== 1 ? "s" : ""}
          </p>
        </div>
        <span style={{ fontFamily: "var(--font-montserrat)", fontSize: "0.7rem", color: "oklch(52% 0.008 260)" }}>
          {expanded ? "▲" : "▼"}
        </span>
      </button>

      {expanded && (
        <div style={{ padding: "1.25rem 1.5rem", borderTop: "1px solid oklch(88% 0.008 80)", display: "flex", flexDirection: "column", gap: "1rem" }}>
          <p style={{ fontFamily: "var(--font-montserrat)", fontSize: "0.7rem", color: "oklch(58% 0.008 260)" }}>
            📍 {group.region} · 🕐 {group.timezone} · {LANG_LABELS[group.language] ?? group.language}
          </p>
          {group.current_topic && TOPIC_COURSE_URL[group.current_topic] && (
            <Link
              href={TOPIC_COURSE_URL[group.current_topic][group.language === "id" ? "id" : "en"]}
              style={{ display: "inline-flex", alignItems: "center", gap: "0.5rem", padding: "0.625rem 1rem", background: "oklch(30% 0.12 260)", color: "white", fontFamily: "var(--font-montserrat)", fontSize: "0.72rem", fontWeight: 700, letterSpacing: "0.06em", textTransform: "uppercase", textDecoration: "none" }}
            >
              Start {group.current_topic} →
            </Link>
          )}
          {group.members.length > 0 && (
            <div>
              <p style={labelStyle}>Members</p>
              <div style={{ display: "flex", flexDirection: "column", gap: "1px", background: "oklch(88% 0.008 80)" }}>
                {group.members.map(member => (
                  <div key={member.id} style={{
                    background: "white",
                    display: "flex",
                    alignItems: "center",
                    gap: "0.75rem",
                    padding: "0.625rem 0.875rem",
                  }}>
                    <div style={{
                      width: "28px", height: "28px", flexShrink: 0,
                      background: "oklch(30% 0.12 260 / 0.08)",
                      display: "flex", alignItems: "center", justifyContent: "center",
                    }}>
                      <span style={{ fontFamily: "var(--font-montserrat)", fontSize: "0.58rem", fontWeight: 800, color: "oklch(30% 0.12 260)" }}>
                        {member.name[0]?.toUpperCase()}
                      </span>
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ display: "flex", alignItems: "center", gap: "0.4rem" }}>
                        <p style={{ fontFamily: "var(--font-montserrat)", fontSize: "0.8rem", color: "oklch(28% 0.008 260)", fontWeight: 500, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                          {member.name}
                        </p>
                        {member.isInitiator && (
                          <span style={{ fontFamily: "var(--font-montserrat)", fontSize: "0.55rem", fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", color: "oklch(42% 0.14 145)", flexShrink: 0 }}>
                            Leader
                          </span>
                        )}
                      </div>
                      {member.completedModules !== undefined && totalModules > 0 && (
                        <div style={{ marginTop: "0.3rem" }}>
                          <div style={{ height: "3px", background: "oklch(88% 0.008 80)", borderRadius: "1.5px", overflow: "hidden" }}>
                            <div style={{ height: "100%", width: `${Math.min(100, Math.round(member.completedModules / totalModules * 100))}%`, background: "oklch(55% 0.15 145)", borderRadius: "1.5px" }} />
                          </div>
                          <p style={{ fontFamily: "var(--font-montserrat)", fontSize: "0.57rem", color: "oklch(58% 0.008 260)", marginTop: "0.15rem" }}>
                            {member.completedModules}/{totalModules} modules
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

// ── JoinQuestionnaire ──────────────────────────────────────────────────────

function JoinQuestionnaire({
  group,
  onSuccess,
  onCancel,
}: {
  group: { id: string; name: string; current_topic: string | null };
  onSuccess: () => void;
  onCancel: () => void;
}) {
  const [location, setLocation] = useState("");
  const [experience, setExperience] = useState("");
  const [contribution, setContribution] = useState("");
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!location.trim() || !experience.trim() || !contribution.trim()) return;
    setError(null);
    startTransition(async () => {
      const result = await applyToJoinPeerGroup(group.id, {
        location: location.trim(),
        experience: experience.trim(),
        contribution: contribution.trim(),
      });
      if (result.error) {
        setError(result.error);
      } else {
        setSuccess(true);
        setTimeout(onSuccess, 1800);
      }
    });
  }

  if (success) {
    return (
      <div style={{ background: "oklch(42% 0.14 145 / 0.08)", border: "1px solid oklch(42% 0.14 145 / 0.25)", padding: "1.5rem", textAlign: "center" }}>
        <p style={{ fontFamily: "var(--font-montserrat)", fontWeight: 700, fontSize: "0.9rem", color: "oklch(35% 0.12 145)", marginBottom: "0.375rem" }}>
          Application submitted ✓
        </p>
        <p style={{ fontFamily: "var(--font-montserrat)", fontSize: "0.8rem", color: "oklch(42% 0.008 260)" }}>
          The group initiator will review your application. You&apos;ll be notified when approved.
        </p>
      </div>
    );
  }

  return (
    <div style={{ border: "1px solid oklch(86% 0.008 80)", background: "white", padding: "1.5rem" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "1.25rem" }}>
        <div>
          <p style={{
            fontFamily: "var(--font-montserrat)",
            fontSize: "0.6rem",
            fontWeight: 700,
            letterSpacing: "0.16em",
            textTransform: "uppercase",
            color: "oklch(65% 0.15 45)",
            marginBottom: "0.35rem",
          }}>
            Apply to Join
          </p>
          <p style={{
            fontFamily: "var(--font-montserrat)",
            fontWeight: 700,
            fontSize: "1rem",
            color: "oklch(22% 0.005 260)",
          }}>
            {group.name}
          </p>
          {group.current_topic && (
            <p style={{ fontFamily: "var(--font-montserrat)", fontSize: "0.75rem", color: "oklch(55% 0.008 260)", marginTop: "0.2rem" }}>
              Topic: {group.current_topic}
            </p>
          )}
        </div>
        <button
          onClick={onCancel}
          style={{ background: "none", border: "none", cursor: "pointer", color: "oklch(58% 0.008 260)", fontSize: "1.25rem", lineHeight: 1, padding: 0 }}
        >
          ×
        </button>
      </div>

      <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
        <div>
          <label style={labelStyle}>Your location / country</label>
          <input
            type="text"
            value={location}
            onChange={e => setLocation(e.target.value)}
            required
            maxLength={100}
            placeholder="e.g. Jakarta, Indonesia"
            style={inputStyle}
          />
        </div>
        <div>
          <label style={labelStyle}>Your leadership experience</label>
          <textarea
            value={experience}
            onChange={e => setExperience(e.target.value)}
            required
            maxLength={500}
            rows={3}
            placeholder="Brief description of your background and experience…"
            style={textareaStyle}
          />
        </div>
        <div>
          <label style={labelStyle}>What you hope to contribute or gain</label>
          <textarea
            value={contribution}
            onChange={e => setContribution(e.target.value)}
            required
            maxLength={500}
            rows={3}
            placeholder="What do you hope to bring to this group, and what are you looking for?…"
            style={textareaStyle}
          />
        </div>

        {error && (
          <p style={{ fontFamily: "var(--font-montserrat)", fontSize: "0.8rem", color: "oklch(45% 0.18 25)" }}>{error}</p>
        )}

        <div style={{ display: "flex", gap: "0.75rem", justifyContent: "flex-end" }}>
          <button
            type="button"
            onClick={onCancel}
            style={{
              fontFamily: "var(--font-montserrat)",
              fontSize: "0.68rem",
              fontWeight: 700,
              letterSpacing: "0.07em",
              textTransform: "uppercase",
              padding: "0.5rem 1rem",
              background: "none",
              border: "1px solid oklch(82% 0.008 80)",
              color: "oklch(52% 0.008 260)",
              cursor: "pointer",
            }}
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={pending}
            style={{
              fontFamily: "var(--font-montserrat)",
              fontWeight: 700,
              fontSize: "0.68rem",
              letterSpacing: "0.07em",
              textTransform: "uppercase",
              background: pending ? "oklch(55% 0.008 260)" : "oklch(30% 0.12 260)",
              color: "white",
              border: "none",
              padding: "0.5rem 1.25rem",
              cursor: pending ? "not-allowed" : "pointer",
              transition: "background 0.15s",
            }}
          >
            {pending ? "Submitting…" : "Submit Application →"}
          </button>
        </div>
      </form>
    </div>
  );
}

// ── PeerCoachSection ───────────────────────────────────────────────────────

function PeerCoachSection({ coachMessages }: { coachMessages: CoachMsg[] }) {
  const coachRef = useRef<HTMLFormElement>(null);
  const [coachHistoryOpen, setCoachHistoryOpen] = useState(false);
  const [coachState, coachAction, coachPending] = useActionState(
    async (_prev: CoachState, formData: FormData): Promise<CoachState> => {
      const result = await submitCoachMessage(formData);
      if (result?.success) coachRef.current?.reset();
      return result ?? null;
    },
    null,
  );

  const tStyle: React.CSSProperties = {
    width: "100%",
    boxSizing: "border-box",
    fontFamily: "var(--font-montserrat)",
    fontSize: "0.825rem",
    color: "oklch(22% 0.005 260)",
    background: "oklch(99% 0.002 80)",
    border: "1px solid oklch(84% 0.008 80)",
    padding: "0.625rem 0.75rem",
    resize: "vertical" as const,
    lineHeight: 1.6,
  };

  return (
    <div style={{ background: "oklch(99% 0.002 80)", overflow: "hidden" }}>
      <div style={{ background: "oklch(30% 0.12 260)", padding: "1.375rem 1.5rem 1.25rem" }}>
        <p style={{
          fontFamily: "var(--font-montserrat)",
          fontSize: "0.55rem",
          fontWeight: 800,
          letterSpacing: "0.22em",
          textTransform: "uppercase",
          color: "oklch(80% 0.06 60)",
          marginBottom: "0.5rem",
          opacity: 0.85,
        }}>
          Direct Line
        </p>
        <p style={{ fontFamily: "var(--font-montserrat)", fontWeight: 800, fontSize: "1rem", color: "white", letterSpacing: "-0.01em", lineHeight: 1.2 }}>
          Talk to the Coach
        </p>
      </div>

      <div style={{ padding: "1.25rem 1.5rem 1.5rem" }}>
        <form ref={coachRef} action={coachAction} style={{ display: "flex", flexDirection: "column", gap: "0.875rem" }}>
          <input type="hidden" name="message_type" value="peer" />
          <textarea
            name="message"
            required
            rows={3}
            maxLength={2000}
            placeholder="Ask the coach a question about your peer group or leadership…"
            className="dashboard-textarea"
            style={tStyle}
          />
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: "0.75rem" }}>
            <button
              type="button"
              onClick={() => setCoachHistoryOpen(o => !o)}
              style={{
                fontFamily: "var(--font-montserrat)",
                fontSize: "0.62rem",
                fontWeight: 700,
                letterSpacing: "0.06em",
                textTransform: "uppercase",
                background: "none",
                border: "none",
                cursor: "pointer",
                color: "oklch(55% 0.008 260)",
                padding: 0,
                display: "flex",
                alignItems: "center",
                gap: "0.3rem",
              }}
            >
              {coachMessages.length > 0 ? `${coachMessages.length} message${coachMessages.length !== 1 ? "s" : ""}` : "No messages yet"}
              <span style={{ fontSize: "0.5rem", opacity: 0.6 }}>{coachHistoryOpen ? "▲" : "▼"}</span>
            </button>
            <button
              type="submit"
              disabled={coachPending}
              style={{
                fontFamily: "var(--font-montserrat)",
                fontWeight: 700,
                fontSize: "0.68rem",
                letterSpacing: "0.07em",
                textTransform: "uppercase",
                background: coachPending ? "oklch(45% 0.10 260)" : "oklch(30% 0.12 260)",
                color: "white",
                border: "none",
                padding: "0.5rem 1.125rem",
                cursor: coachPending ? "not-allowed" : "pointer",
                transition: "background 0.15s",
                whiteSpace: "nowrap",
              }}
            >
              {coachPending ? "Sending…" : "Send to Coach →"}
            </button>
          </div>
          {coachState?.success && (
            <p style={{ fontFamily: "var(--font-montserrat)", fontSize: "0.75rem", color: "oklch(40% 0.14 145)", fontWeight: 500 }}>Sent ✓</p>
          )}
          {coachState?.error && (
            <p style={{ fontFamily: "var(--font-montserrat)", fontSize: "0.75rem", color: "oklch(45% 0.18 25)" }}>{coachState.error}</p>
          )}
        </form>

        {coachHistoryOpen && coachMessages.length > 0 && (
          <div style={{ marginTop: "1rem", display: "flex", flexDirection: "column", gap: "1px", background: "oklch(88% 0.008 80)" }}>
            {coachMessages.slice(0, 6).map(msg => (
              <div key={msg.id} style={{ background: "oklch(97.5% 0.003 80)", padding: "0.625rem 0.875rem" }}>
                <p style={{ fontFamily: "var(--font-montserrat)", fontSize: "0.65rem", color: "oklch(58% 0.008 260)", marginBottom: "0.2rem" }}>
                  {fmtDate(msg.created_at)}
                </p>
                <p style={{ fontFamily: "var(--font-montserrat)", fontSize: "0.8rem", color: "oklch(32% 0.008 260)", lineHeight: 1.5 }}>
                  {msg.message}
                </p>
                {msg.reply ? (
                  <p style={{ fontFamily: "var(--font-montserrat)", fontSize: "0.75rem", color: "oklch(35% 0.10 145)", marginTop: "0.375rem", paddingTop: "0.375rem", borderTop: "1px solid oklch(88% 0.008 80)" }}>
                    ↳ {msg.reply}
                  </p>
                ) : (
                  <p style={{ fontFamily: "var(--font-montserrat)", fontSize: "0.65rem", color: "oklch(62% 0.008 260)", marginTop: "0.2rem", fontStyle: "italic" }}>
                    Awaiting reply
                  </p>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

// ── Timezone helpers ───────────────────────────────────────────────────────

function parseUtcOffset(tz: string): number | null {
  const match = tz.match(/UTC([+-])(\d+(?:\.\d+)?)/);
  if (!match) return null;
  return (match[1] === "+" ? 1 : -1) * parseFloat(match[2]);
}

function getUserUtcOffset(): number {
  return -new Date().getTimezoneOffset() / 60;
}

// ── GroupSearchPanel ───────────────────────────────────────────────────────

function GroupSearchPanel({ initialJoinGroup, userTimezone }: {
  initialJoinGroup: { id: string; name: string; current_topic: string | null } | null;
  userTimezone: string | null;
}) {
  type SearchGroup = { id: string; name: string; region: string; current_topic: string | null; language: string; memberCount: number };

  const [searchResults, setSearchResults] = useState<SearchGroup[] | null>(null);
  const [searchLoading, startSearchTransition] = useTransition();
  const [searchError, setSearchError] = useState<string | null>(null);
  const [joiningGroup, setJoiningGroup] = useState<{ id: string; name: string; current_topic: string | null } | null>(initialJoinGroup ?? null);
  const [appliedIds, setAppliedIds] = useState<Set<string>>(new Set());

  function handleSearch() {
    setSearchError(null);
    startSearchTransition(async () => {
      const result = await getOpenPeerGroups();
      if (result.error) {
        setSearchError(result.error);
      } else {
        setSearchResults(result.groups);
      }
    });
  }

  return (
    <div>
      {/* Section header */}
      <div style={{ display: "flex", alignItems: "center", gap: "1rem", marginBottom: "1.25rem", flexWrap: "wrap" }}>
        <div>
          <p style={{
            fontFamily: "var(--font-montserrat)",
            fontSize: "0.6rem",
            fontWeight: 700,
            letterSpacing: "0.18em",
            textTransform: "uppercase",
            color: "oklch(65% 0.15 45)",
            marginBottom: "0.375rem",
          }}>
            Worldwide
          </p>
          <h3 style={{
            fontFamily: "var(--font-montserrat)",
            fontWeight: 700,
            fontSize: "1.25rem",
            color: "oklch(22% 0.005 260)",
            lineHeight: 1.2,
          }}>
            Find a Peer Group
          </h3>
        </div>
        {!searchResults && (
          <button
            onClick={handleSearch}
            disabled={searchLoading}
            style={{
              fontFamily: "var(--font-montserrat)",
              fontSize: "0.68rem",
              fontWeight: 700,
              letterSpacing: "0.08em",
              textTransform: "uppercase",
              padding: "0.55rem 1.25rem",
              background: searchLoading ? "oklch(65% 0.15 45 / 0.5)" : "oklch(65% 0.15 45)",
              color: "white",
              border: "none",
              cursor: searchLoading ? "not-allowed" : "pointer",
              transition: "background 0.15s",
            }}
          >
            {searchLoading ? "Searching…" : "Browse Open Groups →"}
          </button>
        )}
      </div>

      {/* Join questionnaire */}
      {joiningGroup && (
        <div style={{ marginBottom: "1.5rem" }}>
          <JoinQuestionnaire
            group={joiningGroup}
            onSuccess={() => {
              setAppliedIds(prev => new Set([...prev, joiningGroup.id]));
              setJoiningGroup(null);
            }}
            onCancel={() => setJoiningGroup(null)}
          />
        </div>
      )}

      {searchError && (
        <p style={{ fontFamily: "var(--font-montserrat)", fontSize: "0.8rem", color: "oklch(45% 0.18 25)", marginBottom: "1rem" }}>
          {searchError}
        </p>
      )}

      {searchResults !== null && (
        <>
          {searchResults.length === 0 ? (
            <p style={{ fontFamily: "var(--font-montserrat)", fontSize: "0.875rem", color: "oklch(55% 0.008 260)", paddingBlock: "1rem" }}>
              No open peer groups found at the moment.
            </p>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: "1px", background: "oklch(86% 0.008 80)" }}>
              {[...searchResults]
                .sort((a, b) => {
                  // Sort "near you" groups first
                  const userOffset = userTimezone ? parseUtcOffset(userTimezone) : getUserUtcOffset();
                  const aOffset = parseUtcOffset(a.region);
                  const bOffset = parseUtcOffset(b.region);
                  if (userOffset === null) return 0;
                  const aDist = aOffset !== null ? Math.abs(aOffset - userOffset) : 99;
                  const bDist = bOffset !== null ? Math.abs(bOffset - userOffset) : 99;
                  return aDist - bDist;
                })
                .map(group => {
                const applied = appliedIds.has(group.id);
                const userOffset = userTimezone ? parseUtcOffset(userTimezone) : getUserUtcOffset();
                const groupOffset = parseUtcOffset(group.region);
                const isNearby = userOffset !== null && groupOffset !== null && Math.abs(groupOffset - userOffset) <= 1;
                return (
                  <div key={group.id} style={{
                    background: "white",
                    padding: "1rem 1.25rem",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    gap: "1rem",
                    flexWrap: "wrap",
                  }}>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "0.2rem", flexWrap: "wrap" }}>
                        <p style={{ fontFamily: "var(--font-montserrat)", fontWeight: 700, fontSize: "0.9rem", color: "oklch(22% 0.005 260)" }}>
                          {group.name}
                        </p>
                        {isNearby && (
                          <span style={{
                            fontFamily: "var(--font-montserrat)",
                            fontSize: "0.55rem",
                            fontWeight: 700,
                            letterSpacing: "0.1em",
                            textTransform: "uppercase",
                            padding: "0.15rem 0.45rem",
                            background: "oklch(42% 0.14 145 / 0.12)",
                            color: "oklch(38% 0.12 145)",
                          }}>
                            Near you
                          </span>
                        )}
                      </div>
                      <p style={{ fontFamily: "var(--font-montserrat)", fontSize: "0.7rem", color: "oklch(55% 0.008 260)" }}>
                        {group.current_topic || "No topic"} · {group.region} · {group.memberCount} member{group.memberCount !== 1 ? "s" : ""} · {LANG_LABELS[group.language] ?? group.language}
                      </p>
                    </div>
                    {applied ? (
                      <span style={{
                        fontFamily: "var(--font-montserrat)",
                        fontSize: "0.62rem",
                        fontWeight: 700,
                        color: "oklch(42% 0.14 145)",
                        letterSpacing: "0.06em",
                        textTransform: "uppercase",
                      }}>
                        Applied ✓
                      </span>
                    ) : (
                      <button
                        onClick={() => setJoiningGroup({ id: group.id, name: group.name, current_topic: group.current_topic })}
                        style={{
                          fontFamily: "var(--font-montserrat)",
                          fontSize: "0.62rem",
                          fontWeight: 700,
                          letterSpacing: "0.08em",
                          textTransform: "uppercase",
                          padding: "0.4rem 0.875rem",
                          border: "1px solid oklch(30% 0.12 260)",
                          background: "white",
                          color: "oklch(30% 0.12 260)",
                          cursor: "pointer",
                          flexShrink: 0,
                        }}
                      >
                        Apply to Join
                      </button>
                    )}
                  </div>
                );
              })}
            </div>
          )}
          <button
            onClick={handleSearch}
            disabled={searchLoading}
            style={{
              fontFamily: "var(--font-montserrat)",
              fontSize: "0.6rem",
              fontWeight: 700,
              letterSpacing: "0.06em",
              textTransform: "uppercase",
              background: "none",
              border: "none",
              cursor: "pointer",
              color: "oklch(55% 0.008 260)",
              padding: "0.625rem 0",
              marginTop: "0.5rem",
            }}
          >
            {searchLoading ? "Refreshing…" : "↻ Refresh"}
          </button>
        </>
      )}
    </div>
  );
}

// ── Main export ────────────────────────────────────────────────────────────

export default function PeerGroupsSection({
  initiatedGroups,
  joinedGroups,
  coachMessages,
  initiatorName,
  joinGroup,
  userTimezone,
  totalModules = 0,
}: {
  initiatedGroups: InitiatedGroup[];
  joinedGroups: JoinedGroup[];
  coachMessages: CoachMsg[];
  initiatorName: string;
  joinGroup: { id: string; name: string; current_topic: string | null } | null;
  userTimezone: string | null;
  totalModules?: number;
}) {
  const hasInitiated = initiatedGroups.length > 0;
  const hasJoined = joinedGroups.length > 0;

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "3rem" }}>

      {/* ── Initiated Groups ── */}
      {hasInitiated && (
        <section>
          <div style={{ marginBottom: "1.25rem" }}>
            <p style={{
              fontFamily: "var(--font-montserrat)",
              fontSize: "0.6rem",
              fontWeight: 700,
              letterSpacing: "0.18em",
              textTransform: "uppercase",
              color: "oklch(65% 0.15 45)",
              marginBottom: "0.375rem",
            }}>
              Initiator
            </p>
            <h2 style={{
              fontFamily: "var(--font-montserrat)",
              fontWeight: 800,
              fontSize: "1.625rem",
              color: "oklch(22% 0.005 260)",
              lineHeight: 1.2,
            }}>
              Your Groups
            </h2>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: "1px", background: "oklch(86% 0.008 80)" }}>
            {initiatedGroups.map(group => (
              <InitiatedGroupCard key={group.id} group={group} initiatorName={initiatorName} totalModules={totalModules} />
            ))}
          </div>
        </section>
      )}

      {/* ── Joined Groups ── */}
      {hasJoined && (
        <section>
          <div style={{ marginBottom: "1.25rem" }}>
            <p style={{
              fontFamily: "var(--font-montserrat)",
              fontSize: "0.6rem",
              fontWeight: 700,
              letterSpacing: "0.18em",
              textTransform: "uppercase",
              color: "oklch(65% 0.15 45)",
              marginBottom: "0.375rem",
            }}>
              Member
            </p>
            <h2 style={{
              fontFamily: "var(--font-montserrat)",
              fontWeight: 800,
              fontSize: "1.625rem",
              color: "oklch(22% 0.005 260)",
              lineHeight: 1.2,
            }}>
              Groups You&apos;ve Joined
            </h2>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: "1px", background: "oklch(86% 0.008 80)" }}>
            {joinedGroups.map(group => (
              <JoinedGroupCard key={group.id} group={group} totalModules={totalModules} />
            ))}
          </div>
        </section>
      )}

      {/* ── Find a Group ── */}
      <section>
        <GroupSearchPanel initialJoinGroup={joinGroup} userTimezone={userTimezone} />
      </section>

      {/* ── Talk to the Coach ── */}
      <section>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "1px", background: "oklch(86% 0.008 80)" }}>
          <PeerCoachSection coachMessages={coachMessages} />
        </div>
      </section>

    </div>
  );
}

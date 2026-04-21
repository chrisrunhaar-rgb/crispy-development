"use client";

import { useState, useTransition } from "react";
import {
  updateTeamMemberProfile,
  removeTeamMember,
} from "@/app/(app)/dashboard/team-actions";
import { generateInviteAndGetUrl } from "@/app/(app)/dashboard/actions";

export type RosterMember = {
  id: string;
  name: string;
  email: string;
  title: string | null;
  tenureLabel: string | null;
};

type Lang = "en" | "id" | "nl";

const SHARE_COPY: Record<Lang, (teamName: string, url: string) => { title: string; text: string; whatsapp: string }> = {
  en: (teamName, url) => ({
    title: `Join ${teamName} on Crispy Development`,
    text: `Your leader has a seat for you.\n\n${teamName} is building something — Crispy Development is where cross-cultural leaders grow. Your team is ready and waiting.\n\n👉 ${url}`,
    whatsapp: encodeURIComponent(`Your leader has a seat for you.\n\n${teamName} is building something — Crispy Development is where cross-cultural leaders grow. Your team is ready and waiting.\n\n👉 ${url}`),
  }),
  id: (teamName, url) => ({
    title: `Bergabunglah dengan ${teamName} di Crispy Development`,
    text: `Pemimpinmu sudah menyiapkan tempat untukmu.\n\n${teamName} sedang membangun sesuatu — Crispy Development adalah tempat pemimpin lintas budaya bertumbuh. Timmu sudah menunggu.\n\n👉 ${url}`,
    whatsapp: encodeURIComponent(`Pemimpinmu sudah menyiapkan tempat untukmu.\n\n${teamName} sedang membangun sesuatu — Crispy Development adalah tempat pemimpin lintas budaya bertumbuh. Timmu sudah menunggu.\n\n👉 ${url}`),
  }),
  nl: (teamName, url) => ({
    title: `Sluit je aan bij ${teamName} op Crispy Development`,
    text: `Je leider heeft een plek voor jou.\n\n${teamName} bouwt aan iets — Crispy Development is het platform voor interculturele leiders. Je team staat klaar.\n\n👉 ${url}`,
    whatsapp: encodeURIComponent(`Je leider heeft een plek voor jou.\n\n${teamName} bouwt aan iets — Crispy Development is het platform voor interculturele leiders. Je team staat klaar.\n\n👉 ${url}`),
  }),
};

export default function TeamRoster({
  teamId,
  teamName,
  leaderName,
  members: initialMembers,
  isLeader,
  language = "en",
}: {
  teamId: string;
  teamName: string;
  leaderName?: string;
  members: RosterMember[];
  isLeader: boolean;
  language?: Lang;
}) {
  const [members, setMembers] = useState<RosterMember[]>(initialMembers);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editTitle, setEditTitle] = useState("");
  const [editTenure, setEditTenure] = useState("");
  const [inviteStatus, setInviteStatus] = useState<"idle" | "loading">("idle");
  const [invitePopup, setInvitePopup] = useState<{ url: string; text: string; whatsapp: string; title: string } | null>(null);
  const [copied, setCopied] = useState<"link" | "text" | null>(null);
  const [isPending, startTransition] = useTransition();

  // ── Invite member ──
  async function handleInvite() {
    setInviteStatus("loading");
    const { url, error } = await generateInviteAndGetUrl();
    if (error || !url) {
      setInviteStatus("idle");
      alert(error ?? "Could not generate invite link.");
      return;
    }
    const copy = SHARE_COPY[language](teamName, url);

    if (typeof navigator !== "undefined" && navigator.share && navigator.canShare?.({ title: copy.title, text: copy.text, url })) {
      try {
        await navigator.share({ title: copy.title, text: copy.text, url });
        setInviteStatus("idle");
        return;
      } catch {
        // cancelled — fall through to popup
      }
    }

    setInvitePopup({ url, text: copy.text, whatsapp: copy.whatsapp, title: copy.title });
    setInviteStatus("idle");
  }

  async function copyToClipboard(type: "link" | "text") {
    const value = type === "link" ? invitePopup?.url ?? "" : invitePopup?.text ?? "";
    try {
      await navigator.clipboard.writeText(value);
      setCopied(type);
      setTimeout(() => setCopied(null), 2000);
    } catch { /* ignore */ }
  }

  function startEdit(m: RosterMember) {
    setEditingId(m.id);
    setEditTitle(m.title ?? "");
    setEditTenure(m.tenureLabel ?? "");
  }

  function cancelEdit() {
    setEditingId(null);
    setEditTitle("");
    setEditTenure("");
  }

  function saveEdit(memberId: string) {
    startTransition(async () => {
      const result = await updateTeamMemberProfile(teamId, memberId, editTitle, editTenure);
      if (!result.error) {
        setMembers(prev =>
          prev.map(m => m.id === memberId
            ? { ...m, title: editTitle || null, tenureLabel: editTenure || null }
            : m
          )
        );
        setEditingId(null);
      }
    });
  }

  function handleRemove(memberId: string, name: string) {
    if (!confirm(`Remove ${name} from the team?`)) return;
    startTransition(async () => {
      const result = await removeTeamMember(teamId, memberId);
      if (!result.error) {
        setMembers(prev => prev.filter(m => m.id !== memberId));
      }
    });
  }

  const totalCount = (leaderName ? 1 : 0) + members.length;

  return (
    <div style={{ border: "1px solid oklch(86% 0.008 80)", overflow: "hidden" }}>

      {/* ── Navy header: section info + captain card ── */}
      <div style={{ background: "oklch(30% 0.12 260)" }}>

        {/* Top row: overline, team name, invite button */}
        <div style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-start",
          gap: "1rem",
          padding: "1.75rem 1.75rem 1.25rem",
          flexWrap: "wrap",
        }}>
          <div>
            <p style={{
              fontFamily: "var(--font-montserrat)",
              fontSize: "0.72rem",
              fontWeight: 800,
              letterSpacing: "0.2em",
              textTransform: "uppercase",
              color: "oklch(65% 0.15 45)",
              marginBottom: "0.625rem",
            }}>
              Your Team
            </p>
            <h3 style={{
              fontFamily: "var(--font-montserrat)",
              fontWeight: 800,
              fontSize: "1.625rem",
              color: "oklch(97% 0.005 80)",
              letterSpacing: "-0.02em",
              lineHeight: 1.1,
              marginBottom: "0.375rem",
            }}>
              {teamName}
            </h3>
            <p style={{
              fontFamily: "var(--font-cormorant)",
              fontStyle: "italic",
              fontSize: "0.9rem",
              color: "oklch(66% 0.04 260)",
              lineHeight: 1.4,
            }}>
              {totalCount} {totalCount === 1 ? "person" : "people"}
            </p>
          </div>

          {isLeader && (
            <button
              type="button"
              onClick={handleInvite}
              disabled={inviteStatus === "loading"}
              style={{
                fontFamily: "var(--font-montserrat)",
                fontSize: "0.6rem",
                fontWeight: 700,
                letterSpacing: "0.08em",
                textTransform: "uppercase",
                background: inviteStatus === "loading" ? "oklch(75% 0.10 45)" : "oklch(65% 0.15 45)",
                color: "white",
                border: "none",
                padding: "0.5rem 1rem",
                cursor: inviteStatus === "loading" ? "wait" : "pointer",
                transition: "background 0.15s",
                flexShrink: 0,
              }}
            >
              {inviteStatus === "loading" ? "Generating…" : "+ Invite Member"}
            </button>
          )}
        </div>

      </div>

      {/* ── Member rows ── */}
      {members.length === 0 ? (
        <div style={{
          padding: "2rem 1.75rem",
          background: "oklch(99% 0.002 80)",
        }}>
          <p style={{
            fontFamily: "var(--font-montserrat)",
            fontSize: "0.875rem",
            color: "oklch(38% 0.008 260)",
            fontWeight: 600,
            lineHeight: 1.4,
            marginBottom: "0.375rem",
          }}>
            Your team is just you for now.
          </p>
          {isLeader && (
            <p style={{
              fontFamily: "var(--font-montserrat)",
              fontSize: "0.775rem",
              color: "oklch(58% 0.008 260)",
              lineHeight: 1.5,
            }}>
              Use + Invite Member above to bring someone in.
            </p>
          )}
        </div>
      ) : (
          <div>
            {/* Leader row — always first, read-only */}
            {leaderName && (
              <div style={{ borderTop: "1px solid oklch(90% 0.006 80)" }}>
                <div style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "0.875rem",
                  padding: "0.875rem 1.5rem",
                  background: "oklch(99% 0.006 50)",
                }}>
                  <div style={{
                    width: "36px",
                    height: "36px",
                    flexShrink: 0,
                    background: "oklch(65% 0.15 45)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}>
                    <span style={{
                      fontFamily: "var(--font-montserrat)",
                      fontSize: "0.78rem",
                      fontWeight: 800,
                      color: "white",
                    }}>
                      {leaderName[0]?.toUpperCase()}
                    </span>
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <p style={{
                      fontFamily: "var(--font-montserrat)",
                      fontWeight: 700,
                      fontSize: "0.875rem",
                      color: "oklch(22% 0.005 260)",
                      lineHeight: 1.3,
                    }}>
                      {leaderName}
                    </p>
                    <p style={{
                      fontFamily: "var(--font-montserrat)",
                      fontSize: "0.6rem",
                      fontWeight: 700,
                      letterSpacing: "0.1em",
                      textTransform: "uppercase",
                      color: "oklch(65% 0.15 45)",
                      marginTop: "0.15rem",
                    }}>
                      Team Leader
                    </p>
                  </div>
                </div>
              </div>
            )}

            {members.map((member) => {
              const isEditing = editingId === member.id;
              const initial = member.name[0]?.toUpperCase() ?? "?";

              return (
                <div
                  key={member.id}
                  style={{ borderTop: "1px solid oklch(90% 0.006 80)" }}
                >
                  {/* Main member row */}
                  <div style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "0.875rem",
                    padding: "0.875rem 1.5rem",
                    background: isEditing ? "oklch(97% 0.003 80)" : "oklch(99% 0.002 80)",
                    transition: "background 0.15s",
                  }}>
                    {/* Avatar */}
                    <div style={{
                      width: "36px",
                      height: "36px",
                      flexShrink: 0,
                      background: "oklch(90% 0.007 260)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}>
                      <span style={{
                        fontFamily: "var(--font-montserrat)",
                        fontSize: "0.78rem",
                        fontWeight: 700,
                        color: "oklch(38% 0.008 260)",
                      }}>
                        {initial}
                      </span>
                    </div>

                    {/* Name + details */}
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <p style={{
                        fontFamily: "var(--font-montserrat)",
                        fontWeight: 600,
                        fontSize: "0.875rem",
                        color: "oklch(22% 0.005 260)",
                        whiteSpace: "nowrap",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        lineHeight: 1.3,
                      }}>
                        {member.name}
                      </p>
                      {(member.title || member.tenureLabel) ? (
                        <div style={{
                          display: "flex",
                          gap: "0.5rem",
                          alignItems: "baseline",
                          marginTop: "0.2rem",
                          flexWrap: "wrap",
                        }}>
                          {member.title && (
                            <span style={{
                              fontFamily: "var(--font-montserrat)",
                              fontSize: "0.72rem",
                              color: "oklch(42% 0.008 260)",
                              fontWeight: 500,
                            }}>
                              {member.title}
                            </span>
                          )}
                          {member.title && member.tenureLabel && (
                            <span style={{ color: "oklch(72% 0.006 80)", fontSize: "0.65rem" }}>·</span>
                          )}
                          {member.tenureLabel && (
                            <span style={{
                              fontFamily: "var(--font-montserrat)",
                              fontSize: "0.68rem",
                              color: "oklch(58% 0.008 260)",
                              fontStyle: "italic",
                            }}>
                              {member.tenureLabel}
                            </span>
                          )}
                        </div>
                      ) : isLeader ? (
                        <p style={{
                          fontFamily: "var(--font-montserrat)",
                          fontSize: "0.68rem",
                          color: "oklch(72% 0.005 80)",
                          fontStyle: "italic",
                          marginTop: "0.15rem",
                        }}>
                          No details yet
                        </p>
                      ) : null}
                    </div>

                    {/* Leader action buttons */}
                    {isLeader && !isEditing && (
                      <div style={{ display: "flex", gap: "0.375rem", flexShrink: 0 }}>
                        <button
                          type="button"
                          onClick={() => startEdit(member)}
                          title="Edit details"
                          style={{
                            background: "none",
                            border: "1px solid oklch(86% 0.008 80)",
                            padding: "0.3rem 0.5rem",
                            cursor: "pointer",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            transition: "border-color 0.15s",
                          }}
                        >
                          <svg viewBox="0 0 16 16" fill="none" stroke="oklch(52% 0.008 260)" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" style={{ width: "13px", height: "13px" }}>
                            <path d="M11.5 2.5a1.414 1.414 0 012 2L5 13H2v-3L11.5 2.5z" />
                          </svg>
                        </button>
                        <button
                          type="button"
                          onClick={() => handleRemove(member.id, member.name)}
                          title="Remove from team"
                          disabled={isPending}
                          style={{
                            background: "none",
                            border: "1px solid oklch(86% 0.008 80)",
                            padding: "0.3rem 0.5rem",
                            cursor: isPending ? "wait" : "pointer",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            transition: "border-color 0.15s",
                          }}
                        >
                          <svg viewBox="0 0 16 16" fill="none" stroke="oklch(52% 0.12 25)" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" style={{ width: "13px", height: "13px" }}>
                            <path d="M4 4l8 8M12 4l-8 8" />
                          </svg>
                        </button>
                      </div>
                    )}
                  </div>

                  {/* Inline edit form */}
                  {isEditing && (
                    <div className="edit-panel-reveal" style={{
                      padding: "1rem 1.5rem 1.25rem",
                      background: "oklch(97% 0.003 80)",
                      borderTop: "1px solid oklch(88% 0.008 80)",
                      display: "flex",
                      flexDirection: "column",
                      gap: "0.75rem",
                    }}>
                      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.75rem" }}>
                        <div>
                          <label style={{
                            display: "block",
                            fontFamily: "var(--font-montserrat)",
                            fontSize: "0.55rem",
                            fontWeight: 700,
                            letterSpacing: "0.12em",
                            textTransform: "uppercase",
                            color: "oklch(50% 0.008 260)",
                            marginBottom: "0.35rem",
                          }}>
                            Role / Title
                          </label>
                          <input
                            type="text"
                            value={editTitle}
                            onChange={e => setEditTitle(e.target.value)}
                            placeholder="e.g. Project Manager"
                            maxLength={80}
                            className="dashboard-input"
                            style={{
                              fontFamily: "var(--font-montserrat)",
                              fontSize: "0.8rem",
                              color: "oklch(22% 0.005 260)",
                              background: "oklch(99.5% 0.001 80)",
                              border: "1px solid oklch(82% 0.008 80)",
                              padding: "0.5rem 0.625rem",
                              width: "100%",
                              boxSizing: "border-box",
                            }}
                          />
                        </div>
                        <div>
                          <label style={{
                            display: "block",
                            fontFamily: "var(--font-montserrat)",
                            fontSize: "0.55rem",
                            fontWeight: 700,
                            letterSpacing: "0.12em",
                            textTransform: "uppercase",
                            color: "oklch(50% 0.008 260)",
                            marginBottom: "0.35rem",
                          }}>
                            Additional Comment
                          </label>
                          <input
                            type="text"
                            value={editTenure}
                            onChange={e => setEditTenure(e.target.value)}
                            placeholder="e.g. Jakarta, joined 2023"
                            maxLength={120}
                            className="dashboard-input"
                            style={{
                              fontFamily: "var(--font-montserrat)",
                              fontSize: "0.8rem",
                              color: "oklch(22% 0.005 260)",
                              background: "oklch(99.5% 0.001 80)",
                              border: "1px solid oklch(82% 0.008 80)",
                              padding: "0.5rem 0.625rem",
                              width: "100%",
                              boxSizing: "border-box",
                            }}
                          />
                        </div>
                      </div>
                      <div style={{ display: "flex", gap: "0.5rem" }}>
                        <button
                          type="button"
                          onClick={() => saveEdit(member.id)}
                          disabled={isPending}
                          style={{
                            fontFamily: "var(--font-montserrat)",
                            fontSize: "0.6rem",
                            fontWeight: 700,
                            letterSpacing: "0.08em",
                            textTransform: "uppercase",
                            background: isPending ? "oklch(75% 0.09 45)" : "oklch(65% 0.15 45)",
                            color: "white",
                            border: "none",
                            padding: "0.4rem 0.875rem",
                            cursor: isPending ? "wait" : "pointer",
                            transition: "background 0.15s",
                          }}
                        >
                          {isPending ? "Saving…" : "Save"}
                        </button>
                        <button
                          type="button"
                          onClick={cancelEdit}
                          style={{
                            fontFamily: "var(--font-montserrat)",
                            fontSize: "0.6rem",
                            fontWeight: 700,
                            letterSpacing: "0.08em",
                            textTransform: "uppercase",
                            background: "transparent",
                            color: "oklch(52% 0.008 260)",
                            border: "1px solid oklch(84% 0.008 80)",
                            padding: "0.4rem 0.875rem",
                            cursor: "pointer",
                          }}
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}

      {/* ── Invite popup overlay ── */}
      {invitePopup && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            background: "oklch(10% 0.008 260 / 0.62)",
            zIndex: 200,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "1.5rem",
          }}
          onClick={() => setInvitePopup(null)}
        >
          <div
            onClick={e => e.stopPropagation()}
            style={{
              background: "oklch(99% 0.002 80)",
              maxWidth: "480px",
              width: "100%",
              overflow: "hidden",
            }}
          >
            {/* Popup header — navy */}
            <div style={{
              background: "oklch(30% 0.12 260)",
              padding: "1.25rem 1.5rem",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "flex-start",
              gap: "1rem",
            }}>
              <div>
                <p style={{
                  fontFamily: "var(--font-montserrat)",
                  fontSize: "0.55rem",
                  fontWeight: 700,
                  letterSpacing: "0.16em",
                  textTransform: "uppercase",
                  color: "oklch(75% 0.06 60)",
                  marginBottom: "0.25rem",
                }}>
                  Invite to {teamName}
                </p>
                <p style={{
                  fontFamily: "var(--font-montserrat)",
                  fontWeight: 700,
                  fontSize: "1rem",
                  color: "white",
                  letterSpacing: "-0.005em",
                  lineHeight: 1.2,
                }}>
                  Share this invite link
                </p>
              </div>
              <button
                type="button"
                onClick={() => setInvitePopup(null)}
                style={{
                  background: "oklch(38% 0.12 260)",
                  border: "none",
                  cursor: "pointer",
                  width: "28px",
                  height: "28px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "oklch(80% 0.008 260)",
                  fontSize: "0.875rem",
                  flexShrink: 0,
                  marginTop: "0.125rem",
                }}
              >✕</button>
            </div>

            {/* Body */}
            <div style={{ padding: "1.5rem", display: "flex", flexDirection: "column", gap: "1.25rem" }}>
              {/* Message preview */}
              <div style={{
                background: "oklch(96.5% 0.004 80)",
                border: "1px solid oklch(88% 0.008 80)",
                padding: "1rem 1.125rem",
              }}>
                <p style={{
                  fontFamily: "var(--font-montserrat)",
                  fontSize: "0.75rem",
                  color: "oklch(35% 0.008 260)",
                  lineHeight: 1.7,
                  whiteSpace: "pre-line",
                }}>
                  {invitePopup.text}
                </p>
              </div>

              {/* Share buttons */}
              <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                <p style={{
                  fontFamily: "var(--font-montserrat)",
                  fontSize: "0.55rem",
                  fontWeight: 700,
                  letterSpacing: "0.14em",
                  textTransform: "uppercase",
                  color: "oklch(54% 0.008 260)",
                }}>
                  Share via
                </p>
                <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap" }}>
                  <a
                    href={`https://wa.me/?text=${invitePopup.whatsapp}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{
                      fontFamily: "var(--font-montserrat)",
                      fontSize: "0.68rem",
                      fontWeight: 700,
                      letterSpacing: "0.06em",
                      textTransform: "uppercase",
                      background: "oklch(52% 0.18 145)",
                      color: "white",
                      textDecoration: "none",
                      padding: "0.5rem 1rem",
                      display: "flex",
                      alignItems: "center",
                      gap: "0.4rem",
                      whiteSpace: "nowrap",
                    }}
                  >
                    <svg viewBox="0 0 24 24" fill="currentColor" style={{ width: "14px", height: "14px" }}>
                      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/>
                      <path d="M12 0C5.373 0 0 5.373 0 12c0 2.123.554 4.118 1.524 5.847L.057 23.887c-.07.271.172.512.442.442l6.04-1.467A11.945 11.945 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 22c-1.868 0-3.623-.486-5.148-1.34l-.369-.218-3.819.928.946-3.82-.226-.378A9.938 9.938 0 012 12C2 6.477 6.477 2 12 2s10 4.477 10 10-4.477 10-10 10z"/>
                    </svg>
                    WhatsApp
                  </a>
                  <button
                    type="button"
                    onClick={() => copyToClipboard("link")}
                    style={{
                      fontFamily: "var(--font-montserrat)",
                      fontSize: "0.68rem",
                      fontWeight: 700,
                      letterSpacing: "0.06em",
                      textTransform: "uppercase",
                      background: copied === "link" ? "oklch(52% 0.14 145)" : "transparent",
                      color: copied === "link" ? "white" : "oklch(30% 0.12 260)",
                      border: `1px solid ${copied === "link" ? "oklch(52% 0.14 145)" : "oklch(30% 0.12 260)"}`,
                      padding: "0.5rem 1rem",
                      cursor: "pointer",
                      transition: "all 0.15s",
                      whiteSpace: "nowrap",
                    }}
                  >
                    {copied === "link" ? "Copied ✓" : "Copy Link"}
                  </button>
                  <button
                    type="button"
                    onClick={() => copyToClipboard("text")}
                    style={{
                      fontFamily: "var(--font-montserrat)",
                      fontSize: "0.68rem",
                      fontWeight: 700,
                      letterSpacing: "0.06em",
                      textTransform: "uppercase",
                      background: copied === "text" ? "oklch(52% 0.14 145)" : "transparent",
                      color: copied === "text" ? "white" : "oklch(30% 0.12 260)",
                      border: `1px solid ${copied === "text" ? "oklch(52% 0.14 145)" : "oklch(30% 0.12 260)"}`,
                      padding: "0.5rem 1rem",
                      cursor: "pointer",
                      transition: "all 0.15s",
                      whiteSpace: "nowrap",
                    }}
                  >
                    {copied === "text" ? "Copied ✓" : "Copy Message"}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

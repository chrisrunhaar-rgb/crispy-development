"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import { reviewApplication, toggleGroupPublic } from "@/app/challenge/group-actions";

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

export default function FacilitatorDashboard({
  groups,
  pendingApplications,
  newlyCreatedId,
  newGroupCode,
  firstName,
}: {
  groups: Group[];
  pendingApplications: Application[];
  newlyCreatedId: string | null;
  newGroupCode: string | null;
  firstName: string;
}) {
  const [copied, setCopied] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  function copy(text: string, key: string) {
    navigator.clipboard.writeText(text).then(() => {
      setCopied(key);
      setTimeout(() => setCopied(null), 2000);
    });
  }

  function handleTogglePublic(groupId: string, current: boolean) {
    startTransition(async () => {
      await toggleGroupPublic(groupId, !current);
    });
  }

  function handleReview(appId: string, action: "approve" | "reject") {
    startTransition(async () => {
      await reviewApplication(appId, action);
    });
  }

  return (
    <div style={{ minHeight: "calc(100dvh - 80px)", background: offWhite }}>
      {/* Top bar */}
      <div style={{ background: navy, padding: "0.875rem clamp(1rem, 4vw, 2rem)", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "0.875rem" }}>
          <Link href="/dashboard" style={{ color: "oklch(72% 0.04 260)", textDecoration: "none", fontSize: "0.75rem", fontFamily: "var(--font-montserrat)" }}>
            ← Dashboard
          </Link>
          <span style={{ fontFamily: "var(--font-montserrat)", fontSize: "0.7rem", fontWeight: 700, color: offWhite, letterSpacing: "0.08em", textTransform: "uppercase" }}>
            Facilitator
          </span>
        </div>
        <Link
          href="/challenge/group/create"
          style={{ fontFamily: "var(--font-montserrat)", fontWeight: 700, fontSize: "0.8rem", color: navy, background: offWhite, padding: "0.5rem 1rem", borderRadius: "6px", textDecoration: "none" }}
        >
          + New Group
        </Link>
      </div>

      <div style={{ maxWidth: "680px", margin: "0 auto", padding: "clamp(1.5rem, 4vw, 2.5rem) clamp(1rem, 4vw, 2rem)" }}>

        {/* New group success banner */}
        {newlyCreatedId && newGroupCode && (
          <div style={{ background: `${orange.replace(")", " / 0.1)")}`, border: `1px solid ${orange.replace(")", " / 0.3)")}`, borderRadius: "12px", padding: "1.25rem 1.5rem", marginBottom: "2rem" }}>
            <p style={{ fontFamily: "var(--font-montserrat)", fontWeight: 700, fontSize: "0.875rem", color: navy, marginBottom: "0.5rem" }}>
              Group created! Share this invite link:
            </p>
            <div style={{ display: "flex", gap: "0.5rem", alignItems: "center", flexWrap: "wrap" }}>
              <code style={{ fontFamily: "monospace", fontSize: "0.875rem", color: navy, background: "white", padding: "0.375rem 0.75rem", borderRadius: "6px", border: "1px solid oklch(88% 0.006 80)", flex: 1, minWidth: 0, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                {groups.find(g => g.id === newlyCreatedId)?.inviteUrl}
              </code>
              <button
                onClick={() => copy(groups.find(g => g.id === newlyCreatedId)?.inviteUrl ?? "", "new")}
                style={{ fontFamily: "var(--font-montserrat)", fontWeight: 700, fontSize: "0.75rem", color: offWhite, background: navy, border: "none", borderRadius: "6px", padding: "0.5rem 1rem", cursor: "pointer", whiteSpace: "nowrap" }}
              >
                {copied === "new" ? "Copied!" : "Copy"}
              </button>
            </div>
          </div>
        )}

        <h1 style={{ fontFamily: "var(--font-montserrat)", fontWeight: 800, fontSize: "1.5rem", color: navy, marginBottom: "0.25rem" }}>
          {firstName ? `${firstName}'s Groups` : "My Groups"}
        </h1>
        <p style={{ fontFamily: "var(--font-montserrat)", fontSize: "0.875rem", color: mid, marginBottom: "2rem" }}>
          {groups.length === 0 ? "No groups yet." : `${groups.length} group${groups.length !== 1 ? "s" : ""}`}
        </p>

        {/* Pending applications */}
        {pendingApplications.length > 0 && (
          <div style={{ marginBottom: "2rem" }}>
            <p style={{ fontFamily: "var(--font-montserrat)", fontSize: "0.62rem", fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", color: orange, marginBottom: "0.75rem" }}>
              Pending Applications ({pendingApplications.length})
            </p>
            <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
              {pendingApplications.map(app => {
                const group = groups.find(g => g.id === app.group_id);
                return (
                  <div key={app.id} style={{ background: "white", border: "1px solid oklch(88% 0.006 80)", borderRadius: "12px", padding: "1.25rem" }}>
                    <p style={{ fontFamily: "var(--font-montserrat)", fontSize: "0.65rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em", color: mid, marginBottom: "0.5rem" }}>
                      {group?.name ?? "Unknown group"}
                    </p>
                    {app.answer_1 && (
                      <p style={{ fontFamily: "var(--font-montserrat)", fontSize: "0.875rem", color: "oklch(35% 0.008 260)", lineHeight: 1.65, marginBottom: "0.75rem" }}>
                        {app.answer_1}
                      </p>
                    )}
                    <div style={{ display: "flex", gap: "0.625rem" }}>
                      <button
                        onClick={() => handleReview(app.id, "approve")}
                        disabled={isPending}
                        style={{ fontFamily: "var(--font-montserrat)", fontWeight: 700, fontSize: "0.8rem", color: offWhite, background: "oklch(42% 0.14 145)", border: "none", borderRadius: "6px", padding: "0.5rem 1rem", cursor: "pointer" }}
                      >
                        Approve
                      </button>
                      <button
                        onClick={() => handleReview(app.id, "reject")}
                        disabled={isPending}
                        style={{ fontFamily: "var(--font-montserrat)", fontWeight: 700, fontSize: "0.8rem", color: mid, background: "none", border: "1px solid oklch(82% 0.006 260)", borderRadius: "6px", padding: "0.5rem 1rem", cursor: "pointer" }}
                      >
                        Decline
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Groups list */}
        {groups.length === 0 ? (
          <div style={{ textAlign: "center", paddingBlock: "3rem" }}>
            <p style={{ fontFamily: "var(--font-montserrat)", fontSize: "0.9rem", color: mid, marginBottom: "1.5rem" }}>
              Create your first group to invite people to the challenge.
            </p>
            <Link href="/challenge/group/create" style={{ fontFamily: "var(--font-montserrat)", fontWeight: 700, fontSize: "0.875rem", color: offWhite, background: navy, padding: "0.75rem 1.75rem", borderRadius: "8px", textDecoration: "none" }}>
              Create a group →
            </Link>
          </div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
            {groups.map(group => (
              <div key={group.id} style={{ background: "white", border: "1px solid oklch(88% 0.006 80)", borderRadius: "12px", padding: "1.25rem 1.5rem" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: "1rem", marginBottom: "0.875rem" }}>
                  <div>
                    <p style={{ fontFamily: "var(--font-montserrat)", fontWeight: 800, fontSize: "1rem", color: navy, marginBottom: "0.25rem" }}>{group.name}</p>
                    {group.description && (
                      <p style={{ fontFamily: "var(--font-montserrat)", fontSize: "0.8rem", color: mid, lineHeight: 1.5 }}>{group.description}</p>
                    )}
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: "0.375rem", flexShrink: 0 }}>
                    <span style={{ fontFamily: "var(--font-montserrat)", fontSize: "0.7rem", color: mid }}>{group.is_public ? "Open" : "Private"}</span>
                    <button
                      type="button"
                      onClick={() => handleTogglePublic(group.id, group.is_public)}
                      disabled={isPending}
                      style={{
                        width: "36px", height: "20px", borderRadius: "10px", border: "none", cursor: "pointer",
                        background: group.is_public ? orange : "oklch(82% 0.006 260)",
                        position: "relative", transition: "background 0.2s",
                      }}
                    >
                      <span style={{
                        position: "absolute", top: "2px", left: group.is_public ? "18px" : "2px",
                        width: "16px", height: "16px", borderRadius: "50%", background: "white",
                        transition: "left 0.2s",
                      }} />
                    </button>
                  </div>
                </div>

                <div style={{ display: "flex", gap: "1rem", marginBottom: "1rem", flexWrap: "wrap" }}>
                  <span style={{ fontFamily: "var(--font-montserrat)", fontSize: "0.72rem", color: mid }}>
                    {group.memberCount} / {group.max_members} members
                  </span>
                  <span style={{ fontFamily: "var(--font-montserrat)", fontSize: "0.72rem", color: mid }}>
                    {group.schedule_days.sort().map(d => DAY_NAMES[d]).join(", ")}
                  </span>
                  <code style={{ fontFamily: "monospace", fontSize: "0.72rem", color: navy, fontWeight: 700 }}>
                    {group.group_code}
                  </code>
                </div>

                {/* Invite link */}
                <div style={{ display: "flex", gap: "0.5rem", alignItems: "center" }}>
                  <input
                    readOnly
                    value={group.inviteUrl}
                    style={{ fontFamily: "var(--font-montserrat)", fontSize: "0.78rem", color: mid, background: "oklch(95% 0.004 80)", border: "1px solid oklch(88% 0.006 80)", borderRadius: "6px", padding: "0.4rem 0.75rem", flex: 1, minWidth: 0, outline: "none" }}
                  />
                  <button
                    onClick={() => copy(group.inviteUrl, group.id)}
                    style={{ fontFamily: "var(--font-montserrat)", fontWeight: 700, fontSize: "0.72rem", color: offWhite, background: navy, border: "none", borderRadius: "6px", padding: "0.4rem 0.875rem", cursor: "pointer", whiteSpace: "nowrap" }}
                  >
                    {copied === group.id ? "Copied!" : "Copy link"}
                  </button>
                </div>

                <div style={{ marginTop: "0.875rem" }}>
                  <Link href={`/challenge/day/1`} style={{ fontFamily: "var(--font-montserrat)", fontSize: "0.78rem", fontWeight: 600, color: navy, textDecoration: "none" }}>
                    Continue challenge →
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}

      </div>
    </div>
  );
}

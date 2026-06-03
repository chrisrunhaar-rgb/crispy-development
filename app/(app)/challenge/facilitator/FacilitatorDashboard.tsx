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
  firstName,
}: {
  groups: Group[];
  pendingApplications: Application[];
  newlyCreatedId: string | null;
  newGroupCode: string | null;
  firstName: string;
}) {
  const [copied, setCopied] = useState(false);
  const [isPending, startTransition] = useTransition();

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

  function handleReview(appId: string, action: "approve" | "reject") {
    startTransition(async () => { await reviewApplication(appId, action); });
  }

  return (
    <div style={{ minHeight: "calc(100dvh - 80px)", background: offWhite }}>
      {/* Top bar */}
      <div style={{ background: navy, padding: "0.875rem clamp(1rem, 4vw, 2rem)", display: "flex", alignItems: "center", gap: "0.875rem" }}>
        <Link href="/dashboard" style={{ color: "oklch(72% 0.04 260)", textDecoration: "none", fontSize: "0.75rem", fontFamily: "var(--font-montserrat)" }}>
          ← Dashboard
        </Link>
        <span style={{ fontFamily: "var(--font-montserrat)", fontSize: "0.7rem", fontWeight: 700, color: offWhite, letterSpacing: "0.08em", textTransform: "uppercase" }}>
          Facilitator
        </span>
      </div>

      <div style={{ maxWidth: "600px", margin: "0 auto", padding: "clamp(1.5rem, 4vw, 2.5rem) clamp(1rem, 4vw, 2rem)" }}>

        {!group ? (
          <div style={{ textAlign: "center", paddingBlock: "3rem" }}>
            <p style={{ fontFamily: "var(--font-montserrat)", fontSize: "0.9rem", color: mid, marginBottom: "1.5rem" }}>
              No group yet.
            </p>
            <Link href="/challenge/group/create" style={{ fontFamily: "var(--font-montserrat)", fontWeight: 700, fontSize: "0.875rem", color: offWhite, background: navy, padding: "0.75rem 1.75rem", borderRadius: "8px", textDecoration: "none" }}>
              Create a group →
            </Link>
          </div>
        ) : (
          <>
            {/* Group header */}
            <div style={{ marginBottom: "1.5rem" }}>
              <p style={{ fontFamily: "var(--font-montserrat)", fontSize: "0.62rem", fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", color: orange, marginBottom: "0.375rem" }}>
                Your group
              </p>
              <h1 style={{ fontFamily: "var(--font-montserrat)", fontWeight: 800, fontSize: "1.5rem", color: navy, marginBottom: "0.25rem" }}>
                {group.name}
              </h1>
              {group.description && (
                <p style={{ fontFamily: "var(--font-montserrat)", fontSize: "0.875rem", color: mid, lineHeight: 1.6 }}>
                  {group.description}
                </p>
              )}
              <p style={{ fontFamily: "var(--font-montserrat)", fontSize: "0.78rem", color: mid, marginTop: "0.5rem" }}>
                {group.memberCount} member{group.memberCount !== 1 ? "s" : ""} &nbsp;·&nbsp; reads {group.schedule_days.sort().map(d => DAY_NAMES[d]).join(", ")}
              </p>
            </div>

            {/* Invite link — single, prominent */}
            <div style={{ background: "white", border: "1px solid oklch(88% 0.006 80)", borderRadius: "12px", padding: "1.25rem", marginBottom: "1.25rem" }}>
              <p style={{ fontFamily: "var(--font-montserrat)", fontWeight: 700, fontSize: "0.875rem", color: navy, marginBottom: "0.75rem" }}>
                Invite link
              </p>
              <div style={{ display: "flex", gap: "0.5rem" }}>
                <div style={{ fontFamily: "var(--font-montserrat)", fontSize: "0.8rem", color: mid, background: "oklch(94% 0.004 80)", border: "1px solid oklch(88% 0.006 80)", borderRadius: "6px", padding: "0.6rem 0.875rem", flex: 1, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                  {group.inviteUrl}
                </div>
                <button
                  onClick={() => copy(group.inviteUrl)}
                  style={{ fontFamily: "var(--font-montserrat)", fontWeight: 700, fontSize: "0.8rem", color: offWhite, background: copied ? "oklch(42% 0.14 145)" : navy, border: "none", borderRadius: "6px", padding: "0.6rem 1.1rem", cursor: "pointer", whiteSpace: "nowrap", flexShrink: 0, transition: "background 0.2s" }}
                >
                  {copied ? "Copied ✓" : "Copy"}
                </button>
              </div>
              <p style={{ fontFamily: "var(--font-montserrat)", fontSize: "0.72rem", color: mid, marginTop: "0.5rem" }}>
                Code: <strong style={{ color: navy, letterSpacing: "0.08em" }}>{group.group_code}</strong>
              </p>
            </div>

            {/* Actions row */}
            <div style={{ display: "flex", gap: "0.75rem", marginBottom: "1.5rem", flexWrap: "wrap" }}>
              <Link
                href={`/challenge/day/1`}
                style={{ fontFamily: "var(--font-montserrat)", fontWeight: 700, fontSize: "0.8125rem", color: offWhite, background: navy, padding: "0.625rem 1.25rem", borderRadius: "8px", textDecoration: "none" }}
              >
                Continue challenge →
              </Link>

              {/* Open group toggle */}
              <button
                type="button"
                onClick={() => handleTogglePublic(group.id, group.is_public)}
                disabled={isPending}
                style={{ fontFamily: "var(--font-montserrat)", fontWeight: 600, fontSize: "0.8125rem", color: navy, background: "white", border: "1px solid oklch(82% 0.006 260)", padding: "0.625rem 1.25rem", borderRadius: "8px", cursor: "pointer" }}
              >
                {group.is_public ? "✓ Open group" : "Make open group"}
              </button>
            </div>

            {/* Pending applications */}
            {pendingApplications.length > 0 && (
              <div>
                <p style={{ fontFamily: "var(--font-montserrat)", fontSize: "0.62rem", fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", color: orange, marginBottom: "0.875rem" }}>
                  Applications ({pendingApplications.length})
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

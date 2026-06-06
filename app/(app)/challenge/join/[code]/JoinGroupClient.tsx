"use client";

import { useTransition } from "react";
import { joinGroupByCode } from "@/app/challenge/group-actions";
import { useLanguage } from "@/lib/LanguageContext";

const navy     = "oklch(22% 0.10 260)";
const orange   = "oklch(65% 0.15 45)";
const offWhite = "oklch(97% 0.005 80)";
const mid      = "oklch(52% 0.008 260)";
const DAY_NAMES = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

export default function JoinGroupClient({ code, groupName, groupDescription, scheduleDays, memberCount, maxMembers, isFull }: {
  code: string;
  groupName: string;
  groupDescription: string | null;
  scheduleDays: number[];
  memberCount: number;
  maxMembers: number;
  isFull: boolean;
}) {
  const [isPending, startTransition] = useTransition();
  const { t } = useLanguage();
  const c = t.challenge;

  function handleJoin() {
    startTransition(async () => { await joinGroupByCode(code); });
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
          <button
            onClick={handleJoin}
            disabled={isPending}
            style={{ width: "100%", fontFamily: "var(--font-montserrat)", fontWeight: 700, fontSize: "1rem", color: offWhite, background: navy, border: "none", borderRadius: "8px", padding: "0.9375rem", cursor: isPending ? "not-allowed" : "pointer", opacity: isPending ? 0.7 : 1 }}
          >
            {isPending ? c.joining : c.joinGroup}
          </button>
        )}
      </div>
    </div>
  );
}

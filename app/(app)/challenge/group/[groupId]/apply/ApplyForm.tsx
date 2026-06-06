"use client";

import { useActionState } from "react";
import Link from "next/link";
import { applyToGroup } from "@/app/challenge/group-actions";

const navy     = "oklch(22% 0.10 260)";
const orange   = "oklch(65% 0.15 45)";
const offWhite = "oklch(97% 0.005 80)";
const mid      = "oklch(52% 0.008 260)";

const initialState = { error: "", success: false };

export default function ApplyForm({ groupId, groupName, existingStatus }: {
  groupId: string;
  groupName: string;
  existingStatus: string | null;
}) {
  const [state, formAction, pending] = useActionState(
    async (_prev: typeof initialState, formData: FormData) => {
      const result = await applyToGroup(groupId, formData);
      return result?.error ? { error: result.error, success: false } : { error: "", success: true };
    },
    initialState,
  );

  if (existingStatus === "pending" || state.success) {
    return (
      <div style={{ maxWidth: "400px", textAlign: "center" }}>
        <p style={{ fontFamily: "var(--font-montserrat)", fontWeight: 700, fontSize: "1.1rem", color: navy, marginBottom: "0.5rem" }}>Application sent</p>
        <p style={{ fontFamily: "var(--font-montserrat)", fontSize: "0.875rem", color: mid, lineHeight: 1.6, marginBottom: "1.5rem" }}>
          The facilitator will review your application and let you know.
        </p>
        <Link href="/challenge/group/browse" style={{ fontFamily: "var(--font-montserrat)", fontSize: "0.8rem", color: navy, textDecoration: "none" }}>← Browse other groups</Link>
      </div>
    );
  }

  return (
    <div style={{ width: "100%", maxWidth: "440px" }}>
      <Link href="/challenge/group/browse" style={{ fontFamily: "var(--font-montserrat)", fontSize: "0.75rem", color: mid, textDecoration: "none", display: "inline-block", marginBottom: "1.5rem" }}>← Browse groups</Link>
      <p style={{ fontFamily: "var(--font-montserrat)", fontSize: "0.62rem", fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", color: orange, marginBottom: "0.375rem" }}>Applying to join</p>
      <h1 style={{ fontFamily: "var(--font-montserrat)", fontWeight: 800, fontSize: "1.5rem", color: navy, marginBottom: "1.5rem" }}>{groupName}</h1>

      <form action={formAction}>
        <div style={{ marginBottom: "1.25rem" }}>
          <label style={labelStyle}>Why do you want to join this group?</label>
          <textarea name="answer_1" rows={4} required placeholder="Share a bit about yourself and why this group fits you..." style={textareaStyle} />
        </div>
        <div style={{ marginBottom: "1.5rem" }}>
          <label style={labelStyle}>What do you hope to get from this challenge? <span style={{ fontWeight: 400 }}>(optional)</span></label>
          <textarea name="answer_2" rows={3} placeholder="Your hopes or goals for the next 60 days..." style={textareaStyle} />
        </div>
        {state.error && <p style={{ fontFamily: "var(--font-montserrat)", fontSize: "0.8rem", color: "oklch(50% 0.22 15)", marginBottom: "1rem" }}>{state.error}</p>}
        <button type="submit" disabled={pending} style={{ width: "100%", fontFamily: "var(--font-montserrat)", fontWeight: 700, fontSize: "1rem", color: offWhite, background: navy, border: "none", borderRadius: "8px", padding: "0.9375rem", cursor: pending ? "not-allowed" : "pointer", opacity: pending ? 0.7 : 1 }}>
          {pending ? "Sending..." : "Send application →"}
        </button>
      </form>
    </div>
  );
}

const labelStyle: React.CSSProperties = { fontFamily: "var(--font-montserrat)", fontSize: "0.7rem", fontWeight: 700, color: "oklch(42% 0.008 260)", display: "block", marginBottom: "0.375rem", letterSpacing: "0.04em", textTransform: "uppercase" };
const textareaStyle: React.CSSProperties = { width: "100%", fontFamily: "var(--font-montserrat)", fontSize: "0.9rem", color: "oklch(22% 0.10 260)", background: "white", border: "1px solid oklch(82% 0.006 260)", borderRadius: "8px", padding: "0.75rem", resize: "vertical", outline: "none", lineHeight: 1.65, boxSizing: "border-box" };

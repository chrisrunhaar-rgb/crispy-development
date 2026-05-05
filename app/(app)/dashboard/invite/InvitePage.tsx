"use client";

import Link from "next/link";
import { useState, useActionState } from "react";
import { generateInviteLink, deleteInviteLink, sendEmailInvite } from "@/app/(app)/dashboard/actions";

type Invite = {
  id: string;
  token: string;
  created_at: string;
  expires_at: string;
  used_at: string | null;
};

export default function InvitePage({
  team,
  invites,
  siteUrl,
}: {
  team: { id: string; name: string };
  invites: Invite[];
  siteUrl: string;
}) {
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [generateState, generateAction, generatePending] = useActionState(
    async (_prev: { error: string | null }, formData: FormData) => {
      const result = await generateInviteLink(formData);
      return result ?? { error: null };
    },
    { error: null }
  );
  const [emailState, emailAction, emailPending] = useActionState(
    async (_prev: { error?: string; sent?: boolean }, formData: FormData) => {
      const result = await sendEmailInvite(formData);
      return result ?? {};
    },
    {}
  );

  function inviteUrl(token: string) {
    return `${siteUrl}/invite/${token}`;
  }

  async function handleShare(token: string, id: string) {
    const url = inviteUrl(token);
    const shareData = {
      title: `Join ${team.name} on Crispy Development`,
      text: `You're invited to join our team on Crispy Development, a cross-cultural leadership platform.`,
      url,
    };
    if (navigator.share && navigator.canShare?.(shareData)) {
      try {
        await navigator.share(shareData);
        return;
      } catch {
        // User cancelled share or share failed — fall through to clipboard
      }
    }
    await navigator.clipboard.writeText(url);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2500);
  }

  const activeInvites = invites.filter(i => !i.used_at && new Date(i.expires_at) > new Date());
  const usedInvites = invites.filter(i => i.used_at);
  const expiredInvites = invites.filter(i => !i.used_at && new Date(i.expires_at) <= new Date());

  return (
    <div style={{ background: "oklch(97% 0.005 80)", minHeight: "calc(100dvh - 120px)" }}>
      {/* Header */}
      <div style={{ background: "oklch(30% 0.12 260)", paddingBlock: "2rem", borderBottom: "1px solid oklch(22% 0.10 260)" }}>
        <div className="container-wide" style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "1rem" }}>
          <div>
            <p className="t-label" style={{ color: "oklch(65% 0.15 45)", marginBottom: "0.375rem", fontSize: "0.62rem" }}>
              Team Pathway · {team.name}
            </p>
            <h1 style={{ fontFamily: "var(--font-montserrat)", fontWeight: 800, fontSize: "1.375rem", color: "oklch(97% 0.005 80)" }}>
              Invite Members
            </h1>
          </div>
          <Link href="/dashboard" style={{ fontFamily: "var(--font-montserrat)", fontSize: "0.78rem", fontWeight: 600, letterSpacing: "0.06em", color: "oklch(72% 0.04 260)", textDecoration: "none" }}>
            ← Back to Dashboard
          </Link>
        </div>
      </div>

      <div className="container-wide" style={{ paddingBlock: "3rem", maxWidth: "680px" }}>

        {/* Email invite */}
        <div style={{ marginBottom: "3rem" }}>
          <p style={{ fontFamily: "var(--font-montserrat)", fontSize: "0.62rem", fontWeight: 700, letterSpacing: "0.14em", textTransform: "uppercase", color: "oklch(52% 0.008 260)", marginBottom: "1rem" }}>
            Send Invite by Email
          </p>
          {emailState.sent ? (
            <p style={{ fontFamily: "var(--font-montserrat)", fontSize: "0.875rem", color: "oklch(40% 0.12 145)", padding: "1rem", background: "oklch(95% 0.03 145)", border: "1px solid oklch(80% 0.06 145)" }}>
              Invitation sent successfully.
            </p>
          ) : (
            <form action={emailAction} style={{ display: "flex", gap: "0.75rem", flexWrap: "wrap" }}>
              <input
                className="form-input"
                type="email"
                name="email"
                placeholder="member@example.com"
                required
                style={{ flex: 1, minWidth: "220px" }}
              />
              <button
                type="submit"
                className="btn-primary"
                disabled={emailPending}
                style={{ fontSize: "0.85rem", opacity: emailPending ? 0.7 : 1, whiteSpace: "nowrap" }}
              >
                {emailPending ? "Sending…" : "Send Invite →"}
              </button>
              {emailState.error && (
                <p style={{ fontFamily: "var(--font-montserrat)", fontSize: "0.8125rem", color: "oklch(45% 0.12 25)", width: "100%", margin: 0 }}>
                  {emailState.error}
                </p>
              )}
            </form>
          )}
        </div>

        {/* Divider */}
        <div style={{ height: "1px", background: "oklch(88% 0.008 80)", marginBottom: "3rem" }} />

        {/* Explanation */}
        <div style={{ marginBottom: "2.5rem" }}>
          <p style={{ fontFamily: "var(--font-montserrat)", fontSize: "0.9375rem", lineHeight: 1.7, color: "oklch(42% 0.008 260)", maxWidth: "52ch" }}>
            Or generate a link and share it yourself. Each link is valid for 7 days and can only be used once.
          </p>
        </div>

        {/* Generate button */}
        <form action={generateAction} style={{ marginBottom: "3rem" }}>
          <button
            type="submit"
            className="btn-primary"
            disabled={generatePending}
            style={{ fontSize: "0.85rem", opacity: generatePending ? 0.7 : 1 }}
          >
            {generatePending ? "Generating…" : "+ Generate New Invite Link"}
          </button>
          {generateState.error && (
            <p style={{ fontFamily: "var(--font-montserrat)", fontSize: "0.8125rem", color: "oklch(45% 0.12 25)", marginTop: "0.75rem" }}>
              {generateState.error}
            </p>
          )}
        </form>

        {/* Active invites */}
        {activeInvites.length > 0 && (
          <div style={{ marginBottom: "3rem" }}>
            <p style={{ fontFamily: "var(--font-montserrat)", fontSize: "0.62rem", fontWeight: 700, letterSpacing: "0.14em", textTransform: "uppercase", color: "oklch(52% 0.008 260)", marginBottom: "1rem" }}>
              Active Links ({activeInvites.length})
            </p>
            <div style={{ display: "flex", flexDirection: "column", gap: "1px", background: "oklch(88% 0.008 80)" }}>
              {activeInvites.map(invite => {
                const expiresAt = new Date(invite.expires_at);
                const daysLeft = Math.ceil((expiresAt.getTime() - Date.now()) / (1000 * 60 * 60 * 24));
                const isCopied = copiedId === invite.id;

                return (
                  <div key={invite.id} style={{ background: "oklch(99% 0.002 80)", padding: "1.25rem 1.5rem" }}>
                    {/* URL row */}
                    <div style={{ display: "flex", alignItems: "center", gap: "1rem", marginBottom: "1rem", flexWrap: "wrap" }}>
                      <code style={{ fontFamily: "monospace", fontSize: "0.78rem", color: "oklch(38% 0.008 260)", background: "oklch(93% 0.004 80)", padding: "0.35rem 0.75rem", flex: 1, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", minWidth: 0 }}>
                        {inviteUrl(invite.token)}
                      </code>
                      <span style={{ fontFamily: "var(--font-montserrat)", fontSize: "0.72rem", color: "oklch(58% 0.008 260)", whiteSpace: "nowrap", flexShrink: 0 }}>
                        {daysLeft}d left
                      </span>
                    </div>

                    {/* Action buttons */}
                    <div style={{ display: "flex", gap: "0.625rem", flexWrap: "wrap", alignItems: "center" }}>
                      <button
                        type="button"
                        onClick={() => handleShare(invite.token, invite.id)}
                        style={{
                          fontFamily: "var(--font-montserrat)", fontSize: "0.72rem", fontWeight: 700,
                          letterSpacing: "0.06em", border: "1px solid oklch(30% 0.12 260)",
                          background: isCopied ? "oklch(30% 0.12 260)" : "transparent",
                          color: isCopied ? "oklch(97% 0.005 80)" : "oklch(30% 0.12 260)",
                          padding: "0.45rem 0.875rem", cursor: "pointer", whiteSpace: "nowrap",
                        }}
                      >
                        {isCopied ? "✓ Copied!" : "Share Link"}
                      </button>
                      <form action={deleteInviteLink} style={{ marginLeft: "auto" }}>
                        <input type="hidden" name="inviteId" value={invite.id} />
                        <button
                          type="submit"
                          style={{
                            fontFamily: "var(--font-montserrat)", fontSize: "0.72rem",
                            background: "none", border: "none", cursor: "pointer",
                            color: "oklch(58% 0.008 260)", padding: "0.45rem 0.5rem",
                          }}
                        >
                          Revoke
                        </button>
                      </form>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Used invites */}
        {usedInvites.length > 0 && (
          <div style={{ marginBottom: "2rem" }}>
            <p style={{ fontFamily: "var(--font-montserrat)", fontSize: "0.62rem", fontWeight: 700, letterSpacing: "0.14em", textTransform: "uppercase", color: "oklch(52% 0.008 260)", marginBottom: "1rem" }}>
              Used ({usedInvites.length})
            </p>
            <div style={{ display: "flex", flexDirection: "column", gap: "1px", background: "oklch(88% 0.008 80)" }}>
              {usedInvites.map(invite => (
                <div key={invite.id} style={{ background: "oklch(99% 0.002 80)", padding: "1rem 1.5rem", display: "flex", alignItems: "center", gap: "1rem", opacity: 0.6 }}>
                  <span style={{ fontFamily: "var(--font-montserrat)", fontSize: "0.72rem", color: "oklch(52% 0.008 260)" }}>
                    Used on {new Date(invite.used_at!).toLocaleDateString()}
                  </span>
                  <code style={{ fontFamily: "monospace", fontSize: "0.72rem", color: "oklch(62% 0.006 260)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                    …{invite.token.slice(-12)}
                  </code>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Empty state */}
        {invites.length === 0 && (
          <div style={{ paddingBlock: "3rem", textAlign: "center" }}>
            <p style={{ fontFamily: "var(--font-montserrat)", fontSize: "0.9375rem", color: "oklch(55% 0.008 260)", lineHeight: 1.6, maxWidth: "36ch", margin: "0 auto" }}>
              No invite links yet. Generate one above and share it with your team.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

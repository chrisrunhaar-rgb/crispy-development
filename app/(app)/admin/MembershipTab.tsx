"use client";

import { useState, useTransition } from "react";
import { approveMembershipApplication, rejectMembershipApplication, generateMemberInvite, revokeMemberInvite } from "./actions";

const navy = "oklch(30% 0.12 260)";
const orange = "oklch(65% 0.15 45)";

type Application = {
  id: string;
  created_at: string;
  name: string;
  email: string;
  organization: string | null;
  role: string | null;
  location_cultures: string | null;
  faith_share: string | null;
  leadership_challenge: string | null;
  referral_source: string | null;
  status: string;
  reviewed_at: string | null;
};

type MemberInvite = {
  id: string;
  token: string;
  email: string | null;
  personal_note: string | null;
  pathway: string;
  created_at: string;
  expires_at: string;
  used_at: string | null;
};

function PathwayBadge({ pathway }: { pathway: string }) {
  const isTeam = pathway === "team";
  return (
    <span style={{
      fontFamily: "var(--font-montserrat)",
      fontSize: "0.56rem",
      fontWeight: 700,
      letterSpacing: "0.08em",
      textTransform: "uppercase",
      padding: "0.15rem 0.4rem",
      background: isTeam ? "oklch(30% 0.12 260 / 0.1)" : "oklch(65% 0.15 45 / 0.1)",
      color: isTeam ? navy : orange,
    }}>
      {isTeam ? "Team Leader" : "Personal"}
    </span>
  );
}

function ApplicationRow({ app, siteUrl }: { app: Application; siteUrl: string }) {
  const [expanded, setExpanded] = useState(false);
  const [, startTransition] = useTransition();
  const [copied, setCopied] = useState(false);
  const [pathway, setPathway] = useState<"personal" | "team">("personal");

  function handleApprove(formData: FormData) {
    startTransition(async () => { await approveMembershipApplication(formData); });
  }

  function handleReject(formData: FormData) {
    startTransition(async () => { await rejectMembershipApplication(formData); });
  }

  async function handleGenerateAndCopy() {
    const fd = new FormData();
    fd.append("email", app.email);
    fd.append("recipientName", app.name.split(" ")[0]);
    fd.append("pathway", pathway);
    const result = await generateMemberInvite(fd);
    if (result.url) {
      await navigator.clipboard.writeText(result.url);
      setCopied(true);
      setTimeout(() => setCopied(false), 3000);
    }
  }

  const isPending = app.status === "pending";
  const isApproved = app.status === "approved";

  return (
    <div style={{
      background: "white",
      border: "1px solid oklch(88% 0.008 80)",
      borderLeft: `3px solid ${isPending ? orange : isApproved ? "oklch(52% 0.14 150)" : "oklch(65% 0.008 260)"}`,
      marginBottom: "1px",
    }}>
      <div
        style={{ padding: "1rem 1.25rem", cursor: "pointer", display: "flex", alignItems: "center", gap: "1rem", flexWrap: "wrap" }}
        onClick={() => setExpanded(e => !e)}
      >
        <div style={{ flex: 1, minWidth: 0 }}>
          <p style={{ fontFamily: "var(--font-montserrat)", fontWeight: 700, fontSize: "0.875rem", color: navy, margin: 0 }}>{app.name}</p>
          <p style={{ fontFamily: "var(--font-montserrat)", fontSize: "0.72rem", color: "oklch(52% 0.008 260)", margin: "0.1rem 0 0" }}>{app.email}{app.organization ? ` · ${app.organization}` : ""}</p>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", flexShrink: 0 }}>
          <span style={{
            fontFamily: "var(--font-montserrat)",
            fontSize: "0.58rem", fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase",
            padding: "0.2rem 0.5rem",
            background: isPending ? "oklch(65% 0.15 45 / 0.12)" : isApproved ? "oklch(52% 0.14 150 / 0.12)" : "oklch(92% 0.004 260)",
            color: isPending ? orange : isApproved ? "oklch(42% 0.14 150)" : "oklch(52% 0.008 260)",
          }}>{app.status}</span>
          <span style={{ fontFamily: "var(--font-montserrat)", fontSize: "0.65rem", color: "oklch(58% 0.008 260)" }}>
            {new Date(app.created_at).toLocaleDateString()}
          </span>
          <span style={{ fontSize: "0.7rem", color: "oklch(58% 0.008 260)" }}>{expanded ? "▲" : "▼"}</span>
        </div>
      </div>

      {expanded && (
        <div style={{ padding: "0 1.25rem 1.25rem", borderTop: "1px solid oklch(92% 0.006 80)" }}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem", paddingTop: "1rem", marginBottom: "1.25rem" }}>
            {[
              { label: "Role", value: app.role },
              { label: "Location & Cultures", value: app.location_cultures },
              { label: "How they found us", value: app.referral_source },
            ].map(({ label, value }) => value ? (
              <div key={label}>
                <p style={{ fontFamily: "var(--font-montserrat)", fontSize: "0.58rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em", color: "oklch(55% 0.008 260)", margin: "0 0 0.25rem" }}>{label}</p>
                <p style={{ fontFamily: "var(--font-montserrat)", fontSize: "0.8rem", color: navy, margin: 0 }}>{value}</p>
              </div>
            ) : null)}
          </div>
          {app.faith_share && (
            <div style={{ marginBottom: "1rem", padding: "0.875rem", background: "oklch(95% 0.006 260)", borderLeft: `3px solid ${orange}` }}>
              <p style={{ fontFamily: "var(--font-montserrat)", fontSize: "0.58rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em", color: "oklch(55% 0.008 260)", margin: "0 0 0.375rem" }}>Faith</p>
              <p style={{ fontFamily: "var(--font-montserrat)", fontSize: "0.82rem", lineHeight: 1.65, color: navy, margin: 0 }}>{app.faith_share}</p>
            </div>
          )}
          {app.leadership_challenge && (
            <div style={{ marginBottom: "1.25rem", padding: "0.875rem", background: "oklch(95% 0.006 260)", borderLeft: "3px solid oklch(48% 0.18 260)" }}>
              <p style={{ fontFamily: "var(--font-montserrat)", fontSize: "0.58rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em", color: "oklch(55% 0.008 260)", margin: "0 0 0.375rem" }}>Leadership challenge</p>
              <p style={{ fontFamily: "var(--font-montserrat)", fontSize: "0.82rem", lineHeight: 1.65, color: navy, margin: 0 }}>{app.leadership_challenge}</p>
            </div>
          )}

          <div style={{ display: "flex", gap: "0.625rem", flexWrap: "wrap", alignItems: "center" }}>
            {isPending && (
              <>
                <form action={handleApprove}>
                  <input type="hidden" name="applicationId" value={app.id} />
                  <button type="submit" style={{ fontFamily: "var(--font-montserrat)", fontSize: "0.75rem", fontWeight: 700, color: "white", background: "oklch(52% 0.14 150)", border: "none", padding: "0.5rem 1rem", cursor: "pointer" }}>
                    Approve
                  </button>
                </form>
                <form action={handleReject}>
                  <input type="hidden" name="applicationId" value={app.id} />
                  <button type="submit" style={{ fontFamily: "var(--font-montserrat)", fontSize: "0.75rem", fontWeight: 600, color: "oklch(48% 0.008 260)", background: "none", border: "1px solid oklch(82% 0.008 80)", padding: "0.5rem 1rem", cursor: "pointer" }}>
                    Reject
                  </button>
                </form>
              </>
            )}
            {isApproved && (
              <div style={{ display: "flex", gap: "0.5rem", alignItems: "center", flexWrap: "wrap" }}>
                <select
                  value={pathway}
                  onChange={e => setPathway(e.target.value as "personal" | "team")}
                  style={{ fontFamily: "var(--font-montserrat)", fontSize: "0.75rem", border: "1px solid oklch(82% 0.008 80)", padding: "0.4rem 0.625rem", background: "white", color: navy }}
                >
                  <option value="personal">Personal access</option>
                  <option value="team">Team Leader access</option>
                </select>
                <button
                  type="button"
                  onClick={handleGenerateAndCopy}
                  style={{ fontFamily: "var(--font-montserrat)", fontSize: "0.75rem", fontWeight: 700, color: copied ? "white" : navy, background: copied ? "oklch(52% 0.14 150)" : "oklch(94% 0.006 80)", border: "1px solid oklch(82% 0.008 80)", padding: "0.5rem 1rem", cursor: "pointer" }}
                >
                  {copied ? "✓ Invite link copied!" : "Generate & Copy Invite Link"}
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default function MembershipTab({
  applications,
  invites,
  siteUrl,
}: {
  applications: Application[];
  invites: MemberInvite[];
  siteUrl: string;
}) {
  const [inviteName, setInviteName] = useState("");
  const [inviteEmail, setInviteEmail] = useState("");
  const [invitePathway, setInvitePathway] = useState<"personal" | "team">("personal");
  const [generatedUrl, setGeneratedUrl] = useState<string | null>(null);
  const [inviteEmailSent, setInviteEmailSent] = useState(false);
  const [copied, setCopied] = useState(false);
  const [generating, setGenerating] = useState(false);
  const [genError, setGenError] = useState<string | null>(null);

  const pending = applications.filter(a => a.status === "pending");
  const reviewed = applications.filter(a => a.status !== "pending");
  const activeInvites = invites.filter(i => !i.used_at && new Date(i.expires_at) > new Date());
  const usedInvites = invites.filter(i => i.used_at);

  async function handleGenerate(e: React.FormEvent) {
    e.preventDefault();
    setGenerating(true);
    setGenError(null);
    setGeneratedUrl(null);
    setInviteEmailSent(false);
    const fd = new FormData();
    fd.append("recipientName", inviteName);
    fd.append("email", inviteEmail);
    fd.append("pathway", invitePathway);
    const result = await generateMemberInvite(fd);
    setGenerating(false);
    if (result.error) { setGenError(result.error); return; }
    if (result.url) {
      setGeneratedUrl(result.url);
      setInviteEmailSent(result.emailSent ?? false);
      setInviteName("");
      setInviteEmail("");
    }
  }

  async function handleCopy(url: string) {
    await navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  }

  const labelStyle: React.CSSProperties = { fontFamily: "var(--font-montserrat)", fontSize: "0.62rem", fontWeight: 700, letterSpacing: "0.14em", textTransform: "uppercase" as const, color: "oklch(52% 0.008 260)", marginBottom: "0.625rem", display: "block" };
  const inputStyle: React.CSSProperties = { width: "100%", fontFamily: "var(--font-montserrat)", fontSize: "0.875rem", border: "1px solid oklch(82% 0.008 80)", padding: "0.625rem 0.875rem", boxSizing: "border-box" as const, background: "white", color: navy };

  return (
    <div>
      {/* ── PENDING APPLICATIONS ── */}
      <section style={{ marginBottom: "3rem" }}>
        <div style={{ display: "flex", alignItems: "baseline", gap: "0.75rem", marginBottom: "1.25rem" }}>
          <h2 style={{ fontFamily: "var(--font-montserrat)", fontWeight: 700, fontSize: "1rem", color: navy, margin: 0 }}>Applications</h2>
          {pending.length > 0 && (
            <span style={{ fontFamily: "var(--font-montserrat)", fontSize: "0.65rem", fontWeight: 700, color: "white", background: orange, padding: "0.15rem 0.5rem", borderRadius: 3 }}>{pending.length} pending</span>
          )}
        </div>

        {pending.length === 0 && reviewed.length === 0 && (
          <p style={{ fontFamily: "var(--font-montserrat)", fontSize: "0.875rem", color: "oklch(55% 0.008 260)" }}>No applications yet.</p>
        )}

        {pending.map(app => <ApplicationRow key={app.id} app={app} siteUrl={siteUrl} />)}

        {reviewed.length > 0 && (
          <details style={{ marginTop: "1.5rem" }}>
            <summary style={{ fontFamily: "var(--font-montserrat)", fontSize: "0.72rem", fontWeight: 600, color: "oklch(52% 0.008 260)", cursor: "pointer", marginBottom: "0.75rem" }}>
              Reviewed ({reviewed.length})
            </summary>
            {reviewed.map(app => <ApplicationRow key={app.id} app={app} siteUrl={siteUrl} />)}
          </details>
        )}
      </section>

      {/* ── SEND INVITE ── */}
      <section style={{ marginBottom: "3rem" }}>
        <h2 style={{ fontFamily: "var(--font-montserrat)", fontWeight: 700, fontSize: "1rem", color: navy, marginBottom: "1.25rem" }}>Send Invite</h2>
        <form onSubmit={handleGenerate} style={{ background: "white", border: "1px solid oklch(88% 0.008 80)", padding: "1.5rem", maxWidth: "520px" }}>
          <div style={{ display: "flex", gap: "0.75rem", marginBottom: "1rem", flexWrap: "wrap" }}>
            <div style={{ flex: "1 1 140px" }}>
              <label style={labelStyle}>First name (optional)</label>
              <input type="text" value={inviteName} onChange={e => setInviteName(e.target.value)} placeholder="First name" style={inputStyle} />
            </div>
            <div style={{ flex: "2 1 200px" }}>
              <label style={labelStyle}>Email</label>
              <input type="email" value={inviteEmail} onChange={e => setInviteEmail(e.target.value)} placeholder="person@example.com" required style={inputStyle} />
            </div>
          </div>
          <div style={{ marginBottom: "1.25rem" }}>
            <label style={labelStyle}>Access type</label>
            <div style={{ display: "flex", gap: "0.5rem" }}>
              {(["personal", "team"] as const).map(p => (
                <button
                  key={p}
                  type="button"
                  onClick={() => setInvitePathway(p)}
                  style={{
                    fontFamily: "var(--font-montserrat)",
                    fontSize: "0.75rem",
                    fontWeight: 700,
                    padding: "0.4rem 0.875rem",
                    border: `1px solid ${invitePathway === p ? navy : "oklch(82% 0.008 80)"}`,
                    background: invitePathway === p ? navy : "transparent",
                    color: invitePathway === p ? "white" : "oklch(52% 0.008 260)",
                    cursor: "pointer",
                  }}
                >
                  {p === "personal" ? "Personal" : "Team Leader"}
                </button>
              ))}
            </div>
          </div>
          <button
            type="submit"
            disabled={generating}
            style={{ fontFamily: "var(--font-montserrat)", fontWeight: 700, fontSize: "0.8rem", color: "white", background: generating ? "oklch(52% 0.008 260)" : navy, border: "none", padding: "0.625rem 1.25rem", cursor: generating ? "not-allowed" : "pointer" }}
          >
            {generating ? "Sending…" : "Send Invite →"}
          </button>
          {genError && <p style={{ fontFamily: "var(--font-montserrat)", fontSize: "0.8rem", color: "oklch(45% 0.12 25)", marginTop: "0.75rem" }}>{genError}</p>}

          {generatedUrl && (
            <div style={{ marginTop: "1.25rem", padding: "1rem", background: "oklch(94% 0.012 150)", border: "1px solid oklch(75% 0.08 150)" }}>
              <p style={{ fontFamily: "var(--font-montserrat)", fontSize: "0.62rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em", color: "oklch(42% 0.14 150)", marginBottom: "0.5rem" }}>
                {inviteEmailSent ? "Invite sent by email" : "Invite link ready"}
              </p>
              <code style={{ fontFamily: "monospace", fontSize: "0.75rem", color: navy, display: "block", marginBottom: "0.75rem", wordBreak: "break-all" as const }}>{generatedUrl}</code>
              <button
                type="button"
                onClick={() => handleCopy(generatedUrl)}
                style={{ fontFamily: "var(--font-montserrat)", fontWeight: 700, fontSize: "0.75rem", color: copied ? "white" : navy, background: copied ? "oklch(52% 0.14 150)" : "white", border: `1px solid ${navy}`, padding: "0.4rem 0.875rem", cursor: "pointer" }}
              >
                {copied ? "✓ Copied!" : "Copy Link"}
              </button>
            </div>
          )}
        </form>
      </section>

      {/* ── ACTIVE INVITES ── */}
      {activeInvites.length > 0 && (
        <section style={{ marginBottom: "3rem" }}>
          <h2 style={{ fontFamily: "var(--font-montserrat)", fontWeight: 700, fontSize: "1rem", color: navy, marginBottom: "1.25rem" }}>
            Active Invite Links ({activeInvites.length})
          </h2>
          <div style={{ display: "flex", flexDirection: "column", gap: "1px", background: "oklch(88% 0.008 80)" }}>
            {activeInvites.map(invite => {
              const daysLeft = Math.ceil((new Date(invite.expires_at).getTime() - Date.now()) / (1000 * 60 * 60 * 24));
              const url = `${siteUrl}/join/${invite.token}`;
              return (
                <div key={invite.id} style={{ background: "white", padding: "1rem 1.25rem" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "0.625rem", marginBottom: "0.5rem", flexWrap: "wrap" }}>
                    <PathwayBadge pathway={invite.pathway} />
                    {invite.email && <span style={{ fontFamily: "var(--font-montserrat)", fontSize: "0.72rem", color: "oklch(52% 0.008 260)" }}>{invite.email}</span>}
                    <span style={{ fontFamily: "var(--font-montserrat)", fontSize: "0.68rem", color: "oklch(58% 0.008 260)", marginLeft: "auto" }}>{daysLeft}d left</span>
                  </div>
                  <code style={{ fontFamily: "monospace", fontSize: "0.7rem", color: "oklch(38% 0.008 260)", background: "oklch(93% 0.004 80)", padding: "0.2rem 0.5rem", display: "block", marginBottom: "0.625rem", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" as const }}>
                    {url}
                  </code>
                  <div style={{ display: "flex", gap: "0.5rem", alignItems: "center" }}>
                    <button
                      type="button"
                      onClick={() => navigator.clipboard.writeText(url)}
                      style={{ fontFamily: "var(--font-montserrat)", fontSize: "0.7rem", fontWeight: 700, border: `1px solid ${navy}`, background: "transparent", color: navy, padding: "0.35rem 0.75rem", cursor: "pointer" }}
                    >
                      Copy
                    </button>
                    <form action={revokeMemberInvite} style={{ marginLeft: "auto" }}>
                      <input type="hidden" name="inviteId" value={invite.id} />
                      <button type="submit" style={{ fontFamily: "var(--font-montserrat)", fontSize: "0.7rem", background: "none", border: "none", color: "oklch(58% 0.008 260)", cursor: "pointer", padding: "0.35rem 0.5rem" }}>
                        Revoke
                      </button>
                    </form>
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      )}

      {/* ── USED INVITES ── */}
      {usedInvites.length > 0 && (
        <section>
          <p style={{ ...labelStyle, marginBottom: "0.75rem" }}>Used Invites ({usedInvites.length})</p>
          <div style={{ display: "flex", flexDirection: "column", gap: "1px", background: "oklch(88% 0.008 80)" }}>
            {usedInvites.map(invite => (
              <div key={invite.id} style={{ background: "white", padding: "0.875rem 1.25rem", display: "flex", gap: "0.75rem", alignItems: "center", opacity: 0.6, flexWrap: "wrap" }}>
                <PathwayBadge pathway={invite.pathway} />
                <span style={{ fontFamily: "var(--font-montserrat)", fontSize: "0.72rem", color: "oklch(52% 0.008 260)" }}>
                  Used {new Date(invite.used_at!).toLocaleDateString()}
                </span>
                {invite.email && <span style={{ fontFamily: "var(--font-montserrat)", fontSize: "0.72rem", color: "oklch(52% 0.008 260)" }}>{invite.email}</span>}
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}

"use client";

import Link from "next/link";
import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import TeamAssessmentSelector from "../TeamAssessmentSelector";
import { renameTeam, updateTeamMemberProfile, removeTeamMember } from "../team-actions";
import { setTeamLanguage, generateInviteAndGetUrl, sendEmailInvite, deleteInviteLink } from "../actions";
import { TEAM_UI } from "@/lib/team-i18n";

export type SlotMember = {
  id: string;
  name: string;
  email: string;
  title: string | null;
  tenureLabel: string | null;
};

export type PendingInvite = {
  id: string;
  token: string;
  created_at: string;
  expires_at: string;
  recipient_email: string | null;
  recipient_name: string | null;
};

type Lang = "en" | "id";

const SEAT_PRICE_USD = 15;

const COPY = {
  en: {
    eyebrow: "Team Settings",
    back: "← Back to team dashboard",
    teamSection: "Team",
    teamName: "Team name",
    save: "Save",
    saved: "Saved",
    language: "Team language",
    languageHint: "Used for invites and team messages.",
    pathwaySection: "Pathway",
    pathwayHint: "Choose which assessments your team works through.",
    membersSection: "Members",
    membersHint: (total: number) => `Your team has ${total} places. You are number 1. Fill the other places by sending an invite from a slot.`,
    slot: (n: number) => `Slot ${n}`,
    leaderTag: "Team leader (you)",
    memberTag: "Member",
    pendingTag: "Invite pending",
    emptyTag: "Open",
    inviteSentTo: (who: string) => `Invite sent to ${who}`,
    linkCreated: "Invite link created",
    daysLeft: (d: number) => `${d} day${d === 1 ? "" : "s"} left`,
    shareLink: "Share link",
    copied: "Link copied",
    revoke: "Revoke",
    emailInvite: "Send email invite",
    createLink: "Create invite link",
    creating: "Creating…",
    firstName: "First name",
    email: "Email address",
    inviteLanguage: "Invite language",
    send: "Send invite",
    sending: "Sending…",
    cancel: "Cancel",
    edit: "Edit",
    remove: "Remove",
    roleTitle: "Role / title",
    tenure: "Time on the team",
    removeConfirm: (name: string) => `Remove ${name} from the team?`,
    buySection: "Need more seats?",
    buyHint: "Each extra seat adds one open slot to your team.",
    seats: (n: number) => `${n} seat${n === 1 ? "" : "s"}`,
    buy: (n: number, price: number) => `Buy ${n} seat${n === 1 ? "" : "s"} · $${price}`,
    redirecting: "Opening checkout…",
    checkoutSuccess: "Thank you! Your new seats will appear here in a minute. Refresh the page if you don't see them yet.",
    genericError: "Something went wrong. Please try again.",
  },
  id: {
    eyebrow: "Pengaturan Tim",
    back: "← Kembali ke dasbor tim",
    teamSection: "Tim",
    teamName: "Nama tim",
    save: "Simpan",
    saved: "Tersimpan",
    language: "Bahasa tim",
    languageHint: "Dipakai untuk undangan dan pesan tim.",
    pathwaySection: "Jalur",
    pathwayHint: "Pilih asesmen yang akan dikerjakan tim Anda.",
    membersSection: "Anggota",
    membersHint: (total: number) => `Tim Anda memiliki ${total} tempat. Anda nomor 1. Isi tempat lainnya dengan mengirim undangan dari sebuah slot.`,
    slot: (n: number) => `Slot ${n}`,
    leaderTag: "Pemimpin tim (Anda)",
    memberTag: "Anggota",
    pendingTag: "Undangan menunggu",
    emptyTag: "Kosong",
    inviteSentTo: (who: string) => `Undangan dikirim ke ${who}`,
    linkCreated: "Tautan undangan dibuat",
    daysLeft: (d: number) => `${d} hari lagi`,
    shareLink: "Bagikan tautan",
    copied: "Tautan disalin",
    revoke: "Batalkan",
    emailInvite: "Kirim undangan email",
    createLink: "Buat tautan undangan",
    creating: "Membuat…",
    firstName: "Nama depan",
    email: "Alamat email",
    inviteLanguage: "Bahasa undangan",
    send: "Kirim undangan",
    sending: "Mengirim…",
    cancel: "Batal",
    edit: "Ubah",
    remove: "Hapus",
    roleTitle: "Peran / jabatan",
    tenure: "Lama di tim",
    removeConfirm: (name: string) => `Hapus ${name} dari tim?`,
    buySection: "Butuh tempat tambahan?",
    buyHint: "Setiap tempat tambahan menambah satu slot kosong di tim Anda.",
    seats: (n: number) => `${n} tempat`,
    buy: (n: number, price: number) => `Beli ${n} tempat · $${price}`,
    redirecting: "Membuka pembayaran…",
    checkoutSuccess: "Terima kasih! Tempat baru Anda akan muncul di sini dalam satu menit. Muat ulang halaman jika belum terlihat.",
    genericError: "Terjadi kesalahan. Silakan coba lagi.",
  },
} as const;

const navy = "oklch(30% 0.12 260)";
const orange = "oklch(65% 0.15 45)";
const muted = "oklch(52% 0.008 260)";
const errorColor = "oklch(45% 0.12 25)";

const cardStyle: React.CSSProperties = {
  background: "oklch(99% 0.002 80)",
  border: "1px solid oklch(86% 0.008 80)",
  borderRadius: "8px",
  padding: "1.5rem",
};

const sectionLabel: React.CSSProperties = {
  fontFamily: "var(--font-montserrat)",
  fontSize: "0.68rem",
  fontWeight: 800,
  letterSpacing: "0.16em",
  textTransform: "uppercase",
  color: orange,
  marginBottom: "0.5rem",
};

const hintStyle: React.CSSProperties = {
  fontFamily: "var(--font-montserrat)",
  fontSize: "0.85rem",
  lineHeight: 1.6,
  color: muted,
  marginBottom: "1.25rem",
};

const outlineBtn: React.CSSProperties = {
  fontFamily: "var(--font-montserrat)",
  fontSize: "0.72rem",
  fontWeight: 700,
  letterSpacing: "0.06em",
  border: `1px solid ${navy}`,
  background: "transparent",
  color: navy,
  padding: "0.5rem 0.875rem",
  cursor: "pointer",
  borderRadius: "4px",
  whiteSpace: "nowrap",
};

const quietBtn: React.CSSProperties = {
  fontFamily: "var(--font-montserrat)",
  fontSize: "0.72rem",
  background: "none",
  border: "none",
  cursor: "pointer",
  color: muted,
  padding: "0.5rem 0.25rem",
};

function tagStyle(bg: string, fg: string): React.CSSProperties {
  return {
    fontFamily: "var(--font-montserrat)",
    fontSize: "0.6rem",
    fontWeight: 700,
    letterSpacing: "0.1em",
    textTransform: "uppercase",
    background: bg,
    color: fg,
    padding: "0.2rem 0.5rem",
    borderRadius: "3px",
  };
}

export default function TeamSettings({
  team,
  teamLanguage,
  memberSeats,
  members,
  invites,
  leaderName,
  siteUrl,
  showIntro,
  checkoutSuccess,
}: {
  team: { id: string; name: string; selectedAssessments: string[] };
  teamLanguage: Lang;
  memberSeats: number;
  members: SlotMember[];
  invites: PendingInvite[];
  leaderName: string;
  siteUrl: string;
  showIntro: boolean;
  checkoutSuccess: boolean;
}) {
  const router = useRouter();
  const c = COPY[teamLanguage];
  const ui = TEAM_UI[teamLanguage];
  const [isPending, startTransition] = useTransition();

  // ── Team name ──
  const [nameInput, setNameInput] = useState(team.name);
  const [savedName, setSavedName] = useState(team.name);
  const [nameStatus, setNameStatus] = useState<"idle" | "saved" | string>("idle");

  function saveName() {
    const trimmed = nameInput.trim();
    if (!trimmed || trimmed === savedName) return;
    startTransition(async () => {
      const { error } = await renameTeam(team.id, trimmed);
      if (error) { setNameStatus(error); return; }
      setSavedName(trimmed);
      setNameStatus("saved");
      setTimeout(() => setNameStatus("idle"), 2000);
    });
  }

  // ── Language ──
  function changeLanguage(lang: Lang) {
    if (lang === teamLanguage) return;
    const fd = new FormData();
    fd.set("language", lang);
    startTransition(async () => {
      await setTeamLanguage(fd);
      router.refresh();
    });
  }

  // ── Slots ──
  // Slot 1 is the leader. Then filled member slots, then pending invites,
  // then open slots up to memberSeats. Slots are derived, not stored.
  const openCount = Math.max(0, memberSeats - members.length - invites.length);
  const totalPlaces = 1 + Math.max(memberSeats, members.length + invites.length);

  const [openForm, setOpenForm] = useState<number | null>(null);
  const [slotError, setSlotError] = useState<{ slot: number; msg: string } | null>(null);
  const [busySlot, setBusySlot] = useState<number | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  function shareCopy(url: string) {
    const leader = leaderName.trim();
    return {
      title: ui.inviteShareTitle(savedName),
      text: leader ? ui.inviteShareTextWithLeader(leader, savedName) : ui.inviteShareTextNoLeader(savedName),
      url,
    };
  }

  async function shareUrl(url: string, key: string) {
    const data = shareCopy(url);
    if (typeof navigator !== "undefined" && navigator.share && navigator.canShare?.(data)) {
      try {
        await navigator.share(data);
        return;
      } catch {
        // cancelled — fall through to clipboard
      }
    }
    try {
      await navigator.clipboard.writeText(url);
      setCopiedId(key);
      setTimeout(() => setCopiedId(null), 2500);
    } catch { /* ignore */ }
  }

  async function createLink(slot: number) {
    setBusySlot(slot);
    setSlotError(null);
    const { url, error } = await generateInviteAndGetUrl();
    setBusySlot(null);
    if (error || !url) {
      setSlotError({ slot, msg: error ?? c.genericError });
      return;
    }
    await shareUrl(url, `slot-${slot}`);
    router.refresh();
  }

  async function sendEmail(slot: number, formData: FormData) {
    setBusySlot(slot);
    setSlotError(null);
    const result = await sendEmailInvite(formData);
    setBusySlot(null);
    if (result?.error) {
      setSlotError({ slot, msg: result.error });
      return;
    }
    setOpenForm(null);
    router.refresh();
  }

  function revoke(inviteId: string) {
    const fd = new FormData();
    fd.set("inviteId", inviteId);
    startTransition(async () => {
      await deleteInviteLink(fd);
      router.refresh();
    });
  }

  // ── Member edit / remove ──
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editTitle, setEditTitle] = useState("");
  const [editTenure, setEditTenure] = useState("");

  function saveMember(memberId: string) {
    startTransition(async () => {
      const { error } = await updateTeamMemberProfile(team.id, memberId, editTitle, editTenure);
      if (!error) {
        setEditingId(null);
        router.refresh();
      }
    });
  }

  function removeMember(m: SlotMember) {
    if (!confirm(c.removeConfirm(m.name))) return;
    startTransition(async () => {
      const { error } = await removeTeamMember(team.id, m.id);
      if (!error) router.refresh();
    });
  }

  // ── Buy seats ──
  const [seatQty, setSeatQty] = useState(1);
  const [buying, setBuying] = useState(false);
  const [buyError, setBuyError] = useState<string | null>(null);

  async function buySeats() {
    setBuying(true);
    setBuyError(null);
    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type: "seat", quantity: seatQty }),
      });
      const data = await res.json();
      if (data.checkoutUrl) {
        window.location.href = data.checkoutUrl;
        return;
      }
      setBuyError(c.genericError);
    } catch {
      setBuyError(c.genericError);
    }
    setBuying(false);
  }

  let slotNo = 1;

  return (
    <div style={{ background: "oklch(97% 0.005 80)", minHeight: "calc(100dvh - 120px)" }}>
      {/* Header */}
      <div style={{ background: navy, paddingBlock: "2rem", borderBottom: "1px solid oklch(22% 0.10 260)" }}>
        <div className="container-wide" style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "1rem" }}>
          <div>
            <p className="t-label" style={{ color: orange, marginBottom: "0.375rem", fontSize: "0.62rem" }}>
              {c.eyebrow}
            </p>
            <h1 style={{ fontFamily: "var(--font-montserrat)", fontWeight: 800, fontSize: "1.375rem", color: "oklch(97% 0.005 80)" }}>
              {savedName}
            </h1>
          </div>
          <Link href="/dashboard" style={{ fontFamily: "var(--font-montserrat)", fontSize: "0.78rem", fontWeight: 600, letterSpacing: "0.06em", color: "oklch(72% 0.04 260)", textDecoration: "none" }}>
            {c.back}
          </Link>
        </div>
      </div>

      <div className="container-wide" style={{ paddingBlock: "2.5rem", maxWidth: "760px", display: "flex", flexDirection: "column", gap: "2rem" }}>

        {/* ── Team ── */}
        <section style={cardStyle}>
          <p style={sectionLabel}>{c.teamSection}</p>
          <div className="form-field" style={{ marginBottom: "1.25rem" }}>
            <label className="form-label" htmlFor="team-name">{c.teamName}</label>
            <div style={{ display: "flex", gap: "0.625rem", flexWrap: "wrap", alignItems: "center" }}>
              <input
                id="team-name"
                className="form-input"
                value={nameInput}
                maxLength={80}
                onChange={e => setNameInput(e.target.value)}
                onKeyDown={e => { if (e.key === "Enter") saveName(); }}
                style={{ flex: "1 1 220px" }}
              />
              <button
                type="button"
                className="btn-primary"
                onClick={saveName}
                disabled={isPending || !nameInput.trim() || nameInput.trim() === savedName}
                style={{ fontSize: "0.8rem", opacity: nameInput.trim() && nameInput.trim() !== savedName ? 1 : 0.5 }}
              >
                {c.save}
              </button>
              {nameStatus === "saved" && (
                <span style={{ fontFamily: "var(--font-montserrat)", fontSize: "0.78rem", color: "oklch(40% 0.12 145)" }}>{c.saved}</span>
              )}
            </div>
            {nameStatus !== "idle" && nameStatus !== "saved" && (
              <p style={{ fontFamily: "var(--font-montserrat)", fontSize: "0.8rem", color: errorColor, marginTop: "0.5rem" }}>{nameStatus}</p>
            )}
          </div>

          <div className="form-field">
            <span className="form-label">{c.language}</span>
            <div style={{ display: "flex", gap: "0.5rem" }}>
              {(["en", "id"] as const).map(l => (
                <button
                  key={l}
                  type="button"
                  onClick={() => changeLanguage(l)}
                  disabled={isPending}
                  style={{
                    ...outlineBtn,
                    background: teamLanguage === l ? navy : "transparent",
                    color: teamLanguage === l ? "oklch(97% 0.005 80)" : navy,
                  }}
                >
                  {l === "en" ? "English" : "Bahasa Indonesia"}
                </button>
              ))}
            </div>
            <p style={{ ...hintStyle, marginTop: "0.5rem", marginBottom: 0, fontSize: "0.78rem" }}>{c.languageHint}</p>
          </div>
        </section>

        {/* ── Pathway ── */}
        <section>
          <p style={sectionLabel}>{c.pathwaySection}</p>
          <p style={hintStyle}>{c.pathwayHint}</p>
          <TeamAssessmentSelector teamId={team.id} initialSelected={team.selectedAssessments} />
        </section>

        {/* ── Members / slots ── */}
        <section id="members" style={{ scrollMarginTop: "6rem" }}>
          <p style={sectionLabel}>{c.membersSection}</p>
          <p style={hintStyle}>{c.membersHint(totalPlaces)}</p>

          {showIntro && (
            <div style={{ marginBottom: "1.25rem", padding: "1.25rem 1.5rem", background: "oklch(97% 0.010 50)", border: "1px solid oklch(88% 0.030 50)", borderRadius: "6px" }}>
              <p style={{ fontFamily: "var(--font-montserrat)", fontSize: "0.75rem", fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", color: orange, marginBottom: "0.5rem" }}>
                {ui.beforeInviteEyebrow}
              </p>
              <p style={{ fontFamily: "var(--font-montserrat)", fontSize: "0.875rem", lineHeight: 1.6, color: "oklch(18% 0 0)", margin: 0 }}>
                {ui.beforeInviteBody}
              </p>
            </div>
          )}

          <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
            {/* Slot 1 — leader */}
            <SlotTile n={slotNo++} tag={<span style={tagStyle(orange, "white")}>{c.leaderTag}</span>}>
              <p style={nameStyle}>{leaderName}</p>
            </SlotTile>

            {/* Filled member slots */}
            {members.map(m => {
              const n = slotNo++;
              const editing = editingId === m.id;
              return (
                <SlotTile key={m.id} n={n} tag={<span style={tagStyle("oklch(92% 0.03 260)", navy)}>{c.memberTag}</span>}>
                  <p style={nameStyle}>{m.name}</p>
                  <p style={subStyle}>
                    {[m.email, m.title, m.tenureLabel].filter(Boolean).join(" · ")}
                  </p>
                  {editing ? (
                    <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem", marginTop: "0.875rem" }}>
                      <input className="form-input" placeholder={c.roleTitle} value={editTitle} onChange={e => setEditTitle(e.target.value)} maxLength={80} />
                      <input className="form-input" placeholder={c.tenure} value={editTenure} onChange={e => setEditTenure(e.target.value)} maxLength={40} />
                      <div style={{ display: "flex", gap: "0.5rem" }}>
                        <button type="button" className="btn-primary" style={{ fontSize: "0.78rem" }} disabled={isPending} onClick={() => saveMember(m.id)}>{c.save}</button>
                        <button type="button" style={quietBtn} onClick={() => setEditingId(null)}>{c.cancel}</button>
                      </div>
                    </div>
                  ) : (
                    <div style={{ display: "flex", gap: "0.625rem", marginTop: "0.875rem", flexWrap: "wrap" }}>
                      <button type="button" style={outlineBtn} onClick={() => { setEditingId(m.id); setEditTitle(m.title ?? ""); setEditTenure(m.tenureLabel ?? ""); }}>{c.edit}</button>
                      <button type="button" style={{ ...quietBtn, marginLeft: "auto", color: errorColor }} disabled={isPending} onClick={() => removeMember(m)}>{c.remove}</button>
                    </div>
                  )}
                </SlotTile>
              );
            })}

            {/* Pending invite slots */}
            {invites.map(inv => {
              const n = slotNo++;
              const daysLeft = Math.max(0, Math.ceil((new Date(inv.expires_at).getTime() - Date.now()) / 86400000));
              const who = inv.recipient_name?.trim() || inv.recipient_email;
              const url = `${siteUrl}/invite/${inv.token}`;
              return (
                <SlotTile key={inv.id} n={n} tag={<span style={tagStyle("oklch(94% 0.05 80)", "oklch(45% 0.10 70)")}>{c.pendingTag}</span>}>
                  <p style={nameStyle}>{who ? c.inviteSentTo(who) : c.linkCreated}</p>
                  <p style={subStyle}>
                    {[inv.recipient_name && inv.recipient_email ? inv.recipient_email : null, c.daysLeft(daysLeft)].filter(Boolean).join(" · ")}
                  </p>
                  <div style={{ display: "flex", gap: "0.625rem", marginTop: "0.875rem", flexWrap: "wrap", alignItems: "center" }}>
                    <button
                      type="button"
                      style={{ ...outlineBtn, background: copiedId === inv.id ? navy : "transparent", color: copiedId === inv.id ? "oklch(97% 0.005 80)" : navy }}
                      onClick={() => shareUrl(url, inv.id)}
                    >
                      {copiedId === inv.id ? c.copied : c.shareLink}
                    </button>
                    <button type="button" style={{ ...quietBtn, marginLeft: "auto" }} disabled={isPending} onClick={() => revoke(inv.id)}>{c.revoke}</button>
                  </div>
                </SlotTile>
              );
            })}

            {/* Open slots */}
            {Array.from({ length: openCount }).map(() => {
              const n = slotNo++;
              const busy = busySlot === n;
              const formOpen = openForm === n;
              return (
                <SlotTile key={`open-${n}`} n={n} dashed tag={<span style={tagStyle("oklch(93% 0.004 80)", muted)}>{c.emptyTag}</span>}>
                  {formOpen ? (
                    <form
                      action={fd => sendEmail(n, fd)}
                      style={{ display: "flex", flexDirection: "column", gap: "0.625rem" }}
                    >
                      <div style={{ display: "flex", gap: "0.625rem", flexWrap: "wrap" }}>
                        <input className="form-input" type="text" name="recipientName" placeholder={c.firstName} aria-label={c.firstName} style={{ flex: "1 1 140px" }} />
                        <input className="form-input" type="email" name="email" placeholder={c.email} aria-label={c.email} required style={{ flex: "2 1 200px" }} />
                      </div>
                      <div className="form-field">
                        <label className="form-label" htmlFor={`lang-${n}`}>{c.inviteLanguage}</label>
                        <select className="form-input" id={`lang-${n}`} name="language" defaultValue={teamLanguage} style={{ maxWidth: "220px" }}>
                          <option value="en">English</option>
                          <option value="id">Bahasa Indonesia</option>
                        </select>
                      </div>
                      <div style={{ display: "flex", gap: "0.5rem", alignItems: "center" }}>
                        <button type="submit" className="btn-primary" disabled={busy} style={{ fontSize: "0.8rem", opacity: busy ? 0.7 : 1 }}>
                          {busy ? c.sending : c.send}
                        </button>
                        <button type="button" style={quietBtn} onClick={() => { setOpenForm(null); setSlotError(null); }}>{c.cancel}</button>
                      </div>
                    </form>
                  ) : (
                    <div style={{ display: "flex", gap: "0.625rem", flexWrap: "wrap" }}>
                      <button type="button" style={outlineBtn} disabled={busySlot !== null} onClick={() => { setOpenForm(n); setSlotError(null); }}>
                        {c.emailInvite}
                      </button>
                      <button type="button" style={outlineBtn} disabled={busySlot !== null} onClick={() => createLink(n)}>
                        {busy ? c.creating : copiedId === `slot-${n}` ? c.copied : c.createLink}
                      </button>
                    </div>
                  )}
                  {slotError?.slot === n && (
                    <p style={{ fontFamily: "var(--font-montserrat)", fontSize: "0.8rem", color: errorColor, marginTop: "0.625rem" }}>{slotError.msg}</p>
                  )}
                </SlotTile>
              );
            })}
          </div>
        </section>

        {/* ── Buy more seats ── */}
        <section style={cardStyle}>
          <p style={sectionLabel}>{c.buySection}</p>
          <p style={hintStyle}>{c.buyHint}</p>
          {checkoutSuccess && (
            <p style={{ fontFamily: "var(--font-montserrat)", fontSize: "0.85rem", color: "oklch(40% 0.12 145)", padding: "0.875rem 1rem", background: "oklch(95% 0.03 145)", border: "1px solid oklch(80% 0.06 145)", borderRadius: "6px", marginBottom: "1.25rem" }}>
              {c.checkoutSuccess}
            </p>
          )}
          <div style={{ display: "flex", gap: "1rem", alignItems: "center", flexWrap: "wrap" }}>
            <div style={{ display: "flex", alignItems: "center", border: "1px solid oklch(86% 0.008 80)", borderRadius: "4px" }}>
              <button type="button" aria-label="-" onClick={() => setSeatQty(q => Math.max(1, q - 1))} style={stepBtn}>−</button>
              <span style={{ fontFamily: "var(--font-montserrat)", fontWeight: 700, fontSize: "0.85rem", minWidth: "5.5rem", textAlign: "center", color: navy }}>
                {c.seats(seatQty)}
              </span>
              <button type="button" aria-label="+" onClick={() => setSeatQty(q => Math.min(50, q + 1))} style={stepBtn}>+</button>
            </div>
            <button type="button" className="btn-primary" onClick={buySeats} disabled={buying} style={{ fontSize: "0.85rem", opacity: buying ? 0.7 : 1 }}>
              {buying ? c.redirecting : c.buy(seatQty, seatQty * SEAT_PRICE_USD)}
            </button>
          </div>
          {buyError && (
            <p style={{ fontFamily: "var(--font-montserrat)", fontSize: "0.8rem", color: errorColor, marginTop: "0.75rem" }}>{buyError}</p>
          )}
        </section>
      </div>
    </div>
  );
}

const nameStyle: React.CSSProperties = {
  fontFamily: "var(--font-montserrat)",
  fontWeight: 700,
  fontSize: "0.95rem",
  color: "oklch(22% 0.005 260)",
  margin: 0,
};

const subStyle: React.CSSProperties = {
  fontFamily: "var(--font-montserrat)",
  fontSize: "0.78rem",
  color: muted,
  margin: "0.25rem 0 0",
  wordBreak: "break-word",
};

const stepBtn: React.CSSProperties = {
  background: "none",
  border: "none",
  cursor: "pointer",
  fontSize: "1.1rem",
  color: navy,
  padding: "0.4rem 0.75rem",
};

function SlotTile({
  n,
  tag,
  dashed = false,
  children,
}: {
  n: number;
  tag: React.ReactNode;
  dashed?: boolean;
  children: React.ReactNode;
}) {
  return (
    <div style={{
      display: "flex",
      gap: "1rem",
      alignItems: "flex-start",
      background: dashed ? "transparent" : "oklch(99% 0.002 80)",
      border: dashed ? "1.5px dashed oklch(80% 0.01 80)" : "1px solid oklch(86% 0.008 80)",
      borderRadius: "8px",
      padding: "1.125rem 1.25rem",
    }}>
      <div style={{
        flexShrink: 0,
        width: "2.25rem",
        height: "2.25rem",
        borderRadius: "50%",
        background: dashed ? "oklch(93% 0.004 80)" : navy,
        color: dashed ? muted : "oklch(97% 0.005 80)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontFamily: "var(--font-montserrat)",
        fontWeight: 800,
        fontSize: "0.85rem",
      }}>
        {n}
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "0.5rem" }}>
          <span className="t-label" style={{ fontSize: "0.6rem", color: muted }}>Slot {n}</span>
          {tag}
        </div>
        {children}
      </div>
    </div>
  );
}

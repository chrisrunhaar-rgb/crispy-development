"use client";

import { useState, useTransition } from "react";
import { submitModuleComment, deleteModuleComment } from "@/app/(marketing)/resources/actions";
import type { ModuleComment } from "./ModuleComments";
import { useLanguage } from "@/lib/LanguageContext";

const FONT = "var(--font-montserrat)";
const CORMORANT = "var(--font-cormorant), 'Cormorant Garamond', Georgia, serif";
const navy = "oklch(22% 0.10 260)";
const orange = "oklch(65% 0.15 45)";
const bodyText = "oklch(38% 0.05 260)";

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" });
}

export default function ModuleCommentsClient({
  slug,
  userId,
  hasPaidAccess,
  isLoggedIn,
  publishedComments,
  myComment,
}: {
  slug: string;
  userId: string | null;
  hasPaidAccess: boolean;
  isLoggedIn: boolean;
  publishedComments: ModuleComment[];
  myComment: ModuleComment | null;
}) {
  const { lang: ctxLang } = useLanguage();
  const isId = ctxLang === "id";
  const tr = (en: string, id: string) => (isId ? id : en);

  const [comment, setComment] = useState("");
  const [submitted, setSubmitted] = useState(!!myComment);
  const [currentComment, setCurrentComment] = useState<ModuleComment | null>(myComment);
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();
  const [isDeleting, startDeleting] = useTransition();

  function handleSubmit(visibility: "private" | "public_pending") {
    if (!comment.trim()) return;
    setError(null);
    startTransition(async () => {
      const result = await submitModuleComment(slug, comment.trim(), visibility);
      if (result.error) {
        setError(result.error);
      } else {
        setSubmitted(true);
        setCurrentComment({
          id: "pending",
          user_id: userId ?? "",
          comment: comment.trim(),
          visibility,
          status: "active",
          admin_reply: null,
          reply_seen: false,
          created_at: new Date().toISOString(),
          display_name: null,
        });
        setComment("");
      }
    });
  }

  function handleDelete() {
    if (!currentComment) return;
    startDeleting(async () => {
      const result = await deleteModuleComment(currentComment.id);
      if (!result.error) {
        setSubmitted(false);
        setCurrentComment(null);
      }
    });
  }

  const hasPublished = hasPaidAccess && publishedComments.length > 0;
  const showSection = isLoggedIn || hasPublished;

  if (!showSection) return null;

  return (
    <div style={{ fontFamily: FONT }}>

      {/* Section header */}
      <p style={{
        color: orange,
        fontFamily: FONT,
        fontSize: 11,
        fontWeight: 700,
        letterSpacing: "0.14em",
        textTransform: "uppercase",
        margin: "0 0 12px",
      }}>
        {tr("From the Field", "Dari Lapangan")}
      </p>
      <h2 style={{
        fontFamily: CORMORANT,
        fontSize: "clamp(26px, 3.5vw, 36px)",
        fontWeight: 600,
        color: navy,
        margin: "0 0 12px",
        lineHeight: 1.2,
      }}>
        {tr("What's working in your context?", "Apa yang berhasil dalam konteks Anda?")}
      </h2>
      <p style={{
        fontFamily: FONT,
        fontSize: 15,
        color: bodyText,
        lineHeight: 1.75,
        margin: "0 0 32px",
        maxWidth: 560,
      }}>
        {tr(
          "Share what you tried, what surprised you, and what you would pass on to someone just starting.",
          "Bagikan apa yang Anda coba, apa yang mengejutkan Anda, dan apa yang akan Anda teruskan kepada seseorang yang baru memulai."
        )}
        {hasPublished && " " + tr("Below are reflections from others in the Crispy community.", "Berikut adalah refleksi dari anggota komunitas Crispy lainnya.")}
      </p>

      <div style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>

        {/* Admin reply to current user */}
        {currentComment?.admin_reply && (
          <div style={{
            padding: "1rem 1.25rem",
            background: "oklch(65% 0.15 45 / 0.06)",
            border: "1px solid oklch(65% 0.15 45 / 0.22)",
          }}>
            <p style={{
              fontFamily: FONT,
              fontSize: 11,
              fontWeight: 700,
              letterSpacing: "0.1em",
              textTransform: "uppercase",
              color: "oklch(45% 0.12 45)",
              margin: "0 0 8px",
            }}>
              {tr("Reply from Crispy", "Balasan dari Crispy")}
            </p>
            <p style={{
              fontFamily: FONT,
              fontSize: "0.875rem",
              color: "oklch(28% 0.008 260)",
              lineHeight: 1.7,
              margin: 0,
            }}>
              {currentComment.admin_reply}
            </p>
          </div>
        )}

        {/* Published community comments */}
        {hasPublished && (
          <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
            {publishedComments.map(entry => (
              <div key={entry.id} style={{
                padding: "1rem 1.25rem",
                background: "white",
                border: "1px solid oklch(90% 0.004 80)",
              }}>
                <div style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  gap: "0.5rem",
                  marginBottom: "0.5rem",
                }}>
                  <span style={{
                    fontFamily: FONT,
                    fontSize: "0.72rem",
                    fontWeight: 700,
                    color: navy,
                  }}>
                    {entry.display_name ?? tr("Community member", "Anggota komunitas")}
                  </span>
                  <span style={{
                    fontFamily: FONT,
                    fontSize: "0.65rem",
                    color: "oklch(58% 0.005 260)",
                  }}>
                    {formatDate(entry.created_at)}
                  </span>
                </div>
                <p style={{
                  fontFamily: FONT,
                  fontSize: "0.875rem",
                  color: bodyText,
                  lineHeight: 1.7,
                  margin: 0,
                }}>
                  {entry.comment}
                </p>
              </div>
            ))}
          </div>
        )}

        {/* User's own submitted comment */}
        {submitted && currentComment && (
          <div style={{
            padding: "1rem 1.25rem",
            background: "oklch(65% 0.15 45 / 0.05)",
            border: "1px solid oklch(65% 0.15 45 / 0.18)",
          }}>
            <div style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              gap: "0.5rem",
              marginBottom: "0.5rem",
            }}>
              <span style={{
                fontFamily: FONT,
                fontSize: "0.72rem",
                fontWeight: 700,
                color: "oklch(42% 0.12 260)",
              }}>
                {tr("Your reflection", "Refleksi Anda")}
                {currentComment.visibility === "private"
                  ? " · " + tr("Sent to Crispy", "Terkirim ke Crispy")
                  : currentComment.visibility === "public_pending"
                  ? " · " + tr("Pending approval", "Menunggu persetujuan")
                  : " · " + tr("Published", "Diterbitkan")}
              </span>
              <button
                type="button"
                onClick={handleDelete}
                disabled={isDeleting}
                style={{
                  fontFamily: FONT,
                  fontSize: "0.65rem",
                  color: "oklch(52% 0.06 20)",
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                  padding: 0,
                  opacity: isDeleting ? 0.5 : 1,
                  textDecoration: "underline",
                  textUnderlineOffset: "3px",
                }}
              >
                {isDeleting ? tr("Removing…", "Menghapus…") : tr("Remove", "Hapus")}
              </button>
            </div>
            <p style={{
              fontFamily: FONT,
              fontSize: "0.875rem",
              color: bodyText,
              lineHeight: 1.7,
              margin: 0,
            }}>
              {currentComment.comment}
            </p>
          </div>
        )}

        {/* Submit form */}
        {isLoggedIn && !submitted && (
          <div style={{ display: "flex", flexDirection: "column", gap: "0.875rem" }}>
            <textarea
              value={comment}
              onChange={e => setComment(e.target.value)}
              placeholder={tr("What has this looked like in your context? What worked, what surprised you?", "Bagaimana ini terlihat dalam konteks Anda? Apa yang berhasil, apa yang mengejutkan Anda?")}
              rows={4}
              style={{
                width: "100%",
                fontFamily: FONT,
                fontSize: "0.9rem",
                color: "oklch(22% 0.005 260)",
                border: "1px solid oklch(82% 0.008 80)",
                padding: "0.75rem 0.875rem",
                resize: "vertical",
                outline: "none",
                lineHeight: 1.65,
                background: "white",
                boxSizing: "border-box",
              }}
            />

            {error && (
              <p style={{
                fontFamily: FONT,
                fontSize: "0.75rem",
                color: "oklch(50% 0.18 20)",
                margin: 0,
              }}>
                {error}
              </p>
            )}

            <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap" }}>
              <button
                type="button"
                onClick={() => handleSubmit("public_pending")}
                disabled={isPending || !comment.trim()}
                style={{
                  fontFamily: FONT,
                  fontSize: "0.68rem",
                  fontWeight: 700,
                  letterSpacing: "0.05em",
                  padding: "0.45rem 1.125rem",
                  background: navy,
                  color: "white",
                  border: `1px solid ${navy}`,
                  borderRadius: 8,
                  cursor: isPending || !comment.trim() ? "default" : "pointer",
                  opacity: isPending || !comment.trim() ? 0.5 : 1,
                  transition: "opacity 0.15s",
                }}
              >
                {isPending ? tr("Sending…", "Mengirim…") : tr("Share with Community", "Bagikan ke Komunitas")}
              </button>
              <button
                type="button"
                onClick={() => handleSubmit("private")}
                disabled={isPending || !comment.trim()}
                style={{
                  fontFamily: FONT,
                  fontSize: "0.68rem",
                  fontWeight: 700,
                  letterSpacing: "0.05em",
                  padding: "0.45rem 1.125rem",
                  background: "transparent",
                  color: "oklch(42% 0.008 260)",
                  border: "1px solid oklch(82% 0.008 80)",
                  borderRadius: 8,
                  cursor: isPending || !comment.trim() ? "default" : "pointer",
                  opacity: isPending || !comment.trim() ? 0.5 : 1,
                  transition: "opacity 0.15s",
                }}
              >
                {isPending ? tr("Sending…", "Mengirim…") : tr("Send to Crispy", "Kirim ke Crispy")}
              </button>
            </div>
          </div>
        )}

        {!isLoggedIn && (
          <p style={{
            fontFamily: FONT,
            fontSize: "0.875rem",
            color: bodyText,
            margin: 0,
            lineHeight: 1.65,
          }}>
            <a
              href="/login"
              style={{
                color: "oklch(42% 0.12 260)",
                fontWeight: 700,
                textDecoration: "underline",
                textUnderlineOffset: "3px",
              }}
            >
              {tr("Sign in", "Masuk")}
            </a>{" "}
            {tr("to share your field experience.", "untuk berbagi pengalaman lapangan Anda.")}
          </p>
        )}

      </div>
    </div>
  );
}

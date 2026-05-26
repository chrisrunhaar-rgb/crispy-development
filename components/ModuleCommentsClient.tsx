"use client";

import { useState, useTransition } from "react";
import { submitModuleComment, deleteModuleComment } from "@/app/(marketing)/resources/actions";
import type { ModuleComment } from "./ModuleComments";

const FONT = "var(--font-montserrat)";

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
  const [open, setOpen] = useState(false);
  const [comment, setComment] = useState("");
  const [visibility, setVisibility] = useState<"private" | "public_pending">("public_pending");
  const [submitted, setSubmitted] = useState(!!myComment);
  const [currentComment, setCurrentComment] = useState<ModuleComment | null>(myComment);
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();
  const [isDeleting, startDeleting] = useTransition();

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    startTransition(async () => {
      const result = await submitModuleComment(slug, comment, visibility);
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

  const hasContent = hasPaidAccess && publishedComments.length > 0;
  const showSection = isLoggedIn || hasContent;

  if (!showSection) return null;

  return (
    <div style={{ fontFamily: FONT }}>
      {/* Section toggle */}
      <button
        type="button"
        onClick={() => setOpen(v => !v)}
        style={{
          display: "flex",
          alignItems: "center",
          gap: "0.5rem",
          background: "none",
          border: "none",
          cursor: "pointer",
          padding: 0,
          marginBottom: open ? "1.5rem" : 0,
        }}
      >
        <span style={{
          fontSize: "0.58rem",
          fontWeight: 700,
          letterSpacing: "0.13em",
          textTransform: "uppercase",
          color: "oklch(54% 0.008 260)",
        }}>
          From the Field
        </span>
        {hasPaidAccess && publishedComments.length > 0 && (
          <span style={{
            fontSize: "0.6rem",
            fontWeight: 700,
            background: "oklch(65% 0.15 45 / 0.12)",
            color: "oklch(45% 0.12 45)",
            padding: "1px 6px",
            borderRadius: "10px",
          }}>
            {publishedComments.length}
          </span>
        )}
        <span style={{
          fontSize: "0.65rem",
          color: "oklch(62% 0.006 260)",
          marginLeft: "auto",
          transition: "transform 0.2s",
          transform: open ? "rotate(180deg)" : "none",
          display: "inline-block",
        }}>▾</span>
      </button>

      {open && (
        <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>

          {/* Admin reply to user */}
          {currentComment?.admin_reply && (
            <div style={{
              padding: "0.875rem 1rem",
              background: "oklch(65% 0.15 45 / 0.06)",
              border: "1px solid oklch(65% 0.15 45 / 0.25)",
            }}>
              <p style={{
                fontSize: "0.6rem",
                fontWeight: 700,
                letterSpacing: "0.08em",
                textTransform: "uppercase",
                color: "oklch(45% 0.12 45)",
                marginBottom: "0.375rem",
              }}>
                Reply from Crispy
              </p>
              <p style={{ fontSize: "0.8rem", color: "oklch(28% 0.008 260)", lineHeight: 1.65, margin: 0 }}>
                {currentComment.admin_reply}
              </p>
            </div>
          )}

          {/* Published community comments */}
          {hasPaidAccess && publishedComments.length > 0 && (
            <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
              {publishedComments.map(entry => (
                <div key={entry.id} style={{
                  padding: "0.875rem 1rem",
                  background: "oklch(98% 0.003 80)",
                  border: "1px solid oklch(90% 0.004 80)",
                }}>
                  <div style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    marginBottom: "0.375rem",
                    gap: "0.5rem",
                  }}>
                    <span style={{
                      fontSize: "0.68rem",
                      fontWeight: 700,
                      color: "oklch(38% 0.008 260)",
                    }}>
                      {entry.display_name ?? "Community member"}
                    </span>
                    <span style={{ fontSize: "0.62rem", color: "oklch(58% 0.005 260)" }}>
                      {formatDate(entry.created_at)}
                    </span>
                  </div>
                  <p style={{
                    fontSize: "0.8rem",
                    color: "oklch(32% 0.008 260)",
                    lineHeight: 1.65,
                    margin: 0,
                  }}>
                    {entry.comment}
                  </p>
                </div>
              ))}
            </div>
          )}

          {/* My submitted comment */}
          {submitted && currentComment && (
            <div style={{
              padding: "0.875rem 1rem",
              background: "oklch(65% 0.15 45 / 0.05)",
              border: "1px solid oklch(65% 0.15 45 / 0.18)",
            }}>
              <div style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: "0.375rem",
                gap: "0.5rem",
              }}>
                <span style={{
                  fontSize: "0.68rem",
                  fontWeight: 700,
                  color: "oklch(42% 0.12 260)",
                }}>
                  Your reflection
                  {currentComment.visibility === "private"
                    ? " · Sent to Crispy"
                    : currentComment.visibility === "public_pending"
                    ? " · Pending approval"
                    : " · Published"}
                </span>
                <button
                  type="button"
                  onClick={handleDelete}
                  disabled={isDeleting}
                  style={{
                    fontSize: "0.62rem",
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
                  {isDeleting ? "Removing…" : "Remove"}
                </button>
              </div>
              <p style={{
                fontSize: "0.8rem",
                color: "oklch(32% 0.008 260)",
                lineHeight: 1.65,
                margin: 0,
              }}>
                {currentComment.comment}
              </p>
            </div>
          )}

          {/* Submit form */}
          {isLoggedIn && !submitted && (
            <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
              <p style={{
                fontSize: "0.62rem",
                fontWeight: 700,
                color: "oklch(52% 0.008 260)",
                letterSpacing: "0.05em",
                margin: 0,
              }}>
                Share from the field
              </p>
              <textarea
                value={comment}
                onChange={e => setComment(e.target.value)}
                placeholder="What has this looked like in your context? What worked, what surprised you?"
                required
                rows={3}
                style={{
                  width: "100%",
                  fontFamily: FONT,
                  fontSize: "0.8125rem",
                  color: "oklch(22% 0.005 260)",
                  border: "1px solid oklch(82% 0.008 80)",
                  padding: "0.625rem 0.75rem",
                  resize: "vertical",
                  outline: "none",
                  lineHeight: 1.6,
                  background: "white",
                  boxSizing: "border-box",
                }}
              />

              {/* Visibility selector */}
              <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap" }}>
                {(["public_pending", "private"] as const).map(v => (
                  <button
                    key={v}
                    type="button"
                    onClick={() => setVisibility(v)}
                    style={{
                      fontFamily: FONT,
                      fontSize: "0.65rem",
                      fontWeight: 700,
                      letterSpacing: "0.05em",
                      padding: "0.375rem 0.875rem",
                      border: `1px solid ${visibility === v ? "oklch(42% 0.12 260)" : "oklch(82% 0.008 80)"}`,
                      background: visibility === v ? "oklch(42% 0.12 260)" : "transparent",
                      color: visibility === v ? "white" : "oklch(52% 0.008 260)",
                      cursor: "pointer",
                      transition: "all 0.15s",
                    }}
                  >
                    {v === "public_pending" ? "Share with Community" : "Send to Crispy"}
                  </button>
                ))}
              </div>

              <p style={{
                fontSize: "0.65rem",
                color: "oklch(58% 0.006 260)",
                margin: 0,
                lineHeight: 1.5,
              }}>
                {visibility === "public_pending"
                  ? "Submitted for review — published on approval, visible to paid members."
                  : "Private — only shared with the Crispy team. We may reply."}
              </p>

              {error && (
                <p style={{ fontSize: "0.72rem", color: "oklch(50% 0.18 20)", margin: 0 }}>{error}</p>
              )}

              <div>
                <button
                  type="submit"
                  disabled={isPending || !comment.trim()}
                  style={{
                    fontFamily: FONT,
                    fontSize: "0.68rem",
                    fontWeight: 700,
                    letterSpacing: "0.07em",
                    textTransform: "uppercase",
                    background: "oklch(30% 0.12 260)",
                    color: "white",
                    border: "none",
                    padding: "0.55rem 1.25rem",
                    cursor: isPending || !comment.trim() ? "default" : "pointer",
                    opacity: isPending || !comment.trim() ? 0.5 : 1,
                    transition: "opacity 0.15s",
                  }}
                >
                  {isPending ? "Sending…" : "Submit"}
                </button>
              </div>
            </form>
          )}

          {!isLoggedIn && (
            <p style={{
              fontSize: "0.75rem",
              color: "oklch(52% 0.006 260)",
              margin: 0,
            }}>
              <a href="/login" style={{ color: "oklch(42% 0.12 260)", fontWeight: 700 }}>Sign in</a> to share your field experience.
            </p>
          )}
        </div>
      )}
    </div>
  );
}

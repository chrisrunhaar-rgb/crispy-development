"use client";

import { useState, useTransition } from "react";
import { adminPublishComment, adminReplyToComment, adminDeleteComment } from "./actions";

const FONT = "var(--font-montserrat)";

type CommentRow = {
  id: string;
  user_id: string;
  module_slug: string;
  comment: string;
  visibility: string;
  status: string;
  admin_reply: string | null;
  display_name: string | null;
  created_at: string;
  published_at: string | null;
};

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" });
}

function slugToTitle(slug: string) {
  return slug.replace(/-/g, " ").replace(/\b\w/g, c => c.toUpperCase());
}

function VisibilityBadge({ v }: { v: string }) {
  const map: Record<string, { label: string; bg: string; color: string }> = {
    private: { label: "Private", bg: "oklch(90% 0.004 80)", color: "oklch(42% 0.008 260)" },
    public_pending: { label: "Pending", bg: "oklch(92% 0.12 80)", color: "oklch(42% 0.12 70)" },
    public_published: { label: "Published", bg: "oklch(88% 0.10 145)", color: "oklch(35% 0.14 145)" },
  };
  const s = map[v] ?? map.private;
  return (
    <span style={{
      fontSize: "0.6rem",
      fontWeight: 700,
      letterSpacing: "0.06em",
      textTransform: "uppercase",
      background: s.bg,
      color: s.color,
      padding: "2px 6px",
      borderRadius: "2px",
    }}>
      {s.label}
    </span>
  );
}

function CommentCard({ comment, onAction }: { comment: CommentRow; onAction: () => void }) {
  const [replyText, setReplyText] = useState(comment.admin_reply ?? "");
  const [showReply, setShowReply] = useState(false);
  const [isPub, startPub] = useTransition();
  const [isRep, startRep] = useTransition();
  const [isDel, startDel] = useTransition();

  function publish() {
    startPub(async () => {
      await adminPublishComment(comment.id);
      onAction();
    });
  }

  function sendReply() {
    if (!replyText.trim()) return;
    startRep(async () => {
      await adminReplyToComment(comment.id, replyText, comment.module_slug);
      setShowReply(false);
      onAction();
    });
  }

  function remove() {
    if (!confirm("Delete this comment?")) return;
    startDel(async () => {
      await adminDeleteComment(comment.id);
      onAction();
    });
  }

  return (
    <div style={{
      padding: "1rem",
      background: "white",
      border: "1px solid oklch(90% 0.004 80)",
      borderLeft: comment.visibility === "public_pending" ? "3px solid oklch(65% 0.15 45)" : "1px solid oklch(90% 0.004 80)",
      display: "flex",
      flexDirection: "column",
      gap: "0.625rem",
    }}>
      <div style={{ display: "flex", alignItems: "center", gap: "0.625rem", flexWrap: "wrap" }}>
        <span style={{ fontFamily: FONT, fontWeight: 700, fontSize: "0.75rem", color: "oklch(28% 0.008 260)" }}>
          {comment.display_name ?? "Anonymous"}
        </span>
        <VisibilityBadge v={comment.visibility} />
        <a
          href={`/resources/${comment.module_slug}`}
          target="_blank"
          style={{ fontFamily: FONT, fontSize: "0.65rem", color: "oklch(42% 0.12 260)", textDecoration: "underline" }}
        >
          {slugToTitle(comment.module_slug)}
        </a>
        <span style={{ fontFamily: FONT, fontSize: "0.65rem", color: "oklch(58% 0.005 260)", marginLeft: "auto" }}>
          {formatDate(comment.created_at)}
        </span>
      </div>

      <p style={{ fontFamily: FONT, fontSize: "0.82rem", color: "oklch(28% 0.008 260)", lineHeight: 1.65, margin: 0 }}>
        {comment.comment}
      </p>

      {comment.admin_reply && (
        <div style={{
          padding: "0.5rem 0.75rem",
          background: "oklch(65% 0.15 45 / 0.06)",
          border: "1px solid oklch(65% 0.15 45 / 0.2)",
          fontFamily: FONT,
          fontSize: "0.75rem",
          color: "oklch(35% 0.008 260)",
          lineHeight: 1.55,
        }}>
          <span style={{ fontWeight: 700, marginRight: "0.5rem" }}>Your reply:</span>
          {comment.admin_reply}
        </div>
      )}

      {showReply && (
        <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
          <textarea
            value={replyText}
            onChange={e => setReplyText(e.target.value)}
            rows={3}
            placeholder="Reply to this member…"
            style={{
              fontFamily: FONT,
              fontSize: "0.8rem",
              border: "1px solid oklch(82% 0.008 80)",
              padding: "0.5rem 0.625rem",
              resize: "vertical",
              outline: "none",
              color: "oklch(22% 0.005 260)",
              lineHeight: 1.55,
            }}
          />
          <div style={{ display: "flex", gap: "0.5rem" }}>
            <button
              type="button"
              onClick={sendReply}
              disabled={isRep || !replyText.trim()}
              style={{
                fontFamily: FONT, fontSize: "0.68rem", fontWeight: 700, letterSpacing: "0.06em",
                textTransform: "uppercase", background: "oklch(30% 0.12 260)", color: "white",
                border: "none", padding: "0.45rem 1rem", cursor: "pointer",
                opacity: isRep || !replyText.trim() ? 0.5 : 1,
              }}
            >
              {isRep ? "Sending…" : "Send Reply"}
            </button>
            <button
              type="button"
              onClick={() => setShowReply(false)}
              style={{
                fontFamily: FONT, fontSize: "0.68rem", background: "none", border: "none",
                color: "oklch(52% 0.008 260)", cursor: "pointer", padding: 0,
              }}
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      <div style={{ display: "flex", gap: "0.625rem", flexWrap: "wrap" }}>
        {comment.visibility === "public_pending" && (
          <button
            type="button"
            onClick={publish}
            disabled={isPub}
            style={{
              fontFamily: FONT, fontSize: "0.65rem", fontWeight: 700, letterSpacing: "0.06em",
              textTransform: "uppercase", background: "oklch(35% 0.14 145)", color: "white",
              border: "none", padding: "0.35rem 0.875rem", cursor: "pointer",
              opacity: isPub ? 0.5 : 1,
            }}
          >
            {isPub ? "Publishing…" : "Publish"}
          </button>
        )}
        {!showReply && (
          <button
            type="button"
            onClick={() => setShowReply(true)}
            style={{
              fontFamily: FONT, fontSize: "0.65rem", fontWeight: 700, letterSpacing: "0.06em",
              textTransform: "uppercase", background: "transparent",
              border: "1px solid oklch(82% 0.008 80)", color: "oklch(42% 0.008 260)",
              padding: "0.35rem 0.875rem", cursor: "pointer",
            }}
          >
            {comment.admin_reply ? "Edit Reply" : "Reply"}
          </button>
        )}
        <button
          type="button"
          onClick={remove}
          disabled={isDel}
          style={{
            fontFamily: FONT, fontSize: "0.65rem", color: "oklch(52% 0.06 20)",
            background: "none", border: "none", cursor: "pointer", padding: 0,
            textDecoration: "underline", textUnderlineOffset: "3px",
            opacity: isDel ? 0.5 : 1,
          }}
        >
          {isDel ? "Deleting…" : "Delete"}
        </button>
      </div>
    </div>
  );
}

export default function CommentsTab({ comments: initialComments }: { comments: CommentRow[] }) {
  const [filter, setFilter] = useState<"all" | "pending" | "private" | "published">("all");
  const [comments, setComments] = useState(initialComments);
  const [, startRefresh] = useTransition();

  function refresh() {
    startRefresh(async () => {
      // Trigger revalidation via router refresh
      window.location.reload();
    });
  }

  const filtered = comments.filter(c => {
    if (filter === "pending") return c.visibility === "public_pending";
    if (filter === "private") return c.visibility === "private";
    if (filter === "published") return c.visibility === "public_published";
    return true;
  });

  const pendingCount = comments.filter(c => c.visibility === "public_pending").length;

  const sectionHeading: React.CSSProperties = {
    fontFamily: FONT,
    fontWeight: 700,
    fontSize: "0.72rem",
    letterSpacing: "0.12em",
    textTransform: "uppercase",
    color: "oklch(52% 0.008 260)",
    marginBottom: "1rem",
    display: "flex",
    alignItems: "center",
    gap: "0.75rem",
  };

  return (
    <section>
      <h2 style={sectionHeading}>
        From the Field — {comments.length} Comments
        {pendingCount > 0 && (
          <span style={{
            background: "oklch(65% 0.15 45)", color: "white",
            fontSize: "0.62rem", fontWeight: 700, padding: "0.1rem 0.5rem", borderRadius: "2px",
          }}>
            {pendingCount} pending
          </span>
        )}
      </h2>

      {/* Filter bar */}
      <div style={{ display: "flex", gap: "0.375rem", marginBottom: "1.25rem", flexWrap: "wrap" }}>
        {(["all", "pending", "private", "published"] as const).map(f => (
          <button
            key={f}
            type="button"
            onClick={() => setFilter(f)}
            style={{
              fontFamily: FONT, fontSize: "0.65rem", fontWeight: 700,
              letterSpacing: "0.05em", textTransform: "capitalize",
              padding: "0.3rem 0.75rem",
              background: filter === f ? "oklch(30% 0.12 260)" : "transparent",
              color: filter === f ? "white" : "oklch(52% 0.008 260)",
              border: `1px solid ${filter === f ? "oklch(30% 0.12 260)" : "oklch(82% 0.008 80)"}`,
              cursor: "pointer",
            }}
          >
            {f === "all" ? `All (${comments.length})` : f === "pending" ? `Pending (${pendingCount})` : f}
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <p style={{ fontFamily: FONT, fontSize: "0.82rem", color: "oklch(58% 0.005 260)" }}>
          No comments in this category yet.
        </p>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
          {filtered.map(c => (
            <CommentCard key={c.id} comment={c} onAction={refresh} />
          ))}
        </div>
      )}
    </section>
  );
}

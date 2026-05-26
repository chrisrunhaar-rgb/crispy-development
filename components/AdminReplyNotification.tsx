"use client";

import { useState, useTransition } from "react";
import { markCommentReplySeen } from "@/app/(marketing)/resources/actions";

const FONT = "var(--font-montserrat)";

type ReplyItem = {
  id: string;
  module_slug: string;
  comment: string;
  admin_reply: string;
};

function slugToTitle(slug: string) {
  return slug.replace(/-/g, " ").replace(/\b\w/g, c => c.toUpperCase());
}

function SingleReply({ item, onDismiss }: { item: ReplyItem; onDismiss: () => void }) {
  const [isPending, startTransition] = useTransition();

  function dismiss() {
    startTransition(async () => {
      await markCommentReplySeen(item.id);
      onDismiss();
    });
  }

  return (
    <div style={{
      background: "white",
      border: "1px solid oklch(65% 0.15 45 / 0.3)",
      borderTop: "3px solid oklch(65% 0.15 45)",
      padding: "1rem 1.25rem",
      display: "flex",
      flexDirection: "column",
      gap: "0.625rem",
    }}>
      <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: "0.75rem" }}>
        <div>
          <p style={{
            fontFamily: FONT,
            fontSize: "0.6rem",
            fontWeight: 700,
            letterSpacing: "0.1em",
            textTransform: "uppercase",
            color: "oklch(65% 0.15 45)",
            marginBottom: "0.25rem",
          }}>
            Reply from Crispy
          </p>
          <p style={{
            fontFamily: FONT,
            fontSize: "0.68rem",
            color: "oklch(52% 0.006 260)",
            margin: 0,
          }}>
            On your reflection from{" "}
            <a
              href={`/resources/${item.module_slug}`}
              style={{ color: "oklch(42% 0.12 260)", fontWeight: 700, textDecoration: "none" }}
            >
              {slugToTitle(item.module_slug)}
            </a>
          </p>
        </div>
        <button
          type="button"
          onClick={dismiss}
          disabled={isPending}
          style={{
            fontFamily: FONT,
            fontSize: "0.65rem",
            color: "oklch(52% 0.006 260)",
            background: "none",
            border: "none",
            cursor: "pointer",
            flexShrink: 0,
            opacity: isPending ? 0.5 : 1,
          }}
        >
          {isPending ? "…" : "✕"}
        </button>
      </div>

      <p style={{
        fontFamily: FONT,
        fontSize: "0.65rem",
        color: "oklch(62% 0.005 260)",
        lineHeight: 1.55,
        margin: 0,
        fontStyle: "italic",
        paddingLeft: "0.625rem",
        borderLeft: "2px solid oklch(88% 0.008 80)",
      }}>
        "{item.comment.slice(0, 120)}{item.comment.length > 120 ? "…" : ""}"
      </p>

      <p style={{
        fontFamily: FONT,
        fontSize: "0.82rem",
        color: "oklch(28% 0.008 260)",
        lineHeight: 1.65,
        margin: 0,
      }}>
        {item.admin_reply}
      </p>

      <button
        type="button"
        onClick={dismiss}
        disabled={isPending}
        style={{
          fontFamily: FONT,
          fontSize: "0.65rem",
          fontWeight: 700,
          letterSpacing: "0.06em",
          textTransform: "uppercase",
          background: "oklch(30% 0.12 260)",
          color: "white",
          border: "none",
          padding: "0.4rem 1rem",
          cursor: isPending ? "default" : "pointer",
          opacity: isPending ? 0.5 : 1,
          alignSelf: "flex-start",
        }}
      >
        {isPending ? "…" : "Got it"}
      </button>
    </div>
  );
}

export default function AdminReplyNotification({ replies }: { replies: ReplyItem[] }) {
  const [visible, setVisible] = useState(replies);

  function dismiss(id: string) {
    setVisible(prev => prev.filter(r => r.id !== id));
  }

  if (visible.length === 0) return null;

  return (
    <div style={{
      position: "fixed",
      bottom: "calc(80px + env(safe-area-inset-bottom, 0px) + 1rem)",
      right: "1rem",
      zIndex: 50,
      width: "min(380px, calc(100vw - 2rem))",
      display: "flex",
      flexDirection: "column",
      gap: "0.75rem",
    }}>
      {visible.map(item => (
        <SingleReply key={item.id} item={item} onDismiss={() => dismiss(item.id)} />
      ))}
    </div>
  );
}

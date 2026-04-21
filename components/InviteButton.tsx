"use client";

import { useState } from "react";
import { generateInviteAndGetUrl } from "@/app/(app)/dashboard/actions";

type Lang = "en" | "id" | "nl";

const SHARE_COPY: Record<Lang, (teamName: string) => { title: string; text: string }> = {
  en: (teamName) => ({
    title: `Join ${teamName} on Crispy Development`,
    text: `Your leader has a seat for you.\n\n${teamName} is building something — Crispy Development is where cross-cultural leaders grow. Your team is ready and waiting.`,
  }),
  id: (teamName) => ({
    title: `Bergabunglah dengan ${teamName} di Crispy Development`,
    text: `Pemimpinmu sudah menyiapkan tempat untukmu.\n\n${teamName} sedang membangun sesuatu — Crispy Development adalah tempat pemimpin lintas budaya bertumbuh. Timmu sudah menunggu.`,
  }),
  nl: (teamName) => ({
    title: `Sluit je aan bij ${teamName} op Crispy Development`,
    text: `Je leider heeft een plek voor jou.\n\n${teamName} bouwt aan iets — Crispy Development is het platform voor interculturele leiders. Je team staat klaar.`,
  }),
};

export default function InviteButton({ teamName, language = "en" }: { teamName: string; language?: Lang }) {
  const [status, setStatus] = useState<"idle" | "loading" | "copied">("idle");

  async function handleClick() {
    setStatus("loading");

    const { url, error } = await generateInviteAndGetUrl();

    if (error || !url) {
      setStatus("idle");
      alert(error ?? "Could not generate invite link.");
      return;
    }

    const copy = SHARE_COPY[language](teamName);
    const shareData = { ...copy, url };

    // navigator.share() works async after user gesture in modern browsers
    if (typeof navigator !== "undefined" && navigator.share && navigator.canShare?.(shareData)) {
      try {
        await navigator.share(shareData);
        setStatus("idle");
        return;
      } catch {
        // cancelled or failed — fall through to clipboard
      }
    }

    // Clipboard fallback
    try {
      await navigator.clipboard.writeText(url);
      setStatus("copied");
      setTimeout(() => setStatus("idle"), 2500);
    } catch {
      setStatus("idle");
    }
  }

  return (
    <button
      onClick={handleClick}
      disabled={status === "loading"}
      className="btn-primary"
      style={{
        fontSize: "0.78rem",
        padding: "0.6rem 1.25rem",
        opacity: status === "loading" ? 0.7 : 1,
        cursor: status === "loading" ? "default" : "pointer",
        border: "none",
      }}
    >
      {status === "loading" ? "Generating…" : status === "copied" ? "✓ Link Copied!" : "+ Invite Members"}
    </button>
  );
}

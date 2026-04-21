"use client";

import { useState } from "react";

type Lang = "en" | "id" | "nl";

const SHARE_COPY: Record<Lang, (initiatorName: string, topic: string | null, groupName: string) => { title: string; text: string }> = {
  en: (initiatorName, topic, groupName) => ({
    title: `Join ${groupName} on Crispy Leaders`,
    text: topic
      ? `${initiatorName} invites you to join a peer group with the topic: ${topic}. Join the Crispy Leaders HUB to see what is prepared for you.`
      : `${initiatorName} invites you to join a peer group on Crispy Leaders. Your seat is ready.`,
  }),
  id: (initiatorName, topic, groupName) => ({
    title: `Bergabunglah dengan ${groupName} di Crispy Leaders`,
    text: topic
      ? `${initiatorName} mengundangmu untuk bergabung dengan grup peer dengan topik: ${topic}. Daftarkan dirimu di Crispy Leaders HUB untuk melihat apa yang sudah disiapkan.`
      : `${initiatorName} mengundangmu bergabung dengan grup peer di Crispy Leaders. Tempatmu sudah siap.`,
  }),
  nl: (initiatorName, topic, groupName) => ({
    title: `Sluit je aan bij ${groupName} op Crispy Leaders`,
    text: topic
      ? `${initiatorName} nodigt je uit voor een peer group met het onderwerp: ${topic}. Meld je aan bij de Crispy Leaders HUB om te zien wat er klaarstaat.`
      : `${initiatorName} nodigt je uit voor een peer group op Crispy Leaders. Jouw plek is klaar.`,
  }),
};

export default function PeerInviteButton({
  groupId,
  groupName,
  topic,
  initiatorName,
  language = "en",
}: {
  groupId: string;
  groupName: string;
  topic: string | null;
  initiatorName: string;
  language?: Lang;
}) {
  const [status, setStatus] = useState<"idle" | "copied">("idle");

  async function handleClick() {
    const siteUrl = "https://crispyleaders.com";
    const url = `${siteUrl}/dashboard?tab=peer&join=${groupId}`;
    const copy = SHARE_COPY[language](initiatorName, topic, groupName);
    const shareData = { ...copy, url };

    if (typeof navigator !== "undefined" && navigator.share && navigator.canShare?.(shareData)) {
      try {
        await navigator.share(shareData);
        return;
      } catch {
        // cancelled — fall through to clipboard
      }
    }

    try {
      const fullText = `${copy.text}\n\n${url}`;
      await navigator.clipboard.writeText(fullText);
      setStatus("copied");
      setTimeout(() => setStatus("idle"), 2500);
    } catch {
      // ignore
    }
  }

  return (
    <button
      onClick={handleClick}
      style={{
        fontFamily: "var(--font-montserrat)",
        fontSize: "0.62rem",
        fontWeight: 700,
        letterSpacing: "0.08em",
        textTransform: "uppercase",
        padding: "0.4rem 1rem",
        border: "1px solid oklch(30% 0.12 260)",
        background: status === "copied" ? "oklch(30% 0.12 260)" : "white",
        color: status === "copied" ? "white" : "oklch(30% 0.12 260)",
        cursor: "pointer",
        transition: "all 0.15s",
        whiteSpace: "nowrap",
      }}
    >
      {status === "copied" ? "✓ Copied!" : "+ Invite Members"}
    </button>
  );
}

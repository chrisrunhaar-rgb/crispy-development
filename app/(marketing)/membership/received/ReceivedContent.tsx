"use client";

import Image from "next/image";
import Link from "next/link";
import { useLanguage } from "@/lib/LanguageContext";

const COPY = {
  en: {
    label: "Application Received",
    h1: "Thank you for applying.",
    body: "Chris reviews every application personally. You'll hear back within a few days. If accepted, you'll receive a link to create your account and access the full platform.",
    back: "← Browse free resources while you wait",
  },
  id: {
    label: "Lamaran Diterima",
    h1: "Terima kasih telah mendaftar.",
    body: "Chris meninjau setiap lamaran secara pribadi. Anda akan mendapat kabar dalam beberapa hari. Jika diterima, Anda akan menerima tautan untuk membuat akun dan mengakses seluruh platform.",
    back: "← Jelajahi sumber daya gratis sambil menunggu",
  },
};

export default function ReceivedContent() {
  const { lang } = useLanguage();
  const c = lang === "id" ? COPY.id : COPY.en;

  return (
    <div style={{
      minHeight: "calc(100dvh - 120px)",
      background: "oklch(30% 0.12 260)",
      display: "flex",
      alignItems: "flex-start",
      justifyContent: "center",
      paddingBlock: "clamp(4rem, 8vw, 7rem)",
      paddingInline: "1.5rem",
    }}>
      <div style={{ width: "100%", maxWidth: "480px" }}>
        <div style={{ marginBottom: "2.5rem" }}>
          <Image src="/logo-icon-dark-badge.png" alt="Crispy Development" width={40} height={40} />
        </div>

        <div style={{ width: "3px", height: "36px", background: "oklch(65% 0.15 45)", marginBottom: "1.75rem" }} />

        <p style={{
          fontFamily: "var(--font-montserrat)",
          fontSize: "0.65rem",
          fontWeight: 700,
          letterSpacing: "0.16em",
          textTransform: "uppercase",
          color: "oklch(65% 0.15 45)",
          marginBottom: "0.875rem",
        }}>
          {c.label}
        </p>

        <h1 style={{
          fontFamily: "var(--font-montserrat)",
          fontWeight: 800,
          fontSize: "clamp(1.75rem, 5vw, 2.25rem)",
          color: "oklch(97% 0.005 80)",
          lineHeight: 1.1,
          marginBottom: "1.25rem",
        }}>
          {c.h1}
        </h1>

        <p style={{
          fontFamily: "var(--font-montserrat)",
          fontSize: "0.9375rem",
          lineHeight: 1.75,
          color: "oklch(72% 0.04 260)",
          marginBottom: "2.5rem",
          maxWidth: "42ch",
        }}>
          {c.body}
        </p>

        <Link
          href="/resources"
          style={{
            fontFamily: "var(--font-montserrat)",
            fontSize: "0.85rem",
            fontWeight: 600,
            color: "oklch(72% 0.04 260)",
            textDecoration: "none",
          }}
        >
          {c.back}
        </Link>
      </div>
    </div>
  );
}

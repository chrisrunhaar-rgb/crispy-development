"use client";

import { useState } from "react";
import { createPortal } from "react-dom";
import type { InstallMode } from "@/lib/pwa-install";

// Step-by-step "add Crispy to your home screen" sheet, opened from the profile menu
// when the browser has no one-tap install (iPhone, some Android browsers, in-app browsers).

type Lang = "en" | "id";

const C = {
  bg: "oklch(99% 0.003 80)",
  navy: "oklch(30% 0.12 260)",
  body: "oklch(38% 0.007 260)",
  muted: "oklch(48% 0.04 260)",
  rule: "oklch(88% 0.008 80)",
  orange: "oklch(65% 0.15 45)",
};
const SANS = "var(--font-montserrat)";

const COPY: Record<Lang, {
  title: string; done: string; close: string; copy: string; copied: string;
  inApp: (browser: string) => string;
  steps: Partial<Record<InstallMode, string[]>>;
}> = {
  en: {
    title: "Add Crispy to your home screen",
    done: "Got it",
    close: "Close",
    copy: "Copy link",
    copied: "Link copied",
    inApp: b => `You're viewing Crispy inside another app. Open it in ${b} first, then add it from there.`,
    steps: {
      ios: [
        "Tap the Share button: the square with an arrow pointing up. In Safari it's at the bottom of the screen, in Chrome at the top.",
        "Scroll down and tap \"Add to Home Screen\".",
        "Tap \"Add\". Crispy now opens from its own icon, like an app.",
      ],
      android: [
        "Tap your browser's menu button (⋮), usually at the top right.",
        "Tap \"Add to Home screen\" or \"Install app\".",
        "Confirm with \"Install\" or \"Add\". Crispy now opens from its own icon, like an app.",
      ],
      "ios-inapp": [
        "Tap the ⋯ menu of the app you're in.",
        "Choose \"Open in Safari\" or \"Open in browser\". No menu? Copy the link below and paste it into Safari.",
        "In Safari, open your profile menu and tap \"Install Crispy as an app\" again.",
      ],
      "android-inapp": [
        "Tap the ⋮ menu of the app you're in.",
        "Choose \"Open in Chrome\" or \"Open in browser\". No menu? Copy the link below and paste it into Chrome.",
        "In Chrome, open your profile menu and tap \"Install Crispy as an app\" again.",
      ],
    },
  },
  id: {
    title: "Tambahkan Crispy ke layar utama",
    done: "Mengerti",
    close: "Tutup",
    copy: "Salin tautan",
    copied: "Tautan tersalin",
    inApp: b => `Anda sedang membuka Crispy di dalam aplikasi lain. Buka dulu di ${b}, lalu tambahkan dari sana.`,
    steps: {
      ios: [
        "Ketuk tombol Bagikan: kotak dengan panah ke atas. Di Safari letaknya di bawah layar, di Chrome di atas.",
        "Gulir ke bawah, lalu ketuk \"Tambah ke Layar Utama\".",
        "Ketuk \"Tambah\". Sekarang Crispy terbuka dari ikonnya sendiri, seperti aplikasi.",
      ],
      android: [
        "Ketuk tombol menu browser Anda (⋮), biasanya di kanan atas.",
        "Ketuk \"Tambahkan ke Layar utama\" atau \"Instal aplikasi\".",
        "Konfirmasi dengan \"Instal\" atau \"Tambahkan\". Sekarang Crispy terbuka dari ikonnya sendiri, seperti aplikasi.",
      ],
      "ios-inapp": [
        "Ketuk menu ⋯ di aplikasi yang sedang Anda pakai.",
        "Pilih \"Buka di Safari\" atau \"Buka di browser\". Tidak ada menunya? Salin tautan di bawah, lalu tempel di Safari.",
        "Di Safari, buka menu profil Anda lalu ketuk \"Pasang Crispy sebagai aplikasi\" lagi.",
      ],
      "android-inapp": [
        "Ketuk menu ⋮ di aplikasi yang sedang Anda pakai.",
        "Pilih \"Buka di Chrome\" atau \"Buka di browser\". Tidak ada menunya? Salin tautan di bawah, lalu tempel di Chrome.",
        "Di Chrome, buka menu profil Anda lalu ketuk \"Pasang Crispy sebagai aplikasi\" lagi.",
      ],
    },
  },
};

export default function InstallAppGuide({ mode, lang, onClose }: { mode: InstallMode; lang: Lang; onClose: () => void }) {
  const [copied, setCopied] = useState(false);
  const t = COPY[lang];
  const steps = t.steps[mode];
  if (!steps) return null;
  const inApp = mode === "ios-inapp" || mode === "android-inapp";

  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setCopied(true);
    } catch {}
  };

  return createPortal(
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="install-guide-title"
      onClick={onClose}
      style={{ position: "fixed", inset: 0, zIndex: 1000, display: "flex", alignItems: "flex-end", justifyContent: "center", background: "oklch(14% 0.05 260 / 0.6)", padding: "1rem" }}
    >
      <div
        onClick={e => e.stopPropagation()}
        style={{ position: "relative", width: "100%", maxWidth: 400, background: C.bg, borderRadius: 12, padding: "1.75rem 1.5rem 1.5rem", boxShadow: "0 20px 60px oklch(0% 0 0 / 0.3)", marginBottom: "max(0px, env(safe-area-inset-bottom))" }}
      >
        <button type="button" onClick={onClose} aria-label={t.close}
          style={{ position: "absolute", top: 8, right: 8, width: 44, height: 44, background: "none", border: "none", cursor: "pointer", fontFamily: SANS, fontSize: "1rem", color: C.muted }}>
          ✕
        </button>
        <h2 id="install-guide-title" style={{ fontFamily: SANS, fontWeight: 700, fontSize: "1.05rem", color: C.navy, margin: "0 2.5rem 1rem 0", lineHeight: 1.3 }}>
          {t.title}
        </h2>
        {inApp && (
          <p style={{ fontFamily: SANS, fontSize: "0.85rem", lineHeight: 1.6, color: C.body, margin: "0 0 1rem" }}>
            {t.inApp(mode === "ios-inapp" ? "Safari" : "Chrome")}
          </p>
        )}
        <ol style={{ listStyle: "none", margin: 0, padding: 0 }}>
          {steps.map((s, i) => (
            <li key={i} style={{ display: "flex", gap: "0.875rem", alignItems: "flex-start", marginBottom: "0.875rem" }}>
              <span aria-hidden style={{ flexShrink: 0, width: 26, height: 26, borderRadius: "50%", background: "oklch(65% 0.15 45 / 0.14)", color: "oklch(50% 0.15 45)", fontFamily: SANS, fontWeight: 800, fontSize: "0.8rem", display: "flex", alignItems: "center", justifyContent: "center" }}>
                {i + 1}
              </span>
              <p style={{ fontFamily: SANS, fontSize: "0.875rem", lineHeight: 1.6, color: C.body, margin: 0 }}>{s}</p>
            </li>
          ))}
        </ol>
        <div style={{ display: "flex", gap: "0.625rem", marginTop: "0.5rem" }}>
          {inApp && (
            <button type="button" onClick={copyLink}
              style={{ flex: 1, minHeight: 44, borderRadius: 8, border: `1px solid ${C.rule}`, background: "transparent", color: C.navy, fontFamily: SANS, fontWeight: 700, fontSize: "0.85rem", cursor: "pointer" }}>
              {copied ? t.copied : t.copy}
            </button>
          )}
          <button type="button" onClick={onClose} autoFocus
            style={{ flex: 1, minHeight: 44, borderRadius: 8, border: "none", background: C.navy, color: "oklch(99% 0.003 80)", fontFamily: SANS, fontWeight: 700, fontSize: "0.85rem", cursor: "pointer" }}>
            {t.done}
          </button>
        </div>
      </div>
    </div>,
    document.body,
  );
}

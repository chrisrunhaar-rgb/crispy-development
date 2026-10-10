"use client";

import { useState } from "react";
import { useLanguage } from "@/lib/LanguageContext";

// Email-only capture for logged-out readers of free modules (many arrive from the
// Instagram/Facebook in-app browser, where creating an account is a big step).
// Posts to /api/subscribe, which picks the EN or ID Mailchimp list by language and
// tags the contact with module-<slug>. Sends nothing by itself.

const navy = "oklch(22% 0.10 260)";
const orange = "oklch(65% 0.15 45)";
const charcoal = "oklch(38% 0.05 260)";
const cormorant = "var(--font-cormorant, Georgia, serif)";
const montserrat = "var(--font-montserrat, Montserrat, sans-serif)";

const COPY = {
  en: {
    heading: "Not ready for an account? Get the next module by email.",
    placeholder: "your@email.com",
    label: "Email address",
    button: "Send it to me",
    sending: "Sending...",
    done: "Thank you. Watch your inbox.",
    already: "You are already on the list. Thank you.",
    error: "Something went wrong. Please try again.",
  },
  id: {
    heading: "Belum ingin membuat akun? Dapatkan modul berikutnya lewat email.",
    placeholder: "email@anda.com",
    label: "Alamat email",
    button: "Kirim ke saya",
    sending: "Mengirim...",
    done: "Terima kasih. Periksa kotak masuk Anda.",
    already: "Anda sudah terdaftar. Terima kasih.",
    error: "Ada masalah. Silakan coba lagi.",
  },
};

export default function ModuleEmailCapture({ slug }: { slug: string }) {
  const { lang } = useLanguage();
  const l = lang === "id" ? "id" : "en";
  const c = COPY[l];
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "done" | "already" | "error">("idle");

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("loading");
    try {
      const res = await fetch("/api/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, lang: l, source: `module-${slug}` }),
      });
      const data = await res.json();
      setStatus(data.ok ? (data.already ? "already" : "done") : "error");
    } catch {
      setStatus("error");
    }
  }

  return (
    <div style={{
      marginTop: 20, padding: "24px 24px 26px", borderRadius: 16,
      background: "oklch(96% 0.008 80)", border: "1px solid oklch(88% 0.01 80)",
    }}>
      {status === "done" || status === "already" ? (
        <p role="status" style={{ fontFamily: cormorant, fontSize: 22, fontStyle: "italic", color: navy, margin: 0 }}>
          {status === "done" ? c.done : c.already}
        </p>
      ) : (
        <>
          <p style={{ fontFamily: cormorant, fontSize: 22, fontWeight: 600, lineHeight: 1.25, color: navy, margin: "0 0 16px", textWrap: "balance" }}>
            {c.heading}
          </p>
          <form onSubmit={submit} style={{ display: "flex", flexWrap: "wrap", gap: 10 }}>
            <label htmlFor={`mec-${slug}`} style={{ position: "absolute", width: 1, height: 1, overflow: "hidden", clip: "rect(0 0 0 0)" }}>
              {c.label}
            </label>
            <input
              id={`mec-${slug}`}
              type="email"
              required
              autoComplete="email"
              inputMode="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder={c.placeholder}
              style={{
                flex: "1 1 220px", minHeight: 48, padding: "0 14px", borderRadius: 12,
                border: "1px solid oklch(80% 0.02 260)", background: "#fff", color: navy,
                fontFamily: montserrat, fontSize: 16,
              }}
            />
            <button
              type="submit"
              disabled={status === "loading"}
              style={{
                flex: "0 0 auto", minHeight: 48, padding: "0 22px", borderRadius: 12, border: "none",
                background: navy, color: "#fff", cursor: "pointer",
                fontFamily: montserrat, fontSize: 14.5, fontWeight: 700, letterSpacing: "0.03em",
              }}
            >
              {status === "loading" ? c.sending : c.button}
            </button>
          </form>
          {status === "error" && (
            <p role="alert" style={{ fontFamily: montserrat, fontSize: 13.5, color: charcoal, margin: "12px 0 0" }}>
              <span style={{ color: orange, fontWeight: 700 }}>! </span>{c.error}
            </p>
          )}
        </>
      )}
    </div>
  );
}

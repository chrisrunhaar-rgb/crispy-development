"use client";

import { useState } from "react";
import { useLanguage } from "@/lib/LanguageContext";

const COPY = {
  en: {
    label: "Get in touch",
    h1: "Contact",
    intro: "Questions about our programmes, partnerships, or anything else — we'd love to hear from you.",
    nameLabel: "Name",
    namePlaceholder: "Your name",
    emailLabel: "Email",
    emailPlaceholder: "your@email.com",
    messageLabel: "Message",
    messagePlaceholder: "How can we help?",
    submit: "Send Message",
    sending: "Sending…",
    sentTitle: "Message sent",
    sentBody: "Thanks for reaching out. We'll get back to you shortly.",
    errorFallback: "Something went wrong.",
  },
  id: {
    label: "Hubungi kami",
    h1: "Kontak",
    intro: "Pertanyaan tentang program kami, kemitraan, atau hal lainnya — kami senang mendengar dari Anda.",
    nameLabel: "Nama",
    namePlaceholder: "Nama Anda",
    emailLabel: "Email",
    emailPlaceholder: "email@anda.com",
    messageLabel: "Pesan",
    messagePlaceholder: "Bagaimana kami bisa membantu?",
    submit: "Kirim Pesan",
    sending: "Mengirim…",
    sentTitle: "Pesan terkirim",
    sentBody: "Terima kasih telah menghubungi kami. Kami akan segera membalas.",
    errorFallback: "Terjadi kesalahan.",
  },
};

const inputStyle: React.CSSProperties = {
  width: "100%",
  fontFamily: "var(--font-montserrat)",
  fontSize: "0.875rem",
  color: "oklch(22% 0.10 260)",
  background: "white",
  border: "1px solid oklch(88% 0.008 80)",
  padding: "0.75rem 1rem",
  outline: "none",
  boxSizing: "border-box",
};

export default function ContactForm() {
  const { lang } = useLanguage();
  const c = lang === "id" ? COPY.id : COPY.en;

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("sending");
    setErrorMsg("");

    const res = await fetch("/api/contact", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email, message }),
    });
    const data = await res.json();

    if (res.ok) {
      setStatus("sent");
    } else {
      setStatus("error");
      setErrorMsg(data.error ?? c.errorFallback);
    }
  }

  return (
    <div style={{
      minHeight: "calc(100dvh - 120px)",
      background: "oklch(97% 0.005 80)",
      paddingBlock: "4rem",
      paddingInline: "1.5rem",
      display: "flex",
      alignItems: "flex-start",
      justifyContent: "center",
    }}>
      <div style={{ width: "100%", maxWidth: "520px" }}>

        <p className="t-label" style={{ color: "oklch(65% 0.15 45)", marginBottom: "0.75rem", fontSize: "0.62rem" }}>
          {c.label}
        </p>
        <h1 style={{ fontFamily: "var(--font-montserrat)", fontWeight: 800, fontSize: "clamp(1.5rem, 3vw, 2rem)", color: "oklch(22% 0.10 260)", marginBottom: "0.5rem" }}>
          {c.h1}
        </h1>
        <p style={{ fontFamily: "var(--font-montserrat)", fontSize: "0.875rem", color: "oklch(52% 0.008 260)", lineHeight: 1.65, marginBottom: "2.5rem", maxWidth: "40ch" }}>
          {c.intro}
        </p>

        {status === "sent" ? (
          <div style={{ background: "white", border: "1px solid oklch(88% 0.008 80)", padding: "2rem" }}>
            <div style={{ width: "2.5rem", height: "2px", background: "oklch(65% 0.15 45)", marginBottom: "1rem" }} />
            <p style={{ fontFamily: "var(--font-montserrat)", fontWeight: 700, fontSize: "0.9rem", color: "oklch(22% 0.10 260)", marginBottom: "0.5rem" }}>
              {c.sentTitle}
            </p>
            <p style={{ fontFamily: "var(--font-montserrat)", fontSize: "0.825rem", color: "oklch(52% 0.008 260)", lineHeight: 1.65 }}>
              {c.sentBody}
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
            <div>
              <label style={{ fontFamily: "var(--font-montserrat)", fontSize: "0.7rem", fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: "oklch(52% 0.008 260)", display: "block", marginBottom: "0.4rem" }}>
                {c.nameLabel}
              </label>
              <input
                type="text"
                value={name}
                onChange={e => setName(e.target.value)}
                required
                placeholder={c.namePlaceholder}
                style={inputStyle}
              />
            </div>

            <div>
              <label style={{ fontFamily: "var(--font-montserrat)", fontSize: "0.7rem", fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: "oklch(52% 0.008 260)", display: "block", marginBottom: "0.4rem" }}>
                {c.emailLabel}
              </label>
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                required
                placeholder={c.emailPlaceholder}
                style={inputStyle}
              />
            </div>

            <div>
              <label style={{ fontFamily: "var(--font-montserrat)", fontSize: "0.7rem", fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: "oklch(52% 0.008 260)", display: "block", marginBottom: "0.4rem" }}>
                {c.messageLabel}
              </label>
              <textarea
                value={message}
                onChange={e => setMessage(e.target.value)}
                required
                rows={5}
                placeholder={c.messagePlaceholder}
                style={{ ...inputStyle, resize: "vertical" }}
              />
            </div>

            {status === "error" && (
              <p style={{ fontFamily: "var(--font-montserrat)", fontSize: "0.8rem", color: "oklch(55% 0.18 25)" }}>
                {errorMsg}
              </p>
            )}

            <button
              type="submit"
              disabled={status === "sending"}
              style={{
                fontFamily: "var(--font-montserrat)",
                fontWeight: 700,
                fontSize: "0.78rem",
                letterSpacing: "0.08em",
                textTransform: "uppercase",
                background: "oklch(30% 0.12 260)",
                color: "oklch(97% 0.005 80)",
                border: "none",
                padding: "0.875rem 2rem",
                cursor: status === "sending" ? "wait" : "pointer",
                opacity: status === "sending" ? 0.7 : 1,
                alignSelf: "flex-start",
              }}
            >
              {status === "sending" ? c.sending : c.submit}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}

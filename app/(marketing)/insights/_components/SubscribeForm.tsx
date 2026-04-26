"use client";
import { useState } from "react";

export function SubscribeForm({ lang = "en" }: { lang?: "en" | "id" }) {
  const [email, setEmail] = useState("");
  const [prefLang, setPrefLang] = useState<"en" | "id">(lang);
  const [status, setStatus] = useState<"idle" | "loading" | "done" | "error">("idle");

  const copy = {
    en: {
      label: "GET NEW BYTES",
      heading: "New bytes, straight to your inbox.",
      sub: "A short read every two weeks. No noise.",
      langLabel: "Receive in:",
      placeholder: "your@email.com",
      button: "Subscribe",
      loading: "Subscribing…",
      done: "You're in. Next byte lands in your inbox.",
      already: "Already subscribed — you're good.",
      error: "Something went wrong. Try again.",
    },
    id: {
      label: "BYTES TERBARU",
      heading: "Bytes baru, langsung ke inbox kamu.",
      sub: "Bacaan singkat setiap dua minggu. Tidak ada kebisingan.",
      langLabel: "Terima dalam:",
      placeholder: "email@kamu.com",
      button: "Langganan",
      loading: "Mendaftar…",
      done: "Kamu sudah terdaftar. Byte berikutnya akan tiba di inboxmu.",
      already: "Sudah terdaftar — kamu baik-baik saja.",
      error: "Ada masalah. Coba lagi.",
    },
  }[lang];

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("loading");
    try {
      const res = await fetch("/api/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, lang: prefLang }),
      });
      const data = await res.json();
      if (data.ok) {
        setStatus("done");
      } else {
        setStatus("error");
      }
    } catch {
      setStatus("error");
    }
  }

  const pillBase: React.CSSProperties = {
    fontFamily: "var(--font-montserrat)", fontWeight: 600, fontSize: "0.62rem",
    letterSpacing: "0.1em", textTransform: "uppercase",
    padding: "0.25rem 0.6rem", border: "none", cursor: "pointer",
  };

  return (
    <div style={{
      marginTop: "3rem",
      padding: "2rem 2rem 2.25rem",
      background: "oklch(22% 0.10 260)",
    }}>
      <p style={{
        fontFamily: "var(--font-montserrat)", fontWeight: 700, fontSize: "0.62rem",
        letterSpacing: "0.22em", textTransform: "uppercase",
        color: "oklch(65% 0.15 45)", marginBottom: "0.75rem",
      }}>
        {copy.label}
      </p>

      {status === "done" ? (
        <p style={{
          fontFamily: "var(--font-cormorant)", fontStyle: "italic",
          fontSize: "1.25rem", lineHeight: 1.5,
          color: "oklch(92% 0.005 80)",
        }}>
          {copy.done}
        </p>
      ) : (
        <>
          <p style={{
            fontFamily: "var(--font-cormorant)", fontWeight: 600,
            fontSize: "clamp(1.3rem, 2.5vw, 1.7rem)", lineHeight: 1.15,
            color: "oklch(97% 0.005 80)", marginBottom: "0.5rem",
          }}>
            {copy.heading}
          </p>
          <p style={{
            fontFamily: "var(--font-montserrat)", fontSize: "0.875rem",
            color: "oklch(70% 0.006 260)", marginBottom: "1.25rem",
          }}>
            {copy.sub}
          </p>

          {/* Language preference */}
          <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "1.25rem" }}>
            <span style={{
              fontFamily: "var(--font-montserrat)", fontSize: "0.65rem",
              letterSpacing: "0.1em", textTransform: "uppercase",
              color: "oklch(58% 0.008 260)",
            }}>
              {copy.langLabel}
            </span>
            {(["en", "id"] as const).map((l) => (
              <button
                key={l}
                type="button"
                onClick={() => setPrefLang(l)}
                style={{
                  ...pillBase,
                  background: prefLang === l ? "oklch(65% 0.15 45)" : "oklch(30% 0.08 260)",
                  color: prefLang === l ? "oklch(100% 0 0)" : "oklch(60% 0.006 260)",
                }}
              >
                {l.toUpperCase()}
              </button>
            ))}
          </div>

          <form onSubmit={handleSubmit} style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap" }}>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder={copy.placeholder}
              disabled={status === "loading"}
              style={{
                fontFamily: "var(--font-montserrat)", fontSize: "0.875rem",
                padding: "0.65rem 1rem",
                background: "oklch(30% 0.08 260)",
                border: "1px solid oklch(40% 0.08 260)",
                color: "oklch(97% 0.005 80)",
                outline: "none",
                flex: "1 1 220px",
                minWidth: "0",
              }}
            />
            <button
              type="submit"
              disabled={status === "loading"}
              style={{
                fontFamily: "var(--font-montserrat)", fontWeight: 700, fontSize: "0.78rem",
                letterSpacing: "0.06em", textTransform: "uppercase",
                padding: "0.65rem 1.5rem",
                background: "oklch(65% 0.15 45)",
                color: "oklch(100% 0 0)",
                border: "none",
                cursor: status === "loading" ? "default" : "pointer",
                whiteSpace: "nowrap",
                opacity: status === "loading" ? 0.7 : 1,
              }}
            >
              {status === "loading" ? copy.loading : copy.button}
            </button>
          </form>

          {status === "error" && (
            <p style={{
              fontFamily: "var(--font-montserrat)", fontSize: "0.8rem",
              color: "oklch(75% 0.15 30)", marginTop: "0.75rem",
            }}>
              {copy.error}
            </p>
          )}
        </>
      )}
    </div>
  );
}

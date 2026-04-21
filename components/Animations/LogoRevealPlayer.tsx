"use client";

import { useState, useEffect } from "react";
import Image from "next/image";

export default function LogoRevealPlayer() {
  const [phase, setPhase] = useState<"hidden" | "enter" | "hold" | "exit">("hidden");

  useEffect(() => {
    const shown = sessionStorage.getItem("crispy-logo-shown");
    if (shown) return;

    // Start entrance
    const t1 = setTimeout(() => setPhase("enter"), 60);
    // Hold after animations complete
    const t2 = setTimeout(() => setPhase("hold"), 60);
    // Begin exit
    const t3 = setTimeout(() => setPhase("exit"), 4200);
    // Remove from DOM
    const t4 = setTimeout(() => {
      setPhase("hidden");
      sessionStorage.setItem("crispy-logo-shown", "1");
    }, 5000);

    return () => { clearTimeout(t1); clearTimeout(t2); clearTimeout(t3); clearTimeout(t4); };
  }, []);

  if (phase === "hidden") return null;

  const leaving = phase === "exit";

  return (
    <div
      onClick={() => {
        setPhase("exit");
        setTimeout(() => {
          setPhase("hidden");
          sessionStorage.setItem("crispy-logo-shown", "1");
        }, 800);
      }}
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 9999,
        cursor: "pointer",
        opacity: leaving ? 0 : 1,
        transition: leaving ? "opacity 0.8s ease-out" : "none",
        overflow: "hidden",
        background: "#F8F7F4",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        fontFamily: "Montserrat, sans-serif",
      }}
    >
      {/* Dot grid */}
      <div style={{
        position: "absolute", inset: 0,
        backgroundImage: "radial-gradient(circle, rgba(27,58,107,0.08) 1px, transparent 1px)",
        backgroundSize: "40px 40px",
        animation: "cd-fade-in 0.8s ease-out 0.1s both",
      }} />

      {/* Concentric arcs */}
      <div style={{
        position: "absolute", bottom: "-15%", right: "-10%",
        width: "50vmin", height: "50vmin",
        borderRadius: "50%",
        border: "1px solid rgba(27,58,107,0.06)",
        animation: "cd-fade-in 1s ease-out 0.3s both",
      }}>
        <div style={{
          position: "absolute", inset: "15%",
          borderRadius: "50%",
          border: "1px solid rgba(27,58,107,0.06)",
        }}>
          <div style={{
            position: "absolute", inset: "15%",
            borderRadius: "50%",
            border: "1px solid rgba(224,117,64,0.18)",
          }} />
        </div>
      </div>

      {/* Orange top rule */}
      <div style={{
        position: "absolute", top: 0, left: 0, right: 0, height: 4,
        background: "#E07540",
        transformOrigin: "left",
        animation: "cd-rule-left 0.6s cubic-bezier(0.16,1,0.3,1) 0.15s both",
      }} />

      {/* Orange bottom rule */}
      <div style={{
        position: "absolute", bottom: 0, left: 0, right: 0, height: 4,
        background: "#E07540",
        transformOrigin: "right",
        animation: "cd-rule-right 0.6s cubic-bezier(0.16,1,0.3,1) 0.15s both",
      }} />

      {/* Content */}
      <div style={{
        display: "flex", flexDirection: "column", alignItems: "center",
        textAlign: "center", gap: 0,
        padding: "40px 24px",
      }}>
        {/* WELCOME TO */}
        <p style={{
          fontSize: "clamp(14px, 2vw, 18px)",
          fontWeight: 700,
          letterSpacing: "0.26em",
          textTransform: "uppercase",
          color: "#E07540",
          margin: "0 0 clamp(24px, 4vh, 40px)",
          animation: "cd-fade-up 0.6s ease-out 0.3s both",
        }}>
          Welcome to
        </p>

        {/* Logo */}
        <div style={{
          marginBottom: "clamp(24px, 4vh, 40px)",
          animation: "cd-scale-in 0.7s cubic-bezier(0.16,1,0.3,1) 0.5s both",
          filter: "drop-shadow(0 0 40px rgba(224,117,64,0.35))",
        }}>
          <Image
            src="/logo-icon.png"
            alt="Crispy Development"
            width={200}
            height={200}
            style={{
              width: "clamp(160px, 22vmin, 220px)",
              height: "clamp(160px, 22vmin, 220px)",
              objectFit: "contain",
            }}
            priority
          />
        </div>

        {/* CRISPY DEVELOPMENT */}
        <div style={{
          animation: "cd-fade-up 0.6s ease-out 0.9s both",
          marginBottom: "clamp(24px, 4vh, 40px)",
        }}>
          <div style={{
            fontSize: "clamp(48px, 8vw, 96px)",
            fontWeight: 800,
            letterSpacing: "0.08em",
            color: "#1B3A6B",
            lineHeight: 1,
            marginBottom: 10,
          }}>
            CRISPY
          </div>
          <div style={{
            fontSize: "clamp(16px, 2.4vw, 28px)",
            fontWeight: 300,
            letterSpacing: "0.44em",
            textTransform: "uppercase",
            color: "rgba(27,58,107,0.45)",
          }}>
            Development
          </div>
        </div>

        {/* Divider */}
        <div style={{
          height: 2,
          background: "#E07540",
          borderRadius: 1,
          marginBottom: "clamp(24px, 4vh, 40px)",
          animation: "cd-divider 0.5s ease-out 1.4s both",
        }} />

        {/* Tagline */}
        <p style={{
          fontSize: "clamp(18px, 2.4vw, 28px)",
          fontWeight: 400,
          letterSpacing: "0.03em",
          color: "rgba(27,58,107,0.6)",
          margin: 0,
          fontStyle: "italic",
          fontFamily: "Cormorant Garamond, Cormorant, Georgia, serif",
          animation: "cd-fade-up 0.7s ease-out 1.6s both",
        }}>
          Raising leaders who cross cultures.
        </p>
      </div>

      {/* Skip hint */}
      <div style={{
        position: "absolute",
        bottom: 24,
        right: 24,
        fontSize: 11,
        fontWeight: 600,
        letterSpacing: "0.12em",
        textTransform: "uppercase",
        color: "rgba(27,58,107,0.3)",
        animation: "cd-fade-in 0.6s ease-out 2s both",
      }}>
        Click to skip
      </div>

      <style>{`
        @keyframes cd-fade-in {
          from { opacity: 0; }
          to   { opacity: 1; }
        }
        @keyframes cd-fade-up {
          from { opacity: 0; transform: translateY(14px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes cd-scale-in {
          from { opacity: 0; transform: scale(0.6); }
          to   { opacity: 1; transform: scale(1); }
        }
        @keyframes cd-rule-left {
          from { transform: scaleX(0); }
          to   { transform: scaleX(1); }
        }
        @keyframes cd-rule-right {
          from { transform: scaleX(0); }
          to   { transform: scaleX(1); }
        }
        @keyframes cd-divider {
          from { width: 0; }
          to   { width: clamp(100px, 14vw, 180px); }
        }
      `}</style>
    </div>
  );
}

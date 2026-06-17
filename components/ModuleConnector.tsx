"use client";

import { useState, useEffect, useRef, useTransition } from "react";
import { saveResourceToDashboard } from "@/app/(marketing)/resources/actions";
import { getConnectionsForModule, ModuleConnection } from "@/lib/module-connections";

const navy = "oklch(22% 0.10 260)";
const orange = "oklch(65% 0.15 45)";
const offWhite = "oklch(97% 0.005 80)";
const bodyText = "oklch(38% 0.05 260)";

type SaveState = "idle" | "saving" | "saved" | "already" | "error" | "signin";

type ConnectorState = {
  connection: ModuleConnection;
  saveState: SaveState;
};

type Props = {
  currentSlug: string;
  savedResources: string[];
  isLoggedIn: boolean;
};

export default function ModuleConnector({ currentSlug, savedResources, isLoggedIn }: Props) {
  const connections = getConnectionsForModule(currentSlug);
  const [visibleSections, setVisibleSections] = useState<Set<string>>(new Set());
  const [activePopup, setActivePopup] = useState<string | null>(null);
  const [connectorStates, setConnectorStates] = useState<Record<string, ConnectorState>>(() => {
    const initial: Record<string, ConnectorState> = {};
    for (const c of connections) {
      const key = `${c.sourceSectionId}__${c.targetSlug}`;
      initial[key] = {
        connection: c,
        saveState: savedResources.includes(c.targetSlug) ? "already" : "idle",
      };
    }
    return initial;
  });
  const [, startTransition] = useTransition();
  const observerRef = useRef<IntersectionObserver | null>(null);

  useEffect(() => {
    if (connections.length === 0) return;

    const sectionIds = [...new Set(connections.map((c) => c.sourceSectionId))];

    observerRef.current = new IntersectionObserver(
      (entries) => {
        setVisibleSections((prev) => {
          const next = new Set(prev);
          for (const entry of entries) {
            if (entry.isIntersecting) {
              next.add(entry.target.id);
            } else {
              next.delete(entry.target.id);
            }
          }
          return next;
        });
      },
      { threshold: 0.15, rootMargin: "-10% 0px -10% 0px" }
    );

    for (const id of sectionIds) {
      const el = document.getElementById(id);
      if (el) observerRef.current.observe(el);
    }

    return () => {
      observerRef.current?.disconnect();
    };
  }, [connections.length]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setActivePopup(null);
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  const handleSave = (key: string, targetSlug: string) => {
    if (!isLoggedIn) {
      setConnectorStates((prev) => ({
        ...prev,
        [key]: { ...prev[key], saveState: "signin" },
      }));
      return;
    }

    setConnectorStates((prev) => ({
      ...prev,
      [key]: { ...prev[key], saveState: "saving" },
    }));

    startTransition(async () => {
      const result = await saveResourceToDashboard(targetSlug);
      setConnectorStates((prev) => ({
        ...prev,
        [key]: {
          ...prev[key],
          saveState: result.error
            ? "error"
            : result.already
            ? "already"
            : "saved",
        },
      }));
    });
  };

  const activeConnections = connections.filter((c) =>
    visibleSections.has(c.sourceSectionId)
  );

  if (activeConnections.length === 0) return null;

  const uniqueActive = activeConnections.filter(
    (c, i, arr) =>
      arr.findIndex(
        (x) => x.sourceSectionId === c.sourceSectionId && x.targetSlug === c.targetSlug
      ) === i
  );

  return (
    <>
      <style>{`
        @keyframes mc-float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-6px); }
        }
        .mc-rail {
          position: fixed;
          right: 20px;
          top: 50%;
          transform: translateY(-50%);
          z-index: 50;
          display: flex;
          flex-direction: column;
          gap: 12px;
          pointer-events: none;
        }
        @media (max-width: 767px) {
          .mc-rail { display: none !important; }
        }
        .mc-icon-btn {
          pointer-events: all;
          width: 44px;
          height: 44px;
          border-radius: 50%;
          border: 2px solid ${orange};
          background: ${navy};
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          opacity: 0.55;
          transition: opacity 0.2s, box-shadow 0.2s;
          animation: mc-float 3s ease-in-out infinite;
          box-shadow: 0 2px 12px rgba(0,0,0,0.25);
          padding: 0;
        }
        .mc-icon-btn:hover, .mc-icon-btn.active {
          opacity: 1;
          box-shadow: 0 4px 20px rgba(0,0,0,0.35);
        }
        .mc-overlay {
          position: fixed;
          inset: 0;
          z-index: 49;
          background: transparent;
        }
        .mc-popup {
          position: fixed;
          right: 76px;
          top: 50%;
          transform: translateY(-50%);
          z-index: 51;
          background: ${navy};
          border: 1px solid rgba(255,255,255,0.12);
          border-radius: 12px;
          padding: 24px;
          width: 280px;
          box-shadow: 0 8px 40px rgba(0,0,0,0.45);
        }
        .mc-popup-close {
          position: absolute;
          top: 10px;
          right: 12px;
          background: none;
          border: none;
          cursor: pointer;
          color: rgba(255,255,255,0.4);
          font-size: 18px;
          line-height: 1;
          padding: 2px 6px;
          transition: color 0.15s;
        }
        .mc-popup-close:hover { color: rgba(255,255,255,0.85); }
        .mc-save-btn {
          width: 100%;
          padding: 11px 16px;
          border-radius: 8px;
          border: none;
          background: ${orange};
          color: #fff;
          font-family: Montserrat, sans-serif;
          font-size: 12px;
          font-weight: 700;
          letter-spacing: 0.06em;
          text-transform: uppercase;
          cursor: pointer;
          transition: opacity 0.15s;
          margin-top: 16px;
        }
        .mc-save-btn:hover { opacity: 0.88; }
        .mc-save-btn:disabled { opacity: 0.5; cursor: default; }
        .mc-signin-link {
          display: block;
          text-align: center;
          color: ${orange};
          font-family: Montserrat, sans-serif;
          font-size: 11px;
          font-weight: 700;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          text-decoration: none;
          margin-top: 16px;
          padding: 11px;
          border: 1px solid ${orange};
          border-radius: 8px;
          transition: background 0.15s;
        }
        .mc-signin-link:hover { background: rgba(255,255,255,0.06); }
      `}</style>

      {activePopup && (
        <div className="mc-overlay" onClick={() => setActivePopup(null)} />
      )}

      <div className="mc-rail">
        {uniqueActive.map((conn) => {
          const key = `${conn.sourceSectionId}__${conn.targetSlug}`;
          const state = connectorStates[key];
          const isOpen = activePopup === key;

          return (
            <div key={key} style={{ position: "relative" }}>
              <button
                className={`mc-icon-btn${isOpen ? " active" : ""}`}
                onClick={() => setActivePopup(isOpen ? null : key)}
                aria-label={`Connect to ${conn.targetTitle}`}
                title={conn.targetTitle}
                style={{
                  animationDelay: uniqueActive.indexOf(conn) % 2 === 1 ? "1.5s" : "0s",
                }}
              >
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
                  <circle cx="7" cy="12" r="4.5" stroke={orange} strokeWidth="1.8" />
                  <circle cx="17" cy="12" r="4.5" stroke={offWhite} strokeWidth="1.8" />
                  <line x1="11.2" y1="9.5" x2="12.8" y2="14.5" stroke="rgba(255,255,255,0.35)" strokeWidth="1.2" />
                </svg>
              </button>

              {isOpen && (
                <div className="mc-popup">
                  <button
                    className="mc-popup-close"
                    onClick={() => setActivePopup(null)}
                    aria-label="Close"
                  >
                    ×
                  </button>

                  <p style={{
                    fontFamily: "Montserrat, sans-serif",
                    fontSize: 9,
                    fontWeight: 700,
                    letterSpacing: "0.14em",
                    textTransform: "uppercase",
                    color: orange,
                    margin: "0 0 10px",
                  }}>
                    Connected Module
                  </p>

                  <p style={{
                    fontFamily: "Cormorant Garamond, Georgia, serif",
                    fontSize: 17,
                    fontWeight: 600,
                    color: offWhite,
                    margin: "0 0 10px",
                    lineHeight: 1.3,
                  }}>
                    {conn.targetTitle}
                  </p>

                  <p style={{
                    fontSize: 13,
                    color: "rgba(255,255,255,0.65)",
                    lineHeight: 1.6,
                    margin: 0,
                  }}>
                    You&apos;re reading about{" "}
                    <span style={{ color: offWhite, fontWeight: 500 }}>
                      {conn.topic}
                    </span>
                    . In our{" "}
                    <strong style={{ color: offWhite }}>{conn.targetTitle}</strong>{" "}
                    module, we explore {conn.angle}.
                  </p>

                  {state.saveState === "saved" && (
                    <p style={{
                      marginTop: 16,
                      fontSize: 13,
                      color: "#4ade80",
                      fontWeight: 600,
                      textAlign: "center",
                    }}>
                      ✓ Saved to your dashboard
                    </p>
                  )}

                  {state.saveState === "already" && (
                    <p style={{
                      marginTop: 16,
                      fontSize: 13,
                      color: "rgba(255,255,255,0.5)",
                      textAlign: "center",
                    }}>
                      Already on your dashboard ✓
                    </p>
                  )}

                  {state.saveState === "error" && (
                    <p style={{
                      marginTop: 16,
                      fontSize: 12,
                      color: "#f87171",
                      textAlign: "center",
                    }}>
                      Something went wrong. Try again.
                    </p>
                  )}

                  {state.saveState === "signin" && (
                    <a href="/login" className="mc-signin-link">
                      Sign in to save →
                    </a>
                  )}

                  {(state.saveState === "idle" || state.saveState === "saving" || state.saveState === "error") && (
                    <button
                      className="mc-save-btn"
                      onClick={() => handleSave(key, conn.targetSlug)}
                      disabled={state.saveState === "saving"}
                    >
                      {state.saveState === "saving"
                        ? "Saving…"
                        : `Save ${conn.targetTitle} to my dashboard →`}
                    </button>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </>
  );
}

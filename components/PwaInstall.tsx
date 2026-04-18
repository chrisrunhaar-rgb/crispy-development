"use client";

import { useEffect, useState } from "react";

type BeforeInstallPromptEvent = Event & {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
};

export default function PwaInstall() {
  const [installPrompt, setInstallPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [isIos, setIsIos] = useState(false);
  const [isInstalled, setIsInstalled] = useState(false);
  const [showIosGuide, setShowIosGuide] = useState(false);

  useEffect(() => {
    if (window.matchMedia("(display-mode: standalone)").matches) {
      setIsInstalled(true);
      return;
    }
    const ua = navigator.userAgent;
    const iosDevice = /iphone|ipad|ipod/i.test(ua);
    const safari = /safari/i.test(ua) && !/chrome|crios|fxios/i.test(ua);
    setIsIos(iosDevice && safari);

    const handler = (e: Event) => {
      e.preventDefault();
      setInstallPrompt(e as BeforeInstallPromptEvent);
    };
    window.addEventListener("beforeinstallprompt", handler);
    return () => window.removeEventListener("beforeinstallprompt", handler);
  }, []);

  const handleInstall = async () => {
    if (isIos) {
      setShowIosGuide(true);
      return;
    }
    if (!installPrompt) return;
    await installPrompt.prompt();
    const { outcome } = await installPrompt.userChoice;
    if (outcome === "accepted") {
      setIsInstalled(true);
      setInstallPrompt(null);
    }
  };

  if (isInstalled) return null;
  if (!installPrompt && !isIos) return null;

  return (
    <>
      <button
        onClick={handleInstall}
        style={{
          fontFamily: "var(--font-montserrat)",
          fontSize: "0.75rem",
          fontWeight: 600,
          letterSpacing: "0.06em",
          color: "oklch(65% 0.15 45)",
          background: "oklch(65% 0.15 45 / 0.1)",
          border: "1px solid oklch(65% 0.15 45 / 0.3)",
          padding: "0.375rem 0.875rem",
          cursor: "pointer",
          transition: "background 0.15s",
          display: "flex",
          alignItems: "center",
          gap: "0.375rem",
          whiteSpace: "nowrap",
        }}
        aria-label="Add to home screen"
      >
        <span style={{ fontSize: "1em" }}>⊕</span> Add to Home Screen
      </button>

      {/* iOS instruction overlay */}
      {showIosGuide && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Install instructions"
          style={{
            position: "fixed",
            inset: 0,
            zIndex: 200,
            display: "flex",
            alignItems: "flex-end",
            justifyContent: "center",
            background: "oklch(10% 0.05 260 / 0.6)",
            padding: "1.5rem",
          }}
          onClick={() => setShowIosGuide(false)}
        >
          <div
            style={{
              background: "oklch(97% 0.005 80)",
              padding: "2rem",
              maxWidth: "380px",
              width: "100%",
              position: "relative",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setShowIosGuide(false)}
              style={{
                position: "absolute",
                top: "1rem",
                right: "1rem",
                background: "none",
                border: "none",
                cursor: "pointer",
                fontFamily: "var(--font-montserrat)",
                fontSize: "1rem",
                color: "oklch(52% 0.008 260)",
              }}
              aria-label="Close"
            >
              ✕
            </button>
            <p
              className="t-label"
              style={{
                color: "oklch(65% 0.15 45)",
                marginBottom: "1rem",
                fontSize: "0.62rem",
              }}
            >
              Install App
            </p>
            <h3
              style={{
                fontFamily: "var(--font-montserrat)",
                fontWeight: 700,
                fontSize: "1.0625rem",
                color: "oklch(22% 0.005 260)",
                marginBottom: "1.25rem",
              }}
            >
              Add to your Home Screen
            </h3>
            {[
              { step: "1", text: 'Tap the Share button at the bottom of Safari (the box with an arrow pointing up)' },
              { step: "2", text: 'Scroll down and tap "Add to Home Screen"' },
              { step: "3", text: 'Tap "Add" — the app will appear on your Home Screen' },
            ].map((s) => (
              <div
                key={s.step}
                style={{
                  display: "flex",
                  gap: "1rem",
                  alignItems: "flex-start",
                  marginBottom: "1rem",
                }}
              >
                <span
                  style={{
                    fontFamily: "var(--font-montserrat)",
                    fontWeight: 800,
                    fontSize: "1.125rem",
                    color: "oklch(88% 0.008 80)",
                    flexShrink: 0,
                    lineHeight: 1.2,
                    minWidth: "1.5rem",
                  }}
                >
                  {s.step}
                </span>
                <p
                  style={{
                    fontFamily: "var(--font-montserrat)",
                    fontSize: "0.875rem",
                    lineHeight: 1.65,
                    color: "oklch(38% 0.008 260)",
                  }}
                >
                  {s.text}
                </p>
              </div>
            ))}
            <p
              style={{
                fontFamily: "var(--font-montserrat)",
                fontSize: "0.8rem",
                color: "oklch(62% 0.006 260)",
                marginTop: "0.5rem",
                fontStyle: "italic",
              }}
            >
              Once installed, it opens directly to your dashboard.
            </p>
          </div>
        </div>
      )}
    </>
  );
}

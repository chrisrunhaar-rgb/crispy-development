"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function DeleteNotesButton({ sessionId, sessionLabel }: { sessionId: string; sessionLabel: string }) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  async function handleDelete() {
    setLoading(true);
    setError("");
    const res = await fetch(`/api/coach/session?id=${sessionId}`, { method: "DELETE" });
    setLoading(false);
    if (!res.ok) {
      const d = await res.json().catch(() => ({}));
      setError(d.error ?? "Something went wrong. Please try again.");
      return;
    }
    router.push("/coach");
  }

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        style={{
          fontFamily: "var(--font-montserrat)",
          fontSize: "0.72rem",
          fontWeight: 600,
          letterSpacing: "0.06em",
          color: "oklch(50% 0.18 20)",
          background: "none",
          border: "1px solid oklch(85% 0.06 20)",
          borderRadius: "2px",
          padding: "0.5rem 1rem",
          cursor: "pointer",
          transition: "background 0.15s, border-color 0.15s",
        }}
        onMouseEnter={(e) => {
          (e.currentTarget as HTMLButtonElement).style.background = "oklch(97% 0.03 20)";
          (e.currentTarget as HTMLButtonElement).style.borderColor = "oklch(70% 0.12 20)";
        }}
        onMouseLeave={(e) => {
          (e.currentTarget as HTMLButtonElement).style.background = "none";
          (e.currentTarget as HTMLButtonElement).style.borderColor = "oklch(85% 0.06 20)";
        }}
      >
        Delete notes
      </button>

      {open && (
        <div
          style={{
            position: "fixed", inset: 0,
            background: "rgba(10,8,6,0.55)",
            display: "flex", alignItems: "center", justifyContent: "center",
            zIndex: 500, padding: "1.5rem",
          }}
          onClick={() => { if (!loading) { setOpen(false); setError(""); } }}
        >
          <div
            style={{
              background: "oklch(99% 0.003 80)",
              border: "1px solid oklch(88% 0.008 80)",
              borderRadius: "4px",
              padding: "2.5rem 2rem",
              width: "100%", maxWidth: "420px",
              boxShadow: "0 24px 64px rgba(0,0,0,0.22)",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <p style={{
              fontFamily: "var(--font-montserrat)", fontSize: "0.62rem", fontWeight: 700,
              letterSpacing: "0.14em", textTransform: "uppercase",
              color: "oklch(50% 0.18 20)", marginBottom: "1rem",
            }}>
              Permanent action
            </p>
            <h2 style={{
              fontFamily: "var(--font-cormorant)", fontStyle: "italic", fontWeight: 400,
              fontSize: "1.625rem", color: "oklch(22% 0.10 260)",
              marginBottom: "1rem", lineHeight: 1.3,
            }}>
              Delete these session notes?
            </h2>
            <p style={{
              fontFamily: "var(--font-montserrat)", fontSize: "0.8rem",
              color: "oklch(42% 0.008 260)", lineHeight: 1.7, marginBottom: "1.75rem",
            }}>
              You are about to permanently delete the notes from <strong>{sessionLabel}</strong>. This action cannot be undone. Once deleted, your coach will no longer be able to view or refer to these notes.
            </p>

            {error && (
              <p style={{ fontFamily: "var(--font-montserrat)", fontSize: "0.75rem", color: "oklch(50% 0.18 20)", marginBottom: "1rem" }}>
                {error}
              </p>
            )}

            <div style={{ display: "flex", gap: "0.75rem" }}>
              <button
                onClick={() => { setOpen(false); setError(""); }}
                disabled={loading}
                style={{
                  flex: 1, padding: "0.75rem",
                  fontFamily: "var(--font-montserrat)", fontSize: "0.75rem", fontWeight: 600,
                  letterSpacing: "0.06em",
                  background: "none",
                  border: "1px solid oklch(80% 0.008 260)",
                  borderRadius: "2px",
                  color: "oklch(42% 0.008 260)",
                  cursor: loading ? "not-allowed" : "pointer",
                }}
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                disabled={loading}
                style={{
                  flex: 1, padding: "0.75rem",
                  fontFamily: "var(--font-montserrat)", fontSize: "0.75rem", fontWeight: 700,
                  letterSpacing: "0.06em",
                  background: loading ? "oklch(72% 0.008 260)" : "oklch(50% 0.18 20)",
                  border: "none",
                  borderRadius: "2px",
                  color: "white",
                  cursor: loading ? "not-allowed" : "pointer",
                  transition: "background 0.15s",
                }}
              >
                {loading ? "Deleting…" : "Delete permanently"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

"use client";

import { useRef } from "react";
import Link from "next/link";

const navy     = "oklch(22% 0.10 260)";
const orange   = "oklch(65% 0.15 45)";
const offWhite = "oklch(97% 0.005 80)";
const mid      = "oklch(52% 0.008 260)";

type JournalEntry = { day_number: number; answer_1: string | null; answer_2: string | null };

export default function CompletionClient({ firstName, lastName, completedAt, journalEntries }: {
  firstName: string;
  lastName: string;
  completedAt: string;
  journalEntries: JournalEntry[];
}) {
  const journalRef = useRef<HTMLDivElement>(null);
  const fullName = [firstName, lastName].filter(Boolean).join(" ") || "Leader";
  const completedDate = new Date(completedAt).toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" });
  const filledEntries = journalEntries.filter(e => e.answer_1 || e.answer_2);

  function downloadJournal() {
    const lines: string[] = [
      "INFLUENTIAL LEADERSHIP CHALLENGE",
      "Personal Journal",
      `${fullName} · Completed ${completedDate}`,
      "",
      "═".repeat(60),
      "",
    ];
    filledEntries.forEach(entry => {
      lines.push(`DAY ${String(entry.day_number).padStart(2, "0")}`);
      lines.push("─".repeat(40));
      if (entry.answer_1) { lines.push("Reflection 1:"); lines.push(entry.answer_1); lines.push(""); }
      if (entry.answer_2) { lines.push("Reflection 2:"); lines.push(entry.answer_2); lines.push(""); }
      lines.push("");
    });
    const blob = new Blob([lines.join("\n")], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `IL-Challenge-Journal-${fullName.replace(/\s/g, "-")}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  }

  function printCertificate() {
    window.print();
  }

  return (
    <div style={{ background: offWhite, minHeight: "100dvh" }}>
      {/* Print-only certificate styles */}
      <style>{`
        @media print {
          .no-print { display: none !important; }
          .cert-only { display: block !important; }
          body { margin: 0; }
        }
        .cert-only { display: none; }
      `}</style>

      {/* On-screen completion page */}
      <div className="no-print">
        <div style={{ background: navy, padding: "0.875rem clamp(1rem, 4vw, 2rem)" }}>
          <Link href="/dashboard" style={{ color: "oklch(72% 0.04 260)", textDecoration: "none", fontSize: "0.75rem", fontFamily: "var(--font-montserrat)" }}>
            ← Dashboard
          </Link>
        </div>

        <div style={{ maxWidth: "640px", margin: "0 auto", padding: "clamp(2rem, 5vw, 4rem) clamp(1rem, 4vw, 2rem)", textAlign: "center" }}>

          {/* Trophy */}
          <div style={{ fontSize: "4rem", marginBottom: "1.5rem" }}>🏔️</div>

          <p style={{ fontFamily: "var(--font-montserrat)", fontSize: "0.62rem", fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", color: orange, marginBottom: "0.5rem" }}>
            Challenge complete
          </p>
          <h1 style={{ fontFamily: "var(--font-montserrat)", fontWeight: 900, fontSize: "clamp(1.75rem, 4vw, 2.5rem)", color: navy, lineHeight: 1.15, marginBottom: "0.75rem" }}>
            Well done, {firstName}.
          </h1>
          <p style={{ fontFamily: "var(--font-montserrat)", fontSize: "1rem", color: mid, lineHeight: 1.7, marginBottom: "2.5rem", maxWidth: "40ch", margin: "0 auto 2.5rem" }}>
            62 days. Completed {completedDate}. You did the inner work. That&apos;s what changes everything.
          </p>

          {/* Actions */}
          <div style={{ display: "flex", gap: "1rem", justifyContent: "center", flexWrap: "wrap", marginBottom: "3rem" }}>
            <button
              onClick={printCertificate}
              style={{ fontFamily: "var(--font-montserrat)", fontWeight: 700, fontSize: "0.875rem", color: offWhite, background: navy, border: "none", borderRadius: "8px", padding: "0.75rem 1.5rem", cursor: "pointer" }}
            >
              Download certificate
            </button>
            {filledEntries.length > 0 && (
              <button
                onClick={downloadJournal}
                style={{ fontFamily: "var(--font-montserrat)", fontWeight: 700, fontSize: "0.875rem", color: navy, background: "none", border: `1px solid ${navy}`, borderRadius: "8px", padding: "0.75rem 1.5rem", cursor: "pointer" }}
              >
                Download journal ({filledEntries.length} entries)
              </button>
            )}
          </div>

          {/* Journal preview */}
          {filledEntries.length > 0 && (
            <div ref={journalRef} style={{ textAlign: "left" }}>
              <p style={{ fontFamily: "var(--font-montserrat)", fontSize: "0.62rem", fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", color: mid, marginBottom: "1rem" }}>
                Your journal — {filledEntries.length} of 62 days
              </p>
              <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
                {filledEntries.slice(0, 10).map(entry => (
                  <div key={entry.day_number} style={{ background: "white", border: "1px solid oklch(88% 0.006 80)", borderRadius: "10px", padding: "1rem 1.25rem" }}>
                    <p style={{ fontFamily: "var(--font-montserrat)", fontSize: "0.6rem", fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: orange, marginBottom: "0.5rem" }}>
                      Day {entry.day_number}
                    </p>
                    {entry.answer_1 && <p style={{ fontFamily: "var(--font-montserrat)", fontSize: "0.875rem", color: "oklch(35% 0.008 260)", lineHeight: 1.65, marginBottom: entry.answer_2 ? "0.625rem" : 0 }}>{entry.answer_1}</p>}
                    {entry.answer_2 && <p style={{ fontFamily: "var(--font-montserrat)", fontSize: "0.875rem", color: "oklch(40% 0.008 260)", lineHeight: 1.65 }}>{entry.answer_2}</p>}
                  </div>
                ))}
                {filledEntries.length > 10 && (
                  <p style={{ fontFamily: "var(--font-montserrat)", fontSize: "0.8rem", color: mid, textAlign: "center" }}>
                    + {filledEntries.length - 10} more entries in the downloaded journal
                  </p>
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Print certificate */}
      <div className="cert-only" style={{ padding: "60px", fontFamily: "var(--font-montserrat)", textAlign: "center", border: `8px solid ${navy}`, margin: "40px", minHeight: "90vh", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: "1.5rem" }}>
        <div style={{ width: "60px", height: "4px", background: orange }} />
        <p style={{ fontSize: "0.7rem", fontWeight: 700, letterSpacing: "0.2em", textTransform: "uppercase", color: mid }}>Certificate of Completion</p>
        <h1 style={{ fontSize: "2.5rem", fontWeight: 900, color: navy, lineHeight: 1.1 }}>Influential Leadership<br />Challenge</h1>
        <p style={{ fontSize: "1rem", color: mid }}>This certifies that</p>
        <p style={{ fontSize: "2rem", fontWeight: 800, color: navy }}>{fullName}</p>
        <p style={{ fontSize: "1rem", color: mid }}>successfully completed all 62 sessions of the<br />Influential Leadership Challenge</p>
        <p style={{ fontSize: "0.9rem", color: mid }}>Based on <em>Deep Influence</em> by T.J. Addington</p>
        <p style={{ fontSize: "1rem", fontWeight: 700, color: navy }}>Completed {completedDate}</p>
        <div style={{ width: "60px", height: "4px", background: orange }} />
        <p style={{ fontSize: "0.75rem", color: "oklch(65% 0.008 260)", marginTop: "1rem" }}>crispyleaders.com · Crispy Development</p>
      </div>
    </div>
  );
}

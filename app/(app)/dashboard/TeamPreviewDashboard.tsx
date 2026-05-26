"use client";

import { useState } from "react";
import Link from "next/link";
import TeamAssessmentSelector from "./TeamAssessmentSelector";
import { BASE_JOURNEY_STEPS, getTypeLabel, TYPE_BADGE } from "@/components/TeamJourney";
import { type TeamLang } from "@/lib/team-i18n";

export default function TeamPreviewDashboard({ language }: { language: string }) {
  const lang: TeamLang = language === "id" ? "id" : "en";
  const [teamName, setTeamName] = useState("");
  const [editingName, setEditingName] = useState(false);

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>

      {/* Upgrade banner */}
      <div style={{
        background: "oklch(65% 0.15 45 / 0.08)",
        border: "1px solid oklch(65% 0.15 45 / 0.3)",
        padding: "1rem 1.5rem",
        display: "flex", alignItems: "center", justifyContent: "space-between",
        gap: "1rem", flexWrap: "wrap",
      }}>
        <div>
          <p style={{ fontFamily: "var(--font-montserrat)", fontWeight: 700, fontSize: "0.8rem", color: "oklch(35% 0.008 260)", margin: 0 }}>
            {lang === "id" ? "Anda sedang melihat pratinjau Team Pathway" : "You're previewing the Team Pathway"}
          </p>
          <p style={{ fontFamily: "var(--font-montserrat)", fontSize: "0.72rem", color: "oklch(52% 0.008 260)", margin: "0.25rem 0 0" }}>
            {lang === "id" ? "Upgrade untuk membawa seluruh tim ke dalam perjalanan ini." : "Upgrade to bring your whole team into the journey."}
          </p>
        </div>
        <Link href="/team-pathway" style={{
          fontFamily: "var(--font-montserrat)", fontWeight: 700, fontSize: "0.72rem",
          letterSpacing: "0.06em", color: "white", background: "oklch(30% 0.12 260)",
          padding: "0.625rem 1.25rem", textDecoration: "none", whiteSpace: "nowrap",
        }}>
          {lang === "id" ? "Upgrade ke Team Pathway →" : "Upgrade to Team Pathway →"}
        </Link>
      </div>

      {/* Block 1: Tile your team */}
      <div style={{ border: "1px solid oklch(86% 0.008 80)", borderRadius: "8px", overflow: "hidden" }}>
        <div style={{ background: "oklch(30% 0.12 260)", padding: "1.25rem 1.75rem" }}>
          <p style={{ fontFamily: "var(--font-montserrat)", fontSize: "0.62rem", fontWeight: 800, letterSpacing: "0.2em", textTransform: "uppercase", color: "oklch(65% 0.15 45)", marginBottom: "0.5rem" }}>
            {lang === "id" ? "Tim Anda" : "The Team"}
          </p>
          {editingName ? (
            <input
              autoFocus
              value={teamName}
              onChange={e => setTeamName(e.target.value)}
              onBlur={() => setEditingName(false)}
              onKeyDown={e => { if (e.key === "Enter") setEditingName(false); }}
              placeholder={lang === "id" ? "Nama tim Anda…" : "Your team name…"}
              style={{
                fontFamily: "var(--font-cormorant)", fontStyle: "italic", fontWeight: 400,
                fontSize: "1.5rem", color: "oklch(97% 0.005 80)",
                background: "transparent", border: "none",
                borderBottom: "1px solid oklch(65% 0.15 45 / 0.5)",
                outline: "none", width: "100%", padding: "0.125rem 0",
              }}
            />
          ) : (
            <button
              onClick={() => setEditingName(true)}
              style={{
                fontFamily: "var(--font-cormorant)", fontStyle: "italic", fontWeight: 400,
                fontSize: "1.5rem", color: teamName ? "oklch(97% 0.005 80)" : "oklch(60% 0.04 260)",
                background: "none", border: "none", cursor: "text", padding: 0,
                display: "flex", alignItems: "center", gap: "0.5rem",
              }}
            >
              {teamName || (lang === "id" ? "Nama tim Anda…" : "Your team name…")}
              <svg width="12" height="12" viewBox="0 0 16 16" fill="none" stroke="oklch(65% 0.15 45)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}>
                <path d="M11 2l3 3-8 8H3v-3l8-8z" />
              </svg>
            </button>
          )}
        </div>

        <div style={{
          background: "oklch(98% 0.003 80)", padding: "0.875rem 1.75rem",
          borderTop: "1px solid oklch(90% 0.006 80)",
          display: "flex", alignItems: "center", justifyContent: "space-between", gap: "1rem", flexWrap: "wrap",
        }}>
          <p style={{ fontFamily: "var(--font-montserrat)", fontSize: "0.72rem", color: "oklch(52% 0.008 260)", margin: 0, fontWeight: 600 }}>
            {lang === "id" ? "8 kursi anggota tersedia" : "8 member seats available"}
          </p>
          <Link href="/team-pathway" style={{
            fontFamily: "var(--font-montserrat)", fontWeight: 700, fontSize: "0.7rem",
            letterSpacing: "0.06em", color: "oklch(30% 0.12 260)",
            border: "1.5px solid oklch(75% 0.04 260)", padding: "0.45rem 1rem",
            textDecoration: "none",
          }}>
            {lang === "id" ? "Tambah Anggota →" : "Add Members →"}
          </Link>
        </div>
      </div>

      {/* Block 2: Team Assessments (read-only) */}
      <TeamAssessmentSelector teamId="" initialSelected={[]} readOnly />

      {/* Block 3: Journey (locked tiles) */}
      <div style={{ border: "1px solid oklch(86% 0.008 80)", borderRadius: "8px", overflow: "hidden" }}>
        <div style={{ background: "oklch(30% 0.12 260)", padding: "1.25rem 1.75rem" }}>
          <p style={{ fontFamily: "var(--font-montserrat)", fontSize: "0.62rem", fontWeight: 800, letterSpacing: "0.2em", textTransform: "uppercase", color: "oklch(65% 0.15 45)", marginBottom: "0.375rem" }}>
            {lang === "id" ? "Perjalanan" : "Journey"}
          </p>
          <p style={{ fontFamily: "var(--font-cormorant)", fontStyle: "italic", fontSize: "0.975rem", color: "oklch(66% 0.04 260)", margin: 0 }}>
            {lang === "id" ? "18 langkah untuk tim Anda" : "18 steps for your team"}
          </p>
        </div>

        <div style={{ borderTop: "1px solid oklch(22% 0.10 260 / 0.3)" }}>
          {BASE_JOURNEY_STEPS.map((step, i) => {
            const badge = TYPE_BADGE[step.type] ?? TYPE_BADGE.article;
            const label = getTypeLabel(step.type, lang);
            const isLast = i === BASE_JOURNEY_STEPS.length - 1;
            return (
              <div
                key={step.number}
                style={{
                  padding: "0.875rem 1.25rem",
                  borderBottom: isLast ? "none" : "1px solid oklch(92% 0.004 80)",
                  display: "flex", alignItems: "center", gap: "0.875rem",
                  opacity: 0.75,
                }}
              >
                <span style={{
                  fontFamily: "var(--font-montserrat)", fontWeight: 700, fontSize: "0.65rem",
                  color: "oklch(62% 0.008 260)", minWidth: "20px", flexShrink: 0,
                }}>
                  {step.number}
                </span>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <p style={{
                    fontFamily: "var(--font-montserrat)", fontWeight: 600, fontSize: "0.8rem",
                    color: "oklch(30% 0.008 260)", margin: 0,
                    overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap",
                  }}>
                    {lang === "id" && step.title_id ? step.title_id : step.title}
                  </p>
                </div>
                <span style={{
                  fontFamily: "var(--font-montserrat)", fontWeight: 700, fontSize: "0.58rem",
                  letterSpacing: "0.08em", textTransform: "uppercase",
                  color: badge.color, background: badge.bg,
                  padding: "0.2rem 0.5rem", flexShrink: 0,
                }}>
                  {label}
                </span>
                <svg width="12" height="12" viewBox="0 0 16 16" fill="none" stroke="oklch(80% 0.008 260)" strokeWidth="1.5" strokeLinecap="round" style={{ flexShrink: 0 }}>
                  <rect x="3" y="7" width="10" height="8" rx="1" />
                  <path d="M5 7V5a3 3 0 016 0v2" />
                </svg>
              </div>
            );
          })}
        </div>

        <div style={{
          background: "oklch(98% 0.003 80)", borderTop: "1px solid oklch(90% 0.006 80)",
          padding: "1rem 1.25rem", textAlign: "center",
        }}>
          <Link href="/team-pathway" style={{
            fontFamily: "var(--font-montserrat)", fontWeight: 700, fontSize: "0.72rem",
            letterSpacing: "0.06em", color: "oklch(30% 0.12 260)", textDecoration: "none",
          }}>
            {lang === "id" ? "Upgrade untuk membuka perjalanan →" : "Upgrade to unlock the full journey →"}
          </Link>
        </div>
      </div>
    </div>
  );
}

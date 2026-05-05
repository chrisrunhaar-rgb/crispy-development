"use client";

import { useState, useTransition, useRef, useCallback } from "react";
import Link from "next/link";
import type { User } from "@supabase/supabase-js";
import { saveWheelOfLifeTeamResult } from "./actions";

// ── SVG WHEEL CONSTANTS ───────────────────────────────────────────────────────

const CX = 250, CY = 250, MAX_R = 155;
const LABEL_R = MAX_R + 22;
const GRID_RINGS = [2, 4, 6, 8, 10];

// ── SEGMENT DATA (same as personal version) ───────────────────────────────────

const SEGMENTS = [
  { key: "family",     titleEn: "Family",           color: "#3b5fa0", colorFill: "rgba(59,95,160,0.12)" },
  { key: "finance",    titleEn: "Finance",           color: "#c4762a", colorFill: "rgba(196,118,42,0.12)" },
  { key: "relaxation", titleEn: "Relaxation",        color: "#2a8f8f", colorFill: "rgba(42,143,143,0.12)" },
  { key: "ministry",   titleEn: "Ministry",          color: "#b83820", colorFill: "rgba(184,56,32,0.12)" },
  { key: "spiritual",  titleEn: "Spiritual",         color: "#8a6415", colorFill: "rgba(138,100,21,0.12)" },
  { key: "community",  titleEn: "Community",         color: "#2a8a64", colorFill: "rgba(42,138,100,0.12)" },
  { key: "learning",   titleEn: "Lifelong Learning", color: "#6a3a9e", colorFill: "rgba(106,58,158,0.12)" },
  { key: "health",     titleEn: "Health",            color: "#2e8a40", colorFill: "rgba(46,138,64,0.12)" },
];

const SEGMENT_DETAILS = [
  { key: "family",     desc: "Quality of relationships and time with family members.",
    teamNote: "Family stress doesn't stay at home. A team member struggling at home is struggling at work — even if they don't say it. A leader who knows this can respond with grace rather than frustration." },
  { key: "finance",    desc: "Financial stability, budgeting, and satisfaction with your financial state.",
    teamNote: "Financial anxiety is one of the most distracting forces in a person's life. It's rarely talked about in teams. A culture where people can be honest about financial pressure is a culture where people can be honest about anything." },
  { key: "relaxation", desc: "Your ability to rest, recharge, and enjoy leisure activities.",
    teamNote: "A team full of people who never rest is a team running on fumes. Sustainable pace is a leadership responsibility, not just a personal discipline. When your team is burning out, the wheel shows it before the resignation letter does." },
  { key: "ministry",   desc: "Involvement and satisfaction with serving others and fulfilling your calling.",
    teamNote: "People who feel aligned with their calling bring something extra to their work. When a team member's ministry score is low, it may mean they're serving out of obligation, not overflow. That matters." },
  { key: "spiritual",  desc: "Connection to your faith, spiritual practices, and relationship with God.",
    teamNote: "For faith-based teams, spiritual health is not a peripheral concern. A spiritually depleted leader leads from emptiness. This dimension invites honesty about what's actually feeding the team's inner life." },
  { key: "community",  desc: "Relationships outside family and contributions to the broader community.",
    teamNote: "Isolated team members are at risk. People who have no life outside the team often become over-dependent on the team for all their relational needs — which puts unsustainable pressure on team dynamics." },
  { key: "learning",   desc: "Commitment to personal growth through education and skill-building.",
    teamNote: "Teams that stop learning stop growing. When learning scores are low across the team, it often signals a culture of busyness over development — which eventually shows up in performance." },
  { key: "health",     desc: "Physical and mental well-being, fitness, energy levels, and emotional health.",
    teamNote: "Physical and mental health are the foundation of sustained leadership. A leader who ignores their health is borrowing from the future. A team where health is regularly discussed is a team that stays in the game." },
];

// ── SVG HELPER FUNCTIONS ──────────────────────────────────────────────────────

function getAngleRad(i: number) {
  return (-90 + i * 45) * Math.PI / 180;
}

function getPoint(i: number, score: number): [number, number] {
  const r = (score / 10) * MAX_R;
  return [
    CX + r * Math.cos(getAngleRad(i)),
    CY + r * Math.sin(getAngleRad(i)),
  ];
}

function sectorPath(i: number, r: number): string {
  const a1 = (-90 + i * 45 - 22.5) * Math.PI / 180;
  const a2 = (-90 + i * 45 + 22.5) * Math.PI / 180;
  const x1 = CX + r * Math.cos(a1);
  const y1 = CY + r * Math.sin(a1);
  const x2 = CX + r * Math.cos(a2);
  const y2 = CY + r * Math.sin(a2);
  return `M ${CX} ${CY} L ${x1.toFixed(2)} ${y1.toFixed(2)} A ${r} ${r} 0 0 1 ${x2.toFixed(2)} ${y2.toFixed(2)} Z`;
}

function scorePolygonPoints(scores: number[]): string {
  return scores.map((s, i) => {
    const [x, y] = getPoint(i, s);
    return `${x.toFixed(2)},${y.toFixed(2)}`;
  }).join(" ");
}

function getLabelPos(i: number): { x: number; y: number; anchor: "middle" | "start" | "end"; dy: number } {
  const angle = -90 + i * 45;
  const r = LABEL_R;
  const rad = angle * Math.PI / 180;
  const x = CX + r * Math.cos(rad);
  const y = CY + r * Math.sin(rad);
  let anchor: "middle" | "start" | "end" = "middle";
  let dy = 0;
  if (angle > -22.5 && angle < 22.5) { anchor = "start"; }
  else if (angle > 22.5 && angle < 67.5) { anchor = "start"; }
  else if (angle > 67.5 && angle < 112.5) { anchor = "middle"; dy = 14; }
  else if (angle > 112.5 && angle < 157.5) { anchor = "end"; }
  else if (angle > 157.5 || angle < -157.5) { anchor = "end"; }
  else if (angle < -112.5 && angle > -157.5) { anchor = "end"; }
  else if (angle < -67.5 && angle > -112.5) { anchor = "middle"; dy = -6; }
  else if (angle < -22.5 && angle > -67.5) { anchor = "start"; }
  return { x, y, anchor, dy };
}

const DEFAULT_SCORES: Record<string, number> = {
  family: 5, finance: 5, relaxation: 5, ministry: 5,
  spiritual: 5, community: 5, learning: 5, health: 5,
};

// ── COMPONENT ─────────────────────────────────────────────────────────────────

export default function WheelOfLifeTeamClient({ user }: { user: User | null }) {
  const [scores, setScores] = useState<Record<string, number>>(DEFAULT_SCORES);
  const [scoresSaved, setScoresSaved] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);
  const [expandedSegment, setExpandedSegment] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();
  const svgRef = useRef<SVGSVGElement>(null);

  const orderedScores = SEGMENTS.map(s => scores[s.key] ?? 5);
  const avg = (Object.values(scores).reduce((a, b) => a + b, 0) / 8).toFixed(1);

  function handleScoreChange(key: string, value: number) {
    setScores(prev => ({ ...prev, [key]: value }));
    setScoresSaved(false);
    setSaveError(null);
  }

  function handleSaveScores() {
    if (!user) return;
    startTransition(async () => {
      const result = await saveWheelOfLifeTeamResult(scores);
      if (result.error) {
        setSaveError(result.error);
      } else {
        setScoresSaved(true);
      }
    });
  }

  const handleDownload = useCallback(() => {
    if (!svgRef.current) return;
    const svgEl = svgRef.current;
    const serializer = new XMLSerializer();
    const svgStr = serializer.serializeToString(svgEl);
    const svgWithDecl = `<?xml version="1.0" encoding="UTF-8"?>\n${svgStr}`;
    const canvas = document.createElement("canvas");
    canvas.width = 500;
    canvas.height = 500;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const img = new Image();
    const blob = new Blob([svgWithDecl], { type: "image/svg+xml;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    img.onload = () => {
      ctx.fillStyle = "#f8f7f4";
      ctx.fillRect(0, 0, 500, 500);
      ctx.drawImage(img, 0, 0, 500, 500);
      URL.revokeObjectURL(url);
      const link = document.createElement("a");
      link.download = "team-wheel-of-life.png";
      link.href = canvas.toDataURL("image/png");
      link.click();
    };
    img.src = url;
  }, []);

  return (
    <div style={{ fontFamily: "var(--font-montserrat)", background: "oklch(97% 0.005 80)", minHeight: "100vh" }}>

      {/* ── HERO ── */}
      <section style={{
        background: "oklch(22% 0.08 260)",
        paddingTop: "clamp(4rem, 8vw, 7rem)",
        paddingBottom: "clamp(3.5rem, 7vw, 6rem)",
        position: "relative",
        overflow: "hidden",
      }}>
        <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: "3px", background: "oklch(65% 0.15 45)" }} />

        {/* Watermark */}
        <div aria-hidden="true" style={{
          position: "absolute",
          right: "-1rem",
          bottom: "-2rem",
          fontFamily: "var(--font-montserrat)",
          fontWeight: 900,
          fontSize: "clamp(10rem, 28vw, 22rem)",
          color: "oklch(97% 0.005 80 / 0.03)",
          lineHeight: 1,
          userSelect: "none",
          pointerEvents: "none",
          letterSpacing: "-0.06em",
        }}>
          WOL
        </div>

        <div className="container-wide" style={{ position: "relative" }}>
          <Link
            href="/team"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "0.4rem",
              fontSize: "0.72rem",
              fontWeight: 700,
              letterSpacing: "0.12em",
              textTransform: "uppercase",
              color: "oklch(72% 0.04 260)",
              textDecoration: "none",
              marginBottom: "2.5rem",
            }}
          >
            ← Team Pathway
          </Link>

          <div style={{ display: "flex", gap: "0.75rem", alignItems: "center", marginBottom: "1.5rem", flexWrap: "wrap" }}>
            <span style={{
              fontFamily: "var(--font-montserrat)",
              fontSize: "0.65rem",
              fontWeight: 800,
              letterSpacing: "0.18em",
              textTransform: "uppercase",
              color: "oklch(65% 0.15 45)",
              background: "oklch(65% 0.15 45 / 0.12)",
              padding: "5px 12px",
              border: "1px solid oklch(65% 0.15 45 / 0.3)",
            }}>
              Team Assessment · Wheel of Life
            </span>
            <span style={{
              fontFamily: "var(--font-montserrat)",
              fontSize: "0.65rem",
              fontWeight: 700,
              letterSpacing: "0.12em",
              textTransform: "uppercase",
              color: "oklch(72% 0.04 260)",
              background: "oklch(38% 0.10 260 / 0.15)",
              padding: "5px 12px",
            }}>
              Assessment · 10–15 min
            </span>
          </div>

          <h1 style={{
            fontFamily: "var(--font-montserrat)",
            fontWeight: 800,
            fontSize: "clamp(2rem, 5vw, 3.5rem)",
            color: "oklch(97% 0.005 80)",
            lineHeight: 1.1,
            letterSpacing: "-0.025em",
            marginBottom: "1.25rem",
            maxWidth: "20ch",
          }}>
            Team Wheel of Life
          </h1>

          <p style={{
            fontFamily: "var(--font-montserrat)",
            fontSize: "clamp(1rem, 2vw, 1.1875rem)",
            color: "oklch(72% 0.04 260)",
            lineHeight: 1.7,
            maxWidth: "52ch",
            marginBottom: "2.5rem",
          }}>
            A leader who knows where their people are struggling can lead them better. This isn&rsquo;t just self-reflection — it&rsquo;s a team practice.
          </p>

          <a href="#wheel-tool" style={{
            fontFamily: "var(--font-montserrat)",
            fontWeight: 700,
            fontSize: "0.8125rem",
            letterSpacing: "0.06em",
            textTransform: "uppercase",
            background: "oklch(65% 0.15 45)",
            color: "oklch(14% 0.08 260)",
            textDecoration: "none",
            padding: "0.875rem 1.75rem",
            display: "inline-block",
          }}>
            Rate Your Wheel →
          </a>
        </div>
      </section>

      {/* ── SECTION 1: Why Leaders Need to Know Their People's Life Balance ── */}
      <section style={{ paddingBlock: "clamp(3.5rem, 6vw, 5rem)", background: "oklch(97% 0.005 80)" }}>
        <div className="container-wide" style={{ maxWidth: "760px" }}>
          <p style={{
            fontFamily: "var(--font-montserrat)",
            fontSize: "0.68rem",
            fontWeight: 800,
            letterSpacing: "0.18em",
            textTransform: "uppercase",
            color: "oklch(65% 0.15 45)",
            marginBottom: "1rem",
          }}>
            Section 1
          </p>
          <h2 style={{
            fontFamily: "var(--font-montserrat)",
            fontWeight: 800,
            fontSize: "clamp(1.5rem, 3vw, 2.25rem)",
            color: "oklch(22% 0.08 260)",
            letterSpacing: "-0.02em",
            lineHeight: 1.2,
            marginBottom: "2rem",
          }}>
            Why Leaders Need to Know Their People&rsquo;s Life Balance
          </h2>

          <p style={{
            fontFamily: "var(--font-montserrat)",
            fontSize: "clamp(1.0625rem, 2.5vw, 1.25rem)",
            fontWeight: 600,
            lineHeight: 1.75,
            color: "oklch(22% 0.08 260)",
            marginBottom: "1.5rem",
          }}>
            Your team member who keeps missing deadlines may not need more accountability. They may need someone to ask how they&rsquo;re doing.
          </p>

          <p style={{
            fontFamily: "var(--font-montserrat)",
            fontSize: "1rem",
            lineHeight: 1.8,
            color: "oklch(38% 0.008 260)",
            marginBottom: "1.5rem",
          }}>
            Performance is downstream from wellbeing. When people are thriving across the dimensions of their lives — relationally, spiritually, physically, financially — they show up to work whole. When they&rsquo;re depleted in multiple areas, they bring that depletion into the team, even if they never say a word about it.
          </p>
          <p style={{
            fontFamily: "var(--font-montserrat)",
            fontSize: "1rem",
            lineHeight: 1.8,
            color: "oklch(38% 0.008 260)",
            marginBottom: "1.5rem",
          }}>
            Most leaders respond to symptoms without knowing the cause. They see disengagement, irritability, declining quality, or withdrawal — and they reach for performance levers. But the real issue is often something the leader has no visibility into, because the culture has never created space for that kind of honesty.
          </p>

          <div style={{
            background: "oklch(95% 0.005 80)",
            borderLeft: "3px solid oklch(65% 0.15 45)",
            padding: "1.5rem 1.75rem",
          }}>
            <p style={{
              fontFamily: "var(--font-montserrat)",
              fontSize: "0.9rem",
              fontWeight: 500,
              lineHeight: 1.7,
              color: "oklch(38% 0.008 260)",
              margin: 0,
            }}>
              <strong style={{ color: "oklch(22% 0.08 260)", fontWeight: 700 }}>The goal of this tool: </strong>
              Not to give leaders more data to manage people with — but to give team members a language to describe where they are, and leaders a framework to respond with care.
            </p>
          </div>
        </div>
      </section>

      {/* ── SECTION 2: The Cost of Burned-Out Team Members ── */}
      <section style={{ paddingBlock: "clamp(3.5rem, 6vw, 5rem)", background: "oklch(30% 0.12 260)" }}>
        <div className="container-wide" style={{ maxWidth: "760px" }}>
          <p style={{
            fontFamily: "var(--font-montserrat)",
            fontSize: "0.68rem",
            fontWeight: 800,
            letterSpacing: "0.18em",
            textTransform: "uppercase",
            color: "oklch(65% 0.15 45)",
            marginBottom: "1rem",
          }}>
            Section 2
          </p>
          <h2 style={{
            fontFamily: "var(--font-montserrat)",
            fontWeight: 800,
            fontSize: "clamp(1.5rem, 3vw, 2.25rem)",
            color: "oklch(97% 0.005 80)",
            letterSpacing: "-0.02em",
            lineHeight: 1.2,
            marginBottom: "2rem",
          }}>
            The Cost of Burned-Out Team Members
          </h2>

          <p style={{
            fontFamily: "var(--font-montserrat)",
            fontSize: "1rem",
            lineHeight: 1.8,
            color: "oklch(78% 0.03 260)",
            marginBottom: "1.5rem",
          }}>
            Burnout is not a personal failure. It&rsquo;s a system failure. When a team member burns out, the organisation pays — in replacement costs, in team morale, in the knowledge and relationships that walk out the door.
          </p>
          <p style={{
            fontFamily: "var(--font-montserrat)",
            fontSize: "1rem",
            lineHeight: 1.8,
            color: "oklch(78% 0.03 260)",
            marginBottom: "2rem",
          }}>
            But the leader often doesn&rsquo;t see it coming — not because they don&rsquo;t care, but because they don&rsquo;t have visibility. The Wheel of Life gives you early warning. Not just a snapshot of today, but a pattern over time — is someone&rsquo;s health score dropping? Is their family score consistently low? Is the spiritual score trending towards empty?
          </p>

          <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
            gap: "1px",
            background: "oklch(22% 0.10 260 / 0.5)",
          }}>
            {[
              {
                title: "Early Warning",
                body: "Declining scores in health, family, or relaxation often precede performance issues by months. Catching them early is infinitely cheaper than reacting late.",
              },
              {
                title: "Targeted Support",
                body: "Knowing which dimension is low lets you respond specifically — not with generic wellness initiatives, but with actual care that addresses the real pressure.",
              },
              {
                title: "Shared Responsibility",
                body: "When the whole team does this together, it normalises honesty. Burnout thrives in silence. A culture where people can name their load is a culture where it gets shared.",
              },
            ].map(item => (
              <div key={item.title} style={{
                background: "oklch(26% 0.11 260)",
                padding: "1.75rem",
              }}>
                <h3 style={{
                  fontFamily: "var(--font-montserrat)",
                  fontWeight: 700,
                  fontSize: "0.9375rem",
                  color: "oklch(97% 0.005 80)",
                  marginBottom: "0.625rem",
                }}>
                  {item.title}
                </h3>
                <p style={{
                  fontFamily: "var(--font-montserrat)",
                  fontSize: "0.875rem",
                  lineHeight: 1.7,
                  color: "oklch(72% 0.04 260)",
                  margin: 0,
                }}>
                  {item.body}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── SECTION 3: How to Create a Culture of Honesty ── */}
      <section style={{ paddingBlock: "clamp(3.5rem, 6vw, 5rem)", background: "oklch(97% 0.005 80)" }}>
        <div className="container-wide" style={{ maxWidth: "760px" }}>
          <p style={{
            fontFamily: "var(--font-montserrat)",
            fontSize: "0.68rem",
            fontWeight: 800,
            letterSpacing: "0.18em",
            textTransform: "uppercase",
            color: "oklch(65% 0.15 45)",
            marginBottom: "1rem",
          }}>
            Section 3
          </p>
          <h2 style={{
            fontFamily: "var(--font-montserrat)",
            fontWeight: 800,
            fontSize: "clamp(1.5rem, 3vw, 2.25rem)",
            color: "oklch(22% 0.08 260)",
            letterSpacing: "-0.02em",
            lineHeight: 1.2,
            marginBottom: "2rem",
          }}>
            Creating a Culture Where People Can Be Honest
          </h2>

          <p style={{
            fontFamily: "var(--font-montserrat)",
            fontSize: "1rem",
            lineHeight: 1.8,
            color: "oklch(38% 0.008 260)",
            marginBottom: "1.5rem",
          }}>
            Honesty doesn&rsquo;t happen just because a leader asks for it. It happens when people believe the honest answer is safe — that it won&rsquo;t be used against them, won&rsquo;t trigger unwanted intervention, and won&rsquo;t change how they&rsquo;re valued on the team.
          </p>

          <div style={{ display: "flex", flexDirection: "column", gap: "1rem", marginBottom: "1.5rem" }}>
            {[
              { label: "Go first", body: "The leader who shares their own Wheel of Life scores — including the low ones — signals to the team that vulnerability is welcome here. You set the floor. What you model, people will risk." },
              { label: "Respond, don't fix", body: "When someone shares a low score, the instinct is to solve it. Resist. Curiosity is more powerful than solutions. Ask what they need, not what you think they should do." },
              { label: "Make it regular", body: "One-off exercises produce one-off honesty. Building the Wheel into a quarterly rhythm — sharing scores, noting trends, adjusting workloads — builds a culture." },
            ].map((item) => (
              <div key={item.label} style={{
                background: "oklch(95% 0.005 80)",
                borderLeft: "3px solid oklch(65% 0.15 45)",
                padding: "1.25rem 1.5rem",
              }}>
                <p style={{
                  fontFamily: "var(--font-montserrat)",
                  fontWeight: 700,
                  fontSize: "0.9375rem",
                  color: "oklch(22% 0.08 260)",
                  marginBottom: "0.5rem",
                }}>
                  {item.label}
                </p>
                <p style={{
                  fontFamily: "var(--font-montserrat)",
                  fontSize: "0.875rem",
                  lineHeight: 1.7,
                  color: "oklch(38% 0.008 260)",
                  margin: 0,
                }}>
                  {item.body}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── SECTION 4: Biblical Angle ── */}
      <section style={{ paddingBlock: "clamp(3.5rem, 6vw, 5rem)", background: "oklch(22% 0.08 260)" }}>
        <div className="container-wide" style={{ maxWidth: "760px" }}>
          <p style={{
            fontFamily: "var(--font-montserrat)",
            fontSize: "0.68rem",
            fontWeight: 800,
            letterSpacing: "0.18em",
            textTransform: "uppercase",
            color: "oklch(65% 0.15 45)",
            marginBottom: "1rem",
          }}>
            Section 4
          </p>
          <h2 style={{
            fontFamily: "var(--font-montserrat)",
            fontWeight: 800,
            fontSize: "clamp(1.5rem, 3vw, 2.25rem)",
            color: "oklch(97% 0.005 80)",
            letterSpacing: "-0.02em",
            lineHeight: 1.2,
            marginBottom: "2rem",
          }}>
            Carry One Another&rsquo;s Burdens
          </h2>

          <blockquote style={{
            borderLeft: "3px solid oklch(65% 0.15 45)",
            paddingLeft: "2rem",
            marginLeft: 0,
            marginBottom: "2rem",
          }}>
            <p style={{
              fontFamily: "var(--font-montserrat)",
              fontSize: "clamp(1.125rem, 2.5vw, 1.4rem)",
              fontWeight: 600,
              fontStyle: "italic",
              color: "oklch(92% 0.005 80)",
              lineHeight: 1.6,
              marginBottom: "0.75rem",
            }}>
              &ldquo;Carry each other&rsquo;s burdens, and in this way you will fulfil the law of Christ.&rdquo;
            </p>
            <cite style={{
              fontFamily: "var(--font-montserrat)",
              fontSize: "0.8rem",
              fontWeight: 700,
              letterSpacing: "0.1em",
              textTransform: "uppercase",
              color: "oklch(65% 0.15 45)",
              fontStyle: "normal",
            }}>
              Galatians 6:2
            </cite>
          </blockquote>

          <p style={{
            fontFamily: "var(--font-montserrat)",
            fontSize: "1rem",
            lineHeight: 1.8,
            color: "oklch(78% 0.03 260)",
            marginBottom: "1.5rem",
          }}>
            Burden-bearing is not a metaphor. It&rsquo;s a practice. And it requires knowledge — you can&rsquo;t carry what you don&rsquo;t know about. The Wheel of Life is, at its core, a tool for making burdens visible so they can be shared.
          </p>
          <p style={{
            fontFamily: "var(--font-montserrat)",
            fontSize: "1rem",
            lineHeight: 1.8,
            color: "oklch(78% 0.03 260)",
          }}>
            For a faith-based team, this practice is not just good leadership — it&rsquo;s obedience. A leader who creates the conditions for burden-sharing is not being soft. They&rsquo;re being faithful. They&rsquo;re building the kind of community Paul is describing — one where people are genuinely known, and genuinely held.
          </p>
        </div>
      </section>

      {/* ── SECTION 5: Cross-Cultural Note ── */}
      <section style={{ paddingBlock: "clamp(3.5rem, 6vw, 5rem)", background: "oklch(97% 0.005 80)" }}>
        <div className="container-wide" style={{ maxWidth: "760px" }}>
          <p style={{
            fontFamily: "var(--font-montserrat)",
            fontSize: "0.68rem",
            fontWeight: 800,
            letterSpacing: "0.18em",
            textTransform: "uppercase",
            color: "oklch(65% 0.15 45)",
            marginBottom: "1rem",
          }}>
            Section 5
          </p>
          <h2 style={{
            fontFamily: "var(--font-montserrat)",
            fontWeight: 800,
            fontSize: "clamp(1.5rem, 3vw, 2.25rem)",
            color: "oklch(22% 0.08 260)",
            letterSpacing: "-0.02em",
            lineHeight: 1.2,
            marginBottom: "2rem",
          }}>
            Cross-Cultural Note: When Personal Struggles Are Private
          </h2>

          <p style={{
            fontFamily: "var(--font-montserrat)",
            fontSize: "1rem",
            lineHeight: 1.8,
            color: "oklch(38% 0.008 260)",
            marginBottom: "1.5rem",
          }}>
            In many cultures, personal struggles are deeply private. Sharing a low score in family or finance with a leader — or a team — is not neutral. It can feel exposing, shameful, or disloyal. A leader who ignores this and runs the exercise with a &ldquo;just be honest&rdquo; instruction may get shallow scores — or create real harm.
          </p>

          <div style={{
            background: "oklch(95% 0.005 80)",
            borderLeft: "3px solid oklch(22% 0.08 260)",
            padding: "1.5rem 1.75rem",
            marginBottom: "1.5rem",
          }}>
            <p style={{
              fontFamily: "var(--font-montserrat)",
              fontWeight: 700,
              fontSize: "0.9375rem",
              color: "oklch(22% 0.08 260)",
              marginBottom: "0.5rem",
            }}>
              Honour the culture, preserve the benefit:
            </p>
            <p style={{
              fontFamily: "var(--font-montserrat)",
              fontSize: "0.9rem",
              lineHeight: 1.7,
              color: "oklch(38% 0.008 260)",
              margin: 0,
            }}>
              In high-context, shame-sensitive cultures, consider using the Wheel as a private tool first — scores shared only with the leader, in a 1-on-1 context, with explicit assurance about how the information will be used. Never pressure disclosure. The goal is care, not data collection. If the culture prevents full honesty in a group, let 1-on-1 honesty be enough.
            </p>
          </div>

          <p style={{
            fontFamily: "var(--font-montserrat)",
            fontSize: "1rem",
            lineHeight: 1.8,
            color: "oklch(38% 0.008 260)",
          }}>
            What matters is not the format but the intent — and the intent is that every person on your team feels genuinely seen, not exposed. A tool used without cultural wisdom is not care. It&rsquo;s extraction.
          </p>
        </div>
      </section>

      {/* ── 8 DIMENSIONS WITH TEAM NOTES ── */}
      <section style={{ paddingBlock: "clamp(3.5rem, 6vw, 5rem)", background: "oklch(30% 0.12 260)" }}>
        <div className="container-wide">
          <p style={{
            fontFamily: "var(--font-montserrat)",
            fontSize: "0.68rem",
            fontWeight: 800,
            letterSpacing: "0.18em",
            textTransform: "uppercase",
            color: "oklch(65% 0.15 45)",
            marginBottom: "0.875rem",
          }}>
            The 8 Dimensions
          </p>
          <h2 style={{
            fontFamily: "var(--font-montserrat)",
            fontWeight: 800,
            fontSize: "clamp(1.5rem, 3vw, 2.25rem)",
            color: "oklch(97% 0.005 80)",
            letterSpacing: "-0.02em",
            lineHeight: 1.2,
            marginBottom: "0.875rem",
          }}>
            What Each Dimension Means for a Team
          </h2>
          <p style={{
            fontFamily: "var(--font-montserrat)",
            fontSize: "0.9375rem",
            lineHeight: 1.7,
            color: "oklch(72% 0.04 260)",
            marginBottom: "2.5rem",
            maxWidth: "56ch",
          }}>
            Read through each dimension. Tap to see why it matters specifically for a team leader to know.
          </p>

          <div style={{ display: "flex", flexDirection: "column", gap: "2px" }}>
            {SEGMENT_DETAILS.map((seg, i) => {
              const match = SEGMENTS.find(s => s.key === seg.key)!;
              const isOpen = expandedSegment === seg.key;
              return (
                <div key={seg.key} style={{
                  background: isOpen ? "oklch(22% 0.10 260)" : "oklch(26% 0.11 260)",
                  overflow: "hidden",
                  transition: "background 0.2s",
                }}>
                  <button
                    onClick={() => setExpandedSegment(isOpen ? null : seg.key)}
                    style={{
                      width: "100%",
                      padding: "1.25rem 1.5rem",
                      background: "transparent",
                      border: "none",
                      cursor: "pointer",
                      display: "flex",
                      alignItems: "center",
                      gap: "1rem",
                      textAlign: "left",
                    }}
                  >
                    <span style={{
                      fontFamily: "var(--font-montserrat)",
                      fontWeight: 800,
                      fontSize: "1.5rem",
                      color: "oklch(65% 0.15 45 / 0.5)",
                      lineHeight: 1,
                      flexShrink: 0,
                      minWidth: "2rem",
                    }}>
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <span style={{ width: "0.625rem", height: "0.625rem", borderRadius: "50%", background: match.color, flexShrink: 0 }} />
                    <div style={{ flex: 1 }}>
                      <span style={{ fontFamily: "var(--font-montserrat)", fontSize: "0.9rem", fontWeight: 700, color: "oklch(97% 0.005 80)", letterSpacing: "0.02em" }}>
                        {match.titleEn}
                      </span>
                      <span style={{ fontFamily: "var(--font-montserrat)", fontSize: "0.8rem", color: "oklch(62% 0.04 260)", marginLeft: "0.625rem" }}>
                        {seg.desc}
                      </span>
                    </div>
                    <span style={{
                      fontSize: "1rem",
                      color: "oklch(52% 0.06 260)",
                      flexShrink: 0,
                      transform: isOpen ? "rotate(180deg)" : "none",
                      transition: "transform 0.2s",
                    }}>
                      ▾
                    </span>
                  </button>

                  {isOpen && (
                    <div style={{ padding: "0 1.5rem 1.5rem 4.5rem" }}>
                      <p style={{
                        fontFamily: "var(--font-montserrat)",
                        fontSize: "0.62rem",
                        fontWeight: 700,
                        letterSpacing: "0.14em",
                        textTransform: "uppercase",
                        color: match.color,
                        marginBottom: "0.625rem",
                      }}>
                        Why this matters for your team
                      </p>
                      <p style={{
                        fontFamily: "var(--font-montserrat)",
                        fontSize: "0.9rem",
                        lineHeight: 1.75,
                        color: "oklch(80% 0.04 260)",
                        margin: 0,
                        fontStyle: "italic",
                      }}>
                        {seg.teamNote}
                      </p>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── WHEEL TOOL ── */}
      <section id="wheel-tool" style={{ paddingBlock: "clamp(4rem, 7vw, 7rem)", background: "oklch(97% 0.005 80)" }}>
        <div className="container-wide">
          <p style={{
            fontFamily: "var(--font-montserrat)",
            fontWeight: 700,
            fontSize: "0.65rem",
            letterSpacing: "0.18em",
            textTransform: "uppercase",
            color: "oklch(65% 0.15 45)",
            marginBottom: "0.875rem",
          }}>
            Closing Activity
          </p>
          <h2 style={{
            fontFamily: "var(--font-montserrat)",
            fontWeight: 800,
            fontSize: "clamp(1.5rem, 3vw, 2.25rem)",
            lineHeight: 1.15,
            color: "oklch(22% 0.08 260)",
            marginBottom: "0.875rem",
          }}>
            Rate Your Wheel
          </h2>
          <p style={{
            fontFamily: "var(--font-montserrat)",
            fontSize: "0.9375rem",
            lineHeight: 1.7,
            color: "oklch(48% 0.008 260)",
            marginBottom: "3rem",
            maxWidth: "56ch",
          }}>
            Score honestly — not where you want to be, but where you actually are. Your scores are shared with your team leader as a tool for care, not judgement.
          </p>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(340px, 1fr))", gap: "2.5rem", alignItems: "start" }}>

            {/* SVG WHEEL */}
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
              <svg
                ref={svgRef}
                viewBox="0 0 500 500"
                width="500"
                height="500"
                style={{ maxWidth: "100%", height: "auto" }}
                xmlns="http://www.w3.org/2000/svg"
              >
                <rect width="500" height="500" fill="#f8f7f4" />
                {SEGMENTS.map((seg, i) => (
                  <path key={seg.key} d={sectorPath(i, MAX_R)} fill={seg.colorFill} />
                ))}
                {GRID_RINGS.map(ring => (
                  <circle key={ring} cx={CX} cy={CY} r={(ring / 10) * MAX_R} fill="none" stroke="#1b3a6b18" strokeWidth={ring === 10 ? 1.5 : 0.8} />
                ))}
                {[2, 4, 6, 8].map(ring => (
                  <text key={ring} x={CX + 3} y={CY - (ring / 10) * MAX_R + 4} fontSize="8" fill="#1b3a6b55" fontFamily="Montserrat, sans-serif">{ring}</text>
                ))}
                {SEGMENTS.map((seg, i) => {
                  const [x, y] = getPoint(i, 10);
                  return <line key={seg.key} x1={CX} y1={CY} x2={x} y2={y} stroke="#1b3a6b15" strokeWidth={0.8} />;
                })}
                <polygon
                  points={scorePolygonPoints(orderedScores)}
                  fill="rgba(27,58,107,0.20)"
                  stroke="#1b3a6b"
                  strokeWidth={1.8}
                  strokeLinejoin="round"
                />
                {SEGMENTS.map((seg, i) => {
                  const score = scores[seg.key] ?? 5;
                  const [x, y] = getPoint(i, score);
                  return <circle key={seg.key} cx={x} cy={y} r={4} fill={seg.color} stroke="white" strokeWidth={1.5} />;
                })}
                {SEGMENTS.map((seg, i) => {
                  const { x, y, anchor, dy } = getLabelPos(i);
                  const title = seg.titleEn;
                  const score = scores[seg.key] ?? 5;
                  const parts = title.split(" ");
                  return (
                    <g key={seg.key}>
                      {parts.length > 1 ? (
                        parts.map((part, pi) => (
                          <text key={pi} x={x} y={y + pi * 11 + dy} textAnchor={anchor} fontSize="9" fontWeight="700" fontFamily="Montserrat, sans-serif" fill={seg.color} letterSpacing="0.03em">{part}</text>
                        ))
                      ) : (
                        <text x={x} y={y + dy} textAnchor={anchor} fontSize="9" fontWeight="700" fontFamily="Montserrat, sans-serif" fill={seg.color} letterSpacing="0.03em">{title}</text>
                      )}
                      <text x={x} y={y + (parts.length > 1 ? parts.length * 11 : 0) + dy + 12} textAnchor={anchor} fontSize="11" fontWeight="800" fontFamily="Montserrat, sans-serif" fill={seg.color}>{score}</text>
                    </g>
                  );
                })}
                <circle cx={CX} cy={CY} r={28} fill="white" stroke="#1b3a6b20" strokeWidth={1} />
                <text x={CX} y={CY - 4} textAnchor="middle" fontSize="16" fontWeight="800" fontFamily="Montserrat, sans-serif" fill="#1b3a6b">{avg}</text>
                <text x={CX} y={CY + 11} textAnchor="middle" fontSize="7" fontWeight="600" fontFamily="Montserrat, sans-serif" fill="#1b3a6b80" letterSpacing="0.06em">AVG</text>
              </svg>

              <div style={{ display: "flex", gap: "0.75rem", marginTop: "1.25rem", flexWrap: "wrap", justifyContent: "center" }}>
                <button
                  onClick={handleDownload}
                  style={{
                    fontFamily: "var(--font-montserrat)",
                    fontWeight: 700,
                    fontSize: "0.78rem",
                    letterSpacing: "0.06em",
                    background: "oklch(22% 0.10 260)",
                    color: "oklch(97% 0.005 80)",
                    padding: "0.7rem 1.5rem",
                    border: "none",
                    cursor: "pointer",
                  }}
                >
                  Download Image
                </button>

                {user && !scoresSaved && (
                  <button
                    onClick={handleSaveScores}
                    disabled={isPending}
                    style={{
                      fontFamily: "var(--font-montserrat)",
                      fontWeight: 700,
                      fontSize: "0.78rem",
                      letterSpacing: "0.06em",
                      background: isPending ? "oklch(40% 0.10 260)" : "oklch(65% 0.15 45)",
                      color: isPending ? "oklch(97% 0.005 80)" : "oklch(14% 0.08 260)",
                      padding: "0.7rem 1.5rem",
                      border: "none",
                      cursor: isPending ? "wait" : "pointer",
                      transition: "background 0.15s",
                    }}
                  >
                    {isPending ? "Saving…" : "Save to Team Dashboard →"}
                  </button>
                )}

                {user && scoresSaved && (
                  <Link href="/dashboard?tab=team" style={{
                    fontFamily: "var(--font-montserrat)",
                    fontWeight: 700,
                    fontSize: "0.78rem",
                    letterSpacing: "0.06em",
                    textDecoration: "none",
                    color: "oklch(38% 0.14 145)",
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "0.375rem",
                    padding: "0.7rem 0",
                  }}>
                    ✓ Saved to Team Dashboard
                  </Link>
                )}

                {!user && (
                  <Link href="/membership" style={{
                    fontFamily: "var(--font-montserrat)",
                    fontWeight: 700,
                    fontSize: "0.78rem",
                    letterSpacing: "0.06em",
                    textDecoration: "none",
                    padding: "0.7rem 1.5rem",
                    background: "oklch(65% 0.15 45)",
                    color: "oklch(14% 0.08 260)",
                  }}>
                    Sign In to Save →
                  </Link>
                )}
              </div>

              {saveError && (
                <p style={{
                  fontFamily: "var(--font-montserrat)",
                  fontSize: "0.8rem",
                  color: "oklch(65% 0.20 30)",
                  marginTop: "0.75rem",
                  textAlign: "center",
                }}>
                  {saveError}
                </p>
              )}
            </div>

            {/* SLIDERS */}
            <div>
              <div style={{ display: "flex", flexDirection: "column", gap: "0.875rem" }}>
                {SEGMENTS.map((seg, i) => {
                  const score = scores[seg.key] ?? 5;
                  const detail = SEGMENT_DETAILS[i];
                  return (
                    <div key={seg.key} style={{
                      background: "oklch(95% 0.005 80)",
                      padding: "1rem 1.25rem",
                    }}>
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: "0.625rem" }}>
                        <div>
                          <span style={{ fontFamily: "var(--font-montserrat)", fontSize: "0.8125rem", fontWeight: 700, color: seg.color }}>
                            {seg.titleEn}
                          </span>
                          <span style={{ fontFamily: "var(--font-montserrat)", fontSize: "0.72rem", color: "oklch(55% 0.005 260)", marginLeft: "0.5rem" }}>
                            {detail.desc}
                          </span>
                        </div>
                        <span style={{
                          fontFamily: "var(--font-montserrat)",
                          fontSize: "1.375rem",
                          fontWeight: 800,
                          color: seg.color,
                          lineHeight: 1,
                          marginLeft: "0.75rem",
                          flexShrink: 0,
                        }}>
                          {score}
                        </span>
                      </div>
                      <div style={{ position: "relative" }}>
                        <div style={{ height: "3px", background: "oklch(88% 0.006 80)", marginBottom: "0.375rem" }}>
                          <div style={{ height: "3px", background: seg.color, width: `${(score / 10) * 100}%`, transition: "width 0.1s" }} />
                        </div>
                        <input
                          type="range"
                          min={1}
                          max={10}
                          step={1}
                          value={score}
                          onChange={e => handleScoreChange(seg.key, parseInt(e.target.value))}
                          style={{ position: "absolute", top: "-0.5rem", left: 0, width: "100%", opacity: 0, cursor: "pointer", height: "1.25rem" }}
                        />
                        <div style={{ display: "flex", justifyContent: "space-between" }}>
                          {[1,2,3,4,5,6,7,8,9,10].map(n => (
                            <button
                              key={n}
                              onClick={() => handleScoreChange(seg.key, n)}
                              style={{
                                width: "1.375rem",
                                height: "1.375rem",
                                borderRadius: "50%",
                                border: "none",
                                cursor: "pointer",
                                fontSize: "0.625rem",
                                fontWeight: 700,
                                fontFamily: "var(--font-montserrat)",
                                background: n === score ? seg.color : "oklch(88% 0.006 80)",
                                color: n === score ? "white" : "oklch(55% 0.005 260)",
                                transition: "all 0.12s",
                              }}
                            >
                              {n}
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Average summary */}
              <div style={{
                background: "oklch(22% 0.10 260)",
                padding: "1.25rem 1.5rem",
                marginTop: "1.25rem",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                flexWrap: "wrap",
                gap: "0.75rem",
              }}>
                <div>
                  <p style={{
                    fontFamily: "var(--font-montserrat)",
                    fontSize: "0.62rem",
                    fontWeight: 700,
                    letterSpacing: "0.1em",
                    textTransform: "uppercase",
                    color: "oklch(65% 0.08 260)",
                    margin: "0 0 0.25rem",
                  }}>
                    Overall Average
                  </p>
                  <p style={{ fontFamily: "var(--font-montserrat)", fontSize: "0.8rem", color: "oklch(72% 0.05 260)", margin: 0 }}>
                    Across all 8 dimensions
                  </p>
                </div>
                <span style={{
                  fontFamily: "var(--font-montserrat)",
                  fontSize: "3rem",
                  fontWeight: 800,
                  color: "oklch(65% 0.15 45)",
                  lineHeight: 1,
                }}>
                  {avg}
                </span>
              </div>
            </div>
          </div>

          {/* Closing message */}
          <div style={{
            marginTop: "3rem",
            maxWidth: "640px",
            background: "oklch(95% 0.005 80)",
            borderLeft: "3px solid oklch(65% 0.15 45)",
            padding: "1.5rem 1.75rem",
          }}>
            <p style={{
              fontFamily: "var(--font-montserrat)",
              fontSize: "0.9375rem",
              lineHeight: 1.75,
              color: "oklch(38% 0.008 260)",
              fontStyle: "italic",
              margin: 0,
            }}>
              &ldquo;Your scores are shared with your team leader. That&rsquo;s not surveillance — it&rsquo;s care. A good leader uses this to adjust, not to judge.&rdquo;
            </p>
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section style={{
        paddingBlock: "clamp(4rem, 7vw, 7rem)",
        background: "oklch(22% 0.08 260)",
        position: "relative",
      }}>
        <div style={{
          position: "absolute",
          left: "clamp(1.5rem, 5vw, 4rem)",
          top: "clamp(4rem, 7vw, 7rem)",
          bottom: "clamp(4rem, 7vw, 7rem)",
          width: "3px",
          background: "oklch(65% 0.15 45)",
        }} />
        <div className="container-wide" style={{ paddingLeft: "2.5rem" }}>
          <p style={{
            fontFamily: "var(--font-montserrat)",
            fontWeight: 700,
            fontSize: "0.65rem",
            letterSpacing: "0.18em",
            textTransform: "uppercase",
            color: "oklch(65% 0.15 45)",
            marginBottom: "0.875rem",
          }}>
            Continue
          </p>
          <h2 style={{
            fontFamily: "var(--font-montserrat)",
            fontWeight: 800,
            fontSize: "clamp(1.5rem, 3vw, 2.25rem)",
            lineHeight: 1.15,
            color: "oklch(97% 0.005 80)",
            marginBottom: "1rem",
          }}>
            A team that shares its burdens is a team that lasts.
          </h2>
          <p style={{
            fontFamily: "var(--font-montserrat)",
            fontSize: "0.9375rem",
            lineHeight: 1.7,
            color: "oklch(72% 0.04 260)",
            maxWidth: "52ch",
            marginBottom: "2rem",
          }}>
            Return to the Team Pathway to continue building the foundations your team needs.
          </p>
          <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap" }}>
            <Link href="/team" style={{
              fontFamily: "var(--font-montserrat)",
              fontWeight: 700,
              fontSize: "0.875rem",
              letterSpacing: "0.06em",
              textDecoration: "none",
              padding: "0.75rem 1.75rem",
              background: "oklch(65% 0.15 45)",
              color: "oklch(14% 0.08 260)",
            }}>
              Back to Team Pathway →
            </Link>
          </div>
        </div>
      </section>

    </div>
  );
}

"use client";

import { useState } from "react";
import Link from "next/link";
import type { User } from "@supabase/supabase-js";

// ── SCENARIO DATA ─────────────────────────────────────────────────────────────

type Mode = "Directive" | "Consultative" | "Consensus";

interface Scenario {
  id: number;
  situation: string;
  mode: Mode;
  reasoning: string;
  signal: string;
}

const SCENARIOS: Scenario[] = [
  {
    id: 1,
    situation: "Emergency: a team member needs to be removed from a project immediately.",
    mode: "Directive",
    reasoning: "Speed and sensitivity make this a leader's call. The urgency leaves no room for a deliberation process, and the personal nature of the situation requires confidentiality.",
    signal: "\"I'm making this call. Here's what's happening and why. I'll brief you on the details I can share.\"",
  },
  {
    id: 2,
    situation: "Choosing a new communication tool that the whole team will use daily.",
    mode: "Consultative",
    reasoning: "Everyone is affected and will need to adopt the tool. Get real input on preferences, workflows, and concerns — then make a clear decision and commit to it. Don't let the decision drag on.",
    signal: "\"I'm going to decide by Friday. Before I do — what matters most to you in how we communicate?\"",
  },
  {
    id: 3,
    situation: "Setting the team's values together for the first time.",
    mode: "Consensus",
    reasoning: "Values only work if the team owns them. Imposed values are a rulebook. Co-created values are a compass. Take the time — it pays back for years.",
    signal: "\"We're deciding this together. I won't move forward until we've found something we can all genuinely commit to.\"",
  },
  {
    id: 4,
    situation: "Responding to an urgent request from a senior leader.",
    mode: "Directive",
    reasoning: "Fast and clear. The speed required and the reporting relationship make this a leader's call. Explain the context to the team afterwards so they understand why.",
    signal: "\"I've responded on behalf of the team. Here's what I said and why — happy to answer questions.\"",
  },
  {
    id: 5,
    situation: "Deciding how to spend the team's discretionary budget.",
    mode: "Consultative",
    reasoning: "Get ideas and priorities from the team — people often have insight you don't. But keep final accountability with the leader. Someone has to own the outcome.",
    signal: "\"I want your input on what would most benefit the team. I'll take that into account and make the final call.\"",
  },
  {
    id: 6,
    situation: "Agreeing on team meeting rhythms and norms.",
    mode: "Consensus",
    reasoning: "This affects everyone equally and requires full buy-in to actually work. If people haven't genuinely agreed, they won't follow the norms — and you'll be enforcing instead of leading.",
    signal: "\"We're deciding this together. Let's keep talking until everyone can commit — not just tolerate.\"",
  },
];

const MODE_COLORS: Record<Mode, { bg: string; accent: string; light: string }> = {
  Directive: {
    bg: "oklch(22% 0.08 260)",
    accent: "oklch(55% 0.18 15)",
    light: "oklch(94% 0.02 15)",
  },
  Consultative: {
    bg: "oklch(22% 0.08 260)",
    accent: "oklch(65% 0.15 45)",
    light: "oklch(96% 0.02 45)",
  },
  Consensus: {
    bg: "oklch(22% 0.08 260)",
    accent: "oklch(52% 0.16 250)",
    light: "oklch(94% 0.03 250)",
  },
};

// ── COMPONENT ─────────────────────────────────────────────────────────────────

export default function DecisionMakingClient({ user }: { user: User | null }) {
  const [revealed, setRevealed] = useState<Set<number>>(new Set());

  function toggleReveal(id: number) {
    setRevealed(prev => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  }

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
        <div aria-hidden="true" style={{
          position: "absolute",
          right: "-0.5rem",
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
          08
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
              Module 08
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
              Article + Interactive · 15–20 min
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
            maxWidth: "16ch",
          }}>
            Decision Making
          </h1>

          <p style={{
            fontFamily: "var(--font-montserrat)",
            fontSize: "clamp(1rem, 2vw, 1.1875rem)",
            color: "oklch(72% 0.04 260)",
            lineHeight: 1.7,
            maxWidth: "52ch",
            marginBottom: 0,
          }}>
            Nothing slows a team down more than confusion about how decisions get made. And nothing erodes trust faster than a decision made without the people it affects.
          </p>
        </div>
      </section>

      {/* ── SECTION 1: The Hidden Cost ── */}
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
            The Hidden Cost of Decision Confusion
          </h2>

          <p style={{
            fontFamily: "var(--font-montserrat)",
            fontSize: "1rem",
            lineHeight: 1.8,
            color: "oklch(38% 0.008 260)",
            marginBottom: "1.5rem",
          }}>
            Most teams make decisions differently every time — and no one has agreed on the process. The result: some people feel over-consulted, others feel ignored. Leaders feel like every decision takes too long; team members feel like their input doesn't matter. Nobody wins, and everyone loses a little trust.
          </p>
          <p style={{
            fontFamily: "var(--font-montserrat)",
            fontSize: "1rem",
            lineHeight: 1.8,
            color: "oklch(38% 0.008 260)",
            marginBottom: "2rem",
          }}>
            The fix isn't a rigid rulebook — it's a shared language for decision-making. When a team knows how decisions will be made, they can engage appropriately, calibrate their expectations, and trust the process — even when the outcome isn't what they wanted.
          </p>

          <div style={{
            background: "oklch(22% 0.08 260)",
            borderLeft: "3px solid oklch(65% 0.15 45)",
            padding: "1.5rem 1.75rem",
          }}>
            <p style={{
              fontFamily: "var(--font-montserrat)",
              fontSize: "0.9rem",
              fontWeight: 500,
              lineHeight: 1.7,
              color: "oklch(82% 0.04 260)",
              margin: 0,
            }}>
              <strong style={{ color: "oklch(97% 0.005 80)", fontWeight: 700 }}>The insight: </strong>
              People can accept a decision they disagree with, as long as they trust the process. What they can't accept is feeling manipulated or ignored.
            </p>
          </div>
        </div>
      </section>

      {/* ── SECTION 2: Three Types ── */}
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
            marginBottom: "0.75rem",
          }}>
            Three Types of Decisions
          </h2>
          <p style={{
            fontFamily: "var(--font-montserrat)",
            fontSize: "1rem",
            lineHeight: 1.75,
            color: "oklch(72% 0.04 260)",
            marginBottom: "2.5rem",
          }}>
            Not every decision should be made the same way. The key is choosing the right mode for the right situation — and naming it clearly.
          </p>

          <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
            {[
              {
                mode: "Directive" as Mode,
                tagline: "The leader decides.",
                when: "When speed is critical, the stakes are within the leader's domain, or the pattern of input is already well-established.",
                signal: "\"I'm making this call. Here's why. Input: not needed.\"",
                note: "Not authoritarian — just clear. The team needs to know this is decided so they can move.",
              },
              {
                mode: "Consultative" as Mode,
                tagline: "The leader decides, but seeks input first.",
                when: "For most significant decisions. Input is genuinely considered — but does not bind the outcome. The leader still owns the call.",
                signal: "\"I'm going to decide, but I want your perspective. Here's the question I need your input on.\"",
                note: "The key word is 'genuinely.' Fake consultation destroys trust faster than skipping it entirely.",
              },
              {
                mode: "Consensus" as Mode,
                tagline: "The team decides together.",
                when: "When the decision significantly affects the whole team, buy-in is essential for implementation, and time allows.",
                signal: "\"We're deciding this together. I won't move forward until we've found a position we can all commit to.\"",
                note: "Consensus is not the same as unanimity. It means everyone can live with and commit to the outcome — not that everyone agrees.",
              },
            ].map(item => {
              const colors = MODE_COLORS[item.mode];
              return (
                <div key={item.mode} style={{
                  background: "oklch(26% 0.10 260)",
                  borderTop: `3px solid ${colors.accent}`,
                  padding: "2rem",
                }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginBottom: "1rem", flexWrap: "wrap" }}>
                    <span style={{
                      fontFamily: "var(--font-montserrat)",
                      fontSize: "0.65rem",
                      fontWeight: 800,
                      letterSpacing: "0.16em",
                      textTransform: "uppercase",
                      color: colors.accent,
                      background: `${colors.accent.replace(")", " / 0.12)")}`,
                      padding: "4px 10px",
                      border: `1px solid ${colors.accent.replace(")", " / 0.3)")}`,
                    }}>
                      {item.mode}
                    </span>
                    <span style={{
                      fontFamily: "var(--font-montserrat)",
                      fontSize: "0.9rem",
                      fontWeight: 600,
                      color: "oklch(88% 0.008 80)",
                    }}>
                      {item.tagline}
                    </span>
                  </div>

                  <p style={{
                    fontFamily: "var(--font-montserrat)",
                    fontSize: "0.9rem",
                    lineHeight: 1.75,
                    color: "oklch(72% 0.04 260)",
                    marginBottom: "1rem",
                  }}>
                    <strong style={{ color: "oklch(82% 0.04 260)" }}>When to use: </strong>{item.when}
                  </p>

                  <div style={{
                    background: "oklch(22% 0.08 260 / 0.5)",
                    padding: "0.9rem 1.25rem",
                    marginBottom: "1rem",
                  }}>
                    <p style={{
                      fontFamily: "var(--font-montserrat)",
                      fontSize: "0.875rem",
                      fontStyle: "italic",
                      lineHeight: 1.6,
                      color: "oklch(78% 0.03 260)",
                      margin: 0,
                    }}>
                      Signal to team: {item.signal}
                    </p>
                  </div>

                  <p style={{
                    fontFamily: "var(--font-montserrat)",
                    fontSize: "0.825rem",
                    lineHeight: 1.7,
                    color: "oklch(62% 0.04 260)",
                    margin: 0,
                    borderLeft: `2px solid ${colors.accent.replace(")", " / 0.4)")}`,
                    paddingLeft: "1rem",
                  }}>
                    {item.note}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── SECTION 3: What Breaks Decision-Making ── */}
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
            What Breaks Decision-Making
          </h2>

          <div style={{ display: "flex", flexDirection: "column", gap: "1px", background: "oklch(88% 0.008 80)" }}>
            {[
              {
                problem: "Pretending to consult when the decision is already made",
                consequence: "Destroys trust. People can almost always tell. Once they realise the consultation was theatre, they stop engaging — and start watching for it everywhere.",
              },
              {
                problem: "Using consensus for every decision",
                consequence: "Exhausts the team and slows everything down. Not every decision deserves a full team deliberation. Over-including people wastes their time and dilutes their engagement when it really counts.",
              },
              {
                problem: "Using directive decisions for things that affect everyone",
                consequence: "Destroys ownership. When people are directly impacted but have no voice, they disengage — and compliance replaces commitment.",
              },
              {
                problem: "Not naming which mode you're in",
                consequence: "Creates confusion about whether input matters. People come to a 'discussion' not knowing if they're being asked to decide or just inform. The ambiguity breeds frustration.",
              },
            ].map(item => (
              <div key={item.problem} style={{ background: "oklch(97% 0.005 80)", padding: "1.5rem 2rem", display: "grid", gridTemplateColumns: "1fr", gap: "0.6rem" }}>
                <p style={{
                  fontFamily: "var(--font-montserrat)",
                  fontWeight: 700,
                  fontSize: "0.9375rem",
                  color: "oklch(22% 0.08 260)",
                  margin: 0,
                }}>
                  ✕ {item.problem}
                </p>
                <p style={{
                  fontFamily: "var(--font-montserrat)",
                  fontSize: "0.875rem",
                  lineHeight: 1.7,
                  color: "oklch(42% 0.008 260)",
                  margin: 0,
                }}>
                  {item.consequence}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── SECTION 4: Cross-Cultural Complexity ── */}
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
            Cross-Cultural Complexity
          </h2>

          <p style={{
            fontFamily: "var(--font-montserrat)",
            fontSize: "1rem",
            lineHeight: 1.8,
            color: "oklch(72% 0.04 260)",
            marginBottom: "2rem",
          }}>
            Decision-making norms are deeply cultural — and in cross-cultural teams, the gaps can be enormous. What feels empowering to one person feels chaotic or disrespectful to another.
          </p>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "1px", background: "oklch(30% 0.12 260 / 0.4)", marginBottom: "2rem" }}>
            {[
              {
                culture: "Flat cultures (Scandinavia, Netherlands)",
                norm: "Consensus is expected — directive decisions feel authoritarian, even when they're efficient.",
              },
              {
                culture: "Hierarchical cultures (many Asian, African, Latin American contexts)",
                norm: "Consensus decisions can feel like weakness — the leader is supposed to decide, not defer.",
              },
              {
                culture: "Individualist cultures",
                norm: "People want their input heard personally. Being grouped with \"the team's view\" can feel like erasure.",
              },
              {
                culture: "Collectivist cultures",
                norm: "The group's harmony is as important as the outcome. A technically good decision that fractures the team is a bad decision.",
              },
            ].map(item => (
              <div key={item.culture} style={{
                background: "oklch(30% 0.12 260)",
                padding: "1.5rem",
              }}>
                <h3 style={{
                  fontFamily: "var(--font-montserrat)",
                  fontWeight: 700,
                  fontSize: "0.8rem",
                  color: "oklch(65% 0.15 45)",
                  letterSpacing: "0.06em",
                  textTransform: "uppercase",
                  marginBottom: "0.6rem",
                  lineHeight: 1.4,
                }}>
                  {item.culture}
                </h3>
                <p style={{
                  fontFamily: "var(--font-montserrat)",
                  fontSize: "0.875rem",
                  lineHeight: 1.75,
                  color: "oklch(72% 0.04 260)",
                  margin: 0,
                }}>
                  {item.norm}
                </p>
              </div>
            ))}
          </div>

          <div style={{
            background: "oklch(30% 0.12 260)",
            borderLeft: "3px solid oklch(65% 0.15 45)",
            padding: "1.5rem 1.75rem",
          }}>
            <p style={{
              fontFamily: "var(--font-montserrat)",
              fontSize: "0.9rem",
              fontWeight: 500,
              lineHeight: 1.75,
              color: "oklch(78% 0.03 260)",
              margin: 0,
            }}>
              <strong style={{ color: "oklch(97% 0.005 80)", fontWeight: 700 }}>The solution: </strong>
              Don't default to your cultural home base. Name the mode explicitly, and explain why you chose it. This single habit resolves most cross-cultural decision confusion — before it becomes a trust issue.
            </p>
          </div>
        </div>
      </section>

      {/* ── INTERACTIVE: Decision Mode Selector ── */}
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
            Interactive Tool
          </p>
          <h2 style={{
            fontFamily: "var(--font-montserrat)",
            fontWeight: 800,
            fontSize: "clamp(1.5rem, 3vw, 2.25rem)",
            color: "oklch(22% 0.08 260)",
            letterSpacing: "-0.02em",
            lineHeight: 1.2,
            marginBottom: "0.75rem",
          }}>
            Decision Mode Selector
          </h2>
          <p style={{
            fontFamily: "var(--font-montserrat)",
            fontSize: "1rem",
            lineHeight: 1.75,
            color: "oklch(42% 0.008 260)",
            marginBottom: "2.5rem",
          }}>
            Six real scenarios. Click "What mode?" to see the recommended approach and why.
          </p>

          <div style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
            {SCENARIOS.map(scenario => {
              const isRevealed = revealed.has(scenario.id);
              const colors = MODE_COLORS[scenario.mode];

              return (
                <div
                  key={scenario.id}
                  style={{
                    background: isRevealed ? "oklch(22% 0.08 260)" : "oklch(94% 0.007 80)",
                    border: isRevealed ? `1px solid ${colors.accent.replace(")", " / 0.3)")}` : "1px solid oklch(88% 0.008 80)",
                    transition: "all 0.25s ease",
                    overflow: "hidden",
                  }}
                >
                  {/* Scenario header */}
                  <div
                    style={{
                      padding: "1.5rem",
                      display: "flex",
                      alignItems: "flex-start",
                      justifyContent: "space-between",
                      gap: "1.5rem",
                      cursor: "pointer",
                    }}
                    onClick={() => toggleReveal(scenario.id)}
                    role="button"
                    tabIndex={0}
                    onKeyDown={e => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); toggleReveal(scenario.id); } }}
                    aria-expanded={isRevealed}
                  >
                    <div style={{ display: "flex", gap: "1rem", alignItems: "flex-start", flex: 1 }}>
                      <span style={{
                        fontFamily: "var(--font-montserrat)",
                        fontWeight: 800,
                        fontSize: "1.1rem",
                        color: isRevealed ? "oklch(65% 0.15 45)" : "oklch(72% 0.04 260)",
                        lineHeight: 1.5,
                        flexShrink: 0,
                        minWidth: "1.75rem",
                      }}>
                        {scenario.id}.
                      </span>
                      <p style={{
                        fontFamily: "var(--font-montserrat)",
                        fontSize: "0.9375rem",
                        fontWeight: 600,
                        lineHeight: 1.6,
                        color: isRevealed ? "oklch(88% 0.008 80)" : "oklch(22% 0.08 260)",
                        margin: 0,
                      }}>
                        {scenario.situation}
                      </p>
                    </div>

                    <button
                      style={{
                        padding: "0.5rem 1.1rem",
                        background: isRevealed ? colors.accent : "oklch(22% 0.08 260)",
                        color: "oklch(97% 0.005 80)",
                        border: "none",
                        cursor: "pointer",
                        fontFamily: "var(--font-montserrat)",
                        fontWeight: 700,
                        fontSize: "0.72rem",
                        letterSpacing: "0.08em",
                        textTransform: "uppercase",
                        flexShrink: 0,
                        whiteSpace: "nowrap",
                      }}
                      tabIndex={-1}
                      aria-hidden="true"
                    >
                      {isRevealed ? scenario.mode : "What mode?"}
                    </button>
                  </div>

                  {/* Revealed content */}
                  {isRevealed && (
                    <div style={{
                      padding: "0 1.5rem 1.5rem",
                      borderTop: `1px solid ${colors.accent.replace(")", " / 0.2)")}`,
                      paddingTop: "1.25rem",
                    }}>
                      <p style={{
                        fontFamily: "var(--font-montserrat)",
                        fontSize: "0.9rem",
                        lineHeight: 1.75,
                        color: "oklch(72% 0.04 260)",
                        marginBottom: "1rem",
                      }}>
                        {scenario.reasoning}
                      </p>
                      <div style={{
                        background: "oklch(30% 0.12 260)",
                        padding: "0.9rem 1.25rem",
                        borderLeft: `3px solid ${colors.accent}`,
                      }}>
                        <p style={{
                          fontFamily: "var(--font-montserrat)",
                          fontSize: "0.8rem",
                          fontStyle: "italic",
                          lineHeight: 1.65,
                          color: "oklch(65% 0.04 260)",
                          margin: 0,
                        }}>
                          {scenario.signal}
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── SECTION 5: Building a Decision Culture ── */}
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
            Section 5
          </p>
          <h2 style={{
            fontFamily: "var(--font-montserrat)",
            fontWeight: 800,
            fontSize: "clamp(1.5rem, 3vw, 2.25rem)",
            color: "oklch(97% 0.005 80)",
            letterSpacing: "-0.02em",
            lineHeight: 1.2,
            marginBottom: "0.75rem",
          }}>
            Building a Decision Culture
          </h2>
          <p style={{
            fontFamily: "var(--font-montserrat)",
            fontSize: "1rem",
            lineHeight: 1.75,
            color: "oklch(72% 0.04 260)",
            marginBottom: "2.5rem",
          }}>
            Three practices that shift decision-making from confusion to clarity — permanently.
          </p>

          <div style={{ display: "flex", flexDirection: "column", gap: "1px", background: "oklch(22% 0.08 260 / 0.3)" }}>
            {[
              {
                num: "01",
                title: "Name the mode at the start",
                body: "Before every significant discussion, say clearly which mode you're in. \"We're consulting on this — I'll decide by Friday.\" This single sentence prevents more frustration than most team workshops.",
              },
              {
                num: "02",
                title: "Close every consultation",
                body: "When you've gathered input and made your call, close the loop. \"Here's what I heard. Here's what I decided. Here's why.\" People can handle a decision they didn't get. They can't handle silence.",
              },
              {
                num: "03",
                title: "Debrief after hard decisions",
                body: "Ask: \"Did we use the right mode? Did everyone feel appropriately heard?\" Not to undo the decision — but to strengthen the process for next time. Teams that debrief their decisions make better ones.",
              },
            ].map(item => (
              <div key={item.num} style={{
                background: "oklch(26% 0.10 260)",
                padding: "1.75rem 2rem",
                display: "grid",
                gridTemplateColumns: "3.5rem 1fr",
                gap: "1.25rem",
                alignItems: "start",
              }}>
                <span style={{
                  fontFamily: "var(--font-montserrat)",
                  fontWeight: 900,
                  fontSize: "2.25rem",
                  color: "oklch(38% 0.10 260)",
                  lineHeight: 1,
                }}>
                  {item.num}
                </span>
                <div>
                  <h3 style={{
                    fontFamily: "var(--font-montserrat)",
                    fontWeight: 700,
                    fontSize: "0.9375rem",
                    color: "oklch(97% 0.005 80)",
                    marginBottom: "0.5rem",
                  }}>
                    {item.title}
                  </h3>
                  <p style={{
                    fontFamily: "var(--font-montserrat)",
                    fontSize: "0.9rem",
                    lineHeight: 1.75,
                    color: "oklch(72% 0.04 260)",
                    margin: 0,
                  }}>
                    {item.body}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section style={{ paddingBlock: "clamp(4rem, 7vw, 6rem)", background: "oklch(22% 0.08 260)", position: "relative" }}>
        <div style={{ position: "absolute", left: "clamp(1.5rem, 5vw, 4rem)", top: "clamp(4rem, 7vw, 6rem)", bottom: "clamp(4rem, 7vw, 6rem)", width: "3px", background: "oklch(65% 0.15 45)" }} />
        <div className="container-wide" style={{ paddingLeft: "3rem" }}>
          <p style={{
            fontFamily: "var(--font-montserrat)",
            fontSize: "clamp(1rem, 2vw, 1.1rem)",
            fontStyle: "italic",
            lineHeight: 1.7,
            color: "oklch(65% 0.15 45)",
            marginBottom: "1.25rem",
            maxWidth: "50ch",
          }}>
            "The most empowering thing a leader can say before a meeting is: here's the question we're deciding, and here's how we're deciding it."
          </p>
          <h2 style={{
            fontFamily: "var(--font-montserrat)",
            fontWeight: 800,
            fontSize: "clamp(1.5rem, 3vw, 2rem)",
            color: "oklch(97% 0.005 80)",
            letterSpacing: "-0.02em",
            lineHeight: 1.2,
            marginBottom: "2rem",
          }}>
            Continue the Team Pathway
          </h2>
          <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap" }}>
            <Link
              href="/team"
              style={{
                padding: "0.9rem 2rem",
                background: "oklch(65% 0.15 45)",
                color: "oklch(97% 0.005 80)",
                textDecoration: "none",
                fontFamily: "var(--font-montserrat)",
                fontWeight: 700,
                fontSize: "0.875rem",
                letterSpacing: "0.04em",
                display: "inline-flex",
              }}
            >
              View All Modules →
            </Link>
            {!user && (
              <Link
                href="/membership"
                style={{
                  padding: "0.9rem 1.75rem",
                  background: "none",
                  color: "oklch(72% 0.04 260)",
                  border: "1px solid oklch(42% 0.008 260)",
                  textDecoration: "none",
                  fontFamily: "var(--font-montserrat)",
                  fontWeight: 600,
                  fontSize: "0.875rem",
                  display: "inline-flex",
                }}
              >
                Sign Up Free
              </Link>
            )}
          </div>
        </div>
      </section>

    </div>
  );
}

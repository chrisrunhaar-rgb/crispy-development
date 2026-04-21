"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import type { User } from "@supabase/supabase-js";
import { saveTrustScores } from "../actions";

const DIMENSIONS = [
  {
    key: "voice",
    label: "Voice Safety",
    description: "People on our team speak honestly, even when it's uncomfortable.",
    icon: "💬",
  },
  {
    key: "failure",
    label: "Failure Safety",
    description: "When someone makes a mistake, the team responds with support, not blame.",
    icon: "🛡",
  },
  {
    key: "difference",
    label: "Difference Safety",
    description: "People with different views are genuinely heard and respected.",
    icon: "🔄",
  },
  {
    key: "vulnerability",
    label: "Vulnerability Safety",
    description: "Team members feel safe admitting when they don't know something.",
    icon: "🌱",
  },
  {
    key: "conflict",
    label: "Conflict Safety",
    description: "Tensions are addressed openly, not avoided or whispered about.",
    icon: "⚡",
  },
  {
    key: "cultural",
    label: "Cultural Safety",
    description: "Every cultural background on our team is treated with equal dignity.",
    icon: "🌍",
  },
];

const DEFAULT_SCORES: Record<string, number> = {
  voice: 3,
  failure: 3,
  difference: 3,
  vulnerability: 3,
  conflict: 3,
  cultural: 3,
};

function getInterpretation(avg: number): { text: string; color: string } {
  if (avg >= 4.5) return { text: "Your team has a high-trust environment. Protect it actively.", color: "oklch(48% 0.18 145)" };
  if (avg >= 3.5) return { text: "Good foundation. One or two dimensions deserve focused attention.", color: "oklch(55% 0.16 80)" };
  if (avg >= 2.5) return { text: "Trust is fragile right now. This module is the right place to start.", color: "oklch(55% 0.16 45)" };
  return { text: "Your team needs significant attention to safety and trust. Be patient and honest.", color: "oklch(52% 0.18 20)" };
}

export default function TrustSafetyClient({ user }: { user: User | null }) {
  const [scores, setScores] = useState<Record<string, number>>(DEFAULT_SCORES);
  const [submitted, setSubmitted] = useState(false);
  const [saved, setSaved] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);
  const [isSaving, startSaving] = useTransition();

  const avg = Object.values(scores).reduce((a, b) => a + b, 0) / Object.values(scores).length;
  const roundedAvg = Math.round(avg * 10) / 10;
  const interpretation = getInterpretation(avg);

  function handleSubmit() {
    setSubmitted(true);
    window.scrollTo({ top: document.getElementById("result-panel")?.offsetTop ?? 0, behavior: "smooth" });
  }

  function handleSave() {
    startSaving(async () => {
      const result = await saveTrustScores(scores);
      if (result.error) {
        setSaveError(result.error);
      } else {
        setSaved(true);
      }
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
          05
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
              Module 05
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
              Article + Assessment · 15–20 min
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
            maxWidth: "18ch",
          }}>
            Trust & Psychological Safety
          </h1>

          <p style={{
            fontFamily: "var(--font-montserrat)",
            fontSize: "clamp(1rem, 2vw, 1.1875rem)",
            color: "oklch(72% 0.04 260)",
            lineHeight: 1.7,
            maxWidth: "52ch",
            marginBottom: 0,
          }}>
            What it really means, why Google&apos;s research said it matters more than talent, and how to measure it on your team today.
          </p>
        </div>
      </section>

      {/* ── HOOK ── */}
      <section style={{ paddingBlock: "clamp(3.5rem, 6vw, 5rem)", background: "oklch(97% 0.005 80)" }}>
        <div className="container-wide" style={{ maxWidth: "760px" }}>
          <p style={{
            fontFamily: "var(--font-montserrat)",
            fontSize: "clamp(1.125rem, 2.5vw, 1.375rem)",
            fontWeight: 600,
            lineHeight: 1.75,
            color: "oklch(22% 0.08 260)",
            marginBottom: "1.5rem",
          }}>
            The highest-performing teams in the world have one thing in common that rarely appears in a strategy document: people feel safe to fail, speak, and be themselves.
          </p>
          <p style={{
            fontFamily: "var(--font-montserrat)",
            fontSize: "1rem",
            lineHeight: 1.8,
            color: "oklch(38% 0.008 260)",
            marginBottom: "1.5rem",
          }}>
            You can hire brilliant people, set ambitious goals, and invest in world-class systems — and still produce a team that underperforms. The missing variable isn&apos;t skill or strategy. It&apos;s safety. Not physical safety. Interpersonal safety.
          </p>
          <p style={{
            fontFamily: "var(--font-montserrat)",
            fontSize: "1rem",
            lineHeight: 1.8,
            color: "oklch(38% 0.008 260)",
          }}>
            This module explores what psychological safety actually is, where it comes from, and how to assess whether your team has it. The assessment at the end will give you a clear picture of where your team stands — and where to focus next.
          </p>
        </div>
      </section>

      {/* ── SECTION 1: What Psychological Safety Actually Is ── */}
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
            Section 1
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
            What Psychological Safety Actually Is
          </h2>

          <p style={{
            fontFamily: "var(--font-montserrat)",
            fontSize: "1rem",
            lineHeight: 1.8,
            color: "oklch(78% 0.03 260)",
            marginBottom: "1.5rem",
          }}>
            Harvard researcher Amy Edmondson defines psychological safety as <em style={{ color: "oklch(88% 0.04 260)" }}>&ldquo;a belief that one will not be punished or humiliated for speaking up with ideas, questions, concerns, or mistakes.&rdquo;</em> That definition is more precise than it sounds. It&apos;s not about being comfortable. It&apos;s not about avoiding conflict. It&apos;s not about everyone getting along.
          </p>
          <p style={{
            fontFamily: "var(--font-montserrat)",
            fontSize: "1rem",
            lineHeight: 1.8,
            color: "oklch(78% 0.03 260)",
            marginBottom: "1.5rem",
          }}>
            It&apos;s about one specific thing: <strong style={{ color: "oklch(92% 0.005 80)", fontWeight: 700 }}>can people take interpersonal risk without fear?</strong> Can they raise a concern without being dismissed? Can they admit a mistake without being blamed? Can they challenge an idea without being shut down?
          </p>
          <p style={{
            fontFamily: "var(--font-montserrat)",
            fontSize: "1rem",
            lineHeight: 1.8,
            color: "oklch(78% 0.03 260)",
            marginBottom: "2rem",
          }}>
            Google&apos;s Project Aristotle — a landmark study on what makes teams effective — found that psychological safety was the single most important predictor of team performance. More important than the intelligence of team members. More important than their experience, their skills, or their role clarity. The teams that performed best were the ones where people felt safe to bring their full selves.
          </p>

          <div style={{
            background: "oklch(22% 0.08 260 / 0.5)",
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
              <strong style={{ color: "oklch(97% 0.005 80)", fontWeight: 700 }}>Common misconception: </strong>
              Psychological safety is not the same as niceness, harmony, or low standards. The safest teams often have the most honest — and therefore most demanding — conversations. Safety makes excellence possible. Without it, excellence is just performance.
            </p>
          </div>
        </div>
      </section>

      {/* ── SECTION 2: The Trust Foundation ── */}
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
            Section 2
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
            The Trust Foundation
          </h2>

          <p style={{
            fontFamily: "var(--font-montserrat)",
            fontSize: "1rem",
            lineHeight: 1.8,
            color: "oklch(38% 0.008 260)",
            marginBottom: "1.5rem",
          }}>
            Patrick Lencioni&apos;s &ldquo;Five Dysfunctions of a Team&rdquo; begins at the bottom of the pyramid: absence of trust. But Lencioni is careful about what he means. He isn&apos;t talking about predictability-based trust — &ldquo;I trust you to do your job.&rdquo; He&apos;s talking about <em>vulnerability-based trust</em> — the kind where team members are genuinely transparent and honest with one another.
          </p>
          <p style={{
            fontFamily: "var(--font-montserrat)",
            fontSize: "1rem",
            lineHeight: 1.8,
            color: "oklch(38% 0.008 260)",
            marginBottom: "1.5rem",
          }}>
            Vulnerability-based trust means: I can admit I don&apos;t know. I can say I made a mistake. I can disagree with you without it damaging our relationship. I can be seen in my uncertainty without losing respect. This kind of trust can only be built — it cannot be declared, assumed, or shortcut.
          </p>

          <div style={{ display: "flex", flexDirection: "column", gap: "1px", marginBottom: "2rem" }}>
            {[
              {
                label: "Predictability Trust",
                body: "\"I trust you to do your job.\" Relies on track record and competence. Important — but insufficient. Doesn't require vulnerability.",
              },
              {
                label: "Vulnerability Trust",
                body: "\"I trust you enough to be honest about my doubts, failures, and fears.\" This is what Lencioni means — and what psychological safety requires.",
              },
            ].map((item, i) => (
              <div key={item.label} style={{
                background: i === 1 ? "oklch(95% 0.005 80)" : "oklch(92% 0.008 80)",
                padding: "1.5rem 2rem",
                borderLeft: i === 1 ? "3px solid oklch(65% 0.15 45)" : "3px solid oklch(78% 0.03 260)",
              }}>
                <p style={{ fontFamily: "var(--font-montserrat)", fontWeight: 700, fontSize: "0.875rem", color: "oklch(22% 0.08 260)", marginBottom: "0.375rem" }}>
                  {item.label}
                </p>
                <p style={{ fontFamily: "var(--font-montserrat)", fontSize: "0.9rem", lineHeight: 1.7, color: "oklch(42% 0.008 260)", margin: 0, fontStyle: "italic" }}>
                  {item.body}
                </p>
              </div>
            ))}
          </div>

          <p style={{
            fontFamily: "var(--font-montserrat)",
            fontSize: "1rem",
            lineHeight: 1.8,
            color: "oklch(38% 0.008 260)",
          }}>
            Most teams have plenty of the first kind. What distinguishes truly great teams is the presence of the second — and the only way to build it is through repeated experiences of honesty being met with grace rather than punishment.
          </p>
        </div>
      </section>

      {/* ── SECTION 3: Biblical Grounding ── */}
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
            Section 3
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
            Biblical Grounding: Walking in the Light
          </h2>

          <p style={{
            fontFamily: "var(--font-montserrat)",
            fontSize: "1rem",
            lineHeight: 1.8,
            color: "oklch(78% 0.03 260)",
            marginBottom: "1.5rem",
          }}>
            Long before Amy Edmondson published her research, James wrote a letter to scattered communities of cross-cultural believers facing exactly this challenge: how to be honest with each other when the stakes are real and shame is close.
          </p>

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
              &ldquo;Confess your sins to one another and pray for each other so that you may be healed.&rdquo;
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
              James 5:16
            </cite>
          </blockquote>

          <p style={{
            fontFamily: "var(--font-montserrat)",
            fontSize: "1rem",
            lineHeight: 1.8,
            color: "oklch(78% 0.03 260)",
            marginBottom: "1.5rem",
          }}>
            Confession is not about performance or reputation management. It is the deliberate act of dropping the mask in the presence of others — and trusting that grace will meet you there. The early church practised radical transparency not because it was comfortable, but because they believed that healing came through honesty, not through hiding.
          </p>
          <p style={{
            fontFamily: "var(--font-montserrat)",
            fontSize: "1rem",
            lineHeight: 1.8,
            color: "oklch(78% 0.03 260)",
            marginBottom: "2rem",
          }}>
            In a world that rewards performance and punishes weakness, the Kingdom model is countercultural: we are strongest when we are honest about our limits. 1 John 1:7 takes it further: <em style={{ color: "oklch(88% 0.04 260)" }}>&ldquo;If we walk in the light, as he is in the light, we have fellowship with one another.&rdquo;</em> Light-walking is the precondition of fellowship — and fellowship is the precondition of a real team.
          </p>

          <div style={{
            background: "oklch(30% 0.12 260 / 0.5)",
            borderLeft: "3px solid oklch(65% 0.15 45 / 0.5)",
            padding: "1.5rem 1.75rem",
          }}>
            <p style={{
              fontFamily: "var(--font-montserrat)",
              fontSize: "0.9rem",
              fontWeight: 500,
              lineHeight: 1.7,
              color: "oklch(78% 0.04 260)",
              margin: 0,
            }}>
              <strong style={{ color: "oklch(92% 0.005 80)", fontWeight: 700 }}>The implication for leaders: </strong>
              You cannot demand this kind of openness from your team. You can only create the conditions where it becomes possible — and model it yourself first.
            </p>
          </div>
        </div>
      </section>

      {/* ── SECTION 4: What Destroys Trust ── */}
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
            Section 4
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
            What Destroys Trust
          </h2>

          <p style={{
            fontFamily: "var(--font-montserrat)",
            fontSize: "1rem",
            lineHeight: 1.8,
            color: "oklch(38% 0.008 260)",
            marginBottom: "1.75rem",
          }}>
            Trust erodes quietly — often through small, repeated acts that send a clear message: it is not safe to be honest here. Leaders are often the last to know, because the silence that follows is easily mistaken for agreement.
          </p>

          <div style={{ display: "flex", flexDirection: "column", gap: "1px", marginBottom: "2rem" }}>
            {[
              { trigger: "Punishing honest questions", detail: "\"How could you not know that?\" — one response like this can silence an entire team for months." },
              { trigger: "Blaming in public", detail: "Accountability is healthy. Public blame is a different thing. It signals that failure will be displayed, not worked through." },
              { trigger: "Inconsistency between words and actions", detail: "If you say \"come to me with anything\" and then react badly, people will remember the reaction and forget the invitation." },
              { trigger: "Unequal voice", detail: "When some voices are consistently treated as more valid — by role, gender, culture, or confidence — others conclude that their contribution doesn't really count." },
              { trigger: "Dominant personalities going unchecked", detail: "When louder voices regularly fill the space, quieter team members learn to wait rather than contribute. The team loses access to half its thinking." },
            ].map((item) => (
              <div key={item.trigger} style={{
                background: "oklch(95% 0.005 80)",
                padding: "1.5rem 2rem",
                display: "grid",
                gridTemplateColumns: "1rem 1fr",
                gap: "1.25rem",
                alignItems: "start",
              }}>
                <div style={{ width: "6px", height: "6px", borderRadius: "50%", background: "oklch(65% 0.15 45)", marginTop: "0.5rem" }} />
                <div>
                  <p style={{ fontFamily: "var(--font-montserrat)", fontWeight: 700, fontSize: "0.9375rem", color: "oklch(22% 0.08 260)", marginBottom: "0.375rem" }}>
                    {item.trigger}
                  </p>
                  <p style={{ fontFamily: "var(--font-montserrat)", fontSize: "0.875rem", lineHeight: 1.7, color: "oklch(42% 0.008 260)", margin: 0 }}>
                    {item.detail}
                  </p>
                </div>
              </div>
            ))}
          </div>

          <div style={{
            background: "oklch(95% 0.005 80)",
            borderLeft: "3px solid oklch(22% 0.08 260)",
            padding: "1.5rem 1.75rem",
          }}>
            <p style={{
              fontFamily: "var(--font-montserrat)",
              fontWeight: 700,
              fontSize: "0.9375rem",
              color: "oklch(22% 0.08 260)",
              marginBottom: "0.5rem",
            }}>
              A note on multicultural teams:
            </p>
            <p style={{
              fontFamily: "var(--font-montserrat)",
              fontSize: "0.9rem",
              lineHeight: 1.7,
              color: "oklch(38% 0.008 260)",
              margin: 0,
            }}>
              The risk of unintentional cultural shaming is significantly higher in cross-cultural settings. A leader must be alert to when indirect communicators are being talked over, when shame dynamics are surfacing quietly, or when hierarchy is preventing honest input. What reads as silence in one culture may be communicating distress.
            </p>
          </div>
        </div>
      </section>

      {/* ── SECTION 5: How to Build It ── */}
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
            marginBottom: "2rem",
          }}>
            How to Build It
          </h2>

          <p style={{
            fontFamily: "var(--font-montserrat)",
            fontSize: "1rem",
            lineHeight: 1.8,
            color: "oklch(78% 0.03 260)",
            marginBottom: "1.75rem",
          }}>
            Psychological safety is not built in a single retreat or through a values statement. It is built through hundreds of small decisions — moments where the leader chooses honesty over image management, chooses to thank the messenger rather than punish them, and chooses to create structured space for every voice to be heard.
          </p>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: "1px", background: "oklch(22% 0.10 260 / 0.5)", marginBottom: "2rem" }}>
            {[
              { num: "01", title: "Model vulnerability — go first", body: "Share a failure, a fear, a limitation. Don't perform weakness. Be honest about something real. This gives permission." },
              { num: "02", title: "Reward honesty", body: "When someone raises a concern or challenges an idea, thank them before you respond. Make the reward visible." },
              { num: "03", title: "Never punish the messenger", body: "Even when the message is hard to hear. Especially then. This is the single most important practice." },
              { num: "04", title: "Create structure for safer voices", body: "Anonymous input, written reflection before verbal discussion, small groups — structure protects those who wouldn't speak otherwise." },
              { num: "05", title: "Check in regularly", body: "Safety is not built once. It requires repeated attention. A brief team health check every month does more than an annual retreat." },
            ].map(item => (
              <div key={item.num} style={{ background: "oklch(26% 0.11 260)", padding: "1.75rem" }}>
                <p style={{ fontFamily: "var(--font-montserrat)", fontWeight: 800, fontSize: "1.5rem", color: "oklch(65% 0.15 45 / 0.4)", lineHeight: 1, marginBottom: "0.75rem" }}>{item.num}</p>
                <h3 style={{ fontFamily: "var(--font-montserrat)", fontWeight: 700, fontSize: "0.9375rem", color: "oklch(97% 0.005 80)", marginBottom: "0.625rem" }}>
                  {item.title}
                </h3>
                <p style={{ fontFamily: "var(--font-montserrat)", fontSize: "0.875rem", lineHeight: 1.7, color: "oklch(72% 0.04 260)", margin: 0 }}>
                  {item.body}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── DIMENSION OVERVIEW CARDS ── */}
      <section style={{ paddingBlock: "clamp(3.5rem, 6vw, 5rem)", background: "oklch(97% 0.005 80)" }}>
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
            Assessment Overview
          </p>
          <h2 style={{
            fontFamily: "var(--font-montserrat)",
            fontWeight: 800,
            fontSize: "clamp(1.5rem, 3vw, 2.25rem)",
            color: "oklch(22% 0.08 260)",
            letterSpacing: "-0.02em",
            lineHeight: 1.2,
            marginBottom: "0.875rem",
          }}>
            6 Dimensions of Team Trust
          </h2>
          <p style={{
            fontFamily: "var(--font-montserrat)",
            fontSize: "0.9375rem",
            lineHeight: 1.7,
            color: "oklch(48% 0.008 260)",
            marginBottom: "3rem",
            maxWidth: "56ch",
          }}>
            You&apos;ll rate your team on each of these dimensions below. Read each one before you score — the descriptions matter.
          </p>

          <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
            gap: "1.25rem",
          }}>
            {DIMENSIONS.map((dim, i) => (
              <div key={dim.key} style={{
                background: "oklch(95% 0.005 80)",
                border: "1px solid oklch(88% 0.008 80)",
                padding: "1.5rem",
                display: "flex",
                flexDirection: "column",
                gap: "0.75rem",
              }}>
                <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
                  <span style={{
                    fontFamily: "var(--font-montserrat)",
                    fontWeight: 800,
                    fontSize: "1.5rem",
                    color: "oklch(88% 0.008 80)",
                    lineHeight: 1,
                  }}>
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <span style={{
                    fontFamily: "var(--font-montserrat)",
                    fontWeight: 700,
                    fontSize: "0.9375rem",
                    color: "oklch(22% 0.08 260)",
                  }}>
                    {dim.label}
                  </span>
                </div>
                <p style={{
                  fontFamily: "var(--font-montserrat)",
                  fontSize: "0.875rem",
                  lineHeight: 1.65,
                  color: "oklch(42% 0.008 260)",
                  margin: 0,
                  fontStyle: "italic",
                }}>
                  &ldquo;{dim.description}&rdquo;
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── ASSESSMENT ── */}
      <section style={{ paddingBlock: "clamp(3.5rem, 6vw, 5rem)", background: "oklch(22% 0.08 260)" }}>
        <div className="container-wide" style={{ maxWidth: "800px" }}>
          <p style={{
            fontFamily: "var(--font-montserrat)",
            fontSize: "0.68rem",
            fontWeight: 800,
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
            color: "oklch(97% 0.005 80)",
            letterSpacing: "-0.02em",
            lineHeight: 1.2,
            marginBottom: "0.875rem",
          }}>
            Team Trust Temperature Check
          </h2>
          <p style={{
            fontFamily: "var(--font-montserrat)",
            fontSize: "0.9375rem",
            lineHeight: 1.7,
            color: "oklch(72% 0.04 260)",
            marginBottom: "3rem",
            maxWidth: "54ch",
          }}>
            Rate your team honestly on each dimension. 1 = this is severely lacking. 5 = this is strong and consistent. Your scores will generate a trust profile below.
          </p>

          <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
            {DIMENSIONS.map((dim, i) => {
              const score = scores[dim.key];
              return (
                <div key={dim.key} style={{
                  background: "oklch(30% 0.12 260)",
                  padding: "1.75rem",
                }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "0.75rem", gap: "1rem", flexWrap: "wrap" }}>
                    <div style={{ flex: 1 }}>
                      <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "0.375rem" }}>
                        <span style={{ fontFamily: "var(--font-montserrat)", fontWeight: 800, fontSize: "0.7rem", color: "oklch(65% 0.15 45)", letterSpacing: "0.12em" }}>
                          {String(i + 1).padStart(2, "0")}
                        </span>
                        <h3 style={{ fontFamily: "var(--font-montserrat)", fontWeight: 700, fontSize: "1rem", color: "oklch(97% 0.005 80)", margin: 0 }}>
                          {dim.label}
                        </h3>
                      </div>
                      <p style={{ fontFamily: "var(--font-montserrat)", fontSize: "0.875rem", lineHeight: 1.65, color: "oklch(72% 0.04 260)", margin: 0, fontStyle: "italic" }}>
                        &ldquo;{dim.description}&rdquo;
                      </p>
                    </div>
                    <span style={{
                      fontFamily: "var(--font-montserrat)",
                      fontWeight: 800,
                      fontSize: "2.5rem",
                      color: "oklch(65% 0.15 45)",
                      lineHeight: 1,
                      flexShrink: 0,
                    }}>
                      {score}
                    </span>
                  </div>

                  {/* Slider track */}
                  <div style={{ position: "relative", marginBottom: "0.75rem" }}>
                    <div style={{ height: "4px", background: "oklch(22% 0.08 260)", borderRadius: "2px" }}>
                      <div style={{
                        height: "4px",
                        background: "oklch(65% 0.15 45)",
                        borderRadius: "2px",
                        width: `${((score - 1) / 4) * 100}%`,
                        transition: "width 0.1s ease",
                      }} />
                    </div>
                    <input
                      type="range"
                      min={1}
                      max={5}
                      step={1}
                      value={score}
                      onChange={e => setScores(prev => ({ ...prev, [dim.key]: parseInt(e.target.value) }))}
                      style={{ position: "absolute", top: "-8px", left: 0, width: "100%", opacity: 0, cursor: "pointer", height: "20px" }}
                    />
                  </div>

                  {/* Step buttons */}
                  <div style={{ display: "flex", gap: "0.5rem" }}>
                    {[1, 2, 3, 4, 5].map(n => (
                      <button
                        key={n}
                        onClick={() => setScores(prev => ({ ...prev, [dim.key]: n }))}
                        style={{
                          flex: 1,
                          padding: "0.5rem",
                          border: "none",
                          borderRadius: "4px",
                          cursor: "pointer",
                          fontFamily: "var(--font-montserrat)",
                          fontWeight: 700,
                          fontSize: "0.875rem",
                          background: n === score ? "oklch(65% 0.15 45)" : "oklch(22% 0.08 260)",
                          color: n === score ? "white" : "oklch(55% 0.04 260)",
                          transition: "all 0.12s ease",
                        }}
                      >
                        {n}
                      </button>
                    ))}
                  </div>
                  <div style={{ display: "flex", justifyContent: "space-between", marginTop: "0.375rem" }}>
                    <span style={{ fontFamily: "var(--font-montserrat)", fontSize: "0.65rem", color: "oklch(52% 0.04 260)", letterSpacing: "0.06em" }}>Severely lacking</span>
                    <span style={{ fontFamily: "var(--font-montserrat)", fontSize: "0.65rem", color: "oklch(52% 0.04 260)", letterSpacing: "0.06em" }}>Consistently strong</span>
                  </div>
                </div>
              );
            })}
          </div>

          {!submitted && (
            <button
              onClick={handleSubmit}
              style={{
                marginTop: "2.5rem",
                fontFamily: "var(--font-montserrat)",
                fontWeight: 700,
                fontSize: "0.875rem",
                letterSpacing: "0.06em",
                textTransform: "uppercase",
                background: "oklch(65% 0.15 45)",
                color: "white",
                border: "none",
                padding: "1rem 2.5rem",
                cursor: "pointer",
                display: "inline-block",
              }}
            >
              See My Trust Profile →
            </button>
          )}
        </div>
      </section>

      {/* ── RESULT PANEL ── */}
      {submitted && (
        <section id="result-panel" style={{ paddingBlock: "clamp(3.5rem, 6vw, 5rem)", background: "oklch(30% 0.12 260)" }}>
          <div className="container-wide" style={{ maxWidth: "800px" }}>
            <p style={{
              fontFamily: "var(--font-montserrat)",
              fontSize: "0.68rem",
              fontWeight: 800,
              letterSpacing: "0.18em",
              textTransform: "uppercase",
              color: "oklch(65% 0.15 45)",
              marginBottom: "0.875rem",
            }}>
              Your Trust Profile
            </p>
            <h2 style={{
              fontFamily: "var(--font-montserrat)",
              fontWeight: 800,
              fontSize: "clamp(1.5rem, 3vw, 2.25rem)",
              color: "oklch(97% 0.005 80)",
              letterSpacing: "-0.02em",
              lineHeight: 1.2,
              marginBottom: "2.5rem",
            }}>
              Here&apos;s what your scores reveal
            </h2>

            {/* Average badge */}
            <div style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "1rem",
              background: "oklch(22% 0.08 260)",
              padding: "1.25rem 2rem",
              marginBottom: "2rem",
            }}>
              <span style={{
                fontFamily: "var(--font-montserrat)",
                fontWeight: 800,
                fontSize: "3.5rem",
                color: "oklch(65% 0.15 45)",
                lineHeight: 1,
              }}>
                {roundedAvg}
              </span>
              <div>
                <p style={{ fontFamily: "var(--font-montserrat)", fontWeight: 700, fontSize: "0.75rem", letterSpacing: "0.12em", textTransform: "uppercase", color: "oklch(72% 0.04 260)", margin: "0 0 0.25rem" }}>
                  Average Score
                </p>
                <p style={{ fontFamily: "var(--font-montserrat)", fontSize: "0.875rem", color: "oklch(55% 0.04 260)", margin: 0 }}>out of 5.0</p>
              </div>
            </div>

            {/* Interpretation */}
            <div style={{
              borderLeft: "3px solid oklch(65% 0.15 45)",
              paddingLeft: "1.5rem",
              marginBottom: "2.5rem",
            }}>
              <p style={{
                fontFamily: "var(--font-montserrat)",
                fontSize: "1.0625rem",
                fontWeight: 600,
                lineHeight: 1.65,
                color: "oklch(92% 0.005 80)",
                margin: 0,
              }}>
                {interpretation.text}
              </p>
            </div>

            {/* Bar visualization */}
            <div style={{ display: "flex", flexDirection: "column", gap: "0.875rem", marginBottom: "2.5rem" }}>
              {DIMENSIONS.map(dim => {
                const score = scores[dim.key];
                const pct = (score / 5) * 100;
                return (
                  <div key={dim.key}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: "0.375rem" }}>
                      <span style={{ fontFamily: "var(--font-montserrat)", fontWeight: 600, fontSize: "0.875rem", color: "oklch(82% 0.04 260)" }}>
                        {dim.label}
                      </span>
                      <span style={{ fontFamily: "var(--font-montserrat)", fontWeight: 700, fontSize: "0.875rem", color: "oklch(65% 0.15 45)" }}>
                        {score}/5
                      </span>
                    </div>
                    <div style={{ height: "8px", background: "oklch(22% 0.08 260)", borderRadius: "4px", overflow: "hidden" }}>
                      <div style={{
                        height: "8px",
                        width: `${pct}%`,
                        background: score >= 4 ? "oklch(55% 0.18 145)" : score >= 3 ? "oklch(65% 0.15 45)" : "oklch(58% 0.18 20)",
                        borderRadius: "4px",
                        transition: "width 0.4s ease",
                      }} />
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Save button */}
            {user && !saved && (
              <div>
                <button
                  onClick={handleSave}
                  disabled={isSaving}
                  style={{
                    fontFamily: "var(--font-montserrat)",
                    fontWeight: 700,
                    fontSize: "0.8125rem",
                    letterSpacing: "0.06em",
                    textTransform: "uppercase",
                    background: "oklch(65% 0.15 45)",
                    color: "white",
                    border: "none",
                    padding: "0.875rem 1.75rem",
                    cursor: isSaving ? "wait" : "pointer",
                    opacity: isSaving ? 0.7 : 1,
                  }}
                >
                  {isSaving ? "Saving…" : "Save to Dashboard →"}
                </button>
                {saveError && (
                  <p style={{ fontFamily: "var(--font-montserrat)", fontSize: "0.875rem", color: "oklch(58% 0.18 20)", marginTop: "0.75rem" }}>
                    {saveError}
                  </p>
                )}
              </div>
            )}

            {saved && (
              <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", color: "oklch(55% 0.18 145)" }}>
                <span style={{ fontFamily: "var(--font-montserrat)", fontWeight: 700, fontSize: "0.875rem" }}>
                  ✓ Saved to your dashboard
                </span>
              </div>
            )}

            {!user && (
              <p style={{ fontFamily: "var(--font-montserrat)", fontSize: "0.875rem", color: "oklch(62% 0.04 260)", marginTop: "1rem" }}>
                <Link href="/signup" style={{ color: "oklch(65% 0.15 45)", fontWeight: 700, textDecoration: "none" }}>
                  Sign up
                </Link>
                {" "}to save your trust profile and track progress over time.
              </p>
            )}
          </div>
        </section>
      )}

      {/* ── CTA ── */}
      <section style={{ paddingBlock: "clamp(3.5rem, 6vw, 5.5rem)", background: "oklch(22% 0.08 260)", position: "relative" }}>
        <div style={{ position: "absolute", left: "clamp(1.5rem, 5vw, 4rem)", top: "clamp(3.5rem, 6vw, 5.5rem)", bottom: "clamp(3.5rem, 6vw, 5.5rem)", width: "3px", background: "oklch(65% 0.15 45)" }} />
        <div className="container-wide" style={{ paddingLeft: "2.5rem", maxWidth: "680px" }}>
          <p style={{
            fontFamily: "var(--font-montserrat)",
            fontSize: "0.68rem",
            fontWeight: 800,
            letterSpacing: "0.18em",
            textTransform: "uppercase",
            color: "oklch(65% 0.15 45)",
            marginBottom: "1rem",
          }}>
            What&apos;s Next
          </p>
          <h2 style={{
            fontFamily: "var(--font-montserrat)",
            fontWeight: 800,
            fontSize: "clamp(1.375rem, 3vw, 2rem)",
            color: "oklch(97% 0.005 80)",
            letterSpacing: "-0.02em",
            lineHeight: 1.2,
            marginBottom: "1rem",
          }}>
            Safety is the foundation. Now build on it.
          </h2>
          <p style={{
            fontFamily: "var(--font-montserrat)",
            fontSize: "0.9375rem",
            lineHeight: 1.75,
            color: "oklch(72% 0.04 260)",
            marginBottom: "2.5rem",
          }}>
            Module 6 moves from the environment of trust to the people within it — helping every team member understand their contribution zone and where they add the most unique value.
          </p>
          <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap", alignItems: "center" }}>
            <Link
              href="/team/roles-contribution"
              style={{
                fontFamily: "var(--font-montserrat)",
                fontWeight: 700,
                fontSize: "0.8125rem",
                letterSpacing: "0.06em",
                textTransform: "uppercase",
                background: "oklch(65% 0.15 45)",
                color: "white",
                textDecoration: "none",
                padding: "0.875rem 1.75rem",
                display: "inline-block",
              }}
            >
              Module 06: Roles & Contribution →
            </Link>
            <Link
              href="/team"
              style={{
                fontFamily: "var(--font-montserrat)",
                fontWeight: 600,
                fontSize: "0.8125rem",
                letterSpacing: "0.06em",
                color: "oklch(72% 0.04 260)",
                textDecoration: "none",
                padding: "0.875rem 0",
              }}
            >
              ← Back to Team Dashboard
            </Link>
          </div>
        </div>
      </section>

    </div>
  );
}

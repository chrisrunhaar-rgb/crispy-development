"use client";

import { useState } from "react";
import Link from "next/link";
import type { User } from "@supabase/supabase-js";

// ── CARD DATA ─────────────────────────────────────────────────────────────────

type Level = "surface" | "personal" | "deep";

interface Card {
  question: string;
  level: Level;
}

const SURFACE_CARDS: Card[] = [
  { question: "What do you love most about the work we do?", level: "surface" },
  { question: "What's something most people don't know about you?", level: "surface" },
  { question: "Where in the world have you lived or worked?", level: "surface" },
  { question: "What's a tradition from your culture that you value deeply?", level: "surface" },
  { question: "What do you do to recharge when you're tired?", level: "surface" },
  { question: "What's something you're proud of that isn't work-related?", level: "surface" },
  { question: "Who has influenced you most as a leader?", level: "surface" },
  { question: "What book, film, or quote has shaped how you see the world?", level: "surface" },
];

const PERSONAL_CARDS: Card[] = [
  { question: "What's the hardest season you've navigated in the last few years?", level: "personal" },
  { question: "What does your faith community look like, and what does it mean to you?", level: "personal" },
  { question: "When do you feel most like yourself at work? When do you feel least like yourself?", level: "personal" },
  { question: "What would your closest friends say is your greatest strength? Your biggest blind spot?", level: "personal" },
  { question: "What's a dream you've put on hold? Why?", level: "personal" },
  { question: "What's a value you hold that you'd never compromise on?", level: "personal" },
  { question: "How has living cross-culturally changed how you see yourself?", level: "personal" },
  { question: "What does 'home' mean to you?", level: "personal" },
];

const DEEP_CARDS: Card[] = [
  { question: "What are you afraid of most as a leader?", level: "deep" },
  { question: "Is there a wound in your story that still shapes how you lead?", level: "deep" },
  { question: "When have you felt most alone in this work?", level: "deep" },
  { question: "What do you believe God is doing in your life in this season?", level: "deep" },
  { question: "Where do you need the people in this room to hold you accountable?", level: "deep" },
  { question: "What does it mean for you personally to be known — truly known?", level: "deep" },
  { question: "If you could say one honest thing to this team that you've never said, what would it be?", level: "deep" },
  { question: "What do you hope people will say about you when you're gone?", level: "deep" },
];

const ALL_CARDS = [...SURFACE_CARDS, ...PERSONAL_CARDS, ...DEEP_CARDS];

// ── LEVEL CONFIG ──────────────────────────────────────────────────────────────

const LEVEL_CONFIG: Record<Level, {
  label: string;
  cardBg: string;
  cardBorder: string;
  tagBg: string;
  tagColor: string;
  tabBg: string;
  tabActiveBg: string;
  tabActiveColor: string;
  tabColor: string;
  description: string;
}> = {
  surface: {
    label: "Surface",
    cardBg: "oklch(96% 0.005 80)",
    cardBorder: "oklch(88% 0.008 80)",
    tagBg: "oklch(88% 0.012 80)",
    tagColor: "oklch(45% 0.01 260)",
    tabBg: "oklch(90% 0.006 80)",
    tabActiveBg: "oklch(97% 0.005 80)",
    tabActiveColor: "oklch(22% 0.08 260)",
    tabColor: "oklch(50% 0.008 260)",
    description: "Good for any team meeting. Opens conversation without pressure.",
  },
  personal: {
    label: "Personal",
    cardBg: "oklch(30% 0.12 260)",
    cardBorder: "oklch(38% 0.10 260)",
    tagBg: "oklch(38% 0.10 260)",
    tagColor: "oklch(80% 0.04 260)",
    tabBg: "oklch(26% 0.10 260)",
    tabActiveBg: "oklch(35% 0.12 260)",
    tabActiveColor: "oklch(97% 0.005 80)",
    tabColor: "oklch(65% 0.04 260)",
    description: "For teams with some trust built. Invites real stories and values.",
  },
  deep: {
    label: "Deep",
    cardBg: "oklch(18% 0.08 260)",
    cardBorder: "oklch(26% 0.10 260)",
    tagBg: "oklch(26% 0.10 260)",
    tagColor: "oklch(72% 0.04 260)",
    tabBg: "oklch(16% 0.08 260)",
    tabActiveBg: "oklch(22% 0.10 260)",
    tabActiveColor: "oklch(97% 0.005 80)",
    tabColor: "oklch(55% 0.04 260)",
    description: "For teams ready to go beneath the surface. Use with care and prayer.",
  },
};

// ── SHUFFLE ───────────────────────────────────────────────────────────────────

function shuffleArray<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

// ── COMPONENT ─────────────────────────────────────────────────────────────────

export default function KnowEachOtherClient({ user }: { user: User | null }) {
  const [activeLevel, setActiveLevel] = useState<Level>("surface");
  const [cardOrder, setCardOrder] = useState<Record<Level, Card[]>>({
    surface: SURFACE_CARDS,
    personal: PERSONAL_CARDS,
    deep: DEEP_CARDS,
  });
  const [flipped, setFlipped] = useState<Record<string, boolean>>({});

  const cfg = LEVEL_CONFIG[activeLevel];
  const cards = cardOrder[activeLevel];
  const isDark = activeLevel !== "surface";

  function handleShuffle() {
    setCardOrder(prev => ({ ...prev, [activeLevel]: shuffleArray(prev[activeLevel]) }));
    setFlipped({});
  }

  function handleShuffleAll() {
    setCardOrder({
      surface: shuffleArray(SURFACE_CARDS),
      personal: shuffleArray(PERSONAL_CARDS),
      deep: shuffleArray(DEEP_CARDS),
    });
    setFlipped({});
  }

  const sectionBg = isDark ? "oklch(22% 0.08 260)" : "oklch(97% 0.005 80)";
  const textColor = isDark ? "oklch(97% 0.005 80)" : "oklch(22% 0.08 260)";
  const mutedColor = isDark ? "oklch(72% 0.04 260)" : "oklch(48% 0.008 260)";

  return (
    <>
      {/* ── HERO ── */}
      <section style={{
        background: "oklch(22% 0.08 260)",
        paddingTop: "clamp(2.5rem, 5vw, 5rem)",
        paddingBottom: "clamp(2.5rem, 5vw, 5rem)",
        position: "relative",
        overflow: "hidden",
      }}>
        <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: "3px", background: "oklch(65% 0.15 45)" }} />
        <div style={{
          position: "absolute", inset: 0,
          background: "radial-gradient(ellipse at 70% 50%, oklch(30% 0.12 260 / 0.4) 0%, transparent 70%)",
          pointerEvents: "none",
        }} />
        <div className="container-wide" style={{ position: "relative" }}>
          <Link href="/team" style={{
            fontFamily: "var(--font-montserrat)", fontSize: "0.72rem", color: "oklch(62% 0.04 260)",
            textDecoration: "none", display: "inline-flex", alignItems: "center", gap: "0.375rem", marginBottom: "1.5rem",
          }}>
            ← Team Pathway
          </Link>

          <div style={{ display: "flex", alignItems: "center", gap: "1rem", marginBottom: "1.25rem" }}>
            <span style={{
              fontFamily: "var(--font-montserrat)", fontWeight: 800, fontSize: "0.65rem", letterSpacing: "0.18em",
              textTransform: "uppercase", color: "oklch(65% 0.15 45)",
              border: "1.5px solid oklch(65% 0.15 45)", padding: "0.3rem 0.7rem",
            }}>
              Module 03
            </span>
            <span style={{
              fontFamily: "var(--font-montserrat)", fontWeight: 600, fontSize: "0.65rem", letterSpacing: "0.14em",
              textTransform: "uppercase", color: "oklch(72% 0.04 260)",
            }}>
              15–20 min
            </span>
          </div>

          <h1 className="t-hero" style={{ color: "oklch(97% 0.005 80)", marginBottom: "1.25rem", maxWidth: "18ch" }}>
            How to Really<br />
            <span style={{ color: "oklch(65% 0.15 45)" }}>Know Each Other</span>
          </h1>

          <p className="t-tagline" style={{ color: "oklch(72% 0.04 260)", maxWidth: "52ch", marginBottom: "2.5rem" }}>
            Most teams know what each person does. Few teams know who each person is.
          </p>

          <a href="#cards" className="btn-primary" style={{ textDecoration: "none" }}>
            Go to Question Cards →
          </a>
        </div>
      </section>

      {/* ── SECTION 1: Information vs. Knowledge ── */}
      <section style={{ paddingBlock: "clamp(3.5rem, 6vw, 6rem)", background: "oklch(97% 0.005 80)" }}>
        <div className="container-wide">
          <div style={{ maxWidth: "68ch" }}>
            <p style={{
              fontFamily: "var(--font-montserrat)", fontWeight: 700, fontSize: "0.65rem",
              letterSpacing: "0.18em", textTransform: "uppercase",
              color: "oklch(65% 0.15 45)", marginBottom: "0.875rem",
            }}>
              Section 1
            </p>
            <h2 style={{
              fontFamily: "var(--font-montserrat)", fontWeight: 800,
              fontSize: "clamp(1.5rem, 3vw, 2.25rem)", lineHeight: 1.15,
              color: "oklch(22% 0.08 260)", marginBottom: "1.5rem",
            }}>
              The Difference Between Information and Knowledge
            </h2>
            <p style={{
              fontFamily: "var(--font-montserrat)", fontSize: "1rem", lineHeight: 1.8,
              color: "oklch(30% 0.008 260)", marginBottom: "1.25rem",
            }}>
              We gather information about colleagues — their role, their skills, their background. But real knowing is different. It means knowing what someone fears, what they love, what shaped them, what they&rsquo;re quietly carrying.
            </p>
            <p style={{
              fontFamily: "var(--font-montserrat)", fontSize: "1rem", lineHeight: 1.8,
              color: "oklch(30% 0.008 260)",
            }}>
              Most teams stop at information and wonder why they lack depth. The gap isn&rsquo;t a skills gap. It&rsquo;s a knowing gap.
            </p>
          </div>
        </div>
      </section>

      <div style={{ height: "1px", background: "oklch(90% 0.006 80)" }} />

      {/* ── SECTION 2: The Paradox of Being Known ── */}
      <section style={{ paddingBlock: "clamp(3.5rem, 6vw, 6rem)", background: "oklch(97% 0.005 80)" }}>
        <div className="container-wide">
          <div style={{ maxWidth: "68ch" }}>
            <p style={{
              fontFamily: "var(--font-montserrat)", fontWeight: 700, fontSize: "0.65rem",
              letterSpacing: "0.18em", textTransform: "uppercase",
              color: "oklch(65% 0.15 45)", marginBottom: "0.875rem",
            }}>
              Section 2
            </p>
            <h2 style={{
              fontFamily: "var(--font-montserrat)", fontWeight: 800,
              fontSize: "clamp(1.5rem, 3vw, 2.25rem)", lineHeight: 1.15,
              color: "oklch(22% 0.08 260)", marginBottom: "1.5rem",
            }}>
              The Paradox of Being Known
            </h2>
            <p style={{
              fontFamily: "var(--font-montserrat)", fontSize: "1rem", lineHeight: 1.8,
              color: "oklch(30% 0.008 260)", marginBottom: "1.25rem",
            }}>
              You can only truly know someone who is willing to be known. And people only open up when it feels safe — when vulnerability is modelled, not demanded. This creates the paradox: the person who most wants to be known often hides the most.
            </p>
            <p style={{
              fontFamily: "var(--font-montserrat)", fontSize: "1rem", lineHeight: 1.8,
              color: "oklch(30% 0.008 260)",
            }}>
              The leader&rsquo;s role is to go first. Not to extract vulnerability from others, but to offer their own — and in doing so, create the conditions where others feel safe enough to do the same.
            </p>
          </div>
        </div>
      </section>

      {/* ── PULL QUOTE: Psalm 139 ── */}
      <section style={{
        background: "oklch(22% 0.08 260)",
        paddingBlock: "clamp(4rem, 7vw, 7rem)",
        position: "relative",
        overflow: "hidden",
      }}>
        <div style={{
          position: "absolute", left: 0, top: 0, bottom: 0, width: "4px",
          background: "oklch(65% 0.15 45)",
        }} />
        <div style={{
          position: "absolute", inset: 0,
          background: "radial-gradient(ellipse at 30% 50%, oklch(30% 0.14 260 / 0.3) 0%, transparent 60%)",
          pointerEvents: "none",
        }} />
        <div className="container-wide" style={{ position: "relative" }}>
          <p style={{
            fontFamily: "var(--font-montserrat)", fontWeight: 700, fontSize: "0.62rem",
            letterSpacing: "0.18em", textTransform: "uppercase",
            color: "oklch(65% 0.15 45)", marginBottom: "1.5rem",
          }}>
            Biblical Grounding · Section 3
          </p>
          <blockquote style={{
            fontFamily: "var(--font-montserrat)", fontWeight: 700,
            fontSize: "clamp(1.5rem, 4vw, 3rem)", lineHeight: 1.2,
            color: "oklch(97% 0.005 80)", margin: 0, marginBottom: "1.25rem",
            maxWidth: "22ch",
          }}>
            &ldquo;You have searched me, Lord, and you know me.&rdquo;
          </blockquote>
          <p style={{
            fontFamily: "var(--font-montserrat)", fontSize: "0.8rem", fontWeight: 600,
            letterSpacing: "0.1em", color: "oklch(65% 0.04 260)", marginBottom: "2.5rem",
          }}>
            Psalm 139:1
          </p>
          <div style={{ maxWidth: "64ch" }}>
            <p style={{
              fontFamily: "var(--font-montserrat)", fontSize: "1rem", lineHeight: 1.8,
              color: "oklch(80% 0.04 260)", marginBottom: "1.25rem",
            }}>
              Being known by God is the foundation of our identity. We are not who others think we are — we are who God says we are. This frees us to be known by others without fear.
            </p>
            <p style={{
              fontFamily: "var(--font-montserrat)", fontSize: "1rem", lineHeight: 1.8,
              color: "oklch(80% 0.04 260)", marginBottom: "1.25rem",
            }}>
              In 1 Corinthians 13, love &ldquo;rejoices with the truth&rdquo; — which requires knowing truth about each other. The early disciples shared meals, homes, resources, and stories. Not just information. Life.
            </p>
          </div>
        </div>
      </section>

      {/* ── SECTION 4: Cultural Barriers ── */}
      <section style={{ paddingBlock: "clamp(3.5rem, 6vw, 6rem)", background: "oklch(97% 0.005 80)" }}>
        <div className="container-wide">
          <div style={{ maxWidth: "68ch" }}>
            <p style={{
              fontFamily: "var(--font-montserrat)", fontWeight: 700, fontSize: "0.65rem",
              letterSpacing: "0.18em", textTransform: "uppercase",
              color: "oklch(65% 0.15 45)", marginBottom: "0.875rem",
            }}>
              Section 4
            </p>
            <h2 style={{
              fontFamily: "var(--font-montserrat)", fontWeight: 800,
              fontSize: "clamp(1.5rem, 3vw, 2.25rem)", lineHeight: 1.15,
              color: "oklch(22% 0.08 260)", marginBottom: "1.5rem",
            }}>
              Cultural Barriers to Being Known
            </h2>
            <p style={{
              fontFamily: "var(--font-montserrat)", fontSize: "1rem", lineHeight: 1.8,
              color: "oklch(30% 0.008 260)", marginBottom: "1.25rem",
            }}>
              In many cultures, vulnerability is weakness. In others, personal questions are intrusive. In some contexts, sharing struggle brings shame. In others, it brings support.
            </p>
            <p style={{
              fontFamily: "var(--font-montserrat)", fontSize: "1rem", lineHeight: 1.8,
              color: "oklch(30% 0.008 260)",
            }}>
              On multicultural teams, leaders must create explicit permission to be known — and must be thoughtful about how they invite it. Not everyone will open in the same way or at the same pace. This is not resistance. It is wisdom. Meet people where they are.
            </p>
          </div>
        </div>
      </section>

      <div style={{ height: "1px", background: "oklch(90% 0.006 80)" }} />

      {/* ── SECTION 5: The Practice of Knowing ── */}
      <section style={{ paddingBlock: "clamp(3.5rem, 6vw, 6rem)", background: "oklch(97% 0.005 80)" }}>
        <div className="container-wide">
          <div style={{ maxWidth: "68ch" }}>
            <p style={{
              fontFamily: "var(--font-montserrat)", fontWeight: 700, fontSize: "0.65rem",
              letterSpacing: "0.18em", textTransform: "uppercase",
              color: "oklch(65% 0.15 45)", marginBottom: "0.875rem",
            }}>
              Section 5
            </p>
            <h2 style={{
              fontFamily: "var(--font-montserrat)", fontWeight: 800,
              fontSize: "clamp(1.5rem, 3vw, 2.25rem)", lineHeight: 1.15,
              color: "oklch(22% 0.08 260)", marginBottom: "1.5rem",
            }}>
              The Practice of Knowing
            </h2>
            <p style={{
              fontFamily: "var(--font-montserrat)", fontSize: "1rem", lineHeight: 1.8,
              color: "oklch(30% 0.008 260)", marginBottom: "1.5rem",
            }}>
              Knowing each other is not one conversation — it&rsquo;s a practice. It happens in:
            </p>
            <div style={{ display: "flex", flexDirection: "column", gap: "0.875rem", marginBottom: "1.5rem" }}>
              {[
                "Consistent check-ins that go deeper than tasks",
                "Stories shared over meals",
                "Celebrating milestones and grieving losses together",
                "The question that invites more than a surface answer",
              ].map((item, i) => (
                <div key={i} style={{ display: "flex", gap: "1rem", alignItems: "flex-start" }}>
                  <span style={{
                    width: "6px", height: "6px", borderRadius: "50%", flexShrink: 0, marginTop: "0.55rem",
                    background: "oklch(65% 0.15 45)",
                  }} />
                  <p style={{
                    fontFamily: "var(--font-montserrat)", fontSize: "1rem", lineHeight: 1.7,
                    color: "oklch(30% 0.008 260)", margin: 0,
                  }}>
                    {item}
                  </p>
                </div>
              ))}
            </div>
            <p style={{
              fontFamily: "var(--font-montserrat)", fontSize: "1rem", lineHeight: 1.8,
              color: "oklch(30% 0.008 260)",
            }}>
              Give your team a simple &ldquo;knowing rhythm&rdquo;: one meaningful question per meeting. Over time, it builds a foundation nothing else can.
            </p>
          </div>
        </div>
      </section>

      {/* ── QUESTION CARDS ── */}
      <section id="cards" style={{
        paddingBlock: "clamp(4rem, 7vw, 7rem)",
        background: sectionBg,
        transition: "background 0.35s ease",
      }}>
        <div className="container-wide">
          {/* Header */}
          <div style={{ marginBottom: "2.5rem" }}>
            <p style={{
              fontFamily: "var(--font-montserrat)", fontWeight: 700, fontSize: "0.65rem",
              letterSpacing: "0.18em", textTransform: "uppercase",
              color: "oklch(65% 0.15 45)", marginBottom: "0.875rem",
            }}>
              Closing Activity
            </p>
            <h2 style={{
              fontFamily: "var(--font-montserrat)", fontWeight: 800,
              fontSize: "clamp(1.5rem, 3vw, 2.25rem)", lineHeight: 1.15,
              color: textColor, marginBottom: "0.875rem",
              transition: "color 0.35s ease",
            }}>
              Question Cards
            </h2>
            <p style={{
              fontFamily: "var(--font-montserrat)", fontSize: "0.9375rem", lineHeight: 1.7,
              color: mutedColor, maxWidth: "60ch",
              transition: "color 0.35s ease",
            }}>
              24 questions arranged in three levels. Use one card per team meeting. Let the question sit. Don&rsquo;t rush the answer.
            </p>
          </div>

          {/* Level Tabs */}
          <div style={{
            display: "flex", gap: "2px", marginBottom: "2rem",
            background: isDark ? "oklch(16% 0.08 260)" : "oklch(88% 0.008 80)",
            padding: "3px", width: "fit-content",
          }}>
            {(["surface", "personal", "deep"] as Level[]).map((level) => {
              const c = LEVEL_CONFIG[level];
              const isActive = activeLevel === level;
              return (
                <button
                  key={level}
                  onClick={() => setActiveLevel(level)}
                  style={{
                    fontFamily: "var(--font-montserrat)", fontWeight: 700, fontSize: "0.7rem",
                    letterSpacing: "0.12em", textTransform: "uppercase",
                    padding: "0.5rem 1.25rem",
                    background: isActive ? c.tabActiveBg : "transparent",
                    color: isActive ? c.tabActiveColor : c.tabColor,
                    border: "none", cursor: "pointer",
                    transition: "all 0.2s ease",
                  }}
                >
                  {c.label}
                </button>
              );
            })}
          </div>

          {/* Level description + shuffle */}
          <div style={{
            display: "flex", alignItems: "center", justifyContent: "space-between",
            flexWrap: "wrap", gap: "1rem", marginBottom: "2rem",
          }}>
            <p style={{
              fontFamily: "var(--font-montserrat)", fontSize: "0.875rem", lineHeight: 1.6,
              color: mutedColor, maxWidth: "48ch",
              transition: "color 0.35s ease",
            }}>
              {cfg.description}
            </p>
            <button
              onClick={handleShuffle}
              style={{
                fontFamily: "var(--font-montserrat)", fontWeight: 700, fontSize: "0.72rem",
                letterSpacing: "0.1em", textTransform: "uppercase",
                padding: "0.5rem 1.125rem",
                background: "transparent",
                color: "oklch(65% 0.15 45)",
                border: "1.5px solid oklch(65% 0.15 45)",
                cursor: "pointer",
                transition: "all 0.15s ease",
                display: "flex", alignItems: "center", gap: "0.5rem",
              }}
            >
              ⇄ Shuffle
            </button>
          </div>

          {/* Cards Grid */}
          <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))",
            gap: "1.25rem",
            marginBottom: "2.5rem",
          }}>
            {cards.map((card, idx) => {
              const cardKey = `${card.level}-${idx}`;
              const isFlipped = flipped[cardKey];
              return (
                <button
                  key={cardKey}
                  onClick={() => setFlipped(prev => ({ ...prev, [cardKey]: !prev[cardKey] }))}
                  style={{
                    fontFamily: "var(--font-montserrat)",
                    background: cfg.cardBg,
                    border: `1px solid ${cfg.cardBorder}`,
                    padding: "1.75rem 1.5rem",
                    textAlign: "left",
                    cursor: "pointer",
                    minHeight: "160px",
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "space-between",
                    gap: "1rem",
                    transition: "transform 0.15s ease, box-shadow 0.15s ease",
                    position: "relative",
                    overflow: "hidden",
                  }}
                  onMouseEnter={e => {
                    (e.currentTarget as HTMLButtonElement).style.transform = "translateY(-2px)";
                    (e.currentTarget as HTMLButtonElement).style.boxShadow = "0 8px 24px oklch(10% 0.08 260 / 0.2)";
                  }}
                  onMouseLeave={e => {
                    (e.currentTarget as HTMLButtonElement).style.transform = "none";
                    (e.currentTarget as HTMLButtonElement).style.boxShadow = "none";
                  }}
                >
                  {/* Card number */}
                  <span style={{
                    fontWeight: 800, fontSize: "2.5rem", lineHeight: 1, opacity: 0.08,
                    color: activeLevel === "surface" ? "oklch(22% 0.08 260)" : "oklch(97% 0.005 80)",
                    position: "absolute", top: "0.75rem", right: "1rem",
                    pointerEvents: "none", userSelect: "none",
                  }}>
                    {String(idx + 1).padStart(2, "0")}
                  </span>

                  {/* Question */}
                  <p style={{
                    fontWeight: 600, fontSize: "0.9375rem", lineHeight: 1.6,
                    color: activeLevel === "surface" ? "oklch(22% 0.08 260)" : "oklch(92% 0.005 80)",
                    margin: 0,
                  }}>
                    &ldquo;{card.question}&rdquo;
                  </p>

                  {/* Level tag */}
                  <span style={{
                    display: "inline-flex", alignSelf: "flex-start",
                    fontWeight: 700, fontSize: "0.58rem", letterSpacing: "0.16em",
                    textTransform: "uppercase", padding: "0.2rem 0.5rem",
                    background: cfg.tagBg,
                    color: cfg.tagColor,
                  }}>
                    {cfg.label}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Prompt */}
          <div style={{
            background: isDark ? "oklch(28% 0.12 260)" : "oklch(22% 0.08 260)",
            padding: "1.5rem 2rem",
            display: "flex", alignItems: "center", gap: "1.25rem",
            flexWrap: "wrap",
          }}>
            <div style={{
              width: "3px", alignSelf: "stretch",
              background: "oklch(65% 0.15 45)", flexShrink: 0,
            }} />
            <p style={{
              fontFamily: "var(--font-montserrat)", fontSize: "0.9rem", lineHeight: 1.65,
              color: "oklch(88% 0.006 80)", margin: 0, flex: 1, minWidth: "200px",
            }}>
              <strong style={{ color: "oklch(97% 0.005 80)" }}>How to use these cards:</strong> Pick one question for your next team meeting. Give people time to think before answering. Model vulnerability by answering first yourself.
            </p>
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section style={{
        paddingBlock: "clamp(4rem, 7vw, 7rem)",
        background: "oklch(30% 0.12 260)",
        position: "relative",
      }}>
        <div style={{
          position: "absolute", left: "clamp(1.5rem, 5vw, 4rem)",
          top: "clamp(4rem, 7vw, 7rem)", bottom: "clamp(4rem, 7vw, 7rem)",
          width: "3px", background: "oklch(65% 0.15 45)",
        }} />
        <div className="container-wide" style={{ paddingLeft: "2.5rem" }}>
          <p style={{
            fontFamily: "var(--font-montserrat)", fontWeight: 700, fontSize: "0.65rem",
            letterSpacing: "0.18em", textTransform: "uppercase",
            color: "oklch(65% 0.15 45)", marginBottom: "0.875rem",
          }}>
            What&rsquo;s Next
          </p>
          <h2 style={{
            fontFamily: "var(--font-montserrat)", fontWeight: 800,
            fontSize: "clamp(1.5rem, 3vw, 2.25rem)", lineHeight: 1.15,
            color: "oklch(97% 0.005 80)", marginBottom: "1rem",
          }}>
            Continue the Team Pathway
          </h2>
          <p style={{
            fontFamily: "var(--font-montserrat)", fontSize: "0.9375rem", lineHeight: 1.7,
            color: "oklch(72% 0.04 260)", maxWidth: "52ch", marginBottom: "2rem",
          }}>
            Next up: how your team communicates — and why so much gets lost in translation even when everyone speaks the same language.
          </p>
          <Link href="/team/communication-culture" className="btn-primary">
            Module 4: Communication Culture →
          </Link>
        </div>
      </section>
    </>
  );
}

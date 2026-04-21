"use client";

import { useState } from "react";
import Link from "next/link";
import type { User } from "@supabase/supabase-js";

const REFLECTION_CARDS = [
  {
    id: 1,
    question: "What does belonging look like on your current team? How do you know when someone feels it — or doesn't?",
    deeper: "Have you ever been on a team where you didn't feel you truly belonged? What was missing?",
  },
  {
    id: 2,
    question: "What unspoken rules govern how your team functions? Are they written anywhere, or just assumed?",
    deeper: "Which team member is most likely to feel excluded by those unspoken rules?",
  },
  {
    id: 3,
    question: "When team members are in conflict or struggling, how quickly does your team notice? What does that tell you about your relational depth?",
    deeper: "What would need to change for your team to be more attuned to each other?",
  },
  {
    id: 4,
    question: "On a scale of 1–10, how much does your team actually know about each other's lives outside of work? What's preventing more?",
    deeper: "What's one concrete step you could take this week to deepen connection?",
  },
  {
    id: 5,
    question: "What cultural assumptions have you brought into your team that may not be universally shared?",
    deeper: "How do you create space for different cultural expressions of teamwork on your team?",
  },
];

export default function TeamFoundationsClient({ user }: { user: User | null }) {
  const [flippedCards, setFlippedCards] = useState<Set<number>>(new Set());

  function toggleCard(id: number) {
    setFlippedCards(prev => {
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
        {/* Subtle top accent line */}
        <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: "3px", background: "oklch(65% 0.15 45)" }} />

        {/* Large decorative numeral */}
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
          01
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

          {/* Module badge */}
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
              Module 01
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
              Article · 15–20 min
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
            Team Foundations
          </h1>

          <p style={{
            fontFamily: "var(--font-montserrat)",
            fontSize: "clamp(1rem, 2vw, 1.1875rem)",
            color: "oklch(72% 0.04 260)",
            lineHeight: 1.7,
            maxWidth: "52ch",
            marginBottom: 0,
          }}>
            What separates a real team from a group of people who happen to work together — and why getting this right changes everything else.
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
            Two groups of people can meet every week, share the same office, and have the same manager — and still not be a team.
          </p>
          <p style={{
            fontFamily: "var(--font-montserrat)",
            fontSize: "1rem",
            lineHeight: 1.8,
            color: "oklch(38% 0.008 260)",
            marginBottom: "1.5rem",
          }}>
            This is one of the most uncomfortable truths in leadership. We assume that structure creates unity. That proximity builds trust. That a shared org chart means shared commitment. But it doesn't — not automatically, and not without intention.
          </p>
          <p style={{
            fontFamily: "var(--font-montserrat)",
            fontSize: "1rem",
            lineHeight: 1.8,
            color: "oklch(38% 0.008 260)",
          }}>
            Team foundations are not about processes or policies. They're about the invisible architecture that determines whether your people show up fully — or hold back. This module will help you understand what that architecture is, why it matters, and what your role is in building it.
          </p>
        </div>
      </section>

      {/* ── SECTION 1: Group vs. Team ── */}
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
            Group vs. Team: The Difference That Changes Everything
          </h2>

          <p style={{
            fontFamily: "var(--font-montserrat)",
            fontSize: "1rem",
            lineHeight: 1.8,
            color: "oklch(78% 0.03 260)",
            marginBottom: "1.5rem",
          }}>
            A group shares space. A team shares something deeper: a common commitment, mutual accountability, and a sense of <em style={{ color: "oklch(88% 0.04 260)" }}>"we."</em> The difference isn't organisational structure — it's relational and intentional.
          </p>
          <p style={{
            fontFamily: "var(--font-montserrat)",
            fontSize: "1rem",
            lineHeight: 1.8,
            color: "oklch(78% 0.03 260)",
            marginBottom: "1.5rem",
          }}>
            In a group, each person is primarily focused on their own contribution. They may cooperate when needed, but their default orientation is individual. In a team, people are genuinely invested in each other's success — not just their own. When one person struggles, others notice and respond. When the team wins, everyone owns it together.
          </p>
          <p style={{
            fontFamily: "var(--font-montserrat)",
            fontSize: "1rem",
            lineHeight: 1.8,
            color: "oklch(78% 0.03 260)",
            marginBottom: "2rem",
          }}>
            Research consistently shows that teams outperform groups of individuals on complex tasks — not because of superior talent, but because of trust and shared purpose. The cognitive and relational surplus of true teamwork is significant. But it doesn't appear automatically when you put people in the same room. It has to be built.
          </p>

          {/* Callout box */}
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
              <strong style={{ color: "oklch(97% 0.005 80)", fontWeight: 700 }}>The question to ask your team: </strong>
              Are we actually a team — or are we a group of individuals with the same job title? Be honest. Most teams, if they're truthful, will say "somewhere in between."
            </p>
          </div>
        </div>
      </section>

      {/* ── SECTION 2: What Foundations Actually Are ── */}
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
            What Foundations Actually Are
          </h2>

          <p style={{
            fontFamily: "var(--font-montserrat)",
            fontSize: "1rem",
            lineHeight: 1.8,
            color: "oklch(38% 0.008 260)",
            marginBottom: "1.5rem",
          }}>
            Foundations aren't rules or processes. They're not onboarding documents or team charters — though those can help express them. Foundations are the answers to three invisible questions that every team member carries, often without knowing it:
          </p>

          {/* Three questions */}
          <div style={{ display: "flex", flexDirection: "column", gap: "1px", marginBottom: "2rem" }}>
            {[
              {
                num: "01",
                question: '"Do I belong here?"',
                body: "Not just physically present, but genuinely welcome — valued for who I am, not just what I produce. Does this team have space for me?",
              },
              {
                num: "02",
                question: '"Do I matter here?"',
                body: "Does my contribution make a difference? Would anyone notice if I showed up with less than my best? Am I seen?",
              },
              {
                num: "03",
                question: '"Can I trust the people here?"',
                body: "Can I be honest without being punished? Can I disagree without being dismissed? Can I bring a problem without it being used against me?",
              },
            ].map(item => (
              <div key={item.num} style={{
                background: "oklch(95% 0.005 80)",
                padding: "1.75rem 2rem",
                display: "grid",
                gridTemplateColumns: "3rem 1fr",
                gap: "1.25rem",
                alignItems: "start",
              }}>
                <span style={{
                  fontFamily: "var(--font-montserrat)",
                  fontWeight: 800,
                  fontSize: "2rem",
                  color: "oklch(88% 0.008 80)",
                  lineHeight: 1,
                }}>
                  {item.num}
                </span>
                <div>
                  <p style={{
                    fontFamily: "var(--font-montserrat)",
                    fontWeight: 700,
                    fontSize: "1.0625rem",
                    color: "oklch(22% 0.08 260)",
                    marginBottom: "0.5rem",
                    fontStyle: "italic",
                  }}>
                    {item.question}
                  </p>
                  <p style={{
                    fontFamily: "var(--font-montserrat)",
                    fontSize: "0.9rem",
                    lineHeight: 1.7,
                    color: "oklch(42% 0.008 260)",
                    margin: 0,
                  }}>
                    {item.body}
                  </p>
                </div>
              </div>
            ))}
          </div>

          <p style={{
            fontFamily: "var(--font-montserrat)",
            fontSize: "1rem",
            lineHeight: 1.8,
            color: "oklch(38% 0.008 260)",
            marginBottom: "1.5rem",
          }}>
            When these questions go unanswered — or worse, when the answers are consistently "no" — people don't suddenly quit. They stay, but they protect themselves instead of contributing. They give 60% instead of everything. They speak carefully instead of honestly. They comply instead of creating.
          </p>
          <p style={{
            fontFamily: "var(--font-montserrat)",
            fontSize: "1rem",
            lineHeight: 1.8,
            color: "oklch(38% 0.008 260)",
          }}>
            This is why foundational work is not a soft extra — it's a prerequisite for everything else. You can have brilliant strategy, clear goals, and excellent tools. Without foundations, none of it will perform as it should.
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
            Biblical Grounding: Koinonia and the Sharpening Team
          </h2>

          <p style={{
            fontFamily: "var(--font-montserrat)",
            fontSize: "1rem",
            lineHeight: 1.8,
            color: "oklch(78% 0.03 260)",
            marginBottom: "1.5rem",
          }}>
            The earliest model of Christian community was not an institution — it was a team. The church in Acts 2 wasn't just a crowd gathered around a common cause. It was a people who "devoted themselves to one another." They met together regularly. They shared meals and resources. They bore each other's burdens. They celebrated together and mourned together.
          </p>
          <p style={{
            fontFamily: "var(--font-montserrat)",
            fontSize: "1rem",
            lineHeight: 1.8,
            color: "oklch(78% 0.03 260)",
            marginBottom: "2rem",
          }}>
            The Greek word at the heart of this community is <em style={{ color: "oklch(88% 0.04 260)", fontStyle: "italic" }}>koinonia</em> — often translated as "fellowship," but it carries far more weight than our casual use of the word. <em style={{ color: "oklch(88% 0.04 260)" }}>Koinonia</em> means shared life. Shared resources. Shared risk. It describes people who are genuinely invested in each other — who have something at stake in each other's wellbeing.
          </p>

          {/* Pull quote */}
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
              "As iron sharpens iron, so one person sharpens another."
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
              Proverbs 27:17
            </cite>
          </blockquote>

          <p style={{
            fontFamily: "var(--font-montserrat)",
            fontSize: "1rem",
            lineHeight: 1.8,
            color: "oklch(78% 0.03 260)",
            marginBottom: "1.5rem",
          }}>
            Sharpening is not a gentle process. Iron against iron creates friction, heat, and sparks. But it also creates something sharper, more precise, more useful. The implication is profound: growth comes from contact. You cannot be sharpened in isolation. You can only become more capable, more honest, more formed — through genuine encounter with others.
          </p>
          <p style={{
            fontFamily: "var(--font-montserrat)",
            fontSize: "1rem",
            lineHeight: 1.8,
            color: "oklch(78% 0.03 260)",
          }}>
            But here's what makes this verse so important for teams: the friction only produces sharpening if there is safety first. Without a foundation of trust, friction doesn't sharpen — it wounds. Without belonging, challenge doesn't grow people — it drives them away. The Acts 2 community was able to bear one another's burdens precisely because they had first built a community of shared life. Safety before sharpening. Foundation before formation.
          </p>
        </div>
      </section>

      {/* ── SECTION 4: Cross-Cultural Complexity ── */}
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
            Cross-Cultural Complexity: Why This Takes Longer
          </h2>

          <p style={{
            fontFamily: "var(--font-montserrat)",
            fontSize: "1rem",
            lineHeight: 1.8,
            color: "oklch(38% 0.008 260)",
            marginBottom: "1.5rem",
          }}>
            In multicultural teams, foundations take longer to build — and they're easier to break. This is not a failure of the people involved. It's a feature of what cross-cultural work actually is.
          </p>
          <p style={{
            fontFamily: "var(--font-montserrat)",
            fontSize: "1rem",
            lineHeight: 1.8,
            color: "oklch(38% 0.008 260)",
            marginBottom: "1.5rem",
          }}>
            What "belonging" looks like in one culture may feel intrusive or cold in another. A Dutch team member may experience belonging through direct, task-focused collaboration. An Indonesian team member may need relational warmth and social time before they feel genuinely included. Neither is wrong. Both are real. But if only one cultural default is honoured, someone will always be on the outside.
          </p>
          <p style={{
            fontFamily: "var(--font-montserrat)",
            fontSize: "1rem",
            lineHeight: 1.8,
            color: "oklch(38% 0.008 260)",
            marginBottom: "1.5rem",
          }}>
            The same applies to accountability. In high-context, honour-based cultures, direct public correction is experienced as deeply shaming — not just uncomfortable, but identity-damaging. In low-context cultures, it may be seen as simply efficient. These are not just stylistic preferences. They are deeply embedded frameworks for what it means to be treated with dignity.
          </p>

          {/* Callout */}
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
              The critical insight for multicultural team leaders:
            </p>
            <p style={{
              fontFamily: "var(--font-montserrat)",
              fontSize: "0.9rem",
              lineHeight: 1.7,
              color: "oklch(38% 0.008 260)",
              margin: 0,
            }}>
              Foundations must be built together, not imported from one cultural default. If the leader's culture becomes the team's unspoken norm, you haven't built a multicultural team — you've built a monocultural team with diverse faces. The goal is to surface assumptions, name them without shame, and build new shared agreements together.
            </p>
          </div>

          <p style={{
            fontFamily: "var(--font-montserrat)",
            fontSize: "1rem",
            lineHeight: 1.8,
            color: "oklch(38% 0.008 260)",
          }}>
            This process is slower. It requires more conversation, more patience, and more willingness to be surprised by how differently people experience the same environment. But the foundation you build this way will be far more durable — because it actually belongs to everyone on the team.
          </p>
        </div>
      </section>

      {/* ── SECTION 5: The Leader's Role ── */}
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
            The Leader's Role: Set the Floor, Not the Ceiling
          </h2>

          <p style={{
            fontFamily: "var(--font-montserrat)",
            fontSize: "1rem",
            lineHeight: 1.8,
            color: "oklch(78% 0.03 260)",
            marginBottom: "1.5rem",
          }}>
            Foundations are set by leaders — but they belong to the team. This distinction matters more than it might seem. A leader who tries to manufacture a team culture through top-down programmes and enforced norms will get compliance, not belonging. A leader who models the values they want to see, and creates structures for the team to build their own culture, gives something far more powerful: permission.
          </p>
          <p style={{
            fontFamily: "var(--font-montserrat)",
            fontSize: "1rem",
            lineHeight: 1.8,
            color: "oklch(78% 0.03 260)",
            marginBottom: "1.5rem",
          }}>
            Here's what leaders can do that no one else on the team can:
          </p>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: "1px", background: "oklch(22% 0.10 260 / 0.5)", marginBottom: "2rem" }}>
            {[
              {
                title: "Model Vulnerability",
                body: "When you acknowledge uncertainty, admit mistakes, and share your own struggles — without performing weakness — you signal that it's safe for others to do the same.",
              },
              {
                title: "Name Expectations Clearly",
                body: "Don't leave people guessing about how things work here. Make the implicit explicit — what behaviour is celebrated, what isn't acceptable, and how decisions get made.",
              },
              {
                title: "Create Rituals of Connection",
                body: "Regular moments — check-ins, shared meals, dedicated space to share beyond the task — aren't soft extras. They're how belonging gets built and maintained over time.",
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

          <p style={{
            fontFamily: "var(--font-montserrat)",
            fontSize: "1rem",
            lineHeight: 1.8,
            color: "oklch(78% 0.03 260)",
          }}>
            The goal isn't to be the team's therapist or best friend. It's to set a floor — a minimum standard of safety and dignity — that makes it possible for people to bring their best. Once that floor is set, the team will build the ceiling themselves.
          </p>
        </div>
      </section>

      {/* ── REFLECTION CARDS ── */}
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
            Closing Activity
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
            Reflection Questions
          </h2>
          <p style={{
            fontFamily: "var(--font-montserrat)",
            fontSize: "0.9375rem",
            lineHeight: 1.7,
            color: "oklch(48% 0.008 260)",
            marginBottom: "3rem",
            maxWidth: "56ch",
          }}>
            Take a moment with each card. Read the question, sit with it honestly, then tap to reveal a deeper prompt. These work best when you bring them to your team.
          </p>

          <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
            gap: "1.25rem",
          }}>
            {REFLECTION_CARDS.map(card => {
              const isFlipped = flippedCards.has(card.id);
              return (
                <div
                  key={card.id}
                  onClick={() => toggleCard(card.id)}
                  role="button"
                  tabIndex={0}
                  onKeyDown={e => e.key === "Enter" || e.key === " " ? toggleCard(card.id) : undefined}
                  style={{
                    background: isFlipped ? "oklch(22% 0.08 260)" : "oklch(95% 0.005 80)",
                    border: isFlipped ? "1px solid oklch(65% 0.15 45 / 0.3)" : "1px solid oklch(88% 0.008 80)",
                    padding: "1.75rem",
                    cursor: "pointer",
                    transition: "background 0.25s ease, border-color 0.25s ease",
                    display: "flex",
                    flexDirection: "column",
                    gap: "1rem",
                    minHeight: "200px",
                    position: "relative",
                  }}
                >
                  {/* Card number */}
                  <span style={{
                    fontFamily: "var(--font-montserrat)",
                    fontWeight: 800,
                    fontSize: "2rem",
                    color: isFlipped ? "oklch(65% 0.15 45 / 0.4)" : "oklch(88% 0.008 80)",
                    lineHeight: 1,
                    transition: "color 0.25s ease",
                  }}>
                    {String(card.id).padStart(2, "0")}
                  </span>

                  {!isFlipped ? (
                    <>
                      <p style={{
                        fontFamily: "var(--font-montserrat)",
                        fontWeight: 600,
                        fontSize: "0.9375rem",
                        lineHeight: 1.65,
                        color: "oklch(22% 0.08 260)",
                        flex: 1,
                        margin: 0,
                      }}>
                        {card.question}
                      </p>
                      <span style={{
                        fontFamily: "var(--font-montserrat)",
                        fontSize: "0.72rem",
                        fontWeight: 700,
                        letterSpacing: "0.1em",
                        textTransform: "uppercase",
                        color: "oklch(65% 0.15 45)",
                      }}>
                        Tap to go deeper →
                      </span>
                    </>
                  ) : (
                    <>
                      <div>
                        <p style={{
                          fontFamily: "var(--font-montserrat)",
                          fontSize: "0.72rem",
                          fontWeight: 700,
                          letterSpacing: "0.12em",
                          textTransform: "uppercase",
                          color: "oklch(65% 0.15 45)",
                          marginBottom: "0.625rem",
                        }}>
                          Going Deeper
                        </p>
                        <p style={{
                          fontFamily: "var(--font-montserrat)",
                          fontWeight: 500,
                          fontSize: "0.9375rem",
                          lineHeight: 1.7,
                          color: "oklch(82% 0.04 260)",
                          margin: 0,
                          fontStyle: "italic",
                        }}>
                          {card.deeper}
                        </p>
                      </div>
                      <span style={{
                        fontFamily: "var(--font-montserrat)",
                        fontSize: "0.72rem",
                        fontWeight: 700,
                        letterSpacing: "0.1em",
                        textTransform: "uppercase",
                        color: "oklch(55% 0.04 260)",
                      }}>
                        Tap to go back
                      </span>
                    </>
                  )}
                </div>
              );
            })}
          </div>

          <p style={{
            fontFamily: "var(--font-montserrat)",
            fontSize: "0.875rem",
            lineHeight: 1.7,
            color: "oklch(55% 0.008 260)",
            marginTop: "2.5rem",
            maxWidth: "52ch",
          }}>
            These questions are most powerful when discussed with your team — not just reflected on alone. Consider bringing 2–3 of them to your next team meeting.
          </p>
        </div>
      </section>

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
            What's Next
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
            You've laid the groundwork. Now define the destination.
          </h2>
          <p style={{
            fontFamily: "var(--font-montserrat)",
            fontSize: "0.9375rem",
            lineHeight: 1.75,
            color: "oklch(72% 0.04 260)",
            marginBottom: "2.5rem",
          }}>
            Module 2 takes everything you've just reflected on and puts it to work — helping your team articulate a shared purpose and vision that will hold you together when it gets hard.
          </p>
          <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap", alignItems: "center" }}>
            <Link
              href="/team/team-purpose-vision"
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
                transition: "opacity 0.15s ease",
              }}
            >
              Module 02: Team Purpose & Vision →
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

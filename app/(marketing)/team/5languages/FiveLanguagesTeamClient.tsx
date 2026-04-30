"use client";

import { useState, useTransition } from "react";
import { User } from "@supabase/supabase-js";
import { saveFiveLanguagesTeamResult } from "./actions";

// ── TYPES ─────────────────────────────────────────────────────────────────────

type ScoreKey = "A" | "B" | "C" | "D" | "E";
type Scores = { A: number; B: number; C: number; D: number; E: number };
type Pair = { a: ScoreKey; b: ScoreKey; textA: string; textB: string };

// ── LANGUAGE DATA ─────────────────────────────────────────────────────────────

const LANG_DATA: Record<ScoreKey, { name: string; color: string; colorLight: string }> = {
  A: {
    name: "Words of Affirmation",
    color: "oklch(72% 0.18 85)",
    colorLight: "oklch(96% 0.03 85)",
  },
  B: {
    name: "Quality Time",
    color: "oklch(62% 0.14 235)",
    colorLight: "oklch(95% 0.02 235)",
  },
  C: {
    name: "Acts of Service",
    color: "oklch(52% 0.14 150)",
    colorLight: "oklch(95% 0.02 150)",
  },
  D: {
    name: "Tangible Gifts",
    color: "oklch(68% 0.15 10)",
    colorLight: "oklch(96% 0.02 10)",
  },
  E: {
    name: "Appropriate Touch",
    color: "oklch(70% 0.16 65)",
    colorLight: "oklch(95% 0.03 65)",
  },
};

// ── RECEIVING PAIRS (Test 1) ───────────────────────────────────────────────────

const RECEIVING_PAIRS: Pair[] = [
  { a: "A", b: "B", textA: "It means a lot when my team leader publicly recognises my contribution after a long project.", textB: "It means a lot when my team leader sets aside unhurried time to hear how I am really doing." },
  { a: "A", b: "B", textA: "A handwritten thank-you note from a teammate stays with me for weeks.", textB: "An unhurried meal with a teammate stays with me for weeks." },
  { a: "A", b: "B", textA: "I feel valued when someone says specifically what they appreciate about my work.", textB: "I feel valued when someone gives me their full attention without checking their phone." },
  { a: "A", b: "B", textA: "Hearing a colleague say specifically what they appreciated about my work refreshes me.", textB: "Being given thirty unhurried minutes by a colleague refreshes me." },
  { a: "A", b: "C", textA: "Words of encouragement from a respected leader carry me through hard seasons.", textB: "Practical help with my workload carries me through hard seasons." },
  { a: "A", b: "C", textA: "I feel cared for when my pastor mentions me by name in a prayer of thanks.", textB: "I feel cared for when a teammate quietly does the task I had been dreading." },
  { a: "A", b: "C", textA: "After a difficult Sunday, I want to hear someone say, \"You did well today.\"", textB: "After a difficult Sunday, I want someone to bring me a cup of tea without my asking." },
  { a: "A", b: "C", textA: "Specific words of thanks after a difficult task land deepest.", textB: "Specific practical help after a difficult task lands deepest." },
  { a: "A", b: "D", textA: "A specific verbal commendation from my supervisor means more than a bonus.", textB: "A small thoughtful gift from my supervisor means more than a generic bonus." },
  { a: "A", b: "D", textA: "I keep encouraging emails in a folder I read on hard days.", textB: "I keep small gifts from teammates on my desk as reminders that I am loved." },
  { a: "A", b: "D", textA: "I feel valued when someone takes time to write what they appreciate about me.", textB: "I feel valued when someone brings me back a small token from their travels." },
  { a: "A", b: "D", textA: "I treasure thoughtfully written notes from teammates.", textB: "I treasure small thoughtful items teammates have given me." },
  { a: "A", b: "E", textA: "Words of affirmation from a leader stay in my mind for a long time.", textB: "A warm handshake or culturally-appropriate hand on the shoulder from a leader stays with me for a long time." },
  { a: "A", b: "E", textA: "When I have done well, I want to hear it said clearly.", textB: "When I have done well, I want a high-five or warm pat on the shoulder." },
  { a: "A", b: "E", textA: "I feel encouraged when a colleague tells me they noticed my effort.", textB: "I feel encouraged when a colleague greets me with a warm handshake or culturally-appropriate hug." },
  { a: "A", b: "E", textA: "Public verbal recognition lifts me.", textB: "A genuine handshake or culturally-appropriate hand on the shoulder lifts me." },
  { a: "B", b: "C", textA: "Time alone with a teammate to talk about life refuels me.", textB: "A teammate stepping in to cover my responsibilities refuels me." },
  { a: "B", b: "C", textA: "I feel cared for when my supervisor walks slowly with me to the next meeting.", textB: "I feel cared for when my supervisor sets up the meeting room without my asking." },
  { a: "B", b: "C", textA: "Long conversations with my mentor are what I value most.", textB: "When my mentor takes a difficult task off my plate, I feel valued most." },
  { a: "B", b: "C", textA: "An afternoon walk with a friend talking about life is the best gift.", textB: "An afternoon where a friend handles my tasks while I rest is the best gift." },
  { a: "B", b: "D", textA: "An hour of focused conversation means more to me than any gift.", textB: "A thoughtfully chosen gift means more to me than a rushed conversation." },
  { a: "B", b: "D", textA: "I feel known when my teammate remembers something I said three months ago.", textB: "I feel known when my teammate brings me something they specifically thought of for me." },
  { a: "B", b: "D", textA: "Quality time over coffee changes my week.", textB: "A small surprise on my desk changes my week." },
  { a: "B", b: "D", textA: "I feel cared for when a teammate makes time to listen carefully.", textB: "I feel cared for when a teammate gives me something they specifically chose for me." },
  { a: "B", b: "E", textA: "Sitting quietly with a friend after hard news matters more than words.", textB: "An arm around my shoulder after hard news matters more than words." },
  { a: "B", b: "E", textA: "Long unhurried conversations are how I feel close to my team.", textB: "Warm physical greetings (handshakes, side-hugs) are how I feel close to my team." },
  { a: "B", b: "E", textA: "I feel most loved when someone gives me their unrushed attention.", textB: "I feel most loved when someone offers a warm greeting or hand on the shoulder." },
  { a: "B", b: "E", textA: "Long focused conversation is how I feel close to my mentor.", textB: "A warm greeting or culturally-appropriate hug is how I feel close to my mentor." },
  { a: "C", b: "D", textA: "Acts of practical help mean more to me than most gifts.", textB: "Thoughtful gifts mean more to me than most acts of help." },
  { a: "C", b: "D", textA: "When someone helps me without being asked, I feel deeply seen.", textB: "When someone gives me something specific to my interests, I feel deeply seen." },
  { a: "C", b: "D", textA: "If I am exhausted, what I want most is someone to take a task off me.", textB: "If I am exhausted, what I want most is a small comforting gift." },
  { a: "C", b: "D", textA: "When I am sick, what helps most is a teammate covering my work.", textB: "When I am sick, what helps most is a small comforting gift (food, flowers, a card)." },
  { a: "C", b: "E", textA: "Practical help is the clearest way someone can show they care.", textB: "Appropriate physical warmth (handshake, hand on shoulder, hug) is the clearest way someone can show they care." },
  { a: "C", b: "E", textA: "I feel my pastor cares when he visits and helps with the practical preparations.", textB: "I feel my pastor cares when he greets me warmly with a hand on the shoulder." },
  { a: "C", b: "E", textA: "Service done quietly speaks louder than any other gesture.", textB: "A warm physical greeting speaks louder than most words." },
  { a: "C", b: "E", textA: "Quiet practical help shows me real love.", textB: "Warm physical greeting (handshake, side-hug, hand on shoulder) shows me real love." },
  { a: "D", b: "E", textA: "A small thoughtful gift speaks volumes about how a teammate sees me.", textB: "A warm physical greeting speaks volumes about how a teammate sees me." },
  { a: "D", b: "E", textA: "Bringing me back a small token from a trip means a lot.", textB: "Greeting me with a hug or warm handshake when you return from a trip means a lot." },
  { a: "D", b: "E", textA: "Receiving a thoughtful gift surprises me with joy.", textB: "Receiving a warm physical greeting surprises me with joy." },
  { a: "D", b: "E", textA: "A small gift remembered from a previous conversation is the deepest care.", textB: "A warm hug after a long absence is the deepest care." },
];

// ── GIVING PAIRS (Test 2) ──────────────────────────────────────────────────────

const GIVING_PAIRS: Pair[] = [
  { a: "A", b: "B", textA: "When a teammate has done well, I send them a specific written affirmation.", textB: "When a teammate has done well, I take them out for an unhurried meal." },
  { a: "A", b: "B", textA: "My first instinct when someone is discouraged is to speak words of encouragement.", textB: "My first instinct when someone is discouraged is to sit with them and listen." },
  { a: "A", b: "B", textA: "I show appreciation by saying specifically what I value about a person.", textB: "I show appreciation by clearing my schedule to spend time with them." },
  { a: "A", b: "B", textA: "I check in with teammates by sending an encouraging message.", textB: "I check in with teammates by setting up a coffee meeting." },
  { a: "A", b: "C", textA: "When a colleague is struggling, I write them a specific note of encouragement.", textB: "When a colleague is struggling, I take a task off their plate without being asked." },
  { a: "A", b: "C", textA: "My way to thank someone is words.", textB: "My way to thank someone is action." },
  { a: "A", b: "C", textA: "When I want to encourage a junior team member, I tell them specifically what I see in them.", textB: "When I want to encourage a junior team member, I make their work easier in a practical way." },
  { a: "A", b: "C", textA: "I express my appreciation through carefully chosen words.", textB: "I express my appreciation through carefully chosen acts." },
  { a: "A", b: "D", textA: "I express care through carefully chosen words.", textB: "I express care through carefully chosen gifts." },
  { a: "A", b: "D", textA: "On a teammate's birthday, I write them a heartfelt message.", textB: "On a teammate's birthday, I bring them something I know they will love." },
  { a: "A", b: "D", textA: "When I want to bless someone, my first thought is what to say.", textB: "When I want to bless someone, my first thought is what to give." },
  { a: "A", b: "D", textA: "When I want to honour a teammate publicly, I speak about what they have contributed.", textB: "When I want to honour a teammate publicly, I give them something meaningful." },
  { a: "A", b: "E", textA: "I greet teammates with verbal warmth — naming them, asking how they are.", textB: "I greet teammates with physical warmth — handshake, hand on shoulder, culturally-appropriate hug." },
  { a: "A", b: "E", textA: "When a teammate has had a hard week, I tell them I am proud of them.", textB: "When a teammate has had a hard week, I greet them with a warm physical gesture." },
  { a: "A", b: "E", textA: "After a meaningful conversation I say what I appreciated about it.", textB: "After a meaningful conversation I express warmth physically (handshake, pat on the back)." },
  { a: "A", b: "E", textA: "My natural way to greet someone I respect is to name what I appreciate about them.", textB: "My natural way to greet someone I respect is a warm handshake or culturally-appropriate hug." },
  { a: "B", b: "C", textA: "I show care by giving someone my full unhurried attention.", textB: "I show care by quietly doing something that helps them." },
  { a: "B", b: "C", textA: "I prioritise long unhurried meetings with my team.", textB: "I prioritise removing obstacles from my team's work." },
  { a: "B", b: "C", textA: "When a teammate is struggling, I make time to be present with them.", textB: "When a teammate is struggling, I make their work easier in practical ways." },
  { a: "B", b: "C", textA: "I am the person who makes time for the team member who needs to talk.", textB: "I am the person who quietly handles what needs to be done." },
  { a: "B", b: "D", textA: "When I want to honour someone, I clear my calendar for them.", textB: "When I want to honour someone, I bring them a thoughtful gift." },
  { a: "B", b: "D", textA: "I express care through unhurried presence.", textB: "I express care through thoughtful gifts." },
  { a: "B", b: "D", textA: "On a teammate's anniversary, I take them for an extended coffee.", textB: "On a teammate's anniversary, I give them something meaningful." },
  { a: "B", b: "D", textA: "I tell teammates I love them by being present with them.", textB: "I tell teammates I love them by giving them something meaningful." },
  { a: "B", b: "E", textA: "I sit with people in their silence.", textB: "I greet people with warmth in my body — a hand on the shoulder, a hug, a firm handshake." },
  { a: "B", b: "E", textA: "When someone is grieving, I sit with them quietly.", textB: "When someone is grieving, I put my arm around them." },
  { a: "B", b: "E", textA: "I express friendship through long conversations.", textB: "I express friendship through warm physical greeting." },
  { a: "B", b: "E", textA: "I make time for slow conversations.", textB: "I make time for warm physical greeting." },
  { a: "C", b: "D", textA: "I show love by doing things for people.", textB: "I show love by giving things to people." },
  { a: "C", b: "D", textA: "When I want to bless someone, I find a practical way to help them.", textB: "When I want to bless someone, I find a meaningful gift to give them." },
  { a: "C", b: "D", textA: "After a teammate's hard week, I bring them a meal I cooked.", textB: "After a teammate's hard week, I bring them a small thoughtful gift." },
  { a: "C", b: "D", textA: "I demonstrate love by serving.", textB: "I demonstrate love by giving." },
  { a: "C", b: "E", textA: "I show care through practical action.", textB: "I show care through warm physical presence." },
  { a: "C", b: "E", textA: "When a teammate needs encouragement, I quietly help with their work.", textB: "When a teammate needs encouragement, I greet them with warm physical gesture." },
  { a: "C", b: "E", textA: "I prefer to express love by doing.", textB: "I prefer to express love by being physically warm and present." },
  { a: "C", b: "E", textA: "I show care by stepping in to help when no one asks.", textB: "I show care by warm physical presence and greeting." },
  { a: "D", b: "E", textA: "I bring small thoughtful gifts when I see teammates after time apart.", textB: "I greet teammates with warm physical gesture when I see them after time apart." },
  { a: "D", b: "E", textA: "I tend to show care by giving something tangible.", textB: "I tend to show care by warm physical greeting." },
  { a: "D", b: "E", textA: "When honouring someone, I give them something specific.", textB: "When honouring someone, I greet them with culturally-appropriate physical warmth." },
  { a: "D", b: "E", textA: "I love through giving thoughtful gifts.", textB: "I love through physical warmth and welcoming presence." },
];

// ── SCORING HELPERS ───────────────────────────────────────────────────────────

function getPrimary(scores: Scores): ScoreKey {
  return (Object.entries(scores) as [ScoreKey, number][])
    .sort((a, b) => b[1] - a[1])[0][0];
}

// ── MAIN COMPONENT ────────────────────────────────────────────────────────────

export default function FiveLanguagesTeamClient({ user }: { user: User | null }) {
  const [quizState, setQuizState] = useState<"intro" | "test1" | "transition" | "test2" | "done">("intro");
  const [currentPair, setCurrentPair] = useState(0);
  const [receivingScores, setReceivingScores] = useState<Scores>({ A: 0, B: 0, C: 0, D: 0, E: 0 });
  const [givingScores, setGivingScores] = useState<Scores>({ A: 0, B: 0, C: 0, D: 0, E: 0 });
  const [saved, setSaved] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);
  const [isSaving, startSaving] = useTransition();

  const transitionPrimary = getPrimary(receivingScores);

  // Overall progress: test1 = 1–40, test2 = 41–80
  const overallProgress =
    quizState === "intro" ? 0
    : quizState === "test1" ? currentPair + 1
    : quizState === "transition" ? 40
    : quizState === "test2" ? 40 + currentPair + 1
    : 80;

  function handleAnswer(key: ScoreKey, test: "receiving" | "giving") {
    if (test === "receiving") {
      const newScores = { ...receivingScores, [key]: receivingScores[key] + 1 };
      setReceivingScores(newScores);
      if (currentPair < 39) {
        setCurrentPair(currentPair + 1);
      } else {
        setCurrentPair(0);
        setQuizState("transition");
      }
    } else {
      const newScores = { ...givingScores, [key]: givingScores[key] + 1 };
      setGivingScores(newScores);
      if (currentPair < 39) {
        setCurrentPair(currentPair + 1);
      } else {
        setQuizState("done");
      }
    }
  }

  function handleSave() {
    startSaving(async () => {
      const rP = getPrimary(receivingScores);
      const gP = getPrimary(givingScores);
      const toPercents = (s: Scores) => ({
        A: Math.round((s.A / 40) * 100),
        B: Math.round((s.B / 40) * 100),
        C: Math.round((s.C / 40) * 100),
        D: Math.round((s.D / 40) * 100),
        E: Math.round((s.E / 40) * 100),
      });
      const result = await saveFiveLanguagesTeamResult(rP, gP, toPercents(receivingScores), toPercents(givingScores));
      if (result.error) {
        setSaveError("Could not save — please try again.");
      } else {
        setSaved(true);
        setSaveError(null);
      }
    });
  }

  function retake() {
    setQuizState("intro");
    setCurrentPair(0);
    setReceivingScores({ A: 0, B: 0, C: 0, D: 0, E: 0 });
    setGivingScores({ A: 0, B: 0, C: 0, D: 0, E: 0 });
    setSaved(false);
    setSaveError(null);
  }

  // ── INTRO ──────────────────────────────────────────────────────────────────
  if (quizState === "intro") {
    return (
      <div style={{ background: "oklch(14% 0.07 260)", minHeight: "60vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <div style={{ maxWidth: "560px", padding: "clamp(2rem, 4vw, 3rem) 1.5rem", textAlign: "center" }}>
          <p style={{
            fontSize: "12px",
            fontWeight: 700,
            letterSpacing: "0.12em",
            textTransform: "uppercase",
            color: "oklch(65% 0.15 45)",
            marginBottom: "1rem",
          }}>
            Team Assessment
          </p>
          <h1 style={{
            fontFamily: "Cormorant Garamond, serif",
            fontSize: "clamp(30px, 4vw, 46px)",
            fontWeight: 600,
            color: "oklch(97% 0.005 80)",
            lineHeight: 1.1,
            marginBottom: "1rem",
          }}>
            5 Languages of Appreciation
          </h1>
          <p style={{
            fontSize: "clamp(14px, 1.5vw, 16px)",
            color: "oklch(72% 0.05 260)",
            lineHeight: 1.7,
            marginBottom: "0.75rem",
          }}>
            Two tests. 80 forced-choice pairs. Test 1 reveals how you receive care. Test 2 reveals how you give it. Your results are shared directly with your team dashboard.
          </p>
          <p style={{
            fontSize: "14px",
            color: "oklch(60% 0.05 260)",
            lineHeight: 1.6,
            marginBottom: "2rem",
          }}>
            Answer honestly — choose what is most true, not what you wish were true.
          </p>

          {!user && (
            <div style={{
              background: "oklch(30% 0.09 50)",
              border: "1px solid oklch(65% 0.15 45)",
              borderRadius: "8px",
              padding: "0.875rem 1rem",
              marginBottom: "1.5rem",
              fontSize: "14px",
              color: "oklch(90% 0.05 80)",
              lineHeight: 1.55,
            }}>
              You are not logged in. You can take the quiz, but your results will not be saved to the team dashboard.
            </div>
          )}

          <button
            type="button"
            onClick={() => setQuizState("test1")}
            style={{
              background: "oklch(65% 0.15 45)",
              color: "oklch(97% 0.005 80)",
              border: "none",
              borderRadius: "8px",
              padding: "14px 36px",
              fontSize: "16px",
              fontWeight: 700,
              cursor: "pointer",
              letterSpacing: "0.02em",
              transition: "opacity 0.15s ease",
            }}
            onMouseEnter={(e) => (e.currentTarget.style.opacity = "0.88")}
            onMouseLeave={(e) => (e.currentTarget.style.opacity = "1")}
          >
            Begin Test 1
          </button>
          <p style={{ marginTop: "0.75rem", fontSize: "13px", color: "oklch(50% 0.05 260)" }}>
            Test 1 of 2 · 40 pairs · ~8 min &nbsp;|&nbsp; Test 2 of 2 · 40 pairs · ~8 min
          </p>
        </div>
      </div>
    );
  }

  // ── TEST 1 ─────────────────────────────────────────────────────────────────
  if (quizState === "test1") {
    const pair = RECEIVING_PAIRS[currentPair];
    return (
      <div style={{ background: "oklch(14% 0.07 260)", minHeight: "100vh" }}>
        {/* Progress bar */}
        <div style={{ height: "3px", background: "oklch(25% 0.07 260)" }}>
          <div style={{
            height: "100%",
            width: `${(overallProgress / 80) * 100}%`,
            background: LANG_DATA[pair.a].color,
            transition: "width 0.3s ease",
          }} />
        </div>

        <div className="container-wide" style={{ maxWidth: "680px", margin: "0 auto", padding: "clamp(2rem, 4vw, 4rem) 1.5rem" }}>
          <div style={{ marginBottom: "2rem" }}>
            <p style={{
              fontSize: "12px",
              fontWeight: 700,
              letterSpacing: "0.1em",
              textTransform: "uppercase",
              color: "oklch(65% 0.15 45)",
              marginBottom: "0.5rem",
            }}>
              Test 1 — How you receive care
            </p>
            <p style={{ fontSize: "14px", color: "oklch(60% 0.05 260)" }}>
              Pair {currentPair + 1} of 40 &nbsp;·&nbsp; Choose the statement that feels most true for you
            </p>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
            {[
              { key: pair.a, text: pair.textA },
              { key: pair.b, text: pair.textB },
            ].map(({ key, text }) => (
              <button
                type="button"
                key={key}
                onClick={() => handleAnswer(key as ScoreKey, "receiving")}
                style={{
                  width: "100%",
                  textAlign: "left",
                  padding: "clamp(1rem, 2vw, 1.5rem)",
                  background: "oklch(22% 0.10 260)",
                  border: "1px solid oklch(32% 0.08 260)",
                  borderRadius: "12px",
                  color: "oklch(92% 0.01 80)",
                  fontSize: "clamp(14px, 1.5vw, 16px)",
                  lineHeight: 1.65,
                  cursor: "pointer",
                  transition: "border-color 0.15s ease, background 0.15s ease",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = LANG_DATA[key as ScoreKey].color;
                  e.currentTarget.style.background = "oklch(26% 0.09 260)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = "oklch(32% 0.08 260)";
                  e.currentTarget.style.background = "oklch(22% 0.10 260)";
                }}
              >
                {text}
              </button>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // ── TRANSITION ─────────────────────────────────────────────────────────────
  if (quizState === "transition") {
    return (
      <div style={{
        background: "oklch(14% 0.07 260)",
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}>
        <div style={{ maxWidth: "520px", padding: "2rem", textAlign: "center" }}>
          <div style={{
            width: "64px",
            height: "64px",
            borderRadius: "50%",
            background: `${LANG_DATA[transitionPrimary].color}20`,
            border: `2px solid ${LANG_DATA[transitionPrimary].color}`,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            margin: "0 auto 1.5rem",
          }}>
            <span style={{ fontSize: "24px", fontWeight: 800, color: LANG_DATA[transitionPrimary].color }}>1</span>
          </div>
          <p style={{
            fontSize: "12px",
            fontWeight: 700,
            letterSpacing: "0.12em",
            textTransform: "uppercase",
            color: "oklch(65% 0.15 45)",
            marginBottom: "1rem",
          }}>Test 1 complete</p>
          <h2 style={{
            fontFamily: "Cormorant Garamond, serif",
            fontSize: "clamp(28px, 4vw, 40px)",
            fontWeight: 600,
            color: "oklch(97% 0.005 80)",
            marginBottom: "1rem",
            lineHeight: 1.2,
          }}>
            {LANG_DATA[transitionPrimary].name} is leading
          </h2>
          <p style={{
            fontSize: "16px",
            color: "oklch(72% 0.05 260)",
            lineHeight: 1.65,
            marginBottom: "2rem",
          }}>
            Now Test 2: how you give care. Answer what you actually do — not what you wish you did.
          </p>
          <button
            type="button"
            onClick={() => setQuizState("test2")}
            style={{
              background: "oklch(65% 0.15 45)",
              color: "oklch(97% 0.005 80)",
              border: "none",
              borderRadius: "8px",
              padding: "14px 36px",
              fontSize: "16px",
              fontWeight: 700,
              cursor: "pointer",
              letterSpacing: "0.02em",
              transition: "opacity 0.15s ease",
            }}
            onMouseEnter={(e) => (e.currentTarget.style.opacity = "0.88")}
            onMouseLeave={(e) => (e.currentTarget.style.opacity = "1")}
          >
            Begin Test 2
          </button>
        </div>
      </div>
    );
  }

  // ── TEST 2 ─────────────────────────────────────────────────────────────────
  if (quizState === "test2") {
    const pair = GIVING_PAIRS[currentPair];
    const showHonestyBanner = currentPair === 14;
    return (
      <div style={{ background: "oklch(14% 0.07 260)", minHeight: "100vh" }}>
        {/* Progress bar */}
        <div style={{ height: "3px", background: "oklch(25% 0.07 260)" }}>
          <div style={{
            height: "100%",
            width: `${(overallProgress / 80) * 100}%`,
            background: LANG_DATA[pair.a].color,
            transition: "width 0.3s ease",
          }} />
        </div>

        <div className="container-wide" style={{ maxWidth: "680px", margin: "0 auto", padding: "clamp(2rem, 4vw, 4rem) 1.5rem" }}>
          <div style={{ marginBottom: "2rem" }}>
            <p style={{
              fontSize: "12px",
              fontWeight: 700,
              letterSpacing: "0.1em",
              textTransform: "uppercase",
              color: "oklch(65% 0.15 45)",
              marginBottom: "0.5rem",
            }}>
              Test 2 — How you give care
            </p>
            <p style={{ fontSize: "14px", color: "oklch(60% 0.05 260)" }}>
              Pair {currentPair + 41} of 80 &nbsp;·&nbsp; Choose what you actually do, not what you wish you did
            </p>
          </div>

          {showHonestyBanner && (
            <div style={{
              background: "oklch(30% 0.09 50)",
              border: "1px solid oklch(65% 0.15 45)",
              borderRadius: "8px",
              padding: "0.875rem 1rem",
              marginBottom: "1.5rem",
              fontSize: "14px",
              color: "oklch(90% 0.05 80)",
              lineHeight: 1.55,
            }}>
              Halfway through. Are you choosing what you <em>actually do</em> — or what you wish you did? Adjust if needed.
            </div>
          )}

          <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
            {[
              { key: pair.a, text: pair.textA },
              { key: pair.b, text: pair.textB },
            ].map(({ key, text }) => (
              <button
                type="button"
                key={key}
                onClick={() => handleAnswer(key as ScoreKey, "giving")}
                style={{
                  width: "100%",
                  textAlign: "left",
                  padding: "clamp(1rem, 2vw, 1.5rem)",
                  background: "oklch(22% 0.10 260)",
                  border: "1px solid oklch(32% 0.08 260)",
                  borderRadius: "12px",
                  color: "oklch(92% 0.01 80)",
                  fontSize: "clamp(14px, 1.5vw, 16px)",
                  lineHeight: 1.65,
                  cursor: "pointer",
                  transition: "border-color 0.15s ease, background 0.15s ease",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = LANG_DATA[key as ScoreKey].color;
                  e.currentTarget.style.background = "oklch(26% 0.09 260)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = "oklch(32% 0.08 260)";
                  e.currentTarget.style.background = "oklch(22% 0.10 260)";
                }}
              >
                {text}
              </button>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // ── DONE ───────────────────────────────────────────────────────────────────
  const rPrimary = getPrimary(receivingScores);
  const gPrimary = getPrimary(givingScores);
  const rLang = LANG_DATA[rPrimary];
  const gLang = LANG_DATA[gPrimary];

  return (
    <div>
      {/* Results hero */}
      <section style={{
        background: "oklch(22% 0.10 260)",
        paddingTop: "clamp(2.5rem, 4vw, 4rem)",
        paddingBottom: "clamp(2.5rem, 4vw, 4rem)",
        position: "relative",
        overflow: "hidden",
      }}>
        <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: "3px", background: "oklch(65% 0.15 45)" }} />
        <div className="container-wide" style={{ position: "relative" }}>
          <p style={{
            color: "oklch(65% 0.15 45)",
            fontSize: 12,
            fontWeight: 700,
            letterSpacing: "0.12em",
            textTransform: "uppercase",
            marginBottom: 20,
          }}>
            Your Results · 5 Languages of Appreciation
          </p>

          <div style={{
            display: "flex",
            flexWrap: "wrap",
            gap: "2rem",
            alignItems: "flex-start",
          }}>
            {/* Receiving primary */}
            <div>
              <p style={{ color: "oklch(60% 0.05 260)", fontSize: "12px", fontWeight: 600, letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: "0.4rem" }}>Receiving</p>
              <h2 style={{
                fontFamily: "Cormorant Garamond, serif",
                fontSize: "clamp(28px, 4vw, 44px)",
                fontWeight: 600,
                color: rLang.color,
                lineHeight: 1.1,
              }}>
                {rLang.name}
              </h2>
            </div>
            {/* Giving primary */}
            <div>
              <p style={{ color: "oklch(60% 0.05 260)", fontSize: "12px", fontWeight: 600, letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: "0.4rem" }}>Giving</p>
              <h2 style={{
                fontFamily: "Cormorant Garamond, serif",
                fontSize: "clamp(28px, 4vw, 44px)",
                fontWeight: 600,
                color: gLang.color,
                lineHeight: 1.1,
              }}>
                {gLang.name}
              </h2>
            </div>
          </div>
        </div>
      </section>

      {/* Language chips */}
      <section style={{ background: "oklch(97% 0.005 80)", padding: "clamp(1.5rem, 3vw, 2.5rem) 0" }}>
        <div className="container-wide" style={{ maxWidth: "640px" }}>
          <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap", marginBottom: "1.5rem" }}>
            {([rPrimary, ...(rPrimary !== gPrimary ? [gPrimary] : [])] as ScoreKey[]).map((k) => (
              <span key={k} style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "0.5rem",
                padding: "6px 14px",
                borderRadius: "20px",
                background: LANG_DATA[k].colorLight,
                border: `1px solid ${LANG_DATA[k].color}60`,
                fontSize: "13px",
                fontWeight: 600,
                color: "oklch(22% 0.10 260)",
              }}>
                <span style={{
                  width: "8px",
                  height: "8px",
                  borderRadius: "50%",
                  background: LANG_DATA[k].color,
                  flexShrink: 0,
                }} />
                {LANG_DATA[k].name}
              </span>
            ))}
          </div>

          {/* Save to team dashboard */}
          {!saved ? (
            <div>
              <button
                type="button"
                onClick={handleSave}
                disabled={isSaving || !user}
                style={{
                  background: "oklch(65% 0.15 45)",
                  color: "oklch(97% 0.005 80)",
                  border: "none",
                  borderRadius: "8px",
                  padding: "12px 28px",
                  fontSize: "15px",
                  fontWeight: 700,
                  cursor: isSaving || !user ? "not-allowed" : "pointer",
                  opacity: isSaving || !user ? 0.6 : 1,
                  transition: "opacity 0.15s ease",
                }}
              >
                {isSaving ? "Saving..." : "Save to team dashboard"}
              </button>
              {!user && (
                <p style={{ fontSize: "13px", color: "oklch(50% 0.06 260)", marginTop: "0.5rem" }}>
                  Log in to save your result to the team dashboard.
                </p>
              )}
              {saveError && (
                <p style={{ color: "oklch(55% 0.20 25)", fontSize: "0.875rem", marginTop: "0.5rem" }}>
                  {saveError}
                </p>
              )}
            </div>
          ) : (
            <span style={{
              fontSize: "14px",
              color: "oklch(52% 0.14 150)",
              fontWeight: 600,
            }}>
              Saved to team dashboard
            </span>
          )}

          <div style={{ marginTop: "1.5rem" }}>
            <button
              type="button"
              onClick={retake}
              style={{
                background: "transparent",
                color: "oklch(45% 0.06 260)",
                border: "1px solid oklch(75% 0.04 260)",
                borderRadius: "8px",
                padding: "10px 24px",
                fontSize: "14px",
                fontWeight: 600,
                cursor: "pointer",
                transition: "border-color 0.15s ease, color 0.15s ease",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = "oklch(65% 0.15 45)";
                e.currentTarget.style.color = "oklch(22% 0.10 260)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = "oklch(75% 0.04 260)";
                e.currentTarget.style.color = "oklch(45% 0.06 260)";
              }}
            >
              Retake
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}

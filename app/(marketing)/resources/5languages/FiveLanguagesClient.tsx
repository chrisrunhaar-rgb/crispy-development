"use client";

import { useState, useTransition } from "react";
import { saveResourceToDashboard, saveFiveLanguagesResult } from "../actions";

// ── TYPES ─────────────────────────────────────────────────────────────────────

type ScoreKey = "A" | "B" | "C" | "D" | "E";
type Scores = { A: number; B: number; C: number; D: number; E: number };
type Pair = { a: ScoreKey; b: ScoreKey; textA: string; textB: string };

// ── LANGUAGE DATA ─────────────────────────────────────────────────────────────

const LANG_DATA: Record<ScoreKey, {
  name: string;
  color: string;
  colorLight: string;
  desc: string;
  notMeans: string;
  crossCultural: string;
  biblical: string;
  biblicalAnchor: string;
}> = {
  A: {
    name: "Words of Affirmation",
    color: "oklch(72% 0.18 85)",
    colorLight: "oklch(96% 0.03 85)",
    desc: "You feel cared for when people speak specific, genuine appreciation. A well-timed sentence can carry you through a hard season. Vague praise lands less than a specific word that shows someone truly saw your work.",
    notMeans: "This does not mean you need constant flattery. You want honesty — a word that is true, specific, and delivered at the moment it matters.",
    crossCultural: "Words of Affirmation lands well in low-context cultures but can feel performative in high-context Asian cultures where indirect communication is the norm. Learn the local vocabulary of appreciation.",
    biblical: "Barnabas means \"Son of Encouragement.\" He vouched for Saul when no one trusted him (Acts 9:27), saw potential in John Mark when Paul wrote him off (Acts 15:36–39), and built confidence in believers across the early church (Acts 11:23). His primary love language was words — spoken at the moment they were most needed, naming what others could not yet see. Words-of-Affirmation leaders learn from Barnabas: a sentence delivered well at the right moment can change a person's whole trajectory.",
    biblicalAnchor: "Barnabas — Acts 9:27",
  },
  B: {
    name: "Quality Time",
    color: "oklch(62% 0.14 235)",
    colorLight: "oklch(95% 0.02 235)",
    desc: "You feel cared for when someone gives you their full, unhurried attention. A distracted hour is worth less than thirty focused minutes. Presence is the currency — being there without checking the phone, without the next meeting already pulling you away.",
    notMeans: "This does not mean you need endless time with people. You need full attention during the time that is given — quality over quantity.",
    crossCultural: "Quality Time looks different where time itself is structured differently. Long unhurried meals are deep care in Indonesia, where the same meeting might feel inefficient in Germany. Learn what 'unhurried' means in each context.",
    biblical: "Jesus could have trained the twelve through teaching alone, but the gospels show him doing something different. He ate with them, walked with them on long roads, slept in the same boat, asked them what they were arguing about, withdrew with the inner circle to mountains and gardens. The training happened through the time. Quality-Time leaders learn from Jesus: presence is the curriculum. A team that has been with you remembers far more than a team that has only been taught by you.",
    biblicalAnchor: "Jesus with the Twelve — Mark 3:14",
  },
  C: {
    name: "Acts of Service",
    color: "oklch(52% 0.14 150)",
    colorLight: "oklch(95% 0.02 150)",
    desc: "You feel cared for when someone does something practical to help you — without being asked. A teammate who notices what you are carrying and steps in without waiting for a request speaks directly to you. The action says: I see you, and I act on it.",
    notMeans: "This does not mean you want people to do your job. You want voluntary, specific service — help that shows awareness of your actual situation, not generic task-taking.",
    crossCultural: "Service done quietly speaks loudly in many cultures but can be misread as overstepping in others. In high-autonomy cultures, ask before acting. In communal cultures, acting without asking is often the highest form of care.",
    biblical: "Acts 9 calls Tabitha a disciple full of good works and acts of charity. She made garments for the widows of Joppa — practical, repeated, unseen service that built the church through the everyday. When she died, the widows showed Peter the clothes she had made. Her gift was visible only in what she had given. Acts-of-Service leaders learn from Tabitha: the work that no one applauds is often the work that holds the church together.",
    biblicalAnchor: "Tabitha (Dorcas) — Acts 9:36",
  },
  D: {
    name: "Tangible Gifts",
    color: "oklch(68% 0.15 10)",
    colorLight: "oklch(96% 0.02 10)",
    desc: "You feel cared for when someone brings you something chosen specifically for you. The value is not the price — it is the evidence that someone thought of you when you were not there. A small token carried back from a trip can land deeper than an expensive generic gift.",
    notMeans: "This does not mean you are materialistic. You read gifts as symbols of attention. A thoughtful, inexpensive gift from someone who knows you is worth more than an expensive one from someone who does not.",
    crossCultural: "Tangible Gifts carry strong meaning in many Asian, African, and Latin American cultures and can feel transactional in Northern European contexts. In some cultures, what you give signals the relationship's value. Learn the local grammar of gift-giving.",
    biblical: "Mary of Bethany broke a jar of pure nard — worth a year's wages — and poured it on Jesus' feet (Mark 14:3–9). The disciples called it waste. Jesus called it beautiful: \"She has done a beautiful thing to me — wherever the gospel is preached in the whole world, what she has done will be told in memory of her.\" The gift was extravagant on purpose. Tangible-Gifts leaders learn from Mary: a thoughtful gift, given at the right moment, carries weight that words cannot.",
    biblicalAnchor: "Mary of Bethany — Mark 14:3",
  },
  E: {
    name: "Appropriate Touch",
    color: "oklch(70% 0.16 65)",
    colorLight: "oklch(95% 0.03 65)",
    desc: "You feel cared for when someone offers appropriate physical warmth — a firm handshake, a hand on the shoulder, a warm greeting. Physical presence communicates what words sometimes cannot: that someone is truly glad you are here.",
    notMeans: "This does not mean all physical contact is welcome. 'Appropriate' is the key word — the form must match the relationship, the gender dynamics, and the cultural context. The substance (human warmth) is constant; the form is not.",
    crossCultural: "Appropriate Touch is the most variable of all five languages across cultures. A side-hug that is normal in Filipino ministry is inappropriate in much of the Middle East. Always read the cultural context before expressing warmth physically. The intention to connect must be matched by cultural fluency.",
    biblical: "The gospels record Jesus touching people repeatedly — the leper no one would touch (Mark 1:41), the children the disciples tried to keep away (Mark 10:13–16), the bier of the widow's son (Luke 7:14), the eyes of the blind men (Matthew 9:29). In a culture with strict purity codes, the touch was scandalous and pastoral at once. Appropriate-Touch leaders learn from Jesus: physical presence is part of how God's care reaches people. In cross-cultural ministry, the form of the touch must adapt — the substance, that human warmth carries divine love, does not.",
    biblicalAnchor: "Jesus — Mark 1:41",
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

function isFlat(scores: Scores): boolean {
  const vals = Object.values(scores).sort((a, b) => b - a);
  return vals[0] <= 10 || (vals[0] - vals[1]) <= 2;
}

function getInterpretation(
  rPrimary: ScoreKey,
  gPrimary: ScoreKey,
  rFlat: boolean,
  gFlat: boolean
): { label: string; labelColor: string; text: string; action: string } {
  if (rFlat && gFlat) return {
    label: "Both Broad",
    labelColor: "oklch(60% 0.08 200)",
    text: "You scored evenly across multiple languages in both tests. Your sensitivity is broad — no single language dominates. This is rare but legitimate.",
    action: "Name your top two languages in each test and tell your team that either lands well for you.",
  };
  if (rPrimary === gPrimary) return {
    label: "Match",
    labelColor: "oklch(52% 0.14 150)",
    text: "Your receiving and giving primaries match. You give what you most need, and you know how to deliver it. The risk: you may assume others want what you want.",
    action: "Ask each team member their receiving language. Write it down. Refer to the list before any care moment.",
  };
  return {
    label: "Two Languages",
    labelColor: "oklch(62% 0.14 235)",
    text: "Your receiving and giving languages differ — the most insightful pattern. You carry natural fluency in two languages: how you are wired to receive care, and how you are wired to give it. The risk: your team may not know what you personally need.",
    action: `Tell your team both languages out loud: "What makes me feel cared for is ${LANG_DATA[rPrimary].name}. What I most naturally give is ${LANG_DATA[gPrimary].name}."`,
  };
}

// ── BAR CHART ─────────────────────────────────────────────────────────────────

function LanguageBar({
  langKey,
  score,
  isPrimary,
  maxScore = 16,
}: {
  langKey: ScoreKey;
  score: number;
  isPrimary: boolean;
  maxScore?: number;
}) {
  const lang = LANG_DATA[langKey];
  const pct = Math.min((score / maxScore) * 100, 100);

  return (
    <div style={{
      display: "flex",
      alignItems: "center",
      gap: "0.75rem",
      padding: isPrimary ? "0.6rem 0.75rem" : "0.4rem 0",
      borderRadius: isPrimary ? "8px" : 0,
      background: isPrimary ? lang.colorLight : "transparent",
      border: isPrimary ? `2px solid ${lang.color}` : "none",
      boxShadow: isPrimary ? `0 0 12px ${lang.color}40` : "none",
      transition: "all 0.2s ease",
    }}>
      {/* Color dot */}
      <div style={{
        width: "10px",
        height: "10px",
        borderRadius: "50%",
        background: lang.color,
        flexShrink: 0,
      }} />
      {/* Label */}
      <div style={{ flex: "0 0 160px", minWidth: 0 }}>
        <span style={{
          fontSize: "13px",
          fontWeight: isPrimary ? 700 : 500,
          color: "oklch(22% 0.10 260)",
          whiteSpace: "nowrap",
          overflow: "hidden",
          textOverflow: "ellipsis",
          display: "block",
        }}>{lang.name}</span>
      </div>
      {/* Bar track */}
      <div style={{
        flex: 1,
        height: "8px",
        background: "oklch(90% 0.01 260)",
        borderRadius: "4px",
        overflow: "hidden",
      }}>
        <div style={{
          height: "100%",
          width: `${pct}%`,
          background: lang.color,
          borderRadius: "4px",
          transition: "width 0.6s ease",
        }} />
      </div>
      {/* Score */}
      <span style={{
        fontSize: "13px",
        fontWeight: 700,
        color: "oklch(22% 0.10 260)",
        flex: "0 0 32px",
        textAlign: "right",
      }}>{score}/16</span>
    </div>
  );
}

// ── EMPTY BAR PREVIEW ─────────────────────────────────────────────────────────

function EmptyBarChart({ label }: { label: string }) {
  return (
    <div style={{
      background: "oklch(97% 0.005 80)",
      border: "1px solid oklch(90% 0.01 80)",
      borderRadius: "12px",
      padding: "1.5rem",
    }}>
      <p style={{
        fontSize: "12px",
        fontWeight: 700,
        letterSpacing: "0.1em",
        textTransform: "uppercase",
        color: "oklch(55% 0.06 260)",
        marginBottom: "1rem",
      }}>{label}</p>
      {(["A", "B", "C", "D", "E"] as ScoreKey[]).map((k) => (
        <div key={k} style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginBottom: "0.5rem" }}>
          <div style={{ width: "10px", height: "10px", borderRadius: "50%", background: LANG_DATA[k].color, flexShrink: 0 }} />
          <div style={{ flex: "0 0 160px" }}>
            <span style={{ fontSize: "13px", color: "oklch(60% 0.06 260)" }}>{LANG_DATA[k].name}</span>
          </div>
          <div style={{ flex: 1, height: "8px", background: "oklch(92% 0.01 260)", borderRadius: "4px" }} />
          <span style={{ fontSize: "13px", color: "oklch(70% 0.04 260)", flex: "0 0 32px", textAlign: "right" }}>—</span>
        </div>
      ))}
    </div>
  );
}

// ── MAIN COMPONENT ────────────────────────────────────────────────────────────

export default function FiveLanguagesClient({
  isSaved,
  receivingResult,
  givingResult,
  receivingScores,
  givingScores,
}: {
  isSaved: boolean;
  receivingResult: string | null;
  givingResult: string | null;
  receivingScores: { A: number; B: number; C: number; D: number; E: number } | null;
  givingScores: { A: number; B: number; C: number; D: number; E: number } | null;
}) {
  const [quizState, setQuizState] = useState<"intro" | "test1" | "transition" | "test2" | "done">(
    receivingResult && givingResult ? "done" : "intro"
  );
  const [currentPair, setCurrentPair] = useState(0);
  const [receivingScoresState, setReceivingScores] = useState<Scores>({ A: 0, B: 0, C: 0, D: 0, E: 0 });
  const [givingScoresState, setGivingScores] = useState<Scores>({ A: 0, B: 0, C: 0, D: 0, E: 0 });
  const [resultSaved, setResultSaved] = useState(isSaved);
  const [saveError, setSaveError] = useState<string | null>(null);
  const [isSaving, startSaving] = useTransition();

  // Use prop scores when showing previously saved results
  const displayReceiving: Scores = quizState === "done" && receivingResult && receivingScores
    ? receivingScores
    : receivingScoresState;
  const displayGiving: Scores = quizState === "done" && givingResult && givingScores
    ? givingScores
    : givingScoresState;

  const rPrimary = getPrimary(displayReceiving);
  const gPrimary = getPrimary(displayGiving);
  const rFlat = isFlat(displayReceiving);
  const gFlat = isFlat(displayGiving);

  // For transition screen — receiving primary from live state
  const transitionPrimary = getPrimary(receivingScoresState);

  function handleAnswer(key: ScoreKey, test: "receiving" | "giving") {
    if (test === "receiving") {
      const newScores = { ...receivingScoresState, [key]: receivingScoresState[key] + 1 };
      setReceivingScores(newScores);
      if (currentPair < 39) {
        setCurrentPair(currentPair + 1);
      } else {
        setCurrentPair(0);
        setQuizState("transition");
      }
    } else {
      const newScores = { ...givingScoresState, [key]: givingScoresState[key] + 1 };
      setGivingScores(newScores);
      if (currentPair < 39) {
        setCurrentPair(currentPair + 1);
      } else {
        setQuizState("done");
      }
    }
  }

  async function handleSave() {
    startSaving(async () => {
      const rP = getPrimary(receivingScoresState);
      const gP = getPrimary(givingScoresState);
      const toPercents = (s: Scores) => ({
        A: Math.round((s.A / 40) * 100),
        B: Math.round((s.B / 40) * 100),
        C: Math.round((s.C / 40) * 100),
        D: Math.round((s.D / 40) * 100),
        E: Math.round((s.E / 40) * 100),
      });
      const rPct = toPercents(receivingScoresState);
      const gPct = toPercents(givingScoresState);
      const result = await saveFiveLanguagesResult(rP, gP, rPct, gPct);
      if (result.error) {
        setSaveError("Could not save — please try again.");
      } else {
        await saveResourceToDashboard("5languages");
        setResultSaved(true);
        setSaveError(null);
      }
    });
  }

  function retake() {
    setQuizState("intro");
    setCurrentPair(0);
    setReceivingScores({ A: 0, B: 0, C: 0, D: 0, E: 0 });
    setGivingScores({ A: 0, B: 0, C: 0, D: 0, E: 0 });
    setResultSaved(false);
  }

  // Overall progress: test1 pairs are 1-40, test2 pairs are 41-80
  const overallProgress = quizState === "intro"
    ? 0
    : quizState === "test1"
    ? currentPair + 1
    : quizState === "transition"
    ? 40
    : quizState === "test2"
    ? 40 + currentPair + 1
    : 80;

  // ── INTRO ──────────────────────────────────────────────────────────────────
  if (quizState === "intro") {
    return (
      <div>
        {/* Hero */}
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
              Leadership · Assessment
            </p>
            <h1 style={{
              fontFamily: "Cormorant Garamond, serif",
              fontSize: "clamp(38px, 5.5vw, 68px)",
              fontWeight: 600,
              lineHeight: 1.08,
              color: "oklch(97% 0.005 80)",
              marginBottom: "1rem",
              maxWidth: "20ch",
            }}>
              5 Languages of Appreciation
            </h1>
            <p style={{
              color: "oklch(75% 0.05 260)",
              fontSize: "clamp(15px, 1.6vw, 18px)",
              lineHeight: 1.65,
              maxWidth: "56ch",
              marginBottom: "2rem",
            }}>
              Two tests. 80 forced choices. One insight: how you receive care, and how you give it — and the gap between the two.
            </p>
            <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap" }}>
              {(["A", "B", "C", "D", "E"] as ScoreKey[]).map((k) => (
                <span key={k} style={{
                  display: "inline-block",
                  padding: "4px 12px",
                  borderRadius: "20px",
                  background: `${LANG_DATA[k].color}25`,
                  border: `1px solid ${LANG_DATA[k].color}60`,
                  color: LANG_DATA[k].color,
                  fontSize: "12px",
                  fontWeight: 600,
                }}>
                  {LANG_DATA[k].name}
                </span>
              ))}
            </div>
          </div>
        </section>

        {/* About section — light background, fully visible content */}
        <section style={{ background: "white", padding: "clamp(2rem, 4vw, 3.5rem) 0", borderTop: "1px solid oklch(91% 0.006 80)" }}>
          <div className="container-wide">
            <h2 style={{
              fontFamily: "var(--font-montserrat)", fontWeight: 800, fontSize: "clamp(1.3rem, 2.5vw, 1.75rem)",
              color: "oklch(22% 0.10 260)", marginBottom: "0.5rem",
            }}>
              About this assessment
            </h2>
            <p style={{ fontFamily: "var(--font-montserrat)", fontSize: "0.9rem", color: "oklch(42% 0.008 260)", lineHeight: 1.7, maxWidth: 680, marginBottom: "2.5rem" }}>
              Most personality frameworks tell you who you are. This one tells you something different — how you give and receive care. Gary Chapman&apos;s original 5 Love Languages adapted for ministry teams across cultures, with one key addition: a second test for how you give.
            </p>

            {/* 4 info cards — visible content, no flip */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: "1rem", marginBottom: "2.5rem" }}>
              {[
                {
                  title: "Why two tests?",
                  body: "Chapman's original test measures only receiving — what makes you feel loved. For team leaders, that is not enough. You need to know both: how you receive care so your team knows what you need, and how you give care so you can check whether you're loving people in their language or only in your own.",
                },
                {
                  title: "The Golden Rule gap",
                  body: "The most common pattern: leaders give in their own receiving language. A leader whose language is Words pours out written affirmation to a teammate whose language is Acts of Service — the teammate never feels seen. This is not malice. It is the Golden Rule misapplied: doing unto others as you would have them do unto you assumes the other person wants what you want.",
                },
                {
                  title: "How to read your results",
                  body: "Three patterns: Match (receiving = giving) — you give what you most need, which is your strength and your blind spot. Two Languages (receiving ≠ giving) — you have fluency in two languages, but your team may be guessing what you need. Broad (no clear primary) — your sensitivity is wide; name your top two and tell your team.",
                },
                {
                  title: "Three practices",
                  body: "Tell your team both your receiving and giving languages out loud — naming the gap is the highest-leverage move you can make. Ask each team member their receiving language and keep the list. Audit your giving once a quarter: for each person, have I expressed care in their language, or only in mine?",
                },
              ].map(({ title, body }) => (
                <div key={title} style={{
                  background: "oklch(97% 0.005 80)",
                  border: "1px solid oklch(90% 0.006 80)",
                  borderRadius: 12,
                  padding: "1.25rem 1.5rem",
                }}>
                  <p style={{ fontFamily: "var(--font-montserrat)", fontWeight: 700, fontSize: "0.85rem", color: "oklch(22% 0.10 260)", marginBottom: "0.6rem" }}>{title}</p>
                  <p style={{ fontFamily: "var(--font-montserrat)", fontSize: "0.8rem", lineHeight: 1.7, color: "oklch(38% 0.008 260)" }}>{body}</p>
                </div>
              ))}
            </div>

            {/* 5 language preview cards */}
            <h3 style={{ fontFamily: "var(--font-montserrat)", fontWeight: 700, fontSize: "1rem", color: "oklch(22% 0.10 260)", marginBottom: "1rem" }}>
              The five languages
            </h3>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "0.75rem", marginBottom: "2.5rem" }}>
              {(["A", "B", "C", "D", "E"] as ScoreKey[]).map((k) => (
                <div key={k} style={{
                  background: LANG_DATA[k].colorLight,
                  border: `1.5px solid ${LANG_DATA[k].color}40`,
                  borderRadius: 12,
                  padding: "1rem 1.25rem",
                  borderTop: `4px solid ${LANG_DATA[k].color}`,
                }}>
                  <p style={{ fontFamily: "var(--font-montserrat)", fontWeight: 800, fontSize: "0.85rem", color: LANG_DATA[k].color, marginBottom: "0.5rem" }}>
                    {LANG_DATA[k].name}
                  </p>
                  <p style={{ fontFamily: "var(--font-montserrat)", fontSize: "0.75rem", lineHeight: 1.65, color: "oklch(35% 0.008 260)" }}>
                    {LANG_DATA[k].desc}
                  </p>
                  <p style={{ fontFamily: "var(--font-montserrat)", fontSize: "0.68rem", color: LANG_DATA[k].color, marginTop: "0.75rem", fontStyle: "italic" }}>
                    {LANG_DATA[k].biblicalAnchor}
                  </p>
                </div>
              ))}
            </div>

            {/* Cross-cultural note */}
            <div style={{ background: "oklch(96% 0.02 235)", border: "1px solid oklch(85% 0.06 235)", borderRadius: 12, padding: "1.25rem 1.5rem", marginBottom: "2.5rem" }}>
              <p style={{ fontFamily: "var(--font-montserrat)", fontWeight: 700, fontSize: "0.8rem", color: "oklch(35% 0.10 235)", marginBottom: "0.5rem" }}>Cross-cultural note</p>
              <p style={{ fontFamily: "var(--font-montserrat)", fontSize: "0.8rem", lineHeight: 1.7, color: "oklch(38% 0.008 260)" }}>
                The five languages travel across cultures, but their cultural weight does not. Words of Affirmation can feel performative in high-context Asian cultures. Appropriate Touch is the most variable — a side-hug normal in Filipino ministry is inappropriate in much of the Middle East. The test gives you your language. The cross-cultural work is learning how that language is properly spoken in the cultures around you.
              </p>
            </div>

            {/* Empty chart previews */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "1.5rem", marginBottom: "2.5rem" }}>
              <EmptyBarChart label="Your Receiving Language" />
              <EmptyBarChart label="Your Giving Language" />
            </div>

            <div style={{ textAlign: "center" }}>
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
                Begin Test 1 — Receiving
              </button>
              <p style={{ marginTop: "0.75rem", fontSize: "13px", color: "oklch(55% 0.05 260)", fontFamily: "var(--font-montserrat)" }}>
                Test 1 of 2 · 40 forced-choice pairs · ~8 minutes
              </p>
            </div>
          </div>
        </section>
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
          {/* Header */}
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

          {/* Pair cards */}
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
          {/* Header */}
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

          {/* Honesty banner at pair 15 (index 14) */}
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

          {/* Pair cards */}
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
  const interpretation = getInterpretation(rPrimary, gPrimary, rFlat, gFlat);
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

          {/* Pattern badge */}
          <div style={{ marginBottom: "1.5rem" }}>
            <span style={{
              display: "inline-block",
              padding: "6px 16px",
              borderRadius: "20px",
              background: `${interpretation.labelColor}20`,
              border: `1px solid ${interpretation.labelColor}60`,
              color: interpretation.labelColor,
              fontSize: "13px",
              fontWeight: 700,
              letterSpacing: "0.06em",
              textTransform: "uppercase",
            }}>
              {interpretation.label}
            </span>
          </div>

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
                marginBottom: "0.25rem",
              }}>
                {rLang.name}
              </h2>
              <p style={{ fontSize: "12px", color: "oklch(55% 0.05 260)" }}>{rLang.biblicalAnchor}</p>
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
                marginBottom: "0.25rem",
              }}>
                {gLang.name}
              </h2>
              <p style={{ fontSize: "12px", color: "oklch(55% 0.05 260)" }}>{gLang.biblicalAnchor}</p>
            </div>
          </div>
        </div>
      </section>

      {/* Interpretation + action */}
      <section style={{ background: "oklch(97% 0.005 80)", padding: "clamp(2rem, 3.5vw, 3rem) 0" }}>
        <div className="container-wide" style={{ maxWidth: "760px" }}>
          <p style={{
            fontSize: "clamp(16px, 1.7vw, 19px)",
            color: "oklch(22% 0.10 260)",
            lineHeight: 1.7,
            marginBottom: "1.5rem",
          }}>
            {interpretation.text}
          </p>
          <div style={{
            background: "oklch(22% 0.10 260)",
            borderRadius: "10px",
            padding: "1.25rem 1.5rem",
          }}>
            <p style={{
              fontSize: "12px",
              fontWeight: 700,
              letterSpacing: "0.1em",
              textTransform: "uppercase",
              color: "oklch(65% 0.15 45)",
              marginBottom: "0.5rem",
            }}>Practical step</p>
            <p style={{
              fontSize: "15px",
              color: "oklch(88% 0.02 80)",
              lineHeight: 1.65,
            }}>
              {interpretation.action}
            </p>
          </div>
        </div>
      </section>

      {/* Dual bar charts */}
      <section style={{ background: "oklch(14% 0.07 260)", padding: "clamp(2rem, 4vw, 3.5rem) 0" }}>
        <div className="container-wide">
          <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
            gap: "1.5rem",
          }}>
            {/* Receiving chart */}
            <div style={{
              background: "oklch(97% 0.005 80)",
              borderRadius: "12px",
              padding: "1.5rem",
            }}>
              <p style={{
                fontSize: "12px",
                fontWeight: 700,
                letterSpacing: "0.1em",
                textTransform: "uppercase",
                color: "oklch(55% 0.06 260)",
                marginBottom: "1.25rem",
              }}>Your Receiving Language</p>
              <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                {(Object.entries(displayReceiving) as [ScoreKey, number][])
                  .sort((a, b) => b[1] - a[1])
                  .map(([k, v]) => (
                    <LanguageBar key={k} langKey={k} score={v} isPrimary={k === rPrimary} />
                  ))}
              </div>
            </div>
            {/* Giving chart */}
            <div style={{
              background: "oklch(97% 0.005 80)",
              borderRadius: "12px",
              padding: "1.5rem",
            }}>
              <p style={{
                fontSize: "12px",
                fontWeight: 700,
                letterSpacing: "0.1em",
                textTransform: "uppercase",
                color: "oklch(55% 0.06 260)",
                marginBottom: "1.25rem",
              }}>Your Giving Language</p>
              <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                {(Object.entries(displayGiving) as [ScoreKey, number][])
                  .sort((a, b) => b[1] - a[1])
                  .map(([k, v]) => (
                    <LanguageBar key={k} langKey={k} score={v} isPrimary={k === gPrimary} />
                  ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Language profiles */}
      <section style={{ background: "oklch(97% 0.005 80)", padding: "clamp(2rem, 4vw, 3.5rem) 0" }}>
        <div className="container-wide">
          <h2 style={{
            fontFamily: "Cormorant Garamond, serif",
            fontSize: "clamp(26px, 3.5vw, 36px)",
            fontWeight: 600,
            color: "oklch(22% 0.10 260)",
            marginBottom: "0.5rem",
          }}>Your two languages</h2>
          <p style={{ fontSize: "15px", color: "oklch(45% 0.06 260)", marginBottom: "2rem", lineHeight: 1.6 }}>
            Profiles for your receiving and giving primaries.
          </p>

          <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
            gap: "1.5rem",
          }}>
            {[
              { role: "Receiving", key: rPrimary, lang: rLang },
              ...(rPrimary !== gPrimary ? [{ role: "Giving", key: gPrimary, lang: gLang }] : []),
            ].map(({ role, key, lang }) => (
              <div key={`${role}-${key}`} style={{
                border: `1px solid ${lang.color}40`,
                borderRadius: "14px",
                overflow: "hidden",
              }}>
                <div style={{
                  background: lang.color,
                  padding: "1rem 1.5rem",
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}>
                  <span style={{
                    fontFamily: "var(--font-montserrat, sans-serif)",
                    fontWeight: 800,
                    fontSize: "16px",
                    color: "oklch(14% 0.07 260)",
                  }}>{lang.name}</span>
                  <span style={{
                    fontSize: "11px",
                    fontWeight: 700,
                    letterSpacing: "0.1em",
                    textTransform: "uppercase",
                    color: "oklch(14% 0.07 260)",
                    opacity: 0.7,
                  }}>{role}</span>
                </div>
                <div style={{ padding: "1.5rem", display: "flex", flexDirection: "column", gap: "1.25rem" }}>
                  <p style={{ fontSize: "15px", color: "oklch(22% 0.10 260)", lineHeight: 1.7 }}>{lang.desc}</p>
                  <div>
                    <p style={{ fontSize: "11px", fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: lang.color, marginBottom: "0.4rem" }}>Not means</p>
                    <p style={{ fontSize: "14px", color: "oklch(35% 0.07 260)", lineHeight: 1.65 }}>{lang.notMeans}</p>
                  </div>
                  <div>
                    <p style={{ fontSize: "11px", fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: lang.color, marginBottom: "0.4rem" }}>Cross-cultural</p>
                    <p style={{ fontSize: "14px", color: "oklch(35% 0.07 260)", lineHeight: 1.65 }}>{lang.crossCultural}</p>
                  </div>
                  <div style={{
                    background: lang.colorLight,
                    borderRadius: "8px",
                    padding: "1rem",
                    borderLeft: `3px solid ${lang.color}`,
                  }}>
                    <p style={{ fontSize: "11px", fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: lang.color, marginBottom: "0.5rem" }}>Biblical anchor · {lang.biblicalAnchor}</p>
                    <p style={{ fontSize: "14px", color: "oklch(25% 0.08 260)", lineHeight: 1.7 }}>{lang.biblical}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Save + retake */}
      <section style={{ background: "oklch(22% 0.10 260)", padding: "clamp(2rem, 3.5vw, 3rem) 0" }}>
        <div className="container-wide" style={{ display: "flex", flexWrap: "wrap", gap: "1rem", alignItems: "center" }}>
          {!resultSaved ? (
            <div>
              <button
                type="button"
                onClick={handleSave}
                disabled={isSaving}
                style={{
                  background: "oklch(65% 0.15 45)",
                  color: "oklch(97% 0.005 80)",
                  border: "none",
                  borderRadius: "8px",
                  padding: "12px 28px",
                  fontSize: "15px",
                  fontWeight: 700,
                  cursor: isSaving ? "not-allowed" : "pointer",
                  opacity: isSaving ? 0.7 : 1,
                  transition: "opacity 0.15s ease",
                }}
              >
                {isSaving ? "Saving..." : "Save to dashboard"}
              </button>
              {saveError && (
                <p style={{ color: "oklch(55% 0.20 25)", fontSize: "0.875rem", marginTop: "0.5rem" }}>
                  {saveError}
                </p>
              )}
            </div>
          ) : (
            <span style={{
              fontSize: "14px",
              color: "oklch(65% 0.12 150)",
              fontWeight: 600,
            }}>
              Saved to your dashboard
            </span>
          )}
          <button
            type="button"
            onClick={retake}
            style={{
              background: "transparent",
              color: "oklch(70% 0.05 260)",
              border: "1px solid oklch(40% 0.06 260)",
              borderRadius: "8px",
              padding: "12px 28px",
              fontSize: "15px",
              fontWeight: 600,
              cursor: "pointer",
              transition: "border-color 0.15s ease, color 0.15s ease",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = "oklch(65% 0.15 45)";
              e.currentTarget.style.color = "oklch(97% 0.005 80)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = "oklch(40% 0.06 260)";
              e.currentTarget.style.color = "oklch(70% 0.05 260)";
            }}
          >
            Retake
          </button>
        </div>
      </section>

      {/* Full 5 languages reference */}
      <section style={{ background: "oklch(96% 0.005 80)", padding: "clamp(2rem, 4vw, 3.5rem) 0" }}>
        <div className="container-wide">
          <h2 style={{
            fontFamily: "var(--font-montserrat)",
            fontWeight: 800,
            fontSize: "clamp(1.2rem, 2.5vw, 1.6rem)",
            color: "oklch(22% 0.10 260)",
            marginBottom: "0.5rem",
          }}>
            The Five Languages
          </h2>
          <p style={{ fontFamily: "var(--font-montserrat)", fontSize: "0.875rem", color: "oklch(45% 0.008 260)", lineHeight: 1.7, maxWidth: 620, marginBottom: "2rem" }}>
            Full profiles for all five languages — with cross-cultural notes and biblical grounding.
          </p>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))", gap: "1.5rem" }}>
            {(["A", "B", "C", "D", "E"] as ScoreKey[]).map((k) => {
              const lang = LANG_DATA[k];
              const isReceiving = k === rPrimary;
              const isGiving = k === gPrimary;
              return (
                <div key={k} style={{
                  background: "white",
                  border: `1px solid ${lang.color}30`,
                  borderRadius: "14px",
                  overflow: "hidden",
                  borderTop: `4px solid ${lang.color}`,
                }}>
                  {/* Card header */}
                  <div style={{ padding: "1.25rem 1.5rem 1rem", borderBottom: `1px solid ${lang.color}15` }}>
                    <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: "0.75rem", flexWrap: "wrap" }}>
                      <h3 style={{
                        fontFamily: "var(--font-montserrat)",
                        fontWeight: 800,
                        fontSize: "1rem",
                        color: lang.color,
                        margin: 0,
                      }}>
                        {lang.name}
                      </h3>
                      <div style={{ display: "flex", gap: "0.4rem", flexWrap: "wrap" }}>
                        {isReceiving && (
                          <span style={{
                            fontSize: "10px",
                            fontWeight: 700,
                            letterSpacing: "0.07em",
                            textTransform: "uppercase",
                            padding: "3px 8px",
                            borderRadius: "20px",
                            background: `${lang.color}18`,
                            color: lang.color,
                            border: `1px solid ${lang.color}50`,
                          }}>
                            Your receiving language
                          </span>
                        )}
                        {isGiving && (
                          <span style={{
                            fontSize: "10px",
                            fontWeight: 700,
                            letterSpacing: "0.07em",
                            textTransform: "uppercase",
                            padding: "3px 8px",
                            borderRadius: "20px",
                            background: `${lang.color}18`,
                            color: lang.color,
                            border: `1px solid ${lang.color}50`,
                          }}>
                            Your giving language
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Card body */}
                  <div style={{ padding: "1.25rem 1.5rem", display: "flex", flexDirection: "column", gap: "1.1rem" }}>
                    <p style={{ fontFamily: "var(--font-montserrat)", fontSize: "0.85rem", color: "oklch(22% 0.10 260)", lineHeight: 1.7, margin: 0 }}>
                      {lang.desc}
                    </p>

                    <div>
                      <p style={{ fontFamily: "var(--font-montserrat)", fontSize: "0.7rem", fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: lang.color, marginBottom: "0.3rem" }}>
                        What this does NOT mean
                      </p>
                      <p style={{ fontFamily: "var(--font-montserrat)", fontSize: "0.8rem", color: "oklch(38% 0.008 260)", lineHeight: 1.65, margin: 0 }}>
                        {lang.notMeans}
                      </p>
                    </div>

                    <div>
                      <p style={{ fontFamily: "var(--font-montserrat)", fontSize: "0.7rem", fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: lang.color, marginBottom: "0.3rem" }}>
                        Cross-cultural note
                      </p>
                      <p style={{ fontFamily: "var(--font-montserrat)", fontSize: "0.8rem", color: "oklch(38% 0.008 260)", lineHeight: 1.65, margin: 0 }}>
                        {lang.crossCultural}
                      </p>
                    </div>

                    <div style={{
                      background: lang.colorLight,
                      borderRadius: "8px",
                      padding: "1rem 1.1rem",
                      borderLeft: `3px solid ${lang.color}`,
                    }}>
                      <p style={{ fontFamily: "var(--font-montserrat)", fontSize: "0.7rem", fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: lang.color, marginBottom: "0.4rem" }}>
                        Biblical anchor · {lang.biblicalAnchor}
                      </p>
                      <p style={{ fontFamily: "var(--font-montserrat)", fontSize: "0.8rem", color: "oklch(25% 0.08 260)", lineHeight: 1.7, margin: 0 }}>
                        {lang.biblical}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>
    </div>
  );
}

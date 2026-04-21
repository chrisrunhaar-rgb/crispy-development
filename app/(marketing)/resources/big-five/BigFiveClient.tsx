"use client";

import { useState, useTransition } from "react";
import { saveResourceToDashboard, saveBigFiveResult } from "../actions";

// ── QUESTIONS ─────────────────────────────────────────────────────────────────
// 50 statements (10 per trait). Field `t` = trait key.
// Rated 1–5: 1 = Strongly disagree → 5 = Strongly agree.

const QUESTIONS = [
  // Openness (O)
  { text: "I enjoy exploring new ideas and engaging with complex, abstract concepts.", t: "O" },
  { text: "I have a vivid imagination and an active inner world.", t: "O" },
  { text: "I am genuinely moved by art, music, poetry, or literature.", t: "O" },
  { text: "I am curious about many subjects and enjoy learning for its own sake.", t: "O" },
  { text: "I prefer variety and novelty to routine and predictability.", t: "O" },
  { text: "I enjoy experimenting with new approaches rather than sticking to what works.", t: "O" },
  { text: "I find it easy to think creatively and generate original ideas.", t: "O" },
  { text: "I question conventional wisdom and enjoy challenging assumptions.", t: "O" },
  { text: "I am drawn to cultures, perspectives, and ways of life different from my own.", t: "O" },
  { text: "I notice beauty and meaning in everyday experiences others might overlook.", t: "O" },
  // Conscientiousness (C)
  { text: "I am organised and keep my work, space, and commitments in order.", t: "C" },
  { text: "I complete tasks thoroughly and reliably on time.", t: "C" },
  { text: "I set ambitious goals for myself and work persistently toward them.", t: "C" },
  { text: "I pay close attention to detail and rarely make careless mistakes.", t: "C" },
  { text: "I am disciplined — I follow through even when motivation fades.", t: "C" },
  { text: "I think carefully and plan ahead before taking action.", t: "C" },
  { text: "People can count on me to keep my word and follow through.", t: "C" },
  { text: "I work hard on tasks even when they are tedious or difficult.", t: "C" },
  { text: "I hold myself to high standards and am not satisfied with mediocrity.", t: "C" },
  { text: "I tend to finish what I start, even when it is no longer exciting.", t: "C" },
  // Extraversion (E)
  { text: "I feel energised by being around other people.", t: "E" },
  { text: "I am talkative and find it easy to start conversations with new people.", t: "E" },
  { text: "I bring energy and enthusiasm to social and group settings.", t: "E" },
  { text: "I am assertive and comfortable taking charge in groups.", t: "E" },
  { text: "I actively seek out social gatherings and enjoy meeting new people.", t: "E" },
  { text: "I express my emotions openly and come across as warm and positive.", t: "E" },
  { text: "I prefer working with others over working alone.", t: "E" },
  { text: "I feel confident and at ease in most social situations.", t: "E" },
  { text: "I enjoy being the centre of attention in the right setting.", t: "E" },
  { text: "I find that conversation and collaboration sharpen my thinking.", t: "E" },
  // Agreeableness (A)
  { text: "I genuinely care about others' wellbeing and try to help when I can.", t: "A" },
  { text: "I trust others and generally assume they have good intentions.", t: "A" },
  { text: "I find it relatively easy to forgive people who have hurt me.", t: "A" },
  { text: "I prefer to find common ground rather than win an argument.", t: "A" },
  { text: "I am flexible and willing to adjust my position to accommodate others.", t: "A" },
  { text: "I work cooperatively and rarely let competition get in the way of relationships.", t: "A" },
  { text: "I feel genuine empathy for people who are struggling.", t: "A" },
  { text: "I communicate gently and avoid being harsh, blunt, or critical.", t: "A" },
  { text: "I am considerate of others' feelings when deciding how to say something.", t: "A" },
  { text: "I am generous with my time, energy, and resources.", t: "A" },
  // Neuroticism (N) — higher score = more emotionally reactive
  { text: "I experience significant stress or anxiety in challenging situations.", t: "N" },
  { text: "My mood changes frequently depending on what is happening around me.", t: "N" },
  { text: "I tend to worry about things, even when they are likely to turn out fine.", t: "N" },
  { text: "Once I become upset, it takes me a while to calm down.", t: "N" },
  { text: "I feel self-conscious or embarrassed more easily than most people.", t: "N" },
  { text: "I experience strong emotional reactions when I receive criticism or face setbacks.", t: "N" },
  { text: "I sometimes feel overwhelmed by demands placed on me.", t: "N" },
  { text: "I find it difficult to stay calm and composed under pressure.", t: "N" },
  { text: "I notice and feel negative emotions — worry, sadness, frustration — quite intensely.", t: "N" },
  { text: "I find it challenging to maintain emotional equilibrium in conflict.", t: "N" },
];

// Round-robin order: O1,C1,E1,A1,N1, O2,C2,E2,A2,N2, ...
const QUESTION_ORDER = [
  0, 10, 20, 30, 40,
  1, 11, 21, 31, 41,
  2, 12, 22, 32, 42,
  3, 13, 23, 33, 43,
  4, 14, 24, 34, 44,
  5, 15, 25, 35, 45,
  6, 16, 26, 36, 46,
  7, 17, 27, 37, 47,
  8, 18, 28, 38, 48,
  9, 19, 29, 39, 49,
];

const SCALE_LABELS = ["Strongly disagree", "Disagree", "Neutral", "Agree", "Strongly agree"];

// ── TRAIT DATA ────────────────────────────────────────────────────────────────

const TRAITS = [
  {
    key: "O",
    name: "Openness",
    subtitle: "Curiosity, creativity & imagination",
    color: "oklch(52% 0.22 280)",
    colorLight: "oklch(65% 0.17 280)",
    colorVeryLight: "oklch(94% 0.04 280)",
    bg: "oklch(16% 0.18 280)",
    icon: "◈",
    highLabel: "Visionary",
    lowLabel: "Grounded",
    overview: "Openness reflects your appetite for ideas, experiences, and imagination. High scorers are curious, creative, and drawn to novelty — they thrive in ambiguous, complex environments and bring imaginative thinking to problems. Lower scorers are practical, grounded, and focused — they build reliable systems and deliver consistent results in familiar territory.",
    highDescription: "You bring curiosity, imagination, and a genuine appetite for complexity to your leadership. You think creatively, challenge assumptions, and see possibilities others miss. You thrive in ambiguous, rapidly changing environments and naturally push teams toward innovation.",
    lowDescription: "You are practical, focused, and reliable — a leader who builds solid systems and delivers consistent results. You know what works and stick with it. Your strength lies in execution, not experimentation — and teams trust you for your steady, grounded judgment.",
    leadershipHigh: "Use your creativity to inspire vision and challenge the status quo. Watch out for the tendency to leap to new ideas before current ones are fully executed. Teams need both your imagination and your grounding.",
    leadershipLow: "Your reliability and focus on proven methods create stability. Be intentional about making room for creative input from others. Environments that demand rapid change may stretch you — build relationships with high-O collaborators.",
    crossCultural: "In collectivist or tradition-respecting cultures, high Openness needs to be balanced with respect for what has worked. In innovation-driven cultures, lower Openness can be misread as resistance to change. In either context, frame your approach in terms of team benefit, not preference.",
  },
  {
    key: "C",
    name: "Conscientiousness",
    subtitle: "Discipline, reliability & organisation",
    color: "oklch(50% 0.18 215)",
    colorLight: "oklch(64% 0.14 215)",
    colorVeryLight: "oklch(94% 0.03 215)",
    bg: "oklch(17% 0.14 215)",
    icon: "◉",
    highLabel: "Structured",
    lowLabel: "Flexible",
    overview: "Conscientiousness measures how organized, disciplined, and goal-directed you are. High scorers set high standards, plan carefully, and follow through with remarkable consistency — they are the people who get things done. Lower scorers are more flexible and spontaneous, often thriving in fast-moving or creative contexts where rigid planning would slow things down.",
    highDescription: "You are organised, disciplined, and dependable — one of the most reliable predictors of leadership effectiveness. You set high standards, plan carefully, and follow through. Teams trust you because you consistently deliver. Your greatest challenge is extending grace to others who work differently.",
    lowDescription: "You are flexible, adaptable, and spontaneous — able to pivot quickly when plans change. You bring a relaxed energy to high-pressure situations and rarely get paralysed by the need for perfect preparation. Your growth edge is building enough structure to support others who need clearer expectations.",
    leadershipHigh: "Your follow-through and high standards are strengths. Watch for perfectionism that slows the team or unrealistic expectations of others. Create space for imperfect progress over perfect paralysis.",
    leadershipLow: "Your flexibility is valuable in dynamic environments. Build habits and systems that compensate for your lower preference for structure — especially when leading others who need clear expectations and reliable follow-through.",
    crossCultural: "In monochronic (time-structured) cultures, low Conscientiousness can be seen as unreliable. In polychronic cultures, high Conscientiousness can come across as rigid or controlling. The most effective leaders adapt their discipline to what their team's context requires.",
  },
  {
    key: "E",
    name: "Extraversion",
    subtitle: "Energy, sociability & assertiveness",
    color: "oklch(60% 0.20 52)",
    colorLight: "oklch(72% 0.15 52)",
    colorVeryLight: "oklch(94% 0.04 52)",
    bg: "oklch(18% 0.13 52)",
    icon: "◎",
    highLabel: "Outgoing",
    lowLabel: "Reflective",
    overview: "Extraversion describes how you gain energy, engage socially, and assert yourself. High scorers draw energy from people and stimulation — they are expressive, action-oriented, and naturally visible in groups. Introverts (low scorers) draw energy from solitude and depth — they observe, reflect, and bring a thoughtful presence to teams. Neither is better; both have profound leadership strengths.",
    highDescription: "You draw energy from people and bring warmth, visibility, and momentum to your leadership. You are comfortable in the spotlight, expressive in communication, and naturally draw people toward a shared vision. Your challenge is creating space for quieter voices and ensuring depth matches your pace.",
    lowDescription: "You are a reflective, considered leader who listens deeply and thinks carefully before speaking. You bring calm to chaotic environments and your insights are often the most valuable in the room — when you choose to share them. Your growth edge is consistent visibility and proactive self-expression.",
    leadershipHigh: "Your energy and visibility are genuine gifts. Invest in the discipline of listening — slowing down enough to hear what others aren't saying. Ensure your extraversion doesn't crowd out the introverts on your team.",
    leadershipLow: "Your depth and thoughtfulness are enormous assets. Be intentional about making your presence felt — speak earlier in meetings, communicate your vision more often. Leadership often requires more visibility than introverts find natural.",
    crossCultural: "In collectivist or low-context cultures, extraversion is often more valued than in reflective, high-context cultures. Across all cultures, the key is adaptability — reading what the room needs and adjusting your presence accordingly.",
  },
  {
    key: "A",
    name: "Agreeableness",
    subtitle: "Cooperation, trust & empathy",
    color: "oklch(52% 0.18 155)",
    colorLight: "oklch(65% 0.14 155)",
    colorVeryLight: "oklch(94% 0.03 155)",
    bg: "oklch(17% 0.12 155)",
    icon: "◐",
    highLabel: "Harmonious",
    lowLabel: "Direct",
    overview: "Agreeableness reflects your orientation toward cooperation, trust, and empathy. High scorers create warm, trusting environments and prioritise relationships — they are natural team-builders and peacemakers. Lower scorers are more competitive, direct, and willing to challenge — they push for results and hold high standards, even at the cost of relational comfort.",
    highDescription: "You are warm, cooperative, and genuinely other-focused. You create environments where people feel valued and heard, and you build the relational trust that sustains long-term teams. Your growth edge is learning to hold conflict when it's needed — and to maintain your own convictions under relational pressure.",
    lowDescription: "You are direct, confident, and willing to challenge. You hold high standards and aren't afraid of difficult conversations. This makes you an effective advocate and negotiator. Your growth edge is ensuring your directness builds trust rather than eroding it — especially with high-A team members.",
    leadershipHigh: "Your warmth and cooperation are powerful team-building tools. Build the habit of productive conflict — there are times when relational discomfort is the price of necessary truth. Practice holding your convictions clearly while remaining genuinely open.",
    leadershipLow: "Your directness is a genuine asset — teams need leaders who will say the hard thing. Invest in the relational warmth and empathy that earns you the right to be direct. Trust is not optional; it's the ground on which directness becomes useful.",
    crossCultural: "High Agreeableness aligns naturally with collectivist, face-saving cultures. Low Agreeableness is more valued in individualistic, direct cultures. In cross-cultural teams, the key is reading which form of directness is helpful and which is simply rude.",
  },
  {
    key: "N",
    name: "Emotional Stability",
    subtitle: "Calm under pressure & emotional resilience",
    color: "oklch(50% 0.20 310)",
    colorLight: "oklch(63% 0.15 310)",
    colorVeryLight: "oklch(94% 0.04 310)",
    bg: "oklch(16% 0.17 310)",
    icon: "◑",
    highLabel: "Sensitive",
    lowLabel: "Resilient",
    overview: "This dimension describes your emotional reactivity and resilience. Lower scores on Neuroticism reflect high emotional stability — calm under pressure, recovering quickly from setbacks. Higher scores reflect greater emotional sensitivity — you experience stress, anxiety, and mood variability more intensely. Both ends have leadership implications: stability brings calm; sensitivity brings empathy and depth.",
    highDescription: "You are emotionally sensitive and feel things deeply — stress, anxiety, and setbacks land with real weight. This sensitivity makes you attentive and empathetic, but it can also make pressure and criticism harder to carry. Your growth edge is building practices that regulate your emotional experience before it affects your team.",
    lowDescription: "You are emotionally stable, calm under pressure, and resilient in the face of setbacks. Teams experience you as a steady, regulated presence — especially when things are difficult. Your growth edge is staying attuned to the emotional experience of team members who are wired more sensitively.",
    leadershipHigh: "Build strong self-care and emotional regulation practices. Name your emotions before they name you. Your sensitivity is a gift to your team's emotional culture — make sure it is expressed with awareness, not reactivity. Find a trusted confidant outside your team for processing.",
    leadershipLow: "Your emotional stability is a genuine asset in crisis, conflict, and change. Stay curious about the emotional dynamics of your team — your natural calm can make you underestimate how much others are affected by what you take in stride.",
    crossCultural: "Emotional expression is profoundly shaped by cultural norms. In many cultures, visible emotional stability signals strength; in others, it signals coldness. High emotional sensitivity, when managed well, often reads as genuine care in relational cultures.",
  },
];

// ── COMPONENT ─────────────────────────────────────────────────────────────────

type QuizState = "idle" | "active" | "done";

function calcPct(raw: number): number {
  return Math.round(((raw - 10) / 40) * 100);
}

export default function BigFiveClient({
  isSaved: isSavedProp,
  savedScores,
}: {
  isSaved: boolean;
  savedScores: Record<string, number> | null;
}) {
  const [quizState, setQuizState] = useState<QuizState>(savedScores ? "done" : "idle");
  const [currentIdx, setCurrentIdx] = useState(0);
  const [scores, setScores] = useState<Record<string, number>>(
    savedScores ?? { O: 0, C: 0, E: 0, A: 0, N: 0 }
  );
  const [answerHistory, setAnswerHistory] = useState<{ qIdx: number; value: number; trait: string }[]>([]);
  const [isSaved, setIsSaved] = useState(isSavedProp);
  const [resultSaved, setResultSaved] = useState(!!savedScores);
  const [isPending, startTransition] = useTransition();

  function startQuiz() {
    setCurrentIdx(0);
    setScores({ O: 0, C: 0, E: 0, A: 0, N: 0 });
    setAnswerHistory([]);
    setQuizState("active");
    window.scrollTo({ top: document.getElementById("quiz-section")?.offsetTop ?? 0, behavior: "smooth" });
  }

  function handleAnswer(value: number) {
    const qIdx = QUESTION_ORDER[currentIdx];
    const q = QUESTIONS[qIdx];
    setAnswerHistory(prev => [...prev, { qIdx, value, trait: q.t }]);
    setScores(prev => ({ ...prev, [q.t]: (prev[q.t] ?? 0) + value }));
    if (currentIdx + 1 < QUESTION_ORDER.length) {
      setCurrentIdx(prev => prev + 1);
    } else {
      setQuizState("done");
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  }

  function handleBack() {
    if (currentIdx === 0) { setQuizState("idle"); return; }
    const last = answerHistory[answerHistory.length - 1];
    if (!last) return;
    setScores(prev => ({ ...prev, [last.trait]: (prev[last.trait] ?? 0) - last.value }));
    setAnswerHistory(prev => prev.slice(0, -1));
    setCurrentIdx(prev => prev - 1);
  }

  function handleSave() {
    startTransition(async () => {
      if (!isSaved) {
        await saveResourceToDashboard("big-five");
        setIsSaved(true);
      }
      const result = await saveBigFiveResult(scores);
      if (!result.error) setResultSaved(true);
    });
  }

  // ── IDLE STATE ──────────────────────────────────────────────────────────────
  if (quizState === "idle") {
    return (
      <div style={{ minHeight: "100vh", background: "oklch(98% 0.008 280)", fontFamily: "'Literata', Georgia, serif" }}>
        <style>{`
          @import url('https://fonts.googleapis.com/css2?family=Literata:ital,opsz,wght@0,7..72,300;0,7..72,400;0,7..72,500;0,7..72,600;1,7..72,400&family=Barlow:wght@400;500;600&display=swap');
          .ocean-btn { transition: all 0.18s ease; cursor: pointer; }
          .ocean-btn:hover { transform: translateY(-1px); }
          .trait-card { transition: all 0.18s ease; }
          .trait-card:hover { transform: translateY(-2px); box-shadow: 0 8px 32px oklch(52% 0.22 280 / 0.12); }
        `}</style>

        {/* Hero */}
        <div style={{ background: "oklch(22% 0.16 280)", color: "white", padding: "72px 24px 64px" }}>
          <div style={{ maxWidth: 760, margin: "0 auto" }}>
            <p style={{ fontFamily: "'Barlow', sans-serif", fontSize: 13, fontWeight: 600, letterSpacing: "0.12em", textTransform: "uppercase", color: "oklch(80% 0.12 280)", marginBottom: 20 }}>
              Personality Assessment
            </p>
            <h1 style={{ fontFamily: "'Literata', Georgia, serif", fontSize: "clamp(36px, 5vw, 58px)", fontWeight: 300, lineHeight: 1.1, marginBottom: 20, letterSpacing: "-0.02em" }}>
              The Big Five<br />
              <em style={{ fontStyle: "italic", fontWeight: 400, color: "oklch(78% 0.14 280)" }}>OCEAN Profile</em>
            </h1>
            <p style={{ fontFamily: "'Barlow', sans-serif", fontSize: 18, fontWeight: 400, lineHeight: 1.65, color: "oklch(82% 0.06 280)", maxWidth: 600 }}>
              The most scientifically validated personality framework in the world — five dimensions that predict how you lead, collaborate, adapt, and grow across every culture.
            </p>
            <button
              onClick={startQuiz}
              className="ocean-btn"
              style={{ marginTop: 36, padding: "14px 36px", background: "oklch(65% 0.22 280)", color: "white", border: "none", borderRadius: 8, fontFamily: "'Barlow', sans-serif", fontSize: 16, fontWeight: 600, letterSpacing: "0.02em" }}
            >
              Start Assessment →
            </button>
          </div>
        </div>

        <div style={{ maxWidth: 760, margin: "0 auto", padding: "56px 24px" }}>

          {/* What is Big Five */}
          <section style={{ marginBottom: 56 }}>
            <h2 style={{ fontFamily: "'Literata', Georgia, serif", fontSize: 28, fontWeight: 400, color: "oklch(22% 0.16 280)", marginBottom: 16 }}>
              What is the Big Five?
            </h2>
            <p style={{ fontFamily: "'Barlow', sans-serif", fontSize: 16, lineHeight: 1.75, color: "oklch(30% 0.05 280)", marginBottom: 16 }}>
              The Big Five — also known as the OCEAN model — emerged from decades of research across cultures, languages, and demographics. Unlike personality typologies that force you into one of sixteen boxes, the Big Five measures five continuous dimensions. You receive a unique score on each, creating a personality profile that is genuinely yours.
            </p>
            <p style={{ fontFamily: "'Barlow', sans-serif", fontSize: 16, lineHeight: 1.75, color: "oklch(30% 0.05 280)" }}>
              It is the framework most widely used in cross-cultural leadership research, making it especially relevant if you lead across national or organisational cultures. Understanding your profile helps you lead with greater self-awareness — and understand the people on your team with greater depth.
            </p>
          </section>

          {/* The 5 traits */}
          <section style={{ marginBottom: 56 }}>
            <h2 style={{ fontFamily: "'Literata', Georgia, serif", fontSize: 28, fontWeight: 400, color: "oklch(22% 0.16 280)", marginBottom: 8 }}>
              The Five Dimensions
            </h2>
            <p style={{ fontFamily: "'Barlow', sans-serif", fontSize: 15, color: "oklch(45% 0.06 280)", marginBottom: 28 }}>
              Each dimension exists on a spectrum — neither end is superior. Effective leaders understand where they sit and what that means for how they lead.
            </p>
            <div style={{ display: "grid", gap: 16 }}>
              {TRAITS.map(trait => (
                <div key={trait.key} className="trait-card" style={{ background: "white", borderRadius: 12, padding: "24px 28px", border: `1px solid ${trait.colorVeryLight}` }}>
                  <div style={{ display: "flex", alignItems: "flex-start", gap: 16 }}>
                    <div style={{ width: 48, height: 48, borderRadius: 10, background: trait.colorVeryLight, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, color: trait.color, fontSize: 22, fontWeight: 700 }}>
                      {trait.key}
                    </div>
                    <div>
                      <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 6 }}>
                        <span style={{ fontFamily: "'Literata', Georgia, serif", fontSize: 20, fontWeight: 500, color: "oklch(18% 0.10 280)" }}>{trait.name}</span>
                        <span style={{ fontFamily: "'Barlow', sans-serif", fontSize: 12, color: trait.color, fontWeight: 600, letterSpacing: "0.06em", textTransform: "uppercase" }}>{trait.subtitle}</span>
                      </div>
                      <p style={{ fontFamily: "'Barlow', sans-serif", fontSize: 15, lineHeight: 1.65, color: "oklch(35% 0.06 280)", margin: 0 }}>{trait.overview}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* How to take */}
          <section style={{ background: "white", borderRadius: 16, padding: "32px 36px", border: "1px solid oklch(90% 0.05 280)" }}>
            <h2 style={{ fontFamily: "'Literata', Georgia, serif", fontSize: 22, fontWeight: 500, color: "oklch(22% 0.16 280)", marginBottom: 16 }}>
              How to take this assessment
            </h2>
            <div style={{ display: "grid", gap: 10 }}>
              {[
                ["50 statements", "Rate each on a 5-point scale from Strongly Disagree to Strongly Agree."],
                ["Be honest, not aspirational", "Describe how you actually are — not how you'd like to be or think you should be."],
                ["No right answers", "Every profile has genuine strengths. This is not a pass/fail test."],
                ["Takes about 8–10 minutes", "Find a quiet moment. Rushed answers produce less accurate profiles."],
              ].map(([label, desc]) => (
                <div key={label} style={{ display: "flex", gap: 12, alignItems: "flex-start", padding: "10px 0", borderBottom: "1px solid oklch(95% 0.03 280)" }}>
                  <div style={{ width: 6, height: 6, borderRadius: "50%", background: "oklch(52% 0.22 280)", marginTop: 8, flexShrink: 0 }} />
                  <div>
                    <span style={{ fontFamily: "'Barlow', sans-serif", fontSize: 15, fontWeight: 600, color: "oklch(22% 0.10 280)" }}>{label} — </span>
                    <span style={{ fontFamily: "'Barlow', sans-serif", fontSize: 15, color: "oklch(38% 0.06 280)" }}>{desc}</span>
                  </div>
                </div>
              ))}
            </div>
            <button
              onClick={startQuiz}
              className="ocean-btn"
              style={{ marginTop: 28, padding: "13px 32px", background: "oklch(22% 0.16 280)", color: "white", border: "none", borderRadius: 8, fontFamily: "'Barlow', sans-serif", fontSize: 15, fontWeight: 600 }}
            >
              Begin the Assessment
            </button>
          </section>
        </div>
      </div>
    );
  }

  // ── ACTIVE STATE ─────────────────────────────────────────────────────────────
  if (quizState === "active") {
    const qIdx = QUESTION_ORDER[currentIdx];
    const q = QUESTIONS[qIdx];
    const trait = TRAITS.find(t => t.key === q.t)!;
    const progress = ((currentIdx) / QUESTION_ORDER.length) * 100;

    return (
      <div id="quiz-section" style={{ minHeight: "100vh", background: "oklch(98% 0.008 280)", fontFamily: "'Barlow', sans-serif" }}>
        <style>{`
          @import url('https://fonts.googleapis.com/css2?family=Literata:ital,opsz,wght@0,7..72,300;0,7..72,400;0,7..72,500;1,7..72,400&family=Barlow:wght@400;500;600&display=swap');
          .scale-btn { transition: all 0.15s ease; cursor: pointer; border: 2px solid oklch(88% 0.04 280); background: white; border-radius: 10px; padding: 14px 8px; }
          .scale-btn:hover { border-color: var(--trait-color); background: var(--trait-vl); transform: translateY(-2px); }
        `}</style>

        <div style={{ maxWidth: 680, margin: "0 auto", padding: "40px 24px" }}>
          {/* Progress */}
          <div style={{ marginBottom: 40 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
              <span style={{ fontSize: 13, color: "oklch(50% 0.08 280)", fontWeight: 500 }}>
                {currentIdx + 1} / {QUESTION_ORDER.length}
              </span>
              <span style={{ fontSize: 13, fontWeight: 600, color: trait.color }}>
                {trait.name}
              </span>
            </div>
            <div style={{ height: 4, background: "oklch(90% 0.04 280)", borderRadius: 4, overflow: "hidden" }}>
              <div style={{ height: "100%", width: `${progress}%`, background: trait.color, borderRadius: 4, transition: "width 0.3s ease" }} />
            </div>
          </div>

          {/* Question */}
          <div style={{ background: "white", borderRadius: 20, padding: "40px", border: "1px solid oklch(92% 0.04 280)", marginBottom: 32, minHeight: 180, display: "flex", alignItems: "center" }}>
            <p style={{ fontFamily: "'Literata', Georgia, serif", fontSize: "clamp(18px, 2.5vw, 22px)", lineHeight: 1.55, color: "oklch(18% 0.10 280)", margin: 0, fontWeight: 400 }}>
              {q.text}
            </p>
          </div>

          {/* Scale */}
          <div
            style={{ display: "grid", gridTemplateColumns: "repeat(5, 1fr)", gap: 8, marginBottom: 32 } as React.CSSProperties}
          >
            {SCALE_LABELS.map((label, i) => (
              <button
                key={i}
                className="scale-btn"
                onClick={() => handleAnswer(i + 1)}
                style={{ "--trait-color": trait.color, "--trait-vl": trait.colorVeryLight, textAlign: "center", flexDirection: "column", display: "flex", alignItems: "center", justifyContent: "center", gap: 8 } as React.CSSProperties}
              >
                <span style={{ fontFamily: "'Literata', serif", fontSize: 22, fontWeight: 300, color: trait.colorLight }}>
                  {i + 1}
                </span>
                <span style={{ fontSize: 11, fontWeight: 500, color: "oklch(45% 0.06 280)", lineHeight: 1.3 }}>
                  {label}
                </span>
              </button>
            ))}
          </div>

          <button
            onClick={handleBack}
            style={{ background: "transparent", border: "none", color: "oklch(55% 0.08 280)", fontFamily: "'Barlow', sans-serif", fontSize: 14, cursor: "pointer", padding: "8px 0" }}
          >
            ← Back
          </button>
        </div>
      </div>
    );
  }

  // ── DONE STATE ───────────────────────────────────────────────────────────────
  // Convert raw scores to percentages; invert N for "Emotional Stability"
  const pcts: Record<string, number> = {};
  TRAITS.forEach(t => {
    const raw = scores[t.key] ?? 10;
    pcts[t.key] = calcPct(raw);
  });
  const stabilityPct = 100 - pcts.N;

  // Dominant trait (excluding N, use Stability)
  const ranked = TRAITS.map(t => ({
    ...t,
    displayPct: t.key === "N" ? stabilityPct : pcts[t.key],
  })).sort((a, b) => b.displayPct - a.displayPct);

  function pctLabel(pct: number): string {
    if (pct >= 75) return "High";
    if (pct >= 55) return "Moderately High";
    if (pct >= 45) return "Moderate";
    if (pct >= 25) return "Moderately Low";
    return "Low";
  }

  return (
    <div style={{ minHeight: "100vh", background: "oklch(98% 0.008 280)", fontFamily: "'Barlow', sans-serif" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Literata:ital,opsz,wght@0,7..72,300;0,7..72,400;0,7..72,500;1,7..72,400&family=Barlow:wght@400;500;600&display=swap');
        .bar-fill { transition: width 1s cubic-bezier(0.4,0,0.2,1); }
        .result-section { transition: all 0.18s ease; }
      `}</style>

      {/* Header */}
      <div style={{ background: "oklch(22% 0.16 280)", color: "white", padding: "56px 24px 48px" }}>
        <div style={{ maxWidth: 760, margin: "0 auto" }}>
          <p style={{ fontFamily: "'Barlow', sans-serif", fontSize: 13, fontWeight: 600, letterSpacing: "0.12em", textTransform: "uppercase", color: "oklch(70% 0.12 280)", marginBottom: 16 }}>
            Your Big Five Profile
          </p>
          <h1 style={{ fontFamily: "'Literata', Georgia, serif", fontSize: "clamp(28px, 4vw, 44px)", fontWeight: 300, lineHeight: 1.15, letterSpacing: "-0.02em", marginBottom: 16 }}>
            Your OCEAN Results
          </h1>
          <p style={{ fontFamily: "'Barlow', sans-serif", fontSize: 15, color: "oklch(78% 0.06 280)", lineHeight: 1.6, maxWidth: 560 }}>
            Your profile shows where you sit on each of the five dimensions. Remember: no score is better or worse — each position has unique leadership strengths.
          </p>
        </div>
      </div>

      <div style={{ maxWidth: 760, margin: "0 auto", padding: "48px 24px" }}>

        {/* Score bars */}
        <section style={{ marginBottom: 48 }}>
          <h2 style={{ fontFamily: "'Literata', Georgia, serif", fontSize: 24, fontWeight: 400, color: "oklch(22% 0.16 280)", marginBottom: 24 }}>
            Your Five Dimensions
          </h2>
          <div style={{ display: "grid", gap: 20 }}>
            {TRAITS.map(trait => {
              const displayPct = trait.key === "N" ? stabilityPct : pcts[trait.key];
              const label = trait.key === "N" ? "Emotional Stability" : trait.name;
              const rawLabel = trait.key === "N"
                ? (stabilityPct >= 50 ? trait.lowLabel : trait.highLabel)
                : (displayPct >= 50 ? trait.highLabel : trait.lowLabel);
              return (
                <div key={trait.key} style={{ background: "white", borderRadius: 14, padding: "24px 28px", border: "1px solid oklch(92% 0.04 280)" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                      <div style={{ width: 36, height: 36, borderRadius: 8, background: trait.colorVeryLight, display: "flex", alignItems: "center", justifyContent: "center", color: trait.color, fontSize: 14, fontWeight: 700 }}>
                        {trait.key}
                      </div>
                      <div>
                        <div style={{ fontFamily: "'Literata', Georgia, serif", fontSize: 17, fontWeight: 500, color: "oklch(20% 0.10 280)" }}>{label}</div>
                        <div style={{ fontSize: 12, color: "oklch(50% 0.08 280)" }}>{trait.subtitle}</div>
                      </div>
                    </div>
                    <div style={{ textAlign: "right" }}>
                      <div style={{ fontSize: 26, fontWeight: 600, color: trait.color }}>{displayPct}%</div>
                      <div style={{ fontSize: 12, fontWeight: 500, color: trait.colorLight }}>{pctLabel(displayPct)} · {rawLabel}</div>
                    </div>
                  </div>
                  {/* Bar */}
                  <div style={{ height: 8, background: "oklch(93% 0.03 280)", borderRadius: 8, overflow: "hidden" }}>
                    <div className="bar-fill" style={{ height: "100%", width: `${displayPct}%`, background: `linear-gradient(90deg, ${trait.colorLight}, ${trait.color})`, borderRadius: 8 }} />
                  </div>
                  {/* Low–High labels */}
                  <div style={{ display: "flex", justifyContent: "space-between", marginTop: 6 }}>
                    <span style={{ fontSize: 11, color: "oklch(55% 0.06 280)" }}>{trait.key === "N" ? trait.highLabel : trait.lowLabel}</span>
                    <span style={{ fontSize: 11, color: "oklch(55% 0.06 280)" }}>{trait.key === "N" ? trait.lowLabel : trait.highLabel}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* Per-trait insights */}
        <section style={{ marginBottom: 48 }}>
          <h2 style={{ fontFamily: "'Literata', Georgia, serif", fontSize: 24, fontWeight: 400, color: "oklch(22% 0.16 280)", marginBottom: 24 }}>
            What Your Scores Mean
          </h2>
          <div style={{ display: "grid", gap: 20 }}>
            {TRAITS.map(trait => {
              const displayPct = trait.key === "N" ? stabilityPct : pcts[trait.key];
              const isHigh = displayPct >= 50;
              const description = isHigh ? (trait.key === "N" ? trait.lowDescription : trait.highDescription) : (trait.key === "N" ? trait.highDescription : trait.lowDescription);
              const leadership = isHigh ? (trait.key === "N" ? trait.leadershipLow : trait.leadershipHigh) : (trait.key === "N" ? trait.leadershipHigh : trait.leadershipLow);
              const label = trait.key === "N" ? "Emotional Stability" : trait.name;
              return (
                <div key={trait.key} style={{ background: "white", borderRadius: 16, overflow: "hidden", border: "1px solid oklch(92% 0.04 280)" }}>
                  <div style={{ padding: "20px 24px", background: trait.colorVeryLight, borderBottom: `1px solid oklch(88% 0.04 280)` }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                      <div style={{ width: 10, height: 10, borderRadius: "50%", background: trait.color }} />
                      <span style={{ fontFamily: "'Literata', Georgia, serif", fontSize: 18, fontWeight: 500, color: "oklch(18% 0.12 280)" }}>{label}</span>
                      <span style={{ marginLeft: "auto", fontFamily: "'Barlow', sans-serif", fontSize: 14, fontWeight: 600, color: trait.color }}>{displayPct}% — {pctLabel(displayPct)}</span>
                    </div>
                  </div>
                  <div style={{ padding: "24px" }}>
                    <p style={{ fontSize: 15, lineHeight: 1.7, color: "oklch(28% 0.06 280)", marginBottom: 20 }}>{description}</p>
                    <div style={{ background: "oklch(97% 0.015 280)", borderRadius: 10, padding: "16px 20px" }}>
                      <p style={{ fontSize: 13, fontWeight: 600, color: trait.color, letterSpacing: "0.06em", textTransform: "uppercase", marginBottom: 8 }}>Leadership Edge</p>
                      <p style={{ fontSize: 15, lineHeight: 1.65, color: "oklch(32% 0.06 280)", margin: 0 }}>{leadership}</p>
                    </div>
                    <div style={{ marginTop: 16, background: "oklch(97% 0.015 280)", borderRadius: 10, padding: "16px 20px" }}>
                      <p style={{ fontSize: 13, fontWeight: 600, color: "oklch(45% 0.06 280)", letterSpacing: "0.06em", textTransform: "uppercase", marginBottom: 8 }}>Cross-Cultural Awareness</p>
                      <p style={{ fontSize: 15, lineHeight: 1.65, color: "oklch(32% 0.06 280)", margin: 0 }}>{trait.crossCultural}</p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* Your Dominant Strength */}
        <section style={{ background: "oklch(22% 0.16 280)", borderRadius: 20, padding: "36px 40px", color: "white", marginBottom: 40 }}>
          <p style={{ fontFamily: "'Barlow', sans-serif", fontSize: 13, fontWeight: 600, letterSpacing: "0.12em", textTransform: "uppercase", color: "oklch(70% 0.12 280)", marginBottom: 12 }}>
            Most Distinctive Trait
          </p>
          <h2 style={{ fontFamily: "'Literata', Georgia, serif", fontSize: "clamp(24px, 3vw, 34px)", fontWeight: 300, marginBottom: 16, letterSpacing: "-0.01em" }}>
            {ranked[0].key === "N" ? "Emotional Stability" : ranked[0].name}
          </h2>
          <p style={{ fontFamily: "'Barlow', sans-serif", fontSize: 16, lineHeight: 1.7, color: "oklch(82% 0.06 280)", maxWidth: 540 }}>
            {ranked[0].displayPct >= 50
              ? (ranked[0].key === "N" ? ranked[0].lowDescription : ranked[0].highDescription)
              : (ranked[0].key === "N" ? ranked[0].highDescription : ranked[0].lowDescription)}
          </p>
        </section>

        {/* Save / Retake */}
        <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
          {!resultSaved && (
            <button
              onClick={handleSave}
              disabled={isPending}
              style={{ padding: "13px 28px", background: "oklch(52% 0.22 280)", color: "white", border: "none", borderRadius: 8, fontFamily: "'Barlow', sans-serif", fontSize: 15, fontWeight: 600, cursor: "pointer", opacity: isPending ? 0.7 : 1 }}
            >
              {isPending ? "Saving…" : "Save to Dashboard"}
            </button>
          )}
          {resultSaved && (
            <div style={{ padding: "13px 20px", background: "oklch(92% 0.05 155)", color: "oklch(35% 0.14 155)", borderRadius: 8, fontFamily: "'Barlow', sans-serif", fontSize: 15, fontWeight: 600 }}>
              ✓ Saved to your dashboard
            </div>
          )}
          <button
            onClick={startQuiz}
            style={{ padding: "13px 28px", background: "white", color: "oklch(35% 0.10 280)", border: "2px solid oklch(85% 0.05 280)", borderRadius: 8, fontFamily: "'Barlow', sans-serif", fontSize: 15, fontWeight: 600, cursor: "pointer" }}
          >
            Retake Assessment
          </button>
        </div>
      </div>
    </div>
  );
}

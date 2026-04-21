"use client";

import { useState, useTransition } from "react";
import { saveResourceToDashboard, saveEnneagramResult } from "../actions";

// ── QUESTIONS ─────────────────────────────────────────────────────────────────
// 45 statements (5 per type). Field `t` = Enneagram type number (1-9).
// Rated 1–5: 1 = Not like me → 5 = Very much like me.

const QUESTIONS = [
  // Type 1 — The Reformer
  { text: "I hold myself and others to high standards and feel responsible for doing things the right way.", t: 1 },
  { text: "I notice flaws and imperfections quickly — in myself, others, or situations.", t: 1 },
  { text: "There is a persistent inner critic in my mind that holds me accountable.", t: 1 },
  { text: "I feel a strong sense of purpose tied to making things better or more just.", t: 1 },
  { text: "When people around me cut corners or ignore ethical standards, I feel frustrated and responsible to address it.", t: 1 },
  // Type 2 — The Helper
  { text: "I naturally sense what others need and feel pulled to provide it.", t: 2 },
  { text: "My sense of worth is closely tied to being needed and appreciated by others.", t: 2 },
  { text: "I find it easier to give than to receive — asking for help feels uncomfortable.", t: 2 },
  { text: "I adapt my behaviour to what will make the people I care about feel good.", t: 2 },
  { text: "People often come to me for emotional support, and I rarely turn them away.", t: 2 },
  // Type 3 — The Achiever
  { text: "Accomplishing goals and being seen as successful is very important to me.", t: 3 },
  { text: "I can adapt my style and presentation depending on what the situation or audience requires.", t: 3 },
  { text: "I feel most alive when I am making progress, completing tasks, and being productive.", t: 3 },
  { text: "I am aware of how others perceive me and work to maintain a positive, competent image.", t: 3 },
  { text: "I tend to measure my value by what I achieve and struggle to slow down without feeling guilty.", t: 3 },
  // Type 4 — The Individualist
  { text: "I often feel that something is missing — a sense of incompleteness or deep longing.", t: 4 },
  { text: "I have deep and intense emotions that others don't always understand.", t: 4 },
  { text: "I value authenticity and originality highly — being ordinary or typical feels suffocating.", t: 4 },
  { text: "I am drawn to what is meaningful, beautiful, and emotionally significant.", t: 4 },
  { text: "I can experience mood swings and sometimes feel fundamentally different from those around me.", t: 4 },
  // Type 5 — The Investigator
  { text: "I prefer to observe and think deeply before joining a conversation or making a decision.", t: 5 },
  { text: "I protect my energy and time carefully and need significant alone time to recharge.", t: 5 },
  { text: "I feel most confident when I have built deep knowledge and expertise in an area.", t: 5 },
  { text: "Emotionally intense situations feel draining — I prefer engaging with ideas over strong feelings.", t: 5 },
  { text: "I tend to minimise my needs so I don't feel dependent on or overwhelmed by others.", t: 5 },
  // Type 6 — The Loyalist
  { text: "I tend to anticipate problems and mentally prepare for what could go wrong.", t: 6 },
  { text: "Trust must be earned — I can be skeptical of authority or new people until I feel certain.", t: 6 },
  { text: "I feel most secure within trusted relationships, clear structures, and reliable expectations.", t: 6 },
  { text: "Once I commit to a person or cause, I am deeply loyal and show up consistently.", t: 6 },
  { text: "I experience underlying anxiety about security and sometimes struggle to fully trust my own judgment.", t: 6 },
  // Type 7 — The Enthusiast
  { text: "I am energised by new ideas, possibilities, and experiences — life feels most alive when things are fresh.", t: 7 },
  { text: "I find it hard to stay with discomfort or boredom for long — I tend to reframe or move on.", t: 7 },
  { text: "I have many interests and ideas, and I sometimes start more things than I finish.", t: 7 },
  { text: "I prefer to keep my options open and find restrictions or firm commitments uncomfortable.", t: 7 },
  { text: "I naturally see the positive in situations and become restless when life feels too routine.", t: 7 },
  // Type 8 — The Challenger
  { text: "I take charge naturally and am comfortable confronting situations or people that feel unjust.", t: 8 },
  { text: "Vulnerability feels uncomfortable — I prefer to project strength and stay in control.", t: 8 },
  { text: "I can be intense and others sometimes experience me as too direct, too forceful, or too much.", t: 8 },
  { text: "I feel called to protect people who are vulnerable and to fight for what is right.", t: 8 },
  { text: "I go all-in on what I believe in — half-measures and timidity frustrate me deeply.", t: 8 },
  // Type 9 — The Peacemaker
  { text: "I find conflict deeply uncomfortable and naturally try to mediate or smooth things over.", t: 9 },
  { text: "I can lose sight of my own priorities when I am busy supporting others.", t: 9 },
  { text: "I see all sides of an issue and can find it hard to take a strong personal stance.", t: 9 },
  { text: "People find me easy to be around — I have a calming, reassuring presence.", t: 9 },
  { text: "I can procrastinate on things that matter to me personally while remaining productive for others.", t: 9 },
];

// Round-robin question order: interleaves all 9 types (type1q1, type2q1, ..., type9q1, type1q2, ...)
const QUESTION_ORDER = [
  0, 5, 10, 15, 20, 25, 30, 35, 40,
  1, 6, 11, 16, 21, 26, 31, 36, 41,
  2, 7, 12, 17, 22, 27, 32, 37, 42,
  3, 8, 13, 18, 23, 28, 33, 38, 43,
  4, 9, 14, 19, 24, 29, 34, 39, 44,
];

const SCALE_LABELS = ["Not like me", "Slightly like me", "Somewhat like me", "Mostly like me", "Very much like me"];

// ── TYPE DATA ─────────────────────────────────────────────────────────────────

const TYPES = [
  {
    number: 1,
    name: "The Reformer",
    tagline: "Principled. Purposeful. Committed to what's right.",
    color: "oklch(52% 0.18 250)",
    colorLight: "oklch(65% 0.14 250)",
    colorVeryLight: "oklch(94% 0.03 250)",
    bg: "oklch(18% 0.14 250)",
    overview: "The Type 1 leader is driven by a deep sense of purpose and a commitment to integrity. They hold themselves and others to high standards, work hard to improve what's broken, and lead by example. Their inner conviction is one of their greatest strengths — and their greatest source of internal pressure.",
    motivation: "To be good, ethical, and right — to improve the world and act with integrity.",
    fear: "Being flawed, corrupt, or condemned — being a hypocrite who fails to live up to their own ideals.",
    strengths: ["Principled and deeply ethical", "High standards and consistent follow-through", "Brings clarity to values and expectations", "Self-disciplined and hardworking", "Natural reformer — always working to improve"],
    blindspots: ["Can be overly self-critical and perfectionistic", "May judge others harshly against their internal standards", "Resentment builds when expectations aren't met", "Struggles to celebrate progress — always focused on what's still wrong"],
    communication: "Be logical, calm, and ethical. Show respect for their standards. Don't ask them to cut corners. Acknowledge their effort and intentions before giving feedback — they are harder on themselves than you could ever be.",
    crossCultural: "The Type 1's strong sense of right and wrong can create friction in high-context or relationally oriented cultures where truth is navigated, not declared. Growth edge: holding conviction with grace — learning to influence through relationship and humility, not just principle.",
    wing9: "1w9 — The Idealist: More introverted and philosophical. Their convictions run deep but are held more quietly. They combine principle with patience and can seem detached from emotion.",
    wing2: "1w2 — The Advocate: More outwardly oriented and people-focused. They apply their high standards in service of others, becoming teachers, advocates, and reformers with a warm edge.",
  },
  {
    number: 2,
    name: "The Helper",
    tagline: "Generous. Warm. Relationally attentive.",
    color: "oklch(52% 0.18 10)",
    colorLight: "oklch(65% 0.14 10)",
    colorVeryLight: "oklch(94% 0.04 10)",
    bg: "oklch(18% 0.14 10)",
    overview: "The Type 2 leader leads through relationship. They are warm, empathetic, and genuinely invested in the people around them. They are often the emotional glue of a team — present, attentive, and generous with their time and energy. Their growth edge is learning to lead from their own needs and calling, not just in response to others'.",
    motivation: "To be loved, needed, and appreciated — to feel that their giving makes them indispensable.",
    fear: "Being unwanted, unloved, or rejected — being seen as a burden rather than a gift.",
    strengths: ["Deep empathy and relational intelligence", "Serves others generously and joyfully", "Creates warmth and belonging in teams", "Builds loyalty through genuine care", "Natural encourager — people feel valued around them"],
    blindspots: ["Can neglect their own needs and then feel resentful", "Struggles with boundaries — saying no feels unloving", "Can become indirect or manipulative when feeling unappreciated", "Emotional health depends heavily on others' responses"],
    communication: "Be warm, personal, and appreciative. Acknowledge the person before the task. Express genuine gratitude — it fuels them. Avoid being cold or transactional — they read relational temperature in everything.",
    crossCultural: "The Type 2's warmth is a gift in relational cultures. In task-focused or emotionally reserved contexts, learning to deliver results without over-personalising is key. Across cultures, the form of care varies — be careful not to impose your version of love on others.",
    wing1: "2w1 — The Servant: More principled and self-demanding. They combine generous giving with a strong moral framework. Their service has a mission quality — they give because it is the right thing to do.",
    wing3: "2w3 — The Host: More image-conscious and outgoing. They love to be seen as helpful and connect helping with their public identity. Warmth meets ambition in how they serve.",
  },
  {
    number: 3,
    name: "The Achiever",
    tagline: "Driven. Adaptable. Naturally effective.",
    color: "oklch(55% 0.18 65)",
    colorLight: "oklch(68% 0.14 65)",
    colorVeryLight: "oklch(94% 0.04 65)",
    bg: "oklch(18% 0.12 65)",
    overview: "The Type 3 leader is a high performer who adapts, executes, and delivers. They are natural motivators who lead by example, setting the pace through visible achievement. They bring energy and efficiency to every team they join. Their growth edge is learning that who they are matters more than what they accomplish.",
    motivation: "To be valuable and admired — to be recognized for their accomplishments and seen as outstanding.",
    fear: "Being worthless or failing publicly — being exposed as a fraud beneath the achievements.",
    strengths: ["Highly effective and results-driven", "Adapts naturally to different contexts and audiences", "Motivates others through visible achievement", "Energetic and focused under pressure", "Communicates vision and goals with clarity and persuasion"],
    blindspots: ["Can prioritize image over authenticity", "May lose touch with genuine emotions in pursuit of goals", "Can push people too hard to perform", "Struggles to slow down and simply 'be' without an agenda"],
    communication: "Be efficient and outcome-focused. Show them the path to success. Acknowledge their achievements specifically. Avoid making them feel like they're underperforming — they take it to heart.",
    crossCultural: "The Type 3's drive and efficiency is valued in performance-oriented cultures. In relational or shame-based cultures, the pressure to appear successful can amplify unhealthy patterns. Growth edge: prioritizing authentic relationships over impressive outcomes — being known, not just admired.",
    wing2: "3w2 — The Charmer: More people-focused and relational. They achieve through connection, combining effectiveness with genuine warmth. Success means winning people as much as results.",
    wing4: "3w4 — The Professional: More introspective and concerned with depth. They want to achieve something meaningful, not just impressive. Combines ambition with the desire to express something true.",
  },
  {
    number: 4,
    name: "The Individualist",
    tagline: "Expressive. Authentic. Emotionally deep.",
    color: "oklch(48% 0.22 295)",
    colorLight: "oklch(62% 0.17 295)",
    colorVeryLight: "oklch(94% 0.04 295)",
    bg: "oklch(16% 0.18 295)",
    overview: "The Type 4 leader brings depth, creativity, and emotional intelligence to everything they do. They long to be truly known and to express something genuine. They are drawn to meaning, beauty, and authenticity — and they help teams access the deeper 'why' behind the work. Their growth edge is finding identity in what they share with others, not just what makes them different.",
    motivation: "To find and express their unique identity — to be truly seen and understood for who they are at the deepest level.",
    fear: "Having no identity or personal significance — being ordinary, flawed, or fundamentally deficient.",
    strengths: ["Deep empathy and emotional intelligence", "Brings authenticity and meaning to their work", "Creative and original thinker", "Helps teams explore the deeper 'why'", "Connects at a soul level with people who are hurting"],
    blindspots: ["Can become absorbed in their own emotional landscape", "May envy others who seem to have what they lack", "Can withdraw or become dramatic when misunderstood", "Mood fluctuations affect team consistency"],
    communication: "Acknowledge their uniqueness and depth. Don't rush them to 'get over it' emotionally. Create space for genuine expression. They respond to authenticity — don't be performative or shallow around them.",
    crossCultural: "The Type 4's focus on individual uniqueness can clash with collectivist cultures where the group is primary. Growth edge: learning to find meaning through community and shared identity — discovering that 'we' can be just as deep as 'I'.",
    wing3: "4w3 — The Aristocrat: More driven and image-aware. Combines depth with ambition. Wants their uniqueness to be not just felt but seen and recognised. Often highly creative and publicly expressive.",
    wing5: "4w5 — The Bohemian: More withdrawn and intellectual. Combines emotional depth with a need to understand. Often produces rich, complex creative work in private before sharing it.",
  },
  {
    number: 5,
    name: "The Investigator",
    tagline: "Analytical. Perceptive. Expert.",
    color: "oklch(50% 0.16 195)",
    colorLight: "oklch(64% 0.12 195)",
    colorVeryLight: "oklch(94% 0.03 195)",
    bg: "oklch(18% 0.12 195)",
    overview: "The Type 5 leader is a thinker. They build deep expertise, observe before acting, and bring careful, well-researched thinking to every decision. They are often the most prepared person in the room — and they lead best when they can operate from a position of knowledge and autonomy. Their growth edge is learning to engage fully in life rather than observing from a distance.",
    motivation: "To be competent and knowledgeable — to understand the world deeply and function independently.",
    fear: "Being incompetent, helpless, or overwhelmed by the demands and intrusions of others.",
    strengths: ["Deep expertise and rigorous analytical thinking", "Objective and carefully considered perspective", "Thorough preparation and research", "Calm under pressure — not reactive or impulsive", "Holds complexity without panic or shortcuts"],
    blindspots: ["Can withdraw and become isolated from the team", "May hoard knowledge rather than sharing it generously", "Emotional vulnerability feels threatening — can seem cold", "Analysis paralysis can slow decisions past the point of usefulness"],
    communication: "Give them space to think. Don't demand immediate answers. Bring data, not just feelings. Respect their boundaries around time and energy — they are not being cold; they are being careful.",
    crossCultural: "The Type 5's preference for privacy and expertise-based authority can feel distant in highly relational cultures. Growth edge: learning to build trust through relationship, not just competence — and to engage emotionally even when it feels uncomfortable.",
    wing4: "5w4 — The Iconoclast: More emotionally expressive and creative. Combines analytical depth with aesthetic sensibility. Often produces visionary, original thinking that challenges convention.",
    wing6: "5w6 — The Problem Solver: More practically oriented and loyal. Combines deep expertise with a focus on reliability and problem-solving within trusted structures.",
  },
  {
    number: 6,
    name: "The Loyalist",
    tagline: "Loyal. Responsible. Trustworthy.",
    color: "oklch(48% 0.18 240)",
    colorLight: "oklch(62% 0.13 240)",
    colorVeryLight: "oklch(94% 0.03 240)",
    bg: "oklch(17% 0.15 240)",
    overview: "The Type 6 leader is committed, responsible, and deeply loyal to the people and causes they believe in. They are excellent at identifying risks, testing systems, and building the trust that sustains long-term teams. Their growth edge is learning to trust themselves and act despite uncertainty — moving from anxiety to courageous faithfulness.",
    motivation: "To have security, support, and certainty — to feel that they and the people they care for are safe.",
    fear: "Being abandoned, without support, or facing danger without allies — being left alone when it counts.",
    strengths: ["Deeply loyal and consistently trustworthy", "Excellent at anticipating risks and potential problems", "Builds trust through consistency and follow-through", "Committed to the team's wellbeing", "Courageous when it counts — fear activates rather than paralyses them"],
    blindspots: ["Chronic anxiety can create self-doubt and overthinking", "May test others' loyalty unnecessarily", "Ambivalent toward authority — can be too compliant or too resistant", "Worst-case thinking can block positive risk-taking"],
    communication: "Be consistent, transparent, and reliable. Reassure them with substance — not just words. Explain your reasoning. Sudden changes without explanation shake them deeply. Follow through on what you say you will do.",
    crossCultural: "The Type 6's focus on trust-building is universally valuable. In high-power-distance cultures, their ambivalence toward authority can cause confusion. Growth edge: distinguishing healthy accountability from anxious compliance or unnecessary rebellion.",
    wing5: "6w5 — The Defender: More introverted and analytical. Combines loyalty with independent thinking. Tends to test authority through careful analysis rather than emotional reaction.",
    wing7: "6w7 — The Buddy: More outgoing and playful. Combines loyalty with warmth and humour. Their anxiety takes a lighter edge — they manage uncertainty through connection and optimism.",
  },
  {
    number: 7,
    name: "The Enthusiast",
    tagline: "Visionary. Energetic. Possibility-focused.",
    color: "oklch(60% 0.18 52)",
    colorLight: "oklch(72% 0.14 52)",
    colorVeryLight: "oklch(94% 0.04 52)",
    bg: "oklch(18% 0.12 52)",
    overview: "The Type 7 leader brings energy, ideas, and irresistible forward momentum. They see possibility where others see problems and inspire teams to believe that things can be different. Their gift is keeping teams moving with joy and vision — their growth edge is learning to stay present when things are hard, rather than seeking the next new thing.",
    motivation: "To be happy, stimulated, and free — to experience everything life has to offer without being trapped in pain.",
    fear: "Being deprived, trapped, or stuck in pain and limitation — missing out on what life could be.",
    strengths: ["Visionary and generative with ideas", "Creates energy and enthusiasm in teams", "Connects disparate ideas creatively", "Resilient — bounces back quickly from setbacks", "Makes the future feel exciting and achievable"],
    blindspots: ["Can start things without finishing them", "Uses optimism and new experiences to avoid depth and difficulty", "May over-commit and under-deliver", "Struggles to be fully present in pain or loss"],
    communication: "Engage with their vision and enthusiasm first. Be positive and forward-focused. Keep it dynamic and interactive. They lose energy quickly in heavy, over-structured, or deeply analytical environments.",
    crossCultural: "The Type 7's optimism and energy is a genuine gift across cultures. In contexts where suffering and lament are processed communally, their drive to stay positive can feel dismissive. Growth edge: learning to be fully present in pain — without immediately trying to fix it or escape it.",
    wing6: "7w6 — The Entertainer: More loyal and relational. Combines enthusiasm with a commitment to community. Their energy is channelled through relationships — fun, warm, and grounding.",
    wing8: "7w8 — The Realist: More driven and assertive. Combines enthusiasm with force. Goes big on ideas and follows through with intensity. Can be charismatic and overwhelming in equal measure.",
  },
  {
    number: 8,
    name: "The Challenger",
    tagline: "Powerful. Decisive. Protective.",
    color: "oklch(50% 0.22 25)",
    colorLight: "oklch(63% 0.17 25)",
    colorVeryLight: "oklch(94% 0.04 25)",
    bg: "oklch(17% 0.16 25)",
    overview: "The Type 8 leader leads with strength, decisiveness, and intensity. They take charge, protect the vulnerable, and fight for what's right. They are energised by challenge and unafraid of confrontation. Their greatest gift is their willingness to bear the weight of leadership — their growth edge is discovering that vulnerability is not weakness but the deepest form of strength.",
    motivation: "To be self-reliant, strong, and in control of their own life — to protect themselves and those they care for.",
    fear: "Being controlled, betrayed, manipulated, or losing their power and agency.",
    strengths: ["Decisive and action-oriented", "Protects and advocates fiercely for those in their care", "Unafraid of difficult conversations and necessary conflict", "Brings strength and courage to uncertain situations", "Natural authority — people know they can rely on them"],
    blindspots: ["Can be domineering and unaware of their impact on others", "Struggles with vulnerability and admitting weakness", "Trust, once broken, is rarely restored", "Can bulldoze others in pursuit of what they believe is right"],
    communication: "Be direct, honest, and confident. Don't be passive or vague — they lose respect quickly. Earn their respect through strength, not compliance. Show them you can handle their directness without becoming defensive.",
    crossCultural: "The Type 8's directness is empowering in some cultures and deeply disrespectful in others. In shame-based or high-context cultures, their confrontational style can destroy relationships irreparably. Growth edge: learning cultural sensitivity without losing their core strength — discovering that restraint is power.",
    wing7: "8w7 — The Maverick: More energetic and adventurous. Combines strength with enthusiasm and vision. Often charismatic, bold, and future-facing — intensity with a playful edge.",
    wing9: "8w9 — The Bear: More steady and patient. Combines power with calm. Their strength is held in reserve and deployed only when necessary. Often deeply protective and surprisingly gentle.",
  },
  {
    number: 9,
    name: "The Peacemaker",
    tagline: "Peaceful. Inclusive. A steady presence.",
    color: "oklch(50% 0.15 145)",
    colorLight: "oklch(63% 0.12 145)",
    colorVeryLight: "oklch(94% 0.03 145)",
    bg: "oklch(17% 0.10 145)",
    overview: "The Type 9 leader is the unifying force of any team. They see all perspectives, create harmony, and hold space for everyone to be heard. Their calm, non-anxious presence is a profound gift in conflict-heavy environments. Their growth edge is claiming their own voice and leading with their full self — not just facilitating everyone else.",
    motivation: "To have inner peace and harmony — to stay connected with others and avoid separation or conflict.",
    fear: "Conflict, fragmentation, and being cut off from the people they love — losing their sense of inner calm.",
    strengths: ["Natural mediator and bridge-builder", "Inclusive — everyone feels heard and valued", "Calm, non-anxious presence under pressure", "Sees all sides without bias or agenda", "Holds diverse teams together with grace and steadiness"],
    blindspots: ["Can lose themselves in others' agendas and forget their own", "Procrastination and disengagement from personal priorities", "Conflict avoidance allows problems to fester unaddressed", "May go along to avoid disruption even when they deeply disagree"],
    communication: "Create space for them to share their view — they won't always volunteer it. Give them time to respond. Don't force quick decisions. And most importantly: ask them what they want, then actually wait for a real answer.",
    crossCultural: "The Type 9's harmony-seeking is deeply valued in collectivist cultures. In individualistic cultures, their reluctance to assert their own view can be misread as indecision or lack of conviction. Growth edge: claiming their voice and being willing to disrupt the peace when justice or truth demands it.",
    wing8: "9w8 — The Referee: More assertive and direct. Combines peacefulness with strength. Can step into conflict when necessary and advocate firmly, but always in service of harmony.",
    wing1: "9w1 — The Dreamer: More principled and idealistic. Combines the desire for peace with a quiet conviction about what's right. Often visionary in a gentle, long-term way.",
  },
];

// ── WING CALCULATION ──────────────────────────────────────────────────────────
// Adjacent types on the Enneagram circle: 1↔9↔8, 1↔2, 2↔3, 3↔4, 4↔5, 5↔6, 6↔7, 7↔8

function getAdjacentTypes(t: number): [number, number] {
  if (t === 1) return [9, 2];
  if (t === 9) return [8, 1];
  return [t - 1, t + 1] as [number, number];
}

function getWingDescription(primaryType: number, scores: Record<string, number>): string | null {
  const [a, b] = getAdjacentTypes(primaryType);
  const scoreA = scores[String(a)] ?? 0;
  const scoreB = scores[String(b)] ?? 0;
  const wingType = scoreA >= scoreB ? a : b;
  const type = TYPES[primaryType - 1];
  if (!type) return null;
  const typeRecord = type as unknown as Record<string, unknown>;
  if (wingType === a) return typeof typeRecord[`wing${a}`] === "string" ? (typeRecord[`wing${a}`] as string) : null;
  if (wingType === b) return typeof typeRecord[`wing${b}`] === "string" ? (typeRecord[`wing${b}`] as string) : null;
  return null;
}

// ── COMPONENT ─────────────────────────────────────────────────────────────────

type QuizState = "idle" | "active" | "done";

export default function EnneagramClient({
  isSaved: isSavedProp,
  savedType,
  savedScores,
}: {
  isSaved: boolean;
  savedType: number | null;
  savedScores: Record<string, number> | null;
}) {
  const [quizState, setQuizState] = useState<QuizState>(
    savedType && savedScores ? "done" : "idle"
  );
  const [currentIdx, setCurrentIdx] = useState(0); // index into QUESTION_ORDER
  // scores[t] = sum of ratings given for type t
  const [scores, setScores] = useState<Record<string, number>>(
    savedScores ?? { "1": 0, "2": 0, "3": 0, "4": 0, "5": 0, "6": 0, "7": 0, "8": 0, "9": 0 }
  );
  const [answerHistory, setAnswerHistory] = useState<{ questionIdx: number; value: number; type: number }[]>([]);
  const [isSaved, setIsSaved] = useState(isSavedProp);
  const [resultSaved, setResultSaved] = useState(!!savedType);
  const [expandedType, setExpandedType] = useState<number | null>(null);
  const [isPending, startTransition] = useTransition();

  function startQuiz() {
    setCurrentIdx(0);
    setScores({ "1": 0, "2": 0, "3": 0, "4": 0, "5": 0, "6": 0, "7": 0, "8": 0, "9": 0 });
    setAnswerHistory([]);
    setQuizState("active");
    window.scrollTo({ top: document.getElementById("quiz-section")?.offsetTop ?? 0, behavior: "smooth" });
  }

  function handleAnswer(value: number) {
    const questionIdx = QUESTION_ORDER[currentIdx];
    const q = QUESTIONS[questionIdx];
    const newScores = { ...scores, [String(q.t)]: (scores[String(q.t)] ?? 0) + value };
    const newHistory = [...answerHistory, { questionIdx, value, type: q.t }];
    if (currentIdx < QUESTION_ORDER.length - 1) {
      setScores(newScores);
      setAnswerHistory(newHistory);
      setCurrentIdx(currentIdx + 1);
    } else {
      setScores(newScores);
      setAnswerHistory(newHistory);
      setQuizState("done");
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  }

  function handleBack() {
    if (currentIdx === 0) return;
    const last = answerHistory[answerHistory.length - 1];
    const newScores = { ...scores, [String(last.type)]: (scores[String(last.type)] ?? 0) - last.value };
    setScores(newScores);
    setAnswerHistory(answerHistory.slice(0, -1));
    setCurrentIdx(currentIdx - 1);
  }

  function retake() {
    setQuizState("idle");
    setCurrentIdx(0);
    setScores({ "1": 0, "2": 0, "3": 0, "4": 0, "5": 0, "6": 0, "7": 0, "8": 0, "9": 0 });
    setAnswerHistory([]);
    setResultSaved(false);
  }

  function handleSave() {
    startTransition(async () => {
      const r = await saveResourceToDashboard("enneagram");
      if (!r.error) setIsSaved(true);
    });
  }

  function handleSaveResult() {
    startTransition(async () => {
      await saveEnneagramResult(primaryType.number, scores);
      setResultSaved(true);
    });
  }

  // Determine primary type (highest score)
  const sortedTypes = TYPES.slice().sort((a, b) => (scores[String(b.number)] ?? 0) - (scores[String(a.number)] ?? 0));
  const primaryType = sortedTypes[0];
  const wingDesc = quizState === "done" ? getWingDescription(primaryType.number, scores) : null;
  const maxPossible = 25; // 5 questions × max rating 5

  const currentQuestion = quizState === "active" ? QUESTIONS[QUESTION_ORDER[currentIdx]] : null;
  const progressPct = Math.round((currentIdx / QUESTION_ORDER.length) * 100);

  return (
    <>
      {/* ── HERO ── */}
      <div style={{
        background: quizState === "done" ? primaryType.bg : "oklch(17% 0.12 260)",
        padding: "4rem 2rem 3.5rem",
        transition: "background 0.6s ease",
      }}>
        <div style={{ maxWidth: "760px", margin: "0 auto" }}>
          <p style={{
            fontFamily: "var(--font-montserrat)", fontSize: "0.7rem", fontWeight: 800,
            letterSpacing: "0.22em", textTransform: "uppercase",
            color: quizState === "done" ? primaryType.colorLight : "oklch(65% 0.15 45)",
            marginBottom: "1rem",
          }}>
            Personality Assessment
          </p>
          <h1 style={{
            fontFamily: "var(--font-montserrat)", fontWeight: 800,
            fontSize: "clamp(2rem, 5vw, 3.25rem)",
            color: "oklch(97% 0.005 80)", letterSpacing: "-0.03em", lineHeight: 1.05,
            marginBottom: "1.25rem",
          }}>
            {quizState === "done"
              ? `Type ${primaryType.number} — ${primaryType.name}`
              : "Enneagram"}
          </h1>
          <p style={{
            fontFamily: "var(--font-cormorant)", fontStyle: "italic",
            fontSize: "1.15rem", color: "oklch(66% 0.04 260)", lineHeight: 1.6, maxWidth: "52ch",
          }}>
            {quizState === "done"
              ? primaryType.tagline
              : "Understand the core motivations, fears, and growth paths that shape how you lead, relate, and grow."}
          </p>

          {quizState === "idle" && (
            <div style={{ display: "flex", gap: "1rem", marginTop: "2rem", flexWrap: "wrap" }}>
              <button
                type="button"
                onClick={startQuiz}
                style={{
                  fontFamily: "var(--font-montserrat)", fontSize: "0.72rem", fontWeight: 700,
                  letterSpacing: "0.08em", textTransform: "uppercase",
                  background: "oklch(65% 0.15 45)", color: "white",
                  border: "none", padding: "0.75rem 1.75rem", cursor: "pointer",
                }}
              >
                Start Assessment →
              </button>
              {!isSaved && (
                <button
                  type="button"
                  onClick={handleSave}
                  disabled={isPending}
                  style={{
                    fontFamily: "var(--font-montserrat)", fontSize: "0.72rem", fontWeight: 700,
                    letterSpacing: "0.08em", textTransform: "uppercase",
                    background: "transparent", color: "oklch(66% 0.04 260)",
                    border: "1px solid oklch(35% 0.04 260)", padding: "0.75rem 1.75rem",
                    cursor: "pointer", opacity: isPending ? 0.5 : 1,
                  }}
                >
                  {isSaved ? "✓ Saved" : "Save to Dashboard"}
                </button>
              )}
            </div>
          )}

          {quizState === "done" && (
            <div style={{ display: "flex", gap: "1rem", marginTop: "2rem", flexWrap: "wrap" }}>
              {!resultSaved && (
                <button
                  type="button"
                  onClick={handleSaveResult}
                  disabled={isPending}
                  style={{
                    fontFamily: "var(--font-montserrat)", fontSize: "0.72rem", fontWeight: 700,
                    letterSpacing: "0.08em", textTransform: "uppercase",
                    background: "oklch(65% 0.15 45)", color: "white",
                    border: "none", padding: "0.75rem 1.75rem", cursor: "pointer",
                    opacity: isPending ? 0.5 : 1,
                  }}
                >
                  {isPending ? "Saving…" : "Save My Result →"}
                </button>
              )}
              {resultSaved && (
                <p style={{
                  fontFamily: "var(--font-montserrat)", fontSize: "0.72rem", fontWeight: 700,
                  letterSpacing: "0.08em", textTransform: "uppercase",
                  color: "oklch(62% 0.14 145)", padding: "0.75rem 0",
                }}>
                  ✓ Result saved to your dashboard
                </p>
              )}
              <button
                type="button"
                onClick={retake}
                style={{
                  fontFamily: "var(--font-montserrat)", fontSize: "0.72rem", fontWeight: 600,
                  letterSpacing: "0.07em", textTransform: "uppercase",
                  background: "transparent", color: "oklch(55% 0.04 260)",
                  border: "1px solid oklch(35% 0.04 260)", padding: "0.75rem 1.5rem", cursor: "pointer",
                }}
              >
                Retake
              </button>
            </div>
          )}
        </div>
      </div>

      {/* ── RESULTS ── */}
      {quizState === "done" && (
        <div style={{ maxWidth: "760px", margin: "0 auto", padding: "3rem 2rem" }}>

          {/* Primary type overview */}
          <div style={{
            background: primaryType.colorVeryLight,
            padding: "2rem",
            marginBottom: "2.5rem",
          }}>
            <p style={{
              fontFamily: "var(--font-montserrat)", fontSize: "0.62rem", fontWeight: 800,
              letterSpacing: "0.18em", textTransform: "uppercase",
              color: primaryType.color, marginBottom: "0.75rem",
            }}>
              Your Type
            </p>
            <p style={{
              fontFamily: "var(--font-montserrat)", fontSize: "0.95rem", fontWeight: 400,
              color: "oklch(25% 0.008 260)", lineHeight: 1.75, maxWidth: "60ch",
            }}>
              {primaryType.overview}
            </p>

            {wingDesc && (
              <p style={{
                fontFamily: "var(--font-montserrat)", fontSize: "0.82rem", fontWeight: 400,
                color: "oklch(40% 0.008 260)", lineHeight: 1.65, marginTop: "1rem",
                maxWidth: "60ch",
              }}>
                <strong style={{ fontWeight: 700, color: primaryType.color }}>Wing — </strong>
                {wingDesc}
              </p>
            )}
          </div>

          {/* All 9 scores */}
          <div style={{ marginBottom: "2.5rem" }}>
            <p style={{
              fontFamily: "var(--font-montserrat)", fontSize: "0.62rem", fontWeight: 800,
              letterSpacing: "0.18em", textTransform: "uppercase",
              color: "oklch(52% 0.008 260)", marginBottom: "1.25rem",
            }}>
              Your Score Profile
            </p>
            <div style={{ display: "flex", flexDirection: "column", gap: "0.625rem" }}>
              {sortedTypes.map((t) => {
                const score = scores[String(t.number)] ?? 0;
                const pct = Math.round((score / maxPossible) * 100);
                const isPrimary = t.number === primaryType.number;
                return (
                  <div key={t.number} style={{ display: "flex", alignItems: "center", gap: "0.875rem" }}>
                    <div style={{
                      width: "24px", flexShrink: 0,
                      fontFamily: "var(--font-montserrat)", fontSize: "0.72rem", fontWeight: isPrimary ? 800 : 500,
                      color: isPrimary ? t.color : "oklch(52% 0.008 260)", textAlign: "right",
                    }}>
                      {t.number}
                    </div>
                    <div style={{ flex: 1, background: "oklch(90% 0.005 80)", height: "6px", position: "relative" }}>
                      <div style={{
                        position: "absolute", inset: 0, right: `${100 - pct}%`,
                        background: isPrimary ? t.color : "oklch(72% 0.008 260)",
                        transition: "right 0.8s cubic-bezier(0.16, 1, 0.3, 1)",
                      }} />
                    </div>
                    <div style={{
                      width: "80px", flexShrink: 0,
                      fontFamily: "var(--font-montserrat)", fontSize: "0.68rem",
                      fontWeight: isPrimary ? 700 : 400,
                      color: isPrimary ? t.color : "oklch(55% 0.008 260)",
                    }}>
                      {t.name.replace("The ", "")}
                    </div>
                    <div style={{
                      width: "32px", flexShrink: 0, textAlign: "right",
                      fontFamily: "var(--font-montserrat)", fontSize: "0.68rem",
                      fontWeight: isPrimary ? 700 : 400,
                      color: isPrimary ? t.color : "oklch(58% 0.008 260)",
                    }}>
                      {pct}%
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Core motivation + fear */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: "1rem", marginBottom: "2.5rem" }}>
            <div style={{ background: "oklch(97.5% 0.003 80)", padding: "1.5rem", outline: "1px solid oklch(88% 0.006 80)" }}>
              <p style={{ fontFamily: "var(--font-montserrat)", fontSize: "0.6rem", fontWeight: 800, letterSpacing: "0.16em", textTransform: "uppercase", color: primaryType.color, marginBottom: "0.625rem" }}>Core Motivation</p>
              <p style={{ fontFamily: "var(--font-montserrat)", fontSize: "0.88rem", color: "oklch(28% 0.006 260)", lineHeight: 1.65 }}>{primaryType.motivation}</p>
            </div>
            <div style={{ background: "oklch(97.5% 0.003 80)", padding: "1.5rem", outline: "1px solid oklch(88% 0.006 80)" }}>
              <p style={{ fontFamily: "var(--font-montserrat)", fontSize: "0.6rem", fontWeight: 800, letterSpacing: "0.16em", textTransform: "uppercase", color: primaryType.color, marginBottom: "0.625rem" }}>Core Fear</p>
              <p style={{ fontFamily: "var(--font-montserrat)", fontSize: "0.88rem", color: "oklch(28% 0.006 260)", lineHeight: 1.65 }}>{primaryType.fear}</p>
            </div>
          </div>

          {/* Strengths + blindspots */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: "1rem", marginBottom: "2.5rem" }}>
            <div>
              <p style={{ fontFamily: "var(--font-montserrat)", fontSize: "0.6rem", fontWeight: 800, letterSpacing: "0.16em", textTransform: "uppercase", color: "oklch(48% 0.14 145)", marginBottom: "0.75rem" }}>Strengths</p>
              <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                {primaryType.strengths.map((s, i) => (
                  <li key={i} style={{ display: "flex", gap: "0.625rem", alignItems: "flex-start" }}>
                    <span style={{ color: "oklch(52% 0.14 145)", fontWeight: 700, flexShrink: 0, marginTop: "0.1rem" }}>✓</span>
                    <span style={{ fontFamily: "var(--font-montserrat)", fontSize: "0.875rem", color: "oklch(28% 0.006 260)", lineHeight: 1.5 }}>{s}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <p style={{ fontFamily: "var(--font-montserrat)", fontSize: "0.6rem", fontWeight: 800, letterSpacing: "0.16em", textTransform: "uppercase", color: "oklch(52% 0.18 25)", marginBottom: "0.75rem" }}>Growth Areas</p>
              <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                {primaryType.blindspots.map((s, i) => (
                  <li key={i} style={{ display: "flex", gap: "0.625rem", alignItems: "flex-start" }}>
                    <span style={{ color: "oklch(55% 0.18 45)", fontWeight: 700, flexShrink: 0, marginTop: "0.1rem" }}>→</span>
                    <span style={{ fontFamily: "var(--font-montserrat)", fontSize: "0.875rem", color: "oklch(28% 0.006 260)", lineHeight: 1.5 }}>{s}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Communication + cross-cultural */}
          <div style={{ display: "flex", flexDirection: "column", gap: "1rem", marginBottom: "2.5rem" }}>
            <div style={{ background: "oklch(97.5% 0.003 80)", padding: "1.5rem", outline: "1px solid oklch(88% 0.006 80)" }}>
              <p style={{ fontFamily: "var(--font-montserrat)", fontSize: "0.6rem", fontWeight: 800, letterSpacing: "0.16em", textTransform: "uppercase", color: primaryType.color, marginBottom: "0.625rem" }}>How to Communicate with This Type</p>
              <p style={{ fontFamily: "var(--font-montserrat)", fontSize: "0.875rem", color: "oklch(28% 0.006 260)", lineHeight: 1.7 }}>{primaryType.communication}</p>
            </div>
            <div style={{ background: "oklch(97.5% 0.003 80)", padding: "1.5rem", outline: "1px solid oklch(88% 0.006 80)" }}>
              <p style={{ fontFamily: "var(--font-montserrat)", fontSize: "0.6rem", fontWeight: 800, letterSpacing: "0.16em", textTransform: "uppercase", color: primaryType.color, marginBottom: "0.625rem" }}>Cross-Cultural Leadership</p>
              <p style={{ fontFamily: "var(--font-montserrat)", fontSize: "0.875rem", color: "oklch(28% 0.006 260)", lineHeight: 1.7 }}>{primaryType.crossCultural}</p>
            </div>
          </div>

          {/* All 9 types expandable */}
          <div style={{ borderTop: "1px solid oklch(88% 0.006 80)", paddingTop: "2rem" }}>
            <p style={{ fontFamily: "var(--font-montserrat)", fontSize: "0.62rem", fontWeight: 800, letterSpacing: "0.18em", textTransform: "uppercase", color: "oklch(52% 0.008 260)", marginBottom: "1.25rem" }}>
              All Nine Types
            </p>
            <div style={{ display: "flex", flexDirection: "column", gap: "0" }}>
              {TYPES.map((t) => {
                const isExpanded = expandedType === t.number;
                const isPrimary = t.number === primaryType.number;
                return (
                  <div key={t.number} style={{ borderTop: "1px solid oklch(90% 0.005 80)" }}>
                    <button
                      type="button"
                      onClick={() => setExpandedType(isExpanded ? null : t.number)}
                      style={{
                        width: "100%", display: "flex", alignItems: "center", gap: "1rem",
                        padding: "1rem 0", background: "none", border: "none", cursor: "pointer",
                        textAlign: "left",
                      }}
                    >
                      <span style={{
                        width: "28px", height: "28px", flexShrink: 0, display: "flex",
                        alignItems: "center", justifyContent: "center",
                        background: isPrimary ? t.color : t.colorVeryLight,
                        fontFamily: "var(--font-montserrat)", fontSize: "0.75rem", fontWeight: 800,
                        color: isPrimary ? "white" : t.color,
                      }}>
                        {t.number}
                      </span>
                      <span style={{ flex: 1, fontFamily: "var(--font-montserrat)", fontWeight: isPrimary ? 700 : 500, fontSize: "0.9rem", color: isPrimary ? "oklch(22% 0.005 260)" : "oklch(38% 0.008 260)" }}>
                        {t.name}
                      </span>
                      {isPrimary && (
                        <span style={{ fontFamily: "var(--font-montserrat)", fontSize: "0.58rem", fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: t.color, flexShrink: 0 }}>
                          Your Type
                        </span>
                      )}
                      <svg viewBox="0 0 16 16" fill="none" stroke="oklch(60% 0.006 260)" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round"
                        style={{ width: "13px", height: "13px", flexShrink: 0, transform: isExpanded ? "rotate(180deg)" : "rotate(0)", transition: "transform 0.2s ease" }}>
                        <path d="M4 6l4 4 4-4" />
                      </svg>
                    </button>
                    {isExpanded && (
                      <div style={{ padding: "0 0 1.25rem 2.75rem" }}>
                        <p style={{ fontFamily: "var(--font-montserrat)", fontSize: "0.875rem", color: "oklch(30% 0.006 260)", lineHeight: 1.75, marginBottom: "0.625rem" }}>
                          {t.overview}
                        </p>
                        <p style={{ fontFamily: "var(--font-montserrat)", fontSize: "0.8rem", color: "oklch(44% 0.008 260)", lineHeight: 1.6 }}>
                          <strong style={{ fontWeight: 700, color: t.color }}>Motivation: </strong>{t.motivation}
                        </p>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* ── BACKGROUND (idle) ── */}
      {quizState === "idle" && (
        <div id="quiz-section" style={{ maxWidth: "760px", margin: "0 auto", padding: "3rem 2rem" }}>

          {/* What is the Enneagram */}
          <div style={{ marginBottom: "3rem" }}>
            <p style={{ fontFamily: "var(--font-montserrat)", fontSize: "0.62rem", fontWeight: 800, letterSpacing: "0.18em", textTransform: "uppercase", color: "oklch(65% 0.15 45)", marginBottom: "1rem" }}>
              About This Assessment
            </p>
            <h2 style={{ fontFamily: "var(--font-montserrat)", fontWeight: 800, fontSize: "1.5rem", color: "oklch(18% 0.005 260)", letterSpacing: "-0.02em", lineHeight: 1.2, marginBottom: "1.25rem" }}>
              What is the Enneagram?
            </h2>
            <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
              <p style={{ fontFamily: "var(--font-montserrat)", fontSize: "0.9rem", color: "oklch(30% 0.006 260)", lineHeight: 1.75 }}>
                The Enneagram is one of the most powerful personality frameworks available for leadership development. Unlike tools that simply describe surface behaviour, the Enneagram reveals the <em>why</em> behind how you act — your core motivations, deepest fears, and most consistent patterns.
              </p>
              <p style={{ fontFamily: "var(--font-montserrat)", fontSize: "0.9rem", color: "oklch(30% 0.006 260)", lineHeight: 1.75 }}>
                The word comes from the Greek <em>ennea</em> (nine) and <em>gramma</em> (something written). It describes nine distinct personality types, each shaped by a core motivation and a core fear that operate below the surface of most self-awareness. The system has roots in ancient wisdom traditions and has been developed in modern form by teachers like Riso, Hudson, and Rohr.
              </p>
              <p style={{ fontFamily: "var(--font-montserrat)", fontSize: "0.9rem", color: "oklch(30% 0.006 260)", lineHeight: 1.75 }}>
                For cross-cultural teams, the Enneagram is particularly valuable. It explains why leaders from different backgrounds can have the same <em>behaviour</em> for completely different <em>reasons</em> — and why the same approach can feel like care to one person and control to another.
              </p>
            </div>
          </div>

          {/* The 9 types overview */}
          <div style={{ marginBottom: "3rem" }}>
            <h2 style={{ fontFamily: "var(--font-montserrat)", fontWeight: 800, fontSize: "1.5rem", color: "oklch(18% 0.005 260)", letterSpacing: "-0.02em", lineHeight: 1.2, marginBottom: "1.5rem" }}>
              The Nine Types
            </h2>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: "0.75rem" }}>
              {TYPES.map((t) => (
                <div key={t.number} style={{ background: t.colorVeryLight, padding: "1.125rem 1.25rem", display: "flex", gap: "0.875rem", alignItems: "flex-start" }}>
                  <span style={{
                    width: "28px", height: "28px", flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "center",
                    background: t.color, fontFamily: "var(--font-montserrat)", fontSize: "0.8rem", fontWeight: 800, color: "white",
                  }}>{t.number}</span>
                  <div>
                    <p style={{ fontFamily: "var(--font-montserrat)", fontWeight: 700, fontSize: "0.875rem", color: "oklch(22% 0.005 260)", marginBottom: "0.25rem" }}>{t.name}</p>
                    <p style={{ fontFamily: "var(--font-montserrat)", fontSize: "0.75rem", color: "oklch(44% 0.008 260)", lineHeight: 1.5 }}>{t.tagline}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* How to take it */}
          <div style={{ background: "oklch(97% 0.01 50)", padding: "1.75rem 2rem", marginBottom: "2.5rem", outline: "1px solid oklch(88% 0.008 80)" }}>
            <h3 style={{ fontFamily: "var(--font-montserrat)", fontWeight: 700, fontSize: "1rem", color: "oklch(22% 0.005 260)", marginBottom: "1rem" }}>How to take this assessment</h3>
            <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: "0.625rem" }}>
              {[
                "Answer 45 short statements — about 8–10 minutes.",
                "Rate each statement 1–5 based on how much it describes you.",
                "Answer based on how you generally are, not how you want to be.",
                "There are no right or wrong answers — be as honest as you can.",
                "Your result reflects your most active pattern, not a fixed label.",
              ].map((tip, i) => (
                <li key={i} style={{ display: "flex", gap: "0.625rem", alignItems: "flex-start" }}>
                  <span style={{ color: "oklch(65% 0.15 45)", fontWeight: 700, flexShrink: 0 }}>→</span>
                  <span style={{ fontFamily: "var(--font-montserrat)", fontSize: "0.875rem", color: "oklch(30% 0.006 260)", lineHeight: 1.5 }}>{tip}</span>
                </li>
              ))}
            </ul>
          </div>

          <button
            type="button"
            onClick={startQuiz}
            style={{
              fontFamily: "var(--font-montserrat)", fontSize: "0.72rem", fontWeight: 700,
              letterSpacing: "0.08em", textTransform: "uppercase",
              background: "oklch(65% 0.15 45)", color: "white",
              border: "none", padding: "0.875rem 2.25rem", cursor: "pointer",
            }}
          >
            Start Assessment →
          </button>
        </div>
      )}

      {/* ── QUIZ ── */}
      {quizState === "active" && currentQuestion && (
        <div id="quiz-section" style={{ maxWidth: "640px", margin: "0 auto", padding: "3rem 2rem" }}>

          {/* Progress */}
          <div style={{ marginBottom: "2.5rem" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.625rem" }}>
              <span style={{ fontFamily: "var(--font-montserrat)", fontSize: "0.62rem", fontWeight: 700, letterSpacing: "0.14em", textTransform: "uppercase", color: "oklch(52% 0.008 260)" }}>
                Question {currentIdx + 1} of {QUESTION_ORDER.length}
              </span>
              <span style={{ fontFamily: "var(--font-montserrat)", fontSize: "0.62rem", fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: "oklch(65% 0.15 45)" }}>
                {progressPct}%
              </span>
            </div>
            <div style={{ height: "3px", background: "oklch(88% 0.006 80)" }}>
              <div style={{
                height: "100%", width: `${progressPct}%`,
                background: "oklch(65% 0.15 45)",
                transition: "width 0.4s ease",
              }} />
            </div>
          </div>

          {/* Statement */}
          <div style={{ marginBottom: "2.5rem" }}>
            <p style={{ fontFamily: "var(--font-montserrat)", fontSize: "0.62rem", fontWeight: 800, letterSpacing: "0.16em", textTransform: "uppercase", color: "oklch(65% 0.15 45)", marginBottom: "1rem" }}>
              How much does this describe you?
            </p>
            <p style={{ fontFamily: "var(--font-montserrat)", fontWeight: 500, fontSize: "1.0625rem", color: "oklch(18% 0.005 260)", lineHeight: 1.65 }}>
              &ldquo;{currentQuestion.text}&rdquo;
            </p>
          </div>

          {/* Likert scale */}
          <div style={{ display: "flex", flexDirection: "column", gap: "0.625rem", marginBottom: "2rem" }}>
            {SCALE_LABELS.map((label, i) => {
              const value = i + 1;
              return (
                <button
                  key={value}
                  type="button"
                  onClick={() => handleAnswer(value)}
                  style={{
                    display: "flex", alignItems: "center", gap: "1rem",
                    padding: "0.875rem 1.25rem",
                    background: "white",
                    border: "1.5px solid oklch(86% 0.006 80)",
                    cursor: "pointer", textAlign: "left",
                    transition: "border-color 0.15s ease, background 0.15s ease",
                  }}
                  onMouseEnter={(e) => {
                    (e.currentTarget as HTMLButtonElement).style.borderColor = "oklch(65% 0.15 45)";
                    (e.currentTarget as HTMLButtonElement).style.background = "oklch(99% 0.015 50)";
                  }}
                  onMouseLeave={(e) => {
                    (e.currentTarget as HTMLButtonElement).style.borderColor = "oklch(86% 0.006 80)";
                    (e.currentTarget as HTMLButtonElement).style.background = "white";
                  }}
                >
                  <span style={{
                    width: "24px", height: "24px", flexShrink: 0, display: "flex",
                    alignItems: "center", justifyContent: "center",
                    background: "oklch(93% 0.005 80)",
                    fontFamily: "var(--font-montserrat)", fontSize: "0.72rem", fontWeight: 700,
                    color: "oklch(45% 0.008 260)",
                  }}>{value}</span>
                  <span style={{ fontFamily: "var(--font-montserrat)", fontSize: "0.9rem", fontWeight: 400, color: "oklch(25% 0.006 260)" }}>
                    {label}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Back */}
          {currentIdx > 0 && (
            <button
              type="button"
              onClick={handleBack}
              style={{
                fontFamily: "var(--font-montserrat)", fontSize: "0.68rem", fontWeight: 600,
                letterSpacing: "0.06em", background: "none", border: "none",
                color: "oklch(55% 0.008 260)", cursor: "pointer", textDecoration: "underline",
                textUnderlineOffset: "3px",
              }}
            >
              ← Back
            </button>
          )}
        </div>
      )}
    </>
  );
}

"use client";

import { useState, useTransition } from "react";
import { saveResourceToDashboard, saveMBTIResult } from "../actions";

// ── QUESTIONS ─────────────────────────────────────────────────────────────────
// 40 forced-choice pairs (10 per dichotomy).
// For each pair, choosing option A scores the first pole, B scores the second.
// d: "EI" | "SN" | "TF" | "JP"
// A pole: E, S, T, J respectively | B pole: I, N, F, P

const QUESTIONS: { d: string; a: string; b: string }[] = [
  // E / I
  { d: "EI", a: "You feel energised after a lively social gathering.", b: "You feel drained after a lively social gathering, even a good one." },
  { d: "EI", a: "You tend to think out loud — talking helps you work things out.", b: "You prefer to think privately first, then share once you've processed." },
  { d: "EI", a: "You prefer to have several projects and social commitments running simultaneously.", b: "You prefer fewer commitments with room for depth and solitude." },
  { d: "EI", a: "In meetings, you speak up early and often.", b: "In meetings, you listen carefully and speak when you have something well-formed to say." },
  { d: "EI", a: "You meet new people with ease and enjoy the experience.", b: "Meeting many new people in a short time is draining for you." },
  { d: "EI", a: "You feel most alive when surrounded by activity and people.", b: "You feel most alive in quiet moments of reflection or deep one-on-one connection." },
  { d: "EI", a: "You would rather discuss a problem with others than think through it alone.", b: "You would rather think through a problem alone and then consult others." },
  { d: "EI", a: "You recharge by going out and being with people.", b: "You recharge by spending time at home or alone." },
  { d: "EI", a: "You have a wide circle of friends and enjoy maintaining many relationships.", b: "You have a small number of deep friendships you invest in fully." },
  { d: "EI", a: "Action and engagement feel more natural than reflection and observation.", b: "Observation and reflection feel more natural than immediate action." },
  // S / N
  { d: "SN", a: "You prefer dealing with concrete facts and practical details.", b: "You prefer exploring patterns, meanings, and future possibilities." },
  { d: "SN", a: "You trust experience and what you can directly observe more than theory.", b: "You trust intuition and insight even when you can't fully explain your reasoning." },
  { d: "SN", a: "You focus on what is — the present situation as it actually exists.", b: "You focus on what could be — future possibilities and scenarios." },
  { d: "SN", a: "You prefer step-by-step instructions and clear, tested methods.", b: "You prefer to understand principles and find your own way to apply them." },
  { d: "SN", a: "You notice precise details and remember them accurately.", b: "You notice patterns and connections across multiple situations." },
  { d: "SN", a: "You are energised by working with established systems and improving what already works.", b: "You are energised by reimagining how things could work if you started from scratch." },
  { d: "SN", a: "You prefer familiar approaches over untested innovations.", b: "You are drawn to new ideas, experiments, and unexplored territory." },
  { d: "SN", a: "When solving a problem, you work methodically through the known facts.", b: "When solving a problem, you quickly generate multiple possibilities and explore them." },
  { d: "SN", a: "You prefer a world of concrete reality to one of imagination and abstraction.", b: "Your imagination is rich and you often think in metaphors, symbols, and ideas." },
  { d: "SN", a: "You trust what has worked before more than what might work in theory.", b: "You trust creative vision and inspiration even when it hasn't been proven yet." },
  // T / F
  { d: "TF", a: "You prioritise logical consistency when making decisions.", b: "You prioritise harmony and the impact on people when making decisions." },
  { d: "TF", a: "You believe objective truth is more important than subjective feelings.", b: "You believe how people feel about a decision matters as much as whether it is correct." },
  { d: "TF", a: "You are comfortable delivering criticism when it is logically justified.", b: "You think carefully about how to deliver criticism so it lands with care." },
  { d: "TF", a: "You make decisions by analysing the problem and applying consistent principles.", b: "You make decisions by considering what feels right and what serves the people involved." },
  { d: "TF", a: "You find it easier to remain objective and detached when someone is emotionally upset.", b: "You find yourself naturally empathising and emotionally joining people in what they're experiencing." },
  { d: "TF", a: "Being right matters more to you than being liked in most professional situations.", b: "Maintaining positive relationships matters as much as being correct in most professional situations." },
  { d: "TF", a: "You tend to be sceptical and challenge ideas before accepting them.", b: "You tend to appreciate others' perspectives and look for merit before critiquing." },
  { d: "TF", a: "You are uncomfortable when decisions are made on the basis of emotions rather than facts.", b: "You are uncomfortable when decisions are made without considering their human impact." },
  { d: "TF", a: "You value competence and effectiveness above sensitivity in a team setting.", b: "You value genuine care and relational health as much as effectiveness in a team setting." },
  { d: "TF", a: "When someone comes to you with a problem, your instinct is to analyse and solve it.", b: "When someone comes to you with a problem, your instinct is to understand and empathise." },
  // J / P
  { d: "JP", a: "You like having a plan and feel unsettled when things are undefined.", b: "You like keeping your options open and find firm plans premature." },
  { d: "JP", a: "You feel best when you have completed your work and can rest.", b: "You feel best when you have options and room to adapt." },
  { d: "JP", a: "You organise your time, workspace, and commitments carefully.", b: "You are comfortable with a more fluid approach to time and space." },
  { d: "JP", a: "Deadlines are clear guides that help you structure your work.", b: "Deadlines are external pressure; you often produce your best work right before them." },
  { d: "JP", a: "You prefer to resolve open questions and move forward rather than stay in a state of uncertainty.", b: "You prefer to gather more information before committing to a decision." },
  { d: "JP", a: "You find it satisfying to complete tasks fully before moving to new ones.", b: "You enjoy starting new tasks and find strict completion before starting another constraining." },
  { d: "JP", a: "You like your life to be organised, structured, and predictable.", b: "You like your life to be flexible, spontaneous, and open to new possibilities." },
  { d: "JP", a: "When faced with a choice, you like to decide and move on.", b: "When faced with a choice, you like to keep exploring before deciding." },
  { d: "JP", a: "You plan ahead and dislike being caught unprepared.", b: "You adapt as you go and find over-planning unnecessary and constraining." },
  { d: "JP", a: "You feel most productive when following a clear structure.", b: "You feel most productive when you have freedom to respond to what emerges." },
];

// Round-robin order
const QUESTION_ORDER: number[] = [];
const byDichotomy: Record<string, number[]> = { EI: [], SN: [], TF: [], JP: [] };
QUESTIONS.forEach((q, i) => byDichotomy[q.d].push(i));
for (let r = 0; r < 10; r++) {
  for (const d of ["EI", "SN", "TF", "JP"]) {
    const idx = byDichotomy[d][r];
    if (idx !== undefined) QUESTION_ORDER.push(idx);
  }
}

// ── TYPE DATA ─────────────────────────────────────────────────────────────────

const MBTI_TYPES: Record<string, {
  subtitle: string; tagline: string; color: string; bg: string;
  jungian: string; overview: string; strengths: string[];
  growth: string; communication: string; crossCultural: string;
}> = {
  INTJ: {
    subtitle: "The Mastermind", tagline: "Strategic. Visionary. Relentlessly driven.",
    color: "oklch(48% 0.20 260)", bg: "oklch(16% 0.18 260)",
    jungian: "Dominant Introverted Intuition — supported by Extraverted Thinking",
    overview: "INTJs are rare strategic minds who combine long-range vision with decisive execution. They are among the most self-determined personalities — independent, rigorous, and driven by the need to improve what exists and build something better. In leadership, they are most effective when their strategic thinking is paired with the relational intelligence that allows others to follow their vision.",
    strengths: ["Long-range strategic planning", "Independent decision-making", "High intellectual standards", "Committed to continuous improvement", "Sees systemic patterns others miss"],
    growth: "INTJs grow by opening to feedback, building relational trust, and expressing their vision accessibly. Their greatest blind spot is underestimating the role of relationship and emotion in getting things done.",
    communication: "Be substantive and direct. Don't expect warmth-first conversation — they lead with ideas. Respect their need to think. Give them time. Their depth of analysis is an asset; don't rush them to shallow conclusions.",
    crossCultural: "INTJs' directness and independence can read as arrogance in high-context or collectivist cultures. Growth edge: learning to build trust and influence through relationship, not just competence.",
  },
  INTP: {
    subtitle: "The Architect", tagline: "Analytical. Curious. Relentlessly logical.",
    color: "oklch(48% 0.18 240)", bg: "oklch(16% 0.16 240)",
    jungian: "Dominant Introverted Thinking — supported by Extraverted Intuition",
    overview: "INTPs are driven by a compulsive need to understand how things work. They are among the most rigorous analytical thinkers of all types — creative, original, and deeply logical. They are at their best when given complex problems to solve and maximum freedom to think. Their greatest challenge is translating their inner world of ideas into consistent external action.",
    strengths: ["Deep logical analysis", "Original and creative thinking", "Objective and unbiased reasoning", "Sees complexity and nuance", "Deeply curious and self-directed in learning"],
    growth: "INTPs grow by developing follow-through, building emotional attunement, and learning to communicate their complex thinking accessibly. Their greatest challenge is completing what they start.",
    communication: "Engage their ideas directly and rigorously. They love intellectual debate. Don't rush them to a conclusion — they are building a complete framework first. Be precise; vagueness frustrates them.",
    crossCultural: "INTPs' love of debate and critique can be perceived as disrespectful in cultures where ideas and authority are closely linked. Growth edge: softening critique with relational warmth.",
  },
  ENTJ: {
    subtitle: "The Commander", tagline: "Decisive. Strategic. Built to lead.",
    color: "oklch(50% 0.22 25)", bg: "oklch(17% 0.16 25)",
    jungian: "Dominant Extraverted Thinking — supported by Introverted Intuition",
    overview: "ENTJs are the natural executives of the MBTI — combining strategic vision with decisive action and commanding leadership presence. They lead confidently, set high standards, and build systems that deliver results. Their challenge is that they can drive toward their goals in ways that leave people feeling bulldozed rather than led.",
    strengths: ["Decisive and action-oriented leadership", "Long-range strategic planning", "Builds systems and structures that work", "Commands respect through confidence and competence", "Energises teams with visible direction"],
    growth: "ENTJs grow by developing emotional intelligence, learning to lead through influence not authority, and slowing down enough to genuinely hear what others are experiencing.",
    communication: "Be confident, direct, and prepared. Come with well-reasoned positions. Don't be vague. Express disagreement clearly — they respect honest opposition more than passive agreement.",
    crossCultural: "ENTJs' assertive directness can be culturally disruptive in high-context or face-saving cultures. Restraint and relational sensitivity are their most important cross-cultural skills.",
  },
  ENTP: {
    subtitle: "The Visionary", tagline: "Creative. Challenging. Full of possibilities.",
    color: "oklch(58% 0.20 45)", bg: "oklch(18% 0.14 45)",
    jungian: "Dominant Extraverted Intuition — supported by Introverted Thinking",
    overview: "ENTPs are idea generators and innovators who love challenging assumptions and exploring new possibilities. They are energised by debate, novelty, and the joy of complex thinking. Their gift to any team is the quality of their creative thinking and their willingness to challenge what others take for granted.",
    strengths: ["Highly generative and creative", "Comfortable challenging the status quo", "Quick, agile thinking", "Inspires others with vision and energy", "Thrives in complexity and ambiguity"],
    growth: "ENTPs grow by developing discipline for execution, deepening emotional empathy, and learning to finish what they start. Their greatest shadow is the gap between their remarkable ideas and consistent delivery.",
    communication: "Engage with their ideas energetically. They love debate — match their directness. Don't try to close things prematurely; they are still exploring. Bring them hard problems.",
    crossCultural: "ENTPs' love of challenge and debate can be jarring in cultures where ideas are linked to identity and critique feels personal. Growth edge: leading with curiosity rather than confrontation.",
  },
  INFJ: {
    subtitle: "The Counsellor", tagline: "Visionary. Principled. A quiet force for good.",
    color: "oklch(48% 0.22 295)", bg: "oklch(16% 0.18 295)",
    jungian: "Dominant Introverted Intuition — supported by Extraverted Feeling",
    overview: "INFJs are rare visionaries who combine deep convictions, rich empathy, and long-range insight. They lead through the depth of their care and the clarity of their values. They are often seen as quiet but formidable — able to read people and situations with uncanny accuracy. Their challenge is translating their rich inner world into visible, sustained action.",
    strengths: ["Deep insight into people and situations", "Long-range visionary thinking", "Strong personal values and integrity", "Deeply empathetic and emotionally intelligent", "Inspiring when they fully claim their voice"],
    growth: "INFJs grow by learning to share their vision clearly, set firm boundaries, and resist the pull to absorb others' emotional weight until they burn out.",
    communication: "Be genuine, values-driven, and substantive. Shallow or transactional interaction disengages them. Give them time — they process deeply. Create space for trust to develop before expecting full disclosure.",
    crossCultural: "INFJs' depth and care translate across most cultures. Their idealism can create friction in pragmatic or hierarchical contexts where relationships are transactional. Growth edge: holding conviction while adapting approach.",
  },
  INFP: {
    subtitle: "The Healer", tagline: "Idealistic. Authentic. Deeply values-driven.",
    color: "oklch(52% 0.18 10)", bg: "oklch(17% 0.14 10)",
    jungian: "Dominant Introverted Feeling — supported by Extraverted Intuition",
    overview: "INFPs are quiet idealists who lead from deep personal values and an authentic vision of what could be. They are creative, empathetic, and fiercely loyal to the causes and people they believe in. They are often described as having an inner world of extraordinary richness — and their challenge is building the external structures that allow that richness to make a real difference.",
    strengths: ["Deep personal integrity and values clarity", "Highly empathetic and emotionally attuned", "Creative and original", "Inspires through authenticity", "Loyal to people and causes they believe in"],
    growth: "INFPs grow by building assertiveness, developing concrete execution skills, and learning to hold their convictions publicly even when challenged.",
    communication: "Honour their values and feelings. Create space for depth. Don't dismiss what they feel — their emotional signals carry real intelligence. Give them time; they are deliberate communicators.",
    crossCultural: "INFPs' individualism and focus on personal authenticity can feel countercultural in collectivist contexts. Growth edge: finding meaning within community as well as through individual expression.",
  },
  ENFJ: {
    subtitle: "The Teacher", tagline: "Inspiring. Empathetic. A developer of people.",
    color: "oklch(52% 0.18 155)", bg: "oklch(17% 0.13 155)",
    jungian: "Dominant Extraverted Feeling — supported by Introverted Intuition",
    overview: "ENFJs are the warmest and most inspiring leaders in the MBTI. They combine deep care for people with a genuine vision for what a team or community can become. They lead through relationship — investing deeply in the growth of those around them, communicating with unusual warmth and clarity, and building the kind of loyalty that sustains organisations across the long term.",
    strengths: ["Deeply inspiring and motivating", "Invests in others' growth and development", "Warm, clear communicator", "Builds genuine community", "Holds vision and relational health simultaneously"],
    growth: "ENFJs grow by learning to maintain boundaries when others' needs become consuming, holding their convictions when relational pressure is to compromise, and ensuring they receive the care they give so freely.",
    communication: "Be warm, genuine, and purpose-focused. Engage with their vision for people. Don't be cold or dismissive of relational dynamics — they read emotional temperature accurately and respond to it.",
    crossCultural: "ENFJs' warmth resonates in almost every cultural context. In highly individualistic cultures, their community focus can be undervalued. Growth edge: holding conviction when consensus is hard to achieve.",
  },
  ENFP: {
    subtitle: "The Champion", tagline: "Enthusiastic. Creative. Deeply human.",
    color: "oklch(60% 0.18 65)", bg: "oklch(18% 0.12 65)",
    jungian: "Dominant Extraverted Intuition — supported by Introverted Feeling",
    overview: "ENFPs are the most enthusiastic and human-centred innovators in the MBTI. They are energised by possibilities, driven by values, and deeply invested in the people around them. They are charismatic, creative, and genuinely inspiring — and their greatest challenge is channelling their remarkable energy into sustained execution.",
    strengths: ["Genuinely creative and visionary", "Warm, energetic, and inspiring", "Deeply empathetic", "Sees possibilities others miss", "Builds enthusiastic followership"],
    growth: "ENFPs grow by developing the discipline to follow through, building structure that supports their natural spontaneity, and learning to be fully present in difficulty without immediately seeking the next exciting thing.",
    communication: "Match their energy. Be genuine — they read inauthenticity instantly. Engage their ideas. Give them creative freedom within real constraints.",
    crossCultural: "ENFPs' enthusiasm and openness translate well across cultures. Their individualism can be challenging in collectivist contexts. Growth edge: sustained follow-through and cultural humility.",
  },
  ISTJ: {
    subtitle: "The Inspector", tagline: "Reliable. Principled. A builder of lasting things.",
    color: "oklch(45% 0.14 215)", bg: "oklch(16% 0.12 215)",
    jungian: "Dominant Introverted Sensing — supported by Extraverted Thinking",
    overview: "ISTJs are among the most dependable and thorough of all types. They lead through consistency, duty, and meticulous preparation. They build structures that last and teams that trust them precisely because they do what they say they will do. In leadership, their great gift is reliability — and their growth edge is learning to lead through inspiration as well as through trustworthy execution.",
    strengths: ["Exceptionally reliable and consistent", "Thorough and well-prepared", "Strong sense of duty and responsibility", "Calm and steady under pressure", "Builds lasting structures and systems"],
    growth: "ISTJs grow by developing flexibility, emotional attunement, and the ability to inspire as well as execute. Their resistance to change is their most significant leadership risk.",
    communication: "Be precise, factual, and predictable. Give them time to prepare. Don't surprise them. Honour their commitments — reliability is the deepest form of respect in their world.",
    crossCultural: "ISTJs' respect for structure and tradition is valued in hierarchical cultures. In adaptive or informal environments, they may be perceived as inflexible. Growth edge: building comfort with ambiguity.",
  },
  ISFJ: {
    subtitle: "The Nurturer", tagline: "Caring. Faithful. The quiet backbone.",
    color: "oklch(50% 0.16 185)", bg: "oklch(16% 0.12 185)",
    jungian: "Dominant Introverted Sensing — supported by Extraverted Feeling",
    overview: "ISFJs are warm, meticulous, and deeply devoted to the wellbeing of the people and communities they serve. They are often the invisible backbone of healthy organisations — doing what needs to be done, showing up when it counts, and rarely asking for recognition. Their growth edge is learning to advocate for themselves with the same clarity they give to others.",
    strengths: ["Deeply caring and attentive to others", "Highly reliable and detailed", "Builds genuine community and belonging", "Loyal and consistent", "Serves without expectation of reward"],
    growth: "ISFJs grow by developing assertiveness, setting appropriate limits on how much they give, and learning to hold conflict when it is needed for the health of the team.",
    communication: "Be warm, personal, and appreciative. Acknowledge their contributions specifically — they often go unrecognised and feel it. Create genuine space for them to share their own perspective.",
    crossCultural: "ISFJs' care and service orientation translate well across collectivist cultures. In assertive or competitive environments, their quiet approach can be overlooked. Growth edge: claiming their voice and influence.",
  },
  ESTJ: {
    subtitle: "The Supervisor", tagline: "Organised. Direct. A builder of order.",
    color: "oklch(48% 0.18 195)", bg: "oklch(16% 0.14 195)",
    jungian: "Dominant Extraverted Thinking — supported by Introverted Sensing",
    overview: "ESTJs are natural administrators who create order, clarity, and reliable systems wherever they lead. They are direct, decisive, and committed to doing things the right way — efficiently and with high standards. They build teams that know what to expect and can count on the leader to follow through. Their growth edge is learning to lead through genuine influence and not only through structure.",
    strengths: ["Exceptional organiser and administrator", "Clear, direct communication", "Highly reliable and consistent", "Creates order from complexity", "Strong work ethic and high standards"],
    growth: "ESTJs grow by developing emotional attunement, flexibility, and the ability to inspire rather than direct. Their leadership blind spot is often the gap between their efficiency and the relational needs of their team.",
    communication: "Be direct, factual, and prepared. Come with clear information and logical reasoning. Avoid vagueness and emotional appeal over evidence. Express disagreement respectfully and directly.",
    crossCultural: "ESTJs' directness and need for structure fit well in many hierarchical cultures. In fluid or relational contexts, their need for order can feel controlling. Growth edge: building space for genuine input and adaptation.",
  },
  ESFJ: {
    subtitle: "The Provider", tagline: "Warm. Community-focused. Deeply caring.",
    color: "oklch(55% 0.18 35)", bg: "oklch(17% 0.12 35)",
    jungian: "Dominant Extraverted Feeling — supported by Introverted Sensing",
    overview: "ESFJs are the most community-oriented of all types — warm, organised, and deeply invested in the health of the people around them. They are natural hosts, encouragers, and community builders who ensure everyone feels valued and included. Their growth edge is learning to hold necessary conflict and maintain their own convictions when the relational cost is high.",
    strengths: ["Warm and genuinely caring", "Highly organised and reliable", "Builds community and belonging", "Responsive to others' needs", "Creates environments where people feel safe"],
    growth: "ESFJs grow by developing comfort with productive conflict, maintaining their convictions under relational pressure, and ensuring their care for others doesn't become a source of resentment.",
    communication: "Be warm, personal, and expressive of genuine appreciation. Acknowledge the relationship before the task. Avoid abruptness or cold efficiency — it disengages them.",
    crossCultural: "ESFJs' warmth and community focus translate well across collectivist cultures. In individualistic contexts, their relational investment can seem intrusive. Growth edge: balancing care with appropriate professional boundaries.",
  },
  ISTP: {
    subtitle: "The Craftsman", tagline: "Practical. Adaptable. Quietly masterful.",
    color: "oklch(50% 0.15 145)", bg: "oklch(16% 0.11 145)",
    jungian: "Dominant Introverted Thinking — supported by Extraverted Sensing",
    overview: "ISTPs are the most practically skilled and quietly capable of all types. They lead through excellence of execution, clear-headed problem-solving, and a remarkable ability to stay calm and effective when things go wrong. They are at their best when given a real problem to solve with maximum autonomy and minimum unnecessary structure.",
    strengths: ["Exceptional practical problem-solving", "Calm and decisive under pressure", "Highly observant and perceptive", "Efficient — cuts through to what matters", "Adaptable and resourceful in unexpected situations"],
    growth: "ISTPs grow by developing their communication, learning to express care through words as well as action, and building the long-term planning that sustains their excellence over time.",
    communication: "Be direct and practical. Skip the preamble. Give them space and autonomy. Don't expect emotional disclosure — they engage through action. They mean what they say; don't read in more than is there.",
    crossCultural: "ISTPs' practical competence is valued in every culture. Their emotional reserve can be misread as coldness in relational cultures. Growth edge: expressing investment in people, not just solving their problems.",
  },
  ISFP: {
    subtitle: "The Composer", tagline: "Gentle. Creative. Authentically present.",
    color: "oklch(55% 0.18 150)", bg: "oklch(17% 0.13 150)",
    jungian: "Dominant Introverted Feeling — supported by Extraverted Sensing",
    overview: "ISFPs are quiet, creative, and deeply caring individuals who lead through presence, authenticity, and the quality of their attention. They are finely attuned to beauty and to the people around them — and their gift to any team is the safety and trust that comes from someone who is genuinely present and genuinely good.",
    strengths: ["Deep empathy and attentiveness", "Creative and aesthetically sensitive", "Authentic and non-performative", "Loyal and present with people they care about", "Open and flexible to others' perspectives"],
    growth: "ISFPs grow by claiming their voice and influence, developing assertiveness, and building the confidence to hold appropriate authority without feeling it compromises their values.",
    communication: "Be gentle, personal, and unhurried. Create space for them to share at their own pace. Acknowledge their contributions — especially the quiet, invisible ones. Don't push or crowd.",
    crossCultural: "ISFPs' gentleness and adaptability serve them well in most cultures. In competitive or assertive environments, their quiet approach can leave them overlooked. Growth edge: choosing to be seen and heard, not just felt.",
  },
  ESTP: {
    subtitle: "The Promoter", tagline: "Energetic. Perceptive. Built for action.",
    color: "oklch(58% 0.20 55)", bg: "oklch(18% 0.13 55)",
    jungian: "Dominant Extraverted Sensing — supported by Introverted Thinking",
    overview: "ESTPs are the most action-oriented and perceptive of all types. They read real-world situations with extraordinary speed and accuracy and move quickly from insight to action. They are natural negotiators, performers, and crisis leaders. Their challenge is developing the strategic patience and relational depth that sustains their leadership over the long term.",
    strengths: ["Fast, accurate real-world perception", "Action-oriented and decisive", "Energetic and charismatic", "Excellent negotiator and communicator", "Resilient and adaptable under pressure"],
    growth: "ESTPs grow by developing strategic patience, long-range planning, and the relational depth that builds lasting teams rather than just solving today's problem.",
    communication: "Be direct, energetic, and concrete. Skip theory. Keep things dynamic. They engage quickly and move on — don't over-elaborate. Match their pace.",
    crossCultural: "ESTPs' boldness is valued in action-oriented cultures but can seem reckless or disrespectful in deliberative or consensus-driven contexts. Growth edge: building patience for process.",
  },
  ESFP: {
    subtitle: "The Performer", tagline: "Warm. Spontaneous. Joyfully engaged.",
    color: "oklch(62% 0.20 48)", bg: "oklch(18% 0.13 48)",
    jungian: "Dominant Extraverted Sensing — supported by Introverted Feeling",
    overview: "ESFPs are the most warmly present and joyfully engaged of all types. They bring infectious enthusiasm, genuine care, and spontaneous energy to everything they do. They create environments where people genuinely want to show up — and their gift is making everyone feel seen, welcomed, and valued. Their growth edge is developing the discipline and long-range planning that turns their relational gifts into sustained leadership.",
    strengths: ["Warm, generous, and genuinely caring", "Brings energy and joy to team culture", "Spontaneous and highly adaptable", "Reads and responds to people intuitively", "Makes people feel genuinely welcomed"],
    growth: "ESFPs grow by developing follow-through, strategic discipline, and the capacity to lead through difficulty as well as celebration.",
    communication: "Be warm, positive, and personal. Engage with their energy genuinely. Show appreciation frequently and specifically. Avoid cold, heavy, or over-serious interactions.",
    crossCultural: "ESFPs' warmth and expressiveness are gifts in relational cultures. In reserved or structured environments, their spontaneity can seem unprofessional. Growth edge: channelling social gifts into disciplined follow-through.",
  },
};

// ── COMPONENT ─────────────────────────────────────────────────────────────────

type QuizState = "idle" | "active" | "done";

function computeType(scores: Record<string, number>): { type: string; pcts: Record<string, number> } {
  const ePct = Math.round((scores.EI_E ?? 0) / ((scores.EI_E ?? 0) + (scores.EI_I ?? 1)) * 100) || 50;
  const sPct = Math.round((scores.SN_S ?? 0) / ((scores.SN_S ?? 0) + (scores.SN_N ?? 1)) * 100) || 50;
  const tPct = Math.round((scores.TF_T ?? 0) / ((scores.TF_T ?? 0) + (scores.TF_F ?? 1)) * 100) || 50;
  const jPct = Math.round((scores.JP_J ?? 0) / ((scores.JP_J ?? 0) + (scores.JP_P ?? 1)) * 100) || 50;
  const type = [ePct >= 50 ? "E" : "I", sPct >= 50 ? "S" : "N", tPct >= 50 ? "T" : "F", jPct >= 50 ? "J" : "P"].join("");
  return { type, pcts: { E: ePct, I: 100 - ePct, S: sPct, N: 100 - sPct, T: tPct, F: 100 - tPct, J: jPct, P: 100 - jPct } };
}

const DIMENSION_META = [
  { d: "EI", label: "Energy Direction", poleA: "E", labelA: "Extraversion", poleB: "I", labelB: "Introversion", color: "oklch(60% 0.18 52)" },
  { d: "SN", label: "Perception", poleA: "S", labelA: "Sensing", poleB: "N", labelB: "Intuition", color: "oklch(52% 0.22 280)" },
  { d: "TF", label: "Judgement", poleA: "T", labelA: "Thinking", poleB: "F", labelB: "Feeling", color: "oklch(50% 0.18 215)" },
  { d: "JP", label: "Orientation", poleA: "J", labelA: "Judging", poleB: "P", labelB: "Perceiving", color: "oklch(50% 0.20 25)" },
];

export default function MBTIClient({
  isSaved: isSavedProp,
  savedType,
  savedScores,
}: {
  isSaved: boolean;
  savedType: string | null;
  savedScores: Record<string, number> | null;
}) {
  const [quizState, setQuizState] = useState<QuizState>(savedType && savedScores ? "done" : "idle");
  const [currentIdx, setCurrentIdx] = useState(0);
  const [scores, setScores] = useState<Record<string, number>>(
    savedScores ?? { EI_E: 0, EI_I: 0, SN_S: 0, SN_N: 0, TF_T: 0, TF_F: 0, JP_J: 0, JP_P: 0 }
  );
  const [answerHistory, setAnswerHistory] = useState<{ qIdx: number; key: string }[]>([]);
  const [isSaved, setIsSaved] = useState(isSavedProp);
  const [resultSaved, setResultSaved] = useState(!!savedType);
  const [isPending, startTransition] = useTransition();

  function startQuiz() {
    setCurrentIdx(0);
    setScores({ EI_E: 0, EI_I: 0, SN_S: 0, SN_N: 0, TF_T: 0, TF_F: 0, JP_J: 0, JP_P: 0 });
    setAnswerHistory([]);
    setQuizState("active");
    window.scrollTo({ top: document.getElementById("quiz-mbti")?.offsetTop ?? 0, behavior: "smooth" });
  }

  function handleAnswer(pole: "A" | "B") {
    const qIdx = QUESTION_ORDER[currentIdx];
    const q = QUESTIONS[qIdx];
    const poleMap: Record<string, Record<"A" | "B", string>> = {
      EI: { A: "EI_E", B: "EI_I" },
      SN: { A: "SN_S", B: "SN_N" },
      TF: { A: "TF_T", B: "TF_F" },
      JP: { A: "JP_J", B: "JP_P" },
    };
    const key = poleMap[q.d][pole];
    setAnswerHistory(prev => [...prev, { qIdx, key }]);
    setScores(prev => ({ ...prev, [key]: (prev[key] ?? 0) + 1 }));
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
    setScores(prev => ({ ...prev, [last.key]: Math.max(0, (prev[last.key] ?? 0) - 1) }));
    setAnswerHistory(prev => prev.slice(0, -1));
    setCurrentIdx(prev => prev - 1);
  }

  function handleSave() {
    startTransition(async () => {
      const { type } = computeType(scores);
      if (!isSaved) {
        await saveResourceToDashboard("myers-briggs");
        setIsSaved(true);
      }
      const result = await saveMBTIResult(type, scores);
      if (!result.error) setResultSaved(true);
    });
  }

  // ── IDLE ────────────────────────────────────────────────────────────────────
  if (quizState === "idle") {
    return (
      <div style={{ minHeight: "100vh", background: "oklch(97% 0.008 45)", fontFamily: "'Source Serif 4', Georgia, serif" }}>
        <style>{`
          @import url('https://fonts.googleapis.com/css2?family=Source+Serif+4:ital,opsz,wght@0,8..60,300;0,8..60,400;0,8..60,600;1,8..60,400&family=Jost:wght@300;400;500;600&display=swap');
          .mbti-btn { transition: all 0.18s ease; cursor: pointer; }
          .mbti-btn:hover { transform: translateY(-1px); }
        `}</style>

        <div style={{ background: "oklch(25% 0.08 45)", color: "white", padding: "72px 24px 64px" }}>
          <div style={{ maxWidth: 760, margin: "0 auto" }}>
            <p style={{ fontFamily: "'Jost', sans-serif", fontSize: 13, fontWeight: 500, letterSpacing: "0.14em", textTransform: "uppercase", color: "oklch(72% 0.06 45)", marginBottom: 20 }}>
              Personality Assessment
            </p>
            <h1 style={{ fontFamily: "'Source Serif 4', Georgia, serif", fontSize: "clamp(34px, 5vw, 56px)", fontWeight: 300, lineHeight: 1.1, marginBottom: 20, letterSpacing: "-0.02em" }}>
              Myers-Briggs<br />
              <em style={{ fontStyle: "italic", color: "oklch(78% 0.08 45)" }}>Type Indicator</em>
            </h1>
            <p style={{ fontFamily: "'Jost', sans-serif", fontSize: 17, fontWeight: 400, lineHeight: 1.7, color: "oklch(80% 0.05 45)", maxWidth: 580 }}>
              One of the most widely used personality frameworks in the world — rooted in Jungian psychology and used by millions of leaders, teams, and organisations to understand how people think, decide, and relate.
            </p>
            <button
              onClick={startQuiz}
              className="mbti-btn"
              style={{ marginTop: 36, padding: "14px 36px", background: "oklch(62% 0.18 45)", color: "white", border: "none", borderRadius: 8, fontFamily: "'Jost', sans-serif", fontSize: 16, fontWeight: 600 }}
            >
              Start Assessment →
            </button>
          </div>
        </div>

        <div style={{ maxWidth: 760, margin: "0 auto", padding: "56px 24px" }}>
          <section style={{ marginBottom: 52 }}>
            <h2 style={{ fontFamily: "'Source Serif 4', serif", fontSize: 28, fontWeight: 400, color: "oklch(22% 0.06 45)", marginBottom: 16 }}>
              What is the Myers-Briggs Type Indicator?
            </h2>
            <p style={{ fontFamily: "'Jost', sans-serif", fontSize: 16, lineHeight: 1.75, color: "oklch(28% 0.04 45)", marginBottom: 14 }}>
              The Myers-Briggs Type Indicator (MBTI) was developed by Isabel Briggs Myers and her mother Katharine Cook Briggs in the 1940s, drawing on the psychological theories of Carl Jung. It identifies how people prefer to direct their energy, take in information, make decisions, and organise their lives — producing one of 16 distinct personality types.
            </p>
            <p style={{ fontFamily: "'Jost', sans-serif", fontSize: 16, lineHeight: 1.75, color: "oklch(28% 0.04 45)" }}>
              The MBTI is used in team-building, leadership development, coaching, and cross-cultural work in organisations around the world. It offers a language for understanding why people think, communicate, and lead differently — and what each style brings to a team.
            </p>
          </section>

          <section style={{ marginBottom: 52 }}>
            <h2 style={{ fontFamily: "'Source Serif 4', serif", fontSize: 28, fontWeight: 400, color: "oklch(22% 0.06 45)", marginBottom: 8 }}>
              The Jungian Foundations
            </h2>
            <p style={{ fontFamily: "'Jost', sans-serif", fontSize: 15, color: "oklch(40% 0.04 45)", marginBottom: 24 }}>
              Jung identified two core mental processes: <em>perception</em> (how we gather information) and <em>judgement</em> (how we make decisions). The MBTI adds two further dimensions to produce four preference pairs.
            </p>
            <div style={{ display: "grid", gap: 14 }}>
              {[
                { pair: "Extraversion / Introversion", desc: "Where do you direct your mental energy? Outward to people and action, or inward to thoughts and reflection?", detail: "This is Jung's most fundamental distinction — not about shyness or sociability, but about where you naturally draw energy." },
                { pair: "Sensing / Intuition", desc: "How do you take in information? Through concrete present facts, or through patterns and future possibilities?", detail: "Jung called these the two perception functions — the two radically different ways humans pay attention to the world." },
                { pair: "Thinking / Feeling", desc: "How do you make decisions? Through logical analysis and objective criteria, or through personal values and interpersonal impact?", detail: "Both are rational functions — Thinking applies objective principles; Feeling applies subjective values. Neither is emotional vs rational." },
                { pair: "Judging / Perceiving", desc: "How do you organise your outer world? With structure and closure, or with flexibility and openness?", detail: "Myers and Briggs added this fourth dimension to identify which function — judgement or perception — each type shows to the world." },
              ].map(item => (
                <div key={item.pair} style={{ background: "white", borderRadius: 12, padding: "20px 24px", border: "1px solid oklch(88% 0.03 45)" }}>
                  <div style={{ fontFamily: "'Source Serif 4', serif", fontSize: 18, fontWeight: 400, color: "oklch(22% 0.06 45)", marginBottom: 8 }}>{item.pair}</div>
                  <p style={{ fontFamily: "'Jost', sans-serif", fontSize: 15, color: "oklch(32% 0.04 45)", lineHeight: 1.65, marginBottom: 8 }}>{item.desc}</p>
                  <p style={{ fontFamily: "'Jost', sans-serif", fontSize: 13, color: "oklch(50% 0.04 45)", lineHeight: 1.6, margin: 0, fontStyle: "italic" }}>{item.detail}</p>
                </div>
              ))}
            </div>
          </section>

          <section style={{ marginBottom: 48 }}>
            <h2 style={{ fontFamily: "'Source Serif 4', serif", fontSize: 28, fontWeight: 400, color: "oklch(22% 0.06 45)", marginBottom: 8 }}>
              How This Assessment Works
            </h2>
            <p style={{ fontFamily: "'Jost', sans-serif", fontSize: 15, color: "oklch(40% 0.04 45)", marginBottom: 20 }}>
              Unlike typical Likert-scale assessments, the MBTI uses <strong>forced-choice pairs</strong> — you choose which of two statements feels more like you. This approach was designed by Myers to reveal natural preferences more directly.
            </p>
            <div style={{ background: "white", borderRadius: 16, padding: "28px 32px", border: "1px solid oklch(88% 0.03 45)" }}>
              {[
                ["40 forced-choice pairs", "Choose the option that feels more like your natural self."],
                ["No right or wrong", "Every type has genuine leadership strengths."],
                ["Be honest, not ideal", "Describe how you are — not who you aspire to be."],
                ["Takes about 8–10 minutes", "Find a quiet moment for the most accurate result."],
              ].map(([label, desc]) => (
                <div key={label} style={{ display: "flex", gap: 12, alignItems: "flex-start", padding: "10px 0", borderBottom: "1px solid oklch(94% 0.02 45)" }}>
                  <div style={{ width: 6, height: 6, borderRadius: "50%", background: "oklch(55% 0.12 45)", marginTop: 8, flexShrink: 0 }} />
                  <div>
                    <span style={{ fontFamily: "'Jost', sans-serif", fontSize: 15, fontWeight: 600, color: "oklch(20% 0.06 45)" }}>{label} — </span>
                    <span style={{ fontFamily: "'Jost', sans-serif", fontSize: 15, color: "oklch(38% 0.04 45)" }}>{desc}</span>
                  </div>
                </div>
              ))}
              <button
                onClick={startQuiz}
                className="mbti-btn"
                style={{ marginTop: 24, padding: "13px 32px", background: "oklch(25% 0.08 45)", color: "white", border: "none", borderRadius: 8, fontFamily: "'Jost', sans-serif", fontSize: 15, fontWeight: 600 }}
              >
                Begin the Assessment
              </button>
            </div>
          </section>
        </div>
      </div>
    );
  }

  // ── ACTIVE ───────────────────────────────────────────────────────────────────
  if (quizState === "active") {
    const qIdx = QUESTION_ORDER[currentIdx];
    const q = QUESTIONS[qIdx];
    const dimMeta = DIMENSION_META.find(d => d.d === q.d)!;
    const progress = (currentIdx / QUESTION_ORDER.length) * 100;

    return (
      <div id="quiz-mbti" style={{ minHeight: "100vh", background: "oklch(97% 0.008 45)", fontFamily: "'Jost', sans-serif" }}>
        <style>{`
          @import url('https://fonts.googleapis.com/css2?family=Source+Serif+4:ital,opsz,wght@0,8..60,300;0,8..60,400;1,8..60,400&family=Jost:wght@400;500;600&display=swap');
          .choice-btn { transition: all 0.15s ease; cursor: pointer; background: white; border: 2px solid oklch(88% 0.03 45); border-radius: 14px; padding: 22px 24px; text-align: left; width: 100%; }
          .choice-btn:hover { border-color: var(--dcolor); background: oklch(97% 0.01 45); transform: translateX(4px); }
        `}</style>
        <div style={{ maxWidth: 680, margin: "0 auto", padding: "40px 24px" }}>
          <div style={{ marginBottom: 40 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
              <span style={{ fontSize: 13, color: "oklch(50% 0.04 45)", fontWeight: 500 }}>{currentIdx + 1} / {QUESTION_ORDER.length}</span>
              <span style={{ fontSize: 13, fontWeight: 600, color: dimMeta.color }}>{dimMeta.label}: {dimMeta.labelA} vs {dimMeta.labelB}</span>
            </div>
            <div style={{ height: 4, background: "oklch(88% 0.03 45)", borderRadius: 4, overflow: "hidden" }}>
              <div style={{ height: "100%", width: `${progress}%`, background: dimMeta.color, borderRadius: 4, transition: "width 0.3s ease" }} />
            </div>
          </div>
          <p style={{ fontFamily: "'Jost', sans-serif", fontSize: 13, fontWeight: 600, letterSpacing: "0.08em", textTransform: "uppercase", color: "oklch(50% 0.04 45)", marginBottom: 20 }}>
            Which feels more like you?
          </p>
          <div style={{ display: "grid", gap: 14 }}>
            {[{ label: "A", text: q.a }, { label: "B", text: q.b }].map(opt => (
              <button
                key={opt.label}
                className="choice-btn"
                onClick={() => handleAnswer(opt.label as "A" | "B")}
                style={{ "--dcolor": dimMeta.color } as React.CSSProperties}
              >
                <div style={{ display: "flex", gap: 14, alignItems: "flex-start" }}>
                  <span style={{ fontFamily: "'Source Serif 4', serif", fontSize: 22, fontWeight: 400, color: dimMeta.color, lineHeight: 1, flexShrink: 0, marginTop: 2 }}>{opt.label}</span>
                  <p style={{ fontFamily: "'Source Serif 4', Georgia, serif", fontSize: "clamp(16px, 2vw, 18px)", lineHeight: 1.6, color: "oklch(20% 0.05 45)", margin: 0, fontWeight: 400 }}>
                    {opt.text}
                  </p>
                </div>
              </button>
            ))}
          </div>
          <button onClick={handleBack} style={{ marginTop: 28, background: "transparent", border: "none", color: "oklch(55% 0.05 45)", fontFamily: "'Jost', sans-serif", fontSize: 14, cursor: "pointer", padding: "8px 0" }}>
            ← Back
          </button>
        </div>
      </div>
    );
  }

  // ── DONE ─────────────────────────────────────────────────────────────────────
  const { type, pcts } = computeType(scores);
  const typeData = MBTI_TYPES[type] ?? MBTI_TYPES.ENFP;

  return (
    <div style={{ minHeight: "100vh", background: "oklch(97% 0.008 45)", fontFamily: "'Jost', sans-serif" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Source+Serif+4:ital,opsz,wght@0,8..60,300;0,8..60,400;0,8..60,600;1,8..60,400&family=Jost:wght@300;400;500;600&display=swap');
        .mbti-bar { transition: width 1s cubic-bezier(0.4,0,0.2,1); }
      `}</style>

      <div style={{ background: typeData.bg, color: "white", padding: "56px 24px 48px" }}>
        <div style={{ maxWidth: 760, margin: "0 auto" }}>
          <p style={{ fontFamily: "'Jost', sans-serif", fontSize: 13, fontWeight: 500, letterSpacing: "0.14em", textTransform: "uppercase", color: "oklch(70% 0.05 45)", marginBottom: 12 }}>
            Your Myers-Briggs Type
          </p>
          <div style={{ display: "flex", alignItems: "center", gap: 20, flexWrap: "wrap", marginBottom: 20 }}>
            <span style={{ fontFamily: "'Source Serif 4', serif", fontSize: "clamp(52px, 8vw, 80px)", fontWeight: 600, color: typeData.color, lineHeight: 1 }}>{type}</span>
            <div>
              <div style={{ fontFamily: "'Source Serif 4', serif", fontSize: "clamp(22px, 3vw, 32px)", fontWeight: 400, lineHeight: 1.2 }}>{typeData.subtitle}</div>
              <div style={{ fontFamily: "'Jost', sans-serif", fontSize: 15, color: "oklch(78% 0.05 45)", marginTop: 6 }}>{typeData.jungian}</div>
            </div>
          </div>
          <p style={{ fontFamily: "'Jost', sans-serif", fontSize: 16, lineHeight: 1.7, color: "oklch(82% 0.04 45)", maxWidth: 580 }}>
            {typeData.overview}
          </p>
        </div>
      </div>

      <div style={{ maxWidth: 760, margin: "0 auto", padding: "48px 24px" }}>

        {/* Dimension profile */}
        <section style={{ marginBottom: 48 }}>
          <h2 style={{ fontFamily: "'Source Serif 4', serif", fontSize: 24, fontWeight: 400, color: "oklch(22% 0.06 45)", marginBottom: 24 }}>Preference Profile</h2>
          <div style={{ display: "grid", gap: 18 }}>
            {DIMENSION_META.map(d => {
              const pctA = pcts[d.poleA] ?? 50;
              const pctB = 100 - pctA;
              const dominant = pctA >= 50 ? d.labelA : d.labelB;
              const dominantPct = pctA >= 50 ? pctA : pctB;
              return (
                <div key={d.d} style={{ background: "white", borderRadius: 14, padding: "22px 26px", border: "1px solid oklch(90% 0.03 45)" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 12, flexWrap: "wrap", gap: 8 }}>
                    <span style={{ fontFamily: "'Jost', sans-serif", fontSize: 13, fontWeight: 500, color: "oklch(45% 0.04 45)", textTransform: "uppercase", letterSpacing: "0.06em" }}>{d.label}</span>
                    <span style={{ fontFamily: "'Jost', sans-serif", fontSize: 14, fontWeight: 600, color: d.color }}>{dominant} — {dominantPct}%</span>
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                    <span style={{ fontSize: 13, fontWeight: 700, color: d.color, minWidth: 16 }}>{d.poleA}</span>
                    <div style={{ flex: 1, height: 8, background: "oklch(91% 0.02 45)", borderRadius: 8, overflow: "hidden" }}>
                      <div className="mbti-bar" style={{ height: "100%", width: `${pctA}%`, background: `linear-gradient(90deg, ${d.color}99, ${d.color})`, borderRadius: 8 }} />
                    </div>
                    <span style={{ fontSize: 13, fontWeight: 700, color: "oklch(55% 0.04 45)", minWidth: 16 }}>{d.poleB}</span>
                  </div>
                  <div style={{ display: "flex", justifyContent: "space-between", marginTop: 6 }}>
                    <span style={{ fontSize: 11, color: "oklch(55% 0.04 45)" }}>{d.labelA} {pctA}%</span>
                    <span style={{ fontSize: 11, color: "oklch(55% 0.04 45)" }}>{d.labelB} {pctB}%</span>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* Strengths */}
        <section style={{ marginBottom: 32 }}>
          <h2 style={{ fontFamily: "'Source Serif 4', serif", fontSize: 24, fontWeight: 400, color: "oklch(22% 0.06 45)", marginBottom: 16 }}>Leadership Strengths</h2>
          <ul style={{ margin: 0, padding: 0, listStyle: "none", display: "grid", gap: 10 }}>
            {typeData.strengths.map(s => (
              <li key={s} style={{ display: "flex", gap: 12, alignItems: "flex-start", background: "white", borderRadius: 10, padding: "14px 18px", border: "1px solid oklch(90% 0.03 45)" }}>
                <div style={{ width: 6, height: 6, borderRadius: "50%", background: typeData.color, marginTop: 8, flexShrink: 0 }} />
                <span style={{ fontFamily: "'Jost', sans-serif", fontSize: 15, lineHeight: 1.6, color: "oklch(28% 0.05 45)" }}>{s}</span>
              </li>
            ))}
          </ul>
        </section>

        {[
          { title: "Growth Edge", content: typeData.growth },
          { title: "Communication Insights", content: typeData.communication },
          { title: "Cross-Cultural Awareness", content: typeData.crossCultural },
        ].map(section => (
          <section key={section.title} style={{ marginBottom: 20, background: "white", borderRadius: 16, padding: "24px 28px", border: "1px solid oklch(90% 0.03 45)" }}>
            <h3 style={{ fontFamily: "'Source Serif 4', serif", fontSize: 18, fontWeight: 400, color: "oklch(20% 0.06 45)", marginBottom: 12 }}>{section.title}</h3>
            <p style={{ fontFamily: "'Jost', sans-serif", fontSize: 15, lineHeight: 1.75, color: "oklch(30% 0.04 45)", margin: 0 }}>{section.content}</p>
          </section>
        ))}

        <div style={{ display: "flex", gap: 12, flexWrap: "wrap", marginTop: 16 }}>
          {!resultSaved && (
            <button onClick={handleSave} disabled={isPending}
              style={{ padding: "13px 28px", background: typeData.color, color: "white", border: "none", borderRadius: 8, fontFamily: "'Jost', sans-serif", fontSize: 15, fontWeight: 600, cursor: "pointer", opacity: isPending ? 0.7 : 1 }}>
              {isPending ? "Saving…" : "Save to Dashboard"}
            </button>
          )}
          {resultSaved && (
            <div style={{ padding: "13px 20px", background: "oklch(92% 0.05 155)", color: "oklch(35% 0.14 155)", borderRadius: 8, fontFamily: "'Jost', sans-serif", fontSize: 15, fontWeight: 600 }}>
              ✓ Saved to your dashboard
            </div>
          )}
          <button onClick={startQuiz} style={{ padding: "13px 28px", background: "white", color: "oklch(35% 0.08 45)", border: "2px solid oklch(85% 0.03 45)", borderRadius: 8, fontFamily: "'Jost', sans-serif", fontSize: 15, fontWeight: 600, cursor: "pointer" }}>
            Retake Assessment
          </button>
        </div>
      </div>
    </div>
  );
}

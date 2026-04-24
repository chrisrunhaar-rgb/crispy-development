"use client";

import { useState, useTransition } from "react";
import { saveResourceToDashboard, save16PersonalitiesResult } from "../actions";
import LangToggle from "@/components/LangToggle";

// ── QUESTIONS ─────────────────────────────────────────────────────────────────
// 60 questions, 15 per dichotomy.
// `d` = dichotomy key (EI, SN, TF, JP)
// `dir` = which pole a "5" (Strongly Agree) scores for (A or B)
//   EI: A = Extravert, B = Introvert
//   SN: A = Sensing, B = Intuition
//   TF: A = Thinking, B = Feeling
//   JP: A = Judging, B = Perceiving

const QUESTIONS: { text: string; d: string; dir: "A" | "B" }[] = [
  // E/I — Energy Direction
  { text: "I feel energised after spending time with a large group of people.", d: "EI", dir: "A" },
  { text: "I find it easy to introduce myself to strangers at social events.", d: "EI", dir: "A" },
  { text: "I think better when talking things through with others.", d: "EI", dir: "A" },
  { text: "I enjoy being the centre of attention in social situations.", d: "EI", dir: "A" },
  { text: "I prefer to process my thoughts by talking rather than reflecting in silence.", d: "EI", dir: "A" },
  { text: "After a long week, being around friends and people replenishes my energy.", d: "EI", dir: "A" },
  { text: "I am talkative and expressive — people say they always know what I'm thinking.", d: "EI", dir: "A" },
  { text: "After social interaction, I need quiet time alone to recharge.", d: "EI", dir: "B" },
  { text: "I prefer deep one-on-one conversations over large group discussions.", d: "EI", dir: "B" },
  { text: "I think carefully before I speak and often prefer to express myself in writing.", d: "EI", dir: "B" },
  { text: "I feel drained after prolonged social interaction, even when it went well.", d: "EI", dir: "B" },
  { text: "I prefer to work through ideas in my own head before discussing them.", d: "EI", dir: "B" },
  { text: "I have a small circle of close friends rather than a large network.", d: "EI", dir: "B" },
  { text: "I need significant alone time to feel at my best.", d: "EI", dir: "B" },
  { text: "I observe situations carefully before stepping in.", d: "EI", dir: "B" },
  // S/N — Information Processing
  { text: "I prefer concrete facts and practical details over abstract theories.", d: "SN", dir: "A" },
  { text: "I trust what I can observe, experience, and verify in the real world.", d: "SN", dir: "A" },
  { text: "I prefer to learn through hands-on experience rather than theoretical concepts.", d: "SN", dir: "A" },
  { text: "I focus on what is — the current reality — more than what could be.", d: "SN", dir: "A" },
  { text: "I am good at noticing practical details others often miss.", d: "SN", dir: "A" },
  { text: "I prefer clear, step-by-step instructions over general principles.", d: "SN", dir: "A" },
  { text: "I tend to build on what already works rather than reinventing from scratch.", d: "SN", dir: "A" },
  { text: "I am drawn to exploring patterns, possibilities, and future potential.", d: "SN", dir: "B" },
  { text: "I enjoy thinking about abstract ideas and hypothetical scenarios.", d: "SN", dir: "B" },
  { text: "I often have hunches or insights I can't fully explain logically.", d: "SN", dir: "B" },
  { text: "I find routine and repetition draining — I need novelty and new challenges.", d: "SN", dir: "B" },
  { text: "I am more excited by future possibilities than present realities.", d: "SN", dir: "B" },
  { text: "I enjoy reading between the lines and seeing deeper meaning in things.", d: "SN", dir: "B" },
  { text: "I am energised by big-picture thinking and visionary discussions.", d: "SN", dir: "B" },
  { text: "I often trust my instincts over hard data when making decisions.", d: "SN", dir: "B" },
  // T/F — Decision Making
  { text: "When making a decision, I prioritise logic and consistency over personal feelings.", d: "TF", dir: "A" },
  { text: "I believe it is more important to be honest than tactful.", d: "TF", dir: "A" },
  { text: "I am comfortable challenging someone's reasoning even if it creates conflict.", d: "TF", dir: "A" },
  { text: "I make decisions based primarily on objective analysis rather than gut feeling.", d: "TF", dir: "A" },
  { text: "I value competence and effectiveness above harmony in a working environment.", d: "TF", dir: "A" },
  { text: "I am not easily swayed by emotion when I believe the facts point in a clear direction.", d: "TF", dir: "A" },
  { text: "I prefer to critique an idea directly rather than soften my feedback.", d: "TF", dir: "A" },
  { text: "When making decisions, I am strongly influenced by how they will affect the people involved.", d: "TF", dir: "B" },
  { text: "I naturally sense the emotional atmosphere in a room and respond to it.", d: "TF", dir: "B" },
  { text: "I find it difficult to make decisions that I know will hurt someone I care about.", d: "TF", dir: "B" },
  { text: "I am more concerned with maintaining harmony than winning an argument.", d: "TF", dir: "B" },
  { text: "I give significant weight to personal values and convictions when deciding.", d: "TF", dir: "B" },
  { text: "I often deliver feedback in a way that first considers the other person's feelings.", d: "TF", dir: "B" },
  { text: "A decision that is logically correct but deeply harms someone feels wrong to me.", d: "TF", dir: "B" },
  { text: "I find meaning through interpersonal connection more than through intellectual clarity.", d: "TF", dir: "B" },
  // J/P — Lifestyle Orientation
  { text: "I prefer to have a clear plan and feel unsettled when things are up in the air.", d: "JP", dir: "A" },
  { text: "I like to make decisions and move forward rather than keeping options open.", d: "JP", dir: "A" },
  { text: "I find it satisfying to complete tasks and check things off my list.", d: "JP", dir: "A" },
  { text: "I organise my time carefully and dislike being late or unprepared.", d: "JP", dir: "A" },
  { text: "Deadlines give me structure; I feel uncomfortable leaving things to the last minute.", d: "JP", dir: "A" },
  { text: "I prefer a structured, organised environment over a flexible, spontaneous one.", d: "JP", dir: "A" },
  { text: "I like to settle important matters and move on rather than leave them open-ended.", d: "JP", dir: "A" },
  { text: "I prefer to keep my options open rather than commit to a fixed plan too early.", d: "JP", dir: "B" },
  { text: "I work well under pressure and often produce my best work close to a deadline.", d: "JP", dir: "B" },
  { text: "I find rigid plans and structures constraining — I prefer to stay flexible.", d: "JP", dir: "B" },
  { text: "I enjoy spontaneity and am comfortable adapting as I go.", d: "JP", dir: "B" },
  { text: "I prefer to gather more information before committing to a decision.", d: "JP", dir: "B" },
  { text: "I am comfortable with ambiguity and see it as full of possibility.", d: "JP", dir: "B" },
  { text: "I tend to start multiple projects simultaneously and enjoy the variety.", d: "JP", dir: "B" },
  { text: "I resist being boxed in — I like to respond to what emerges rather than pre-plan everything.", d: "JP", dir: "B" },
];

// Round-robin: EI1, SN1, TF1, JP1, EI2, SN2, ...
const QUESTION_ORDER: number[] = [];
const byDichotomy: Record<string, number[]> = { EI: [], SN: [], TF: [], JP: [] };
QUESTIONS.forEach((q, i) => byDichotomy[q.d].push(i));
for (let r = 0; r < 15; r++) {
  for (const d of ["EI", "SN", "TF", "JP"]) {
    const idx = byDichotomy[d][r];
    if (idx !== undefined) QUESTION_ORDER.push(idx);
  }
}

const SCALE_LABELS = ["Strongly disagree", "Disagree", "Neutral", "Agree", "Strongly agree"];

// ── TYPE DATA ─────────────────────────────────────────────────────────────────

const TYPE_DATA: Record<string, {
  name: string; subtitle: string; tagline: string;
  color: string; colorLight: string; colorVeryLight: string; bg: string;
  overview: string; strengths: string[]; blindspots: string[];
  communication: string; crossCultural: string; leadership: string;
}> = {
  INTJ: {
    name: "INTJ", subtitle: "The Architect", tagline: "Strategic. Independent. Long-range visionary.",
    color: "oklch(48% 0.20 260)", colorLight: "oklch(62% 0.14 260)", colorVeryLight: "oklch(94% 0.04 260)",
    bg: "oklch(16% 0.16 260)",
    overview: "INTJs are strategic, independent thinkers who see the world as a system to be understood and improved. They are deeply driven to build long-range plans that work — combining vision with relentless execution. They are quiet but formidable, and they hold high standards for themselves and everyone around them.",
    strengths: ["Long-range strategic thinking", "Independent and self-directed", "Holds high standards and follows through", "Synthesises complex information into clear frameworks", "Decisive and confident in their convictions"],
    blindspots: ["Can be perceived as cold or dismissive of others' feelings", "May struggle to communicate their vision accessibly", "Perfectionism can slow progress", "Can undervalue relational dynamics in favour of efficiency"],
    communication: "Be direct and intellectually substantive. Avoid small talk or vague platitudes — they respect clarity and competence. Give them time to think. Don't push for emotional disclosure; earn their trust through consistency and depth.",
    crossCultural: "The INTJ's preference for directness and efficiency can be off-putting in relational or high-context cultures. Their tendency to work independently can be misread as arrogance or exclusion. Growth edge: investing in relational trust as a strategic asset, not a soft nicety.",
    leadership: "INTJs lead through vision and strategy. They are most effective when they communicate their long-range thinking accessibly and build the relational trust that allows their high standards to inspire rather than intimidate.",
  },
  INTP: {
    name: "INTP", subtitle: "The Logician", tagline: "Analytical. Original. A thinker of ideas.",
    color: "oklch(48% 0.18 240)", colorLight: "oklch(62% 0.13 240)", colorVeryLight: "oklch(94% 0.03 240)",
    bg: "oklch(16% 0.14 240)",
    overview: "INTPs are driven by a profound need to understand how things work. They are deep, original thinkers who enjoy complex problems and rarely accept conventional explanations. They bring rigorous logic and creativity to everything they engage with — and their insights are often ahead of their time.",
    strengths: ["Deep analytical and logical thinking", "Highly original and creative", "Sees connections others miss", "Objective and unbiased in analysis", "Endlessly curious and self-directed in learning"],
    blindspots: ["Can be indecisive — always finding new angles", "May come across as detached or uncaring", "Struggles to follow through on implementation", "Communication of complex ideas can be inaccessible"],
    communication: "Give them space to think. Don't push for quick decisions. Engage with their ideas — they respond to genuine intellectual curiosity. Avoid rushing or over-simplifying; they notice and lose respect for it.",
    crossCultural: "INTPs' preference for precision and debate over harmony can be jarring in high-context or consensus-oriented cultures. Their directness about flaws in ideas can land as personal criticism. Growth edge: wrapping their analysis in relational warmth.",
    leadership: "INTPs lead best in advisory, analytical, or innovation-focused roles. They need support structures for execution and a trusted partner who translates their vision into action. Their greatest leadership gift is the quality of their thinking.",
  },
  ENTJ: {
    name: "ENTJ", subtitle: "The Commander", tagline: "Decisive. Bold. A natural leader.",
    color: "oklch(50% 0.22 25)", colorLight: "oklch(63% 0.17 25)", colorVeryLight: "oklch(94% 0.04 25)",
    bg: "oklch(17% 0.16 25)",
    overview: "ENTJs are natural executives — decisive, bold, and driven to lead. They see inefficiency and immediately want to fix it. They are long-range strategic thinkers who combine vision with the relentless energy to execute. They are often the most forceful leader in the room — and they thrive when the challenge matches their ambition.",
    strengths: ["Decisive and highly action-oriented", "Exceptional long-range strategic planning", "Leads with confidence and conviction", "Builds systems and structures that deliver results", "Energises teams through visible leadership and ambition"],
    blindspots: ["Can be domineering and impatient with slower thinkers", "May undervalue emotional dynamics", "Pushes too hard — burns teams out", "Struggles to receive feedback or be wrong"],
    communication: "Match their directness. Be prepared, confident, and competent. Come with solutions, not just problems. Don't be passive — they lose respect for people who can't hold their own. Express disagreement clearly and be ready to debate.",
    crossCultural: "The ENTJ's directness and assertiveness can be culturally disruptive in high-context, face-saving cultures. Their pace can leave others behind. Growth edge: slowing down to hear what is not being said, and leading through influence as much as authority.",
    leadership: "ENTJs lead through clarity of vision, decisive action, and high standards. Their growth edge is the discipline of leading people, not just driving outcomes — building trust, not just compliance.",
  },
  ENTP: {
    name: "ENTP", subtitle: "The Debater", tagline: "Innovative. Energetic. Full of ideas.",
    color: "oklch(58% 0.20 45)", colorLight: "oklch(70% 0.15 45)", colorVeryLight: "oklch(94% 0.04 45)",
    bg: "oklch(17% 0.14 45)",
    overview: "ENTPs are idea machines. They love debate, innovation, and challenging the status quo. They are energised by complexity and driven to find creative solutions to difficult problems. They are charismatic, quick, and often the most stimulating person in the room — though follow-through is a consistent growth area.",
    strengths: ["Highly creative and generative with ideas", "Comfortable challenging assumptions and status quo", "Quick thinker — connects disparate ideas easily", "Charismatic and energising in group settings", "Adaptive and resilient in changing environments"],
    blindspots: ["More interested in starting than finishing", "Can argue for the sake of debate, not resolution", "May neglect feelings of those affected by their directness", "Struggles with routine, administration, and follow-through"],
    communication: "Engage their ideas — they love a good debate. Be direct and energised. Bring them challenging problems, not routine tasks. They respect intellectual honesty; don't pretend to agree if you don't.",
    crossCultural: "ENTPs' love of debate and challenge can be deeply uncomfortable in consensus-oriented or high-power-distance cultures where confronting ideas = confronting people. Growth edge: channelling their energy into collaborative exploration rather than adversarial testing.",
    leadership: "ENTPs lead through energy, ideas, and the force of their vision. They need structures and people around them who turn ideas into execution. Their leadership gift is making people believe things can be different.",
  },
  INFJ: {
    name: "INFJ", subtitle: "The Advocate", tagline: "Principled. Visionary. Deeply caring.",
    color: "oklch(48% 0.22 295)", colorLight: "oklch(62% 0.17 295)", colorVeryLight: "oklch(94% 0.04 295)",
    bg: "oklch(15% 0.18 295)",
    overview: "INFJs combine deep conviction, empathy, and long-range vision. They are rare leaders who hold both clarity of principle and genuine compassion. They are often described as quiet visionaries — leading through the depth of their insight and the authenticity of their care. They are the most privately driven of all types.",
    strengths: ["Deep empathy and insight into people", "Principled and clear in their values", "Long-range visionary thinking", "Holds complexity — nuanced in their perspective", "Deeply committed once they believe in something"],
    blindspots: ["Can be private to the point of isolation", "Highly sensitive to conflict and criticism", "May hold unrealistically high standards for others", "Burns out from absorbing others' emotional weight"],
    communication: "Be genuine and values-driven. Acknowledge their insight and care. Don't be shallow or transactional — they see through it immediately. Give them time and space; they process deeply and share when they trust.",
    crossCultural: "INFJs' care and depth resonate across cultures, but their idealism can clash with pragmatic or hierarchical cultures where relationships are transactional. Growth edge: holding their convictions without becoming rigid or withdrawn when reality doesn't meet their vision.",
    leadership: "INFJs lead through the power of their vision and the depth of their care. They inspire uncommon loyalty. Their growth edge is learning to express their vision with enough clarity and confidence that others can follow without needing to interpret.",
  },
  INFP: {
    name: "INFP", subtitle: "The Mediator", tagline: "Idealistic. Empathetic. Authentically self-directed.",
    color: "oklch(52% 0.18 10)", colorLight: "oklch(65% 0.13 10)", colorVeryLight: "oklch(94% 0.03 10)",
    bg: "oklch(16% 0.14 10)",
    overview: "INFPs are quiet idealists who lead from deeply held personal values. They are creative, empathetic, and profoundly caring about the people and causes that matter to them. They are not interested in systems or efficiency for their own sake — they are motivated by meaning, authenticity, and the freedom to grow.",
    strengths: ["Deep empathy and emotional attunement", "Strong personal values and sense of integrity", "Creative and original in their thinking", "Builds authentic, meaningful connections", "Passionate about causes that align with their values"],
    blindspots: ["Can struggle with conflict and assertiveness", "May be too idealistic — resistant to compromise", "Vulnerable to taking criticism personally", "Can be paralysed by decision-making when values conflict"],
    communication: "Create space for depth and authenticity. Acknowledge feelings before facts. Don't be dismissive of their values — they are central to who they are. Give them time; they are thoughtful and deliberate in their communication.",
    crossCultural: "INFPs' individualism and focus on personal authenticity can be countercultural in collectivist contexts. Growth edge: learning to find meaning within communal structures, not only in spite of them.",
    leadership: "INFPs lead best when their role is deeply aligned with their values. They inspire through authenticity and care. Their growth edge is building the assertiveness and structure that allows their vision to become practical reality.",
  },
  ENFJ: {
    name: "ENFJ", subtitle: "The Protagonist", tagline: "Charismatic. Inspiring. A natural developer of people.",
    color: "oklch(52% 0.18 155)", colorLight: "oklch(65% 0.13 155)", colorVeryLight: "oklch(94% 0.03 155)",
    bg: "oklch(16% 0.12 155)",
    overview: "ENFJs are born leaders who bring people together and call out the best in everyone around them. They are warm, visionary, and deeply invested in the growth of the people they lead. They have a rare ability to hold both the long-range vision and the human dynamics of a team simultaneously.",
    strengths: ["Naturally inspiring and motivating", "Deep investment in others' growth and development", "Excellent communicator — clear, warm, and visionary", "Brings harmony and direction simultaneously", "Sees potential in people that others miss"],
    blindspots: ["Overextends in service of others' needs", "Can be too focused on consensus — struggles with necessary conflict", "Takes criticism or rejection personally", "May neglect their own needs and boundaries"],
    communication: "Be warm, personal, and purpose-driven. Acknowledge their investment in people. Engage with their vision genuinely. Don't be cold or transactional — it disengages them quickly.",
    crossCultural: "ENFJs' warmth and relational focus are gifts in almost every cultural context. In more individualistic cultures, their emphasis on community and harmony can be underestimated. Growth edge: holding their convictions when the relational cost is high.",
    leadership: "ENFJs are among the most effective people-leaders in any framework. Their growth edge is learning to lead with clarity and structure as well as warmth — and maintaining their own boundaries when they give so generously to others.",
  },
  ENFP: {
    name: "ENFP", subtitle: "The Campaigner", tagline: "Enthusiastic. Creative. Deeply human.",
    color: "oklch(60% 0.18 65)", colorLight: "oklch(72% 0.13 65)", colorVeryLight: "oklch(94% 0.03 65)",
    bg: "oklch(17% 0.12 65)",
    overview: "ENFPs are charismatic, creative, and deeply energised by possibility. They bring contagious enthusiasm to everything they do and have a rare gift for seeing the potential in people and ideas. They are at their best when their work is meaningful, their relationships are deep, and their world is full of possibility.",
    strengths: ["Genuinely creative and visionary", "Highly enthusiastic — energises everyone around them", "Deeply empathetic and people-oriented", "Adaptable and thrives in ambiguous environments", "Inspires others toward possibilities they hadn't seen"],
    blindspots: ["Can start more than they finish", "May over-personalise feedback or conflict", "Scattered when not working on something meaningful", "Can avoid necessary structure and discipline"],
    communication: "Match their energy and engage their ideas. Be genuine — they read inauthenticity quickly. Give them creative freedom within clear parameters. Acknowledge the person before the task.",
    crossCultural: "ENFPs' enthusiasm and individualism are energising in many contexts but may overwhelm or confuse more reserved or structured cultures. Growth edge: channelling energy into sustained follow-through and building the discipline that matches their vision.",
    leadership: "ENFPs lead through inspiration, creativity, and the strength of their relationships. Their growth edge is execution — building the habits and structures that translate their remarkable energy into sustained results.",
  },
  ISTJ: {
    name: "ISTJ", subtitle: "The Logistician", tagline: "Reliable. Thorough. A pillar of integrity.",
    color: "oklch(45% 0.14 215)", colorLight: "oklch(60% 0.10 215)", colorVeryLight: "oklch(94% 0.02 215)",
    bg: "oklch(15% 0.11 215)",
    overview: "ISTJs are among the most dependable leaders in any framework. They lead through consistency, thorough preparation, and an unwavering commitment to doing the right thing. They are trusted precisely because they are trustworthy — they say what they will do and do what they say.",
    strengths: ["Exceptionally reliable and consistent", "Thorough and highly organised", "Strong sense of duty and responsibility", "Calm and steady — does not panic under pressure", "Respects and upholds established systems and values"],
    blindspots: ["Can be resistant to change or new methods", "May appear inflexible or overly rigid", "Struggles with ambiguity and improvisation", "Can undervalue emotional dimensions of leadership"],
    communication: "Be precise, prepared, and respectful. Avoid vagueness or unpredictability. Give concrete information and clear expectations. Don't surprise them — they build trust through reliability and extend the same expectation to others.",
    crossCultural: "ISTJs' respect for structure and hierarchy fits well in high-power-distance cultures. In more adaptive or informal cultures, they may be perceived as inflexible. Growth edge: holding their reliability while building flexibility and comfort with ambiguity.",
    leadership: "ISTJs lead through trustworthiness, preparation, and steady execution. They build teams that know exactly what to expect and can rely on the leader to follow through. Growth edge: learning to lead through influence and inspiration, not only structure.",
  },
  ISFJ: {
    name: "ISFJ", subtitle: "The Protector", tagline: "Caring. Consistent. Deeply loyal.",
    color: "oklch(50% 0.16 185)", colorLight: "oklch(63% 0.12 185)", colorVeryLight: "oklch(94% 0.03 185)",
    bg: "oklch(15% 0.12 185)",
    overview: "ISFJs are the quiet backbone of any team they serve. They are warm, meticulous, and deeply loyal — prioritising the needs of others and the health of the community over personal recognition. Their gift is the kind of consistent, careful service that sustains organisations over decades.",
    strengths: ["Deeply caring and attentive to others' needs", "Highly reliable and consistent", "Meticulous attention to detail", "Builds genuine community and belonging", "Loyal — shows up when it counts"],
    blindspots: ["Can suppress their own needs to avoid conflict", "Uncomfortable with change — prefers what has worked", "May struggle to delegate or set firm boundaries", "Can feel unappreciated when service goes unnoticed"],
    communication: "Be warm, personal, and appreciative. Acknowledge their contributions specifically. Don't overlook them — they often won't advocate for themselves. Create safe space for them to share their own perspective.",
    crossCultural: "ISFJs' service orientation and community focus translate well across collectivist cultures. In more assertive environments, their quiet giving can be undervalued. Growth edge: claiming their voice and advocating for their own perspective as clearly as they serve others.",
    leadership: "ISFJs lead through care, reliability, and the quality of their service. They build deep loyalty and are the invisible glue of many healthy teams. Growth edge: learning to lead with appropriate authority — not just through service.",
  },
  ESTJ: {
    name: "ESTJ", subtitle: "The Executive", tagline: "Organised. Direct. A reliable builder of systems.",
    color: "oklch(48% 0.18 195)", colorLight: "oklch(62% 0.13 195)", colorVeryLight: "oklch(94% 0.03 195)",
    bg: "oklch(15% 0.14 195)",
    overview: "ESTJs are natural administrators and organisers. They bring clear expectations, decisive leadership, and systematic execution to everything they run. They are direct, dependable, and driven to build structures that work — and they expect the people around them to meet the same standard.",
    strengths: ["Exceptional at organising people and resources", "Clear, direct communication and expectations", "Highly dependable — delivers on what they commit to", "Creates order and clarity in complex situations", "Strong work ethic and commitment to results"],
    blindspots: ["Can be inflexible and resistant to alternative approaches", "May come across as domineering or controlling", "Undervalues emotional dynamics and relational needs", "Can struggle with innovation or change to established systems"],
    communication: "Be direct, factual, and businesslike. Come prepared with clear information. Avoid vagueness. Express disagreement respectfully but directly — they respond to clarity, not hints.",
    crossCultural: "ESTJs' directness and hierarchical clarity fit well in many structured cultures. In more fluid, relational contexts, their need for order can feel controlling. Growth edge: building flexibility into their systems and creating genuine space for others' input.",
    leadership: "ESTJs lead through clear structures, decisive action, and consistent follow-through. They are excellent execution leaders. Growth edge: leading with influence as well as authority — and creating teams where people are genuinely developed, not just managed.",
  },
  ESFJ: {
    name: "ESFJ", subtitle: "The Consul", tagline: "Warm. Organised. Deeply community-focused.",
    color: "oklch(55% 0.18 35)", colorLight: "oklch(67% 0.13 35)", colorVeryLight: "oklch(94% 0.04 35)",
    bg: "oklch(16% 0.13 35)",
    overview: "ESFJs are warm, organised, and deeply invested in the wellbeing of the communities they serve. They combine genuine care for people with practical organisation — they keep the team functioning, ensure everyone feels valued, and hold the social fabric together. They are often the most trusted person in the room.",
    strengths: ["Warm and genuinely caring toward others", "Highly organised and reliable", "Excellent at building community and belonging", "Responsive to others' practical needs", "Natural host — creates safe, welcoming environments"],
    blindspots: ["Can prioritise harmony over necessary truth", "Vulnerable to approval-seeking and people-pleasing", "May struggle to make decisions that disappoint", "Can avoid confrontation to an unhealthy degree"],
    communication: "Be warm, personal, and appreciative. Acknowledge the relationship before the task. Express genuine gratitude — it energises them. Avoid abruptness or cold efficiency.",
    crossCultural: "ESFJs' warmth and community focus translate well across collectivist cultures. In more individualistic contexts, their relational investment can be misread as intrusive. Growth edge: learning to hold their convictions clearly when the relational pressure is to compromise.",
    leadership: "ESFJs lead through warmth, reliability, and community-building. They create teams where people genuinely feel they belong. Growth edge: developing the capacity for productive conflict — the kind of honesty that serves people, even when it's uncomfortable.",
  },
  ISTP: {
    name: "ISTP", subtitle: "The Virtuoso", tagline: "Practical. Observant. Cool under pressure.",
    color: "oklch(50% 0.15 145)", colorLight: "oklch(63% 0.11 145)", colorVeryLight: "oklch(94% 0.02 145)",
    bg: "oklch(15% 0.11 145)",
    overview: "ISTPs are practical problem-solvers who excel in hands-on, technical, and high-stakes environments. They are cool, observant, and quietly competent — the person you want when things are going wrong and clear thinking is needed. They work best with maximum autonomy and minimum unnecessary structure.",
    strengths: ["Exceptional practical problem-solving", "Calm and clear-headed under pressure", "Highly observant — notices what others miss", "Efficient — cuts to what needs to be done", "Adaptable and resourceful in unexpected situations"],
    blindspots: ["Can appear emotionally remote or indifferent", "Struggles with long-term planning and commitment", "May resist structure or oversight", "Rarely communicates what they're thinking or feeling"],
    communication: "Be direct and practical. Skip the preamble and get to the point. Give them space and autonomy — oversight frustrates them. Don't push for emotional sharing; they engage through action, not words.",
    crossCultural: "ISTPs' practical competence is valued in almost every context. Their emotional reserve can be misread as coldness or disengagement in relational cultures. Growth edge: learning to express investment in people through words as well as action.",
    leadership: "ISTPs lead most effectively in technical, crisis, or execution-focused roles. They lead by example — quietly doing what needs to be done. Growth edge: communicating vision and developing people, not just solving problems.",
  },
  ISFP: {
    name: "ISFP", subtitle: "The Adventurer", tagline: "Gentle. Creative. Present in the moment.",
    color: "oklch(55% 0.18 150)", colorLight: "oklch(67% 0.13 150)", colorVeryLight: "oklch(94% 0.03 150)",
    bg: "oklch(16% 0.13 150)",
    overview: "ISFPs are gentle, creative, and deeply loyal individuals who lead with quiet authenticity. They are finely attuned to the world around them and bring beauty, care, and genuine presence to everything they do. They are not interested in power or recognition — they lead because they care.",
    strengths: ["Deeply caring and attentive", "Creative and aesthetically sensitive", "Authentic — no performance or pretence", "Loyal and present with people they care about", "Flexible and open to others' perspectives"],
    blindspots: ["Can avoid conflict to an unhealthy degree", "May struggle to assert their own needs and perspective", "Vulnerable to criticism — takes it deeply personally", "Can be private to the point of inaccessibility"],
    communication: "Be gentle, personal, and genuinely caring. Create space for them to share at their own pace. Don't pressure or crowd them. Acknowledge their contributions, especially the quiet ones.",
    crossCultural: "ISFPs' gentleness and adaptability serve them well in most cultures. In highly competitive or assertive environments, their quiet approach can leave them overlooked. Growth edge: finding the courage to be seen and heard, not just felt.",
    leadership: "ISFPs lead through authenticity and genuine care. They create environments of safety and trust. Growth edge: learning to speak their vision with confidence and to hold appropriate authority without feeling it compromises their values.",
  },
  ESTP: {
    name: "ESTP", subtitle: "The Entrepreneur", tagline: "Energetic. Observant. Action-first.",
    color: "oklch(58% 0.20 55)", colorLight: "oklch(70% 0.15 55)", colorVeryLight: "oklch(94% 0.04 55)",
    bg: "oklch(17% 0.14 55)",
    overview: "ESTPs are action-oriented, perceptive, and energised by the real world. They read situations quickly, move fast, and have a remarkable ability to make things happen in the moment. They are often the most tactically skilled leader in the room — and they thrive in environments that reward speed and adaptability.",
    strengths: ["Fast, action-oriented decision-making", "Highly perceptive in real-time situations", "Energetic and charismatic", "Excellent negotiator and communicator", "Resilient and adaptable under pressure"],
    blindspots: ["Can neglect long-term planning for short-term action", "May struggle with strategic patience", "Can appear risk-seeking to the point of recklessness", "May undervalue emotional and relational dynamics"],
    communication: "Be direct, energetic, and concrete. Skip the theory and show them in practice. Keep conversations dynamic and action-focused. They engage quickly and move on fast — get to the point.",
    crossCultural: "ESTPs' boldness and directness are valued in action-oriented cultures but can feel reckless or disrespectful in more deliberative or consensus-driven environments. Growth edge: building the patience for process and the sensitivity for face-saving.",
    leadership: "ESTPs lead best in dynamic, high-stakes, real-world contexts. They are tactical masters. Growth edge: developing strategic patience and the relational depth that sustains teams over the long term.",
  },
  ESFP: {
    name: "ESFP", subtitle: "The Entertainer", tagline: "Spontaneous. Energetic. Genuinely joyful.",
    color: "oklch(62% 0.20 48)", colorLight: "oklch(73% 0.15 48)", colorVeryLight: "oklch(94% 0.04 48)",
    bg: "oklch(17% 0.14 48)",
    overview: "ESFPs are warm, spontaneous, and full of genuine enthusiasm for life and people. They bring joy, energy, and infectious positivity to every environment they enter. They are generous, fun-loving, and genuinely invested in the people around them — they make people feel seen and valued in an instant.",
    strengths: ["Warm, generous, and genuinely caring", "Brings energy and joy to team culture", "Spontaneous and highly adaptable", "Excellent at reading and responding to people", "Makes people feel genuinely welcomed and valued"],
    blindspots: ["Can avoid long-term planning and difficult decisions", "May prioritise fun over follow-through", "Vulnerable to distractions and can lose focus", "Struggles with criticism and conflict"],
    communication: "Be warm, positive, and personal. Engage with their energy genuinely. Don't be cold, heavy, or over-serious — they disengage. Show appreciation frequently and specifically.",
    crossCultural: "ESFPs' warmth and expressiveness are gifts in relational cultures. In more reserved or structured environments, their spontaneity can seem unprofessional. Growth edge: channelling their social gifts into the disciplined follow-through that turns relationships into results.",
    leadership: "ESFPs lead through joy, energy, and the power of genuine connection. They create cultures where people want to show up. Growth edge: developing strategic discipline and the capacity to lead through difficulty as well as celebration.",
  },
};

// ── COMPONENT ─────────────────────────────────────────────────────────────────

type QuizState = "idle" | "active" | "done";

function computeType(scores: Record<string, number>): { type: string; pcts: Record<string, number> } {
  // scores = { EI_A: n, EI_B: n, SN_A: n, SN_B: n, TF_A: n, TF_B: n, JP_A: n, JP_B: n }
  const total = 15 * 5; // 15 questions, max 5 each
  const ePct = Math.round((scores.EI_A ?? 0) / total * 100);
  const iPct = 100 - ePct;
  const sPct = Math.round((scores.SN_A ?? 0) / total * 100);
  const nPct = 100 - sPct;
  const tPct = Math.round((scores.TF_A ?? 0) / total * 100);
  const fPct = 100 - tPct;
  const jPct = Math.round((scores.JP_A ?? 0) / total * 100);
  const pPct = 100 - jPct;
  const type = [
    ePct >= 50 ? "E" : "I",
    sPct >= 50 ? "S" : "N",
    tPct >= 50 ? "T" : "F",
    jPct >= 50 ? "J" : "P",
  ].join("");
  return { type, pcts: { E: ePct, I: iPct, S: sPct, N: nPct, T: tPct, F: fPct, J: jPct, P: pPct } };
}

const DICHOTOMY_LABELS = [
  { keyA: "E", keyB: "I", label: "Energy", descA: "Extraversion", descB: "Introversion", color: "oklch(60% 0.18 52)" },
  { keyA: "S", keyB: "N", label: "Information", descA: "Sensing", descB: "Intuition", color: "oklch(52% 0.22 280)" },
  { keyA: "T", keyB: "F", label: "Decisions", descA: "Thinking", descB: "Feeling", color: "oklch(50% 0.18 215)" },
  { keyA: "J", keyB: "P", label: "Structure", descA: "Judging", descB: "Perceiving", color: "oklch(50% 0.20 25)" },
];

export default function Personalities16Client({
  isSaved: isSavedProp,
  savedType,
  savedScores,
}: {
  isSaved: boolean;
  savedType: string | null;
  savedScores: Record<string, number> | null;
}) {
  const initialState: QuizState = savedType && savedScores ? "done" : "idle";
  const [quizState, setQuizState] = useState<QuizState>(initialState);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [scores, setScores] = useState<Record<string, number>>(
    savedScores ?? { EI_A: 0, EI_B: 0, SN_A: 0, SN_B: 0, TF_A: 0, TF_B: 0, JP_A: 0, JP_B: 0 }
  );
  const [answerHistory, setAnswerHistory] = useState<{ qIdx: number; value: number; key: string }[]>([]);
  const [isSaved, setIsSaved] = useState(isSavedProp);
  const [resultSaved, setResultSaved] = useState(!!savedType);
  const [isPending, startTransition] = useTransition();

  function startQuiz() {
    setCurrentIdx(0);
    setScores({ EI_A: 0, EI_B: 0, SN_A: 0, SN_B: 0, TF_A: 0, TF_B: 0, JP_A: 0, JP_B: 0 });
    setAnswerHistory([]);
    setQuizState("active");
    window.scrollTo({ top: document.getElementById("quiz-section")?.offsetTop ?? 0, behavior: "smooth" });
  }

  function handleAnswer(value: number) {
    const qIdx = QUESTION_ORDER[currentIdx];
    const q = QUESTIONS[qIdx];
    const scoreKey = `${q.d}_${q.dir}`;
    setAnswerHistory(prev => [...prev, { qIdx, value, key: scoreKey }]);
    setScores(prev => ({ ...prev, [scoreKey]: (prev[scoreKey] ?? 0) + value }));
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
    setScores(prev => ({ ...prev, [last.key]: (prev[last.key] ?? 0) - last.value }));
    setAnswerHistory(prev => prev.slice(0, -1));
    setCurrentIdx(prev => prev - 1);
  }

  function handleSave() {
    startTransition(async () => {
      const { type } = computeType(scores);
      if (!isSaved) {
        await saveResourceToDashboard("16-personalities");
        setIsSaved(true);
      }
      const result = await save16PersonalitiesResult(type, scores);
      if (!result.error) setResultSaved(true);
    });
  }

  // ── IDLE ───────────────────────────────────────────────────────────────────
  if (quizState === "idle") {
    return (
      <div style={{ minHeight: "100vh", background: "oklch(98% 0.006 260)", fontFamily: "'Outfit', sans-serif" }}>
        <LangToggle />
        <style>{`
          @import url('https://fonts.googleapis.com/css2?family=Libre+Baskerville:ital,wght@0,400;0,700;1,400&family=Outfit:wght@300;400;500;600&display=swap');
          .p16-btn { transition: all 0.18s ease; cursor: pointer; }
          .p16-btn:hover { transform: translateY(-1px); }
          .type-chip:hover { transform: translateY(-2px); box-shadow: 0 6px 24px oklch(48% 0.20 260 / 0.15); }
          .type-chip { transition: all 0.18s ease; cursor: default; }
        `}</style>

        <div style={{ background: "oklch(20% 0.18 260)", color: "white", padding: "72px 24px 64px" }}>
          <div style={{ maxWidth: 760, margin: "0 auto" }}>
            <p style={{ color: "oklch(65% 0.15 45)", fontSize: 12, fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", marginBottom: 20 }}>
              Personal Development · Assessment
            </p>
            <h1 style={{ fontFamily: "'Libre Baskerville', Georgia, serif", fontSize: "clamp(34px, 5vw, 54px)", fontWeight: 400, lineHeight: 1.1, marginBottom: 20, letterSpacing: "-0.01em" }}>
              16 Personalities
            </h1>
            <p style={{ fontFamily: "'Outfit', sans-serif", fontSize: 17, fontWeight: 400, lineHeight: 1.7, color: "oklch(82% 0.07 260)", maxWidth: 580 }}>
              One of the world's most widely used personality frameworks — discover your four-letter type and understand how your natural wiring shapes how you lead, think, and relate.
            </p>
            <button
              onClick={startQuiz}
              className="p16-btn"
              style={{ marginTop: 36, padding: "14px 36px", background: "oklch(62% 0.22 260)", color: "white", border: "none", borderRadius: 8, fontFamily: "'Outfit', sans-serif", fontSize: 16, fontWeight: 600 }}
            >
              Start Assessment →
            </button>
          </div>
        </div>

        <div style={{ maxWidth: 760, margin: "0 auto", padding: "56px 24px" }}>
          <section style={{ marginBottom: 52 }}>
            <h2 style={{ fontFamily: "'Libre Baskerville', serif", fontSize: 26, fontWeight: 400, color: "oklch(20% 0.14 260)", marginBottom: 16 }}>
              What is the 16 Personalities Framework?
            </h2>
            <p style={{ fontFamily: "'Outfit', sans-serif", fontSize: 16, lineHeight: 1.75, color: "oklch(30% 0.06 260)", marginBottom: 14 }}>
              The 16 Personalities framework is based on four key dimensions of personality — how you direct your energy, process information, make decisions, and organise your life. By identifying your preference on each dimension, you arrive at a four-letter type — one of sixteen distinct profiles, each with its own characteristic strengths, blindspots, and leadership style.
            </p>
            <p style={{ fontFamily: "'Outfit', sans-serif", fontSize: 16, lineHeight: 1.75, color: "oklch(30% 0.06 260)" }}>
              This framework has been widely applied in teams, organisations, and cross-cultural contexts. It is particularly useful for understanding communication differences, leadership dynamics, and team composition.
            </p>
          </section>

          <section style={{ marginBottom: 52 }}>
            <h2 style={{ fontFamily: "'Libre Baskerville', serif", fontSize: 26, fontWeight: 400, color: "oklch(20% 0.14 260)", marginBottom: 8 }}>
              The Four Dimensions
            </h2>
            <p style={{ fontFamily: "'Outfit', sans-serif", fontSize: 15, color: "oklch(45% 0.06 260)", marginBottom: 24 }}>
              Each dimension is a spectrum — your type reflects your natural preference, not your only capability.
            </p>
            <div style={{ display: "grid", gap: 14 }}>
              {[
                ["E — Extraversion", "I — Introversion", "Where do you direct your energy?", "oklch(62% 0.18 52)"],
                ["S — Sensing", "N — Intuition", "How do you gather and process information?", "oklch(55% 0.22 280)"],
                ["T — Thinking", "F — Feeling", "How do you make decisions?", "oklch(52% 0.18 215)"],
                ["J — Judging", "P — Perceiving", "How do you organise your life and work?", "oklch(52% 0.20 25)"],
              ].map(([a, b, desc, col]) => (
                <div key={a} style={{ background: "white", borderRadius: 12, padding: "20px 24px", border: "1px solid oklch(90% 0.04 260)", display: "flex", gap: 16, alignItems: "center", flexWrap: "wrap" }}>
                  <div style={{ display: "flex", gap: 8, alignItems: "center", flexShrink: 0 }}>
                    <span style={{ fontFamily: "'Libre Baskerville', serif", fontSize: 18, fontWeight: 700, color: col as string }}>{a}</span>
                    <span style={{ color: "oklch(70% 0.05 260)", fontSize: 14 }}>vs</span>
                    <span style={{ fontFamily: "'Libre Baskerville', serif", fontSize: 18, fontWeight: 700, color: "oklch(45% 0.08 260)" }}>{b}</span>
                  </div>
                  <span style={{ fontFamily: "'Outfit', sans-serif", fontSize: 14, color: "oklch(40% 0.06 260)" }}>{desc}</span>
                </div>
              ))}
            </div>
          </section>

          {/* All 16 types preview */}
          <section style={{ marginBottom: 48 }}>
            <h2 style={{ fontFamily: "'Libre Baskerville', serif", fontSize: 26, fontWeight: 400, color: "oklch(20% 0.14 260)", marginBottom: 8 }}>
              The 16 Types
            </h2>
            <p style={{ fontFamily: "'Outfit', sans-serif", fontSize: 15, color: "oklch(45% 0.06 260)", marginBottom: 24 }}>
              Each type has its own distinct profile. Yours will be revealed after completing the assessment.
            </p>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(160px, 1fr))", gap: 12 }}>
              {Object.values(TYPE_DATA).map(t => (
                <div key={t.name} className="type-chip" style={{ background: "white", borderRadius: 12, padding: "16px", border: `1px solid ${t.colorVeryLight}`, textAlign: "center" }}>
                  <div style={{ fontFamily: "'Libre Baskerville', serif", fontSize: 22, fontWeight: 700, color: t.color, marginBottom: 4 }}>{t.name}</div>
                  <div style={{ fontFamily: "'Outfit', sans-serif", fontSize: 12, fontWeight: 500, color: "oklch(45% 0.06 260)" }}>{t.subtitle}</div>
                </div>
              ))}
            </div>
          </section>

          <section style={{ background: "white", borderRadius: 16, padding: "32px 36px", border: "1px solid oklch(90% 0.04 260)" }}>
            <h2 style={{ fontFamily: "'Libre Baskerville', serif", fontSize: 22, fontWeight: 400, color: "oklch(20% 0.14 260)", marginBottom: 16 }}>
              How to take this assessment
            </h2>
            {[
              ["60 questions", "Rate each statement on a 5-point scale."],
              ["Be honest, not ideal", "Answer based on how you naturally are — not who you aspire to be."],
              ["No right answers", "Every type has genuine strengths in leadership."],
              ["Takes about 10 minutes", "Find a quiet moment. Rushed answers produce less accurate results."],
            ].map(([label, desc]) => (
              <div key={label} style={{ display: "flex", gap: 12, alignItems: "flex-start", padding: "10px 0", borderBottom: "1px solid oklch(95% 0.03 260)" }}>
                <div style={{ width: 6, height: 6, borderRadius: "50%", background: "oklch(55% 0.22 280)", marginTop: 8, flexShrink: 0 }} />
                <div>
                  <span style={{ fontFamily: "'Outfit', sans-serif", fontSize: 15, fontWeight: 600, color: "oklch(22% 0.10 260)" }}>{label} — </span>
                  <span style={{ fontFamily: "'Outfit', sans-serif", fontSize: 15, color: "oklch(38% 0.06 260)" }}>{desc}</span>
                </div>
              </div>
            ))}
            <button
              onClick={startQuiz}
              className="p16-btn"
              style={{ marginTop: 28, padding: "13px 32px", background: "oklch(20% 0.18 260)", color: "white", border: "none", borderRadius: 8, fontFamily: "'Outfit', sans-serif", fontSize: 15, fontWeight: 600 }}
            >
              Start Assessment
            </button>
          </section>
        </div>
      </div>
    );
  }

  // ── ACTIVE ─────────────────────────────────────────────────────────────────
  if (quizState === "active") {
    const qIdx = QUESTION_ORDER[currentIdx];
    const q = QUESTIONS[qIdx];
    const dichotomy = DICHOTOMY_LABELS.find(d => d.label === (
      q.d === "EI" ? "Energy" : q.d === "SN" ? "Information" : q.d === "TF" ? "Decisions" : "Structure"
    )) ?? DICHOTOMY_LABELS[0];
    const progress = (currentIdx / QUESTION_ORDER.length) * 100;

    return (
      <div id="quiz-section" style={{ minHeight: "100vh", background: "oklch(98% 0.006 260)", fontFamily: "'Outfit', sans-serif" }}>
        <LangToggle />
        <style>{`
          @import url('https://fonts.googleapis.com/css2?family=Libre+Baskerville:ital,wght@0,400;1,400&family=Outfit:wght@400;500;600&display=swap');
          .scale-btn16 { transition: all 0.15s ease; cursor: pointer; border: 2px solid oklch(88% 0.04 260); background: white; border-radius: 10px; padding: 14px 8px; }
          .scale-btn16:hover { border-color: var(--dcolor); transform: translateY(-2px); }
        `}</style>
        <div style={{ maxWidth: 680, margin: "0 auto", padding: "40px 24px" }}>
          <div style={{ marginBottom: 40 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
              <span style={{ fontSize: 13, color: "oklch(50% 0.06 260)", fontWeight: 500 }}>{currentIdx + 1} / {QUESTION_ORDER.length}</span>
              <span style={{ fontSize: 13, fontWeight: 600, color: dichotomy.color }}>{dichotomy.label}: {dichotomy.descA} vs {dichotomy.descB}</span>
            </div>
            <div style={{ height: 4, background: "oklch(90% 0.04 260)", borderRadius: 4, overflow: "hidden" }}>
              <div style={{ height: "100%", width: `${progress}%`, background: dichotomy.color, borderRadius: 4, transition: "width 0.3s ease" }} />
            </div>
          </div>
          <div style={{ background: "white", borderRadius: 20, padding: "40px", border: "1px solid oklch(92% 0.04 260)", marginBottom: 32, minHeight: 180, display: "flex", alignItems: "center" }}>
            <p style={{ fontFamily: "'Libre Baskerville', Georgia, serif", fontSize: "clamp(17px, 2.5vw, 21px)", lineHeight: 1.6, color: "oklch(18% 0.10 260)", margin: 0, fontWeight: 400 }}>
              {q.text}
            </p>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(5, 1fr)", gap: 8, marginBottom: 32 }}>
            {SCALE_LABELS.map((label, i) => (
              <button
                key={i}
                className="scale-btn16"
                onClick={() => handleAnswer(i + 1)}
                style={{ "--dcolor": dichotomy.color, textAlign: "center", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 8 } as React.CSSProperties}
              >
                <span style={{ fontFamily: "'Libre Baskerville', serif", fontSize: 22, fontWeight: 400, color: "oklch(55% 0.10 260)" }}>{i + 1}</span>
                <span style={{ fontSize: 11, fontWeight: 500, color: "oklch(45% 0.06 260)", lineHeight: 1.3 }}>{label}</span>
              </button>
            ))}
          </div>
          <button onClick={handleBack} style={{ background: "transparent", border: "none", color: "oklch(55% 0.08 260)", fontFamily: "'Outfit', sans-serif", fontSize: 14, cursor: "pointer", padding: "8px 0" }}>
            ← Back
          </button>
        </div>
      </div>
    );
  }

  // ── DONE ───────────────────────────────────────────────────────────────────
  const { type, pcts } = computeType(scores);
  const typeData = TYPE_DATA[type] ?? TYPE_DATA.ENFP;

  return (
    <div style={{ minHeight: "100vh", background: "oklch(98% 0.006 260)", fontFamily: "'Outfit', sans-serif" }}>
      <LangToggle />
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Libre+Baskerville:ital,wght@0,400;0,700;1,400&family=Outfit:wght@300;400;500;600&display=swap');
        .bar16 { transition: width 1s cubic-bezier(0.4,0,0.2,1); }
      `}</style>

      {/* Hero */}
      <div style={{ background: typeData.bg, color: "white", padding: "56px 24px 48px" }}>
        <div style={{ maxWidth: 760, margin: "0 auto" }}>
          <p style={{ fontFamily: "'Outfit', sans-serif", fontSize: 13, fontWeight: 600, letterSpacing: "0.12em", textTransform: "uppercase", color: "oklch(72% 0.10 260)", marginBottom: 12 }}>
            Your 16 Personalities Type
          </p>
          <div style={{ display: "flex", alignItems: "center", gap: 20, flexWrap: "wrap", marginBottom: 20 }}>
            <span style={{ fontFamily: "'Libre Baskerville', serif", fontSize: "clamp(52px, 8vw, 80px)", fontWeight: 700, color: typeData.colorLight, lineHeight: 1 }}>{type}</span>
            <div>
              <div style={{ fontFamily: "'Libre Baskerville', serif", fontSize: "clamp(22px, 3vw, 32px)", fontWeight: 400, lineHeight: 1.2 }}>{typeData.subtitle}</div>
              <div style={{ fontFamily: "'Outfit', sans-serif", fontSize: 16, color: "oklch(80% 0.08 260)", marginTop: 6 }}>{typeData.tagline}</div>
            </div>
          </div>
          <p style={{ fontFamily: "'Outfit', sans-serif", fontSize: 16, lineHeight: 1.7, color: "oklch(82% 0.06 260)", maxWidth: 580 }}>
            {typeData.overview}
          </p>
        </div>
      </div>

      <div style={{ maxWidth: 760, margin: "0 auto", padding: "48px 24px" }}>

        {/* Dichotomy bars */}
        <section style={{ marginBottom: 48 }}>
          <h2 style={{ fontFamily: "'Libre Baskerville', serif", fontSize: 24, fontWeight: 400, color: "oklch(20% 0.14 260)", marginBottom: 24 }}>Your Dimension Profile</h2>
          <div style={{ display: "grid", gap: 20 }}>
            {DICHOTOMY_LABELS.map(d => {
              const pctA = pcts[d.keyA] ?? 50;
              const pctB = 100 - pctA;
              const dominant = pctA >= 50 ? d.descA : d.descB;
              const dominantPct = pctA >= 50 ? pctA : pctB;
              return (
                <div key={d.label} style={{ background: "white", borderRadius: 14, padding: "22px 26px", border: "1px solid oklch(92% 0.04 260)" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 12, flexWrap: "wrap", gap: 8 }}>
                    <span style={{ fontFamily: "'Outfit', sans-serif", fontSize: 14, fontWeight: 500, color: "oklch(40% 0.06 260)" }}>{d.label}</span>
                    <span style={{ fontFamily: "'Outfit', sans-serif", fontSize: 14, fontWeight: 600, color: d.color }}>{dominant} — {dominantPct}%</span>
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                    <span style={{ fontSize: 13, fontWeight: 600, color: d.color, minWidth: 16 }}>{d.keyA}</span>
                    <div style={{ flex: 1, height: 8, background: "oklch(93% 0.03 260)", borderRadius: 8, overflow: "hidden" }}>
                      <div className="bar16" style={{ height: "100%", width: `${pctA}%`, background: `linear-gradient(90deg, ${d.color}88, ${d.color})`, borderRadius: 8 }} />
                    </div>
                    <span style={{ fontSize: 13, fontWeight: 600, color: "oklch(55% 0.06 260)", minWidth: 16 }}>{d.keyB}</span>
                  </div>
                  <div style={{ display: "flex", justifyContent: "space-between", marginTop: 6 }}>
                    <span style={{ fontSize: 11, color: "oklch(55% 0.06 260)" }}>{d.descA} {pctA}%</span>
                    <span style={{ fontSize: 11, color: "oklch(55% 0.06 260)" }}>{d.descB} {pctB}%</span>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* Strengths & Blindspots */}
        <section style={{ marginBottom: 40, display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}>
          {[
            { title: "Strengths", items: typeData.strengths, color: "oklch(52% 0.18 155)", bg: "oklch(96% 0.03 155)" },
            { title: "Blindspots", items: typeData.blindspots, color: "oklch(52% 0.18 35)", bg: "oklch(97% 0.03 35)" },
          ].map(section => (
            <div key={section.title} style={{ background: "white", borderRadius: 16, overflow: "hidden", border: "1px solid oklch(92% 0.04 260)" }}>
              <div style={{ padding: "16px 20px", background: section.bg }}>
                <span style={{ fontFamily: "'Outfit', sans-serif", fontSize: 13, fontWeight: 600, letterSpacing: "0.08em", textTransform: "uppercase", color: section.color }}>{section.title}</span>
              </div>
              <ul style={{ margin: 0, padding: "16px 20px", listStyle: "none", display: "grid", gap: 10 }}>
                {section.items.map(item => (
                  <li key={item} style={{ display: "flex", gap: 10, alignItems: "flex-start" }}>
                    <div style={{ width: 6, height: 6, borderRadius: "50%", background: section.color, marginTop: 7, flexShrink: 0 }} />
                    <span style={{ fontFamily: "'Outfit', sans-serif", fontSize: 14, lineHeight: 1.6, color: "oklch(28% 0.06 260)" }}>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </section>

        {/* Leadership, Communication, Cross-cultural */}
        {[
          { title: "Leadership Style", content: typeData.leadership },
          { title: "Communication Insights", content: typeData.communication },
          { title: "Cross-Cultural Awareness", content: typeData.crossCultural },
        ].map(section => (
          <section key={section.title} style={{ marginBottom: 20, background: "white", borderRadius: 16, padding: "24px 28px", border: "1px solid oklch(92% 0.04 260)" }}>
            <h3 style={{ fontFamily: "'Libre Baskerville', serif", fontSize: 18, fontWeight: 400, color: "oklch(20% 0.14 260)", marginBottom: 12 }}>{section.title}</h3>
            <p style={{ fontFamily: "'Outfit', sans-serif", fontSize: 15, lineHeight: 1.75, color: "oklch(30% 0.06 260)", margin: 0 }}>{section.content}</p>
          </section>
        ))}

        {/* Save / Retake */}
        <div style={{ display: "flex", gap: 12, flexWrap: "wrap", marginTop: 16 }}>
          {!resultSaved && (
            <button onClick={handleSave} disabled={isPending}
              style={{ padding: "13px 28px", background: typeData.color, color: "white", border: "none", borderRadius: 8, fontFamily: "'Outfit', sans-serif", fontSize: 15, fontWeight: 600, cursor: "pointer", opacity: isPending ? 0.7 : 1 }}>
              {isPending ? "Saving…" : "Save to Dashboard"}
            </button>
          )}
          {resultSaved && (
            <div style={{ padding: "13px 20px", background: "oklch(92% 0.05 155)", color: "oklch(35% 0.14 155)", borderRadius: 8, fontFamily: "'Outfit', sans-serif", fontSize: 15, fontWeight: 600 }}>
              ✓ Saved to your dashboard
            </div>
          )}
          <button onClick={startQuiz} style={{ padding: "13px 28px", background: "white", color: "oklch(35% 0.10 260)", border: "2px solid oklch(85% 0.05 260)", borderRadius: 8, fontFamily: "'Outfit', sans-serif", fontSize: 15, fontWeight: 600, cursor: "pointer" }}>
            Retake Assessment
          </button>
        </div>
      </div>
    </div>
  );
}

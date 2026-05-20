"use client";

import { useState, useTransition } from "react";
import { useSearchParams } from "next/navigation";
import { saveResourceToDashboard, save16PersonalitiesResult } from "../actions";
import { trackAssessmentCompletion } from "@/lib/ga-events";
import LangToggle from "@/components/LangToggle";
import { useLanguage } from "@/lib/LanguageContext";

// ── QUESTIONS ─────────────────────────────────────────────────────────────────
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

// ── SHORT PROFILES (from Word doc) ────────────────────────────────────────────
const SHORT_PROFILES: Record<string, string> = {
  INTJ: "Independent, strategic, long-range thinkers. Often the quiet visionary who sees five steps ahead. Need space to think and dislike being rushed. Can come across as cool or distant. On a ministry team they make excellent strategists, but should be invited — not assumed — into pastoral conversations.",
  INTP: "Curious, theoretical, and precise. Want to understand how a system works before they act in it. Strong at analysis, slower to commit. Can over-analyse and under-execute if not paired with action-oriented teammates.",
  ENTJ: "Decisive, organised, and results-driven. Naturally direct people and resources toward a goal. Often rise to formal leadership quickly. Need to slow down and listen before deciding for everyone, especially in cultures where directness reads as harshness.",
  ENTP: "Energetic, idea-rich, and quick to challenge assumptions. Love brainstorming and re-thinking the way things are done. Can wear out teammates who need stability. Best when paired with someone who turns their ideas into plans.",
  INFJ: "Quiet, principled, and deeply concerned with meaning and purpose. Often the conscience of the team. Read people well and feel things deeply. Need to guard against burnout from carrying others' burdens silently.",
  INFP: "Gentle, values-driven, and creative. Hold a strong inner sense of what is right and true. Need encouragement to share their inner world with the team — they will rarely volunteer it. When given room, they bring depth that others cannot.",
  ENFJ: "Warm, persuasive, and people-focused. Skilled at drawing the best out of others and rallying a group around a vision. Need to remember that not every teammate wants to be developed all the time — sometimes people just want to do their job.",
  ENFP: "Enthusiastic, imaginative, and relational. Quick to inspire and slow to be discouraged. Bring colour and life to a team. Need help finishing what they start; pair well with a Judger who can carry projects across the line.",
  ISTJ: "Reliable, thorough, and loyal to systems and standards. The backbone of many ministry teams — finances, logistics, follow-through. Can resist change even when it is needed; benefit from being told the why, not just the what.",
  ISFJ: "Quiet servants who notice what others miss and care for people behind the scenes. Often the unseen carers of the team. Need to be invited into the spotlight, not assumed to be content in the shadows. Their faithfulness is easy to take for granted.",
  ESTJ: "Organised, direct, and accountable. Make plans happen and hold others to commitments. Strong operational leaders. Need to soften their delivery in cultures that value indirectness, where bluntness can damage relationships before it builds them.",
  ESFJ: "Warm, sociable, and devoted to the wellbeing of the group. Often the host of the team — the one who remembers birthdays, organises meals, and notices who is missing. Can take criticism personally; need reassurance more than rebuke.",
  ISTP: "Practical, hands-on, and calm under pressure. The fixer of broken things, both physical and operational. Lead by competence rather than words. Need to be drawn into the relational layer of team life — they will not push their way in.",
  ISFP: "Quiet, kind, and aesthetically sensitive. Lead through example more than through speech. Hold strong personal values but rarely impose them. Need to be asked, because they will not always volunteer their thoughts.",
  ESTP: "Action-focused, bold, and energising. Thrive in crisis and get bored in routine. Often excellent in pioneer settings or rapid-response situations. Need to learn to plan past the next twenty-four hours, especially when others depend on them.",
  ESFP: "Warm, spontaneous, and present-focused. Bring life and joy to the team and lift the room when it is heavy. Need help thinking long-term and following through on quiet commitments that no one is watching.",
};

// ── TYPE GROUPS ───────────────────────────────────────────────────────────────
const TYPE_GROUPS = [
  {
    label: "Analyst Types",
    desc: "Intuitive Thinkers",
    types: ["INTJ", "INTP", "ENTJ", "ENTP"],
    color: "oklch(48% 0.20 255)",
    bg: "oklch(96% 0.03 255)",
  },
  {
    label: "Diplomat Types",
    desc: "Intuitive Feelers",
    types: ["INFJ", "INFP", "ENFJ", "ENFP"],
    color: "oklch(48% 0.20 295)",
    bg: "oklch(96% 0.03 295)",
  },
  {
    label: "Sentinel Types",
    desc: "Sensing Judgers",
    types: ["ISTJ", "ISFJ", "ESTJ", "ESFJ"],
    color: "oklch(45% 0.16 200)",
    bg: "oklch(96% 0.02 200)",
  },
  {
    label: "Explorer Types",
    desc: "Sensing Perceivers",
    types: ["ISTP", "ISFP", "ESTP", "ESFP"],
    color: "oklch(50% 0.16 145)",
    bg: "oklch(96% 0.03 145)",
  },
];

// ── INDONESIAN TRANSLATIONS ───────────────────────────────────────────────────

const QUESTIONS_ID: { text: string; d: string; dir: "A" | "B" }[] = [
  // E/I
  { text: "Saya merasa berenergi setelah menghabiskan waktu bersama banyak orang.", d: "EI", dir: "A" },
  { text: "Saya mudah memperkenalkan diri kepada orang asing di acara sosial.", d: "EI", dir: "A" },
  { text: "Saya berpikir lebih baik saat mendiskusikan sesuatu bersama orang lain.", d: "EI", dir: "A" },
  { text: "Saya menikmati menjadi pusat perhatian dalam situasi sosial.", d: "EI", dir: "A" },
  { text: "Saya lebih suka memproses pikiran dengan berbicara daripada merenung dalam keheningan.", d: "EI", dir: "A" },
  { text: "Setelah seminggu yang panjang, berada bersama teman dan orang-orang memulihkan energi saya.", d: "EI", dir: "A" },
  { text: "Saya cerewet dan ekspresif — orang-orang bilang mereka selalu tahu apa yang saya pikirkan.", d: "EI", dir: "A" },
  { text: "Setelah interaksi sosial, saya butuh waktu sendiri yang tenang untuk mengisi ulang energi.", d: "EI", dir: "B" },
  { text: "Saya lebih suka percakapan mendalam dua orang daripada diskusi kelompok besar.", d: "EI", dir: "B" },
  { text: "Saya berpikir matang sebelum berbicara dan sering lebih suka mengekspresikan diri secara tertulis.", d: "EI", dir: "B" },
  { text: "Saya merasa terkuras setelah interaksi sosial yang lama, meskipun berjalan dengan baik.", d: "EI", dir: "B" },
  { text: "Saya lebih suka mematangkan ide dalam pikiran saya sendiri sebelum mendiskusikannya.", d: "EI", dir: "B" },
  { text: "Saya memiliki lingkaran teman dekat yang kecil daripada jaringan yang luas.", d: "EI", dir: "B" },
  { text: "Saya membutuhkan waktu sendiri yang cukup untuk merasa terbaik.", d: "EI", dir: "B" },
  { text: "Saya mengamati situasi dengan cermat sebelum terlibat.", d: "EI", dir: "B" },
  // S/N
  { text: "Saya lebih suka fakta konkret dan detail praktis daripada teori abstrak.", d: "SN", dir: "A" },
  { text: "Saya mempercayai apa yang dapat saya amati, alami, dan verifikasi di dunia nyata.", d: "SN", dir: "A" },
  { text: "Saya lebih suka belajar melalui pengalaman langsung daripada konsep teoritis.", d: "SN", dir: "A" },
  { text: "Saya fokus pada apa yang ada — realitas saat ini — lebih dari apa yang mungkin ada.", d: "SN", dir: "A" },
  { text: "Saya pandai memperhatikan detail praktis yang sering terlewat oleh orang lain.", d: "SN", dir: "A" },
  { text: "Saya lebih suka instruksi yang jelas dan bertahap daripada prinsip-prinsip umum.", d: "SN", dir: "A" },
  { text: "Saya cenderung membangun di atas apa yang sudah berhasil daripada menciptakan dari nol.", d: "SN", dir: "A" },
  { text: "Saya tertarik menjelajahi pola, kemungkinan, dan potensi masa depan.", d: "SN", dir: "B" },
  { text: "Saya senang memikirkan ide-ide abstrak dan skenario hipotetis.", d: "SN", dir: "B" },
  { text: "Saya sering memiliki firasat atau wawasan yang tidak bisa saya jelaskan secara logis.", d: "SN", dir: "B" },
  { text: "Saya merasa rutinitas dan pengulangan menguras energi — saya butuh hal baru dan tantangan baru.", d: "SN", dir: "B" },
  { text: "Saya lebih bersemangat dengan kemungkinan masa depan daripada realitas saat ini.", d: "SN", dir: "B" },
  { text: "Saya senang membaca makna tersirat dan melihat arti yang lebih dalam dalam hal-hal.", d: "SN", dir: "B" },
  { text: "Saya merasa berenergi dengan pemikiran gambaran besar dan diskusi visioner.", d: "SN", dir: "B" },
  { text: "Saya sering mempercayai insting saya lebih dari data keras saat membuat keputusan.", d: "SN", dir: "B" },
  // T/F
  { text: "Saat membuat keputusan, saya mengutamakan logika dan konsistensi daripada perasaan pribadi.", d: "TF", dir: "A" },
  { text: "Saya percaya bahwa lebih penting untuk jujur daripada berhati-hati.", d: "TF", dir: "A" },
  { text: "Saya nyaman menantang penalaran seseorang meskipun menciptakan konflik.", d: "TF", dir: "A" },
  { text: "Saya membuat keputusan terutama berdasarkan analisis objektif daripada perasaan.", d: "TF", dir: "A" },
  { text: "Saya menghargai kompetensi dan efektivitas di atas keharmonisan dalam lingkungan kerja.", d: "TF", dir: "A" },
  { text: "Saya tidak mudah terpengaruh oleh emosi ketika saya yakin fakta menunjukkan arah yang jelas.", d: "TF", dir: "A" },
  { text: "Saya lebih suka mengkritik ide secara langsung daripada melembutkan umpan balik saya.", d: "TF", dir: "A" },
  { text: "Saat membuat keputusan, saya sangat dipengaruhi oleh bagaimana keputusan itu akan memengaruhi orang-orang yang terlibat.", d: "TF", dir: "B" },
  { text: "Saya secara alami merasakan suasana emosional dalam sebuah ruangan dan meresponsnya.", d: "TF", dir: "B" },
  { text: "Saya merasa sulit membuat keputusan yang saya tahu akan menyakiti seseorang yang saya pedulikan.", d: "TF", dir: "B" },
  { text: "Saya lebih peduli menjaga keharmonisan daripada memenangkan argumen.", d: "TF", dir: "B" },
  { text: "Saya memberikan bobot yang besar pada nilai-nilai dan keyakinan pribadi saat mengambil keputusan.", d: "TF", dir: "B" },
  { text: "Saya sering menyampaikan umpan balik dengan cara yang terlebih dahulu mempertimbangkan perasaan orang lain.", d: "TF", dir: "B" },
  { text: "Keputusan yang benar secara logis tetapi sangat menyakiti seseorang terasa salah bagi saya.", d: "TF", dir: "B" },
  { text: "Saya menemukan makna melalui koneksi antarpribadi lebih dari melalui kejelasan intelektual.", d: "TF", dir: "B" },
  // J/P
  { text: "Saya lebih suka memiliki rencana yang jelas dan merasa tidak tenang saat sesuatu tidak pasti.", d: "JP", dir: "A" },
  { text: "Saya suka membuat keputusan dan melangkah maju daripada mempertahankan pilihan yang terbuka.", d: "JP", dir: "A" },
  { text: "Saya merasa puas ketika menyelesaikan tugas dan menandainya dari daftar saya.", d: "JP", dir: "A" },
  { text: "Saya mengatur waktu saya dengan cermat dan tidak suka terlambat atau tidak siap.", d: "JP", dir: "A" },
  { text: "Tenggat waktu memberi saya struktur; saya tidak nyaman meninggalkan sesuatu hingga menit terakhir.", d: "JP", dir: "A" },
  { text: "Saya lebih suka lingkungan yang terstruktur dan terorganisir daripada yang fleksibel dan spontan.", d: "JP", dir: "A" },
  { text: "Saya suka menyelesaikan hal-hal penting dan melanjutkan daripada membiarkannya terbuka.", d: "JP", dir: "A" },
  { text: "Saya lebih suka menjaga pilihan tetap terbuka daripada berkomitmen pada rencana tetap terlalu awal.", d: "JP", dir: "B" },
  { text: "Saya bekerja dengan baik di bawah tekanan dan sering menghasilkan pekerjaan terbaik mendekati tenggat waktu.", d: "JP", dir: "B" },
  { text: "Saya merasa rencana dan struktur yang kaku membatasi — saya lebih suka tetap fleksibel.", d: "JP", dir: "B" },
  { text: "Saya menikmati spontanitas dan nyaman beradaptasi seiring berjalannya waktu.", d: "JP", dir: "B" },
  { text: "Saya lebih suka mengumpulkan lebih banyak informasi sebelum berkomitmen pada suatu keputusan.", d: "JP", dir: "B" },
  { text: "Saya nyaman dengan ketidakpastian dan melihatnya sebagai penuh kemungkinan.", d: "JP", dir: "B" },
  { text: "Saya cenderung memulai beberapa proyek sekaligus dan menikmati variasinya.", d: "JP", dir: "B" },
  { text: "Saya menolak dikotakkan — saya suka merespons apa yang muncul daripada merencanakan segalanya lebih dulu.", d: "JP", dir: "B" },
];

const SCALE_LABELS_ID = ["Sangat tidak setuju", "Tidak setuju", "Netral", "Setuju", "Sangat setuju"];

const TYPE_DATA_ID: Record<string, {
  subtitle: string; tagline: string;
  overview: string; strengths: string[]; blindspots: string[];
  communication: string; crossCultural: string; leadership: string;
}> = {
  INTJ: {
    subtitle: "Sang Arsitek", tagline: "Strategis. Mandiri. Visioner jangka panjang.",
    overview: "INTJ adalah pemikir strategis dan mandiri yang melihat dunia sebagai sistem yang perlu dipahami dan ditingkatkan. Mereka didorong kuat untuk membangun rencana jangka panjang yang berhasil — memadukan visi dengan eksekusi yang tak kenal lelah. Mereka pendiam tetapi tangguh, dan mereka memegang standar tinggi bagi diri sendiri dan semua orang di sekitar mereka.",
    strengths: ["Pemikiran strategis jangka panjang", "Mandiri dan terarah", "Memegang standar tinggi dan menindaklanjutinya", "Mensintesis informasi kompleks menjadi kerangka yang jelas", "Tegas dan percaya diri dalam keyakinannya"],
    blindspots: ["Bisa terlihat dingin atau meremehkan perasaan orang lain", "Mungkin kesulitan menyampaikan visi mereka secara mudah dipahami", "Perfeksionisme bisa memperlambat kemajuan", "Bisa meremehkan dinamika relasional demi efisiensi"],
    communication: "Bersikaplah langsung dan substantif secara intelektual. Hindari basa-basi atau klise yang samar — mereka menghargai kejelasan dan kompetensi. Beri mereka waktu untuk berpikir. Jangan memaksakan pengungkapan emosional; bangun kepercayaan mereka melalui konsistensi dan kedalaman.",
    crossCultural: "Preferensi INTJ untuk keterusterangan dan efisiensi bisa terasa menyinggung dalam budaya yang bersifat relasional atau high-context. Kecenderungan mereka untuk bekerja secara mandiri bisa disalahartikan sebagai kesombongan atau pengecualian. Area pertumbuhan: berinvestasi dalam kepercayaan relasional sebagai aset strategis, bukan formalitas.",
    leadership: "INTJ memimpin melalui visi dan strategi. Mereka paling efektif ketika mengkomunikasikan pemikiran jangka panjang mereka secara mudah dipahami dan membangun kepercayaan relasional yang memungkinkan standar tinggi mereka menginspirasi daripada mengintimidasi.",
  },
  INTP: {
    subtitle: "Sang Logisian", tagline: "Analitis. Orisinal. Pemikir ide.",
    overview: "INTP didorong oleh kebutuhan mendalam untuk memahami cara kerja sesuatu. Mereka adalah pemikir mendalam dan orisinal yang menikmati masalah kompleks dan jarang menerima penjelasan konvensional. Mereka membawa logika ketat dan kreativitas ke semua yang mereka geluti — dan wawasan mereka sering melampaui zamannya.",
    strengths: ["Pemikiran analitis dan logis yang mendalam", "Sangat orisinal dan kreatif", "Melihat koneksi yang dilewatkan orang lain", "Objektif dan tidak memihak dalam analisis", "Rasa ingin tahu yang tak habis-habisnya dan terarah dalam belajar"],
    blindspots: ["Bisa tidak tegas — selalu menemukan sudut pandang baru", "Bisa terlihat tidak peduli atau cuek", "Kesulitan menindaklanjuti implementasi", "Komunikasi ide-ide kompleks bisa tidak mudah dipahami"],
    communication: "Beri mereka ruang untuk berpikir. Jangan memaksakan keputusan cepat. Libatkan ide-ide mereka — mereka merespons keingintahuan intelektual yang tulus. Hindari tergesa-gesa atau terlalu menyederhanakan; mereka memperhatikan dan kehilangan rasa hormat karenanya.",
    crossCultural: "Preferensi INTP untuk presisi dan perdebatan daripada harmoni bisa mengejutkan dalam budaya high-context atau berorientasi konsensus. Keterusterangan mereka tentang kelemahan ide bisa terasa sebagai kritik pribadi. Area pertumbuhan: membungkus analisis mereka dalam kehangatan relasional.",
    leadership: "INTP memimpin paling baik dalam peran konsultatif, analitis, atau berorientasi inovasi. Mereka butuh struktur pendukung untuk eksekusi dan mitra terpercaya yang menerjemahkan visi mereka menjadi tindakan. Hadiah kepemimpinan terbesar mereka adalah kualitas pemikiran mereka.",
  },
  ENTJ: {
    subtitle: "Sang Komandan", tagline: "Tegas. Berani. Pemimpin alami.",
    overview: "ENTJ adalah eksekutif alami — tegas, berani, dan terdorong untuk memimpin. Mereka melihat ketidakefisienan dan langsung ingin memperbaikinya. Mereka adalah pemikir strategis jangka panjang yang memadukan visi dengan energi tak kenal lelah untuk mengeksekusi. Mereka sering menjadi pemimpin paling kuat di ruangan — dan mereka berkembang ketika tantangan sesuai dengan ambisi mereka.",
    strengths: ["Tegas dan sangat berorientasi tindakan", "Perencanaan strategis jangka panjang yang luar biasa", "Memimpin dengan keyakinan dan kepercayaan diri", "Membangun sistem dan struktur yang menghasilkan hasil", "Menginspirasi tim melalui kepemimpinan yang terlihat dan ambisius"],
    blindspots: ["Bisa mendominasi dan tidak sabar dengan pemikir yang lebih lambat", "Bisa meremehkan dinamika emosional", "Mendorong terlalu keras — membuat tim kelelahan", "Kesulitan menerima umpan balik atau salah"],
    communication: "Cocokkan keterusterangan mereka. Bersiaplah, percaya diri, dan kompeten. Datanglah dengan solusi, bukan hanya masalah. Jangan pasif — mereka kehilangan rasa hormat untuk orang yang tidak bisa berdiri sendiri. Sampaikan ketidaksetujuan dengan jelas dan bersiaplah untuk berdebat.",
    crossCultural: "Keterusterangan dan ketegasan ENTJ bisa mengganggu secara budaya dalam budaya high-context yang mengutamakan menjaga wajah. Kecepatan mereka bisa meninggalkan orang lain. Area pertumbuhan: memperlambat untuk mendengar apa yang tidak dikatakan, dan memimpin melalui pengaruh sebanyak melalui otoritas.",
    leadership: "ENTJ memimpin melalui kejelasan visi, tindakan tegas, dan standar tinggi. Area pertumbuhan mereka adalah disiplin memimpin orang, bukan hanya mendorong hasil — membangun kepercayaan, bukan hanya kepatuhan.",
  },
  ENTP: {
    subtitle: "Sang Pendebat", tagline: "Inovatif. Energetik. Penuh ide.",
    overview: "ENTP adalah mesin ide. Mereka menyukai perdebatan, inovasi, dan menantang status quo. Mereka berenergi dengan kompleksitas dan terdorong untuk menemukan solusi kreatif atas masalah sulit. Mereka karismatik, cepat, dan sering menjadi orang yang paling merangsang di ruangan — meskipun tindak lanjut adalah area pertumbuhan yang konsisten.",
    strengths: ["Sangat kreatif dan produktif dalam menghasilkan ide", "Nyaman menantang asumsi dan status quo", "Pemikir cepat — menghubungkan ide-ide yang berbeda dengan mudah", "Karismatik dan menginspirasi dalam suasana kelompok", "Adaptif dan tangguh dalam lingkungan yang berubah"],
    blindspots: ["Lebih tertarik memulai daripada menyelesaikan", "Bisa berdebat demi perdebatan, bukan penyelesaian", "Bisa mengabaikan perasaan orang yang terdampak keterusterangannya", "Kesulitan dengan rutinitas, administrasi, dan tindak lanjut"],
    communication: "Libatkan ide-ide mereka — mereka suka perdebatan yang bagus. Bersikaplah langsung dan berenergi. Bawa mereka masalah yang menantang, bukan tugas rutin. Mereka menghargai kejujuran intelektual; jangan pura-pura setuju jika Anda tidak.",
    crossCultural: "Kecintaan ENTP pada perdebatan dan tantangan bisa sangat tidak nyaman dalam budaya berorientasi konsensus atau high-power-distance di mana menantang ide = menantang orang. Area pertumbuhan: menyalurkan energi mereka ke eksplorasi kolaboratif daripada pengujian adversarial.",
    leadership: "ENTP memimpin melalui energi, ide, dan kekuatan visi mereka. Mereka butuh struktur dan orang-orang di sekitar mereka yang mengubah ide menjadi eksekusi. Hadiah kepemimpinan mereka adalah membuat orang percaya bahwa sesuatu bisa berbeda.",
  },
  INFJ: {
    subtitle: "Sang Pembela", tagline: "Berprinsip. Visioner. Penuh kepedulian mendalam.",
    overview: "INFJ memadukan keyakinan yang dalam, empati, dan visi jangka panjang. Mereka adalah pemimpin langka yang memegang kejelasan prinsip dan kasih sayang yang tulus. Mereka sering digambarkan sebagai visioner yang pendiam — memimpin melalui kedalaman wawasan dan keotentikan kepedulian mereka. Mereka adalah tipe yang paling didorong secara privat dari semua tipe.",
    strengths: ["Empati dan wawasan mendalam tentang orang", "Berprinsip dan jelas dalam nilai-nilainya", "Pemikiran visioner jangka panjang", "Menahan kompleksitas — perspektif yang bernuansa", "Sangat berkomitmen ketika mereka meyakini sesuatu"],
    blindspots: ["Bisa sangat privat hingga terisolasi", "Sangat sensitif terhadap konflik dan kritik", "Mungkin memegang standar yang tidak realistis tinggi untuk orang lain", "Kelelahan akibat menyerap beban emosional orang lain"],
    communication: "Bersikaplah tulus dan berorientasi nilai. Akui wawasan dan kepedulian mereka. Jangan dangkal atau transaksional — mereka langsung melihatnya. Beri mereka waktu dan ruang; mereka memproses secara mendalam dan berbagi ketika mereka percaya.",
    crossCultural: "Kepedulian dan kedalaman INFJ beresonansi di semua budaya, tetapi idealisme mereka bisa berbenturan dengan budaya pragmatis atau hierarkis di mana hubungan bersifat transaksional. Area pertumbuhan: memegang keyakinan mereka tanpa menjadi kaku atau menarik diri ketika realitas tidak memenuhi visi mereka.",
    leadership: "INFJ memimpin melalui kekuatan visi dan kedalaman kepedulian mereka. Mereka menginspirasi kesetiaan yang luar biasa. Area pertumbuhan mereka adalah belajar mengekspresikan visi mereka dengan cukup jelas dan percaya diri sehingga orang lain dapat mengikuti tanpa perlu menafsirkan.",
  },
  INFP: {
    subtitle: "Sang Mediator", tagline: "Idealis. Empatik. Terarah dari dalam secara otentik.",
    overview: "INFP adalah idealis yang pendiam yang memimpin dari nilai-nilai pribadi yang dipegang teguh. Mereka kreatif, empatik, dan sangat peduli tentang orang-orang dan tujuan yang berarti bagi mereka. Mereka tidak tertarik pada sistem atau efisiensi untuk kepentingannya sendiri — mereka didorong oleh makna, keaslian, dan kebebasan untuk berkembang.",
    strengths: ["Empati mendalam dan kepekaan emosional", "Nilai-nilai pribadi yang kuat dan rasa integritas", "Kreatif dan orisinal dalam berpikir", "Membangun koneksi yang otentik dan bermakna", "Bersemangat tentang tujuan yang sesuai dengan nilai-nilainya"],
    blindspots: ["Bisa kesulitan dengan konflik dan ketegasan", "Mungkin terlalu idealis — menolak kompromi", "Rentan mengambil kritik secara pribadi", "Bisa lumpuh dalam pengambilan keputusan ketika nilai-nilai bertentangan"],
    communication: "Ciptakan ruang untuk kedalaman dan keaslian. Akui perasaan sebelum fakta. Jangan meremehkan nilai-nilai mereka — itu adalah inti dari siapa mereka. Beri mereka waktu; mereka bijaksana dan hati-hati dalam komunikasi mereka.",
    crossCultural: "Individualisme INFP dan fokus pada keaslian pribadi bisa berlawanan budaya dalam konteks kolektivis. Area pertumbuhan: belajar menemukan makna dalam struktur komunal, bukan hanya terlepas darinya.",
    leadership: "INFP memimpin paling baik ketika peran mereka sangat selaras dengan nilai-nilai mereka. Mereka menginspirasi melalui keaslian dan kepedulian. Area pertumbuhan mereka adalah membangun ketegasan dan struktur yang memungkinkan visi mereka menjadi kenyataan praktis.",
  },
  ENFJ: {
    subtitle: "Sang Protagonis", tagline: "Karismatik. Menginspirasi. Pengembang orang alami.",
    overview: "ENFJ adalah pemimpin lahir yang menyatukan orang dan memanggil yang terbaik dari semua orang di sekitar mereka. Mereka hangat, visioner, dan sangat berinvestasi dalam pertumbuhan orang-orang yang mereka pimpin. Mereka memiliki kemampuan langka untuk memegang visi jangka panjang dan dinamika manusiawi tim secara bersamaan.",
    strengths: ["Secara alami menginspirasi dan memotivasi", "Investasi mendalam dalam pertumbuhan dan pengembangan orang lain", "Komunikator yang sangat baik — jelas, hangat, dan visioner", "Membawa harmoni dan arah secara bersamaan", "Melihat potensi dalam diri orang yang dilewatkan orang lain"],
    blindspots: ["Terlalu banyak memberi demi kebutuhan orang lain", "Bisa terlalu fokus pada konsensus — kesulitan dengan konflik yang diperlukan", "Mengambil kritik atau penolakan secara pribadi", "Bisa mengabaikan kebutuhan dan batasan diri sendiri"],
    communication: "Bersikaplah hangat, personal, dan berorientasi tujuan. Akui investasi mereka dalam orang. Libatkan visi mereka dengan tulus. Jangan bersikap dingin atau transaksional — itu langsung melepaskan keterlibatan mereka.",
    crossCultural: "Kehangatan dan fokus relasional ENFJ adalah karunia dalam hampir setiap konteks budaya. Dalam budaya yang lebih individualistis, penekanan mereka pada komunitas dan harmoni bisa diremehkan. Area pertumbuhan: memegang keyakinan mereka ketika biaya relasional tinggi.",
    leadership: "ENFJ adalah di antara pemimpin orang paling efektif dalam kerangka apapun. Area pertumbuhan mereka adalah belajar memimpin dengan kejelasan dan struktur serta kehangatan — dan menjaga batasan diri sendiri ketika mereka memberi begitu murah hati kepada orang lain.",
  },
  ENFP: {
    subtitle: "Sang Pejuang", tagline: "Antusias. Kreatif. Sangat manusiawi.",
    overview: "ENFP adalah karismatik, kreatif, dan sangat berenergi oleh kemungkinan. Mereka membawa antusiasme yang menular ke semua yang mereka lakukan dan memiliki karunia langka untuk melihat potensi dalam orang dan ide. Mereka terbaik ketika pekerjaan mereka bermakna, hubungan mereka mendalam, dan dunia mereka penuh kemungkinan.",
    strengths: ["Benar-benar kreatif dan visioner", "Sangat antusias — menginspirasi semua orang di sekitar mereka", "Sangat empatik dan berorientasi orang", "Adaptif dan berkembang dalam lingkungan yang ambigu", "Menginspirasi orang lain menuju kemungkinan yang belum mereka lihat"],
    blindspots: ["Bisa memulai lebih banyak dari yang mereka selesaikan", "Mungkin terlalu mempersonalisasi umpan balik atau konflik", "Tidak fokus saat tidak mengerjakan sesuatu yang bermakna", "Bisa menghindari struktur dan disiplin yang diperlukan"],
    communication: "Cocokkan energi mereka dan libatkan ide-ide mereka. Bersikaplah tulus — mereka dengan cepat membaca ketidakotentikan. Beri mereka kebebasan kreatif dalam parameter yang jelas. Akui orang sebelum tugas.",
    crossCultural: "Antusiasme dan individualisme ENFP menginspirasi dalam banyak konteks tetapi mungkin membebani atau membingungkan budaya yang lebih tertahan atau terstruktur. Area pertumbuhan: menyalurkan energi ke tindak lanjut yang berkelanjutan dan membangun disiplin yang sesuai dengan visi mereka.",
    leadership: "ENFP memimpin melalui inspirasi, kreativitas, dan kekuatan hubungan mereka. Area pertumbuhan mereka adalah eksekusi — membangun kebiasaan dan struktur yang menerjemahkan energi luar biasa mereka menjadi hasil yang berkelanjutan.",
  },
  ISTJ: {
    subtitle: "Sang Logistiker", tagline: "Dapat diandalkan. Teliti. Pilar integritas.",
    overview: "ISTJ adalah di antara pemimpin yang paling dapat diandalkan dalam kerangka apapun. Mereka memimpin melalui konsistensi, persiapan yang teliti, dan komitmen yang tak tergoyahkan untuk melakukan hal yang benar. Mereka dipercaya justru karena mereka dapat dipercaya — mereka mengatakan apa yang akan mereka lakukan dan melakukan apa yang mereka katakan.",
    strengths: ["Sangat dapat diandalkan dan konsisten", "Teliti dan sangat terorganisir", "Rasa kewajiban dan tanggung jawab yang kuat", "Tenang dan stabil — tidak panik di bawah tekanan", "Menghormati dan menjunjung sistem dan nilai yang sudah ada"],
    blindspots: ["Bisa menolak perubahan atau metode baru", "Mungkin terlihat tidak fleksibel atau terlalu kaku", "Kesulitan dengan ambiguitas dan improvisasi", "Bisa meremehkan dimensi emosional kepemimpinan"],
    communication: "Bersikaplah tepat, siap, dan hormat. Hindari ketidakjelasan atau ketidakpastian. Berikan informasi konkret dan harapan yang jelas. Jangan mengejutkan mereka — mereka membangun kepercayaan melalui keandalan dan mengharapkan hal yang sama dari orang lain.",
    crossCultural: "Penghormatan ISTJ terhadap struktur dan hierarki cocok dengan budaya high-power-distance. Dalam budaya yang lebih adaptif atau informal, mereka mungkin dianggap tidak fleksibel. Area pertumbuhan: menjaga keandalan mereka sambil membangun fleksibilitas dan kenyamanan dengan ambiguitas.",
    leadership: "ISTJ memimpin melalui keterpercayaan, persiapan, dan eksekusi yang stabil. Mereka membangun tim yang tahu persis apa yang diharapkan dan dapat mengandalkan pemimpin untuk menindaklanjuti. Area pertumbuhan: belajar memimpin melalui pengaruh dan inspirasi, tidak hanya struktur.",
  },
  ISFJ: {
    subtitle: "Sang Pelindung", tagline: "Peduli. Konsisten. Sangat setia.",
    overview: "ISFJ adalah tulang punggung yang diam dari tim mana pun yang mereka layani. Mereka hangat, teliti, dan sangat setia — mengutamakan kebutuhan orang lain dan kesehatan komunitas daripada pengakuan pribadi. Karunia mereka adalah jenis pelayanan yang konsisten dan penuh perhatian yang menopang organisasi selama beberapa dekade.",
    strengths: ["Sangat peduli dan penuh perhatian terhadap kebutuhan orang lain", "Sangat dapat diandalkan dan konsisten", "Perhatian teliti terhadap detail", "Membangun komunitas dan rasa memiliki yang tulus", "Setia — muncul ketika dibutuhkan"],
    blindspots: ["Bisa menekan kebutuhan sendiri untuk menghindari konflik", "Tidak nyaman dengan perubahan — lebih suka apa yang sudah berhasil", "Mungkin kesulitan mendelegasikan atau menetapkan batasan yang tegas", "Bisa merasa tidak dihargai ketika pelayanan tidak diperhatikan"],
    communication: "Bersikaplah hangat, personal, dan penuh apresiasi. Akui kontribusi mereka secara khusus. Jangan mengabaikan mereka — mereka sering tidak akan mengadvokasi diri sendiri. Ciptakan ruang yang aman bagi mereka untuk berbagi perspektif mereka sendiri.",
    crossCultural: "Orientasi pelayanan ISFJ dan fokus komunitas diterjemahkan dengan baik di semua budaya kolektivis. Dalam lingkungan yang lebih asertif, pemberian yang diam-diam bisa diremehkan. Area pertumbuhan: mengklaim suara mereka dan mengadvokasi perspektif mereka sendiri sejelas mereka melayani orang lain.",
    leadership: "ISFJ memimpin melalui kepedulian, keandalan, dan kualitas pelayanan mereka. Mereka membangun kesetiaan yang mendalam dan merupakan perekat tak terlihat dari banyak tim yang sehat. Area pertumbuhan: belajar memimpin dengan otoritas yang tepat — bukan hanya melalui pelayanan.",
  },
  ESTJ: {
    subtitle: "Sang Eksekutif", tagline: "Terorganisir. Langsung. Pembangun sistem yang andal.",
    overview: "ESTJ adalah administrator dan pengorganisir alami. Mereka membawa harapan yang jelas, kepemimpinan yang tegas, dan eksekusi sistematis ke semua yang mereka jalankan. Mereka langsung, dapat diandalkan, dan terdorong untuk membangun struktur yang berhasil — dan mereka mengharapkan orang-orang di sekitar mereka memenuhi standar yang sama.",
    strengths: ["Luar biasa dalam mengorganisir orang dan sumber daya", "Komunikasi yang jelas, langsung, dan harapan yang jelas", "Sangat dapat diandalkan — menepati apa yang mereka komitmenkan", "Menciptakan ketertiban dan kejelasan dalam situasi kompleks", "Etos kerja yang kuat dan komitmen terhadap hasil"],
    blindspots: ["Bisa tidak fleksibel dan menolak pendekatan alternatif", "Mungkin terlihat dominan atau mengendalikan", "Meremehkan dinamika emosional dan kebutuhan relasional", "Bisa kesulitan dengan inovasi atau perubahan pada sistem yang sudah ada"],
    communication: "Bersikaplah langsung, faktual, dan bisnis. Datanglah dengan informasi yang jelas. Hindari ketidakjelasan. Sampaikan ketidaksetujuan dengan hormat tetapi langsung — mereka merespons pada kejelasan, bukan isyarat.",
    crossCultural: "Keterusterangan ESTJ dan kejelasan hierarkis cocok dengan banyak budaya yang terstruktur. Dalam konteks yang lebih cair dan relasional, kebutuhan mereka akan ketertiban bisa terasa mengendalikan. Area pertumbuhan: membangun fleksibilitas ke dalam sistem mereka dan menciptakan ruang nyata untuk masukan orang lain.",
    leadership: "ESTJ memimpin melalui struktur yang jelas, tindakan tegas, dan tindak lanjut yang konsisten. Mereka adalah pemimpin eksekusi yang sangat baik. Area pertumbuhan: memimpin dengan pengaruh serta otoritas — dan menciptakan tim di mana orang benar-benar dikembangkan, bukan sekadar dikelola.",
  },
  ESFJ: {
    subtitle: "Sang Konsul", tagline: "Hangat. Terorganisir. Sangat berorientasi komunitas.",
    overview: "ESFJ adalah hangat, terorganisir, dan sangat berinvestasi dalam kesejahteraan komunitas yang mereka layani. Mereka memadukan kepedulian tulus terhadap orang dengan organisasi praktis — mereka menjaga tim berfungsi, memastikan semua orang merasa dihargai, dan menjaga tatanan sosial bersama. Mereka sering menjadi orang yang paling dipercaya di ruangan.",
    strengths: ["Hangat dan benar-benar peduli terhadap orang lain", "Sangat terorganisir dan dapat diandalkan", "Sangat baik dalam membangun komunitas dan rasa memiliki", "Responsif terhadap kebutuhan praktis orang lain", "Tuan rumah alami — menciptakan lingkungan yang aman dan ramah"],
    blindspots: ["Bisa mengutamakan harmoni daripada kebenaran yang diperlukan", "Rentan terhadap mencari persetujuan dan menyenangkan orang", "Mungkin kesulitan membuat keputusan yang mengecewakan", "Bisa menghindari konfrontasi hingga tingkat yang tidak sehat"],
    communication: "Bersikaplah hangat, personal, dan penuh apresiasi. Akui hubungan sebelum tugas. Sampaikan rasa syukur yang tulus — itu menginspirasi mereka. Hindari ketidaksopanan atau efisiensi yang dingin.",
    crossCultural: "Kehangatan dan fokus komunitas ESFJ diterjemahkan dengan baik di semua budaya kolektivis. Dalam konteks yang lebih individualistis, investasi relasional mereka bisa disalahartikan sebagai mengganggu. Area pertumbuhan: belajar memegang keyakinan mereka dengan jelas ketika tekanan relasional adalah untuk berkompromi.",
    leadership: "ESFJ memimpin melalui kehangatan, keandalan, dan pembangunan komunitas. Mereka menciptakan tim di mana orang benar-benar merasa memiliki. Area pertumbuhan: mengembangkan kapasitas untuk konflik yang produktif — jenis kejujuran yang melayani orang, bahkan ketika itu tidak nyaman.",
  },
  ISTP: {
    subtitle: "Sang Virtuoso", tagline: "Praktis. Observatif. Tenang di bawah tekanan.",
    overview: "ISTP adalah pemecah masalah praktis yang unggul dalam lingkungan yang hands-on, teknis, dan berisiko tinggi. Mereka tenang, observatif, dan diam-diam kompeten — orang yang Anda inginkan ketika sesuatu salah dan pemikiran yang jernih dibutuhkan. Mereka bekerja terbaik dengan otonomi maksimal dan struktur yang tidak diperlukan minimal.",
    strengths: ["Pemecahan masalah praktis yang luar biasa", "Tenang dan jernih di bawah tekanan", "Sangat observatif — memperhatikan apa yang orang lain lewatkan", "Efisien — langsung ke apa yang perlu dilakukan", "Adaptif dan penuh sumber daya dalam situasi yang tidak terduga"],
    blindspots: ["Bisa terlihat secara emosional jauh atau acuh tak acuh", "Kesulitan dengan perencanaan jangka panjang dan komitmen", "Mungkin menolak struktur atau pengawasan", "Jarang mengomunikasikan apa yang mereka pikirkan atau rasakan"],
    communication: "Bersikaplah langsung dan praktis. Lewati kata pengantar dan langsung ke intinya. Beri mereka ruang dan otonomi — pengawasan membuat mereka frustrasi. Jangan memaksakan berbagi emosional; mereka terlibat melalui tindakan, bukan kata-kata.",
    crossCultural: "Kompetensi praktis ISTP dihargai dalam hampir setiap konteks. Cadangan emosional mereka bisa disalahartikan sebagai kedinginan atau ketidakterlibatan dalam budaya relasional. Area pertumbuhan: belajar mengekspresikan investasi dalam orang melalui kata-kata serta tindakan.",
    leadership: "ISTP paling efektif memimpin dalam peran teknis, krisis, atau berorientasi eksekusi. Mereka memimpin melalui contoh — diam-diam melakukan apa yang perlu dilakukan. Area pertumbuhan: mengkomunikasikan visi dan mengembangkan orang, bukan hanya memecahkan masalah.",
  },
  ISFP: {
    subtitle: "Sang Petualang", tagline: "Lembut. Kreatif. Hadir di saat ini.",
    overview: "ISFP adalah individu yang lembut, kreatif, dan sangat setia yang memimpin dengan keaslian yang tenang. Mereka sangat selaras dengan dunia di sekitar mereka dan membawa keindahan, kepedulian, dan kehadiran yang tulus ke semua yang mereka lakukan. Mereka tidak tertarik pada kekuasaan atau pengakuan — mereka memimpin karena mereka peduli.",
    strengths: ["Sangat peduli dan penuh perhatian", "Kreatif dan peka secara estetis", "Otentik — tanpa pertunjukan atau kepura-puraan", "Setia dan hadir bersama orang-orang yang mereka pedulikan", "Fleksibel dan terbuka terhadap perspektif orang lain"],
    blindspots: ["Bisa menghindari konflik hingga tingkat yang tidak sehat", "Mungkin kesulitan menegaskan kebutuhan dan perspektif sendiri", "Rentan terhadap kritik — mengambilnya sangat secara pribadi", "Bisa sangat privat hingga tidak dapat diakses"],
    communication: "Bersikaplah lembut, personal, dan benar-benar peduli. Ciptakan ruang bagi mereka untuk berbagi dengan kecepatan mereka sendiri. Jangan menekan atau mengepung mereka. Akui kontribusi mereka, terutama yang diam-diam.",
    crossCultural: "Kelembutan dan kemampuan adaptasi ISFP melayani mereka dengan baik di sebagian besar budaya. Dalam lingkungan yang sangat kompetitif atau asertif, pendekatan yang tenang dapat membuat mereka terlewatkan. Area pertumbuhan: menemukan keberanian untuk terlihat dan didengar, bukan hanya dirasakan.",
    leadership: "ISFP memimpin melalui keaslian dan kepedulian yang tulus. Mereka menciptakan lingkungan keamanan dan kepercayaan. Area pertumbuhan: belajar menyampaikan visi mereka dengan percaya diri dan memegang otoritas yang tepat tanpa merasa itu mengkompromikan nilai-nilai mereka.",
  },
  ESTP: {
    subtitle: "Sang Wirausahawan", tagline: "Energetik. Observatif. Mengutamakan tindakan.",
    overview: "ESTP adalah berorientasi tindakan, perseptif, dan berenergi oleh dunia nyata. Mereka membaca situasi dengan cepat, bergerak cepat, dan memiliki kemampuan luar biasa untuk membuat sesuatu terjadi pada saat ini. Mereka sering menjadi pemimpin yang paling terampil secara taktis di ruangan — dan mereka berkembang dalam lingkungan yang menghargai kecepatan dan kemampuan adaptasi.",
    strengths: ["Pengambilan keputusan yang cepat dan berorientasi tindakan", "Sangat perseptif dalam situasi nyata", "Energetik dan karismatik", "Negosiator dan komunikator yang sangat baik", "Tangguh dan adaptif di bawah tekanan"],
    blindspots: ["Bisa mengabaikan perencanaan jangka panjang demi tindakan jangka pendek", "Mungkin kesulitan dengan kesabaran strategis", "Bisa terlihat mencari risiko hingga tingkat yang ceroboh", "Mungkin meremehkan dinamika emosional dan relasional"],
    communication: "Bersikaplah langsung, energetik, dan konkret. Lewati teori dan tunjukkan dalam praktik. Jaga percakapan tetap dinamis dan berorientasi tindakan. Mereka terlibat dengan cepat dan bergerak maju cepat — langsung ke intinya.",
    crossCultural: "Keberanian dan keterusterangan ESTP dihargai dalam budaya yang berorientasi tindakan tetapi bisa terasa ceroboh atau tidak hormat dalam lingkungan yang lebih deliberatif atau berorientasi konsensus. Area pertumbuhan: membangun kesabaran untuk proses dan kepekaan terhadap menjaga wajah.",
    leadership: "ESTP memimpin paling baik dalam konteks dunia nyata yang dinamis dan berisiko tinggi. Mereka adalah master taktis. Area pertumbuhan: mengembangkan kesabaran strategis dan kedalaman relasional yang menopang tim dalam jangka panjang.",
  },
  ESFP: {
    subtitle: "Sang Penghibur", tagline: "Spontan. Energetik. Tulus penuh sukacita.",
    overview: "ESFP adalah hangat, spontan, dan penuh antusiasme yang tulus untuk kehidupan dan orang-orang. Mereka membawa sukacita, energi, dan positivitas yang menular ke setiap lingkungan yang mereka masuki. Mereka dermawan, menyukai kesenangan, dan benar-benar berinvestasi dalam orang-orang di sekitar mereka — mereka membuat orang merasa terlihat dan dihargai dalam sekejap.",
    strengths: ["Hangat, dermawan, dan benar-benar peduli", "Membawa energi dan sukacita ke budaya tim", "Spontan dan sangat adaptif", "Sangat baik dalam membaca dan merespons orang", "Membuat orang merasa benar-benar disambut dan dihargai"],
    blindspots: ["Bisa menghindari perencanaan jangka panjang dan keputusan sulit", "Mungkin mengutamakan kesenangan daripada tindak lanjut", "Rentan terhadap gangguan dan bisa kehilangan fokus", "Kesulitan dengan kritik dan konflik"],
    communication: "Bersikaplah hangat, positif, dan personal. Libatkan energi mereka dengan tulus. Jangan bersikap dingin, berat, atau terlalu serius — mereka melepaskan keterlibatan. Tunjukkan apresiasi secara sering dan spesifik.",
    crossCultural: "Kehangatan dan ekspresi ESFP adalah karunia dalam budaya relasional. Dalam lingkungan yang lebih tertahan atau terstruktur, spontanitas mereka bisa terlihat tidak profesional. Area pertumbuhan: menyalurkan karunia sosial mereka ke dalam tindak lanjut yang disiplin yang mengubah hubungan menjadi hasil.",
    leadership: "ESFP memimpin melalui sukacita, energi, dan kekuatan koneksi yang tulus. Mereka menciptakan budaya di mana orang ingin hadir. Area pertumbuhan: mengembangkan disiplin strategis dan kapasitas untuk memimpin melalui kesulitan serta perayaan.",
  },
};

const SHORT_PROFILES_ID: Record<string, string> = {
  INTJ: "Pemikir strategis yang mandiri dan berpandangan jauh. Sering menjadi visioner yang diam yang melihat lima langkah ke depan. Butuh ruang untuk berpikir dan tidak suka terburu-buru. Bisa terlihat dingin atau jauh. Dalam tim pelayanan mereka adalah ahli strategi yang sangat baik, tetapi harus diundang — bukan diasumsikan — dalam percakapan pastoral.",
  INTP: "Ingin tahu, teoretis, dan presisi. Ingin memahami bagaimana sistem bekerja sebelum bertindak di dalamnya. Kuat dalam analisis, lebih lambat untuk berkomitmen. Bisa terlalu menganalisis dan kurang mengeksekusi jika tidak dipasangkan dengan rekan yang berorientasi tindakan.",
  ENTJ: "Tegas, terorganisir, dan berorientasi hasil. Secara alami mengarahkan orang dan sumber daya menuju tujuan. Sering cepat naik ke kepemimpinan formal. Perlu memperlambat dan mendengarkan sebelum memutuskan untuk semua orang, terutama dalam budaya di mana keterusterangan terasa keras.",
  ENTP: "Energetik, kaya ide, dan cepat menantang asumsi. Suka brainstorming dan memikirkan ulang cara hal-hal dilakukan. Bisa melelahkan rekan tim yang membutuhkan stabilitas. Terbaik ketika dipasangkan dengan seseorang yang mengubah ide-ide mereka menjadi rencana.",
  INFJ: "Pendiam, berprinsip, dan sangat peduli dengan makna dan tujuan. Sering menjadi hati nurani tim. Membaca orang dengan baik dan merasakan hal-hal secara mendalam. Perlu menjaga diri dari kelelahan akibat menanggung beban orang lain secara diam-diam.",
  INFP: "Lembut, didorong oleh nilai, dan kreatif. Memiliki rasa batin yang kuat tentang apa yang benar dan benar. Butuh dorongan untuk berbagi dunia batin mereka dengan tim — mereka jarang akan menawarkannya. Ketika diberi ruang, mereka membawa kedalaman yang tidak bisa orang lain bawa.",
  ENFJ: "Hangat, persuasif, dan berorientasi orang. Terampil mengeluarkan yang terbaik dari orang lain dan mengumpulkan kelompok di sekitar visi. Perlu diingat bahwa tidak setiap rekan tim ingin dikembangkan setiap saat — terkadang orang hanya ingin melakukan pekerjaan mereka.",
  ENFP: "Antusias, imajinatif, dan relasional. Cepat menginspirasi dan lambat untuk berkecil hati. Membawa warna dan kehidupan ke tim. Butuh bantuan menyelesaikan apa yang mereka mulai; cocok dipadukan dengan seorang Penilai yang bisa membawa proyek melewati garis akhir.",
  ISTJ: "Dapat diandalkan, teliti, dan setia pada sistem dan standar. Tulang punggung banyak tim pelayanan — keuangan, logistik, tindak lanjut. Bisa menolak perubahan bahkan ketika diperlukan; mendapat manfaat dari diberi tahu mengapa, bukan hanya apa.",
  ISFJ: "Pelayan yang pendiam yang memperhatikan apa yang orang lain lewatkan dan merawat orang di balik layar. Sering menjadi pengasuh yang tidak terlihat dari tim. Perlu diundang ke sorotan, bukan diasumsikan puas berada di bayang-bayang. Kesetiaan mereka mudah dianggap sebagai hal biasa.",
  ESTJ: "Terorganisir, langsung, dan dapat dipertanggungjawabkan. Membuat rencana terjadi dan memegang orang pada komitmen. Pemimpin operasional yang kuat. Perlu melembutkan cara penyampaian dalam budaya yang menghargai ketidaklangsungan, di mana ketegasan dapat merusak hubungan sebelum membangunnya.",
  ESFJ: "Hangat, ramah, dan berdedikasi pada kesejahteraan kelompok. Sering menjadi tuan rumah tim — orang yang mengingat ulang tahun, mengorganisir makanan, dan memperhatikan siapa yang hilang. Bisa mengambil kritik secara pribadi; butuh jaminan lebih dari teguran.",
  ISTP: "Praktis, hands-on, dan tenang di bawah tekanan. Memperbaiki hal-hal yang rusak, baik fisik maupun operasional. Memimpin melalui kompetensi daripada kata-kata. Perlu ditarik ke dalam lapisan relasional kehidupan tim — mereka tidak akan mendorong diri masuk.",
  ISFP: "Pendiam, baik hati, dan sensitif secara estetis. Memimpin melalui contoh lebih dari melalui ucapan. Memegang nilai-nilai pribadi yang kuat tetapi jarang memaksakan. Perlu ditanya, karena mereka tidak selalu akan menawarkan pikiran mereka.",
  ESTP: "Berorientasi tindakan, berani, dan menginspirasi. Berkembang dalam krisis dan bosan dalam rutinitas. Sering sangat baik dalam pengaturan perintis atau situasi respons cepat. Perlu belajar merencanakan melampaui dua puluh empat jam ke depan, terutama ketika orang lain bergantung pada mereka.",
  ESFP: "Hangat, spontan, dan berfokus pada saat ini. Membawa kehidupan dan sukacita ke tim dan mengangkat ruangan ketika berat. Butuh bantuan berpikir jangka panjang dan menindaklanjuti komitmen yang diam-diam yang tidak ada yang mengamati.",
};

const TYPE_GROUPS_ID = [
  { label: "Tipe Analis", desc: "Pemikir Intuitif" },
  { label: "Tipe Diplomat", desc: "Perasa Intuitif" },
  { label: "Tipe Sentinel", desc: "Penilai Pengindera" },
  { label: "Tipe Penjelajah", desc: "Pengamat Pengindera" },
];

const DICHOTOMY_LABELS_ID = [
  { label: "Energi", descA: "Ekstraversi", descB: "Introversi" },
  { label: "Informasi", descA: "Penginderaan", descB: "Intuisi" },
  { label: "Keputusan", descA: "Berpikir", descB: "Merasakan" },
  { label: "Struktur", descA: "Menilai", descB: "Mengamati" },
];

const MINISTRY_BENEFITS_ID = [
  {
    title: "Menurunkan suhu konflik",
    body: "Ketika kebiasaan rekan tim yang membuat frustrasi dapat dinamai sebagai preferensi tipe daripada kelemahan karakter, menjadi jauh lebih mudah untuk ditangani tanpa penilaian. Percakapan bergerak dari \"kamu salah\" ke \"kita memiliki kabel yang berbeda — bagaimana kita bekerja dengan itu?\"",
    color: "oklch(65% 0.15 45)",
  },
  {
    title: "Mempertajam kesesuaian peran",
    body: "Setiap tim pelayanan memiliki pekerjaan garis depan yang terlihat dan pekerjaan garis belakang yang lebih diam. Mengetahui tipe masing-masing orang memudahkan untuk mencocokkan orang yang tepat dengan peran yang tepat. Tim yang mengenal dirinya sendiri berhenti meminta peneliti yang pendiam untuk menjadi tuan rumah acara sambutan.",
    color: "oklch(48% 0.20 255)",
  },
  {
    title: "Memperkuat kepekaan lintas budaya",
    body: "Tim lintas budaya sudah menavigasi banyak lapisan perbedaan. Menambahkan lapisan kepribadian mengingatkan tim bahwa tidak semua perbedaan bersifat budaya. Sebagian dari gesekan yang Anda rasakan dengan rekan tim dari negara lain mungkin adalah gesekan yang sama yang akan Anda rasakan dengan seseorang dari negara Anda sendiri yang memiliki tipe yang sama.",
    color: "oklch(48% 0.20 295)",
  },
  {
    title: "Membantu pemimpin mengelola diri mereka sendiri",
    body: "Pelayanan lintas budaya jangka panjang meminta orang untuk terus memberi. Mengetahui tipe Anda sendiri menunjukkan konteks mana yang menguras Anda paling cepat, keputusan mana yang mungkin paling sulit, dan di mana titik buta Anda paling sering berada. Ini adalah pengelolaan yang baik dari pribadi yang telah Allah panggil dan bentuk.",
    color: "oklch(45% 0.16 200)",
  },
];

const DIMENSIONS_ID = [
  {
    a: "E — Ekstraversi", b: "I — Introversi",
    question: "Ke mana Anda mengarahkan energi Anda?",
    body: "Ekstravert mendapat energi dari berada di sekitar orang, mendiskusikan ide dengan lantang, dan terlibat dengan dunia luar. Introvert mendapat energi dari ketenangan, refleksi batin, dan kedalaman daripada keluasan dalam hubungan mereka. Keduanya bisa memimpin dengan baik. Alkitab menampung keduanya — Petrus, yang berbicara pertama dan berpikir kemudian, dan Maria, yang menyimpan segala sesuatu dan merenungkannya dalam hatinya.",
    color: "oklch(62% 0.18 52)",
  },
  {
    a: "S — Penginderaan", b: "N — Intuisi",
    question: "Bagaimana Anda mengumpulkan informasi?",
    body: "Pengindera mempercayai apa yang konkret, dapat diamati, dan terbukti. Mereka memperhatikan detail, mengingat hal-hal spesifik, dan lebih suka membangun di atas apa yang sudah berhasil. Intuitif mempercayai pola, kemungkinan, dan apa yang bisa ada. Tim pelayanan membutuhkan keduanya: Pengindera menjaga pekerjaan tetap membumi dan akurat; Intuitif menjaga pekerjaan beradaptasi dan bergerak maju.",
    color: "oklch(55% 0.22 280)",
  },
  {
    a: "T — Berpikir", b: "F — Merasakan",
    question: "Bagaimana Anda mengambil keputusan?",
    body: "Pemikir memutuskan berdasarkan logika, keadilan, dan prinsip masalah. Perasa memutuskan berdasarkan orang, nilai, dan dampak pada hubungan. Tidak ada yang lebih penuh kasih atau lebih alkitabiah dari yang lain — Kitab Suci menghormati kebenaran yang jelas dan kepedulian yang lembut. Tim yang hanya terdiri dari Pemikir bisa menjadi dingin; hanya dari Perasa bisa menghindari keputusan sulit.",
    color: "oklch(52% 0.18 215)",
  },
  {
    a: "J — Menilai", b: "P — Mengamati",
    question: "Bagaimana Anda mengorganisir kehidupan dan pekerjaan Anda?",
    body: "Penilai lebih suka rencana, tenggat waktu, dan lingkaran yang tertutup. Mereka suka hal-hal yang sudah diputuskan. Pengamat lebih suka fleksibilitas, pilihan terbuka, dan keputusan yang ditunda hingga momen terakhir yang bertanggung jawab. Penilai membantu tim menyelesaikan; Pengamat membantu tim beradaptasi. Dalam pengaturan lapangan yang berubah cepat, keduanya dibutuhkan — tim yang hanya merencanakan tidak bisa berputar, dan tim yang hanya berputar tidak pernah mengirimkan.",
    color: "oklch(52% 0.20 25)",
  },
];

const PRACTICE_ITEMS_ID = [
  {
    title: "Bagikan tipe Anda, tetapi bicarakan",
    body: "Sebuah daftar kode empat huruf yang ditempel di dinding sedikit berguna. Rapat tim di mana setiap orang mendeskripsikan apa yang benar dan tidak-cukup-benar tentang profil mereka, dan apa yang mereka butuhkan dari rekan tim karenanya, sangat berarti.",
  },
  {
    title: "Ambil ulang setelah musim kehidupan besar",
    body: "Preferensi tipe biasanya tetap stabil, tetapi seberapa kuat seseorang memegang preferensi bisa bergeser setelah musim peregangan, penderitaan, atau pertumbuhan. Pengambilan ulang setiap beberapa tahun bisa memunculkan percakapan yang berguna.",
  },
  {
    title: "Gunakan untuk melayani, bukan sebagai alasan",
    body: "\"Saya seorang Introvert, jadi saya tidak akan melakukan keramahan\" adalah penyalahgunaan kerangka. \"Saya seorang Introvert, jadi saya menjamu yang terbaik dalam kelompok kecil dan butuh waktu yang tenang sesudahnya\" adalah jenis pengetahuan diri yang membuat tim lebih kuat. Tujuannya adalah melayani dengan lebih bijak, bukan untuk keluar.",
  },
];

const ASSESSMENT_TIPS_ID: [string, string][] = [
  ["60 pertanyaan", "Nilai setiap pernyataan pada skala 5 poin."],
  ["Jujur, bukan ideal", "Jawab berdasarkan bagaimana Anda secara alami — bukan siapa yang Anda inginkan."],
  ["Tidak ada jawaban yang benar", "Setiap tipe memiliki kekuatan kepemimpinan yang nyata."],
  ["Butuh sekitar 10 menit", "Temukan momen yang tenang. Jawaban yang terburu-buru menghasilkan hasil yang kurang akurat."],
];

const ACTION_ITEMS_ID = [
  "Ikuti penilaian 16 Kepribadian minggu ini dan diskusikan hasil empat huruf Anda dengan satu kolega yang mengenal Anda dengan baik. Tanyakan: apakah ini sesuai dengan apa yang Anda lihat pada diri saya?",
  "Identifikasi satu tempat di mana deskripsi tipe Anda mungkin membaca perilaku budaya sebagai kepribadian. Jika ini menggambarkan Anda sebagai pendiam atau langsung, tanyakan apakah sifat itu adalah temperamen atau pembentukan budaya dalam konteks spesifik Anda.",
  "Sebelum percakapan tim multikultural Anda berikutnya, singkirkan label tipe dan dekati orang lain dengan keingintahuan segar. Deskripsi kepribadian seharusnya membuka percakapan, bukan menutupnya.",
];

const SEO_PARAS_ID = [
  "Sedikit alat dalam dunia pengembangan kepemimpinan yang telah mencapai pengakuan nama Myers-Briggs Type Indicator. Jutaan orang mengikuti beberapa versi penilaian setiap tahun, dan kode tipe empat huruf telah menjadi bagian dari percakapan sehari-hari di tempat kerja, gereja, dan komunitas online secara global. Tetapi bagi pemimpin yang bekerja melampaui batas budaya, pertanyaan yang lebih dalam penting: apa yang sebenarnya diukur oleh kerangka kepribadian yang dikembangkan di Amerika pertengahan abad ke-20 ketika ia pergi ke Nairobi, Jakarta, atau Beirut?",
  "Asal-usul MBTI berasal dari teori tipe psikologis Carl Jung, yang diartikulasikan dalam karyanya tahun 1921 Tipe Psikologis, dan kemudian diterjemahkan menjadi penilaian praktis oleh Isabel Briggs Myers dan ibunya Katharine Cook Briggs. Tujuan mereka adalah murah hati dan praktis — untuk membantu orang biasa memahami diri mereka sendiri dan bekerja lebih baik dengan orang lain. Penilaian ini mengorganisir kepribadian di empat dikotomi: di mana Anda fokuskan perhatian (Introversi atau Ekstraversi), bagaimana Anda menerima informasi (Penginderaan atau Intuisi), bagaimana Anda membuat keputusan (Berpikir atau Merasakan), dan bagaimana Anda mengorganisir kehidupan Anda (Menilai atau Mengamati). Hasilnya adalah salah satu dari 16 kemungkinan kombinasi tipe, masing-masing membawa deskripsi profil.",
  "Popularitas MBTI tidak melindunginya dari pengawasan ilmiah. Peneliti yang meninjau data kepribadian selama beberapa dekade telah mengangkat dua kekhawatiran utama: keandalan uji-retest (sebagian besar responden menerima tipe yang berbeda saat diuji ulang beberapa minggu kemudian) dan validitas memaksa sifat manusia yang berkelanjutan ke dalam kategori biner baik/atau. Ilmuwan kepribadian yang bekerja di bidang ini semakin menyukai model dimensional, seperti Big Five, yang memperlakukan sifat sebagai spektrum daripada sakelar. Ini tidak membatalkan percakapan MBTI, tetapi berarti alat tersebut harus dipegang dengan longgar, sebagai peta yang berguna daripada pengukuran yang tepat.",
  "Keterbatasan lintas budaya MBTI adalah di mana taruhannya meningkat bagi pemimpin internasional. Kerangka ini dibangun pada data yang sebagian besar diambil dari populasi Barat yang berpendidikan, dan deskripsi tipenya membawa asumsi budaya yang tertanam. Pertimbangkan dimensi Introversi/Ekstraversi. Dalam budaya di mana keheningan menandakan rasa hormat, di mana berbicara tanpa undangan dalam suasana kelompok adalah tidak pantas, atau di mana harmoni kolektif mengambil prioritas daripada ekspresi individu, seseorang mungkin secara konsisten muncul sebagai introvert pada penilaian MBTI bukan karena temperamen tetapi karena nilai-nilai budaya yang dipegang teguh. Penelitian David Livermore tentang Kecerdasan Budaya (CQ) secara konsisten menunjukkan bahwa perilaku dan kepribadian disaring melalui pemrograman budaya — memisahkan keduanya membutuhkan kerja interpretatif yang disengaja.",
  "Dimensi Berpikir/Merasakan menghadirkan tantangan serupa dalam pengaturan lintas budaya. Dalam banyak budaya yang relasional dan high-context, pengambilan keputusan publik menekankan harmoni dan menjaga wajah, yang mungkin dibaca oleh instrumen MBTI sebagai preferensi untuk Merasakan daripada Berpikir. Tetapi seorang pemimpin dari budaya semacam itu mungkin secara pribadi bernalar dengan cara yang sangat analitis sambil secara publik mengekspresikan perhatian relasional — bukan karena Merasakan mendominasi tetapi karena konteks budaya mereka menuntut kepekaan relasional sebagai register yang dapat diterima secara sosial. Mereduksi kompleksitas ini menjadi satu huruf melewatkan nuansa yang dibutuhkan kompetensi lintas budaya.",
  "Tidak ada yang berarti MBTI harus ditinggalkan dalam konteks multikultural. Digunakan dengan hati-hati, ini masih bisa menghasilkan refleksi dan percakapan yang produktif. Kuncinya adalah memposisikannya sebagai undangan untuk pengungkapan diri daripada putusan yang otoritatif. Ketika tim dari lima negara yang berbeda mengeksplorasi kepribadian bersama menggunakan MBTI, output paling berharga bukan satu set kode empat huruf tetapi percakapan yang diprovokasi oleh kode-kode tersebut: inilah cara saya cenderung mendekati konflik — apakah ini sesuai dengan apa yang Anda amati? Percakapan-percakapan itu, dipandu dengan baik, memunculkan perbedaan yang meningkatkan kolaborasi terlepas dari apakah kategori tipe yang mendasarinya tepat secara budaya.",
  "Bagi pekerja lintas budaya, satu implikasi praktis adalah menolak menerapkan hasil MBTI dari satu konteks budaya untuk memprediksi perilaku dalam konteks lain. Seseorang yang dinilai sebagai Ekstravert dalam konteks rumah mereka mungkin tampil sangat berbeda saat menavigasi budaya baru di mana gaya ekspresif alami mereka dibaca sebagai tidak pantas atau agresif. Adaptasi adalah keterampilan, bukan pergeseran kepribadian, dan alat penilaian tidak boleh digunakan untuk menandai seseorang sebagai tidak konsisten hanya karena perilaku mereka bergeser di berbagai lingkungan budaya.",
  "Dari perspektif iman, kerangka kepribadian seperti MBTI paling baik berada dalam teologi penciptaan dan komunitas. Metafora yang diperluas Rasul Paulus tentang tubuh Kristus dalam 1 Korintus 12 menegaskan perbedaan nyata yang diberikan Allah dalam cara orang berfungsi: mata tidak bisa berkata kepada tangan, Aku tidak membutuhkanmu. Memahami bagaimana rekan tim berpikir, memproses, dan memimpin adalah tindakan kepedulian — ini memungkinkan pemimpin menugaskan pekerjaan dengan bijaksana, berkomunikasi dengan cara yang tepat sasaran, dan membangun tim di mana kontribusi yang berbeda benar-benar dihargai.",
  "Pada saat yang sama, Mazmur 139 menetapkan batas pada apa yang bisa diklaim oleh penilaian mana pun: Engkau membentuk aku dalam kandungan ibuku — aku dijadikan dengan ajaib dan dengan penuh hormat. Tidak ada kode empat huruf yang mengandung misteri penuh seseorang yang diciptakan dalam gambar Allah. Alat kepribadian adalah pelayan yang berguna dan tuan yang buruk. Digunakan dengan kerendahan hati budaya, landasan teologis, dan kemauan untuk memegang hasil dengan longgar, kerangka 16 tipe dapat membantu pemimpin tumbuh dalam kesadaran diri, meningkatkan dinamika tim, dan terlibat dengan lebih bijak di seluruh keragaman tubuh Kristus global yang kompleks dan indah.",
];

// ── COMPONENT ─────────────────────────────────────────────────────────────────

type QuizState = "idle" | "active" | "done";

function computeType(scores: Record<string, number>): { type: string; pcts: Record<string, number> } {
  const total = 15 * 5;
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
  const { lang } = useLanguage();
  const searchParams = useSearchParams();
  const isRetake = searchParams.get("retake") === "1";
  const isViewModule = searchParams.get("view") === "module";
  const initialState: QuizState = isRetake ? "active" : (isViewModule || !savedType || !savedScores) ? "idle" : "done";
  const [quizState, setQuizState] = useState<QuizState>(initialState);
  const [currentIdx, setCurrentIdx] = useState(0);
  const blankScores = { EI_A: 0, EI_B: 0, SN_A: 0, SN_B: 0, TF_A: 0, TF_B: 0, JP_A: 0, JP_B: 0 };
  const [scores, setScores] = useState<Record<string, number>>(
    isRetake ? blankScores : (savedScores ?? blankScores)
  );
  const [answerHistory, setAnswerHistory] = useState<{ qIdx: number; value: number; key: string }[]>([]);
  const [isSaved, setIsSaved] = useState(isSavedProp);
  const [resultSaved, setResultSaved] = useState(!!savedType);
  const [isPending, startTransition] = useTransition();
  const [selectedType, setSelectedType] = useState<string | null>(null);

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
      if (!result.error) {
        setResultSaved(true);
        trackAssessmentCompletion('16-personalities');
      }
    });
  }

  // ── TYPE MODAL ─────────────────────────────────────────────────────────────
  const modalData = selectedType ? TYPE_DATA[selectedType] : null;
  const modalDataId = selectedType ? TYPE_DATA_ID[selectedType] : null;

  const TypeModal = () => {
    if (!modalData || !selectedType) return null;
    const mSub = lang === "id" ? (modalDataId?.subtitle ?? modalData.subtitle) : modalData.subtitle;
    const mTag = lang === "id" ? (modalDataId?.tagline ?? modalData.tagline) : modalData.tagline;
    const mOvr = lang === "id" ? (modalDataId?.overview ?? modalData.overview) : modalData.overview;
    const mStr = lang === "id" ? (modalDataId?.strengths ?? modalData.strengths) : modalData.strengths;
    const mBli = lang === "id" ? (modalDataId?.blindspots ?? modalData.blindspots) : modalData.blindspots;
    const mLdr = lang === "id" ? (modalDataId?.leadership ?? modalData.leadership) : modalData.leadership;
    const mCom = lang === "id" ? (modalDataId?.communication ?? modalData.communication) : modalData.communication;
    const mCrs = lang === "id" ? (modalDataId?.crossCultural ?? modalData.crossCultural) : modalData.crossCultural;
    return (
      <div
        onClick={() => setSelectedType(null)}
        style={{
          position: "fixed", inset: 0, background: "oklch(10% 0.05 260 / 0.75)",
          zIndex: 1000, display: "flex", alignItems: "center", justifyContent: "center",
          padding: "16px", overflowY: "auto",
        }}
      >
        <div
          onClick={e => e.stopPropagation()}
          style={{
            background: "white", borderRadius: 20, maxWidth: 640, width: "100%",
            maxHeight: "90vh", overflowY: "auto",
            boxShadow: "0 24px 80px oklch(10% 0.10 260 / 0.30)",
          }}
        >
          {/* Modal header */}
          <div style={{ background: modalData.bg, borderRadius: "20px 20px 0 0", padding: "32px 32px 28px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
              <div>
                <span style={{ fontFamily: "Cormorant Garamond, Georgia, serif", fontSize: "clamp(44px, 8vw, 64px)", fontWeight: 700, color: modalData.colorLight, lineHeight: 1 }}>
                  {selectedType}
                </span>
                <div style={{ fontFamily: "Cormorant Garamond, Georgia, serif", fontSize: 22, fontWeight: 400, color: "white", marginTop: 6 }}>
                  {mSub}
                </div>
                <div style={{ fontFamily: "var(--font-montserrat), Montserrat, sans-serif", fontSize: 14, color: "oklch(78% 0.07 260)", marginTop: 4 }}>
                  {mTag}
                </div>
              </div>
              <button
                onClick={() => setSelectedType(null)}
                style={{
                  background: "oklch(100% 0 0 / 0.12)", border: "none", color: "white",
                  borderRadius: 0, width: 36, height: 36, cursor: "pointer",
                  fontFamily: "var(--font-montserrat), Montserrat, sans-serif", fontSize: 18, lineHeight: 1,
                  flexShrink: 0, marginLeft: 16,
                }}
              >
                ×
              </button>
            </div>
          </div>

          {/* Modal body */}
          <div style={{ padding: "28px 32px 32px", display: "grid", gap: 20 }}>

            {/* Ministry team profile */}
            <div style={{ background: "oklch(97% 0.02 260)", borderRadius: 12, padding: "18px 20px", borderLeft: `4px solid ${modalData.color}` }}>
              <p style={{ fontFamily: "var(--font-montserrat), Montserrat, sans-serif", fontSize: 13, fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", color: modalData.color, marginBottom: 8 }}>
                {lang === "id" ? "Dalam Tim Pelayanan" : "On a Ministry Team"}
              </p>
              <p style={{ fontFamily: "var(--font-montserrat), Montserrat, sans-serif", fontSize: 15, lineHeight: 1.75, color: "oklch(28% 0.06 260)", margin: 0 }}>
                {lang === "id" ? (SHORT_PROFILES_ID[selectedType] ?? SHORT_PROFILES[selectedType]) : SHORT_PROFILES[selectedType]}
              </p>
            </div>

            {/* Overview */}
            <p style={{ fontFamily: "var(--font-montserrat), Montserrat, sans-serif", fontSize: 15, lineHeight: 1.75, color: "oklch(28% 0.06 260)", margin: 0 }}>
              {mOvr}
            </p>

            {/* Strengths & Blindspots */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
              {[
                { title: lang === "id" ? "Kekuatan" : "Strengths", items: mStr, color: "oklch(52% 0.18 155)", bg: "oklch(96% 0.03 155)" },
                { title: lang === "id" ? "Titik Buta" : "Blindspots", items: mBli, color: "oklch(52% 0.18 35)", bg: "oklch(97% 0.03 35)" },
              ].map(section => (
                <div key={section.title} style={{ background: "white", borderRadius: 12, overflow: "hidden", border: "1px solid oklch(92% 0.04 260)" }}>
                  <div style={{ padding: "12px 16px", background: section.bg }}>
                    <span style={{ fontFamily: "var(--font-montserrat), Montserrat, sans-serif", fontSize: 11, fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", color: section.color }}>{section.title}</span>
                  </div>
                  <ul style={{ margin: 0, padding: "12px 16px", listStyle: "none", display: "grid", gap: 8 }}>
                    {section.items.map(item => (
                      <li key={item} style={{ display: "flex", gap: 8, alignItems: "flex-start" }}>
                        <div style={{ width: 5, height: 5, borderRadius: "50%", background: section.color, marginTop: 6, flexShrink: 0 }} />
                        <span style={{ fontFamily: "var(--font-montserrat), Montserrat, sans-serif", fontSize: 13, lineHeight: 1.6, color: "oklch(28% 0.06 260)" }}>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>

            {/* Leadership, Communication, Cross-cultural */}
            {[
              { title: lang === "id" ? "Gaya Kepemimpinan" : "Leadership Style", content: mLdr },
              { title: lang === "id" ? "Komunikasi" : "Communication", content: mCom },
              { title: lang === "id" ? "Kesadaran Lintas Budaya" : "Cross-Cultural Awareness", content: mCrs },
            ].map(section => (
              <div key={section.title} style={{ background: "oklch(98% 0.006 260)", borderRadius: 12, padding: "16px 20px", border: "1px solid oklch(92% 0.04 260)" }}>
                <p style={{ fontFamily: "var(--font-montserrat), Montserrat, sans-serif", fontSize: 11, fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", color: "oklch(40% 0.06 260)", marginBottom: 8 }}>{section.title}</p>
                <p style={{ fontFamily: "var(--font-montserrat), Montserrat, sans-serif", fontSize: 14, lineHeight: 1.75, color: "oklch(30% 0.06 260)", margin: 0 }}>{section.content}</p>
              </div>
            ))}

            <button
              onClick={() => setSelectedType(null)}
              style={{ padding: "12px 24px", background: modalData.color, color: "white", border: "none", borderRadius: 0, fontFamily: "var(--font-montserrat), Montserrat, sans-serif", fontSize: 14, fontWeight: 600, cursor: "pointer", alignSelf: "flex-start" }}
            >
              {lang === "id" ? "Tutup" : "Close"}
            </button>
          </div>
        </div>
      </div>
    );
  };

  // ── IDLE ───────────────────────────────────────────────────────────────────
  if (quizState === "idle") {
    return (
      <div style={{ minHeight: "100vh", background: "oklch(98% 0.006 260)", fontFamily: "var(--font-montserrat), Montserrat, sans-serif" }}>
        <TypeModal />
        <LangToggle />
        <style>{`
          @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@400;600;700&family=Montserrat:wght@300;400;500;600;700&family=Libre+Baskerville:ital,wght@0,400;0,700;1,400&family=Outfit:wght@300;400;500;600&display=swap');
          .p16-btn { transition: all 0.18s ease; cursor: pointer; }
          .p16-btn:hover { transform: translateY(-1px); }
          .type-chip { transition: all 0.18s ease; cursor: pointer; }
          .type-chip:hover { transform: translateY(-3px); box-shadow: 0 8px 28px oklch(48% 0.20 260 / 0.15); }
        `}</style>

        {/* ── HERO HEADER — Crispy Navy ── */}
        <div style={{ background: "oklch(22% 0.10 260)", color: "white", padding: "72px 24px 64px" }}>
          <div style={{ maxWidth: 760, margin: "0 auto" }}>
            <p style={{ color: "oklch(65% 0.15 45)", fontSize: 12, fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", marginBottom: 20, fontFamily: "'Montserrat', sans-serif" }}>
              {lang === "id" ? "Pengembangan Diri · Penilaian" : "Personal Development · Assessment"}
            </p>
            <h1 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "clamp(40px, 6vw, 72px)", fontWeight: 600, lineHeight: 1.08, marginBottom: 20 }}>
              16 Personalities
            </h1>
            <p style={{ fontFamily: "'Montserrat', sans-serif", fontSize: 17, fontWeight: 400, lineHeight: 1.7, color: "oklch(85% 0.05 240)", maxWidth: 580 }}>
              {lang === "id"
                ? "Salah satu kerangka kepribadian yang paling banyak digunakan di dunia — temukan tipe empat huruf Anda dan pahami bagaimana susunan alami Anda membentuk cara Anda memimpin, berpikir, dan berhubungan."
                : "One of the world's most widely used personality frameworks — discover your four-letter type and understand how your natural wiring shapes how you lead, think, and relate."}
            </p>
            <button
              onClick={startQuiz}
              className="p16-btn"
              style={{ marginTop: 36, padding: "14px 36px", background: "oklch(65% 0.15 45)", color: "white", border: "none", borderRadius: 0, fontFamily: "'Montserrat', sans-serif", fontSize: 16, fontWeight: 600 }}
            >
              {lang === "id" ? "Mulai Penilaian →" : "Start Assessment →"}
            </button>
          </div>
        </div>

        <div style={{ maxWidth: 760, margin: "0 auto", padding: "56px 24px" }}>

          {/* What is the framework */}
          <section style={{ marginBottom: 52 }}>
            <h2 style={{ fontFamily: "Cormorant Garamond, Georgia, serif", fontSize: 26, fontWeight: 400, color: "oklch(20% 0.14 260)", marginBottom: 16 }}>
              {lang === "id" ? "Apa itu Kerangka 16 Kepribadian?" : "What is the 16 Personalities Framework?"}
            </h2>
            <p style={{ fontFamily: "var(--font-montserrat), Montserrat, sans-serif", fontSize: 16, lineHeight: 1.75, color: "oklch(30% 0.06 260)", marginBottom: 14 }}>
              {lang === "id"
                ? "Kerangka 16 Kepribadian memberi setiap anggota tim Anda singkatan empat huruf yang menangkap bagaimana mereka secara alami disusun. Ini tidak mengukur seberapa terampil Anda, seberapa dewasa Anda dalam iman, atau seberapa efektif Anda sebagai pemimpin. Ini memetakan standar Anda: dari mana energi Anda berasal, bagaimana Anda menerima informasi, bagaimana Anda menimbang keputusan, dan bagaimana Anda lebih suka mengorganisir dunia di sekitar Anda."
                : "The 16 Personalities framework gives every member of your team a four-letter shorthand that captures how they are naturally wired. It does not measure how skilled you are, how mature you are in faith, or how effective you are as a leader. It maps your defaults: where your energy comes from, how you take in information, how you weigh decisions, and how you prefer to organise the world around you."}
            </p>
            <p style={{ fontFamily: "var(--font-montserrat), Montserrat, sans-serif", fontSize: 16, lineHeight: 1.75, color: "oklch(30% 0.06 260)", marginBottom: 14 }}>
              {lang === "id"
                ? "Masing-masing dari empat area ini berada di spektrum. Anda selalu memiliki akses ke kedua ujung. Huruf tersebut hanya menyebutkan sisi mana yang terasa lebih mudah dan lebih alami ketika Anda tidak secara sadar meregangkan diri."
                : "Each of these four areas sits on a spectrum. You always have access to both ends. The letter simply names which side feels easier and more natural when you are not consciously stretching."}
            </p>
            <p style={{ fontFamily: "var(--font-montserrat), Montserrat, sans-serif", fontSize: 16, lineHeight: 1.75, color: "oklch(30% 0.06 260)" }}>
              {lang === "id"
                ? "Jenis pengetahuan diri ini tidak baru dalam kepemimpinan Kristen. Paulus menulis bahwa tubuh Kristus terdiri dari banyak bagian, masing-masing dibentuk secara berbeda dan masing-masing dibutuhkan (1 Korintus 12). Kerangka 16 Kepribadian memberi Anda kosakata modern untuk kebenaran kuno tersebut — membantu tim Anda melewati asumsi diam bahwa semua orang harus berpikir, memutuskan, dan memimpin seperti orang yang paling terlihat di ruangan."
                : "This kind of self-knowledge is not new in Christian leadership. Paul wrote that the body of Christ is made up of many parts, each shaped differently and each needed (1 Corinthians 12). The 16 Personalities framework gives you a modern vocabulary for that ancient truth — helping your team move past the quiet assumption that everyone should think, decide, and lead the way the most visible person in the room does."}
            </p>
          </section>

          {/* Why this helps Christian ministry teams */}
          <section style={{ marginBottom: 52, background: "white", borderRadius: 16, border: "1px solid oklch(90% 0.04 260)", overflow: "hidden" }}>
            <div style={{ background: "oklch(22% 0.10 260)", padding: "20px 28px" }}>
              <h2 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 24, fontWeight: 600, color: "white", margin: 0 }}>
                {lang === "id" ? "Mengapa ini membantu tim pelayanan Kristen" : "Why this helps Christian ministry teams"}
              </h2>
            </div>
            <div style={{ padding: "24px 28px" }}>
              <p style={{ fontFamily: "var(--font-montserrat), Montserrat, sans-serif", fontSize: 15, lineHeight: 1.75, color: "oklch(30% 0.06 260)", marginBottom: 24 }}>
                {lang === "id"
                  ? "Dalam pekerjaan Kristen lintas budaya, tim sering kecil, pekerjaan intens, dan kepribadian bisa bergesekan dengan cara yang terasa spiritual tetapi sebenarnya struktural. Tanpa bahasa untuk menamai perbedaan-perbedaan ini, tim bisa mengspiritualkannya — melabeli seseorang \"tidak taat\" padahal mereka hanya memproses secara berbeda. Kerangka 16 Kepribadian memberi tim pelayanan empat manfaat praktis:"
                  : "In cross-cultural Christian work, teams are often small, the work is intense, and personalities can rub against each other in ways that feel spiritual but are actually structural. Without language to name these differences, teams can spiritualise them — labelling someone \"unsubmissive\" when they are simply processing differently. The 16 Personalities framework gives ministry teams four practical gains:"}
              </p>
              {(lang === "id" ? MINISTRY_BENEFITS_ID : [
                {
                  title: "Lowers the temperature of conflict",
                  body: "When a teammate's frustrating habit can be named as a type-preference rather than a character flaw, it becomes much easier to address without judgement. The conversation moves from \"you are wrong\" to \"we are wired differently — how do we work with that?\"",
                  color: "oklch(65% 0.15 45)",
                },
                {
                  title: "Sharpens role fit",
                  body: "Every ministry team has visible front-line work and quieter back-line work. Knowing each person's type makes it easier to match the right people to the right roles. A team that knows itself stops asking its quiet researcher to host the welcome event.",
                  color: "oklch(48% 0.20 255)",
                },
                {
                  title: "Strengthens cross-cultural sensitivity",
                  body: "Cross-cultural teams already navigate many layers of difference. Adding a personality layer reminds the team that not all difference is cultural. Some of the friction you feel with a teammate from another country may be the same friction you would feel with someone from your own country who shared their type.",
                  color: "oklch(48% 0.20 295)",
                },
                {
                  title: "Helps leaders steward themselves",
                  body: "Long-term cross-cultural ministry asks people to give continually. Knowing your own type shows you which contexts drain you fastest, which decisions are likely to be hardest, and where your blind spots most often sit. This is good stewardship of the person God has called and shaped.",
                  color: "oklch(45% 0.16 200)",
                },
              ]).map((item, i) => (
                <div key={i} style={{ display: "flex", gap: 16, padding: "16px 0", borderBottom: i < 3 ? "1px solid oklch(94% 0.02 260)" : "none" }}>
                  <div style={{ width: 4, borderRadius: 4, background: item.color, flexShrink: 0, marginTop: 2 }} />
                  <div>
                    <p style={{ fontFamily: "var(--font-montserrat), Montserrat, sans-serif", fontSize: 15, fontWeight: 600, color: "oklch(20% 0.10 260)", marginBottom: 6 }}>{item.title}</p>
                    <p style={{ fontFamily: "var(--font-montserrat), Montserrat, sans-serif", fontSize: 14, lineHeight: 1.75, color: "oklch(35% 0.06 260)", margin: 0 }}>{item.body}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* The Four Dimensions */}
          <section style={{ marginBottom: 52 }}>
            <h2 style={{ fontFamily: "Cormorant Garamond, Georgia, serif", fontSize: 26, fontWeight: 400, color: "oklch(20% 0.14 260)", marginBottom: 8 }}>
              {lang === "id" ? "Empat Dimensi" : "The Four Dimensions"}
            </h2>
            <p style={{ fontFamily: "var(--font-montserrat), Montserrat, sans-serif", fontSize: 15, color: "oklch(45% 0.06 260)", marginBottom: 24 }}>
              {lang === "id" ? "Setiap dimensi adalah spektrum. Tipe Anda mencerminkan preferensi alami Anda, bukan satu-satunya kemampuan Anda." : "Each dimension is a spectrum. Your type reflects your natural preference, not your only capability."}
            </p>
            <div style={{ display: "grid", gap: 16 }}>
              {(lang === "id" ? DIMENSIONS_ID : [
                {
                  a: "E — Extraversion", b: "I — Introversion",
                  question: "Where do you direct your energy?",
                  body: "Extraverts are energised by being around people, talking ideas out loud, and engaging with the outside world. Introverts are energised by quiet, by inward reflection, and by depth over breadth in their relationships. Both can lead well. The Bible holds both Peter, who spoke first and thought later, and Mary, who treasured things up and pondered them in her heart.",
                  color: "oklch(62% 0.18 52)",
                },
                {
                  a: "S — Sensing", b: "N — Intuition",
                  question: "How do you gather information?",
                  body: "Sensors trust what is concrete, observable, and proven. They notice details, remember specifics, and prefer to build on what is already working. Intuitives trust patterns, possibilities, and what could be. Ministry teams need both: Sensors keep the work grounded and accurate; Intuitives keep it adapting and moving forward.",
                  color: "oklch(55% 0.22 280)",
                },
                {
                  a: "T — Thinking", b: "F — Feeling",
                  question: "How do you make decisions?",
                  body: "Thinkers decide based on logic, fairness, and the principle of the matter. Feelers decide based on people, values, and the impact on relationships. Neither is more compassionate or more biblical than the other — Scripture honours both clear truth and tender care. A team made up only of Thinkers can become cold; only of Feelers can avoid hard calls.",
                  color: "oklch(52% 0.18 215)",
                },
                {
                  a: "J — Judging", b: "P — Perceiving",
                  question: "How do you organise your life and work?",
                  body: "Judgers prefer plans, deadlines, and closed loops. They like things decided. Perceivers prefer flexibility, options open, and decisions delayed until the last responsible moment. Judgers help a team finish; Perceivers help a team adapt. In a fast-changing field setting, both are needed — the team that only plans cannot pivot, and the team that only pivots never ships.",
                  color: "oklch(52% 0.20 25)",
                },
              ]).map(dim => (
                <div key={dim.a} style={{ background: "white", borderRadius: 14, padding: "22px 24px", border: "1px solid oklch(90% 0.04 260)" }}>
                  <div style={{ display: "flex", gap: 8, alignItems: "center", marginBottom: 6, flexWrap: "wrap" }}>
                    <span style={{ fontFamily: "Cormorant Garamond, Georgia, serif", fontSize: 17, fontWeight: 700, color: dim.color }}>{dim.a}</span>
                    <span style={{ color: "oklch(70% 0.05 260)", fontSize: 13 }}>vs</span>
                    <span style={{ fontFamily: "Cormorant Garamond, Georgia, serif", fontSize: 17, fontWeight: 700, color: "oklch(45% 0.08 260)" }}>{dim.b}</span>
                    <span style={{ fontFamily: "var(--font-montserrat), Montserrat, sans-serif", fontSize: 13, color: "oklch(50% 0.06 260)", marginLeft: 4 }}>— {dim.question}</span>
                  </div>
                  <p style={{ fontFamily: "var(--font-montserrat), Montserrat, sans-serif", fontSize: 14, lineHeight: 1.75, color: "oklch(35% 0.06 260)", margin: 0 }}>{dim.body}</p>
                </div>
              ))}
            </div>
          </section>

          {/* The 16 Types — grouped, clickable */}
          <section style={{ marginBottom: 52 }}>
            <h2 style={{ fontFamily: "Cormorant Garamond, Georgia, serif", fontSize: 26, fontWeight: 400, color: "oklch(20% 0.14 260)", marginBottom: 8 }}>
              {lang === "id" ? "16 Tipe" : "The 16 Types"}
            </h2>
            <p style={{ fontFamily: "var(--font-montserrat), Montserrat, sans-serif", fontSize: 15, color: "oklch(45% 0.06 260)", marginBottom: 28 }}>
              {lang === "id" ? "Ketuk tipe mana pun untuk menjelajahi profil lengkapnya. Tipe Anda sendiri akan terungkap setelah menyelesaikan penilaian." : "Tap any type to explore its full profile. Your own type will be revealed after completing the assessment."}
            </p>
            <div style={{ display: "grid", gap: 24 }}>
              {TYPE_GROUPS.map((group, gIdx) => {
                const groupId = TYPE_GROUPS_ID[gIdx];
                return (
                <div key={group.label}>
                  <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 12 }}>
                    <div style={{ width: 10, height: 10, borderRadius: "50%", background: group.color, flexShrink: 0 }} />
                    <span style={{ fontFamily: "var(--font-montserrat), Montserrat, sans-serif", fontSize: 13, fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", color: group.color }}>{lang === "id" ? groupId.label : group.label}</span>
                    <span style={{ fontFamily: "var(--font-montserrat), Montserrat, sans-serif", fontSize: 12, color: "oklch(55% 0.06 260)" }}>({lang === "id" ? groupId.desc : group.desc})</span>
                  </div>
                  <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(148px, 1fr))", gap: 10 }}>
                    {group.types.map(typeName => {
                      const t = TYPE_DATA[typeName];
                      return (
                        <div
                          key={typeName}
                          className="type-chip"
                          onClick={() => setSelectedType(typeName)}
                          style={{
                            background: "white", borderRadius: 12, padding: "16px",
                            border: `1px solid ${t.colorVeryLight}`,
                            textAlign: "center",
                            borderTop: `3px solid ${t.color}`,
                          }}
                        >
                          <div style={{ fontFamily: "Cormorant Garamond, Georgia, serif", fontSize: 22, fontWeight: 700, color: t.color, marginBottom: 4 }}>{typeName}</div>
                          <div style={{ fontFamily: "var(--font-montserrat), Montserrat, sans-serif", fontSize: 11, fontWeight: 500, color: "oklch(45% 0.06 260)", marginBottom: 6 }}>{lang === "id" ? (TYPE_DATA_ID[typeName]?.subtitle ?? t.subtitle) : t.subtitle}</div>
                          <div style={{ fontFamily: "var(--font-montserrat), Montserrat, sans-serif", fontSize: 10, color: group.color, fontWeight: 600, letterSpacing: "0.04em" }}>{lang === "id" ? "Ketuk untuk jelajahi →" : "Tap to explore →"}</div>
                        </div>
                      );
                    })}
                  </div>
                </div>
                );
              })}
            </div>
          </section>

          {/* How to use this well as a team */}
          <section style={{ marginBottom: 52, background: "white", borderRadius: 16, border: "1px solid oklch(90% 0.04 260)", overflow: "hidden" }}>
            <div style={{ background: "oklch(96% 0.04 260)", padding: "20px 28px", borderBottom: "1px solid oklch(90% 0.04 260)" }}>
              <h2 style={{ fontFamily: "Cormorant Garamond, Georgia, serif", fontSize: 22, fontWeight: 400, color: "oklch(20% 0.14 260)", margin: 0 }}>
                {lang === "id" ? "Cara menggunakan ini dengan baik sebagai tim" : "How to use this well as a team"}
              </h2>
            </div>
            <div style={{ padding: "24px 28px" }}>
              <p style={{ fontFamily: "var(--font-montserrat), Montserrat, sans-serif", fontSize: 15, lineHeight: 1.75, color: "oklch(30% 0.06 260)", marginBottom: 20 }}>
                {lang === "id"
                  ? "Tidak ada tipe empat huruf yang menangkap gambar penuh Allah dalam diri seseorang. Gunakan kerangka ini sebagai pintu masuk ke percakapan, bukan label yang menutupnya. Tiga praktik paling membantu:"
                  : "No four-letter type captures the full image of God in a person. Use this framework as a doorway into conversation, not a label that closes one. Three practices help most:"}
              </p>
              {(lang === "id" ? PRACTICE_ITEMS_ID : [
                {
                  title: "Share your type, but talk about it",
                  body: "A list of four-letter codes pinned to a wall does little. A team meeting where each person describes what is true and not-quite-true about their profile, and what they need from teammates because of it, does a great deal.",
                },
                {
                  title: "Re-take it after big life seasons",
                  body: "Type preferences usually stay stable, but how strongly someone holds a preference can shift after seasons of stretching, suffering, or growth. A re-take every few years can surface useful conversation.",
                },
                {
                  title: "Use it for service, not for excuse",
                  body: "\"I'm an Introvert, so I won't do hospitality\" is a misuse of the framework. \"I'm an Introvert, so I host best in small groups and need quiet time afterwards\" is the kind of self-knowledge that makes a team stronger. The goal is to serve more wisely, not to opt out.",
                },
              ]).map((item, i) => (
                <div key={i} style={{ display: "flex", gap: 16, padding: "14px 0", borderBottom: i < 2 ? "1px solid oklch(94% 0.02 260)" : "none" }}>
                  <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 28, fontWeight: 700, color: "oklch(65% 0.15 45)", lineHeight: 1, flexShrink: 0, width: 24, textAlign: "center" }}>
                    {i + 1}
                  </div>
                  <div>
                    <p style={{ fontFamily: "var(--font-montserrat), Montserrat, sans-serif", fontSize: 15, fontWeight: 600, color: "oklch(20% 0.10 260)", marginBottom: 6 }}>{item.title}</p>
                    <p style={{ fontFamily: "var(--font-montserrat), Montserrat, sans-serif", fontSize: 14, lineHeight: 1.75, color: "oklch(35% 0.06 260)", margin: 0 }}>{item.body}</p>
                  </div>
                </div>
              ))}
              <p style={{ fontFamily: "var(--font-montserrat), Montserrat, sans-serif", fontSize: 14, lineHeight: 1.75, color: "oklch(35% 0.06 260)", marginTop: 20, marginBottom: 0, fontStyle: "italic" }}>
                {lang === "id"
                  ? "Digunakan dalam semangat ini, kerangka 16 Kepribadian menjadi satu lagi cara tim Anda belajar mengasihi satu sama lain dengan baik — mengakui cara berbeda Allah telah memprogram setiap anggota, dan membangun budaya di mana setiap tipe dibutuhkan, diberi nama, dan disambut."
                  : "Used in this spirit, the 16 Personalities framework becomes one more way your team learns to love one another well — recognising the different ways God has wired each member, and building a culture where every type is needed, named, and welcome."}
              </p>
            </div>
          </section>

          {/* How to take this assessment */}
          <section style={{ background: "white", borderRadius: 16, padding: "32px 36px", border: "1px solid oklch(90% 0.04 260)" }}>
            <h2 style={{ fontFamily: "Cormorant Garamond, Georgia, serif", fontSize: 22, fontWeight: 400, color: "oklch(20% 0.14 260)", marginBottom: 16 }}>
              {lang === "id" ? "Cara mengikuti penilaian ini" : "How to take this assessment"}
            </h2>
            {(lang === "id" ? ASSESSMENT_TIPS_ID : [
              ["60 questions", "Rate each statement on a 5-point scale."],
              ["Be honest, not ideal", "Answer based on how you naturally are — not who you aspire to be."],
              ["No right answers", "Every type has genuine strengths in leadership."],
              ["Takes about 10 minutes", "Find a quiet moment. Rushed answers produce less accurate results."],
            ] as [string, string][]).map(([label, desc]) => (
              <div key={label} style={{ display: "flex", gap: 12, alignItems: "flex-start", padding: "10px 0", borderBottom: "1px solid oklch(95% 0.03 260)" }}>
                <div style={{ width: 6, height: 6, borderRadius: "50%", background: "oklch(65% 0.15 45)", marginTop: 8, flexShrink: 0 }} />
                <div>
                  <span style={{ fontFamily: "var(--font-montserrat), Montserrat, sans-serif", fontSize: 15, fontWeight: 600, color: "oklch(22% 0.10 260)" }}>{label} — </span>
                  <span style={{ fontFamily: "var(--font-montserrat), Montserrat, sans-serif", fontSize: 15, color: "oklch(38% 0.06 260)" }}>{desc}</span>
                </div>
              </div>
            ))}
            <button
              onClick={startQuiz}
              className="p16-btn"
              style={{ marginTop: 28, padding: "13px 32px", background: "oklch(22% 0.10 260)", color: "white", border: "none", borderRadius: 0, fontFamily: "'Montserrat', sans-serif", fontSize: 15, fontWeight: 600 }}
            >
              {lang === "id" ? "Mulai Penilaian" : "Start Assessment"}
            </button>
          </section>
        </div>

        {/* ── KEY TAKEAWAY ─────────────────────────────────────────────────── */}
        <div style={{ background: "oklch(97% 0.005 80)", padding: "clamp(64px, 9vw, 88px) 24px", borderTop: "3px solid oklch(65% 0.15 45)" }}>
          <div style={{ maxWidth: 720, margin: "0 auto" }}>
            <p style={{ fontFamily: "'Montserrat', sans-serif", fontSize: 11, fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase" as const, color: "oklch(65% 0.15 45)", marginBottom: 12 }}>
              {lang === "id" ? "Poin Utama" : "Key Takeaway"}
            </p>
            <h2 style={{ fontFamily: "'Montserrat', sans-serif", fontSize: "clamp(18px, 2.2vw, 24px)", fontWeight: 800, color: "oklch(22% 0.10 260)", marginBottom: 36 }}>
              {lang === "id" ? "Tiga hal untuk ditindaklanjuti minggu ini" : "Three things to act on this week"}
            </h2>
            <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
              {(lang === "id" ? ACTION_ITEMS_ID : [
                "Take the 16 Personalities assessment this week and discuss your four-letter result with one colleague who knows you well. Ask: does this match what you see in me?",
                "Identify one place where your type description might be reading cultural behaviour as personality. If it describes you as reserved or direct, ask whether that trait is temperament or cultural formation in your specific context.",
                "Before your next multicultural team conversation, set aside type labels and approach the other person with fresh curiosity. Personality descriptions should open conversations, not close them.",
              ]).map((item, i) => (
                <div key={i} style={{ display: "flex", gap: 16, alignItems: "flex-start", padding: "20px 24px", background: "oklch(95% 0.008 80)" }}>
                  <div style={{ width: 3, alignSelf: "stretch", background: "oklch(65% 0.15 45)", flexShrink: 0 }} />
                  <p style={{ fontFamily: "'Montserrat', sans-serif", fontSize: 14, fontWeight: 500, color: "oklch(38% 0.05 260)", lineHeight: 1.75, margin: 0 }}>
                    {item}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ── LONG-FORM SEO SECTION ────────────────────────────────────────── */}
        <div style={{ background: "oklch(95% 0.008 80)", padding: "80px 24px" }}>
          <div style={{ maxWidth: 780, margin: "0 auto" }}>
            <p style={{ color: "oklch(65% 0.15 45)", fontSize: 11, fontWeight: 700, letterSpacing: "0.14em", textTransform: "uppercase" as const, marginBottom: 12 }}>
              {lang === "id" ? "Latar Belakang" : "Background"}
            </p>
            <h2 style={{ fontFamily: "'Montserrat', sans-serif", fontSize: "clamp(22px, 3vw, 32px)", fontWeight: 800, color: "oklch(22% 0.10 260)", marginBottom: 32, lineHeight: 1.2 }}>
              {lang === "id" ? "Memahami 16 Tipe Kepribadian Lintas Budaya: Yang Perlu Diketahui Pemimpin" : "Understanding 16 Personality Types Across Cultures: What Leaders Need to Know"}
            </h2>
            {(lang === "id" ? SEO_PARAS_ID : [
              "Few tools in the world of leadership development have achieved the name recognition of the Myers-Briggs Type Indicator. Millions of people take some version of the assessment each year, and the four-letter type codes have become part of everyday conversation in workplaces, churches, and online communities globally. But for leaders working across cultural boundaries, a deeper question matters: what does a personality framework developed in mid-20th century America actually measure when it travels to Nairobi, Jakarta, or Beirut?",
              "The origins of MBTI trace back to Carl Jung's theory of psychological types, articulated in his 1921 work Psychological Types, and later translated into a practical assessment by Isabel Briggs Myers and her mother Katharine Cook Briggs. Their goal was generous and practical — to help ordinary people understand themselves and work better with others. The assessment organizes personality across four dichotomies: where you focus your attention (Introversion or Extraversion), how you take in information (Sensing or Intuition), how you make decisions (Thinking or Feeling), and how you organize your life (Judging or Perceiving). The result is one of 16 possible type combinations, each carrying a profile description.",
              "The popularity of MBTI has not insulated it from scientific scrutiny. Researchers reviewing decades of personality data have raised two primary concerns: test-retest reliability (a notable portion of respondents receive a different type when retested weeks later) and the validity of forcing continuous human traits into binary either/or categories. Personality scientists working in the field increasingly favor dimensional models, such as the Big Five, that treat traits as spectrums rather than switches. This does not invalidate the MBTI conversation, but it does mean the tool should be held lightly, as a useful map rather than a precise measurement.",
              "The cross-cultural limitations of MBTI are where the stakes rise for international leaders. The framework was built on data drawn largely from Western, educated populations, and its type descriptions carry embedded cultural assumptions. Consider the Introversion/Extraversion dimension. In cultures where silence signals respect, where speaking without invitation in a group setting is inappropriate, or where collective harmony takes priority over individual expression, a person may consistently present as introverted on an MBTI assessment not because of temperament but because of deeply held cultural values. David Livermore's research on Cultural Intelligence (CQ) consistently shows that behaviour and personality are filtered through cultural programming — separating the two requires intentional interpretive work.",
              "The Thinking/Feeling dimension presents a similar challenge in cross-cultural settings. In many relational, high-context cultures, public decision-making emphasizes harmony and face-saving, which MBTI instruments may read as a preference for Feeling over Thinking. But a leader from such a culture may privately reason in highly analytical ways while publicly expressing relational attentiveness — not because Feeling dominates but because their cultural context demands relational sensitivity as the socially acceptable register. Reducing this complexity to a single letter misses the nuance that cross-cultural competence requires.",
              "None of this means MBTI should be abandoned in multicultural contexts. Used carefully, it can still generate productive reflection and conversation. The key is to position it as an invitation to self-disclosure rather than an authoritative verdict. When a team from five different countries explores personality together using MBTI, the most valuable output is not a set of four-letter codes but the conversations those codes provoke: here is how I tend to approach conflict — does that match what you observe? Those conversations, guided well, surface differences that improve collaboration regardless of whether the underlying type categories are culturally precise.",
              "For cross-cultural workers, one practical implication is to resist applying MBTI results from one cultural context to predict behaviour in another. A person assessed as an Extravert in their home context may present very differently when navigating a new culture where their natural expressive style reads as inappropriate or aggressive. Adaptation is a skill, not a personality shift, and assessment tools should not be used to mark someone as inconsistent simply because their behaviour shifts across cultural environments.",
              "From a faith perspective, personality frameworks like MBTI sit best within a theology of creation and community. The Apostle Paul's extended metaphor of the body of Christ in 1 Corinthians 12 affirms real, God-given differences in how people function: the eye cannot say to the hand, I have no need of you. Understanding how a teammate thinks, processes, and leads is an act of care — it enables leaders to assign work thoughtfully, communicate in ways that land, and build teams where different contributions are genuinely valued.",
              "At the same time, Psalm 139 sets a boundary on what any assessment can claim: you knit me together in my mother's womb — I am fearfully and wonderfully made. No four-letter code contains the full mystery of a person made in God's image. Personality tools are useful servants and poor masters. Used with cultural humility, theological grounding, and a willingness to hold results loosely, the 16-type framework can help leaders grow in self-awareness, improve team dynamics, and engage more wisely across the complex, beautiful diversity of the global body of Christ.",
            ]).map((para, i) => (
              <p key={i} style={{ fontSize: 16, color: "oklch(38% 0.05 260)", lineHeight: 1.85, marginBottom: 20 }}>
                {para}
              </p>
            ))}
          </div>
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
    const dichotomyId = DICHOTOMY_LABELS_ID[DICHOTOMY_LABELS.indexOf(dichotomy)];
    const progress = (currentIdx / QUESTION_ORDER.length) * 100;

    return (
      <div id="quiz-section" style={{ minHeight: "100vh", background: "oklch(98% 0.006 260)", fontFamily: "var(--font-montserrat), Montserrat, sans-serif" }}>
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
              <span style={{ fontSize: 13, fontWeight: 600, color: dichotomy.color }}>{lang === "id" ? dichotomyId.label : dichotomy.label}: {lang === "id" ? dichotomyId.descA : dichotomy.descA} vs {lang === "id" ? dichotomyId.descB : dichotomy.descB}</span>
            </div>
            <div style={{ height: 4, background: "oklch(90% 0.04 260)", borderRadius: 4, overflow: "hidden" }}>
              <div style={{ height: "100%", width: `${progress}%`, background: dichotomy.color, borderRadius: 4, transition: "width 0.3s ease" }} />
            </div>
          </div>
          <div style={{ background: "white", borderRadius: 20, padding: "40px", border: "1px solid oklch(92% 0.04 260)", marginBottom: 32, minHeight: 180, display: "flex", alignItems: "center" }}>
            <p style={{ fontFamily: "Cormorant Garamond, Georgia, serif", fontSize: "clamp(17px, 2.5vw, 21px)", lineHeight: 1.6, color: "oklch(18% 0.10 260)", margin: 0, fontWeight: 400 }}>
              {lang === "id" ? QUESTIONS_ID[qIdx].text : q.text}
            </p>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(5, 1fr)", gap: 8, marginBottom: 32 }}>
            {(lang === "id" ? SCALE_LABELS_ID : SCALE_LABELS).map((label, i) => (
              <button
                key={i}
                className="scale-btn16"
                onClick={() => handleAnswer(i + 1)}
                style={{ "--dcolor": dichotomy.color, textAlign: "center", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 8 } as React.CSSProperties}
              >
                <span style={{ fontFamily: "Cormorant Garamond, Georgia, serif", fontSize: 22, fontWeight: 400, color: "oklch(55% 0.10 260)" }}>{i + 1}</span>
                <span style={{ fontSize: 11, fontWeight: 500, color: "oklch(45% 0.06 260)", lineHeight: 1.3 }}>{label}</span>
              </button>
            ))}
          </div>
          <button onClick={handleBack} style={{ background: "transparent", border: "none", color: "oklch(55% 0.08 260)", fontFamily: "var(--font-montserrat), Montserrat, sans-serif", fontSize: 14, cursor: "pointer", padding: "8px 0" }}>
            {lang === "id" ? "← Kembali" : "← Back"}
          </button>
        </div>
      </div>
    );
  }

  // ── DONE ───────────────────────────────────────────────────────────────────
  const { type, pcts } = computeType(scores);
  const typeData = TYPE_DATA[type] ?? TYPE_DATA.ENFP;
  const typeDataId = TYPE_DATA_ID[type] ?? TYPE_DATA_ID.ENFP;

  return (
    <div style={{ minHeight: "100vh", background: "oklch(98% 0.006 260)", fontFamily: "var(--font-montserrat), Montserrat, sans-serif" }}>
      <LangToggle />
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Libre+Baskerville:ital,wght@0,400;0,700;1,400&family=Outfit:wght@300;400;500;600&display=swap');
        .bar16 { transition: width 1s cubic-bezier(0.4,0,0.2,1); }
      `}</style>

      {/* Hero */}
      <div style={{ background: typeData.bg, color: "white", padding: "56px 24px 48px" }}>
        <div style={{ maxWidth: 760, margin: "0 auto" }}>
          <p style={{ fontFamily: "var(--font-montserrat), Montserrat, sans-serif", fontSize: 13, fontWeight: 600, letterSpacing: "0.12em", textTransform: "uppercase", color: "oklch(72% 0.10 260)", marginBottom: 12 }}>
            {lang === "id" ? "Tipe 16 Kepribadian Anda" : "Your 16 Personalities Type"}
          </p>
          <div style={{ display: "flex", alignItems: "center", gap: 20, flexWrap: "wrap", marginBottom: 20 }}>
            <span style={{ fontFamily: "Cormorant Garamond, Georgia, serif", fontSize: "clamp(52px, 8vw, 80px)", fontWeight: 700, color: typeData.colorLight, lineHeight: 1 }}>{type}</span>
            <div>
              <div style={{ fontFamily: "Cormorant Garamond, Georgia, serif", fontSize: "clamp(22px, 3vw, 32px)", fontWeight: 400, lineHeight: 1.2 }}>{lang === "id" ? typeDataId.subtitle : typeData.subtitle}</div>
              <div style={{ fontFamily: "var(--font-montserrat), Montserrat, sans-serif", fontSize: 16, color: "oklch(80% 0.08 260)", marginTop: 6 }}>{lang === "id" ? typeDataId.tagline : typeData.tagline}</div>
            </div>
          </div>
          <p style={{ fontFamily: "var(--font-montserrat), Montserrat, sans-serif", fontSize: 16, lineHeight: 1.7, color: "oklch(82% 0.06 260)", maxWidth: 580, marginBottom: 28 }}>
            {lang === "id" ? typeDataId.overview : typeData.overview}
          </p>
          <div style={{ display: "flex", gap: 12, flexWrap: "wrap", alignItems: "center" }}>
            {!resultSaved ? (
              <button onClick={handleSave} disabled={isPending}
                style={{
                  display: "inline-flex", alignItems: "center", gap: 8,
                  background: "transparent", color: "oklch(85% 0.05 260)",
                  padding: "11px 24px", borderRadius: 6, fontFamily: "'Montserrat', sans-serif",
                  fontWeight: 600, fontSize: 14, border: "1px solid oklch(55% 0.06 260)",
                  cursor: isPending ? "wait" : "pointer",
                }}>
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z"/></svg>
                {isPending ? (lang === "id" ? "Menyimpan…" : "Saving…") : (lang === "id" ? "Simpan ke Dasbor" : "Save to Dashboard")}
              </button>
            ) : (
              <span style={{ display: "inline-flex", alignItems: "center", gap: 6, color: "oklch(72% 0.14 155)", fontFamily: "'Montserrat', sans-serif", fontSize: 14, fontWeight: 600 }}>
                {lang === "id" ? "✓ Tersimpan di dasbor" : "✓ Saved to dashboard"}
              </span>
            )}
            <button onClick={startQuiz}
              style={{ background: "transparent", color: "oklch(78% 0.05 260)", border: "none", fontFamily: "'Montserrat', sans-serif", fontSize: 14, fontWeight: 500, cursor: "pointer", padding: "11px 4px" }}>
              {lang === "id" ? "Ikuti Ulang →" : "Retake →"}
            </button>
          </div>
        </div>
      </div>

      <div style={{ maxWidth: 760, margin: "0 auto", padding: "48px 24px" }}>

        {/* Ministry team insight */}
        <section style={{ marginBottom: 36, background: "white", borderRadius: 16, padding: "24px 28px", border: `2px solid ${typeData.color}`, borderLeft: `6px solid ${typeData.color}` }}>
          <p style={{ fontFamily: "var(--font-montserrat), Montserrat, sans-serif", fontSize: 12, fontWeight: 700, letterSpacing: "0.10em", textTransform: "uppercase", color: typeData.color, marginBottom: 10 }}>
            {lang === "id" ? "Dalam Tim Pelayanan" : "On a Ministry Team"}
          </p>
          <p style={{ fontFamily: "var(--font-montserrat), Montserrat, sans-serif", fontSize: 15, lineHeight: 1.8, color: "oklch(28% 0.06 260)", margin: 0 }}>
            {lang === "id" ? (SHORT_PROFILES_ID[type] ?? SHORT_PROFILES[type] ?? "") : (SHORT_PROFILES[type] ?? "")}
          </p>
        </section>

        {/* Dichotomy bars */}
        <section style={{ marginBottom: 48 }}>
          <h2 style={{ fontFamily: "Cormorant Garamond, Georgia, serif", fontSize: 24, fontWeight: 400, color: "oklch(20% 0.14 260)", marginBottom: 24 }}>{lang === "id" ? "Profil Dimensi Anda" : "Your Dimension Profile"}</h2>
          <div style={{ display: "grid", gap: 20 }}>
            {DICHOTOMY_LABELS.map((d, dIdx) => {
              const dId = DICHOTOMY_LABELS_ID[dIdx];
              const dLabel = lang === "id" ? dId.label : d.label;
              const dDescA = lang === "id" ? dId.descA : d.descA;
              const dDescB = lang === "id" ? dId.descB : d.descB;
              const pctA = pcts[d.keyA] ?? 50;
              const pctB = 100 - pctA;
              const dominant = pctA >= 50 ? dDescA : dDescB;
              const dominantPct = pctA >= 50 ? pctA : pctB;
              return (
                <div key={d.label} style={{ background: "white", borderRadius: 14, padding: "22px 26px", border: "1px solid oklch(92% 0.04 260)" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 12, flexWrap: "wrap", gap: 8 }}>
                    <span style={{ fontFamily: "var(--font-montserrat), Montserrat, sans-serif", fontSize: 14, fontWeight: 500, color: "oklch(40% 0.06 260)" }}>{dLabel}</span>
                    <span style={{ fontFamily: "var(--font-montserrat), Montserrat, sans-serif", fontSize: 14, fontWeight: 600, color: d.color }}>{dominant} — {dominantPct}%</span>
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                    <span style={{ fontSize: 13, fontWeight: 600, color: d.color, minWidth: 16 }}>{d.keyA}</span>
                    <div style={{ flex: 1, height: 8, background: "oklch(93% 0.03 260)", borderRadius: 8, overflow: "hidden" }}>
                      <div className="bar16" style={{ height: "100%", width: `${pctA}%`, background: `linear-gradient(90deg, ${typeData.color}88, ${typeData.color})`, borderRadius: 8 }} />
                    </div>
                    <span style={{ fontSize: 13, fontWeight: 600, color: "oklch(55% 0.06 260)", minWidth: 16 }}>{d.keyB}</span>
                  </div>
                  <div style={{ display: "flex", justifyContent: "space-between", marginTop: 6 }}>
                    <span style={{ fontSize: 11, color: "oklch(55% 0.06 260)" }}>{dDescA} {pctA}%</span>
                    <span style={{ fontSize: 11, color: "oklch(55% 0.06 260)" }}>{dDescB} {pctB}%</span>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* Strengths & Blindspots */}
        <section style={{ marginBottom: 40, display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}>
          {[
            { title: lang === "id" ? "Kekuatan" : "Strengths", items: lang === "id" ? typeDataId.strengths : typeData.strengths, color: "oklch(52% 0.18 155)", bg: "oklch(96% 0.03 155)" },
            { title: lang === "id" ? "Titik Buta" : "Blindspots", items: lang === "id" ? typeDataId.blindspots : typeData.blindspots, color: "oklch(52% 0.18 35)", bg: "oklch(97% 0.03 35)" },
          ].map(section => (
            <div key={section.title} style={{ background: "white", borderRadius: 16, overflow: "hidden", border: "1px solid oklch(92% 0.04 260)" }}>
              <div style={{ padding: "16px 20px", background: section.bg }}>
                <span style={{ fontFamily: "var(--font-montserrat), Montserrat, sans-serif", fontSize: 13, fontWeight: 600, letterSpacing: "0.08em", textTransform: "uppercase", color: section.color }}>{section.title}</span>
              </div>
              <ul style={{ margin: 0, padding: "16px 20px", listStyle: "none", display: "grid", gap: 10 }}>
                {section.items.map(item => (
                  <li key={item} style={{ display: "flex", gap: 10, alignItems: "flex-start" }}>
                    <div style={{ width: 6, height: 6, borderRadius: "50%", background: section.color, marginTop: 7, flexShrink: 0 }} />
                    <span style={{ fontFamily: "var(--font-montserrat), Montserrat, sans-serif", fontSize: 14, lineHeight: 1.6, color: "oklch(28% 0.06 260)" }}>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </section>

        {/* Leadership, Communication, Cross-cultural */}
        {[
          { title: lang === "id" ? "Gaya Kepemimpinan" : "Leadership Style", content: lang === "id" ? typeDataId.leadership : typeData.leadership },
          { title: lang === "id" ? "Wawasan Komunikasi" : "Communication Insights", content: lang === "id" ? typeDataId.communication : typeData.communication },
          { title: lang === "id" ? "Kesadaran Lintas Budaya" : "Cross-Cultural Awareness", content: lang === "id" ? typeDataId.crossCultural : typeData.crossCultural },
        ].map(section => (
          <section key={section.title} style={{ marginBottom: 20, background: "white", borderRadius: 16, padding: "24px 28px", border: "1px solid oklch(92% 0.04 260)" }}>
            <h3 style={{ fontFamily: "Cormorant Garamond, Georgia, serif", fontSize: 18, fontWeight: 400, color: "oklch(20% 0.14 260)", marginBottom: 12 }}>{section.title}</h3>
            <p style={{ fontFamily: "var(--font-montserrat), Montserrat, sans-serif", fontSize: 15, lineHeight: 1.75, color: "oklch(30% 0.06 260)", margin: 0 }}>{section.content}</p>
          </section>
        ))}

        {/* Save / Retake */}
        <div style={{ display: "flex", gap: 12, flexWrap: "wrap", marginTop: 16, alignItems: "center" }}>
          {!resultSaved ? (
            <button onClick={handleSave} disabled={isPending}
              style={{
                display: "inline-flex", alignItems: "center", gap: 8,
                background: "transparent", color: "oklch(35% 0.08 260)",
                padding: "13px 28px", borderRadius: 6, fontFamily: "'Montserrat', sans-serif",
                fontWeight: 600, fontSize: 14, border: "1px solid oklch(42% 0.08 260)",
                cursor: isPending ? "wait" : "pointer",
              }}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z"/></svg>
              {isPending ? (lang === "id" ? "Menyimpan…" : "Saving…") : (lang === "id" ? "Simpan ke Dasbor" : "Save to Dashboard")}
            </button>
          ) : (
            <span style={{ display: "inline-flex", alignItems: "center", gap: 6, color: "oklch(38% 0.14 155)", fontFamily: "'Montserrat', sans-serif", fontSize: 14, fontWeight: 600 }}>
              {lang === "id" ? "✓ Tersimpan di dasbor Anda" : "✓ Saved to your dashboard"}
            </span>
          )}
          <button onClick={startQuiz}
            style={{ padding: "13px 28px", background: "white", color: "oklch(35% 0.10 260)", border: "2px solid oklch(85% 0.05 260)", borderRadius: 0, fontFamily: "'Montserrat', sans-serif", fontSize: 14, fontWeight: 600, cursor: "pointer" }}>
            {lang === "id" ? "Ikuti Ulang Penilaian" : "Retake Assessment"}
          </button>
        </div>
      </div>
    </div>
  );
}

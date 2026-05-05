"use client";

import { useState, useTransition } from "react";
import { useSearchParams } from "next/navigation";
import { saveResourceToDashboard, save16PersonalitiesResult } from "../actions";
import LangToggle from "@/components/LangToggle";

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
      if (!result.error) setResultSaved(true);
    });
  }

  // ── TYPE MODAL ─────────────────────────────────────────────────────────────
  const modalData = selectedType ? TYPE_DATA[selectedType] : null;

  const TypeModal = () => {
    if (!modalData || !selectedType) return null;
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
                <span style={{ fontFamily: "'Libre Baskerville', serif", fontSize: "clamp(44px, 8vw, 64px)", fontWeight: 700, color: modalData.colorLight, lineHeight: 1 }}>
                  {selectedType}
                </span>
                <div style={{ fontFamily: "'Libre Baskerville', serif", fontSize: 22, fontWeight: 400, color: "white", marginTop: 6 }}>
                  {modalData.subtitle}
                </div>
                <div style={{ fontFamily: "'Outfit', sans-serif", fontSize: 14, color: "oklch(78% 0.07 260)", marginTop: 4 }}>
                  {modalData.tagline}
                </div>
              </div>
              <button
                onClick={() => setSelectedType(null)}
                style={{
                  background: "oklch(100% 0 0 / 0.12)", border: "none", color: "white",
                  borderRadius: 8, width: 36, height: 36, cursor: "pointer",
                  fontFamily: "'Outfit', sans-serif", fontSize: 18, lineHeight: 1,
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
              <p style={{ fontFamily: "'Outfit', sans-serif", fontSize: 13, fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", color: modalData.color, marginBottom: 8 }}>
                On a Ministry Team
              </p>
              <p style={{ fontFamily: "'Outfit', sans-serif", fontSize: 15, lineHeight: 1.75, color: "oklch(28% 0.06 260)", margin: 0 }}>
                {SHORT_PROFILES[selectedType]}
              </p>
            </div>

            {/* Overview */}
            <p style={{ fontFamily: "'Outfit', sans-serif", fontSize: 15, lineHeight: 1.75, color: "oklch(28% 0.06 260)", margin: 0 }}>
              {modalData.overview}
            </p>

            {/* Strengths & Blindspots */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
              {[
                { title: "Strengths", items: modalData.strengths, color: "oklch(52% 0.18 155)", bg: "oklch(96% 0.03 155)" },
                { title: "Blindspots", items: modalData.blindspots, color: "oklch(52% 0.18 35)", bg: "oklch(97% 0.03 35)" },
              ].map(section => (
                <div key={section.title} style={{ background: "white", borderRadius: 12, overflow: "hidden", border: "1px solid oklch(92% 0.04 260)" }}>
                  <div style={{ padding: "12px 16px", background: section.bg }}>
                    <span style={{ fontFamily: "'Outfit', sans-serif", fontSize: 11, fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", color: section.color }}>{section.title}</span>
                  </div>
                  <ul style={{ margin: 0, padding: "12px 16px", listStyle: "none", display: "grid", gap: 8 }}>
                    {section.items.map(item => (
                      <li key={item} style={{ display: "flex", gap: 8, alignItems: "flex-start" }}>
                        <div style={{ width: 5, height: 5, borderRadius: "50%", background: section.color, marginTop: 6, flexShrink: 0 }} />
                        <span style={{ fontFamily: "'Outfit', sans-serif", fontSize: 13, lineHeight: 1.6, color: "oklch(28% 0.06 260)" }}>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>

            {/* Leadership, Communication, Cross-cultural */}
            {[
              { title: "Leadership Style", content: modalData.leadership },
              { title: "Communication", content: modalData.communication },
              { title: "Cross-Cultural Awareness", content: modalData.crossCultural },
            ].map(section => (
              <div key={section.title} style={{ background: "oklch(98% 0.006 260)", borderRadius: 12, padding: "16px 20px", border: "1px solid oklch(92% 0.04 260)" }}>
                <p style={{ fontFamily: "'Outfit', sans-serif", fontSize: 11, fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", color: "oklch(40% 0.06 260)", marginBottom: 8 }}>{section.title}</p>
                <p style={{ fontFamily: "'Outfit', sans-serif", fontSize: 14, lineHeight: 1.75, color: "oklch(30% 0.06 260)", margin: 0 }}>{section.content}</p>
              </div>
            ))}

            <button
              onClick={() => setSelectedType(null)}
              style={{ padding: "12px 24px", background: modalData.color, color: "white", border: "none", borderRadius: 8, fontFamily: "'Outfit', sans-serif", fontSize: 14, fontWeight: 600, cursor: "pointer", alignSelf: "flex-start" }}
            >
              Close
            </button>
          </div>
        </div>
      </div>
    );
  };

  // ── IDLE ───────────────────────────────────────────────────────────────────
  if (quizState === "idle") {
    return (
      <div style={{ minHeight: "100vh", background: "oklch(98% 0.006 260)", fontFamily: "'Outfit', sans-serif" }}>
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
        <div style={{ background: "#1B3A6B", color: "white", padding: "72px 24px 64px" }}>
          <div style={{ maxWidth: 760, margin: "0 auto" }}>
            <p style={{ color: "#E07540", fontSize: 12, fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", marginBottom: 20, fontFamily: "'Montserrat', sans-serif" }}>
              Personal Development · Assessment
            </p>
            <h1 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "clamp(40px, 6vw, 72px)", fontWeight: 600, lineHeight: 1.08, marginBottom: 20 }}>
              16 Personalities
            </h1>
            <p style={{ fontFamily: "'Montserrat', sans-serif", fontSize: 17, fontWeight: 400, lineHeight: 1.7, color: "oklch(85% 0.05 240)", maxWidth: 580 }}>
              One of the world's most widely used personality frameworks — discover your four-letter type and understand how your natural wiring shapes how you lead, think, and relate.
            </p>
            <button
              onClick={startQuiz}
              className="p16-btn"
              style={{ marginTop: 36, padding: "14px 36px", background: "#E07540", color: "white", border: "none", borderRadius: 8, fontFamily: "'Montserrat', sans-serif", fontSize: 16, fontWeight: 600 }}
            >
              Start Assessment →
            </button>
          </div>
        </div>

        <div style={{ maxWidth: 760, margin: "0 auto", padding: "56px 24px" }}>

          {/* What is the framework */}
          <section style={{ marginBottom: 52 }}>
            <h2 style={{ fontFamily: "'Libre Baskerville', serif", fontSize: 26, fontWeight: 400, color: "oklch(20% 0.14 260)", marginBottom: 16 }}>
              What is the 16 Personalities Framework?
            </h2>
            <p style={{ fontFamily: "'Outfit', sans-serif", fontSize: 16, lineHeight: 1.75, color: "oklch(30% 0.06 260)", marginBottom: 14 }}>
              The 16 Personalities framework gives every member of your team a four-letter shorthand that captures how they are naturally wired. It does not measure how skilled you are, how mature you are in faith, or how effective you are as a leader. It maps your defaults: where your energy comes from, how you take in information, how you weigh decisions, and how you prefer to organise the world around you.
            </p>
            <p style={{ fontFamily: "'Outfit', sans-serif", fontSize: 16, lineHeight: 1.75, color: "oklch(30% 0.06 260)", marginBottom: 14 }}>
              Each of these four areas sits on a spectrum. You always have access to both ends. The letter simply names which side feels easier and more natural when you are not consciously stretching.
            </p>
            <p style={{ fontFamily: "'Outfit', sans-serif", fontSize: 16, lineHeight: 1.75, color: "oklch(30% 0.06 260)" }}>
              This kind of self-knowledge is not new in Christian leadership. Paul wrote that the body of Christ is made up of many parts, each shaped differently and each needed (1 Corinthians 12). The 16 Personalities framework gives you a modern vocabulary for that ancient truth — helping your team move past the quiet assumption that everyone should think, decide, and lead the way the most visible person in the room does.
            </p>
          </section>

          {/* Why this helps Christian ministry teams */}
          <section style={{ marginBottom: 52, background: "white", borderRadius: 16, border: "1px solid oklch(90% 0.04 260)", overflow: "hidden" }}>
            <div style={{ background: "#1B3A6B", padding: "20px 28px" }}>
              <h2 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 24, fontWeight: 600, color: "white", margin: 0 }}>
                Why this helps Christian ministry teams
              </h2>
            </div>
            <div style={{ padding: "24px 28px" }}>
              <p style={{ fontFamily: "'Outfit', sans-serif", fontSize: 15, lineHeight: 1.75, color: "oklch(30% 0.06 260)", marginBottom: 24 }}>
                In cross-cultural Christian work, teams are often small, the work is intense, and personalities can rub against each other in ways that feel spiritual but are actually structural. Without language to name these differences, teams can spiritualise them — labelling someone "unsubmissive" when they are simply processing differently. The 16 Personalities framework gives ministry teams four practical gains:
              </p>
              {[
                {
                  title: "Lowers the temperature of conflict",
                  body: "When a teammate's frustrating habit can be named as a type-preference rather than a character flaw, it becomes much easier to address without judgement. The conversation moves from \"you are wrong\" to \"we are wired differently — how do we work with that?\"",
                  color: "#E07540",
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
              ].map((item, i) => (
                <div key={i} style={{ display: "flex", gap: 16, padding: "16px 0", borderBottom: i < 3 ? "1px solid oklch(94% 0.02 260)" : "none" }}>
                  <div style={{ width: 4, borderRadius: 4, background: item.color, flexShrink: 0, marginTop: 2 }} />
                  <div>
                    <p style={{ fontFamily: "'Outfit', sans-serif", fontSize: 15, fontWeight: 600, color: "oklch(20% 0.10 260)", marginBottom: 6 }}>{item.title}</p>
                    <p style={{ fontFamily: "'Outfit', sans-serif", fontSize: 14, lineHeight: 1.75, color: "oklch(35% 0.06 260)", margin: 0 }}>{item.body}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* The Four Dimensions */}
          <section style={{ marginBottom: 52 }}>
            <h2 style={{ fontFamily: "'Libre Baskerville', serif", fontSize: 26, fontWeight: 400, color: "oklch(20% 0.14 260)", marginBottom: 8 }}>
              The Four Dimensions
            </h2>
            <p style={{ fontFamily: "'Outfit', sans-serif", fontSize: 15, color: "oklch(45% 0.06 260)", marginBottom: 24 }}>
              Each dimension is a spectrum. Your type reflects your natural preference, not your only capability.
            </p>
            <div style={{ display: "grid", gap: 16 }}>
              {[
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
              ].map(dim => (
                <div key={dim.a} style={{ background: "white", borderRadius: 14, padding: "22px 24px", border: "1px solid oklch(90% 0.04 260)" }}>
                  <div style={{ display: "flex", gap: 8, alignItems: "center", marginBottom: 6, flexWrap: "wrap" }}>
                    <span style={{ fontFamily: "'Libre Baskerville', serif", fontSize: 17, fontWeight: 700, color: dim.color }}>{dim.a}</span>
                    <span style={{ color: "oklch(70% 0.05 260)", fontSize: 13 }}>vs</span>
                    <span style={{ fontFamily: "'Libre Baskerville', serif", fontSize: 17, fontWeight: 700, color: "oklch(45% 0.08 260)" }}>{dim.b}</span>
                    <span style={{ fontFamily: "'Outfit', sans-serif", fontSize: 13, color: "oklch(50% 0.06 260)", marginLeft: 4 }}>— {dim.question}</span>
                  </div>
                  <p style={{ fontFamily: "'Outfit', sans-serif", fontSize: 14, lineHeight: 1.75, color: "oklch(35% 0.06 260)", margin: 0 }}>{dim.body}</p>
                </div>
              ))}
            </div>
          </section>

          {/* The 16 Types — grouped, clickable */}
          <section style={{ marginBottom: 52 }}>
            <h2 style={{ fontFamily: "'Libre Baskerville', serif", fontSize: 26, fontWeight: 400, color: "oklch(20% 0.14 260)", marginBottom: 8 }}>
              The 16 Types
            </h2>
            <p style={{ fontFamily: "'Outfit', sans-serif", fontSize: 15, color: "oklch(45% 0.06 260)", marginBottom: 28 }}>
              Tap any type to explore its full profile. Your own type will be revealed after completing the assessment.
            </p>
            <div style={{ display: "grid", gap: 24 }}>
              {TYPE_GROUPS.map(group => (
                <div key={group.label}>
                  <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 12 }}>
                    <div style={{ width: 10, height: 10, borderRadius: "50%", background: group.color, flexShrink: 0 }} />
                    <span style={{ fontFamily: "'Outfit', sans-serif", fontSize: 13, fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", color: group.color }}>{group.label}</span>
                    <span style={{ fontFamily: "'Outfit', sans-serif", fontSize: 12, color: "oklch(55% 0.06 260)" }}>({group.desc})</span>
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
                          <div style={{ fontFamily: "'Libre Baskerville', serif", fontSize: 22, fontWeight: 700, color: t.color, marginBottom: 4 }}>{typeName}</div>
                          <div style={{ fontFamily: "'Outfit', sans-serif", fontSize: 11, fontWeight: 500, color: "oklch(45% 0.06 260)", marginBottom: 6 }}>{t.subtitle}</div>
                          <div style={{ fontFamily: "'Outfit', sans-serif", fontSize: 10, color: group.color, fontWeight: 600, letterSpacing: "0.04em" }}>Tap to explore →</div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* How to use this well as a team */}
          <section style={{ marginBottom: 52, background: "white", borderRadius: 16, border: "1px solid oklch(90% 0.04 260)", overflow: "hidden" }}>
            <div style={{ background: "oklch(96% 0.04 260)", padding: "20px 28px", borderBottom: "1px solid oklch(90% 0.04 260)" }}>
              <h2 style={{ fontFamily: "'Libre Baskerville', serif", fontSize: 22, fontWeight: 400, color: "oklch(20% 0.14 260)", margin: 0 }}>
                How to use this well as a team
              </h2>
            </div>
            <div style={{ padding: "24px 28px" }}>
              <p style={{ fontFamily: "'Outfit', sans-serif", fontSize: 15, lineHeight: 1.75, color: "oklch(30% 0.06 260)", marginBottom: 20 }}>
                No four-letter type captures the full image of God in a person. Use this framework as a doorway into conversation, not a label that closes one. Three practices help most:
              </p>
              {[
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
              ].map((item, i) => (
                <div key={i} style={{ display: "flex", gap: 16, padding: "14px 0", borderBottom: i < 2 ? "1px solid oklch(94% 0.02 260)" : "none" }}>
                  <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 28, fontWeight: 700, color: "#E07540", lineHeight: 1, flexShrink: 0, width: 24, textAlign: "center" }}>
                    {i + 1}
                  </div>
                  <div>
                    <p style={{ fontFamily: "'Outfit', sans-serif", fontSize: 15, fontWeight: 600, color: "oklch(20% 0.10 260)", marginBottom: 6 }}>{item.title}</p>
                    <p style={{ fontFamily: "'Outfit', sans-serif", fontSize: 14, lineHeight: 1.75, color: "oklch(35% 0.06 260)", margin: 0 }}>{item.body}</p>
                  </div>
                </div>
              ))}
              <p style={{ fontFamily: "'Outfit', sans-serif", fontSize: 14, lineHeight: 1.75, color: "oklch(35% 0.06 260)", marginTop: 20, marginBottom: 0, fontStyle: "italic" }}>
                Used in this spirit, the 16 Personalities framework becomes one more way your team learns to love one another well — recognising the different ways God has wired each member, and building a culture where every type is needed, named, and welcome.
              </p>
            </div>
          </section>

          {/* How to take this assessment */}
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
                <div style={{ width: 6, height: 6, borderRadius: "50%", background: "#E07540", marginTop: 8, flexShrink: 0 }} />
                <div>
                  <span style={{ fontFamily: "'Outfit', sans-serif", fontSize: 15, fontWeight: 600, color: "oklch(22% 0.10 260)" }}>{label} — </span>
                  <span style={{ fontFamily: "'Outfit', sans-serif", fontSize: 15, color: "oklch(38% 0.06 260)" }}>{desc}</span>
                </div>
              </div>
            ))}
            <button
              onClick={startQuiz}
              className="p16-btn"
              style={{ marginTop: 28, padding: "13px 32px", background: "#1B3A6B", color: "white", border: "none", borderRadius: 8, fontFamily: "'Montserrat', sans-serif", fontSize: 15, fontWeight: 600 }}
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
          <p style={{ fontFamily: "'Outfit', sans-serif", fontSize: 16, lineHeight: 1.7, color: "oklch(82% 0.06 260)", maxWidth: 580, marginBottom: 28 }}>
            {typeData.overview}
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
                {isPending ? "Saving…" : "Save to Dashboard"}
              </button>
            ) : (
              <span style={{ display: "inline-flex", alignItems: "center", gap: 6, color: "oklch(72% 0.14 155)", fontFamily: "'Montserrat', sans-serif", fontSize: 14, fontWeight: 600 }}>
                ✓ Saved to dashboard
              </span>
            )}
            <button onClick={startQuiz}
              style={{ background: "transparent", color: "oklch(78% 0.05 260)", border: "none", fontFamily: "'Montserrat', sans-serif", fontSize: 14, fontWeight: 500, cursor: "pointer", padding: "11px 4px" }}>
              Retake →
            </button>
          </div>
        </div>
      </div>

      <div style={{ maxWidth: 760, margin: "0 auto", padding: "48px 24px" }}>

        {/* Ministry team insight */}
        <section style={{ marginBottom: 36, background: "white", borderRadius: 16, padding: "24px 28px", border: `2px solid ${typeData.color}`, borderLeft: `6px solid ${typeData.color}` }}>
          <p style={{ fontFamily: "'Outfit', sans-serif", fontSize: 12, fontWeight: 700, letterSpacing: "0.10em", textTransform: "uppercase", color: typeData.color, marginBottom: 10 }}>
            On a Ministry Team
          </p>
          <p style={{ fontFamily: "'Outfit', sans-serif", fontSize: 15, lineHeight: 1.8, color: "oklch(28% 0.06 260)", margin: 0 }}>
            {SHORT_PROFILES[type] ?? ""}
          </p>
        </section>

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
                      <div className="bar16" style={{ height: "100%", width: `${pctA}%`, background: `linear-gradient(90deg, ${typeData.color}88, ${typeData.color})`, borderRadius: 8 }} />
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
              {isPending ? "Saving…" : "Save to Dashboard"}
            </button>
          ) : (
            <span style={{ display: "inline-flex", alignItems: "center", gap: 6, color: "oklch(38% 0.14 155)", fontFamily: "'Montserrat', sans-serif", fontSize: 14, fontWeight: 600 }}>
              ✓ Saved to your dashboard
            </span>
          )}
          <button onClick={startQuiz}
            style={{ padding: "13px 28px", background: "white", color: "oklch(35% 0.10 260)", border: "2px solid oklch(85% 0.05 260)", borderRadius: 8, fontFamily: "'Montserrat', sans-serif", fontSize: 14, fontWeight: 600, cursor: "pointer" }}>
            Retake Assessment
          </button>
        </div>
      </div>
    </div>
  );
}

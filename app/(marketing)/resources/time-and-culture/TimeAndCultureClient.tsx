"use client";

import { useState, useEffect, useRef, useTransition } from "react";
import Link from "next/link";
import { saveResourceToDashboard } from "../actions";

// ─── Color constants (BEAU spec) ─────────────────────────────────────────────
const NAVY = "oklch(22% 0.10 260)";
const ORANGE = "oklch(65% 0.15 45)";
const OFF_WHITE = "oklch(97% 0.005 80)";
const LIGHT_GRAY = "oklch(95% 0.008 80)";
const BODY_TEXT = "oklch(38% 0.05 260)";

// ─── Concept Cards data ───────────────────────────────────────────────────────
const CONCEPT_CARDS = [
  {
    name: "THE CLOCK KEEPER",
    term: "Monochronic Time (Edward T. Hall) — also called Linear-Active Time (Richard Lewis) and Clock-Time (Richard Brislin)",
    belief: '"Time is a resource. Use it well."',
    bullets: [
      "Punctuality is a form of respect. Arriving late signals something is wrong.",
      "Tasks are completed one at a time. Switching between tasks mid-flow is disruptive.",
      "Agendas are followed. Meetings have start times, end times, and expected outcomes.",
    ],
    blindspot:
      "When someone operates from a different logic, the Clock Keeper reads it as a character flaw. Lateness looks like disrespect. Flexibility looks like disorganization. The Clock Keeper does not naturally ask: 'What does their behavior mean in their own system?' They ask: 'Why won't they just be professional?'",
  },
  {
    name: "THE RELATIONSHIP WEAVER",
    term: "Polychronic Time (Edward T. Hall) — also called Event-Oriented Culture",
    belief: '"Time belongs to the person in front of me."',
    bullets: [
      "The meeting ends when the matter is settled relationally, not when the clock reaches the agreed time.",
      "Multiple conversations and tasks can run simultaneously. This is natural, not chaotic.",
      "Relationships come before agendas. You do not start the business until you have started the connection.",
    ],
    blindspot:
      "The Relationship Weaver may genuinely not register the cost that relational flexibility places on colleagues who planned around a committed time. The warmth is real. The disruption to other people's schedules is also real.",
  },
  {
    name: "THE HARMONY FOLLOWER",
    term: "Reactive Time (Richard Lewis)",
    belief: '"Time is contextual. Read the room, not the clock."',
    bullets: [
      "Both punctuality and relational warmth are expected, but the weight shifts depending on who is present.",
      "With a senior figure or a formal context: structure and punctuality take priority.",
      "With peers or in informal settings: relationship and flow take priority.",
    ],
    blindspot:
      "This contextual flexibility can look inconsistent to both Clock Keepers (who notice the Harmony Follower is not always punctual) and Relationship Weavers (who notice the Harmony Follower is not always available for extended connection). Neither camp fully trusts them because neither sees the full logic.",
  },
  {
    name: "THE COMMUNITY KEEPER",
    term: "Sasa/Zamani Framework (John Mbiti)",
    belief: '"Time moves with the people, not the calendar."',
    bullets: [
      "Community presence constitutes the event. 'When does the meeting start?' means: 'When are the people gathered?'",
      "Past events remain present through memory and community. The community keeper carries history actively.",
      "Time is not scarce in the way a clock-keeper experiences scarcity. Presence is the currency.",
    ],
    blindspot:
      "In international or organizational teams, the Community Keeper's orientation often receives the harshest judgment, not because it is wrong, but because most organizational systems are designed around monochronic assumptions. The logic of community time is rarely explained and rarely invited into team conversations.",
  },
];

// ─── Scenario cards data ──────────────────────────────────────────────────────
const SCENARIO_CARDS = [
  {
    title: "The Overrun Meeting",
    situation:
      "The meeting was scheduled for one hour. The agenda was clear. Sixty minutes in, an important topic is still in progress. Three people at the table begin to check their phones. One reaches for their notebook and starts to close it. Another says quietly, 'We should probably wrap up.' But two other people around the table are leaning in, still mid-thought. They look slightly surprised that anyone is leaving.\n\nNobody is being rude. But the room has split in two.",
    question: "Which time logic is running here?",
    reveal:
      "Two logics are in conflict. The people reaching for their bags are operating from monochronic, Clock Keeper logic: the hour was agreed, the hour is up, the meeting is over. Their next commitment is not an inconvenience. It is a promise they made. The people still leaning in are operating from polychronic, Relationship Weaver logic: the matter is not yet resolved relationally, so the meeting is not yet done.\n\nNeither group is wrong. But without a shared language for this moment, the Clock Keepers will leave feeling the meeting was mismanaged, and the Relationship Weavers will feel the Clock Keepers care more about their schedule than the team. Both conclusions miss the real cause.",
  },
  {
    title: "The Missing Deadline",
    situation:
      "A team member from a different cultural background misses a project deadline by three days. When you follow up, they do not apologize. They do not seem alarmed. They respond with warmth and an update on how the work is going. They seem genuinely pleased to hear from you. The deadline itself is barely mentioned.\n\nYou feel a spike of frustration. But something underneath the frustration is confusion. Why are they not taking this seriously?",
    question: "Which time logic is running here?",
    reveal:
      "This is almost certainly event-oriented time in operation, either polychronic or Community Keeper logic. In an event-time orientation, the deadline is not a hard boundary but a rough horizon. What matters is the quality of the work and the relational process of getting there. The update they gave you was not evasion. It was their form of accountability: showing you the work is alive and the relationship is intact.\n\nThis does not mean the deadline does not matter. It does. But the conversation that needs to happen is not 'why are you irresponsible' but 'here is how this deadline connects to other people's work, and here is the cost when it moves.' That is a conversation that can only happen once you stop reading their logic through yours.",
  },
  {
    title: 'The "We\'ll Figure It Out" Agreement',
    situation:
      "At the end of a planning conversation, both sides say they are aligned. The project will move forward. Start date: 'sometime next month.' Budget discussion: 'we will sort that when we know more.' Decision about who leads: 'we can discuss as we go.' Everyone leaves the meeting feeling positive.\n\nThree weeks later, nothing has moved. Each side thought the other would initiate. Neither did.",
    question: "Which time logic is running here?",
    reveal:
      "The Harmony Follower orientation often surfaces in this scenario. For the Harmony Follower, the goal of that first conversation was relational alignment, not operational clarity. Leaving things open was not evasion. It was respect, allowing things to unfold at the right moment, in the right context, when the right people were present. Pinning down specifics too early can feel presumptuous or even disrespectful.\n\nThe Clock Keeper in the room heard the same conversation and walked away expecting operational follow-through. When nothing happened, they read it as broken commitment rather than different logic.\n\nThe fix is not for one side to abandon their orientation. It is to name, before leaving the room: 'Let us confirm one specific next step, so we both know what we are waiting for.' That one sentence bridges the logic gap.",
  },
];

// ─── Part 1 questions ─────────────────────────────────────────────────────────
const PART1_QUESTIONS = [
  {
    q: "A teammate arrives 20 minutes late to a team meeting with no message and no explanation. You feel:",
    options: [
      "Frustrated. Twenty minutes is not a small margin. Others managed to be here on time, and this disrupts the whole group. You want to address it directly.",
      "Curious, but not particularly troubled. Maybe something came up. You will ask privately afterward to make sure they are okay.",
      "Uncomfortable, but your response depends on who is in the room. If there is a senior leader present, the lateness feels more significant. If it is a peer group, less so.",
      "Not particularly bothered. They are here now. The group is here. The meeting can proceed.",
    ],
  },
  {
    q: "Your team meeting hits the scheduled end time, but the discussion is still actively unresolved. You want to:",
    options: [
      "Wrap up on time. If the topic needs more time, schedule a follow-up. Overrunning sets a bad precedent.",
      "Keep going. The discussion is alive and the team is engaged. The clock is less important than the conversation.",
      "Read the room. Is the senior person showing signs of needing to leave? Is the energy still strong? You would stay or go based on those signals.",
      "Let it run. The right time to end is when the group has reached a natural settling point, not when a clock says so.",
    ],
  },
  {
    q: "A cross-cultural colleague misses a project deadline by three days and does not mention it. When you follow up, they respond warmly and give you an update on the work. You:",
    options: [
      "Appreciate the update but feel the need to address the missed deadline directly. It affects other parts of the project and needs to be taken seriously.",
      "Focus on the relationship first. You are glad they responded. You ask about the work and gently mention the impact of the delay, but you do not lead with the failure.",
      "Calibrate your response based on the relationship and context. With a close colleague, you might be direct. In a formal or hierarchical setting, you would be more careful about how you raise it.",
      "Accept the update at face value. They are engaged with the work. You trust the process will complete.",
    ],
  },
  {
    q: "Your team always spends 10 to 15 minutes in informal conversation before getting to business. You feel this is:",
    options: [
      "Inefficient. You value relationships, but time is limited. This pattern eats into productive time every meeting.",
      "Essential. This is how the team actually bonds. The conversation before the meeting IS the meeting, in a way.",
      "Fine when the group is informal, but you would expect the team to move faster when a senior leader is present or when stakes are high.",
      "Natural. People need to arrive not just physically but relationally. The warm-up is part of how the group gathers itself.",
    ],
  },
  {
    q: "When you agree to meet with someone \"next week,\" you mean:",
    options: [
      "A specific day and time that will be confirmed in the next 24 hours.",
      "Sometime next week, with the exact time to emerge from the conversation closer to the moment.",
      "Whatever works for the more senior person or the one with the greater logistical constraints.",
      "The week is a general window. You will know the right moment when it arrives.",
    ],
  },
  {
    q: "You are deep in focused work when a colleague stops by your desk or calls you with a personal question unrelated to your current task. You:",
    options: [
      "Finish your thought, then give them limited time. You appreciate the connection, but you are in the middle of something.",
      "Set aside the task immediately. The person in front of you takes priority over the task in front of you.",
      "Respond based on who it is. For a senior colleague or a close relationship, you give full attention. For a more peripheral contact, you manage it quickly.",
      "Welcome the interruption. Relationships do not run on schedules. You will return to the task.",
    ],
  },
  {
    q: "A meeting is called for 9:00 am. You arrive at:",
    options: [
      "8:55 am. On time means a few minutes early so the meeting can start at exactly 9:00.",
      "9:00 to 9:10 am. You intend to be there at nine, but a few minutes' flexibility is normal.",
      "Whatever time signals the right level of respect for who called the meeting. Earlier for a senior leader. More flexible with peers.",
      "When you are ready and the group is gathering. You do not monitor the precise arrival time closely.",
    ],
  },
  {
    q: "A project deadline needs to move because a key partnership relationship needs more time to develop before a decision can be made. You feel:",
    options: [
      "Uncomfortable. Relationships are important, but the deadline exists for a reason. You would push to protect the timeline and address the relationship in parallel.",
      "Completely at ease. Relationships are the foundation of every project. Getting the relationship right will make the project work.",
      "Willing to adjust if the people involved agree and if the relationship dimension is genuinely critical. You assess case by case.",
      "Unsurprised. The right time for a decision is when the people are truly ready, not when a calendar said so.",
    ],
  },
  {
    q: "Your team leader rarely sends a specific agenda before meetings. You feel:",
    options: [
      "Frustrated. Preparation is part of respect. Without an agenda, your time is at risk.",
      "Fine with it. Agendas can constrain good conversation. You trust the meeting will go where it needs to go.",
      "Neutral, unless the meeting involves senior leadership. Then you expect more structure.",
      "Fine. Meetings are living things. The group will find its direction.",
    ],
  },
  {
    q: "After a long team meeting, an important decision still has not landed. You suggest:",
    options: [
      "Naming the decision clearly, going around the table for a final position from each person, and recording the outcome before anyone leaves.",
      "Letting the conversation keep moving. Forcing a decision before the room is ready will produce a weak one.",
      "Checking whether the senior person in the room wants to move toward a decision, and following their lead.",
      "Calling the group to pause and sense together whether the time is right. Some decisions need more communal settling before they are made.",
    ],
  },
];

// ─── Part 2 questions ─────────────────────────────────────────────────────────
const PART2_QUESTIONS = [
  {
    q: "Your colleague arrives 20 minutes late to a team meeting with no message. They probably:",
    options: [
      "Know they are late and feel some internal pressure about it, even if they do not show it outwardly.",
      "Did not experience the lateness as a significant event. Something came up, they are here now, and the meeting can continue.",
      "Are reading the room as they enter to understand how their arrival is being received before they respond.",
      "Simply arrived when they were ready. The meeting time was a general orientation, not a hard boundary.",
    ],
  },
  {
    q: "In the culture you work with, when a meeting runs over its scheduled time, people typically:",
    options: [
      "Feel internal pressure to wrap up. Someone will signal that time is up. Overrunning feels like a violation.",
      "Continue naturally. The conversation matters more than the schedule. Leaving mid-discussion would feel rude.",
      "Look to whoever is senior in the room. If that person shows no sign of ending, others will stay. If they move, the group moves.",
      "Follow the natural energy of the group. When the gathering feels complete, it ends.",
    ],
  },
  {
    q: "If a colleague from this culture misses a deadline and does not bring it up, it most likely means:",
    options: [
      "They feel some shame about it and are hoping it will not become a bigger issue.",
      "They do not register it as a 'miss' in the way you do. The work is still moving and the relationship is intact.",
      "They are waiting to see how important it is to you before deciding how much attention it deserves.",
      "Time-keeping around delivery was never their primary orientation for this piece of work.",
    ],
  },
  {
    q: "When your team from this culture spends extended time in informal conversation before business, it is because:",
    options: [
      "They are being social, but they probably also feel mild guilt about not getting started.",
      "The connection IS the work. Relational groundwork before the agenda is not optional for them.",
      "They are reading whether the context calls for formality or warmth, and adjusting accordingly.",
      "The group is gathering itself. Business begins when the presence feels right, not when a clock says so.",
    ],
  },
  {
    q: "In this culture, when someone agrees to meet \"next week,\" they mean:",
    options: [
      "A specific window that will be confirmed quickly. They have it loosely in mind already.",
      "Sometime next week, to be determined by what works relationally and logistically in the moment.",
      "Whatever is appropriate given who proposed the meeting and who holds the higher status.",
      "A general window. The specific moment will emerge when the time feels right for both parties.",
    ],
  },
  {
    q: "When a colleague from this culture stops what they are doing to give you time during an unexpected drop-by, this is most likely because:",
    options: [
      "They felt they could not say no, even if it cost them focus time.",
      "For them, the person present always takes priority over the task in progress. This is simply how they operate.",
      "They assessed the relationship and the context and concluded that giving you time was the appropriate response.",
      "Interruptions do not read as interruptions to them. Conversations flow. Tasks resume.",
    ],
  },
  {
    q: "When a colleague from this culture arrives at a meeting, they tend to arrive:",
    options: [
      "Close to or slightly before the agreed time. Punctuality matters to them.",
      "Somewhat flexibly. A few minutes late is not experienced as late.",
      "According to the formality of the occasion. High-stakes meeting: they are careful. Informal gathering: much more relaxed.",
      "When they are ready and when the group is forming. Clock time is a rough reference, not a commitment.",
    ],
  },
  {
    q: "If a project deadline moves because a key relationship needs more development time, your colleagues from this culture would:",
    options: [
      "Feel some discomfort. Deadlines are there for a reason, and they take that seriously even if they defer to others.",
      "Feel completely at ease. In their view, the relationship adjustment IS the right project management decision.",
      "Accept it if the senior person endorses the extension. Hierarchy mediates these decisions.",
      "Not be surprised. They expected the timeline to find its natural shape as the work developed.",
    ],
  },
  {
    q: "When your team leader from this culture sends no agenda before a meeting, it is probably because:",
    options: [
      "They forgot, or they prioritize execution over preparation. They may feel slightly uncomfortable if called out on it.",
      "They trust the conversation to find its direction. An agenda can feel like it pre-decides what matters.",
      "Agendas depend on the level of formality. They reserve them for high-stakes or formal settings.",
      "The meeting is a gathering, not a plan. What is needed will surface from the group.",
    ],
  },
  {
    q: "When an important decision has not landed after a long meeting, your colleagues from this culture tend to:",
    options: [
      "Feel some urgency to name it and close it. Leaving a decision unmade is uncomfortable.",
      "Let the conversation keep moving. Forcing a decision before the room is ready produces a weaker result.",
      "Look to the senior person for a signal. If they indicate it is time to decide, the group will move. If not, the group will wait.",
      "Sense together whether the time is right. Some decisions need more communal settling before they are made.",
    ],
  },
];

// ─── Result blocks ────────────────────────────────────────────────────────────
const RESULT_BLOCKS: Record<string, { label: string; body: string }> = {
  A: {
    label: "YOUR ORIENTATION — THE CLOCK KEEPER",
    body: "You see time as a resource. And you manage it accordingly.\n\nFor you, punctuality is not a personality quirk. It is a form of respect. When you commit to a time, you mean it. And when someone else does not, it registers immediately, not as a minor inconvenience but as a signal about how they regard the work and the people around them.\n\nYour strength here is real. Teams with Clock Keepers deliver. Deadlines hold. Meetings end. People know what to expect from you, and over time that builds a specific kind of trust: the trust of reliability.\n\nYour blind spot is this: you will sometimes read a cultural logic through your own framework and see a character problem that is not there. Someone who operates from a different time orientation is not necessarily disorganized, disrespectful, or unreliable. They may be operating from a logic that is as internally consistent as yours, just built around different priorities. The risk is writing off capable people before you understand what they are actually offering.",
  },
  B: {
    label: "YOUR ORIENTATION — THE RELATIONSHIP WEAVER",
    body: "For you, time belongs to the person in front of you.\n\nYou are not careless about time. You care deeply. But what you care about is the person, not the schedule. When a conversation needs to keep going, it keeps going. When someone needs you, you are present. The clock is a rough guide, not a governing authority.\n\nYour strength is the quality of relational trust you build. People feel genuinely seen by you. On your best days, you create the kind of depth in a team that no agenda can manufacture. That depth is what makes hard work sustainable.\n\nYour blind spot is the cost that your flexibility places on colleagues who planned around your committed times. The colleague who rearranged their afternoon to be ready for your 2:00 pm call and you arrived at 2:30 did not experience that as warmth. They experienced it as a broken promise. Over time, this pattern, even when it comes from genuine care, can erode the very trust you are trying to build.",
  },
  C: {
    label: "YOUR ORIENTATION — THE HARMONY FOLLOWER",
    body: "You read the room before you read the clock.\n\nYour relationship with time is fluid in a specific way: it shifts based on context, relationship, and hierarchy. With a senior leader or in a high-stakes setting, you are likely to be punctual and structured. With peers or in informal settings, you allow more flow.\n\nYour strength is a social intelligence that most Clock Keepers and Relationship Weavers do not fully have. You can move between registers. You adapt. You are not locked into one mode, which makes you genuinely versatile in complex team environments.\n\nYour blind spot is that neither Clock Keepers nor Relationship Weavers can fully read your logic. Clock Keepers see inconsistency. Relationship Weavers sometimes feel you are not fully available. The unspoken rules you navigate so naturally need to be named more often than feels comfortable, because your teammates cannot see the map you are using.",
  },
  D: {
    label: "YOUR ORIENTATION — THE COMMUNITY KEEPER",
    body: "For you, time is constituted by the people, not the calendar.\n\nYou carry a deep sense that the right time for something is when the people are truly gathered, not just physically present but relationally ready. Community presence is not preparation for the event. It is the event.\n\nYour strength is something most organizational teams desperately lack: a sense of shared presence. You are not transactional about time. You bring people into the moment rather than driving them through an agenda.\n\nYour blind spot, and this is worth naming honestly, is that most organizational systems are designed around monochronic assumptions. The logistical gaps this creates are real. Missed delivery windows, unclear timelines, and decisions deferred without explanation can undermine the relational trust you are trying to build. The work here is not to abandon your logic. It is to translate it, deliberately, for colleagues whose systems depend on knowing what is coming and when.",
  },
};

// ─── Placeholder transition texts ─────────────────────────────────────────────
const PART1_TRANSITIONS: Record<string, string> = {
  A: "Your answers point consistently toward structure, punctuality, and clear commitments. In this module, we call your type the Clock Keeper.",
  B: "Your answers point consistently toward people, presence, and relational warmth. In this module, we call your type the Relationship Weaver.",
  C: "Your answers point consistently toward reading context before reading the clock. In this module, we call your type the Harmony Follower.",
  D: "Your answers point consistently toward communal readiness over calendar time. In this module, we call your type the Community Keeper.",
};

const PART2_TRANSITIONS: Record<string, string> = {
  A: "The culture you work with appears to lean toward structure, punctuality, and clear commitments. In this module we call this the Clock Keeper.",
  B: "The culture you work with appears to lean toward people, presence, and relational warmth. In this module we call this the Relationship Weaver.",
  C: "The culture you work with appears to lean toward reading context before reading the clock. In this module we call this the Harmony Follower.",
  D: "The culture you work with appears to lean toward communal readiness over calendar time. In this module we call this the Community Keeper.",
};

const PART1_TYPE_NAMES: Record<string, string> = {
  A: "You are a Clock Keeper.",
  B: "You are a Relationship Weaver.",
  C: "You are a Harmony Follower.",
  D: "You are a Community Keeper.",
};

const PART2_TYPE_NAMES: Record<string, string> = {
  A: "The culture you work with leans Clock Keeper.",
  B: "The culture you work with leans Relationship Weaver.",
  C: "The culture you work with leans Harmony Follower.",
  D: "The culture you work with leans Community Keeper.",
};

// ─── Gap blocks ───────────────────────────────────────────────────────────────
const GAP_BLOCKS: Record<string, { title: string; body: string }> = {
  "A-B": {
    title: "Clock Keeper meets Relationship Weaver",
    body: "Your most natural instinct is to hold the line on agreed times. The culture you work with most treats time as relational and fluid.\n\nThis is one of the most common friction points in cross-cultural teams. It shows up in missed deadlines, overrun meetings, and a growing sense that one side 'just doesn't get it.' The Clock Keeper eventually labels the Relationship Weaver as unprofessional. The Relationship Weaver eventually labels the Clock Keeper as cold.\n\nOne thing you can do: Before the next meeting or deadline, name the gap explicitly and briefly. Not as a correction, but as a question: 'In our team, I notice we have different rhythms around time. Can we spend five minutes agreeing on what a deadline means to all of us, and what we do when it needs to move?' That conversation, done once, changes the dynamic for months.",
  },
  "A-C": {
    title: "Clock Keeper meets Harmony Follower",
    body: "You prioritize structure and predictability. The culture you work with reads the room and adjusts accordingly, which looks inconsistent to you.\n\nThe Harmony Follower is not being unpredictable for its own sake. They are reading context. The problem is that their contextual logic is invisible to you. You see someone who is punctual for some meetings and not others, formal sometimes and informal others, and you cannot find the pattern.\n\nOne thing you can do: Ask. Directly and without critique: 'I notice our team tends to operate differently depending on the setting. What signals tell you when we are in structured mode versus flexible mode?' You will get an answer that unlocks months of unspoken confusion.",
  },
  "A-D": {
    title: "Clock Keeper meets Community Keeper",
    body: "You orient around schedules, specific times, and deliverable windows. The culture you work with orients around communal readiness, and 'when the people are gathered' is a legitimate answer to 'when does this start?'\n\nThis is the widest logic gap in most organizational teams, and it is where the harshest cultural judgments tend to form. The Clock Keeper reads Community Keeper logic as chronic unreliability. The Community Keeper reads Clock Keeper urgency as impersonal and trust-breaking.\n\nOne thing you can do: Build in communal gathering time before you expect anything deliverable. If your 9:00 am meeting actually needs to produce a decision by 9:45, account for 20 minutes of genuine gathering before the agenda begins. Name it as intentional, not wasted. Watch what changes in the quality of what the group produces.",
  },
  "B-C": {
    title: "Relationship Weaver meets Harmony Follower",
    body: "You prioritize people over schedules and expect relational warmth to govern how time is used. The culture you work with adjusts based on who is in the room and what the hierarchy demands.\n\nThe Harmony Follower's variability can feel like inconsistency to a Relationship Weaver. 'Why are you warm with some people and formal with others? Are you not being authentic?' But the Harmony Follower is not performing. They are reading context, and in their logic, that is the most relationally intelligent thing you can do.\n\nOne thing you can do: Before high-stakes meetings, check in with your Harmony Follower colleague about what mode the meeting calls for. Not 'how do you want to act' but 'who will be in the room, and what do you think the right register is?' You will both arrive better prepared, and they will feel respected rather than managed.",
  },
  "B-D": {
    title: "Relationship Weaver meets Community Keeper",
    body: "Both of you prioritize people over clocks, but you do it differently. The Relationship Weaver orients time around the person in front of them. The Community Keeper orients time around the whole gathered community.\n\nThis gap is often the least visible, because both sides feel aligned. But friction emerges when the Relationship Weaver treats a one-on-one relationship as the primary unit, and the Community Keeper expects wider community consensus before things can move. What feels like relationship-building to you may feel like bypassing the group to them.\n\nOne thing you can do: When moving toward a decision, ask: 'Who else needs to be part of this conversation before we can commit?' Not as a delay tactic, but as a genuine question about whose presence makes the decision real.",
  },
  "C-D": {
    title: "Harmony Follower meets Community Keeper",
    body: "You read hierarchy and context to determine how time is used. The culture you work with reads communal readiness. These two logics can align, but they can also produce significant confusion about who is setting the pace and why.\n\nThe Community Keeper is not waiting for a senior signal. They are waiting for a communal one. The Harmony Follower expects hierarchy to calibrate the room. When that calibration is not happening, both sides end up waiting for the other.\n\nOne thing you can do: Name the decision-making unit explicitly. 'In our team, who needs to be present before we can move forward on this?' Get the answer on the table. In some cultures that answer is the leader. In others it is the whole group. Making it explicit removes weeks of unspoken waiting.",
  },
};

// ─── Type name helper ─────────────────────────────────────────────────────────
const TYPE_SHORT: Record<string, string> = {
  A: "Clock Keeper",
  B: "Relationship Weaver",
  C: "Harmony Follower",
  D: "Community Keeper",
};

// ─── Scoring helper ───────────────────────────────────────────────────────────
function getDominantOrientation(answers: Record<number, string>): string {
  const counts = { A: 0, B: 0, C: 0, D: 0 };
  Object.values(answers).forEach((v) => {
    if (v in counts) counts[v as keyof typeof counts]++;
  });
  return Object.entries(counts).sort((a, b) => b[1] - a[1])[0][0];
}

function getGapKey(o1: string, o2: string): string {
  const sorted = [o1, o2].sort();
  return `${sorted[0]}-${sorted[1]}`;
}

// ─── Sub-components ───────────────────────────────────────────────────────────

function ElapsedTimer() {
  const [seconds, setSeconds] = useState(0);
  useEffect(() => {
    const interval = setInterval(() => setSeconds((s) => s + 1), 1000);
    return () => clearInterval(interval);
  }, []);
  const mm = Math.floor(seconds / 60).toString().padStart(2, "0");
  const ss = (seconds % 60).toString().padStart(2, "0");
  return (
    <div style={{ textAlign: "center", margin: "32px 0" }}>
      <p style={{ fontFamily: "'Montserrat', sans-serif", fontSize: 13, fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", color: BODY_TEXT, marginBottom: 8 }}>
        Time spent in this module so far
      </p>
      <p style={{ fontFamily: "'Montserrat', sans-serif", fontSize: 36, fontWeight: 800, color: ORANGE, margin: 0, letterSpacing: "0.04em" }}>
        {mm}:{ss}
      </p>
    </div>
  );
}

function ConceptCard({ card, expanded, onToggle }: { card: typeof CONCEPT_CARDS[0]; expanded: boolean; onToggle: () => void }) {
  return (
    <div
      style={{
        background: NAVY,
        border: "1px solid oklch(35% 0.10 260)",
        borderRadius: 12,
        padding: "1.5rem",
        cursor: "pointer",
        transition: "box-shadow 0.2s",
        alignSelf: "start",
        minHeight: 185,
      }}
      onClick={onToggle}
    >
      <p style={{ fontFamily: "'Montserrat', sans-serif", fontSize: 20, fontWeight: 800, color: ORANGE, margin: "0 0 6px" }}>
        {card.name}
      </p>
      {expanded && (
        <p style={{ fontFamily: "'Montserrat', sans-serif", fontSize: 13, color: "oklch(65% 0.15 45)", fontStyle: "italic", margin: "0 0 12px" }}>
          {card.term}
        </p>
      )}
      <p style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 18, fontStyle: "italic", color: OFF_WHITE, margin: "0 0 12px", lineHeight: 1.5 }}>
        {card.belief}
      </p>
      {expanded && (
        <>
          <ul style={{ margin: "0 0 16px", paddingLeft: "1.25rem" }}>
            {card.bullets.map((b, i) => (
              <li key={i} style={{ fontFamily: "'Montserrat', sans-serif", fontSize: 15, color: "oklch(80% 0.04 260)", lineHeight: 1.75, marginBottom: 6 }}>
                {b}
              </li>
            ))}
          </ul>
          <div style={{ background: "oklch(16% 0.08 260)", borderRadius: 8, padding: "12px 16px" }}>
            <p style={{ fontFamily: "'Montserrat', sans-serif", fontSize: 12, fontWeight: 700, color: ORANGE, textTransform: "uppercase", letterSpacing: "0.1em", margin: "0 0 6px" }}>
              Blind Spot
            </p>
            <p style={{ fontFamily: "'Montserrat', sans-serif", fontSize: 14, color: "oklch(75% 0.04 260)", lineHeight: 1.75, margin: 0, fontStyle: "italic" }}>
              {card.blindspot}
            </p>
          </div>
        </>
      )}
      <p style={{ fontFamily: "'Montserrat', sans-serif", fontSize: 12, color: ORANGE, margin: "12px 0 0", fontWeight: 600 }}>
        {expanded ? "Show less ↑" : "Show more ↓"}
      </p>
    </div>
  );
}

function ScenarioCard({ card }: { card: typeof SCENARIO_CARDS[0] }) {
  const [revealed, setRevealed] = useState(false);
  return (
    <div style={{ background: OFF_WHITE, borderLeft: `3px solid ${ORANGE}`, borderRadius: "0 8px 8px 0", marginBottom: 24 }}>
      <div style={{ padding: "1.5rem 1.75rem" }}>
        <p style={{ fontFamily: "'Montserrat', sans-serif", fontSize: 17, fontWeight: 800, color: NAVY, margin: "0 0 12px" }}>
          {card.title}
        </p>
        {card.situation.split("\n\n").map((para, i) => (
          <p key={i} style={{ fontFamily: "'Montserrat', sans-serif", fontSize: 15, color: BODY_TEXT, lineHeight: 1.8, marginBottom: 10 }}>
            {para}
          </p>
        ))}
        <p style={{ fontFamily: "'Montserrat', sans-serif", fontSize: 15, color: ORANGE, fontStyle: "italic", fontWeight: 600, margin: "16px 0" }}>
          {card.question}
        </p>
        <button
          onClick={() => setRevealed((v) => !v)}
          style={{
            fontFamily: "'Montserrat', sans-serif",
            fontSize: 14,
            fontWeight: 700,
            color: NAVY,
            background: "none",
            border: `1px solid ${NAVY}`,
            padding: "8px 18px",
            borderRadius: 6,
            cursor: "pointer",
          }}
        >
          {revealed ? "Hide explanation ↑" : "See what's happening →"}
        </button>
      </div>
      {revealed && (
        <div style={{ background: LIGHT_GRAY, padding: "1.25rem 1.75rem", borderTop: `1px solid oklch(90% 0.008 80)` }}>
          {card.reveal.split("\n\n").map((para, i) => (
            <p key={i} style={{ fontFamily: "'Montserrat', sans-serif", fontSize: 15, color: BODY_TEXT, lineHeight: 1.8, marginBottom: 10, margin: i === 0 ? "0 0 10px" : "10px 0" }}>
              {para}
            </p>
          ))}
        </div>
      )}
    </div>
  );
}

function TeamExercise() {
  const questions = [
    {
      q: "When we set a meeting time, what does that time actually mean?",
      note: "Listen for the gap between what people say and what you have observed. Some will say 'it means start time' while having a track record of arriving ten minutes late. Some will say 'it is flexible' while feeling genuinely frustrated when others do not arrive on time. The question surfaces the gap between stated norms and lived practice. Do not correct anyone. Just notice what comes up and say: 'Interesting. We seem to have a few different readings of this.'",
    },
    {
      q: "When a deadline moves, what is the first thing you feel?",
      note: "Clock Keepers will tend toward frustration or concern. Relationship Weavers will tend toward pragmatism or even relief if it means more relational groundwork is possible. Community Keepers may be genuinely neutral. The answers reveal orientation without anyone needing to label themselves. If you get a range of responses, name it: 'It sounds like we feel this differently. That is worth knowing.'",
    },
    {
      q: "Think of a time when a colleague's use of time confused or frustrated you. What did you make of it at the time?",
      note: "This question surfaces the interpretive step: what people conclude about another person based on their time behavior. Clock Keepers typically conclude something about character or professionalism. Relationship Weavers conclude something about priorities. The value of the question is not in the story the person shares but in the conclusion they drew. After a few responses, you can say: 'What if that behavior made perfect sense inside a different time logic? What would change about how we are reading it?'",
    },
  ];
  const [openNote, setOpenNote] = useState<number | null>(null);

  return (
    <div style={{ background: LIGHT_GRAY, borderTop: `3px solid ${NAVY}`, borderRadius: "0 0 12px 12px", padding: "2rem" }}>
      <p style={{ fontFamily: "'Montserrat', sans-serif", fontSize: 11, fontWeight: 700, letterSpacing: "0.14em", textTransform: "uppercase", color: ORANGE, marginBottom: 8 }}>
        Team Exercise
      </p>
      <h3 style={{ fontFamily: "'Montserrat', sans-serif", fontSize: 20, fontWeight: 800, color: NAVY, margin: "0 0 8px" }}>
        Three Questions Your Team Has Never Asked About Time
      </h3>
      <p style={{ fontFamily: "'Montserrat', sans-serif", fontSize: 14, color: BODY_TEXT, lineHeight: 1.75, marginBottom: 24 }}>
        Format: 10 to 15 minutes at the start or end of a team meeting. How to introduce it: "Before we close today, I want to try something short. Three quick questions about how we experience time as a team. No right answers. I am just curious what we each think."
      </p>
      <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
        {questions.map((item, i) => (
          <div key={i} style={{ background: OFF_WHITE, borderRadius: 8, padding: "1rem 1.25rem" }}>
            <p style={{ fontFamily: "'Montserrat', sans-serif", fontSize: 15, fontWeight: 700, color: NAVY, margin: "0 0 8px" }}>
              {i + 1}. {item.q}
            </p>
            <button
              onClick={() => setOpenNote(openNote === i ? null : i)}
              style={{ fontFamily: "'Montserrat', sans-serif", fontSize: 12, color: ORANGE, fontWeight: 700, background: "none", border: "none", cursor: "pointer", padding: 0 }}
            >
              {openNote === i ? "Hide facilitation note ↑" : "Facilitation note ↓"}
            </button>
            {openNote === i && (
              <p style={{ fontFamily: "'Montserrat', sans-serif", fontSize: 13, color: BODY_TEXT, lineHeight: 1.75, margin: "10px 0 0", fontStyle: "italic" }}>
                {item.note}
              </p>
            )}
          </div>
        ))}
      </div>
      <p style={{ fontFamily: "'Montserrat', sans-serif", fontSize: 14, color: BODY_TEXT, lineHeight: 1.75, marginTop: 20, fontStyle: "italic" }}>
        After the three questions (optional closing line): "This is something called time orientation. I am going to learn more about it. If you want to explore it together, I will bring it to a future meeting. But at least now we know this is a real thing we experience differently." That is enough. You have opened the door.
      </p>
    </div>
  );
}

// ─── One-at-a-time quiz component ─────────────────────────────────────────────
function OneAtATimeQuiz({
  questions,
  answers,
  onAnswer,
  onComplete,
  partLabel,
  partSubtext,
  bgColor,
  accentColor,
}: {
  questions: typeof PART1_QUESTIONS;
  answers: Record<number, string>;
  onAnswer: (qIdx: number, val: string) => void;
  onComplete: () => void;
  partLabel: string;
  partSubtext: string;
  bgColor: string;
  accentColor: string;
}) {
  const [currentQ, setCurrentQ] = useState(0);
  const [animClass, setAnimClass] = useState<string>("");
  const [displayed, setDisplayed] = useState(0);
  const keys = ["A", "B", "C", "D"];
  const autoCompleted = useRef(false);
  const allAnswered = Object.keys(answers).length === questions.length;

  useEffect(() => {
    if (allAnswered && !autoCompleted.current) {
      autoCompleted.current = true;
      const t = setTimeout(onComplete, 80);
      return () => clearTimeout(t);
    }
  }, [allAnswered, onComplete]);

  function navigate(targetQ: number, dir: "right" | "left") {
    const cls = dir === "right" ? "slide-in-right" : "slide-in-left";
    setAnimClass("");
    setTimeout(() => {
      setDisplayed(targetQ);
      setCurrentQ(targetQ);
      setAnimClass(cls);
    }, 10);
  }

  function handleSelect(val: string) {
    onAnswer(displayed, val);
    if (displayed < questions.length - 1) {
      navigate(displayed + 1, "right");
    }
  }

  function handleBack() {
    if (displayed > 0) {
      navigate(displayed - 1, "left");
    }
  }

  const progress = Math.round(((displayed + 1) / questions.length) * 100);

  return (
    <div style={{ background: bgColor, paddingBottom: 48 }}>
      {/* Header */}
      <div style={{ maxWidth: 780, margin: "0 auto", padding: "48px 24px 32px" }}>
        <p style={{ fontFamily: "'Montserrat', sans-serif", fontSize: 22, fontWeight: 800, color: OFF_WHITE, margin: "0 0 10px" }}>
          {partLabel}
        </p>
        <p style={{ fontFamily: "'Montserrat', sans-serif", fontSize: 15, color: "oklch(72% 0.04 260)", lineHeight: 1.65, margin: 0 }}>
          {partSubtext}
        </p>
      </div>

      {/* Progress bar */}
      <div style={{ maxWidth: 780, margin: "0 auto", padding: "0 24px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
          <span style={{ fontFamily: "'Montserrat', sans-serif", fontSize: 12, color: "oklch(65% 0.04 260)", fontWeight: 600 }}>
            Question {displayed + 1} of {questions.length}
          </span>
          <span style={{ fontFamily: "'Montserrat', sans-serif", fontSize: 12, color: accentColor, fontWeight: 700 }}>
            {Object.keys(answers).length} answered
          </span>
        </div>
        <div style={{ height: 3, background: "oklch(30% 0.06 260)", borderRadius: 2 }}>
          <div style={{ height: "100%", width: `${progress}%`, background: accentColor, borderRadius: 2, transition: "width 0.3s" }} />
        </div>
      </div>

      {/* Question slide area */}
      <div style={{ maxWidth: 780, margin: "0 auto", padding: "28px 24px 0", overflow: "hidden" }}>
        <div className={animClass} key={displayed}>
          <p style={{ fontFamily: "'Montserrat', sans-serif", fontSize: 16, fontWeight: 600, color: OFF_WHITE, lineHeight: 1.6, margin: "0 0 20px" }}>
            {questions[displayed].q}
          </p>
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {questions[displayed].options.map((opt, i) => {
              const key = keys[i];
              const isSelected = answers[displayed] === key;
              return (
                <button
                  key={key}
                  onClick={() => handleSelect(key)}
                  style={{
                    fontFamily: "'Montserrat', sans-serif",
                    fontSize: 14,
                    color: isSelected ? OFF_WHITE : "oklch(75% 0.04 260)",
                    background: isSelected ? "oklch(35% 0.12 45)" : "oklch(28% 0.07 260)",
                    border: isSelected ? `1.5px solid ${accentColor}` : "1.5px solid oklch(35% 0.07 260)",
                    borderRadius: 8,
                    padding: "14px 18px",
                    textAlign: "left",
                    cursor: "pointer",
                    lineHeight: 1.65,
                    transition: "all 0.15s",
                  }}
                >
                  <span style={{ fontWeight: 700, color: accentColor, marginRight: 10 }}>{key}.</span>
                  {opt}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Navigation row */}
      {!allAnswered && displayed > 0 && (
        <div style={{ maxWidth: 780, margin: "0 auto", padding: "20px 24px 48px" }}>
          <button
            onClick={handleBack}
            style={{
              fontFamily: "'Montserrat', sans-serif",
              fontSize: 14,
              fontWeight: 600,
              color: "oklch(70% 0.04 260)",
              background: "none",
              border: "1px solid oklch(38% 0.06 260)",
              padding: "10px 18px",
              borderRadius: 6,
              cursor: "pointer",
            }}
          >
            ← Back
          </button>
        </div>
      )}
    </div>
  );
}

// ─── Main component ───────────────────────────────────────────────────────────
type Props = { isSaved: boolean };

export default function TimeAndCultureClient({ isSaved: initialSaved }: Props) {
  const [saved, setSaved] = useState(initialSaved);
  const [isPending, startTransition] = useTransition();

  // Assessment state
  type QuizPhase = "part1" | "part1-result" | "part2" | "part2-result";
  const [quizPhase, setQuizPhase] = useState<QuizPhase>("part1");
  const [part1Answers, setPart1Answers] = useState<Record<number, string>>({});
  const [part2Answers, setPart2Answers] = useState<Record<number, string>>({});
  const [showPart1Detail, setShowPart1Detail] = useState(false);
  const [showPart2Detail, setShowPart2Detail] = useState(false);
  const [expandedCard, setExpandedCard] = useState<number | null>(null);

  function handleSave() {
    if (saved) return;
    startTransition(async () => {
      await saveResourceToDashboard("time-and-culture");
      setSaved(true);
    });
  }

  const part1Dominant = Object.keys(part1Answers).length === PART1_QUESTIONS.length ? getDominantOrientation(part1Answers) : null;
  const part2Dominant = Object.keys(part2Answers).length === PART2_QUESTIONS.length ? getDominantOrientation(part2Answers) : null;
  const gapKey = part1Dominant && part2Dominant ? getGapKey(part1Dominant, part2Dominant) : null;
  const isMatched = part1Dominant === part2Dominant;

  return (
    <div style={{ fontFamily: "'Montserrat', sans-serif", background: OFF_WHITE, minHeight: "100vh" }}>
      <style>{`
        .concept-card-grid { grid-template-columns: repeat(2, 1fr); }
        @media (max-width: 640px) { .concept-card-grid { grid-template-columns: 1fr; } }
        @keyframes slideInRight { from { transform: translateX(32px); opacity: 0; } to { transform: translateX(0); opacity: 1; } }
        @keyframes slideInLeft { from { transform: translateX(-32px); opacity: 0; } to { transform: translateX(0); opacity: 1; } }
        .slide-in-right { animation: slideInRight 0.22s ease-out; }
        .slide-in-left { animation: slideInLeft 0.22s ease-out; }
      `}</style>

      {/* ─── HERO ─────────────────────────────────────────────────────────── */}
      <div style={{ background: NAVY, padding: "clamp(64px, 8vw, 96px) 24px clamp(56px, 7vw, 80px)", position: "relative", overflow: "hidden" }}>
        <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 4, background: ORANGE }} />
        <div aria-hidden style={{ position: "absolute", inset: 0, backgroundImage: `radial-gradient(circle at 75% 50%, oklch(30% 0.12 260) 0%, transparent 60%)`, opacity: 0.5 }} />
        <div style={{ position: "relative", maxWidth: 780, margin: "0 auto" }}>
          <p style={{ fontFamily: "'Montserrat', sans-serif", fontSize: 11, fontWeight: 700, letterSpacing: "0.14em", textTransform: "uppercase", color: ORANGE, marginBottom: 16 }}>
            Cross-Cultural Module
          </p>
          <h1 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "clamp(40px, 6vw, 72px)", fontWeight: 600, color: OFF_WHITE, margin: "0 0 20px", lineHeight: 1.08 }}>
            Your Time Is Not My Time
          </h1>
          <p style={{ fontFamily: "'Montserrat', sans-serif", fontSize: "clamp(16px, 2vw, 18px)", color: "oklch(75% 0.04 260)", maxWidth: 560, margin: "0 0 28px", lineHeight: 1.65 }}>
            Every culture has a relationship with time that feels completely obvious from the inside. That relationship shapes how meetings run, how deadlines are understood, and how trust is built or broken across a team. This module gives you the language to see what's happening — in yourself and in the cultures you work across.
          </p>
          <div style={{ display: "flex", gap: 12, alignItems: "center", flexWrap: "wrap", marginBottom: 8 }}>
            <span style={{ background: "oklch(30% 0.10 260)", color: "oklch(75% 0.04 260)", fontFamily: "'Montserrat', sans-serif", fontSize: 12, fontWeight: 600, padding: "6px 14px", borderRadius: 20 }}>
              20 min
            </span>
            <button
              onClick={handleSave}
              disabled={saved || isPending}
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 8,
                background: saved ? "oklch(35% 0.08 260)" : "transparent",
                color: "oklch(75% 0.04 260)",
                padding: "10px 22px",
                borderRadius: 6,
                fontWeight: 600,
                fontSize: 13,
                border: "1px solid oklch(42% 0.08 260)",
                cursor: saved ? "default" : "pointer",
                fontFamily: "'Montserrat', sans-serif",
              }}
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill={saved ? "currentColor" : "none"} stroke="currentColor" strokeWidth="2">
                <path d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
              </svg>
              {saved ? "✓ Saved to Dashboard" : isPending ? "Saving…" : "Save to Dashboard"}
            </button>
          </div>
        </div>
      </div>

      {/* ─── INTRODUCTION ─────────────────────────────────────────────────── */}
      <div style={{ maxWidth: 780, margin: "0 auto", padding: "64px 24px 0" }}>
        <p style={{ fontFamily: "'Montserrat', sans-serif", fontSize: 16, color: BODY_TEXT, lineHeight: 1.85, marginBottom: 32 }}>
          Most people move through their teams, partnerships, and workdays operating on a set of assumptions about time that feel so obvious — so self-evident — that they have never once considered those assumptions might be cultural. This module changes that. You will discover your own time orientation, learn the four logics that researchers have mapped across cultures, and then compare your result with how the culture you work with most closely experiences time.
        </p>

        {/* Learning Outcomes */}
        <div style={{ display: "flex", flexDirection: "column", gap: 8, marginBottom: 48, background: LIGHT_GRAY, borderRadius: 10, padding: "1.5rem 1.75rem" }}>
          <p style={{ fontFamily: "'Montserrat', sans-serif", fontSize: 13, fontWeight: 700, color: NAVY, margin: "0 0 12px" }}>
            After this module you will:
          </p>
          {[
            "Recognize your own time orientation before encountering the full framework.",
            "Identify the four cultural viewpoints on time and their academic roots.",
            "Shift from assuming one right view of time to holding multiple views with understanding.",
          ].map((item, i) => (
            <div key={i} style={{ display: "flex", gap: 12, alignItems: "flex-start" }}>
              <div style={{ width: 3, height: 18, background: ORANGE, flexShrink: 0, marginTop: 4 }} />
              <p style={{ fontFamily: "'Montserrat', sans-serif", fontSize: 14, color: BODY_TEXT, lineHeight: 1.7, margin: 0 }}>
                {item}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* ─── UNIFIED QUIZ ARENA ───────────────────────────────────────────── */}
      <div style={{ background: NAVY }}>
        {quizPhase === "part1" && (
          <OneAtATimeQuiz
            questions={PART1_QUESTIONS}
            answers={part1Answers}
            onAnswer={(qIdx, val) => setPart1Answers((prev) => ({ ...prev, [qIdx]: val }))}
            onComplete={() => setQuizPhase("part1-result")}
            partLabel="How do YOU see time?"
            partSubtext="Read each scenario. Choose the response that feels most natural to you — not the 'right' answer. Not what you think a good leader would do. What you actually feel."
            bgColor={NAVY}
            accentColor={ORANGE}
          />
        )}

        {quizPhase === "part1-result" && part1Dominant && (
          <div style={{ padding: "48px 24px" }}>
            <div style={{ maxWidth: 780, margin: "0 auto" }}>
              <div style={{ background: "oklch(28% 0.10 260)", borderRadius: 12, padding: "2.5rem", borderTop: `4px solid ${ORANGE}`, marginBottom: 32 }}>
                <p style={{ fontFamily: "'Montserrat', sans-serif", fontSize: 11, fontWeight: 700, letterSpacing: "0.14em", textTransform: "uppercase", color: ORANGE, marginBottom: 16 }}>
                  Your Result — Part 1
                </p>
                <h2 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "clamp(28px, 4vw, 44px)", fontWeight: 600, color: OFF_WHITE, margin: "0 0 16px", lineHeight: 1.15 }}>
                  {PART1_TYPE_NAMES[part1Dominant]}
                </h2>
                <p style={{ fontFamily: "'Montserrat', sans-serif", fontSize: 15, color: "oklch(75% 0.04 260)", lineHeight: 1.75, margin: "0 0 20px" }}>
                  {PART1_TRANSITIONS[part1Dominant]}
                </p>
                <button
                  onClick={() => setShowPart1Detail((v) => !v)}
                  style={{ fontFamily: "'Montserrat', sans-serif", fontSize: 13, fontWeight: 700, color: ORANGE, background: "none", border: `1px solid oklch(45% 0.10 45)`, padding: "8px 16px", borderRadius: 6, cursor: "pointer" }}
                >
                  {showPart1Detail ? "▲ Less detail" : "▼ Read more about your orientation"}
                </button>
                {showPart1Detail && (
                  <div style={{ marginTop: 20, borderTop: "1px solid oklch(35% 0.08 260)", paddingTop: 20 }}>
                    <p style={{ fontFamily: "'Montserrat', sans-serif", fontSize: 12, fontWeight: 700, color: ORANGE, textTransform: "uppercase", letterSpacing: "0.12em", marginBottom: 12 }}>
                      {RESULT_BLOCKS[part1Dominant].label}
                    </p>
                    {RESULT_BLOCKS[part1Dominant].body.split("\n\n").map((para, i) => (
                      <p key={i} style={{ fontFamily: "'Montserrat', sans-serif", fontSize: 14, color: "oklch(78% 0.04 260)", lineHeight: 1.8, marginBottom: 12 }}>
                        {para}
                      </p>
                    ))}
                  </div>
                )}
              </div>
              <div style={{ textAlign: "center", paddingBottom: 8 }}>
                <p style={{ fontFamily: "'Montserrat', sans-serif", fontSize: 16, fontWeight: 700, color: ORANGE, marginBottom: 20 }}>
                  Now — what about the culture you work with?
                </p>
                <button
                  onClick={() => setQuizPhase("part2")}
                  style={{ fontFamily: "'Montserrat', sans-serif", fontSize: 15, fontWeight: 700, color: OFF_WHITE, background: ORANGE, border: "none", padding: "14px 36px", borderRadius: 8, cursor: "pointer" }}
                >
                  Test Part 2 →
                </button>
              </div>
            </div>
          </div>
        )}

        {quizPhase === "part2" && (
          <OneAtATimeQuiz
            questions={PART2_QUESTIONS}
            answers={part2Answers}
            onAnswer={(qIdx, val) => setPart2Answers((prev) => ({ ...prev, [qIdx]: val }))}
            onComplete={() => setQuizPhase("part2-result")}
            partLabel="How does the culture you work with see time?"
            partSubtext="Think of the culture of the team you work with most, or the colleague whose approach to time confuses or frustrates you most. Answer as you observe them — not as you wish they would behave."
            bgColor={NAVY}
            accentColor={ORANGE}
          />
        )}

        {quizPhase === "part2-result" && part2Dominant && part1Dominant && (
          <div style={{ padding: "48px 24px" }}>
            <div style={{ maxWidth: 780, margin: "0 auto", display: "flex", flexDirection: "column", gap: 24 }}>
              <div style={{ background: "oklch(28% 0.10 260)", borderRadius: 12, padding: "2.5rem", borderTop: `4px solid ${ORANGE}` }}>
                <p style={{ fontFamily: "'Montserrat', sans-serif", fontSize: 11, fontWeight: 700, letterSpacing: "0.14em", textTransform: "uppercase", color: ORANGE, marginBottom: 16 }}>
                  Your Result — Part 2
                </p>
                <h2 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "clamp(28px, 4vw, 44px)", fontWeight: 600, color: OFF_WHITE, margin: "0 0 16px", lineHeight: 1.15 }}>
                  {PART2_TYPE_NAMES[part2Dominant]}
                </h2>
                <p style={{ fontFamily: "'Montserrat', sans-serif", fontSize: 15, color: "oklch(75% 0.04 260)", lineHeight: 1.75, margin: "0 0 20px" }}>
                  {PART2_TRANSITIONS[part2Dominant]}
                </p>
                <button
                  onClick={() => setShowPart2Detail((v) => !v)}
                  style={{ fontFamily: "'Montserrat', sans-serif", fontSize: 13, fontWeight: 700, color: ORANGE, background: "none", border: `1px solid oklch(45% 0.10 45)`, padding: "8px 16px", borderRadius: 6, cursor: "pointer" }}
                >
                  {showPart2Detail ? "▲ Less detail" : "▼ Read more about this orientation"}
                </button>
                {showPart2Detail && (
                  <div style={{ marginTop: 20, borderTop: "1px solid oklch(35% 0.08 260)", paddingTop: 20 }}>
                    <p style={{ fontFamily: "'Montserrat', sans-serif", fontSize: 12, fontWeight: 700, color: ORANGE, textTransform: "uppercase", letterSpacing: "0.12em", marginBottom: 12 }}>
                      {RESULT_BLOCKS[part2Dominant].label}
                    </p>
                    {RESULT_BLOCKS[part2Dominant].body.split("\n\n").map((para, i) => (
                      <p key={i} style={{ fontFamily: "'Montserrat', sans-serif", fontSize: 14, color: "oklch(78% 0.04 260)", lineHeight: 1.8, marginBottom: 12 }}>
                        {para}
                      </p>
                    ))}
                  </div>
                )}
              </div>

              <div style={{ background: "oklch(28% 0.10 260)", borderRadius: 12, padding: "2.5rem", borderTop: `4px solid ${ORANGE}` }}>
                <p style={{ fontFamily: "'Montserrat', sans-serif", fontSize: 11, fontWeight: 700, letterSpacing: "0.14em", textTransform: "uppercase", color: ORANGE, marginBottom: 16 }}>
                  Gap Analysis — Part 1 vs Part 2
                </p>
                <div style={{ display: "flex", gap: 10, alignItems: "center", flexWrap: "wrap", marginBottom: 24 }}>
                  <span style={{ fontFamily: "'Montserrat', sans-serif", fontSize: 13, fontWeight: 700, color: OFF_WHITE, background: ORANGE, padding: "5px 14px", borderRadius: 20 }}>
                    You: {TYPE_SHORT[part1Dominant]}
                  </span>
                  <span style={{ color: "oklch(55% 0.04 260)", fontSize: 20 }}>↔</span>
                  <span style={{ fontFamily: "'Montserrat', sans-serif", fontSize: 13, fontWeight: 700, color: ORANGE, border: `1px solid ${ORANGE}`, padding: "5px 14px", borderRadius: 20 }}>
                    Culture: {TYPE_SHORT[part2Dominant]}
                  </span>
                </div>
                {isMatched ? (
                  <>
                    <h3 style={{ fontFamily: "'Montserrat', sans-serif", fontSize: 18, fontWeight: 800, color: OFF_WHITE, margin: "0 0 16px" }}>
                      Your orientation and the culture you work with appear to be aligned.
                    </h3>
                    <p style={{ fontFamily: "'Montserrat', sans-serif", fontSize: 15, color: "oklch(75% 0.04 260)", lineHeight: 1.8 }}>
                      Shared logic can be a real gift. When a team runs on the same orientation, coordination is faster, conflict is rarer, and trust builds quickly. That is worth acknowledging. But alignment within your team is not the same as competence across cultures. The question now is whether you can recognize the other three logics when they appear — in a partner organization, a donor, a local leader, a colleague from a different background. You know your own logic well. The next step is developing fluency in the others: not to adopt them, but to read them without judgment, engage them without friction, and lead across the difference without assuming your logic is the default.
                    </p>
                  </>
                ) : gapKey && GAP_BLOCKS[gapKey] ? (
                  <>
                    <h3 style={{ fontFamily: "'Montserrat', sans-serif", fontSize: 18, fontWeight: 800, color: OFF_WHITE, margin: "0 0 16px" }}>
                      {GAP_BLOCKS[gapKey].title}
                    </h3>
                    {GAP_BLOCKS[gapKey].body.split("\n\n").map((para, i) => (
                      <p key={i} style={{ fontFamily: "'Montserrat', sans-serif", fontSize: 15, color: "oklch(75% 0.04 260)", lineHeight: 1.8, marginBottom: 12 }}>
                        {para}
                      </p>
                    ))}
                  </>
                ) : null}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* ─── THE FREEDOM ──────────────────────────────────────────────────── */}
      <div style={{ background: OFF_WHITE, padding: "96px 24px 64px" }}>
        <div style={{ maxWidth: 780, margin: "0 auto" }}>
          <p style={{ fontFamily: "'Montserrat', sans-serif", fontSize: 11, fontWeight: 700, letterSpacing: "0.14em", textTransform: "uppercase", color: ORANGE, marginBottom: 20 }}>
            The Freedom
          </p>
          <p style={{ fontFamily: "'Montserrat', sans-serif", fontSize: 16, fontWeight: 700, color: NAVY, lineHeight: 1.85, marginBottom: 16 }}>
            Leaders who understand all the dimensions of time are controlled by none of them.
          </p>
          <p style={{ fontFamily: "'Montserrat', sans-serif", fontSize: 16, color: BODY_TEXT, lineHeight: 1.85, marginBottom: 16 }}>
            Most leaders are controlled by time — not because they are bad at managing it, but because they only know one logic. If you only know Clock Keeper logic, you will be driven by urgency and you will read every deviation as failure. If you only know Relationship Weaver logic, you will be drained by the invisible expectations of colleagues who run on monochronic assumptions and never tell you directly.
          </p>
          <p style={{ fontFamily: "'Montserrat', sans-serif", fontSize: 16, color: BODY_TEXT, lineHeight: 1.85, marginBottom: 16 }}>
            Understanding multiple logics does not mean adopting them all equally. It means you can see what is happening in the room before it becomes a conflict. You can name it. You can create space for the team to navigate it together. You can stop the fracture before it forms. That is not better time management. That is situational awareness — and situational awareness is what separates a leader who reacts to their team from a leader who reads their team.
          </p>
        </div>
      </div>

      {/* ─── THE FEELING ──────────────────────────────────────────────────── */}
      <div style={{ maxWidth: 780, margin: "0 auto", padding: "0 24px 48px" }}>
        <p style={{ fontFamily: "'Montserrat', sans-serif", fontSize: 11, fontWeight: 700, letterSpacing: "0.14em", textTransform: "uppercase", color: ORANGE, margin: "48px 0 20px" }}>
          The Feeling
        </p>

        {/* Watch image */}
        <div style={{ borderRadius: 12, overflow: "hidden", marginBottom: 32, maxHeight: 340 }}>
          <img
            src="/images/time-and-culture/feeling-watch.jpg"
            alt="A watch in warm afternoon light — time as a felt experience"
            style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
          />
        </div>

        <ElapsedTimer />

        <p style={{ fontFamily: "'Montserrat', sans-serif", fontSize: 16, color: BODY_TEXT, lineHeight: 1.85, marginBottom: 16 }}>
          Time does not just pass. For many people, time presses. It follows them into meetings, sits with them during conversations, and creates an anxiety so familiar they mistake it for personality. But the experience of being controlled by time is not universal. It is not natural. It is cultural.
        </p>
        <p style={{ fontFamily: "'Montserrat', sans-serif", fontSize: 16, color: BODY_TEXT, lineHeight: 1.85, marginBottom: 16 }}>
          Depending on where you were shaped, time feels entirely different. For the Clock Keeper, it is a resource being spent or wasted. For the Relationship Weaver, it belongs to the person in front of them. For the Harmony Follower, it is a signal to read before moving. For the Community Keeper, it is a communal rhythm that simply is what it is. Each of these produces its own emotional register. And each one, held alone, creates its own vulnerability. The Clock Keeper chases deadlines. The Relationship Weaver is blindsided by logistics. The Harmony Follower stalls when hierarchy is absent. The Community Keeper is quietly excluded from high-stakes coordination because the team has stopped trusting their timeline.
        </p>
        <p style={{ fontFamily: "'Montserrat', sans-serif", fontSize: 16, color: BODY_TEXT, lineHeight: 1.85, marginBottom: 16 }}>
          The leader who understands all four perceptions of time is no longer controlled by the one they inherited. They can see what is happening in the room before it becomes a conflict. They can name it. They can hold the pace that the moment requires rather than the pace their background defaults to. That is not better time management. That is the beginning of real cultural fluency.
        </p>
      </div>

      {/* ─── FIELD STORY ──────────────────────────────────────────────────── */}
      <div style={{ background: LIGHT_GRAY, padding: "0 0 48px" }}>
        <div style={{ maxWidth: 780, margin: "0 auto", padding: "48px 24px 0" }}>
          <p style={{ fontFamily: "'Montserrat', sans-serif", fontSize: 11, fontWeight: 700, letterSpacing: "0.14em", textTransform: "uppercase", color: ORANGE, marginBottom: 20 }}>
            Field Story
          </p>
          <p style={{ fontFamily: "'Montserrat', sans-serif", fontSize: 16, color: BODY_TEXT, lineHeight: 1.85, marginBottom: 24 }}>
            You have a time logic. Most people never discover this. They move through their days and their teams and their partnerships operating on assumptions about time that feel so obvious, so self-evident, that they have never once considered those assumptions might be cultural. The moment you step into a cross-cultural team, or lead across organizational lines, these invisible assumptions start to collide — and without the vocabulary to name what is happening, the collision reads as a character problem rather than a logic problem.
          </p>

          {/* Field story block */}
          <div style={{ borderLeft: `4px solid ${NAVY}`, background: OFF_WHITE, padding: "2rem", marginTop: 24, borderRadius: "0 8px 8px 0" }}>
            {[
              "An Indonesian team leader was hosting a visiting leader from overseas. He knew the visitor valued punctuality, so the day before the meeting he made a point of addressing his team directly. 'Tomorrow,' he said, 'I need everyone here on time. This matters.'",
              "His team heard him. They took it seriously. The next morning, people began arriving early. By eight fifty, most of the group was seated and ready. At eight fifty-five, someone suggested they begin. The discussion was already underway when the visiting leader walked in at exactly nine o'clock.",
              "He stopped in the doorway. The meeting had started without him. He felt the sting of it immediately. After all his travel, after the relationship they had been building, this team had started before he arrived. It felt like a clear signal: he was not the priority.",
              "But here is what had actually happened. The Indonesian leader had honored his guest's value by rallying his team. The team had honored their leader by arriving early and being ready. The visiting leader had honored the agreed time by arriving at exactly nine. Three different expressions of respect. Three different time logics running in the same room. And no shared language to make sense of any of it. Nobody was wrong. That is the point.",
            ].map((para, i) => (
              <p key={i} style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 17, color: BODY_TEXT, lineHeight: 1.85, marginBottom: 12, fontStyle: "italic" }}>
                {para}
              </p>
            ))}
          </div>
        </div>
      </div>

      {/* ─── THE FOUR GRAMMARS ────────────────────────────────────────────── */}
      <div style={{ maxWidth: 780, margin: "0 auto", padding: "64px 24px 48px" }}>
        <p style={{ fontFamily: "'Montserrat', sans-serif", fontSize: 11, fontWeight: 700, letterSpacing: "0.14em", textTransform: "uppercase", color: ORANGE, marginBottom: 20 }}>
          The Four Logics
        </p>
        <p style={{ fontFamily: "'Montserrat', sans-serif", fontSize: 16, color: BODY_TEXT, lineHeight: 1.85, marginBottom: 16 }}>
          There are four ways that people around the world primarily relate to time. Researchers have mapped them across cultures, given them names, and traced their consequences through decades of cross-cultural leadership studies. Each one has internal logic. Each one has strengths. Each one has costs — and those costs matter most when it encounters a different logic and nobody names what is happening.
        </p>
        <p style={{ fontFamily: "'Montserrat', sans-serif", fontSize: 16, color: BODY_TEXT, lineHeight: 1.85, marginBottom: 32 }}>
          Read each one as you would read the internal logic of a language you are learning. You are not going to read these and conclude that one is right and the others are wrong — that reflex is the exact thing this module is here to interrupt. The goal is not to adopt a new logic. The goal is to recognize which one is running in the room.
        </p>

        {/* 2×2 concept card grid */}
        <div className="concept-card-grid" style={{ display: "grid", gap: 20, marginTop: 32 }}>
          {CONCEPT_CARDS.map((card, i) => (
            <ConceptCard
              key={i}
              card={card}
              expanded={expandedCard === i}
              onToggle={() => setExpandedCard(expandedCard === i ? null : i)}
            />
          ))}
        </div>
      </div>

      {/* ─── QUOTE HIGHLIGHT 1 ────────────────────────────────────────────── */}
      <div style={{ background: LIGHT_GRAY, padding: "56px 24px" }}>
        <div style={{ maxWidth: 700, margin: "0 auto", textAlign: "center" }}>
          <p style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 22, fontStyle: "italic", color: NAVY, lineHeight: 1.65, marginBottom: 16 }}>
            "Cultures that organize around events and communal presence may, in their own way, be practicing a rhythm of time that productivity-oriented cultures have largely lost. The willingness to wait for the right moment, the insistence that time belongs to the people and not the schedule, echoes something that runs through the biblical tradition far more than most Western organizational models would suggest."
          </p>
          <p style={{ fontFamily: "'Montserrat', sans-serif", fontSize: 13, color: BODY_TEXT }}>
            Paraphrased from academic literature on temporal orientation and cultural hermeneutics, including scholarly work on chronos/kairos theology and cross-cultural time frameworks.
          </p>
        </div>
      </div>

      {/* ─── FAITH ANCHOR ─────────────────────────────────────────────────── */}
      <div style={{ background: OFF_WHITE, padding: "64px 24px" }}>
        <div style={{ maxWidth: 780, margin: "0 auto" }}>
          <p style={{ fontFamily: "'Montserrat', sans-serif", fontSize: 11, fontWeight: 700, letterSpacing: "0.14em", textTransform: "uppercase", color: ORANGE, marginBottom: 20 }}>
            Faith Anchor
          </p>
          <h2 style={{ fontFamily: "'Montserrat', sans-serif", fontSize: "clamp(24px, 3.5vw, 36px)", fontWeight: 800, color: NAVY, margin: "0 0 32px", lineHeight: 1.2 }}>
            Two Ways God Relates to Time
          </h2>
          <p style={{ fontFamily: "'Montserrat', sans-serif", fontSize: 16, color: BODY_TEXT, lineHeight: 1.85, marginBottom: 16 }}>
            There is a verse in Ecclesiastes that most people know and almost nobody fully inhabits.
          </p>
          <blockquote style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 22, fontStyle: "italic", color: NAVY, lineHeight: 1.65, borderLeft: `4px solid ${ORANGE}`, paddingLeft: "1.5rem", margin: "24px 0" }}>
            "There is a time for everything, and a season for every activity under the heavens." (Ecclesiastes 3:1, NIV)
          </blockquote>
          <p style={{ fontFamily: "'Montserrat', sans-serif", fontSize: 16, color: BODY_TEXT, lineHeight: 1.85, marginBottom: 16 }}>
            We quote it when we need patience. But the verse is doing something more structural than that. It is saying that God did not design a single rhythm for all things. Diversity of timing is built into the created order. The farmer does not plant when the builder builds. The mourner does not sing when the dancer dances. Different purposes require different times, and wisdom is knowing which time you are in. Then there is a verse in Galatians that speaks at a different level.
          </p>
          <blockquote style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 22, fontStyle: "italic", color: NAVY, lineHeight: 1.65, borderLeft: `4px solid ${ORANGE}`, paddingLeft: "1.5rem", margin: "24px 0" }}>
            "But when the time had fully come, God sent his Son." (Galatians 4:4, NIV)
          </blockquote>
          <p style={{ fontFamily: "'Montserrat', sans-serif", fontSize: 16, color: BODY_TEXT, lineHeight: 1.85, marginBottom: 16 }}>
            Theologians call this kairos. Not chronos, the sequential ticking of clock-time, but kairos, the appointed moment. It was not rushing toward its target. It was not managed into readiness. It arrived when everything that needed to be in place was in place, and not a moment before. These two dimensions of time — chronos and kairos — are not in competition. They are both real. Cross-cultural teams that only know chronos may be missing the dimension of time that is most needed for deep and lasting work.
          </p>
          <p style={{ fontFamily: "'Montserrat', sans-serif", fontSize: 16, color: BODY_TEXT, lineHeight: 1.85, marginBottom: 16 }}>
            Your own time orientation is not wrong. But every orientation, taken alone, is incomplete. The Clock Keeper needs the kairos reminder that not everything that matters can be scheduled. The Community Keeper needs the chronos reminder that other people's commitments are real. The Relationship Weaver needs the Ecclesiastes reminder that seasons end and new ones must begin. The Harmony Follower needs the reminder that some things require a clear decision regardless of who is in the room. The goal is not better time management. The goal is ministry readiness. Our task is not to make things happen on our timeline. It is to stay ready for when God moves.
          </p>
        </div>
      </div>

      {/* ─── TEAM EXERCISE ────────────────────────────────────────────────── */}
      <div style={{ maxWidth: 780, margin: "0 auto", padding: "0 24px 64px" }}>
        <TeamExercise />
      </div>

      {/* ─── KEY TAKEAWAY ─────────────────────────────────────────────────── */}
      <div style={{ background: OFF_WHITE, borderTop: `3px solid ${ORANGE}`, padding: "clamp(56px, 7vw, 80px) 24px" }}>
        <div style={{ maxWidth: 720, margin: "0 auto" }}>
          <p style={{ fontFamily: "'Montserrat', sans-serif", fontSize: 11, fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", color: ORANGE, marginBottom: 12 }}>
            Key Takeaway
          </p>
          <h2 style={{ fontFamily: "'Montserrat', sans-serif", fontSize: "clamp(20px, 2.5vw, 28px)", fontWeight: 800, color: NAVY, marginBottom: 32 }}>
            Three things to carry forward
          </h2>
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            {[
              {
                heading: "You have a time logic, and it shapes everything.",
                body: "Before this module, your experience of time may have felt like common sense. Now you can see it as a cultural orientation, one with real strengths and real blind spots. Naming your own logic is the first act of cross-cultural leadership with time.",
              },
              {
                heading: "Other people's time logics are not problems to fix.",
                body: "Every orientation in this module has internal logic and real value. The Clock Keeper's reliability matters. The Relationship Weaver's depth matters. The Harmony Follower's contextual intelligence matters. The Community Keeper's presence-based wisdom matters. The work is not to rank these but to recognize them without flinching.",
              },
              {
                heading: "The leader who sees the logic gap forming can stop it before it fractures.",
                body: "This is the shift this module is building toward: not knowledge, but situational awareness. You now have the language to see the moment forming in a meeting, name what is happening, and create space for the team to navigate it together. That skill, used once, can change the culture of a team. Used consistently, it marks the difference between a team that tolerates difference and a team that draws strength from it.",
              },
            ].map((item, i) => (
              <div key={i} style={{ display: "flex", gap: 16, alignItems: "flex-start", padding: "20px 24px", background: LIGHT_GRAY, borderLeft: `3px solid ${ORANGE}`, borderRadius: 8 }}>
                <div style={{ flex: 1 }}>
                  <p style={{ fontFamily: "'Montserrat', sans-serif", fontSize: 14, fontWeight: 700, color: NAVY, margin: "0 0 6px" }}>
                    {item.heading}
                  </p>
                  <p style={{ fontFamily: "'Montserrat', sans-serif", fontSize: 14, color: BODY_TEXT, lineHeight: 1.75, margin: 0 }}>
                    {item.body}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ─── SOURCES ──────────────────────────────────────────────────────── */}
      <div style={{ background: LIGHT_GRAY, padding: "40px 24px 48px", borderTop: `1px solid oklch(88% 0.008 80)` }}>
        <div style={{ maxWidth: 780, margin: "0 auto" }}>
          <p style={{ fontFamily: "'Montserrat', sans-serif", fontSize: 11, fontWeight: 700, letterSpacing: "0.14em", textTransform: "uppercase", color: BODY_TEXT, marginBottom: 16 }}>
            Academic Roots
          </p>
          <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
            {[
              "Edward T. Hall — The Silent Language (1959); The Dance of Life (1983). Source of monochronic and polychronic time frameworks.",
              "Richard Lewis — When Cultures Collide (1996). Source of Linear-Active and Reactive time orientations.",
              "John Mbiti — African Religions and Philosophy (1969). Source of the Sasa/Zamani temporal framework.",
              "Richard Brislin — Cross-cultural psychology research (2003). Source of clock-time vs. event-time distinction.",
              "Scripture quotations from the New International Version (NIV). Holy Bible, NIV® © 1973, 1978, 1984, 2011 by Biblica, Inc.®",
            ].map((source, i) => (
              <p key={i} style={{ fontFamily: "'Montserrat', sans-serif", fontSize: 12, color: BODY_TEXT, lineHeight: 1.7, margin: 0 }}>
                {source}
              </p>
            ))}
          </div>
        </div>
      </div>

      {/* ─── CTA FOOTER ───────────────────────────────────────────────────── */}
      <div style={{ background: NAVY, padding: "64px 24px", textAlign: "center", position: "relative", overflow: "hidden" }}>
        <div style={{ position: "absolute", left: 0, top: 0, bottom: 0, width: 5, background: ORANGE }} />
        <div style={{ position: "relative", maxWidth: 600, margin: "0 auto" }}>
          <h2 style={{ fontFamily: "'Montserrat', sans-serif", fontSize: "clamp(22px, 3.5vw, 32px)", fontWeight: 800, color: OFF_WHITE, marginBottom: 14, lineHeight: 1.2 }}>
            Keep Growing
          </h2>
          <p style={{ color: "oklch(72% 0.04 260)", fontSize: 15, lineHeight: 1.75, marginBottom: 28, fontFamily: "'Montserrat', sans-serif" }}>
            Explore more resources to deepen your cross-cultural leadership.
          </p>
          <div style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap" }}>
            <Link
              href="/resources"
              style={{ display: "inline-block", padding: "13px 28px", background: ORANGE, color: OFF_WHITE, borderRadius: 6, fontFamily: "'Montserrat', sans-serif", fontSize: 14, fontWeight: 700, textDecoration: "none" }}
            >
              Content Library
            </Link>
            <Link
              href="/resources/cultural-intelligence"
              style={{ display: "inline-block", padding: "13px 28px", border: "1px solid oklch(45% 0.05 260)", color: OFF_WHITE, borderRadius: 6, fontFamily: "'Montserrat', sans-serif", fontSize: 14, fontWeight: 600, textDecoration: "none" }}
            >
              Cultural Intelligence →
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

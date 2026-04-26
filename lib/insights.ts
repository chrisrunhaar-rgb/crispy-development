export type InsightLink = {
  label: string;
  url: string;
};

export type Insight = {
  slug: string;
  title: string;
  hook: string;
  date: string;
  tag: string;
  readMinutes: number;
  body: string;
  resourceSlug?: string;
  resourceLabel?: string;
  furtherReading?: InsightLink[];
};

export const insights: Insight[] = [
  {
    slug: "faith-and-the-counselor",
    title: "Faith and the Counsellor: Why Choosing One Doesn't Mean Abandoning the Other",
    hook: "Many believers quietly assume that seeking professional help is a sign of insufficient faith. It isn't — and that assumption may be costing us more than we know.",
    date: "2026-05-17",
    tag: "Wellbeing",
    readMinutes: 4,
    furtherReading: [
      { label: "Focus on the Family — Counselling Referrals", url: "https://www.focusonthefamily.com" },
      { label: "Biblical Counseling Coalition", url: "https://www.biblicalcounselingcoalition.org" },
    ],
    body: `Here is a belief I've encountered in almost every Christian community I've worked in, across widely different cultures: that seeking professional psychological help is, somewhere underneath the surface, a small act of faithlessness. That a person who truly trusts God finds healing through prayer, community, and Scripture — and that reaching for something more is reaching past God to find it.

It's rarely said out loud. But it's felt. In the hesitation before the referral. In the slight embarrassment after the appointment. In the leader who would rather burn out quietly than admit they're seeing someone.

I want to ask a question about this, not answer it.

When we accept that God works through surgeons to heal bodies, and through teachers to form minds, and through communities to shape character — at what point did we decide that the same God doesn't work through trained counsellors to bring healing to the inner life?

Christian counselling is not a compromise. It's a conviction — held by practitioners who believe that understanding how human beings are made is part of honouring the one who made them. Psychology is not in competition with Scripture. It is a different kind of description of the same reality.

This matters especially in cross-cultural leadership. The combination of displacement, ambiguity, relational complexity, and high expectations creates a particular kind of pressure on the people doing the work. The default in many of these contexts is to keep moving. But unaddressed pain doesn't stay contained — it leaks into relationships, decisions, teams.

The Great Commission sends us as whole people. If we arrive fractured and silent, we serve from less than we were made for.

What would it take for your community to make it safe to ask for help?`,
  },
  {
    slug: "three-ways-to-zoom-out",
    title: "Three Ways to Zoom Out When the Details Are Drowning You",
    hook: "When you're too close to the work, everything feels urgent and nothing feels meaningful. There are moves that help — but they won't happen by accident.",
    date: "2026-05-10",
    tag: "Leadership Practice",
    readMinutes: 3,
    resourceSlug: "leadership-altitudes",
    resourceLabel: "Leadership Altitudes",
    furtherReading: [
      { label: "The Gospel Coalition — Leadership & Calling", url: "https://www.thegospelcoalition.org" },
    ],
    body: `There's a kind of busyness that feels like faithfulness. Full calendar. Active email. Constant coordination. Always needed somewhere. It can go on for years before the question surfaces: what am I actually building here?

Most of the leaders I work with are not lazy or undisciplined. They are genuinely overextended — too close to the work to see the work clearly. The problem is not effort. It's proximity.

Zooming out is a practice, not an event. It doesn't happen automatically, and it doesn't happen once. It has to be built in — deliberately, routinely, awkwardly at first.

Three things that seem to help.

Write your destination in one sentence. Not your task list — your destination. If you can't summarise where you're going in a sentence, you may not know. And if you don't know, the people depending on you probably can't see it either.

Ask the five-year question. Is what I'm doing today moving us toward what actually matters in five years? Most teams never ask this out loud. The ones that do — even badly, even in ten minutes — tend to drift less.

Change your position. Sometimes altitude shifts are physical before they're intellectual. Go somewhere different. Sit with someone outside your immediate work. The view from a different chair has broken more logjams than any strategic planning session I've sat in.

Behind all of this, there's a theological question worth sitting with. If God has a purpose that is larger than what you can see, then your work is one piece of something you will never fully understand on this side of eternity. That's not a reason to disengage. It's a reason to hold your piece with both faithfulness and humility.

Where in your work are you too close right now to see clearly?`,
  },
  {
    slug: "burnout-the-word-we-dont-say",
    title: "Burnout: The Word We Don't Say",
    hook: "In many cross-cultural and faith-based settings, admitting you're burned out feels like admitting you've failed. So most of us don't say it — until we can't not.",
    date: "2026-05-03",
    tag: "Wellbeing",
    readMinutes: 4,
    furtherReading: [
      { label: "Burnout & Ministry Resilience — Christianity Today", url: "https://www.christianitytoday.com" },
      { label: "Missionary Member Care — Lausanne Movement", url: "https://lausanne.org" },
    ],
    body: `In cross-cultural ministry circles, burnout tends to live in a particular kind of silence. Not because people don't feel it — they do — but because naming it feels like naming a failure. The unspoken logic: if you're truly trusting God, you'll find the strength. If the calling is real, the resources will come. Struggle is a private matter.

How many of us have lived inside that logic?

I have. I know what it looks like when a person keeps showing up without actually being present anymore. When the work that once felt like a gift starts feeling like debt. When the questions that used to energise you just feel like more weight.

Here's what I keep wondering: why do we treat spiritual and physical exhaustion as if they live in different categories? We wouldn't tell someone with a broken leg to pray harder. Why do we draw the line differently when it's the soul that's cracked?

Burnout in cross-cultural settings has its own texture. The personal and professional are rarely separated. You live where you work. The people you serve are also your neighbours. There is no threshold to cross at the end of the day — the work and the life are the same thing. Which means when something breaks, it breaks everywhere at once.

The cultural layer compounds it. In honour-based communities, naming struggle risks bringing shame to the whole team. In performance-driven cultures, burnout gets quietly filed as a personal management failure. Neither gives you real permission to say: I'm not okay.

Elijah didn't get a rebuke from God after he sat under that tree and asked to die. He got rest, food, and a question: "What are you doing here?"

Not a challenge. An invitation.

What would happen if someone asked you that question this week — and you answered honestly?`,
  },
  {
    slug: "when-altitude-determines-impact",
    title: "Your Altitude Determines Your Impact",
    hook: "Most leaders are stuck at the wrong altitude — too deep in the work, or too far above it.",
    date: "2026-04-26",
    tag: "Leadership Model",
    readMinutes: 4,
    resourceSlug: "leadership-altitudes",
    resourceLabel: "Leadership Altitudes",
    body: `There's a meeting most leaders dread. The one where someone says, "You're too in the weeds" — or the opposite: "You've lost touch with what's actually happening."

Both are altitude problems.

Every leader operates at one of three altitudes at any given moment. At ground level, you're doing the work — hands on, close to the details, solving the immediate problem in front of you. At mid-altitude, you're managing the work — coordinating, delegating, reviewing. At high altitude, you're leading the work — setting direction, reading the landscape, asking whether you're climbing the right hill.

None of these altitudes is wrong. The problem is when leaders get stuck at one level and can't shift.

The missionary who spends all their time doing community work but never steps back to ask whether their approach is working — stuck at ground level. The team leader who's always in meetings coordinating other people's work but never actually knows what's happening on the ground — stuck at mid-altitude. The executive who has big vision but can't get close enough to understand why the team is struggling — stuck too high.

Cross-cultural contexts make this harder. Cultural distance creates a natural pull toward either extreme. You either over-invest in the details to "prove you understand," or you stay high because the complexity of the context feels overwhelming.

The leaders who navigate this well develop a practice of intentional altitude shifts. They ask themselves: *Am I at the right altitude for this moment? What does this situation need from me right now?*

That's not a technique. It's a discipline.`,
  },
  {
    slug: "above-below-the-line",
    title: "Are You Above or Below the Line Right Now?",
    hook: "There's a line most teams never talk about — but everyone is either above it or below it in every conversation.",
    date: "2026-04-19",
    tag: "Team Dynamics",
    readMinutes: 3,
    resourceSlug: "above-below-the-line",
    resourceLabel: "Above & Below the Line",
    body: `It's not always obvious when a team is in trouble. The meetings still happen. People still show up. Reports still go out.

But underneath the surface, there's a line — and when people drop below it, the whole team starts operating differently.

Above the line, people are curious. They ask questions. They own their mistakes. They're genuinely interested in solving the problem. Below the line, people are defensive. They protect themselves. They explain why it's not their fault. They're focused on being right rather than getting it right.

In cross-cultural teams, the line is harder to read. Cultures differ in how they express disagreement, how they handle failure publicly, and how direct they're willing to be when something isn't working. What looks like calm and compliance in one culture can be a room full of people who have quietly dropped below the line.

The tell isn't tone of voice. It's what people are focused on.

When someone is below the line, the energy goes into managing perception — how they look, how they're seen, whether they'll be blamed. When someone is above the line, the energy goes into the problem itself.

As a leader, you set the tone. If you model above-the-line behaviour when things go wrong — owning it, being curious about what happened, staying focused on the solution — you create permission for your team to do the same.

The question isn't whether you'll face below-the-line moments. Every team does. The question is how fast you recognize them — in yourself and in the people around you.`,
  },
  {
    slug: "why-you-think-differently",
    title: "Why You and Your Colleague Keep Disagreeing",
    hook: "It's probably not a personality clash. It's a thinking style difference — and there's a name for it.",
    date: "2026-04-12",
    tag: "Framework",
    readMinutes: 4,
    resourceSlug: "three-thinking-styles",
    resourceLabel: "Three Thinking Styles",
    body: `You've been in this meeting. Someone presents a plan. One person immediately wants to know all the details — the steps, the timeline, the risks. Another person keeps pulling back to the bigger picture: "But what are we actually trying to achieve here?" A third person has already moved on to: "I have a feeling this is going to cause problems with the team in Jakarta."

Three people. Three valid concerns. One very long meeting.

This is a thinking styles difference, not a character problem.

Every leader has a dominant way of processing information and making decisions. Conceptual thinkers build systems and frameworks — they need to understand *how* things fit together before they can move forward. Holistic thinkers read the whole picture — they're tracking relationships, impact, and unintended consequences. Intuitive thinkers work from pattern recognition — they've seen something like this before and they know where it's going.

None of these is the right style. All of them are necessary.

The problem comes when you don't know which style you're operating from — and you assume everyone else thinks the same way. The conceptual thinker dismisses the intuitive as "not thinking it through." The holistic thinker finds the conceptual thinker frustratingly slow. The intuitive finds everyone else unnecessarily complicated.

In cross-cultural teams, these differences compound. Different cultures have different default styles — and different levels of permission to express them. A team in which some members hold back their instincts because "that's not how we make decisions here" is a team leaving capacity on the table.

Understanding thinking styles doesn't mean everyone has to think the same way. It means you stop treating disagreement as a threat and start treating it as information.`,
  },
  {
    slug: "trust-in-cross-cultural-teams",
    title: "How Trust Actually Breaks in a Cross-Cultural Team",
    hook: "It's rarely one big moment. It's a hundred small ones — and most of them are invisible.",
    date: "2026-04-05",
    tag: "Cross-Cultural",
    readMinutes: 4,
    body: `Trust doesn't break in an obvious way in cross-cultural teams. There's rarely a dramatic confrontation. More often, it erodes quietly — through a series of small moments that each feel manageable, until one day the team just doesn't work anymore.

A deadline is missed and the explanation doesn't make sense to the leader. A decision is made without consultation, which feels disrespectful in one culture and efficient in another. Someone nods in a meeting and then doesn't follow through — not because they were dishonest, but because "yes" meant "I heard you," not "I agree."

These aren't failures of integrity. They're failures of translation.

Every culture has a different answer to the question: "What does it mean to be reliable?" In some contexts, reliability means sticking to the plan no matter what. In others, it means staying responsive to what's actually happening, even if the original plan needs to change. Neither is wrong. But when a leader from one tradition manages a team from the other, they will misread almost every situation involving trust.

The leaders who get this right do three things. First, they slow down their interpretation. Before deciding what a behaviour means, they ask themselves: "Is this the only possible explanation?" Second, they create space for difference to be named. Teams that can talk about how they make decisions and what reliability means to each person don't have to guess. Third, they build relationship equity before they need to draw on it. Trust in cross-cultural contexts isn't just about competence — it's about being known.

The small moments still happen. They always do. What changes is whether the team has enough trust banked to survive them.`,
  },
];

export function getInsight(slug: string): Insight | undefined {
  return insights.find(i => i.slug === slug);
}

export function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString("en-GB", {
    day: "numeric", month: "long", year: "numeric",
  });
}

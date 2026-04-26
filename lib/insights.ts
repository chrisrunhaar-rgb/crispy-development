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
};

export const insights: Insight[] = [
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

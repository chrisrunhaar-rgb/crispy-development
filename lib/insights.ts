export type InsightLink = {
  label: string;
  url: string;
};

export type InsightTranslation = {
  title: string;
  hook: string;
  body: string;
};

export type Insight = {
  slug: string;
  title: string;
  hook: string;
  date: string;
  tag: string;
  readMinutes: number;
  body: string;
  illustration?: string;
  resourceSlug?: string;
  resourceLabel?: string;
  furtherReading?: InsightLink[];
  id?: InsightTranslation;
};

export const insights: Insight[] = [
  {
    slug: "faith-and-the-counselor",
    title: "Faith and the Counsellor: Why Choosing One Doesn't Mean Abandoning the Other",
    hook: "Many believers carry this question without ever saying it out loud: if my faith were stronger, would I still need this?",
    date: "2026-05-17",
    tag: "Wellbeing",
    readMinutes: 4,
    illustration: "/bytes/faith-and-the-counselor.jpg",
    furtherReading: [
      { label: "Focus on the Family — Counselling Referrals", url: "https://www.focusonthefamily.com" },
      { label: "Biblical Counseling Coalition", url: "https://www.biblicalcounselingcoalition.org" },
    ],
    body: `Here is a belief I've encountered in almost every Christian community I've worked in, across widely different cultures: that seeking professional psychological help is, somewhere underneath the surface, a small act of faithlessness. That a person who truly trusts God finds healing through prayer, community, and Scripture, and that reaching for something more is reaching past God to find it.

It's rarely said out loud. But it's felt. In the hesitation before the referral. In the slight embarrassment after the appointment. In the leader who would rather burn out quietly than admit they're seeing someone.

I want to ask a question about this, not answer it.

When we accept that God works through surgeons to heal bodies, and through teachers to form minds, and through communities to shape character, at what point did we decide that the same God doesn't work through trained counsellors to bring healing to the inner life?

Christian counselling is not a compromise. It's a conviction, held by practitioners who believe that understanding how human beings are made is part of honouring the one who made them. Psychology is not in competition with Scripture. It is a different kind of description of the same reality.

This matters especially in cross-cultural leadership. The combination of displacement, ambiguity, relational complexity, and high expectations creates a particular kind of pressure on the people doing the work. The default in many of these contexts is to keep moving. But unaddressed pain doesn't stay contained. It leaks into relationships, decisions, teams.

The Great Commission sends us as whole people. If we arrive fractured and silent, we serve from less than we were made for.

What would it take for your community to make it safe to ask for help?`,
  },
  {
    slug: "three-ways-to-zoom-out",
    title: "Three Ways to Zoom Out When the Details Are Drowning You",
    hook: "When you're too close to the work, everything feels urgent and nothing feels meaningful. There are moves that help, but they won't happen by accident.",
    date: "2026-05-10",
    tag: "Leadership Practice",
    readMinutes: 3,
    illustration: "/bytes/three-ways-to-zoom-out.jpg",
    resourceSlug: "leadership-altitudes",
    resourceLabel: "Leadership Altitudes",
    furtherReading: [
      { label: "The Gospel Coalition — Leadership & Calling", url: "https://www.thegospelcoalition.org" },
    ],
    body: `There's a kind of busyness that feels like faithfulness. Full calendar. Active email. Constant coordination. Always needed somewhere. It can go on for years before the question surfaces: what am I actually building here?

Most of the leaders I work with are not lazy or undisciplined. They are genuinely overextended, too close to the work to see the work clearly. The problem is not effort. It's proximity.

Zooming out is a practice, not an event. It doesn't happen automatically, and it doesn't happen once. It has to be built in, deliberately, routinely, awkwardly at first.

Three things that seem to help.

Write your destination in one sentence. Not your task list. Your destination. If you can't summarise where you're going in a sentence, you may not know. And if you don't know, the people depending on you probably can't see it either.

Ask the five-year question. Is what I'm doing today moving us toward what actually matters in five years? Most teams never ask this out loud. The ones that do, even badly, even in ten minutes, tend to drift less.

Change your position. Sometimes altitude shifts are physical before they're intellectual. Go somewhere different. Sit with someone outside your immediate work. The view from a different chair has broken more logjams than any strategic planning session I've sat in.

Behind all of this, there's a theological question worth sitting with. If God has a purpose that is larger than what you can see, then your work is one piece of something you will never fully understand on this side of eternity. That's not a reason to disengage. It's a reason to hold your piece with both faithfulness and humility.

Where in your work are you too close right now to see clearly?`,
  },
  {
    slug: "burnout-the-word-we-dont-say",
    title: "Burnout: The Word We Don't Say",
    hook: "In many cross-cultural and faith-based settings, admitting you're burned out feels like admitting you've failed. So most of us don't say it, until we can't not.",
    date: "2026-05-03",
    tag: "Wellbeing",
    readMinutes: 4,
    illustration: "/bytes/burnout-the-word-we-dont-say.jpg",
    furtherReading: [
      { label: "Burnout & Ministry Resilience — Christianity Today", url: "https://www.christianitytoday.com" },
      { label: "Member Care for Field Workers — Lausanne Movement", url: "https://lausanne.org" },
    ],
    body: `In cross-cultural faith circles, burnout tends to live in a particular kind of silence. Not because people don't feel it. They do. But because naming it feels like naming a failure. The unspoken logic: if you're truly trusting God, you'll find the strength. If the calling is real, the resources will come. Struggle is a private matter.

How many of us have lived inside that logic?

I have. I know what it looks like when a person keeps showing up without actually being present anymore. When the work that once felt like a gift starts feeling like debt. When the questions that used to energise you just feel like more weight.

Here's what I keep wondering: why do we treat spiritual and physical exhaustion as if they live in different categories? We wouldn't tell someone with a broken leg to pray harder. Why do we draw the line differently when it's the soul that's cracked?

Burnout in cross-cultural settings has its own texture. The personal and professional are rarely separated. You live where you work. The people you serve are also your neighbours. There is no threshold to cross at the end of the day. The work and the life are the same thing. Which means when something breaks, it breaks everywhere at once.

The cultural layer compounds it. In honour-based communities, naming struggle risks bringing shame to the whole team. In performance-driven cultures, burnout gets quietly filed as a personal management failure. Neither gives you real permission to say: I'm not okay.

Elijah didn't get a rebuke from God after he sat under that tree and asked to die. He got rest, food, and a question: "What are you doing here?"

Not a challenge. An invitation.

What would happen if someone asked you that question this week, and you answered honestly?`,
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

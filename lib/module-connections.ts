export type ModuleConnection = {
  sourceSlug: string;
  sourceSectionId: string;
  targetSlug: string;
  targetTitle: string;
  topic: string;
  angle: string;
};

export const MODULE_CONNECTIONS: ModuleConnection[] = [
  // Intercultural Communication → other modules (explicit text references)
  {
    sourceSlug: "intercultural-communication",
    sourceSectionId: "mc-dimensions",
    targetSlug: "power-distance",
    targetTitle: "Power Distance in Leadership",
    topic: "power distance and cultural communication",
    angle: "how power distance determines who speaks, who stays silent, and who gets heard",
  },
  {
    sourceSlug: "intercultural-communication",
    sourceSectionId: "mc-faith-anchor",
    targetSlug: "giving-feedback-across-cultures",
    targetTitle: "Giving Feedback Across Cultures",
    topic: "speaking truth in ways that can be received",
    angle: "why truth-telling fails cross-culturally — and how to deliver feedback that actually lands",
  },

  // Sabbath Leadership → Understanding Burnout
  // (portraits section explicitly names burnout — "He doesn't recognise it as burnout")
  {
    sourceSlug: "sabbath-leadership",
    sourceSectionId: "mc-portraits",
    targetSlug: "understanding-burnout",
    targetTitle: "Understanding Burnout",
    topic: "the hidden cost of never stopping",
    angle: "what unaddressed burnout actually looks like in leaders — and how to recognise it before collapse",
  },

  // Sustainable Pace → Sabbath Leadership
  // (intro explicitly says "This is not the Sabbath module — that is about theological rest")
  {
    sourceSlug: "sustainable-pace",
    sourceSectionId: "mc-sabbath-ref",
    targetSlug: "sabbath-leadership",
    targetTitle: "Sabbath Leadership",
    topic: "Sabbath rest as a leadership practice",
    angle: "the theological foundation and practical rhythm of Sabbath that this module points toward",
  },

  // Sustainable Pace → Understanding Burnout
  // (Section V cites 62.91% burnout rates among cross-cultural workers)
  {
    sourceSlug: "sustainable-pace",
    sourceSectionId: "mc-burnout-data",
    targetSlug: "understanding-burnout",
    targetTitle: "Understanding Burnout",
    topic: "burnout rates among cross-cultural workers",
    angle: "the research on what burnout looks like — and how to read the signals before your body breaks",
  },

  // Healthy Conflict → Power Distance
  // (Research section explicitly cites Hofstede's Power Distance Index with country scores)
  {
    sourceSlug: "healthy-conflict",
    sourceSectionId: "mc-research",
    targetSlug: "power-distance",
    targetTitle: "Power Distance in Leadership",
    topic: "how power distance shapes conflict and silence",
    angle: "Hofstede's framework for understanding why silence in high-PDI cultures is not disengagement — it is respect",
  },

  // DISC → Big Five
  // (About DISC section explicitly names "Big Five personality framework" as the cross-cultural benchmark)
  {
    sourceSlug: "disc",
    sourceSectionId: "disc-about",
    targetSlug: "big-five",
    targetTitle: "Big Five Personality",
    topic: "cross-cultural validity of personality frameworks",
    angle: "why the Big Five is more rigorously validated across cultures than DISC — and what that means for your team",
  },

  // DISC → Understanding High-Context Cultures
  // (disc-D cross-cultural note explicitly says "In high-context cultures, the D-type's directness can feel aggressive")
  {
    sourceSlug: "disc",
    sourceSectionId: "disc-D",
    targetSlug: "understanding-high-context",
    targetTitle: "Understanding High-Context Cultures",
    topic: "how D-type directness lands in high-context cultures",
    angle: "why direct, task-focused communication often creates friction in high-context settings — and what to do instead",
  },

  // Cultural Intelligence → Emotional Intelligence
  // (Section 2 explicitly says "Emotional intelligence helps you read people; cultural intelligence helps you read context")
  {
    sourceSlug: "cultural-intelligence",
    sourceSectionId: "mc-what-cq",
    targetSlug: "emotional-intelligence",
    targetTitle: "Emotional Intelligence",
    topic: "EQ vs CQ — what each does and why you need both",
    angle: "how emotional intelligence and cultural intelligence work together — and what breaks when you have one without the other",
  },

  // Attention Retention → Storytelling Leadership
  // (Learning Methods section lists "Storytelling" as Method 04 with full description)
  {
    sourceSlug: "attention-retention",
    sourceSectionId: "mc-methods",
    targetSlug: "storytelling-leadership",
    targetTitle: "Storytelling in Leadership",
    topic: "storytelling as a learning method",
    angle: "how to use narrative-driven teaching to embed concepts in ways people actually remember",
  },

  // Influential Leadership Framework → Cultural Intelligence
  // (Pillar 5 is explicitly titled "Cultural Intelligence (CQ)" with full CQ framework description)
  {
    sourceSlug: "influential-leadership-framework",
    sourceSectionId: "mc-cq",
    targetSlug: "cultural-intelligence",
    targetTitle: "Cultural Intelligence (CQ)",
    topic: "cultural intelligence as a pillar of leadership influence",
    angle: "the framework, dimensions, and developmental pathway for building genuine CQ",
  },

  // Wheel of Life → Sabbath Leadership
  // (Relaxation dimension explicitly asks "Do you regularly take Sabbath rest?")
  {
    sourceSlug: "wheel-of-life",
    sourceSectionId: "mc-rest",
    targetSlug: "sabbath-leadership",
    targetTitle: "Sabbath Leadership",
    topic: "Sabbath rest as a dimension of a whole leader",
    angle: "the theological and practical case for building rest into your rhythm as a leader",
  },

  // Johari Window → Power Distance
  // (Long-form section explicitly discusses Hofstede power distance research on upward feedback norms)
  {
    sourceSlug: "johari-window",
    sourceSectionId: "mc-cross-cultural",
    targetSlug: "power-distance",
    targetTitle: "Power Distance in Leadership",
    topic: "how power distance affects upward feedback and blind spots",
    angle: "why high power-distance cultures make leader blind spots larger — and what to do about it",
  },
];

export function getConnectionsForSection(
  slug: string,
  sectionId: string
): ModuleConnection[] {
  return MODULE_CONNECTIONS.filter(
    (c) => c.sourceSlug === slug && c.sourceSectionId === sectionId
  );
}

export function getConnectionsForModule(slug: string): ModuleConnection[] {
  return MODULE_CONNECTIONS.filter((c) => c.sourceSlug === slug);
}

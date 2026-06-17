export type ModuleConnection = {
  sourceSlug: string;
  sourceSectionId: string;
  targetSlug: string;
  targetTitle: string;
  topic: string;
  angle: string;
};

export const MODULE_CONNECTIONS: ModuleConnection[] = [
  // Cognitive Biases → other modules
  {
    sourceSlug: "cognitive-biases",
    sourceSectionId: "mc-bias-library",
    targetSlug: "disc",
    targetTitle: "DISC Personality Profile",
    topic: "in-group bias and personality type",
    angle: "how your DISC profile shapes which biases you're most susceptible to",
  },
  {
    sourceSlug: "cognitive-biases",
    sourceSectionId: "mc-bias-library",
    targetSlug: "intercultural-communication",
    targetTitle: "Intercultural Communication",
    topic: "perception and cultural filters",
    angle: "how cultural assumptions distort what we hear and how we interpret silence",
  },
  {
    sourceSlug: "cognitive-biases",
    sourceSectionId: "mc-bias-library",
    targetSlug: "ladder-of-inference",
    targetTitle: "Ladder of Inference",
    topic: "how biases drive flawed conclusions",
    angle: "a step-by-step framework for catching the moment bias becomes bad judgment",
  },
  {
    sourceSlug: "cognitive-biases",
    sourceSectionId: "mc-counter-strategies",
    targetSlug: "conflict-resolution",
    targetTitle: "Cross-Cultural Conflict Resolution",
    topic: "bias interruption in conflict",
    angle: "practical tools for naming bias before it escalates a cross-cultural disagreement",
  },
  {
    sourceSlug: "cognitive-biases",
    sourceSectionId: "mc-counter-strategies",
    targetSlug: "giving-feedback-across-cultures",
    targetTitle: "Giving Feedback Across Cultures",
    topic: "debiasing your feedback process",
    angle: "why the same feedback lands differently across cultures — and how to adjust",
  },

  // DISC → other modules
  {
    sourceSlug: "disc",
    sourceSectionId: "disc-types",
    targetSlug: "cognitive-biases",
    targetTitle: "Cognitive Biases",
    topic: "personality and blind spots",
    angle: "which cognitive biases each DISC type is most likely to act on under pressure",
  },
  {
    sourceSlug: "disc",
    sourceSectionId: "disc-types",
    targetSlug: "conflict-resolution",
    targetTitle: "Cross-Cultural Conflict Resolution",
    topic: "DISC styles in conflict",
    angle: "how D, I, S, and C types approach conflict differently — and what that means cross-culturally",
  },
  {
    sourceSlug: "disc",
    sourceSectionId: "disc-D",
    targetSlug: "power-distance",
    targetTitle: "Power Distance in Leadership",
    topic: "directness and authority",
    angle: "why high-D leaders clash with high power-distance cultures — and how to bridge it",
  },
  {
    sourceSlug: "disc",
    sourceSectionId: "disc-S",
    targetSlug: "giving-feedback-across-cultures",
    targetTitle: "Giving Feedback Across Cultures",
    topic: "harmony-seeking and feedback avoidance",
    angle: "how S-type leaders can give honest feedback without damaging relational trust",
  },

  // Intercultural Communication → other modules
  {
    sourceSlug: "intercultural-communication",
    sourceSectionId: "mc-dimensions",
    targetSlug: "power-distance",
    targetTitle: "Power Distance in Leadership",
    topic: "communication and hierarchy",
    angle: "how power distance determines who speaks, who stays silent, and who gets heard",
  },
  {
    sourceSlug: "intercultural-communication",
    sourceSectionId: "mc-dimensions",
    targetSlug: "cognitive-biases",
    targetTitle: "Cognitive Biases",
    topic: "cultural filters and perception bias",
    angle: "the cognitive shortcuts that make cross-cultural misreading almost automatic",
  },
  {
    sourceSlug: "intercultural-communication",
    sourceSectionId: "mc-faith-anchor",
    targetSlug: "giving-feedback-across-cultures",
    targetTitle: "Giving Feedback Across Cultures",
    topic: "speaking truth in ways that can be received",
    angle: "why truth-telling fails cross-culturally — and how to deliver honest feedback in ways that land without breaking trust",
  },
  {
    sourceSlug: "intercultural-communication",
    sourceSectionId: "mc-development-path",
    targetSlug: "cultural-intelligence",
    targetTitle: "Cultural Intelligence (CQ)",
    topic: "building communication competence",
    angle: "CQ as the developmental framework that makes intercultural communication learnable",
  },

  // Vision Casting → other modules
  {
    sourceSlug: "vision-casting",
    sourceSectionId: "mc-vision-compass",
    targetSlug: "intercultural-communication",
    targetTitle: "Intercultural Communication",
    topic: "vision language across cultures",
    angle: "why the same vision statement lands differently across cultures — and how to adapt it",
  },
  {
    sourceSlug: "vision-casting",
    sourceSectionId: "mc-discernment",
    targetSlug: "cognitive-biases",
    targetTitle: "Cognitive Biases",
    topic: "bias in discernment and decision-making",
    angle: "the mental shortcuts that masquerade as strategic clarity when casting vision",
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

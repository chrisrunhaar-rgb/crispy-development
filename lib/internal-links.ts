/**
 * Internal linking strategy
 *
 * Maps related resources to guide users through content
 * Used for: Related resources sections, navigation suggestions
 */

export interface LinkedResource {
  slug: string;
  title: string;
  reason: string;
}

export const internalLinkMap: Record<string, LinkedResource[]> = {
  // DISC → related assessments
  disc: [
    { slug: 'communication-style', title: 'Communication Style', reason: 'Understand how DISC profiles communicate' },
    { slug: 'conflict-style', title: 'Conflict Style', reason: 'How your DISC type handles conflict' },
    { slug: 'leadership-altitudes', title: 'Leadership Altitudes', reason: 'Apply DISC insights to leadership' },
  ],

  // Wheel of Life → personal growth
  'wheel-of-life': [
    { slug: 'emotional-intelligence', title: 'Emotional Intelligence', reason: 'Develop EQ across life domains' },
    { slug: 'sabbath-leadership', title: 'Sabbath Leadership', reason: 'Create balance in your life' },
    { slug: 'sustainable-pace', title: 'Sustainable Pace', reason: 'Maintain health across all areas' },
  ],

  // Myers-Briggs → decision making
  'myers-briggs': [
    { slug: 'decision-making', title: 'Decision Making', reason: 'How your type makes decisions' },
    { slug: 'cognitive-biases', title: 'Cognitive Biases', reason: 'Avoid bias in your decision style' },
    { slug: 'ladder-of-inference', title: 'Ladder of Inference', reason: 'Improve your thinking process' },
  ],

  // Enneagram → personal growth
  enneagram: [
    { slug: 'emotional-intelligence', title: 'Emotional Intelligence', reason: 'Grow your type\'s emotional awareness' },
    { slug: 'overcoming-procrastination', title: 'Overcoming Procrastination', reason: 'Address your type\'s challenges' },
    { slug: 'identity-under-pressure', title: 'Identity Under Pressure', reason: 'Stay grounded under stress' },
  ],

  // Cultural Intelligence → cross-cultural
  'cultural-intelligence': [
    { slug: 'intercultural-communication', title: 'Intercultural Communication', reason: 'Master cross-cultural dialogue' },
    { slug: 'building-trust-across-cultures', title: 'Building Trust Across Cultures', reason: 'Deepen relationships globally' },
    { slug: 'power-distance', title: 'Power Distance', reason: 'Understand cultural hierarchies' },
  ],

  // Leadership Altitudes → leadership frameworks
  'leadership-altitudes': [
    { slug: 'vision-casting', title: 'Vision Casting', reason: 'Cast vision at different altitudes' },
    { slug: 'servant-leadership', title: 'Servant Leadership', reason: 'Lead with humility' },
    { slug: 'team-health', title: 'Team Health', reason: 'Build healthy teams' },
  ],

  // Thinking styles → decision making
  'three-thinking-styles': [
    { slug: 'six-thinking-hats', title: 'Six Thinking Hats', reason: 'Expand your thinking patterns' },
    { slug: 'cognitive-biases', title: 'Cognitive Biases', reason: 'Recognize thinking blind spots' },
    { slug: 'decision-making', title: 'Decision Making', reason: 'Apply your style to decisions' },
  ],

  // Emotional Intelligence → personal growth
  'emotional-intelligence': [
    { slug: 'overcoming-procrastination', title: 'Overcoming Procrastination', reason: 'Use EQ to overcome delays' },
    { slug: 'healthy-transitions', title: 'Managing Healthy Transitions', reason: 'Handle change emotionally' },
    { slug: 'psychological-first-aid', title: 'Psychological First Aid', reason: 'Support others emotionally' },
  ],

  // Conflict Resolution → relationships
  'conflict-resolution': [
    { slug: 'intercultural-communication', title: 'Intercultural Communication', reason: 'Resolve cross-cultural conflicts' },
    { slug: 'giving-feedback-across-cultures', title: 'Giving Feedback Across Cultures', reason: 'Navigate conflict through feedback' },
    { slug: 'building-trust-across-cultures', title: 'Building Trust Across Cultures', reason: 'Restore trust after conflict' },
  ],

  // Servant Leadership → leadership
  'servant-leadership': [
    { slug: 'leadership-altitudes', title: 'Leadership Altitudes', reason: 'Lead at scale with servant heart' },
    { slug: 'vision-casting', title: 'Vision Casting', reason: 'Cast vision through service' },
    { slug: 'team-health', title: 'Team Health', reason: 'Build healthy servant teams' },
  ],
};

/**
 * Get related resources for a given resource slug
 */
export function getRelatedResources(slug: string): LinkedResource[] {
  return internalLinkMap[slug] || [];
}

/**
 * Generate internal link HTML
 */
export function createInternalLink(slug: string, title: string): string {
  return `<a href="/resources/${slug}" class="text-emerald-600 hover:text-emerald-700 underline">${title}</a>`;
}

/**
 * Find resources that link TO a given resource (backlinks)
 */
export function getBacklinks(slug: string): LinkedResource[] {
  const backlinks: LinkedResource[] = [];

  Object.entries(internalLinkMap).forEach(([sourceSlug, relatedResources]) => {
    const link = relatedResources.find(r => r.slug === slug);
    if (link) {
      backlinks.push({
        slug: sourceSlug,
        title: sourceSlug.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' '),
        reason: link.reason,
      });
    }
  });

  return backlinks;
}

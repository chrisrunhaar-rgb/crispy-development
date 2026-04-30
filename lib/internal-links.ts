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
  // ── Assessments ────────────────────────────────────────────────────────────

  disc: [
    { slug: 'intercultural-communication', title: 'Intercultural Communication', reason: 'Adapt your communication style across cultures' },
    { slug: 'leadership-altitudes', title: 'Leadership Altitudes', reason: 'Apply DISC insights at every leadership level' },
    { slug: 'team-health', title: 'Team Health', reason: 'Use DISC to build stronger team dynamics' },
  ],
  'wheel-of-life': [
    { slug: 'sabbath-leadership', title: 'Sabbath Leadership', reason: 'Create sustainable rhythms across life domains' },
    { slug: 'sustainable-pace', title: 'Sustainable Pace', reason: 'Maintain health and balance long-term' },
    { slug: 'emotional-intelligence', title: 'Emotional Intelligence', reason: 'Develop EQ across every life area' },
  ],
  'three-thinking-styles': [
    { slug: 'six-thinking-hats', title: 'Six Thinking Hats', reason: 'Expand your thinking patterns deliberately' },
    { slug: 'cognitive-biases', title: 'Cognitive Biases', reason: 'Recognize blind spots in your thinking style' },
    { slug: 'decision-making', title: 'Decision Making', reason: 'Apply your thinking style to better decisions' },
  ],
  'karunia-rohani': [
    { slug: 'servant-leadership', title: 'Servant Leadership', reason: 'Deploy your gifts in service to others' },
    { slug: 'raising-next-generation', title: 'Raising the Next Generation', reason: 'Use your gifts to develop others' },
    { slug: 'leading-without-losing-faith', title: 'Leading Without Losing Faith', reason: 'Ground your gifts in faith-based leadership' },
  ],
  enneagram: [
    { slug: 'emotional-intelligence', title: 'Emotional Intelligence', reason: 'Grow your type\'s emotional awareness' },
    { slug: 'identity-under-pressure', title: 'Identity Under Pressure', reason: 'Stay grounded under stress' },
    { slug: 'overcoming-procrastination', title: 'Overcoming Procrastination', reason: 'Address your type\'s growth challenges' },
  ],

  'big-five': [
    { slug: 'emotional-intelligence', title: 'Emotional Intelligence', reason: 'Connect your personality to emotional skills' },
    { slug: 'managing-up', title: 'Managing Up', reason: 'Use your traits to manage relationships upward' },
    { slug: 'team-health', title: 'Team Health', reason: 'See how personality shapes team dynamics' },
  ],
  '16-personalities': [
    { slug: 'decision-making', title: 'Decision Making', reason: 'Align decisions with your personality type' },
    { slug: 'leadership-altitudes', title: 'Leadership Altitudes', reason: 'Lead at the right level for your type' },
    { slug: 'intercultural-communication', title: 'Intercultural Communication', reason: 'Navigate cultural differences with your type' },
  ],

  // ── Cross-Cultural Leadership ───────────────────────────────────────────────

  'cultural-intelligence': [
    { slug: 'intercultural-communication', title: 'Intercultural Communication', reason: 'Master cross-cultural dialogue' },
    { slug: 'building-trust-across-cultures', title: 'Building Trust Across Cultures', reason: 'Deepen relationships globally' },
    { slug: 'power-distance', title: 'Power Distance', reason: 'Understand cultural hierarchy dynamics' },
  ],
  'power-distance': [
    { slug: 'cultural-intelligence', title: 'Cultural Intelligence (CQ)', reason: 'Build the broader CQ framework' },
    { slug: 'giving-feedback-across-cultures', title: 'Giving Feedback Across Cultures', reason: 'Navigate hierarchy in feedback conversations' },
    { slug: 'managing-up', title: 'Managing Up', reason: 'Work with authority across cultural expectations' },
  ],
  'time-and-culture': [
    { slug: 'cultural-intelligence', title: 'Cultural Intelligence (CQ)', reason: 'Build the broader CQ framework' },
    { slug: 'intercultural-communication', title: 'Intercultural Communication', reason: 'Communicate across time perspectives' },
    { slug: 'understanding-high-context', title: 'High-Context Communication', reason: 'Read between the lines in time-flexible cultures' },
  ],
  'intercultural-communication': [
    { slug: 'cultural-intelligence', title: 'Cultural Intelligence (CQ)', reason: 'Develop the foundations for cross-cultural skill' },
    { slug: 'conflict-resolution', title: 'Conflict Resolution', reason: 'Resolve cross-cultural misunderstandings' },
    { slug: 'building-trust-across-cultures', title: 'Building Trust Across Cultures', reason: 'Build rapport across cultural differences' },
  ],
  'building-trust-across-cultures': [
    { slug: 'intercultural-communication', title: 'Intercultural Communication', reason: 'Communicate trust effectively across cultures' },
    { slug: 'relational-longevity', title: 'Relational Longevity', reason: 'Sustain trust over the long journey' },
    { slug: 'team-health', title: 'Team Health', reason: 'Build psychological safety in diverse teams' },
  ],
  'giving-feedback-across-cultures': [
    { slug: 'intercultural-communication', title: 'Intercultural Communication', reason: 'Navigate directness and indirectness' },
    { slug: 'conflict-resolution', title: 'Conflict Resolution', reason: 'Handle feedback that triggers conflict' },
    { slug: 'power-distance', title: 'Power Distance', reason: 'Understand hierarchy in feedback dynamics' },
  ],
  'conflict-resolution': [
    { slug: 'intercultural-communication', title: 'Intercultural Communication', reason: 'Resolve cross-cultural misunderstandings' },
    { slug: 'giving-feedback-across-cultures', title: 'Giving Feedback Across Cultures', reason: 'Navigate conflict through feedback' },
    { slug: 'building-trust-across-cultures', title: 'Building Trust Across Cultures', reason: 'Restore trust after conflict' },
  ],
  'understanding-high-context': [
    { slug: 'intercultural-communication', title: 'Intercultural Communication', reason: 'Build full cross-cultural communication skills' },
    { slug: 'power-distance', title: 'Power Distance', reason: 'Connect indirectness to hierarchy dynamics' },
    { slug: 'building-trust-across-cultures', title: 'Building Trust Across Cultures', reason: 'Earn trust in high-context relationships' },
  ],

  // ── Thinking & Decisions ───────────────────────────────────────────────────

  'six-thinking-hats': [
    { slug: 'three-thinking-styles', title: 'Three Thinking Styles', reason: 'Understand your default thinking pattern' },
    { slug: 'decision-making', title: 'Decision Making', reason: 'Apply structured thinking to decisions' },
    { slug: 'cognitive-biases', title: 'Cognitive Biases', reason: 'Identify thinking traps to avoid' },
  ],
  'cognitive-biases': [
    { slug: 'decision-making', title: 'Decision Making', reason: 'Make better decisions by knowing your biases' },
    { slug: 'ladder-of-inference', title: 'Ladder of Inference', reason: 'See how assumptions distort reasoning' },
    { slug: 'fixed-growth-mindset', title: 'Fixed vs Growth Mindset', reason: 'Overcome fixed mindset bias patterns' },
  ],
  'fixed-growth-mindset': [
    { slug: 'overcoming-procrastination', title: 'Overcoming Procrastination', reason: 'Growth mindset unlocks action' },
    { slug: 'escaping-the-comfort-zone', title: 'Escaping the Comfort Zone', reason: 'Apply growth mindset to stretch goals' },
    { slug: 'leaders-are-readers', title: 'Leaders Are Readers', reason: 'Grow your mindset through learning' },
  ],
  'decision-making': [
    { slug: 'cognitive-biases', title: 'Cognitive Biases', reason: 'Avoid bias in your decision process' },
    { slug: 'ladder-of-inference', title: 'Ladder of Inference', reason: 'Slow down your reasoning chain' },
    { slug: 'above-below-the-line', title: 'Above & Below the Line', reason: 'Make decisions from above the line' },
  ],
  'ladder-of-inference': [
    { slug: 'cognitive-biases', title: 'Cognitive Biases', reason: 'See how bias feeds the inference ladder' },
    { slug: 'decision-making', title: 'Decision Making', reason: 'Apply careful reasoning to decisions' },
    { slug: 'intercultural-communication', title: 'Intercultural Communication', reason: 'Avoid cultural misreadings on the ladder' },
  ],
  'johari-window': [
    { slug: 'emotional-intelligence', title: 'Emotional Intelligence', reason: 'Grow self-awareness and social skill' },
    { slug: 'disc', title: 'DISC Profile', reason: 'Expand your blind spots through profiling' },
    { slug: 'debriefing-reflection', title: 'Debriefing & Reflection', reason: 'Use reflection to open the blind window' },
  ],

  // ── Leadership ─────────────────────────────────────────────────────────────

  'leadership-altitudes': [
    { slug: 'vision-casting', title: 'Vision Casting', reason: 'Cast vision at the strategic altitude' },
    { slug: 'servant-leadership', title: 'Servant Leadership', reason: 'Lead at every altitude with humility' },
    { slug: 'team-health', title: 'Team Health', reason: 'Build healthy teams at the operational level' },
  ],
  'servant-leadership': [
    { slug: 'leadership-altitudes', title: 'Leadership Altitudes', reason: 'Lead at scale with a servant heart' },
    { slug: 'raising-next-generation', title: 'Raising the Next Generation', reason: 'Serve others by developing leaders' },
    { slug: 'team-health', title: 'Team Health', reason: 'Build teams that reflect servant culture' },
  ],
  'vision-casting': [
    { slug: 'leadership-altitudes', title: 'Leadership Altitudes', reason: 'Cast vision from the strategic altitude' },
    { slug: 'storytelling-leadership', title: 'Storytelling for Leaders', reason: 'Tell stories that carry your vision' },
    { slug: 'smart-goals', title: 'SMART Goals', reason: 'Translate vision into actionable goals' },
  ],
  'managing-up': [
    { slug: 'intercultural-communication', title: 'Intercultural Communication', reason: 'Navigate cultural dimensions of authority' },
    { slug: 'influential-leadership-framework', title: 'Influential Leadership', reason: 'Influence without formal authority' },
    { slug: 'above-below-the-line', title: 'Above & Below the Line', reason: 'Stay accountable when managing upward' },
  ],
  'storytelling-leadership': [
    { slug: 'vision-casting', title: 'Vision Casting', reason: 'Carry vision through powerful stories' },
    { slug: 'influential-leadership-framework', title: 'Influential Leadership', reason: 'Use stories to expand your influence' },
    { slug: 'intercultural-communication', title: 'Intercultural Communication', reason: 'Adapt stories for cross-cultural audiences' },
  ],
  'smart-goals': [
    { slug: 'vision-casting', title: 'Vision Casting', reason: 'Connect goals back to vision' },
    { slug: 'red-light-green-light', title: 'Red Light Green Light', reason: 'Know when to push goals forward or pause' },
    { slug: 'debriefing-reflection', title: 'Debriefing & Reflection', reason: 'Review progress on your goals' },
  ],
  'above-below-the-line': [
    { slug: 'fixed-growth-mindset', title: 'Fixed vs Growth Mindset', reason: 'Above-the-line thinking requires growth mindset' },
    { slug: 'emotional-intelligence', title: 'Emotional Intelligence', reason: 'EQ helps you stay above the line' },
    { slug: 'team-health', title: 'Team Health', reason: 'Build accountability culture in your team' },
  ],
  'red-light-green-light': [
    { slug: 'decision-making', title: 'Decision Making', reason: 'Apply structured decision frameworks' },
    { slug: 'smart-goals', title: 'SMART Goals', reason: 'Know when to accelerate your goals' },
    { slug: 'leadership-altitudes', title: 'Leadership Altitudes', reason: 'Make timing decisions at the right level' },
  ],
  'raising-next-generation': [
    { slug: 'servant-leadership', title: 'Servant Leadership', reason: 'Develop others through servant-hearted investment' },
    { slug: 'team-health', title: 'Team Health', reason: 'Build teams that develop next-gen leaders' },
    { slug: 'vision-casting', title: 'Vision Casting', reason: 'Cast a vision that inspires the next generation' },
  ],
  'team-health': [
    { slug: 'building-trust-across-cultures', title: 'Building Trust Across Cultures', reason: 'Create psychological safety in diverse teams' },
    { slug: 'above-below-the-line', title: 'Above & Below the Line', reason: 'Build accountability in your team culture' },
    { slug: 'servant-leadership', title: 'Servant Leadership', reason: 'Lead with a heart that serves the team' },
  ],

  // ── Personal Growth ────────────────────────────────────────────────────────

  'emotional-intelligence': [
    { slug: 'overcoming-procrastination', title: 'Overcoming Procrastination', reason: 'Use EQ to understand what holds you back' },
    { slug: 'healthy-transitions', title: 'Managing Healthy Transitions', reason: 'Handle change with emotional resilience' },
    { slug: 'psychological-first-aid', title: 'Psychological First Aid', reason: 'Support others with emotional intelligence' },
  ],
  'overcoming-procrastination': [
    { slug: 'fixed-growth-mindset', title: 'Fixed vs Growth Mindset', reason: 'Mindset shifts unlock action' },
    { slug: 'escaping-the-comfort-zone', title: 'Escaping the Comfort Zone', reason: 'Move from stalling to stretching' },
    { slug: 'smart-goals', title: 'SMART Goals', reason: 'Set goals that create momentum' },
  ],
  'escaping-the-comfort-zone': [
    { slug: 'fixed-growth-mindset', title: 'Fixed vs Growth Mindset', reason: 'Growth mindset powers the leap' },
    { slug: 'identity-under-pressure', title: 'Identity Under Pressure', reason: 'Stay grounded when venturing into the unknown' },
    { slug: 'leaders-are-readers', title: 'Leaders Are Readers', reason: 'Read your way into new territory' },
  ],
  'sabbath-leadership': [
    { slug: 'sustainable-pace', title: 'Sustainable Pace', reason: 'Build rest into your leadership rhythm' },
    { slug: 'understanding-burnout', title: 'Understanding Burnout', reason: 'Prevent burnout through intentional rest' },
    { slug: 'wheel-of-life', title: 'Wheel of Life', reason: 'Assess balance across your life domains' },
  ],
  'leaders-are-readers': [
    { slug: 'attention-retention', title: 'Attention & Retention', reason: 'Get more from what you read' },
    { slug: 'fixed-growth-mindset', title: 'Fixed vs Growth Mindset', reason: 'Reading grows your growth mindset' },
    { slug: 'debriefing-reflection', title: 'Debriefing & Reflection', reason: 'Reflect on what you learn from books' },
  ],
  'attention-retention': [
    { slug: 'leaders-are-readers', title: 'Leaders Are Readers', reason: 'Retain more from the books you read' },
    { slug: 'debriefing-reflection', title: 'Debriefing & Reflection', reason: 'Debrief to deepen retention' },
    { slug: 'fixed-growth-mindset', title: 'Fixed vs Growth Mindset', reason: 'A growth mindset fuels learning retention' },
  ],
  'debriefing-reflection': [
    { slug: 'leaders-are-readers', title: 'Leaders Are Readers', reason: 'Reflect on what you read' },
    { slug: 'smart-goals', title: 'SMART Goals', reason: 'Review whether your goals are on track' },
    { slug: 'above-below-the-line', title: 'Above & Below the Line', reason: 'Reflect honestly on your accountability' },
  ],

  // ── Additional / Specialty ─────────────────────────────────────────────────

  'emotional-safety-families': [
    { slug: 'psychological-first-aid', title: 'Psychological First Aid', reason: 'Support family members in crisis' },
    { slug: 'emotional-intelligence', title: 'Emotional Intelligence', reason: 'Build EQ for healthier family relationships' },
    { slug: 'relational-longevity', title: 'Relational Longevity', reason: 'Sustain healthy family bonds long-term' },
  ],
  'healthy-transitions': [
    { slug: 'returning-well', title: 'Returning Well', reason: 'Apply transition skills to repatriation' },
    { slug: 'identity-under-pressure', title: 'Identity Under Pressure', reason: 'Stay grounded through change' },
    { slug: 'emotional-intelligence', title: 'Emotional Intelligence', reason: 'Navigate transitions with emotional resilience' },
  ],
  'identity-under-pressure': [
    { slug: 'leading-without-losing-faith', title: 'Leading Without Losing Faith', reason: 'Hold your identity when leadership is hard' },
    { slug: 'healthy-transitions', title: 'Managing Healthy Transitions', reason: 'Maintain identity through major transitions' },
    { slug: 'sabbath-leadership', title: 'Sabbath Leadership', reason: 'Rest rebuilds identity under pressure' },
  ],
  'influential-leadership-framework': [
    { slug: 'managing-up', title: 'Managing Up', reason: 'Influence without authority at every level' },
    { slug: 'storytelling-leadership', title: 'Storytelling for Leaders', reason: 'Use stories to expand your influence' },
    { slug: 'servant-leadership', title: 'Servant Leadership', reason: 'Influence through serving others first' },
  ],
  'leading-without-losing-faith': [
    { slug: 'identity-under-pressure', title: 'Identity Under Pressure', reason: 'Ground your identity in faith under pressure' },
    { slug: 'servant-leadership', title: 'Servant Leadership', reason: 'Lead with faith-fueled servant posture' },
    { slug: 'sabbath-leadership', title: 'Sabbath Leadership', reason: 'Sustain faith through rhythms of rest' },
  ],
  'psychological-first-aid': [
    { slug: 'emotional-intelligence', title: 'Emotional Intelligence', reason: 'Use EQ to support those in crisis' },
    { slug: 'emotional-safety-families', title: 'Emotional Safety in Families', reason: 'Create safety for those returning from trauma' },
    { slug: 'healthy-transitions', title: 'Managing Healthy Transitions', reason: 'Help others through difficult transitions' },
  ],
  'relational-longevity': [
    { slug: 'building-trust-across-cultures', title: 'Building Trust Across Cultures', reason: 'Build trust that sustains long-term' },
    { slug: 'emotional-intelligence', title: 'Emotional Intelligence', reason: 'EQ sustains long-term relationships' },
    { slug: 'sustainable-pace', title: 'Sustainable Pace', reason: 'A sustainable pace protects your relationships' },
  ],
  'returning-well': [
    { slug: 'healthy-transitions', title: 'Managing Healthy Transitions', reason: 'Apply transition principles to repatriation' },
    { slug: 'identity-under-pressure', title: 'Identity Under Pressure', reason: 'Recalibrate identity after returning' },
    { slug: 'psychological-first-aid', title: 'Psychological First Aid', reason: 'Support others who are struggling on return' },
  ],
  'sustainable-pace': [
    { slug: 'sabbath-leadership', title: 'Sabbath Leadership', reason: 'Rest is the engine of sustainable pace' },
    { slug: 'understanding-burnout', title: 'Understanding Burnout', reason: 'Know the signs before pace becomes burnout' },
    { slug: 'wheel-of-life', title: 'Wheel of Life', reason: 'Assess sustainability across all life areas' },
  ],
  'understanding-burnout': [
    { slug: 'sabbath-leadership', title: 'Sabbath Leadership', reason: 'Rest is the primary antidote to burnout' },
    { slug: 'sustainable-pace', title: 'Sustainable Pace', reason: 'Build rhythms that prevent burnout' },
    { slug: 'emotional-intelligence', title: 'Emotional Intelligence', reason: 'Recognize emotional burnout signs early' },
  ],

  // ── Training ───────────────────────────────────────────────────────────────

  'zoom-training': [
    { slug: 'attention-retention', title: 'Attention & Retention', reason: 'Keep virtual participants engaged and learning' },
    { slug: 'intercultural-communication', title: 'Intercultural Communication', reason: 'Facilitate cross-cultural virtual sessions' },
    { slug: 'teams-training', title: 'Teams Training', reason: 'Also train on Microsoft Teams' },
  ],
  'zoom-training-id': [
    { slug: 'attention-retention', title: 'Attention & Retention', reason: 'Pertahankan keterlibatan peserta virtual' },
    { slug: 'intercultural-communication', title: 'Intercultural Communication', reason: 'Fasilitasi sesi virtual lintas budaya' },
    { slug: 'teams-training-id', title: 'Teams Training (ID)', reason: 'Pelajari juga Microsoft Teams' },
  ],
  'teams-training': [
    { slug: 'attention-retention', title: 'Attention & Retention', reason: 'Keep virtual participants engaged and learning' },
    { slug: 'intercultural-communication', title: 'Intercultural Communication', reason: 'Facilitate cross-cultural virtual sessions' },
    { slug: 'zoom-training', title: 'Zoom Training', reason: 'Also train on Zoom' },
  ],
  'teams-training-id': [
    { slug: 'attention-retention', title: 'Attention & Retention', reason: 'Pertahankan keterlibatan peserta virtual' },
    { slug: 'intercultural-communication', title: 'Intercultural Communication', reason: 'Fasilitasi sesi virtual lintas budaya' },
    { slug: 'zoom-training-id', title: 'Zoom Training (ID)', reason: 'Pelajari juga Zoom' },
  ],
};

/**
 * Get related resources for a given resource slug
 */
export function getRelatedResources(slug: string): LinkedResource[] {
  return internalLinkMap[slug] || [];
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

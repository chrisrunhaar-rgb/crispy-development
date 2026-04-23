/**
 * Content Search Configuration
 *
 * Keywords and setup for daily /loop content searches
 * Feeds into content calendar for CLEO (content creator)
 */

export interface SearchKeyword {
  keyword: string;
  aliases: string[];
  category: string;
  priority: 'high' | 'medium' | 'low';
}

export const contentSearchKeywords: SearchKeyword[] = [
  // High priority cross-cultural topics
  {
    keyword: 'cross-cultural leadership',
    aliases: ['multicultural teams', 'global leadership', 'intercultural management'],
    category: 'cross-cultural',
    priority: 'high',
  },
  {
    keyword: 'intercultural communication',
    aliases: ['cross-cultural communication', 'global communication', 'cultural differences'],
    category: 'cross-cultural',
    priority: 'high',
  },
  {
    keyword: 'expat leadership',
    aliases: ['expatriate management', 'global mobility', 'international assignment'],
    category: 'cross-cultural',
    priority: 'high',
  },
  {
    keyword: 'cultural intelligence',
    aliases: ['CQ', 'cultural competence', 'cultural awareness'],
    category: 'cross-cultural',
    priority: 'high',
  },
  {
    keyword: 'global teams',
    aliases: ['remote teams', 'distributed teams', 'virtual teams'],
    category: 'cross-cultural',
    priority: 'high',
  },

  // Medium priority leadership topics
  {
    keyword: 'servant leadership',
    aliases: ['leadership purpose', 'authentic leadership', 'humble leadership'],
    category: 'leadership',
    priority: 'medium',
  },
  {
    keyword: 'emotional intelligence leadership',
    aliases: ['EQ in leadership', 'emotional awareness', 'emotional regulation'],
    category: 'leadership',
    priority: 'medium',
  },
  {
    keyword: 'vision casting',
    aliases: ['leadership vision', 'strategic vision', 'purpose-driven'],
    category: 'leadership',
    priority: 'medium',
  },
  {
    keyword: 'team health',
    aliases: ['team dynamics', 'team culture', 'psychological safety'],
    category: 'leadership',
    priority: 'medium',
  },
  {
    keyword: 'leadership development',
    aliases: ['leader training', 'leadership coaching', 'emerging leaders'],
    category: 'leadership',
    priority: 'medium',
  },

  // Personal development
  {
    keyword: 'burnout prevention',
    aliases: ['work-life balance', 'sustainable pace', 'rest and renewal'],
    category: 'personal',
    priority: 'medium',
  },
  {
    keyword: 'resilience',
    aliases: ['overcoming adversity', 'bounce back', 'stress management'],
    category: 'personal',
    priority: 'medium',
  },
  {
    keyword: 'identity and purpose',
    aliases: ['calling', 'life purpose', 'meaning'],
    category: 'personal',
    priority: 'low',
  },

  // Faith-based (optional, depends on audience)
  {
    keyword: 'faith in leadership',
    aliases: ['Christian leadership', 'spiritual leadership', 'values-based leadership'],
    category: 'faith',
    priority: 'low',
  },
];

/**
 * Google Alerts configuration
 * Setup these in Google Alerts for daily/weekly digest
 */
export const googleAlertsSetup = [
  'cross-cultural leadership',
  'intercultural communication',
  'expat leadership',
  'global teams management',
  'emotional intelligence leaders',
  'leadership burnout',
];

/**
 * RSS feeds to subscribe to for content research
 * Mix of general leadership, cross-cultural, and research sources
 */
export const rssFeeds = [
  {
    name: 'Harvard Business Review',
    url: 'https://feeds.harvardbusiness.org/harvardbusiness/feed.rss',
    topics: ['leadership', 'cross-cultural', 'teams'],
  },
  {
    name: 'McKinsey & Company',
    url: 'https://www.mckinsey.com/feed/rss',
    topics: ['leadership', 'teams', 'global'],
  },
  {
    name: 'Forbes Leadership',
    url: 'https://www.forbes.com/leadership/feed/',
    topics: ['leadership'],
  },
  {
    name: 'Medium Leadership',
    url: 'https://medium.com/feed/tag/leadership',
    topics: ['leadership', 'personal-development'],
  },
  {
    name: 'Cultural Intelligence Center',
    url: 'https://www.cultural-intelligence.org/feed/',
    topics: ['cross-cultural', 'CQ'],
  },
];

/**
 * Content calendar integration points
 * Where to send discovered content
 */
export const contentOutputTargets = {
  mailchimp: {
    name: 'Mailchimp',
    description: 'News from Asia newsletter',
    frequency: 'quarterly',
  },
  telegramGroup: {
    name: 'Telegram Group',
    id: -5284611571,
    description: 'Blog & Newsletter content group',
    frequency: 'daily',
  },
  supabase: {
    name: 'Supabase',
    table: 'content_ideas',
    description: 'Store discovered content for review',
  },
};

/**
 * /loop automation schedule
 */
export const loopSchedule = {
  frequency: 'daily',
  time: '09:00', // 9 AM
  timezone: 'UTC+8', // Singapore/Malaysia
  commands: [
    'google-alerts-fetch',
    'rss-feed-parse',
    'trending-topics-fetch',
    'ai-summarize',
    'content-suggestions',
  ],
};

/**
 * Content analysis prompt for CLEO
 */
export const contentAnalysisPrompt = `
Analyze the following curated content and suggest blog post or resource angles for Crispy Development.

Focus on:
1. Actionable insights for cross-cultural leaders
2. Connection to assessments (DISC, Enneagram, etc.)
3. Unique angle Chris hasn't covered
4. Storytelling/narrative potential

Output format:
- Topic
- Why it matters (1-2 sentences)
- Suggested angle/format
- Connection to Chris's resources
`;

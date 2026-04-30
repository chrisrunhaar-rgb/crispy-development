#!/usr/bin/env node
const fs = require('fs');
const path = require('path');

const RESOURCE_MAPPINGS = {
  'disc': 'disc',
  'wheel-of-life': 'wheel-of-life',
  'three-thinking-styles': 'three-thinking-styles',
  'karunia-rohani': 'karunia-rohani',
  'enneagram': 'enneagram',

  'big-five': 'big-five',
  '16-personalities': '16-personalities',
  'cultural-intelligence': 'cultural-intelligence',
  'power-distance': 'power-distance',
  'time-and-culture': 'time-and-culture',
  'intercultural-communication': 'intercultural-communication',
  'building-trust-across-cultures': 'building-trust-across-cultures',
  'giving-feedback-across-cultures': 'giving-feedback-across-cultures',
  'conflict-resolution': 'conflict-resolution',
  'six-thinking-hats': 'six-thinking-hats',
  'cognitive-biases': 'cognitive-biases',
  'fixed-growth-mindset': 'fixed-growth-mindset',
  'decision-making': 'decision-making',
  'ladder-of-inference': 'ladder-of-inference',
  'johari-window': 'johari-window',
  'leadership-altitudes': 'leadership-altitudes',
  'servant-leadership': 'servant-leadership',
  'vision-casting': 'vision-casting',
  'managing-up': 'managing-up',
  'storytelling-leadership': 'storytelling-leadership',
  'smart-goals': 'smart-goals',
  'above-below-the-line': 'above-below-the-line',
  'red-light-green-light': 'red-light-green-light',
  'raising-next-generation': 'raising-next-generation',
  'team-health': 'team-health',
  'emotional-intelligence': 'emotional-intelligence',
  'overcoming-procrastination': 'overcoming-procrastination',
  'escaping-the-comfort-zone': 'escaping-the-comfort-zone',
  'sabbath-leadership': 'sabbath-leadership',
  'leaders-are-readers': 'leaders-are-readers',
  'attention-retention': 'attention-retention',
  'debriefing-reflection': 'debriefing-reflection',
  'emotional-safety-families': 'emotional-safety-families',
  'healthy-transitions': 'healthy-transitions',
  'identity-under-pressure': 'identity-under-pressure',
  'influential-leadership-framework': 'influential-leadership-framework',
  'leading-without-losing-faith': 'leading-without-losing-faith',
  'psychological-first-aid': 'psychological-first-aid',
  'relational-longevity': 'relational-longevity',
  'returning-well': 'returning-well',
  'sustainable-pace': 'sustainable-pace',
  'understanding-burnout': 'understanding-burnout',
  'understanding-high-context': 'understanding-high-context',
  'zoom-training': 'zoom-training',
  'zoom-training-id': 'zoom-training-id',
  'teams-training': 'teams-training',
  'teams-training-id': 'teams-training-id',
};

const RESOURCE_DIR = path.join(__dirname, '../app/(marketing)/resources');

// Template for updated page.tsx files
function generatePageTemplate(slug) {
  const componentName = slug.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join('') + 'Client';
  const clientFilePath = `./${componentName}`;

  return `import { Metadata } from "next";
import Script from "next/script";
import { createClient } from "@/lib/supabase/server";
import { getResourceMetadata } from "@/config/seo-metadata";
import { generateBreadcrumbSchema, generateCanonicalUrl } from "@/lib/seo-utils";
import ${componentName} from "${clientFilePath}";

export const dynamic = "force-dynamic";

const RESOURCE_SLUG = "${slug}";
const resourceMeta = getResourceMetadata(RESOURCE_SLUG);
const breadcrumbSchema = generateBreadcrumbSchema([
  { name: "Home", url: "https://crispyleaders.com" },
  { name: "Resources", url: "https://crispyleaders.com/resources" },
  { name: resourceMeta.title.split(" — ")[0], url: generateCanonicalUrl(\`/resources/\${RESOURCE_SLUG}\`) },
]);

export const metadata: Metadata = {
  title: resourceMeta.title,
  description: resourceMeta.description,
  canonical: generateCanonicalUrl(\`/resources/\${RESOURCE_SLUG}\`),
};

export default async function ResourcePage({
  searchParams,
}: {
  searchParams: Promise<{ tab?: string }>;
}) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  const savedResources = (user?.user_metadata?.saved_resources ?? []) as string[];
  const isSaved = savedResources.includes(RESOURCE_SLUG);

  return (
    <>
      <Script
        id={\`breadcrumb-\${RESOURCE_SLUG}\`}
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(breadcrumbSchema),
        }}
      />
      <${componentName} isSaved={isSaved} />
    </>
  );
}
`;
}

console.log('SEO Update Script');
console.log('================');
console.log('This script would update all resource pages.');
console.log('Resource slugs found:', Object.keys(RESOURCE_MAPPINGS).length);
console.log('\nManual updates needed:');
console.log('1. Run "npm run seo:update" to apply changes');
console.log('2. Each resource page will be updated with:');
console.log('   - New metadata from seo-metadata.ts');
console.log('   - Canonical tags');
console.log('   - Breadcrumb schema');
console.log('3. Verify all pages load correctly');

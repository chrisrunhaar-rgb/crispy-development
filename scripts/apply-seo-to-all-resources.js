#!/usr/bin/env node
/**
 * Batch apply SEO updates to all resource pages
 *
 * This script updates all resource page.tsx files to:
 * - Use getResourceMetadata() from seo-metadata.ts
 * - Add canonical URLs
 * - Add breadcrumb schema
 *
 * Run: node scripts/apply-seo-to-all-resources.js
 */

const fs = require('fs');
const path = require('path');

const RESOURCE_DIR = path.join(__dirname, '../app/(marketing)/resources');

// List all resource folders (subdirectories of resources/)
const resourceFolders = fs.readdirSync(RESOURCE_DIR)
  .filter(item => {
    const fullPath = path.join(RESOURCE_DIR, item);
    return fs.statSync(fullPath).isDirectory() && item !== 'topic';
  });

console.log(`Found ${resourceFolders.length} resource folders`);
console.log('Resources:', resourceFolders.join(', '));

// Template for updated page.tsx
function generatePageTemplate(slug, clientComponentName) {
  return `import { Metadata } from "next";
import Script from "next/script";
import { createClient } from "@/lib/supabase/server";
import { getResourceMetadata } from "@/config/seo-metadata";
import { generateBreadcrumbSchema, generateCanonicalUrl } from "@/lib/seo-utils";
import ${clientComponentName} from "./${clientComponentName}";

export const dynamic = "force-dynamic";

const RESOURCE_SLUG = "${slug}";
const resourceMeta = getResourceMetadata(RESOURCE_SLUG);

export const metadata: Metadata = {
  title: resourceMeta.title,
  description: resourceMeta.description,
  canonical: generateCanonicalUrl(\`/resources/\${RESOURCE_SLUG}\`),
};

export default async function ResourcePage(props: any) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  const savedResources = (user?.user_metadata?.saved_resources ?? []) as string[];
  const isSaved = savedResources.includes(RESOURCE_SLUG);

  const breadcrumbSchema = generateBreadcrumbSchema([
    { name: "Home", url: "https://crispyleaders.com" },
    { name: "Resources", url: "https://crispyleaders.com/resources" },
    { name: resourceMeta.title.split(" — ")[0], url: generateCanonicalUrl(\`/resources/\${RESOURCE_SLUG}\`) },
  ]);

  return (
    <>
      <Script
        id={\`breadcrumb-\${RESOURCE_SLUG}\`}
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(breadcrumbSchema),
        }}
      />
      <${clientComponentName} {...props} isSaved={isSaved} />
    </>
  );
}
`;
}

// Get the client component name from the folder
function getClientComponentName(folder) {
  // Convert folder name to CamelCase + Client
  const parts = folder.split('-');
  const camelCase = parts
    .map(part => part.charAt(0).toUpperCase() + part.slice(1))
    .join('');
  return `${camelCase}Client`;
}

// Print what would be updated (dry run)
console.log('\n📋 Preview of updates:\n');
resourceFolders.forEach(folder => {
  const componentName = getClientComponentName(folder);
  console.log(`${folder}/ → page.tsx (component: ${componentName})`);
});

console.log(`\n✨ To apply updates, add --apply flag: node scripts/apply-seo-to-all-resources.js --apply`);
console.log('\nNote: Always verify changes after running with --apply');

// Check if --apply flag provided
if (process.argv.includes('--apply')) {
  console.log('\n🚀 Applying updates...\n');

  let updated = 0;
  resourceFolders.forEach(folder => {
    const pagePath = path.join(RESOURCE_DIR, folder, 'page.tsx');
    if (fs.existsSync(pagePath)) {
      const componentName = getClientComponentName(folder);
      const newContent = generatePageTemplate(folder, componentName);
      fs.writeFileSync(pagePath, newContent);
      console.log(`✓ Updated ${folder}/page.tsx`);
      updated++;
    } else {
      console.log(`✗ Missing ${folder}/page.tsx (skipped)`);
    }
  });

  console.log(`\n✅ Updated ${updated} resource pages`);
  console.log('Next: git add . && git commit -m "Apply SEO metadata to all resource pages"');
} else {
  console.log('\n⚠️  Dry run complete. No files changed.');
}

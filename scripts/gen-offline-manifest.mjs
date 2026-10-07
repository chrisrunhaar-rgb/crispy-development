// Lists every image in public/images/resources/<slug>/ so the dashboard's
// "Save offline" button knows which pictures a module and its slideshow need.
// Runs before every build (prebuild). Output: public/offline-manifest.json
import { readdirSync, statSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const root = join(process.cwd(), "public", "images", "resources");
const manifest = {};

function walk(dir, base) {
  const out = [];
  for (const name of readdirSync(dir)) {
    const full = join(dir, name);
    if (statSync(full).isDirectory()) out.push(...walk(full, `${base}/${name}`));
    else out.push(`${base}/${name}`);
  }
  return out;
}

for (const slug of readdirSync(root)) {
  const dir = join(root, slug);
  if (statSync(dir).isDirectory()) manifest[slug] = walk(dir, `/images/resources/${slug}`);
}

writeFileSync(join(process.cwd(), "public", "offline-manifest.json"), JSON.stringify(manifest));
console.log(`offline-manifest: ${Object.keys(manifest).length} modules`);

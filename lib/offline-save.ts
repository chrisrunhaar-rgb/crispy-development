// "Save offline" for dashboard module tiles. Downloads the module page (and
// its slideshow, if it has one) plus every script, style, font and picture
// they need into the service worker's offline cache. public/sw.js serves
// them when there is no internet. Re-saving replaces the old copy.

const OFFLINE = "crispy-offline-v1"; // must match public/sw.js

export function offlineSupported() {
  return typeof window !== "undefined" && "caches" in window && "serviceWorker" in navigator;
}

export async function isSavedOffline(pagePath: string) {
  if (!offlineSupported()) return false;
  const cache = await caches.open(OFFLINE);
  return !!(await cache.match(pagePath, { ignoreSearch: true, ignoreVary: true }));
}

function decode(s: string) {
  return s.replace(/&amp;/g, "&").replace(/\\u0026/g, "&");
}

// Every same-origin file a page's HTML points to
function assetsIn(html: string) {
  const found = new Set<string>();
  for (const m of html.matchAll(/\/_next\/static\/[^"'\\\s)<>,]+/g)) found.add(m[0]);
  // Chunk lists inside the page data sometimes drop the /_next prefix
  for (const m of html.matchAll(/["']static\/(?:chunks|css|media)\/[^"'\\\s]+/g)) found.add(`/_next/${m[0].slice(1)}`);
  for (const m of html.matchAll(/\/_next\/image\?url=[^"'\\\s,<>]+/g)) found.add(decode(m[0]));
  for (const m of html.matchAll(/["'(]\/(?:images\/[^"'\\\s)<>,]+|[\w-]+\.(?:png|jpe?g|webp|svg|ico))/g)) found.add(m[0].slice(1));
  return found;
}

export async function saveOffline(slug: string, pagePath: string, hasSlideshow: boolean, hasOnePager = false) {
  if (!navigator.serviceWorker.controller) await navigator.serviceWorker.ready;
  const cache = await caches.open(OFFLINE);
  const pages = [pagePath, ...(hasSlideshow ? [`/resources/${slug}/present`] : []), ...(hasOnePager ? [`/resources/${slug}/one-pager`] : [])];
  const assets = new Set<string>();

  for (const p of pages) {
    const res = await fetch(p, { credentials: "same-origin", cache: "no-store" });
    // A redirect means the member lost access or was logged out
    if (!res.ok || res.redirected) throw new Error(`page ${p} ${res.status}`);
    const html = await res.text();
    await cache.put(p, new Response(html, { headers: { "Content-Type": "text/html; charset=utf-8" } }));
    assetsIn(html).forEach(a => assets.add(a));
  }

  try {
    const manifest: Record<string, string[]> = await fetch("/offline-manifest.json", { cache: "no-store" }).then(r => r.json());
    (manifest[slug] ?? []).forEach(a => assets.add(a));
  } catch {
    // No manifest (local dev): the pictures in the HTML still get saved
  }
  assets.add("/logo-icon.png");

  // Stylesheets point at fonts; save those too
  const css = [...assets].filter(a => a.endsWith(".css"));
  await Promise.all(css.map(async href => {
    try {
      const text = await fetch(href).then(r => r.text());
      for (const m of text.matchAll(/url\((?:["']?)(\/_next\/static\/[^"')]+)/g)) assets.add(m[1]);
    } catch { /* counted below */ }
  }));

  let failed = 0;
  const list = [...assets];
  // A few at a time so a slow phone connection is not swamped
  for (let i = 0; i < list.length; i += 6) {
    await Promise.all(list.slice(i, i + 6).map(async a => {
      try {
        const res = await fetch(a);
        if (res.ok) await cache.put(a, res);
        else failed++;
      } catch { failed++; }
    }));
  }
  return { files: list.length, failed };
}

export async function removeOffline(slug: string, pagePath: string) {
  if (!offlineSupported()) return;
  const cache = await caches.open(OFFLINE);
  await cache.delete(pagePath, { ignoreSearch: true });
  await cache.delete(`/resources/${slug}/present`, { ignoreSearch: true });
  await cache.delete(`/resources/${slug}/one-pager`, { ignoreSearch: true });
}

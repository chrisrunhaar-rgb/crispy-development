const CACHE = "crispy-v4";
// Modules a member saved with "Save offline" on the dashboard. Filled by
// lib/offline-save.ts, never cleared on update, so a saved module keeps working.
const OFFLINE = "crispy-offline-v1";
const PRECACHE = ["/", "/dashboard", "/personal", "/team", "/resources", "/login", "/signup"];

self.addEventListener("install", (e) => {
  e.waitUntil(caches.open(CACHE).then((c) => c.addAll(PRECACHE)));
  self.skipWaiting();
});

self.addEventListener("activate", (e) => {
  e.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter((k) => k !== CACHE && k !== OFFLINE).map((k) => caches.delete(k)))
    )
  );
  self.clients.claim();
});

// Shown offline for a page that was never saved or visited
function offlinePage() {
  const html = `<!doctype html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Offline</title></head>
<body style="margin:0;min-height:100vh;display:flex;align-items:center;justify-content:center;background:#f7f5f0;font-family:Montserrat,system-ui,sans-serif;color:#1c2333;padding:24px;box-sizing:border-box">
<div style="max-width:420px;text-align:center"><img src="/logo-icon.png" width="48" height="48" alt="">
<h1 style="font-size:1.25rem;margin:16px 0 8px">You're offline</h1>
<p style="line-height:1.6;margin:0 0 6px">This page isn't saved on this device. Modules you saved with <b>Offline</b> on your dashboard still work.</p>
<p style="line-height:1.6;margin:0 0 20px;color:#5b6475">Anda sedang offline. Halaman ini belum disimpan di perangkat ini. Modul yang disimpan dengan <b>Offline</b> di dasbor tetap bisa dibuka.</p>
<a href="/dashboard" style="display:inline-block;padding:12px 20px;background:#1a2a5c;color:#fff;text-decoration:none;font-weight:700;border-radius:6px">Dashboard / Dasbor</a></div></body></html>`;
  return new Response(html, { headers: { "Content-Type": "text/html; charset=utf-8" } });
}

// ── Push Notifications ────────────────────────────────────────────────────

self.addEventListener("push", (e) => {
  if (!e.data) return;

  let payload;
  try {
    payload = e.data.json();
  } catch {
    payload = { title: "Crispy Development", body: e.data.text() };
  }

  const title = payload.title || "Crispy Development";
  const options = {
    body: payload.body || "",
    icon: "/logo-icon.png",
    badge: "/logo-icon.png",
    data: payload.data || {},
    tag: payload.tag || "crispy-notification",
    renotify: true,
  };

  e.waitUntil(self.registration.showNotification(title, options));
});

self.addEventListener("notificationclick", (e) => {
  e.notification.close();
  const url = e.notification.data?.url || "/dashboard";

  e.waitUntil(
    self.clients.matchAll({ type: "window", includeUncontrolled: true }).then((clients) => {
      const existing = clients.find((c) => c.url.includes(self.location.origin));
      if (existing) {
        existing.focus();
        existing.navigate(url);
        return;
      }
      return self.clients.openWindow(url);
    })
  );
});

// ── Fetch (caching) ────────────────────────────────────────────────────────

self.addEventListener("fetch", (e) => {
  if (e.request.method !== "GET") return;
  const url = new URL(e.request.url);
  // Navigation requests: network-first; offline, a saved module first, then
  // whatever was last seen
  if (e.request.mode === "navigate") {
    e.respondWith(
      fetch(e.request)
        .then((res) => {
          const clone = res.clone();
          caches.open(CACHE).then((c) => c.put(e.request, clone));
          return res;
        })
        .catch(async () => {
          const saved = await caches.open(OFFLINE).then((c) => c.match(url.pathname, { ignoreSearch: true, ignoreVary: true }));
          return saved || (await caches.match(e.request, { ignoreVary: true })) || offlinePage();
        })
    );
    return;
  }
  // Only same-origin static files are cached. Page data (RSC), API calls and
  // other sites (Supabase, Stripe) always go to the network so they stay fresh.
  if (url.origin !== self.location.origin) return;
  const isStatic = url.pathname.startsWith("/_next/static/") || url.pathname.startsWith("/_next/image")
    || url.pathname.startsWith("/images/") || /\.(png|jpe?g|webp|svg|ico|woff2?|css|js)$/.test(url.pathname);
  if (!isStatic || e.request.headers.get("RSC")) return;
  // Static assets: cache-first
  e.respondWith(
    caches.match(e.request, { ignoreVary: true }).then((cached) => {
      if (cached) return cached;
      return fetch(e.request).then((res) => {
        if (res.ok) {
          const clone = res.clone();
          caches.open(CACHE).then((c) => c.put(e.request, clone));
        }
        return res;
      });
    })
  );
});

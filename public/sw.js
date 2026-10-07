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
          return saved || caches.match(e.request, { ignoreVary: true });
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

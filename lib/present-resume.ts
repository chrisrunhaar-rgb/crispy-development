// Keeps a slideshow on the same slide when the language is switched.
// The switch refreshes server data; if that ever reloads the page, the deck
// picks up where it was instead of going back to slide 1.

const KEY = "present-resume";
const MAX_AGE_MS = 20000;

export function saveResume(i: number, s: number) {
  try {
    sessionStorage.setItem(KEY, JSON.stringify({ p: location.pathname, i, s, t: Date.now() }));
  } catch {}
}

export function takeResume(last: number): { i: number; s: number } | null {
  try {
    const raw = sessionStorage.getItem(KEY);
    if (!raw) return null;
    sessionStorage.removeItem(KEY);
    const r = JSON.parse(raw);
    if (r.p !== location.pathname || Date.now() - r.t > MAX_AGE_MS) return null;
    const i = Math.max(0, Math.min(last, Number(r.i) || 0));
    return { i, s: i === r.i ? Math.max(0, Number(r.s) || 0) : 0 };
  } catch {
    return null;
  }
}

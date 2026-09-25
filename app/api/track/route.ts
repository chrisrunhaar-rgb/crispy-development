import { NextResponse, type NextRequest } from "next/server";
import { createHash } from "crypto";
import { createAdminClient } from "@/lib/supabase/admin";

// First-party, cookieless visit counter. No raw IP is stored: visitors are
// identified by a hash of IP + user agent + a secret salt that rotates daily,
// so the same person cannot be followed across days.

const BOT_RE = /bot|crawl|spider|slurp|headless|lighthouse|preview|facebookexternalhit|embedly|whatsapp|telegram|discord|curl|wget|python|axios|node-fetch|vercel|monitor|pingdom|uptime/i;
const OWN_HOSTS = new Set(["crispyleaders.com", "www.crispyleaders.com"]);

function clip(v: unknown, max = 200): string | null {
  if (typeof v !== "string") return null;
  const s = v.trim();
  return s ? s.slice(0, max) : null;
}

function deviceOf(ua: string): string {
  if (/ipad|tablet|kindle|silk|(android(?!.*mobile))/i.test(ua)) return "tablet";
  if (/mobi|iphone|ipod|android.*mobile|windows phone/i.test(ua)) return "mobile";
  return "desktop";
}

function browserOf(ua: string): string {
  if (/edg\//i.test(ua)) return "Edge";
  if (/opr\/|opera/i.test(ua)) return "Opera";
  if (/samsungbrowser/i.test(ua)) return "Samsung Internet";
  if (/fbav|fban|instagram/i.test(ua)) return "In-app (Meta)";
  if (/firefox|fxios/i.test(ua)) return "Firefox";
  if (/chrome|crios/i.test(ua)) return "Chrome";
  if (/safari/i.test(ua)) return "Safari";
  return "Other";
}

export async function POST(req: NextRequest) {
  const ua = req.headers.get("user-agent") ?? "";
  if (!ua || BOT_RE.test(ua)) return new NextResponse(null, { status: 204 });

  let body: Record<string, unknown>;
  try {
    body = JSON.parse(await req.text());
  } catch {
    return new NextResponse(null, { status: 204 });
  }

  const path = clip(body.path, 300);
  if (!path || !path.startsWith("/") || path.startsWith("/admin") || path.startsWith("/api")) {
    return new NextResponse(null, { status: 204 });
  }

  let referrerHost: string | null = null;
  const ref = clip(body.referrer, 500);
  if (ref) {
    try {
      referrerHost = new URL(ref).hostname.replace(/^www\./, "") || null;
    } catch {}
  }
  const internalRef = referrerHost !== null && OWN_HOSTS.has(referrerHost);
  const isEntry = body.nav !== true && !internalRef;

  const utm = (body.utm ?? {}) as Record<string, unknown>;
  const ip = (req.headers.get("x-forwarded-for") ?? "").split(",")[0].trim() || req.headers.get("x-real-ip") || "";
  const day = new Date().toISOString().slice(0, 10);
  const visitorHash = createHash("sha256")
    .update(`${day}|${process.env.SUPABASE_SERVICE_ROLE_KEY ?? ""}|${ip}|${ua}`)
    .digest("hex")
    .slice(0, 32);

  const city = req.headers.get("x-vercel-ip-city");
  const loggedIn = req.cookies.getAll().some(c => c.name.startsWith("sb-") && c.name.includes("auth-token"));

  try {
    await createAdminClient().from("page_views").insert({
      path,
      referrer_host: isEntry ? referrerHost : null,
      utm_source: clip(utm.source, 100),
      utm_medium: clip(utm.medium, 100),
      utm_campaign: clip(utm.campaign, 100),
      country: clip(req.headers.get("x-vercel-ip-country"), 8),
      city: city ? clip(decodeURIComponent(city), 100) : null,
      device: deviceOf(ua),
      browser: browserOf(ua),
      lang: clip(body.lang, 8),
      visitor_hash: visitorHash,
      logged_in: loggedIn,
      is_entry: isEntry,
    });
  } catch {}

  return new NextResponse(null, { status: 204 });
}

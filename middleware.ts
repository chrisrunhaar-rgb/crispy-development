import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

// Paths that need the auth checks below. Everything else only gets the
// first-visit language default.
const AUTH_PATHS = /^\/(dashboard|community|admin|account|login$|signup$|welcome$|peer-groups\/apply|resources\/.+|courses\/.+)/;

// First visit from Indonesia (Vercel's IP country header) with no language
// chosen yet: default to Indonesian. Any later choice overwrites the cookie,
// and logged-in users keep the language saved on their account.
const GEO_LANG_COOKIE = { path: "/", maxAge: 31536000, sameSite: "lax" } as const;

export async function middleware(request: NextRequest) {
  const geoLang = !request.cookies.has("crispy-lang") && request.headers.get("x-vercel-ip-country") === "ID";
  if (geoLang) request.cookies.set("crispy-lang", "id");

  if (!AUTH_PATHS.test(request.nextUrl.pathname)) {
    const res = NextResponse.next({ request });
    if (geoLang) res.cookies.set("crispy-lang", "id", GEO_LANG_COOKIE);
    return res;
  }

  // Pass through cleanly if Supabase is not yet configured
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
    return NextResponse.next({ request });
  }

  let supabaseResponse = NextResponse.next({ request });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value)
          );
          supabaseResponse = NextResponse.next({ request });
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          );
        },
      },
    }
  );

  const { data: { user } } = await supabase.auth.getUser();

  // Protect dashboard — redirect to login if not authenticated
  if (!user && request.nextUrl.pathname.startsWith("/dashboard")) {
    const loginUrl = request.nextUrl.clone();
    loginUrl.pathname = "/login";
    loginUrl.searchParams.set("redirectTo", request.nextUrl.pathname);
    return NextResponse.redirect(loginUrl);
  }

  // Redirect authenticated users away from login/signup
  if (user && (request.nextUrl.pathname === "/login" || request.nextUrl.pathname === "/signup")) {
    const redirectTo = request.nextUrl.searchParams.get("redirectTo") || "/dashboard";
    const dest = request.nextUrl.clone();
    dest.href = new URL(redirectTo, request.nextUrl.origin).href;
    return NextResponse.redirect(dest);
  }

  // Protect /community — require auth
  if (!user && request.nextUrl.pathname.startsWith("/community")) {
    const loginUrl = request.nextUrl.clone();
    loginUrl.pathname = "/login";
    loginUrl.searchParams.set("redirectTo", request.nextUrl.pathname);
    return NextResponse.redirect(loginUrl);
  }

  // Protect /peer-groups/apply — require auth (/apply is retired, redirected in next.config)
  if (!user && request.nextUrl.pathname.startsWith("/peer-groups/apply")) {
    const loginUrl = request.nextUrl.clone();
    loginUrl.pathname = "/login";
    loginUrl.searchParams.set("redirectTo", request.nextUrl.pathname);
    return NextResponse.redirect(loginUrl);
  }

  // Protect /account/* and /welcome — require auth
  if (!user && (request.nextUrl.pathname.startsWith("/account") || request.nextUrl.pathname === "/welcome")) {
    const loginUrl = request.nextUrl.clone();
    loginUrl.pathname = "/login";
    return NextResponse.redirect(loginUrl);
  }

  // Protect /courses/[slug] and deeper — catalog (/courses) is public
  if (!user && request.nextUrl.pathname.startsWith("/courses/")) {
    const loginUrl = request.nextUrl.clone();
    loginUrl.pathname = "/login";
    loginUrl.searchParams.set("redirectTo", request.nextUrl.pathname);
    return NextResponse.redirect(loginUrl);
  }

  // Protect /admin — only Chris's admin account (world-outreach.com)
  const ADMIN_USER_ID = "c8526fd3-ab76-4514-ad0c-2310e37c5053";
  if (request.nextUrl.pathname.startsWith("/admin")) {
    if (!user || user.id !== ADMIN_USER_ID) {
      const homeUrl = request.nextUrl.clone();
      homeUrl.pathname = "/";
      return NextResponse.redirect(homeUrl);
    }
  }

  // Gate paid resource pages — free resources are open to all
  // Slugs where gated: false in resources-data.ts (+ new assessments)
  const FREE_RESOURCE_SLUGS = new Set([
    "cultural-intelligence", "power-distance", "intercultural-communication",
    "time-and-culture", "giving-feedback-across-cultures", "building-trust-across-cultures",
    "ladder-of-inference", "understanding-high-context",
    "leadership-altitudes", "servant-leadership", "vision-casting", "managing-up",
    "raising-next-generation", "storytelling-leadership",
    "team-health", "six-thinking-hats", "debriefing-reflection",
    "escaping-the-comfort-zone", "emotional-intelligence", "johari-window",
    "decision-making", "cognitive-biases",
    "disc", "three-thinking-styles", "big-five",
    "5languages", "healthy-conflict",
    "sabbath-leadership",
    "enneagram", "16-personalities", "wheel-of-life", "karunia-rohani",
    // multi-part resources
    "zoom-training", "zoom-training-id", "teams-training", "teams-training-id",
    "enneagram", "16-personalities", "wheel-of-life",
  ]);
  if (!user && request.nextUrl.pathname.startsWith("/resources/")) {
    const slug = request.nextUrl.pathname.split("/resources/")[1]?.split("/")[0];
    if (slug && !FREE_RESOURCE_SLUGS.has(slug) && slug !== "topic" && !slug.includes(".")) {
      const signupUrl = request.nextUrl.clone();
      signupUrl.pathname = "/signup";
      signupUrl.searchParams.set("redirectTo", request.nextUrl.pathname);
      return NextResponse.redirect(signupUrl);
    }
  }

  if (geoLang) supabaseResponse.cookies.set("crispy-lang", "id", GEO_LANG_COOKIE);
  return supabaseResponse;
}

export const config = {
  // All pages (the language default applies everywhere); skip API routes,
  // Next internals and static files.
  matcher: ["/((?!api|_next/static|_next/image|.*\\..*).*)"],
};

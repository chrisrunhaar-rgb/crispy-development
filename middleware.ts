import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

export async function middleware(request: NextRequest) {
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
    const dashboardUrl = request.nextUrl.clone();
    dashboardUrl.pathname = "/dashboard";
    return NextResponse.redirect(dashboardUrl);
  }

  // Protect /community — require auth
  if (!user && request.nextUrl.pathname.startsWith("/community")) {
    const loginUrl = request.nextUrl.clone();
    loginUrl.pathname = "/login";
    loginUrl.searchParams.set("redirectTo", request.nextUrl.pathname);
    return NextResponse.redirect(loginUrl);
  }

  // Protect /apply and /peer-groups/apply — require auth
  if (!user && (request.nextUrl.pathname.startsWith("/apply") || request.nextUrl.pathname.startsWith("/peer-groups/apply"))) {
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
    "sabbath-leadership",
    "enneagram", "16-personalities", "wheel-of-life", "karunia-rohani",
    // multi-part resources
    "zoom-training", "zoom-training-id", "teams-training", "teams-training-id",
    "enneagram", "16-personalities", "wheel-of-life",
  ]);
  if (!user && request.nextUrl.pathname.startsWith("/resources/")) {
    const slug = request.nextUrl.pathname.split("/resources/")[1]?.split("/")[0];
    if (slug && !FREE_RESOURCE_SLUGS.has(slug) && slug !== "topic") {
      const signupUrl = request.nextUrl.clone();
      signupUrl.pathname = "/signup";
      signupUrl.searchParams.set("redirectTo", request.nextUrl.pathname);
      return NextResponse.redirect(signupUrl);
    }
  }

  return supabaseResponse;
}

export const config = {
  matcher: ["/dashboard/:path*", "/community/:path*", "/community", "/login", "/signup", "/apply/:path*", "/peer-groups/apply", "/admin", "/admin/:path*", "/resources/:path+", "/account/:path*", "/welcome"],
};

import { NextResponse } from "next/server";
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { acceptInvite, acceptMemberInvite } from "@/app/(app)/dashboard/actions";

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  const next = searchParams.get("next") ?? "/dashboard";
  const invite = searchParams.get("invite") ?? "";
  const memberInvite = searchParams.get("member_invite") ?? "";
  const type = searchParams.get("type") ?? "";

  if (code) {
    const cookieStore = await cookies();
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          getAll() { return cookieStore.getAll(); },
          setAll(cookiesToSet) {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            );
          },
        },
      }
    );

    const { data, error } = await supabase.auth.exchangeCodeForSession(code);
    if (!error) {
      const gaSignup = type === "signup" ? "&ga=signup" : "";
      if (invite && data.user) {
        await acceptInvite(invite, data.user.id);
        return NextResponse.redirect(`${origin}/dashboard?joined=1${gaSignup}`);
      }
      if (memberInvite && data.user) {
        await acceptMemberInvite(memberInvite, data.user.id);
        return NextResponse.redirect(`${origin}/dashboard?joined=1${gaSignup}`);
      }
      const gaSuffix = type === "signup" ? (next.includes("?") ? "&ga=signup" : "?ga=signup") : "";
      return NextResponse.redirect(`${origin}${next}${gaSuffix}`);
    }

    console.error("[auth/callback] exchangeCodeForSession failed", {
      message: error.message,
      status: error.status,
      code,
      invite,
      memberInvite,
    });
  }

  // Exchange failed or no code (e.g. an email link scanner already consumed the
  // single-use code before the user clicked it). Send the user to log in normally
  // instead of dead-ending — carry the invite token through so it still gets applied.
  const inviteParam = invite ? `&invite=${invite}` : "";
  const memberInviteParam = memberInvite ? `&member_invite=${memberInvite}` : "";
  return NextResponse.redirect(`${origin}/login?error=confirmation_failed${inviteParam}${memberInviteParam}`);
}

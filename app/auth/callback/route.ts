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
      if (invite && data.user) {
        await acceptInvite(invite, data.user.id);
        return NextResponse.redirect(`${origin}/dashboard?joined=1`);
      }
      if (memberInvite && data.user) {
        await acceptMemberInvite(memberInvite, data.user.id);
        return NextResponse.redirect(`${origin}/dashboard?joined=1`);
      }
      return NextResponse.redirect(`${origin}${next}`);
    }
  }

  return NextResponse.redirect(`${origin}/login?error=confirmation_failed`);
}

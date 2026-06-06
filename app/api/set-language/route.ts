import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { lang } = body as { lang: unknown };

    if (lang !== "en" && lang !== "id") {
      return NextResponse.json({ error: "Invalid language. Must be 'en' or 'id'." }, { status: 400 });
    }

    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Update Supabase user metadata
    const admin = createAdminClient();
    await admin.auth.admin.updateUserById(user.id, {
      user_metadata: { language_preference: lang },
    });

    // Set the cookie on the response
    const response = NextResponse.json({ ok: true });
    response.cookies.set("crispy-lang", lang, {
      path: "/",
      maxAge: 31536000, // 365 days
      httpOnly: false,
      sameSite: "lax",
    });

    return response;
  } catch (err) {
    console.error("set-language route error:", err);
    return NextResponse.json({ error: "Internal server error." }, { status: 500 });
  }
}

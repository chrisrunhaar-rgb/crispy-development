import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import SoloSignupForm from "./SoloSignupForm";

export const metadata = { title: "Join — Influential Leadership Challenge" };

export default async function ChallengeSoloPage() {
  const cookieStore = await cookies();
  const rawLang = cookieStore.get("crispy-lang")?.value;
  const initialLang: "en" | "id" = rawLang === "id" ? "id" : "en";

  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (user?.user_metadata?.challenge_enrolled) {
    const admin = createAdminClient();
    const { data: enrollment } = await admin
      .from("challenge_enrollments")
      .select("current_day")
      .eq("user_id", user.id)
      .maybeSingle();
    if (enrollment) {
      redirect(`/challenge/day/${enrollment.current_day}`);
    }
    // metadata flag set but no DB enrollment — fall through to signup form
  }

  return (
    <div style={{ minHeight: "100dvh", background: "oklch(97% 0.005 80)", display: "flex", alignItems: "center", justifyContent: "center", padding: "2rem 1.5rem" }}>
      <SoloSignupForm isLoggedIn={!!user} userEmail={user?.email ?? null} initialLang={initialLang} />
    </div>
  );
}

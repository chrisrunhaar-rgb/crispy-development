import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import OnboardingForm from "./OnboardingForm";

export const metadata = { title: "Set Up Your Challenge — Influential Leadership Challenge" };

export default async function OnboardingPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login?next=/challenge/onboarding");

  const admin = createAdminClient();
  const { data: enrollment } = await admin
    .from("challenge_enrollments")
    .select("current_day, notification_time")
    .eq("user_id", user.id)
    .maybeSingle();

  // Already onboarded — go to their current day
  if (enrollment?.notification_time) {
    redirect(`/challenge/day/${enrollment.current_day}`);
  }

  const cookieStore = await cookies();
  const rawLang = cookieStore.get("crispy-lang")?.value;
  const initialLang: "en" | "id" = rawLang === "id" ? "id" : "en";

  const firstName = user.user_metadata?.first_name as string | undefined;

  return (
    <div style={{
      minHeight: "calc(100dvh - 80px)",
      background: "oklch(97% 0.005 80)",
      paddingBlock: "3rem",
      paddingInline: "1.5rem",
      display: "flex",
      alignItems: "flex-start",
      justifyContent: "center",
    }}>
      <OnboardingForm initialLang={initialLang} firstName={firstName} />
    </div>
  );
}

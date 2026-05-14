import { redirect } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import ProfileForm from "./ProfileForm";

export const metadata = {
  title: "Set Up Your Profile — WayPoint",
};

export default async function CoachSetupPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login?next=/coach/setup");

  const { data: profile } = await supabase
    .from("wp_worker_profiles")
    .select("*")
    .eq("user_id", user.id)
    .single();

  const isFirstTime = !profile?.onboarding_complete;

  return (
    <div style={{ background: "oklch(97% 0.005 80)", minHeight: "calc(100dvh - 80px)" }}>

      <div style={{ background: "oklch(18% 0.08 260)", paddingBlock: "2rem", borderBottom: "1px solid oklch(14% 0.06 260)" }}>
        <div className="container-wide" style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "1rem" }}>
          <div>
            <p style={{ fontFamily: "var(--font-montserrat)", fontSize: "0.6rem", fontWeight: 700, letterSpacing: "0.14em", textTransform: "uppercase", color: "oklch(65% 0.15 45)", marginBottom: "0.375rem" }}>
              WayPoint
            </p>
            <h1 style={{ fontFamily: "var(--font-montserrat)", fontWeight: 800, fontSize: "1.375rem", color: "white" }}>
              {isFirstTime ? "Set up your profile" : "Your profile"}
            </h1>
          </div>
          {!isFirstTime && (
            <Link href="/coach" style={{ fontFamily: "var(--font-montserrat)", fontSize: "0.8rem", fontWeight: 600, letterSpacing: "0.06em", color: "oklch(72% 0.008 260)", textDecoration: "none" }}>
              ← Back to WayPoint
            </Link>
          )}
        </div>
      </div>

      <div className="container-wide" style={{ paddingBlock: "3rem" }}>
        <div style={{ maxWidth: "600px", margin: "0 auto" }}>
          <ProfileForm
            userId={user.id}
            isFirstTime={isFirstTime}
            existing={profile ?? null}
          />
        </div>
      </div>
    </div>
  );
}

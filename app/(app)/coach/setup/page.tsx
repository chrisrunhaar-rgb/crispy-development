import { redirect } from "next/navigation";
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

  const firstName = user.user_metadata?.first_name ?? user.email?.split("@")[0] ?? "there";

  return (
    <div style={{ background: "oklch(97% 0.005 80)", minHeight: "calc(100dvh - 80px)" }}>

      <div style={{ background: "oklch(30% 0.12 260)", paddingBlock: "2rem", borderBottom: "1px solid oklch(22% 0.10 260)" }}>
        <div className="container-wide" style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "1rem" }}>
          <div>
            <p className="t-label" style={{ color: "oklch(65% 0.15 45)", marginBottom: "0.375rem", fontSize: "0.62rem" }}>WayPoint</p>
            <h1 style={{ fontFamily: "var(--font-montserrat)", fontWeight: 800, fontSize: "1.375rem", color: "oklch(97% 0.005 80)" }}>
              {profile ? "Your Profile" : `Welcome, ${firstName}`}
            </h1>
          </div>
        </div>
      </div>

      <div className="container-wide" style={{ paddingBlock: "3rem" }}>
        <div style={{ maxWidth: "560px", margin: "0 auto" }}>

          {!profile && (
            <div style={{ background: "oklch(30% 0.12 260 / 0.06)", border: "1px solid oklch(30% 0.12 260 / 0.15)", padding: "1.25rem 1.5rem", marginBottom: "2rem" }}>
              <p style={{ fontFamily: "var(--font-montserrat)", fontSize: "0.875rem", color: "oklch(30% 0.12 260)", lineHeight: 1.6 }}>
                WayPoint uses your context to personalise every session. This takes 2 minutes. You can update it any time.
              </p>
            </div>
          )}

          <ProfileForm
            userId={user.id}
            existing={profile ?? null}
          />
        </div>
      </div>
    </div>
  );
}

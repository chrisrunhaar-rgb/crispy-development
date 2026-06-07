import { redirect } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import SetupFlow from "./SetupFlow";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Set Up Your Profile — WayPoint",
};

export default async function CoachSetupPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login?next=/coach/setup");

  const { data: profile } = await supabase
    .from("wp_worker_profiles")
    .select("*, terms_accepted_at")
    .eq("user_id", user.id)
    .single();

  const isFirstTime = !profile?.onboarding_complete;
  const showIntroFirst = isFirstTime && !profile?.terms_accepted_at;
  const lang = (user.user_metadata?.language_preference === "id" ? "id" : "en") as "en" | "id";

  const headerLabels = {
    en: { setup: "Set up your profile", profile: "Your profile", back: "← Back to WayPoint" },
    id: { setup: "Atur profilmu", profile: "Profilmu", back: "← Kembali ke WayPoint" },
  };

  // When showing intro first, SetupFlow handles the full-page layout
  if (showIntroFirst) {
    return (
      <SetupFlow
        userId={user.id}
        isFirstTime={isFirstTime}
        lang={lang}
        existing={profile ?? null}
        showIntroFirst={showIntroFirst}
      />
    );
  }

  return (
    <div style={{ background: "oklch(97% 0.005 80)", minHeight: "calc(100dvh - 80px)" }}>

      <div style={{ background: "oklch(18% 0.08 260)", paddingBlock: "2rem", borderBottom: "1px solid oklch(14% 0.06 260)" }}>
        <div className="container-wide" style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "1rem" }}>
          <div>
            <p style={{ fontFamily: "var(--font-montserrat)", fontSize: "0.6rem", fontWeight: 700, letterSpacing: "0.14em", textTransform: "uppercase", color: "oklch(65% 0.15 45)", marginBottom: "0.375rem" }}>
              WayPoint
            </p>
            <h1 style={{ fontFamily: "var(--font-montserrat)", fontWeight: 800, fontSize: "1.375rem", color: "white" }}>
              {isFirstTime ? headerLabels[lang].setup : headerLabels[lang].profile}
            </h1>
          </div>
          {!isFirstTime && (
            <Link href="/coach" style={{ fontFamily: "var(--font-montserrat)", fontSize: "0.8rem", fontWeight: 600, letterSpacing: "0.06em", color: "oklch(72% 0.008 260)", textDecoration: "none" }}>
              {headerLabels[lang].back}
            </Link>
          )}
        </div>
      </div>

      <div className="container-wide" style={{ paddingBlock: "3rem" }}>
        <div style={{ maxWidth: "600px", margin: "0 auto" }}>
          <SetupFlow
            userId={user.id}
            isFirstTime={isFirstTime}
            lang={lang}
            existing={profile ?? null}
            showIntroFirst={false}
          />
        </div>
      </div>
    </div>
  );
}

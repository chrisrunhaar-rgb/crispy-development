import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import WelcomeClient from "./WelcomeClient";

export const metadata = { title: "Welcome — Crispy Development" };

export default async function WelcomePage({
  searchParams,
}: {
  searchParams: Promise<{ preview?: string }>;
}) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { preview } = await searchParams;
  const isPreview = preview === "1";

  // Already completed onboarding — skip unless preview mode
  if (user.user_metadata?.onboarding_complete && !isPreview) redirect("/dashboard");

  const firstName = (user.user_metadata?.first_name as string | undefined) ?? user.email?.split("@")[0] ?? "there";
  const currentLanguage = (user.user_metadata?.language_preference as string | undefined) ?? "en";

  return (
    <div style={{ background: "oklch(97% 0.005 80)" }}>
      {isPreview && (
        <div style={{ background: "oklch(65% 0.15 45 / 0.12)", borderBottom: "2px solid oklch(65% 0.15 45)", padding: "0.625rem 1.5rem", textAlign: "center" }}>
          <p style={{ fontFamily: "var(--font-montserrat)", fontSize: "0.75rem", fontWeight: 700, color: "oklch(40% 0.12 45)", margin: 0 }}>
            Preview mode — onboarding flow will not be saved
          </p>
        </div>
      )}
      <WelcomeClient firstName={firstName} currentLanguage={currentLanguage} preview={isPreview} />
    </div>
  );
}

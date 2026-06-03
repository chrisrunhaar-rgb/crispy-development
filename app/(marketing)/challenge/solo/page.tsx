import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import SoloSignupForm from "./SoloSignupForm";

export const metadata = {
  title: "Join the Challenge — Crispy Development",
};

export default async function ChallengeSoloPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (user?.user_metadata?.challenge_enrolled) {
    redirect("/challenge/day/1");
  }

  return (
    <div style={{ minHeight: "calc(100dvh - 120px)", background: "oklch(97% 0.005 80)", paddingBlock: "4rem", paddingInline: "1.5rem", display: "flex", alignItems: "flex-start", justifyContent: "center" }}>
      <SoloSignupForm isLoggedIn={!!user} userEmail={user?.email ?? null} />
    </div>
  );
}

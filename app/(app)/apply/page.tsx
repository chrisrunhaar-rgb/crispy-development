import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import TeamApplicationForm from "@/components/TeamApplicationForm";

export const metadata = {
  title: "Apply for Team Leader Access — Crispy Development",
};

export default async function ApplyPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) redirect("/login?redirectTo=/apply");

  // Check existing application status
  const { data: application } = await supabase
    .from("team_applications")
    .select("status")
    .eq("user_id", user.id)
    .single();

  if (application?.status === "approved") redirect("/dashboard");
  if (application?.status === "pending") redirect("/apply/pending");

  return (
    <div style={{ background: "oklch(97% 0.005 80)", minHeight: "calc(100dvh - 120px)" }}>

      {/* Header bar */}
      <div style={{
        background: "oklch(30% 0.12 260)",
        paddingBlock: "2rem",
        borderBottom: "1px solid oklch(22% 0.10 260)",
      }}>
        <div className="container-wide">
          <p className="t-label" style={{ color: "oklch(65% 0.15 45)", fontSize: "0.62rem" }}>
            Crispy Development
          </p>
        </div>
      </div>

      <div className="container-wide" style={{ paddingBlock: "4rem" }}>
        <TeamApplicationForm />
      </div>

    </div>
  );
}

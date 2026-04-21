import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

export const metadata = {
  title: "Application Under Review — Crispy Development",
};

export default async function ApplyPendingPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  const { data: application } = await supabase
    .from("team_applications")
    .select("status")
    .eq("user_id", user.id)
    .single();

  if (application?.status === "approved") redirect("/dashboard");
  if (!application) redirect("/apply");

  const firstName = user.user_metadata?.first_name ?? "there";

  return (
    <div style={{
      minHeight: "calc(100dvh - 120px)",
      background: "oklch(97% 0.005 80)",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      paddingBlock: "4rem",
      paddingInline: "1.5rem",
    }}>
      <div style={{ maxWidth: "480px", width: "100%" }}>
        <div style={{
          width: "48px",
          height: "48px",
          background: "oklch(65% 0.15 45 / 0.12)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          marginBottom: "1.5rem",
        }}>
          <span style={{ fontSize: "1.375rem" }}>🧭</span>
        </div>

        <p className="t-label" style={{ color: "oklch(65% 0.15 45)", marginBottom: "0.75rem", fontSize: "0.62rem" }}>
          Under Review
        </p>
        <h1 style={{
          fontFamily: "var(--font-montserrat)",
          fontWeight: 800,
          fontSize: "1.75rem",
          color: "oklch(22% 0.005 260)",
          lineHeight: 1.15,
          marginBottom: "1rem",
        }}>
          Your application is in, {firstName}.
        </h1>
        <p style={{
          fontFamily: "var(--font-montserrat)",
          fontSize: "0.9375rem",
          lineHeight: 1.7,
          color: "oklch(48% 0.008 260)",
          marginBottom: "2rem",
        }}>
          Chris reviews every Team Leader application personally. You'll hear back by email. In the meantime, your personal pathway is fully available.
        </p>

        <Link href="/dashboard" className="btn-primary" style={{ display: "inline-flex" }}>
          Go to My Dashboard →
        </Link>
      </div>
    </div>
  );
}

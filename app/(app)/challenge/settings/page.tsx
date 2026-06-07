import { redirect } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import SettingsForm from "./SettingsForm";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Notification Settings — Influential Leadership Challenge",
};

export default async function ChallengeSettingsPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login?next=/challenge/settings");

  const admin = createAdminClient();
  const { data: enrollment } = await admin
    .from("challenge_enrollments")
    .select("current_day, notification_time, notification_days")
    .eq("user_id", user.id)
    .maybeSingle();

  if (!enrollment) redirect("/challenge/solo");

  const lang = (user.user_metadata?.language_preference === "id" ? "id" : "en") as "en" | "id";
  const initialTime = (enrollment.notification_time as string | null) ?? "08:00";
  const initialDays = (enrollment.notification_days as number[] | null) ?? [1, 2, 3, 4, 5];
  const currentDay = enrollment.current_day as number;

  const backLabel = lang === "id" ? "← Kembali" : "← Back";
  const pageTitle = lang === "id" ? "Pengaturan Notifikasi" : "Notification Settings";

  return (
    <div style={{ background: "oklch(97% 0.005 80)", minHeight: "calc(100dvh - 80px)" }}>
      <div style={{
        background: "oklch(18% 0.08 260)", paddingBlock: "2rem",
        borderBottom: "1px solid oklch(14% 0.06 260)",
      }}>
        <div className="container-wide" style={{
          display: "flex", justifyContent: "space-between",
          alignItems: "center", flexWrap: "wrap", gap: "1rem",
        }}>
          <div>
            <p style={{
              fontFamily: "var(--font-montserrat)", fontSize: "0.6rem", fontWeight: 700,
              letterSpacing: "0.14em", textTransform: "uppercase",
              color: "oklch(65% 0.15 45)", marginBottom: "0.375rem",
            }}>
              Influential Leadership Challenge
            </p>
            <h1 style={{
              fontFamily: "var(--font-montserrat)", fontWeight: 800,
              fontSize: "1.375rem", color: "white",
            }}>
              {pageTitle}
            </h1>
          </div>
          <Link
            href={`/challenge/day/${currentDay}`}
            style={{
              fontFamily: "var(--font-montserrat)", fontSize: "0.8rem", fontWeight: 600,
              letterSpacing: "0.06em", color: "oklch(72% 0.008 260)", textDecoration: "none",
            }}
          >
            {backLabel}
          </Link>
        </div>
      </div>

      <div className="container-wide" style={{ paddingBlock: "3rem" }}>
        <SettingsForm lang={lang} initialTime={initialTime} initialDays={initialDays} />
      </div>
    </div>
  );
}

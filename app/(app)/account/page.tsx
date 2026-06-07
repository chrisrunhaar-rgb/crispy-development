import { redirect } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import LanguageToggle from "./LanguageToggle";
import ProfileForm from "./ProfileForm";

export const metadata = { title: "Account Settings — Crispy Development" };

const navy = "oklch(30% 0.12 260)";
const orange = "oklch(65% 0.15 45)";

export default async function AccountSettingsPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const admin = createAdminClient();
  const { data: profile } = await admin
    .from("profiles")
    .select("first_name, last_name, email")
    .eq("id", user.id)
    .maybeSingle();

  const firstName = profile?.first_name ?? "";
  const lastName = profile?.last_name ?? "";
  const email = profile?.email ?? user.email ?? "";

  return (
    <div style={{ background: "oklch(97% 0.005 80)", minHeight: "calc(100dvh - 140px)", paddingBlock: "clamp(2rem, 4vw, 4rem)" }}>
      <div style={{ maxWidth: "480px", margin: "0 auto", padding: "0 1.5rem" }}>

        <Link
          href="/dashboard"
          style={{ fontFamily: "var(--font-montserrat)", fontSize: "0.72rem", fontWeight: 700, letterSpacing: "0.06em", textTransform: "uppercase", color: "oklch(52% 0.008 260)", textDecoration: "none", display: "inline-flex", alignItems: "center", gap: "0.375rem", marginBottom: "2rem" }}
        >
          ← Dashboard
        </Link>

        <p style={{ fontFamily: "var(--font-montserrat)", fontSize: "0.72rem", fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: orange, marginBottom: "0.5rem" }}>
          Account
        </p>
        <h1 style={{ fontFamily: "var(--font-montserrat)", fontWeight: 800, fontSize: "1.75rem", color: navy, marginBottom: "2.5rem" }}>
          Account Settings
        </h1>

        {/* Profile section */}
        <div style={{ marginBottom: "2.5rem", paddingBottom: "2.5rem", borderBottom: "1px solid oklch(88% 0.008 80)" }}>
          <h2 style={{ fontFamily: "var(--font-montserrat)", fontWeight: 700, fontSize: "1rem", color: navy, marginBottom: "0.375rem" }}>
            Profile
          </h2>
          <p style={{ fontFamily: "var(--font-montserrat)", fontSize: "0.875rem", color: "oklch(52% 0.008 260)", lineHeight: 1.6, marginBottom: "1.25rem" }}>
            Your name as it appears to others.
          </p>
          <ProfileForm firstName={firstName} lastName={lastName} email={email} />
        </div>

        {/* Language section */}
        <div style={{ marginBottom: "2.5rem", paddingBottom: "2.5rem", borderBottom: "1px solid oklch(88% 0.008 80)" }}>
          <h2 style={{ fontFamily: "var(--font-montserrat)", fontWeight: 700, fontSize: "1rem", color: navy, marginBottom: "0.375rem" }}>
            Language / Bahasa
          </h2>
          <p style={{ fontFamily: "var(--font-montserrat)", fontSize: "0.875rem", color: "oklch(52% 0.008 260)", lineHeight: 1.6, marginBottom: "1.25rem" }}>
            Choose your preferred language.
          </p>
          <LanguageToggle />
        </div>

        {/* Password section */}
        <div>
          <h2 style={{ fontFamily: "var(--font-montserrat)", fontWeight: 700, fontSize: "1rem", color: navy, marginBottom: "0.375rem" }}>
            Password
          </h2>
          <p style={{ fontFamily: "var(--font-montserrat)", fontSize: "0.875rem", color: "oklch(52% 0.008 260)", lineHeight: 1.6, marginBottom: "1rem" }}>
            Update your login password.
          </p>
          <Link
            href="/account/password"
            style={{ fontFamily: "var(--font-montserrat)", fontSize: "0.875rem", fontWeight: 700, color: navy, textDecoration: "none" }}
          >
            Change Password →
          </Link>
        </div>

      </div>
    </div>
  );
}

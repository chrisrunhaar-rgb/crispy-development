import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import AccountMenu from "@/components/AccountMenu";

// Shared top bar for /account, /account/password and /account/subscription,
// so the profile menu is always one tap away from any account page.
export default async function AccountLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  let bar = null;
  if (user) {
    const admin = createAdminClient();
    const { data: profile } = await admin
      .from("profiles")
      .select("first_name, last_name, email")
      .eq("id", user.id)
      .maybeSingle();

    const metadata = user.user_metadata ?? {};
    const firstName = profile?.first_name || (metadata.first_name as string) || (user.email ?? "").split("@")[0];
    const lastName = profile?.last_name || undefined;
    const email = profile?.email ?? user.email ?? "";
    const language = ((metadata.language_preference ?? "en") as "en" | "id");
    const pathway = (metadata.pathway as string) ?? "free";

    bar = (
      <div style={{ background: "oklch(97% 0.005 80)", borderBottom: "1px solid oklch(88% 0.008 80)" }}>
        <div style={{ maxWidth: "720px", margin: "0 auto", padding: "0.75rem 1.5rem", display: "flex", alignItems: "center", justifyContent: "space-between", gap: "1rem" }}>
          <Link
            href="/dashboard"
            style={{ fontFamily: "var(--font-montserrat)", fontSize: "0.72rem", fontWeight: 700, letterSpacing: "0.06em", textTransform: "uppercase", color: "oklch(48% 0.04 260)", textDecoration: "none", display: "inline-flex", alignItems: "center", gap: "0.375rem", minHeight: 44 }}
          >
            ← {language === "id" ? "Dasbor" : "Dashboard"}
          </Link>
          <AccountMenu firstName={firstName} lastName={lastName} email={email} currentLanguage={language} pathway={pathway} onLight />
        </div>
      </div>
    );
  }

  return (
    <>
      {bar}
      {children}
    </>
  );
}

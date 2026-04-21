import Image from "next/image";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { redirect } from "next/navigation";
import { acceptInvite } from "@/app/(app)/dashboard/actions";

export const dynamic = "force-dynamic";

type Lang = "en" | "id" | "nl";

const COPY: Record<Lang, {
  heading: (leaderName: string | null, teamName: string) => string;
  subtext: (leaderName: string | null, teamName: string) => string;
  cta: string;
  login: string;
}> = {
  en: {
    heading: (leader, team) =>
      leader ? `${leader} invites you to join ${team}.` : `${team} is building something worth joining.`,
    subtext: (leader, _team) =>
      leader
        ? `${leader} has a seat for you on Crispy Development — a platform for cross-cultural teams. Your team is ready and waiting.`
        : "Your leader has a seat for you on Crispy Development — a platform for cross-cultural teams. Your team is ready and waiting.",
    cta: "Create Account & Join Team →",
    login: "Already have an account? Log in →",
  },
  id: {
    heading: (leader, team) =>
      leader ? `${leader} mengundang Anda bergabung dengan ${team}.` : `${team} sedang membangun sesuatu yang layak untuk diikuti.`,
    subtext: (leader, _team) =>
      leader
        ? `${leader} sudah menyiapkan tempat untuk Anda di Crispy Development — platform untuk tim lintas budaya. Tim Anda sudah menunggu.`
        : "Pemimpin Anda sudah menyiapkan tempat untuk Anda di Crispy Development — platform untuk tim lintas budaya. Tim Anda sudah menunggu.",
    cta: "Buat Akun & Bergabung →",
    login: "Sudah punya akun? Masuk →",
  },
  nl: {
    heading: (leader, team) =>
      leader ? `${leader} nodigt je uit voor ${team}.` : `${team} bouwt aan iets dat het waard is.`,
    subtext: (leader, _team) =>
      leader
        ? `${leader} heeft een plek voor jou op Crispy Development — een platform voor interculturele teams. Je team staat klaar.`
        : "Je leider heeft een plek voor jou op Crispy Development — een platform voor interculturele teams. Je team staat klaar.",
    cta: "Account aanmaken & team joinen →",
    login: "Al een account? Inloggen →",
  },
};

export default async function InviteLandingPage({
  params,
}: {
  params: Promise<{ token: string }>;
}) {
  const { token } = await params;
  const admin = createAdminClient();

  // Look up the invite
  const { data: invite } = await admin
    .from("team_invites")
    .select("id, team_id, expires_at, used_at")
    .eq("token", token)
    .maybeSingle();

  if (!invite) {
    return <InviteError message="This invite link is invalid or has been revoked." />;
  }
  if (invite.used_at) {
    return <InviteError message="This invite link has already been used." />;
  }
  if (new Date(invite.expires_at) < new Date()) {
    return <InviteError message="This invite link has expired. Ask your team leader to generate a new one." />;
  }

  // invite.team_id = leader's auth user ID — look up team by leader_user_id
  const { data: team } = await admin
    .from("teams")
    .select("id, name, language")
    .eq("leader_user_id", invite.team_id)
    .maybeSingle();

  const teamName = team?.name ?? "your team";
  const lang: Lang = (team?.language as Lang) ?? "en";

  // Look up the leader's name from auth metadata
  const { data: { user: leaderUser } } = await admin.auth.admin.getUserById(invite.team_id);
  const leaderFirstName = leaderUser?.user_metadata?.first_name ?? null;
  const leaderLastName = leaderUser?.user_metadata?.last_name ?? null;
  const leaderName = leaderFirstName
    ? [leaderFirstName, leaderLastName].filter(Boolean).join(" ")
    : null;

  // Check if current user is logged in
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  // If logged in, auto-accept and redirect
  if (user) {
    const result = await acceptInvite(token, user.id);
    if (result.error) {
      return <InviteError message={result.error} />;
    }
    redirect("/dashboard?joined=1");
  }

  const daysLeft = Math.max(1, Math.ceil((new Date(invite.expires_at).getTime() - Date.now()) / (1000 * 60 * 60 * 24)));
  const copy = COPY[lang];

  // Not logged in — show the invite landing page
  return (
    <div style={{
      minHeight: "calc(100dvh - 120px)",
      background: "oklch(30% 0.12 260)",
      display: "flex",
      alignItems: "flex-start",
      justifyContent: "center",
      paddingBlock: "clamp(3rem, 8vw, 6rem)",
      paddingInline: "1.5rem",
    }}>
      <div style={{ width: "100%", maxWidth: "480px" }}>

        {/* Logo */}
        <div style={{ marginBottom: "2.5rem" }}>
          <Image src="/logo-icon-dark-badge.png" alt="Crispy Development" width={40} height={40} style={{ height: "40px", width: "40px" }} />
        </div>

        {/* Orange accent line */}
        <div style={{ width: "3px", height: "36px", background: "oklch(65% 0.15 45)", marginBottom: "1.75rem" }} />

        <p style={{
          fontFamily: "var(--font-montserrat)",
          fontSize: "0.65rem",
          fontWeight: 700,
          letterSpacing: "0.16em",
          textTransform: "uppercase",
          color: "oklch(65% 0.15 45)",
          marginBottom: "0.875rem",
        }}>
          {lang === "id" ? "Anda diundang" : lang === "nl" ? "Je bent uitgenodigd" : "You're invited"}
        </p>

        <h1 style={{
          fontFamily: "var(--font-montserrat)",
          fontWeight: 800,
          fontSize: "clamp(1.75rem, 5vw, 2.25rem)",
          color: "oklch(97% 0.005 80)",
          lineHeight: 1.1,
          marginBottom: "1.25rem",
        }}>
          {copy.heading(leaderName, teamName)}
        </h1>

        <p style={{
          fontFamily: "var(--font-montserrat)",
          fontSize: "0.9375rem",
          lineHeight: 1.75,
          color: "oklch(72% 0.04 260)",
          marginBottom: "2.5rem",
          maxWidth: "42ch",
        }}>
          {copy.subtext(leaderName, teamName)}
        </p>

        <div style={{ display: "flex", flexDirection: "column", gap: "0.875rem" }}>
          <Link
            href={`/signup?invite=${token}`}
            className="btn-primary"
            style={{ textAlign: "center", justifyContent: "center" }}
          >
            {copy.cta}
          </Link>
          <Link
            href={`/login?invite=${token}`}
            style={{
              fontFamily: "var(--font-montserrat)",
              fontSize: "0.85rem",
              fontWeight: 600,
              color: "oklch(82% 0.008 260)",
              textDecoration: "none",
              textAlign: "center",
              padding: "0.875rem",
              border: "1px solid oklch(97% 0.005 80 / 0.15)",
              display: "block",
            }}
          >
            {copy.login}
          </Link>
        </div>

        <p style={{
          fontFamily: "var(--font-montserrat)",
          fontSize: "0.75rem",
          color: "oklch(55% 0.008 260)",
          marginTop: "2rem",
          textAlign: "center",
        }}>
          {lang === "id"
            ? `Link ini berlaku ${daysLeft} hari lagi.`
            : lang === "nl"
            ? `Deze link verloopt over ${daysLeft} dag${daysLeft !== 1 ? "en" : ""}.`
            : `This link expires in ${daysLeft} day${daysLeft !== 1 ? "s" : ""}.`}
        </p>
      </div>
    </div>
  );
}

function InviteError({ message }: { message: string }) {
  return (
    <div style={{
      minHeight: "calc(100dvh - 120px)",
      background: "oklch(97% 0.005 80)",
      display: "flex",
      alignItems: "flex-start",
      justifyContent: "center",
      paddingBlock: "5rem",
      paddingInline: "1.5rem",
    }}>
      <div style={{ width: "100%", maxWidth: "480px" }}>
        <p className="t-label" style={{ color: "oklch(65% 0.15 45)", marginBottom: "0.75rem", fontSize: "0.62rem" }}>
          Invite Link
        </p>
        <h1 style={{ fontFamily: "var(--font-montserrat)", fontWeight: 800, fontSize: "1.5rem", color: "oklch(22% 0.005 260)", marginBottom: "0.875rem" }}>
          This link isn&apos;t valid.
        </h1>
        <p style={{ fontFamily: "var(--font-montserrat)", fontSize: "0.9375rem", lineHeight: 1.7, color: "oklch(48% 0.008 260)", marginBottom: "2rem" }}>
          {message}
        </p>
        <Link href="/" style={{ fontFamily: "var(--font-montserrat)", fontSize: "0.85rem", fontWeight: 600, color: "oklch(30% 0.12 260)", textDecoration: "none" }}>
          ← Back to home
        </Link>
      </div>
    </div>
  );
}

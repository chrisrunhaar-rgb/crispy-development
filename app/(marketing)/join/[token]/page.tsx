import Image from "next/image";
import Link from "next/link";
import { createAdminClient } from "@/lib/supabase/admin";
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { acceptMemberInvite } from "@/app/(app)/dashboard/actions";

export const dynamic = "force-dynamic";

export default async function MemberInvitePage({
  params,
}: {
  params: Promise<{ token: string }>;
}) {
  const { token } = await params;
  const admin = createAdminClient();

  const { data: invite } = await admin
    .from("member_invites")
    .select("id, expires_at, used_at, email, personal_note")
    .eq("token", token)
    .maybeSingle();

  if (!invite) return <InviteError message="This invite link is invalid or has been revoked." />;
  if (invite.used_at) return <InviteError message="This invite link has already been used." />;
  if (new Date(invite.expires_at) < new Date()) return <InviteError message="This invite link has expired. Ask Chris for a new one." />;

  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (user) {
    const result = await acceptMemberInvite(token, user.id);
    if (result.error) return <InviteError message={result.error} />;
    redirect("/dashboard?joined=1");
  }

  const daysLeft = Math.max(1, Math.ceil((new Date(invite.expires_at).getTime() - Date.now()) / (1000 * 60 * 60 * 24)));

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
        <div style={{ marginBottom: "2.5rem" }}>
          <Image src="/logo-icon-dark-badge.png" alt="Crispy Development" width={40} height={40} style={{ height: "40px", width: "40px" }} />
        </div>

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
          You&apos;re invited
        </p>

        <h1 style={{
          fontFamily: "var(--font-montserrat)",
          fontWeight: 800,
          fontSize: "clamp(1.75rem, 5vw, 2.25rem)",
          color: "oklch(97% 0.005 80)",
          lineHeight: 1.1,
          marginBottom: "1.25rem",
        }}>
          Welcome to Crispy Development.
        </h1>

        <p style={{
          fontFamily: "var(--font-montserrat)",
          fontSize: "0.9375rem",
          lineHeight: 1.75,
          color: "oklch(72% 0.04 260)",
          marginBottom: invite.personal_note ? "1.25rem" : "2.5rem",
          maxWidth: "42ch",
        }}>
          You have been personally invited to join this platform for Christian cross-cultural leaders.
          Create your account to access the full library and your personal dashboard.
        </p>

        {invite.personal_note && (
          <div style={{
            background: "oklch(97% 0.005 80 / 0.07)",
            border: "1px solid oklch(97% 0.005 80 / 0.12)",
            borderLeft: "3px solid oklch(65% 0.15 45)",
            padding: "0.875rem 1rem",
            marginBottom: "2.5rem",
          }}>
            <p style={{ fontFamily: "var(--font-montserrat)", fontSize: "0.85rem", lineHeight: 1.65, color: "oklch(82% 0.03 260)", fontStyle: "italic" }}>
              &ldquo;{invite.personal_note}&rdquo;
            </p>
          </div>
        )}

        <div style={{ display: "flex", flexDirection: "column", gap: "0.875rem" }}>
          <Link
            href={`/signup?member_invite=${token}`}
            className="btn-primary"
            style={{ textAlign: "center", justifyContent: "center" }}
          >
            Create Account & Get Access →
          </Link>
          <Link
            href={`/login?member_invite=${token}`}
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
            Already have an account? Log in →
          </Link>
        </div>

        <p style={{
          fontFamily: "var(--font-montserrat)",
          fontSize: "0.75rem",
          color: "oklch(55% 0.008 260)",
          marginTop: "2rem",
          textAlign: "center",
        }}>
          This link expires in {daysLeft} day{daysLeft !== 1 ? "s" : ""}.
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
        <p className="t-label" style={{ color: "oklch(65% 0.15 45)", marginBottom: "0.75rem", fontSize: "0.62rem" }}>Invite Link</p>
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

import Image from "next/image";
import Link from "next/link";
import { createAdminClient } from "@/lib/supabase/admin";
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { acceptMemberInvite } from "@/app/(app)/dashboard/actions";

export const dynamic = "force-dynamic";

type Lang = "en" | "id";

const INVITE_ERRORS: Record<Lang, { invalid: string; used: string; expired: string }> = {
  en: {
    invalid: "This invite link is invalid or has been revoked.",
    used: "This invite link has already been used.",
    expired: "This invite link has expired. Ask Chris for a new one.",
  },
  id: {
    invalid: "Tautan undangan ini tidak valid atau telah dicabut.",
    used: "Tautan undangan ini sudah pernah digunakan.",
    expired: "Tautan undangan ini sudah kedaluwarsa. Minta Chris untuk membuat tautan baru.",
  },
};

const ERROR_PAGE_COPY: Record<Lang, { eyebrow: string; heading: string; back: string }> = {
  en: {
    eyebrow: "Invite Link",
    heading: "This link isn't valid.",
    back: "← Back to home",
  },
  id: {
    eyebrow: "Tautan Undangan",
    heading: "Tautan ini tidak valid.",
    back: "← Kembali ke beranda",
  },
};

const COPY: Record<Lang, {
  eyebrow: string;
  heading: string;
  body: string;
  cta: string;
  login: string;
  expiry: (days: number) => string;
}> = {
  en: {
    eyebrow: "You're invited",
    heading: "Welcome to Crispy Leaders.",
    body: "You have been personally invited to join this platform for Christian cross-cultural leaders. Create your account to access all 53 training modules and your personal dashboard.",
    cta: "Create Account & Get Access →",
    login: "Already have an account? Log in →",
    expiry: (days) => `This link expires in ${days} day${days !== 1 ? "s" : ""}.`,
  },
  id: {
    eyebrow: "Anda diundang",
    heading: "Selamat datang di Crispy Leaders.",
    body: "Anda telah diundang secara pribadi untuk bergabung dengan platform ini bagi para pemimpin lintas budaya Kristen. Buat akun Anda untuk mengakses ke-53 modul pelatihan dan dasbor pribadi Anda.",
    cta: "Buat Akun & Dapatkan Akses →",
    login: "Sudah punya akun? Masuk →",
    expiry: (days) => `Link ini berlaku ${days} hari lagi.`,
  },
};

export default async function MemberInvitePage({
  params,
}: {
  params: Promise<{ token: string }>;
}) {
  const { token } = await params;
  const admin = createAdminClient();

  const { data: invite } = await admin
    .from("member_invites")
    .select("id, expires_at, used_at, email, personal_note, language")
    .eq("token", token)
    .maybeSingle();

  if (!invite) return <InviteError lang="en" message={INVITE_ERRORS.en.invalid} />;

  const lang: Lang = invite.language === "id" ? "id" : "en";

  if (invite.used_at) return <InviteError lang={lang} message={INVITE_ERRORS[lang].used} />;
  if (new Date(invite.expires_at) < new Date()) return <InviteError lang={lang} message={INVITE_ERRORS[lang].expired} />;

  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (user) {
    const result = await acceptMemberInvite(token, user.id);
    if (result.error) return <InviteError lang={lang} message={result.error} />;
    redirect("/dashboard?joined=1");
  }

  const daysLeft = Math.max(1, Math.ceil((new Date(invite.expires_at).getTime() - Date.now()) / (1000 * 60 * 60 * 24)));
  const copy = COPY[lang];

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
          {copy.eyebrow}
        </p>

        <h1 style={{
          fontFamily: "var(--font-montserrat)",
          fontWeight: 800,
          fontSize: "clamp(1.75rem, 5vw, 2.25rem)",
          color: "oklch(97% 0.005 80)",
          lineHeight: 1.1,
          marginBottom: "1.25rem",
        }}>
          {copy.heading}
        </h1>

        <p style={{
          fontFamily: "var(--font-montserrat)",
          fontSize: "0.9375rem",
          lineHeight: 1.75,
          color: "oklch(72% 0.04 260)",
          marginBottom: invite.personal_note ? "1.25rem" : "2.5rem",
          maxWidth: "42ch",
        }}>
          {copy.body}
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
            {copy.cta}
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
          {copy.expiry(daysLeft)}
        </p>
      </div>
    </div>
  );
}

function InviteError({ message, lang = "en" }: { message: string; lang?: Lang }) {
  const copy = ERROR_PAGE_COPY[lang];
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
        <p className="t-label" style={{ color: "oklch(65% 0.15 45)", marginBottom: "0.75rem", fontSize: "0.62rem" }}>{copy.eyebrow}</p>
        <h1 style={{ fontFamily: "var(--font-montserrat)", fontWeight: 800, fontSize: "1.5rem", color: "oklch(22% 0.005 260)", marginBottom: "0.875rem" }}>
          {copy.heading}
        </h1>
        <p style={{ fontFamily: "var(--font-montserrat)", fontSize: "0.9375rem", lineHeight: 1.7, color: "oklch(48% 0.008 260)", marginBottom: "2rem" }}>
          {message}
        </p>
        <Link href="/" style={{ fontFamily: "var(--font-montserrat)", fontSize: "0.85rem", fontWeight: 600, color: "oklch(30% 0.12 260)", textDecoration: "none" }}>
          {copy.back}
        </Link>
      </div>
    </div>
  );
}

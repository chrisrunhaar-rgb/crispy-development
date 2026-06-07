"use client";

import { useActionState, useState } from "react";
import Link from "next/link";
import { signUpChallenge, enrollExistingUser } from "@/app/challenge/actions";

const navy     = "oklch(22% 0.10 260)";
const offWhite = "oklch(97% 0.005 80)";
const pillNavy = "oklch(30% 0.12 260)";

const initialState = { error: "" };

type Lang = "en" | "id";

function setLangCookie(lang: Lang) {
  document.cookie = `crispy-lang=${lang}; path=/; max-age=31536000; samesite=lax`;
}

async function callSetLanguage(lang: Lang) {
  try {
    await fetch("/api/set-language", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ lang }),
    });
  } catch {
    // fire and forget — silently ignore
  }
}

const copy = {
  en: {
    howJoin: "How do you want to join?",
    signedIn: "Signed in as",
    solo: "Solo",
    soloDesc: "Work through the challenge at your own pace. Private journal, daily content.",
    facilitator: "Facilitator",
    facilitatorDesc: "Lead a small group. Set a schedule, share an invite link, track progress.",
    joinGroup: "Join a group",
    joinGroupDesc: "Browse open groups and apply to join one that fits your context.",
    signUp: "Sign up for the challenge",
    firstName: "First name",
    lastName: "Last name",
    email: "Email address",
    password: "Password (8+ characters)",
    creating: "Creating account...",
    create: "Create account →",
    haveAccount: "Have a Crispy account already?",
    signIn: "Sign in",
  },
  id: {
    howJoin: "Bagaimana Anda ingin bergabung?",
    signedIn: "Masuk sebagai",
    solo: "Sendiri",
    soloDesc: "Jalani tantangan sesuai ritme Anda. Jurnal pribadi, konten harian.",
    facilitator: "Fasilitator",
    facilitatorDesc: "Pimpin kelompok kecil. Atur jadwal, bagikan tautan undangan, pantau kemajuan.",
    joinGroup: "Bergabung dengan kelompok",
    joinGroupDesc: "Jelajahi kelompok terbuka dan daftar untuk bergabung.",
    signUp: "Daftar untuk tantangan ini",
    firstName: "Nama depan",
    lastName: "Nama belakang",
    email: "Alamat email",
    password: "Kata sandi (min. 8 karakter)",
    creating: "Membuat akun...",
    create: "Buat akun →",
    haveAccount: "Sudah punya akun Crispy?",
    signIn: "Masuk",
  },
};

export default function SoloSignupForm({
  isLoggedIn,
  userEmail,
  initialLang = "en",
}: {
  isLoggedIn: boolean;
  userEmail: string | null;
  initialLang?: Lang;
}) {
  const [selectedLang, setSelectedLang] = useState<Lang>(initialLang);
  const c = copy[selectedLang];

  const [state, formAction, pending] = useActionState(
    async (_prev: typeof initialState, formData: FormData) => {
      formData.set("language", selectedLang);
      const result = await signUpChallenge(formData);
      return result ?? initialState;
    },
    initialState,
  );

  const [, enrollAction, enrollPending] = useActionState(
    async (_prev: typeof initialState, _: FormData) => {
      await enrollExistingUser();
      return initialState;
    },
    initialState,
  );

  if (isLoggedIn) {
    return (
      <div style={{ width: "100%", maxWidth: "480px" }}>
        <h1 style={{ fontFamily: "var(--font-montserrat)", fontWeight: 800, fontSize: "1.5rem", color: navy, marginBottom: "0.375rem" }}>
          {c.howJoin}
        </h1>
        <p style={{ fontFamily: "var(--font-montserrat)", fontSize: "0.8125rem", color: "oklch(52% 0.008 260)", marginBottom: "2rem" }}>
          {c.signedIn} {userEmail}
        </p>

        <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem", marginBottom: "1.5rem" }}>
          {/* Solo */}
          <form action={enrollAction} style={{ display: "contents" }}>
            <button type="submit" disabled={enrollPending} style={pathCardStyle}>
              <div style={pathCardInner}>
                <div>
                  <p style={pathTitle}>{c.solo}</p>
                  <p style={pathDesc}>{c.soloDesc}</p>
                </div>
                <span style={pathArrow}>→</span>
              </div>
            </button>
          </form>

          {/* Facilitator */}
          <Link href="/challenge/group/create" style={{ ...pathCardStyle, textDecoration: "none", display: "block" }}>
            <div style={pathCardInner}>
              <div>
                <p style={pathTitle}>{c.facilitator}</p>
                <p style={pathDesc}>{c.facilitatorDesc}</p>
              </div>
              <span style={pathArrow}>→</span>
            </div>
          </Link>

          {/* Join group */}
          <Link href="/challenge/group/browse" style={{ ...pathCardStyle, textDecoration: "none", display: "block" }}>
            <div style={pathCardInner}>
              <div>
                <p style={pathTitle}>{c.joinGroup}</p>
                <p style={pathDesc}>{c.joinGroupDesc}</p>
              </div>
              <span style={pathArrow}>→</span>
            </div>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div style={{ width: "100%", maxWidth: "400px" }}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src="/il-challenge-icon.png" alt="" width={88} height={88} style={{ borderRadius: "50%", objectFit: "cover", display: "block", margin: "0 auto 1.5rem" }} />
      <h1 style={{ fontFamily: "var(--font-montserrat)", fontWeight: 800, fontSize: "1.5rem", color: navy, marginBottom: "2rem", textAlign: "center" }}>
        {c.signUp}
      </h1>

      <form action={formAction} onSubmit={() => { setLangCookie(selectedLang); callSetLanguage(selectedLang); }}>
        <div style={{ display: "flex", flexDirection: "column", gap: "0.875rem", marginBottom: "1.25rem" }}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.75rem" }}>
            <input name="firstName" type="text" required placeholder={c.firstName} autoComplete="given-name" style={inputStyle} />
            <input name="lastName" type="text" required placeholder={c.lastName} autoComplete="family-name" style={inputStyle} />
          </div>
          <input name="email" type="email" required placeholder={c.email} autoComplete="email" style={inputStyle} />
          <input name="password" type="password" required minLength={8} placeholder={c.password} autoComplete="new-password" style={inputStyle} />
        </div>

        {/* Language selector */}
        <div style={{ marginBottom: "1.25rem" }}>
          <p style={langLabelStyle}>Language / Bahasa</p>
          <div style={{ display: "flex", gap: "0.5rem" }}>
            {(["en", "id"] as const).map(lang => (
              <button
                key={lang}
                type="button"
                onClick={() => setSelectedLang(lang)}
                style={pillStyle(selectedLang === lang)}
              >
                {lang === "en" ? "English" : "Bahasa Indonesia"}
              </button>
            ))}
          </div>
        </div>

        {state.error && (
          <p style={{ fontFamily: "var(--font-montserrat)", fontSize: "0.8rem", color: "oklch(50% 0.22 15)", marginBottom: "0.875rem" }}>
            {state.error}
          </p>
        )}

        <button type="submit" disabled={pending} style={btnStyle(pending)}>
          {pending ? c.creating : c.create}
        </button>

        <p style={{ fontFamily: "var(--font-montserrat)", fontSize: "0.78rem", color: "oklch(52% 0.008 260)", textAlign: "center", marginTop: "1rem" }}>
          {c.haveAccount}{" "}
          <Link href="/login?redirectTo=/challenge/solo" style={{ color: navy, fontWeight: 600, textDecoration: "none" }}>{c.signIn}</Link>
        </p>
      </form>
    </div>
  );
}

const langLabelStyle: React.CSSProperties = {
  fontFamily: "var(--font-montserrat)", fontSize: "0.72rem", fontWeight: 700,
  letterSpacing: "0.08em", textTransform: "uppercase", color: "oklch(52% 0.008 260)",
  marginBottom: "0.5rem",
};

function pillStyle(active: boolean): React.CSSProperties {
  return {
    fontFamily: "var(--font-montserrat)", fontSize: "0.875rem", fontWeight: 700,
    padding: "0.5rem 1.25rem", borderRadius: "999px", cursor: "pointer",
    background: active ? pillNavy : "#fff",
    color: active ? "#fff" : pillNavy,
    border: active ? "none" : `2px solid ${pillNavy}`,
  };
}

function btnStyle(disabled: boolean): React.CSSProperties {
  return {
    width: "100%", fontFamily: "var(--font-montserrat)", fontWeight: 700,
    fontSize: "1rem", color: offWhite, background: navy, border: "none",
    borderRadius: "8px", padding: "0.9375rem", cursor: disabled ? "not-allowed" : "pointer",
    opacity: disabled ? 0.7 : 1,
  };
}

const inputStyle: React.CSSProperties = {
  width: "100%", fontFamily: "var(--font-montserrat)", fontSize: "0.9375rem",
  color: navy, background: "white", border: "1px solid oklch(82% 0.006 260)",
  borderRadius: "8px", padding: "0.75rem 1rem", outline: "none", boxSizing: "border-box",
};

const pathCardStyle: React.CSSProperties = {
  width: "100%", background: "white", border: "1px solid oklch(85% 0.006 80)",
  borderRadius: "12px", padding: "1.125rem 1.25rem", cursor: "pointer",
  textAlign: "left",
};

const pathCardInner: React.CSSProperties = {
  display: "flex", justifyContent: "space-between", alignItems: "center", gap: "1rem",
};

const pathTitle: React.CSSProperties = {
  fontFamily: "var(--font-montserrat)", fontWeight: 800, fontSize: "0.9375rem",
  color: navy, marginBottom: "0.25rem",
};

const pathDesc: React.CSSProperties = {
  fontFamily: "var(--font-montserrat)", fontSize: "0.8rem",
  color: "oklch(52% 0.008 260)", lineHeight: 1.5, maxWidth: "34ch",
};

const pathArrow: React.CSSProperties = {
  fontFamily: "var(--font-montserrat)", fontSize: "1.1rem",
  color: "oklch(65% 0.15 45)", flexShrink: 0, fontWeight: 700,
};

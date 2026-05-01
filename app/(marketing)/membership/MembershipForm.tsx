"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { submitMembershipApplication } from "./actions";

const navy = "oklch(30% 0.12 260)";
const orange = "oklch(65% 0.15 45)";

const COPY = {
  en: {
    heading: "Apply to join",
    subheading: "This platform is for Christian leaders navigating life and leadership across cultures. We review every application personally — not everyone will be accepted.",
    langLabel: "Preferred language",
    nameLabel: "Full Name *",
    emailLabel: "Email *",
    orgLabel: "Organization you work with",
    roleLabel: "Your role",
    rolePlaceholder: "Select your role…",
    locationLabel: "Where are you based, and what cultures do you navigate?",
    faithLabel: "Are you a follower of Jesus? Tell us a little about your faith.",
    challengeLabel: "What is your biggest leadership challenge right now?",
    referralLabel: "How did you find Crispy Development?",
    consentLabel: "I agree to the Privacy Policy and Terms of Service. I understand that my application — including information about my faith and leadership context — will be stored and reviewed by Crispy Development.",
    submit: "Submit Application →",
    submitting: "Submitting…",
    roles: [
      "Pastor / Church leader",
      "NGO / Mission organisation",
      "Corporate / Business leader",
      "Team leader",
      "Cross-cultural worker",
      "Other",
    ],
  },
  id: {
    heading: "Daftar untuk bergabung",
    subheading: "Platform ini untuk pemimpin Kristen yang menavigasi kehidupan dan kepemimpinan lintas budaya. Kami meninjau setiap lamaran secara pribadi — tidak semua orang akan diterima.",
    langLabel: "Bahasa yang diinginkan",
    nameLabel: "Nama Lengkap *",
    emailLabel: "Email *",
    orgLabel: "Organisasi yang Anda ikuti",
    roleLabel: "Peran Anda",
    rolePlaceholder: "Pilih peran Anda…",
    locationLabel: "Di mana Anda berbasis, dan budaya apa yang Anda navigasikan?",
    faithLabel: "Apakah Anda pengikut Yesus? Ceritakan sedikit tentang iman Anda.",
    challengeLabel: "Apa tantangan kepemimpinan terbesar Anda saat ini?",
    referralLabel: "Bagaimana Anda menemukan Crispy Development?",
    consentLabel: "Saya menyetujui Kebijakan Privasi dan Syarat Layanan. Saya memahami bahwa lamaran saya — termasuk informasi tentang iman dan konteks kepemimpinan saya — akan disimpan dan ditinjau oleh Crispy Development.",
    submit: "Kirim Lamaran →",
    submitting: "Mengirim…",
    roles: [
      "Pendeta / Pemimpin Gereja",
      "LSM / Organisasi Misi",
      "Pemimpin Perusahaan / Bisnis",
      "Pemimpin Tim",
      "Pekerja Lintas Budaya",
      "Lainnya",
    ],
  },
};

export default function MembershipForm() {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [lang, setLang] = useState<"en" | "id">("en");

  const c = COPY[lang];

  const labelStyle: React.CSSProperties = {
    fontFamily: "var(--font-montserrat)",
    fontSize: "0.72rem",
    fontWeight: 700,
    letterSpacing: "0.06em",
    textTransform: "uppercase",
    color: "oklch(45% 0.008 260)",
    display: "block",
    marginBottom: "0.5rem",
  };

  const inputStyle: React.CSSProperties = {
    width: "100%",
    fontFamily: "var(--font-montserrat)",
    fontSize: "0.9rem",
    color: navy,
    background: "white",
    border: "1px solid oklch(82% 0.008 80)",
    padding: "0.75rem 1rem",
    outline: "none",
    boxSizing: "border-box",
  };

  const textareaStyle: React.CSSProperties = {
    ...inputStyle,
    minHeight: "100px",
    resize: "vertical" as const,
    lineHeight: 1.6,
  };

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    const formData = new FormData(e.currentTarget);
    startTransition(async () => {
      const result = await submitMembershipApplication(formData);
      if (result.error) {
        setError(result.error);
      } else {
        router.push("/membership/received");
      }
    });
  }

  return (
    <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "1.75rem" }}>
      <input type="hidden" name="preferred_language" value={lang} />

      {/* Language toggle — first question */}
      <div>
        <label style={labelStyle}>{c.langLabel}</label>
        <div style={{ display: "flex", gap: "0.5rem" }}>
          {(["en", "id"] as const).map(l => (
            <button
              key={l}
              type="button"
              onClick={() => setLang(l)}
              style={{
                fontFamily: "var(--font-montserrat)",
                fontSize: "0.8rem",
                fontWeight: 700,
                padding: "0.5rem 1.25rem",
                border: `1px solid ${lang === l ? orange : "oklch(82% 0.008 80)"}`,
                background: lang === l ? orange : "transparent",
                color: lang === l ? "white" : "oklch(52% 0.008 260)",
                cursor: "pointer",
                transition: "all 0.15s",
              }}
            >
              {l === "en" ? "English" : "Indonesia"}
            </button>
          ))}
        </div>
      </div>

      {/* Name + Email row */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1.25rem" }} className="form-grid-2">
        <div>
          <label htmlFor="name" style={labelStyle}>{c.nameLabel}</label>
          <input id="name" name="name" type="text" required style={inputStyle} />
        </div>
        <div>
          <label htmlFor="email" style={labelStyle}>{c.emailLabel}</label>
          <input id="email" name="email" type="email" required style={inputStyle} />
        </div>
      </div>

      {/* Organization */}
      <div>
        <label htmlFor="organization" style={labelStyle}>{c.orgLabel}</label>
        <input id="organization" name="organization" type="text" style={inputStyle} />
      </div>

      {/* Role */}
      <div>
        <label htmlFor="role" style={labelStyle}>{c.roleLabel}</label>
        <select id="role" name="role" style={{ ...inputStyle, appearance: "none" }}>
          <option value="">{c.rolePlaceholder}</option>
          {c.roles.map(r => <option key={r} value={r}>{r}</option>)}
        </select>
      </div>

      {/* Location / cultures */}
      <div>
        <label htmlFor="location_cultures" style={labelStyle}>{c.locationLabel}</label>
        <input id="location_cultures" name="location_cultures" type="text" style={inputStyle} />
      </div>

      {/* Faith */}
      <div>
        <label htmlFor="faith_share" style={labelStyle}>{c.faithLabel}</label>
        <textarea id="faith_share" name="faith_share" style={textareaStyle} />
      </div>

      {/* Leadership challenge */}
      <div>
        <label htmlFor="leadership_challenge" style={labelStyle}>{c.challengeLabel}</label>
        <textarea id="leadership_challenge" name="leadership_challenge" style={textareaStyle} />
      </div>

      {/* Referral */}
      <div>
        <label htmlFor="referral_source" style={labelStyle}>{c.referralLabel}</label>
        <input id="referral_source" name="referral_source" type="text" style={inputStyle} />
      </div>

      {/* Consent */}
      <div>
        <label style={{ display: "flex", gap: "0.75rem", alignItems: "flex-start", cursor: "pointer" }}>
          <input
            type="checkbox"
            name="consent"
            required
            style={{ marginTop: "0.2rem", accentColor: orange, flexShrink: 0, width: "16px", height: "16px" }}
          />
          <span style={{ fontFamily: "var(--font-montserrat)", fontSize: "0.8rem", color: "oklch(42% 0.008 260)", lineHeight: 1.65 }}>
            {lang === "en" ? (
              <>I agree to the <a href="/privacy" target="_blank" rel="noopener" style={{ color: "oklch(30% 0.12 260)", fontWeight: 700 }}>Privacy Policy</a> and <a href="/terms" target="_blank" rel="noopener" style={{ color: "oklch(30% 0.12 260)", fontWeight: 700 }}>Terms of Service</a>. I understand that my application — including information about my faith and leadership context — will be stored and reviewed by Crispy Development.</>
            ) : (
              <>Saya menyetujui <a href="/privacy" target="_blank" rel="noopener" style={{ color: "oklch(30% 0.12 260)", fontWeight: 700 }}>Kebijakan Privasi</a> dan <a href="/terms" target="_blank" rel="noopener" style={{ color: "oklch(30% 0.12 260)", fontWeight: 700 }}>Syarat Layanan</a>. Saya memahami bahwa lamaran saya — termasuk informasi tentang iman dan konteks kepemimpinan saya — akan disimpan dan ditinjau oleh Crispy Development.</>
            )}
          </span>
        </label>
      </div>

      {error && (
        <p style={{ fontFamily: "var(--font-montserrat)", fontSize: "0.85rem", color: "oklch(45% 0.12 25)", background: "oklch(97% 0.04 25)", padding: "0.75rem 1rem", borderLeft: "3px solid oklch(55% 0.15 25)" }}>
          {error}
        </p>
      )}

      <div>
        <button
          type="submit"
          disabled={pending}
          style={{
            fontFamily: "var(--font-montserrat)",
            fontWeight: 700,
            fontSize: "0.875rem",
            letterSpacing: "0.06em",
            color: "white",
            background: pending ? "oklch(52% 0.008 260)" : orange,
            border: "none",
            padding: "0.875rem 2rem",
            cursor: pending ? "not-allowed" : "pointer",
            transition: "background 0.15s",
          }}
        >
          {pending ? c.submitting : c.submit}
        </button>
      </div>
    </form>
  );
}

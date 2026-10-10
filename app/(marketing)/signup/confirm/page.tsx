import Image from "next/image";
import { cookies } from "next/headers";

export const metadata = {
  title: "Check Your Email | Crispy Development",
};

export default async function ConfirmPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const params = await searchParams;
  const firstName = typeof params.name === "string" ? params.name : null;
  const isId = (await cookies()).get("crispy-lang")?.value === "id";
  const c = isId
    ? {
        label: "Hampir selesai",
        hi: firstName ? `Halo ${firstName},` : "Halo,",
        check: "silakan periksa email Anda.",
        body: "Kami mengirim tautan konfirmasi ke alamat email Anda. Klik tautan itu untuk mengaktifkan akun, lalu kembali untuk masuk.",
        hint: "Tautan ini mungkin terbuka di browser lain, misalnya dari aplikasi Instagram atau Facebook. Jika itu terjadi, cukup masuk di sana dengan email dan kata sandi Anda.",
        button: "Masuk",
      }
    : {
        label: "Almost there",
        hi: firstName ? `Hi ${firstName},` : "Hi there,",
        check: "please check your email.",
        body: "We sent a confirmation link to your email address. Click it to activate your account, then come back to log in.",
        hint: "The link may open in a different browser, for example outside the Instagram or Facebook app. If it does, just log in there with your email and password.",
        button: "Go to Log In",
      };

  return (
    <div style={{
      minHeight: "calc(100dvh - 120px)",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      paddingBlock: "4rem",
      paddingInline: "1.5rem",
      background: "oklch(97% 0.005 80)",
    }}>
      <div style={{ width: "100%", maxWidth: "440px", textAlign: "center" }}>
        <div style={{ display: "flex", justifyContent: "center", marginBottom: "1.5rem" }}>
          <Image src="/logo-icon.png" alt="Crispy Development" width={64} height={64} />
        </div>
        <p className="t-label" style={{ color: "oklch(65% 0.15 45)", marginBottom: "0.75rem" }}>{c.label}</p>
        <h1 style={{ fontFamily: "var(--font-montserrat)", fontWeight: 800, fontSize: "1.75rem", color: "oklch(22% 0.005 260)", lineHeight: 1.15, marginBottom: "1rem" }}>
          {c.hi} {c.check}
        </h1>
        <p style={{ fontFamily: "var(--font-montserrat)", fontSize: "0.9375rem", lineHeight: 1.7, color: "oklch(48% 0.008 260)", marginBottom: "1rem" }}>
          {c.body}
        </p>
        <p style={{ fontFamily: "var(--font-montserrat)", fontSize: "0.8125rem", lineHeight: 1.6, color: "oklch(48% 0.008 260)", marginBottom: "2rem" }}>
          {c.hint}
        </p>
        <a href="/login" className="btn-primary" style={{ display: "inline-flex", justifyContent: "center" }}>
          {c.button}
        </a>
      </div>
    </div>
  );
}

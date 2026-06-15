import Image from "next/image";

export const metadata = {
  title: "Check Your Email — Crispy Development",
};

export default async function ConfirmPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const params = await searchParams;
  const firstName = typeof params.name === "string" ? params.name : null;

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
        <p className="t-label" style={{ color: "oklch(65% 0.15 45)", marginBottom: "0.75rem" }}>Almost there</p>
        <h1 style={{ fontFamily: "var(--font-montserrat)", fontWeight: 800, fontSize: "1.75rem", color: "oklch(22% 0.005 260)", lineHeight: 1.15, marginBottom: "1rem" }}>
          {firstName ? `Hi ${firstName},` : "Hi there,"} please check your email.
        </h1>
        <p style={{ fontFamily: "var(--font-montserrat)", fontSize: "0.9375rem", lineHeight: 1.7, color: "oklch(48% 0.008 260)", marginBottom: "2rem" }}>
          We sent a confirmation link to your email address. Click it to activate your account, then come back to log in.
        </p>
        <a href="/login" className="btn-primary" style={{ display: "inline-flex", justifyContent: "center" }}>
          Go to Log In
        </a>
      </div>
    </div>
  );
}

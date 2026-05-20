import Link from "next/link";
import Image from "next/image";

export const metadata = {
  title: "Terms of Use — WayPoint",
};

export default function CoachTermsPage() {
  return (
    <div style={{ background: "oklch(97% 0.005 80)", minHeight: "calc(100dvh - 80px)" }}>

      <div style={{ background: "oklch(30% 0.12 260)", paddingBlock: "2rem", borderBottom: "1px solid oklch(22% 0.10 260)" }}>
        <div className="container-wide" style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "1rem" }}>
          <div>
            <Image src="/images/waypoint/waypoint-banner-blue.png" alt="WayPoint" height={28} width={0} style={{ width: "auto", height: "28px", marginBottom: "0.5rem" }} />
            <h1 style={{ fontFamily: "var(--font-montserrat)", fontWeight: 800, fontSize: "1.375rem", color: "oklch(97% 0.005 80)" }}>
              Terms of Use
            </h1>
          </div>
          <Link href="/coach" style={{ fontFamily: "var(--font-montserrat)", fontSize: "0.8rem", fontWeight: 600, letterSpacing: "0.06em", color: "oklch(88% 0.008 80)", textDecoration: "none" }}>
            ← Back
          </Link>
        </div>
      </div>

      <div className="container-wide" style={{ paddingBlock: "3rem" }}>
        <div style={{ maxWidth: "680px", margin: "0 auto", display: "flex", flexDirection: "column", gap: "2rem" }}>

          <Section label="Who operates WayPoint">
            <Body>WayPoint is operated by Crispy Development. By using WayPoint, you agree to these terms. If you do not agree, please do not use the service. Questions or concerns: hello@crispyleaders.com</Body>
          </Section>

          <Section label="What WayPoint is">
            <Body>WayPoint is an AI-powered voice coaching tool designed for people navigating cross-cultural life and work. It uses professional coaching methods — asking questions, helping you reflect, and supporting you in identifying your own goals and actions. It is not therapy, counselling, or a mental health service.</Body>
          </Section>

          <Section label="What WayPoint is not">
            <Body>WayPoint is not a substitute for professional mental health care, pastoral support, or human relationships. It does not diagnose, treat, or manage any medical or psychological condition. If you are in crisis or need urgent support, please contact a trusted person, your pastor, or a crisis service in your country.</Body>
          </Section>

          <Section label="Your responsibilities">
            <Body>You may use WayPoint only for personal coaching purposes. You agree not to misuse the service, attempt to circumvent its AI systems, share your account with others, or use it for any purpose that is harmful, illegal, or contrary to its intent. You are responsible for what you share during sessions.</Body>
          </Section>

          <Section label="Voice processing and AI">
            <Body>WayPoint uses Google&apos;s Gemini Live API to power voice sessions. Your voice input is transmitted to and processed by Google&apos;s servers in real time. By using WayPoint, Google&apos;s terms of use also apply to your use of the AI-powered voice features — you can find them at google.com/terms. We do not store your raw audio. Session transcripts and notes generated from your session are stored securely in our database. See the confidentiality policy for full detail on what is stored and who can see it.</Body>
          </Section>

          <Section label="Trial and access">
            <Body>New users receive a free trial of 120 minutes of coaching time. Access beyond the trial may require a subscription or organisational arrangement. Crispy Development reserves the right to change access terms with reasonable notice. Your coaching history remains accessible to you even if your trial expires.</Body>
          </Section>

          <Section label="Limitation of liability">
            <Body>WayPoint is provided as-is. Crispy Development makes no guarantee that the service will be available at all times or that AI responses will be accurate, complete, or appropriate for your situation. Crispy Development is not liable for any decisions you make based on a coaching session, or for any loss arising from use of the service.</Body>
          </Section>

          <Section label="Changes to these terms">
            <Body>We may update these terms from time to time. If we make material changes, we will notify you via the platform. Continued use after notification constitutes acceptance of the updated terms.</Body>
          </Section>

          <Section label="Governing law">
            <Body>These terms are governed by Dutch law. Any disputes are subject to the jurisdiction of the courts of the Netherlands. Last updated: May 2026. Operated by Crispy Development.</Body>
          </Section>

          <div style={{ paddingTop: "1rem" }}>
            <Link
              href="/coach"
              style={{
                fontFamily: "var(--font-montserrat)",
                fontWeight: 700,
                fontSize: "0.8rem",
                letterSpacing: "0.08em",
                textTransform: "uppercase",
                textDecoration: "none",
                padding: "0.875rem 2rem",
                background: "oklch(30% 0.12 260)",
                color: "oklch(97% 0.005 80)",
                display: "inline-block",
              }}
            >
              Back to Coaching
            </Link>
          </div>

        </div>
      </div>
    </div>
  );
}

function Section({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div style={{ background: "white", border: "1px solid oklch(88% 0.008 80)", padding: "2rem" }}>
      <p style={{
        fontFamily: "var(--font-montserrat)",
        fontSize: "0.62rem",
        fontWeight: 700,
        letterSpacing: "0.12em",
        textTransform: "uppercase",
        color: "oklch(65% 0.15 45)",
        marginBottom: "1rem",
      }}>
        {label}
      </p>
      <div style={{ display: "flex", flexDirection: "column", gap: "0.875rem" }}>
        {children}
      </div>
    </div>
  );
}

function Body({ children }: { children: React.ReactNode }) {
  return (
    <p style={{
      fontFamily: "var(--font-montserrat)",
      fontSize: "0.9375rem",
      color: "oklch(32% 0.008 260)",
      lineHeight: 1.75,
      margin: 0,
    }}>
      {children}
    </p>
  );
}

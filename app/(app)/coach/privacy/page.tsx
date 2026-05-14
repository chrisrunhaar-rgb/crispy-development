import Link from "next/link";

export const metadata = {
  title: "Privacy — WayPoint",
};

export default function CoachPrivacyPage() {
  return (
    <div style={{ background: "oklch(97% 0.005 80)", minHeight: "calc(100dvh - 80px)" }}>

      <div style={{ background: "oklch(30% 0.12 260)", paddingBlock: "2rem", borderBottom: "1px solid oklch(22% 0.10 260)" }}>
        <div className="container-wide" style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "1rem" }}>
          <div>
            <p className="t-label" style={{ color: "oklch(65% 0.15 45)", marginBottom: "0.375rem", fontSize: "0.62rem" }}>WayPoint</p>
            <h1 style={{ fontFamily: "var(--font-montserrat)", fontWeight: 800, fontSize: "1.375rem", color: "oklch(97% 0.005 80)" }}>
              Confidentiality Policy
            </h1>
          </div>
          <Link href="/coach" style={{ fontFamily: "var(--font-montserrat)", fontSize: "0.8rem", fontWeight: 600, letterSpacing: "0.06em", color: "oklch(88% 0.008 80)", textDecoration: "none" }}>
            ← Back
          </Link>
        </div>
      </div>

      <div className="container-wide" style={{ paddingBlock: "3rem" }}>
        <div style={{ maxWidth: "680px", margin: "0 auto", display: "flex", flexDirection: "column", gap: "2rem" }}>

          <Section label="What is private">
            <Body>Your full conversation with WayPoint — everything you say, every question asked — is completely private. No one else has access to your transcript. Not your leader. Not Crispy Development. Not your organisation.</Body>
            <Body>Your whiteboard belongs to you. The insights, values, action steps, and focus themes you build during a session are yours by default.</Body>
          </Section>

          <Section label="What you can share">
            <Body>After each completed session, you can choose to share your whiteboard summary with your assigned leader. This is always your choice — it is never automatic.</Body>
            <Body>When you share a whiteboard, your leader can see: what you focused on, your key insights, named values, action steps, and what you carried forward. They cannot see the conversation that produced it.</Body>
          </Section>

          <Section label="What your leader can see">
            <Body>Your leader can only see whiteboards from sessions you have explicitly chosen to share. If you share nothing, they see nothing — only that you have an account.</Body>
            <Body>Leaders never have access to transcripts, audio, or the content of your coaching conversation. WayPoint is designed so the coaching relationship stays between you and the conversation.</Body>
          </Section>

          <Section label="What Crispy Development sees">
            <Body>Crispy Development may access anonymised usage data — session counts, timing, technical logs — to improve the platform. We do not read session content or whiteboards.</Body>
          </Section>

          <Section label="When confidentiality may not apply">
            <Body>In cases involving imminent risk of harm to yourself or others, or where a safeguarding concern is raised, we encourage you to speak with a qualified person (counsellor, pastor, safeguarding officer) who can respond appropriately. WayPoint is not equipped to handle clinical crisis situations.</Body>
            <Body>WayPoint may be required to respond to a lawful legal request. This is rare and would apply only in serious circumstances.</Body>
          </Section>

          <Section label="Your data">
            <Body>Session data is stored securely and associated only with your account. You may request deletion of your data by contacting Crispy Development directly.</Body>
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

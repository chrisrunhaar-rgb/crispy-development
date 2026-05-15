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
              What stays private in WayPoint
            </h1>
          </div>
          <Link href="/coach" style={{ fontFamily: "var(--font-montserrat)", fontSize: "0.8rem", fontWeight: 600, letterSpacing: "0.06em", color: "oklch(88% 0.008 80)", textDecoration: "none" }}>
            ← Back
          </Link>
        </div>
      </div>

      <div className="container-wide" style={{ paddingBlock: "3rem" }}>
        <div style={{ maxWidth: "680px", margin: "0 auto", display: "flex", flexDirection: "column", gap: "2rem" }}>

          <Section label="Your session transcripts are fully private.">
            <Body>Everything you say during a coaching session is captured as a live transcript. That transcript is never shared with your organisation or anyone else — including us (Crispy Development). We do not read your session content.</Body>
          </Section>

          <Section label="Your session notes belong to you.">
            <Body>After each session, WayPoint generates notes from your conversation: themes explored, insights, actions you named, values surfaced. These notes live in your private dashboard and are visible only to you.</Body>
          </Section>

          <Section label="Your voice is processed by Google.">
            <Body>WayPoint uses Google&apos;s Gemini Live API to power the voice coaching experience. This means your voice input is transmitted to and processed by Google&apos;s servers. Google processes this data in line with their API terms. We do not store your raw audio. The text transcript generated from your session is stored in our secure database, hosted in a trusted cloud environment.</Body>
          </Section>

          <Section label="Crispy Development does not read your sessions.">
            <Body>We are the operator of WayPoint. We store your session notes and account data to make the product work. We do not access, review, or analyse your individual session content. We may review anonymised, aggregated data (e.g. how many sessions happened this week) for product development only.</Body>
          </Section>

          <Section label="Your rights.">
            <Body>You have the right to: request a copy of all data we hold about you; ask us to delete your account and all associated data; withdraw your consent at any time by closing your account. To exercise any of these rights, contact: hello@crispyleaders.com</Body>
          </Section>

          <Section label="When we might be required to act.">
            <Body>WayPoint is not a crisis service. If you share something that suggests immediate danger to yourself or others, we strongly encourage you to contact a trusted person, your pastor, or a crisis helpline in your country. In rare situations, we may be legally compelled by a court order to disclose data.</Body>
          </Section>

          <Section label="This is not a substitute for professional support.">
            <Body>WayPoint is a coaching tool, not a mental health or counselling service. It does not replace professional care, pastoral support, or human community. If you are struggling, please reach out to a person who knows and loves you.</Body>
          </Section>

          <Section label="Governing law.">
            <Body>This policy is governed by Dutch law and the General Data Protection Regulation (GDPR). If you have a complaint, you have the right to contact the Dutch Data Protection Authority (Autoriteit Persoonsgegevens) at autoriteitpersoonsgegevens.nl. Last updated: May 2026. Operated by Crispy Development.</Body>
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

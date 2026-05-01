export const metadata = { title: "Terms of Service — Crispy Development" };

export default function TermsPage() {
  return (
    <div style={{ paddingBlock: "clamp(3rem, 5vw, 5rem)", background: "oklch(97% 0.005 80)" }}>
      <div className="container-text">
        <p className="t-label" style={{ color: "oklch(65% 0.15 45)", marginBottom: "1rem" }}>Legal</p>
        <h1 className="t-section" style={{ marginBottom: "0.5rem" }}>Terms of Service</h1>
        <p style={{ fontFamily: "var(--font-montserrat)", fontSize: "0.8125rem", color: "oklch(62% 0.006 260)", marginBottom: "3rem" }}>Last updated: April 2026</p>

        <LegalSection heading="1. Who These Terms Apply To">
          <p>These Terms of Service govern your use of the Crispy Development website, your subscription to our email newsletter, your access to any free resources or downloadable content, and your participation in any community platform we operate (collectively, the "Services").</p>
          <p style={{ marginTop: "1rem" }}>By visiting our website, subscribing to our email list, downloading any resource, or joining any community we manage, you agree to be bound by these Terms.</p>
          <p style={{ marginTop: "1rem" }}><strong>Operator:</strong><br />Chris Runhaar — Crispy Development · Southeast Asia<br /><a href="mailto:chris@crispydevelopment.com" style={{ color: "oklch(30% 0.12 260)" }}>chris@crispydevelopment.com</a></p>
        </LegalSection>

        <LegalSection heading="2. What We Offer">
          <ul>
            <li>Free leadership resources and downloadable content focused on cross-cultural Christian leadership</li>
            <li>An email newsletter delivering content, reflections, and updates</li>
            <li>A membership platform for Christian leaders navigating cross-cultural life and leadership, accessible by application and available to approved members only</li>
            <li>Community engagement and peer group facilitation via the platform and social media</li>
            <li>Coaching and leadership development content (specific paid programmes will be covered under separate terms when launched)</li>
          </ul>
        </LegalSection>

        <LegalSection heading="3. Acceptable Use">
          <p>By using our Services, you agree to:</p>
          <ul style={{ marginTop: "1rem" }}>
            <li>Engage respectfully and constructively with our content and community</li>
            <li>Not use our Services for spam, harassment, abuse, or any unlawful purpose</li>
            <li>Not impersonate Crispy Development, Chris Runhaar, or any other person</li>
            <li>Not post or share content that is defamatory, discriminatory, or threatening</li>
            <li>Treat others with dignity, consistent with the values of cross-cultural respect and Christian community</li>
          </ul>
          <p style={{ marginTop: "1rem" }}>We reserve the right to remove content or suspend access for violations, at our sole discretion and without prior notice.</p>
        </LegalSection>

        <LegalSection heading="4. Intellectual Property">
          <p>All content published by Crispy Development — including articles, resources, graphics, newsletter content, and branding — is the intellectual property of Chris Runhaar and Crispy Development, unless otherwise stated.</p>
          <p style={{ marginTop: "1rem" }}><strong>You may:</strong> Share links freely. Quote brief excerpts for personal or educational commentary with clear attribution to "Crispy Development / Chris Runhaar."</p>
          <p style={{ marginTop: "0.75rem" }}><strong>You may not:</strong> Reproduce or distribute content in full without written permission. Use content for commercial purposes without a licence from us.</p>
          <p style={{ marginTop: "0.75rem" }}>For permissions: <a href="mailto:chris@crispydevelopment.com" style={{ color: "oklch(30% 0.12 260)" }}>chris@crispydevelopment.com</a></p>
        </LegalSection>

        <LegalSection heading="5. Third-Party Content and Quotes">
          <p>Our content may include quotations and references from third-party authors for educational or illustrative purposes. Inclusion does not imply endorsement. We make reasonable efforts to attribute all third-party content accurately. If you believe content has been attributed incorrectly, contact <a href="mailto:chris@crispydevelopment.com" style={{ color: "oklch(30% 0.12 260)" }}>chris@crispydevelopment.com</a>.</p>
        </LegalSection>

        <LegalSection heading="6. Email List">
          <p>When you subscribe to our email newsletter, you give explicit consent to receive email communications from Crispy Development.</p>
          <ul style={{ marginTop: "1rem" }}>
            <li>You may unsubscribe at any time using the unsubscribe link in any email</li>
            <li>We will not share your email address with third parties for their own marketing purposes</li>
            <li>Our email list is managed via Mailchimp. Subscribers are also subject to Mailchimp's Privacy Policy at mailchimp.com/legal/privacy</li>
          </ul>
        </LegalSection>

        <LegalSection heading="7. Community Conduct">
          <p>If a community platform is introduced, additional community guidelines will apply. Those guidelines will be consistent with Section 3 (Acceptable Use). We are a faith-based community centred on cross-cultural Christian leadership. We reserve the right to remove any member whose conduct is harmful, regardless of whether a specific rule has been violated.</p>
        </LegalSection>

        <LegalSection heading="8. Disclaimer — Educational Content Only">
          <p>All content provided through Crispy Development's Services is provided for <strong>educational and informational purposes only</strong>. Nothing constitutes professional legal, financial, psychological, or other regulated professional advice. We make no warranties regarding the completeness, accuracy, or fitness for purpose of any content.</p>
        </LegalSection>

        <LegalSection heading="9. Limitation of Liability">
          <p>To the fullest extent permitted by applicable law, Crispy Development and Chris Runhaar shall not be liable for any indirect, incidental, special, or consequential damages arising from your use of the Services. Our total liability for direct damages shall not exceed amounts paid to us in the preceding twelve months. Nothing in these Terms limits our liability for fraud, gross negligence, or liability that cannot be excluded by law.</p>
        </LegalSection>

        <LegalSection heading="10. Links to Third-Party Websites">
          <p>Our website may link to external sites. We are not responsible for the content, privacy practices, or availability of those external sites. Links are provided for convenience and do not constitute endorsement.</p>
        </LegalSection>

        <LegalSection heading="11. Governing Law">
          <p>These Terms are governed by the laws of <strong>Malaysia</strong>. Any dispute will be subject to the jurisdiction of the courts of <strong>Malaysia</strong>, except where mandatory local law grants you the right to proceed elsewhere.</p>
          <p style={{ marginTop: "1rem" }}><strong>EU users:</strong> Nothing in these Terms affects your statutory rights under EU law, including GDPR. Dutch residents may contact the <a href="https://www.autoriteitpersoonsgegevens.nl" style={{ color: "oklch(30% 0.12 260)" }}>Autoriteit Persoonsgegevens</a>.</p>
        </LegalSection>

        <LegalSection heading="12. Changes to These Terms">
          <p>We may modify these Terms at any time. When we do, we will update the "Last updated" date above. For material changes, we will notify email subscribers in advance where practicable. Continued use of the Services constitutes acceptance of updated Terms.</p>
        </LegalSection>

        <LegalSection heading="13. Termination">
          <p>We may suspend or terminate your access at any time, with or without notice, if you have violated these Terms. You may stop using our Services at any time.</p>
        </LegalSection>

        <LegalSection heading="14. Contact" last>
          <p>
            <strong>Chris Runhaar — Crispy Development</strong><br />
            <a href="mailto:chris@crispydevelopment.com" style={{ color: "oklch(30% 0.12 260)" }}>chris@crispydevelopment.com</a><br />
            Southeast Asia
          </p>
        </LegalSection>
      </div>
    </div>
  );
}

function LegalSection({ heading, children, last = false }: { heading: string; children: React.ReactNode; last?: boolean }) {
  return (
    <div style={{ marginBottom: last ? 0 : "2.5rem", paddingBottom: last ? 0 : "2.5rem", borderBottom: last ? "none" : "1px solid oklch(88% 0.008 80)" }}>
      <h2 style={{ fontFamily: "var(--font-montserrat)", fontWeight: 700, fontSize: "1rem", color: "oklch(30% 0.12 260)", marginBottom: "1rem", letterSpacing: "0.01em" }}>{heading}</h2>
      <div style={{ fontFamily: "var(--font-montserrat)", fontSize: "0.9rem", color: "oklch(38% 0.008 260)", lineHeight: 1.75 }}>
        {children}
      </div>
    </div>
  );
}

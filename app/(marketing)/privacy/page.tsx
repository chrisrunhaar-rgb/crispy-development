export const metadata = { title: "Privacy Policy — Crispy Development" };

export default function PrivacyPage() {
  return (
    <div style={{ paddingBlock: "clamp(3rem, 5vw, 5rem)", background: "oklch(97% 0.005 80)" }}>
      <div className="container-text">
        <p className="t-label" style={{ color: "oklch(65% 0.15 45)", marginBottom: "1rem" }}>Legal</p>
        <h1 className="t-section" style={{ marginBottom: "0.5rem" }}>Privacy Policy</h1>
        <p style={{ fontFamily: "var(--font-montserrat)", fontSize: "0.8125rem", color: "oklch(62% 0.006 260)", marginBottom: "3rem" }}>Last updated: April 2026</p>

        <LegalSection heading="1. Who We Are">
          <p>Crispy Development is a cross-cultural Christian leadership resource and coaching platform operated by Chris Runhaar, based in Southeast Asia.</p>
          <p style={{ marginTop: "1rem" }}><strong>Contact:</strong><br />Crispy Development · Southeast Asia<br /><a href="mailto:chris@crispydevelopment.com" style={{ color: "oklch(30% 0.12 260)" }}>chris@crispydevelopment.com</a></p>
          <p style={{ marginTop: "1rem" }}>If you are located in the European Union and wish to exercise your data rights or lodge a concern, you may contact us directly at the address above. EU users retain all rights granted under GDPR, as described in Section 7 below.</p>
        </LegalSection>

        <LegalSection heading="2. What Data We Collect">
          <p><strong>a. Information you provide directly</strong></p>
          <ul>
            <li>Your name and email address when you subscribe to our newsletter or sign-up forms</li>
            <li>Any information you share when contacting us by email</li>
          </ul>
          <p style={{ marginTop: "1rem" }}><strong>b. Information collected automatically</strong></p>
          <ul>
            <li>We use Google Analytics 4 to collect basic usage data when you visit our website — including pages visited, time of visit, approximate location (country/city), device type, and referring website. This data is anonymous and aggregated; Google Analytics does not identify you personally. You can opt out via the <a href="https://tools.google.com/dlpage/gaoptout" style={{ color: "oklch(30% 0.12 260)" }}>Google Analytics opt-out browser add-on</a>.</li>
          </ul>
          <p style={{ marginTop: "1rem" }}><strong>c. Social media interactions</strong></p>
          <ul>
            <li>If you engage with Crispy Development on Instagram, Instagram collects and processes your data per Meta's own Privacy Policy. We only see aggregate metrics — we do not receive your personal data from Instagram.</li>
          </ul>
          <p style={{ marginTop: "1rem" }}>We do <strong>not</strong> collect sensitive personal data such as health information, financial details, or government identification numbers.</p>
        </LegalSection>

        <LegalSection heading="3. How We Use Your Data">
          <ul>
            <li>To send you our email newsletter and leadership content updates (Mailchimp)</li>
            <li>To respond to enquiries you send us</li>
            <li>To improve our website and content based on general usage patterns</li>
            <li>To notify you of new resources, programmes, or community updates</li>
          </ul>
          <p style={{ marginTop: "1rem" }}>We do <strong>not</strong> sell, rent, or share your personal data with third parties for their own marketing purposes.</p>
        </LegalSection>

        <LegalSection heading="4. Legal Basis for Processing (GDPR)">
          <p>If you are located in the EU or EEA, we process your personal data on the following legal bases under GDPR Article 6:</p>
          <ul style={{ marginTop: "1rem" }}>
            <li><strong>Consent (Art. 6(1)(a)):</strong> When you subscribe to our newsletter, you give explicit consent. You may withdraw this at any time by clicking the unsubscribe link or emailing <a href="mailto:chris@crispydevelopment.com" style={{ color: "oklch(30% 0.12 260)" }}>chris@crispydevelopment.com</a>.</li>
            <li><strong>Legitimate interests (Art. 6(1)(f)):</strong> For basic website administration and responding to direct enquiries, where our legitimate interest does not override your fundamental rights.</li>
          </ul>
        </LegalSection>

        <LegalSection heading="5. Data Processors">
          <p>We use the following third-party services as data processors:</p>
          <div style={{ overflowX: "auto", marginTop: "1.25rem" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", fontFamily: "var(--font-montserrat)", fontSize: "0.875rem" }}>
              <thead>
                <tr style={{ borderBottom: "2px solid oklch(88% 0.008 80)" }}>
                  <th style={{ textAlign: "left", padding: "0.5rem 0.75rem", color: "oklch(38% 0.008 260)", fontWeight: 700, letterSpacing: "0.06em", textTransform: "uppercase", fontSize: "0.65rem" }}>Processor</th>
                  <th style={{ textAlign: "left", padding: "0.5rem 0.75rem", color: "oklch(38% 0.008 260)", fontWeight: 700, letterSpacing: "0.06em", textTransform: "uppercase", fontSize: "0.65rem" }}>Purpose</th>
                </tr>
              </thead>
              <tbody>
                {[
                  ["Mailchimp (Intuit Inc.)", "Email newsletter delivery and subscriber list management"],
                  ["Meta / Instagram", "Social media presence"],
                  ["Website hosting provider", "Hosting crispyleaders.com"],
                  ["Community platform (TBD)", "If a community platform is introduced, it will be listed here"],
                ].map(([processor, purpose], i) => (
                  <tr key={i} style={{ borderBottom: "1px solid oklch(88% 0.008 80)" }}>
                    <td style={{ padding: "0.75rem", color: "oklch(22% 0.005 260)", fontWeight: 600 }}>{processor}</td>
                    <td style={{ padding: "0.75rem", color: "oklch(48% 0.008 260)" }}>{purpose}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </LegalSection>

        <LegalSection heading="6. International Data Transfers">
          <p>Crispy Development is based in Southeast Asia. Some processors including Mailchimp are based in the United States. Where data is transferred from the EEA to a country without an EU adequacy decision, we rely on <strong>Standard Contractual Clauses (SCCs)</strong> or equivalent protections.</p>
        </LegalSection>

        <LegalSection heading="7. Your Rights">
          <p><strong>All users:</strong></p>
          <ul>
            <li>The right to unsubscribe from our email list at any time</li>
            <li>The right to request confirmation of whether we hold data about you</li>
          </ul>
          <p style={{ marginTop: "1rem" }}><strong>EU / EEA users (GDPR rights):</strong> Access · Rectification · Erasure · Restriction of processing · Data portability · Object to processing · Withdraw consent.</p>
          <p style={{ marginTop: "1rem" }}>To exercise any right, contact <a href="mailto:chris@crispydevelopment.com" style={{ color: "oklch(30% 0.12 260)" }}>chris@crispydevelopment.com</a>. We respond within 30 days. EU users may also contact the <strong>Autoriteit Persoonsgegevens (AP)</strong> at <a href="https://www.autoriteitpersoonsgegevens.nl" style={{ color: "oklch(30% 0.12 260)" }}>autoriteitpersoonsgegevens.nl</a>.</p>
          <p style={{ marginTop: "1rem" }}><strong>California residents (CCPA):</strong> You have the right to know what we collect, request deletion, and opt out of any sale. We do not sell personal information.</p>
        </LegalSection>

        <LegalSection heading="8. Cookies">
          <p>Our website may use basic session cookies necessary for the site to function. As of April 2026, no third-party analytics or advertising cookies are deployed. If we introduce analytics tools in the future, we will update this policy and implement an appropriate consent mechanism before doing so.</p>
        </LegalSection>

        <LegalSection heading="9. Data Retention">
          <ul>
            <li><strong>Email subscribers:</strong> Retained until you unsubscribe.</li>
            <li><strong>Website usage data:</strong> Per policies of any analytics tools in use (none currently active).</li>
            <li><strong>Direct correspondence:</strong> Retained as long as reasonably necessary for the purpose of the correspondence.</li>
          </ul>
        </LegalSection>

        <LegalSection heading="10. Data Security">
          <p>We take reasonable technical and organisational steps to protect your personal data. However, no method of internet transmission is completely secure, and we cannot guarantee absolute security.</p>
        </LegalSection>

        <LegalSection heading="11. Children's Privacy">
          <p>Crispy Development is not directed at children under the age of 16. We do not knowingly collect personal data from children. If you believe a child has submitted personal data, contact <a href="mailto:chris@crispydevelopment.com" style={{ color: "oklch(30% 0.12 260)" }}>chris@crispydevelopment.com</a>.</p>
        </LegalSection>

        <LegalSection heading="12. Changes to This Policy">
          <p>We may update this Privacy Policy from time to time. When we do, we will revise the "Last updated" date at the top of this page. Continued use of our website after updates constitutes acceptance of the revised policy.</p>
        </LegalSection>

        <LegalSection heading="13. Contact" last>
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

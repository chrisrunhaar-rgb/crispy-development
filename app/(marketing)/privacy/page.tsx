export const metadata = { title: "Privacy Policy — Crispy Leaders" };

export default function PrivacyPage() {
  return (
    <div style={{ paddingBlock: "clamp(3rem, 5vw, 5rem)", background: "oklch(97% 0.005 80)" }}>
      <div className="container-text">
        <p className="t-label" style={{ color: "oklch(65% 0.15 45)", marginBottom: "1rem" }}>Legal</p>
        <h1 className="t-section" style={{ marginBottom: "0.5rem" }}>Privacy Policy</h1>
        <p style={{ fontFamily: "var(--font-montserrat)", fontSize: "0.8125rem", color: "oklch(62% 0.006 260)", marginBottom: "3rem" }}>Last updated: May 2026 · Version 1.0</p>

        <LegalSection heading="Introduction">
          <p>This Privacy Policy explains how Crispy Development Ltd collects, uses, stores, and shares your personal data when you use the Crispy Leaders platform, including the WayPoint AI coaching feature. It also explains your rights under UK GDPR.</p>
        </LegalSection>

        <LegalSection heading="1. Who We Are and How to Contact Us">
          <p>Crispy Development Ltd is the data controller for personal data collected through the Crispy Leaders platform.</p>
          <ul style={{ marginTop: "1rem" }}>
            <li>Company number: <em style={{ color: "oklch(62% 0.006 260)" }}>[Company Number]</em></li>
            <li>Registered address: <em style={{ color: "oklch(62% 0.006 260)" }}>[Registered Address]</em></li>
            <li>Contact: <a href="mailto:hello@crispyleaders.com" style={{ color: "oklch(30% 0.12 260)" }}>hello@crispyleaders.com</a></li>
          </ul>
          <p style={{ marginTop: "1rem" }}>The supervisory authority in the UK is the Information Commissioner's Office (ICO), Wycliffe House, Water Lane, Wilmslow, Cheshire SK9 5AF. <a href="https://ico.org.uk" style={{ color: "oklch(30% 0.12 260)" }}>ico.org.uk</a> · 0303 123 1113</p>
          <p style={{ marginTop: "1rem" }}><em>ICO registration note: ICO registration is pending. We are in the process of registering with the ICO as required for organisations that process personal data in the UK. This will be completed before onboarding paid subscribers.</em></p>
        </LegalSection>

        <LegalSection heading="2. What Data We Collect">
          <p><strong>2.1 Account data</strong></p>
          <p style={{ marginTop: "0.5rem" }}>When you create an account, we collect: your email address, display name, password (stored as a cryptographic hash — we never see your actual password), and your language preference (English or Indonesian).</p>

          <p style={{ marginTop: "1rem" }}><strong>2.2 Membership application data</strong></p>
          <p style={{ marginTop: "0.5rem" }}>Our membership application form collects additional context to understand your background. This includes: your role, your organisation, how you heard about us, and your faith or religious background.</p>
          <p style={{ marginTop: "0.75rem" }}>Religious belief is a special category of personal data under UK GDPR Article 9. We collect this only with your explicit consent, indicated by a clearly labelled opt-in checkbox at the time of application. You may decline this field without affecting your application.</p>

          <p style={{ marginTop: "1rem" }}><strong>2.3 Team data</strong></p>
          <p style={{ marginTop: "0.5rem" }}>If you join or create a team within the platform, we collect: your team name, which assessments your team has completed, and the names and email addresses of team members.</p>

          <p style={{ marginTop: "1rem" }}><strong>2.4 WayPoint AI coaching profile</strong></p>
          <p style={{ marginTop: "0.5rem" }}>If you use the WayPoint AI coaching feature, you will complete a coaching profile. This includes: your name, role, organisation, location, home culture and host culture, how long you have been in your current context, and any personal notes you choose to share with the AI coach to personalise your sessions.</p>
          <p style={{ marginTop: "0.75rem" }}>This data is used solely to personalise your coaching sessions. It is not visible to your team leader.</p>

          <p style={{ marginTop: "1rem" }}><strong>2.5 WayPoint session data</strong></p>
          <p style={{ marginTop: "0.5rem" }}>After each coaching session, a session whiteboard is stored in your account. This includes: the focus you set for the session, key insights generated, any actions you committed to, and content you chose to carry forward. This whiteboard is private to you. Your team leader cannot see it.</p>
          <p style={{ marginTop: "0.75rem" }}>We do not store your voice audio. Voice input is processed in real time by Google Gemini and is not retained by Crispy Development Ltd.</p>

          <p style={{ marginTop: "1rem" }}><strong>2.6 Push notification tokens</strong></p>
          <p style={{ marginTop: "0.5rem" }}>If you opt in to push notifications, we store a device push subscription endpoint in our database. This is used only to deliver notifications you have consented to. We do not use it for profiling or advertising.</p>

          <p style={{ marginTop: "1rem" }}><strong>2.7 Analytics data</strong></p>
          <p style={{ marginTop: "0.5rem" }}>We use two analytics tools:</p>
          <ul style={{ marginTop: "0.5rem" }}>
            <li><strong>Google Analytics 4 (GA4)</strong> — We use GA4 to collect basic usage data, including pages visited, time of visit, approximate location (country level), device type, and referring website. GA4 uses cookies. We activate GA4 only after you give explicit consent via the cookie banner shown on your first visit. You may decline or withdraw consent at any time. See our <a href="/cookies" style={{ color: "oklch(30% 0.12 260)" }}>Cookie Policy</a> for full details.</li>
            <li><strong>Vercel Analytics</strong> — A privacy-preserving tool that collects aggregated, anonymous traffic data (page views, device type, country-level location) without using cookies, without fingerprinting your device, and without tracking you across other websites. No consent is required for Vercel Analytics under UK GDPR.</li>
          </ul>
        </LegalSection>

        <LegalSection heading="3. Why We Process Your Data (Legal Basis)">
          <div style={{ overflowX: "auto", marginTop: "0.5rem" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", fontFamily: "var(--font-montserrat)", fontSize: "0.875rem" }}>
              <thead>
                <tr style={{ borderBottom: "2px solid oklch(88% 0.008 80)" }}>
                  <th style={{ textAlign: "left", padding: "0.5rem 0.75rem", color: "oklch(38% 0.008 260)", fontWeight: 700, letterSpacing: "0.06em", textTransform: "uppercase", fontSize: "0.65rem" }}>Data type</th>
                  <th style={{ textAlign: "left", padding: "0.5rem 0.75rem", color: "oklch(38% 0.008 260)", fontWeight: 700, letterSpacing: "0.06em", textTransform: "uppercase", fontSize: "0.65rem" }}>Legal basis</th>
                </tr>
              </thead>
              <tbody>
                {[
                  ["Account data", "Art. 6(1)(b) — performance of contract (providing you access to the platform)"],
                  ["Membership application data (general)", "Art. 6(1)(b) — performance of contract"],
                  ["Religious belief (Art. 9 data)", "Art. 9(2)(a) — explicit consent (opt-in checkbox)"],
                  ["WayPoint coaching profile", "Art. 6(1)(b) — performance of contract; Art. 6(1)(a) — consent for AI processing"],
                  ["WayPoint session whiteboards", "Art. 6(1)(b) — performance of contract"],
                  ["Push notification tokens", "Art. 6(1)(a) — consent"],
                  ["GA4 analytics", "Art. 6(1)(a) — consent (cookie banner)"],
                  ["Vercel Analytics", "Art. 6(1)(f) — legitimate interests (privacy-preserving, no personal data)"],
                ].map(([type, basis], i) => (
                  <tr key={i} style={{ borderBottom: "1px solid oklch(88% 0.008 80)" }}>
                    <td style={{ padding: "0.75rem", color: "oklch(22% 0.005 260)", fontWeight: 600 }}>{type}</td>
                    <td style={{ padding: "0.75rem", color: "oklch(48% 0.008 260)" }}>{basis}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </LegalSection>

        <LegalSection heading="4. Who We Share Your Data With">
          <p>We do not sell your data. We share it only with service providers (data processors) who help us operate the platform.</p>
          <div style={{ overflowX: "auto", marginTop: "1.25rem" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", fontFamily: "var(--font-montserrat)", fontSize: "0.875rem" }}>
              <thead>
                <tr style={{ borderBottom: "2px solid oklch(88% 0.008 80)" }}>
                  <th style={{ textAlign: "left", padding: "0.5rem 0.75rem", color: "oklch(38% 0.008 260)", fontWeight: 700, letterSpacing: "0.06em", textTransform: "uppercase", fontSize: "0.65rem" }}>Processor</th>
                  <th style={{ textAlign: "left", padding: "0.5rem 0.75rem", color: "oklch(38% 0.008 260)", fontWeight: 700, letterSpacing: "0.06em", textTransform: "uppercase", fontSize: "0.65rem" }}>Purpose</th>
                  <th style={{ textAlign: "left", padding: "0.5rem 0.75rem", color: "oklch(38% 0.008 260)", fontWeight: 700, letterSpacing: "0.06em", textTransform: "uppercase", fontSize: "0.65rem" }}>Location</th>
                </tr>
              </thead>
              <tbody>
                {[
                  ["Supabase Inc.", "Database, authentication, and secure storage of all platform data", "Singapore (ap-southeast-1)"],
                  ["Google LLC (Gemini API)", "Real-time voice processing for WayPoint AI coaching sessions", "Global (may include US)"],
                  ["Vercel Inc.", "Website hosting and deployment", "Global CDN"],
                  ["Resend Inc.", "Transactional email delivery (account notifications)", "United States"],
                  ["Google LLC (GA4)", "Website usage analytics (consent-based)", "United States"],
                  ["Vercel Analytics", "Privacy-preserving anonymous traffic analytics", "Global CDN"],
                ].map(([processor, purpose, location], i) => (
                  <tr key={i} style={{ borderBottom: "1px solid oklch(88% 0.008 80)" }}>
                    <td style={{ padding: "0.75rem", color: "oklch(22% 0.005 260)", fontWeight: 600 }}>{processor}</td>
                    <td style={{ padding: "0.75rem", color: "oklch(48% 0.008 260)" }}>{purpose}</td>
                    <td style={{ padding: "0.75rem", color: "oklch(48% 0.008 260)" }}>{location}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </LegalSection>

        <LegalSection heading="5. Google Gemini — Cross-Border Transfer Disclosure">
          <p>The WayPoint AI coaching feature uses Google's Gemini API to process your voice input in real time. This means your spoken words are transmitted to Google's servers during a session.</p>
          <ul style={{ marginTop: "1rem" }}>
            <li>Google's paid API does not use your inputs to train its AI models</li>
            <li>Crispy Development Ltd does not receive or store raw audio from your sessions</li>
            <li>The Gemini API currently routes data through Google's global infrastructure, which may include servers in the United States</li>
            <li>Google provides Standard Contractual Clauses (SCCs) for international data transfers</li>
            <li>Google's data processing terms (including UK GDPR compliance) apply to all API usage</li>
          </ul>
          <p style={{ marginTop: "1rem" }}>If you have concerns about cross-border data processing, you may choose not to use the WayPoint feature. Your core platform membership is not affected by this choice.</p>
        </LegalSection>

        <LegalSection heading="6. Data Retention">
          <div style={{ overflowX: "auto", marginTop: "0.5rem" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", fontFamily: "var(--font-montserrat)", fontSize: "0.875rem" }}>
              <thead>
                <tr style={{ borderBottom: "2px solid oklch(88% 0.008 80)" }}>
                  <th style={{ textAlign: "left", padding: "0.5rem 0.75rem", color: "oklch(38% 0.008 260)", fontWeight: 700, letterSpacing: "0.06em", textTransform: "uppercase", fontSize: "0.65rem" }}>Data type</th>
                  <th style={{ textAlign: "left", padding: "0.5rem 0.75rem", color: "oklch(38% 0.008 260)", fontWeight: 700, letterSpacing: "0.06em", textTransform: "uppercase", fontSize: "0.65rem" }}>Retention period</th>
                </tr>
              </thead>
              <tbody>
                {[
                  ["Account and membership data", "12 months after account closure, then deleted"],
                  ["WayPoint coaching profile and whiteboards", "12 months after account closure, then deleted"],
                  ["Push notification tokens", "Deleted when consent is withdrawn or account is closed"],
                  ["Financial transaction records", "7 years (statutory requirement)"],
                  ["GA4 analytics data", "Per Google Analytics retention settings (configured at 14 months)"],
                  ["Vercel Analytics data", "Aggregated and anonymous — no personal data retained"],
                ].map(([type, period], i) => (
                  <tr key={i} style={{ borderBottom: "1px solid oklch(88% 0.008 80)" }}>
                    <td style={{ padding: "0.75rem", color: "oklch(22% 0.005 260)", fontWeight: 600 }}>{type}</td>
                    <td style={{ padding: "0.75rem", color: "oklch(48% 0.008 260)" }}>{period}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </LegalSection>

        <LegalSection heading="7. Your Rights">
          <p>Under UK GDPR, you have the following rights:</p>
          <ul style={{ marginTop: "1rem" }}>
            <li><strong>Right of access</strong> — request a copy of the personal data we hold about you</li>
            <li><strong>Right to rectification</strong> — ask us to correct inaccurate data</li>
            <li><strong>Right to erasure</strong> — ask us to delete your data (subject to legal obligations)</li>
            <li><strong>Right to restriction</strong> — ask us to limit how we process your data</li>
            <li><strong>Right to data portability</strong> — receive your data in a structured, machine-readable format</li>
            <li><strong>Right to withdraw consent</strong> — where processing is based on consent, you may withdraw at any time without affecting the lawfulness of prior processing</li>
            <li><strong>Right to object</strong> — object to processing based on legitimate interests</li>
            <li><strong>Right to lodge a complaint</strong> — you may complain to the ICO at <a href="https://ico.org.uk" style={{ color: "oklch(30% 0.12 260)" }}>ico.org.uk</a> if you believe we have mishandled your data</li>
          </ul>
          <p style={{ marginTop: "1rem" }}>To exercise any of these rights, contact us at <a href="mailto:hello@crispyleaders.com" style={{ color: "oklch(30% 0.12 260)" }}>hello@crispyleaders.com</a>. We will respond within one calendar month.</p>
        </LegalSection>

        <LegalSection heading="8. Cookies and Tracking">
          <p>We use Google Analytics 4 (consent-based) and Vercel Analytics (no consent required). A cookie consent banner is shown on your first visit. You may accept or decline analytics cookies at any time.</p>
          <p style={{ marginTop: "1rem" }}>The following strictly necessary items may also be present:</p>
          <ul style={{ marginTop: "0.5rem" }}>
            <li><strong>Authentication session token</strong> — keeps you logged in (essential, no consent required)</li>
            <li><strong>Language preference</strong> — stored in local storage (essential, no consent required)</li>
            <li><strong>Cookie consent choice</strong> — stores your accept/decline decision in local storage</li>
          </ul>
          <p style={{ marginTop: "1rem" }}>We do not use Facebook Pixel, LinkedIn Insight Tag, or any advertising network tracker. For a full explanation of our analytics approach, see our <a href="/cookies" style={{ color: "oklch(30% 0.12 260)" }}>Cookie Policy</a>.</p>
        </LegalSection>

        <LegalSection heading="9. Security">
          <p>We take reasonable technical and organisational measures to protect your data, including encrypted connections (HTTPS), hashed passwords, and access controls on our database (Supabase, Singapore). No system is completely secure; if you believe your account has been compromised, contact us immediately at <a href="mailto:hello@crispyleaders.com" style={{ color: "oklch(30% 0.12 260)" }}>hello@crispyleaders.com</a>.</p>
        </LegalSection>

        <LegalSection heading="10. Governing Law">
          <p>This Privacy Policy is governed by the laws of <strong>England and Wales</strong>. The supervisory authority is the Information Commissioner's Office (ICO) at <a href="https://ico.org.uk" style={{ color: "oklch(30% 0.12 260)" }}>ico.org.uk</a>.</p>
        </LegalSection>

        <LegalSection heading="11. Changes to This Policy">
          <p>We may update this Privacy Policy from time to time. We will notify you of material changes by email or by a notice within the platform. The effective date at the top of this document will be updated. Continued use of the platform after the effective date constitutes your acceptance of the updated policy.</p>
        </LegalSection>

        <LegalSection heading="12. Contact" last>
          <p>Data protection queries: <a href="mailto:hello@crispyleaders.com" style={{ color: "oklch(30% 0.12 260)" }}>hello@crispyleaders.com</a></p>
          <p style={{ marginTop: "1rem" }}>
            Crispy Development Ltd<br />
            <em style={{ color: "oklch(62% 0.006 260)" }}>[Registered Address]</em><br />
            Company number: <em style={{ color: "oklch(62% 0.006 260)" }}>[Company Number]</em>
          </p>
          <p style={{ marginTop: "1rem" }}>Supervisory authority: Information Commissioner's Office (ICO) · <a href="https://ico.org.uk" style={{ color: "oklch(30% 0.12 260)" }}>ico.org.uk</a></p>
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

export const metadata = { title: "Terms of Service — Crispy Leaders" };

export default function TermsPage() {
  return (
    <div style={{ paddingBlock: "clamp(3rem, 5vw, 5rem)", background: "oklch(97% 0.005 80)" }}>
      <div className="container-text">
        <p className="t-label" style={{ color: "oklch(65% 0.15 45)", marginBottom: "1rem" }}>Legal</p>
        <h1 className="t-section" style={{ marginBottom: "0.5rem" }}>Terms of Service</h1>
        <p style={{ fontFamily: "var(--font-montserrat)", fontSize: "0.8125rem", color: "oklch(62% 0.006 260)", marginBottom: "3rem" }}>Last updated: May 2026 · Version 1.0</p>

        <LegalSection heading="Introduction">
          <p>These Terms of Service ("Terms") govern your access to and use of the Crispy Leaders platform, including all features, tools, courses, assessments, and the AI coaching feature ("WayPoint"). Please read them carefully before creating an account.</p>
        </LegalSection>

        <LegalSection heading="1. Who We Are">
          <p>Crispy Leaders is operated by Crispy Development Ltd, a company incorporated in England and Wales (company number: <em style={{ color: "oklch(62% 0.006 260)" }}>[Company Number]</em>), with its registered office at <em style={{ color: "oklch(62% 0.006 260)" }}>[Registered Address]</em>.</p>
          <p style={{ marginTop: "1rem" }}>You can contact us at <a href="mailto:hello@crispyleaders.com" style={{ color: "oklch(30% 0.12 260)" }}>hello@crispyleaders.com</a>.</p>
          <p style={{ marginTop: "1rem" }}>References to "we", "us", or "our" mean Crispy Development Ltd. References to "you" or "your" mean the individual creating an account and using the platform.</p>
        </LegalSection>

        <LegalSection heading="2. What the Platform Is">
          <p>Crispy Leaders is a digital membership platform for cross-cultural leaders, international workers, and those serving in cross-cultural contexts. The platform includes:</p>
          <ul style={{ marginTop: "1rem" }}>
            <li>A membership area with resources, frameworks, and leadership content</li>
            <li>Psychometric assessments (including DISC-based tools)</li>
            <li>Online courses delivered in English and Indonesian</li>
            <li>Team tools for leaders managing cross-cultural teams</li>
            <li>WayPoint — an AI coaching feature available to eligible members (see Section 4)</li>
          </ul>
          <p style={{ marginTop: "1rem" }}>The platform is available as a web application and may be installed as a Progressive Web App (PWA) on your device. See Section 8 for PWA terms.</p>
        </LegalSection>

        <LegalSection heading="3. Membership Terms">
          <p><strong>3.1 Account creation</strong></p>
          <p style={{ marginTop: "0.5rem" }}>To access the platform you must create an account with a valid email address. You are responsible for keeping your login credentials secure. Do not share your account.</p>
          <p style={{ marginTop: "1rem" }}><strong>3.2 Eligibility</strong></p>
          <p style={{ marginTop: "0.5rem" }}>You must be at least 18 years old to create an account. By registering, you confirm that you meet this requirement.</p>
          <p style={{ marginTop: "1rem" }}><strong>3.3 Membership access</strong></p>
          <p style={{ marginTop: "0.5rem" }}>Access to paid content and features is tied to an active membership. Free content remains accessible without a paid membership where indicated.</p>
          <p style={{ marginTop: "1rem" }}><strong>3.4 Trial access</strong></p>
          <p style={{ marginTop: "0.5rem" }}>We may offer trial access to certain features, including WayPoint AI coaching. Trial terms, duration, and feature limits will be communicated at sign-up. Trial access may be withdrawn or converted to paid access at our discretion.</p>
          <p style={{ marginTop: "1rem" }}><strong>3.5 Suspension and termination</strong></p>
          <p style={{ marginTop: "0.5rem" }}>We may suspend or terminate your account if you breach these Terms, misuse the platform, or engage in conduct that is harmful to other users or to us. We will give you reasonable notice except where immediate action is necessary.</p>
        </LegalSection>

        <LegalSection heading="4. AI Coaching Feature (WayPoint)">
          <p><strong>4.1 What WayPoint is</strong></p>
          <p style={{ marginTop: "0.5rem" }}>WayPoint is an AI-powered voice coaching feature available within the Crispy Leaders membership. It provides on-demand coaching sessions designed for cross-cultural leaders. Sessions are structured and may include reflective prompts, goal-setting, and journaling tools.</p>
          <p style={{ marginTop: "1rem" }}><strong>4.2 AI only — not human, not therapy</strong></p>
          <p style={{ marginTop: "0.5rem" }}>The AI coach is not a human. You are interacting with an artificial intelligence system. WayPoint is not a substitute for professional counselling, psychotherapy, mental health support, or medical advice. If you are experiencing a mental health crisis, please contact a qualified professional or emergency service in your country.</p>
          <p style={{ marginTop: "1rem" }}><strong>4.3 Powered by Google Gemini</strong></p>
          <p style={{ marginTop: "0.5rem" }}>WayPoint's voice processing is powered by the Google Gemini API. Your voice input is processed by Google in real time. Crispy Development Ltd does not store raw audio from your sessions. Google's paid API does not use your inputs to train its models. For details on Google's data practices, see our Privacy Policy.</p>
          <p style={{ marginTop: "1rem" }}><strong>4.4 Session whiteboard</strong></p>
          <p style={{ marginTop: "0.5rem" }}>At the end of each session, a session whiteboard is saved to your account. This includes your session focus, key insights, any actions you committed to, and content you choose to carry forward. This whiteboard is private to you.</p>
          <p style={{ marginTop: "1rem" }}><strong>4.5 No leader visibility</strong></p>
          <p style={{ marginTop: "0.5rem" }}>If you are a member of a team, your team leader does not have access to your WayPoint sessions. Your team leader cannot view your coaching conversations, your session whiteboard, your insights, your action steps, or any content from your sessions. This is a design principle of the platform, not simply a policy.</p>
          <p style={{ marginTop: "1rem" }}><strong>4.6 Access and eligibility</strong></p>
          <p style={{ marginTop: "0.5rem" }}>WayPoint access is controlled by your membership level. A default coaching trial allocation is granted to eligible members. Continued access beyond the trial is subject to your membership terms and any applicable subscription.</p>
          <p style={{ marginTop: "1rem" }}><strong>4.7 Limitations of AI coaching</strong></p>
          <p style={{ marginTop: "0.5rem" }}>AI coaching has limitations. The AI coach may make mistakes, misunderstand context, or give responses that are not appropriate for your specific situation. You should exercise your own judgement when using any suggestions or reflections from a session.</p>
        </LegalSection>

        <LegalSection heading="5. User Responsibilities">
          <p>By using the platform, you agree to:</p>
          <ul style={{ marginTop: "1rem" }}>
            <li>Provide accurate information when creating your account and coaching profile</li>
            <li>Use the platform for its intended purpose — personal and professional development as a cross-cultural leader</li>
            <li>Not attempt to reverse-engineer, scrape, copy, or redistribute platform content</li>
            <li>Not use the platform to harass, harm, or deceive other users or third parties</li>
            <li>Not attempt to manipulate, jailbreak, or misuse the AI coaching feature</li>
            <li>Comply with all applicable laws in your jurisdiction</li>
          </ul>
        </LegalSection>

        <LegalSection heading="6. Intellectual Property">
          <p><strong>6.1 Our content</strong></p>
          <p style={{ marginTop: "0.5rem" }}>All content on the platform — including course materials, frameworks, assessments, and branding — is owned by or licensed to Crispy Development Ltd. You may not copy, distribute, or create derivative works from our content without our written permission.</p>
          <p style={{ marginTop: "1rem" }}><strong>6.2 Your content</strong></p>
          <p style={{ marginTop: "0.5rem" }}>Content you create on the platform — such as your session whiteboard entries — remains yours. You grant us a limited licence to store and display it to you within the platform. We do not claim ownership of your personal content.</p>
          <p style={{ marginTop: "1rem" }}><strong>6.3 Feedback</strong></p>
          <p style={{ marginTop: "0.5rem" }}>If you submit feedback or suggestions about the platform, you agree we may use this without compensation or attribution to you.</p>
        </LegalSection>

        <LegalSection heading="7. Subscriptions and Payment">
          <p><strong>7.1 Paid memberships</strong></p>
          <p style={{ marginTop: "0.5rem" }}>Certain features require a paid subscription. Pricing and subscription tiers are described on our website. All prices are in the currency shown at checkout and are inclusive of any applicable taxes unless stated otherwise.</p>
          <p style={{ marginTop: "1rem" }}><strong>7.2 Billing</strong></p>
          <p style={{ marginTop: "0.5rem" }}>Subscriptions are billed on the cycle shown at sign-up (monthly or annual). Payment is processed by our payment provider. By subscribing, you authorise recurring charges.</p>
          <p style={{ marginTop: "1rem" }}><strong>7.3 Cancellation</strong></p>
          <p style={{ marginTop: "0.5rem" }}>You may cancel your subscription at any time. Cancellation takes effect at the end of the current billing period. We do not offer partial refunds for unused time unless required by applicable consumer law.</p>
          <p style={{ marginTop: "1rem" }}><strong>7.4 Subscription changes</strong></p>
          <p style={{ marginTop: "0.5rem" }}>We will give you at least 30 days' written notice of any material changes to subscription pricing or terms.</p>
          <p style={{ marginTop: "1rem" }}><strong>7.5 Refunds</strong></p>
          <p style={{ marginTop: "0.5rem" }}>If you are a consumer based in the UK or EU, you may have a statutory right of withdrawal within 14 days of purchase of a new subscription, provided you have not accessed paid digital content during that period. Contact <a href="mailto:hello@crispyleaders.com" style={{ color: "oklch(30% 0.12 260)" }}>hello@crispyleaders.com</a> to request a refund.</p>
        </LegalSection>

        <LegalSection heading="8. PWA Installation and Push Notifications">
          <p><strong>8.1 Progressive Web App</strong></p>
          <p style={{ marginTop: "0.5rem" }}>The Crispy Leaders platform can be installed as a Progressive Web App (PWA) on your mobile or desktop device. Installing the PWA is optional and does not affect your access to the platform via a browser. The PWA is the same application — it does not install any additional software.</p>
          <p style={{ marginTop: "1rem" }}><strong>8.2 Push notifications</strong></p>
          <p style={{ marginTop: "0.5rem" }}>We may offer push notifications for reminders, updates, or coaching prompts. Push notifications require your explicit consent. You will be asked to opt in — we will never send push notifications without your permission. You can withdraw consent at any time through your device or browser notification settings.</p>
          <p style={{ marginTop: "1rem" }}><strong>8.3 Uninstalling</strong></p>
          <p style={{ marginTop: "0.5rem" }}>You may uninstall the PWA at any time through your device's standard application management settings. Uninstalling does not delete your account or data.</p>
        </LegalSection>

        <LegalSection heading="9. Limitation of Liability">
          <p>To the fullest extent permitted by law:</p>
          <ul style={{ marginTop: "1rem" }}>
            <li>We provide the platform "as is" without warranties of any kind, express or implied</li>
            <li>We are not liable for indirect, incidental, or consequential losses arising from your use of the platform</li>
            <li>Our total liability to you for any claim arising from these Terms or your use of the platform is limited to the amount you paid us in the 12 months preceding the claim</li>
          </ul>
          <p style={{ marginTop: "1rem" }}>Nothing in these Terms limits our liability for death or personal injury caused by our negligence, fraud, or any other liability that cannot be excluded by law.</p>
          <p style={{ marginTop: "1rem" }}>If you are a consumer, you may have additional rights under applicable consumer protection law that these Terms do not affect.</p>
        </LegalSection>

        <LegalSection heading="10. Governing Law">
          <p>These Terms are governed by the laws of <strong>England and Wales</strong>. Any disputes arising from these Terms or your use of the platform will be subject to the exclusive jurisdiction of the courts of England and Wales.</p>
          <p style={{ marginTop: "1rem" }}>If you are a consumer resident in another jurisdiction, you may also have rights under local consumer protection laws that override this clause.</p>
        </LegalSection>

        <LegalSection heading="11. Changes to These Terms">
          <p>We may update these Terms from time to time. We will notify you of material changes by email or by a notice within the platform. Continued use of the platform after the effective date of any change constitutes your acceptance of the updated Terms.</p>
        </LegalSection>

        <LegalSection heading="12. Contact" last>
          <p>Questions about these Terms? Contact us at <a href="mailto:hello@crispyleaders.com" style={{ color: "oklch(30% 0.12 260)" }}>hello@crispyleaders.com</a>.</p>
          <p style={{ marginTop: "1rem" }}>
            Crispy Development Ltd<br />
            <em style={{ color: "oklch(62% 0.006 260)" }}>[Registered Address]</em><br />
            Company number: <em style={{ color: "oklch(62% 0.006 260)" }}>[Company Number]</em>
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

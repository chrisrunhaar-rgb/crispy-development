export const metadata = { title: "Cookie Policy — Crispy Leaders" };

export default function CookiesPage() {
  return (
    <div style={{ paddingBlock: "clamp(3rem, 5vw, 5rem)", background: "oklch(97% 0.005 80)" }}>
      <div className="container-text">
        <p className="t-label" style={{ color: "oklch(65% 0.15 45)", marginBottom: "1rem" }}>Legal</p>
        <h1 className="t-section" style={{ marginBottom: "0.5rem" }}>Cookie Policy</h1>
        <p style={{ fontFamily: "var(--font-montserrat)", fontSize: "0.8125rem", color: "oklch(62% 0.006 260)", marginBottom: "3rem" }}>Last updated: May 2026 · Version 1.0</p>

        <LegalSection heading="Introduction">
          <p>This Cookie Policy supplements our <a href="/privacy" style={{ color: "oklch(30% 0.12 260)" }}>Privacy Policy</a>. It explains specifically how we measure platform usage, what cookies and local storage items we use, and why we chose our current analytics approach.</p>
          <p style={{ marginTop: "1rem" }}>This policy is issued by Crispy Development Ltd. Contact: <a href="mailto:hello@crispyleaders.com" style={{ color: "oklch(30% 0.12 260)" }}>hello@crispyleaders.com</a>.</p>
        </LegalSection>

        <LegalSection heading="1. Our Approach: Privacy-First Analytics">
          <p>We use two analytics tools on this platform — Google Analytics 4 (with your consent) and Vercel Analytics (which requires no consent). We have built our analytics setup around the principle that your browsing behaviour should remain under your control.</p>
          <ul style={{ marginTop: "1rem" }}>
            <li>A cookie consent banner is shown on your first visit</li>
            <li>Google Analytics 4 is only activated if you click "Accept" — it never fires if you decline</li>
            <li>Vercel Analytics runs independently of your cookie choice: it uses no cookies and collects no personal data</li>
            <li>You can change your consent choice at any time by clearing your browser's local storage for this site</li>
          </ul>
        </LegalSection>

        <LegalSection heading="2. What We Measure">
          <p><strong>Google Analytics 4 (consent required)</strong></p>
          <p style={{ marginTop: "0.5rem" }}>When you accept cookies, GA4 collects:</p>
          <ul style={{ marginTop: "0.5rem" }}>
            <li>Pages visited and navigation patterns</li>
            <li>Time spent on pages</li>
            <li>Country-level location (never city or street level)</li>
            <li>Device type (mobile, desktop, tablet)</li>
            <li>Browser type</li>
            <li>Referring source (for example, whether you arrived from a search engine or a link)</li>
          </ul>
          <p style={{ marginTop: "1rem" }}>GA4 uses cookies to distinguish sessions and track returning visitors (with your consent). Data is sent to Google's servers, which may include servers in the United States. See our <a href="/privacy" style={{ color: "oklch(30% 0.12 260)" }}>Privacy Policy</a>, Section 5 for the cross-border transfer disclosure.</p>

          <p style={{ marginTop: "1.5rem" }}><strong>Vercel Analytics (no consent required)</strong></p>
          <p style={{ marginTop: "0.5rem" }}>Vercel Analytics collects aggregated, anonymised information regardless of your cookie choice:</p>
          <ul style={{ marginTop: "0.5rem" }}>
            <li>Page views and navigation patterns across the platform</li>
            <li>Device type (mobile, desktop, tablet)</li>
            <li>Country-level location — never city or street level</li>
            <li>Browser type</li>
            <li>Referral source</li>
          </ul>
          <p style={{ marginTop: "0.75rem" }}>None of this data is linked to your account or identity. We cannot identify individual users from Vercel Analytics data. No cookies are set. Your device is not fingerprinted. You are not tracked across other websites.</p>
        </LegalSection>

        <LegalSection heading="3. Full Cookie and Local Storage Inventory">
          <div style={{ overflowX: "auto", marginTop: "0.5rem" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", fontFamily: "var(--font-montserrat)", fontSize: "0.875rem" }}>
              <thead>
                <tr style={{ borderBottom: "2px solid oklch(88% 0.008 80)" }}>
                  <th style={{ textAlign: "left", padding: "0.5rem 0.75rem", color: "oklch(38% 0.008 260)", fontWeight: 700, letterSpacing: "0.06em", textTransform: "uppercase", fontSize: "0.65rem" }}>Name / type</th>
                  <th style={{ textAlign: "left", padding: "0.5rem 0.75rem", color: "oklch(38% 0.008 260)", fontWeight: 700, letterSpacing: "0.06em", textTransform: "uppercase", fontSize: "0.65rem" }}>Purpose</th>
                  <th style={{ textAlign: "left", padding: "0.5rem 0.75rem", color: "oklch(38% 0.008 260)", fontWeight: 700, letterSpacing: "0.06em", textTransform: "uppercase", fontSize: "0.65rem" }}>Category</th>
                  <th style={{ textAlign: "left", padding: "0.5rem 0.75rem", color: "oklch(38% 0.008 260)", fontWeight: 700, letterSpacing: "0.06em", textTransform: "uppercase", fontSize: "0.65rem" }}>Consent needed?</th>
                </tr>
              </thead>
              <tbody>
                {[
                  ["Authentication session token", "Keeps you logged in to your account", "Strictly necessary", "No"],
                  ["Language preference (local storage)", "Remembers your language choice (EN/ID)", "Strictly necessary", "No"],
                  ["Cookie consent choice (local storage)", "Stores your accept or decline decision", "Strictly necessary", "No"],
                  ["GA4 cookies (_ga, _ga_*)", "Distinguishes sessions and returning visitors for Google Analytics 4", "Analytics", "Yes — via consent banner"],
                  ["Vercel Analytics (no cookies)", "Aggregated anonymous traffic data — no cookies set", "Analytics", "No"],
                ].map(([name, purpose, category, consent], i) => (
                  <tr key={i} style={{ borderBottom: "1px solid oklch(88% 0.008 80)" }}>
                    <td style={{ padding: "0.75rem", color: "oklch(22% 0.005 260)", fontWeight: 600 }}>{name}</td>
                    <td style={{ padding: "0.75rem", color: "oklch(48% 0.008 260)" }}>{purpose}</td>
                    <td style={{ padding: "0.75rem", color: "oklch(48% 0.008 260)" }}>{category}</td>
                    <td style={{ padding: "0.75rem", color: "oklch(48% 0.008 260)" }}>{consent}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </LegalSection>

        <LegalSection heading="4. Why We Made These Choices">
          <p>We chose Vercel Analytics as our baseline measurement tool because it gives us the traffic data we need — page performance, usage patterns, and geographic reach — without requiring consent or tracking individuals. It aligns with our values around privacy and simplicity.</p>
          <p style={{ marginTop: "1rem" }}>We also use Google Analytics 4 because it provides richer session-level data that helps us improve the platform experience. We have implemented GA4 with Consent Mode v2, which means GA4 is fully disabled by default and only activates when you explicitly accept cookies. If you decline, GA4 never fires — no data is sent to Google.</p>
        </LegalSection>

        <LegalSection heading="5. No Advertising Trackers">
          <p>We do not use Facebook Pixel, Google Ads conversion tracking, LinkedIn Insight Tag, or any other advertising network tracker. We do not run retargeting campaigns that follow you across the web.</p>
        </LegalSection>

        <LegalSection heading="6. How to Manage Your Consent">
          <p>You can manage your cookie consent in the following ways:</p>
          <ul style={{ marginTop: "1rem" }}>
            <li><strong>Decline at first visit:</strong> Click "Decline" on the cookie banner shown when you first visit the site</li>
            <li><strong>Withdraw consent later:</strong> Clear your browser's local storage for crispyleaders.com — the consent banner will reappear on your next visit</li>
            <li><strong>Google Analytics opt-out:</strong> You may also install the <a href="https://tools.google.com/dlpage/gaoptout" style={{ color: "oklch(30% 0.12 260)" }}>Google Analytics opt-out browser add-on</a> to prevent GA4 from collecting data regardless of your consent choice on this site</li>
            <li><strong>Browser settings:</strong> Most browsers allow you to block or delete cookies through their settings. Note that blocking strictly necessary cookies may prevent you from logging in</li>
          </ul>
        </LegalSection>

        <LegalSection heading="7. If This Changes">
          <p>If we introduce new cookie-based tools or advertising trackers in the future, we will update this policy, update our Privacy Policy, and implement a proper consent mechanism before doing so. We will notify you as required by UK GDPR.</p>
        </LegalSection>

        <LegalSection heading="8. Contact" last>
          <p>Questions about cookies or tracking? Contact us at <a href="mailto:hello@crispyleaders.com" style={{ color: "oklch(30% 0.12 260)" }}>hello@crispyleaders.com</a>.</p>
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

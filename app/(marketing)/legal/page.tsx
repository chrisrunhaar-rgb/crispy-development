import { companyInfo } from "@/lib/company-info";

export const metadata = { title: "Legal & Company Info — Crispy Leaders" };

export default function LegalPage() {
  return (
    <div style={{ paddingBlock: "clamp(3rem, 5vw, 5rem)", background: "oklch(97% 0.005 80)" }}>
      <div className="container-text">
        <p className="t-label" style={{ color: "oklch(65% 0.15 45)", marginBottom: "1rem" }}>Legal</p>
        <h1 className="t-section" style={{ marginBottom: "0.5rem" }}>Legal &amp; Company Info</h1>
        <p style={{ fontFamily: "var(--font-montserrat)", fontSize: "0.8125rem", color: "oklch(62% 0.006 260)", marginBottom: "3rem" }}>Trading disclosure — Companies Act 2006</p>

        <Row label="Company Name" value={companyInfo.legalName} />
        <Row label="Company Number" value={companyInfo.companyNumber} />
        <Row label="Company Type" value={`${companyInfo.structure}, incorporated in ${companyInfo.jurisdiction}`} />
        <Row label="Registered Office" value={companyInfo.registeredOffice} />
        <Row label="VAT" value={companyInfo.vatNote} last />

        <p style={{ marginTop: "2.5rem", fontFamily: "var(--font-montserrat)", fontSize: "0.85rem", color: "oklch(48% 0.008 260)" }}>
          For our full data-protection and platform terms, see our{" "}
          <a href="/privacy" style={{ color: "oklch(30% 0.12 260)" }}>Privacy Policy</a> and{" "}
          <a href="/terms" style={{ color: "oklch(30% 0.12 260)" }}>Terms of Service</a>.
        </p>
      </div>
    </div>
  );
}

function Row({ label, value, last = false }: { label: string; value: string; last?: boolean }) {
  return (
    <div style={{ marginBottom: last ? 0 : "1.75rem", paddingBottom: last ? 0 : "1.75rem", borderBottom: last ? "none" : "1px solid oklch(88% 0.008 80)" }}>
      <h2 style={{ fontFamily: "var(--font-montserrat)", fontWeight: 700, fontSize: "0.7rem", letterSpacing: "0.08em", textTransform: "uppercase", color: "oklch(38% 0.008 260)", marginBottom: "0.5rem" }}>{label}</h2>
      <p style={{ fontFamily: "var(--font-montserrat)", fontSize: "0.9rem", color: "oklch(38% 0.008 260)", lineHeight: 1.7 }}>{value}</p>
    </div>
  );
}

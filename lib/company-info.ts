// Reusable UK Companies Act 2006 trading-disclosure info for crispyleaders.com.
// Single source of truth for: footer copyright line, Privacy Policy / Terms of
// Service registered-company placeholders, and the /legal page.
// PLACEHOLDER COPY (THEO, 2026-09-16) — swap for CLEO's final wording / BEAU's
// design spec before this goes live. Structure/values below are correct as
// incorporated; only phrasing is provisional.

export const companyInfo = {
  legalName: "Crispy Development Ltd",
  companyNumber: "17460725",
  structure: "Private Limited Company",
  jurisdiction: "England and Wales",
  registeredOffice: "Beren Court, Newney Green, Chelmsford, CM1 3SQ",
  vatNote: "A VAT number will be added here once the company is VAT registered.",
} as const;

export function copyrightLine(year: number = new Date().getFullYear()): string {
  return `© ${year} ${companyInfo.legalName}`;
}

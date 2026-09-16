// Reusable UK Companies Act 2006 trading-disclosure info for crispyleaders.com.
// Single source of truth for: footer copyright line, Privacy Policy / Terms of
// Service registered-company references, and the /legal page.
// Final copy from CLEO (2026-09-16) — verbatim, do not paraphrase.
// Note: copyrightLine() intentionally omits "All rights reserved." — Footer.tsx
// appends the localized t.footer.rightsReserved string after it.

export const companyInfo = {
  legalName: "Crispy Development Ltd",
  companyNumber: "17460725",
  structure: "private limited company",
  jurisdiction: "England and Wales",
  registeredOffice: "Beren Court, Newney Green, Chelmsford, CM1 3SQ, United Kingdom",
  vatNote: "Crispy Development Ltd is not currently VAT-registered. A VAT number will be added here once registration is complete.",
} as const;

export function copyrightLine(year: number = new Date().getFullYear()): string {
  return `© ${year} ${companyInfo.legalName}.`;
}

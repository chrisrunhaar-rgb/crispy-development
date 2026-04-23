import type { Metadata } from "next";
import { Montserrat, Cormorant_Garamond, Kalam } from "next/font/google";
import Script from "next/script";
import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/next";
import "./globals.css";
import { LanguageProvider } from "@/lib/LanguageContext";
import PwaRegister from "@/components/PwaRegister";

const GA_ID = "G-ER3Z5GN1J7";

const montserrat = Montserrat({
  subsets: ["latin"],
  variable: "--font-montserrat-var",
  weight: ["300", "400", "600", "700", "800"],
  display: "swap",
});

const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  variable: "--font-cormorant-var",
  weight: ["300", "400"],
  style: ["normal", "italic"],
  display: "swap",
});

const kalam = Kalam({
  subsets: ["latin"],
  variable: "--font-kalam-var",
  weight: ["400", "700"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Crispy Development — Raising leaders who cross cultures.",
  description:
    "Resources, tools, and community for Christian leaders, expat professionals, and multicultural team managers.",
  icons: {
    icon: "/logo-icon.png",
    apple: "/logo-icon.png",
    shortcut: "/logo-icon.png",
  },
  openGraph: {
    title: "Crispy Development",
    description: "Raising leaders who cross cultures.",
    url: "https://crispyleaders.com",
    siteName: "Crispy Development",
    locale: "en_US",
    type: "website",
    images: [{ url: "https://crispyleaders.com/logo-full.png", width: 1200, alt: "Crispy Development" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Crispy Development",
    description: "Raising leaders who cross cultures.",
    images: ["https://crispyleaders.com/logo-full.png"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${montserrat.variable} ${cormorant.variable} ${kalam.variable} h-full`}
    >
      <body className="min-h-full flex flex-col antialiased">
        {/* Google Analytics 4 */}
        <Script
          src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`}
          strategy="afterInteractive"
        />
        <Script id="ga4-init" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', '${GA_ID}');
          `}
        </Script>
        <PwaRegister />
        <LanguageProvider>
          {children}
        </LanguageProvider>
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}

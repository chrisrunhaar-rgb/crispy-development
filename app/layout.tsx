import type { Metadata } from "next";
import { Montserrat, Cormorant_Garamond } from "next/font/google";
import "./globals.css";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import { LanguageProvider } from "@/lib/LanguageContext";
import PwaRegister from "@/components/PwaRegister";

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

export const metadata: Metadata = {
  title: "Crispy Development — Raising leaders who cross cultures.",
  description:
    "Resources, tools, and community for cross-cultural leaders, missionaries, and multicultural team managers.",
  openGraph: {
    title: "Crispy Development",
    description: "Raising leaders who cross cultures.",
    url: "https://crispyleaders.com",
    siteName: "Crispy Development",
    locale: "en_US",
    type: "website",
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
      className={`${montserrat.variable} ${cormorant.variable} h-full`}
    >
      <body className="min-h-full flex flex-col antialiased">
        <PwaRegister />
        <LanguageProvider>
          <Nav />
          <main className="flex-1">{children}</main>
          <Footer />
        </LanguageProvider>
      </body>
    </html>
  );
}

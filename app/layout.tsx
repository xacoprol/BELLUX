import type { Metadata } from "next";
import { Barlow_Condensed, Cormorant_Garamond, Montserrat } from "next/font/google";
import { LanguageProvider } from "@/context/LanguageContext";
import "./globals.css";
import PageEffects from "@/components/PageEffects";

const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  style: ["normal", "italic"],
  variable: "--font-serif",
  display: "swap",
});

const montserrat = Montserrat({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-sans",
  display: "swap",
});

const barlowCondensed = Barlow_Condensed({
  subsets: ["latin"],
  weight: ["500", "600", "700", "800"],
  variable: "--font-condensed",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Bellux Entertainment",
  description:
    "Mais de 15 anos de experiência em animação, entretenimento e produção de espetáculos no Algarve, Portugal e Espanha.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="pt"
      className={`${cormorant.variable} ${montserrat.variable} ${barlowCondensed.variable}`}
      suppressHydrationWarning
    >
      <body>
        <LanguageProvider>
          <PageEffects />
          {children}
        </LanguageProvider>
      </body>
    </html>
  );
}

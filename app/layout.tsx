import type { Metadata, Viewport } from "next";
import { Boldonse, Inter } from "next/font/google";
import { LanguageProvider } from "@/context/LanguageContext";
import "./globals.css";
import PageEffects from "@/components/PageEffects";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
});

const boldonse = Boldonse({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-display",
  display: "swap",
  adjustFontFallback: false,
});

export const metadata: Metadata = {
  title: "Bellux Entertainment",
  description:
    "Mais de 15 anos de experiência em animação, entretenimento e produção de espetáculos no Algarve, Portugal e Espanha.",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  themeColor: "#080710",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="pt"
      className={`${inter.variable} ${boldonse.variable}`}
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

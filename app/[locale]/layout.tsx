import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { LanguageProvider } from "@/context/LanguageContext";
import PageEffects from "@/components/PageEffects";
import CookieBanner from "@/components/CookieBanner";
import { content } from "@/lib/i18n/content";
import { isLocale, locales } from "@/lib/i18n/routing";
import type { Locale } from "@/lib/i18n/types";
import {
  buildPageMetadata,
  organizationJsonLd,
  websiteJsonLd,
} from "@/lib/seo";

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale: raw } = await params;
  if (!isLocale(raw)) return {};
  const locale = raw as Locale;
  const meta = content[locale].meta;
  return buildPageMetadata({
    locale,
    title: meta.title,
    description: meta.description,
    path: "/",
  });
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale: raw } = await params;
  if (!isLocale(raw)) notFound();
  const locale = raw as Locale;

  const jsonLd = [organizationJsonLd(), websiteJsonLd(locale)];

  return (
    <LanguageProvider initialLocale={locale}>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <PageEffects />
      <CookieBanner />
      {children}
    </LanguageProvider>
  );
}

import type { Metadata } from "next";
import type { Locale } from "@/lib/i18n/types";
import { defaultLocale, localePath, locales } from "@/lib/i18n/routing";
import { company } from "@/lib/company";

export const SITE_URL = (
  process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") ||
  "https://belluxentertainment.com"
).replace(/\/$/, "");

export const SITE_NAME = "Bellux Entertainment";

const OG_LOCALE: Record<Locale, string> = {
  pt: "pt_PT",
  es: "es_ES",
  en: "en_US",
};

export function absoluteUrl(path = "/"): string {
  if (path.startsWith("http")) return path;
  const clean = path.startsWith("/") ? path : `/${path}`;
  return `${SITE_URL}${clean === "/" ? "" : clean}` || SITE_URL;
}

export function buildPageMetadata({
  locale,
  title,
  description,
  path = "/",
}: {
  locale: Locale;
  title: string;
  description: string;
  path?: string;
}): Metadata {
  const localizedPath = localePath(locale, path);
  const canonical = absoluteUrl(localizedPath);
  const languages: Record<string, string> = {
    "x-default": absoluteUrl(localePath(defaultLocale, path)),
  };
  for (const lang of locales) {
    languages[lang] = absoluteUrl(localePath(lang, path));
  }

  const fullTitle =
    title === SITE_NAME || title.startsWith(`${SITE_NAME}`)
      ? title
      : `${title} | ${SITE_NAME}`;

  return {
    title: { absolute: fullTitle },
    description,
    metadataBase: new URL(SITE_URL),
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
      },
    },
    alternates: {
      canonical,
      languages,
    },
    openGraph: {
      type: "website",
      siteName: SITE_NAME,
      title: fullTitle,
      description,
      url: canonical,
      locale: OG_LOCALE[locale],
      alternateLocale: locales
        .filter((l) => l !== locale)
        .map((l) => OG_LOCALE[l]),
    },
    twitter: {
      card: "summary_large_image",
      title: fullTitle,
      description,
    },
  };
}

export function organizationJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: SITE_NAME,
    legalName: company.legalName,
    taxID: company.nif,
    url: SITE_URL,
    logo: absoluteUrl("/assets/images/logo.png"),
    address: {
      "@type": "PostalAddress",
      streetAddress: company.addressLine,
      postalCode: company.postalCode,
      addressLocality: company.city,
      addressCountry: "PT",
    },
    telephone: company.phone,
    sameAs: [
      "https://www.instagram.com/belluxentertainment",
      "https://www.facebook.com/belluxentertainment",
    ],
    areaServed: ["PT", "ES"],
  };
}

export function websiteJsonLd(locale: Locale) {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: SITE_NAME,
    url: absoluteUrl(localePath(locale, "/")),
    inLanguage: locale,
    publisher: {
      "@type": "Organization",
      name: SITE_NAME,
    },
  };
}

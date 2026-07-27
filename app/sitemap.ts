import type { MetadataRoute } from "next";
import { localePath, locales } from "@/lib/i18n/routing";
import { absoluteUrl } from "@/lib/seo";

const paths = ["/", "/proyectos"] as const;

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  return paths.flatMap((path) =>
    locales.map((locale) => ({
      url: absoluteUrl(localePath(locale, path)),
      lastModified: now,
      changeFrequency: path === "/" ? "weekly" : "weekly",
      priority: path === "/" ? 1 : 0.8,
      alternates: {
        languages: Object.fromEntries(
          locales.map((lang) => [lang, absoluteUrl(localePath(lang, path))])
        ),
      },
    }))
  );
}

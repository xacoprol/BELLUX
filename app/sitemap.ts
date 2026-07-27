import type { MetadataRoute } from "next";
import { localePath, locales } from "@/lib/i18n/routing";
import { legalPaths } from "@/lib/i18n/legal";
import { absoluteUrl } from "@/lib/seo";

const paths = ["/", "/proyectos", ...legalPaths] as const;

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  return paths.flatMap((path) =>
    locales.map((locale) => ({
      url: absoluteUrl(localePath(locale, path)),
      lastModified: now,
      changeFrequency: path === "/" ? "weekly" : "monthly",
      priority: path === "/" ? 1 : path === "/proyectos" ? 0.8 : 0.3,
      alternates: {
        languages: Object.fromEntries(
          locales.map((lang) => [lang, absoluteUrl(localePath(lang, path))])
        ),
      },
    }))
  );
}

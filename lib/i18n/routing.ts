import type { Locale } from "./types";

export const defaultLocale: Locale = "pt";
export const locales: Locale[] = ["pt", "es", "en"];

export function isLocale(value: string): value is Locale {
  return locales.includes(value as Locale);
}

/** Remove leading locale segment from a pathname (`/es/proyectos` → `/proyectos`). */
export function stripLocale(pathname: string): string {
  const parts = pathname.split("/").filter(Boolean);
  if (parts[0] && isLocale(parts[0])) {
    const rest = parts.slice(1).join("/");
    return rest ? `/${rest}` : "/";
  }
  return pathname.startsWith("/") ? pathname || "/" : `/${pathname}`;
}

export function getLocaleFromPathname(pathname: string): Locale {
  const first = pathname.split("/").filter(Boolean)[0];
  if (first && isLocale(first)) return first;
  return defaultLocale;
}

/**
 * Build a public path for a locale.
 * PT has no prefix: `/`, `/proyectos`, `/#sobre`
 * ES/EN: `/es`, `/en/proyectos`, `/es#sobre`
 */
export function localePath(locale: Locale, path = "/"): string {
  const hashIndex = path.indexOf("#");
  const pathname = hashIndex >= 0 ? path.slice(0, hashIndex) : path;
  const hash = hashIndex >= 0 ? path.slice(hashIndex + 1) : "";

  // Hash-only anchors stay on the current page
  if (!pathname) {
    return hash ? `#${hash}` : "/";
  }

  const clean = stripLocale(pathname.startsWith("/") ? pathname : `/${pathname}`);
  const suffix = clean === "/" ? "" : clean;

  const result =
    locale === defaultLocale ? suffix || "/" : `/${locale}${suffix}`;

  return hash ? `${result}#${hash}` : result;
}

/** Swap locale on a pathname (internal or public), preserving path after locale. */
export function switchLocalePath(pathname: string, next: Locale): string {
  return localePath(next, stripLocale(pathname));
}

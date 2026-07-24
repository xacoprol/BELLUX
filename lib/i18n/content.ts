import type { Locale } from "./types";
import { pt } from "./locales/pt";
import { es } from "./locales/es";
import { en } from "./locales/en";

export const content = { pt, es, en };

export const localeLabels: Record<Locale, string> = {
  pt: "PT",
  es: "ES",
  en: "EN",
};

export const locales: Locale[] = ["pt", "es", "en"];

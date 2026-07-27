"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useTransition,
} from "react";
import { usePathname, useRouter } from "next/navigation";
import { content } from "@/lib/i18n/content";
import { switchLocalePath } from "@/lib/i18n/routing";
import type { Locale, SiteContent } from "@/lib/i18n/types";

type LanguageContextValue = {
  locale: Locale;
  setLocale: (locale: Locale) => void;
  t: SiteContent;
};

const LanguageContext = createContext<LanguageContextValue | null>(null);

const STORAGE_KEY = "bellux-locale";

export function LanguageProvider({
  children,
  initialLocale,
}: {
  children: React.ReactNode;
  initialLocale: Locale;
}) {
  const locale = initialLocale;
  const router = useRouter();
  const pathname = usePathname();
  const [, startTransition] = useTransition();

  useEffect(() => {
    document.documentElement.lang = locale;
    localStorage.setItem(STORAGE_KEY, locale);
  }, [locale]);

  const setLocale = useCallback(
    (next: Locale) => {
      if (next === locale) return;
      localStorage.setItem(STORAGE_KEY, next);
      const hash =
        typeof window !== "undefined" ? window.location.hash.replace(/^#/, "") : "";
      const base = switchLocalePath(pathname || "/", next);
      const target = hash ? `${base}#${hash}` : base;
      startTransition(() => {
        router.push(target);
      });
    },
    [locale, pathname, router]
  );

  const value = useMemo(
    () => ({
      locale,
      setLocale,
      t: content[locale],
    }),
    [locale, setLocale]
  );

  return (
    <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>
  );
}

export function useLanguage() {
  const ctx = useContext(LanguageContext);
  if (!ctx) {
    throw new Error("useLanguage must be used within LanguageProvider");
  }
  return ctx;
}

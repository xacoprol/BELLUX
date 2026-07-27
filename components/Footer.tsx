"use client";

import Link from "next/link";
import Logo from "./Logo";
import { useLanguage } from "@/context/LanguageContext";
import { localePath } from "@/lib/i18n/routing";

export default function Footer() {
  const { locale, t } = useLanguage();

  const footLinks = [
    { href: localePath(locale, "/#sobre"), label: t.nav.about },
    { href: localePath(locale, "/#servicios"), label: t.nav.services },
    { href: localePath(locale, "/proyectos"), label: t.nav.projects },
    { href: "#contacto", label: t.nav.contact },
  ];

  return (
    <footer>
      <div className="wrap">
        <div className="foot-row">
          <Logo href={localePath(locale, "/")} />
          <div className="foot-links">
            {footLinks.map((link) => (
              <Link key={link.href} href={link.href}>
                {link.label}
              </Link>
            ))}
          </div>
        </div>
        <div className="copy">
          <span>{t.footer.copy}</span>
          <span>{t.footer.note}</span>
        </div>
      </div>
    </footer>
  );
}

"use client";

import Link from "next/link";
import Logo from "./Logo";
import { useLanguage } from "@/context/LanguageContext";

export default function Footer() {
  const { t } = useLanguage();

  const footLinks = [
    { href: "/#sobre", label: t.nav.about },
    { href: "/#servicios", label: t.nav.services },
    { href: "/proyectos", label: t.nav.projects },
    { href: "#contacto", label: t.nav.contact },
  ];

  return (
    <footer>
      <div className="wrap">
        <div className="foot-row">
          <Logo />
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

"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useLanguage } from "@/context/LanguageContext";
import { localeLabels, locales } from "@/lib/i18n/content";
import type { Locale } from "@/lib/i18n/types";
import { wpMedia, type WpClient } from "@/lib/wp";
import Logo from "./Logo";

export default function Hero({ wpClients = [] }: { wpClients?: WpClient[] }) {
  const { locale, setLocale, t } = useLanguage();
  const [menuOpen, setMenuOpen] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  const navLinks = [
    { href: "#sobre", label: t.nav.about },
    { href: "#servicios", label: t.nav.services },
    { href: "#proyectos", label: t.nav.projects },
    { href: "#contacto", label: t.nav.contact },
  ];

  const titleLead = `${t.hero.titleLine1} ${t.hero.titleLine2}`;
  const titleAccent = t.hero.titleLine3;
  const tagline = t.hero.subtitle;
  const clientLogos: WpClient[] =
    wpClients.length > 0
      ? wpClients
      : t.clients.items.map((title, i) => ({
          id: i,
          title,
          logo: "",
          logoTone: "silhouette" as const,
        }));

  const closeMenu = () => setMenuOpen(false);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const syncMotion = () => {
      if (mq.matches) {
        video.pause();
      } else {
        void video.play().catch(() => {});
      }
    };

    syncMotion();
    mq.addEventListener("change", syncMotion);
    return () => mq.removeEventListener("change", syncMotion);
  }, []);

  return (
    <section className="hero" id="inicio">
      <div className="hero-media" aria-hidden="true">
        <video
          ref={videoRef}
          className="hero-media-video"
          src={wpMedia.heroVideo}
          autoPlay
          muted
          loop
          playsInline
          preload="metadata"
        />
        <div className="hero-media-fallback" />
        <div className="hero-media-overlay" />
      </div>

      <header className="hero-nav" id="hdr">
        <Logo className="logo--nav" priority />

        <nav className="hero-nav-pill" aria-label="Primary">
          {navLinks.map((link) => (
            <Link key={link.href} href={link.href}>
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="hero-nav-end">
          <div className="lang hero-lang">
            {locales.map((lang, i) => (
              <span key={lang} style={{ display: "contents" }}>
                {i > 0 && <span className="lang-sep">/</span>}
                <button
                  type="button"
                  className={locale === lang ? "active" : undefined}
                  onClick={() => setLocale(lang as Locale)}
                >
                  {localeLabels[lang]}
                </button>
              </span>
            ))}
          </div>

          <Link href="#contacto" className="hero-pill hero-pill--solid">
            {t.nav.quote}
            <span className="hero-dot" aria-hidden="true" />
          </Link>

          <button
            type="button"
            className="hero-burger"
            aria-label={t.nav.menuOpen}
            onClick={() => setMenuOpen(true)}
          >
            <span />
            <span />
            <span />
          </button>
        </div>
      </header>

      <div className={`hero-mobile${menuOpen ? " open" : ""}`}>
        <button
          type="button"
          className="hero-mobile-close"
          aria-label={t.nav.menuClose}
          onClick={closeMenu}
        >
          &times;
        </button>
        {navLinks.map((link) => (
          <Link key={link.href} href={link.href} onClick={closeMenu}>
            {link.label}
          </Link>
        ))}
        <Link
          href="#contacto"
          className="hero-pill hero-pill--solid"
          onClick={closeMenu}
        >
          {t.nav.quote}
          <span className="hero-dot" aria-hidden="true" />
        </Link>
      </div>

      <div className="hero-content">
        <h1 className="hero-title">
          <span className="hero-title-lead">{titleLead}</span>
          <span className="hero-title-accent">{titleAccent}</span>
        </h1>

        <div className="hero-lower">
          <div className="hero-logos" aria-label={t.clients.eyebrow}>
            <div className="hero-logos-track">
              {Array.from({ length: 4 }, (_, loop) => (
                <ul
                  className="hero-logos-group"
                  key={loop}
                  aria-hidden={loop > 0}
                >
                  {clientLogos.map((client) => (
                    <li
                      key={`${loop}-${client.id}`}
                      className={`hero-logo-item${
                        client.logo ? " has-logo" : ""
                      }`}
                    >
                      {client.logo ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={client.logo}
                          alt={client.title}
                          className={`hero-logo-img${
                            client.logoTone === "knockout"
                              ? " hero-logo-img--knockout"
                              : ""
                          }`}
                          draggable={false}
                        />
                      ) : (
                        client.title
                      )}
                    </li>
                  ))}
                </ul>
              ))}
            </div>
          </div>

          <div className="hero-aside">
            <p className="hero-tagline">{tagline}</p>
            <div className="hero-actions">
              <Link href="#servicios" className="hero-pill hero-pill--outline">
                {t.hero.ctaSecondary}
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useLanguage } from "@/context/LanguageContext";
import { localeLabels, locales } from "@/lib/i18n/content";
import type { Locale } from "@/lib/i18n/types";
import type { WpProject } from "@/lib/wp";
import Logo from "./Logo";
import ProjectCardMedia from "./ProjectCardMedia";

type ProjectItem = {
  title: string;
  description: string;
  tag: string;
  image: string;
  video?: string;
  accent?: "cyan" | "magenta" | "yellow";
};

export default function ProjectsArchive({
  wpProjects = [],
}: {
  wpProjects?: WpProject[];
}) {
  const { locale, setLocale, t } = useLanguage();
  const listRef = useRef<HTMLDivElement>(null);
  const [menuOpen, setMenuOpen] = useState(false);

  const navLinks = [
    { href: "/#sobre", label: t.nav.about },
    { href: "/#servicios", label: t.nav.services },
    { href: "/#proyectos", label: t.nav.projects },
    { href: "#contacto", label: t.nav.contact },
  ];

  const items: ProjectItem[] =
    wpProjects.length > 0
      ? wpProjects.map((p) => ({
          title: p.title,
          description: p.description,
          tag: p.tag || t.projects.eyebrow,
          image: p.image,
          video: p.video,
          accent: p.accent,
        }))
      : t.projects.items;

  const closeMenu = () => setMenuOpen(false);

  useEffect(() => {
    const root = listRef.current;
    if (!root) return;

    const reduceMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;
    const isNarrow = window.matchMedia("(max-width: 767px)").matches;

    const frames = Array.from(
      root.querySelectorAll<HTMLElement>("[data-proj-frame]")
    );

    if (reduceMotion || isNarrow) {
      frames.forEach((frame) => {
        frame.style.transform = "none";
        frame.style.opacity = "1";
      });
      return;
    }

    let raf = 0;
    let alive = true;

    const update = () => {
      if (!alive) return;
      const vh = window.innerHeight;

      frames.forEach((frame) => {
        const rect = frame.getBoundingClientRect();
        const start = vh * 1.35;
        const end = vh * 0.1;
        const raw = (start - rect.top) / (start - end);
        const p = Math.min(1, Math.max(0, raw));
        const eased = 1 - Math.pow(1 - p, 2);
        const tilt = (1 - eased) * 48;
        const scale = 0.78 + eased * 0.22;
        const y = (1 - eased) * 96;
        const opacity = 0.35 + eased * 0.65;

        frame.style.transform = `perspective(900px) rotateX(${tilt}deg) scale(${scale}) translateY(${y}px)`;
        frame.style.opacity = String(opacity);
      });

      raf = requestAnimationFrame(update);
    };

    raf = requestAnimationFrame(update);
    return () => {
      alive = false;
      cancelAnimationFrame(raf);
    };
  }, [items.length]);

  return (
    <div className="projects-page">
      <header className="projects-page-nav">
        <Logo href="/" className="logo--nav" priority />

        <nav className="hero-nav-pill projects-page-links" aria-label="Primary">
          {navLinks.map((link) => (
            <Link key={link.href} href={link.href}>
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="projects-page-nav-end">
          <div className="lang">
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

      <section className="projects-page-hero" aria-labelledby="projects-page-title">
        <p className="projects-page-brand">Bellux</p>
        <h1 id="projects-page-title" className="projects-headline">
          {t.projects.headlineBefore}{" "}
          <span className="projects-accent projects-accent--yellow">
            {t.projects.accent1}
          </span>{" "}
          {t.projects.mid}{" "}
          <span className="projects-accent projects-accent--cyan">
            {t.projects.accent2}
          </span>
        </h1>
        <p className="projects-sub">{t.projects.sub}</p>
        <Link href="/" className="projects-page-back">
          ← {t.projects.backHome}
        </Link>
      </section>

      <div className="wrap projects-list projects-page-list" ref={listRef}>
        {items.map((item) => (
          <article key={item.title} className="proj-card">
            <div className="proj-card-frame" data-proj-frame>
              <ProjectCardMedia
                title={item.title}
                image={item.image}
                video={item.video}
                playLabel={t.projects.playWithSound}
                muteLabel={t.projects.muteVideo}
              />
              {item.tag ? (
                <span
                  className={`proj-card-tag proj-card-tag--${item.accent ?? "cyan"}`}
                >
                  <i aria-hidden="true" />
                  {item.tag}
                </span>
              ) : null}
            </div>

            <div className="proj-card-meta">
              <h2 className="proj-card-title">{item.title}</h2>
              {item.description ? (
                <p className="proj-card-desc">{item.description}</p>
              ) : null}
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}

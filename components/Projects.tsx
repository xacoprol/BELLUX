"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import { useLanguage } from "@/context/LanguageContext";

export default function Projects() {
  const { t } = useLanguage();
  const listRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const root = listRef.current;
    if (!root) return;

    const reduceMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    const frames = Array.from(
      root.querySelectorAll<HTMLElement>("[data-proj-frame]")
    );

    if (reduceMotion) {
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
        const end = vh * 0.08;
        const raw = (start - rect.top) / (start - end);
        const p = Math.min(1, Math.max(0, raw));
        const eased = 1 - Math.pow(1 - p, 1.35);
        const tilt = (1 - eased) * 58;
        const scale = 0.78 + eased * 0.22;
        const y = (1 - eased) * 110;
        const opacity = 0.2 + eased * 0.8;

        frame.style.transform = `perspective(1400px) rotateX(${tilt}deg) scale(${scale}) translateY(${y}px)`;
        frame.style.opacity = String(opacity);
      });

      raf = requestAnimationFrame(update);
    };

    raf = requestAnimationFrame(update);
    return () => {
      alive = false;
      cancelAnimationFrame(raf);
    };
  }, [t.projects.items.length]);

  return (
    <section className="projects" id="proyectos">
      <div className="wrap projects-head" data-r>
        <div className="projects-copy">
          <h2 className="projects-headline">
            {t.projects.headlineBefore}{" "}
            <span className="projects-accent projects-accent--yellow">
              {t.projects.accent1}
            </span>{" "}
            {t.projects.mid}{" "}
            <span className="projects-accent projects-accent--cyan">
              {t.projects.accent2}
            </span>
          </h2>
          <p className="projects-sub">{t.projects.sub}</p>
        </div>

        <Link href="#proyectos-list" className="projects-cta">
          {t.projects.cta}
        </Link>
      </div>

      <div className="wrap projects-list" id="proyectos-list" ref={listRef}>
        {t.projects.items.map((item) => (
          <article key={item.title} className="proj-card">
            <div className="proj-card-frame" data-proj-frame>
              <div
                className="proj-card-media"
                style={{ backgroundImage: `url(${item.image})` }}
                role="img"
                aria-label={item.title}
              />
              <span
                className={`proj-card-tag proj-card-tag--${item.accent ?? "cyan"}`}
              >
                <i aria-hidden="true" />
                {item.tag}
              </span>
            </div>

            <div className="proj-card-meta">
              <h3 className="proj-card-title">{item.title}</h3>
              <p className="proj-card-desc">{item.description}</p>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}

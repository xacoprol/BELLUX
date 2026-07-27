"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import { useLanguage } from "@/context/LanguageContext";
import type { WpProject } from "@/lib/wp";
import ProjectCardMedia from "./ProjectCardMedia";

type ProjectItem = {
  title: string;
  description: string;
  tag: string;
  image: string;
  video?: string;
  accent?: "cyan" | "magenta" | "yellow";
};

export default function Projects({
  wpProjects = [],
}: {
  wpProjects?: WpProject[];
}) {
  const { t } = useLanguage();
  const listRef = useRef<HTMLDivElement>(null);

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
      : t.projects.items.slice(0, 3);

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
        const start = vh * 1.75;
        const end = vh * -0.05;
        const raw = (start - rect.top) / (start - end);
        const p = Math.min(1, Math.max(0, raw));
        const eased = 1 - Math.pow(1 - p, 2.1);
        const tilt = (1 - eased) * 92;
        const scale = 0.62 + eased * 0.38;
        const y = (1 - eased) * 220;
        const opacity = 0.08 + eased * 0.92;

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

        <Link href="/proyectos" className="projects-cta">
          {t.projects.cta}
        </Link>
      </div>

      <div className="wrap projects-list" id="proyectos-list" ref={listRef}>
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
              <h3 className="proj-card-title">{item.title}</h3>
              {item.description ? (
                <p className="proj-card-desc">{item.description}</p>
              ) : null}
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}

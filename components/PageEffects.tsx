"use client";

import { useEffect } from "react";
import Lenis from "lenis";

export default function PageEffects() {
  useEffect(() => {
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) e.target.classList.add("in");
        });
      },
      { threshold: 0.12 }
    );

    document.querySelectorAll("[data-r]").forEach((el) => io.observe(el));

    const reduceMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    let lenis: Lenis | null = null;
    let rafId = 0;

    if (!reduceMotion) {
      lenis = new Lenis({
        duration: 1.15,
        easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        smoothWheel: true,
        touchMultiplier: 1.1,
      });

      const raf = (time: number) => {
        lenis?.raf(time);
        rafId = requestAnimationFrame(raf);
      };
      rafId = requestAnimationFrame(raf);
    }

    const onClick = (event: MouseEvent) => {
      const target = event.target as HTMLElement | null;
      const link = target?.closest("a[href^='#']") as HTMLAnchorElement | null;
      if (!link) return;

      const hash = link.getAttribute("href");
      if (!hash || hash === "#") return;

      const el = document.querySelector(hash);
      if (!el) return;

      event.preventDefault();

      const offset =
        parseInt(
          getComputedStyle(document.documentElement).scrollPaddingTop || "0",
          10
        ) || 0;

      if (lenis) {
        lenis.scrollTo(el as HTMLElement, {
          offset: -offset,
          duration: 1.25,
        });
      } else {
        const top =
          el.getBoundingClientRect().top + window.scrollY - offset;
        window.scrollTo(0, top);
      }

      history.pushState(null, "", hash);
    };

    document.addEventListener("click", onClick);

    return () => {
      io.disconnect();
      document.removeEventListener("click", onClick);
      cancelAnimationFrame(rafId);
      lenis?.destroy();
    };
  }, []);

  return null;
}

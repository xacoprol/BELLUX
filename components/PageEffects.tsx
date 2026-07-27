"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import Lenis from "lenis";

export default function PageEffects() {
  const pathname = usePathname();
  const lenisRef = useRef<Lenis | null>(null);
  const ioRef = useRef<IntersectionObserver | null>(null);

  useEffect(() => {
    if ("scrollRestoration" in history) {
      history.scrollRestoration = "manual";
    }

    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) e.target.classList.add("in");
        });
      },
      { threshold: 0.12 }
    );
    ioRef.current = io;

    const observeReveal = () => {
      document.querySelectorAll("[data-r]:not(.in)").forEach((el) => {
        io.observe(el);
      });
    };
    observeReveal();

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
      lenisRef.current = lenis;

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
      ioRef.current = null;
      document.removeEventListener("click", onClick);
      cancelAnimationFrame(rafId);
      lenis?.destroy();
      lenisRef.current = null;
    };
  }, []);

  // New route → top of page (keep position only for in-page #hashes)
  useEffect(() => {
    const hash = window.location.hash;
    if (hash && hash.length > 1) {
      const el = document.querySelector(hash);
      if (el) {
        const offset =
          parseInt(
            getComputedStyle(document.documentElement).scrollPaddingTop || "0",
            10
          ) || 0;
        const lenis = lenisRef.current;
        requestAnimationFrame(() => {
          if (lenis) {
            lenis.scrollTo(el as HTMLElement, {
              offset: -offset,
              immediate: true,
            });
          } else {
            const top =
              el.getBoundingClientRect().top + window.scrollY - offset;
            window.scrollTo(0, top);
          }
        });
      }
      return;
    }

    const lenis = lenisRef.current;
    if (lenis) {
      lenis.scrollTo(0, { immediate: true });
    } else {
      window.scrollTo(0, 0);
    }

    // Re-observe reveal elements on the new page
    const io = ioRef.current;
    if (io) {
      document.querySelectorAll("[data-r]:not(.in)").forEach((el) => {
        io.observe(el);
      });
    }
  }, [pathname]);

  return null;
}

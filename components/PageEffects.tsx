"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import Lenis from "lenis";

function revealVisible(el: Element) {
  const rect = el.getBoundingClientRect();
  const vh = window.innerHeight || 0;
  // Already on screen (or nearly) → show without waiting for IO callback
  if (rect.top < vh * 0.92 && rect.bottom > 0) {
    el.classList.add("in");
  }
}

export default function PageEffects() {
  const pathname = usePathname();
  const lenisRef = useRef<Lenis | null>(null);
  const ioRef = useRef<IntersectionObserver | null>(null);

  useEffect(() => {
    if ("scrollRestoration" in history) {
      history.scrollRestoration = "manual";
    }

    const reduceMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) e.target.classList.add("in");
        });
      },
      { threshold: 0.08, rootMargin: "0px 0px -4% 0px" }
    );
    ioRef.current = io;

    const observeReveal = () => {
      document.querySelectorAll("[data-r]").forEach((el) => {
        if (el.classList.contains("in")) return;
        if (reduceMotion) {
          el.classList.add("in");
          return;
        }
        io.observe(el);
        revealVisible(el);
      });
    };

    observeReveal();

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
  // and re-bind reveal observers after App Router remounts content
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
    } else {
      const lenis = lenisRef.current;
      if (lenis) {
        lenis.scrollTo(0, { immediate: true });
      } else {
        window.scrollTo(0, 0);
      }
    }

    const reduceMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    const observeReveal = () => {
      const io = ioRef.current;
      if (!io) return;
      document.querySelectorAll("[data-r]").forEach((el) => {
        if (el.classList.contains("in")) return;
        if (reduceMotion) {
          el.classList.add("in");
          return;
        }
        io.observe(el);
        revealVisible(el);
      });
    };

    observeReveal();

    // Soft navigations mount page content after this effect — retry after paint
    let raf2 = 0;
    const raf1 = requestAnimationFrame(() => {
      observeReveal();
      raf2 = requestAnimationFrame(observeReveal);
    });
    const t1 = window.setTimeout(observeReveal, 80);
    const t2 = window.setTimeout(observeReveal, 320);

    const mo = new MutationObserver(() => observeReveal());
    mo.observe(document.body, { childList: true, subtree: true });
    const stopMo = window.setTimeout(() => mo.disconnect(), 1500);

    return () => {
      cancelAnimationFrame(raf1);
      cancelAnimationFrame(raf2);
      window.clearTimeout(t1);
      window.clearTimeout(t2);
      window.clearTimeout(stopMo);
      mo.disconnect();
    };
  }, [pathname]);

  return null;
}

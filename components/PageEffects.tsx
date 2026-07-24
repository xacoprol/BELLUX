"use client";

import { useEffect } from "react";

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

    return () => io.disconnect();
  }, []);

  return null;
}

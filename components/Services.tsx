"use client";

import { useEffect, useState, type CSSProperties } from "react";
import Link from "next/link";
import { useLanguage } from "@/context/LanguageContext";

export default function Services() {
  const { t } = useLanguage();
  const items = t.services.items;
  const [index, setIndex] = useState(0);
  const [perView, setPerView] = useState(2);
  const [activeTouch, setActiveTouch] = useState<number | null>(null);

  useEffect(() => {
    const sync = () => setPerView(window.innerWidth < 768 ? 1 : 2);
    sync();
    window.addEventListener("resize", sync);
    return () => window.removeEventListener("resize", sync);
  }, []);

  const maxIndex = Math.max(0, items.length - perView);

  useEffect(() => {
    setIndex((i) => Math.min(i, maxIndex));
  }, [maxIndex]);

  const go = (dir: -1 | 1) => {
    setIndex((i) => {
      const next = i + dir;
      if (next < 0) return maxIndex;
      if (next > maxIndex) return 0;
      return next;
    });
    setActiveTouch(null);
  };

  const visible = items.slice(index, index + perView);

  return (
    <section className="services" id="servicios">
      <div className="svc-carousel" data-r>
        <div
          className="svc-track"
          style={{ "--svc-per": perView } as CSSProperties}
        >
          {visible.map((item, i) => {
            const globalIndex = index + i;
            const isTouchActive = activeTouch === globalIndex;
            const tagLoop = Array.from({ length: 8 }, () => item.tag).join(
              " · "
            );

            return (
              <article
                key={`${item.tag}-${globalIndex}`}
                className={`svc-slide${isTouchActive ? " is-active" : ""}`}
                onClick={() =>
                  setActiveTouch((cur) =>
                    cur === globalIndex ? null : globalIndex
                  )
                }
              >
                <div
                  className="svc-slide-media"
                  style={{ backgroundImage: `url(${item.image})` }}
                  aria-hidden="true"
                />

                <div className="svc-slide-content">
                  <p className="svc-slide-tag" aria-hidden="true">
                    <span>{tagLoop}</span>
                  </p>

                  <h3 className="svc-slide-title">
                    {item.lines.map((line, li) => (
                      <span key={li} className="svc-slide-line">
                        {line.map((part, pi) => (
                          <span
                            key={pi}
                            className={
                              part.accent
                                ? `svc-accent svc-accent--${part.accent}`
                                : undefined
                            }
                          >
                            {part.text}
                          </span>
                        ))}
                      </span>
                    ))}
                  </h3>

                  <Link
                    href="#contacto"
                    className={`svc-slide-cta${i % 2 === 1 ? " is-outline" : ""}`}
                    onClick={(e) => e.stopPropagation()}
                  >
                    {t.services.learnMore}
                    <span className="svc-slide-dot" aria-hidden="true" />
                  </Link>
                </div>

                {i === 0 && visible.length > 1 ? (
                  <span className="svc-slash" aria-hidden="true">
                    /
                  </span>
                ) : null}
              </article>
            );
          })}
        </div>

        <div className="svc-nav">
          <button
            type="button"
            className="svc-nav-btn"
            aria-label={t.services.prev}
            onClick={() => go(-1)}
          >
            ←
          </button>
          <div className="svc-dots" role="tablist" aria-label={t.services.eyebrow}>
            {Array.from({ length: maxIndex + 1 }).map((_, i) => (
              <button
                key={i}
                type="button"
                role="tab"
                aria-selected={i === index}
                className={`svc-dot${i === index ? " is-active" : ""}`}
                onClick={() => {
                  setIndex(i);
                  setActiveTouch(null);
                }}
              />
            ))}
          </div>
          <button
            type="button"
            className="svc-nav-btn"
            aria-label={t.services.next}
            onClick={() => go(1)}
          >
            →
          </button>
        </div>
      </div>
    </section>
  );
}

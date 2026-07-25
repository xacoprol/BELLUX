"use client";

import { useEffect, useRef, useState, type CSSProperties } from "react";
import { useLanguage } from "@/context/LanguageContext";
import type { WpService } from "@/lib/wp";

type ServiceItem = {
  tag: string;
  lines: { text: string; accent?: "cyan" | "magenta" | "yellow" }[][];
  image: string;
};

export default function Services({
  wpServices = [],
}: {
  wpServices?: WpService[];
}) {
  const { t } = useLanguage();
  const items: ServiceItem[] =
    wpServices.length > 0 ? wpServices : t.services.items;

  const [index, setIndex] = useState(0);
  const [perView, setPerView] = useState(2);
  const [hoverCol, setHoverCol] = useState<number | null>(null);
  const [focusCol, setFocusCol] = useState(0);
  const [flashing, setFlashing] = useState(false);
  const [paused, setPaused] = useState(false);
  const flashTimer = useRef<number | null>(null);
  const indexRef = useRef(index);
  const flashingRef = useRef(flashing);
  const maxIndexRef = useRef(0);
  const focusColRef = useRef(0);

  useEffect(() => {
    const sync = () => setPerView(window.innerWidth < 768 ? 1 : 2);
    sync();
    window.addEventListener("resize", sync);
    return () => window.removeEventListener("resize", sync);
  }, []);

  useEffect(() => {
    return () => {
      if (flashTimer.current) window.clearTimeout(flashTimer.current);
    };
  }, []);

  const pageCount = Math.max(1, Math.ceil(items.length / perView));
  const maxIndex = (pageCount - 1) * perView;
  const page = Math.floor(index / perView);
  indexRef.current = index;
  flashingRef.current = flashing;
  maxIndexRef.current = maxIndex;
  focusColRef.current = focusCol;

  useEffect(() => {
    setIndex((i) => {
      const snapped = Math.floor(i / perView) * perView;
      return Math.min(snapped, maxIndex);
    });
  }, [maxIndex, perView]);

  const flashTo = (next: number) => {
    const snapped = Math.floor(next / perView) * perView;
    const clamped = Math.min(Math.max(0, snapped), maxIndexRef.current);
    if (flashingRef.current || clamped === indexRef.current) return;
    setHoverCol(null);
    setFocusCol(0);
    setFlashing(true);

    if (flashTimer.current) window.clearTimeout(flashTimer.current);
    flashTimer.current = window.setTimeout(() => {
      setIndex(clamped);
      flashTimer.current = window.setTimeout(() => {
        setFlashing(false);
      }, 280);
    }, 160);
  };

  const go = (dir: -1 | 1) => {
    let next = indexRef.current + dir * perView;
    if (next < 0) next = maxIndexRef.current;
    if (next > maxIndexRef.current) next = 0;
    flashTo(next);
  };

  const visible = items.slice(index, index + perView);

  // Autoplay: left photo → right photo → next page (nunca vuelve a la izquierda)
  useEffect(() => {
    if (paused || hoverCol !== null) {
      if (visible.length === 1) setFocusCol(0);
      return;
    }

    const id = window.setInterval(() => {
      if (flashingRef.current) return;

      const last = Math.max(0, visible.length - 1);
      const c = focusColRef.current;

      if (c < last) {
        setFocusCol(c + 1);
        return;
      }

      // Ya pasó una vez por cada diapo visible → siguiente página
      if (pageCount > 1) {
        let next = indexRef.current + perView;
        if (next > maxIndexRef.current) next = 0;
        flashTo(next);
      }
    }, 3000);

    return () => window.clearInterval(id);
  }, [paused, hoverCol, visible.length, pageCount, perView]);

  const activeCol = hoverCol ?? Math.min(focusCol, Math.max(0, visible.length - 1));
  const stageImage = visible[activeCol]?.image || visible[0]?.image || "";
  const stageOn = Boolean(stageImage);
  const stageBias =
    !stageOn || perView < 2 ? 0 : activeCol === 0 ? -1 : 1;

  return (
    <section className="services" id="servicios">
      <div
        className={`svc-carousel${flashing ? " is-flashing" : ""}${stageOn ? " is-stage-on" : ""}`}
        onMouseEnter={() => setPaused(true)}
        onMouseLeave={() => {
          setPaused(false);
          setHoverCol(null);
        }}
      >
        <div className="svc-flash" aria-hidden="true" />

        <div
          className="svc-track"
          style={
            {
              "--svc-per": perView,
              "--svc-stage-bias": stageBias,
            } as CSSProperties
          }
        >
          <div className="svc-stage" aria-hidden="true">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              className={`svc-stage-img${stageOn ? " is-on" : ""}`}
              src={stageImage}
              alt=""
              draggable={false}
            />
          </div>

          {visible.length > 1 ? (
            <span className="svc-slash" aria-hidden="true">
              /
            </span>
          ) : null}

          {visible.map((item, i) => {
            const globalIndex = index + i;
            const isActive = activeCol === i;

            return (
              <article
                key={`${item.tag}-${globalIndex}-${index}`}
                className={`svc-slide${isActive ? " is-active" : ""}${
                  visible.length > 1
                    ? i === 0
                      ? " svc-slide--left"
                      : " svc-slide--right"
                    : ""
                }`}
                onMouseEnter={() => setHoverCol(i)}
                onFocus={() => setHoverCol(i)}
                onClick={() => {
                  if (
                    window.matchMedia("(hover: hover) and (pointer: fine)")
                      .matches
                  ) {
                    return;
                  }
                  setHoverCol((cur) => (cur === i ? null : i));
                }}
              >
                <div className="svc-slide-content">
                  <p className="svc-slide-tag" aria-hidden="true">
                    <span className="svc-slide-tag-track">
                      {Array.from({ length: 2 }, (_, loop) => (
                        <span className="svc-slide-tag-group" key={loop}>
                          {Array.from({ length: 6 }, (_, n) => (
                            <span className="svc-slide-tag-item" key={n}>
                              {item.tag}
                              <span
                                className={`svc-slide-tag-dot svc-slide-tag-dot--${n % 3}`}
                              />
                            </span>
                          ))}
                        </span>
                      ))}
                    </span>
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
                </div>
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
            {Array.from({ length: pageCount }).map((_, i) => (
              <button
                key={i}
                type="button"
                role="tab"
                aria-selected={i === page}
                className={`svc-dot${i === page ? " is-active" : ""}`}
                onClick={() => flashTo(i * perView)}
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

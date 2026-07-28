"use client";

import { useLanguage } from "@/context/LanguageContext";

export default function Testimonials() {
  const { t } = useLanguage();

  return (
    <section className="testimonials" id="valoraciones">
      <div className="testimonials-head">
        <p className="testimonials-eyebrow">{t.testimonials.eyebrow}</p>
        <h2 className="testimonials-title">
          {t.testimonials.titleLine1}{" "}
          <span>{t.testimonials.titleEm}</span>
        </h2>
      </div>

      <div className="testimonials-grid">
        {t.testimonials.items.map((item) => (
          <article key={item.quote} className="tcard">
            <div className="tcard-stars" aria-hidden="true">
              ★★★★★
            </div>
            <p className="tcard-quote">&ldquo;{item.quote}&rdquo;</p>
            <p className="tcard-who">{item.who}</p>
          </article>
        ))}
      </div>
    </section>
  );
}

"use client";

import { useLanguage } from "@/context/LanguageContext";

export default function Testimonials() {
  const { t } = useLanguage();

  return (
    <section className="testimonials">
      <div className="wrap">
        <p className="eyebrow center" data-r>
          {t.testimonials.eyebrow}
        </p>
        <div className="rule" />
        <h2 className="title center" data-r>
          {t.testimonials.titleLine1}
          <br />
          <em>{t.testimonials.titleEm}</em>
        </h2>
        <div className="test-grid">
          {t.testimonials.items.map((item) => (
            <div key={item.quote} className="tcard" data-r>
              <p>&ldquo;{item.quote}&rdquo;</p>
              <div className="tcard-who">— {item.who}</div>
              <div className="tcard-stars">★★★★★</div>
            </div>
          ))}
        </div>
        <p className="ta-note">{t.testimonials.note}</p>
      </div>
    </section>
  );
}

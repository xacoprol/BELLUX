"use client";

import { useLanguage } from "@/context/LanguageContext";

export default function Services() {
  const { t } = useLanguage();

  return (
    <section className="services" id="servicios">
      <div className="wrap">
        <p className="eyebrow center" data-r>
          {t.services.eyebrow}
        </p>
        <div className="rule" />
        <h2 className="title center" data-r>
          {t.services.titleLine1}
          <br />
          <em>{t.services.titleEm}</em>
        </h2>
        <p className="section-desc center" data-r>
          {t.services.intro}
        </p>
        <div className="services-grid">
          {t.services.items.map((svc) => (
            <div
              key={svc.title}
              className={`svc${svc.featured ? " featured" : ""}`}
              data-r
            >
              <div className="svc-icon">{svc.icon}</div>
              <div className="svc-line" />
              <h3>{svc.title}</h3>
              <p>{svc.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

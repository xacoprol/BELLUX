"use client";

import { useLanguage } from "@/context/LanguageContext";

export default function Projects() {
  const { t } = useLanguage();

  return (
    <section className="projects" id="proyectos">
      <div className="wrap">
        <p className="eyebrow" data-r>
          {t.projects.eyebrow}
        </p>
        <div className="rule left" />
        <h2 className="title" data-r>
          {t.projects.titleLine1}
          <br />
          <em>{t.projects.titleEm}</em>
        </h2>
      </div>
      <div className="proj-grid">
        {t.projects.items.map((proj) => (
          <div
            key={proj.label}
            className={`ptile ${proj.cls}${proj.tall ? " tall" : ""}`}
            data-r
          >
            <div className="ptile-bg" />
            <div>
              <div className="ptile-cat">{proj.cat}</div>
              <div className="ptile-label">{proj.label}</div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

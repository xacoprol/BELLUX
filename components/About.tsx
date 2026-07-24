"use client";

import { useLanguage } from "@/context/LanguageContext";

export default function About() {
  const { t } = useLanguage();
  const { about } = t;

  return (
    <section className="about" id="sobre">
      <div className="wrap about-grid">
        <div className="about-text" data-r>
          <p className="eyebrow">{about.eyebrow}</p>
          <div className="rule left" />
          <h2 className="title">
            {about.titleLine1}
            <br />
            <em>{about.titleEm}</em>
          </h2>
          <p>{about.intro[0]}</p>
          <p>{about.intro[1]}</p>
          <div className="flags">
            {about.highlights.map((h) => (
              <span key={h} className="flag">
                {h}
              </span>
            ))}
          </div>
        </div>

        <div className="about-visual" data-r>
          <div className="frame-stack">
            <div className="fcard fc1">
              <div className="fcard-glow" />
              <div className="fcard-inner">15+ {about.years}</div>
            </div>
            <div className="fcard fc2">
              <div className="fcard-inner">{about.hotels.title}</div>
            </div>
            <div className="since-badge">
              <span>{about.timelineLabel}</span>
              <strong>2014</strong>
            </div>
          </div>
        </div>
      </div>

      <div className="wrap">
        <div className="about-band" data-r>
          <p className="about-band-label">{about.hotels.partnersLabel}</p>
          <p className="about-band-names">
            {about.hotels.partners.join(" · ")}
          </p>
        </div>

        <div className="milestones" data-r>
          {about.milestones.map((m) => (
            <div key={m.year + m.title} className="milestone">
              <span className="milestone-year">{m.year}</span>
              <h3>{m.title}</h3>
              <p>{m.lines[0]}</p>
            </div>
          ))}
        </div>

        <div className="shows-band" data-r>
          <div className="shows-band-head">
            <p className="eyebrow">{about.showsLabel}</p>
            <h3 className="title-sm">
              {about.showsSubtitle}
            </h3>
          </div>
          <ul className="shows-list">
            {about.shows.map((s) => (
              <li key={s.title}>
                <span>{s.year}</span>
                {s.title}
              </li>
            ))}
          </ul>
        </div>

        <blockquote className="about-quote" data-r>
          <p>{about.closingQuote}</p>
        </blockquote>
      </div>
    </section>
  );
}

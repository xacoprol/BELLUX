"use client";

import { useLanguage } from "@/context/LanguageContext";

export default function Manifesto() {
  const { t } = useLanguage();
  const m = t.manifesto;

  return (
    <section className="manifesto" id="sobre" aria-labelledby="manifesto-title">
      <div className="wrap manifesto-inner" data-r>
        <div className="manifesto-mark" aria-hidden="true">
          <span />
        </div>

        <h2 id="manifesto-title" className="manifesto-title">
          {m.before}{" "}
          <span className="manifesto-accent manifesto-accent--cyan">
            {m.accent1}
          </span>
          <br className="manifesto-break" />
          <span className="manifesto-accent manifesto-accent--magenta">
            {m.accent2}
          </span>{" "}
          {m.mid}{" "}
          <span className="manifesto-accent manifesto-accent--yellow">
            {m.accent3}
          </span>
        </h2>

        <p className="manifesto-sub">{m.sub}</p>
      </div>
    </section>
  );
}

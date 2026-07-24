"use client";

import { useLanguage } from "@/context/LanguageContext";

export default function Clients() {
  const { t } = useLanguage();

  return (
    <section className="clients">
      <div className="wrap">
        <p className="eyebrow center" data-r>
          {t.clients.eyebrow}
        </p>
        <div className="rule" />
        <h2 className="title center" data-r>
          {t.clients.title} <em>{t.clients.titleEm}</em>
        </h2>
        <div className="clients-grid">
          {t.clients.items.map((client) => (
            <div key={client} className="client-cell" data-r>
              {client}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

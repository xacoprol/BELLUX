"use client";

import { useLanguage } from "@/context/LanguageContext";

export default function Stats() {
  const { t } = useLanguage();

  return (
    <section className="stats">
      <div className="wrap stats-grid">
        {t.stats.map((stat) => (
          <div key={stat.lbl} className="stat" data-r>
            <div className="stat-num">{stat.num}</div>
            <div className="stat-lbl">{stat.lbl}</div>
          </div>
        ))}
      </div>
    </section>
  );
}

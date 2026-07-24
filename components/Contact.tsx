"use client";

import { useLanguage } from "@/context/LanguageContext";

const whatsappContacts = [
  {
    href: "https://wa.me/351919015781",
    region: "Portugal & International",
    phone: "+351 919 015 781",
  },
  {
    href: "https://wa.me/34608254139",
    region: "España",
    phone: "+34 608 25 41 39",
  },
];

export default function Contact() {
  const { t } = useLanguage();

  return (
    <section className="contact" id="contacto">
      <div className="wrap contact-grid">
        <div data-r>
          <p className="eyebrow">{t.contact.eyebrow}</p>
          <div className="rule left" />
          <h2 className="title">
            {t.contact.titleLine1}
            <br />
            <em>{t.contact.titleEm}</em>
          </h2>
          <p className="contact-intro">{t.contact.intro}</p>
          <form className="contact-form" onSubmit={(e) => e.preventDefault()}>
            <div className="field">
              <input type="text" placeholder=" " id="name" name="name" />
              <span className="field-label">{t.contact.name}</span>
            </div>
            <div className="field">
              <input type="email" placeholder=" " id="email" name="email" />
              <span className="field-label">{t.contact.email}</span>
            </div>
            <div className="field">
              <input type="tel" placeholder=" " id="phone" name="phone" />
              <span className="field-label">{t.contact.phone}</span>
            </div>
            <div className="field">
              <select id="event-type" name="event-type" defaultValue="">
                <option value="" disabled />
                {t.contact.eventTypes.map((type) => (
                  <option key={type} value={type}>
                    {type}
                  </option>
                ))}
              </select>
              <span className="field-label">{t.contact.eventType}</span>
            </div>
            <div className="field">
              <textarea rows={3} placeholder=" " id="details" name="details" />
              <span className="field-label">{t.contact.details}</span>
            </div>
            <button type="submit" className="btn btn-gold btn-arrow">
              {t.contact.submit}
            </button>
          </form>
        </div>

        <div data-r>
          <p className="eyebrow">{t.contact.whatsappEyebrow}</p>
          <div className="rule left" />
          <p className="contact-wa-intro">{t.contact.whatsappIntro}</p>
          <div className="wa-list">
            {whatsappContacts.map((wa) => (
              <a
                key={wa.href}
                className="wa-item"
                href={wa.href}
                target="_blank"
                rel="noopener noreferrer"
              >
                <div className="wa-item-left">
                  <strong>{wa.region}</strong>
                  <span>{wa.phone}</span>
                </div>
                <span className="wa-arrow">→</span>
              </a>
            ))}
          </div>
          <div className="social-row">
            <a
              href="https://www.facebook.com/belluxentertainment"
              target="_blank"
              rel="noopener noreferrer"
            >
              Facebook
            </a>
            <a
              href="https://www.instagram.com/belluxentertainment"
              target="_blank"
              rel="noopener noreferrer"
            >
              Instagram
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}

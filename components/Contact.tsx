"use client";

import { useEffect, useId, useRef, useState } from "react";
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
  const [open, setOpen] = useState(false);
  const closeRef = useRef<HTMLButtonElement>(null);
  const pathId = useId().replace(/:/g, "");

  const openModal = () => setOpen(true);
  const closeModal = () => setOpen(false);

  useEffect(() => {
    const maybeOpen = () => {
      if (window.location.hash === "#contacto") openModal();
    };

    maybeOpen();
    window.addEventListener("hashchange", maybeOpen);

    const onClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement | null;
      const link = target?.closest('a[href="#contacto"]');
      if (!link) return;
      e.preventDefault();
      history.replaceState(null, "", "#contacto");
      openModal();
    };

    document.addEventListener("click", onClick);
    return () => {
      window.removeEventListener("hashchange", maybeOpen);
      document.removeEventListener("click", onClick);
    };
  }, []);

  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    closeRef.current?.focus();

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeModal();
    };
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener("keydown", onKey);
    };
  }, [open]);

  return (
    <>
      <section className="contact-cta" id="contacto" aria-labelledby="contact-cta-pitch">
        <div className="contact-cta-frame">
          <div className="contact-cta-orbit" aria-hidden="true">
            <svg
              className="contact-cta-ring"
              viewBox="0 0 600 600"
              role="presentation"
            >
              <defs>
                <path
                  id={`contact-ring-${pathId}`}
                  d="M 300,300 m -248,0 a 248,248 0 1,1 496,0 a 248,248 0 1,1 -496,0"
                />
              </defs>
              <text className="contact-cta-ring-text">
                <textPath
                  href={`#contact-ring-${pathId}`}
                  startOffset="0%"
                  textLength="1558"
                  lengthAdjust="spacing"
                >
                  {Array.from({ length: 2 }, (_, i) => (
                    <tspan key={i}>
                      <tspan fill="#ffffff">{t.contact.ringBefore} </tspan>
                      <tspan fill="#FEE30A">{t.contact.ringAccent}</tspan>
                      <tspan fill="#ffffff"> {t.contact.ringAfter} · </tspan>
                    </tspan>
                  ))}
                </textPath>
              </text>
            </svg>
          </div>

          <div className="contact-cta-core">
            <p id="contact-cta-pitch" className="contact-cta-pitch">
              {t.contact.pitch}
            </p>
            <button
              type="button"
              className="contact-cta-btn"
              onClick={openModal}
            >
              {t.contact.cta}
              <span className="contact-cta-dot" aria-hidden="true" />
            </button>
          </div>
        </div>
      </section>

      {open ? (
        <div
          className="contact-modal"
          role="dialog"
          aria-modal="true"
          aria-labelledby="contact-modal-title"
        >
          <button
            type="button"
            className="contact-modal-backdrop"
            aria-label={t.contact.close}
            onClick={closeModal}
          />
          <div className="contact-modal-panel">
            <button
              ref={closeRef}
              type="button"
              className="contact-modal-close"
              onClick={closeModal}
            >
              {t.contact.close}
            </button>

            <div className="contact-grid">
              <div>
                <p className="eyebrow">{t.contact.eyebrow}</p>
                <div className="rule left" />
                <h2 id="contact-modal-title" className="title">
                  {t.contact.titleLine1}
                  <br />
                  <em>{t.contact.titleEm}</em>
                </h2>
                <p className="contact-intro">{t.contact.intro}</p>
                <form
                  className="contact-form"
                  onSubmit={(e) => e.preventDefault()}
                >
                  <div className="field">
                    <input type="text" placeholder=" " id="name" name="name" />
                    <span className="field-label">{t.contact.name}</span>
                  </div>
                  <div className="field">
                    <input
                      type="email"
                      placeholder=" "
                      id="email"
                      name="email"
                    />
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
                    <textarea
                      rows={3}
                      placeholder=" "
                      id="details"
                      name="details"
                    />
                    <span className="field-label">{t.contact.details}</span>
                  </div>
                  <button type="submit" className="btn btn-gold btn-arrow">
                    {t.contact.submit}
                  </button>
                </form>
              </div>

              <div>
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
          </div>
        </div>
      ) : null}
    </>
  );
}

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
  const [eventType, setEventType] = useState("");
  const [sent, setSent] = useState(false);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState(false);
  const panelRef = useRef<HTMLDivElement>(null);
  const firstFieldRef = useRef<HTMLInputElement>(null);
  const pathId = useId().replace(/:/g, "");

  const openModal = () => {
    setSent(false);
    setSending(false);
    setError(false);
    setOpen(true);
  };
  const closeModal = () => {
    setOpen(false);
    if (window.location.hash === "#contacto") {
      history.replaceState(null, "", window.location.pathname + window.location.search);
    }
  };

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
    const tId = window.setTimeout(() => firstFieldRef.current?.focus(), 80);

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeModal();
    };
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prev;
      window.clearTimeout(tId);
      window.removeEventListener("keydown", onKey);
    };
  }, [open]);

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (sending) return;

    const form = e.currentTarget;
    const data = new FormData(form);

    setSending(true);
    setError(false);

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: String(data.get("name") ?? ""),
          email: String(data.get("email") ?? ""),
          phone: String(data.get("phone") ?? ""),
          eventType: String(data.get("event-type") ?? eventType),
          details: String(data.get("details") ?? ""),
        }),
      });

      if (!res.ok) throw new Error("send-failed");

      setSent(true);
      panelRef.current?.scrollTo({ top: 0, behavior: "smooth" });
    } catch {
      setError(true);
    } finally {
      setSending(false);
    }
  };

  return (
    <>
      <section
        className="contact-cta"
        id="contacto"
        aria-labelledby="contact-cta-pitch"
      >
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

          <div className="contact-modal-panel" ref={panelRef}>
            <header className="contact-modal-top">
              <div>
                <p className="contact-modal-eyebrow">{t.contact.eyebrow}</p>
                <h2 id="contact-modal-title" className="contact-modal-title">
                  {t.contact.titleLine1}{" "}
                  <span>{t.contact.titleEm}</span>
                </h2>
              </div>
              <button
                type="button"
                className="contact-modal-close"
                onClick={closeModal}
                aria-label={t.contact.close}
              >
                <span aria-hidden="true">×</span>
              </button>
            </header>

            {sent ? (
              <div className="contact-modal-success" role="status">
                <p className="contact-modal-success-title">
                  {t.contact.successTitle}
                </p>
                <p className="contact-modal-success-text">
                  {t.contact.successText}
                </p>
                <button
                  type="button"
                  className="contact-modal-submit"
                  onClick={closeModal}
                >
                  {t.contact.close}
                  <span className="contact-cta-dot" aria-hidden="true" />
                </button>
              </div>
            ) : (
              <div className="contact-modal-body">
                <form className="contact-modal-form" onSubmit={onSubmit}>
                  <p className="contact-modal-intro">{t.contact.intro}</p>

                  <div className="contact-modal-row">
                    <label className="contact-field">
                      <span>{t.contact.name}</span>
                      <input
                        ref={firstFieldRef}
                        type="text"
                        name="name"
                        required
                        autoComplete="name"
                      />
                    </label>
                    <label className="contact-field">
                      <span>{t.contact.email}</span>
                      <input
                        type="email"
                        name="email"
                        required
                        autoComplete="email"
                      />
                    </label>
                  </div>

                  <label className="contact-field">
                    <span>{t.contact.phone}</span>
                    <input
                      type="tel"
                      name="phone"
                      autoComplete="tel"
                    />
                  </label>

                  <fieldset className="contact-chips">
                    <legend>{t.contact.eventType}</legend>
                    <div className="contact-chips-list">
                      {t.contact.eventTypes.map((type) => (
                        <button
                          key={type}
                          type="button"
                          className={`contact-chip${eventType === type ? " is-on" : ""}`}
                          onClick={() => setEventType(type)}
                          aria-pressed={eventType === type}
                        >
                          {type}
                        </button>
                      ))}
                    </div>
                    <input type="hidden" name="event-type" value={eventType} />
                  </fieldset>

                  <label className="contact-field">
                    <span>{t.contact.details}</span>
                    <textarea name="details" rows={3} required />
                  </label>

                  {error ? (
                    <p className="contact-modal-error" role="alert">
                      {t.contact.errorText}
                    </p>
                  ) : null}

                  <button
                    type="submit"
                    className="contact-modal-submit"
                    disabled={sending}
                  >
                    {sending ? t.contact.submitting : t.contact.submit}
                    <span className="contact-cta-dot" aria-hidden="true" />
                  </button>
                </form>

                <aside className="contact-modal-aside">
                  <p className="contact-modal-aside-label">
                    {t.contact.whatsappEyebrow}
                  </p>
                  <p className="contact-modal-aside-intro">
                    {t.contact.whatsappIntro}
                  </p>

                  <div className="contact-wa">
                    {whatsappContacts.map((wa) => (
                      <a
                        key={wa.href}
                        className="contact-wa-card"
                        href={wa.href}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <div>
                          <strong>{wa.region}</strong>
                          <span>{wa.phone}</span>
                        </div>
                        <span aria-hidden="true">→</span>
                      </a>
                    ))}
                  </div>

                  <div className="contact-social">
                    <a
                      href="https://www.instagram.com/belluxentertainment"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      Instagram
                    </a>
                    <a
                      href="https://www.facebook.com/belluxentertainment"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      Facebook
                    </a>
                  </div>
                </aside>
              </div>
            )}
          </div>
        </div>
      ) : null}
    </>
  );
}

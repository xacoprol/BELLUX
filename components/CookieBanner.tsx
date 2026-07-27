"use client";

import { useEffect, useId, useState, type TransitionEvent } from "react";
import Link from "next/link";
import { useLanguage } from "@/context/LanguageContext";
import { localePath } from "@/lib/i18n/routing";
import {
  buildConsent,
  defaultAcceptedConsent,
  defaultRejectedConsent,
  readConsent,
  writeConsent,
  type CookieConsentChoices,
  type CookieConsentState,
} from "@/lib/cookies-consent";

type Phase = "hidden" | "enter" | "shown" | "exit";

export default function CookieBanner() {
  const { locale, t } = useLanguage();
  const c = t.cookiesBanner;
  const titleId = useId();
  const modalTitleId = useId();

  const [phase, setPhase] = useState<Phase>("hidden");
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [choices, setChoices] = useState<CookieConsentChoices>({
    preferences: false,
    analytics: false,
    marketing: false,
  });

  useEffect(() => {
    const existing = readConsent();
    if (existing) {
      setChoices({
        preferences: existing.preferences,
        analytics: existing.analytics,
        marketing: existing.marketing,
      });
      return;
    }
    const enter = window.setTimeout(() => setPhase("enter"), 40);
    const shown = window.setTimeout(() => setPhase("shown"), 90);
    return () => {
      window.clearTimeout(enter);
      window.clearTimeout(shown);
    };
  }, []);

  useEffect(() => {
    const openSettings = () => {
      const existing = readConsent();
      if (existing) {
        setChoices({
          preferences: existing.preferences,
          analytics: existing.analytics,
          marketing: existing.marketing,
        });
      }
      setSettingsOpen(true);
    };
    window.addEventListener("bellux:open-cookie-settings", openSettings);
    return () => {
      window.removeEventListener("bellux:open-cookie-settings", openSettings);
    };
  }, []);

  const dismissWith = (consent: CookieConsentState) => {
    writeConsent(consent);
    setSettingsOpen(false);
    if (phase === "hidden") return;
    setPhase("exit");
  };

  const onExitEnd = (event: TransitionEvent<HTMLDivElement>) => {
    if (event.propertyName !== "transform" && event.propertyName !== "opacity") {
      return;
    }
    if (phase === "exit") setPhase("hidden");
  };

  const acceptAll = () => dismissWith(defaultAcceptedConsent());
  const rejectAll = () => dismissWith(defaultRejectedConsent());
  const saveChoices = () => dismissWith(buildConsent(choices));

  const showBanner = phase !== "hidden";
  const bannerClass =
    phase === "exit"
      ? "cookie-banner cookie-banner--exit"
      : phase === "shown"
        ? "cookie-banner cookie-banner--in"
        : "cookie-banner";

  return (
    <>
      {showBanner ? (
        <div
          className={bannerClass}
          role="dialog"
          aria-modal="false"
          aria-labelledby={titleId}
          onTransitionEnd={onExitEnd}
        >
          <div className="cookie-banner-inner">
            <p id={titleId} className="cookie-banner-title">
              {c.title}
            </p>
            <p className="cookie-banner-text">
              {c.text}{" "}
              <Link href={localePath(locale, "/cookies")}>{c.policy}</Link>
            </p>
            <div className="cookie-banner-actions">
              <button
                type="button"
                className="cookie-btn cookie-btn--ghost"
                onClick={rejectAll}
              >
                {c.reject}
              </button>
              <button
                type="button"
                className="cookie-btn cookie-btn--outline"
                onClick={() => setSettingsOpen(true)}
              >
                {c.settings}
              </button>
              <button
                type="button"
                className="cookie-btn cookie-btn--solid"
                onClick={acceptAll}
              >
                {c.accept}
              </button>
            </div>
          </div>
        </div>
      ) : null}

      {settingsOpen ? (
        <div
          className="cookie-modal-root"
          role="presentation"
          onClick={(e) => {
            if (e.target === e.currentTarget) setSettingsOpen(false);
          }}
        >
          <div
            className="cookie-modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby={modalTitleId}
          >
            <div className="cookie-modal-head">
              <h2 id={modalTitleId}>{c.settingsTitle}</h2>
              <button
                type="button"
                className="cookie-modal-close"
                aria-label={c.close}
                onClick={() => setSettingsOpen(false)}
              >
                &times;
              </button>
            </div>
            <p className="cookie-modal-intro">{c.settingsIntro}</p>

            <ul className="cookie-cats">
              <li>
                <label className="cookie-cat">
                  <input type="checkbox" checked disabled readOnly />
                  <span>
                    <strong>{c.necessaryTitle}</strong>
                    <em>{c.alwaysOn}</em>
                    <span>{c.necessaryText}</span>
                  </span>
                </label>
              </li>
              <li>
                <label className="cookie-cat">
                  <input
                    type="checkbox"
                    checked={choices.preferences}
                    onChange={(e) =>
                      setChoices((prev) => ({
                        ...prev,
                        preferences: e.target.checked,
                      }))
                    }
                  />
                  <span>
                    <strong>{c.preferencesTitle}</strong>
                    <span>{c.preferencesText}</span>
                  </span>
                </label>
              </li>
              <li>
                <label className="cookie-cat">
                  <input
                    type="checkbox"
                    checked={choices.analytics}
                    onChange={(e) =>
                      setChoices((prev) => ({
                        ...prev,
                        analytics: e.target.checked,
                      }))
                    }
                  />
                  <span>
                    <strong>{c.analyticsTitle}</strong>
                    <span>{c.analyticsText}</span>
                  </span>
                </label>
              </li>
              <li>
                <label className="cookie-cat">
                  <input
                    type="checkbox"
                    checked={choices.marketing}
                    onChange={(e) =>
                      setChoices((prev) => ({
                        ...prev,
                        marketing: e.target.checked,
                      }))
                    }
                  />
                  <span>
                    <strong>{c.marketingTitle}</strong>
                    <span>{c.marketingText}</span>
                  </span>
                </label>
              </li>
            </ul>

            <div className="cookie-modal-actions">
              <button
                type="button"
                className="cookie-btn cookie-btn--ghost"
                onClick={rejectAll}
              >
                {c.reject}
              </button>
              <button
                type="button"
                className="cookie-btn cookie-btn--outline"
                onClick={saveChoices}
              >
                {c.save}
              </button>
              <button
                type="button"
                className="cookie-btn cookie-btn--solid"
                onClick={acceptAll}
              >
                {c.accept}
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}

export function openCookieSettings() {
  if (typeof window === "undefined") return;
  window.dispatchEvent(new Event("bellux:open-cookie-settings"));
}

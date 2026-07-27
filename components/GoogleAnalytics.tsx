"use client";

import Script from "next/script";
import { useEffect, useState } from "react";
import { GA_MEASUREMENT_ID } from "@/lib/analytics";
import {
  hasConsent,
  type CookieConsentState,
} from "@/lib/cookies-consent";

declare global {
  interface Window {
    dataLayer?: unknown[];
    gtag?: (...args: unknown[]) => void;
  }
}

function setGaDisabled(disabled: boolean) {
  if (typeof window === "undefined") return;
  (window as unknown as Record<string, boolean>)[
    `ga-disable-${GA_MEASUREMENT_ID}`
  ] = disabled;
}

function disableGa() {
  setGaDisabled(true);
  window.gtag?.("consent", "update", {
    analytics_storage: "denied",
    ad_storage: "denied",
    ad_user_data: "denied",
    ad_personalization: "denied",
  });
}

function enableGa() {
  setGaDisabled(false);
  window.gtag?.("consent", "update", {
    analytics_storage: "granted",
  });
  window.gtag?.("config", GA_MEASUREMENT_ID, {
    anonymize_ip: true,
  });
}

export default function GoogleAnalytics() {
  const [enabled, setEnabled] = useState(false);

  useEffect(() => {
    const sync = (analytics?: boolean) => {
      const on = analytics ?? hasConsent("analytics");
      setEnabled(on);
      if (on) enableGa();
      else disableGa();
    };

    sync();

    const onConsent = (event: Event) => {
      const detail = (event as CustomEvent<CookieConsentState>).detail;
      sync(Boolean(detail?.analytics));
    };

    window.addEventListener("bellux:cookie-consent", onConsent);
    return () => {
      window.removeEventListener("bellux:cookie-consent", onConsent);
    };
  }, []);

  if (!enabled) return null;

  return (
    <>
      <Script
        src={`https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`}
        strategy="afterInteractive"
      />
      <Script id="google-analytics" strategy="afterInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('consent', 'default', {
            analytics_storage: 'granted',
            ad_storage: 'denied',
            ad_user_data: 'denied',
            ad_personalization: 'denied'
          });
          gtag('config', '${GA_MEASUREMENT_ID}', { anonymize_ip: true });
        `}
      </Script>
    </>
  );
}

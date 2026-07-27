export const CONSENT_STORAGE_KEY = "bellux-cookie-consent";
export const CONSENT_VERSION = 1;

export type CookieCategory = "necessary" | "preferences" | "analytics" | "marketing";

export type CookieConsentState = {
  version: number;
  necessary: true;
  preferences: boolean;
  analytics: boolean;
  marketing: boolean;
  updatedAt: string;
};

export type CookieConsentChoices = {
  preferences: boolean;
  analytics: boolean;
  marketing: boolean;
};

export const defaultRejectedConsent = (): CookieConsentState => ({
  version: CONSENT_VERSION,
  necessary: true,
  preferences: false,
  analytics: false,
  marketing: false,
  updatedAt: new Date().toISOString(),
});

export const defaultAcceptedConsent = (): CookieConsentState => ({
  version: CONSENT_VERSION,
  necessary: true,
  preferences: true,
  analytics: true,
  marketing: true,
  updatedAt: new Date().toISOString(),
});

export function buildConsent(choices: CookieConsentChoices): CookieConsentState {
  return {
    version: CONSENT_VERSION,
    necessary: true,
    preferences: choices.preferences,
    analytics: choices.analytics,
    marketing: choices.marketing,
    updatedAt: new Date().toISOString(),
  };
}

export function readConsent(): CookieConsentState | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(CONSENT_STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as Partial<CookieConsentState>;
    if (parsed.version !== CONSENT_VERSION) return null;
    return {
      version: CONSENT_VERSION,
      necessary: true,
      preferences: Boolean(parsed.preferences),
      analytics: Boolean(parsed.analytics),
      marketing: Boolean(parsed.marketing),
      updatedAt:
        typeof parsed.updatedAt === "string"
          ? parsed.updatedAt
          : new Date().toISOString(),
    };
  } catch {
    return null;
  }
}

export function writeConsent(consent: CookieConsentState): void {
  localStorage.setItem(CONSENT_STORAGE_KEY, JSON.stringify(consent));
  window.dispatchEvent(
    new CustomEvent("bellux:cookie-consent", { detail: consent })
  );
}

export function hasConsent(category: CookieCategory): boolean {
  if (category === "necessary") return true;
  const consent = readConsent();
  if (!consent) return false;
  return Boolean(consent[category]);
}

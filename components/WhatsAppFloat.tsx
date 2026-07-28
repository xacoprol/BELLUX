"use client";

import { company } from "@/lib/company";
import { useLanguage } from "@/context/LanguageContext";

export default function WhatsAppFloat() {
  const { locale, t } = useLanguage();
  const isEs = locale === "es";
  const href = isEs ? company.whatsappEs : company.whatsappPt;
  const phone = isEs ? company.phoneEs : company.phone;

  return (
    <a
      className="wa-float"
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={`${t.contact.whatsappFloat} (${phone})`}
    >
      <svg
        className="wa-float-icon"
        viewBox="0 0 32 32"
        aria-hidden="true"
        focusable="false"
      >
        <path
          fill="currentColor"
          d="M19.11 17.4c-.28-.14-1.64-.81-1.9-.9-.25-.1-.44-.14-.62.14-.18.28-.71.9-.87 1.08-.16.18-.32.2-.6.07-.28-.14-1.17-.43-2.23-1.37-.82-.73-1.38-1.64-1.54-1.92-.16-.28-.02-.43.12-.57.12-.12.28-.32.42-.48.14-.16.18-.28.28-.46.09-.18.05-.35-.02-.49-.07-.14-.62-1.5-.85-2.05-.22-.53-.45-.46-.62-.47h-.53c-.18 0-.48.07-.73.35-.25.28-.96.94-.96 2.3s.98 2.67 1.12 2.85c.14.18 1.93 2.95 4.67 4.13.65.28 1.16.45 1.56.57.65.21 1.25.18 1.72.11.52-.08 1.64-.67 1.87-1.32.23-.65.23-1.2.16-1.32-.07-.11-.25-.18-.53-.32z"
        />
        <path
          fill="currentColor"
          d="M16.02 3C9.39 3 4 8.39 4 15.02c0 2.2.6 4.25 1.65 6.02L4 29l8.14-1.62A11.96 11.96 0 0 0 16.02 27C22.65 27 28 21.61 28 14.98 28 8.39 22.65 3 16.02 3zm0 21.82c-1.95 0-3.76-.57-5.29-1.56l-.38-.24-4.83.96 1-4.7-.25-.4a9.77 9.77 0 0 1-1.5-5.26c0-5.42 4.41-9.83 9.85-9.83s9.83 4.41 9.83 9.83-4.39 9.8-9.83 9.8z"
        />
      </svg>
    </a>
  );
}

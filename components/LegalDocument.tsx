"use client";

import Link from "next/link";
import { useLanguage } from "@/context/LanguageContext";
import { localePath } from "@/lib/i18n/routing";
import type { LegalDoc, LegalDocId } from "@/lib/i18n/legal";
import { getLegalDoc } from "@/lib/i18n/legal";
import Logo from "./Logo";
import { localeLabels, locales } from "@/lib/i18n/content";
import type { Locale } from "@/lib/i18n/types";

const DOC_IDS: LegalDocId[] = ["aviso-legal", "privacidade", "cookies"];

export default function LegalDocument({ docId }: { docId: LegalDocId }) {
  const { locale, setLocale, t } = useLanguage();
  const doc: LegalDoc = getLegalDoc(locale, docId);

  return (
    <div className="legal-page">
      <header className="legal-page-nav">
        <Logo href={localePath(locale, "/")} className="logo--nav" priority />
        <div className="lang">
          {locales.map((lang, i) => (
            <span key={lang} style={{ display: "contents" }}>
              {i > 0 && <span className="lang-sep">/</span>}
              <button
                type="button"
                className={locale === lang ? "active" : undefined}
                onClick={() => setLocale(lang as Locale)}
              >
                {localeLabels[lang]}
              </button>
            </span>
          ))}
        </div>
      </header>

      <article className="legal-doc wrap">
        <p className="legal-brand">Bellux</p>
        <h1 className="legal-title">{doc.title}</h1>
        <p className="legal-updated">{doc.updatedLabel}</p>

        <nav className="legal-toc" aria-label={doc.title}>
          {DOC_IDS.map((id) => {
            const item = getLegalDoc(locale, id);
            return (
              <Link
                key={id}
                href={localePath(locale, item.path)}
                className={id === docId ? "active" : undefined}
              >
                {item.title}
              </Link>
            );
          })}
        </nav>

        {doc.sections.map((section) => (
          <section key={section.title} className="legal-section">
            <h2>{section.title}</h2>
            {section.paragraphs.map((p) => (
              <p key={p.slice(0, 48)}>{p}</p>
            ))}
            {section.list && section.list.length > 0 ? (
              <ul>
                {section.list.map((item) => (
                  <li key={item.slice(0, 48)}>{item}</li>
                ))}
              </ul>
            ) : null}
            {section.table ? (
              <div className="legal-table-wrap">
                <table className="legal-table">
                  <thead>
                    <tr>
                      {section.table.headers.map((header) => (
                        <th key={header} scope="col">
                          {header}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {section.table.rows.map((row) => (
                      <tr key={row[0]}>
                        {row.map((cell, i) => (
                          <td key={`${row[0]}-${i}`}>{cell}</td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
                {section.table.note ? (
                  <p className="legal-table-note">{section.table.note}</p>
                ) : null}
              </div>
            ) : null}
          </section>
        ))}

        <Link href={localePath(locale, "/")} className="legal-back">
          ← {t.projects.backHome}
        </Link>
      </article>
    </div>
  );
}

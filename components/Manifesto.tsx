"use client";

import { Fragment, useId, useState, type ReactNode } from "react";
import { useLanguage } from "@/context/LanguageContext";

/** Renders inline **bold** markers from locale strings. */
function richText(text: string): ReactNode {
  const parts = text.split(/(\*\*[^*]+\*\*)/g);
  return parts.map((part, i) => {
    if (part.startsWith("**") && part.endsWith("**")) {
      return <strong key={i}>{part.slice(2, -2)}</strong>;
    }
    return <Fragment key={i}>{part}</Fragment>;
  });
}

export default function Manifesto() {
  const { t } = useLanguage();
  const m = t.manifesto;
  const [open, setOpen] = useState(false);
  const storyId = useId();

  return (
    <section className="manifesto" id="sobre" aria-labelledby="manifesto-title">
      <div className="wrap manifesto-inner" data-r>
        <h2 id="manifesto-title" className="manifesto-title">
          {m.before}{" "}
          <span className="manifesto-accent manifesto-accent--cyan">
            {m.accent1}
          </span>
          <br className="manifesto-break" />
          <span className="manifesto-accent manifesto-accent--magenta">
            {m.accent2}
          </span>{" "}
          {m.mid}{" "}
          <span className="manifesto-accent manifesto-accent--yellow">
            {m.accent3}
          </span>
        </h2>

        <p className="manifesto-sub">{m.sub}</p>

        <button
          type="button"
          className={`hero-pill hero-pill--outline manifesto-toggle${
            open ? " is-open" : ""
          }`}
          aria-expanded={open}
          aria-controls={storyId}
          onClick={() => setOpen((v) => !v)}
        >
          {open ? m.readLess : m.readMore}
          <span className="hero-dot" aria-hidden="true" />
        </button>

        <div
          id={storyId}
          className={`manifesto-story${open ? " is-open" : ""}`}
          aria-hidden={!open}
        >
          <div className="manifesto-story-inner">
            {m.story.map((paragraph) => (
              <p key={paragraph.slice(0, 48)}>{richText(paragraph)}</p>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

"use client";

import { useEffect, useId, useRef, useState } from "react";

const SOUND_EVENT = "bellux:project-sound";

type ProjectCardMediaProps = {
  title: string;
  image?: string;
  images?: string[];
  video?: string;
  playLabel: string;
  muteLabel: string;
  prevLabel: string;
  nextLabel: string;
};

export default function ProjectCardMedia({
  title,
  image,
  images = [],
  video,
  playLabel,
  muteLabel,
  prevLabel,
  nextLabel,
}: ProjectCardMediaProps) {
  const instanceId = useId();
  const videoRef = useRef<HTMLVideoElement>(null);
  const [unmuted, setUnmuted] = useState(false);
  const [slide, setSlide] = useState(0);
  const [paused, setPaused] = useState(false);

  const gallery = images.length > 0 ? images : image ? [image] : [];
  const useGallery = gallery.length > 1;
  const useVideo = Boolean(video) && !useGallery;

  useEffect(() => {
    const el = videoRef.current;
    if (!el || !useVideo) return;
    el.muted = true;
    void el.play().catch(() => {});
  }, [useVideo, video]);

  useEffect(() => {
    if (!useVideo) return;

    const onSound = (event: Event) => {
      const detail = (event as CustomEvent<string>).detail;
      if (detail === instanceId) return;
      const el = videoRef.current;
      if (!el) return;
      el.muted = true;
      setUnmuted(false);
    };

    window.addEventListener(SOUND_EVENT, onSound);
    return () => window.removeEventListener(SOUND_EVENT, onSound);
  }, [useVideo, instanceId]);

  useEffect(() => {
    if (!useGallery || paused || gallery.length < 2) return;
    const id = window.setInterval(() => {
      setSlide((s) => (s + 1) % gallery.length);
    }, 4000);
    return () => window.clearInterval(id);
  }, [useGallery, paused, gallery.length]);

  useEffect(() => {
    setSlide(0);
  }, [title]);

  if (!useVideo && gallery.length === 0) {
    return <div className="proj-card-media" role="img" aria-label={title} />;
  }

  if (useGallery) {
    const go = (dir: -1 | 1) => {
      setSlide((s) => (s + dir + gallery.length) % gallery.length);
    };

    return (
      <div
        className="proj-card-media-wrap proj-card-media-wrap--gallery"
        onMouseEnter={() => setPaused(true)}
        onMouseLeave={() => setPaused(false)}
      >
        {gallery.map((src, i) => (
          <div
            key={src}
            className={`proj-card-media proj-card-slide${
              i === slide ? " is-active" : ""
            }`}
            style={{ backgroundImage: `url(${src})` }}
            role="img"
            aria-label={`${title} — ${i + 1}/${gallery.length}`}
            aria-hidden={i !== slide}
          />
        ))}

        <button
          type="button"
          className="proj-slide-btn proj-slide-btn--prev"
          aria-label={prevLabel}
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            go(-1);
          }}
        >
          ←
        </button>
        <button
          type="button"
          className="proj-slide-btn proj-slide-btn--next"
          aria-label={nextLabel}
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            go(1);
          }}
        >
          →
        </button>

        {gallery.length <= 12 ? (
          <div className="proj-slide-dots" aria-hidden="true">
            {gallery.map((src, i) => (
              <span
                key={`dot-${src}`}
                className={`proj-slide-dot${i === slide ? " is-active" : ""}`}
              />
            ))}
          </div>
        ) : null}
      </div>
    );
  }

  if (!useVideo) {
    return (
      <div
        className="proj-card-media"
        style={{ backgroundImage: `url(${gallery[0]})` }}
        role="img"
        aria-label={title}
      />
    );
  }

  const enableSound = () => {
    const el = videoRef.current;
    if (!el) return;
    window.dispatchEvent(
      new CustomEvent(SOUND_EVENT, { detail: instanceId })
    );
    el.muted = false;
    void el.play().catch(() => {});
    setUnmuted(true);
  };

  const muteAgain = () => {
    const el = videoRef.current;
    if (!el) return;
    el.muted = true;
    setUnmuted(false);
  };

  return (
    <div
      className={`proj-card-media-wrap proj-card-media-wrap--video${
        unmuted ? " is-unmuted" : ""
      }`}
    >
      <video
        ref={videoRef}
        className="proj-card-media proj-card-media--video"
        src={video}
        poster={gallery[0] || image || undefined}
        muted
        loop
        playsInline
        autoPlay
        preload="metadata"
        aria-label={title}
      />

      <button
        type="button"
        className="proj-sound"
        aria-pressed={unmuted}
        aria-label={unmuted ? muteLabel : playLabel}
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          if (unmuted) muteAgain();
          else enableSound();
        }}
      >
        <span className="proj-sound-chip" aria-hidden="true">
          {unmuted ? (
            <svg viewBox="0 0 24 24" className="proj-sound-icon" fill="none">
              <path d="M4 9v6h3l5 4V5L7 9H4z" fill="currentColor" />
              <path
                d="M16.2 12c0-1.5-.8-2.8-2-3.5v7c1.2-.7 2-2 2-3.5z"
                fill="currentColor"
              />
              <path
                d="M14.2 4.1v2a6 6 0 0 1 0 11.8v2a8 8 0 0 0 0-15.8z"
                fill="currentColor"
              />
            </svg>
          ) : (
            <svg viewBox="0 0 24 24" className="proj-sound-icon" fill="none">
              <path d="M4 9v6h3l5 4V5L7 9H4z" fill="currentColor" />
              <path
                d="M16.2 9.2l1.4-1.4 1.4 1.4 1.4-1.4 1.4 1.4-1.4 1.4 1.4 1.4-1.4 1.4-1.4-1.4-1.4 1.4-1.4-1.4 1.4-1.4-1.4-1.4z"
                fill="currentColor"
              />
            </svg>
          )}
          <span className="proj-sound-label">
            {unmuted ? muteLabel : playLabel}
          </span>
        </span>
      </button>
    </div>
  );
}

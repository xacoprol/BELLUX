"use client";

import { useEffect, useRef, useState } from "react";

type ProjectCardMediaProps = {
  title: string;
  image?: string;
  video?: string;
  playLabel: string;
  muteLabel: string;
};

export default function ProjectCardMedia({
  title,
  image,
  video,
  playLabel,
  muteLabel,
}: ProjectCardMediaProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [unmuted, setUnmuted] = useState(false);

  useEffect(() => {
    const el = videoRef.current;
    if (!el || !video) return;
    el.muted = true;
    void el.play().catch(() => {});
  }, [video]);

  if (!video && !image) {
    return <div className="proj-card-media" role="img" aria-label={title} />;
  }

  if (!video) {
    return (
      <div
        className="proj-card-media"
        style={{ backgroundImage: `url(${image})` }}
        role="img"
        aria-label={title}
      />
    );
  }

  const enableSound = () => {
    const el = videoRef.current;
    if (!el) return;
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
    <div className={`proj-card-media-wrap${unmuted ? " is-unmuted" : ""}`}>
      <video
        ref={videoRef}
        className="proj-card-media proj-card-media--video"
        src={video}
        poster={image || undefined}
        muted
        loop
        playsInline
        autoPlay
        preload="metadata"
        aria-label={title}
      />

      <button
        type="button"
        className="proj-play"
        aria-label={unmuted ? muteLabel : playLabel}
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          if (unmuted) muteAgain();
          else enableSound();
        }}
      >
        <span className="proj-play-ring" aria-hidden="true">
          {unmuted ? (
            <svg viewBox="0 0 24 24" className="proj-play-icon" fill="none">
              <path
                d="M4 9v6h3l4 4V5L7 9H4z"
                fill="currentColor"
              />
              <path
                d="M16.5 12c0-1.8-1-3.3-2.5-4v8c1.5-.7 2.5-2.2 2.5-4z"
                fill="currentColor"
              />
              <path
                d="M14 3.2v2.1a6.5 6.5 0 0 1 0 11.4v2.1a8.5 8.5 0 0 0 0-15.6z"
                fill="currentColor"
              />
            </svg>
          ) : (
            <svg viewBox="0 0 24 24" className="proj-play-icon" fill="none">
              <path d="M9 7.5v9l8-4.5-8-4.5z" fill="currentColor" />
            </svg>
          )}
        </span>
      </button>
    </div>
  );
}

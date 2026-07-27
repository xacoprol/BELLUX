"use client";

import { useLanguage } from "@/context/LanguageContext";
import {
  placeholderPosts,
  type InstagramPost,
} from "@/lib/instagram";

const PROFILE =
  process.env.NEXT_PUBLIC_INSTAGRAM_URL ??
  "https://www.instagram.com/belluxentertainment";

export default function Instagram({
  posts = placeholderPosts,
}: {
  posts?: InstagramPost[];
}) {
  const { t } = useLanguage();
  const ig = t.instagram;
  const followItems = Array.from({ length: 12 }, () => ig.follow);

  return (
    <section className="instagram" id="instagram" aria-labelledby="ig-title">
      <div className="wrap ig-head">
        <div className="ig-head-copy">
          <p className="ig-follow" aria-hidden="true">
            <span className="ig-follow-track">
              {[0, 1].map((loop) => (
                <span className="ig-follow-group" key={loop}>
                  {followItems.map((label, i) => (
                    <span className="ig-follow-item" key={`${loop}-${i}`}>
                      {label}
                    </span>
                  ))}
                </span>
              ))}
            </span>
          </p>

          <h2 id="ig-title" className="ig-title">
            {ig.before}{" "}
            <span className="ig-accent">{ig.accent}</span> {ig.after}
          </h2>

          <p className="ig-sub">{ig.sub}</p>
        </div>

        <a
          href={PROFILE}
          target="_blank"
          rel="noopener noreferrer"
          className="ig-profile"
        >
          {ig.cta}
        </a>
      </div>

      <div className="ig-rail-wrap">
        <div className="ig-rail" role="list">
          {/* Two identical groups → seamless -50% loop */}
          {[0, 1].map((loop) => (
            <div className="ig-rail-group" key={loop} aria-hidden={loop > 0}>
              {posts.map((post) => (
                <a
                  key={`${loop}-${post.id}`}
                  href={post.permalink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="ig-card"
                  role={loop === 0 ? "listitem" : undefined}
                >
                  <div className="ig-card-media">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={post.image}
                      alt=""
                      loading="lazy"
                      draggable={false}
                    />
                  </div>
                </a>
              ))}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
